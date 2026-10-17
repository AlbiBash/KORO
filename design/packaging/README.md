# Packaging renders

Vector source for the Autumn 26 bottle and box images in `assets/img/koro-*.jpg`.

- **Bottle**: KORO's existing square bottle (shape unchanged), shown corner-on without the overcap: gold crimp collar and sprayer.
- **Label**: beige sticker folded around the front corner (Nasomatto-style placement). Left face: blind-embossed KORO, rule, "natural eau de parfum", volume and season. Right face: scent name and a line drawing by Nadya Danylenko (`line-art.png`).
- **Box**: rigid kraft, two-piece with a lift-off lid, Nadya's drawing (`embrace-art.png`) printed in brown ink with KORO beneath; keeps the bottle out of daylight.

To change the scent name or volume, edit `stickerLeft()` / `stickerRight()` / `boxFace()` in `render.html`, then render:

```sh
NODE_PATH=$(npm root -g) node render.js "$PWD"   # writes s1.png, s2.png, s3.png
```
