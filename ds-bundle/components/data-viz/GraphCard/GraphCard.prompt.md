GraphCard from simui-lovelace. Use via `window.SimUI.GraphCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<SimuiProvider>` (full provider chain in README.md — components read theme/i18n from that context). Keywords: graph, chart, history, sensor, line, sparkline, trend.

A sensor history chart — a thin line with a soft gradient fill, hairline gridlines, a crosshair
value readout, a range toggle (1h / 12h / 24h / 7d) and min/avg/max stats. Custom-rendered SVG,
no chart library. Taller than the entity tiles.

```tsx
import { SimuiProvider, GraphCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <GraphCard config={{ type: 'simui-graph-card', entity: 'sensor.temp', hours: 24 }} />
</SimuiProvider>
```

Demo numeric entities with history: `sensor.temp`, `sensor.power`, `sensor.humidity`.

Key config: `entity` (required), `name`, `color` (`warm` | `cool` | `up` | `down` | `grey`),
`hours` (default range, default 24), `ranges` (range-toggle options in hours; `[]` hides it),
`fill` (area fill, default `true`), `line_width`, `tap_action`.

## Props

```ts
interface GraphCardProps {
config: { entity: string; name?: string; icon?: string; color?: "warm" | "cool" | "up" | "down" | "grey"; hours?: number; ranges?: number[]; fill?: boolean; line_width?: number; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}
```
