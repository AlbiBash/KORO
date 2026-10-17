// KORO packaging renders, built in real millimetres with one perspective camera per scene.
// Bottle: KORO's existing square bottle (56 x 56 x 60 mm glass, thick base), no overcap.

// ---------- vector + camera ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(...a));
const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
const f2 = (n) => n.toFixed(2);

function camera({ pos, target, f, cx, cy }) {
  const fw = norm(sub(target, pos));
  const right = norm(cross(fw, [0, 1, 0]));
  const up = cross(right, fw);
  const P = (p) => {
    const d = sub(p, pos);
    const z = dot(d, fw);
    return [cx + (f * dot(d, right)) / z, cy - (f * dot(d, up)) / z];
  };
  P.scale = (p) => f / dot(sub(p, pos), fw);           // px per mm at p
  P.facing = (p, n) => dot(n, sub(pos, p)) > 0;        // is a face with normal n visible
  P.elev = (p) => { const d = norm(sub(pos, p)); return Math.max(.05, d[1]); };
  return P;
}
const poly = (P, pts) => "M" + pts.map((p) => P(p).map(f2).join(" ")).join(" L") + " Z";

// affine that maps content box (0..cw, 0..ch, y down) onto three projected points
function affine(P, tl, tr, bl, cw, ch) {
  const [a, b, c] = [P(tl), P(tr), P(bl)];
  return `matrix(${f2((b[0] - a[0]) / cw)} ${f2((b[1] - a[1]) / cw)} ${f2((c[0] - a[0]) / ch)} ${f2((c[1] - a[1]) / ch)} ${f2(a[0])} ${f2(a[1])})`
    .replace(/(\.\d\d)\b/g, "$1");
}
function affineP(P, tl, tr, bl, cw, ch) {
  const [a, b, c] = [P(tl), P(tr), P(bl)];
  const m = [(b[0] - a[0]) / cw, (b[1] - a[1]) / cw, (c[0] - a[0]) / ch, (c[1] - a[1]) / ch, a[0], a[1]];
  return `matrix(${m.map((n) => n.toFixed(5)).join(" ")})`;
}

// a vertical face: bottom edge from p0 to p1 (world), u in mm along it, v in mm up
function face(p0, p1) {
  const W = Math.hypot(p1[0] - p0[0], p1[2] - p0[2]);
  const at = (u, v) => add(lerp(p0, p1, u / W), [0, v, 0]);
  const n = norm(cross(sub(p1, p0), [0, 1, 0]));
  return { W, at, n };
}
const quad = (P, F, u0, u1, v0, v1) => poly(P, [F.at(u0, v0), F.at(u1, v0), F.at(u1, v1), F.at(u0, v1)]);

// rotated box corners (y = 0 floor). rot in degrees around Y.
function boxCorners(c, w, d, rot) {
  const r = (rot * Math.PI) / 180, cs = Math.cos(r), sn = Math.sin(r);
  return [[-w / 2, d / 2], [w / 2, d / 2], [w / 2, -d / 2], [-w / 2, -d / 2]].map(([x, z]) => [c[0] + x * cs + z * sn, 0, c[2] - x * sn + z * cs]);
}
const up = (p, y) => [p[0], y, p[2]];

function hull(pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.slice().reverse()) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}
// sun travels right, down and slightly back
const SUN = norm([.62, -.72, -.32]);
function castShadow(P, pts, opacity = .28) {
  const fl = pts.map((p) => { const t = p[1] / -SUN[1]; return add(p, mul(SUN, t)); });
  const scr = hull(fl.map(P));
  return `<path d="M${scr.map((q) => q.map(f2).join(" ")).join(" L")} Z" fill="#4a3018" opacity="${opacity}" filter="url(#soft)"/>`;
}
function contact(P, pts) {
  const scr = hull(pts.map(P));
  return `<path d="M${scr.map((q) => q.map(f2).join(" ")).join(" L")} Z" fill="#2e1e0e" opacity=".45" filter="url(#soft2)"/>`;
}

// ---------- sticker (content units: each half 160 x 118) ----------
const INK = "#4a3020";
function emb(txt, x, y, size, ls) {   // blind emboss, set vertically (reads bottom to top)
  return `<g transform="translate(${x} ${y}) rotate(-90)">
    <text x=".9" y="1.1" text-anchor="middle" class="didot" font-size="${size}" letter-spacing="${ls}" fill="#7d6644" fill-opacity=".55">${txt}</text>
    <text x="-.8" y="-.8" text-anchor="middle" class="didot" font-size="${size}" letter-spacing="${ls}" fill="#fffaf0">${txt}</text>
    <text x="0" y="0" text-anchor="middle" class="didot" font-size="${size}" letter-spacing="${ls}" fill="#e0d2b5">${txt}</text></g>`;
}
// strip = two halves of 160 x 118 either side of the bottle's corner; the drawing detail
// covers the whole strip so every line runs to the sticker's edges
const SW = 160, SH = 118, ART = { w: 400, h: 376, x: 44, y: -150 };
let uid = 0;
function stickerHalf(side) {
  const id = `c${uid++}`, artX = side === "left" ? ART.x : ART.x - SW;
  return `
    <clipPath id="${id}"><rect width="${SW}" height="${SH}"/></clipPath>
    <rect width="${SW}" height="${SH}" fill="#e9ddc6" filter="url(#paper)"/>
    <g clip-path="url(#${id})"><image href="detail-art.png" x="${artX}" y="${ART.y}" width="${ART.w}" height="${ART.h}" opacity=".9"/></g>
    ${side === "left" ? emb("KORO", 34, SH / 2 + 2, 28, 6) : ""}`;
}

// ---------- the bottle ----------
const B = { side: 56, h: 60, base: 11, wall: 3.5, fill: 5 };
const STK = { w: 32, h: 23.6, top: 44 };   // each sticker half, mm
function bottle(P, c, rot = 45) {
  const k = boxCorners(c, B.side, B.side, rot);
  // after a 45° turn: k[0] is the front corner, k[3] left, k[1] right
  const front = k[0], left = k[3], right = k[1], back = k[2];
  const L = face(left, front), R = face(front, right);
  const H = B.h, W = B.side;
  const glass = (F, side) => {
    const shade = side === "right";
    const stk = side === "left"
      ? { tl: F.at(W - STK.w, STK.top), tr: F.at(W, STK.top), bl: F.at(W - STK.w, STK.top - STK.h) }
      : { tl: F.at(0, STK.top), tr: F.at(STK.w, STK.top), bl: F.at(0, STK.top - STK.h) };
    return `
      <path d="${quad(P, F, 0, W, 0, H)}" fill="url(#glassFront)"/>
      <path d="${quad(P, F, B.wall, W - B.wall, B.base, H - B.fill)}" fill="url(#liquid)" opacity=".93"/>
      <path d="${quad(P, F, B.wall, W - B.wall, B.base, H - B.fill)}" fill="url(#liquidEdge)"/>
      <path d="${quad(P, F, B.wall, W - B.wall, H - B.fill - .9, H - B.fill)}" fill="#f6e4ad" opacity=".85"/>
      <path d="${quad(P, F, .4, W - .4, .4, B.base)}" fill="url(#glassBase)"/>
      <path d="${quad(P, F, B.wall, W - B.wall, B.base - .35, B.base + .1)}" fill="#fff6dc" opacity=".8"/>
      <path d="${quad(P, F, 0, B.wall, 0, H)}" fill="#fff" opacity=".12"/>
      <path d="${quad(P, F, W - B.wall, W, 0, H)}" fill="#fff" opacity=".12"/>
      ${shade ? `<path d="${quad(P, F, W - 8, W - 7, 14, H - 6)}" fill="#fff" opacity=".3" filter="url(#hl)"/>`
              : `<path d="${quad(P, F, 6, 8.5, 12, H - 4)}" fill="#fff" opacity=".42" filter="url(#hl)"/>
                 <path d="${quad(P, F, 10, 10.5, 15, H - 10)}" fill="#fff" opacity=".55"/>`}
      <g transform="${affineP(P, stk.tl, stk.tr, stk.bl, SW, SH)}">${stickerHalf(side)}</g>
      ${shade ? `<path d="${quad(P, F, 0, W, 0, H)}" fill="#4a2e0c" opacity=".14"/>` : ""}`;
  };
  const T = (p) => up(p, H);
  const topC = up(c, H), s = P.scale(topC), e = P.elev(topC);
  const tc = P(topC);
  const cyl = (y0, h, r, fillSide, fillTop) => {
    const a = P(up(c, H + y0)), b = P(up(c, H + y0 + h)), rx = r * s, ry = r * s * e;
    return `<path d="M${f2(a[0] - rx)} ${f2(a[1])} A${f2(rx)} ${f2(ry)} 0 0 0 ${f2(a[0] + rx)} ${f2(a[1])} L${f2(b[0] + rx)} ${f2(b[1])} L${f2(b[0] - rx)} ${f2(b[1])} Z" fill="${fillSide}"/>
            <ellipse cx="${f2(b[0])}" cy="${f2(b[1])}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fillTop}"/>`;
  };
  const noz = P(up(c, H + 16.5));
  return `
  <g>
    ${glass(L, "left")}
    ${glass(R, "right")}
    <path d="${poly(P, [T(left), T(front), T(right), T(back)])}" fill="#f4eee0" opacity=".55"/>
    <path d="${poly(P, [lerp(topC, T(left), .88), lerp(topC, T(front), .88), lerp(topC, T(right), .88), lerp(topC, T(back), .88)])}" fill="#e7cf8c" opacity=".45"/>
    <path d="M${P(T(left)).map(f2).join(" ")} L${P(T(back)).map(f2).join(" ")} L${P(T(right)).map(f2).join(" ")}" fill="none" stroke="#fffaf0" stroke-width="1.4" opacity=".8"/>
    <path d="M${P(front).map(f2).join(" ")} L${P(up(front, STK.top - STK.h - .3)).map(f2).join(" ")} M${P(up(front, STK.top + .3)).map(f2).join(" ")} L${P(T(front)).map(f2).join(" ")}" stroke="#fffaf0" stroke-width="2.2" opacity=".75"/>
    <path d="M${P(left).map(f2).join(" ")} L${P(front).map(f2).join(" ")} L${P(right).map(f2).join(" ")} L${P(T(right)).map(f2).join(" ")} L${P(T(back)).map(f2).join(" ")} L${P(T(left)).map(f2).join(" ")} Z" fill="none" stroke="#6b5530" stroke-opacity=".4" stroke-width="1.2"/>
    <path d="M${P(T(left)).map(f2).join(" ")} L${P(T(front)).map(f2).join(" ")} L${P(T(right)).map(f2).join(" ")}" fill="none" stroke="#6b5530" stroke-opacity=".3"/>
    <ellipse cx="${f2(tc[0])}" cy="${f2(tc[1])}" rx="${f2(11 * s)}" ry="${f2(11 * s * e)}" fill="#d9c79c" opacity=".6"/>
    ${cyl(0, 4.5, 9.5, "url(#gold)", "url(#goldTop)")}
    ${cyl(4.5, 6, 8, "url(#gold)", "url(#goldTop)")}
    ${cyl(10.5, 9.5, 6.4, "url(#gold)", "url(#goldTop)")}
    <ellipse cx="${f2(noz[0] + 1.6 * s)}" cy="${f2(noz[1])}" rx="${f2(.75 * s)}" ry="${f2(.75 * s)}" fill="#4b3612"/>
  </g>`;
}
const bottleFoot = (c, rot = 45) => boxCorners(c, B.side, B.side, rot);
const bottlePts = (c, rot = 45) => { const k = bottleFoot(c, rot); return [...k, ...k.map((p) => up(p, B.h)), up(c, B.h + 20)]; };

// ---------- kraft box (lift-off lid) ----------
// box face artwork, content units 10 per mm, y down
function boxArt(wmm, hmm, scent) {
  const w = wmm * 10, h = hmm * 10, ks = w * .13, y = h * .46;
  return `
    <text x="${w / 2 + 2}" y="${y + 2.4}" text-anchor="middle" class="didot" font-size="${ks}" letter-spacing="${w * .035}" fill="#6b4c2c" opacity=".55">KORO</text>
    <text x="${w / 2 - 2}" y="${y - 2}" text-anchor="middle" class="didot" font-size="${ks}" letter-spacing="${w * .035}" fill="#f2dcb6" opacity=".7">KORO</text>
    <text x="${w / 2}" y="${y}" text-anchor="middle" class="didot" font-size="${ks}" letter-spacing="${w * .035}" fill="#b48d62">KORO</text>
    <text x="${w / 2}" y="${h - w * .08}" text-anchor="middle" class="sans" font-size="${w * .032}" letter-spacing="${w * .012}" fill="#3b2716" opacity=".75">${scent}</text>`;
}
// draws a closed prism (outer box). y0..y1 heights; art on the face whose normal points most at camera
function prism(P, c, w, d, y0, y1, rot, opts = {}) {
  const k = boxCorners(c, w, d, rot);
  const faces = [[k[0], k[1]], [k[1], k[2]], [k[2], k[3]], [k[3], k[0]]].map(([a, b]) => face(a, b));
  let out = "";
  faces.forEach((F, i) => {
    const mid = F.at(F.W / 2, (y0 + y1) / 2);
    if (!P.facing(mid, F.n)) return;
    const lit = F.n[0] < 0 ? 1 : 0;   // faces turned to the left catch the sun
    out += `<path d="${quad(P, F, 0, F.W, y0, y1)}" fill="${opts.fill || "url(#kraftFront)"}" filter="url(#kraft)"/>
      ${lit ? "" : `<path d="${quad(P, F, 0, F.W, y0, y1)}" fill="#3d2a14" opacity=".2"/>`}
      ${opts.art && i === 0 ? `<g transform="${affineP(P, F.at(0, y1), F.at(F.W, y1), F.at(0, y0), F.W * 10, (y1 - y0) * 10)}">${opts.art(F.W, y1 - y0)}</g>` : ""}
      <path d="${quad(P, F, 0, F.W, y0, y1)}" fill="none" stroke="#5e4428" stroke-opacity=".35" stroke-width="1"/>`;
  });
  if (!opts.open) {
    out += `<path d="${poly(P, k.map((p) => up(p, y1)))}" fill="url(#kraftTop)" filter="url(#kraft)"/>
      <path d="${poly(P, k.map((p) => up(p, y1)))}" fill="none" stroke="#f0dcbc" stroke-opacity=".7"/>`;
  }
  return out;
}
const BOX = { w: 74, d: 74, h: 92, band: 4 };
function closedBox(P, c, rot, scent = "MABON") {
  return prism(P, c, BOX.w - 1.2, BOX.d - 1.2, 0, BOX.band, rot, { fill: "#a98458" }) +
         prism(P, c, BOX.w, BOX.d, BOX.band, BOX.h, rot, { art: (w, h) => boxArt(w, h, scent) });
}
const boxPts = (c, rot, h = BOX.h) => { const k = boxCorners(c, BOX.w, BOX.d, rot); return [...k, ...k.map((p) => up(p, h))]; };

// open base tray holding the bottle (drawn as back, bottle, front)
const TRAY = { w: 70, d: 70, h: 22, wall: 2 };
function tray(P, c, rot, inner) {
  const k = boxCorners(c, TRAY.w, TRAY.d, rot), ki = boxCorners(c, TRAY.w - 2 * TRAY.wall, TRAY.d - 2 * TRAY.wall, rot);
  const back = `<path d="${poly(P, k.map((p) => up(p, TRAY.h)))}" fill="#c9a77a" filter="url(#kraft)"/>
    <path d="${poly(P, ki.map((p) => up(p, TRAY.h)))}" fill="url(#kraftInside)"/>`;
  const front = prism(P, c, TRAY.w, TRAY.d, 0, TRAY.h, rot, { open: true });
  // only the rim's two front edges sit in front of the bottle
  const fr = [k[3], k[0], k[1]].map((p) => P(up(p, TRAY.h)));
  return back + inner + front + `<path d="M${fr.map((q) => q.map(f2).join(" ")).join(" L")}" fill="none" stroke="#f0dcbc" stroke-opacity=".85" stroke-width="1.3"/>`;
}

// ---------- camomile lying on the table ----------
function flowerHead(P, center, n, r) {
  // basis on the flower's plane
  n = norm(n);
  const a = norm(cross(n, Math.abs(n[1]) > .9 ? [1, 0, 0] : [0, 1, 0])), b = cross(n, a);
  const pt = (ang, rad, lift = 0) => add(add(center, mul(add(mul(a, Math.cos(ang)), mul(b, Math.sin(ang))), rad)), mul(n, lift));
  let petals = "";
  const N = 15;
  const order = [...Array(N).keys()].map((i) => ({ i, z: dot(sub(pt((i / N) * Math.PI * 2, r), center), [0, 0, 1]) })).sort((p, q) => p.z - q.z);
  for (const { i } of order) {
    const t = (i / N) * Math.PI * 2 + .2, w = .2;
    const base1 = P(pt(t - w, r * .3)), base2 = P(pt(t + w, r * .3)), tip = P(pt(t, r, -r * .08));
    const c1 = P(pt(t - w * .55, r * .78)), c2 = P(pt(t + w * .55, r * .78));
    petals += `<path d="M${f2(base1[0])} ${f2(base1[1])} Q${f2(c1[0])} ${f2(c1[1])} ${f2(tip[0])} ${f2(tip[1])} Q${f2(c2[0])} ${f2(c2[1])} ${f2(base2[0])} ${f2(base2[1])} Z" fill="#fbf8f1" stroke="#d8cfbf" stroke-width=".6"/>`;
  }
  const disc = [...Array(24).keys()].map((i) => P(pt((i / 24) * Math.PI * 2, r * .34, r * .12)));
  const dc = P(add(center, mul(n, r * .2)));
  return petals + `<path d="M${disc.map((q) => q.map(f2).join(" ")).join(" L")} Z" fill="url(#discGrad)"/>
    <circle cx="${f2(dc[0] - r * .06 * P.scale(center))}" cy="${f2(dc[1] - r * .08 * P.scale(center))}" r="${f2(r * .08 * P.scale(center))}" fill="#ffe9a0" opacity=".7"/>`;
}
function stem(P, pts, w = 1.3) {
  const s = pts.map((p) => P(p));
  return `<path d="M${s.map((q) => q.map(f2).join(" ")).join(" L")}" fill="none" stroke="#7d8a4a" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function leaf(P, origin, dir, len) {
  // fine, feathery camomile leaf: a few short strokes
  let out = "";
  for (let i = 1; i <= 4; i++) {
    const p = add(origin, mul(dir, (len * i) / 5));
    const side = norm(cross(dir, [0, 1, 0]));
    out += stem(P, [p, add(p, add(mul(side, 3 - i * .4), mul(dir, 1.6)))], .8) + stem(P, [p, add(p, add(mul(side, -(3 - i * .4)), mul(dir, 1.6)))], .8);
  }
  return stem(P, [origin, add(origin, mul(dir, len))], .9) + out;
}
// a small sprig: main stem on the table with three heads
function camomile(P, at, ang = 0) {
  const r = (ang * Math.PI) / 180, cs = Math.cos(r), sn = Math.sin(r);
  const W = (x, y, z) => [at[0] + x * cs + z * sn, y, at[2] - x * sn + z * cs];
  const main = [W(-60, 1, 6), W(-38, 1.2, 4), W(-18, 1.5, 1), W(0, 2.2, 0)];
  const br1 = [W(-30, 1.2, 3.4), W(-20, 2.5, 12), W(-12, 3.5, 17)];
  const br2 = [W(-22, 1.4, 1.6), W(-14, 2.4, -8), W(-6, 3, -12)];
  return stem(P, main) + stem(P, br1, 1.1) + stem(P, br2, 1.1) +
    leaf(P, W(-46, 1.1, 5), norm(sub(W(-40, 1.1, -6), W(-46, 1.1, 5))), 14) +
    leaf(P, W(-52, 1.1, 5.5), norm(sub(W(-46, 1.1, 16), W(-52, 1.1, 5.5))), 12) +
    flowerHead(P, W(-6, 4, -12.5), [.25, .92, .3], 9) +
    flowerHead(P, W(-12, 4.5, 17), [-.15, .9, .4], 8.5) +
    flowerHead(P, W(2, 4.4, 0), [.45, .82, .35], 10.5);
}

// ---------- room ----------
function room(P, W, H, wallZ) {
  const hz = P([0, 0, wallZ])[1];
  return `
    <rect width="${W}" height="${f2(hz)}" fill="url(#wall)"/>
    <rect width="${W}" height="${f2(hz)}" fill="url(#wallLight)"/>
    <rect y="${f2(hz)}" width="${W}" height="${f2(H - hz)}" fill="url(#floor)"/>
    <rect y="${f2(hz - 2)}" width="${W}" height="6" fill="#bda781" opacity=".5" filter="url(#soft2)"/>
    <g opacity=".5" filter="url(#soft)">
      <path d="M${W * .05} ${H * .08} L${W * .4} ${H * .1} L${W * .37} ${hz * .82} L${W * .02} ${hz * .8} Z" fill="#fff4dc"/>
      <path d="M${W * .215} ${H * .085} L${W * .23} ${H * .088} L${W * .215} ${hz * .82} L${W * .2} ${hz * .82} Z" fill="#d9c9ab"/>
    </g>`;
}

window.boxArtLid = (w, h) => boxArt(w, h, "MABON");
window.KORO3D = { camera, bottle, bottlePts, bottleFoot, closedBox, boxPts, tray, prism, castShadow, contact, camomile, room, boxCorners, up, BOX, TRAY, B, add };
