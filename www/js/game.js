/* ✨ Match Magic — a two-player memory game with theme packs ✨ */
(() => {
  "use strict";

  /* ----------------------------------------------------------------
   * Theme packs. Each card is { emoji, name, sound }.
   * Colours are assigned from PALETTE at deck-build time so the card
   * fronts stay bright and varied without hand-writing a colour per card.
   * ---------------------------------------------------------------- */
  const THEMES = [
    {
      id: "fantasy", name: "Fantasy", icon: "🦄",
      cards: [
        { emoji: "🦄", name: "Unicorn",      sound: "magic" },
        { emoji: "🌈", name: "Rainbow",      sound: "magic" },
        { emoji: "🧚", name: "Fairy",        sound: "magic" },
        { emoji: "❄️", name: "Ice Princess", sound: "ding" },
        { emoji: "👑", name: "Crown",        sound: "ding" },
        { emoji: "🧜‍♀️", name: "Mermaid",      sound: "splash" },
        { emoji: "🪄", name: "Magic Wand",   sound: "wish" },
        { emoji: "🌟", name: "Wishing Star", sound: "magic" },
        { emoji: "🦋", name: "Butterfly",    sound: "chirp" },
        { emoji: "🐉", name: "Dragon",       sound: "growl" },
        { emoji: "💎", name: "Crystal Gem",  sound: "ding" },
        { emoji: "🌸", name: "Blossom",      sound: "pop" },
        { emoji: "💖", name: "Love Heart",   sound: "pop" },
        { emoji: "🌙", name: "Moon",         sound: "magic" },
        { emoji: "🦢", name: "Swan",         sound: "chirp" },
        { emoji: "🔮", name: "Crystal Ball", sound: "ding" },
        { emoji: "🏰", name: "Castle",       sound: "magic" },
        { emoji: "🍄", name: "Toadstool",    sound: "pop" },
      ],
    },
    {
      id: "animals", name: "Animals", icon: "🐾",
      cards: [
        { emoji: "🐶", name: "Dog",      sound: "woof" },
        { emoji: "🐱", name: "Cat",      sound: "meow" },
        { emoji: "🦁", name: "Lion",     sound: "roar" },
        { emoji: "🐘", name: "Elephant", sound: "roar" },
        { emoji: "🐵", name: "Monkey",   sound: "chirp" },
        { emoji: "🐸", name: "Frog",     sound: "boing" },
        { emoji: "🐧", name: "Penguin",  sound: "chirp" },
        { emoji: "🦊", name: "Fox",      sound: "woof" },
        { emoji: "🦉", name: "Owl",      sound: "hoot" },
        { emoji: "🐻", name: "Bear",     sound: "growl" },
        { emoji: "🐯", name: "Tiger",    sound: "roar" },
        { emoji: "🐼", name: "Panda",    sound: "pop" },
        { emoji: "🐨", name: "Koala",    sound: "pop" },
        { emoji: "🐴", name: "Horse",    sound: "neigh" },
        { emoji: "🐮", name: "Cow",      sound: "moo" },
        { emoji: "🐷", name: "Pig",      sound: "boing" },
        { emoji: "🐥", name: "Chick",    sound: "chirp" },
        { emoji: "🐰", name: "Rabbit",   sound: "pop" },
        { emoji: "🐍", name: "Snake",    sound: "buzz" },
        { emoji: "🐝", name: "Bee",      sound: "buzz" },
        { emoji: "🐢", name: "Turtle",   sound: "pop" },
        { emoji: "🐳", name: "Whale",    sound: "splash" },
        { emoji: "🐠", name: "Fish",     sound: "splash" },
        { emoji: "🐞", name: "Ladybug",  sound: "buzz" },
      ],
    },
    {
      id: "trucks", name: "Trucks", icon: "🚚",
      cards: [
        { emoji: "🚜", name: "Tractor",      sound: "engine" },
        { emoji: "🚛", name: "Big Rig",      sound: "honk" },
        { emoji: "🚚", name: "Delivery Truck", sound: "honk" },
        { emoji: "🚒", name: "Fire Truck",   sound: "siren" },
        { emoji: "🚓", name: "Police Car",   sound: "siren" },
        { emoji: "🚑", name: "Ambulance",    sound: "siren" },
        { emoji: "🏗️", name: "Crane",        sound: "engine" },
        { emoji: "🛻", name: "Pickup",       sound: "engine" },
        { emoji: "🚙", name: "SUV",          sound: "engine" },
        { emoji: "🚗", name: "Car",          sound: "engine" },
        { emoji: "🚌", name: "Bus",          sound: "honk" },
        { emoji: "🚐", name: "Van",          sound: "engine" },
        { emoji: "🚕", name: "Taxi",         sound: "honk" },
        { emoji: "🚧", name: "Barrier",      sound: "pop" },
        { emoji: "🔧", name: "Wrench",       sound: "ding" },
        { emoji: "🔨", name: "Hammer",       sound: "pop" },
        { emoji: "🚂", name: "Train",        sound: "honk" },
        { emoji: "✈️", name: "Plane",        sound: "engine" },
        { emoji: "🚁", name: "Helicopter",   sound: "engine" },
        { emoji: "🚀", name: "Rocket",       sound: "engine" },
        { emoji: "🚢", name: "Ship",         sound: "honk" },
        { emoji: "🛺", name: "Auto",         sound: "engine" },
        { emoji: "🚦", name: "Traffic Light", sound: "pop" },
        { emoji: "🛹", name: "Skateboard",   sound: "pop" },
      ],
    },
    {
      id: "nature", name: "Nature", icon: "🌳",
      cards: [
        { emoji: "🌳", name: "Tree",      sound: "rustle" },
        { emoji: "🌲", name: "Pine",      sound: "rustle" },
        { emoji: "🌴", name: "Palm",      sound: "rustle" },
        { emoji: "🌵", name: "Cactus",    sound: "pop" },
        { emoji: "🌷", name: "Tulip",     sound: "pop" },
        { emoji: "🌸", name: "Blossom",   sound: "pop" },
        { emoji: "🌹", name: "Rose",      sound: "pop" },
        { emoji: "🌻", name: "Sunflower", sound: "pop" },
        { emoji: "🌼", name: "Daisy",     sound: "pop" },
        { emoji: "🍀", name: "Clover",    sound: "pop" },
        { emoji: "🍄", name: "Mushroom",  sound: "pop" },
        { emoji: "🍂", name: "Leaf",      sound: "rustle" },
        { emoji: "🍁", name: "Maple",     sound: "rustle" },
        { emoji: "🌿", name: "Herb",      sound: "rustle" },
        { emoji: "☀️", name: "Sun",       sound: "magic" },
        { emoji: "🌈", name: "Rainbow",   sound: "magic" },
        { emoji: "⛰️", name: "Mountain",  sound: "rustle" },
        { emoji: "🌊", name: "Wave",      sound: "splash" },
        { emoji: "🐚", name: "Shell",     sound: "splash" },
        { emoji: "🌙", name: "Moon",      sound: "magic" },
        { emoji: "⭐", name: "Star",      sound: "magic" },
        { emoji: "❄️", name: "Snowflake", sound: "ding" },
        { emoji: "💧", name: "Dewdrop",   sound: "splash" },
        { emoji: "🦋", name: "Butterfly", sound: "chirp" },
      ],
    },
    {
      id: "monsters", name: "Silly Monsters", icon: "👾",
      cards: [
        { emoji: "👾", name: "Space Monster", sound: "boing" },
        { emoji: "👻", name: "Ghost",      sound: "ghost" },
        { emoji: "🤖", name: "Robot",      sound: "robot" },
        { emoji: "👽", name: "Alien",      sound: "magic" },
        { emoji: "🎃", name: "Pumpkin",    sound: "boing" },
        { emoji: "😈", name: "Imp",        sound: "growl" },
        { emoji: "👹", name: "Ogre",       sound: "roar" },
        { emoji: "👺", name: "Goblin",     sound: "growl" },
        { emoji: "🤡", name: "Clown",      sound: "honk" },
        { emoji: "💀", name: "Skull",      sound: "ghost" },
        { emoji: "🦖", name: "T-Rex",      sound: "roar" },
        { emoji: "🐲", name: "Dragon",     sound: "growl" },
        { emoji: "🧟", name: "Zombie",     sound: "growl" },
        { emoji: "🧛", name: "Vampire",    sound: "ghost" },
        { emoji: "🧙", name: "Wizard",     sound: "magic" },
        { emoji: "🧚", name: "Pixie",      sound: "magic" },
        { emoji: "🦄", name: "Unicorn",    sound: "magic" },
        { emoji: "🐙", name: "Octopus",    sound: "splash" },
        { emoji: "🦇", name: "Bat",        sound: "chirp" },
        { emoji: "🕷️", name: "Spider",     sound: "buzz" },
        { emoji: "⚡", name: "Lightning",  sound: "zap" },
        { emoji: "🔮", name: "Orb",        sound: "ding" },
        { emoji: "🌟", name: "Star",       sound: "magic" },
        { emoji: "🍭", name: "Lollipop",   sound: "pop" },
      ],
    },
    {
      id: "ocean", name: "Ocean", icon: "🐠",
      cards: [
        { emoji: "🐠", name: "Tropical Fish", sound: "splash" },
        { emoji: "🐟", name: "Fish",        sound: "splash" },
        { emoji: "🐡", name: "Pufferfish",  sound: "boing" },
        { emoji: "🦈", name: "Shark",       sound: "growl" },
        { emoji: "🐙", name: "Octopus",     sound: "splash" },
        { emoji: "🦑", name: "Squid",       sound: "splash" },
        { emoji: "🦐", name: "Shrimp",      sound: "pop" },
        { emoji: "🦞", name: "Lobster",     sound: "pop" },
        { emoji: "🦀", name: "Crab",        sound: "pop" },
        { emoji: "🐚", name: "Seashell",    sound: "ding" },
        { emoji: "🐬", name: "Dolphin",     sound: "chirp" },
        { emoji: "🐳", name: "Whale",       sound: "splash" },
        { emoji: "🐋", name: "Blue Whale",  sound: "splash" },
        { emoji: "🐢", name: "Sea Turtle",  sound: "pop" },
        { emoji: "🪼", name: "Jellyfish",   sound: "boing" },
        { emoji: "🦭", name: "Seal",        sound: "woof" },
        { emoji: "🦦", name: "Otter",       sound: "chirp" },
        { emoji: "⚓", name: "Anchor",      sound: "ding" },
        { emoji: "🏝️", name: "Island",      sound: "rustle" },
        { emoji: "🌊", name: "Wave",        sound: "waves" },
        { emoji: "🐊", name: "Crocodile",   sound: "growl" },
        { emoji: "🪸", name: "Coral",       sound: "pop" },
        { emoji: "🐧", name: "Penguin",     sound: "chirp" },
        { emoji: "🦩", name: "Flamingo",    sound: "chirp" },
      ],
    },
    {
      id: "food", name: "Food & Sweets", icon: "🍩",
      cards: [
        { emoji: "🍩", name: "Donut",        sound: "pop" },
        { emoji: "🍪", name: "Cookie",       sound: "pop" },
        { emoji: "🧁", name: "Cupcake",      sound: "wish" },
        { emoji: "🍰", name: "Cake Slice",   sound: "wish" },
        { emoji: "🎂", name: "Birthday Cake", sound: "wish" },
        { emoji: "🍦", name: "Ice Cream",    sound: "ding" },
        { emoji: "🍧", name: "Shaved Ice",   sound: "ding" },
        { emoji: "🍨", name: "Sundae",       sound: "ding" },
        { emoji: "🍫", name: "Chocolate",    sound: "pop" },
        { emoji: "🍬", name: "Candy",        sound: "ding" },
        { emoji: "🍭", name: "Lollipop",     sound: "pop" },
        { emoji: "🍮", name: "Custard",      sound: "pop" },
        { emoji: "🍓", name: "Strawberry",   sound: "pop" },
        { emoji: "🍎", name: "Apple",        sound: "pop" },
        { emoji: "🍌", name: "Banana",       sound: "boing" },
        { emoji: "🍉", name: "Watermelon",   sound: "pop" },
        { emoji: "🍇", name: "Grapes",       sound: "pop" },
        { emoji: "🍒", name: "Cherries",     sound: "pop" },
        { emoji: "🍑", name: "Peach",        sound: "pop" },
        { emoji: "🥨", name: "Pretzel",      sound: "pop" },
        { emoji: "🥐", name: "Croissant",    sound: "pop" },
        { emoji: "🍕", name: "Pizza",        sound: "pop" },
        { emoji: "🍔", name: "Burger",       sound: "pop" },
        { emoji: "🌭", name: "Hot Dog",      sound: "pop" },
      ],
    },
    {
      id: "space", name: "Space", icon: "🚀",
      cards: [
        { emoji: "🚀", name: "Rocket",       sound: "engine" },
        { emoji: "🛸", name: "UFO",          sound: "robot" },
        { emoji: "🪐", name: "Saturn",       sound: "magic" },
        { emoji: "🌍", name: "Earth",        sound: "magic" },
        { emoji: "🌙", name: "Moon",         sound: "magic" },
        { emoji: "⭐", name: "Star",         sound: "ding" },
        { emoji: "🌟", name: "Bright Star",  sound: "magic" },
        { emoji: "☄️", name: "Comet",        sound: "zap" },
        { emoji: "🌌", name: "Milky Way",    sound: "magic" },
        { emoji: "🌠", name: "Shooting Star", sound: "wish" },
        { emoji: "👽", name: "Alien",        sound: "robot" },
        { emoji: "🛰️", name: "Satellite",    sound: "robot" },
        { emoji: "🔭", name: "Telescope",    sound: "ding" },
        { emoji: "🌞", name: "Sun",          sound: "magic" },
        { emoji: "⚡", name: "Lightning",    sound: "zap" },
        { emoji: "🌑", name: "New Moon",     sound: "magic" },
        { emoji: "🌕", name: "Full Moon",    sound: "magic" },
        { emoji: "👨‍🚀", name: "Astronaut",   sound: "robot" },
        { emoji: "🌎", name: "Planet",       sound: "magic" },
        { emoji: "🌛", name: "Crescent",     sound: "magic" },
        { emoji: "🌀", name: "Galaxy",       sound: "zap" },
        { emoji: "🪨", name: "Meteor",       sound: "pop" },
        { emoji: "👾", name: "Invader",      sound: "boing" },
        { emoji: "✨", name: "Sparkles",     sound: "magic" },
      ],
    },
  ];

  /* Bright gradient palette cycled across each deck's cards. */
  const PALETTE = [
    ["#c084fc", "#f472b6"], ["#60a5fa", "#f472b6"], ["#a78bfa", "#34d399"],
    ["#60a5fa", "#a5f3fc"], ["#fbbf24", "#f59e0b"], ["#22d3ee", "#a78bfa"],
    ["#818cf8", "#e879f9"], ["#fde047", "#fb923c"], ["#f472b6", "#60a5fa"],
    ["#34d399", "#a3e635"], ["#38bdf8", "#818cf8"], ["#fb7185", "#f9a8d4"],
    ["#f43f5e", "#fb7185"], ["#6366f1", "#a78bfa"], ["#2dd4bf", "#5eead4"],
    ["#f0abfc", "#c4b5fd"], ["#fca5a5", "#fdba74"], ["#86efac", "#5eead4"],
  ];

  /* ---------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);

  const state = {
    themeId: "fantasy",
    pairs: 6,
    players: ["Player 1", "Player 2"],
    scores: [0, 0],
    current: 0,
    moves: 0,
    deck: [],
    first: null,
    busy: false,
    matchedCount: 0,
    soundOn: true,
  };

  const theme = () => THEMES.find((t) => t.id === state.themeId) || THEMES[0];

  /* ---------------- Sound engine (WebAudio, no asset files) -------- */
  let actx = null;
  function ctx() {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    return actx;
  }
  function gainEnv(t0, dur, peak) {
    const g = ctx().createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    g.connect(ctx().destination);
    return g;
  }
  function tone(freq, t0, dur, opt = {}) {
    const { type = "sine", peak = 0.15, slideTo = null, vibrato = null } = opt;
    const o = ctx().createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    if (vibrato) {
      const lfo = ctx().createOscillator();
      const lg = ctx().createGain();
      lfo.frequency.value = vibrato.rate;
      lg.gain.value = vibrato.depth;
      lfo.connect(lg); lg.connect(o.frequency);
      lfo.start(t0); lfo.stop(t0 + dur + 0.05);
    }
    o.connect(gainEnv(t0, dur, peak));
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noiseHit(t0, dur, opt = {}) {
    const { peak = 0.15, type = "lowpass", freq = 1200, slideTo = null } = opt;
    const len = Math.max(1, Math.floor(ctx().sampleRate * dur));
    const buf = ctx().createBuffer(1, len, ctx().sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx().createBufferSource();
    src.buffer = buf;
    const filt = ctx().createBiquadFilter();
    filt.type = type;
    filt.frequency.setValueAtTime(freq, t0);
    if (slideTo) filt.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
    src.connect(filt); filt.connect(gainEnv(t0, dur, peak));
    src.start(t0); src.stop(t0 + dur + 0.05);
  }

  /* A distinct little "voice" for each kind of card. */
  const VOICES = {
    magic:  (t) => [659, 988, 1319, 1760].forEach((f, i) => tone(f, t + i * 0.08, 0.5, { type: "triangle", peak: 0.16 })),
    wish:   (t) => { tone(700, t, 0.5, { type: "sine", peak: 0.14, slideTo: 1900 }); [1568, 2093].forEach((f, i) => tone(f, t + 0.26 + i * 0.08, 0.4, { type: "triangle", peak: 0.1 })); },
    ding:   (t) => { tone(1047, t, 0.7, { type: "sine", peak: 0.18 }); tone(1568, t, 0.7, { type: "sine", peak: 0.08 }); tone(2093, t + 0.02, 0.5, { type: "sine", peak: 0.05 }); },
    growl:  (t) => tone(120, t, 0.5, { type: "sawtooth", peak: 0.18, slideTo: 70, vibrato: { rate: 18, depth: 14 } }),
    roar:   (t) => { tone(160, t, 0.6, { type: "sawtooth", peak: 0.2, slideTo: 80, vibrato: { rate: 22, depth: 30 } }); noiseHit(t, 0.6, { peak: 0.06, type: "bandpass", freq: 500, slideTo: 200 }); },
    chirp:  (t) => [0, 1, 2].forEach((i) => tone(2200 + i * 200, t + i * 0.09, 0.08, { type: "sine", peak: 0.12, slideTo: 2600 + i * 200 })),
    hoot:   (t) => { tone(420, t, 0.18, { type: "sine", peak: 0.14, slideTo: 380 }); tone(420, t + 0.25, 0.22, { type: "sine", peak: 0.14, slideTo: 360 }); },
    engine: (t) => { tone(70, t, 0.55, { type: "sawtooth", peak: 0.16, vibrato: { rate: 14, depth: 8 } }); tone(105, t, 0.55, { type: "square", peak: 0.06, vibrato: { rate: 14, depth: 6 } }); },
    honk:   (t) => { tone(330, t, 0.18, { type: "square", peak: 0.16 }); tone(440, t + 0.16, 0.22, { type: "square", peak: 0.16 }); },
    siren:  (t) => { tone(700, t, 0.25, { type: "sawtooth", peak: 0.12, slideTo: 1100 }); tone(1100, t + 0.25, 0.25, { type: "sawtooth", peak: 0.12, slideTo: 700 }); },
    boing:  (t) => tone(600, t, 0.35, { type: "square", peak: 0.16, slideTo: 160 }),
    splash: (t) => noiseHit(t, 0.4, { peak: 0.16, type: "lowpass", freq: 3000, slideTo: 300 }),
    rustle: (t) => { noiseHit(t, 0.5, { peak: 0.1, type: "bandpass", freq: 2600 }); noiseHit(t + 0.12, 0.4, { peak: 0.07, type: "bandpass", freq: 1800 }); },
    pop:    (t) => tone(880, t, 0.16, { type: "sine", peak: 0.16, slideTo: 1200 }),
    woof:   (t) => { tone(220, t, 0.14, { type: "sawtooth", peak: 0.18, slideTo: 150 }); tone(200, t + 0.16, 0.16, { type: "sawtooth", peak: 0.16, slideTo: 130 }); },
    meow:   (t) => tone(680, t, 0.4, { type: "sawtooth", peak: 0.12, slideTo: 520, vibrato: { rate: 12, depth: 30 } }),
    moo:    (t) => tone(170, t, 0.6, { type: "sawtooth", peak: 0.16, slideTo: 130, vibrato: { rate: 7, depth: 8 } }),
    neigh:  (t) => tone(520, t, 0.4, { type: "sawtooth", peak: 0.14, slideTo: 300, vibrato: { rate: 30, depth: 45 } }),
    buzz:   (t) => tone(280, t, 0.45, { type: "sawtooth", peak: 0.12, vibrato: { rate: 40, depth: 40 } }),
    zap:    (t) => { tone(1500, t, 0.18, { type: "sawtooth", peak: 0.14, slideTo: 200 }); noiseHit(t, 0.18, { peak: 0.08, type: "highpass", freq: 1500 }); },
    ghost:  (t) => tone(500, t, 0.6, { type: "sine", peak: 0.12, slideTo: 300, vibrato: { rate: 8, depth: 60 } }),
    robot:  (t) => [400, 300, 520, 360].forEach((f, i) => tone(f, t + i * 0.1, 0.08, { type: "square", peak: 0.12 })),
    default:(t) => { tone(660, t, 0.14, { type: "sine", peak: 0.16 }); tone(880, t + 0.1, 0.18, { type: "sine", peak: 0.16 }); tone(1100, t + 0.2, 0.22, { type: "sine", peak: 0.14 }); },
  };

  function playVoice(name) {
    if (!state.soundOn) return;
    if (CLIPS[name] && playClip(CLIPS[name])) return; // real recording when we have one
    try { (VOICES[name] || VOICES.default)(ctx().currentTime); } catch (_) { /* ignore */ }
  }

  /* Real recorded clips (CC0, from freesound.org via github.com/deltabrot/
   * sound-effects) used in place of synth where a good recording exists.
   * Anything without a clip falls back to the synth voice above. */
  const CLIPS = {
    woof:   "sounds/dog-bark.wav",
    meow:   "sounds/cat-meow.wav",
    moo:    "sounds/cow-moo.wav",
    chirp:  "sounds/birds-chirping.wav",
    splash: "sounds/water-drop.wav",
    waves:  "sounds/wave-crash.wav",
  };
  const audioCache = {};
  function playClip(url, opt) {
    const { volume = 0.6, maxMs = 1500 } = opt || {};
    try {
      let a = audioCache[url];
      if (!a) { a = new Audio(url); a.preload = "auto"; audioCache[url] = a; }
      a.pause(); a.currentTime = 0; a.volume = volume;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
      clearTimeout(a._stop);
      a._stop = setTimeout(() => { try { a.pause(); } catch (_) {} }, maxMs);
      return true;
    } catch (_) { return false; }
  }

  /* Gentle haptic feedback on phones that support it. */
  function buzz(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) { /* ignore */ }
  }
  const sfx = {
    flip: () => { if (state.soundOn) try { tone(520, ctx().currentTime, 0.12, { type: "triangle", peak: 0.12 }); } catch (_) {} },
    nope: () => { if (state.soundOn) try { const t = ctx().currentTime; tone(300, t, 0.16, { type: "sawtooth", peak: 0.1, slideTo: 220 }); tone(220, t + 0.12, 0.2, { type: "sawtooth", peak: 0.1, slideTo: 160 }); } catch (_) {} },
    win:  () => { if (state.soundOn) try { [523, 659, 784, 1047].forEach((f, i) => tone(f, ctx().currentTime + i * 0.15, 0.3, { type: "triangle", peak: 0.16 })); } catch (_) {} },
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
    const chosen = shuffle([...theme().cards]).slice(0, pairs);
    const deck = [];
    chosen.forEach((d, i) => {
      const [c1, c2] = PALETTE[i % PALETTE.length];
      const card = { ...d, c1, c2 };
      deck.push({ id: i + "a", design: card, matched: false });
      deck.push({ id: i + "b", design: card, matched: false });
    });
    return shuffle(deck);
  }

  /* ---------------------- Layout (auto-fit) ---------------------- */
  /* Pick the column count + card size that fills the board area best,
   * in any orientation and for any number of cards. */
  function layoutBoard() {
    const board = $("#board");
    const n = state.deck.length;
    if (!n) return;
    const rect = board.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    if (W < 20 || H < 20) { requestAnimationFrame(layoutBoard); return; }

    const vmin = Math.min(window.innerWidth, window.innerHeight);
    const gap = Math.max(5, Math.min(12, vmin * 0.016));
    const aspect = 3 / 4; // card width / height

    let best = { cols: 1, size: 0, rows: n };
    for (let c = 1; c <= n; c++) {
      const rows = Math.ceil(n / c);
      const cw = (W - gap * (c - 1)) / c;
      const ch = (H - gap * (rows - 1)) / rows;
      const cardW = Math.max(0, Math.min(cw, ch * aspect));
      if (cardW > best.size) best = { cols: c, size: cardW, rows };
    }
    board.style.gap = gap.toFixed(1) + "px";
    board.style.setProperty("--cols", best.cols);
    board.style.setProperty("--card-w", Math.floor(best.size) + "px");
  }

  let layoutRAF = 0;
  function scheduleLayout() {
    cancelAnimationFrame(layoutRAF);
    layoutRAF = requestAnimationFrame(layoutBoard);
  }

  /* ---------------------- Rendering ------------------------------ */
  function renderBoard() {
    const board = $("#board");
    board.innerHTML = "";

    state.deck.forEach((card, idx) => {
      const el = document.createElement("button");
      el.className = "card";
      el.setAttribute("aria-label", "Hidden card");
      el.dataset.idx = idx;

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

    layoutBoard();
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

  /* Big emoji that bursts in the centre of the screen, then fades. */
  function matchBurst(emoji) {
    const el = $("#match-burst");
    el.innerHTML = `<span>${emoji}</span>`;
    el.classList.remove("show");
    // force reflow so the animation restarts every time
    void el.offsetWidth;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 1000);
  }

  /* ---------------------- Game flow ------------------------------ */
  function onCardClick(idx, el) {
    if (state.busy) return;
    const card = state.deck[idx];
    if (card.matched) return;
    if (state.first === idx) return;
    if (el.classList.contains("flipped")) return;

    el.classList.add("flipped");
    el.setAttribute("aria-label", card.design.name);
    sfx.flip();

    if (state.first === null) {
      state.first = idx;
      return;
    }

    state.busy = true;
    state.moves++;
    const firstIdx = state.first;
    state.first = null;
    updateScoreboard();

    const a = state.deck[firstIdx];
    const b = state.deck[idx];
    const cardEls = document.querySelectorAll(".card");

    if (a.design.name === b.design.name) {
      setTimeout(() => {
        a.matched = b.matched = true;
        cardEls[firstIdx].classList.add("matched");
        cardEls[idx].classList.add("matched");
        cardEls[firstIdx].classList.remove("flipped");
        cardEls[idx].classList.remove("flipped");
        state.scores[state.current]++;
        state.matchedCount++;
        playVoice(a.design.sound);     // sound that matches the emoji
        matchBurst(a.design.emoji);    // big burst animation
        buzz(55);                      // little haptic celebration
        updateScoreboard();
        state.busy = false;
        if (state.matchedCount === state.pairs) endGame();
      }, 420);
    } else {
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
    const n1 = $("#p1-name").value.trim() || "Player 1";
    const n2 = $("#p2-name").value.trim() || "Player 2";
    state.players = [n1, n2];
    state.scores = [0, 0];
    state.current = 0;
    state.moves = 0;
    state.first = null;
    state.busy = false;
    state.matchedCount = 0;
    state.pairs = Math.max(2, Math.min(state.pairs, theme().cards.length));
    state.deck = buildDeck(state.pairs);
    savePrefs();

    $(".turn-emoji").textContent = theme().icon;
    renderBoard();
    updateScoreboard();
    showScreen("game-screen");
    scheduleLayout();
  }

  function endGame() {
    setTimeout(() => {
      const [s1, s2] = state.scores;
      const total = s1 + s2;
      let title, flair;
      if (s1 === s2) {
        title = "It's a Tie! 🤝";
        flair = "Two champions! You're both winners! 💖";
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
      buzz([0, 80, 50, 80, 50, 160]);
      launchConfetti();
    }, 650);
  }

  function randomFlair() {
    const lines = [
      "A truly magical match! ✨",
      "Amazing memory! 🌟",
      "Sparkles all around! 🎉",
      "Fit for a champion! 👑",
      "Rainbow-tastic! 🌈",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  /* ---------------------- Confetti ------------------------------- */
  let confettiRAF = null;
  function launchConfetti() {
    const canvas = $("#confetti");
    canvas.classList.add("show");
    const ctx2 = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx2.scale(dpr, dpr);

    const colors = ["#a78bfa", "#f472b6", "#fbbf24", "#60a5fa", "#34d399", "#f9a8d4"];
    const emojis = ["✨", "⭐", "💖", "🌈", theme().icon, "🌟"];
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
      ctx2.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach((b) => {
        b.x += b.vx; b.y += b.vy; b.vy += 0.04; b.rot += b.vr;
        if (b.y > innerHeight + 30) { b.y = -20; b.x = Math.random() * innerWidth; b.vy = 2 + Math.random() * 3; }
        ctx2.save();
        ctx2.translate(b.x, b.y);
        ctx2.rotate(b.rot);
        if (b.emoji) {
          ctx2.font = `${b.r * 2.4}px serif`;
          ctx2.textAlign = "center"; ctx2.textBaseline = "middle";
          ctx2.fillText(b.emoji, 0, 0);
        } else {
          ctx2.fillStyle = b.color;
          ctx2.fillRect(-b.r / 2, -b.r / 2, b.r, b.r * 0.6);
        }
        ctx2.restore();
      });
      if (now - start < 6000) {
        confettiRAF = requestAnimationFrame(frame);
      } else {
        canvas.classList.remove("show");
        ctx2.clearRect(0, 0, innerWidth, innerHeight);
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

  /* ---------------------- Preferences (remembered) --------------- */
  const PREFS_KEY = "matchmagic.prefs";
  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        theme: state.themeId,
        pairs: state.pairs,
        sound: state.soundOn,
        p1: $("#p1-name").value,
        p2: $("#p2-name").value,
      }));
    } catch (_) { /* ignore */ }
  }
  function loadPrefs() {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"); } catch (_) { p = {}; }
    if (p.theme && THEMES.some((t) => t.id === p.theme)) state.themeId = p.theme;
    if (typeof p.sound === "boolean") state.soundOn = p.sound;
    if (p.p1) $("#p1-name").value = p.p1;
    if (p.p2) $("#p2-name").value = p.p2;
    if (Number.isFinite(p.pairs)) state.pairs = p.pairs; // clamped later in setPairs
  }

  /* ---------------------- Start-screen controls ------------------ */
  function updatePairReadout() {
    $("#pairs-count").textContent = state.pairs;
    $("#cards-count").textContent = state.pairs * 2;
    const slider = $("#pairs-slider");
    if (+slider.value !== state.pairs) slider.value = state.pairs;
  }

  function setPairs(n, fromPreset) {
    state.pairs = Math.max(2, Math.min(n, theme().cards.length));
    // highlight a preset only if it exactly matches
    document.querySelectorAll(".diff-btn").forEach((b) => {
      const on = +b.dataset.pairs === state.pairs;
      b.classList.toggle("active", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
    });
    updatePairReadout();
    savePrefs();
  }

  function buildThemePicker() {
    const wrap = $("#theme-options");
    wrap.innerHTML = "";
    THEMES.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "theme-btn" + (t.id === state.themeId ? " active" : "");
      btn.dataset.theme = t.id;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", t.id === state.themeId ? "true" : "false");
      btn.innerHTML = `<span class="theme-emoji">${t.icon}</span><span class="theme-name">${t.name}</span>`;
      btn.addEventListener("click", () => selectTheme(t.id));
      wrap.appendChild(btn);
    });
  }

  function selectTheme(id) {
    state.themeId = id;
    document.querySelectorAll(".theme-btn").forEach((b) => {
      const on = b.dataset.theme === id;
      b.classList.toggle("active", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
    });
    // keep the slider's max in range for this theme
    const max = theme().cards.length;
    $("#pairs-slider").max = max;
    setPairs(state.pairs, false);
  }

  /* ---------------------- Wire up UI ----------------------------- */
  function init() {
    loadPrefs();
    buildThemePicker();

    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => setPairs(parseInt(btn.dataset.pairs, 10), true));
    });

    const slider = $("#pairs-slider");
    slider.max = theme().cards.length;
    slider.addEventListener("input", () => setPairs(parseInt(slider.value, 10), false));
    setPairs(state.pairs, false); // clamp + sync slider/presets to saved size

    $("#p1-name").addEventListener("change", savePrefs);
    $("#p2-name").addEventListener("change", savePrefs);

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
    soundBtn.textContent = state.soundOn ? "🔊" : "🔇";
    soundBtn.classList.toggle("muted", !state.soundOn);
    soundBtn.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      soundBtn.textContent = state.soundOn ? "🔊" : "🔇";
      soundBtn.classList.toggle("muted", !state.soundOn);
      if (state.soundOn) sfx.flip();
      savePrefs();
    });

    window.addEventListener("resize", scheduleLayout);
    window.addEventListener("orientationchange", () => setTimeout(layoutBoard, 300));

    updatePairReadout();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
