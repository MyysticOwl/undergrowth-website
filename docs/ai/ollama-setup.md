---
sidebar_position: 2
---

# Ollama Setup

Ollama is the LLM runtime that powers Undergrowth's AI features. You can install it automatically through the WebUI or manually.

## Automatic Installation (Recommended)

The easiest way to set up Ollama is through the Undergrowth WebUI:

1. Open **Settings** in the WebUI
2. Navigate to the **AI / Models** section
3. Click **Install Ollama**
4. Wait for installation to complete

The installer will:
- Download and install Ollama
- Configure it as a system service
- Start the Ollama server automatically

## Manual Installation

### Windows

```powershell
# Download and run the installer
winget install Ollama.Ollama
```

Or download from [ollama.com/download](https://ollama.com/download).

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### macOS

```bash
brew install ollama
```

Or download from [ollama.com/download](https://ollama.com/download).

## Pulling Models

After installing Ollama, you need to download at least one model:

```bash
# Recommended starter model (~2GB)
ollama pull llama3.2

# Smaller/faster option (~1.7GB)
ollama pull phi3

# Larger/smarter option (~4GB)
ollama pull llama3.1
```

You can also pull models through the Sprout CLI:

```bash
sprout model pull llama3.2
```

## Verifying Installation

Check that Ollama is running:

```bash
ollama list
```

You should see your downloaded models listed.

## Configuration

Ollama runs on `http://localhost:11434` by default. Undergrowth auto-detects this endpoint.

To use a different host, set the environment variable:

```bash
OLLAMA_HOST=http://your-host:11434
```

## Model Recommendations

| Use Case | Model | Size |
|----------|-------|------|
| General chat | `llama3.2` | 2GB |
| Fast responses | `phi3` | 1.7GB |
| Complex tasks | `llama3.1` | 4GB |
| Coding | `codellama` | 4GB |

## Troubleshooting

### Ollama not detected

1. Ensure Ollama is running: `ollama serve`
2. Check the service status: `ollama list`
3. Verify the port isn't blocked by a firewall

### Out of memory

- Try a smaller model like `phi3`
- Close other applications to free RAM
- Ensure you have at least 8GB RAM for most models

### Slow inference

- GPU acceleration requires CUDA (NVIDIA) or Metal (macOS)
- CPU-only inference is slower but works everywhere
