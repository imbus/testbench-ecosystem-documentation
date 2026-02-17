---
sidebar_position: 99
title: Troubleshooting
---

## Invalid server name

The CLI accepts only:

- `hostname`
- `hostname:port`
- `https://hostname:port/api/`

If you pass `hostname` without a port, it defaults to `9445`.

## TLS / certificate errors

- In command mode, TLS verification is off by default.
- Use `--verify` to enable verification.
- In config files, set `"verify": false` to accept self-signed certificates.

## Session terminated

If TestBench terminates your session, manual mode will prompt you to:

- relogin
- change user
- change server

## Debugging

A file log is written to `testbench-cli-reporter.log` by default (configurable via `loggingConfiguration.file.fileName`).

If you are diagnosing HTTP errors, check that log first; the CLI logs server JSON payloads when available.
