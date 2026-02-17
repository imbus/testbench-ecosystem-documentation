---
sidebar_position: 1
title: Introduction
---

TestBench CLI Reporter is a Python CLI that automates common TestBench workflows:

- Export execution packages (XML/JSON) for automated test runs
- Import execution results back into TestBench
- Export CSV reports (availability depends on TestBench version)
- Administrator helpers like server log export and JWT creation

It supports both interactive **manual mode** and config-driven **automatic mode**, and it is designed to work with **TestBench 3.x** and the upcoming **TestBench 4.x** API.

## Quick start

Interactive (manual) mode:

```bash
testbench-cli-reporter
```

Headless (command) mode example:

```bash
testbench-cli-reporter export-xml \
  --server localhost:9445 \
  --login tt-admin --password admin \
  --tov-key 123456 --cycle-key 234567 \
  --uid itb-TT-8161 \
  --output report.zip
```

## Server URL format

Every command that talks to TestBench accepts `--server` as either:

- `hostname` (defaults to port `9445`)
- `hostname:port`
- full URL like `https://hostname:port/api/`

The CLI always normalizes the server value to `https://.../api/`.

## TLS certificate verification

- By default, command mode does **not** verify TLS certificates.
- Add `--verify` to enable certificate verification.
- In config files, `verify` defaults to `true` when omitted.
