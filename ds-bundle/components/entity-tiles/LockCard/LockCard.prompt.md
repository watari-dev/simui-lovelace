LockCard from simui-lovelace. Use via `window.SimUI.LockCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<SimuiProvider>` (full provider chain in README.md — components read theme/i18n from that context). Keywords: lock, locked, unlocked, jammed, security, tile.

A lock tile tinted by state — green locked, amber unlocked, coral jammed. Tap the disc to lock /
unlock.

```tsx
import { SimuiProvider, LockCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <LockCard config={{ type: 'simui-lock-card', entity: 'lock.front' }} />
</SimuiProvider>
```

Demo lock entities: `lock.front` (locked), `lock.back` (unlocked), `lock.side` (jammed).

Key config: `entity` (required), `name`, `icon`, `tap_action`.

## Props

```ts
interface LockCardProps {
config: { entity: string; name?: string; icon?: string; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}
```
