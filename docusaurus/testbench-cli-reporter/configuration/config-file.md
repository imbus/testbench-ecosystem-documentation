---
sidebar_position: 1
title: Config file (automatic mode)
---

Automatic mode reads a JSON config. Top-level schema:

- `configuration`: list of server connections
- `loggingConfiguration` (optional): console/file logging setup

## Minimal example

```json
{
  "configuration": [
    {
      "server_url": "https://localhost:9445/api/",
      "verify": false,
      "loginname": "tt-admin",
      "password": "admin",
      "actions": []
    }
  ]
}
```

## Actions

Each entry under `actions[]` has:

- `type`: one of
  - `ExportXMLReport`
  - `ImportXMLExecutionResults`
  - `ExportJSONReport`
  - `ImportJSONExecutionResults`
  - `ExportCSVReport`
  - `ExportServerLogs`
  - `RequestJWT`
- `parameters`: action-specific payload

Example (single XML export action):

```json
{
  "configuration": [
    {
      "server_url": "https://localhost:9445/api/",
      "verify": false,
      "basicAuth": "dHQtYWRtaW46YWRtaW4=",
      "thread_limit": 2,
      "actions": [
        {
          "type": "ExportXMLReport",
          "parameters": {
            "outputPath": "report.zip",
            "tovKey": "123456",
            "cycleKey": "234567",
            "report_config": {
              "exportAttachments": true,
              "exportDesignData": true,
              "characterEncoding": "utf-16",
              "suppressFilteredData": true,
              "exportExpandedData": true,
              "exportDescriptionFields": true,
              "outputFormattedText": false,
              "exportExecutionProtocols": false,
              "filters": [],
              "reportRootUID": "itb-TT-8161"
            }
          }
        }
      ]
    }
  ]
}
```

## `thread_limit`

`thread_limit` limits the number of concurrent actions per connection.

- omitted / `null`: no limit
- `0` or negative values are treated as unlimited
