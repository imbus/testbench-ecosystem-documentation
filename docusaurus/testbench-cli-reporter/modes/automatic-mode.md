---
sidebar_position: 2
title: Automatic mode
---

Automatic mode runs one or more actions from a JSON config file.

```bash
testbench-cli-reporter --config path/to/config.json
```

## How it works

- Each config entry under `configuration[]` creates one connection.
- Each connection processes its queued `actions[]`.
- Jobs are executed concurrently per connection when you set `thread_limit`.

## Overriding credentials

You can override credentials provided in the config by passing CLI options:

- `--login` / `--password`
- `--session`

These override values in `configuration[]` at runtime.

## Failure handling

HTTP failures from TestBench propagate as `requests.HTTPError`.

- In normal CLI usage they are logged (including JSON payloads when available).
- In tests or programmatic usage, `raise_exceptions=True` is used to fail fast.
