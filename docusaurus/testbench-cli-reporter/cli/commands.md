---
sidebar_position: 2
title: Commands
---

This section documents the explicit, non-interactive subcommands.

All commands require a connection via `--server` and either `--session` or `--login/--password`.

## `export-xml`

Export an XML execution package (zip).

```bash
testbench-cli-reporter export-xml --server HOST[:PORT] --login USER --password PASS \
  --tov-key TOV --cycle-key CYCLE --uid itb-TT-1234 --output report.zip
```

Inputs:

- Provide either:
  - `--project/--version[/--cycle]` (names), or
  - `--tov-key` and/or `--cycle-key` (keys)
- `--project-key` exists for compatibility but is currently ignored for XML export.

Options:

- `--uid` report root UID (test theme root). If omitted, exports the full tree.
- `--filtering` base64-encoded JSON payload (see FilteringOptions).

## `import-xml`

Import an XML results zip back into TestBench.

```bash
testbench-cli-reporter import-xml --server HOST[:PORT] --login USER --password PASS \
  --input report.zip
```

Options:

- `--uid` defaults to `ROOT`
- `--filtering` base64-encoded JSON payload

## `export-json`

Export a JSON execution package (zip).

```bash
testbench-cli-reporter export-json --server HOST[:PORT] --login USER --password PASS \
  --project-key PROJECT --tov-key TOV --cycle-key CYCLE \
  --uid itb-TT-1234 --output json-report.zip
```

Inputs:

- Provide either `--project-key` or `--project/--version[/--cycle]`.

Options:

- `--uid` tree root UID
- `--filtering` base64-encoded JSON payload

## `import-json`

Import a JSON results zip back into TestBench.

```bash
testbench-cli-reporter import-json --server HOST[:PORT] --login USER --password PASS \
  --input json-report.zip
```

Options:

- `--uid` report root UID
- `--filtering` base64-encoded JSON payload

## `export-csv`

Export a CSV report zip.

```bash
testbench-cli-reporter export-csv --server HOST[:PORT] --login USER --password PASS \
  --project-key PROJECT --tov-key TOV --cycle-key CYCLE --cycle-key CYCLE2 \
  --uid itb-TT-1234 --output csv_report.zip
```

Notes:

- `--cycle-key` is repeatable; omit it to export without cycle scope.

## `export-logs`

Administrator helper: export TestBench server logs as a zip.

```bash
testbench-cli-reporter export-logs --server HOST[:PORT] --login USER --password PASS \
  --output server_logs.zip
```

## `gen-jwt`

Generate a JWT for the current session (intended for TestBench 4.x+).

```bash
testbench-cli-reporter gen-jwt --server HOST[:PORT] --login USER --password PASS \
  --permission ReadProjectHierarchy --permission ImportExecutionResults \
  --project-key PROJECT --tov-key TOV --cycle-key CYCLE \
  --subject my-service --expires 3600
```

- `--permission` is repeatable and also accepts comma or `|` separated lists.
