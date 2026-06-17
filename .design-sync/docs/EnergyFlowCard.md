---
category: Data viz
keywords: [energy, power, flow, solar, grid, battery, powerwall, diagram]
---

A Powerwall-style power-flow diagram — Solar, Grid, and Battery on a cross around the Home hub,
each connected by a wire that colours and animates only when power crosses it. Sign conventions
follow Tesla's idiom: grid `>0` importing, `<0` exporting; battery `>0` discharging, `<0`
charging. Flip a reversed sensor with `grid_invert` / `battery_invert`.

```tsx
import { SimuiProvider, EnergyFlowCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <EnergyFlowCard
    config={{
      type: 'simui-energy-flow-card',
      solar: 'sensor.solar_power',
      grid: 'sensor.grid_power',
      battery: 'sensor.battery_power',
      battery_soc: 'sensor.battery_soc',
      home: 'sensor.home_power',
    }}
  />
</SimuiProvider>
```

The demo power sensors are a sunny-surplus scenario (solar exporting to grid + charging the
battery). Each node is optional — omit `solar`/`grid`/`battery` to drop that arm.

Key config: `solar`, `grid`, `battery`, `battery_soc`, `home` (entity ids), `grid_invert`,
`battery_invert`, `name`.
