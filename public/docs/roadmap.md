# Undergrowth Roadmap: The Private Cognitive Runtime

> [!IMPORTANT]
> **North Star**: The standard library for private AI agents. One binary. Zero dependencies. Total control.
> **Architecture**: "Everything is a Plugin". Small core engine + infinite capabilities via native Rust plugins.

> [!NOTE]
> **Reality Check**: This is a solo founder project. Timelines are estimates. Quality over speed. Ship when ready.

## 🎯 Strategic Focus

**Target Audience**: Developers, Homelabbers, and Engineers building **Personal AI Ecosystems** and **Industrial Edge Intelligence**.

**Core Differentiators**:
- 🦀 **Plugin-First Architecture**: Feature-rich native plugins (Rust) for maximum performance and control.
- 🏠 **Local-first**: Zero data egress. Your silicon, your data.
- 🧩 **MCP Support**: Use Undergrowth plugins as MCP Tools, or consume external MCP servers as plugins.
- 📦 **Tiered deployment**: Pro-grade features in a sub-20MB core.
- 🧠 **Embodied AI**: Agents that see (Vision), feel (IoT), and remember (Vector DB).

---

## 🚀 Launch Readiness (The Final Stretch)

**Goal**: A polished, "Hacker News Ready" MVP.

| # | Feature | Why It Matters | Status |
|:-:|:--------|:---------------|:-------|
| 1 | **3 Launch Blueprints** | "I can do THAT?" moments | ✅ DONE (In `data/blueprints`) |
| 2 | **Dashboard: gauge + chart** | Visual wow factor for screenshots | ✅ DONE |
| 3 | **Vision: object_detect** | Frigate alternative claim | ✅ DONE |
| 4 | **Core Plugins (Sheets, Postgres)** | Real-world data integration | ✅ DONE |
| 5 | **MCP Integration** | Universal bridge | ✅ DONE |
| 6 | **Demo Video** | Viral marketing asset | 💡 TODO |
| 7 | **Website Polish** | Professional first impression | 🚧 In Progress |

---

## ✅ Core Capabilities (Built & Shipped)

The "Standard Library" is complete. You have a robust, async runtime with 20+ plugins.

### 🧠 AI & Intelligence
- **Native AI**: `ai:ai_chat` (Ollama/OpenAI), `ai:ai_agent` (ReAct Loop).
- **Cortex**: Embedded Llama.cpp inference (GGUF support).
- **Vision**: `vision:object_detect` (YOLO), `vision:face_detect`, `vision:zone_crossing`.
- **Memory**: Vector embeddings and semantic search.

### 🌐 Connectivity & Integrations
- **MCP**: Host & Client (Bridge to external tools).
- **Chat**: Slack (`post`, `upload`), Discord (`post`, `embed`).
- **Web**: HTTP Client/Server, RSS Reader, HTML Scraper.
- **IoT**: MQTT Client (Pub/Sub), Weather.

### 🗄️ Data & Storage
- **Databases**: SQLite (Embedded), Postgres (Remote), Redis (Cache/PubSub).
- **Spreadsheets**: Google Sheets (Read/Write/Append).
- **Files**: Sandbox File I/O, CSV Parsing.
- **Time-Series**: Integrated store, query, and anomaly detection.

### ⚡ Logic & Control
- **Flow**: `logic:if_else`, `logic:switch` (Content Router), `logic:iterate_list`.
- **Scheduling**: Cron, Interval, Solar Events (Sunrise/Sunset).

---

## 🏆 Post-Launch Priorities

### 1. "One-Click Homelab" — Frictionless Installation
*Goal: Easier than Home Assistant.*

- ✅ **Self-contained binary**: Linux/Windows/Mac.
- ✅ **Local Auth**: SQLite + Argon2.
- ✅ **Installer Service**: Logic to manage/run installations.
- ✅ **Installer Script**: `.sh` / `.ps1` one-liners.
- 💡 **System Tray**: Desktop experience for non-technical users.
- 💡 **Auto-Update**: In-app binary updates.

### 2. "Sprout CLI" — Workflows as Code
*Goal: CI/CD for Automation.*

- ✅ `sprout run` / `sprout init`: Headless execution and scaffolding.
- ✅ `sprout export`: Dump workflows to YAML.
- ✅ `sprout check`: Validate workflow schema and dependencies.
- ✅ `sprout jobs`: List and manage running jobs.
- 💡 **Env Var Secrets**: `{{env.API_KEY}}` native support.

### 3. "The Agent Playground" — UI/UX
*Goal: Better than flow-based programming.*

- 💡 **Chat UI**: Built-in chat interface for `ai:ai_chat` nodes.
- 💡 **Details Pane**: Detach "Details" from the main view for better debugging.
- 💡 **Log Viewer**: Reverse order logs + search.

### 4. Monetization & Licensing
*Goal: Sustainable development.*

- ✅ **Feature Gating**: Runtime enforcement of workflow limits & plugin entitlements.
- ✅ **LemonSqueezy Client**: Validation & Activation API integration.
- 🚧 **License Files**: "Additive" license merging (Base + Plugin Packs).
- ✅ **Payment Integration**: Live LemonSqueezy checkout flow. Product is purchasable.

---

## 🧠 Strategic AI Vision

**We are moving from "Calling APIs" to "Embedded Cognition".**

1.  **Cortex (Inference)**:
    - ✅ Llama.cpp binding.
    - ✅ Model Registry (`sprout model pull llama3`).
    - 💡 Whisper-Rust (Voice-to-Text).

2.  **Roots (Memory)**:
    - ✅ Vector Store foundation.
    - ✅ Filesystem Indexing (via Workflow/Blueprint).
    - ✅ "Log-to-Wisdom" (via Workflow/Blueprint).

3.  **Synthetics (Agents)**:
    - ✅ `logic:switch` (Router).
    - 💡 "Self-Healing": Agent analyzes its own stderr and retries.
    - 💡 Browser Control: Headless Chromium.

---



---

## 🛑 Deprecated / Removed from Scope
*Focusing on the core mission.*

- **Multi-Node ("The Lattice")**: Deferred. Focus is on single-node perfection.
- **Paper Mill**: Use generic tool execution.