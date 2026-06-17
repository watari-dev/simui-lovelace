SensorCard from simui-lovelace. Use via `window.SimUI.SensorCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<SimuiProvider>` (full provider chain in README.md — components read theme/i18n from that context). Keywords: sensor, value, temperature, humidity, power, battery, air quality, tile.

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

## Props

```ts
interface SensorCardProps {
config: { entity: string; name?: string; icon?: string; color?: "warm" | "cool" | "up" | "down" | "grey"; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}
```
