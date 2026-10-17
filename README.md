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

The bottle photos (`koro-heather`, `koro-oranges`, `koro-olwen-box`) and the packaging renders are KORO's. Three mood photos without bottles (`pear`, `field` and the framed-art drawings aside) still come from Ffern: `pear.jpg` and `field.jpg` should be replaced with KORO's own shoot before publishing.
