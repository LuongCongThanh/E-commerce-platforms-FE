<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:rtk-agent-rules -->

# RTK For This Repo

Use `.\.tools\rtk\rtk.exe` for shell commands when possible to reduce token-heavy output.

Examples:

```powershell
.\.tools\rtk\rtk.exe git status
.\.tools\rtk\rtk.exe npm run build
.\.tools\rtk\rtk.exe vitest
.\.tools\rtk\rtk.exe next build
```

Meta commands:

```powershell
.\.tools\rtk\rtk.exe gain
.\.tools\rtk\rtk.exe gain --history
.\.tools\rtk\rtk.exe proxy <cmd>
```

If a command needs raw output for debugging, use `proxy` or run the original command directly.

<!-- END:rtk-agent-rules -->
