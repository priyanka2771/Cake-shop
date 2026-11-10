/* ==========================================================================
   Creative Cake — main.js
   Runs on both index.html and contact.html. Everything lives inside one
   DOMContentLoaded callback, so nothing leaks onto `window`.

   Sections:
     1. Settings (edit these)      5. Header, search, promo
     2. Data (products, slides)    6. Hero slider
     3. Helpers                    7. Products, filters, gallery, effects
     4. Shared layout (HTML)       8. Cart
                                   9. Contact form
                                  10. Start-up
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ======================================================================
     1. SETTINGS — change these to match your real business
     ====================================================================== */
  const CONFIG = {
    brand: "Creative Cake",
    whatsapp: "919876543210", // PLACEHOLDER: country code + number, digits only
    phoneDisplay: "+91 98765 43210", // PLACEHOLDER
    phoneTel: "+919876543210", // PLACEHOLDER
    email: "bakery@email.com", // PLACEHOLDER
    address: "123 Sample Street, Mumbai, Maharashtra 400001, India", // PLACEHOLDER
    // [label, display text, weekdays (0=Sun), opens (24h), closes (24h)] — PLACEHOLDERS
    hours: [
      ["Mon – Fri", "9:00 AM – 9:00 PM", [1, 2, 3, 4, 5], 9, 21],
      ["Sat – Sun", "10:00 AM – 10:00 PM", [0, 6], 10, 22],
    ],
    // PLACEHOLDER pincode ranges you deliver to: [from, to]
    deliveryPincodes: [[400001, 400104]],
    // Your FSSAI licence number. Leave "" to hide the badge until you have it.
    fssai: "",
    social: {
      instagram: "https://instagram.com/", // PLACEHOLDER
      facebook: "https://facebook.com/", // PLACEHOLDER
    },
    coupon: { code: "SWEET20", percent: 20 },
    delivery: [
      {
        name: "Swiggy",
        url: "https://www.swiggy.com/",
        logo: "https://cdn.worldvectorlogo.com/logos/swiggy-logo-1.svg",
      },
      {
        name: "Zomato",
        url: "https://www.zomato.com/",
        logo: "https://1000logos.net/wp-content/uploads/2021/06/Zomato-logo.png",
      },
    ],
  };

  /* ======================================================================
     2. DATA — one array drives the Best Sellers and Products sections.
     Prices are PLACEHOLDERS. `featured: true` shows in Best Sellers.
     ====================================================================== */
  const PRODUCTS = [
    { id: "tiramisu", name: "Tiramisu Cake", category: "Cakes", occasions: ["Birthday", "Anniversary"], price: 450, rating: 4.9, badge: "Best Seller", featured: true,
      desc: "Rich, creamy classic Italian dessert.",
      alt: "Slice of layered tiramisu cake dusted with cocoa",
      img: "https://images.unsplash.com/photo-1702744998351-090b3ee4e976?q=80&w=800" },
    { id: "raspberry-choc", name: "Raspberry Chocolate", category: "Cakes", occasions: ["Birthday", "Anniversary"], price: 650, rating: 4.8, badge: "Popular", featured: true,
      desc: "A perfect blend of sweet and tangy.",
      alt: "Chocolate cake topped with fresh raspberries",
      img: "https://plus.unsplash.com/premium_photo-1722686461601-b2a018a4213b?q=80&w=800" },
    { id: "wedding", name: "Wedding Cake", category: "Cakes", occasions: ["Wedding", "Anniversary", "Custom Cakes"], price: 3500, rating: 5.0, badge: "Custom", featured: true,
      desc: "Elegant, tiered and beautifully crafted.",
      alt: "Tall white tiered wedding cake with floral decoration",
      img: "https://plus.unsplash.com/premium_photo-1671915835768-34183674970a?q=80&w=800" },
    { id: "vanilla", name: "Vanilla Cake", category: "Cakes", occasions: ["Birthday", "Kids Birthday", "Baby Shower"], price: 550, rating: 4.5, badge: "",
      desc: "Soft, buttery sponge with vanilla cream.",
      alt: "Vanilla cake with white frosting",
      img: "https://images.unsplash.com/photo-1685896211191-649aaefdf10a?q=80&w=800" },
    { id: "strawberry", name: "Strawberry Cake", category: "Cakes", occasions: ["Birthday", "Kids Birthday", "Baby Shower"], eggless: true, price: 600, rating: 4.3, badge: "Eggless",
      desc: "Fresh strawberries layered in light cream.",
      alt: "Strawberry cake decorated with fresh strawberries",
      img: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=800" },
    { id: "chocolate", name: "Chocolate Cake", category: "Cakes", occasions: ["Birthday", "Kids Birthday", "Corporate"], price: 650, rating: 4.4, badge: "",
      desc: "Dark, glossy and deeply chocolatey.",
      alt: "Glossy chocolate cake on a plate",
      img: "https://images.unsplash.com/photo-1620049302148-61b77ad1a1c2?q=80&w=800" },
    { id: "fruit", name: "Fruit Cake", category: "Cakes", occasions: ["Anniversary", "Corporate", "Festivals"], price: 500, rating: 4.8, badge: "New",
      desc: "Seasonal fruit on a pillowy sponge.",
      alt: "Cake topped with colourful seasonal fruit",
      img: "https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?q=80&w=800" },
    { id: "red-velvet", name: "Red Velvet", category: "Cakes", occasions: ["Anniversary", "Birthday", "Custom Cakes"], price: 700, rating: 4.5, badge: "Popular",
      desc: "Cream-cheese frosting on a velvety crumb.",
      alt: "Red velvet cake with cream cheese frosting",
      img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800" },
    { id: "black-forest", name: "Black Forest", category: "Cakes", occasions: ["Birthday", "Kids Birthday"], price: 600, rating: 4.9, badge: "",
      desc: "Cherries, whipped cream and dark chocolate.",
      alt: "Black Forest cake with cherries and chocolate shavings",
      img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800" },
    { id: "cupcake-box", name: "Cupcake Box (6)", category: "Cupcakes", occasions: ["Kids Birthday", "Baby Shower", "Corporate"], eggless: true, price: 360, rating: 4.7, badge: "Eggless",
      desc: "Six frosted cupcakes in assorted flavours.",
      alt: "Box of frosted cupcakes",
      img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800" },
    { id: "macarons", name: "Macaron Box (8)", category: "Macarons", occasions: ["Wedding", "Baby Shower", "Festivals", "Corporate"], price: 480, rating: 4.6, badge: "New",
      desc: "Delicate almond shells in pastel colours.",
      alt: "Assorted pastel macarons",
      img: "https://plus.unsplash.com/premium_photo-1675806257134-2d3e30833d05?q=80&w=800" },
    { id: "donuts", name: "Glazed Donut Box (6)", category: "Donuts", occasions: ["Kids Birthday", "Corporate"], price: 320, rating: 4.6, badge: "",
      desc: "Soft, golden and freshly glazed.",
      alt: "Box of colourful glazed donuts",
      img: "https://images.unsplash.com/photo-1515208104371-33f379f845a4?q=80&w=800" },
    { id: "cookies", name: "Choco Chip Cookies (6)", category: "Cookies", occasions: ["Festivals", "Corporate", "Kids Birthday"], price: 280, rating: 4.7, badge: "Popular",
      desc: "Crisp edges, gooey chocolate centres.",
      alt: "Stack of chocolate chip cookies",
      img: "https://images.unsplash.com/photo-1679943366650-3cbab5ce5ff4?q=80&w=800" },
    // PLACEHOLDER hamper: swap in your own photo and price
    { id: "festive-hamper", name: "Festive Cookie Hamper", category: "Hampers", occasions: ["Festivals", "Corporate", "Anniversary"], price: 899, rating: 4.8, badge: "Gift",
      desc: "Cookies and treats in a gift-ready box.",
      alt: "Gift hamper filled with cookies",
      img: "https://images.unsplash.com/photo-1679943366650-3cbab5ce5ff4?q=80&w=800" },
  ];

  /* Shop by Occasion tiles: [name, emoji, colour class, blurb]. Names must match
     the values used in each product's `occasions` array. */
  const OCCASIONS = [
    ["Birthday", "🎂", "bg-blush", "Candles, wishes and cake"],
    ["Kids Birthday", "🎈", "bg-sky", "Theme and cartoon cakes"],
    ["Wedding", "💍", "bg-petal", "Tiered cakes and dessert tables"],
    ["Anniversary", "💕", "bg-peach", "Sweet years together"],
    ["Baby Shower", "🍼", "bg-mint", "Welcome the little one"],
    ["Festivals", "🪔", "bg-butter", "Hampers and festive boxes"],
    ["Corporate", "🏢", "bg-oat", "Office parties and bulk orders"],
    ["Custom Cakes", "🎨", "bg-petal", "Designer and photo cakes"],
  ];

  const SLIDES = [
    { title: "Cakes Made for Your Moments", eyebrow: "Freshly baked, every day", accent: "text-butter",
      tagline: "Birthdays, weddings and everything in between, baked fresh and decorated by hand. Eggless options available.",
      cta: "Order a Cake", category: "Cakes",
      alt: "Elegantly decorated celebration cake",
      img: "https://plus.unsplash.com/premium_photo-1716484895310-9bb1828d5632?q=80&w=1816&auto=format&fit=crop" },
    { title: "Donuts Worth the Detour", eyebrow: "Soft. Glazed. Irresistible.", accent: "text-blush",
      tagline: "Fluffy, fresh donuts in chocolate, strawberry and classic sugar glaze. Grab a box for the gang.",
      cta: "Get a Box", category: "Donuts",
      alt: "Colourful glazed donuts",
      img: "https://images.unsplash.com/photo-1515208104371-33f379f845a4?q=80&w=2070&auto=format&fit=crop" },
    { title: "Cookies, Warm From the Oven", eyebrow: "Baked in small batches", accent: "text-butter",
      tagline: "Crisp edges, gooey centres and real chocolate chunks. Made for tea time and gifting.",
      cta: "Shop Cookies", category: "Cookies",
      alt: "Freshly baked cookies",
      img: "https://images.unsplash.com/photo-1679943366650-3cbab5ce5ff4?q=80&w=2068&auto=format&fit=crop" },
    { title: "Cupcakes for Every Celebration", eyebrow: "Little cakes, big smiles", accent: "text-blush",
      tagline: "Swirls of buttercream on soft sponge. Perfect for parties, return gifts and sweet cravings.",
      cta: "Order Cupcakes", category: "Cupcakes",
      alt: "Frosted cupcakes on a table",
      img: "https://images.unsplash.com/photo-1521886655570-97530ff9454b?q=80&w=2070&auto=format&fit=crop" },
    { title: "Delicate Macarons, Made Here", eyebrow: "A little taste of Paris", accent: "text-butter",
      tagline: "Crisp shells with silky fillings in a rainbow of flavours. Made to impress, made to gift.",
      cta: "Explore Macarons", category: "Macarons",
      alt: "Pastel macarons arranged on a plate",
      img: "https://images.unsplash.com/photo-1681589211919-4d74ed4871c1?q=80&w=2071&auto=format&fit=crop" },
  ];

  /* Sweet-treat ticker: [emoji, label, colour class] */
  const TICKER_TOP = [
    ["🎂", "Birthday Cakes", "bg-blush"],
    ["🧁", "Cupcakes", "bg-butter"],
    ["🍩", "Donuts", "bg-sky"],
    ["🍪", "Cookies", "bg-peach"],
    ["🦄", "Unicorn Cakes", "bg-petal"],
    ["🍰", "Pastries", "bg-mint"],
  ];
  const TICKER_BOTTOM = [
    ["🎈", "Party Ready", "bg-sky"],
    ["🍭", "Sweet Treats", "bg-petal"],
    ["🌈", "Rainbow Layers", "bg-mint"],
    ["🍓", "Fresh Cream", "bg-blush"],
    ["⭐", "Baked With Love", "bg-butter"],
    ["🎁", "Gift Boxes", "bg-peach"],
  ];

  const MASCOT_TIPS = [
    "Sprinkles make everything taste better!",
    `Psst... the code ${CONFIG.coupon.code} gives ${CONFIG.coupon.percent}% off your first order!`,
    "Cupcakes are just tiny cakes with big personalities.",
    "Hi, I'm Cuppy! Want a cake? 🎂",
    "Every birthday deserves a candle and a wish.",
  ];

  /* ======================================================================
     3. HELPERS & SHARED STATE
     ====================================================================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const money = (n) => "₹" + new Intl.NumberFormat("en-IN").format(Math.round(n));

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IS_HOME = Boolean($("#home"));
  const HOME = IS_HOME ? "" : "index.html"; // prefix for in-page links used on other pages

  /** localStorage/sessionStorage wrapper that never throws (private mode, blocked storage…) */
  const makeStore = (storage) => ({
    get(key, fallback) {
      try {
        const raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage unavailable — the app still works, it just won't remember */
      }
    },
  });
  const local = makeStore(window.localStorage);
  const session = makeStore(window.sessionStorage);

  const state = { category: "All", occasion: "All", eggless: false, query: "", sort: "popular" };

  /* Icons: tiny inline SVGs, so there are no extra files to load */
  const ICON_PATHS = {
    bag: '<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M16.5 7.5h.01"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    whatsapp: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19L4 20z"/><path d="M9.5 9.5c.5 2.5 2.5 4.5 5 5l1-1.3-2-1-.8.8c-.8-.4-1.5-1.1-1.9-1.9l.8-.8-1-2-1.1 1.2z"/>',
  };
  const icon = (name, cls = "h-5 w-5") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`;
  const hydrateIcons = () => $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon, "h-6 w-6")));

  /* Toast ("Added to cart", "Code copied"…) */
  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  /* One overlay at a time (cart drawer or contact dialog): Esc, focus trap, scroll lock */
  let layer = null;
  function openLayer(el, close) {
    layer = { el, close, returnFocus: document.activeElement };
    document.body.classList.add("no-scroll");
  }
  function closeLayer() {
    if (!layer) return;
    document.body.classList.remove("no-scroll");
    const target = layer.returnFocus;
    layer = null;
    if (target && target.focus) target.focus();
  }
  function trapTab(event, container) {
    const focusable = $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const goTo = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView(); // smoothness comes from CSS (respects reduced motion)
    else window.location.href = `index.html#${id}`;
  };

  /* ======================================================================
     4. SHARED LAYOUT — navbar, footer, cart drawer: written once, used on every page
     ====================================================================== */
  const NAV_LINKS = [
    ["home", "Home"],
    ["bestsellers", "Best Sellers"],
    ["products", "Products"],
    ["custom", "Custom"],
    ["about", "About"],
  ];

  function contactItemsHTML() {
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.address)}`;
    const item = (emoji, inner) =>
      `<li class="flex gap-3"><span aria-hidden="true">${emoji}</span><span>${inner}</span></li>`;
    const link = "underline-offset-4 hover:underline";
    return [
      item("📍", esc(CONFIG.address)),
      item("📞", `<a class="${link}" href="tel:${CONFIG.phoneTel}">${esc(CONFIG.phoneDisplay)}</a>`),
      item("✉️", `<a class="${link}" href="mailto:${CONFIG.email}">${esc(CONFIG.email)}</a>`),
      item("💬", `<a class="${link}" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a>`),
      item("🗺️", `<a class="${link}" href="${maps}" target="_blank" rel="noopener">Open in Google Maps</a>`),
    ].join("");
  }
  function openStatusHTML() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const today = CONFIG.hours.find(([, , days]) => days.includes(now.getDay()));
    const open = !!today && hour >= today[3] && hour < today[4];
    return `<li class="mb-2 flex items-center gap-2 font-semibold"><span class="status-dot ${open ? "is-open" : ""}" aria-hidden="true"></span>${open ? "Open now" : "Closed right now"}</li>`;
  }
  const hoursHTML = () =>
    openStatusHTML() +
    CONFIG.hours.map(([days, time]) => `<li class="flex justify-between gap-4"><span>${days}</span><span>${time}</span></li>`).join("");

  function headerHTML() {
    const promo = session.get("promoDismissed", false)
      ? ""
      : `<div id="promo" class="bg-butter text-cocoa">
          <div class="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
            <p class="text-center"><span aria-hidden="true">🎉</span> Flat ${CONFIG.coupon.percent}% OFF on your first order — use code
              <strong class="rounded-full border-2 border-dashed border-cocoa/40 px-2.5 py-0.5 font-bold">${CONFIG.coupon.code}</strong></p>
            <button type="button" data-action="copy-code" class="shrink-0 rounded-full bg-cocoa px-3 py-1 text-xs font-bold text-cream transition hover:bg-berry-dark">Copy code</button>
            <button type="button" data-action="dismiss-promo" aria-label="Dismiss announcement" class="shrink-0 rounded-full p-1 hover:bg-cocoa/10">${icon("close", "h-4 w-4")}</button>
          </div>
        </div>`;

    const desktopLinks = NAV_LINKS.map(
      ([id, label]) => `<a class="nav-link" href="${HOME}#${id}" data-spy="${id}">${label}</a>`
    ).join("");
    const mobileLinks = NAV_LINKS.map(
      ([id, label]) => `<a class="block rounded-lg px-2 py-3 font-medium hover:bg-blush/40" href="${HOME}#${id}" data-spy="${id}">${label}</a>`
    ).join("");
    const contactCurrent = IS_HOME ? "" : 'aria-current="page"';

    return `${promo}
      <header id="siteHeader" class="site-header px-3 pt-3 sm:px-6">
        <nav aria-label="Primary" class="nav-pill mx-auto flex max-w-6xl items-center justify-between gap-3 py-2 pl-3 pr-2 sm:pl-4">
          <a href="${HOME}#home" class="nav-brand flex items-center gap-2" aria-label="${CONFIG.brand} home">
            <img src="logo.svg" alt="" width="40" height="40" class="nav-brand-logo h-10 w-10 rounded-full bg-cream object-cover" />
            <span class="font-fun text-xl font-semibold">${CONFIG.brand}</span>
          </a>

          <div class="hidden items-center gap-1 text-sm lg:flex">${desktopLinks}</div>

          <div class="flex items-center gap-2 sm:gap-3">
            <form role="search" data-search-form class="hidden lg:block">
              <label for="navSearch" class="sr-only">Search products</label>
              <input id="navSearch" type="search" data-search placeholder="Search treats…" autocomplete="off" class="nav-search" />
            </form>
            <a href="contact.html" ${contactCurrent} class="btn btn-primary btn-sm hidden lg:inline-flex">Contact</a>
            <button type="button" id="cartBtn" data-action="open-cart" aria-label="Open cart, 0 items" class="nav-cart relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/20">
              ${icon("bag", "h-6 w-6")}
              <span data-cart-count hidden class="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-berry-dark px-1 text-xs font-bold text-white">0</span>
            </button>
            <button type="button" id="menuBtn" data-action="toggle-menu" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu" class="nav-cart flex h-10 w-10 items-center justify-center rounded-full lg:hidden">${icon("menu", "h-6 w-6")}</button>
          </div>
        </nav>

        <div id="navMenu" hidden class="mx-auto mt-2 max-w-6xl rounded-3xl bg-cream px-5 pb-5 pt-2 text-cocoa shadow-lift lg:hidden">
          <form role="search" data-search-form class="py-3">
            <label for="navSearchMobile" class="sr-only">Search products</label>
            <input id="navSearchMobile" type="search" data-search placeholder="Search treats…" autocomplete="off" class="w-full rounded-full border border-cocoa/25 bg-white px-4 py-2.5 text-sm" />
          </form>
          ${mobileLinks}
          <a href="contact.html" ${contactCurrent} class="btn btn-primary mt-3 w-full">Contact</a>
        </div>
      </header>`;
  }

  function footerHTML() {
    const social = (name, url) =>
      `<a href="${url}" target="_blank" rel="noopener" aria-label="${CONFIG.brand} on ${name}" class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-butter hover:text-cocoa">${icon(name.toLowerCase())}</a>`;
    const quick = [
      [`${HOME}#home`, "Home"],
      [`${HOME}#bestsellers`, "Best Sellers"],
      [`${HOME}#products`, "Products"],
      [`${HOME}#kids`, "Kids' Corner"],
      [`${HOME}#custom`, "Custom Cakes"],
      [`${HOME}#about`, "About"],
      [`${HOME}#reviews`, "Reviews"],
      [`${HOME}#faq`, "FAQ"],
      ["contact.html", "Contact"],
    ]
      .map(([href, label]) => `<li><a class="underline-offset-4 hover:underline" href="${href}">${label}</a></li>`)
      .join("");

    return `<footer class="on-dark bg-cocoa text-cream">
      <div class="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="font-display text-2xl font-semibold">${CONFIG.brand}</p>
          <p class="mt-3 text-sm text-cream/80">Handcrafted cakes and bakes, made fresh every morning with real butter, real cream and a lot of love.</p>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold">Quick links</h2>
          <ul class="mt-4 space-y-2 text-sm text-cream/85">${quick}</ul>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold">Contact</h2>
          <ul class="mt-4 space-y-3 text-sm text-cream/85">${contactItemsHTML()}</ul>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold">Opening hours</h2>
          <ul class="mt-4 space-y-1 text-sm text-cream/85">${hoursHTML()}</ul>
          <div class="mt-6 flex gap-3">
            ${social("Instagram", CONFIG.social.instagram)}
            ${social("Facebook", CONFIG.social.facebook)}
            ${social("WhatsApp", `https://wa.me/${CONFIG.whatsapp}`)}
          </div>
        </div>
      </div>
      <div class="border-t border-white/10 py-5 text-center text-sm text-cream/70">
        © ${new Date().getFullYear()} ${CONFIG.brand}. All rights reserved.
      </div>
    </footer>`;
  }

  function cartDrawerHTML() {
    return `<div id="cartOverlay" class="overlay" data-action="close-cart"></div>
      <aside id="cartDrawer" class="drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
        <div class="flex items-center justify-between border-b border-cocoa/10 px-6 py-4">
          <h2 id="cartTitle" class="font-display text-2xl font-semibold">Your cart</h2>
          <button type="button" data-action="close-cart" aria-label="Close cart" class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-blush/50">${icon("close")}</button>
        </div>

        <div class="flex-1 overflow-y-auto px-6">
          <p id="cartEmpty" class="py-16 text-center text-cocoa/70">Your cart is empty.<br />Add something sweet! 🍰</p>
          <ul id="cartItems" class="divide-y divide-cocoa/10"></ul>
        </div>

        <div id="cartFooter" class="space-y-4 border-t border-cocoa/10 bg-white px-6 py-5">
          <form id="couponForm" class="flex gap-2" novalidate>
            <label for="couponInput" class="sr-only">Discount code</label>
            <input id="couponInput" type="text" placeholder="Discount code" autocomplete="off" class="min-w-0 flex-1 rounded-full border border-cocoa/25 bg-cream px-4 py-2 text-sm uppercase" />
            <button type="submit" class="btn btn-outline btn-sm">Apply</button>
          </form>
          <p id="couponMsg" role="status" class="min-h-[1.25rem] text-sm"></p>

          <dl class="space-y-1 text-sm">
            <div class="flex justify-between"><dt>Subtotal</dt><dd id="sumSubtotal"></dd></div>
            <div id="sumDiscountRow" class="flex justify-between text-berry-dark" hidden><dt>Discount (<span id="sumCode"></span>)</dt><dd id="sumDiscount"></dd></div>
            <div class="flex justify-between border-t border-cocoa/10 pt-2 font-display text-xl font-semibold"><dt>Total</dt><dd id="sumTotal"></dd></div>
          </dl>

          <button type="button" data-action="whatsapp-order" class="btn btn-primary w-full">${icon("whatsapp")} Order on WhatsApp</button>
          <button type="button" data-action="clear-cart" class="w-full text-center text-sm text-cocoa/70 underline underline-offset-4 hover:text-cocoa">Clear cart</button>
        </div>
      </aside>`;
  }

  function renderLayout() {
    $("#site-header").innerHTML = headerHTML();
    $("#site-footer").innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", cartDrawerHTML());
    document.body.insertAdjacentHTML("beforeend", '<div id="toast" class="toast" role="status" aria-live="polite"></div>');
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div id="scrollProgress" class="scroll-progress" aria-hidden="true"></div>
       <button type="button" id="toTop" data-action="to-top" class="to-top" aria-label="Back to top">${icon("up", "h-6 w-6")}</button>`
    );
    document.body.insertAdjacentHTML(
      "beforeend",
      `<a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" class="wa-float" aria-label="Chat with us on WhatsApp">${icon("whatsapp", "h-7 w-7")}</a>
       <button type="button" data-action="mascot" class="mascot" aria-label="Say hi to Cuppy the cupcake">
         <svg viewBox="0 0 64 64" aria-hidden="true">
           <path d="M14 34h36l-5 24H19z" fill="#F6D186" />
           <path d="M23 36l2 20M32 36v20M41 36l-2 20" stroke="#E5B65A" stroke-width="2" stroke-linecap="round" />
           <path d="M10 36c-2-9 6-14 12-14 1-8 8-12 14-10 6 0 10 5 9 10 7 1 11 7 9 14z" fill="#F8C8D0" />
           <circle cx="35" cy="9" r="5" fill="#C2404E" />
           <circle class="blink" cx="25" cy="31" r="2.4" fill="#3E2723" />
           <circle class="blink" cx="40" cy="31" r="2.4" fill="#3E2723" />
           <path d="M28 37q5 5 9 0" fill="none" stroke="#3E2723" stroke-width="2" stroke-linecap="round" />
           <circle cx="19" cy="36" r="3" fill="#E35D6A" opacity=".35" />
           <circle cx="46" cy="36" r="3" fill="#E35D6A" opacity=".35" />
         </svg>
       </button>
       <div id="quickView" hidden class="fixed inset-0 z-[70] flex items-center justify-center bg-cocoa/60 p-4">
         <div role="dialog" aria-modal="true" aria-labelledby="quickTitle" class="pop-in relative grid max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-cream shadow-lift sm:grid-cols-2">
           <button type="button" id="quickClose" data-action="close-quick" aria-label="Close quick view" class="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-blush">${icon("close")}</button>
           <div id="quickBody" class="contents"></div>
         </div>
       </div>`
    );
    const info = $("#contactInfo");
    if (info) info.innerHTML = contactItemsHTML();
    const hours = $("#contactHours");
    if (hours) hours.innerHTML = hoursHTML();
    const quick = $("#quickContact");
    if (quick) {
      const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.address)}`;
      const tile = (bg, emoji, title, sub, href, external) =>
        `<li><a href="${href}" ${external ? 'target="_blank" rel="noopener"' : ""} class="quick-tile ${bg}">
          <span class="quick-emoji" aria-hidden="true">${emoji}</span>
          <strong class="font-fun text-lg">${title}</strong>
          <span class="text-sm text-cocoa/75">${sub}${external ? '<span class="sr-only"> (opens in a new tab)</span>' : ""}</span>
        </a></li>`;
      quick.innerHTML =
        tile("bg-mint", "💬", "WhatsApp", "Fastest reply", `https://wa.me/${CONFIG.whatsapp}`, true) +
        tile("bg-butter", "📞", "Call us", esc(CONFIG.phoneDisplay), `tel:${CONFIG.phoneTel}`, false) +
        tile("bg-sky", "✉️", "Email", esc(CONFIG.email), `mailto:${CONFIG.email}`, false) +
        tile("bg-blush", "🗺️", "Visit us", "Get directions", maps, true);
    }
    hydrateIcons();
  }

  /* ======================================================================
     5. HEADER, SEARCH, PROMO
     ====================================================================== */
  const isMenuOpen = () => !$("#navMenu").hidden;

  function updateHeaderState() {
    $("#siteHeader").classList.toggle("solid", !IS_HOME || window.scrollY > 40 || isMenuOpen());
  }

  function setMenu(open) {
    const menu = $("#navMenu");
    const button = $("#menuBtn");
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    button.innerHTML = icon(open ? "close" : "menu", "h-6 w-6");
    updateHeaderState();
  }

  function initHeader() {
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    updateHeaderState();
    // Close the mobile menu after choosing a link
    $$("#navMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /** Highlights the nav link for the section currently in the middle of the screen */
  function initScrollSpy() {
    if (!IS_HOME || !("IntersectionObserver" in window)) return;
    const links = $$("[data-spy]");
    const setActive = (id) =>
      links.forEach((a) => (a.dataset.spy === id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["home", "bestsellers", "kids", "products", "custom", "steps", "about", "reviews", "faq"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    setActive("home");
  }

  async function copyCouponCode() {
    const code = CONFIG.coupon.code;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for file:// pages and older browsers
      const box = document.createElement("textarea");
      box.value = code;
      box.setAttribute("readonly", "");
      box.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(box);
      box.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try */
      }
      box.remove();
    }
    showToast(`Code ${code} copied!`);
  }

  function dismissPromo() {
    session.set("promoDismissed", true);
    const promo = $("#promo");
    if (promo) promo.remove();
  }

  function initSearch() {
    const inputs = $$("[data-search]");
    let scrolledThisFocus = false;

    const apply = (value, { scroll }) => {
      inputs.forEach((input) => input.value !== value && (input.value = value));
      if (IS_HOME) {
        state.query = value.trim().toLowerCase();
        renderProducts();
        if (scroll) goTo("products");
      } else if (scroll) {
        // On the contact page, hand the search to the home page
        window.location.href = `index.html?q=${encodeURIComponent(value.trim())}`;
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (!IS_HOME) return;
        const inMobileMenu = Boolean(input.closest("#navMenu"));
        apply(input.value, { scroll: !scrolledThisFocus && !inMobileMenu });
        scrolledThisFocus = true;
      });
      input.addEventListener("blur", () => (scrolledThisFocus = false));
    });

    $$("[data-search-form]").forEach((form) =>
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        apply($("[data-search]", form).value, { scroll: true });
        setMenu(false);
      })
    );

    const initial = new URLSearchParams(window.location.search).get("q");
    if (IS_HOME && initial) apply(initial, { scroll: true });
  }

  /* ======================================================================
     6. HERO SLIDER
     ====================================================================== */
  function slideHTML(slide, index) {
    const logos = CONFIG.delivery
      .map(
        (d) => `<a href="${d.url}" target="_blank" rel="noopener" aria-label="Order on ${d.name} (opens in a new tab)" class="inline-flex h-9 items-center rounded-full bg-white/95 px-3 transition hover:bg-white">
          <img src="${d.logo}" alt="" width="64" height="20" loading="lazy" class="h-5 w-auto" /></a>`
      )
      .join("");
    return `<article class="relative h-full min-w-full" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${SLIDES.length}">
      <img src="${slide.img}" alt="${esc(slide.alt)}" width="1800" height="1000" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} class="hero-bg absolute inset-0 h-full w-full bg-cocoa object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r from-cocoa/70 via-cocoa/30 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-cocoa/55 via-transparent to-transparent"></div>
      <div class="relative mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10">
        <div class="hero-copy max-w-xl pt-24 text-cream">
          <p class="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-butter">${slide.eyebrow}</p>
          <h2 class="font-display text-4xl font-semibold leading-tight sm:text-6xl ${slide.accent}">${slide.title}</h2>
          <p class="mt-4 text-lg text-cream/95 sm:text-xl">${slide.tagline}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <button type="button" class="btn btn-primary" data-action="shop" data-category="${esc(slide.category)}">${esc(slide.cta)}</button>
            <button type="button" class="btn btn-outline-light" data-action="view-menu">View Menu</button>
          </div>
          <div class="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span>Also order on</span>${logos}
          </div>
        </div>
      </div>
    </article>`;
  }

  function initHero() {
    const hero = $("#home");
    if (!hero) return;

    const track = $("#slider");
    const dotsBox = $("#dots");
    const toggle = $("#toggleSlider");
    track.innerHTML = SLIDES.map(slideHTML).join("");
    dotsBox.innerHTML = SLIDES.map(
      (_, i) => `<button type="button" class="dot" data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join("");
    const slides = [...track.children];
    const dots = [...dotsBox.children];

    let current = 0;
    let timer = null;
    let userPaused = false;
    let held = false; // pointer or keyboard focus is inside the hero
    let heroVisible = true;

    function show(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((slide, i) => (slide.inert = i !== current)); // hidden slides can't be tabbed into
      dots.forEach((dot, i) => (i === current ? dot.setAttribute("aria-current", "true") : dot.removeAttribute("aria-current")));
    }

    function syncAutoplay() {
      clearInterval(timer);
      const shouldRun = !REDUCED_MOTION && !userPaused && !held && !document.hidden;
      if (shouldRun) timer = setInterval(() => show(current + 1), 4000);
    }

    function setUserPaused(paused) {
      userPaused = paused;
      toggle.innerHTML = icon(paused ? "play" : "pause", "h-4 w-4");
      toggle.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
      syncAutoplay();
    }

    $("#prevSlide").addEventListener("click", () => show(current - 1));
    $("#nextSlide").addEventListener("click", () => show(current + 1));
    toggle.addEventListener("click", () => setUserPaused(!userPaused));
    dotsBox.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-dot]");
      if (dot) show(Number(dot.dataset.dot));
    });

    // Pause while hovering or focused
    hero.addEventListener("mouseenter", () => ((held = true), syncAutoplay()));
    hero.addEventListener("mouseleave", () => ((held = false), syncAutoplay()));
    hero.addEventListener("focusin", () => ((held = true), syncAutoplay()));
    hero.addEventListener("focusout", () => ((held = false), syncAutoplay()));
    document.addEventListener("visibilitychange", syncAutoplay);

    // Swipe on touch screens
    let startX = 0;
    let startY = 0;
    hero.addEventListener("touchstart", (e) => ((startX = e.touches[0].clientX), (startY = e.touches[0].clientY)), { passive: true });
    hero.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );

    // Keyboard arrows while the hero is on screen (and you're not typing)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting), { threshold: 0.4 }).observe(hero);
    }
    document.addEventListener("keydown", (e) => {
      if (!heroVisible || layer || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;
      show(current + (e.key === "ArrowRight" ? 1 : -1));
    });

    show(0);
    setUserPaused(false);
  }

  /* ======================================================================
     7. PRODUCTS, FILTERS, GALLERY, SCROLL EFFECTS
     ====================================================================== */
  /** One card design for every product. `reveal` = animate on scroll (Best Sellers) instead of on render. */
  function productCard(p, index = 0, reveal = false) {
    const showBadge = p.badge && !(p.eggless && p.badge === "Eggless");
    const pct = Math.round((p.rating / 5) * 100);
    return `<article ${reveal ? "data-reveal" : ""} class="${reveal ? "" : "card-in "}pcard group" style="--d:${Math.min(index, 8) * 0.04}s">
      <div class="p-3 pb-0">
        <div class="relative overflow-hidden rounded-[1.4rem] bg-oat">
          <button type="button" data-action="quick" data-id="${p.id}" aria-label="Quick view: ${esc(p.name)}" class="block w-full">
            <img src="${p.img}" alt="${esc(p.alt)}" width="800" height="600" loading="lazy" class="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110 motion-reduce:transition-none" />
          </button>
          ${showBadge ? `<span class="pcard-badge">${esc(p.badge)}</span>` : ""}
          <button type="button" data-action="wish" data-id="${p.id}" aria-pressed="${wishlist.has(p.id)}" aria-label="${wishlist.has(p.id) ? "Remove from" : "Add to"} favourites: ${esc(p.name)}" class="heart absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-cocoa shadow-soft transition hover:scale-110">${icon("heart", "h-5 w-5")}</button>
          <span class="pcard-peek" aria-hidden="true">👀 Quick view</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p class="flex flex-wrap items-center gap-2">
          <span class="pcard-tag">${esc(p.category)}</span>
          ${p.eggless ? `<span class="pcard-tag pcard-tag-green">🌱 Eggless</span>` : ""}
        </p>
        <h3 class="mt-2 font-display text-xl font-semibold leading-snug">${esc(p.name)}</h3>
        <p class="mt-1 flex-1 text-sm text-cocoa/75">${esc(p.desc)}</p>
        <p class="mt-3 flex items-center gap-2 text-xs text-cocoa/75">
          <span class="stars" style="--r:${pct}%" aria-hidden="true"><span>★★★★★</span></span>
          <span>${p.rating.toFixed(1)}<span class="sr-only"> out of 5</span></span>
        </p>
        <div class="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-cocoa/15 pt-4">
          <p class="font-display text-2xl font-semibold text-berry-dark">${money(p.price)}</p>
          <button type="button" data-action="add" data-id="${p.id}" class="btn btn-primary btn-sm" aria-label="Add ${esc(p.name)} to cart">${icon("bag", "h-4 w-4")} Add</button>
        </div>
      </div>
    </article>`;
  }

  function renderBestSellers() {
    const grid = $("#bestGrid");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.filter((p) => p.featured)
      .map((p, i) => productCard(p, i, true))
      .join("");
  }

  const favLabel = () => `♥ Favourites (${wishlist.size})`;

  function renderChips() {
    const box = $("#filterChips");
    if (!box) return;
    const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category)), "__fav"];
    box.innerHTML = categories
      .map((c) => `<button type="button" class="chip" data-action="filter" data-value="${c}" aria-pressed="${c === state.category}">${c === "__fav" ? favLabel() : c}</button>`)
      .join("");
  }

  const SORTERS = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    const list = PRODUCTS.filter((p) => {
      const inCategory =
        state.category === "All" || (state.category === "__fav" ? wishlist.has(p.id) : p.category === state.category);
      const matches = !state.query || `${p.name} ${p.category} ${p.desc} ${(p.occasions || []).join(" ")}`.toLowerCase().includes(state.query);
      const forOccasion = state.occasion === "All" || (p.occasions || []).includes(state.occasion);
      const eggOk = !state.eggless || p.eggless === true;
      return inCategory && matches && forOccasion && eggOk;
    });
    if (SORTERS[state.sort]) list.sort(SORTERS[state.sort]);

    const emptyText = state.category === "__fav" && !state.query
      ? "Tap the ♥ on any treat to save it here."
      : "Try a different word or category.";
    grid.innerHTML = list.length
      ? list.map((p, i) => productCard(p, i)).join("")
      : `<div class="col-span-full py-12 text-center">
          <p class="font-display text-2xl">No treats found 🍪</p>
          <p class="mt-2 text-cocoa/75">${emptyText}</p>
          <button type="button" class="btn btn-outline btn-sm mt-5" data-action="clear-search">Clear search &amp; filters</button>
        </div>`;
    const forText = state.occasion !== "All" ? ` for ${state.occasion}` : "";
    $("#resultCount").textContent = `Showing ${list.length} of ${PRODUCTS.length} treats${forText}`;
    $$("#filterChips .chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.value === state.category)));
    const egg = $("#egglessToggle");
    if (egg) egg.setAttribute("aria-pressed", String(state.eggless));
    $$("#occasionGrid .occasion-tile").forEach((tile) => tile.setAttribute("aria-pressed", String(tile.dataset.value === state.occasion)));
  }

  function renderOccasions() {
    const grid = $("#occasionGrid");
    if (!grid) return;
    grid.innerHTML = OCCASIONS.map(
      ([name, emoji, bg, blurb], i) => `
      <div data-reveal="zoom" style="--d: ${(i % 4) * 0.07}s">
        <button type="button" class="occasion-tile ${bg}" data-action="occasion" data-value="${esc(name)}" aria-pressed="false">
          <span class="occasion-emoji" aria-hidden="true">${emoji}</span>
          <span class="occasion-name">${esc(name)}</span>
          <span class="occasion-blurb">${esc(blurb)}</span>
        </button>
      </div>`
    ).join("");
  }

  /* Delivery pincode checker */
  function initPincode() {
    const form = $("#pinForm");
    if (!form) return;
    if (CONFIG.fssai) {
      $("#fssaiText").textContent = `FSSAI Lic. ${CONFIG.fssai}`;
      $("#fssaiBadge").hidden = false;
    }
    const input = $("#pinInput");
    const out = $("#pinResult");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const pin = input.value.trim();
      if (!/^\d{6}$/.test(pin)) {
        out.className = "mt-3 min-h-[1.5rem] text-sm font-semibold text-berry-dark";
        out.textContent = "Please enter a 6-digit pincode.";
        input.setAttribute("aria-invalid", "true");
        return;
      }
      input.removeAttribute("aria-invalid");
      const n = Number(pin);
      const ok = CONFIG.deliveryPincodes.some(([from, to]) => n >= from && n <= to);
      if (ok) {
        out.className = "mt-3 min-h-[1.5rem] text-sm font-semibold text-green-800";
        out.textContent = `Yes! We deliver to ${pin} 🎉`;
        confettiFrom(out);
      } else {
        const msg = encodeURIComponent(`Hi! Do you deliver to pincode ${pin}?`);
        out.className = "mt-3 min-h-[1.5rem] text-sm font-semibold text-cocoa";
        out.innerHTML = `Not on our delivery list yet. <a class="underline" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${msg}">Ask us on WhatsApp<span class="sr-only"> (opens in a new tab)</span></a> and we will see what we can do.`;
      }
    });
  }

  function clearSearchAndFilters() {
    state.category = "All";
    state.occasion = "All";
    state.eggless = false;
    state.query = "";
    state.sort = "popular";
    $$("[data-search]").forEach((input) => (input.value = ""));
    const sort = $("#sortSelect");
    if (sort) sort.value = "popular";
    renderProducts();
  }

  function initSort() {
    const select = $("#sortSelect");
    if (!select) return;
    select.addEventListener("change", () => {
      state.sort = select.value;
      renderProducts();
    });
  }

  function renderGallery() {
    const fill = (track, items) => {
      if (!track) return;
      const pills = items
        .map(
          ([emoji, label, bg]) =>
            `<span class="ticker-pill ${bg}"><span class="ticker-emoji" aria-hidden="true">${emoji}</span>${esc(label)}</span>`
        )
        .join("");
      // The second copy makes the -50% loop seamless; hide it from screen readers
      track.innerHTML = pills + `<span class="contents" aria-hidden="true">${pills}</span>`;
    };
    fill($("#marqueeTrack"), TICKER_TOP);
    fill($("#marqueeTrack2"), TICKER_BOTTOM);
  }

  /* Scroll-in animation */
  let revealObserver = null;
  function initReveal() {
    if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$("[data-reveal]").forEach((el) => revealObserver.observe(el));
  }

  /* Count-up numbers */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length || REDUCED_MOTION || !("IntersectionObserver" in window)) return; // static text is already the final value
    const decimals = (el) => Number(el.dataset.decimals || 0);
    const run = (el) => {
      const end = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = (end * (1 - Math.pow(1 - t, 3))).toFixed(decimals(el));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          run(entry.target);
        }),
      { threshold: 0.6 }
    );
    counters.forEach((el) => {
      el.textContent = (0).toFixed(decimals(el));
      observer.observe(el);
    });
  }

  /* ======================================================================
     8. CART (persisted in localStorage)
     ====================================================================== */
  const CART_KEY = "creativeCake.cart.v1";
  const cart = (() => {
    const saved = local.get(CART_KEY, {});
    const items = {};
    Object.entries(saved.items || {}).forEach(([id, qty]) => {
      if (PRODUCTS.some((p) => p.id === id) && Number.isInteger(qty) && qty > 0) items[id] = Math.min(qty, 99);
    });
    return { items, coupon: saved.coupon === CONFIG.coupon.code ? saved.coupon : "" };
  })();
  let couponMessage = { text: "", error: false };

  const saveCart = () => local.set(CART_KEY, cart);

  function cartTotals() {
    const lines = Object.entries(cart.items)
      .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id), qty }))
      .filter((line) => line.product);
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const discount = cart.coupon === CONFIG.coupon.code ? Math.round((subtotal * CONFIG.coupon.percent) / 100) : 0;
    return { lines, count, subtotal, discount, total: subtotal - discount };
  }

  function renderCart() {
    const totals = cartTotals();

    $$("[data-cart-count]").forEach((badge) => {
      badge.textContent = totals.count;
      badge.hidden = totals.count === 0;
    });
    $("#cartBtn").setAttribute("aria-label", `Open cart, ${totals.count} item${totals.count === 1 ? "" : "s"}`);

    $("#cartEmpty").hidden = totals.count > 0;
    $("#cartFooter").hidden = totals.count === 0;
    $("#cartItems").innerHTML = totals.lines
      .map(({ product: p, qty }) => `<li class="flex gap-3 py-4">
        <img src="${p.img}" alt="" width="64" height="64" class="h-16 w-16 flex-none rounded-xl bg-oat object-cover" />
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="font-semibold leading-snug">${esc(p.name)}</p>
            <button type="button" data-action="remove" data-id="${p.id}" aria-label="Remove ${esc(p.name)} from cart" class="flex h-8 w-8 flex-none items-center justify-center rounded-full text-cocoa/70 hover:bg-blush/50 hover:text-cocoa">${icon("trash", "h-4 w-4")}</button>
          </div>
          <p class="text-sm text-cocoa/70">${money(p.price)} each</p>
          <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center rounded-full border border-cocoa/20">
              <button type="button" class="qty-btn" data-action="qty" data-id="${p.id}" data-delta="-1" aria-label="Decrease quantity of ${esc(p.name)}">${icon("minus", "h-4 w-4")}</button>
              <span class="w-8 text-center text-sm font-semibold" aria-label="Quantity ${qty}">${qty}</span>
              <button type="button" class="qty-btn" data-action="qty" data-id="${p.id}" data-delta="1" aria-label="Increase quantity of ${esc(p.name)}">${icon("plus", "h-4 w-4")}</button>
            </div>
            <p class="font-semibold">${money(p.price * qty)}</p>
          </div>
        </div>
      </li>`)
      .join("");

    $("#sumSubtotal").textContent = money(totals.subtotal);
    $("#sumDiscountRow").hidden = totals.discount === 0;
    $("#sumCode").textContent = cart.coupon;
    $("#sumDiscount").textContent = "−" + money(totals.discount);
    $("#sumTotal").textContent = money(totals.total);

    const input = $("#couponInput");
    if (cart.coupon && document.activeElement !== input) input.value = cart.coupon;
    const msg = $("#couponMsg");
    msg.textContent = couponMessage.text;
    msg.className = `min-h-[1.25rem] text-sm ${couponMessage.error ? "text-berry-dark" : "text-cocoa/80"}`;
  }

  function addToCart(id, source) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    cart.items[id] = Math.min((cart.items[id] || 0) + 1, 99);
    saveCart();
    renderCart();
    showToast(`Added ${product.name} to your cart`);
    confettiFrom(source, 18);
    $$("[data-cart-count]").forEach((badge) => {
      badge.classList.remove("bump");
      void badge.offsetWidth; // restart the animation
      badge.classList.add("bump");
    });
  }

  function changeQty(id, delta) {
    const next = (cart.items[id] || 0) + delta;
    if (next <= 0) delete cart.items[id];
    else cart.items[id] = Math.min(next, 99);
    saveCart();
    renderCart();
    // Re-rendering replaced the buttons; put keyboard focus back where it was
    const again = $(`[data-action="qty"][data-id="${id}"][data-delta="${delta}"]`) || $("[data-action='close-cart']", $("#cartDrawer"));
    if (again) again.focus();
  }

  function removeFromCart(id) {
    delete cart.items[id];
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart.items = {};
    cart.coupon = "";
    couponMessage = { text: "", error: false };
    $("#couponInput").value = "";
    saveCart();
    renderCart();
  }

  function applyCoupon(raw) {
    const code = raw.trim().toUpperCase();
    if (!code) {
      couponMessage = { text: "Enter a discount code.", error: true };
    } else if (code === CONFIG.coupon.code) {
      cart.coupon = code;
      couponMessage = { text: `${code} applied: ${CONFIG.coupon.percent}% off!`, error: false };
    } else {
      cart.coupon = "";
      couponMessage = { text: "Sorry, that code isn't valid.", error: true };
    }
    saveCart();
    renderCart();
  }

  function openCart() {
    const drawer = $("#cartDrawer");
    openLayer(drawer, closeCart);
    drawer.classList.add("open");
    $("#cartOverlay").classList.add("open");
    $("[data-action='close-cart']", drawer).focus();
  }

  function closeCart() {
    $("#cartDrawer").classList.remove("open");
    $("#cartOverlay").classList.remove("open");
    closeLayer();
  }

  function orderOnWhatsApp() {
    const totals = cartTotals();
    if (!totals.count) return;
    confettiFrom($("[data-action='whatsapp-order']"), 36);
    const message = [
      `Hi ${CONFIG.brand}! I'd like to place an order:`,
      "",
      ...totals.lines.map((l) => `• ${l.product.name} × ${l.qty} — ${money(l.product.price * l.qty)}`),
      "",
      `Subtotal: ${money(totals.subtotal)}`,
      totals.discount ? `Discount (${cart.coupon}): −${money(totals.discount)}` : null,
      `Total: ${money(totals.total)}`,
      "",
      "Name:",
      "Delivery address:",
      "Preferred date & time:",
    ]
      .filter((line) => line !== null)
      .join("\n");
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  }

  /* ======================================================================
     9. CONTACT FORM
     ====================================================================== */

  /**
   * Sends the message. There is no backend, so this just resolves.
   * To use a real form service (e.g. Formspree), replace the body with:
   *
   *   return fetch("https://formspree.io/f/YOUR_FORM_ID", {
   *     method: "POST",
   *     headers: { Accept: "application/json", "Content-Type": "application/json" },
   *     body: JSON.stringify(data),
   *   }).then((res) => { if (!res.ok) throw new Error("Request failed"); });
   */
  function sendMessage(data) { // eslint-disable-line no-unused-vars
    return Promise.resolve();
  }

  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const modal = $("#successModal");
    const fields = {
      name: { el: $("#cName"), check: (v) => v.trim().length >= 2 || "Please enter your name (at least 2 characters)." },
      email: { el: $("#cEmail"), check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address." },
      message: { el: $("#cMessage"), check: (v) => v.trim().length >= 10 || "Please write a message of at least 10 characters." },
    };

    function validateField(key) {
      const { el, check } = fields[key];
      const result = check(el.value);
      const ok = result === true;
      $(`#${el.id}-error`).textContent = ok ? "" : result;
      el.setAttribute("aria-invalid", String(!ok));
      return ok;
    }

    function validateAll() {
      const results = Object.keys(fields).map((key) => [key, validateField(key)]);
      const firstBad = results.find(([, ok]) => !ok);
      if (firstBad) fields[firstBad[0]].el.focus();
      return !firstBad;
    }

    Object.entries(fields).forEach(([key, { el }]) => {
      el.addEventListener("blur", () => validateField(key));
      el.addEventListener("input", () => el.getAttribute("aria-invalid") === "true" && validateField(key));
    });

    const readData = () => ({
      subject: (form.querySelector('input[name="subject"]:checked') || {}).value || "General",
      name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      message: fields.message.el.value.trim(),
    });

    function openModal() {
      modal.hidden = false;
      openLayer(modal, closeModal);
      $("#modalOk").focus();
    }
    function closeModal() {
      modal.hidden = true;
      closeLayer();
    }
    $("#modalClose").addEventListener("click", closeModal);
    $("#modalOk").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal()); // click on the dim backdrop

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateAll()) return;
      const button = $("#sendBtn");
      button.disabled = true;
      try {
        await sendMessage(readData());
        form.reset();
        Object.values(fields).forEach(({ el }) => el.removeAttribute("aria-invalid"));
        openModal();
      } catch {
        showToast("Sorry, something went wrong. Please try WhatsApp instead.");
      } finally {
        button.disabled = false;
      }
    });

    $("#waBtn").addEventListener("click", () => {
      if (!validateAll()) return;
      const { subject, name, email, message } = readData();
      const text = `Hi ${CONFIG.brand}! I'm ${name} (${email}).\nAbout: ${subject}\n\n${message}`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  }

  /* ======================================================================
     10. START-UP — click actions, keyboard, then initialise each feature
     ====================================================================== */
  /** Cake loader: fades out once the page is ready, and plays again when moving between pages */
  function initPageLoader() {
    const loader = $("#pageLoader");
    if (!loader) return;

    const MIN_VISIBLE = REDUCED_MOTION ? 0 : 1000; // ms, so the animation is seen at least once
    const hide = () => {
      const wait = Math.max(0, MIN_VISIBLE - performance.now());
      setTimeout(() => {
        loader.classList.remove("leaving");
        loader.classList.add("done");
        loader.setAttribute("aria-hidden", "true");
      }, wait);
    };

    if (document.readyState === "complete") hide();
    else {
      window.addEventListener("load", hide, { once: true });
      setTimeout(hide, 3500); // don't wait forever on slow images
    }

    // Back/forward cache restores the page with the loader still showing
    window.addEventListener("pageshow", (e) => e.persisted && hide());

    // Play the loader on the way out when linking to another page of this site
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      const samePlace = url.protocol === window.location.protocol && url.host === window.location.host;
      if (!samePlace || !/\.html$/.test(url.pathname) || url.pathname === window.location.pathname) return;
      e.preventDefault();
      loader.classList.remove("done");
      loader.classList.add("leaving");
      loader.removeAttribute("aria-hidden");
      setTimeout(() => (window.location.href = link.href), REDUCED_MOTION ? 0 : 600);
    });
  }

  /* ======================================================================
     FUN & EXTRAS: confetti, floating decorations, favourites, quick view, builder
     ====================================================================== */
  const CONFETTI_COLORS = ["#E35D6A", "#F8C8D0", "#F6D186", "#7FD1AE", "#8EC5FC", "#C7A8FF"];

  function confetti(x, y, count = 26) {
    if (REDUCED_MOTION) return;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("i");
      bit.className = "confetti";
      bit.style.left = `${x}px`;
      bit.style.top = `${y}px`;
      bit.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      if (i % 3 === 0) bit.style.borderRadius = "50%";
      document.body.appendChild(bit);
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 130;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance + 90; // gravity pulls it down
      bit.animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.15,.8,.3,1)" }
      ).onfinish = () => bit.remove();
    }
  }

  function confettiFrom(el, count) {
    if (!el || !el.getBoundingClientRect) return;
    const rect = el.getBoundingClientRect();
    confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
  }

  /** Drifting emoji balloons/sprinkles. `min`/`max` limit the horizontal range (in %). */
  function renderFloaties(container, emojis, count, { min = 0, max = 96 } = {}) {
    if (!container || REDUCED_MOTION) return;
    container.innerHTML = Array.from({ length: count }, (_, i) => {
      const left = min + Math.random() * (max - min);
      const size = 1.3 + Math.random() * 1.5;
      const duration = 10 + Math.random() * 10;
      const delay = -Math.random() * 16; // negative: start mid-flight so the screen isn't empty
      return `<span class="floaty" style="left:${left}%;font-size:${size}rem;animation-duration:${duration}s;animation-delay:${delay}s">${emojis[i % emojis.length]}</span>`;
    }).join("");
  }

  function initDecor() {
    renderFloaties($("#heroFloaties"), ["🧁", "🍭", "⭐", "🍪", "🎈"], 9, { min: 45, max: 96 }); // right side: keeps text readable
    renderFloaties($("#kidsFloaties"), ["🎈", "⭐", "🧁", "🍭", "🌈", "🎂"], 14);
    renderFloaties($("#contactFloaties"), ["💌", "🧁", "⭐", "🍰", "🎈", "🍪"], 12);
  }

  /* ----- Favourites (saved in localStorage) ----- */
  const WISH_KEY = "creativeCake.wish.v1";
  const savedWishes = local.get(WISH_KEY, []);
  const wishlist = new Set((Array.isArray(savedWishes) ? savedWishes : []).filter((id) => PRODUCTS.some((p) => p.id === id)));

  function toggleWish(id, source) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const on = !wishlist.has(id);
    if (on) wishlist.add(id);
    else wishlist.delete(id);
    local.set(WISH_KEY, [...wishlist]);

    $$(`[data-action="wish"][data-id="${id}"]`).forEach((btn) => {
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", `${on ? "Remove from" : "Add to"} favourites: ${product.name}`);
      btn.classList.remove("pop");
      void btn.offsetWidth;
      if (on) btn.classList.add("pop");
    });
    const chip = $('[data-value="__fav"]');
    if (chip) chip.textContent = favLabel();
    if (on) confettiFrom(source, 10);
    if (!on && state.category === "__fav") renderProducts();
    showToast(on ? `Saved ${product.name} to favourites ♥` : `Removed ${product.name} from favourites`);
  }

  /* ----- Quick view dialog ----- */
  function openQuick(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const wished = wishlist.has(id);
    const ask = encodeURIComponent(`Hi ${CONFIG.brand}! I'm interested in the ${p.name} (${money(p.price)}).`);
    $("#quickBody").innerHTML = `
      <img src="${p.img}" alt="${esc(p.alt)}" width="800" height="600" class="h-64 w-full bg-oat object-cover sm:h-full sm:min-h-[24rem]" />
      <div class="flex flex-col p-6 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-widest text-berry-dark">${esc(p.category)}</p>
        <h2 id="quickTitle" class="mt-1 font-display text-3xl font-semibold">${esc(p.name)}</h2>
        <p class="mt-1 text-sm text-cocoa/75"><span class="text-amber-600" aria-hidden="true">★</span> ${p.rating.toFixed(1)}<span class="sr-only"> out of 5</span></p>
        <p class="mt-4 text-cocoa/85">${esc(p.desc)}</p>
        <ul class="mt-4 space-y-1 text-sm text-cocoa/80">
          <li><span aria-hidden="true">🌾</span> Baked fresh the same morning</li>
          <li><span aria-hidden="true">🌱</span> Eggless version on request</li>
          <li><span aria-hidden="true">🎀</span> Gift wrapping available</li>
        </ul>
        <p class="mt-6 font-display text-3xl font-semibold">${money(p.price)}</p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="btn btn-primary" data-action="quick-add" data-id="${p.id}">Add to cart</button>
          <button type="button" class="btn btn-outline" data-action="wish" data-id="${p.id}" aria-pressed="${wished}" aria-label="${wished ? "Remove from" : "Add to"} favourites: ${esc(p.name)}"><span class="heart-text" aria-hidden="true">♥</span> Favourite</button>
        </div>
        <a class="mt-4 text-sm underline underline-offset-4" href="https://wa.me/${CONFIG.whatsapp}?text=${ask}" target="_blank" rel="noopener">Ask about this on WhatsApp</a>
      </div>`;
    const modal = $("#quickView");
    modal.hidden = false;
    openLayer(modal, closeQuick);
    $("#quickClose").focus();
  }

  function closeQuick() {
    $("#quickView").hidden = true;
    closeLayer();
  }

  /** Scroll-linked effects: progress bar, hero parallax, auto-hiding header, back-to-top button */
  function initScrollEffects() {
    const bar = $("#scrollProgress");
    const toTop = $("#toTop");
    const top = $("#site-header");
    const hero = $("#home");
    let lastY = window.scrollY;
    let queued = false;

    function update() {
      queued = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      toTop.classList.toggle("show", y > 600);

      if (!REDUCED_MOTION) {
        // Navbar slides away when scrolling down, comes back when scrolling up
        if (y > lastY + 4 && y > 300 && !isMenuOpen() && !top.contains(document.activeElement)) top.classList.add("hide");
        else if (y < lastY - 4 || y <= 300) top.classList.remove("hide");

        // Hero: background drifts slower than the page, text lags and fades
        if (hero && y <= hero.offsetHeight) {
          const h = hero.offsetHeight;
          hero.style.setProperty("--py", `${Math.min(y * 0.15, h * 0.06)}px`);
          hero.style.setProperty("--cy", `${y * 0.25}px`);
          hero.style.setProperty("--fade", String(Math.max(0, 1 - y / (h * 0.7))));
        }
      }
      if (Math.abs(y - lastY) > 4) lastY = y;
    }

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update); // at most one update per frame
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    top.addEventListener("focusin", () => top.classList.remove("hide")); // keyboard users never lose the navbar
    update();
  }

  const ACTIONS = {
    "toggle-menu": () => setMenu(!isMenuOpen()),
    "copy-code": copyCouponCode,
    "dismiss-promo": dismissPromo,
    "open-cart": openCart,
    "close-cart": closeCart,
    add: (el) => addToCart(el.dataset.id, el),
    wish: (el) => toggleWish(el.dataset.id, el),
    quick: (el) => openQuick(el.dataset.id),
    "close-quick": closeQuick,
    "quick-add": (el) => {
      addToCart(el.dataset.id, el);
      closeQuick();
    },
    "kids-theme": (el) => {
      document.dispatchEvent(new CustomEvent("cake:theme", { detail: el.dataset.theme }));
      confettiFrom(el, 30);
      goTo("custom");
    },
    mascot: (el) => {
      confettiFrom(el, 30);
      showToast(`Cuppy says: ${MASCOT_TIPS[Math.floor(Math.random() * MASCOT_TIPS.length)]}`);
    },
    qty: (el) => changeQty(el.dataset.id, Number(el.dataset.delta)),
    remove: (el) => removeFromCart(el.dataset.id),
    "clear-cart": clearCart,
    "whatsapp-order": orderOnWhatsApp,
    "order-now": () => (cartTotals().count ? openCart() : goTo("products")),
    "view-menu": () => goTo("products"),
    shop: (el) => {
      state.category = el.dataset.category;
      renderProducts();
      goTo("products");
    },
    "to-top": () => window.scrollTo({ top: 0 }), // smooth via CSS
    filter: (el) => {
      state.category = el.dataset.value;
      renderProducts();
    },
    "clear-search": clearSearchAndFilters,
    occasion: (el) => {
      // Clicking the active tile again clears the occasion filter
      state.occasion = state.occasion === el.dataset.value ? "All" : el.dataset.value;
      renderProducts();
      if (state.occasion !== "All") goTo("products");
    },
    eggless: () => {
      state.eggless = !state.eggless;
      renderProducts();
    },
  };

  function initEvents() {
    document.addEventListener("click", (event) => {
      const el = event.target.closest("[data-action]");
      const handler = el && ACTIONS[el.dataset.action];
      if (handler) handler(el, event);
    });

    $("#quickView").addEventListener("click", (event) => event.target === event.currentTarget && closeQuick()); // click on the dim backdrop

    $("#couponForm").addEventListener("submit", (event) => {
      event.preventDefault();
      applyCoupon($("#couponInput").value);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (layer) layer.close();
        else if (isMenuOpen()) {
          setMenu(false);
          $("#menuBtn").focus();
        }
      } else if (event.key === "Tab" && layer) {
        trapTab(event, layer.el);
      }
    });
  }

  initPageLoader(); // first, so a later error can never leave the loader stuck
  renderLayout();
  initEvents();
  initHeader();
  initScrollSpy();
  initHero();
  initScrollEffects();
  renderOccasions();
  renderBestSellers();
  renderChips();
  renderProducts();
  renderGallery();
  initSort();
  // builder.js (loaded after this file) uses these
  window.CreativeCake = { CONFIG, esc, money, confettiFrom, showToast };
  initPincode();
  initDecor();
  initSearch();
  initCounters();
  initContactForm();
  renderCart();
  initReveal();
});
