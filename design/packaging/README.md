# Packaging renders

Vector source for the Autumn 26 bottle and box images in `assets/img/koro-*.jpg`.

- **Bottle**: KORO's existing square bottle (shape unchanged), shown corner-on without the overcap: gold crimp collar and sprayer.
- **Label**: minimal beige sticker folded over the front corner (corner placement inspired by Nasomatto). Left face: blind-embossed KORO only. Right face: a close detail of Nadya Danylenko's line drawing (`detail-art.png`), bleeding off the edges and just over the fold.
- **Box**: rigid kraft, two-piece with a lift-off lid; blind-embossed KORO, the same drawing detail in brown ink running off the lid edge, scent name in small type. Keeps the bottle out of daylight.

To change the scent name or volume, edit `stickerHalf()` / `boxFace()` in `render.html`, then render:

```sh
NODE_PATH=$(npm root -g) node render.js "$PWD"   # writes s1.png, s2.png, s3.png
```
