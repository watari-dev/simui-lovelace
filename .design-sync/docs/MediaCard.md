---
category: Media & status
keywords: [media, player, music, album art, transport, play, pause, tile]
---

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
