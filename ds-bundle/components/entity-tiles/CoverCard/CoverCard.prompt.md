CoverCard from simui-lovelace. Use via `window.SimUI.CoverCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<SimuiProvider>` (full provider chain in README.md — components read theme/i18n from that context). Keywords: cover, blind, shade, garage, awning, position, tile.

A blind / shade / garage / awning tile — a device-class icon, an open-percent line, drag to set
position, tap to open / close (or stop while moving).

```tsx
import { SimuiProvider, CoverCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <CoverCard config={{ type: 'simui-cover-card', entity: 'cover.living' }} />
</SimuiProvider>
```

Demo cover entities: `cover.living` (blind, 60% open), `cover.garage` (closed garage),
`cover.awning` (awning, 50%).

Key config: `entity` (required), `name`, `icon`, `tap_action`.

## Props

```ts
interface CoverCardProps {
config: { entity: string; name?: string; icon?: string; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}
```
