# SimUI Cards

A set of **minimalist, Apple-Home-inspired custom Lovelace cards** for Home Assistant —
the beautiful tiles from [simUI](https://github.com/watari-dev/ha-simui), repackaged to
drop into a normal Lovelace dashboard (like Mushroom or Bubble Card) instead of taking
over the whole UI. Lovelace owns the dashboard; SimUI owns the cards.

The look is grounded in [UI-Lovelace-Minimalist](https://github.com/UI-Lovelace-Minimalist/UI):
soft pastel state colours, `#1d1d1d` cards floating on a soft shadow, 20px corners, a
barely-there active tint on a round icon disc.

## Cards

| Card | `type` | What it does |
|------|--------|--------------|
| Light | `custom:simui-light-card` | Tap the disc to toggle, drag anywhere to set brightness, tap the body for more-info. Tints with the bulb's own colour; on/off-only lights just toggle. |
| Climate | `custom:simui-climate-card` | Drag the tile to set the target temperature, tap the disc to toggle on/off. Icon + tint follow the HVAC action (heating → red, cooling → blue). Shows `current → target`. |
| Sensor | `custom:simui-sensor-card` | The value, big, with a device-class icon + accent (temperature, humidity, power, pressure, battery, air quality…). Tap for more-info. |

_(More cards — media, cover, lock, chart, status chips, energy flow — are on the way.)_

## Install (HACS)

1. HACS → ⋮ → **Custom repositories** → add this repo as a **Dashboard** (Lovelace) plugin.
2. Install **SimUI Cards**; HACS registers the JS resource for you.
3. Hard-refresh the browser.

## Use

Add it from the dashboard's **+ card** picker and configure it in the **visual editor**
(pick a light, set a name, toggle colour tinting) — no YAML needed. Or in YAML:

```yaml
type: custom:simui-light-card
entity: light.living_room_ceiling
name: Ceiling            # optional — defaults to the light's name
use_light_color: true    # optional — tile takes the bulb's colour (default); false ⇒ warm yellow
```

```yaml
type: custom:simui-climate-card
entity: climate.living_room
name: Living Room        # optional
```

```yaml
type: custom:simui-sensor-card
entity: sensor.living_room_temperature
name: Temperature        # optional
color: warm              # optional — warm | cool | up | down | grey (default: from device class)
```

## Develop

```bash
npm install
npm run dev      # mock-hass harness at http://localhost:5174
npm run build    # → dist/simui-lovelace.js
```

The cards are React rendered inside a shadow-DOM custom element; they read the live
`hass` object HA injects and open HA's own more-info dialog for details.
