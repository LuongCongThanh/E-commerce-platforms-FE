# RTK - Rust Token Killer

Local binary for this repo: `.\.tools\rtk\rtk.exe`

## Rule

Prefer RTK-wrapped shell commands when output may be large.

Examples:

```powershell
.\.tools\rtk\rtk.exe git status
.\.tools\rtk\rtk.exe npm run build
.\.tools\rtk\rtk.exe vitest
.\.tools\rtk\rtk.exe next build
```

## Meta Commands

```powershell
.\.tools\rtk\rtk.exe gain
.\.tools\rtk\rtk.exe gain --history
.\.tools\rtk\rtk.exe proxy <cmd>
```

## Verification

```powershell
.\.tools\rtk\rtk.exe --version
.\.tools\rtk\rtk.exe gain
```
