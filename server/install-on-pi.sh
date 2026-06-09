#!/usr/bin/env bash
#
# One-command installer for running Unicorn Match on a Raspberry Pi.
#
# It sets up a small always-on web server (auto-starting on boot via systemd)
# that serves the game to any tablet on your home WiFi.
#
# Run this ON THE PI, from inside the cloned repo:
#
#     cd Mobile-app-games-for-Sophie
#     bash server/install-on-pi.sh
#
# Re-running it is safe — it just updates the service.

set -euo pipefail

PORT="${PORT:-8080}"
SERVICE_NAME="unicorn-match"

# Resolve repo root (the parent of this script's folder), following symlinks.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
RUN_USER="${SUDO_USER:-$USER}"

echo
echo "  🦄 Installing Unicorn Match game server"
echo "  --------------------------------------"
echo "  Repo folder : $INSTALL_DIR"
echo "  Run as user : $RUN_USER"
echo "  Port        : $PORT"
echo

# --- sanity checks -----------------------------------------------------------
PYTHON="$(command -v python3 || true)"
if [ -z "$PYTHON" ]; then
  echo "  ✗ python3 is not installed. Installing it for you..."
  if sudo apt-get update && sudo apt-get install -y python3; then
    PYTHON="$(command -v python3 || true)"
  fi
  if [ -z "$PYTHON" ]; then
    echo "  ✗ Could not install python3 automatically. Try:"
    echo "      sudo apt update && sudo apt install -y python3"
    exit 1
  fi
fi
echo "  Python      : $PYTHON"

if ! command -v systemctl >/dev/null 2>&1; then
  echo "  ✗ This system doesn't use systemd, so auto-start isn't available."
  echo "    You can still run the game manually with:  python3 server/serve.py"
  exit 1
fi

if [ ! -d "$INSTALL_DIR/www" ]; then
  echo "  ✗ Can't find the game (no www/ folder at $INSTALL_DIR)."
  echo "    Make sure you're running this from inside the cloned repo."
  exit 1
fi

if [ ! -f "$SCRIPT_DIR/serve.py" ]; then
  echo "  ✗ server/serve.py is missing — your copy of the repo is out of date."
  echo "    Update it with:"
  echo "      git fetch origin && git checkout claude/fantasy-card-matching-game-ezd0m && git pull"
  exit 1
fi

# --- free the port if something is already on it -----------------------------
# A stale copy of our own service is the usual culprit; stop it so the restart
# below gets a clean port.
if command -v ss >/dev/null 2>&1 && ss -ltn 2>/dev/null | grep -q ":$PORT "; then
  echo "  → Port $PORT is busy; stopping any existing $SERVICE_NAME service first"
  sudo systemctl stop "$SERVICE_NAME" 2>/dev/null || true
fi

# --- build the systemd unit from the template --------------------------------
TEMPLATE="$SCRIPT_DIR/$SERVICE_NAME.service"
UNIT_PATH="/etc/systemd/system/$SERVICE_NAME.service"

echo "  → Writing service file to $UNIT_PATH (needs sudo)"
sed -e "s#__INSTALL_DIR__#$INSTALL_DIR#g" \
    -e "s#__USER__#$RUN_USER#g" \
    -e "s#__PYTHON__#$PYTHON#g" \
    -e "s#PORT=8080#PORT=$PORT#g" \
    "$TEMPLATE" | sudo tee "$UNIT_PATH" >/dev/null

# --- enable + (re)start ------------------------------------------------------
echo "  → Enabling and starting the service"
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME" >/dev/null
sudo systemctl restart "$SERVICE_NAME"

sleep 2
if ! sudo systemctl is-active --quiet "$SERVICE_NAME"; then
  echo
  echo "  ✗ The service did not start. Here's what went wrong:"
  echo "  ----------------------------------------------------"
  sudo systemctl status "$SERVICE_NAME" --no-pager -l 2>&1 | sed 's/^/  /' || true
  echo "  ---- last log lines ----"
  journalctl -u "$SERVICE_NAME" -n 20 --no-pager 2>&1 | sed 's/^/  /' || true
  echo "  ----------------------------------------------------"
  echo "  Copy the lines above and send them to Claude to debug."
  exit 1
fi

# Confirm it's really listening on the port (active != necessarily serving).
sleep 1
if command -v ss >/dev/null 2>&1 && ! ss -ltn 2>/dev/null | grep -q ":$PORT "; then
  echo "  ⚠ Service is running but nothing is listening on port $PORT yet."
  echo "    Check the log:  journalctl -u $SERVICE_NAME -e"
fi

# --- success: print the URLs -------------------------------------------------
HOSTNAME_LOCAL="$(hostname).local"
IP_ADDR="$(hostname -I 2>/dev/null | awk '{print $1}')"

echo
echo "  ✅ Done! The game starts automatically every time the Pi boots."
echo
echo "  On any tablet/phone on the SAME WiFi, open:"
echo
echo "      http://$HOSTNAME_LOCAL:$PORT/"
[ -n "$IP_ADDR" ] && echo "      http://$IP_ADDR:$PORT/   (use this if the .local name doesn't work)"
echo
echo "  Tip: in the tablet's browser, choose 'Add to Home Screen' to get an"
echo "       app icon that opens the game full-screen."
echo
echo "  Handy commands:"
echo "      sudo systemctl status $SERVICE_NAME     # is it running?"
echo "      sudo systemctl restart $SERVICE_NAME    # restart after an update"
echo "      sudo systemctl stop $SERVICE_NAME       # stop serving"
echo "      journalctl -u $SERVICE_NAME -f          # watch the live log"
echo
