---
sidebar_position: 1
---

# Plugin Development Guide

Undergrowth supports a robust plugin architecture allowing you to extend functionality using WebAssembly (Wasm) or Native Rust code.

## Getting Started

1.  **Install the Sprout CLI**: The essential tool for scaffolding and building plugins.
2.  **Choose your SDK**: 
    *   **Rust SDK**: First-class support, heavily optimized.
    *   **Go/TinyGo**: Experimental support for Wasm.
3.  **Define your Schema**: All plugins start with a strict configuration schema.

```bash
sprout new my-plugin --type source
```
