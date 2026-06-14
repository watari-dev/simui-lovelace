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
| Light | `custom:simui-light-card` | Tap the disc to toggle, drag anywhere to set brightness, tap the body for more-info. |

_(More cards — climate, media, cover, lock, sensor/chart, status chips, energy flow —
are on the way.)_

## Install (HACS)

1. HACS → ⋮ → **Custom repositories** → add this repo as a **Dashboard** (Lovelace) plugin.
2. Install **SimUI Cards**; HACS registers the JS resource for you.
3. Hard-refresh the browser.

## Use

```yaml
type: custom:simui-light-card
entity: light.living_room_ceiling
name: Ceiling        # optional
```

## Develop

```bash
npm install
npm run dev      # mock-hass harness at http://localhost:5174
npm run build    # → dist/simui-lovelace.js
```

The cards are React rendered inside a shadow-DOM custom element; they read the live
`hass` object HA injects and open HA's own more-info dialog for details.
