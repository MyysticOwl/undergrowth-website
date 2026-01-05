# Plugin Library Reference 🧩

Complete reference for all built-in plugin variations. Undergrowth uses a modular plugin architecture where each functionality is encapsulated in a DLL/Shared Object.

> [!TIP]
> This reference is a curated guide. For a complete list of all variations and their detailed JSON schemas, run:
> ```bash
> ./undergrowth component schemas
> ```

---

## 📂 Categories & Hierarchy

Plugins are organized into functional categories defined in the `foundation` crate.

| Category | Description | Examples |
|:---------|:------------|:---------|
| **Input / Source** | Event sources & triggers. | `time:time_interval`, `http:http_server` |
| **AI / Machine Learning**| LLMs and Agentic logic. | `ai:ai_chat`, `ai:ai_agent` |
| **Logic / Decision** | Data flow control. | `logic:if_else`, `logic:switch` |
| **Communication** | External service integration.| `notify:send_email`, `notify:call_webhook` |
| **Storage / Data** | Persistence and databases. | `sqlite:sql_insert`, `file:write_file` |
| **System / OS** | Local system interaction. | `system:cpu_metrics`, `process:run_command` |
| **Monitoring** | Health & alerting. | `alert:threshold_alert`, `alert:heartbeat_watchdog` |

---

## 🤖 AI Plugins
*AI-native capabilities powered by Ollama, Remote Providers, or Local GGUF models.*

### `ai:ai_chat`
**Icon:** 💬 | **Category:** `AI/LLM`
General-purpose AI assistant for text completion and chat. Supports Ollama, OpenAI, and Anthropic backends.

### `ai:ai_agent`
**Icon:** 🧠 | **Category:** `AI/LLM`
Autonomous AI agent with ReAct tool-use loop. Can call tools and reason step-by-step to solve complex tasks.

### `ai:generate_workflow`
**Icon:** ✨ | **Category:** `AI/LLM`
Generates executable Undergrowth workflows from natural language descriptions.

---

## ⏰ Time & Scheduling
*Precision triggers, delays, and calendar-aware scheduling.*

### `time:time_interval`
**Icon:** ⏱️ | **Category:** `Time/Schedule`
Emits "tick" events at regular intervals (seconds, minutes, hours).

### `time:time_delay`
**Icon:** ⏳ | **Category:** `Time/Delay`
Pauses workflow execution for a specified duration.

### `time:time_trigger`
**Icon:** 🕐 | **Category:** `Time/Schedule`
Triggers at a specific time of day (24h format).

### `scheduler:cron_schedule`
**Icon:** 📅 | **Category:** `Time/Schedule`
Triggers execution based on a standard cron expression (e.g., `0 */5 * * * *`).

### `scheduler:calendar_schedule`
**Icon:** 🗓️ | **Category:** `Time/Schedule`
Triggers on specific dates and times defined in a calendar list.

### `scheduler:solar_event`
**Icon:** 🌅 | **Category:** `Time/Schedule`
Triggers based on solar events (sunrise, sunset) for a given latitude/longitude.

---

## ⚡ Logic & Flow Control
*Conditional branching and decision-making.*

### `logic:if_else`
**Icon:** ❓ | **Category:** `Logic`
Standard If/Then/Else branch. Routes data based on a boolean condition.

### `logic:switch`
**Icon:** 🔀 | **Category:** `Logic`
Content-based router. Routes messages to different outputs based on field value matching (exact or regex). Ideal for AI tool dispatching.

### `logic:compare_values`
**Icon:** ⚖️ | **Category:** `Logic`
Compares two fields using standard operators (==, !=, \<, >, etc.).

---

## 🌐 Communication & Notify
*Integrate with external services and alert operators.*

### `http:http_request`
**Icon:** 🔗 | **Category:** `Communication/HTTP`
Sends outbound HTTP/HTTPS requests (GET, POST, etc.) to external APIs.

### `http:http_server`
**Icon:** 🌐 | **Category:** `Communication/HTTP`
Starts an HTTP server to receive incoming webhooks and API requests.

### `notify:send_email`
**Icon:** 📧 | **Category:** `Communication/Notification`
Sends email alerts via SMTP.

### `notify:call_webhook`
**Icon:** 🪝 | **Category:** `Communication/Notification`
Triggers external systems via HTTP webhooks. Supports custom headers and payloads.

---

## 🗄️ Storage & Data
*Persistence, transformation, and file management.*

### `sqlite:sql_query`
**Icon:** 🔍 | **Category:** `Data/Storage/Database`
Executes a SELECT query and returns the results as a JSON array.

### `sqlite:sql_insert`
**Icon:** ➕ | **Category:** `Data/Storage/Database`
Inserts a new row into the specified table using fields from the input JSON.

### `sqlite:sql_upsert`
**Icon:** 🔄 | **Category:** `Data/Storage/Database`
Inserts or updates a row based on whether it already exists (idempotent write).

### `sqlite:sql_delete`
**Icon:** 🗑️ | **Category:** `Data/Storage/Database`
Deletes rows from a table that match specified conditions.

### `file:write_file`
**Icon:** 📄 | **Category:** `Data/Storage/File`
Writes data to a file in the sandboxed data directory.

### `file:read_file`
**Icon:** 📖 | **Category:** `Data/Storage/File`
Reads content from a file in the sandboxed data directory.

### `transform:parse_csv`
**Icon:** 📄 | **Category:** `Data/Transform`
Parses CSV string data into JSON objects.

### `transform:stringify_csv`
**Icon:** 📝 | **Category:** `Data/Transform`
Converts JSON objects to CSV string format.

### `json:generate_json`
**Icon:** 💬 | **Category:** `Data/JSON/Transform`
Generates JSON output from a template or static value.

### `json:extract_json`
**Icon:** 🔍 | **Category:** `Data/JSON/Transform`
Extracts values from JSON using JSONPath expressions.

---

## 📊 Monitoring & Alerts
*Health checks and condition monitoring.*

### `alert:threshold_alert`
**Icon:** 📊 | **Category:** `Monitoring/Alerting`
Monitors numeric fields against thresholds. Supports hysteresis and cooldown.

### `alert:heartbeat_watchdog`
**Icon:** 💓 | **Category:** `Monitoring/Health`
Watchdog that alerts if signals (heartbeats) are missed.

### `alert:http_health_check`
**Icon:** 🏥 | **Category:** `Monitoring/Health`
Polls external HTTP endpoints and alerts on failure or unexpected responses.

---

## 🛠 System & Security
*Low-level system control and cryptography.*

### `process:run_command`
**Icon:** ⚙️ | **Category:** `Utility/Debug`
Executes external shell commands. Requires an explicit security allowlist in `app_config.yaml`.

### `system:cpu_metrics`
**Icon:** 🖥️ | **Category:** `Utility/Debug`
Monitors host CPU utilization.

### `system:memory_usage`
**Icon:** 📈 | **Category:** `Utility/Debug`
Monitors host memory utilization.

### `crypto:generate_hash`
**Icon:** #️⃣ | **Category:** `Utility/Debug`
Generates cryptographic hashes (MD5, SHA256).

### `crypto:hmac_sign`
**Icon:** 🔏 | **Category:** `Utility/Debug`
Creates HMAC signatures for message authentication.

---

## 🔧 Plugin Component ID Format

All component IDs follow the format: `\{package\}:\{variation\}:\{instance\}`

- **package**: The plugin name (e.g., `time`, `ai`, `sqlite`)
- **variation**: The specific functionality (e.g., `time_interval`, `ai_chat`, `sql_query`)
- **instance**: A numeric identifier unique within the workflow (e.g., `0`, `1`)

**Example:** `time:time_interval:0` - First instance of the time interval variation

---

> [!IMPORTANT]
> Always verify the exact configuration fields for each variation using the **Workflow Editor** in the Web UI or by running:
> ```bash
> ./undergrowth component schemas
> ```
