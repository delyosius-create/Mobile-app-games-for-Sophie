/* ✨ Unicorn Match — a two-player fantasy memory game ✨ */
(() => {
  "use strict";

  /* ----------------------------------------------------------------
   * Card designs — unicorns, fairies, frozen princesses, rainbows...
   * Each has a name and its own dreamy gradient.
   * ---------------------------------------------------------------- */
  const DESIGNS = [
    { emoji: "🦄", name: "Unicorn",      c1: "#c084fc", c2: "#f472b6" },
    { emoji: "🌈", name: "Rainbow",      c1: "#60a5fa", c2: "#f472b6" },
    { emoji: "🧚", name: "Fairy",        c1: "#a78bfa", c2: "#34d399" },
    { emoji: "❄️", name: "Ice Princess", c1: "#60a5fa", c2: "#a5f3fc" },
    { emoji: "👑", name: "Royal Crown",  c1: "#fbbf24", c2: "#f59e0b" },
    { emoji: "🧜‍♀️", name: "Mermaid",      c1: "#22d3ee", c2: "#a78bfa" },
    { emoji: "🪄", name: "Magic Wand",   c1: "#818cf8", c2: "#e879f9" },
    { emoji: "🌟", name: "Wishing Star", c1: "#fde047", c2: "#fb923c" },
    { emoji: "🦋", name: "Butterfly",    c1: "#f472b6", c2: "#60a5fa" },
    { emoji: "🐉", name: "Friendly Dragon", c1: "#34d399", c2: "#a3e635" },
    { emoji: "💎", name: "Crystal Gem",  c1: "#38bdf8", c2: "#818cf8" },
    { emoji: "🌸", name: "Blossom",      c1: "#fb7185", c2: "#f9a8d4" },
    { emoji: "💖", name: "Love Heart",   c1: "#f43f5e", c2: "#fb7185" },
    { emoji: "🌙", name: "Crescent Moon", c1: "#6366f1", c2: "#a78bfa" },
    { emoji: "🦢", name: "Swan",         c1: "#a5b4fc", c2: "#fbcfe8" },
    { emoji: "🔮", name: "Crystal Ball", c1: "#8b5cf6", c2: "#d946ef" },
    { emoji: "🏰", name: "Magic Castle", c1: "#f0abfc", c2: "#c4b5fd" },
    { emoji: "🍄", name: "Toadstool",    c1: "#fb7185", c2: "#fda4af" },
  ];

  /* ---------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);

  const state = {
    pairs: 6,
    players: ["Princess 1", "Princess 2"],
    scores: [0, 0],
    current: 0,        // 0 or 1
    moves: 0,
    deck: [],          // array of {id, design, matched}
    first: null,       // index of first flipped card
    busy: false,       // input locked while resolving
    matchedCount: 0,
    soundOn: true,
  };

  /* ---------------- Sound (WebAudio, no asset files) ------------- */
  let audioCtx = null;
  function tone(freq, dur, type = "sine", vol = 0.15, delay = 0) {
    if (!state.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch (_) { /* audio unsupported — ignore */ }
  }
  const sfx = {
    flip:  () => tone(520, 0.12, "triangle", 0.12),
    match: () => { tone(660, 0.14, "sine", 0.16); tone(880, 0.18, "sine", 0.16, 0.1); tone(1100, 0.22, "sine", 0.14, 0.2); },
    nope:  () => { tone(300, 0.16, "sawtooth", 0.10); tone(220, 0.2, "sawtooth", 0.10, 0.12); },
    win:   () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.16, i * 0.15)),
  };

  /* ---------------------- Utilities ------------------------------ */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildDeck(pairs) {
    const chosen = shuffle([...DESIGNS]).slice(0, pairs);
    const deck = [];
    chosen.forEach((d, i) => {
      deck.push({ id: i + "a", design: d, matched: false });
      deck.push({ id: i + "b", design: d, matched: false });
    });
    return shuffle(deck);
  }

  function columnsFor(pairs) {
    const total = pairs * 2;
    if (total <= 12) return 4;   // 4 x 3
    if (total <= 16) return 4;   // 4 x 4
    return total <= 20 ? 5 : 6;  // 5x4 or 6x4
  }

  /* ---------------------- Rendering ------------------------------ */
  function renderBoard() {
    const board = $("#board");
    board.innerHTML = "";
    board.style.setProperty("--cols", columnsFor(state.pairs));

    state.deck.forEach((card, idx) => {
      const el = document.createElement("button");
      el.className = "card";
      el.setAttribute("aria-label", "Hidden card");
      el.dataset.idx = idx;
      el.style.setProperty("--p1", card.design.c1);
      el.style.setProperty("--p2", card.design.c2);

      const back = document.createElement("div");
      back.className = "face face-back";

      const front = document.createElement("div");
      front.className = "face face-front";
      front.style.background = `linear-gradient(150deg, ${card.design.c1}, ${card.design.c2})`;
      front.innerHTML =
        `<span class="emoji">${card.design.emoji}</span>` +
        `<span class="name">${card.design.name}</span>`;

      el.appendChild(back);
      el.appendChild(front);
      el.addEventListener("click", () => onCardClick(idx, el));
      board.appendChild(el);
    });
  }

  function updateScoreboard() {
    $("#score-p1 .score-name").textContent = state.players[0];
    $("#score-p2 .score-name").textContent = state.players[1];
    $("#score-p1 .score-value").textContent = state.scores[0];
    $("#score-p2 .score-value").textContent = state.scores[1];
    $("#moves-count").textContent = state.moves;

    $("#score-p1").classList.toggle("active", state.current === 0);
    $("#score-p2").classList.toggle("active", state.current === 1);
    $("#turn-text").textContent = `${state.players[state.current]}'s turn!`;
    $("#turn-text").style.color = state.current === 0 ? "var(--p1-dark)" : "var(--p2-dark)";
  }

  /* ---------------------- Game flow ------------------------------ */
  function onCardClick(idx, el) {
    if (state.busy) return;
    const card = state.deck[idx];
    if (card.matched) return;
    if (state.first === idx) return;       // same card clicked twice
    if (el.classList.contains("flipped")) return;

    el.classList.add("flipped");
    el.setAttribute("aria-label", card.design.name);
    sfx.flip();

    if (state.first === null) {
      state.first = idx;
      return;
    }

    // second card flipped -> resolve
    state.busy = true;
    state.moves++;
    const firstIdx = state.first;
    state.first = null;
    updateScoreboard();

    const a = state.deck[firstIdx];
    const b = state.deck[idx];
    const cardEls = document.querySelectorAll(".card");

    if (a.design.name === b.design.name) {
      // match!
      setTimeout(() => {
        a.matched = b.matched = true;
        cardEls[firstIdx].classList.add("matched");
        cardEls[idx].classList.add("matched");
        cardEls[firstIdx].classList.remove("flipped");
        cardEls[idx].classList.remove("flipped");
        state.scores[state.current]++;
        state.matchedCount++;
        sfx.match();
        updateScoreboard();
        state.busy = false;
        if (state.matchedCount === state.pairs) endGame();
        // same player goes again — current unchanged
      }, 420);
    } else {
      // no match — flip back & switch player
      setTimeout(() => {
        cardEls[firstIdx].classList.remove("flipped");
        cardEls[idx].classList.remove("flipped");
        cardEls[firstIdx].setAttribute("aria-label", "Hidden card");
        cardEls[idx].setAttribute("aria-label", "Hidden card");
        sfx.nope();
        state.current = state.current === 0 ? 1 : 0;
        updateScoreboard();
        state.busy = false;
      }, 950);
    }
  }

  function startGame() {
    const n1 = $("#p1-name").value.trim() || "Princess 1";
    const n2 = $("#p2-name").value.trim() || "Princess 2";
    state.players = [n1, n2];
    state.scores = [0, 0];
    state.current = 0;
    state.moves = 0;
    state.first = null;
    state.busy = false;
    state.matchedCount = 0;
    state.deck = buildDeck(state.pairs);

    renderBoard();
    updateScoreboard();
    showScreen("game-screen");
  }

  function endGame() {
    setTimeout(() => {
      const [s1, s2] = state.scores;
      const total = s1 + s2;
      let title, flair;
      if (s1 === s2) {
        title = "It's a Tie! 🤝";
        flair = "Two magical champions! You're both winners! 💖";
      } else {
        const winner = s1 > s2 ? state.players[0] : state.players[1];
        title = `${winner} Wins! 🎉`;
        flair = randomFlair();
      }
      $("#result-title").textContent = title;
      $("#res-p1-name").textContent = state.players[0];
      $("#res-p2-name").textContent = state.players[1];
      $("#res-p1-score").textContent = s1;
      $("#res-p2-score").textContent = s2;
      $("#res-total").textContent = total;
      $("#result-flair").textContent = flair;
      $("#results-modal").classList.add("show");
      sfx.win();
      launchConfetti();
    }, 650);
  }

  function randomFlair() {
    const lines = [
      "A truly magical match! ✨",
      "The unicorns are cheering! 🦄",
      "Sparkles all around! 🌟",
      "Fit for a fairy-tale queen! 👑",
      "Rainbow-tastic memory! 🌈",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  /* ---------------------- Confetti ------------------------------- */
  let confettiRAF = null;
  function launchConfetti() {
    const canvas = $("#confetti");
    canvas.classList.add("show");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#a78bfa", "#f472b6", "#fbbf24", "#60a5fa", "#34d399", "#f9a8d4"];
    const emojis = ["✨", "⭐", "💖", "🌈", "🦄", "🌟"];
    const bits = Array.from({ length: 90 }, () => ({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight,
      r: 6 + Math.random() * 8,
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: -0.2 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: Math.random() < 0.3 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
    }));

    const start = performance.now();
    function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach((b) => {
        b.x += b.vx; b.y += b.vy; b.vy += 0.04; b.rot += b.vr;
        if (b.y > innerHeight + 30) { b.y = -20; b.x = Math.random() * innerWidth; b.vy = 2 + Math.random() * 3; }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        if (b.emoji) {
          ctx.font = `${b.r * 2.4}px serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(b.emoji, 0, 0);
        } else {
          ctx.fillStyle = b.color;
          ctx.fillRect(-b.r / 2, -b.r / 2, b.r, b.r * 0.6);
        }
        ctx.restore();
      });
      if (now - start < 6000) {
        confettiRAF = requestAnimationFrame(frame);
      } else {
        canvas.classList.remove("show");
        ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
    }
    cancelAnimationFrame(confettiRAF);
    confettiRAF = requestAnimationFrame(frame);
  }

  /* ---------------------- Screens -------------------------------- */
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("#" + id).classList.add("active");
    window.scrollTo(0, 0);
  }

  /* ---------------------- Wire up UI ----------------------------- */
  function init() {
    // difficulty buttons
    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".diff-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-checked", "true");
        state.pairs = parseInt(btn.dataset.pairs, 10);
      });
    });

    $("#start-btn").addEventListener("click", startGame);
    $("#restart-btn").addEventListener("click", startGame);
    $("#quit-btn").addEventListener("click", () => showScreen("start-screen"));
    $("#play-again-btn").addEventListener("click", () => {
      $("#results-modal").classList.remove("show");
      startGame();
    });
    $("#menu-btn").addEventListener("click", () => {
      $("#results-modal").classList.remove("show");
      showScreen("start-screen");
    });

    const soundBtn = $("#sound-toggle");
    soundBtn.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      soundBtn.textContent = state.soundOn ? "🔊" : "🔇";
      soundBtn.classList.toggle("muted", !state.soundOn);
      if (state.soundOn) sfx.flip();
    });

    // register service worker for offline play
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
