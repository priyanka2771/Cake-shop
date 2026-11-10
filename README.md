# 🎂 Creative Cake

A warm, playful website for a cake and bakery shop. Customers can browse the menu, shop by occasion, design their own cake with a live preview, fill a cart and send the order to the bakery on WhatsApp. It is a static site, so it needs no build step and no backend.

**Repository:** https://github.com/priyanka2771/Cake-shop

## Features

- **Menu:** best sellers, a filterable product grid (type, occasion, eggless only, search, sort), favourites and a quick-view pop-up.
- **Shop by Occasion:** Birthday, Kids Birthday, Wedding, Anniversary, Baby Shower, Festivals, Corporate and Custom Cakes.
- **Cart and ordering:** a cart drawer with a coupon code, and a pre-filled WhatsApp order message.
- **Custom cake builder:** 15 steps (theme, shape, tiers, size, flavour, filling, frosting, toppings, topper, candles, message, delivery slot and more), a live SVG cake preview, a live price with breakdown, "Surprise me", PNG download and a WhatsApp order.
- **Kid-friendly fun:** a cupcake mascot, confetti, floating decorations and a Little Ones' Corner.
- **Helpful extras:** cake size guide, delivery pincode checker, "Open now" indicator, FAQ and testimonials.
- **Contact page:** quick-contact tiles, a validated message form and a success pop-up.
- **Polish:** cake-themed page loader, scroll effects, accessible (keyboard, screen readers, reduced motion) and SEO-ready.

## Tech

HTML, [Tailwind CSS](https://tailwindcss.com) (CDN), plain JavaScript and a little custom CSS. No framework and no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

After changing a file, hard refresh (Ctrl+Shift+R). The `?v=N` on the script and stylesheet links in the HTML files is a cache-buster; bump it when you edit `main.js`, `builder.js` or `styles.css`.

## Project structure

| File | What it does |
| --- | --- |
| `index.html` | Home page: hero, menu, occasions, kids corner, builder, about, reviews, FAQ |
| `contact.html` | Contact page |
| `main.js` | Shared layout (navbar, footer, cart), products, filters, cart, contact form, effects |
| `builder.js` | Custom cake builder: options, live SVG preview, pricing, WhatsApp order |
| `styles.css` | Custom styles and animations on top of Tailwind |
| `logo.svg` | Logo and favicon |

## Make it yours

Everything marked `PLACEHOLDER` is sample data. Replace it before going live.

- **Business details** (`CONFIG` at the top of `main.js`): WhatsApp number, phone, email, address, opening hours, social links, coupon code, pincode ranges and FSSAI number.
- **Products and prices** (`PRODUCTS` in `main.js`): name, price, photo, type, occasions and eggless flag.
- **Builder prices, delivery slots and notice rules** (`PRICING` and `ORDER` at the top of `builder.js`).
- **Contact form:** it does not send anywhere yet. See the Formspree snippet above `sendMessage` in `main.js`.
- **SEO:** update the `og:image` URL and the business details in the JSON-LD block in `index.html`.

## Deploy

Because it is plain static files, you can host it anywhere. To use GitHub Pages: repository **Settings → Pages**, choose the `main` branch and the root folder, then save. The site will be published at `https://priyanka2771.github.io/Cake-shop/`.
