# Packaging renders

Vector source for the Autumn 26 bottle and box images in `assets/img/koro-*.jpg`.

`scene3d.js` builds every object in real millimetres and projects it through one perspective camera per scene, so the bottle, box and props share the same scale:

- bottle 56 × 56 × 60 mm glass (11 mm base), sprayer ~20 mm
- box 74 × 74 × 92 mm, lid over a 4 mm base band; open base 70 × 70 × 22 mm

- **Bottle**: KORO's existing square bottle (shape unchanged), shown corner-on without the overcap: gold crimp collar and sprayer.
- **Label**: minimal beige sticker folded over the front corner (corner placement inspired by Nasomatto), each half 32 × 23.6 mm. Left: KORO blind-embossed vertically. A close detail of Nadya Danylenko's line drawing (`detail-art.png`) spans both halves, every line running to the sticker's edges.
- **Box**: plain rigid kraft, two-piece with a lift-off lid; blind-embossed KORO and the scent name in small print. Keeps the bottle out of daylight.

To change the artwork, sizes or scent name, edit `scene3d.js` (`stickerHalf`, `boxArt`, `B`, `BOX`, `TRAY`) or the scene layouts in `render3d.html`, then render:

```sh
NODE_PATH=$(npm root -g) node render.js "$PWD"   # writes s1.png, s2.png, s3.png
```
