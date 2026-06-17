import '../main';
import type { HassEntity, HomeAssistant, ServiceTarget } from '../core/types';

// Minimal mock HA for verifying the Luminous redesign in a clean canvas. Mirrors main-dev's
// service-mutates-then-re-pushes pattern, trimmed to the entities the redesign needs.

const states: Record<string, HassEntity> = {
  // lights
  'light.ceiling': { entity_id: 'light.ceiling', state: 'on', attributes: { friendly_name: 'Living Room Ceiling', brightness: 204, color_temp_kelvin: 2700, supported_color_modes: ['color_temp'] } },
  'light.office': { entity_id: 'light.office', state: 'on', attributes: { friendly_name: 'Office Strip', brightness: 150, rgb_color: [124, 96, 240], supported_color_modes: ['rgb'] } },
  'light.bed': { entity_id: 'light.bed', state: 'off', attributes: { friendly_name: 'Bed Light', supported_color_modes: ['brightness'] } },
  'light.porch': { entity_id: 'light.porch', state: 'on', attributes: { friendly_name: 'Porch Light', supported_color_modes: ['onoff'] } },
  // climate
  'climate.living': { entity_id: 'climate.living', state: 'heat', attributes: { friendly_name: 'Living Room', hvac_action: 'heating', hvac_modes: ['off', 'heat', 'cool', 'auto'], current_temperature: 21.5, temperature: 21, min_temp: 15, max_temp: 28, target_temp_step: 0.5 } },
  'climate.bedroom': { entity_id: 'climate.bedroom', state: 'cool', attributes: { friendly_name: 'Bedroom', hvac_action: 'cooling', hvac_modes: ['off', 'heat', 'cool', 'auto'], current_temperature: 24.5, temperature: 22, min_temp: 15, max_temp: 28, target_temp_step: 0.5 } },
  // covers
  'cover.living': { entity_id: 'cover.living', state: 'open', attributes: { friendly_name: 'Living Room Blinds', device_class: 'blind', current_position: 60, supported_features: 15 } },
  'cover.garage': { entity_id: 'cover.garage', state: 'closed', attributes: { friendly_name: 'Garage Door', device_class: 'garage', current_position: 0, supported_features: 11 } },
  // locks
  'lock.front': { entity_id: 'lock.front', state: 'locked', attributes: { friendly_name: 'Front Door' } },
  'lock.back': { entity_id: 'lock.back', state: 'unlocked', attributes: { friendly_name: 'Back Door' } },
  // sensors
  'sensor.temp': { entity_id: 'sensor.temp', state: '21.5', attributes: { friendly_name: 'Living Room Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },
  'sensor.humidity': { entity_id: 'sensor.humidity', state: '48', attributes: { friendly_name: 'Living Room Humidity', device_class: 'humidity', unit_of_measurement: '%' } },
  'sensor.power': { entity_id: 'sensor.power', state: '3100', attributes: { friendly_name: 'Home Power', device_class: 'power', unit_of_measurement: 'W' } },
  // media
  'media_player.living': { entity_id: 'media_player.living', state: 'playing', attributes: { friendly_name: 'Living Room', media_title: 'Midnight City', media_artist: 'M83 · Hurry Up, We’re Dreaming', media_position: 131, media_duration: 243, media_position_updated_at: new Date().toISOString(), supported_features: 16433 } },
  'media_player.kitchen': { entity_id: 'media_player.kitchen', state: 'paused', attributes: { friendly_name: 'Kitchen Display', media_title: 'The Daily', media_artist: 'The New York Times', supported_features: 16433 } },
  // energy
  'sensor.solar_power': { entity_id: 'sensor.solar_power', state: '3200', attributes: { friendly_name: 'Solar Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.grid_power': { entity_id: 'sensor.grid_power', state: '-850', attributes: { friendly_name: 'Grid Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery_power': { entity_id: 'sensor.battery_power', state: '-800', attributes: { friendly_name: 'Battery Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery_soc': { entity_id: 'sensor.battery_soc', state: '78', attributes: { friendly_name: 'Battery Charge', device_class: 'battery', unit_of_measurement: '%' } },
  'sensor.home_power': { entity_id: 'sensor.home_power', state: '1550', attributes: { friendly_name: 'Home Power', device_class: 'power', unit_of_measurement: 'W' } },
};

type CardEl = HTMLElement & { hass: HomeAssistant; setConfig: (c: unknown) => void };
const cards: CardEl[] = [];
const ids = (t?: ServiceTarget): string[] => (t?.entity_id == null ? [] : Array.isArray(t.entity_id) ? t.entity_id : [t.entity_id]);
const ACTION_FOR_MODE: Record<string, string> = { off: 'off', heat: 'heating', cool: 'cooling' };

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
    callService: (_d, service, data, target) => {
      for (const id of ids(target)) {
        const e = states[id];
        if (!e) continue;
        if (service === 'turn_off') states[id] = { ...e, state: 'off' };
        else if (service === 'turn_on') {
          const bp = data?.brightness_pct as number | undefined;
          const k = data?.color_temp_kelvin as number | undefined;
          states[id] = { ...e, state: 'on', attributes: { ...e.attributes, brightness: bp != null ? Math.round(bp * 2.55) : (e.attributes.brightness ?? 204), ...(k != null ? { color_temp_kelvin: k } : {}) } };
        } else if (service === 'toggle') states[id] = { ...e, state: e.state === 'on' ? 'off' : 'on' };
        else if (service === 'set_temperature') states[id] = { ...e, attributes: { ...e.attributes, ...(data ?? {}) } };
        else if (service === 'set_hvac_mode') { const m = (data?.hvac_mode as string) ?? 'off'; states[id] = { ...e, state: m, attributes: { ...e.attributes, hvac_action: ACTION_FOR_MODE[m] ?? 'idle' } }; }
        else if (service === 'lock' || service === 'unlock') states[id] = { ...e, state: service === 'lock' ? 'locked' : 'unlocked' };
        else if (service === 'open_cover' || service === 'close_cover') { const o = service === 'open_cover'; states[id] = { ...e, state: o ? 'open' : 'closed', attributes: { ...e.attributes, current_position: o ? 100 : 0 } }; }
        else if (service === 'stop_cover') states[id] = { ...e, state: ((e.attributes.current_position as number) ?? 0) > 0 ? 'open' : 'closed' };
        else if (service === 'set_cover_position') { const p = (data?.position as number) ?? 0; states[id] = { ...e, state: p === 0 ? 'closed' : 'open', attributes: { ...e.attributes, current_position: p } }; }
        else if (service === 'media_play_pause') states[id] = { ...e, state: e.state === 'playing' ? 'paused' : 'playing' };
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
app.style.cssText = 'max-width:1200px;margin:0 auto;padding:34px 40px 120px;color:#f5f5f7';

function heading(text: string): void {
  const h = document.createElement('div');
  h.textContent = text;
  h.style.cssText = 'font:600 12px Inter;letter-spacing:.14em;text-transform:uppercase;color:#5e6069;margin:30px 0 14px';
  app.appendChild(h);
}
function grid(min: number): HTMLDivElement {
  const g = document.createElement('div');
  g.style.cssText = `display:grid;grid-template-columns:repeat(auto-fill,${min}px);gap:14px;align-items:start`;
  app.appendChild(g);
  return g;
}
function mount(parent: HTMLElement, tag: string, config: Record<string, unknown>): void {
  const el = document.createElement(tag) as CardEl;
  el.setConfig({ type: tag, ...config });
  parent.appendChild(el);
  cards.push(el);
}

// ── Entity tiles (comfortable) ────────────────────────────────────────────────
heading('Entity tiles · comfortable');
{
  const g = grid(268);
  mount(g, 'simui-light-card', { entity: 'light.ceiling' });
  mount(g, 'simui-light-card', { entity: 'light.office' });
  mount(g, 'simui-climate-card', { entity: 'climate.living' });
  mount(g, 'simui-cover-card', { entity: 'cover.living' });
  mount(g, 'simui-lock-card', { entity: 'lock.front' });
  mount(g, 'simui-sensor-card', { entity: 'sensor.temp' });
}

// ── Compact ───────────────────────────────────────────────────────────────────
heading('Entity tiles · compact');
{
  const g = grid(200);
  mount(g, 'simui-light-card', { entity: 'light.ceiling', compact: true });
  mount(g, 'simui-climate-card', { entity: 'climate.living', compact: true });
  mount(g, 'simui-cover-card', { entity: 'cover.living', compact: true });
  mount(g, 'simui-lock-card', { entity: 'lock.front', compact: true });
  mount(g, 'simui-sensor-card', { entity: 'sensor.temp', compact: true });
}

// ── Status strip + wide cards ─────────────────────────────────────────────────
heading('Status strip');
{
  const g = grid(700);
  mount(g, 'simui-chips-card', { entities: ['light.ceiling', 'sensor.temp', 'sensor.humidity', 'lock.front', 'cover.living'] });
}
heading('Media · graph · energy');
{
  const g = document.createElement('div');
  g.style.cssText = 'display:flex;flex-wrap:wrap;gap:14px;align-items:start';
  app.appendChild(g);
  const w = (tag: string, config: Record<string, unknown>, width: number, height: number) => {
    const box = document.createElement('div');
    box.style.cssText = `width:${width}px;height:${height}px`;
    g.appendChild(box);
    mount(box, tag, config);
  };
  w('simui-media-card', { entity: 'media_player.living' }, 392, 172);
  w('simui-graph-card', { entity: 'sensor.power', name: 'Home Power' }, 556, 300);
  w('simui-energy-flow-card', { solar: 'sensor.solar_power', grid: 'sensor.grid_power', battery: 'sensor.battery_power', battery_soc: 'sensor.battery_soc', home: 'sensor.home_power' }, 516, 300);
}

pushHass();
