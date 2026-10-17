# Packaging renders

Vector source for the Autumn 26 bottle and box images in `assets/img/koro-*.jpg`.

- **Bottle**: KORO's existing square bottle (shape unchanged), shown without the overcap: gold crimp collar and sprayer.
- **Label**: small beige sticker applied at a 9° tilt (same on bottle and box), beige paper, blind-embossed KORO, scent / season / volume grid, line drawing by Nadya Danylenko (`line-art.png`).
- **Box**: rigid kraft, two-piece with a lift-off lid, sized to hold the bottle upright and keep it out of daylight.

To change the scent name or volume, edit `label()` / `bottle()` calls in `render.html`, then render:

```sh
NODE_PATH=$(npm root -g) node render.js "$PWD"   # writes s1.png, s2.png, s3.png
```
