---
category: Entity tiles
keywords: [lock, locked, unlocked, jammed, security, tile]
---

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
