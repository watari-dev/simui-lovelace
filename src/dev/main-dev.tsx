import '../main';
import type { HassEntity, HomeAssistant, ServiceTarget } from '../core/types';

// A tiny mock Home Assistant so the cards can be developed + screenshotted with no
// running HA: callService mutates the in-memory states and re-pushes `hass` to every
// mounted card (exactly how real HA pushes updates).
type CardEl = HTMLElement & { hass: HomeAssistant; setConfig: (config: unknown) => void };

const states: Record<string, HassEntity> = {
  'light.ceiling': { entity_id: 'light.ceiling', state: 'on', attributes: { friendly_name: 'Living Room Ceiling', brightness: 204 } },
  'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen Lights', brightness: 181 } },
  'light.office': { entity_id: 'light.office', state: 'on', attributes: { friendly_name: 'Office RGBW Lights', brightness: 150 } },
  'light.bed': { entity_id: 'light.bed', state: 'off', attributes: { friendly_name: 'Bed Light' } },
  'light.garage': { entity_id: 'light.garage', state: 'unavailable', attributes: { friendly_name: 'Garage Strip' } },
};

const cards: CardEl[] = [];

function ids(target?: ServiceTarget): string[] {
  const t = target?.entity_id;
  return t == null ? [] : Array.isArray(t) ? t : [t];
}

function makeHass(): HomeAssistant {
  return {
    states: { ...states },
    callService: (_domain, service, data, target) => {
      for (const id of ids(target)) {
        const e = states[id];
        if (!e) continue;
        if (service === 'turn_off') {
          states[id] = { ...e, state: 'off' };
        } else if (service === 'turn_on') {
          const bp = data?.brightness_pct as number | undefined;
          states[id] = {
            ...e,
            state: 'on',
            attributes: { ...e.attributes, brightness: bp != null ? Math.round(bp * 2.55) : (e.attributes.brightness ?? 204) },
          };
        } else if (service === 'toggle') {
          states[id] = { ...e, state: e.state === 'on' ? 'off' : 'on' };
        }
      }
      pushHass();
    },
  };
}

function pushHass(): void {
  const hass = makeHass();
  for (const c of cards) c.hass = hass;
}

const app = document.getElementById('app')!;
app.style.cssText =
  'display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;padding:28px;max-width:980px;margin:0 auto;color-scheme:dark;';

for (const id of Object.keys(states)) {
  const el = document.createElement('simui-light-card') as CardEl;
  el.setConfig({ type: 'simui-light-card', entity: id });
  app.appendChild(el);
  cards.push(el);
}
pushHass();
