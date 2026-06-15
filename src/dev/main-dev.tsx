import '../main';
import type { HassEntity, HomeAssistant, ServiceTarget } from '../core/types';

// A tiny mock Home Assistant so the cards can be developed + screenshotted with no
// running HA: callService mutates the in-memory states and re-pushes `hass` to every
// mounted card (exactly how real HA pushes updates).
type CardEl = HTMLElement & { hass: HomeAssistant; setConfig: (config: unknown) => void };

const states: Record<string, HassEntity> = {
  // lights
  'light.ceiling': { entity_id: 'light.ceiling', state: 'on', attributes: { friendly_name: 'Living Room Ceiling', brightness: 204, supported_color_modes: ['brightness'] } },
  'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen Lights', brightness: 181, color_temp_kelvin: 2700, supported_color_modes: ['color_temp'] } },
  'light.office': { entity_id: 'light.office', state: 'on', attributes: { friendly_name: 'Office RGBW Lights', brightness: 150, rgb_color: [124, 96, 240], supported_color_modes: ['rgb'] } },
  'light.lamp': { entity_id: 'light.lamp', state: 'on', attributes: { friendly_name: 'Desk Lamp', brightness: 120, rgb_color: [240, 138, 96], supported_color_modes: ['rgbw'] } },
  'light.bed': { entity_id: 'light.bed', state: 'off', attributes: { friendly_name: 'Bed Light', supported_color_modes: ['brightness'] } },
  'light.porch': { entity_id: 'light.porch', state: 'on', attributes: { friendly_name: 'Porch Light', supported_color_modes: ['onoff'] } },
  'light.garage': { entity_id: 'light.garage', state: 'unavailable', attributes: { friendly_name: 'Garage Strip' } },

  // climate
  'climate.living': { entity_id: 'climate.living', state: 'heat', attributes: { friendly_name: 'Living Room', hvac_action: 'heating', hvac_modes: ['off', 'heat', 'cool', 'auto'], current_temperature: 19.5, temperature: 21, min_temp: 7, max_temp: 30, target_temp_step: 0.5 } },
  'climate.bedroom': { entity_id: 'climate.bedroom', state: 'cool', attributes: { friendly_name: 'Bedroom', hvac_action: 'cooling', hvac_modes: ['off', 'heat', 'cool', 'auto'], current_temperature: 24.5, temperature: 22, min_temp: 16, max_temp: 32, target_temp_step: 0.5 } },
  'climate.study': { entity_id: 'climate.study', state: 'auto', attributes: { friendly_name: 'Study', hvac_action: 'idle', hvac_modes: ['off', 'heat', 'cool', 'auto'], current_temperature: 21, temperature: 21, min_temp: 7, max_temp: 30, target_temp_step: 0.5 } },
  'climate.guest': { entity_id: 'climate.guest', state: 'heat_cool', attributes: { friendly_name: 'Guest Suite', hvac_action: 'idle', hvac_modes: ['off', 'heat_cool', 'auto'], current_temperature: 21.5, target_temp_low: 19, target_temp_high: 24, min_temp: 7, max_temp: 30, target_temp_step: 0.5 } },
  'climate.hall': { entity_id: 'climate.hall', state: 'off', attributes: { friendly_name: 'Hallway', hvac_action: 'off', hvac_modes: ['off', 'heat'], current_temperature: 20 } },
  'climate.ducted': { entity_id: 'climate.ducted', state: 'off', attributes: { friendly_name: 'Ducted AC', hvac_action: 'off', hvac_modes: ['off', 'fan_only', 'heat_cool'], current_temperature: 22, min_temp: 16, max_temp: 30 } },

  // sensors
  'sensor.glitch': { entity_id: 'sensor.glitch', state: 'none', attributes: { friendly_name: 'Flaky Probe', device_class: 'temperature', unit_of_measurement: '°C' } },
  'binary_sensor.door': { entity_id: 'binary_sensor.door', state: 'off', attributes: { friendly_name: 'Front Door', device_class: 'door' } },
  'binary_sensor.motion': { entity_id: 'binary_sensor.motion', state: 'on', attributes: { friendly_name: 'Hallway Motion', device_class: 'motion' } },
  'sensor.temp': { entity_id: 'sensor.temp', state: '21.5', attributes: { friendly_name: 'Living Room Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },
  'sensor.humidity': { entity_id: 'sensor.humidity', state: '54', attributes: { friendly_name: 'Living Room Humidity', device_class: 'humidity', unit_of_measurement: '%' } },
  'sensor.power': { entity_id: 'sensor.power', state: '342', attributes: { friendly_name: 'Fridge Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.pressure': { entity_id: 'sensor.pressure', state: '1013', attributes: { friendly_name: 'Pressure', device_class: 'pressure', unit_of_measurement: 'hPa' } },
  'sensor.battery': { entity_id: 'sensor.battery', state: '87', attributes: { friendly_name: 'Front Door Battery', device_class: 'battery', unit_of_measurement: '%' } },
  'sensor.co2': { entity_id: 'sensor.co2', state: '612', attributes: { friendly_name: 'CO₂', device_class: 'carbon_dioxide', unit_of_measurement: 'ppm' } },
  'sensor.outdoor': { entity_id: 'sensor.outdoor', state: 'unavailable', attributes: { friendly_name: 'Outdoor Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },
};

const cards: CardEl[] = [];

function ids(target?: ServiceTarget): string[] {
  const t = target?.entity_id;
  return t == null ? [] : Array.isArray(t) ? t : [t];
}

const ACTION_FOR_MODE: Record<string, string> = { off: 'off', heat: 'heating', cool: 'cooling' };

// Deterministic synthetic history (a smooth wave around the entity's current value) so the
// graph card renders with no recorder. Same (id, t) → same value, so refetches don't jump.
function synthHistory(id: string, start: number, end: number): Array<{ s: string; lu: number }> {
  const base = Number(states[id]?.state) || 20;
  const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const n = 160;
  const out: Array<{ s: string; lu: number }> = [];
  for (let i = 0; i < n; i++) {
    const t = start + ((end - start) * i) / (n - 1);
    const h = t / 3_600_000;
    const amp = Math.max(1, Math.abs(base) * 0.12);
    const v = base + Math.sin(h * 0.5 + seed) * amp + Math.sin(h * 2.7 + seed * 1.3) * amp * 0.4;
    out.push({ s: (Math.round(v * 10) / 10).toString(), lu: t / 1000 });
  }
  return out;
}

function makeHass(): HomeAssistant {
  return {
    states: { ...states },
    callWS: async (msg) => {
      if (msg.type === 'history/history_during_period') {
        const start = Date.parse(msg.start_time as string);
        const end = Date.parse(msg.end_time as string);
        const out: Record<string, unknown> = {};
        for (const id of (msg.entity_ids as string[]) ?? []) out[id] = synthHistory(id, start, end);
        return out as never;
      }
      return {} as never;
    },
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
        } else if (service === 'set_temperature') {
          states[id] = { ...e, attributes: { ...e.attributes, ...(data ?? {}) } };
        } else if (service === 'set_hvac_mode') {
          const mode = (data?.hvac_mode as string) ?? 'off';
          states[id] = { ...e, state: mode, attributes: { ...e.attributes, hvac_action: ACTION_FOR_MODE[mode] ?? 'idle' } };
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
  'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;padding:28px;max-width:900px;margin:0 auto;color-scheme:dark;';

// tag → which entities it renders, plus a trailing unconfigured placeholder.
const layout: Array<[tag: string, entity: string]> = [
  ['simui-graph-card', 'sensor.temp'],
  ['simui-graph-card', 'sensor.power'],
  ['simui-graph-card', ''],
  ...Object.keys(states).filter((id) => id.startsWith('light.')).map((id) => ['simui-light-card', id] as [string, string]),
  ['simui-light-card', ''],
  ...Object.keys(states).filter((id) => id.startsWith('climate.')).map((id) => ['simui-climate-card', id] as [string, string]),
  ['simui-climate-card', ''],
  ...Object.keys(states).filter((id) => id.startsWith('sensor.') || id.startsWith('binary_sensor.')).map((id) => ['simui-sensor-card', id] as [string, string]),
  ['simui-sensor-card', ''],
];

for (const [tag, entity] of layout) {
  const el = document.createElement(tag) as CardEl;
  el.setConfig({ type: tag, entity });
  app.appendChild(el);
  cards.push(el);
}
pushHass();
