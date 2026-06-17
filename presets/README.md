# SimUI Presets

Drop-in pages for a **Sections** dashboard, composed from SimUI cards. Each is a complete
`type: sections` view with placeholder entity ids and inline comments telling you what to
swap.

| Preset | What's on it |
|--------|--------------|
| [`living-room.yaml`](living-room.yaml) | Lights + thermostat side-by-side, blinds, a full-width media tile, and a status chips strip. |
| [`energy-power.yaml`](energy-power.yaml) | A Powerwall flow diagram, two power gauges, and a 24 h consumption graph. |
| [`security.yaml`](security.yaml) | An alarm panel with one-tap arm/disarm, every lock, motion/contact sensors as chips, and camera tiles. |
| [`climate-sensors.yaml`](climate-sensors.yaml) | A thermostat hero, comfort gauges (temp / humidity / CO₂), a temp+humidity graph, and dense sensor tiles. |
| [`bedroom-minimal.yaml`](bedroom-minimal.yaml) | The minimal per-room template: one light, one climate tile, a fan, and a two-chip strip. |

## How to use

1. Make sure **SimUI Cards** is installed (see the [main README](../README.md)).
2. Open a dashboard → **⋮ → Edit dashboard**.
3. Either:
   - **New view**: add a view, switch it to **Sections** layout, then **⋮ → Edit in YAML**
     and paste the preset's `sections:` block (and the `title` / `path` / `icon` if you
     want them); or
   - **Cherry-pick**: copy individual `- type: custom:simui-…` card blocks into any
     existing view.
4. **Swap the placeholder entity ids** for your own (every one is commented).
5. Click any card to fine-tune it in the visual editor — no YAML needed after this.

> These are templates for *anyone* — they don't assume a particular home. A card whose
> entity doesn't exist shows a friendly placeholder, so nothing breaks while you wire them up.
