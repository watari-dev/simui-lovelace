---
category: Media & status
keywords: [chips, status, strip, pills, glanceable, header, row]
---

A wrapping row of compact status pills — icon + value, one per entity (lights on, temperature,
locks, presence…). A glanceable status strip for the top of a dashboard. Each chip is tinted by
its entity's state; tap a chip for more-info.

```tsx
import { SimuiProvider, ChipsCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <ChipsCard
    config={{
      type: 'simui-chips-card',
      entities: ['light.ceiling', 'sensor.temp', 'lock.front', 'binary_sensor.motion'],
    }}
  />
</SimuiProvider>
```

Mixes any entity domain. Demo ids: `light.ceiling`, `climate.living`, `sensor.temp`,
`sensor.humidity`, `cover.living`, `lock.front`, `media_player.living`, `binary_sensor.motion`.

Key config: `entities` (string[] of entity ids).
