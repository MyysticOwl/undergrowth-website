# Plugin Library Reference 🧩

Complete reference for all built-in plugin tools. Undergrowth uses a modular plugin architecture where each functionality is encapsulated in a DLL/Shared Object.

> [!TIP]
> This reference is a curated guide. For a complete list of all tools and their detailed JSON schemas, run:
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
| **Integrations**   | MCP Tools & Legacy APIs. | `mcp:call_tool` (Coming Soon), `google_sheets:read_sheet` |

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

### `logic:iterate_list`
**Icon:** 🔁 | **Category:** `Logic/Flow`
Iterates over a list of items from the input JSON and emits them one by one.

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

### `slack:post_message`
**Icon:** 💬 | **Category:** `Communication/Chat`
Sends a message to a Slack channel via Incoming Webhook. Supports text and Block Kit.

### `slack:upload_file`
**Icon:** 📎 | **Category:** `Communication/Chat`
Uploads a file to a Slack channel using the Slack API. Requires a Bot OAuth Token.

### `discord:post_message`
**Icon:** 🎮 | **Category:** `Communication/Chat`
Sends a message to a Discord channel via Incoming Webhook. Supports content and Embeds.

### `discord:embed`
**Icon:** 🖼️ | **Category:** `Communication/Chat`
Sends a rich Embed to Discord via Webhook. Provides a structured builder for embeds.

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

### `postgres:query_db`
**Icon:** 🔍 | **Category:** `Data/Storage/Database`
Executes a raw SQL `SELECT` query and returns the results as a JSON array.

### `postgres:execute_raw`
**Icon:** ⚡ | **Category:** `Data/Storage/Database`
Executes raw SQL commands (`INSERT`, `UPDATE`, `DELETE`, etc.) and returns execution metadata.

### `postgres:table_operation`
**Icon:** 📋 | **Category:** `Data/Storage/Database`
Managed CRUD tool for operations on a specific table (Insert, Update, Delete, Upsert).

### `postgres:call_procedure`
**Icon:** ⚙️ | **Category:** `Data/Storage/Database`
Executes stored procedures or functions.

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

### `scraper:scrape_html`
**Icon:** 🕷️ | **Category:** `Data/Web`
Extracts text or attributes from HTML using CSS selectors.

---

## 📈 Mathematics
*Basic arithmetic and signal generation.*

### `math:arithmetic`
**Icon:** ➕ | **Category:** `Math`
Performs basic arithmetic operations (Add, Subtract, Multiply, Divide) on two inputs.

### `math:trigonometry`
**Icon:** 📐 | **Category:** `Math`
Calculates trigonometric functions (Sin, Cos, Tan) for an input value.

### `math:generator`
**Icon:** 〰️ | **Category:** `Math`
Generates signal waveforms (Sine, Square, Triangle, Sawtooth) for testing.

---

## 🌩️ Weather
*Live weather conditions and forecasts.*

### `weather:current`
**Icon:** 🌡️ | **Category:** `Integration/Weather`
Fetches current weather conditions (temperature, wind, etc.) for a specific GPS location.

### `weather:forecast`
**Icon:** 📅 | **Category:** `Integration/Weather`
Retrieves multi-day weather forecasts for a location.

---

## 📡 IoT & Protocols
*Connect to hardware and message buses.*

### `mqtt:mqtt_publish`
**Icon:** 📤 | **Category:** `IoT/MQTT`
Publishes messages to an MQTT broker topic.

### `mqtt:mqtt_subscribe`
**Icon:** 📥 | **Category:** `IoT/MQTT`
Subscribes to an MQTT topic and emits received messages.

### `rss:read_feed`
**Icon:** 📰 | **Category:** `Communication/RSS`
Fetches and parses RSS/Atom feeds from a URL.

### `redis:cache`
**Icon:** 💾 | **Category:** `Data/Cache`
Performs GET/SET/DEL operations on a Redis Key-Value store.

### `redis:publish`
**Icon:** 📢 | **Category:** `Data/Messaging`
Publishes a message to a Redis Pub/Sub channel.

### `redis:subscribe`
**Icon:** 👂 | **Category:** `Data/Messaging`
Subscribes to a Redis channel and emits messages.

---

## 📑 Google Sheets
*Read, write, and manage Google Sheets spreadsheets.*

### `google_sheets:read_sheet`
**Icon:** 🔍 | **Category:** `Integration/Google`
Reads values from a spreadsheet range.

### `google_sheets:append_row`
**Icon:** ➕ | **Category:** `Integration/Google`
Appends rows to a spreadsheet.

### `google_sheets:update_range`
**Icon:** ✏️ | **Category:** `Integration/Google`
Updates values in a specified range.

### `google_sheets:clear_range`
**Icon:** 🗑️ | **Category:** `Integration/Google`
Clears values from a specified range.

### `google_sheets:get_spreadsheet`
**Icon:** 📄 | **Category:** `Integration/Google`
Gets spreadsheet metadata (sheets, title, etc).

---

## 🔧 Plugin Component ID Format

All component IDs follow the format: `\{package\}:\{tool\}:\{instance\}`

- **package**: The plugin name (e.g., `time`, `ai`, `sqlite`)
- **tool**: The specific functionality (e.g., `time_interval`, `ai_chat`, `sql_query`)
- **instance**: A numeric identifier unique within the workflow (e.g., `0`, `1`)

**Example:** `time:time_interval:0` - First instance of the time interval tool

---

## 🔌 MCP Integration (Model Context Protocol)
*Expose workflows as specialized tools to external AI agents, OR connect external tools to Undergrowth.*

### `mcp:connect`
**Icon:** 🌐 | **Category:** `Integrations/MCP`
**Role:** `Source`
Connects to a local or remote MCP Server and dynamically registers its tools as native Undergrowth tools.
- **Config**:
  - `command`: The command to run (for stdio servers).
  - `args`: Arguments for the command.
  - `url`: The URL (for SSE servers).
  - `env`: Environment variables.
- **Behavior**:
  - Establishes a permanent connection to the MCP server.
  - Discover tools and resources.
  - Registers them as `mcp:tool` tools available in the workflow (e.g., `weather:get_forecast`).

### `mcp:tool`
**Icon:** 🛠️ | **Category:** `Integrations/MCP`
**Role:** `Process`
A specific, dynamically registered tool from a connected MCP server.
- **Note**: You generally do not add this manually. Use the **MCP Connection Wizard** to discover and add tools.
- **Inputs**: Expects a JSON object matching the tool's input schema.
- **Output**: Returns the tool's execution result.

### `mcp:tool_entry`
**Icon:** 🔧 | **Category:** `Integrations/MCP`
**Role:** `Source`
Defines the current workflow as an exposed MCP Tool.
- **Config**:
  - `name`: The tool name (e.g., `calculate_tax`).
  - `description`: Instructions for the AI on how to use the tool.
  - `schema`: JSON Schema defining the input arguments.
- **Behavior**:
  - Acts as the entry point for the workflow.
  - When the tool is called by an external MCP Client (e.g., Claude Desktop), this component emits the provided arguments.
  - The workflow's final output is returned to the caller.

### `mcp:execute_tool`
**Icon:** 🌉 | **Category:** `Integrations/MCP`
**Role:** `Process`
Execute tools dynamically using MCP (Legacy/Advanced).
- Acts as a bridge to execute tools without explicit component registration.
- **Inputs**: Expects a JSON object with tool name and arguments.
- **Output**: Returns the result of the tool execution.

---

## 📊 Visualization & Dashboard
*Widgets for the Undergrowth Web UI Dashboard.*

### `visualization:gauge`
**Icon:** ⏱️ | **Category:** `Visualization/Dashboard`
Real-time gauge displaying a single numeric value.

### `visualization:chart`
**Icon:** 📈 | **Category:** `Visualization/Dashboard`
Real-time time-series chart (Line, Bar, Area).

### `visualization:status`
**Icon:** 🚦 | **Category:** `Visualization/Dashboard`
Status light indicator (Ok, Warning, Critical).

### `visualization:stat`
**Icon:** 🔢 | **Category:** `Visualization/Dashboard`
Large number display with optional trend indicator.

### `visualization:log`
**Icon:** 📜 | **Category:** `Visualization/Dashboard`
Scrolling text log display for monitoring events or logs.

### `visualization:alerts`
**Icon:** 🔔 | **Category:** `Visualization/Dashboard`
Feed of active alerts with severity levels.

### `visualization:thinking_trace`
**Icon:** 🧠 | **Category:** `Visualization/Dashboard`
Visualizes the reasoning steps of an AI Agent in real-time.

### `visualization:render_html`
**Icon:** 📄 | **Category:** `Visualization/Dashboard`
Displays HTML content in a sandboxed iframe widget.

---

## 🧩 Strategic Evolution: Model Context Protocol (MCP)

Undergrowth is a full **MCP-Native Runtime**.

- **Workflows as Tools**: Any workflow starting with `mcp:tool_entry` is automatically discovered and exposed as a tool to connected MCP clients.
- **Native Server**: Run Undergrowth with the `--mcp` flag to start the native JSON-RPC server over stdio.

