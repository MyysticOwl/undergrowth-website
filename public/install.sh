#!/bin/bash
set -e

# Undergrowth Installer
# Usage: curl -fsSL https://.../install.sh | bash

REPO="MyysticOwl/undergrowth-website"
INSTALL_DIR="$HOME/.undergrowth"
BIN_DIR="$INSTALL_DIR/bin"
DATA_DIR="$INSTALL_DIR/data"
LOG_DIR="$INSTALL_DIR/logs"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "  _   _           _                                |_| |__  "
echo " | | | |_ __   __| | ___ _ __ __ _ _ __ _____      _| | |_| "
echo " | | | | '_ \ / _\` |/ _ \ '__/ _\` | '__/ _ \ \ /\ / / __| '_ \ "
echo " | |_| | | | | (_| |  __/ | | (_| | | | (_) \ V  V /| |_| | | |"
echo "  \___/|_| |_|\__,_|\___|_|  \__, |_|  \___/ \_/\_/  \__|_| |_|"
echo "                             |___/                             "
echo -e "${NC}"
echo -e "${BLUE}🌱 Installing Undergrowth...${NC}"

# 1. Detect Architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Linux)
        PLATFORM="unknown-linux-gnu"
        ;;
    Darwin)
        PLATFORM="apple-darwin"
        ;;
    *)
        echo -e "${RED}Unsupported OS: $OS${NC}"
        exit 1
        ;;
esac

case "$ARCH" in
    x86_64)
        TARGET="x86_64-$PLATFORM"
        ;;
    aarch64|arm64)
        TARGET="aarch64-$PLATFORM"
        ;;
    *)
        echo -e "${RED}Unsupported Architecture: $ARCH${NC}"
        exit 1
        ;;
esac

echo "  • Detected Platform: $TARGET"

# 2. Prepare Directories
echo "  • Creating directories in $INSTALL_DIR..."
mkdir -p "$BIN_DIR"
mkdir -p "$DATA_DIR"
mkdir -p "$LOG_DIR"

# 3. Download Binary
URL="https://github.com/$REPO/releases/latest/download/undergrowth-${TARGET}.tar.xz"
echo "  • Downloading from $URL..."

TMP_DIR="$INSTALL_DIR/tmp"
mkdir -p "$TMP_DIR"

# Download and extract to tmp
# We use -f to fail on 404 and better handle redirects
if ! curl -fsSL "$URL" | tar xJf - -C "$TMP_DIR"; then
    echo -e "${RED}Error: Failed to download or extract the binary from $URL${NC}"
    echo -e "${RED}This usually happens if the release asset is missing or the network is unstable.${NC}"
    exit 1
fi

# Find the extracted root folder (e.g. undergrowth-x86_64-unknown-linux-gnu)
EXTRACTED_ROOT=$(find "$TMP_DIR" -maxdepth 1 -mindepth 1 -type d | head -n 1)

if [ -z "$EXTRACTED_ROOT" ]; then
    echo -e "${RED}Error: Failed to find extracted archive content in $TMP_DIR${NC}"
    exit 1
fi

echo "  • Installing to $BIN_DIR..."
# Move contents to BIN_DIR
cp -r "$EXTRACTED_ROOT/"* "$BIN_DIR/"
rm -rf "$TMP_DIR"

# Verify binary exists
if [ ! -f "$BIN_DIR/undergrowth" ]; then
    echo -e "${RED}Error: Binary not found at $BIN_DIR/undergrowth after installation.${NC}"
    exit 1
fi
chmod +x "$BIN_DIR/undergrowth"

# 4. Environment Check
SHELL_CFG=""
case "$SHELL" in
    */zsh)
        SHELL_CFG="$HOME/.zshrc"
        ;;
    */bash)
        SHELL_CFG="$HOME/.bashrc"
        ;;
    *)
        SHELL_CFG="$HOME/.profile"
        ;;
esac

if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    # Check if we can write to the config file
    if [ -w "$SHELL_CFG" ]; then
        if grep -q "$BIN_DIR" "$SHELL_CFG"; then
            echo -e "${BLUE}  ℹ️  Path already exists in $SHELL_CFG, but not in current session.${NC}"
        else
            echo -e "${BLUE}  ℹ️  Adding $BIN_DIR to $SHELL_CFG...${NC}"
            echo "" >> "$SHELL_CFG"
            echo "# Undergrowth" >> "$SHELL_CFG"
            echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$SHELL_CFG"
        fi
        echo -e "${BLUE}  ⚠️  Restart your shell or run 'source $SHELL_CFG' to use 'undergrowth' immediately.${NC}"
    else
        echo -e "${BLUE}  ℹ️  Could not write to $SHELL_CFG. Please add this manually:${NC}"
        echo "      echo 'export PATH=\"\$PATH:$BIN_DIR\"' >> $SHELL_CFG"
    fi
fi

echo -e "${GREEN}✅ Installation Complete!${NC}"
echo "   Run 'undergrowth --help' to get started."
