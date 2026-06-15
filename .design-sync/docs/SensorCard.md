---
category: Entity tiles
keywords: [sensor, value, temperature, humidity, power, battery, air quality, tile]
---

A value, big, with a device-class icon and accent — temperature, humidity, power, battery, air
quality, and more. Tabular figures; the friendly name sits below in the dim state line. A
read-only tile (tap opens more-info).

```tsx
import { SimuiProvider, SensorCard } from 'simui-lovelace'; // window.SimUI.*

<SimuiProvider>
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.temp' }} />
</SimuiProvider>
```

Demo sensor entities: `sensor.temp`, `sensor.humidity`, `sensor.power`, `sensor.battery`,
`sensor.co2`, `binary_sensor.motion`, `sensor.outdoor` (unavailable).

Key config: `entity` (required), `name`, `color` (`warm` | `cool` | `up` | `down` | `grey` —
overrides the automatic device-class accent), `icon`, `tap_action`.
