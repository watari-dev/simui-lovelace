MediaCard from simui-lovelace. Use via `window.SimUI.MediaCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<SimuiProvider>` (full provider chain in README.md — components read theme/i18n from that context). Keywords: media, player, music, album art, transport, play, pause, tile.

A media-player tile — album art (or a music disc), title and artist, and transport controls
(prev / play-pause / next) gated by the player's features. Tap the body for more-info.

```tsx
import { SimuiProvider, MediaCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <MediaCard config={{ type: 'simui-media-card', entity: 'media_player.living' }} />
</SimuiProvider>
```

Demo media entities: `media_player.living` (playing), `media_player.kitchen` (paused),
`media_player.bedroom` (off).

Key config: `entity` (required), `name`, `icon`, `tap_action`.

## Props

```ts
interface MediaCardProps {
config: { entity: string; name?: string; icon?: string; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}
```
