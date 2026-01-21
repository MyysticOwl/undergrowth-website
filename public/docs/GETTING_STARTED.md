# Getting Started with Undergrowth 🌱

Welcome to Undergrowth, the lightweight, AI-native automation engine. This guide will help you go from zero to your first running workflow in minutes.

---

## 🏗 Installation

### Option 1: Quick Install (Recommended)
Download the latest release for your platform:
- **Windows**: `undergrowth-x86_64.msi`
- **Linux**: `undergrowth-x86_64.tar.gz`

### Option 2: Developing Plugins
Undergrowth is extensible. While the core engine is provided as a binary, you can build your own plugins using the **Undergrowth Foundation** SDK.

1. **Prerequisites**:
   - [Rust](https://rustup.rs/) (latest stable)

2. **Setup SDK**:
   Link your plugin project to the `foundation` crate:
   ```toml
   [dependencies]
   foundation = { git = "https://github.com/MyysticOwl/undergrowth.git", branch = "main", subdirectory = "foundation" }
   ```

3. **Learn More**:
   See the [Plugin Developer Guide](./PLUGIN_DEVELOPER_GUIDE.md) for full details on building `.dll` or `.so` extensions.

---

## 🧠 AI Setup (Ollama)

Undergrowth uses **Ollama** for local AI capabilities.

1. **Auto-Setup**:
   Run the following command to automatically detect and install Ollama:
   ```bash
   ./undergrowth model setup ollama
   ```

2. **Pull a Model**:
   Download a small, efficient model like `phi3` or `llama3`:
   ```bash
   ./undergrowth model pull phi3
   ```

---

## 🚀 Running for the First Time

Start the engine in default mode (Web UI + REPL):

```bash
./undergrowth
```

### Accessing the Web UI
Open your browser to [http://localhost:8096](http://localhost:8096).
- **Default Username**: `admin`
- **Default Username**: `admin`
- **Default Password**: The engine generates a random password on first boot. **Check your terminal output**:
  ```
  ╔════════════════════════════════════════╗
  ║       Initial Admin Password           ║
  ║      admin / <random_password>         ║
  ╚════════════════════════════════════════╝
  ```

> [!TIP]
> **Can't find the port?** Check the logs for `Listening on 0.0.0.0:8096`. You can change the port in `data/app_config.yaml` or via `--port 9000`.

> [!IMPORTANT]
> Save the initial admin password! It is only displayed once on first boot.
> 
> *Note: If you have a Team license, you can create additional users with different roles (Admin, Operator, Viewer).*

### Using the REPL
The terminal will show a `sprout>` prompt. Try these commands:
```bash
sprout> system status
sprout> workflow list
sprout> help
```

---

## ✨ Your First Workflow

Let's create a simple "AI Greet" workflow.

1. **Create File** (`greet.yaml`):
```yaml
name: "AI Greet"
id: "greet_flow"
components:
  - name: "Trigger"
    id: "time:time_interval:0"
    config:
      interval: 10
      units: "seconds"

  - name: "AI Brain"
    id: "ai:ai_agent:0"
    config:
      prompt: "Say a short, unique greeting."
      allowed_tools: []

  - name: "Save to File"
    id: "file:write_file:0"
    config:
      path: "output"
      file_name: "greetings.txt"
      append: true

connectors:
  - from: { component_id: "time:time_interval:0", port: "out" }
    to: [{ component_id: "ai:ai_agent:0", port: "in" }]
  - from: { component_id: "ai:ai_agent:0", port: "out" }
    to: [{ component_id: "file:write_file:0", port: "in" }]
```

2. **Run it**:
```bash
./undergrowth workflow run greet.yaml
```

---

## 📊 Using the Web UI

Once the engine is running, open [http://localhost:8096](http://localhost:8096) in your browser.

### Dashboard
The dashboard shows:
- System status and health
- Recent workflows
- Active jobs
- Quick actions

### Workflow Editor
1. Click **Workflows** in the sidebar
2. Click **New Workflow** or select an existing one
3. Drag components from the sidebar onto the canvas
4. Configure each component by clicking on it
5. Connect components by dragging from output ports to input ports
6. Save and start your workflow

### Job Monitoring
1. Click **Jobs** in the sidebar
2. View running jobs and their status
3. Click a job to see real-time component states and data flow

### Using Blueprints
Blueprints are pre-made workflow templates.
1. Click **Blueprints** in the sidebar.
2. Browse the gallery (e.g., "Video Security", "Showcase Server").
3. Click **Import** to create a new workflow from the template.
4. The new workflow is now editable in your **Workflows** list.

### Starting a Job Manually
If a workflow is not set to `auto_start`:
1. Go to the **Workflows** view.
2. Click the **Run** (Play) icon on the desired workflow card.
3. A new **Job** instance will start, and you will be redirected to the Job Monitor.

---

## 🕵️ Troubleshooting

- **Plugins not loading**: Ensure the `plugins` directory contains the `.dll` (Windows) or `.so` (Linux) files.
- **Port Conflict**: If port `8096` is taken, change it in `data/app_config.yaml` or use `--port 8080` when starting.
- **Model Errors**: Verify Ollama is running (`ollama serve`).
- **Authentication Issues**: On first boot, check the console for the initial admin password.

---

## 📚 Next Steps

Ready for more? Check out:

- [CLI Reference](./CLI_REFERENCE.md) - Complete command-line documentation
- [REST API Reference](./REST_API_REFERENCE.md) - REST API for automation
- [Configuration](./CONFIGURATION.md) - Detailed configuration options
- [Plugin Reference](./PLUGIN_REFERENCE.md) - Available plugins and tools
- [Plugin Developer Guide](./PLUGIN_DEVELOPER_GUIDE.md) - Build your own plugins
