# Undergrowth Plugin Developer Guide

Build powerful automation components for the Undergrowth workflow engine.

---

## Table of Contents

1. [Quick Start](#quick-start) - Create your first plugin in 10 minutes
2. [Core Concepts](#core-concepts) - Understand the architecture
3. [API Reference](#api-reference) - Complete PluginContext and traits reference
4. [Configuration & Schemas](#configuration--schemas) - Typed configs and UI hints
5. [Testing Your Plugin](#testing-your-plugin) - Unit and integration testing
6. [Best Practices](#best-practices) - Patterns for production plugins
7. [Building for MCP](#building-for-mcp) - Native Plugins vs MCP Servers
8. [Advanced Topics](#advanced-topics) - ABI, versioning, batch processing

---

## Quick Start

Create a working plugin in 10 minutes. We'll build an "Echo" plugin that logs and forwards input data.

### Step 1: Create Plugin Directory

```bash
mkdir -p components/mypackage/echo
cd components/mypackage/echo
cargo init --lib
```

### Step 2: Configure `Cargo.toml`

```toml
[package]
name = "echo"
version = "0.1.0"
edition = "2021"

[dependencies]
async-trait = "0.1.89"
log = "0.4.27"
savefile = "0.20.1"
savefile-abi = "0.20.1"
savefile-derive = "0.20.1"
schemars = "1.0"
serde = "1.0.219"
serde_json = "1.0.145"
tokio = { version = "1.47.1", features = ["full"] }

[dependencies.foundation]
version = "0.1.0"
path = "../../../foundation"

[lib]
name = "echo"
crate-type = ["cdylib"]
```

### Step 3: Create `src/lib.rs`

```rust
//! Echo plugin - demonstrates the minimal plugin structure.

use foundation::plugin_interface::plugin::PluginApi;
use foundation::plugin_interface::tools::ToolsApi;
use foundation::plugin_interface::color_palette::PluginRole;
use savefile_derive::savefile_abi_export;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

mod echo_tool;
pub use echo_tool::Echo;

// Configuration struct - must implement these traits
#[derive(Debug, Default, Clone, Serialize, Deserialize, JsonSchema)]
pub struct EchoConfig {
    /// Prefix to add to echoed messages
    #[serde(default)]
    pub prefix: String,
}

// The plugin! macro generates all boilerplate
foundation::plugin! {
    name: "Echo",
    version: "0.1.0",
    author: "Your Name",
    description: "Echoes input data with optional prefix",
    tools: {
        "echo" => Echo { 
            icon: "📢", 
            role: PluginRole::Process, 
            description: "Echoes input data to output with optional prefix.", 
            tags: vec!["Utility", "Debug"],
            help: include_str!("help/echo.md") 
        },
    }
}
```

### Step 4: Create `src/echo_tool.rs`

```rust
//! Echo tool implementation

use crate::EchoConfig;
use foundation::{PluginContext, ToolHandlerType};

pub struct Echo;

impl ToolHandlerType for Echo {
    type Config = EchoConfig;

    async fn process(
        ctx: &PluginContext<EchoConfig>, 
        data: Option<foundation::bytes::Bytes>
    ) -> Result<(), String> {
        // Parse incoming data as JSON
        let input: serde_json::Value = match data {
            Some(bytes) => serde_json::from_slice(&bytes)
                .map_err(|e| format!("Failed to parse input: {}", e))?,
            None => serde_json::json!(null),
        };
        
        // Log what we received
        ctx.info(format!("Received: {:?}", input));
        
        // Create output with prefix
        let output = serde_json::json!({
            "echoed": format!("{}{}", ctx.config.prefix, input),
            "original": input,
        });
        
        // Send to downstream components
        ctx.send(output).await;
        
        Ok(())
    }
}
```

### Step 5: Create `src/help/echo.md`

```markdown
# Echo

Echoes input data to output with an optional prefix.

## Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `prefix` | string | `""` | Text to prepend to echoed output |

## Example

Input: `{"message": "Hello"}`
Output: `{"echoed": "[PREFIX]Hello", "original": {"message": "Hello"}}`
```

### Step 6: Build and Test

```bash
cargo build --release
```

Your plugin DLL will be at `target/release/echo.dll` (Windows) or `target/release/libecho.so` (Linux).

Copy it to the engine's plugin directory and restart Undergrowth!

---

## Core Concepts

### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   Web UI (React)                    │
├─────────────────────────────────────────────────────┤
│                  REST API (Axum)                    │
├─────────────────────────────────────────────────────┤
│               Engine (Proprietary)                  │
│  • Plugin Loading  • Workflow Management  • Jobs    │
├─────────────────────────────────────────────────────┤
│              Foundation (Public SDK)                │
│  • PluginContext  • ToolHandlerType  • plugin! │
├─────────────────────────────────────────────────────┤
│              Your Plugins (DLLs/SOs)                │
└─────────────────────────────────────────────────────┘
```

**Key Principle**: Plugins depend ONLY on `foundation`. They have no compile-time dependency on the engine.

### Terminology

| Term | Definition |
|------|------------|
| **Plugin** | A compiled DLL/SO containing one or more tools |
| **Tool** | A specific behavior within a plugin (e.g., `time_interval`, `time_delay`) |
| **Workflow** | A graph of connected component instances |
| **Job** | A running instance of a workflow |
| **Component** | An instance of a tool in a workflow |

### Plugin Roles

Tools declare a **role** that determines their visual appearance and expected behavior:

| Role | Icon Color | Description |
|------|------------|-------------|
| `Source` | Teal/Cyan | Generates events (timers, webhooks, file watchers) |
| `Process` | Blue/Purple | Transforms data (AI, parsing, filtering) |
| `Sink` | Orange/Red | Outputs data (file writes, notifications, databases) |
| `Dashboard` | Cyan | Visualizes data (Live monitors, gauges, charts) |

### Component ID Format

Every component in a workflow has a unique ID: `{package}:{tool}:{instance}`

- `time:time_interval:0` — First timer interval
- `ai:ai_chat:2` — Third AI chat component

---

## API Reference

### `PluginContext<C>`

The primary interface for your tool logic. Provides typed configuration, output sending, logging, and alerting.

```rust
pub struct PluginContext<C> {
    /// Your parsed, typed configuration
    pub config: C,
    
    /// Component identification and metadata
    pub info: ComponentInfo,
    
    /// Sandboxed data directory for file operations
    pub data_dir: std::path::PathBuf,
}
```

#### Output Methods

| Method | Description |
|--------|-------------|
| `send(value: Value)` | Send JSON to downstream components (async, non-blocking) |
| `send_value<T: Serialize>(&T)` | Serialize and send any type |
| `send_batch(Vec<Value>)` | Send multiple values efficiently |
| `send_values<T: Serialize>(&[T])` | Batch send with serialization |
| `send_blocking(Value)` | Async send with backpressure (waits if channel full) |
| `send_batch_blocking(Vec<Value>)` | Batch send with backpressure |
| `publish_dashboard(key, value)` | Send data to the Live Monitor (WebSocket) |
| `output("name").send(value)` | Send data to a specific named output port |
| `request_approval(req)` | Pause execution and request human approval |
| `register_dynamic_tool(...)` | Register an external tool (e.g., from MCP) |
| `queue_depth() -> usize` | Current output queue depth |

**Example:**

```rust
// Simple send
ctx.send(serde_json::json!({"status": "ok"})).await;

// Typed send
ctx.send_value(&MyOutput { count: 42 }).await;

// Batch send (high throughput)
let items = vec![json!(1), json!(2), json!(3)];
let sent = ctx.send_batch(items).await;
```

#### Logging Methods

| Method | Description |
|--------|-------------|
| `info(msg)` | Log informational message |
| `warn(msg)` | Log warning message |
| `error(msg)` | Log error message |

**Example:**

```rust
ctx.info("Processing started");
ctx.warn(format!("Slow response: {}ms", elapsed));
ctx.error("Connection failed");
```

#### Alerting Methods

Raise alerts visible in the Web UI and REST API:

| Method | Description |
|--------|-------------|
| `alert(severity, message) -> AlertBuilder` | Create an alert |
| `alert_info(message) -> AlertBuilder` | Create info alert |
| `alert_warning(message) -> AlertBuilder` | Create warning alert |
| `alert_error(message) -> AlertBuilder` | Create error alert |
| `alert_critical(message) -> AlertBuilder` | Create critical alert |

**Example:**

```rust
// Simple alert
ctx.alert_warning("Temperature exceeds threshold").send().await;

// Alert with metadata
ctx.alert(AlertSeverity::Error, "API request failed")
    .with_metadata("status_code", 500)
    .with_metadata("url", "https://api.example.com")
    .send()
    .await;
```

#### Identity Methods

| Method | Description |
|--------|-------------|
| `tool() -> &str` | Get tool name (e.g., "echo") |
| `id() -> String` | Full component ID (e.g., "job-123:echo:echo:0") |
| `short_id() -> String` | Short ID (e.g., "echo:echo:0") |

#### AI/Model Methods

| Method | Description |
|--------|-------------|
| `list_models() -> Vec<(String, ModelConfig)>` | List available AI models |
| `model_service() -> Option<Box<dyn ModelService>>` | Get model service interface |

### Named Output Ports

For more complex logic, you can send data to specific named ports instead of the default `out` port.

```rust
// Send to "error" port
ctx.output("error").send(json!({"msg": "Something failed"})).await;

// Send to "then" port
ctx.output("then").send(data).await;
```

---

### Human-in-the-Loop (HITL) Approvals

Plugins can pause execution and request human intervention.

```rust
use foundation::io::approval::{ApprovalRequest, ApprovalSeverity};

async fn process(ctx: &PluginContext<MyConfig>, data: Option<Vec<u8>>) -> Result<(), String> {
    // create request
    let request = ApprovalRequest::new(
        "Deploy to Production?",
        ApprovalSeverity::Critical
    ).with_description("This will update the live database.");

    // This block waits until the user clicks Approve/Reject in the UI
    match ctx.request_approval(&request, 3600).await {
        Ok(response) if response.is_approved() => {
            ctx.info("User approved deployment");
            // proceed...
        }
        Ok(response) => {
            ctx.warn("User rejected deployment");
            // abort...
        }
        Err(e) => {
            ctx.error(format!("Approval failed/timed out: {}", e));
        }
    }
    Ok(())
}
```

---

### ToolHandlerType Trait

The core trait you implement for each tool:

```rust
pub trait ToolHandlerType: Send + Sync + 'static {
    /// The config type for this tool (usually shared with other tools)
    type Config: Clone + Send + Sync + Default + DeserializeOwned + 'static;
    
    /// Process incoming data (REQUIRED)
    fn process(
        ctx: &PluginContext<Self::Config>,
        data: Option<Vec<u8>>,
    ) -> impl Future<Output = Result<(), String>> + Send;
    
    /// Called when the component starts (optional)
    fn on_start(
        ctx: &PluginContext<Self::Config>,
    ) -> impl Future<Output = Result<(), String>> + Send {
        async { Ok(()) }
    }
    
    /// Called when the component stops (optional)
    fn on_stop(
        ctx: &PluginContext<Self::Config>,
    ) -> impl Future<Output = Result<(), String>> + Send {
        async { Ok(()) }
    }
    
    /// Process a batch of items (optional, for high-throughput)
    fn process_batch(
        ctx: &PluginContext<Self::Config>,
        batch: Vec<Option<Vec<u8>>>,
    ) -> impl Future<Output = Vec<Result<(), String>>> + Send;
    
    /// Declare processing capabilities (optional)
    fn capabilities() -> ProcessingCapabilities {
        ProcessingCapabilities::default()
    }
    
    /// Preferred batch size hint (optional)
    fn preferred_batch_size() -> usize { 0 }
    
    /// Enhanced UI schema (optional)
    fn enhanced_schema() -> Option<EnhancedConfigSchema> { None }
}
```

---

### The plugin! Macro

Generates all boilerplate for your plugin:

```rust
foundation::plugin! {
    name: "PluginName",           // Display name
    version: "0.1.0",             // Semantic version
    author: "Your Name",          // Author attribution
    description: "Description",   // What the plugin does
    config: MyConfig,             // Shared config type
    tools: {
        "tool_name" => ToolStruct { 
            icon: "🎯",                           // Emoji icon
            role: PluginRole::Process,            // Source/Process/Sink
            description: "What this does",        // For UI
            category: categories::AI_LLM,         // Category path
            help: include_str!("help/file.md"),   // Help content
        },
        // ... more tools
    }
}
```

---

## Configuration & Schemas

### Config Struct Requirements

Your config must derive these traits:

```rust
#[derive(Debug, Default, Clone, Serialize, Deserialize, JsonSchema)]
pub struct MyConfig {
    /// Field with default value
    #[serde(default = "default_value")]
    pub my_field: String,
}

fn default_value() -> String { "default".to_string() }
```

### Enhanced UI Schema

Provide rich UI hints for the Web UI form builder:

```rust
fn enhanced_schema() -> Option<EnhancedConfigSchema> {
    Some(EnhancedConfigSchema {
        schema: json!({
            "type": "object",
            "properties": {
                "interval": {
                    "type": "integer",
                    "default": 5,
                    "minimum": 1,
                    "title": "Interval"
                }
            }
        }),
        ui_schema: Some(UiSchema {
            field_order: vec!["interval".into()],
            widgets: HashMap::from([
                ("interval".into(), WidgetType::NumberSpinner { 
                    min: Some(1), max: Some(3600), step: Some(1) 
                }),
            ]),
            groups: vec![],
            templates: vec![
                ConfigTemplate {
                    id: "quick".into(),
                    name: "Quick (5 seconds)".into(),
                    description: "For testing".into(),
                    icon: Some("⚡".into()),
                    config: json!({"interval": 5}),
                },
            ],
        }),
    })
}
```

### Available Widget Types

| Widget | Use Case |
|--------|----------|
| `NumberSpinner { min, max, step }` | Numeric input with controls |
| `DurationPicker` | Time duration (e.g., "5s", "10m") |
| `ToggleSwitch` | Boolean on/off |
| `Select { options }` | Dropdown selection |
| `UrlInput { placeholder }` | URL with validation |
| `TextInput { placeholder, multiline }` | Text entry |
| `FilePathPicker { mode }` | File/directory browser |
| `JsonEditor` | Raw JSON editing |

---

## Testing Your Plugin

### Unit Testing with TestPluginContext

The `foundation::test_utils` module provides mocks for isolated testing:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use foundation::test_utils::TestPluginContext;

    #[tokio::test]
    async fn test_echo_tool() {
        // Create test context with config
        let test_ctx = TestPluginContext::<EchoConfig>::with_config(
            EchoConfig { prefix: "[TEST] ".to_string() },
            "echo",
            "echo"
        );
        
        // Get the PluginContext to pass to the handler
        let ctx = test_ctx.plugin_context();
        
        // Prepare input data
        let input = serde_json::to_vec(&json!({"msg": "hello"})).unwrap();
        
        // Call the tool
        let result = Echo::process(&ctx, Some(input)).await;
        assert!(result.is_ok());
        
        // Check outputs
        let outputs = test_ctx.take_outputs();
        assert_eq!(outputs.len(), 1);
        assert!(outputs[0]["echoed"].as_str().unwrap().contains("[TEST]"));
    }

    #[tokio::test]
    async fn test_echo_logs() {
        let test_ctx = TestPluginContext::<EchoConfig>::new("echo", "echo");
        let ctx = test_ctx.plugin_context();
        
        Echo::process(&ctx, None).await.ok();
        
        // Check log messages
        assert!(test_ctx.has_log("Received"));
        assert!(test_ctx.errors().is_empty());
    }

    #[tokio::test]
    async fn test_alerts() {
        use foundation::AlertSeverity;
        
        let test_ctx = TestPluginContext::<EchoConfig>::new("echo", "echo");
        let ctx = test_ctx.plugin_context();
        
        // Trigger an alert in your tool logic
        ctx.alert_warning("Test alert").send().await;
        
        // Verify alerts
        let alerts = test_ctx.take_alerts();
        assert_eq!(alerts.len(), 1);
        assert_eq!(alerts[0].severity, AlertSeverity::Warning);
    }
}
```

### MockContext Methods

| Method | Description |
|--------|-------------|
| `logs()` | Get all captured log messages |
| `infos()` | Get only info-level logs |
| `warnings()` | Get only warning-level logs |
| `errors()` | Get only error-level logs |
| `has_log_containing(substring)` | Check if any log contains text |
| `clear_logs()` | Reset log capture |

### TestPluginContext Methods

| Method | Description |
|--------|-------------|
| `plugin_context()` | Get a real `PluginContext` for testing |
| `take_outputs()` | Drain and return all sent outputs |
| `take_alerts()` | Drain and return all raised alerts |
| `has_alert(substring)` | Check if any alert contains text |

---

### Decoupled Configuration Pattern

Production plugins should use independent config structs for each tool. This avoids using the `#[serde(tag = "tool")]` pattern which introduces redundant fields in the configuration JSON.

#### Implementation

1. **Define separate structs**:
```rust
#[derive(Deserialize, JsonSchema)]
pub struct MathConfig { ... }

#[derive(Deserialize, JsonSchema)]
pub struct TrigConfig { ... }
```

2. **Specify in `ToolHandlerType`**:
```rust
impl ToolHandlerType for Math {
    type Config = MathConfig;
}
```

3. **Register in `plugin!` macro**:
The `plugin!` macro will automatically use the `type Config` from each handler implementation to deserialize the correct data for that tool.

### Error Handling

```rust
async fn process(ctx: &PluginContext<MyConfig>, data: Option<foundation::bytes::Bytes>) -> Result<(), String> {
    // Parse input with meaningful error
    let input: MyInput = match data {
        Some(bytes) => serde_json::from_slice(&bytes)
            .map_err(|e| format!("Invalid input JSON: {}", e))?,
        None => return Err("No input data provided".to_string()),
    };
    
    // Raise alerts for recoverable errors
    if let Err(e) = external_call().await {
        ctx.alert_warning(format!("External call failed: {}", e))
            .with_metadata("will_retry", true)
            .send().await;
    }
    
    Ok(())
}
```

### Source Tools (Timers, Triggers)

Source tools loop indefinitely:

```rust
async fn process(ctx: &PluginContext<MyConfig>, _data: Option<foundation::bytes::Bytes>) -> Result<(), String> {
    loop {
        // Do your triggering logic
        tokio::time::sleep(Duration::from_secs(ctx.config.interval)).await;
        
        // Emit event
        ctx.send(json!({"type": "tick", "timestamp": now()})).await;
    }
}
```

### File Operations (Sandboxed)

Always use the sandboxed `data_dir`:

```rust
async fn process(ctx: &PluginContext<MyConfig>, data: Option<foundation::bytes::Bytes>) -> Result<(), String> {
    // Build path in sandbox
    let file_path = ctx.data_dir.join(&ctx.config.filename);
    
    // Write safely
    tokio::fs::write(&file_path, data.unwrap_or_default())
        .await
        .map_err(|e| format!("Failed to write: {}", e))?;
    
    Ok(())
}
```

### High-Throughput Batch Processing

For transform/aggregation plugins processing many events:

```rust
impl ToolHandlerType for MyBatchProcessor {
    type Config = MyConfig;
    
    fn preferred_batch_size() -> usize { 100 }
    
    fn process_batch(
        ctx: &PluginContext<Self::Config>,
        batch: Vec<Option<foundation::bytes::Bytes>>,
    ) -> impl Future<Output = Vec<Result<(), String>>> + Send {
        async move {
            let mut results = Vec::with_capacity(batch.len());
            
            // Process all items efficiently
            for data in batch {
                results.push(Self::process(ctx, data).await);
            }
            
            // Or use parallel processing
            // futures::future::join_all(batch.into_iter().map(|d| Self::process(ctx, d))).await
            
            results
        }
    }
    
    async fn process(ctx: &PluginContext<Self::Config>, data: Option<foundation::bytes::Bytes>) -> Result<(), String> {
        // ... single item processing
        Ok(())
    }
}
```

---

## Building for MCP

With the introduction of the Model Context Protocol (MCP), you now have two ways to extend Undergrowth:

### Native Plugin vs. MCP Server

| Feature | **Native Plugin** (`.dll`/`.so`) | **MCP Server** (External Process) |
|:---|:---|:---|
| **Language** | Rust (Required) | Python, TS, Go, Rust, etc. |
| **Performance** | **High** (Run in-process) | **Medium** (IPC/Network overhead) |
| **Integration** | Tight (Access to `PluginContext`, Data Dir) | Loose (Tool-call abstraction) |
| **Distribution** | Undergrowth-specific | **Universal** (Works with Claude, Zed, etc.) |
| **Use Case** | High-speed ETL, Hardware Control, UI Widgets | SaaS Integrations, Database connectors |

**Recommendation:**
- Build an **MCP Server** for generic integrations (Google Drive, Slack, Postgres) that you want to share with the wider AI ecosystem.
- Build a **Native Plugin** for logic that requires tight event loops, raw byte processing, or custom UI widgets in the dashboard.

### Connecting an MCP Server

Undergrowth acts as an **MCP Host**. To use your MCP server:
1. Ensure your server is executable (e.g., `uvx mcp-server-foo`).
2. Use the `mcp:serve_stdio` tool in your workflow.
3. Configure it with your command:
   ```json
   {
     "command": "uvx",
     "args": ["mcp-server-foo"]
   }
   ```
4. The tools exposed by your server will become available to AI Agents in the workflow.

---

## Advanced Topics

### ABI Compatibility

Undergrowth uses [savefile-abi](https://crates.io/crates/savefile-abi) for safe plugin loading across Rust versions.

**Key Rules:**
1. Plugins are versioned independently from the engine
2. ABI compatibility is maintained through the `PluginApi` trait
3. The engine checks `foundation` version at load time

### Version Checking

The engine performs version compatibility checks when loading plugins:

```rust
// In your lib.rs, the plugin! macro handles this automatically
// It embeds FOUNDATION_VERSION and API_VERSION
```

Version constants (from `foundation::version`):

| Constant | Description |
|----------|-------------|
| `FOUNDATION_VERSION` | Foundation crate version |
| `API_VERSION` | Plugin API version |
| `MIN_SUPPORTED_API_VERSION` | Minimum compatible API |

### Lifecycle Hooks

Use `on_start` and `on_stop` for initialization/cleanup:

```rust
impl ToolHandlerType for MyTool {
    type Config = MyConfig;
    
    async fn on_start(ctx: &PluginContext<Self::Config>) -> Result<(), String> {
        // Initialize resources, open connections
        ctx.info("Initializing...");
        Ok(())
    }
    
    async fn on_stop(ctx: &PluginContext<Self::Config>) -> Result<(), String> {
        // Cleanup resources, close connections
        ctx.info("Shutting down...");
        Ok(())
    }
    
    async fn process(ctx: &PluginContext<Self::Config>, data: Option<foundation::bytes::Bytes>) -> Result<(), String> {
        // Normal processing
        Ok(())
    }
}
```

### Categories

Define category paths for organization in the UI:

```rust
use foundation::categories;

// Available category constants:
categories::AI_LLM           // "AI/LLM"
categories::TIME_SCHEDULE    // "Time/Schedule"
categories::TIME_DELAY       // "Time/Delay"
categories::LOGIC            // "Logic"
categories::DATA_TRANSFORM   // "Data/Transform"
categories::DATA_STORAGE_DATABASE  // "Data/Storage/Database"
categories::COMMUNICATION_HTTP     // "Communication/HTTP"
categories::UTILITY_DEBUG    // "Utility/Debug"
// ... see foundation/src/plugin_interface/category.rs for full list
```

### Debugging

Enable verbose logging during development:

```bash
RUST_LOG=debug ./undergrowth
```

Add debug output in your tool:

```rust
ctx.info(format!("Config: {:?}", ctx.config));
ctx.info(format!("Input bytes: {:?}", data.as_ref().map(|d| d.len())));
```

---

## Related Resources

- [Plugin Reference](./PLUGIN_REFERENCE.md) - List of built-in plugins
- [Plugin Style Guide](./PLUGIN_STYLE_GUIDE.md) - Visual design guidelines
- [API Reference](./API_REFERENCE.md) - REST API documentation
- [Configuration](./CONFIGURATION.md) - Engine configuration

---

*Happy plugin building! 🌱*
