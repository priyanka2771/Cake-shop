/* ==========================================================================
   Custom Cake Builder — loaded after main.js (it uses window.CreativeCake).
   Structure: 1. Config  2. State  3. Colour + drawing helpers  4. renderCake
              5. Controls  6. Pricing + rules  7. Sync + events  8. Order
   ========================================================================== */
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const app = window.CreativeCake;
    const form = document.getElementById("builderForm");
    if (!app || !form) return;
    const { CONFIG, esc, money, confettiFrom, showToast } = app;

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ======================================================================
       1. CONFIG — edit prices, slots and options here (all prices in ₹).
       The WhatsApp number comes from CONFIG in main.js.
       ====================================================================== */
    const PRICING = {
      perKg: { Classic: 550, Premium: 750, Fusion: 850 }, // by sponge group
      shape: { Round: 0, Square: 0, Rectangle: 0, Heart: 100, Number: 200 },
      extraTier: 300, // per tier after the first
      fondantPerKg: 200,
      dripFlat: 150,
      egglessPerKg: 50,
      toppings: {
        "Fresh fruits": 80,
        Sprinkles: 30,
        Macarons: 120,
        "Chocolate shards": 60,
        "Edible flowers": 100,
        "Gold leaf": 150,
        Cherries: 40,
        "Oreo / KitKat": 70,
        "Rosettes piping": 50,
        "Pearls / sugar balls": 40,
      },
      toppers: { None: 0, "Happy Birthday sign": 99, "Name topper": 149, "Theme figurine": 199, "Photo print": 250 },
      extras: { "Number candle": 40, "Sparkler candles": 30, Knife: 20, "Greeting card": 40, Balloons: 150 }, // PLACEHOLDER prices
    };

    const ORDER = {
      cutoffHours: 4, // a slot is blocked if it starts within this many hours from now
      bigNoticeDays: 2, // fondant and 3-tier cakes
      slots: [
        { label: "10 AM – 1 PM", from: 10 },
        { label: "1 PM – 4 PM", from: 13 },
        { label: "4 PM – 7 PM", from: 16 },
        { label: "7 PM – 10 PM", from: 19 },
      ],
    };
    const STORAGE_KEY = "creativeCake.design.v2";

    const THEMES = [
      ["Classic", "🎂"], ["Unicorn", "🦄"], ["Superhero", "🦸"], ["Dinosaur", "🦖"],
      ["Princess", "👑"], ["Cars", "🚗"], ["Floral", "🌸"],
    ];
    const SHAPES = ["Round", "Square", "Heart", "Rectangle", "Number"];
    const SHAPE_LABEL = { Rectangle: "Rectangle (sheet)", Number: "Number cake" };
    const SHAPE_ICON = {
      Round: '<circle cx="12" cy="12" r="8"/>',
      Square: '<rect x="4" y="4" width="16" height="16" rx="2"/>',
      Heart: '<path d="M12 20C4 14 3 9.5 5.5 7c2-2 5 -1 6.5 1.5C13.500 6 16.500 5 18.500 7 21 9.500 20 14 12 20z"/>',
      Rectangle: '<rect x="2.500" y="7" width="19" height="10" rx="2"/>',
      Number: '<text x="12" y="19" text-anchor="middle" font-size="19" font-weight="800" font-family="sans-serif" stroke="none" fill="currentColor" fill-opacity="1">7</text>',
    };
    const SIZES = [
      { kg: 0.5, label: "½ kg", serves: "4–5", scale: 0.8 },
      { kg: 1, label: "1 kg", serves: "8–10", scale: 0.88 },
      { kg: 1.5, label: "1.5 kg", serves: "12–15", scale: 0.94 },
      { kg: 2, label: "2 kg", serves: "16–20", scale: 1 },
      { kg: 3, label: "3 kg", serves: "25–30", scale: 1.06 },
      { kg: 5, label: "5 kg", serves: "40–50", scale: 1.12 },
    ];
    const GROUP_LABEL = { Classic: "Classic", Premium: "Premium", Fusion: "Indian fusion" };
    const SPONGES = [
      ["Vanilla", "Classic", "#F6E2A8"], ["Chocolate", "Classic", "#6B3F2E"], ["Butterscotch", "Classic", "#E8B25A"],
      ["Pineapple", "Classic", "#F7DE7A"], ["Strawberry", "Classic", "#F4A6B4"],
      ["Red Velvet", "Premium", "#A92B3A"], ["Black Forest", "Premium", "#4A2A22"], ["Chocolate Truffle", "Premium", "#4B2A20"],
      ["Blueberry", "Premium", "#8E86C9"], ["Coffee Mocha", "Premium", "#8A5A3C"],
      ["Rasmalai", "Fusion", "#F3E3C0"], ["Gulab Jamun", "Fusion", "#A0522D"], ["Kesar Pista", "Fusion", "#E8C65A"],
      ["Mango (seasonal)", "Fusion", "#F6B93B"], ["Paan", "Fusion", "#7BAE5B"],
    ].map(([name, group, color]) => ({ name, group, color }));
    const FILLINGS = [
      ["Same as sponge", null], ["Fresh cream", "#FFFDF6"], ["Chocolate ganache", "#3B2219"],
      ["Fruit compote", "#D14A5E"], ["Nutella", "#7A4A2B"], ["Cream cheese", "#FFF3D9"],
    ];
    const FROSTINGS = ["Whipped cream", "Buttercream", "Fondant (smooth)", "Semi-naked", "Drip cake"];
    const COLORS = [
      ["Cream", "#FFF1D6"], ["Pink", "#F8C8D0"], ["Baby blue", "#CFE8FA"], ["Lavender", "#E2D4F5"],
      ["Mint", "#CDEFD9"], ["Yellow", "#FBE29A"], ["White", "#FFFFFF"], ["Chocolate", "#6B3F2E"],
    ];
    const DRIPS = [["Chocolate", "#4A2A1F"], ["White", "#FFFFFF"], ["Pink", "#EE7C8E"], ["Gold", "#E3B04B"]];
    const PIPES = [["Cocoa", "#3E2723"], ["Strawberry", "#E35D6A"], ["White", "#FFFFFF"], ["Gold", "#D9A441"]];
    const FONTS = {
      Script: { family: "'Segoe Script','Brush Script MT','Snell Roundhand',cursive", weight: 400, k: 0.64 },
      Bold: { family: "Inter,Arial,sans-serif", weight: 800, k: 0.68 },
      Playful: { family: "Fredoka,'Arial Rounded MT Bold',Arial,sans-serif", weight: 600, k: 0.62 },
    };
    const TOPPERS = Object.keys(PRICING.toppers);

    /* ======================================================================
       2. STATE
       ====================================================================== */
    const DEFAULTS = {
      theme: "Classic", shape: "Round", digit: "1", tiers: 1, size: 1,
      flavour: "Vanilla", eggless: false, filling: "Same as sponge",
      frosting: "Whipped cream", color: "#FFF1D6", drip: "Chocolate",
      toppings: [], topper: "None", extras: [], cardText: "",
      message: "", pipe: "Cocoa", font: "Playful",
      childName: "", age: "", date: "", slot: "", notes: "",
    };
    let state = { ...DEFAULTS };
    let photoURL = ""; // uploaded photo for the edible print (kept in memory only)

    const spongeOf = (s) => SPONGES.find((x) => x.name === s.flavour) || SPONGES[0];
    const sizeOf = (s) => SIZES.find((x) => x.kg === s.size) || SIZES[1];
    const tiersOf = (s) => (s.shape === "Number" ? 1 : s.tiers);
    const hexOf = (list, name) => (list.find(([n]) => n === name) || list[0])[1];

    function sanitize(raw) {
      const s = { ...DEFAULTS };
      if (!raw || typeof raw !== "object") return s;
      const str = (k, max = 300) => typeof raw[k] === "string" && (s[k] = raw[k].slice(0, max));
      const oneOf = (k, list) => list.includes(raw[k]) && (s[k] = raw[k]);
      oneOf("theme", THEMES.map((t) => t[0]));
      oneOf("shape", SHAPES);
      oneOf("digit", "0123456789".split(""));
      oneOf("flavour", SPONGES.map((x) => x.name));
      oneOf("filling", FILLINGS.map((f) => f[0]));
      oneOf("frosting", FROSTINGS);
      oneOf("drip", DRIPS.map((d) => d[0]));
      oneOf("pipe", PIPES.map((p) => p[0]));
      oneOf("font", Object.keys(FONTS));
      oneOf("topper", TOPPERS);
      if ([1, 2, 3].includes(raw.tiers)) s.tiers = raw.tiers;
      if (SIZES.some((x) => x.kg === raw.size)) s.size = raw.size;
      if (typeof raw.color === "string" && /^#[0-9a-fA-F]{6}$/.test(raw.color)) s.color = raw.color;
      s.eggless = raw.eggless === true;
      s.toppings = Array.isArray(raw.toppings) ? raw.toppings.filter((t) => t in PRICING.toppings) : [];
      s.extras = Array.isArray(raw.extras) ? raw.extras.filter((t) => t in PRICING.extras) : [];
      str("cardText", 80); str("message", 24); str("childName", 30); str("notes", 400);
      if (typeof raw.age === "string" && /^\d{0,2}$/.test(raw.age)) s.age = raw.age;
      if (typeof raw.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)) s.date = raw.date;
      if (ORDER.slots.some((x) => x.label === raw.slot)) s.slot = raw.slot;
      return s;
    }

    function load() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved) state = sanitize(saved);
      } catch { /* storage blocked or corrupt: start fresh */ }
    }
    function save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch { /* ignore */ }
    }

    /* ======================================================================
       3. COLOUR + DRAWING HELPERS
       ====================================================================== */
    const VW = 440, VH = 420, CX = 190, BASE = 346;
    const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
    const mix = (a, b, t) => {
      const x = rgb(a), y = rgb(b);
      return toHex(x.map((v, i) => v + (y[i] - v) * t));
    };
    const shade = (hex, t) => (t < 0 ? mix(hex, "#000000", -t) : mix(hex, "#ffffff", t));
    const isDark = (hex) => { const [r, g, b] = rgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b < 120; };
    const f = (n) => Math.round(n * 10) / 10;

    const rng = (seed) => () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    /* A mask lets toppings land only on the top face (even for a number or heart shape). */
    const maskCache = new Map();
    function makeMask(key, draw) {
      if (maskCache.has(key)) return maskCache.get(key);
      const c = document.createElement("canvas");
      c.width = VW; c.height = VH;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      draw(ctx);
      const data = ctx.getImageData(0, 0, VW, VH).data;
      const mask = (x, y) => {
        x = Math.round(x); y = Math.round(y);
        return x >= 0 && y >= 0 && x < VW && y < VH && data[(y * VW + x) * 4 + 3] > 128;
      };
      if (maskCache.size > 40) maskCache.clear();
      maskCache.set(key, mask);
      return mask;
    }
    const HEART = "M0 .9C-1.3 0-1 -1 0 -.4C1 -1 1.3 0 0 .9Z";

    const flower = (x, y, r, petal, centre = "#F6D186") => {
      let s = `<g transform="translate(${f(x)} ${f(y)})">`;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        s += `<circle cx="${f(Math.cos(a) * r * 0.62)}" cy="${f(Math.sin(a) * r * 0.62)}" r="${f(r * 0.5)}" fill="${petal}"/>`;
      }
      return s + `<circle r="${f(r * 0.36)}" fill="${centre}"/></g>`;
    };
    const star = (x, y, r, fillC) => {
      let d = "";
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 ? r * 0.45 : r;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        d += `${i ? "L" : "M"}${f(x + Math.cos(a) * rad)} ${f(y + Math.sin(a) * rad)}`;
      }
      return `<path d="${d}Z" fill="${fillC}"/>`;
    };

    /* Theme decorations: simple original shapes, standing on (x, y), scaled by k. */
    function themeDeco(theme, x, y, k) {
      const g = (inner) => `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">${inner}</g>`;
      switch (theme) {
        case "Unicorn":
          return g(`<path d="M-17 -2L-12 -20L-5 -4Z" fill="#F8A5B4"/><path d="M17 -2L12 -20L5 -4Z" fill="#F8A5B4"/>
            <path d="M-9 0L0 -50L9 0Z" fill="#F6D186"/><path d="M-6 -12l12 -3M-4 -24l9 -2M-2 -36l5 -1" stroke="#E3B04B" stroke-width="2" stroke-linecap="round"/>
            <circle cx="-24" cy="-6" r="6" fill="#F8C8D0"/><circle cx="24" cy="-6" r="6" fill="#CFE8FA"/>${star(-30, -34, 6, "#F6D186")}${star(30, -30, 5, "#F8A5B4")}`);
        case "Superhero":
          return g(`<path d="M5 -50L-14 -20L-3 -20L-9 0L15 -30L3 -30Z" fill="#F6D186" stroke="#C2404E" stroke-width="2.500" stroke-linejoin="round"/>${star(-30, -24, 8, "#E35D6A")}${star(30, -28, 7, "#4A7BC8")}`);
        case "Dinosaur":
          return g(`<path d="M-24 -10L-46 -2L-24 -22Z" fill="#6DBE7B"/><ellipse cx="-2" cy="-14" rx="24" ry="14" fill="#6DBE7B"/>
            <path d="M-14 -26l4 -9 4 9zM-2 -28l4 -10 4 10zM10 -26l4 -9 4 9z" fill="#3E9A56"/><circle cx="24" cy="-26" r="10" fill="#6DBE7B"/>
            <circle cx="28" cy="-28" r="2.500" fill="#3E2723"/><rect x="-12" y="-4" width="7" height="12" rx="3" fill="#3E9A56"/><rect x="8" y="-4" width="7" height="12" rx="3" fill="#3E9A56"/>`);
        case "Princess":
          return g(`<path d="M-24 0V-28L-12 -14L0 -38L12 -14L24 -28V0Z" fill="#F6D186" stroke="#E3B04B" stroke-width="2.500" stroke-linejoin="round"/>
            <circle cx="0" cy="-14" r="4" fill="#E35D6A"/><circle cx="-14" cy="-8" r="3" fill="#CFE8FA"/><circle cx="14" cy="-8" r="3" fill="#F8C8D0"/>`);
        case "Cars":
          return g(`<rect x="-30" y="-16" width="60" height="14" rx="5" fill="#E35D6A"/><path d="M-16 -16L-10 -30H10L18 -16Z" fill="#C2404E"/>
            <path d="M-11 -17L-7 -27H-1V-17ZM2 -17V-27H8L13 -17Z" fill="#CFE8FA"/><circle cx="-17" cy="-2" r="7" fill="#3E2723"/><circle cx="17" cy="-2" r="7" fill="#3E2723"/>
            <circle cx="-17" cy="-2" r="2.500" fill="#ddd"/><circle cx="17" cy="-2" r="2.500" fill="#ddd"/>`);
        case "Floral":
          return g(`<path d="M0 0V-20M-18 0L-24 -14M18 0L24 -14" stroke="#6DBE7B" stroke-width="2.500" stroke-linecap="round"/>${flower(0, -26, 17, "#F8C8D0")}${flower(-26, -18, 12, "#FFFFFF")}${flower(26, -18, 12, "#F6D186", "#E35D6A")}
            <ellipse cx="-10" cy="-4" rx="8" ry="3.500" fill="#6DBE7B" transform="rotate(-20 -10 -4)"/><ellipse cx="10" cy="-4" rx="8" ry="3.500" fill="#6DBE7B" transform="rotate(20 10 -4)"/>`);
        default:
          return g(`<path d="M0 -6L-18 -18Q-22 -6 -18 4Z" fill="#E35D6A"/><path d="M0 -6L18 -18Q22 -6 18 4Z" fill="#E35D6A"/><circle cx="0" cy="-6" r="6" fill="#C2404E"/>`);
      }
    }

    function drips(x0, w, edgeY, color, rnd) {
      const n = Math.max(5, Math.round(w / 26));
      const sw = w / n;
      const len = Array.from({ length: n }, (_, i) => (i % 2 ? 10 + rnd() * 14 : 24 + rnd() * 26));
      const bottom = [];
      for (let x = x0; x <= x0 + w + 0.1; x += 2) {
        const seg = Math.min(n - 1, Math.floor((x - x0) / sw));
        const u = ((x - x0) / sw - seg - 0.5) / 0.3;
        const drop = Math.abs(u) < 1 ? len[seg] * Math.sqrt(1 - u * u) : 0;
        bottom.push([x, edgeY(x) + 7 + drop]);
      }
      const top = bottom.map(([x]) => [x, edgeY(x) - 1]);
      const d = `M${top[0][0]} ${f(top[0][1])}` + top.map(([x, y]) => `L${x} ${f(y)}`).join("") +
        bottom.slice().reverse().map(([x, y]) => `L${x} ${f(y)}`).join("") + "Z";
      return `<path d="${d}" fill="${color}" stroke="${shade(color, -0.12)}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M${x0 + 8} ${f(edgeY(x0 + 8) + 3)}H${x0 + w * 0.3}" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`;
    }

    /* ======================================================================
       4. renderCake(state, uid) — rebuilds the whole SVG string
       ====================================================================== */
    function renderCake(s, uid) {
      const rnd = rng(11);
      const sponge = spongeOf(s);
      const fillC = (FILLINGS.find((x) => x[0] === s.filling) || FILLINGS[0])[1] || shade(sponge.color, 0.35);
      const kind = s.shape;
      const tiers = tiersOf(s);
      const sc = sizeOf(s).scale;
      const col = s.color;
      const semi = s.frosting === "Semi-naked";
      const topCol = shade(col, 0.14), sideCol = shade(col, -0.16);
      const bodyCol = semi ? sponge.color : col;
      const FR = [1, 0.72, 0.52];
      const W0 = 232 * sc * (kind === "Rectangle" ? 1.1 : 1);
      const hBase = (tiers === 1 ? 116 : tiers === 2 ? 88 : 62) * sc * (kind === "Rectangle" ? 0.72 : 1);
      const dripCol = hexOf(DRIPS, s.drip);
      const defs = [];
      const out = [];
      const grad = (id, c) =>
        defs.push(`<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c, -0.1)}"/><stop offset=".35" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.16)}"/></linearGradient>`);

      out.push(`<ellipse cx="${CX}" cy="${BASE + 10}" rx="${f(Math.max(W0 / 2 + 36, 120))}" ry="19" fill="#F3E6D8"/>`);
      out.push(`<ellipse cx="${CX}" cy="${BASE + 6}" rx="${f(Math.max(W0 / 2 + 34, 118))}" ry="17" fill="#F6D186"/>`);

      /* ---- tiers ---- */
      let yb = BASE;
      let info = null;
      let bottom = null; // first (largest) tier
      const fs = 255 * Math.min(sc, 1.04); // number-cake font size (capped so toppers fit)
      const ext = 50 * Math.min(sc, 1.04); // number-cake thickness
      const numFont = "Fredoka,'Arial Rounded MT Bold',Arial,sans-serif";
      for (let k = 0; k < tiers; k++) {
        const w = W0 * FR[k];
        const h = hBase;
        const id = `${uid}t${k}`;
        const rim = []; // decorations along the edge of this tier
        if (kind === "Round" || kind === "Square" || kind === "Rectangle") {
          let edge, bot, x0, ww;
          if (kind === "Round") {
            const rx = w / 2, ry = Math.max(8, w * 0.1);
            x0 = CX - rx; ww = w;
            const yt = yb - h;
            grad(id, bodyCol);
            out.push(`<path d="M${f(x0)} ${f(yt)}V${f(yb)}A${f(rx)} ${f(ry)} 0 0 0 ${f(x0 + w)} ${f(yb)}V${f(yt)}Z" fill="url(#${id})"/>`);
            out.push(`<ellipse cx="${CX}" cy="${f(yt)}" rx="${f(rx)}" ry="${f(ry)}" fill="${semi ? shade(col, 0.1) : topCol}" stroke="${shade(topCol, -0.1)}"/>`);
            const q = (x) => Math.sqrt(Math.max(0, 1 - ((x - CX) / rx) ** 2));
            edge = (x) => yt + ry * q(x);
            bot = (x) => yb + ry * q(x);
            info = { x0, w, yt, yb, h, up: yt, next: yt, bbox: [CX - rx, yt - ry, CX + rx, yt + ry], draw: (c) => { c.beginPath(); c.ellipse(CX, yt, rx, ry, 0, 0, Math.PI * 2); c.fill(); } };
          } else {
            const d = w * 0.14, dy = w * 0.1;
            x0 = CX - (w + d) / 2; ww = w;
            const yt = yb - h;
            grad(id, bodyCol);
            out.push(`<path d="M${f(x0 + w)} ${f(yt)}L${f(x0 + w + d)} ${f(yt - dy)}V${f(yb - dy)}L${f(x0 + w)} ${f(yb)}Z" fill="${shade(bodyCol, -0.2)}"/>`);
            out.push(`<rect x="${f(x0)}" y="${f(yt)}" width="${f(w)}" height="${f(h)}" fill="url(#${id})"/>`);
            const poly = [[x0, yt], [x0 + d, yt - dy], [x0 + w + d, yt - dy], [x0 + w, yt]];
            out.push(`<path d="M${poly.map((p) => p.map(f).join(" ")).join("L")}Z" fill="${semi ? shade(col, 0.1) : topCol}" stroke="${shade(topCol, -0.1)}"/>`);
            edge = () => yt; bot = () => yb;
            info = { x0, w, yt, yb, h, up: yt - dy / 2, next: yt - dy / 2, bbox: [x0, yt - dy, x0 + w + d, yt], draw: (c) => { c.beginPath(); poly.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.fill(); } };
          }
          const { yt } = info;
          /* semi-naked: thin frosting over visible sponge, with a filling line */
          if (semi) {
            out.push(`<rect x="${f(x0)}" y="${f(yt + 5)}" width="${f(ww)}" height="${f(h - 10)}" fill="${col}" fill-opacity=".62"/>`);
            out.push(`<path d="M${f(x0)} ${f(yt + h / 2)}H${f(x0 + ww)}" stroke="${fillC}" stroke-width="5"/>`);
          }
          /* frosting styles along the edge */
          const step = 16;
          if (s.frosting === "Whipped cream") {
            for (let x = x0 + 8; x < x0 + ww - 4; x += step) rim.push(`<circle cx="${f(x)}" cy="${f(edge(x) + 2)}" r="9" fill="${shade(col, 0.2)}" stroke="${shade(col, -0.1)}" stroke-opacity=".5"/>`);
          } else if (s.frosting === "Buttercream") {
            for (let x = x0 + 8; x < x0 + ww - 4; x += 14) {
              rim.push(`<circle cx="${f(x)}" cy="${f(edge(x) + 1)}" r="7" fill="${shade(col, 0.18)}" stroke="${shade(col, -0.2)}"/><circle cx="${f(x)}" cy="${f(edge(x) + 1)}" r="3" fill="none" stroke="${shade(col, -0.2)}"/>`);
              rim.push(`<circle cx="${f(x)}" cy="${f(bot(x) - 4)}" r="6" fill="${shade(col, 0.18)}" stroke="${shade(col, -0.2)}"/>`);
            }
          } else if (s.frosting === "Fondant (smooth)") {
            rim.push(`<rect x="${f(x0 + ww * 0.1)}" y="${f(yt + 10)}" width="${f(ww * 0.07)}" height="${f(h - 20)}" rx="4" fill="#fff" fill-opacity=".32"/>`);
          } else if (s.frosting === "Drip cake") {
            rim.push(drips(x0, ww, edge, dripCol, rnd));
          }
          out.push(...rim);
          if (s.toppings.includes("Pearls / sugar balls")) {
            for (let x = x0 + 6; x < x0 + ww - 2; x += 13) out.push(`<circle cx="${f(x)}" cy="${f(bot(x) - 3)}" r="2.800" fill="#fff" stroke="#d8c7b8" stroke-width=".8"/>`);
          }
        } else if (kind === "Heart") {
          const hs = w / 1.76, sy = 0.62;
          if (k === 0) yb = BASE - 0.9 * hs * sy;
          const yt = yb - h;
          const topFill = semi ? shade(col, 0.1) : topCol;
          for (let i = h; i >= 0; i -= 3) out.push(`<path d="${HEART}" transform="translate(${CX} ${f(yt + i)}) scale(${f(hs)} ${f(hs * sy)})" fill="${bodyCol === col ? sideCol : bodyCol}"/>`);
          const stroke = { "Drip cake": `stroke="${dripCol}" stroke-width="7"`, Buttercream: `stroke="${shade(col, 0.3)}" stroke-width="7" stroke-dasharray="0 11" stroke-linecap="round"`, "Whipped cream": `stroke="${shade(col, 0.35)}" stroke-width="6" stroke-dasharray="16 7" stroke-linecap="round"` }[s.frosting] || `stroke="${shade(topCol, -0.1)}" stroke-width="1"`;
          out.push(`<path d="${HEART}" transform="translate(${CX} ${f(yt)}) scale(${f(hs)} ${f(hs * sy)})" fill="${topFill}" ${stroke} vector-effect="non-scaling-stroke"/>`);
          if (s.frosting === "Fondant (smooth)") out.push(`<ellipse cx="${f(CX - hs * 0.45)}" cy="${f(yt - hs * 0.25)}" rx="${f(hs * 0.2)}" ry="${f(hs * 0.07)}" fill="#fff" fill-opacity=".4"/>`);
          info = {
            x0: CX - hs * 0.9, w: hs * 1.8, yt: yt + 0.9 * hs * sy, yb: yt + 0.9 * hs * sy + h, h, up: yt - 0.05 * hs * sy, next: yt,
            bbox: [CX - 0.88 * hs, yt - 0.6 * hs * sy, CX + 0.88 * hs, yt + 0.9 * hs * sy],
            draw: (c) => { c.save(); c.translate(CX, yt); c.scale(hs, hs * sy); c.fill(new Path2D(HEART)); c.restore(); },
          };
        } else {
          /* Number cake: big rounded digit, thick and extruded */
          const yt = BASE - ext - 2;
          const digit = esc(s.digit);
          const common = `x="${CX}" text-anchor="middle" font-family="${numFont}" font-weight="800" font-size="${f(fs)}" stroke-linejoin="round"`;
          for (let i = ext; i >= 0; i -= 3) out.push(`<text ${common} y="${f(yt + i)}" fill="${sideCol}" stroke="${sideCol}" stroke-width="10">${digit}</text>`);
          out.push(`<text ${common} y="${f(yt)}" fill="${topCol}" stroke="${s.frosting === "Drip cake" ? dripCol : col}" stroke-width="10" paint-order="stroke">${digit}</text>`);
          if (s.frosting === "Buttercream" || s.frosting === "Whipped cream") out.push(`<text ${common} y="${f(yt)}" fill="none" stroke="${shade(col, 0.4)}" stroke-width="5" stroke-dasharray="${s.frosting === "Buttercream" ? "0 10" : "14 8"}" stroke-linecap="round">${digit}</text>`);
          const glyphTop = yt - 0.72 * fs;
          info = {
            x0: CX - 80, w: 160, yt, yb: yt + ext, h: ext, up: glyphTop, next: yt,
            bbox: [CX - 95, glyphTop, CX + 95, yt],
            draw: (c) => { c.font = `800 ${fs}px Fredoka, 'Arial Rounded MT Bold', Arial, sans-serif`; c.textAlign = "center"; c.lineJoin = "round"; c.lineWidth = 10; c.strokeText(s.digit, CX, yt); c.fillText(s.digit, CX, yt); },
          };
        }
        if (k === 0) bottom = info;
        yb = info.next;
      }
      const top = info;

      /* ---- message ---- */
      const font = FONTS[s.font];
      const text = (s.message || "Happy Birthday!").trim() || "Happy Birthday!";
      let pipe = hexOf(PIPES, s.pipe);
      let mx = CX, my, maxW;
      if (kind === "Number") { my = BASE + 18; maxW = 200; pipe = "#3E2723"; }
      else if (kind === "Heart") { my = bottom.yt + bottom.h * 0.62; maxW = bottom.w * 0.7; }
      else { my = bottom.yt + bottom.h * 0.66; maxW = bottom.w * 0.82; }
      const size = Math.max(9, Math.min(kind === "Number" ? 20 : 26, maxW / (text.length * font.k)));
      out.push(`<text x="${f(mx)}" y="${f(my)}" text-anchor="middle" font-size="${f(size)}" font-family="${font.family}" font-weight="${font.weight}" fill="${pipe}" ${pipe === "#FFFFFF" ? 'stroke="#0003" stroke-width=".5"' : ""}>${esc(text)}</text>`);

      /* ---- toppings on the top face ---- */
      const mask = makeMask([kind, tiers, f(sc), s.digit, Math.round(top.yt)].join("|"), (c) => { c.fillStyle = "#000"; c.strokeStyle = "#000"; top.draw(c); });
      const [bx0, by0, bx1, by1] = top.bbox;
      const inside = (x, y) => mask(x, y) && mask(x - 5, y) && mask(x + 5, y) && mask(x, y - 3) && mask(x, y + 3);
      const scatter = (n, minD) => {
        const pts = [];
        for (let tries = 0; tries < n * 40 && pts.length < n; tries++) {
          const x = bx0 + rnd() * (bx1 - bx0), y = by0 + rnd() * (by1 - by0);
          if (inside(x, y) && pts.every(([px, py]) => Math.hypot(px - x, py - y) > minD)) pts.push([x, y]);
        }
        return pts.sort((a, b) => a[1] - b[1]);
      };
      const tp = s.toppings;
      if (tp.includes("Sprinkles")) {
        const cols = ["#E35D6A", "#F6D186", "#6DBE7B", "#4A7BC8", "#fff", "#B98BD8"];
        scatter(42, 7).forEach(([x, y], i) => out.push(`<rect x="${f(x - 3)}" y="${f(y - 1)}" width="6" height="2.200" rx="1.100" fill="${cols[i % cols.length]}" transform="rotate(${Math.round(rnd() * 180)} ${f(x)} ${f(y)})"/>`));
      }
      if (tp.includes("Gold leaf")) {
        scatter(12, 9).forEach(([x, y]) => out.push(`<path d="M${f(x)} ${f(y)}l${f(2 + rnd() * 4)} ${f(-3 * rnd())}l${f(2 * rnd())} ${f(3 + rnd() * 2)}l${f(-4)} ${f(1)}z" fill="#E3B04B" opacity=".95"/>`));
      }
      if (tp.includes("Chocolate shards")) {
        scatter(6, 15).forEach(([x, y]) => out.push(`<path d="M${f(x - 5)} ${f(y)}L${f(x + rnd() * 4)} ${f(y - 17)}L${f(x + 6)} ${f(y)}Z" fill="#4A2A1F" stroke="#2f1a13" stroke-width=".8"/>`));
      }
      if (tp.includes("Rosettes piping")) {
        scatter(6, 20).forEach(([x, y]) => out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${shade(col, 0.22)}" stroke="${shade(col, -0.25)}"/><circle cx="${f(x)}" cy="${f(y)}" r="4.500" fill="none" stroke="${shade(col, -0.25)}"/><circle cx="${f(x)}" cy="${f(y)}" r="1.500" fill="${shade(col, -0.25)}"/>`));
      }
      if (tp.includes("Pearls / sugar balls") && (kind === "Heart" || kind === "Number")) {
        scatter(14, 11).forEach(([x, y]) => out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="2.800" fill="#fff" stroke="#d8c7b8" stroke-width=".8"/>`));
      }
      if (tp.includes("Edible flowers")) {
        scatter(4, 24).forEach(([x, y], i) => out.push(flower(x, y - 3, 9, i % 2 ? "#FFFFFF" : "#F8A5B4")));
      }
      if (tp.includes("Fresh fruits")) {
        scatter(7, 17).forEach(([x, y], i) => out.push(i % 3 === 1
          ? `<circle cx="${f(x)}" cy="${f(y - 4)}" r="5.500" fill="#4A5BA8"/><circle cx="${f(x - 1.500)}" cy="${f(y - 5.500)}" r="1.500" fill="#fff" opacity=".5"/>`
          : `<path d="M${f(x - 6)} ${f(y - 8)}Q${f(x)} ${f(y + 6)} ${f(x + 6)} ${f(y - 8)}Z" fill="#D8283F"/><path d="M${f(x - 4)} ${f(y - 8)}l4 -4 4 4z" fill="#3E9A56"/>`));
      }
      if (tp.includes("Macarons")) {
        const mc = [["#F8A5B4", "#FFFFFF"], ["#CDEFD9", "#F6D186"], ["#E2D4F5", "#FFFFFF"], ["#F6D186", "#FFFFFF"]];
        scatter(4, 24).forEach(([x, y], i) => out.push(`<g transform="translate(${f(x)} ${f(y)})"><ellipse cx="0" cy="-6" rx="11" ry="5.500" fill="${mc[i % 4][0]}"/><rect x="-9" y="-3" width="18" height="3.500" rx="1.500" fill="${mc[i % 4][1]}"/><ellipse cx="0" cy="1.500" rx="11" ry="5" fill="${mc[i % 4][0]}"/></g>`));
      }
      if (tp.includes("Oreo / KitKat")) {
        scatter(4, 22).forEach(([x, y], i) => out.push(i % 2
          ? `<g transform="rotate(-18 ${f(x)} ${f(y)})"><rect x="${f(x - 3)}" y="${f(y - 18)}" width="6" height="20" rx="1.500" fill="#8A5A3C" stroke="#5a3828" stroke-width=".8"/><path d="M${f(x - 3)} ${f(y - 11)}h6" stroke="#5a3828" stroke-width=".8"/></g>`
          : `<circle cx="${f(x)}" cy="${f(y - 5)}" r="7" fill="#33231f"/><circle cx="${f(x)}" cy="${f(y - 5)}" r="3.500" fill="#f4ead8"/>`));
      }
      if (tp.includes("Cherries")) {
        scatter(3, 26).forEach(([x, y]) => out.push(`<path d="M${f(x)} ${f(y - 6)}Q${f(x + 2)} ${f(y - 16)} ${f(x + 8)} ${f(y - 20)}" stroke="#3E9A56" stroke-width="1.800" fill="none"/><circle cx="${f(x)}" cy="${f(y - 4)}" r="6.500" fill="#C2182F"/><circle cx="${f(x - 2)}" cy="${f(y - 6)}" r="1.800" fill="#fff" opacity=".6"/>`));
      }

      /* ---- topper, theme decoration, candles ---- */
      const photo = s.topper === "Photo print";
      const cx0 = (top.bbox[0] + top.bbox[2]) / 2;
      const upY = top.up;
      const topW = top.bbox[2] - top.bbox[0];
      if (photo) {
        const pr = Math.max(14, Math.min(46, topW * 0.36));
        const cyP = kind === "Number" ? (top.bbox[1] + top.bbox[3]) / 2 : upY;
        const pid = `${uid}ph`;
        defs.push(`<clipPath id="${pid}"><ellipse cx="${f(cx0)}" cy="${f(cyP)}" rx="${f(pr)}" ry="${f(pr * 0.62)}"/></clipPath>`);
        if (photoURL) out.push(`<image href="${photoURL}" x="${f(cx0 - pr)}" y="${f(cyP - pr)}" width="${f(pr * 2)}" height="${f(pr * 2)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${pid})"/><ellipse cx="${f(cx0)}" cy="${f(cyP)}" rx="${f(pr)}" ry="${f(pr * 0.62)}" fill="none" stroke="#fff" stroke-width="2.500"/>`);
        else out.push(`<ellipse cx="${f(cx0)}" cy="${f(cyP)}" rx="${f(pr)}" ry="${f(pr * 0.62)}" fill="#fff" fill-opacity=".6" stroke="#E35D6A" stroke-width="2" stroke-dasharray="5 4"/><text x="${f(cx0)}" y="${f(cyP + 5)}" text-anchor="middle" font-size="16">📷</text>`);
      } else {
        const big = s.topper === "Theme figurine";
        const k = big ? 1.4 : 1;
        if (big) out.push(`<ellipse cx="${f(cx0)}" cy="${f(upY + 2)}" rx="34" ry="8" fill="#fff" fill-opacity=".85" stroke="#E3B04B"/>`);
        out.push(themeDeco(s.theme, cx0, upY, k));
        if (s.topper === "Happy Birthday sign" || s.topper === "Name topper") {
          const label = s.topper === "Name topper" ? s.childName.trim() || "Name" : "Happy Birthday";
          const sy = upY - (big ? 88 : 86);
          const wSign = Math.max(76, Math.min(150, label.length * 11 + 28));
          const isName = s.topper === "Name topper";
          out.push(`<path d="M${f(cx0 - 26)} ${f(sy + 26)}L${f(cx0 - 22)} ${f(upY)}M${f(cx0 + 26)} ${f(sy + 26)}L${f(cx0 + 22)} ${f(upY)}" stroke="#E3B04B" stroke-width="2.500" stroke-linecap="round"/>
            <rect x="${f(cx0 - wSign / 2)}" y="${f(sy)}" width="${f(wSign)}" height="28" rx="14" fill="${isName ? "#F6D186" : "#ffffff"}" fill-opacity="${isName ? 1 : 0.88}" stroke="#E35D6A" stroke-width="2"/>
            <text x="${f(cx0)}" y="${f(sy + 19)}" text-anchor="middle" font-size="${f(Math.min(15, (wSign - 16) / (label.length * 0.5)))}" font-family="${FONTS.Script.family}" fill="${isName ? "#3E2723" : "#C2404E"}" font-weight="700">${esc(label)}</text>`);
        }
      }
      if (s.extras.includes("Number candle")) {
        const n = esc((s.age || "1").slice(0, 2));
        const nx = cx0 + topW * 0.34;
        out.push(`<text x="${f(nx)}" y="${f(upY + 6)}" text-anchor="middle" font-size="38" font-weight="800" font-family="${numFont}" fill="#F6D186" stroke="#E35D6A" stroke-width="2.500" paint-order="stroke">${n}</text><path d="M${f(nx)} ${f(upY - 32)}c5 6 5 10 0 13-5-3-5-7 0-13z" fill="#FFB84D"/><path d="M${f(nx)} ${f(upY - 28)}c2 3 2 5 0 7-2-2-2-4 0-7z" fill="#fff6"/>`);
      }
      if (s.extras.includes("Sparkler candles")) {
        [-0.36, -0.26].forEach((o, i) => {
          const sx = cx0 + topW * o, sy = upY + 2 - i * 2;
          out.push(`<path d="M${f(sx)} ${f(sy)}V${f(sy - 38)}" stroke="#8a7a6a" stroke-width="2" stroke-linecap="round"/><g stroke="#E3B04B" stroke-width="1.600" stroke-linecap="round"><path d="M${f(sx)} ${f(sy - 44)}v-9M${f(sx - 7)} ${f(sy - 42)}l-6 -6M${f(sx + 7)} ${f(sy - 42)}l6 -6M${f(sx - 9)} ${f(sy - 38)}h-8M${f(sx + 9)} ${f(sy - 38)}h8"/></g>${star(sx, sy - 40, 3.500, "#fff")}`);
        });
      }
      if (s.extras.includes("Balloons")) {
        [["#F8A5B4", 392, 112], ["#F6D186", 414, 134], ["#CFE8FA", 372, 138]].forEach(([c, bx, by]) =>
          out.push(`<path d="M${bx} ${by + 18}Q${bx - 10} ${by + 70} ${CX + 160} ${BASE}" stroke="#b9a79a" fill="none" stroke-width="1.200"/><ellipse cx="${bx}" cy="${by}" rx="15" ry="19" fill="${c}"/><ellipse cx="${bx - 5}" cy="${by - 7}" rx="3.500" ry="5" fill="#fff" opacity=".45"/>`));
      }
      if (s.extras.includes("Greeting card")) {
        out.push(`<g transform="translate(26 ${BASE - 26}) rotate(-8)"><rect width="34" height="44" rx="3" fill="#fff" stroke="#E35D6A" stroke-width="1.500"/><path d="M17 22c-8-5-9-13-3-13 3 0 3 2 3 3 0-1 0-3 3-3 6 0 5 8-3 13z" fill="#E35D6A"/><path d="M6 32h22M6 37h14" stroke="#cbb8a8" stroke-width="1.600"/></g>`);
      }

      /* ---- cut slice (shows sponge + filling) ---- */
      const frostLine = s.frosting === "Drip cake" ? dripCol : col;
      const sc2 = sponge.color;
      out.push(`<ellipse cx="397" cy="${BASE + 28}" rx="42" ry="8" fill="#F6D186"/>
        <g transform="translate(364 ${BASE - 12})">
          <path d="M60 0L74 -8V30L60 38Z" fill="${shade(sc2, -0.2)}"/>
          <path d="M0 0L14 -8H74L60 0Z" fill="${shade(frostLine, 0.1)}"/>
          <clipPath id="${uid}sl"><rect width="60" height="38" rx="3"/></clipPath>
          <g clip-path="url(#${uid}sl)">
            <rect width="60" height="38" fill="${sc2}"/>
            <rect width="60" height="6" fill="${frostLine}"/>
            <rect y="15" width="60" height="4" fill="${fillC}"/>
            <rect y="27" width="60" height="4" fill="${fillC}"/>
          </g>
          <rect width="60" height="38" rx="3" fill="none" stroke="#0001"/>
        </g>`);

      const label = `Live preview: ${s.theme} ${kind.toLowerCase()} cake, ${tiers} tier${tiers > 1 ? "s" : ""}, ${s.flavour}, ${sizeOf(s).label}`;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(label)}"><defs>${defs.join("")}</defs>${out.join("")}</svg>`;
    }

    /* ======================================================================
       5. CONTROLS — built once from the config above
       ====================================================================== */
    const chip = (key, value, label, extra = "") =>
      `<button type="button" class="chip" data-key="${key}" data-value="${esc(String(value))}" aria-pressed="false" ${extra}>${label}</button>`;
    const swatch = (key, name, hex, prefix) =>
      `<button type="button" class="swatch" data-key="${key}" data-value="${key === "color" ? hex : esc(name)}" data-hex="${hex}" style="--sw:${hex}" aria-label="${prefix}: ${name}" title="${name}" aria-pressed="false"></button>`;
    const step = (n, title, body, id = "") =>
      `<fieldset class="b-step" ${id ? `id="${id}"` : ""}><legend class="b-legend"><span class="b-num">${n}</span>${title}</legend>${body}</fieldset>`;
    const price = (n) => `<span class="chip-price">+${money(n)}</span>`;

    function buildControls() {
      const body = [
        step(1, "Pick a theme", `<div class="mt-3 flex flex-wrap gap-2">${THEMES.map(([n, e]) => chip("theme", n, `<span aria-hidden="true">${e}</span> ${n}`)).join("")}</div>`),
        step(2, "Choose a shape", `<div class="mt-3 flex flex-wrap gap-2">${SHAPES.map((n) =>
          chip("shape", n, `<svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2" aria-hidden="true">${SHAPE_ICON[n]}</svg> ${SHAPE_LABEL[n] || n}`)).join("")}</div>
          <div id="rowDigit" hidden class="mt-3"><label for="bDigit" class="text-sm font-semibold">Which number? (0–9)</label>
          <select id="bDigit" data-field="digit" class="field !w-auto">${"0123456789".split("").map((d) => `<option>${d}</option>`).join("")}</select></div>`),
        step(3, "Layers (tiers)", `<div class="mt-3 flex flex-wrap gap-2">${[1, 2, 3].map((n) => chip("tiers", n, `${n} tier${n > 1 ? "s" : ""}`)).join("")}</div><p id="tierNote" class="mt-2 min-h-[1.25rem] text-xs text-cocoa/75" role="status"></p>`),
        step(4, "Size", `<div class="mt-3 flex flex-wrap gap-2">${SIZES.map((z) => chip("size", z.kg, z.label)).join("")}</div><p id="serves" class="mt-2 text-sm font-medium text-cocoa/80" role="status"></p>`),
        step(5, "Sponge flavour", `<label for="bFlavour" class="sr-only">Sponge flavour</label>
          <select id="bFlavour" data-field="flavour" class="field">${Object.keys(GROUP_LABEL).map((g) => `<optgroup label="${GROUP_LABEL[g]}">${SPONGES.filter((x) => x.group === g).map((x) => `<option>${x.name}</option>`).join("")}</optgroup>`).join("")}</select>
          <label class="mt-3 flex cursor-pointer items-center gap-3 text-sm font-medium"><input type="checkbox" data-field="eggless" class="h-5 w-5 accent-[#C2404E]" /> Make it eggless <span aria-hidden="true">🌱</span> <span class="text-xs text-cocoa/70">(+${money(PRICING.egglessPerKg)}/kg)</span></label>`),
        step(6, "Filling (between layers)", `<label for="bFilling" class="sr-only">Filling</label><select id="bFilling" data-field="filling" class="field">${FILLINGS.map(([n]) => `<option>${n}</option>`).join("")}</select>`),
        step(7, "Frosting style", `<div class="mt-3 flex flex-wrap gap-2">${FROSTINGS.map((n) => chip("frosting", n, n + (n.startsWith("Fondant") ? " " + price(PRICING.fondantPerKg).replace("</span>", "/kg</span>") : n === "Drip cake" ? " " + price(PRICING.dripFlat) : ""))).join("")}</div>`),
        step(8, "Frosting colour", `<div class="mt-3 flex flex-wrap items-center gap-2">${COLORS.map(([n, h]) => swatch("color", n, h, "Frosting colour")).join("")}
          <label class="swatch swatch-custom" title="Custom colour"><span class="sr-only">Custom frosting colour</span><input id="bColor" type="color" data-field="color" value="#ffcc99" /></label></div>`),
        `<fieldset id="rowDrip" hidden class="b-step"><legend class="b-legend"><span class="b-num">9</span>Drip colour</legend><div class="mt-3 flex flex-wrap gap-2">${DRIPS.map(([n, h]) => swatch("drip", n, h, "Drip colour")).join("")}</div></fieldset>`,
        step(10, "Toppings &amp; decorations", `<div class="mt-3 flex flex-wrap gap-2">${Object.entries(PRICING.toppings).map(([n, p]) => chip("toppings", n, `${n} ${price(p)}`)).join("")}</div>`),
        step(11, "Cake topper", `<div class="mt-3 flex flex-wrap gap-2">${TOPPERS.map((n) => chip("topper", n, n + (PRICING.toppers[n] ? " " + price(PRICING.toppers[n]) : ""))).join("")}</div>
          <div id="rowPhoto" hidden class="mt-3"><label for="bPhoto" class="text-sm font-semibold">Upload the photo for the edible print</label>
          <input id="bPhoto" type="file" accept="image/*" class="field !py-2" aria-describedby="photoErr" /><p id="photoErr" class="mt-1 min-h-[1.25rem] text-sm text-berry-dark"></p>
          <p class="text-xs text-cocoa/70">The photo stays on your device. Please attach it again on WhatsApp when you send the order.</p></div>`),
        step(12, "Candles &amp; extras", `<div class="mt-3 flex flex-wrap gap-2">${Object.entries(PRICING.extras).map(([n, p]) => chip("extras", n, `${n} ${price(p)}`)).join("")}</div>
          <div id="rowCard" hidden class="mt-3"><label for="bCard" class="text-sm font-semibold">Greeting card text</label><input id="bCard" data-field="cardText" maxlength="80" class="field" /></div>`),
        step(13, "Message &amp; names", `<div class="grid gap-4 sm:grid-cols-3"><div class="sm:col-span-2"><label for="bChild" class="text-sm font-semibold">Birthday child's name (optional)</label><input id="bChild" data-field="childName" maxlength="30" autocomplete="off" class="field" /></div>
          <div><label for="bAge" class="text-sm font-semibold">Age</label><input id="bAge" data-field="age" type="number" min="1" max="99" inputmode="numeric" class="field" /></div></div>
          <div class="mt-4"><label for="bMessage" class="text-sm font-semibold">Message on the cake</label><input id="bMessage" data-field="message" maxlength="24" placeholder="Happy Birthday!" autocomplete="off" class="field" /></div>
          <p class="mt-4 text-sm font-semibold">Piping colour</p><div class="mt-2 flex flex-wrap gap-2">${PIPES.map(([n, h]) => swatch("pipe", n, h, "Piping colour")).join("")}</div>
          <p class="mt-4 text-sm font-semibold">Lettering style</p><div class="mt-2 flex flex-wrap gap-2">${Object.keys(FONTS).map((n) => chip("font", n, `<span style="font-family:${FONTS[n].family};font-weight:${FONTS[n].weight}">${n}</span>`)).join("")}</div>`),
        step(14, "Delivery date &amp; time", `<label for="bDate" class="text-sm font-semibold">Date</label>
          <input id="bDate" data-field="date" type="date" aria-describedby="dateNote" class="field !w-auto" />
          <p id="dateNote" class="mt-1 min-h-[1.25rem] text-sm text-cocoa/75" role="status"></p>
          <p class="mt-3 text-sm font-semibold">Time slot</p><div class="mt-2 flex flex-wrap gap-2">${ORDER.slots.map((x) => chip("slot", x.label, x.label)).join("")}</div>
          <p id="slotErr" class="mt-1 min-h-[1.25rem] text-sm text-berry-dark" role="alert"></p>`),
        step(15, "Special instructions", `<label for="bNotes" class="sr-only">Special instructions</label><textarea id="bNotes" data-field="notes" rows="3" maxlength="400" placeholder="Allergies, design ideas, delivery landmarks…" class="field"></textarea>`),
      ];
      $("#builderBody").innerHTML = body.join("");
    }

    /* ======================================================================
       6. PRICING + RULES
       ====================================================================== */
    const round10 = (n) => Math.round(n / 10) * 10;
    function priceLines(s) {
      const sp = spongeOf(s), kg = s.size, tiers = tiersOf(s);
      const L = [[`${sp.name} sponge · ${sizeOf(s).label} × ${money(PRICING.perKg[sp.group])}/kg`, PRICING.perKg[sp.group] * kg]];
      const add = (label, amt) => amt && L.push([label, amt]);
      add(`${tiers - 1} extra tier${tiers > 2 ? "s" : ""}`, PRICING.extraTier * (tiers - 1));
      add(`${s.shape} shape`, PRICING.shape[s.shape]);
      if (s.frosting === "Fondant (smooth)") add("Fondant finish", PRICING.fondantPerKg * kg);
      if (s.frosting === "Drip cake") add("Drip effect", PRICING.dripFlat);
      if (s.eggless) add("Eggless", PRICING.egglessPerKg * kg);
      s.toppings.forEach((t) => add(t, PRICING.toppings[t]));
      add(s.topper, PRICING.toppers[s.topper]);
      s.extras.forEach((t) => add(t, PRICING.extras[t]));
      return L;
    }
    const totalOf = (s) => round10(priceLines(s).reduce((a, [, n]) => a + n, 0));

    const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const needsNotice = (s) => s.frosting === "Fondant (smooth)" || tiersOf(s) === 3;
    const slotOpen = (iso, slot) => {
      const now = new Date();
      if (iso !== isoDate(now)) return true;
      return slot.from * 60 >= now.getHours() * 60 + now.getMinutes() + ORDER.cutoffHours * 60;
    };
    function earliestDate(s) {
      const d = new Date();
      if (needsNotice(s)) d.setDate(d.getDate() + ORDER.bigNoticeDays);
      else if (!ORDER.slots.some((x) => slotOpen(isoDate(d), x))) d.setDate(d.getDate() + 1);
      return isoDate(d);
    }
    const prettyDate = (iso) => new Date(`${iso}T00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

    /** Keep the combination of options valid. Returns a note for the tier helper. */
    function normalize() {
      let note = "";
      if (state.shape === "Number") note = "Number cakes are a single layer.";
      else if (state.size < 2) note = "3 tiers need a 2 kg cake or bigger.";
      if (state.shape === "Number") state.tiers = 1;
      if (state.size < 2 && state.tiers === 3) {
        state.tiers = 2;
        note = "3 tiers need a 2 kg cake or bigger, so we switched to 2 tiers.";
      }
      return note;
    }

    /* ======================================================================
       7. SYNC + EVENTS
       ====================================================================== */
    load();
    buildControls();

    let tierNote = "";
    function sync() {
      tierNote = normalize();
      $$("[data-key]", form).forEach((el) => {
        const key = el.dataset.key, val = el.dataset.value;
        let on;
        if (key === "toppings" || key === "extras") on = state[key].includes(val);
        else if (key === "tiers" || key === "size") on = String(state[key]) === val;
        else if (key === "color") on = state.color.toLowerCase() === val.toLowerCase();
        else on = String(state[key]) === val;
        el.setAttribute("aria-pressed", String(on));
        if (key === "tiers") el.disabled = (val === "3" && state.size < 2) || (state.shape === "Number" && val !== "1");
      });
      const custom = $(".swatch-custom");
      custom.classList.toggle("is-on", !COLORS.some(([, h]) => h.toLowerCase() === state.color.toLowerCase()));
      $("#rowDigit").hidden = state.shape !== "Number";
      $("#rowDrip").hidden = state.frosting !== "Drip cake";
      $("#rowPhoto").hidden = state.topper !== "Photo print";
      $("#rowCard").hidden = !state.extras.includes("Greeting card");
      $("#tierNote").textContent = tierNote;
      $("#serves").textContent = `Serves ~${sizeOf(state).serves} people`;

      /* delivery date + slots */
      const dateEl = $("#bDate");
      const min = earliestDate(state);
      dateEl.min = min;
      const notice = needsNotice(state) ? `Fondant and 3-tier cakes need at least ${ORDER.bigNoticeDays} days' notice. Earliest date: ${prettyDate(min)}.` : "";
      $("#dateNote").textContent = state.date && state.date < min ? notice || "Please choose today or a later date." : notice;
      $$('[data-key="slot"]', form).forEach((b) => {
        const slot = ORDER.slots.find((x) => x.label === b.dataset.value);
        const open = !state.date || slotOpen(state.date, slot);
        b.disabled = !open;
        b.title = open ? "" : `Needs ${ORDER.cutoffHours} hours' notice`;
      });
      if (state.slot && state.date && !slotOpen(state.date, ORDER.slots.find((x) => x.label === state.slot))) state.slot = "";
      $$('[data-key="slot"]', form).forEach((b) => b.setAttribute("aria-pressed", String(state.slot === b.dataset.value)));
      draw();
    }

    function fillFields() {
      $$("[data-field]", form).forEach((el) => {
        const k = el.dataset.field;
        if (el.type === "checkbox") el.checked = !!state[k];
        else if (el.type === "color") el.value = state.color;
        else el.value = state[k] ?? "";
      });
    }

    let popTimer = 0;
    function draw() {
      $("#cakeSvgWrap").innerHTML = renderCake(state, "a");
      $("#cakeBarSvg").innerHTML = renderCake(state, "m");
      const wrap = $("#cakeSvgWrap");
      if (!REDUCED) {
        wrap.classList.remove("cake-pop");
        void wrap.offsetWidth;
        wrap.classList.add("cake-pop");
        clearTimeout(popTimer);
        popTimer = setTimeout(() => wrap.classList.remove("cake-pop"), 260);
      }
      const t = tiersOf(state);
      const frost = { "Whipped cream": "Whipped", Buttercream: "Buttercream", "Fondant (smooth)": "Fondant", "Semi-naked": "Semi-naked", "Drip cake": "Drip" }[state.frosting];
      $("#cakeSummary").textContent = `${state.theme} · ${t} tier${t > 1 ? "s" : ""} · ${state.shape}${state.shape === "Number" ? " " + state.digit : ""} · ${state.flavour}${state.eggless ? " (eggless)" : ""} · ${sizeOf(state).label} · ${frost}`;
      $("#cakeServes").textContent = `Serves ~${sizeOf(state).serves} people`;
      const total = totalOf(state);
      $("#cakePrice").textContent = money(total);
      $("#cakeBarPrice").textContent = money(total);
      $("#cakeBreakdown").innerHTML =
        priceLines(state).map(([l, n]) => `<li class="flex justify-between gap-3"><span>${esc(l)}</span><span class="font-medium">${money(n)}</span></li>`).join("") +
        `<li class="flex justify-between gap-3 border-t border-dashed border-cocoa/20 pt-2 font-semibold"><span>Total (rounded to ₹10)</span><span>${money(total)}</span></li>`;
      save();
    }

    function toggle(list, v) {
      return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
    }

    form.addEventListener("click", (e) => {
      const b = e.target.closest("[data-key]");
      if (!b || b.disabled) return;
      const k = b.dataset.key, v = b.dataset.value;
      if (k === "toppings" || k === "extras") state[k] = toggle(state[k], v);
      else if (k === "tiers" || k === "size") state[k] = Number(v);
      else if (k === "slot") state.slot = state.slot === v ? "" : v;
      else state[k] = v;
      if (k === "slot") $("#slotErr").textContent = "";
      sync();
    });
    form.addEventListener("input", (e) => {
      const el = e.target.closest("[data-field]");
      if (!el) return;
      const k = el.dataset.field;
      if (el.type === "checkbox") state[k] = el.checked;
      else if (el.type === "color") state.color = el.value;
      else state[k] = el.value;
      if (k === "age") state.age = el.value.replace(/\D/g, "").slice(0, 2);
      if (k === "date") $("#dateNote").removeAttribute("data-bad");
      sync();
    });
    $("#bPhoto").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      $("#photoErr").textContent = "";
      if (!file) { photoURL = ""; return sync(); }
      if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
        $("#photoErr").textContent = "Please choose an image smaller than 8 MB.";
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => { photoURL = String(reader.result); sync(); };
      reader.readAsDataURL(file);
    });

    /* Randomize / reset / download */
    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    $("#cakeRandom").addEventListener("click", () => {
      const keep = { childName: state.childName, age: state.age, message: state.message, date: state.date, slot: state.slot, notes: state.notes };
      const shape = pick(SHAPES);
      const size = pick(SIZES).kg;
      state = {
        ...DEFAULTS, ...keep, shape, size, theme: pick(THEMES)[0], digit: pick("0123456789".split("")),
        tiers: shape === "Number" ? 1 : pick(size >= 2 ? [1, 2, 3] : [1, 2]),
        flavour: pick(SPONGES).name, filling: pick(FILLINGS)[0], frosting: pick(FROSTINGS),
        color: pick(COLORS)[1], drip: pick(DRIPS)[0], pipe: pick(PIPES)[0], font: pick(Object.keys(FONTS)),
        toppings: Object.keys(PRICING.toppings).filter(() => Math.random() < 0.25),
        topper: pick(TOPPERS.filter((t) => t !== "Photo print")),
      };
      fillFields();
      sync();
      if (!REDUCED) confettiFrom($("#cakeRandom"), 18);
    });
    $("#cakeReset").addEventListener("click", () => {
      state = { ...DEFAULTS };
      photoURL = "";
      $("#bPhoto").value = "";
      ["#photoErr", "#slotErr"].forEach((id) => ($(id).textContent = ""));
      fillFields();
      sync();
    });
    $("#cakeDownload").addEventListener("click", () => {
      const clone = $("#cakeSvgWrap svg").cloneNode(true);
      clone.setAttribute("width", VW * 2);
      clone.setAttribute("height", VH * 2);
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = VW * 2; c.height = VH * 2;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#FFF8F0";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((blob) => {
          if (!blob) return showToast("Sorry, we could not save the image.");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "my-cake-design.png";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 2000);
          showToast("Design saved. Attach it on WhatsApp!");
        }, "image/png");
      };
      img.onerror = () => { URL.revokeObjectURL(url); showToast("Sorry, we could not save the image."); };
      img.src = url;
    });

    /* Kids' Corner cards pick a theme (event sent by main.js) */
    document.addEventListener("cake:theme", (e) => {
      if (THEMES.some(([n]) => n === e.detail)) { state.theme = e.detail; sync(); }
    });

    /* Mobile: mini cake bar appears once the big preview has scrolled out of view */
    const bar = $("#cakeBar");
    const previewBox = $("#cakePreviewCard");
    if ("IntersectionObserver" in window) {
      let inSection = false, previewVisible = true;
      const update = () => bar.classList.toggle("show", inSection && !previewVisible);
      new IntersectionObserver((en) => { previewVisible = en[0].isIntersecting; update(); }).observe(previewBox);
      new IntersectionObserver((en) => { inSection = en[0].isIntersecting; update(); }).observe($("#builderBody"));
    }
    $("#cakeBarUp").addEventListener("click", () => previewBox.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" }));

    /* ======================================================================
       8. ORDER — validate, then build the WhatsApp message
       ====================================================================== */
    function validate() {
      let ok = true, first = null;
      const fail = (el, msg, target) => { target.textContent = msg; ok = false; first = first || el; };
      $("#slotErr").textContent = "";
      $("#photoErr").textContent = "";
      const min = earliestDate(state);
      if (!state.date) fail($("#bDate"), "Please choose the date you need the cake.", $("#dateNote"));
      else if (state.date < min) fail($("#bDate"), needsNotice(state) ? `Fondant and 3-tier cakes need at least ${ORDER.bigNoticeDays} days' notice. Earliest date: ${prettyDate(min)}.` : "Please choose today or a later date.", $("#dateNote"));
      if (!state.slot) fail($('[data-key="slot"]:not(:disabled)') || $("#bDate"), "Please pick a time slot.", $("#slotErr"));
      if (state.topper === "Photo print" && !photoURL) fail($("#bPhoto"), "Please upload the photo for the edible print.", $("#photoErr"));
      if (!SPONGES.some((x) => x.name === state.flavour) || !SIZES.some((x) => x.kg === state.size)) ok = false;
      if (first) first.focus();
      return ok;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;
      const s = state, t = tiersOf(s), sp = spongeOf(s);
      const total = totalOf(s);
      const lines = [
        `Hi ${CONFIG.brand}! I'd like to order a custom cake:`, "",
        `• Theme: ${s.theme}`,
        `• Shape: ${s.shape}${s.shape === "Number" ? ` (${s.digit})` : ""}`,
        `• Tiers: ${t}`,
        `• Size: ${sizeOf(s).label} (serves ~${sizeOf(s).serves})`,
        `• Sponge: ${sp.name}${s.eggless ? " (eggless)" : ""}`,
        `• Filling: ${s.filling}`,
        `• Frosting: ${s.frosting}, ${(COLORS.find(([, h]) => h.toLowerCase() === s.color.toLowerCase()) || ["custom colour " + s.color])[0]}${s.frosting === "Drip cake" ? `, ${s.drip} drip` : ""}`,
        s.toppings.length ? `• Toppings: ${s.toppings.join(", ")}` : null,
        `• Topper: ${s.topper}${s.topper === "Name topper" && s.childName ? ` (${s.childName})` : ""}${s.topper === "Photo print" ? " (I will send the photo here)" : ""}`,
        s.extras.length ? `• Extras: ${s.extras.join(", ")}${s.extras.includes("Greeting card") && s.cardText ? ` (card: "${s.cardText}")` : ""}` : null,
        `• Message: "${s.message.trim() || "Happy Birthday!"}" (${s.pipe} piping, ${s.font} style)`,
        s.childName ? `• Birthday child: ${s.childName}${s.age ? ` (turning ${s.age})` : ""}` : null,
        `• Delivery: ${prettyDate(s.date)}, ${s.slot}`,
        s.notes.trim() ? `• Notes: ${s.notes.trim()}` : null,
        "", "Price breakdown:",
        ...priceLines(s).map(([l, n]) => `  - ${l}: ${money(n)}`),
        `Estimated total: ${money(total)} (final price to be confirmed)`,
      ].filter((l) => l !== null);
      confettiFrom(e.submitter || form, 40);
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    });

    /* ---- start ---- */
    fillFields();
    sync();
    // A saved date can be out of date by now: drop it quietly
    if (state.date && state.date < earliestDate(state)) { state.date = ""; fillFields(); sync(); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { maskCache.clear(); draw(); });
  });
})();
