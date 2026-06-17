ClimateCard from simui-lovelace. Use via `window.SimUI.ClimateCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<SimuiProvider>` (full provider chain in README.md — components read theme/i18n from that context). Keywords: climate, thermostat, hvac, heating, cooling, temperature, tile.

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

## Props

```ts
interface ClimateCardProps {
config: { entity: string; name?: string; icon?: string; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}
```
