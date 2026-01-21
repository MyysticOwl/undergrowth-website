# Sprout CLI Reference Guide 🌱

The **Sprout CLI** is a powerful toolset built into the Undergrowth engine that allows you to manage workflows, monitor system health, and develop automation-as-code without needing the Web UI.

## 🚀 Getting Started

The CLI is integrated into the main `undergrowth` binary. You can run it directly with subcommands or enter the **Interactive REPL** mode.

```bash
# Enter Interactive Mode (Default)
./undergrowth

# Run a specific command
./undergrowth [command]
```

---

## 🚩 Global Flags

The following flags can be used with any subcommand to control output for machine consumption:

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Output result as machine-readable JSON. |
| `--quiet` | `-q` | Suppress non-essential info logs and headers. |
| `--help` | `-h` | Display help for the command. |
| `--config` | `-c` | Path to config file (default: `data/app_config.yaml`). |

---

## 📋 Command Groups

The Sprout CLI organizes commands into logical groups:

| Group | Description |
|-------|-------------|
| `workflow` | Manage workflow definitions and lifecycle |
| `job` | Manage running workflow instances |
| `system` | System status, alerts, and diagnostics |
| `auth` | Authentication (login/logout) |
| `component` | Component registry operations |
| `model` | AI model management |
| `license` | View license information |

---

## 🌱 Workflow Management

Manage workflow definitions, configurations, and lifecycle. Workflows are the templates that define automation flows.

### `workflow list [--json]`
List all workflow definitions known to the engine.

```bash
./undergrowth workflow list
```

### `workflow show <id> [--json]`
Display detailed information about a specific workflow, including components and connectors.

```bash
./undergrowth workflow show my-workflow
```

### `workflow summary [--json]`
Show a summary of all workflows with counts and auto-start status.

```bash
./undergrowth workflow summary
```

### `workflow config <id> [--json]`
Export a workflow's configuration as YAML, including all components and connectors.

```bash
./undergrowth workflow config my-workflow > workflow_backup.yaml
```

### `workflow create [--file <path>] [--name <name>] [--description <desc>] [--auto-start] [--json]`
Create a new workflow definition.

```bash
# Create from YAML file
./undergrowth workflow create --file my-workflow.yaml

# Create inline with basic settings
./undergrowth workflow create --name "Timer Flow" --description "A simple timer workflow" --auto-start
```

**Options:**
- `--file`, `-f`: Path to workflow YAML file
- `--name`, `-n`: Workflow name (when not using file)
- `--description`, `-d`: Workflow description (when not using file)
- `--auto-start`: Enable auto-start for the workflow

### `workflow update <id> [--file <path>] [--name <name>] [--description <desc>] [--auto-start <bool>] [--json]`
Update an existing workflow definition.

```bash
# Update from YAML file (replaces entire workflow)
./undergrowth workflow update my-workflow --file updated-workflow.yaml

# Update individual properties
./undergrowth workflow update my-workflow --name "New Name" --auto-start true
```

**Options:**
- `--file`, `-f`: Path to updated workflow YAML file
- `--name`, `-n`: New workflow name
- `--description`, `-d`: New workflow description
- `--auto-start`: Update auto-start setting (true/false)

### `workflow delete <id> [--force] [--json]`
Delete a workflow definition and all associated jobs.

```bash
./undergrowth workflow delete my-workflow --force
```

**Options:**
- `--force`, `-f`: Skip confirmation prompt

### `workflow rename <id> <new-name> [--json]`
Rename a workflow.

```bash
./undergrowth workflow rename old-name "New Workflow Name"
```

### `workflow run <file>`
Execute a workflow YAML file immediately. The engine will load the components and run the flow.

```bash
./undergrowth workflow run my_workflow.yaml
```

**CI/CD Notes:**
- Returns exit code `1` if any job in the workflow fails.
- Use `--quiet` to suppress step-by-time progress logs.

### `workflow check <file>`
Validates a workflow YAML file against the engine's schema and ensures all component tools are valid and loaded.

```bash
./undergrowth workflow check my_workflow.yaml
```

**CI/CD Notes:**
- Performs deep validation of component existence in the library.
- Returns exit code `1` if syntax or logical validation fails.

### `workflow watch <file>`
Starts a file watcher on the specified workflow YAML file. Automatically reloads and restarts the workflow whenever changes are saved. This provides an instant feedback loop for workflow development.

```bash
./undergrowth workflow watch my_workflow.yaml
```

**Developer Notes:**
- Requires the `notify` system feature.
- Gracefully stops the existing job before reloading the new definition.
- Ideal for rapid iteration on complex logic.

### `workflow init <file>`
Scaffolds a new workflow YAML file with a standard template (Timer + Logger) to jumpstart development.

```bash
./undergrowth workflow init new_feature.yaml
```

### `workflow stop <id>`
Stop a running workflow instance gracefully.

```bash
./undergrowth workflow stop my-workflow
```

### `workflow jobs <id> [--json]`
List all jobs (running instances) for a specific workflow.

```bash
./undergrowth workflow jobs my-workflow
```

### `workflow export <id>`
Export a workflow's configuration as YAML.

```bash
./undergrowth workflow export my-workflow > backup.yaml
```

### `workflow auto-start <subcommand>`
Manage workflow auto-start settings.

#### `workflow auto-start enable <id> [--json]`
Enable auto-start for a workflow.

```bash
./undergrowth workflow auto-start enable my-workflow
```

#### `workflow auto-start disable <id> [--json]`
Disable auto-start for a workflow.

```bash
./undergrowth workflow auto-start disable my-workflow
```

#### `workflow auto-start set <id> <value> [--json]`
Set auto-start to a specific value.

```bash
./undergrowth workflow auto-start set my-workflow true
```

### `workflow connectors <subcommand>`
Manage connectors between workflow components.

#### `workflow connectors list <workflow-id> [--json]`
List all connectors in a workflow.

```bash
./undergrowth workflow connectors list my-workflow
```

#### `workflow connectors add <workflow-id> --from <source> --to <target> [--json]`
Add a connector between two components.

```bash
./undergrowth workflow connectors add my-workflow --from "time:time_interval:0:out" --to "file:write_file:0:in"
```

#### `workflow connectors remove <workflow-id> --from <source> --to <target> [--json]`
Remove a connector between two components.

```bash
./undergrowth workflow connectors remove my-workflow --from "time:time_interval:0:out" --to "file:write_file:0:in"
```

### `workflow generate-ai <description> [--name <name>] [--json]`
Generate a new workflow using AI based on a natural language description.

```bash
./undergrowth workflow generate-ai "Process CSV files and send email notifications when errors occur"
./undergrowth workflow generate-ai "Monitor system logs and alert on security events" --name "Security Monitor"
```

**Options:**
- `--name`, `-n`: Optional name for the generated workflow

### `workflow import <file> [--name <name>] [--json]`
Import a workflow from a YAML file.

```bash
./undergrowth workflow import my-workflow.yaml
./undergrowth workflow import imported-workflow.yaml --name "Imported Workflow"
```

**Options:**
- `--name`, `-n`: Optional name override for the imported workflow

---

## 🏃 Job Management

Manage workflow jobs (running instances of workflows). Jobs are created when workflows are started and can be monitored, controlled, and inspected.

### `job list [--workflow <id>] [--running] [--json]`
List all jobs with their current status, workflow association, and runtime information.

```bash
# List all jobs
./undergrowth job list

# Show only running jobs
./undergrowth job list --running

# Filter by workflow
./undergrowth job list --workflow my-workflow

# JSON output for automation
./undergrowth job list --json
```

**Options:**
- `--workflow`, `-w`: Filter jobs by workflow ID
- `--running`: Show only jobs in Running state

### `job show <id> [--json]`
Display detailed information about a specific job, including components, connectors, and current state.

```bash
./undergrowth job show job-123
./undergrowth job show job-123 --json
```

### `job status <id> [--json]`
Get the current state of a specific job.

```bash
./undergrowth job status job-123
```

### `job summary [--json]`
Provide a high-level overview of all jobs with aggregated statistics.

```bash
./undergrowth job summary
./undergrowth job summary --json
```

### `job start <workflow-id> [--json]`
Start a new job from an existing workflow definition.

```bash
./undergrowth job start my-workflow
./undergrowth job start timer-workflow --json
```

### `job stop [<id>] [--all] [--workflow <id>] [--json]`
Stop running jobs gracefully.

```bash
# Stop a specific job
./undergrowth job stop job-123

# Stop all running jobs
./undergrowth job stop --all

# Stop all jobs for a specific workflow
./undergrowth job stop --workflow my-workflow
```

**Options:**
- `--all`: Stop all running jobs
- `--workflow`, `-w`: Stop all jobs for the specified workflow

### `job pause <id> [--json]`
Pause a running job (temporarily suspend execution).

```bash
./undergrowth job pause job-123
```

### `job resume <id> [--json]`
Resume a paused job.

```bash
./undergrowth job resume job-123
```

### `job delete <id> [--json]`
Permanently delete a job and its associated data.

```bash
./undergrowth job delete job-123
```

### `job logs <id> [--follow] [--tail <n>] [--since <timestamp>] [--all] [--json]`
Stream logs for a specific job.

```bash
# Show current logs
./undergrowth job logs job-123

# Follow logs in real-time
./undergrowth job logs job-123 --follow

# Show last N entries
./undergrowth job logs job-123 --tail 50

# Show all logs (not filtered by job)
./undergrowth job logs job-123 --all
```

**Options:**
- `--follow`, `-f`: Stream logs in real-time
- `--tail`: Show last N log entries
- `--since`: Show logs since timestamp (ISO 8601)
- `--all`: Show all job logs

### `job watch <id>`
Monitor a job's state changes in real-time until completion.

```bash
./undergrowth job watch job-123
```

### `job components <id> [--json]`
List all components in a job with their current states.

```bash
./undergrowth job components job-123
./undergrowth job components job-123 --json
```

### `job connectors <id> [--json]`
Show the connector configuration and data flow for a job.

```bash
./undergrowth job connectors job-123
./undergrowth job connectors job-123 --json
```

### `job clean [--force] [--failed] [--completed] [--json]`
Remove completed, failed, or stopped jobs to free up resources.

```bash
# Preview what would be cleaned
./undergrowth job clean

# Force clean without confirmation
./undergrowth job clean --force

# Clean only failed jobs
./undergrowth job clean --failed

# Clean only completed jobs
./undergrowth job clean --completed
```

**Options:**
- `--force`: Force clean without confirmation
- `--failed`: Clean only failed jobs
- `--completed`: Clean only completed jobs

---

## 🖥️ System Operations

Monitor system health and manage alerts.

### `system status`
Display high-level server health and status, including uptime, memory usage, and the number of active jobs and loaded plugins.

```bash
./undergrowth system status
```

### `system info`
Display system and license information.

```bash
./undergrowth system info
```

### `system alerts [--severity <level>] [--limit <n>]`
List all system alerts.

```bash
# List all alerts
./undergrowth system alerts

# Filter by severity
./undergrowth system alerts --severity warning

# Limit results
./undergrowth system alerts --limit 10
```

**Options:**
- `--severity`, `-s`: Filter by severity (info, warning, error, critical)
- `--limit`, `-l`: Limit the number of alerts displayed (default: 50)

### `system data-drive [<path>]`
Inspect the sandboxed data directory.

```bash
# List root of data directory
./undergrowth system data-drive

# List specific subdirectory
./undergrowth system data-drive logs
```

---

## 🔐 Authentication

Manage authentication for remote server connections.

### `auth login [--server <url>] [--username <user>] [--password <pass>]`
Login to a remote server and store credentials.

```bash
# Interactive login (prompts for credentials)
./undergrowth auth login

# Login with server URL
./undergrowth auth login --server http://localhost:8096

# Full non-interactive login
./undergrowth auth login --server http://localhost:8096 --username admin --password secret
```

**Options:**
- `--server`, `-s`: Server URL (e.g., http://localhost:8096)
- `--username`, `-u`: Username
- `--password`, `-p`: Password (will prompt if not provided)

### `auth logout [--server <url>]`
Logout from a remote server.

```bash
# Logout from all servers
./undergrowth auth logout

# Logout from specific server
./undergrowth auth logout --server http://localhost:8096
```

**Options:**
- `--server`, `-s`: Server URL to logout from (defaults to all)

---

## 🧩 Component Registry

Manage and inspect available plugin components.

### `component list`
List all available plugin components and tools. Useful for finding exactly which `package:tool` you need for your workflow.

```bash
./undergrowth component list
```

### `component schemas`
Export the technical contract (Configuration schema, Inputs, Outputs) for every available component tool in the library as a single YAML reference file.

```bash
./undergrowth component schemas > components.yaml
```

---

## 🤖 Model Registry

Manage AI models and backends.

### `model list`
List all available models.

```bash
./undergrowth model list
```

### `model pull <model>`
Pull/Download a model (defaults to Ollama pull).

```bash
./undergrowth model pull llama3
./undergrowth model pull mistral:7b
./undergrowth model pull nous-hermes2/llama3-8b-gguf
```

### `model config <backend> [--api-key <key>] [--endpoint <url>]`
Configure model backend settings.

```bash
# Configure OpenAI
./undergrowth model config openai --api-key sk-...

# Configure Ollama with custom endpoint
./undergrowth model config ollama --endpoint http://localhost:11434
```

**Options:**
- `--api-key`: API Key (for cloud providers)
- `--endpoint`: Endpoint URL (for ollama/custom)

### `model set-default <model>`
Set the default model for AI operations.

```bash
./undergrowth model set-default phi3
```

### `model setup <target> [--local]`
Setup and install external model backends (e.g., Ollama).

```bash
# Online installation
./undergrowth model setup ollama

# Offline installation from local downloads
./undergrowth model setup ollama --local
```

**Options:**
- `--local`: Run in offline mode, using installers already present in `data/downloads/`

---

## 📜 License

### `license`
Check license status (alias for `system info`).

```bash
./undergrowth license
```

---

## 💬 Interactive REPL Mode

If you start Undergrowth without any subcommands, it enters **Interactive Mode**. This provides a prompt where you can run all the above commands with history.

```bash
🌱 Sprout Interactive Mode
Type 'help' for commands, 'exit' or Ctrl+C to shutdown.
sprout> workflow list
ID                             Name                  Auto-Start
my-workflow                    My Workflow           true
sprout> system status
Engine Status: Running
Uptime: 2h 15m 32s
Active Jobs: 3
sprout> exit
```

> [!TIP]
> Type `help` within the REPL to see usage help, or use `exit` or `quit` to shutdown.

### REPL-Specific Commands

| Command | Description |
|---------|-------------|
| `help` | Display available commands |
| `exit` / `quit` | Shutdown the engine |
| Ctrl+C | Interrupt and shutdown |
| Ctrl+D | EOF signal to exit |

---

## 🔧 Legacy Commands

The following commands are aliases for backwards compatibility but have been reorganized:

| Legacy Command | New Command |
|----------------|-------------|
| `run <file>` | `workflow run <file>` |
| `check <file>` | `workflow check <file>` |
| `init <file>` | `workflow init <file>` |
| `list` | `workflow list` |
| `stop <id>` | `workflow stop <id>` |
| `status` | `system status` |
| `components` | `component list` |
| `export-workflow <id>` | `workflow export <id>` |
| `export-schemas` | `component schemas` |
