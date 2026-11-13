# KORO

Website for [KORO](https://koroperfumes.com), natural perfumes hand crafted in South England. Static HTML, layout from the KORO Figma file with a clean, commune.cc-inspired shop style.

## Pages

- `index.html` – home: hero, all ten perfumes (filter by scent family), featured perfumes, perfumer quote, discovery sets, reviews
- `bahaat.html`, `cephir.html`, `olwen.html` – perfume pages (descriptions and notes from koroperfumes.com); the other perfumes link to koroperfumes.com
- `assets/css/site.css`, `assets/css/home.css` – styles
- `assets/img/` – photography and logo

The buy buttons link to the live shop at koroperfumes.com.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Before going live

The photos `note-*.webp` are AI-generated, and the bottle and material photos were supplied without a source: confirm licences, or replace them with KORO's own shoot, before publishing.
