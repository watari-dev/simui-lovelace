// Build the SimUI Cards design-system preview library.
//
// Reads the real card CSS (src/styles.css) and the ground-truth rendered DOM (cards.json,
// extracted from the live dev harness) and emits self-contained static HTML preview cards —
// one per component, plus a Foundations/tokens card and a local gallery index.
//
// Each preview is fully self-contained (CSS inlined, no JS, no 383 KB bundle) so it renders
// identically in any iframe — the Claude Design system pane, or a local browser. The card CSS
// is authored for shadow DOM (`:host`), so we scope it to `.simui-scope` for the no-shadow page.
//
//   node design/build.mjs
//
// To refresh the DOM after a card's markup changes: re-extract from the running harness and
// update the `dom` strings in cards.json, then re-run.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// The real card stylesheet, scoped from shadow-DOM `:host` to a plain `.simui-scope` wrapper.
const cardCss = readFileSync(join(root, 'src/styles.css'), 'utf8').replaceAll(':host', '.simui-scope');
const { components } = JSON.parse(readFileSync(join(here, 'cards.json'), 'utf8'));

const PAGE_CSS = `
:root { color-scheme: dark; }
html, body { margin: 0; background: #0e0e10; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
.ds-wrap { padding: 26px 26px 34px; max-width: 820px; margin: 0 auto; }
.ds-eyebrow { color: #6f6f73; font-size: 10.5px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; margin: 0 0 6px; }
.ds-title { color: #ededed; font-size: 17px; font-weight: 700; letter-spacing: -.2px; margin: 0 0 5px; }
.ds-desc { color: #8a8a8a; font-size: 12.5px; line-height: 1.5; margin: 0 0 22px; max-width: 56ch; }
.ds-grid { display: grid; gap: 16px; }
.ds-cell { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.ds-label { color: #6f6f73; font-size: 10px; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; padding-left: 3px; }
`;

const page = ({ group, name, subtitle, desc, gridCss, extraCss = '', body, afterGrid = '' }) =>
  `<!-- @dsCard group="${group}" name="${name}" subtitle="${subtitle}" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SimUI Cards — ${name}</title>
<style>
${PAGE_CSS}
.ds-grid { ${gridCss || 'grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));'} }
${extraCss}
/* ── SimUI card styles (src/styles.css, :host → .simui-scope) ─────────────── */
${cardCss}
</style>
</head>
<body>
<div class="ds-wrap">
<p class="ds-eyebrow">SimUI Cards</p>
<p class="ds-title">${name}</p>
<p class="ds-desc">${desc}</p>
<div class="ds-grid">
${body}
</div>
${afterGrid}
</div>
</body>
</html>
`;

const cell = (dom, label) =>
  `<div class="ds-cell"><div class="simui-scope">${dom}</div>${label ? `<span class="ds-label">${label}</span>` : ''}</div>`;

mkdirSync(join(here, 'components'), { recursive: true });
mkdirSync(join(here, 'foundations'), { recursive: true });

const written = [];

// ── Component preview cards ──────────────────────────────────────────────────
for (const c of components) {
  const body = c.variants.map((v) => cell(v.dom, v.label)).join('\n');
  const html = page({ group: c.group, name: c.name, subtitle: c.subtitle, desc: c.desc, gridCss: c.grid, body });
  const path = `components/${c.id}.html`;
  writeFileSync(join(here, path), html);
  written.push({ path, name: c.name, group: c.group });
}

// ── Foundations: the colour + geometry tokens every card is built from ───────
const TOKENS = [
  ['warm', '252, 214, 99', 'Amber', 'lights · switches · on'],
  ['cool', '137, 179, 248', 'Blue', 'cooling · fan · covers · media'],
  ['up', '128, 201, 148', 'Green', 'good · secure · charging'],
  ['heat', '240, 150, 90', 'Orange', 'heating'],
  ['down', '241, 139, 130', 'Coral', 'alert · fault · unavailable'],
  ['grey', '187, 187, 187', 'Grey', 'neutral · at-rest'],
  ['theme', '127, 127, 127', 'Theme dim', 'off icons · gridlines'],
];
const SURFACES = [
  ['--surface', '#1d1d1d', 'Card surface'],
  ['#0e0e10', '#0e0e10', 'Canvas / behind cards'],
  ['--text', '#dddddd', 'Primary text'],
];
const tokExtraCss = `
.tok-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.swatch { height: 64px; border-radius: 14px; box-shadow: 0 2px 4px 0 rgba(0,0,0,.16); }
.tok-name { color: #ededed; font-size: 12.5px; font-weight: 700; margin: 0; }
.tok-meta { color: #7a7a7e; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.tok-use { color: #6f6f73; font-size: 11px; }
.geo { color: #9a9a9e; font-size: 12px; line-height: 1.7; margin: 22px 0 0; }
.geo b { color: #d6d6d6; font-weight: 700; }
.geo code { color: #cfcfcf; background: #1d1d1d; border-radius: 5px; padding: 1px 6px; font-size: 11.5px; }
`;
const tokCell = (swatchStyle, name, meta, use) =>
  `<div class="ds-cell"><div class="swatch" style="${swatchStyle}"></div><p class="tok-name">${name}</p>${meta ? `<span class="tok-meta">${meta}</span>` : ''}${use ? `<span class="tok-use">${use}</span>` : ''}</div>`;

const tokensBody = [
  ...TOKENS.map(([id, rgb, label, use]) => tokCell(`background: rgb(${rgb})`, label, `--${id} · ${rgb}`, use)),
  ...SURFACES.map(([id, hex, label]) => tokCell(`background: ${hex}; border: 1px solid rgba(255,255,255,.06)`, label, id, '')),
].join('\n');

const tokensHtml = page({
  group: 'Foundations',
  name: 'Colour & geometry',
  subtitle: '7 state tokens · surfaces · radius',
  desc: 'The palette and geometry every card is built from. State colours are RGB triplets — used solid as rgb(var(--x)) and as a soft wash with rgba(var(--x), α), so one token serves both the full-strength icon and its 20%-alpha disc. Each token inherits the user’s UI-Lovelace-Minimalist theme variable when present, and falls back to these dark-mode values otherwise.',
  gridCss: 'grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));',
  extraCss: tokExtraCss,
  body: tokensBody,
  afterGrid: `<p class="geo"><b>Geometry.</b> Card radius <code>20px</code> · soft bezel <code>0 2px 4px rgba(0,0,0,.16)</code> · icon disc <code>36px</code> circle (colour wash at <code>.2</code>, glyph at full) · chip <code>36px</code> pill · tabular figures for every value.</p>`,
});
writeFileSync(join(here, 'foundations/tokens.html'), tokensHtml);
written.unshift({ path: 'foundations/tokens.html', name: 'Colour & geometry', group: 'Foundations' });

// ── Local gallery index (iframes every preview for quick local viewing) ──────
const galleryItem = (w) =>
  `<figure class="g-item"><figcaption>${w.name} <span>${w.group}</span></figcaption><iframe src="${w.path}" loading="lazy"></iframe></figure>`;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SimUI Cards — design library</title>
<style>
:root { color-scheme: dark; }
html, body { margin: 0; background: #0a0a0c; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ededed; }
header { padding: 30px 30px 8px; }
header h1 { font-size: 19px; font-weight: 700; letter-spacing: -.2px; margin: 0 0 4px; }
header p { color: #8a8a8a; font-size: 13px; margin: 0; }
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; padding: 22px 30px 40px; }
.g-item { margin: 0; border: 1px solid rgba(255,255,255,.07); border-radius: 16px; overflow: hidden; background: #0e0e10; }
.g-item figcaption { display: flex; justify-content: space-between; align-items: baseline; padding: 11px 14px; font-size: 12.5px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,.06); }
.g-item figcaption span { color: #6f6f73; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }
.g-item iframe { width: 100%; height: 340px; border: 0; display: block; background: #0e0e10; }
</style>
</head>
<body>
<header><h1>SimUI Cards — design library</h1><p>${written.length} components · grounded in UI-Lovelace-Minimalist. Built from the real card CSS + live-rendered DOM.</p></header>
<div class="gallery">
${written.map(galleryItem).join('\n')}
</div>
</body>
</html>
`;
writeFileSync(join(here, 'index.html'), indexHtml);

console.log(`Built ${written.length} preview cards + gallery index:`);
for (const w of written) console.log(`  ${w.group.padEnd(16)} ${w.path}`);
