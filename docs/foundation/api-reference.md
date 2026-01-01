---
sidebar_position: 2
---

# Foundation API Reference

Complete reference for the Foundation crate public API. Foundation is the stable public interface for building Undergrowth plugins—no engine internals required.

---

## Overview

```rust
// Add foundation to your plugin's Cargo.toml
[dependencies]
foundation = { path = "../../foundation" }
```

Foundation re-exports commonly used types for convenience:

```rust
use foundation::{
    // Core plugin traits
    PluginContext, VariationHandlerType, ProcessingCapabilities,
    
    // Categories
    Category, categories,
    
    // Alerts
    Alert, AlertBuilder, AlertSeverity, AlertSource, AlertSummary,
    
    // Channel configuration
    ChannelConfig, BackpressureStrategy,
    DEFAULT_CHANNEL_CAPACITY, HIGH_THROUGHPUT_CHANNEL_CAPACITY,
    
    // Version info
    FOUNDATION_VERSION, API_VERSION, PluginVersionInfo,
    
    // Config schemas
    EnhancedConfigSchema, UiSchema, WidgetType, SelectOption,
};
```

---

## Core Traits

### VariationHandlerType

The **only** trait plugin creators must implement for each variation. All boilerplate is handled by the `plugin!` macro.

```rust
pub trait VariationHandlerType: Send + Sync + 'static {
    /// The config type this handler uses
    type Config: Clone + Send + Sync + Default + serde::de::DeserializeOwned + 'static;
    
    /// Process incoming data (REQUIRED)
    fn process(
        ctx: &PluginContext<Self::Config>,
        data: Option<Vec<u8>>,
    ) -> impl Future<Output = Result<(), String>> + Send;
    
    /// Called on start (optional)
    fn on_start(ctx: &PluginContext<Self::Config>) 
        -> impl Future<Output = Result<(), String>> + Send;
    
    /// Called on stop (optional)
    fn on_stop(ctx: &PluginContext<Self::Config>) 
        -> impl Future<Output = Result<(), String>> + Send;
    
    /// Batch processing (optional - default calls process() for each)
    fn process_batch(
        ctx: &PluginContext<Self::Config>,
        batch: Vec<Option<Vec<u8>>>,
    ) -> impl Future<Output = Vec<Result<(), String>>> + Send;
    
    /// Processing capabilities (optional)
    fn capabilities() -> ProcessingCapabilities;
    
    /// Enhanced config schema for UI (optional)
    fn enhanced_schema() -> Option<EnhancedConfigSchema>;
}
```

#### Example Implementation

```rust
use foundation::{PluginContext, VariationHandlerType};
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

#[derive(Clone, Default, Serialize, Deserialize, JsonSchema)]
pub struct TimerConfig {
    pub interval: u64,
    pub units: String,
}

pub struct IntervalTimer;

impl VariationHandlerType for IntervalTimer {
    type Config = TimerConfig;
    
    async fn process(
        ctx: &PluginContext<Self::Config>, 
        _data: Option<Vec<u8>>
    ) -> Result<(), String> {
        ctx.send(serde_json::json!({
            "type": "tick",
            "timestamp": std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        })).await;
        Ok(())
    }
    
    async fn on_start(ctx: &PluginContext<Self::Config>) -> Result<(), String> {
        ctx.info(format!("Timer started: {}s interval", ctx.config.interval));
        Ok(())
    }
}
```

---

## PluginContext

The primary interface for variation logic to interact with the plugin system. Provides typed access to configuration, output sending, logging, and alerts.

```rust
pub struct PluginContext<C: Clone + Send + Sync + 'static> {
    /// The parsed configuration for this plugin instance
    pub config: C,
    /// Component identification and metadata
    pub info: ComponentInfo,
    /// Sandboxed data directory for file operations
    pub data_dir: std::path::PathBuf,
}
```

### Output Methods

| Method | Description |
|--------|-------------|
| `send(value: serde_json::Value)` | Send JSON to downstream plugins |
| `send_blocking(value)` | Send with backpressure support |
| `send_batch(values: Vec<Value>)` | Send multiple values efficiently |
| `send_batch_blocking(values)` | Batch send with backpressure |
| `send_value<T: Serialize>(value: &T)` | Send a serializable value |
| `send_values<T: Serialize>(values: &[T])` | Send batch of serializable values |
| `queue_depth() -> usize` | Get current output queue depth |

#### Example

```rust
// Send single value
ctx.send(serde_json::json!({"status": "complete"})).await;

// Send typed struct
#[derive(Serialize)]
struct SensorReading { temp: f64, unit: String }
ctx.send_value(&SensorReading { temp: 25.5, unit: "C".into() }).await;

// Batch send for high-throughput
let batch: Vec<serde_json::Value> = data.iter()
    .map(|d| serde_json::to_value(d).unwrap())
    .collect();
let sent_count = ctx.send_batch(batch).await;
```

### Logging Methods

| Method | Description |
|--------|-------------|
| `info(msg)` | Log informational message |
| `warn(msg)` | Log warning message |
| `error(msg)` | Log error message |

```rust
ctx.info("Processing started");
ctx.warn(format!("Slow API response: {}ms", elapsed));
ctx.error("Failed to connect to database");
```

### Identity Methods

| Method | Returns |
|--------|---------|
| `variation()` | Variation name (e.g., `"timer"`) |
| `id()` | Full component ID (e.g., `"time:timer:0"`) |
| `short_id()` | Short ID for logging |

### Alert Methods

See [Alerts](#alerts) section below.

---

## Alerts

Plugins can raise alerts to notify operators of problems, warnings, or events. Alerts are collected by the engine and viewable via Web UI or REST API.

### AlertSeverity

| Level | Priority | Usage |
|-------|----------|-------|
| `Info` | 0 | Informational events |
| `Warning` | 1 | Needs attention, not critical |
| `Error` | 2 | Something failed, action needed |
| `Critical` | 3 | Immediate attention required |

### Raising Alerts

```rust
// Using AlertBuilder fluent API
ctx.alert(AlertSeverity::Warning, "Temperature exceeded threshold")
    .with_metadata("temperature", 95.5)
    .with_metadata("threshold", 80.0)
    .send()
    .await;

// Convenience methods
ctx.alert_info("Backup completed successfully").send().await;
ctx.alert_warning("Disk usage above 80%").send().await;
ctx.alert_error("API request failed").send().await;
ctx.alert_critical("Database connection lost").send().await;
```

### Alert Structure

```rust
pub struct Alert {
    pub id: String,                           // Unique alert ID
    pub severity: AlertSeverity,               // Info/Warning/Error/Critical
    pub message: String,                       // Alert message
    pub source: AlertSource,                   // Plugin source info
    pub timestamp: u64,                        // Unix timestamp (ms)
    pub metadata: HashMap<String, Value>,      // Additional data
    pub acknowledged: bool,                    // Acknowledgment status
    pub acknowledged_by: Option<String>,       // Who acknowledged
    pub acknowledged_at: Option<u64>,          // When acknowledged
}

pub struct AlertSource {
    pub plugin_id: String,    // "package:variation:instance"
    pub package: String,      // Plugin package name
    pub variation: String,    // Variation name
    pub instance: u64,        // Instance number
    pub job_id: Option<String>,
    pub workflow_id: Option<String>,
}
```

---

## Categories

Hierarchical categorization system for organizing plugins in the UI.

### Standard Categories

```rust
use foundation::categories;

// Data categories
categories::DATA                    // "Data"
categories::DATA_TRANSFORM          // "Data/Transform"
categories::DATA_STORAGE_DATABASE   // "Data/Storage/Database"
categories::DATA_JSON               // "Data/JSON"

// Logic & Control
categories::LOGIC                   // "Logic"
categories::LOGIC_CONDITIONAL       // "Logic/Conditional"

// Time & Scheduling
categories::TIME_TRIGGER            // "Time/Trigger"
categories::TIME_SCHEDULE           // "Time/Schedule"

// Communication
categories::COMMUNICATION_HTTP      // "Communication/HTTP"
categories::COMMUNICATION_NOTIFICATION // "Communication/Notification"

// IoT & Protocols
categories::IOT_PROTOCOL_MQTT       // "IoT/Protocol/MQTT"
categories::IOT_PROTOCOL_MODBUS     // "IoT/Protocol/Modbus"

// Hardware Interfaces
categories::HARDWARE_GPIO           // "Hardware/GPIO"
categories::HARDWARE_I2C            // "Hardware/I2C"

// AI & ML
categories::AI_LLM                  // "AI/LLM"
categories::AI_VISION               // "AI/Vision"

// Monitoring
categories::MONITORING_ALERTING     // "Monitoring/Alerting"
```

### Category API

```rust
use foundation::Category;

let cat = Category::new("IoT/Protocol/MQTT");

cat.path()       // "IoT/Protocol/MQTT"
cat.segments()   // ["IoT", "Protocol", "MQTT"]
cat.depth()      // 3
cat.root()       // Some("IoT")
cat.leaf()       // Some("MQTT")
cat.parent()     // Some(Category("IoT/Protocol"))

// Hierarchy checking
let iot = Category::new("IoT");
cat.is_under(&iot)         // true
cat.matches_or_under(&iot) // true

// Building categories
let protocol = iot.child("Protocol");  // "IoT/Protocol"
```

---

## Channel Configuration

Configure inter-plugin communication channels for different throughput requirements.

### BackpressureStrategy

| Strategy | Behavior |
|----------|----------|
| `DropOldest` | Drop oldest messages when full (default) |
| `Block` | Block sender until space available |
| `DropNewest` | Drop incoming messages when full |

### ChannelConfig

```rust
pub struct ChannelConfig {
    pub capacity: usize,              // Buffer size
    pub backpressure: BackpressureStrategy,
    pub batch_size_hint: usize,       // Hint for consumers (0 = no batching)
}

// Presets
ChannelConfig::default()          // 100 capacity, DropOldest
ChannelConfig::high_throughput()  // 10,000 capacity, Block, batch 1000
ChannelConfig::aggregation(500)   // 1000 capacity, Block, batch 500
```

### Constants

```rust
pub const DEFAULT_CHANNEL_CAPACITY: usize = 100;
pub const HIGH_THROUGHPUT_CHANNEL_CAPACITY: usize = 10_000;
```

---

## Processing Capabilities

Advertise what processing modes your plugin supports.

```rust
#[derive(Debug, Clone, Copy, Default)]
pub struct ProcessingCapabilities {
    pub supports_batch: bool,        // Batch processing supported
    pub supports_streaming: bool,    // Streaming mode supported
    pub preferred_batch_size: u32,   // Preferred batch size (0 = no preference)
    pub max_batch_size: u32,         // Maximum batch size (0 = unlimited)
}
```

```rust
impl VariationHandlerType for MyHandler {
    fn capabilities() -> ProcessingCapabilities {
        ProcessingCapabilities {
            supports_batch: true,
            preferred_batch_size: 100,
            max_batch_size: 1000,
            ..Default::default()
        }
    }
}
```

---

## Configuration Schemas

Provide enhanced schemas for smarter UI rendering.

### EnhancedConfigSchema

```rust
pub struct EnhancedConfigSchema {
    pub schema: serde_json::Value,       // Standard JSON Schema
    pub ui_schema: Option<UiSchema>,     // UI rendering hints
}

pub struct UiSchema {
    pub field_order: Vec<String>,        // Field display order
    pub widgets: HashMap<String, WidgetType>,
    pub groups: Vec<FieldGroup>,         // Field groupings
    pub templates: Vec<ConfigTemplate>,  // Quick-start templates
}
```

### Widget Types

| Widget | Description |
|--------|-------------|
| `NumberSpinner { min, max, step }` | Numeric input with controls |
| `DurationPicker` | Smart duration input (e.g., "5s", "10m") |
| `ToggleSwitch` | Boolean toggle |
| `Select { options }` | Dropdown select |
| `UrlInput { placeholder }` | URL with validation |
| `TextInput { placeholder, multiline }` | Text input |
| `FilePathPicker { mode }` | File/directory picker |
| `JsonEditor` | JSON editor for complex values |

### Example

```rust
impl VariationHandlerType for Timer {
    fn enhanced_schema() -> Option<EnhancedConfigSchema> {
        Some(EnhancedConfigSchema {
            schema: schemars::schema_for!(TimerConfig),
            ui_schema: Some(UiSchema {
                field_order: vec!["interval".into(), "units".into()],
                widgets: [
                    ("interval".into(), WidgetType::NumberSpinner {
                        min: Some(1), max: Some(86400), step: Some(1)
                    }),
                    ("units".into(), WidgetType::Select {
                        options: vec![
                            SelectOption { value: "seconds".into(), label: "Seconds".into(), icon: None },
                            SelectOption { value: "minutes".into(), label: "Minutes".into(), icon: None },
                        ]
                    }),
                ].into(),
                groups: vec![],
                templates: vec![],
            }),
        })
    }
}
```

---

## Plugin Macros

### plugin!

The recommended way to define plugins. Generates all boilerplate code.

```rust
foundation::plugin! {
    name: "time",
    version: "0.1.0",
    variations: [
        {
            name: "timer",
            handler: IntervalTimer,
            category: categories::TIME_TRIGGER,
            description: "Emits events at regular intervals",
            icon: "⏱️",
            color: "#3498db",
            inputs: [],
            output: JSON_TYPE,
            config: TimerConfig,
        },
        {
            name: "delay",
            handler: DelayHandler,
            category: categories::TIME_DELAY,
            description: "Delays incoming data",
            icon: "⏸️",
            color: "#9b59b6",
            inputs: [JSON_TYPE],
            output: JSON_TYPE,
            config: DelayConfig,
        },
    ],
}
```

### define_plugin_factory!

Lower-level macro for more control.

```rust
foundation::define_plugin_factory! {
    variations: [
        {
            name: "filewriter",
            plugin: FileWriter,
            icon: "📄",
            color: "#3498db",
            inputs: [JSON_TYPE],
            output: JSON_TYPE,
            config: FileConfig,
        },
    ],
}
```

---

## Version Constants

```rust
pub const FOUNDATION_VERSION: &str = "0.1.0";  // Foundation crate version
pub const API_VERSION: u32 = 1;                 // Plugin API version
pub const MIN_SUPPORTED_API_VERSION: u32 = 1;   // Minimum compatible version

pub struct PluginVersionInfo {
    pub foundation_version: String,
    pub api_version: u32,
    pub plugin_version: String,
}

// Check compatibility
let compat = check_api_compatibility(plugin_api_version);
match compat {
    VersionCompatibility::Compatible => { /* OK */ }
    VersionCompatibility::Deprecated => { /* Warn */ }
    VersionCompatibility::Incompatible => { /* Error */ }
}
```

---

## Complete Plugin Example

```rust
use foundation::{
    PluginContext, VariationHandlerType, AlertSeverity,
    categories, ProcessingCapabilities,
};
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

// 1. Define config
#[derive(Clone, Default, Serialize, Deserialize, JsonSchema)]
pub struct HttpConfig {
    pub method: String,
    pub url: String,
    pub headers: Option<std::collections::HashMap<String, String>>,
    pub body: Option<String>,
}

// 2. Define handler
pub struct HttpRequest;

impl VariationHandlerType for HttpRequest {
    type Config = HttpConfig;
    
    async fn process(
        ctx: &PluginContext<Self::Config>,
        data: Option<Vec<u8>>,
    ) -> Result<(), String> {
        let client = reqwest::Client::new();
        
        let response = client
            .request(
                ctx.config.method.parse().unwrap_or(reqwest::Method::GET),
                &ctx.config.url
            )
            .send()
            .await
            .map_err(|e| e.to_string())?;
            
        if !response.status().is_success() {
            ctx.alert_warning(format!("HTTP {} returned {}", 
                ctx.config.method, response.status()))
                .with_metadata("url", &ctx.config.url)
                .send().await;
        }
        
        let body = response.text().await.map_err(|e| e.to_string())?;
        ctx.send(serde_json::json!({
            "status": "success",
            "body": body
        })).await;
        
        Ok(())
    }
    
    fn capabilities() -> ProcessingCapabilities {
        ProcessingCapabilities::default()
    }
}

// 3. Export plugin
foundation::plugin! {
    name: "http",
    version: "0.1.0",
    variations: [
        {
            name: "request",
            handler: HttpRequest,
            category: categories::COMMUNICATION_HTTP,
            description: "Make HTTP requests (GET, POST, PUT, etc.)",
            icon: "🌐",
            color: "#e74c3c",
            inputs: [JSON_TYPE],
            output: JSON_TYPE,
            config: HttpConfig,
        },
    ],
}
```

---

## See Also

- [Plugin Developer Guide](/docs/plugins/developer-guide) — Step-by-step plugin creation
- [Plugin Reference](/docs/plugins/reference) — All 50+ built-in variations
- [Architecture](/docs/foundation/architecture) — System internals
