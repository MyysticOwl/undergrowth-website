---
sidebar_position: 2
title: Developer Guide
---

# Undergrowth Plugin Developer Guide

A comprehensive guide for developing, testing, and maintaining plugins for the Undergrowth workflow automation system.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Getting Started](#getting-started)
4. [Creating Your First Plugin](#creating-your-first-plugin)
5. [Plugin Structure](#plugin-structure)
6. [Variation Handlers](#variation-handlers)
7. [Configuration & Schemas](#configuration--schemas)
8. [Categories](#categories)
9. [Testing Plugins](#testing-plugins)
10. [Versioning System](#versioning-system)
11. [ABI Compatibility](#abi-compatibility)
12. [Deprecation Strategy](#deprecation-strategy)
13. [Web Interface Integration](#web-interface-integration)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)

---

## Introduction

Undergrowth is a modular workflow automation system built in Rust. The plugin system allows you to extend the engine's capabilities by creating reusable components that can be connected together in workflows.

### Key Concepts

- **Plugin**: A compiled DLL/shared library containing one or more variations
- **Variation**: A specific behavior within a plugin (e.g., a "file" plugin might have "reader" and "writer" variations)
- **Workflow**: A graph of connected plugin instances that process data
- **Job**: A running instance of a workflow

### Architecture Layers

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                        Web UI (React)                        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                      REST API (Axum)                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                    Engine (Proprietary)                      â”‚
â”‚   â€¢ Plugin Loading   â€¢ Workflow Management   â€¢ Job Execution â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                   Foundation (Public API)                    â”‚
â”‚   â€¢ PluginApi trait   â€¢ VariationsApi   â€¢ plugin! macro     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                     Your Plugins (DLLs)                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Architecture Overview

### Public vs. Proprietary Separation

| Crate | Type | Purpose |
|-------|------|---------|
| **foundation** | Public API | The stable interface for plugin development. Contains traits, macros, and types. |
| **engine** | Proprietary | The runtime that loads and orchestrates plugins. Plugin authors should NOT depend on this. |
| **components/** | Plugins | Concrete plugin implementations. Each depends ONLY on `foundation`. |

**Key Invariant**: Plugins can be built and distributed using only the `foundation` crate. They have no compile-time dependency on the engine.

### Dependency Graph

```
foundation  <â”€â”€  components/time
            <â”€â”€  components/file
            <â”€â”€  components/ai
            <â”€â”€  components/http
            <â”€â”€  engine
```

---

## Getting Started

### Prerequisites

- Rust 1.70+ with `cargo`
- The Undergrowth workspace cloned locally
- Basic understanding of async Rust

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd undergrowth
   ```

2. **Build all components**:
   ```bash
   cargo build
   ```

3. **Run the engine** (loads plugins from `target/debug/`):
   ```bash
   cargo run -- --config data/app_config.json
   ```

4. **Access the Web UI**: http://localhost:3000

### Plugin Directory Structure

```
components/
â”œâ”€â”€ time/                  # Example plugin
â”‚   â”œâ”€â”€ Cargo.toml
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ lib.rs         # Plugin registration
â”‚       â”œâ”€â”€ timer.rs       # Timer variation
â”‚       â”œâ”€â”€ delay.rs       # Delay variation
â”‚       â””â”€â”€ timeofday.rs   # Time-of-day variation
â”œâ”€â”€ file/
â”œâ”€â”€ http/
â””â”€â”€ ai/
```

---

## Creating Your First Plugin

### Step 1: Create the Plugin Directory

```bash
mkdir -p components/myplugin/src
cd components/myplugin
```

### Step 2: Create `Cargo.toml`

```toml
[package]
name = "myplugin"
version = "0.1.0"
edition = "2021"

[dependencies]
async-trait = "0.1"
log = "0.4"
savefile = "0.20"
savefile-abi = "0.20"
savefile-derive = "0.20"
schemars = "1.1"
serde = "1.0"
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }

[dependencies.foundation]
version = "0.1.0"
path = "../../foundation"

[lib]
name = "myplugin"
crate-type = ["cdylib"]
```

### Step 3: Create Your Variation (`src/echo.rs`)

```rust
//! Echo variation - echoes input data with a prefix

use crate::MyConfig;
use foundation::{PluginContext, VariationHandlerType};

pub struct Echo;

impl VariationHandlerType for Echo {
    type Config = MyConfig;

    async fn process(ctx: &PluginContext<MyConfig>, data: Option<Vec<u8>>) -> Result<(), String> {
        // Log what we're doing
        ctx.info("Echo processing input");
        
        // Parse incoming data
        let input = data
            .map(|d| String::from_utf8_lossy(&d).to_string())
            .unwrap_or_else(|| "no input".to_string());
        
        // Apply prefix from config
        let output = format!("{}: {}", ctx.config.prefix, input);
        
        // Send to connected downstream plugins
        ctx.send(serde_json::json!({
            "message": output,
            "timestamp": std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()
        })).await;
        
        ctx.info("Echo sent output");
        Ok(())
    }

    async fn on_start(ctx: &PluginContext<MyConfig>) -> Result<(), String> {
        ctx.info(format!("Echo starting with prefix: {}", ctx.config.prefix));
        Ok(())
    }
}
```

### Step 4: Create Plugin Entry Point (`src/lib.rs`)

```rust
//! MyPlugin - A simple example plugin

use foundation::plugin_interface::plugin::PluginApi;
use foundation::plugin_interface::variations::VariationsApi;
use foundation::categories;
use savefile_derive::savefile_abi_export;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

// ============================================================
// Variation Modules (one per file)
// ============================================================

mod echo;
pub use echo::Echo;

// ============================================================
// Configuration
// ============================================================

#[derive(Debug, Default, Clone, Serialize, Deserialize, JsonSchema)]
pub struct MyConfig {
    /// Prefix to add to echoed messages
    #[serde(default = "default_prefix")]
    pub prefix: String,
}

fn default_prefix() -> String {
    "Echo".to_string()
}

// ============================================================
// Plugin Registration
// ============================================================

foundation::plugin! {
    name: "MyPlugin",
    version: "0.1.0",
    author: "Your Name",
    description: "A simple echo plugin for demonstration",
    config: MyConfig,
    variations: {
        "echo" => Echo { icon: "ðŸ”Š", color: "#3498db", category: categories::UTILITY },
    }
}
```

### Step 5: Build and Test

```bash
# Build all plugins
cargo build

# Run the engine (it will discover your plugin)
cargo run -- --config data/app_config.json
```

---

## Plugin Structure

### File Organization Rules

**Each variation MUST be in its own file.** This keeps code organized and maintainable.

```
components/myplugin/src/
â”œâ”€â”€ lib.rs           # Plugin registration ONLY
â”œâ”€â”€ echo.rs          # Echo variation
â”œâ”€â”€ transform.rs     # Transform variation
â””â”€â”€ validate.rs      # Validate variation
```

### What Goes in `lib.rs`

- Module declarations (`mod echo; mod transform;`)
- Public re-exports (`pub use echo::Echo;`)
- Shared configuration structs
- Shared helper functions
- The `plugin!` macro invocation

**Never put `VariationHandlerType` implementations directly in `lib.rs`.**

### The `plugin!` Macro

The macro generates approximately 300 lines of boilerplate including:

- Plugin dispatcher implementing `PluginApi`
- Connection setup (input/output channels)
- Config parsing with error handling
- Receive loop with stop signal handling
- Variation routing
- `VariationsApi` implementation
- ABI exports

```rust
foundation::plugin! {
    name: "PluginName",           // Display name
    version: "0.1.0",             // SemVer version
    author: "Author Name",        // Author info
    description: "Description",   // Brief description
    config: MyConfig,             // Config struct type
    variations: {
        "variation_name" => VariationType { 
            icon: "ðŸ”§",           // Emoji icon for UI
            color: "#3498db",     // Hex color for UI
            category: categories::UTILITY,  // Category path
        },
    }
}
```

---

## Variation Handlers

### The `VariationHandlerType` Trait

This is the **only trait** you need to implement for each variation:

```rust
pub trait VariationHandlerType: Send + Sync + 'static {
    /// The config type this handler uses
    type Config: Clone + Send + Sync + Default + serde::de::DeserializeOwned + 'static;
    
    /// Process incoming data (REQUIRED)
    fn process(
        ctx: &PluginContext<Self::Config>,
        data: Option<Vec<u8>>,
    ) -> impl std::future::Future<Output = Result<(), String>> + Send;
    
    /// Called on start (optional)
    fn on_start(
        _ctx: &PluginContext<Self::Config>,
    ) -> impl std::future::Future<Output = Result<(), String>> + Send {
        async { Ok(()) }
    }
    
    /// Called on stop (optional)
    fn on_stop(
        _ctx: &PluginContext<Self::Config>,
    ) -> impl std::future::Future<Output = Result<(), String>> + Send {
        async { Ok(()) }
    }
}
```

### PluginContext API

The `PluginContext<C>` provides everything your variation needs:

```rust
impl<C> PluginContext<C> {
    // Configuration
    pub config: C,                      // Your parsed config
    pub info: ComponentInfo,            // Plugin metadata
    
    // Output
    pub async fn send(&self, value: serde_json::Value);
    pub async fn send_value<T: Serialize>(&self, value: &T);
    
    // Logging
    pub fn info(&self, msg: impl Into<String>);
    pub fn warn(&self, msg: impl Into<String>);
    pub fn error(&self, msg: impl Into<String>);
    
    // Alerting (see Alerting section below)
    pub fn alert(&self, severity: AlertSeverity, message: &str) -> AlertBuilder;
    pub fn alert_info(&self, message: &str) -> AlertBuilder;
    pub fn alert_warning(&self, message: &str) -> AlertBuilder;
    pub fn alert_error(&self, message: &str) -> AlertBuilder;
    pub fn alert_critical(&self, message: &str) -> AlertBuilder;
    
    // Identity
    pub fn variation(&self) -> &str;    // "echo"
    pub fn id(&self) -> String;         // "myplugin:echo:0"
    pub fn short_id(&self) -> String;   // "myplugin:echo:0"
}
```

### Alerting System

Plugins can raise alerts to notify operators of problems, warnings, or important events. Alerts are collected by the engine and can be viewed via the Web UI or REST API.

#### Alert Severities

| Severity | Use Case |
|----------|----------|
| `Info` | Informational events (job started, file processed) |
| `Warning` | Non-critical issues (slow response, retry needed) |
| `Error` | Errors that don't stop operation (API error, parse failure) |
| `Critical` | Immediate attention required (service down, hardware failure) |

#### Sending Alerts

```rust
use foundation::{AlertSeverity, PluginContext, VariationHandlerType};

async fn process(ctx: &PluginContext<Config>, _data: Option<Vec<u8>>) -> Result<(), String> {
    // Simple alert
    ctx.alert_warning("Connection retried 3 times").send().await;
    
    // Alert with metadata
    ctx.alert(AlertSeverity::Error, "Failed to connect to service")
        .with_metadata("service", "database")
        .with_metadata("retry_count", 3)
        .with_metadata("last_error", "Connection refused")
        .send()
        .await;
    
    // Critical alert for serious issues
    if temperature > max_temp {
        ctx.alert_critical("Temperature threshold exceeded")
            .with_metadata("current_temp", temperature)
            .with_metadata("max_temp", max_temp)
            .send()
            .await;
    }
    
    Ok(())
}
```

#### Alert Structure

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "severity": "error",
    "message": "Failed to connect to service",
    "source": {
        "plugin_id": "mypackage:myvariation:0",
        "package": "mypackage",
        "variation": "myvariation",
        "instance": 0,
        "job_id": "job-123",
        "workflow_id": "workflow-456"
    },
    "timestamp": 1704067200000,
    "metadata": {
        "service": "database",
        "retry_count": 3
    },
    "acknowledged": false
}
```

#### Testing Alerts

Use `TestPluginContext` to capture and verify alerts in tests:

```rust
use foundation::test_utils::TestPluginContext;
use foundation::AlertSeverity;

#[tokio::test]
async fn test_alert_on_error() {
    let test_ctx: TestPluginContext<MyConfig> = TestPluginContext::new("pkg", "var");
    let ctx = test_ctx.plugin_context();
    
    // Call your handler
    MyVariation::process(&ctx, None).await.unwrap();
    
    // Verify alerts
    let alerts = test_ctx.take_alerts();
    assert!(alerts.iter().any(|a| a.severity == AlertSeverity::Warning));
    assert!(test_ctx.has_alert("retried"));
}
```

## Configuration & Schemas

### Defining Configuration

Use `serde` and `schemars` to define configuration:

```rust
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

#[derive(Debug, Default, Clone, Serialize, Deserialize, JsonSchema)]
pub struct HttpConfig {
    /// The URL to send requests to
    pub url: String,
    
    /// HTTP method (GET, POST, PUT, DELETE)
    #[serde(default = "default_method")]
    pub method: String,
    
    /// Request timeout in seconds
    #[serde(default = "default_timeout")]
    pub timeout_seconds: u64,
    
    /// Optional authentication header
    #[serde(default)]
    pub auth_header: Option<String>,
}

fn default_method() -> String { "GET".to_string() }
fn default_timeout() -> u64 { 30 }
```

### Schema Generation

The `plugin!` macro automatically generates JSON Schema for your config. The UI uses this to render dynamic configuration forms.

**Retrieve schema via API:**
```
POST /api/variations/config-schema
{
    "package": "http",
    "variation": "get"
}
```

### Config in Workflow JSON

```json
{
    "components": [
        {
            "id": "http:get:0",
            "config": {
                "url": "https://api.example.com/data",
                "method": "GET",
                "timeout_seconds": 60
            }
        }
    ]
}
```

---

## Enhanced Schemas & UI Widgets

The web UI uses "Enhanced Schemas" to render rich configuration forms. You can define these alongside your configuration structs.

**Key Features:**
- **Field Order**: Control the order of fields in the form.
- **Widgets**: Assign specialized widgets (spinners, file pickers, code editors) to fields.
- **Groups**: Organize fields into collapsible sections.
- **Templates**: Provide "Quick Start" configurations.

To use enhanced schemas, your config struct should implement `EnhancedSchema` (or similar mechanism provided by `foundation`).

**Available Widgets:**

| Widget Type | Description |
|-------------|-------------|
| `NumberSpinner` | Input with +/- controls, min/max/step. |
| `DurationPicker` | Smart input for time durations (e.g. "5m", "1h"). |
| `ToggleSwitch` | Boolean switch instead of checkbox. |
| `Select` | Dropdown menu. |
| `UrlInput` | Input with URL validation button. |
| `TextInput` | Standard text, supports `multiline: true`. |
| `FilePathPicker` | Button to select server-side files/directories. |
| `JsonEditor` | Code editor with syntax highlighting for JSON. |

---

## Categories

Categories organize plugins in the UI with hierarchical grouping.

### Using Built-in Categories

```rust
use foundation::categories;

foundation::plugin! {
    // ...
    variations: {
        "timer" => Timer { 
            icon: "â°", 
            color: "#9b59b6", 
            category: categories::TIME_TRIGGER  // "Time/Trigger"
        },
    }
}
```

### Available Categories

| Category Path | Constant | Description |
|--------------|----------|-------------|
| `Data` | `DATA` | General data processing |
| `Data/Transform` | `DATA_TRANSFORM` | Data transformation |
| `Data/Filter` | `DATA_FILTER` | Data filtering |
| `Data/Storage` | `DATA_STORAGE` | Data persistence |
| `Data/Storage/File` | `DATA_STORAGE_FILE` | File operations |
| `Data/Storage/Database` | `DATA_STORAGE_DATABASE` | Database operations |
| `Logic` | `LOGIC` | Logic operations |
| `Logic/Conditional` | `LOGIC_CONDITIONAL` | If/else branching |
| `Logic/Flow` | `LOGIC_FLOW` | Flow control |
| `Time` | `TIME` | Time operations |
| `Time/Trigger` | `TIME_TRIGGER` | Time-based triggers |
| `Time/Delay` | `TIME_DELAY` | Delays |
| `Time/Schedule` | `TIME_SCHEDULE` | Scheduled execution |
| `Communication` | `COMMUNICATION` | Network communication |
| `Communication/HTTP` | `COMMUNICATION_HTTP` | HTTP requests |
| `IoT` | `IOT` | IoT devices |
| `IoT/Protocol/MQTT` | `IOT_PROTOCOL_MQTT` | MQTT protocol |
| `AI` | `AI` | AI/ML operations |
| `AI/LLM` | `AI_LLM` | Language models |
| `Utility` | `UTILITY` | General utilities |

### Custom Categories

You can define custom category paths:

```rust
use foundation::Category;

let custom = Category::new("MyCompany/Custom/Special");
```

---

## Testing Plugins

### Unit Testing with `test_utils`

Foundation provides a testing module that allows unit testing variations without the engine:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use foundation::test_utils::{TestPluginContext, LogLevel};

    #[tokio::test]
    async fn test_echo_variation() {
        // Create test context with config
        let test_ctx: TestPluginContext<MyConfig> = TestPluginContext::with_config(
            MyConfig { prefix: "TEST".to_string() },
            "myplugin",
            "echo"
        );
        
        // Call the variation handler
        let input = b"Hello World".to_vec();
        let result = Echo::process(&test_ctx.plugin_context(), Some(input)).await;
        
        // Assert success
        assert!(result.is_ok());
        
        // Check outputs
        let outputs = test_ctx.take_outputs();
        assert_eq!(outputs.len(), 1);
        
        let output = &outputs[0];
        assert!(output["message"].as_str().unwrap().starts_with("TEST:"));
        
        // Check logs
        assert!(test_ctx.has_log("Echo processing"));
        assert!(test_ctx.errors().is_empty());
    }

    #[tokio::test]
    async fn test_config_from_json() {
        let ctx: TestPluginContext<MyConfig> = TestPluginContext::from_json(
            r#"{"prefix": "JSON_PREFIX"}"#,
            "myplugin",
            "echo"
        ).unwrap();
        
        assert_eq!(ctx.plugin_context().config.prefix, "JSON_PREFIX");
    }
}
```

### Test Utilities API

| Method | Description |
|--------|-------------|
| `TestPluginContext::new(pkg, var)` | Create with default config |
| `TestPluginContext::with_config(cfg, pkg, var)` | Create with specific config |
| `TestPluginContext::from_json(json, pkg, var)` | Parse config from JSON |
| `ctx.plugin_context()` | Get `PluginContext` for handlers |
| `ctx.take_outputs()` | Drain all sent values |
| `ctx.logs()` | Get all log messages |
| `ctx.errors()` | Get only error messages |
| `ctx.infos()` | Get only info messages |
| `ctx.has_log(substr)` | Check if any log contains text |

### Running Tests

```bash
# Run all tests
cargo test

# Run tests for a specific plugin
cargo test -p myplugin

# Run with output
cargo test -- --nocapture
```

---

## Versioning System

### Version Constants

Foundation exports three critical version constants:

```rust
// The foundation crate version
pub const FOUNDATION_VERSION: &str = "0.1.0";

// The plugin API version (for ABI compatibility)
pub const API_VERSION: &str = "0.1.0";

// Minimum API version the engine will load
pub const MIN_SUPPORTED_API_VERSION: &str = "0.1.0";
```

### Plugin Version Info

Every plugin captures version information at build time:

```rust
pub struct PluginVersionInfo {
    pub plugin_version: String,      // Your plugin's version
    pub foundation_version: String,  // Foundation version at build
    pub api_version: String,         // API version at build
    pub build_timestamp: String,     // When the plugin was built
    pub git_commit: Option<String>,  // Git commit if available
}
```

### Version Compatibility

The engine checks plugin compatibility on load:

| Scenario | Result |
|----------|--------|
| Plugin API == Engine API | âœ… Compatible |
| Plugin API < Engine API (minor) | âš ï¸ Warning: plugin may lack features |
| Plugin API > Engine API (minor) | âš ï¸ Warning: engine may lack features |
| Plugin API < MIN_SUPPORTED | âŒ Rejected: plugin too old |
| Major version mismatch | âŒ Rejected: incompatible |

### Checking Versions via API

```bash
# Get engine version info
curl http://localhost:3000/api/version

# Get all loaded plugin versions
curl http://localhost:3000/api/version/plugins
```

**Response:**
```json
{
    "engine_version": "0.1.0",
    "foundation_version": "0.1.0",
    "api_version": "0.1.0",
    "min_supported_api_version": "0.1.0"
}
```

---

## ABI Compatibility

### âš ï¸ CRITICAL RULE

**NEVER add methods to `#[savefile_abi_exportable]` traits.**

Adding a method to an exported trait is a **breaking ABI change**. Old plugins won't have the new method in their vtable, causing the engine to crash when loading them.

### Exported Traits (DO NOT MODIFY)

- `PluginApi` - Main plugin interface
- `VariationsApi` - Variation discovery
- `PluginFactory` - Plugin instantiation
- `SharedContext` - Engine context

### Safe Changes

âœ… **Add fields to structs** (Savefile handles missing fields with defaults):

```rust
#[derive(Savefile, Default)]
pub struct ComponentInfo {
    pub name: String,
    pub version: String,
    #[serde(default)]           // Old plugins get default
    pub new_field: String,      // New plugins provide value
}
```

### Unsafe Changes

âŒ **Adding trait methods**:

```rust
#[savefile_abi_exportable(version = 0)]
pub trait PluginApi {
    fn existing_method(&self);
    fn new_method(&self);  // ðŸ’¥ CRASHES OLD PLUGINS
}
```

### If You Must Change Traits

1. Increment the ABI version: `#[savefile_abi_exportable(version = 1)]`
2. Implement migration logic in the engine
3. Document the breaking change
4. Communicate to plugin authors

---

## Deprecation Strategy

### Phase 1: Soft Deprecation (3-6 months)

1. Add deprecation warnings to documentation
2. Log warnings when deprecated features are used
3. Provide migration guides
4. Keep old code paths working

```rust
async fn process(ctx: &PluginContext<Config>, data: Option<Vec<u8>>) -> Result<(), String> {
    if ctx.config.use_legacy_format {
        ctx.warn("legacy_format is deprecated and will be removed in v2.0");
    }
    // ...
}
```

### Phase 2: Hard Deprecation

1. Return errors for deprecated features
2. Update MIN_SUPPORTED_API_VERSION
3. Remove deprecated code paths

### Communicating Deprecations

- CHANGELOG.md entries
- Log warnings at startup
- Version API includes deprecation info
- Documentation updates

---

## REST API Reference

### Version Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/version` | Engine and foundation versions |
| GET | `/api/version/plugins` | All loaded plugin versions |

### Workflow Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflows` | List all workflows |
| POST | `/api/workflows` | Create workflow |
| GET | `/api/workflows/{id}` | Get workflow by ID |
| DELETE | `/api/workflows/{id}` | Delete workflow |
| PUT | `/api/workflows/{id}/name` | Rename workflow |
| GET | `/api/workflows/{id}/config` | Get workflow config JSON |
| PUT | `/api/workflows/{id}/auto-start` | Set auto-start |
| POST | `/api/workflows/{id}/connectors` | Add connector |
| DELETE | `/api/workflows/{id}/connectors` | Remove connector |

### Component Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/workflows/{id}/components/{cid}/name` | Rename component |
| PUT | `/api/workflows/{id}/components/{cid}/auto-start` | Set component auto-start |
| GET | `/api/workflows/{id}/components/{cid}/config` | Get component config |
| PUT | `/api/workflows/{id}/components/{cid}/config` | Update component config |

### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs |
| GET | `/api/jobs/summary` | Job summary |
| POST | `/api/jobs/start/{workflow_id}` | Start job for workflow |
| GET | `/api/jobs/{id}` | Get job by ID |
| DELETE | `/api/jobs/{id}` | Delete job |
| GET | `/api/jobs/{id}/state` | Get job state |
| PUT | `/api/jobs/{id}/stop` | Stop job |
| PUT | `/api/jobs/{id}/pause` | Pause job |
| PUT | `/api/jobs/{id}/resume` | Resume job |

### Plugin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plugins` | List running plugins |
| POST | `/api/plugins` | Add plugin to workflow |
| GET | `/api/plugins/{pkg}/{var}/{inst}/status` | Plugin status and last value |

### Alert Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List alerts (supports query params: `severity`, `plugin`, `acknowledged`, `limit`) |
| GET | `/api/alerts/summary` | Alert counts by severity |
| GET | `/api/alerts/count` | Total alert count |
| GET | `/api/alerts/stream` | SSE stream for real-time alerts |
| GET | `/api/alerts/{id}` | Get alert by ID |
| PUT | `/api/alerts/{id}/acknowledge` | Acknowledge an alert |
| DELETE | `/api/alerts/{id}` | Delete an alert |
| PUT | `/api/alerts/acknowledge/all` | Acknowledge all alerts |
| POST | `/api/alerts/acknowledge/bulk` | Acknowledge multiple alerts by ID |
| DELETE | `/api/alerts/acknowledged` | Delete all acknowledged alerts |

#### Alert Query Parameters

```bash
# Get all critical alerts
curl "http://localhost:3000/api/alerts?severity=critical"

# Get unacknowledged alerts from a specific plugin
curl "http://localhost:3000/api/alerts?plugin=time&acknowledged=false"

# Get last 10 alerts
curl "http://localhost:3000/api/alerts?limit=10"
```

#### Alert SSE Stream

```javascript
const eventSource = new EventSource('/api/alerts/stream');
eventSource.addEventListener('alert', (event) => {
    const alert = JSON.parse(event.data);
    console.log(`New alert: ${alert.severity} - ${alert.message}`);
});
```

### Variation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/variations` | List all available variations |
| POST | `/api/variations/config-schema` | Get config schema for variation |

### Example: Create and Start a Workflow

```bash
# 1. Create workflow
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"name": "My Workflow", "description": "Test", "auto_start": false}'

# 2. Add plugin via UI or API
# 3. Start job
curl -X POST http://localhost:3000/api/jobs/start/workflow-id-here
```

---

## Web Interface Integration

### Plugin Discovery

The Web UI discovers available plugins by calling:
```
GET /api/variations
```

**Response:**
```json
[
    {
        "package": "time",
        "variation": "timer",
        "icon": "â°",
        "color": "#9b59b6",
        "allowed_input_types": ["serde_json::Value"],
        "output_type": "serde_json::Value"
    }
]
```

### Adding Plugins to Workflows

1. User selects a variation from the sidebar
2. UI calls `POST /api/plugins` with workflow and variation info
3. UI updates the graph visualization

### Configuration UI

1. User selects a node in the graph
2. UI calls `POST /api/variations/config-schema` to get JSON Schema
3. UI renders a dynamic form based on the schema
4. User submits config via `PUT /api/workflows/{id}/components/{cid}/config`

### Real-time Updates

The UI subscribes to activity updates via:
```
GET /api/activity/stream
```

This Server-Sent Events (SSE) endpoint provides real-time plugin status.

---

## Best Practices

### Plugin Design

1. **Single Responsibility**: Each variation should do one thing well
2. **Stateless Processing**: Avoid storing state between `process()` calls when possible
3. **Graceful Errors**: Return `Err(String)` with descriptive messages, don't panic
4. **Logging**: Use `ctx.info()`, `ctx.warn()`, `ctx.error()` liberally

### Configuration

1. **Sensible Defaults**: Always provide defaults via `#[serde(default)]`
2. **Document Fields**: Use doc comments - they appear in JSON Schema descriptions
3. **Validate Early**: Check config validity in `on_start()`, not during `process()`

### Performance

1. **Async All The Way**: Use `tokio::spawn` for blocking operations
2. **Stream Large Data**: Don't buffer entire files in memory

### Testing

1. **Test Every Variation**: Use `TestPluginContext` for unit tests
2. **Test Error Cases**: Ensure errors are handled gracefully
3. **Test Config Parsing**: Use `from_json()` to test config deserialization

### Code Organization

```
components/myplugin/
â”œâ”€â”€ Cargo.toml
â”œâ”€â”€ README.md           # Plugin documentation
â””â”€â”€ src/
    â”œâ”€â”€ lib.rs          # Registration only
    â”œâ”€â”€ variation1.rs   # One file per variation
    â”œâ”€â”€ variation2.rs
    â””â”€â”€ helpers.rs      # Shared utilities
```

---

## Troubleshooting

### Plugin Not Loading

1. Check DLL is in `target/debug/` (or `target/release/`)
2. Verify plugin compiles: `cargo build -p myplugin`
3. Check engine logs for version compatibility errors
4. Ensure `crate-type = ["cdylib"]` in Cargo.toml

### Plugin Crashes Engine

1. Check for ABI compatibility issues (did you modify exported traits?)
2. Rebuild all plugins: `cargo clean && cargo build`
3. Check version compatibility via `/api/version/plugins`

### Config Not Parsed

1. Verify JSON Schema is valid: `POST /api/variations/config-schema`
2. Check `#[serde(default)]` on optional fields
3. Ensure config struct implements `Default`

### Variations Not Appearing

1. Verify `plugin!` macro syntax
2. Check the variation name matches (case-sensitive)
3. Ensure plugin builds without errors

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to load PluginApi" | DLL not found or corrupt | Rebuild plugin |
| "Invalid variation" | Variation name mismatch | Check `plugin!` macro |
| "Config parse error" | Invalid JSON or schema | Verify config struct |
| "Plugin too old" | API version mismatch | Rebuild with latest foundation |

---

## Quick Reference

### Minimal Plugin Template

```rust
// lib.rs
use foundation::plugin_interface::plugin::PluginApi;
use foundation::plugin_interface::variations::VariationsApi;
use foundation::categories;
use savefile_derive::savefile_abi_export;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

mod myvariation;
pub use myvariation::MyVariation;

#[derive(Debug, Default, Clone, Serialize, Deserialize, JsonSchema)]
pub struct MyConfig {
    #[serde(default)]
    pub setting: String,
}

foundation::plugin! {
    name: "MyPlugin",
    version: "0.1.0",
    author: "Your Name",
    description: "Description",
    config: MyConfig,
    variations: {
        "myvariation" => MyVariation { icon: "ðŸ”§", color: "#3498db", category: categories::UTILITY },
    }
}
```

```rust
// myvariation.rs
use crate::MyConfig;
use foundation::{PluginContext, VariationHandlerType};

pub struct MyVariation;

impl VariationHandlerType for MyVariation {
    type Config = MyConfig;

    async fn process(ctx: &PluginContext<MyConfig>, data: Option<Vec<u8>>) -> Result<(), String> {
        ctx.info("Processing...");
        ctx.send(serde_json::json!({"result": "done"})).await;
        Ok(())
    }
}
```

### Commands Cheat Sheet

```bash
# Build everything
cargo build

# Build specific plugin
cargo build -p myplugin

# Run tests
cargo test

# Run engine
cargo run -- --config data/app_config.json

# Clean and rebuild
cargo clean && cargo build
```

---

## Further Reading

- [Foundation API Reference](/docs/foundation/api-reference)
- [Foundation Overview](/docs/foundation/intro)

---

*Last updated: January 2026*
