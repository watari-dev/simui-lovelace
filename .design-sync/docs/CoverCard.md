---
category: Entity tiles
keywords: [cover, blind, shade, garage, awning, position, tile]
---

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
