---
sidebar_position: 1
---

# Plugin API

Undergrowth exposes a powerful Plugin API that allows you to extend the engine's capabilities.

## Overview

Plugins in Undergrowth run in isolated contexts and interact with the host via a secure interface.

## Creating a Plugin

To create a new plugin, use the `create-plugin` scaffolding tool or refer to the examples in the SDK.

### Example

```rust
use undergrowth_sdk::prelude::*;

#[plugin]
struct MyPlugin;

impl Plugin for MyPlugin {
    fn on_load(&mut self, ctx: &mut Context) {
        ctx.log("Plugin loaded!");
    }
}
```
