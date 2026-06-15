---
category: Entity tiles
keywords: [climate, thermostat, hvac, heating, cooling, temperature, tile]
---

A thermostat tile tinted by HVAC action — warm orange when heating, blue when cooling, green
while idling in a heat/cool mode. Shows `current → target`, or a dual-setpoint range. Drag the
tile to set the target; tap the disc to toggle on/off.

```tsx
import { SimuiProvider, ClimateCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <ClimateCard config={{ type: 'simui-climate-card', entity: 'climate.living' }} />
</SimuiProvider>
```

Demo climate entities: `climate.living` (heating), `climate.bedroom` (cooling), `climate.guest`
(dual setpoint), `climate.hall` (off).

Key config: `entity` (required), `name`, `icon`, `tap_action`.
