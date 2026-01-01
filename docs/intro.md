---
sidebar_position: 1
---

# Getting Started

Welcome to **Undergrowth**, the automation framework for the future.

## Installation

To get started with Undergrowth, download the latest release from our dashboard.

```bash
# Example installation command
undergrowth install
```

## Configuration

Configure your environment by editing the `undergrowth.toml` file.

```toml
[server]
port = 8080
```

## Running the Engine

Start the Undergrowth engine:

```bash
cargo run --release
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.
