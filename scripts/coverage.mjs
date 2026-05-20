// Wrapper: run vitest --coverage, then always update docs/test-report.md.
// Preserves vitest exit code so CI still fails on threshold violations.
import { spawnSync } from 'child_process';

const vitest = spawnSync('npx', ['vitest', 'run', '--coverage'], {
  stdio: 'inherit',
  shell: true,
});

spawnSync('node', ['scripts/update-test-report.mjs'], {
  stdio: 'inherit',
  shell: true,
});

process.exit(vitest.status ?? 1);
