# Foundation API Reference

Complete reference for the Undergrowth `foundation` crate - the public SDK for plugin development.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Types](#core-types)
   - [PluginContext](#plugincontextc)
   - [ToolHandlerType](#toolhandlertype-trait)
   - [ComponentInfo](#componentinfo)
3. [Plugin Macro](#plugin-macro)
4. [Category System](#category-system)
5. [Alert System](#alert-system)
6. [Version Management](#version-management)
7. [Configuration Schemas](#configuration-schemas)
8. [Channel & IO](#channel--io)
9. [Model Service](#model-service)
10. [Testing Utilities](#testing-utilities)
11. [Re-exports](#re-exports)

---

## Overview

The `foundation` crate provides everything needed to build Undergrowth plugins:

```toml
[dependencies.foundation]
version = "0.1.0"
path = "../../../foundation"
```

**Key Design Principle**: Plugins depend ONLY on `foundation`. No compile-time dependency on the engine.

### Module Structure

| Module | Purpose |
|--------|---------|
| `plugin_interface` | Core traits and context for plugin development |
| `alert` | Alert system for plugin-to-engine notifications |
| `version` | Version constants and compatibility checking |
| `config_schema` | Enhanced UI schema definitions |
| `io` | Channel connections and backpressure |
| `model` | AI model service interface |
| `test_utils` | Testing helpers for plugin authors |

---

## Core Types

### `PluginContext`

Primary interface for tool execution.

- **`new(...)`**: Create new context.
- **`send(Value)`**: Send data to default output.
- **`output(name)`**: Get an `OutputBuilder` for a named output port.
- **`input(name)`**: Get an `InputBuilder` for a named input port.
- **`request_approval(req, timeout)`**: Request HITL approval.
- **`register_dynamic_tool(...)`**: Register external tool.
- **`publish_dashboard(key, value)`**: Send data to dashboard.

### `OutputBuilder`
Fluent interface for sending messages to named ports.

- **`send(Value)`**: Send JSON data.
- **`with_correlation(id)`**: Attach correlation ID.
- **`with_metadata(key, val)`**: Attach custom metadata.

### `InputBuilder`
Fluent interface for receiving messages from named ports.

- **`recv()`**: Await next message (async).
- **`with_timeout(duration)`**: Set receive timeout.
- **`with_correlation_filter(id)`**: Only accept messages with matching ID.
- **`request_approval(req)`**: Request HITL approval.
- **`register_dynamic_tool(...)`**: Register external tool.
- **`publish_dashboard(key, value)`**: Send data to dashboard.

### `OutputBuilder`
Fluent interface for sending messages.

- **`send(Value)`**: Send JSON data.
- **`with_correlation(id)`**: Attach correlation ID.
- **`with_metadata(key, val)`**: Attach custom metadata.

### PluginContext\<C\>

```rust
pub struct PluginContext<C> {
    pub config: C,                      // Your parsed, typed configuration
    pub info: ComponentInfo,            // Component identification and metadata
    pub data_dir: std::path::PathBuf,   // Sandboxed data directory for file operations
}
```

#### Output Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `send` | `async fn send(&self, value: Value)` | Send JSON to downstream components (async, non-blocking) |
| `send_value` | `async fn send_value<T: Serialize>(&self, value: &T)` | Serialize and send any type |
| `send_batch` | `async fn send_batch(&self, values: Vec<Value>) -> usize` | Send multiple values efficiently, returns count sent |
| `send_values` | `async fn send_values<T: Serialize>(&self, values: &[T]) -> usize` | Batch send with serialization |
| `send_blocking` | `async fn send_blocking(&self, value: Value)` | Send with backpressure (waits if channel full) |
| `send_batch_blocking` | `async fn send_batch_blocking(&self, values: Vec<Value>) -> usize` | Batch send with backpressure |
| `queue_depth` | `fn queue_depth(&self) -> usize` | Current output queue depth (for custom backpressure) |

**Example**:
```rust
// Simple send
ctx.send(serde_json::json!({"status": "ok"})).await;

// Typed send
ctx.send_value(&MyOutput { count: 42 }).await;

// Batch send (high throughput)
let items = vec![json!(1), json!(2), json!(3)];
let sent = ctx.send_batch(items).await;
```

#### Input Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `input` | `fn input(&self, port: &str) -> InputBuilder` | Get interface for named input |

**Example**:
```rust
// Receive from "in" port with timeout
let msg = ctx.input("in")
    .with_timeout(Duration::from_secs(5))
    .recv()
    .await?;
```

#### Dynamic Tool Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `register_dynamic_tool` | `fn register_dynamic_tool(...) -> bool` | Register an external tool |
| `unregister_dynamic_tool` | `fn unregister_dynamic_tool(pkg, tool) -> bool` | Remove a tool |
| `unregister_dynamic_package` | `fn unregister_dynamic_package(pkg) -> u32` | Remove all tools for package |

#### Approval Methods (HITL)

| Method | Signature | Description |
|--------|-----------|-------------|
| `request_approval` | `async fn request_approval(&self, req: &ApprovalRequest, timeout_sec: u64) -> Result<ApprovalResponse, String>` | Pause and wait for human decision |

#### Dashboard Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `publish_dashboard` | `fn publish_dashboard(&self, widget: &str, data: Value)` | Push real-time data to Web UI |

#### Logging Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `info` | `fn info(&self, msg: impl Into<String>)` | Log informational message |
| `warn` | `fn warn(&self, msg: impl Into<String>)` | Log warning message |
| `error` | `fn error(&self, msg: impl Into<String>)` | Log error message |

**Example**:
```rust
ctx.info("Processing started");
ctx.warn(format!("Slow response: {}ms", elapsed));
ctx.error("Connection failed");
```

#### Alert Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `alert` | `fn alert(&self, severity: AlertSeverity, message: impl Into<String>) -> AlertBuilder` | Create alert with severity |
| `alert_info` | `fn alert_info(&self, message: impl Into<String>) -> AlertBuilder` | Create info-level alert |
| `alert_warning` | `fn alert_warning(&self, message: impl Into<String>) -> AlertBuilder` | Create warning-level alert |
| `alert_error` | `fn alert_error(&self, message: impl Into<String>) -> AlertBuilder` | Create error-level alert |
| `alert_critical` | `fn alert_critical(&self, message: impl Into<String>) -> AlertBuilder` | Create critical-level alert |

**Example**:
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

| Method | Signature | Description |
|--------|-----------|-------------|
| `tool` | `fn tool(&self) -> &str` | Get tool name (e.g., "echo") |
| `id` | `fn id(&self) -> String` | Full component ID (e.g., "job-123:echo:echo:0") |
| `short_id` | `fn short_id(&self) -> String` | Short ID (e.g., "echo:echo:0") |

#### Model Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `list_models` | `fn list_models(&self) -> Vec<(String, ModelConfig)>` | List available AI models |
| `model_service` | `fn model_service(&self) -> Option<Box<dyn ModelService>>` | Get model service interface |

---

### ToolHandlerType Trait

The core trait plugin authors implement for each tool.

```rust
pub trait ToolHandlerType: Send + Sync + 'static {
    /// The config type this handler uses
    type Config: Clone + Send + Sync + Default + DeserializeOwned + 'static;
    
    /// Process incoming data (REQUIRED)
    fn process(
        ctx: &PluginContext<Self::Config>,
        data: Option<Vec<u8>>,
    ) -> impl Future<Output = Result<(), String>> + Send;
    
    /// Called when the component starts (optional)
    fn on_start(
        _ctx: &PluginContext<Self::Config>,
    ) -> impl Future<Output = Result<(), String>> + Send {
        async { Ok(()) }
    }
    
    /// Called when the component stops (optional)
    fn on_stop(
        _ctx: &PluginContext<Self::Config>,
    ) -> impl Future<Output = Result<(), String>> + Send {
        async { Ok(()) }
    }
    
    /// Process batch for high-throughput (optional)
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

#### ProcessingCapabilities

```rust
#[derive(Debug, Clone, Copy, Default)]
pub struct ProcessingCapabilities {
    pub supports_batch: bool,      // Whether plugin supports batch processing
    pub supports_streaming: bool,  // Whether plugin supports streaming
    pub preferred_batch_size: u32, // Preferred batch size (0 = no preference)
    pub max_batch_size: u32,       // Maximum batch size (0 = unlimited)
}
```

---

### ComponentInfo

Metadata about a plugin component.

```rust
pub struct ComponentInfo {
    pub name: String,              // Plugin display name
    pub id: Id,                    // Component ID
    pub version: String,           // Plugin version
    pub author: String,            // Plugin author
    pub description: String,       // Plugin description
    pub dependencies: String,      // Dependency information
    pub version_info: PluginVersionInfo,  // Detailed version info
}
```

---

## Plugin Macro

The `plugin!` macro generates all boilerplate for plugin registration.

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

### PluginRole

Determines visual appearance and expected behavior:

| Role | Description | Visual Style |
|------|-------------|--------------|
| `Source` | Generates events (timers, webhooks, file watchers) | Left Bar, Light Shade |
| `Process` | Transforms data (AI, parsing, filtering) | Top Bar, Base Shade |
| `Sink` | Outputs data (file writes, notifications, databases) | Left Bar, Dark Shade |

---

## Category System

Hierarchical categories for organizing plugins in the UI.

### Category Struct

```rust
pub struct Category {
    path: String,  // e.g., "IoT/Protocol/MQTT"
}

impl Category {
    fn new(path: impl Into<String>) -> Self;
    fn path(&self) -> &str;
    fn segments(&self) -> Vec<&str>;
    fn depth(&self) -> usize;
    fn root(&self) -> Option<&str>;
    fn leaf(&self) -> Option<&str>;
    fn parent(&self) -> Option<Category>;
    fn is_under(&self, ancestor: &Category) -> bool;
    fn child(&self, segment: &str) -> Category;
}
```

### Built-in Category Constants

Access via `foundation::categories::*`:

| Category | Path |
|----------|------|
| **Input/Source** | |
| `INPUT` | `"Input"` |
| `INPUT_WEBHOOK` | `"Input/Webhook"` |
| `INPUT_FILE` | `"Input/File"` |
| **Data** | |
| `DATA_TRANSFORM` | `"Data/Transform"` |
| `DATA_STORAGE` | `"Data/Storage"` |
| `DATA_STORAGE_DATABASE` | `"Data/Storage/Database"` |
| `DATA_STORAGE_FILE` | `"Data/Storage/File"` |
| `DATA_STORAGE_CACHE` | `"Data/Storage/Cache"` |
| **Logic** | |
| `LOGIC` | `"Logic"` |
| `LOGIC_CONDITIONAL` | `"Logic/Conditional"` |
| `LOGIC_STATE` | `"Logic/State"` |
| `LOGIC_FLOW` | `"Logic/Flow"` |
| **Time** | |
| `TIME_SCHEDULE` | `"Time/Schedule"` |
| `TIME_DELAY` | `"Time/Delay"` |
| **AI** | |
| `AI_LLM` | `"AI/LLM"` |
| `AI_TOOL` | `"AI/Tool"` |
| **Communication** | |
| `COMMUNICATION_HTTP` | `"Communication/HTTP"` |
| **IoT** | |
| `IOT` | `"IoT"` |
| `IOT_PROTOCOL_MQTT` | `"IoT/Protocol/MQTT"` |
| `IOT_PROTOCOL_MODBUS` | `"IoT/Protocol/Modbus"` |
| `IOT_PROTOCOL_OPCUA` | `"IoT/Protocol/OPC-UA"` |
| `IOT_PROTOCOL_COAP` | `"IoT/Protocol/CoAP"` |
| `IOT_PROTOCOL_ZIGBEE` | `"IoT/Protocol/Zigbee"` |
| `IOT_PROTOCOL_ZWAVE` | `"IoT/Protocol/Z-Wave"` |
| **Control** | |
| `CONTROL` | `"Control"` |
| `CONTROL_ACTUATOR` | `"Control/Actuator"` |
| `CONTROL_SENSOR` | `"Control/Sensor"` |
| `CONTROL_PID` | `"Control/PID"` |
| `CONTROL_SAFETY` | `"Control/Safety"` |
| `CONTROL_TELEMETRY` | `"Control/Telemetry"` |
| **Cloud** | |
| `CLOUD` | `"Cloud"` |
| `CLOUD_AWS` | `"Cloud/AWS"` |
| `CLOUD_AZURE` | `"Cloud/Azure"` |
| `CLOUD_GCP` | `"Cloud/GCP"` |
| **Utility** | |
| `UTILITY` | `"Utility"` |
| `UTILITY_DEBUG` | `"Utility/Debug"` |
| `UTILITY_LOGGING` | `"Utility/Logging"` |

---

## Alert System

System for plugins to raise notifications visible in the Web UI and REST API.

### AlertSeverity

```rust
pub enum AlertSeverity {
    Info,      // Informational - FYI, logged but not urgent
    Warning,   // Needs attention, not critical
    Error,     // Something failed, action needed
    Critical,  // Immediate attention required
}

impl AlertSeverity {
    fn as_str(&self) -> &'static str;
    fn priority(&self) -> u8;  // Higher = more severe
}
```

### Alert

```rust
pub struct Alert {
    pub id: String,
    pub severity: AlertSeverity,
    pub message: String,
    pub source: AlertSource,
    pub metadata: HashMap<String, serde_json::Value>,
    pub created_at: String,
    pub acknowledged: bool,
    pub acknowledged_at: Option<String>,
    pub acknowledged_by: Option<String>,
}

impl Alert {
    fn new(severity: AlertSeverity, message: impl Into<String>, source: AlertSource) -> Self;
    fn with_metadata(self, key: impl Into<String>, value: impl Serialize) -> Self;
    fn acknowledge(&mut self, by: Option<String>);
}
```

### AlertSource

```rust
pub struct AlertSource {
    pub job_id: String,
    pub workflow_id: String,
    pub component_id: String,
    pub plugin_name: String,
    pub tool: String,
}
```

### AlertBuilder

Fluent API for creating and sending alerts:

```rust
pub struct AlertBuilder {
    alert: Alert,
    sender: Option<UnboundedSender<Alert>>,
    context: Option<Arc<dyn SharedContext>>,
}

impl AlertBuilder {
    fn with_metadata(self, key: impl Into<String>, value: impl Serialize) -> Self;
    fn build(self) -> Alert;          // Build without sending
    fn send(self);                    // Send to engine
}
```

### AlertSummary

```rust
pub struct AlertSummary {
    pub total: usize,
    pub info: usize,
    pub warning: usize,
    pub error: usize,
    pub critical: usize,
    pub unacknowledged: usize,
}

impl AlertSummary {
    fn from_alerts(alerts: &[Alert]) -> Self;
}
```

### Global Alert Functions

```rust
// Register an alert sender for a plugin ID
pub fn register_alert_sender(plugin_id: &str, sender: UnboundedSender<Alert>);

// Unregister an alert sender
pub fn unregister_alert_sender(plugin_id: &str);

// Get an alert sender for a plugin ID
pub fn get_alert_sender(plugin_id: &str) -> Option<UnboundedSender<Alert>>;
```

---

## Version Management

### Version Constants

```rust
pub const FOUNDATION_VERSION: &str = "0.1.0";  // Foundation crate version
pub const API_VERSION: &str = "0.1.0";         // Plugin API version
pub const MIN_SUPPORTED_API_VERSION: &str = "0.1.0";  // Minimum compatible API
```

### PluginVersionInfo

```rust
pub struct PluginVersionInfo {
    pub plugin_version: String,      // Your plugin version
    pub foundation_version: String,  // Foundation crate version at build time
    pub api_version: String,         // Plugin API version at build time
    pub build_timestamp: String,     // When plugin was built
    pub git_commit: Option<String>,  // Git commit hash (if available)
}

impl PluginVersionInfo {
    fn new(plugin_version: &str) -> Self;
    fn with_git_commit(self, commit: Option<String>) -> Self;
}
```

### VersionCompatibility

```rust
pub enum VersionCompatibility {
    Compatible,                           // Fully compatible
    CompatibleOlder { plugin_api: String, engine_api: String },  // Older but works
    CompatibleNewer { plugin_api: String, engine_api: String },  // Newer but works
    IncompatibleMajor { plugin_api: String, engine_api: String, reason: String },
    TooOld { plugin_api: String, min_supported: String },
}

impl VersionCompatibility {
    fn is_loadable(&self) -> bool;
    fn warning_message(&self) -> Option<String>;
}
```

### Version Functions

```rust
// Check if a plugin's API version is compatible with the engine
pub fn check_api_compatibility(plugin_api_version: &str) -> VersionCompatibility;

// Check full version compatibility for a plugin
pub fn check_plugin_compatibility(version_info: &PluginVersionInfo) -> VersionCompatibility;

// Format version info for logging
pub fn format_version_info(info: &PluginVersionInfo) -> String;
```

---

## Configuration Schemas

Enhanced configuration schemas with UI rendering hints.

### EnhancedConfigSchema

```rust
pub struct EnhancedConfigSchema {
    pub schema: serde_json::Value,     // Standard JSON Schema
    pub ui_schema: Option<UiSchema>,   // UI rendering hints
}
```

### UiSchema

```rust
pub struct UiSchema {
    pub field_order: Vec<String>,             // Order to display fields
    pub widgets: HashMap<String, WidgetType>, // Widget type for each field
    pub groups: Vec<FieldGroup>,              // Field groupings
    pub templates: Vec<ConfigTemplate>,       // Quick start templates
}
```

### WidgetType

```rust
pub enum WidgetType {
    NumberSpinner { min: Option<i64>, max: Option<i64>, step: Option<i64> },
    DurationPicker,
    ToggleSwitch,
    Select { options: Vec<SelectOption> },
    UrlInput { placeholder: Option<String> },
    TextInput { placeholder: Option<String>, multiline: bool },
    FilePathPicker { mode: FilePickerMode },
    JsonEditor,
}
```

| Widget | Use Case |
|--------|----------|
| `NumberSpinner` | Numeric input with min/max/step controls |
| `DurationPicker` | Time duration (e.g., "5s", "10m", "1h") |
| `ToggleSwitch` | Boolean on/off toggle |
| `Select` | Dropdown selection |
| `UrlInput` | URL with validation |
| `TextInput` | Text entry (single or multiline) |
| `FilePathPicker` | File/directory browser |
| `JsonEditor` | Raw JSON editing |

### SelectOption

```rust
pub struct SelectOption {
    pub value: String,
    pub label: String,
    pub icon: Option<String>,
}
```

### FilePickerMode

```rust
pub enum FilePickerMode {
    File,
    Directory,
    Both,
}
```

### FieldGroup

```rust
pub struct FieldGroup {
    pub id: String,
    pub title: String,
    pub fields: Vec<String>,
    pub collapsible: bool,
    pub default_collapsed: bool,
}
```

### ConfigTemplate

```rust
pub struct ConfigTemplate {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: Option<String>,
    pub config: serde_json::Value,
}
```

---

## Channel & IO

High-performance channel connections for plugin communication.

### Channel Constants

```rust
pub const DEFAULT_CHANNEL_CAPACITY: usize = 100;
pub const HIGH_THROUGHPUT_CHANNEL_CAPACITY: usize = 10_000;
```

### BackpressureStrategy

```rust
pub enum BackpressureStrategy {
    DropOldest,  // Drop oldest messages when buffer is full (default)
    Block,       // Block sender until space is available
    DropNewest,  // Drop newest (incoming) messages when full
}

impl BackpressureStrategy {
    fn from_str(s: &str) -> Self;
}
```

### ChannelConfig

```rust
pub struct ChannelConfig {
    pub capacity: usize,
    pub backpressure: BackpressureStrategy,
}

impl ChannelConfig {
    fn default() -> Self;                       // 100 capacity, DropOldest
    fn high_throughput() -> Self;               // 10,000 capacity, Block
    fn aggregation(batch_size: usize) -> Self;  // batch_size * 10 capacity, Block
}
```

### Global Event Counter

```rust
// Get total number of events processed system-wide
pub fn get_global_event_count() -> u64;
```

---

## Model Service

Interface for AI model access within plugins.

### ModelService Trait

```rust
#[async_trait]
pub trait ModelService: Send + Sync {
    /// Get configuration for a specific model (or default if None)
    async fn get_model(&self, model_id: Option<String>) -> Option<ModelConfig>;
    
    /// List all available models
    async fn list_models(&self) -> Vec<(String, ModelConfig)>;
    
    /// Get API key for a backend
    async fn get_api_key(&self, backend: String) -> Option<String>;
}
```

### ModelConfig

```rust
pub struct ModelConfig {
    pub display_name: String,
    pub description: String,
    pub backend: String,                   // e.g., "ollama", "openai"
    pub protocol: Option<ModelProtocol>,
    pub path: Option<String>,              // For GGUF models
    pub endpoint: Option<String>,          // API endpoint
    pub model_name: Option<String>,        // Model name for API calls
    pub api_key_env: Option<String>,       // Env var for API key
    pub context_size: u32,                 // Default: 4096
    pub capabilities: Vec<ModelCapability>,
    pub available: bool,
}
```

### ModelProtocol

```rust
pub enum ModelProtocol {
    Gguf,       // Native GGUF via llama.cpp
    Ollama,     // Ollama local API
    OpenAi,     // OpenAI API (or compatible)
    Anthropic,  // Anthropic API
}
```

### ModelCapability

```rust
pub enum ModelCapability {
    Chat,
    Completion,
    Tools,
    Vision,
    Embeddings,
}
```

### Chat Types

```rust
pub enum Role {
    System,
    User,
    Assistant,
    Tool,
}

pub struct ChatMessage {
    pub role: Role,
    pub content: String,
    pub images: Option<Vec<String>>,  // base64 encoded
}

impl ChatMessage {
    fn new(role: Role, content: impl Into<String>) -> Self;
}
```

---

## Testing Utilities

Helpers for unit testing plugins without the engine.

### MockContext

Mock implementation of `SharedContext` that captures log messages.

```rust
pub struct MockContext {
    // Internal state for capturing logs
}

impl MockContext {
    fn new(package: &str, tool: &str, instance: u64) -> Self;
    fn with_config(self, config: impl Into<String>) -> Self;
    
    // Log inspection
    fn logs(&self) -> Vec<(LogLevel, String)>;
    fn errors(&self) -> Vec<String>;
    fn warnings(&self) -> Vec<String>;
    fn infos(&self) -> Vec<String>;
    fn has_log_containing(&self, substring: &str) -> bool;
    fn activity_count(&self) -> u32;
    fn clear_logs(&self);
}

pub enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
}
```

### TestPluginContext\<C\>

Test harness that wraps a `PluginContext` and captures outputs.

```rust
pub struct TestPluginContext<C> {
    // Internal state
}

impl<C: Clone + Send + Sync + Default + DeserializeOwned + 'static> TestPluginContext<C> {
    fn new(package: &str, tool: &str) -> Self;
    fn with_config(config: C, package: &str, tool: &str) -> Self;
    fn with_instance(package: &str, tool: &str, instance: u64) -> Self;
    
    // Get the actual context for testing
    fn plugin_context(&self) -> PluginContext<C>;
    
    // Output inspection
    fn take_outputs(&self) -> Vec<serde_json::Value>;
    fn output_count(&self) -> usize;
    
    // Alert inspection
    fn take_alerts(&self) -> Vec<Alert>;
    fn has_alert(&self, substring: &str) -> bool;
    
    // Log inspection (delegates to MockContext)
    fn has_log(&self, substring: &str) -> bool;
    fn errors(&self) -> Vec<String>;
}
```

### Example Test

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use foundation::test_utils::TestPluginContext;

    #[tokio::test]
    async fn test_my_tool() {
        // Create test context with config
        let test_ctx = TestPluginContext::<MyConfig>::with_config(
            MyConfig { field: "value".to_string() },
            "mypackage",
            "mytool"
        );
        
        // Get the PluginContext
        let ctx = test_ctx.plugin_context();
        
        // Prepare input
        let input = serde_json::to_vec(&json!({"test": true})).unwrap();
        
        // Call tool
        let result = MyTool::process(&ctx, Some(input)).await;
        assert!(result.is_ok());
        
        // Check outputs
        let outputs = test_ctx.take_outputs();
        assert_eq!(outputs.len(), 1);
        
        // Check logs
        assert!(test_ctx.has_log("Processing"));
        assert!(test_ctx.errors().is_empty());
    }
}
```

---

## Re-exports

The `foundation` crate re-exports commonly used types at the root level:

```rust
// Plugin context and handlers
pub use plugin_interface::plugin_context::PluginContext;
pub use plugin_interface::tool_handler::ToolHandlerType;
pub use plugin_interface::category::{Category, categories};
pub use plugin_interface::plugin::ProcessingCapabilities;

// Channel configuration
pub use io::concrete_connection::{
    ChannelConfig, BackpressureStrategy,
    DEFAULT_CHANNEL_CAPACITY, HIGH_THROUGHPUT_CHANNEL_CAPACITY,
    get_global_event_count,
};

// Alert types
pub use alert::{Alert, AlertBuilder, AlertSeverity, AlertSource, AlertSummary};
pub use alert::{register_alert_sender, unregister_alert_sender, get_alert_sender};

// Version types
pub use version::{
    FOUNDATION_VERSION, API_VERSION, MIN_SUPPORTED_API_VERSION,
    PluginVersionInfo, VersionCompatibility,
    check_api_compatibility, check_plugin_compatibility, format_version_info,
};

// Config schema types
pub use config_schema::{
    EnhancedConfigSchema, UiSchema, WidgetType, SelectOption, 
    FilePickerMode, FieldGroup, ConfigTemplate,
};

// base64 for plugin! macro
pub use base64;
```

---

## Related Resources

- [Plugin Developer Guide](./PLUGIN_DEVELOPER_GUIDE.md) - Tutorial for building plugins
- [Plugin Reference](./PLUGIN_REFERENCE.md) - List of built-in plugins
- [Plugin Style Guide](./PLUGIN_STYLE_GUIDE.md) - Visual design guidelines
- [REST API Reference](./REST_API_REFERENCE.md) - HTTP API documentation
- [Configuration](./CONFIGURATION.md) - Engine configuration options

---

*Foundation API v0.1.0 | Undergrowth Plugin SDK*
