import '../main';
import type { HassEntity, HomeAssistant, ServiceTarget } from '../core/types';

/* A standalone harness to verify every card's VISUAL EDITOR (ha-form) end-to-end without a
 * running Home Assistant: a minimal `ha-form` mock renders the schema, and a live card
 * preview re-renders as you change fields — proving each option is editable (no YAML). */

// ── Minimal ha-form mock (schema → labelled inputs → value-changed) ────────────
interface SchemaItem { name: string; required?: boolean; selector?: Record<string, unknown> }
class MockHaForm extends HTMLElement {
  private _schema: SchemaItem[] = [];
  private _data: Record<string, unknown> = {};
  private _hass?: HomeAssistant;
  computeLabel?: (s: { name: string }) => string;
  computeHelper?: (s: { name: string }) => string | undefined;
  set schema(s: SchemaItem[]) { this._schema = s; this.render(); }
  set data(d: Record<string, unknown>) { this._data = d ?? {}; this.render(); }
  set hass(h: HomeAssistant) { this._hass = h; }

  private emit(name: string, v: unknown) {
    this._data = { ...this._data, [name]: v };
    if (v === undefined || v === '') delete this._data[name];
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this._data }, bubbles: true, composed: true }));
  }
  private field(item: SchemaItem): HTMLElement {
    const sel = item.selector ?? {};
    const key = Object.keys(sel)[0] ?? 'text';
    const cfg = (sel as Record<string, Record<string, unknown>>)[key] ?? {};
    const val = this._data[item.name];
    let el: HTMLInputElement | HTMLSelectElement;
    if (key === 'boolean') {
      el = document.createElement('input'); el.type = 'checkbox'; (el as HTMLInputElement).checked = !!val; el.style.alignSelf = 'flex-start';
      el.onchange = () => this.emit(item.name, (el as HTMLInputElement).checked);
    } else if (key === 'select') {
      el = document.createElement('select');
      for (const o of (cfg.options as { value: string; label: string }[]) ?? []) { const opt = document.createElement('option'); opt.value = o.value; opt.textContent = o.label; el.appendChild(opt); }
      el.value = (val as string) ?? ''; el.onchange = () => this.emit(item.name, el.value || undefined);
    } else if (key === 'number') {
      el = document.createElement('input'); el.type = 'number';
      if (cfg.min != null) (el as HTMLInputElement).min = String(cfg.min);
      if (cfg.max != null) (el as HTMLInputElement).max = String(cfg.max);
      if (cfg.step != null) (el as HTMLInputElement).step = String(cfg.step);
      el.value = val != null ? String(val) : ''; el.onchange = () => this.emit(item.name, el.value === '' ? undefined : Number(el.value));
    } else if (key === 'entity' && cfg.multiple) {
      el = document.createElement('input'); (el as HTMLInputElement).placeholder = 'comma-separated entity ids';
      el.value = Array.isArray(val) ? (val as string[]).join(', ') : ''; el.onchange = () => this.emit(item.name, el.value.split(',').map((s) => s.trim()).filter(Boolean));
    } else if (key === 'entity') {
      el = document.createElement('select');
      const blank = document.createElement('option'); blank.value = ''; blank.textContent = '—'; el.appendChild(blank);
      const dom = cfg.domain; const doms = Array.isArray(dom) ? (dom as string[]) : dom ? [dom as string] : null;
      for (const id of Object.keys(this._hass?.states ?? {})) { if (doms && !doms.some((d) => id.startsWith(d + '.'))) continue; const o = document.createElement('option'); o.value = id; o.textContent = id; el.appendChild(o); }
      el.value = (val as string) ?? ''; el.onchange = () => this.emit(item.name, el.value || undefined);
    } else if (key === 'ui_action') {
      el = document.createElement('select');
      for (const a of ['(default)', 'more-info', 'toggle', 'navigate', 'none']) { const o = document.createElement('option'); o.value = a === '(default)' ? '' : a; o.textContent = a; el.appendChild(o); }
      el.value = (val as { action?: string } | undefined)?.action ?? ''; el.onchange = () => this.emit(item.name, el.value ? { action: el.value } : undefined);
    } else {
      el = document.createElement('input'); el.type = 'text'; el.value = (val as string) ?? ''; (el as HTMLInputElement).placeholder = key; el.onchange = () => this.emit(item.name, el.value || undefined);
    }
    el.style.cssText += ';padding:6px 8px;border-radius:7px;border:1px solid #34343c;background:#0e0e11;color:#f5f5f7;font:12px Inter,sans-serif;max-width:240px';
    return el;
  }
  render() {
    this.innerHTML = '';
    this.style.cssText = 'display:flex;flex-direction:column;gap:9px';
    for (const item of this._schema) {
      const wrap = document.createElement('label'); wrap.style.cssText = 'display:flex;flex-direction:column;gap:3px';
      const lbl = document.createElement('span'); lbl.textContent = (this.computeLabel ? this.computeLabel(item) : item.name) + (item.required ? ' *' : '');
      lbl.style.cssText = 'font:600 11.5px Inter;color:#c8c8d0';
      wrap.appendChild(lbl); wrap.appendChild(this.field(item));
      const help = this.computeHelper?.(item);
      if (help) { const h = document.createElement('span'); h.textContent = help; h.style.cssText = 'opacity:.5;font:11px Inter;max-width:240px'; wrap.appendChild(h); }
      this.appendChild(wrap);
    }
  }
}
if (!customElements.get('ha-form')) customElements.define('ha-form', MockHaForm);
if (!customElements.get('ha-icon')) customElements.define('ha-icon', class extends HTMLElement { connectedCallback() { this.textContent = '▣'; this.style.cssText = 'display:inline-grid;place-items:center;font-size:17px'; } });

// ── Mock hass ──────────────────────────────────────────────────────────────────
const states: Record<string, HassEntity> = {
  'light.ceiling': { entity_id: 'light.ceiling', state: 'on', attributes: { friendly_name: 'Ceiling', brightness: 204, color_temp_kelvin: 2700, supported_color_modes: ['color_temp'] } },
  'light.lamp': { entity_id: 'light.lamp', state: 'on', attributes: { friendly_name: 'Lamp', brightness: 120, rgb_color: [124, 96, 240], supported_color_modes: ['rgb'] } },
  'climate.living': { entity_id: 'climate.living', state: 'heat', attributes: { friendly_name: 'Living Room', hvac_action: 'heating', hvac_modes: ['off', 'heat', 'cool', 'auto'], current_temperature: 21.5, temperature: 21, min_temp: 15, max_temp: 28, target_temp_step: 0.5 } },
  'cover.living': { entity_id: 'cover.living', state: 'open', attributes: { friendly_name: 'Blinds', device_class: 'blind', current_position: 60, supported_features: 15 } },
  'lock.front': { entity_id: 'lock.front', state: 'locked', attributes: { friendly_name: 'Front Door' } },
  'sensor.temp': { entity_id: 'sensor.temp', state: '21.5', attributes: { friendly_name: 'Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },
  'sensor.humidity': { entity_id: 'sensor.humidity', state: '48', attributes: { friendly_name: 'Humidity', device_class: 'humidity', unit_of_measurement: '%' } },
  'sensor.power': { entity_id: 'sensor.power', state: '3100', attributes: { friendly_name: 'Home Power', device_class: 'power', unit_of_measurement: 'W' } },
  'media_player.living': { entity_id: 'media_player.living', state: 'playing', attributes: { friendly_name: 'Living Room', media_title: 'Midnight City', media_artist: 'M83', media_position: 131, media_duration: 243, media_position_updated_at: new Date().toISOString(), supported_features: 16433 } },
  'sensor.solar_power': { entity_id: 'sensor.solar_power', state: '3200', attributes: { friendly_name: 'Solar', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.grid_power': { entity_id: 'sensor.grid_power', state: '-850', attributes: { friendly_name: 'Grid', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery_power': { entity_id: 'sensor.battery_power', state: '-800', attributes: { friendly_name: 'Battery', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery_soc': { entity_id: 'sensor.battery_soc', state: '78', attributes: { friendly_name: 'Battery SOC', device_class: 'battery', unit_of_measurement: '%' } },
  'sensor.home_power': { entity_id: 'sensor.home_power', state: '1550', attributes: { friendly_name: 'Home', device_class: 'power', unit_of_measurement: 'W' } },
};
const ids = (t?: ServiceTarget): string[] => (t?.entity_id == null ? [] : Array.isArray(t.entity_id) ? t.entity_id : [t.entity_id]);
const allCards: (HTMLElement & { hass: HomeAssistant })[] = [];
function makeHass(): HomeAssistant {
  return {
    states: { ...states },
    callWS: async (msg) => {
      if (msg.type === 'history/history_during_period') {
        const out: Record<string, unknown> = {};
        const start = Date.parse(msg.start_time as string), end = Date.parse(msg.end_time as string);
        for (const id of (msg.entity_ids as string[]) ?? []) { const base = Number(states[id]?.state) || 20, seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0); const arr = []; for (let i = 0; i < 80; i++) { const t = start + ((end - start) * i) / 79, h = t / 3.6e6; arr.push({ s: (base + Math.sin(h * 0.5 + seed) * Math.max(1, Math.abs(base) * 0.12)).toFixed(1), lu: t / 1000 }); } out[id] = arr; }
        return out as never;
      }
      return {} as never;
    },
    callService: (_d, service, data, target) => {
      for (const id of ids(target)) { const e = states[id]; if (!e) continue; if (service === 'turn_off') states[id] = { ...e, state: 'off' }; else if (service === 'turn_on') states[id] = { ...e, state: 'on', attributes: { ...e.attributes, brightness: (data?.brightness_pct as number) != null ? Math.round((data!.brightness_pct as number) * 2.55) : e.attributes.brightness } }; else if (service === 'lock' || service === 'unlock') states[id] = { ...e, state: service === 'lock' ? 'locked' : 'unlocked' }; }
      const h = makeHass(); for (const c of allCards) c.hass = h;
    },
  };
}

const PREVIEW: { tag: string; config: Record<string, unknown>; w: number }[] = [
  { tag: 'simui-light-card', config: { entity: 'light.ceiling' }, w: 280 },
  { tag: 'simui-climate-card', config: { entity: 'climate.living' }, w: 280 },
  { tag: 'simui-cover-card', config: { entity: 'cover.living' }, w: 280 },
  { tag: 'simui-lock-card', config: { entity: 'lock.front' }, w: 280 },
  { tag: 'simui-sensor-card', config: { entity: 'sensor.temp' }, w: 280 },
  { tag: 'simui-graph-card', config: { entity: 'sensor.power', name: 'Home Power' }, w: 460 },
  { tag: 'simui-media-card', config: { entity: 'media_player.living' }, w: 400 },
  { tag: 'simui-chips-card', config: { entities: ['light.ceiling', 'sensor.temp', 'lock.front'] }, w: 460 },
  { tag: 'simui-energy-flow-card', config: { solar: 'sensor.solar_power', grid: 'sensor.grid_power', battery: 'sensor.battery_power', battery_soc: 'sensor.battery_soc', home: 'sensor.home_power' }, w: 460 },
];

const app = document.getElementById('app')!;
app.style.cssText = 'max-width:1180px;margin:0 auto;padding:30px 36px 120px;color:#f5f5f7';
const h1 = document.createElement('h1'); h1.textContent = 'SimUI — visual-editor harness'; h1.style.cssText = 'font:700 18px Inter;margin:0 0 4px';
const note = document.createElement('p'); note.textContent = 'Each card’s real ha-form editor (mocked) on the left; the live preview updates as you edit — proving every option is editable without YAML.'; note.style.cssText = 'color:#9698a2;font:13px Inter;margin:0 0 24px;max-width:60ch';
app.append(h1, note);

const hass = makeHass();
for (const { tag, config, w } of PREVIEW) {
  const row = document.createElement('section'); row.style.cssText = 'display:grid;grid-template-columns:300px 1fr;gap:30px;align-items:start;padding:18px 0;border-top:1px solid #26262c';
  const title = document.createElement('div'); title.textContent = tag; title.style.cssText = 'grid-column:1/-1;font:600 12px Inter;letter-spacing:.06em;color:#5e6069;text-transform:uppercase';
  const editorBox = document.createElement('div');
  const previewBox = document.createElement('div'); previewBox.style.cssText = `width:${w}px`;

  const editorTag = tag + '-editor';
  const editor = document.createElement(editorTag) as HTMLElement & { setConfig: (c: unknown) => void; hass: HomeAssistant };
  editor.setConfig({ type: tag, ...config });
  editor.hass = hass;
  editorBox.appendChild(editor);

  const preview = document.createElement(tag) as HTMLElement & { setConfig: (c: unknown) => void; hass: HomeAssistant };
  preview.setConfig({ type: tag, ...config });
  preview.hass = hass;
  previewBox.appendChild(preview);
  allCards.push(preview);

  editor.addEventListener('config-changed', (ev: Event) => {
    const cfg = (ev as CustomEvent<{ config: Record<string, unknown> }>).detail.config;
    preview.setConfig({ type: tag, ...cfg });
    preview.hass = makeHass();
  });

  row.append(title, editorBox, previewBox);
  app.appendChild(row);
}
