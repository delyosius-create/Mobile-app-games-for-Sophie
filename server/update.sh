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

BRANCH="claude/fantasy-card-matching-game-ezd0m"

echo "  → Fetching the latest game..."
git fetch origin "$BRANCH"
git checkout "$BRANCH" 2>/dev/null || true
git pull --ff-only origin "$BRANCH"

echo "  → Restarting the server..."
if sudo systemctl restart unicorn-match 2>/dev/null; then
  echo "  ✅ Updated. The newest version is now live on your WiFi."
else
  echo "  ⚠ Couldn't restart the service — is it installed yet?"
  echo "    First-time setup:  bash server/install-on-pi.sh"
fi
