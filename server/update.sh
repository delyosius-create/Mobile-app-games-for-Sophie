#!/usr/bin/env bash
#
# Pull the newest version of the game and restart the server.
# Run this ON THE PI whenever you want the latest changes:
#
#     cd Mobile-app-games-for-Sophie
#     bash server/update.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$INSTALL_DIR"

echo "  → Fetching the latest game..."
git pull --ff-only

echo "  → Restarting the server..."
sudo systemctl restart unicorn-match

echo "  ✅ Updated. The newest version is now live on your WiFi."
