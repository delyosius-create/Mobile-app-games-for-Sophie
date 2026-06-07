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
if ! command -v python3 >/dev/null 2>&1; then
  echo "  ✗ python3 is not installed. Install it with:"
  echo "      sudo apt update && sudo apt install -y python3"
  exit 1
fi

if [ ! -d "$INSTALL_DIR/www" ]; then
  echo "  ✗ Can't find the game (no www/ folder at $INSTALL_DIR)."
  echo "    Make sure you're running this from inside the cloned repo."
  exit 1
fi

# --- build the systemd unit from the template --------------------------------
TEMPLATE="$SCRIPT_DIR/$SERVICE_NAME.service"
UNIT_PATH="/etc/systemd/system/$SERVICE_NAME.service"

echo "  → Writing service file to $UNIT_PATH (needs sudo)"
sed -e "s#__INSTALL_DIR__#$INSTALL_DIR#g" \
    -e "s#__USER__#$RUN_USER#g" \
    -e "s#PORT=8080#PORT=$PORT#g" \
    "$TEMPLATE" | sudo tee "$UNIT_PATH" >/dev/null

# --- enable + (re)start ------------------------------------------------------
echo "  → Enabling and starting the service"
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME" >/dev/null
sudo systemctl restart "$SERVICE_NAME"

sleep 1
if ! sudo systemctl is-active --quiet "$SERVICE_NAME"; then
  echo
  echo "  ✗ The service did not start. See what went wrong with:"
  echo "      sudo systemctl status $SERVICE_NAME"
  echo "      journalctl -u $SERVICE_NAME -e"
  exit 1
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
