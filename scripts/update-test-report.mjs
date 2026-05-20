// Reads coverage/unit/coverage-summary.json → updates Section 3 of docs/test-report.md
// Adds Stmts% / Branch% / Funcs% / Lines% columns; flags rows below THRESHOLD with ⚠️

import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const COVERAGE_JSON = resolve(ROOT, 'coverage/unit/coverage-summary.json');
const REPORT_MD = resolve(ROOT, 'docs/test-report.md');
const THRESHOLD = 90;

function formatPct(value) {
  return value < THRESHOLD ? `**${value}%** ⚠️` : `${value}%`;
}

// json-summary format: { statements: { pct }, branches: { pct }, functions: { pct }, lines: { pct } }
function loadCoverage() {
  const raw = JSON.parse(readFileSync(COVERAGE_JSON, 'utf8'));
  const map = new Map();
  for (const [absPath, data] of Object.entries(raw)) {
    if (absPath === 'total') continue;
    const rel = relative(ROOT, absPath).replaceAll('\\', '/');
    map.set(rel, {
      stmts: data.statements.pct,
      branch: data.branches.pct,
      funcs: data.functions.pct,
      lines: data.lines.pct,
    });
  }
  return map;
}

// Path cell looks like: `shared/hooks/useAuth.ts`
function findCoverage(pathCell, coverageMap) {
  const normalised = pathCell.trim().replaceAll('`', '');
  for (const [key, data] of coverageMap) {
    if (key.includes(normalised) || key.endsWith(normalised)) return data;
  }
  return null;
}

const TABLE_HEADER_RE = /^\|\s*Path\s*\|/;
const TABLE_DIVIDER_RE = /^\|[\s|:-]+\|$/;
const TABLE_ROW_RE = /^\|[^|]+\|/;

function buildNewHeader(line) {
  return line.replace(/\|\s*Ghi chú\s*\|/, '| Stmts% | Branch% | Funcs% | Lines% | Ghi chú |');
}

function buildNewDivider(line) {
  return line.replace(/\|\s*---\s*\|(\s*)$/, '| ---: | ---: | ---: | ---: | --- |$1');
}

function buildNewRow(line, coverageMap) {
  const cols = line
    .split('|')
    .map(c => c.trim())
    .filter((_, i, a) => i > 0 && i < a.length - 1);
  const pathCell = cols[0];
  const noteCell = cols.at(-1);
  const data = findCoverage(pathCell, coverageMap);

  if (!data) {
    console.warn(`  [warn] no coverage data for: ${pathCell}`);
    return `| ${pathCell} | — | — | — | — | ${noteCell} |`;
  }

  // Ghi chú: preserve original note, strip any stale flag suffix (← ⚠️ ...)
  const originalNote = noteCell.replace(/\s*←\s*⚠️.*$/, '').trim();

  return `| ${pathCell} | ${formatPct(data.stmts)} | ${formatPct(data.branch)} | ${formatPct(data.funcs)} | ${formatPct(data.lines)} | ${originalNote} |`;
}

// Table state — reset on every new table header
function makeTableState() {
  return { active: false, isCoverageTable: false, dividerDone: false };
}

function transformLine(line, state, coverageMap) {
  if (TABLE_HEADER_RE.test(line)) {
    Object.assign(state, makeTableState()); // reset per-table
    state.active = true;
    state.isCoverageTable = /Ghi chú/.test(line);
    if (!state.isCoverageTable) return line;
    if (line.includes('Stmts%')) return line; // header already updated
    return buildNewHeader(line);
  }

  if (!state.active) return line;

  if (TABLE_DIVIDER_RE.test(line)) {
    state.dividerDone = true;
    if (!state.isCoverageTable) return line;
    if (line.includes('---:')) return line; // divider already updated
    return buildNewDivider(line);
  }

  if (state.isCoverageTable && state.dividerDone && TABLE_ROW_RE.test(line)) {
    return buildNewRow(line, coverageMap);
  }

  return line;
}

function processMarkdown(md, coverageMap) {
  const lines = md.split('\n');
  const tableState = makeTableState();
  let inSection3 = false;

  return lines
    .map(line => {
      if (line.startsWith('## 3.')) {
        inSection3 = true;
        return line;
      }
      if (line.startsWith('## ') && inSection3) {
        inSection3 = false;
        Object.assign(tableState, makeTableState());
        return line;
      }
      if (!inSection3) return line;
      return transformLine(line, tableState, coverageMap);
    })
    .join('\n');
}

// ── main ──────────────────────────────────────────────────────────────────────
let coverageMap;
try {
  coverageMap = loadCoverage();
} catch {
  console.error(`[update-test-report] coverage JSON not found: ${COVERAGE_JSON}`);
  console.error('Run: npm run test:coverage first.');
  process.exit(1);
}

const md = readFileSync(REPORT_MD, 'utf8');
const updated = processMarkdown(md, coverageMap);
writeFileSync(REPORT_MD, updated, 'utf8');

console.log(`[update-test-report] docs/test-report.md updated (${coverageMap.size} files mapped).`);
