#!/usr/bin/env python3
"""Tiny zero-dependency web server for Unicorn Match.

Serves the static game in ../www on the home network so any tablet on the
same WiFi can play it in a browser. No pip packages needed — only the Python
standard library, which a Raspberry Pi already has.

Usage:
    python3 serve.py            # serves on port 8080
    PORT=9000 python3 serve.py  # custom port

Then on a tablet open:  http://<the-pi-hostname>.local:8080/
e.g.  http://raspberrypi.local:8080/
"""

import http.server
import os
import socket
import sys

# Folder that holds the game (../www relative to this file).
HERE = os.path.dirname(os.path.abspath(__file__))
WWW = os.path.normpath(os.path.join(HERE, "..", "www"))

PORT = int(os.environ.get("PORT", "8080"))
HOST = os.environ.get("HOST", "0.0.0.0")  # 0.0.0.0 = reachable from other devices


class Handler(http.server.SimpleHTTPRequestHandler):
    """Static handler with a couple of game-friendly tweaks."""

    # Make sure modern web files get the right Content-Type.
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".webmanifest": "application/manifest+json",
        ".wav": "audio/wav",
        ".mp3": "audio/mpeg",
        ".ogg": "audio/ogg",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".webp": "image/webp",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WWW, **kwargs)

    def end_headers(self):
        # The service worker must never be cached, or tablets get stuck on an
        # old version after we update the game. Everything else can cache.
        if self.path.rstrip("/").endswith("sw.js"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Quieter logging: one tidy line per request.
        sys.stderr.write("  %s - %s\n" % (self.address_string(), fmt % args))


def local_ip():
    """Best-effort guess of this machine's LAN IP (for the printed URL)."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))  # no packets sent; just picks the route
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def main():
    if not os.path.isdir(WWW):
        sys.exit("Game folder not found: %s" % WWW)

    httpd = http.server.ThreadingHTTPServer((HOST, PORT), Handler)
    host = socket.gethostname()
    ip = local_ip()

    print("\n  \U0001f984  Unicorn Match is being served!\n")
    print("  On any tablet/phone on the SAME WiFi, open one of these:\n")
    print("      http://%s.local:%d/" % (host, PORT))
    print("      http://%s:%d/" % (ip, PORT))
    print("\n  Serving folder: %s" % WWW)
    print("  Press Ctrl+C to stop.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped. Bye! \U0001f44b\n")
        httpd.shutdown()


if __name__ == "__main__":
    main()
