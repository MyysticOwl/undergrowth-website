# Configuration Reference

The Undergrowth engine is highly configurable through YAML files, environment variables, and command-line arguments.

---

## 🛠 Engine Configuration

The main configuration file is located at `data/app_config.yaml` by default.

```yaml
# Web Server Settings
webserver:
  enabled: true
  address: "localhost"
  port: 8096

# Authentication (OIDC/Keycloak)
oidc:
  enabled: false
  issuer_url: "http://localhost:8081/realms/undergrowth"
  client_id: "undergrowth-app"
  audience: null
  jwks_url: null

# Authentication (Local)
local_auth:
  enabled: true
  token_expiration_seconds: 86400

# Workflows (defined inline or loaded from files)
workflows: []
```

### Configuration Sections

#### 🌐 Web Server
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | bool | `true` | Enable/disable the Web UI and API. |
| `address` | string | `"localhost"` | Bind address for the server. |
| `port` | u16 | `8096` | Port for the server to listen on. |

#### 🔐 Authentication (OIDC)
| Field | Type | Description |
|-------|------|-------------|
| `enabled` | bool | Enable OIDC authentication. |
| `issuer_url` | string | Base URL of your OIDC provider (e.g., Keycloak realm). |
| `client_id` | string | Your OAuth2 client ID. |
| `audience` | string | (Optional) Expected `aud` claim in JWT. |
| `jwks_url` | string | (Optional) Custom JWKS endpoint URL. |

#### 🔑 Authentication (Local)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | bool | `true` | Enable local username/password authentication. |
| `token_expiration_seconds` | u64 | `86400` | JWT token lifetime (24 hours). |

> [!NOTE]
> On first boot with local auth enabled, the engine generates an initial admin password and displays it in the console. Store this securely!

---

## 🌍 Environment Variables

The engine supports environment variable overrides using the `UNDERGROWTH_` prefix.

| Variable | Config Path | Example |
|----------|-------------|---------|
| `UNDERGROWTH_SERVER_PORT` | `webserver.port` | `8080` |
| `UNDERGROWTH_SERVER_ADDRESS`| `webserver.address`| `127.0.0.1` |
| `UNDERGROWTH_LOG_LEVEL` | (Internal) | `debug` |
| `UNDERGROWTH_PLUGINS_DIR` | (Command Line) | `/opt/plugins` |

---

## 🏗 Workflow Configuration

Workflows are defined in YAML or JSON. Each workflow consists of **Components** and **Connectors**.

### Example Workflow (`timer_logger.yaml`)

```yaml
name: "Hello World"
id: "hello_world"
description: "Prints a message every 5 seconds"
auto_start: true

components:
  - name: "Tick"
    id: "time:time_interval:0"
    config:
      interval: 5
      units: "seconds"

  - name: "Save"
    id: "file:write_file:0"
    config:
      path: "logs"
      file_name: "ticks.log"

connectors:
  - from: { component_id: "time:time_interval:0", port: "out" }
    to: [{ component_id: "file:write_file:0", port: "in" }]
```

### Workflow Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Human-readable workflow name. |
| `id` | string | Yes | Unique identifier for the workflow. |
| `description` | string | No | Description of what the workflow does. |
| `auto_start` | bool | No | Start workflow automatically on engine boot. |
| `components` | array | Yes | List of component definitions. |
| `connectors` | array | Yes | List of connections between components. |

### Component ID Format
The `id` field must follow the format: `{package}:{tool}:{instance}`.
- **package**: The name of the plugin library (e.g., `time`, `ai`).
- **tool**: The specific behavior (e.g., `time_interval`, `ai_chat`).
- **instance**: A numeric identifier (e.g., `0`, `1`) unique within the workflow.

---

## 💻 Command Line Arguments

```bash
undergrowth [OPTIONS]

OPTIONS:
  -c, --config <FILE>      Config file path [default: data/app_config.yaml]
  -p, --plugin-path <PATH> Plugin DLL directory [default: target/debug/]
  --json                   Output in JSON format
  --quiet                  Suppress non-essential info logs
  --no-auth                Disable all authentication (emergency use)
  --help                   Display help
```

---

## 📁 Directory Structure

Undergrowth uses a sandboxed data directory for all persistent storage:

```
data/
├── app_config.yaml     # Main configuration file
├── log4rs.yml          # Logging configuration
├── workflows/          # Persisted workflow definitions
├── jobs/               # Job state and history
├── blueprints/         # Reusable workflow templates
├── downloads/          # Installer downloads (e.g., Ollama)
└── auth/               # Local authentication data
```

---

## 📝 Logging Configuration

Logging is configured via `data/log4rs.yml`:

```yaml
refresh_rate: 30 seconds
appenders:
  stdout:
    kind: console
    encoder:
      pattern: "\{d(%Y-%m-%d %H:%M:%S)\} \{h(\{l\})\} \{t\} - \{m\}\{n\}"
  file:
    kind: rolling_file
    path: "data/logs/undergrowth.log"
    encoder:
      pattern: "\{d(%Y-%m-%d %H:%M:%S)\} \{l\} \{t\} - \{m\}\{n\}"
    policy:
      kind: compound
      trigger:
        kind: size
        limit: 10 mb
      roller:
        kind: fixed_window
        base: 1
        count: 5
        pattern: "data/logs/undergrowth.{}.log"
root:
  level: warn
  appenders:
    - stdout
    - file
```

### Log Levels

| Level | Description |
|-------|-------------|
| `error` | Only errors |
| `warn` | Warnings and errors (recommended for production) |
| `info` | Informational messages |
| `debug` | Debug information |
| `trace` | Very detailed tracing |

---

## 📂 Minimal Deployment Footprint

Undergrowth is designed to be lean. You can significantly reduce the memory and storage footprint by removing unused plugins.

1. **Identify used plugins**: Note the package names in your workflow IDs.
2. **Remove others**: Delete unused `.dll` (Windows) or `.so` (Linux) files from the plugins directory.
3. **Run**: The engine will only load and initialize the remaining libraries.

A minimal setup with `time`, `logic`, and `file` typically starts in under **50ms** and uses less than **20MB** of RAM.

---

*For detailed tool configurations, see [Plugin Reference](./plugins/reference).*
