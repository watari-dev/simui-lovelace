# design-sync notes — simui-lovelace

This repo is **off the converter's happy path**, on purpose. Read this before re-syncing.

## Why the scaffolding exists

SimUI's cards are Home Assistant Lovelace cards: each takes a single `config` prop and reads
live entity state from a `HassProvider` React context (`src/core/hass.tsx`). The HACS build
entry (`src/main.ts`) only registers custom elements and **exports nothing importable** — a
bundle built from it would put nothing on `window.SimUI`. So we ship a design-sync-local layer
(none of this touches `src/`):

- **`.design-sync/entry.tsx`** — the converter entry (`--entry`). Re-exports the 9 card
  components + `HassProvider` + the mock-hass helpers. Compiled to `_ds_bundle.js` → `window.SimUI`.
- **`.design-sync/mock-hass.tsx`** — `SimuiProvider` (the batteries-included context wrapper,
  used as `cfg.provider` AND by the agent), `createMockHass`, and `DEMO_STATES` (realistic demo
  entities mirrored from `src/dev/main-dev.tsx`). Cards render meaningful tiles with no live HA.
- **`.design-sync/gen-styles.mjs`** → **`.design-sync/ds-styles.css`** (`cfg.cssEntry`). The real
  `src/styles.css` is shadow-DOM-scoped (`:host`); claude.ai/design renders in LIGHT DOM, so the
  generator hoists the `:host` token block to `:root`. **Run `node .design-sync/gen-styles.mjs`
  before every build** — it's wired as `cfg.buildCmd`. (`ds-styles.css` is committed but
  generated; re-run after editing `src/styles.css`.)
- **`.design-sync/docs/*.md`** — per-component usage docs; frontmatter `category` sets the group
  (Entity tiles / Media & status / Data viz). They become each `<Name>.prompt.md`.
- **`cfg.dtsPropsFor`** — the `CardComponentProps<XConfig>` generic doesn't resolve via ts-morph
  (falls back to an index signature), so each card's real `config` prop shape is hand-written.

## Build / re-sync

```sh
node .design-sync/gen-styles.mjs                     # regenerate ds-styles.css (cfg.buildCmd)
node .ds-sync/package-build.mjs   --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/entry.tsx --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
# or the driver (build → diff → validate → capture):
node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/entry.tsx --out ./ds-bundle [--remote .design-sync/.cache/remote-sync.json]
```

Playwright 1.60.0 + chromium-1223 (cache: `~/Library/Caches/ms-playwright`) are installed for the
render check. esbuild auto-discovers `tsconfig.json` (`jsx: react-jsx`), so the cards' JSX (no
React import) bundles via the automatic runtime / reactShim.

## Known render warns (triaged — not new)

- `tokens: 13 defined, 11 referenced (1 missing, below threshold)` — by design. The cards
  reference ULM/HA theme-hook vars (`--color-*`, `--eflow-node/edge` set inline, etc.) that are
  intentionally undefined in the shipped CSS and resolve through built-in `var(--x, fallback)`
  defaults. Non-blocking; all 9 cards render correctly. Do not chase it.

## Re-sync risks (what can silently go stale)

- **`DEMO_STATES` / `.design-sync/docs` entity ids are duplicated from `src/dev/main-dev.tsx`.**
  If the dev harness's demo entities change, the mock-hass copy and the per-component doc id lists
  won't follow automatically — re-check them.
- **`ds-styles.css` is generated.** Editing `src/styles.css` without re-running `gen-styles.mjs`
  ships stale CSS. The generator warns if `src/styles.css` grows new `:host` rules it can't map.
- **`cfg.dtsPropsFor` is hand-written.** If a card's config interface changes (new option), update
  the matching `dtsPropsFor` entry or the agent's API contract drifts from reality.
- **`SimuiProvider` is the verification floor.** It's `cfg.provider`, so a preview that fails to
  compile still renders a (provider-wrapped) floor card instead of throwing. Don't remove it.
