# KORO

Redesign concept for [koroperfumes.com](https://koroperfumes.com), a natural perfumery studio in London, in the quiet, label-led style of Ffern.

The homepage leads with the **Autumn 26 edition, KORO × Nadya Danylenko**, a collaboration with the Ukrainian artist, psychologist and movement therapist.

## Structure

- `index.html` – single-page site: seasonal hero, perfumer statement, edition and art cards, MABON feature, collection, discovery sets, studio, personal fragrance, reviews
- `assets/css/styles.css` – design tokens and layout (GFS Didot for the logo and display type, Jost for text)
- `assets/js/main.js` – mobile menu, volume selector, scroll fade-in (respects reduced motion)
- `assets/img/` – photography and Nadya Danylenko artwork

Shop links point to the live WooCommerce product pages.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Before going live

The bottle, tube and flat-lay photographs are Ffern's (their bottles carry Ffern labels). They are here as mood references only and must be replaced with KORO's own shoot before publishing.
