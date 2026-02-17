---
sidebar_position: 1
title: Manual mode
---

Manual mode is the interactive UI (prompts, menus, pickers). It starts when you run the CLI without a subcommand:

```bash
testbench-cli-reporter
```

## What you can do

The main menu is assembled dynamically based on the detected TestBench server version and your role.

Common actions:

- Export XML report (execution package)
- Import XML execution results
- Write history to config file (creates an automatic-mode JSON config)
- Change connection

Version-dependent actions:

- Export CSV report (available on TestBench >= 3.0.6.2)
- Export JSON report / Import JSON execution results (intended for TestBench 4.x)

Administrator actions:

- Export server logs
- Export project users (project members CSV)
- Request JWT token (intended for TestBench 4.x)

## Notes

- Manual mode always performs live browsing (projects, versions, cycles, trees) via the server APIs.
- If the server terminates a session, the CLI will prompt for relogin / user change / server change.
