# KORO

Redesign concept for [koroperfumes.com](https://koroperfumes.com), a natural perfumery studio in London, in the quiet, label-led style of Ffern.

The homepage leads with the **Autumn 26 edition, KORO × Nadya Danylenko**, a collaboration with the Ukrainian artist, psychologist and movement therapist.

## Structure

- `index.html` – single-page site: seasonal hero, perfumer statement, edition and art cards, art shop (card set + framed print configurator), MABON feature, collection, discovery sets, studio, personal fragrance, reviews
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

No Ffern photography remains. Bottle photos (`koro-*.jpg`, `tease-*.jpg`) are AI-generated KORO concepts, and the material photos (`mat-*.jpg`) were supplied without a source: confirm the licence for each, or replace them with KORO's own shoot, before publishing.
