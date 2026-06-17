# SimUI Cards — how to build with them

SimUI cards are **Home Assistant Lovelace cards** — minimalist, Apple-Home-inspired tiles
(light, climate, sensor, graph, cover, lock, media, chips, energy-flow). They render live
entity state, so they behave a little differently from ordinary components. Two rules cover it.

## 1. Always wrap cards in `<SimuiProvider>` (required)

Every card reads Home Assistant entity state from React context. **A card rendered without a
provider throws `"SimUI card rendered without a HassProvider"`.** `<SimuiProvider>` supplies a
mock Home Assistant with realistic demo state, so the cards Just Work on the web with no running
HA. Wrap the whole dashboard once:

```tsx
import { SimuiProvider, LightCard, SensorCard, ChipsCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <ChipsCard config={{ type: 'simui-chips-card', entities: ['light.ceiling', 'lock.front', 'sensor.temp'] }} />
  <LightCard  config={{ type: 'simui-light-card',  entity: 'light.office' }} />
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.temp' }} />
</SimuiProvider>
```

Each card takes a **single `config` prop** — the Lovelace YAML config as an object (`type` +
`entity`/`entities` + options). See each component's `.d.ts` for its exact config and
`.prompt.md` for a usage example.

## 2. Use the built-in demo entity ids (or supply your own)

`config.entity` references an entity id that must exist in the provider's state. The demo set
(from `DEMO_STATES`) covers every card — use these ids directly:

- **lights** `light.ceiling` (80%), `light.office` / `light.lamp` (RGB), `light.bed` (off), `light.garage` (unavailable)
- **climate** `climate.living` (heating), `climate.bedroom` (cooling), `climate.guest` (dual), `climate.hall` (off)
- **sensors** `sensor.temp`, `sensor.humidity`, `sensor.power`, `sensor.battery`, `sensor.co2`, `binary_sensor.motion`
- **covers** `cover.living` (blind), `cover.garage`, `cover.awning`  ·  **locks** `lock.front`, `lock.back`, `lock.side` (jammed)
- **media** `media_player.living` (playing), `media_player.kitchen` (paused), `media_player.bedroom` (off)
- **energy** `sensor.solar_power`, `sensor.grid_power`, `sensor.battery_power`, `sensor.battery_soc`, `sensor.home_power`

Need different data? Pass `states` to override or add entities (it merges over the demo set):

```tsx
<SimuiProvider states={{ 'light.x': { entity_id: 'light.x', state: 'on', attributes: { friendly_name: 'My Lamp', brightness: 128 } } }}>
  <LightCard config={{ type: 'simui-light-card', entity: 'light.x' }} />
</SimuiProvider>
```

## The look (don't restyle the cards — they own it)

Cards are fully self-styled: flat `#1d1d1d` surfaces, 20px corners, a soft drop shadow, and a
round icon disc carrying a state tint. **Don't add classes or wrappers to recolor a card** — the
look comes from `styles.css` (read it and its `_ds_bundle.css` import for the truth). Cards are
**dark by default**, so place them on a dark canvas (e.g. `#0e0e10`).

For your own surrounding layout (the dashboard grid, headers), the design tokens are available at
`:root` as RGB **triplets** — use `rgb(var(--token))` solid or `rgba(var(--token), .2)` for a wash:

| Token | Use |
|---|---|
| `--surface` `#1d1d1d`, `--text` | card surface · primary text |
| `--warm` amber | lights / switches / on |
| `--cool` blue | cooling / fan / covers / media |
| `--up` green | good / secure / charging |
| `--heat` orange | heating · `--down` coral: alert / fault / unavailable |
| `--grey` · `--theme` | neutral / at-rest · dim base (off icons, gridlines) |

Geometry tokens: `--r-surface` (20px radius), `--bezel` (the soft shadow). A dashboard is just a
CSS grid of cards inside one `<SimuiProvider>` — keep gaps ~12–16px and let each tile size itself.

# SimUI (simui-lovelace@0.2.0)

This design system is the published simui-lovelace React library, bundled as a single
browser global. All 9 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.SimUI`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.SimUI.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { ChipsCard } = window.SimUI;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<ChipsCard />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<SimuiProvider>{children}</SimuiProvider>
```

## Tokens

13 CSS custom properties from simui-lovelace. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (2): `--surface`, `--r-surface`
- **shadow** (1): `--shadow-hover`
- **other** (10): `--text`, `--theme`, `--warm`, …

## Components

### media-status
- `ChipsCard`
- `MediaCard`

### entity-tiles
- `ClimateCard`
- `CoverCard`
- `LightCard`
- `LockCard`
- `SensorCard`

### data-viz
- `EnergyFlowCard`
- `GraphCard`
