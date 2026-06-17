---
category: Entity tiles
keywords: [light, bulb, brightness, toggle, dimmer, tile]
---

A light as a UI-Lovelace-Minimalist entity tile: a round icon disc on the left carries the
colour (the bulb's own RGB, or a calm warm yellow), with the name and a dim state line stacked
to its right. Tap the disc to toggle; drag the tile to set brightness. On/off-only lights just
toggle. Unavailable and "off" states are handled gracefully.

```tsx
import { SimuiProvider, LightCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <LightCard config={{ type: 'simui-light-card', entity: 'light.office' }} />
</SimuiProvider>
```

Demo light entities: `light.ceiling` (brightness), `light.office` / `light.lamp` (RGB tint),
`light.bed` (off), `light.garage` (unavailable).

Key config: `entity` (required), `name`, `use_light_color` (tint with the bulb's own colour,
default `true`; `false` ⇒ warm yellow), `icon` (an `mdi:…` override), `tap_action`.
