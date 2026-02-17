---
sidebar_position: 1
title: TestBench 3.x vs 4.x
---

The CLI is built to work with both current TestBench 3.x installations and the upcoming TestBench 4.x API.

## Version detection

On startup, the client reads the server version from:

- `GET /api/2/serverVersions` (preferred)
- fallback: `GET /api/1/serverVersions`

The detected version influences authentication and which endpoints are used.

## Authentication

- TestBench 4.x: session-based authentication
  - the CLI requests a session token and sends it via the `Authorization` header
  - you can also supply an existing token via `--session`
- TestBench 3.x: legacy authentication
  - the CLI uses HTTP basic auth to call legacy endpoints

## Feature availability

Some features depend on server capabilities:

- CSV export is intended for TestBench >= 3.0.6.2
- JSON export/import and JWT generation are intended for TestBench 4.x+

If a feature is not available in manual mode due to version gating, you can still use the explicit subcommands (for example `export-json`) when the server supports them.
