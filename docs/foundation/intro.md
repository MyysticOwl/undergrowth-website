---
sidebar_position: 1
---

# Foundation

The Foundation is the core runtime of Undergrowth. It manages the execution lifecycle, handles plugin sandboxing, and orchestrates the flow of data between nodes.

## Core Concepts

# Undergrowth Foundation

The **Foundation** is the architectural backbone of Undergrowth. It defines the contract between the high-performance Engine and its extensible Plugin ecosystem.

## Core Concepts

Understanding these four layers is key to mastering Undergrowth development:

### Variations & Components
*   **Variations**: The "Types" or blueprints for logic. A single plugin (like `AI`) can provide multiple variations (like `Chat`, `Agent`, `Inference`).
*   **Components**: Configured instances of a variation. You might have three "HTTP Request" components, each hitting a different API.

### Connectors & Data Flow
*   **Connectors**: The "Edges" of your graph. They define the explicit data path from one component's output to another's input.
*   **Data Gravity**: The principle that data stays sandboxed within its job context. Components use the `PluginContext` to interact with the world safely.

### Workflows & Jobs
*   **Workflows**: The static graph definition. It is the saved "recipe" for your automation.
*   **Jobs**: The "Running" instance of a workflow. Each job has its own memory, execution state, and logs.

### The Sandbox
Every component operates in a **secure managed environment**. The Foundation ensures that plugins can only access their designated data directories and authorized resources, preventing side effects and ensuring system stability.
