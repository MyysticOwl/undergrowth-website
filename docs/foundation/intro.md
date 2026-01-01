---
sidebar_position: 1
---

# Foundation

The Foundation is the core runtime of Undergrowth. It manages the execution lifecycle, handles plugin sandboxing, and orchestrates the flow of data between nodes.

## Core Concepts

*   **Nodes**: Individual units of logic (e.g., "HTTP Request", "Filter", "Transform").
*   **Edges**: The connections that define how data flows between nodes.
*   **Workflows**: Directed Acyclic Graphs (DAGs) formed by connected nodes.
*   **Context**: The runtime environment provided to each node.
