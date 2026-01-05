# REST API Reference

The Undergrowth engine exposes a REST API for programmatic control.

**Base URL:** `http://localhost:8096/api`

---

## Authentication

When authentication is enabled in the engine configuration, all API requests (except for Public routes) MUST include a valid JWT access token in the `Authorization` header:

```bash
Authorization: Bearer <token>
```

### Authentication Modes

The engine supports three authentication modes:

| Mode | Description |
|------|-------------|
| **`local`** | Built-in username/password authentication |
| **`oidc`** | External OIDC provider (e.g., Keycloak) |
| **`none`** | No authentication required |

### Roles & Permissions

| Role | Description |
|------|-------------|
| **`admin`** | Full access to all endpoints including system configuration. |
| **`operator`** | Can manage workflows, jobs, alerts, and blueprints. |
| **`viewer`** | Read-only access to system state. |

---

## Quick Reference

### Public Endpoints (No Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/info` | GET | Get authentication mode and configuration |
| `/login` | POST | Login with username/password |
| `/version` | GET | Engine version info |
| `/version/plugins` | GET | Plugin version info |
| `/health` | GET | Health check (returns "OK") |

### Viewer Endpoints (Read-Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/config` | GET | Get engine configuration |
| `/workflows` | GET | List all workflows |
| `/workflows/summary` | GET | Workflow summary |
| `/workflows/\{id\}` | GET | Get workflow details |
| `/workflows/\{id\}/config` | GET | Get workflow configuration |
| `/jobs` | GET | List all jobs |
| `/jobs/summary` | GET | Job summary statistics |
| `/jobs/workflow/\{workflow_id\}` | GET | Jobs for specific workflow |
| `/jobs/\{id\}` | GET | Get job details |
| `/jobs/\{id\}/state` | GET | Get job state |
| `/plugins` | GET | List loaded plugins |
| `/plugins/available` | GET | List available plugins |
| `/variations` | GET | List all variations |
| `/variations/config-schema` | POST | Get config schema for variation |
| `/alerts` | GET | Get alerts |
| `/alerts/summary` | GET | Alert summary |
| `/alerts/count` | GET | Alert count |
| `/alerts/stream` | GET | SSE stream of alerts |
| `/alerts/\{id\}` | GET | Get specific alert |
| `/logs` | GET | Get logs |
| `/metrics` | GET | Get metrics |
| `/data` | GET | List data directory |
| `/data/content` | GET | Get file content |
| `/blueprints` | GET | List blueprints |
| `/blueprints/search` | GET | Search blueprints |
| `/blueprints/\{id\}` | GET | Get blueprint |
| `/blueprints/\{id\}/export` | GET | Export blueprint |

### Operator Endpoints (Create/Manage)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/workflows` | POST | Create workflow |
| `/workflows/generate-ai` | POST | Generate workflow via AI |
| `/workflows/import` | POST | Import workflow |
| `/workflows/\{id\}` | PUT | Update workflow |
| `/workflows/\{id\}` | DELETE | Delete workflow |
| `/workflows/\{id\}/name` | PUT | Rename workflow |
| `/workflows/\{id\}/auto-start` | PUT | Update auto-start setting |
| `/workflows/\{id\}/connectors` | POST | Add connector |
| `/workflows/\{id\}/connectors` | DELETE | Remove connector |
| `/workflows/\{id\}/components/\{cid\}/name` | PUT | Update component name |
| `/workflows/\{id\}/components/\{cid\}/config` | PUT | Update component config |
| `/jobs/start/\{workflow_id\}` | POST | Start a job |
| `/jobs/\{id\}` | DELETE | Delete job |
| `/jobs/\{id\}/stop` | PUT | Stop job |
| `/jobs/\{id\}/pause` | PUT | Pause job |
| `/jobs/\{id\}/resume` | PUT | Resume job |
| `/alerts/acknowledged` | DELETE | Delete acknowledged alerts |
| `/alerts/acknowledge/all` | PUT | Acknowledge all alerts |
| `/alerts/acknowledge/bulk` | POST | Bulk acknowledge alerts |
| `/alerts/\{id\}` | DELETE | Delete alert |
| `/alerts/\{id\}/acknowledge` | PUT | Acknowledge alert |
| `/data/mkdir` | POST | Create directory |
| `/data` | DELETE | Delete item |
| `/data/upload` | POST | Upload file |
| `/blueprints` | POST | Create blueprint |
| `/blueprints/import` | POST | Import blueprint |
| `/blueprints/\{id\}` | PUT | Update blueprint |
| `/blueprints/\{id\}` | DELETE | Delete blueprint |
| `/models` | GET | List AI models |
| `/models/pull` | POST | Pull AI model |
| `/models/default` | PUT | Set default model |

### Admin Endpoints (System Configuration)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/plugins` | POST | Add/load a plugin |
| `/audit` | GET | Get audit logs |
| `/settings` | GET | Get settings |
| `/settings/log-level` | PUT | Set log level |
| `/settings/factory-reset` | POST | Factory reset |
| `/settings/auth` | GET | Get auth status |
| `/settings/auth` | PUT | Enable/disable auth |
| `/api-keys` | GET | List API keys |
| `/api-keys` | POST | Create API key |
| `/api-keys/\{id\}` | DELETE | Delete API key |
| `/setup/status` | GET | Get external dependency status |
| `/setup/install` | POST | Trigger automated installation |

---

## Authentication & Login

### GET /api/auth/info

Get authentication mode and configuration.

**Response:**
```json
{
  "mode": "local",
  "oidc": null
}
```

Or for OIDC:
```json
{
  "mode": "oidc",
  "oidc": {
    "authority": "http://localhost:8081/realms/undergrowth",
    "client_id": "undergrowth-app",
    "redirect_uri": ""
  }
}
```

---

### POST /api/login

Authenticate with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "secret"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Version & System

### GET /api/version

Get engine version information.

**Response:**
```json
{
  "engine_version": "0.1.0",
  "foundation_version": "0.1.0",
  "api_version": "0.1.0"
}
```

---

### GET /api/health

Health check endpoint.

**Response:** `200 OK`
```
OK
```

---

### GET /api/plugins

List all loaded plugins.

**Response:**
```json
[
  {
    "name": "Time",
    "version": "0.1.0",
    "author": "Shawn Ellis",
    "description": "Time-based triggers",
    "variations": ["time_interval", "time_delay", "time_trigger"]
  }
]
```

---

### GET /api/variations

List all available variations.

**Response:**
```json
[
  {
    "package": "time",
    "variation": "time_interval",
    "icon": "⏱️",
    "color": "#9b59b6",
    "category": "Time/Schedule"
  }
]
```

---

### POST /api/variations/config-schema

Get JSON Schema for a variation's configuration.

**Request:**
```json
{
  "package": "time",
  "variation": "time_interval"
}
```

**Response:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "interval": { "type": "integer", "default": 5 },
    "units": { "type": "string", "enum": ["seconds", "minutes", "hours"] }
  },
  "ui_schema": {
    "field_order": ["interval", "units"],
    "widgets": {
      "interval": { "type": "number_spinner", "min": 1 },
      "units": { "type": "select" }
    }
  }
}
```

---

## Blueprints

### GET /api/blueprints

List all available blueprints.

### GET /api/blueprints/search?q=\{query\}

Search blueprints by name or description.

### GET /api/blueprints/\{id\}

Get a specific blueprint.

### GET /api/blueprints/\{id\}/export

Export a blueprint as YAML.

### POST /api/blueprints

Create a new blueprint.

### POST /api/blueprints/import

Import a blueprint from YAML.

### PUT /api/blueprints/\{id\}

Update a blueprint.

### DELETE /api/blueprints/\{id\}

Delete a blueprint.

---

## Workflows

### GET /api/workflows

List all saved workflows.

**Response:**
```json
[
  {
    "id": "workflow-001",
    "name": "Temperature Monitor",
    "description": "...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### GET /api/workflows/summary

Get workflow summary statistics.

---

### POST /api/workflows

Create a new workflow.

**Request:**
```json
{
  "name": "My Workflow",
  "description": "Description here",
  "components": [...],
  "connectors": [...]
}
```

**Response:** `201 Created`
```json
{
  "id": "workflow-xyz",
  "name": "My Workflow",
  ...
}
```

---

### POST /api/workflows/generate-ai

Generate a workflow using AI.

**Request:**
```json
{
  "description": "Monitor CPU usage and send email when it exceeds 80%",
  "name": "CPU Monitor"
}
```

---

### POST /api/workflows/import

Import a workflow from YAML.

---

### GET /api/workflows/\{id\}

Get a specific workflow.

---

### GET /api/workflows/\{id\}/config

Get workflow configuration as YAML.

---

### PUT /api/workflows/\{id\}

Update a workflow.

---

### DELETE /api/workflows/\{id\}

Delete a workflow.

---

### PUT /api/workflows/\{id\}/name

Rename a workflow.

**Request:**
```json
{
  "name": "New Workflow Name"
}
```

---

### PUT /api/workflows/\{id\}/auto-start

Update auto-start setting.

**Request:**
```json
{
  "auto_start": true
}
```

---

### POST /api/workflows/\{id\}/connectors

Add a connector between components.

---

### DELETE /api/workflows/\{id\}/connectors

Remove a connector.

---

### PUT /api/workflows/\{id\}/components/\{component_id\}/name

Update a component's display name.

---

### PUT /api/workflows/\{id\}/components/\{component_id\}/config

Update a component's configuration.

---

## Jobs

### GET /api/jobs

List all jobs.

**Query Parameters:**
- `status` — Filter by status (`running`, `stopped`, `error`)

**Response:**
```json
[
  {
    "id": "job-001",
    "workflow_id": "workflow-001",
    "status": "running",
    "started_at": "2024-01-01T10:00:00Z"
  }
]
```

---

### GET /api/jobs/summary

Get job summary statistics.

---

### GET /api/jobs/workflow/\{workflow_id\}

Get all jobs for a specific workflow.

---

### GET /api/jobs/\{id\}

Get job details including component states.

**Response:**
```json
{
  "id": "job-001",
  "workflow_id": "workflow-001",
  "status": "running",
  "components": [
    {
      "id": "time:time_interval:0",
      "status": "running",
      "last_output": { "type": "tick", "timestamp": 1704067200 }
    }
  ]
}
```

---

### GET /api/jobs/\{id\}/state

Get the current state of a job.

---

### POST /api/jobs/start/\{workflow_id\}

Start a new job from a workflow.

**Response:** `201 Created`
```json
{
  "id": "job-xyz",
  "workflow_id": "workflow-001",
  "status": "starting"
}
```

---

### PUT /api/jobs/\{id\}/stop

Stop a running job.

---

### PUT /api/jobs/\{id\}/pause

Pause a running job.

---

### PUT /api/jobs/\{id\}/resume

Resume a paused job.

---

### DELETE /api/jobs/\{id\}

Delete a job (must be stopped first).

---

## Alerts

### GET /api/alerts

Get all alerts.

**Query Parameters:**
- `severity` — Filter by severity (`info`, `warning`, `error`, `critical`)
- `acknowledged` — Filter by acknowledged status (`true`, `false`)
- `since` — Unix timestamp for alerts after this time

**Response:**
```json
[
  {
    "id": "alert-001",
    "severity": "warning",
    "message": "API response slow",
    "source": {
      "plugin_id": "http:http_request:0",
      "job_id": "job-001"
    },
    "timestamp": 1704067200,
    "acknowledged": false
  }
]
```

---

### GET /api/alerts/summary

Get alert summary statistics.

---

### GET /api/alerts/count

Get total alert count.

---

### GET /api/alerts/stream

Server-Sent Events stream of alerts.

---

### GET /api/alerts/\{id\}

Get a specific alert.

---

### PUT /api/alerts/\{id\}/acknowledge

Acknowledge an alert.

---

### PUT /api/alerts/acknowledge/all

Acknowledge all alerts.

---

### POST /api/alerts/acknowledge/bulk

Acknowledge multiple alerts.

**Request:**
```json
{
  "ids": ["alert-001", "alert-002"]
}
```

---

### DELETE /api/alerts/\{id\}

Delete an alert.

---

### DELETE /api/alerts/acknowledged

Delete all acknowledged alerts.

---

## AI Models

### GET /api/models

List all available AI models.

**Response:**
```json
{
  "default_model": "llama3.2:3b",
  "models": [
    {
      "id": "llama3.2:3b",
      "display_name": "Llama 3.2 3B",
      "protocol": "ollama"
    }
  ],
  "catalog": {}
}
```

---

### POST /api/models/pull

Pull/download a model.

**Request:**
```json
{
  "model_id": "phi3"
}
```

**Response:**
```json
{
  "status": "started",
  "message": "Pull started via Ollama"
}
```

---

### PUT /api/models/default

Set the default model.

**Request:**
```json
{
  "model_id": "llama3.2:3b"
}
```

---

## Data Drive

### GET /api/data?path=\{path\}

List contents of the sandboxed data directory.

### GET /api/data/content?path=\{path\}

Get file content from data directory.

### POST /api/data/mkdir

Create a directory.

**Request:**
```json
{
  "path": "logs/archive"
}
```

### POST /api/data/upload

Upload a file.

### DELETE /api/data?path=\{path\}

Delete a file or directory.

---

## System Setup

### GET /api/setup/status

Get the status of external dependencies (e.g., Ollama).

**Response:**
```json
{
  "status": "Missing",
  "details": "Ollama not found in PATH or default locations",
  "version": null
}
```

---

### POST /api/setup/install

Trigger an automated installation of an external dependency.

**Request:**
```json
{
  "target": "ollama",
  "local": false
}
```

**Response:** `202 Accepted`
```json
{
  "message": "Installation started"
}
```

---

## Settings & Administration

### GET /api/settings

Get current settings.

### PUT /api/settings/log-level

Set log level.

**Request:**
```json
{
  "level": "debug"
}
```

### POST /api/settings/factory-reset

Perform factory reset.

### GET /api/settings/auth

Get authentication status.

### PUT /api/settings/auth

Enable or disable authentication.

---

## API Keys

### GET /api/api-keys

List all API keys.

### POST /api/api-keys

Create a new API key.

### DELETE /api/api-keys/\{id\}

Delete an API key.

---

## Audit Logs

### GET /api/audit

Get audit logs.

---

## Error Responses

All errors follow this format:

```json
{
  "error": "not_found",
  "message": "Workflow not found",
  "details": { "id": "workflow-xyz" }
}
```

**Status Codes:**
- `400` — Bad request (invalid JSON, missing fields)
- `401` — Unauthorized (missing or invalid token)
- `403` — Forbidden (insufficient roles)
- `404` — Not found
- `409` — Conflict (e.g., job already running)
- `500` — Internal server error
- `503` — Service unavailable

---

## Examples

### Create and Start a Job

```bash
# Create workflow
curl -X POST http://localhost:8096/api/workflows \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @workflow.json

# Start job
curl -X POST http://localhost:8096/api/jobs/start/workflow-001 \
  -H "Authorization: Bearer $TOKEN"
```

### Monitor Job Status

```bash
curl http://localhost:8096/api/jobs/job-001 \
  -H "Authorization: Bearer $TOKEN"
```

### Stop Job

```bash
curl -X PUT http://localhost:8096/api/jobs/job-001/stop \
  -H "Authorization: Bearer $TOKEN"
```

---

*For Web UI documentation, see the in-app help.*
