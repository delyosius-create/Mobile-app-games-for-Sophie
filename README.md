# 🦄 Unicorn Match — A Fantasy Card Matching Game ✨

A magical, two-player **memory / card-matching game** (flip cards, find the
pairs — like a fairy-tale twist on "Go Fish"). Every card is full of things a
little princess loves: **unicorns, rainbows, fairies, frozen ice princesses,
mermaids, magic castles, crowns, dragons, butterflies and more.** 🌈👑

Made for **Sophie** 💖

![icon](www/icons/icon-192.png)

---

## 🎮 How to play

1. Enter the two players' names and pick a magic level:
   - 🌸 **Easy** — 12 cards (6 pairs)
   - 🌟 **Medium** — 16 cards (8 pairs)
   - 👑 **Royal** — 24 cards (12 pairs)
2. Players take turns flipping **two cards**.
3. **Match?** Score a point and go again! ✨
4. **No match?** The cards flip back and it's the next player's turn.
5. When every pair is found, the game shows each player's score, the
   **total pairs found**, and crowns the **winner** (or celebrates a tie) with
   confetti! 🎉

Two players share one device (pass-and-play). Works great on phones, tablets,
and computers.

---

## ▶️ Play it right now (web)

It's a plain web app — no build step needed.

```bash
# from the project folder
npm run serve        # or: python3 -m http.server 8000 --directory www
```

Then open <http://localhost:8000> in a browser.

### Install it on an Android phone (no APK needed)

Open the hosted page in Chrome on Android → tap the **⋮ menu → "Add to Home
screen"**. It installs like an app, runs **fullscreen**, and works **offline**
(it's a PWA).

---

## 📱 Getting the Android **APK** file

The repo is wired up with [Capacitor](https://capacitorjs.com/) and a GitHub
Actions workflow that builds a real, installable `.apk` for you — no Android
Studio required.

### Easiest way — let GitHub build it

1. Push this repo to GitHub (already done if you're reading this there).
2. Go to the **Actions** tab → **"Build Android APK"** → **Run workflow**.
3. When it finishes:
   - Download **`UnicornMatch-APK`** from the run's **Artifacts**, **or**
   - Grab **`UnicornMatch.apk`** from the **Releases** page it creates.
4. Copy the `.apk` to an Android phone and tap it to install. (You may need to
   allow *"Install from unknown sources"* the first time.)

The workflow also runs automatically whenever the game files change.

### Build it yourself locally

Requires **Node.js**, **JDK 21**, and the **Android SDK**.

```bash
npm install
npx cap add android          # creates the native android/ project
npm run build:apk            # syncs web assets + assembles the debug APK
# APK lands at: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🗂️ Project structure

```
www/                  The whole game (open index.html to play)
  index.html          Markup & screens
  css/styles.css      Dreamy fairy-tale styling
  js/game.js          Game logic, scoring, sounds & confetti
  manifest.webmanifest + sw.js   PWA / offline support
  icons/              App icons
capacitor.config.json Capacitor (web → Android) config
package.json          Scripts & Capacitor dependencies
tools/make_icons.py   Regenerates the app icons (pure Python, no deps)
.github/workflows/    CI that builds the downloadable APK
```

## ✨ Features

- 👯 Two-player pass-and-play with custom names
- 🎚️ Three difficulty levels
- 🏆 Per-player scoring **and a final total calculation** with a winner / tie
- 🔊 Gentle sound effects (toggle on/off) — generated in-browser, no files
- 🎉 Confetti celebration
- 📴 Fully offline-capable, no ads, no tracking, no internet required to play

Everything is self-contained — the cards are drawn with emoji and CSS, so there
are **no copyrighted images** and nothing extra to download. 🌟
