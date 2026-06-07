# 🦄 Play Unicorn Match on your Raspberry Pi

This runs the game on the Pi as a tiny always-on web server, so any tablet on
your **home WiFi** can play it just by opening a link in the browser — no app
store, no APK, no internet required once it's set up.

It uses only Python's standard library, so there's **nothing to `pip install`**.

---

## One-time setup (do this once on the Pi)

1. **Get the game onto the Pi.** Open a terminal on the Pi (or SSH in) and run:

   ```bash
   git clone https://github.com/delyosius-create/Mobile-app-games-for-Sophie.git
   cd Mobile-app-games-for-Sophie
   git checkout claude/fantasy-card-matching-game-ezd0m
   ```

2. **Install the auto-starting server:**

   ```bash
   bash server/install-on-pi.sh
   ```

   That's it. The script sets everything up and prints the link to use. The
   server now starts **automatically every time the Pi boots** — you never have
   to log in to start it.

---

## Playing on a tablet

On any tablet or phone connected to the **same WiFi as the Pi**, open the
browser and go to:

```
http://raspberrypi.local:8080/
```

> Replace `raspberrypi` with your Pi's hostname if you changed it. If the
> `.local` address doesn't work on some tablets (older Android/Fire tablets
> sometimes don't), use the numeric address the installer printed instead,
> e.g. `http://192.168.1.42:8080/`.

**Make it feel like a real app:** in the tablet's browser menu choose
**"Add to Home Screen"**. You'll get a 🦄 icon that opens the game full-screen.

---

## Updating to a newer version

When the game gets new features or sound tweaks, pull them onto the Pi:

```bash
cd Mobile-app-games-for-Sophie
bash server/update.sh
```

The tablets will pick up the new version next time they load the page (the
service worker is served `no-cache`, so updates aren't sticky).

---

## Everyday commands

```bash
sudo systemctl status unicorn-match     # is it running?
sudo systemctl restart unicorn-match    # restart it
sudo systemctl stop unicorn-match       # stop serving
sudo systemctl start unicorn-match      # start again
journalctl -u unicorn-match -f          # watch the live log
```

---

## Want a different port?

Default is **8080**. To use another port, set `PORT` when installing:

```bash
PORT=9000 bash server/install-on-pi.sh
```

Then the link becomes `http://raspberrypi.local:9000/`.

---

## Try it without installing the service

Just want to test it quickly? From the repo folder:

```bash
python3 server/serve.py
```

It prints the link and serves until you press `Ctrl+C`. (This does **not**
auto-start on boot — use `install-on-pi.sh` for that.)

---

## Troubleshooting

- **Tablet can't reach `raspberrypi.local`** → use the numeric
  `http://<pi-ip>:8080/` address. Find the Pi's IP with `hostname -I`.
- **Page won't load at all** → check the server is up:
  `sudo systemctl status unicorn-match`.
- **Tablet shows an old version after an update** → fully close the browser tab
  and reopen, or pull-to-refresh. The server already tells browsers not to
  cache the service worker, so this is rare.
- **Port already in use** → reinstall with a different `PORT` (see above).

---

This setup is **home-WiFi only** — the Pi is not exposed to the internet, so
there's nothing to lock down. If you ever want to play from outside the house,
ask and we can add a secure tunnel (Tailscale or Cloudflare Tunnel).
