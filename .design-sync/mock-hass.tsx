// Mock Home Assistant context for claude.ai/design.
//
// SimUI cards read live HA entity state from a `HassProvider` context (see
// src/core/hass.tsx) — they render nothing useful without one. This module
// supplies that context with realistic demo state (the same ground-truth set
// the dev harness uses) so the cards render meaningful tiles with no running
// Home Assistant, both in the design-system preview cards and in any dashboard
// mock the design agent composes.
//
// The headline export is <SimuiProvider> — wrap one or more SimUI cards in it
// and they Just Work. createMockHass()/DEMO_STATES are the lower-level pieces
// for callers that want to supply their own entities.

import { useMemo, useState, type ReactNode } from 'react';
import { HassProvider } from '../src/core/hass';
import type { HassEntity, HomeAssistant, ServiceTarget } from '../src/core/types';

/** Realistic demo entities covering every SimUI card. Mirrors src/dev/main-dev.tsx. */
export const DEMO_STATES: Record<string, HassEntity> = {
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

  // sensors
  'binary_sensor.motion': { entity_id: 'binary_sensor.motion', state: 'on', attributes: { friendly_name: 'Hallway Motion', device_class: 'motion' } },
  'sensor.temp': { entity_id: 'sensor.temp', state: '21.5', attributes: { friendly_name: 'Living Room Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },
  'sensor.humidity': { entity_id: 'sensor.humidity', state: '54', attributes: { friendly_name: 'Living Room Humidity', device_class: 'humidity', unit_of_measurement: '%' } },
  'sensor.power': { entity_id: 'sensor.power', state: '342', attributes: { friendly_name: 'Fridge Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery': { entity_id: 'sensor.battery', state: '87', attributes: { friendly_name: 'Front Door Battery', device_class: 'battery', unit_of_measurement: '%' } },
  'sensor.co2': { entity_id: 'sensor.co2', state: '612', attributes: { friendly_name: 'CO₂', device_class: 'carbon_dioxide', unit_of_measurement: 'ppm' } },
  'sensor.outdoor': { entity_id: 'sensor.outdoor', state: 'unavailable', attributes: { friendly_name: 'Outdoor Temperature', device_class: 'temperature', unit_of_measurement: '°C' } },

  // energy-flow power sensors (sunny surplus: solar exports + charges the battery)
  'sensor.solar_power': { entity_id: 'sensor.solar_power', state: '3200', attributes: { friendly_name: 'Solar Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.grid_power': { entity_id: 'sensor.grid_power', state: '-850', attributes: { friendly_name: 'Grid Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery_power': { entity_id: 'sensor.battery_power', state: '-800', attributes: { friendly_name: 'Battery Power', device_class: 'power', unit_of_measurement: 'W' } },
  'sensor.battery_soc': { entity_id: 'sensor.battery_soc', state: '78', attributes: { friendly_name: 'Battery Charge', device_class: 'battery', unit_of_measurement: '%' } },
  'sensor.home_power': { entity_id: 'sensor.home_power', state: '1550', attributes: { friendly_name: 'Home Power', device_class: 'power', unit_of_measurement: 'W' } },

  // covers (supported_features: open|close|set_position|stop = 1|2|4|8 = 15; garage has no set_position = 11)
  'cover.living': { entity_id: 'cover.living', state: 'open', attributes: { friendly_name: 'Living Room Blinds', device_class: 'blind', current_position: 60, supported_features: 15 } },
  'cover.bedroom': { entity_id: 'cover.bedroom', state: 'opening', attributes: { friendly_name: 'Bedroom Shade', device_class: 'shade', current_position: 40, supported_features: 15 } },
  'cover.garage': { entity_id: 'cover.garage', state: 'closed', attributes: { friendly_name: 'Garage Door', device_class: 'garage', current_position: 0, supported_features: 11 } },
  'cover.awning': { entity_id: 'cover.awning', state: 'open', attributes: { friendly_name: 'Patio Awning', device_class: 'awning', current_position: 50, supported_features: 4 } },

  // locks
  'lock.front': { entity_id: 'lock.front', state: 'locked', attributes: { friendly_name: 'Front Door' } },
  'lock.back': { entity_id: 'lock.back', state: 'unlocked', attributes: { friendly_name: 'Back Door' } },
  'lock.side': { entity_id: 'lock.side', state: 'jammed', attributes: { friendly_name: 'Side Gate' } },

  // media players (supported_features: pause|prev|next|play = 1|16|32|16384 = 16433)
  'media_player.living': { entity_id: 'media_player.living', state: 'playing', attributes: { friendly_name: 'Living Room Speaker', media_title: 'Redbone', media_artist: 'Childish Gambino', supported_features: 16433 } },
  'media_player.kitchen': { entity_id: 'media_player.kitchen', state: 'paused', attributes: { friendly_name: 'Kitchen Display', media_title: 'The Daily', media_artist: 'The New York Times', supported_features: 16433 } },
  'media_player.bedroom': { entity_id: 'media_player.bedroom', state: 'off', attributes: { friendly_name: 'Bedroom TV', supported_features: 16433 } },
};

function ids(target?: ServiceTarget): string[] {
  const t = target?.entity_id;
  return t == null ? [] : Array.isArray(t) ? t : [t];
}

const ACTION_FOR_MODE: Record<string, string> = { off: 'off', heat: 'heating', cool: 'cooling' };

// Deterministic synthetic history (a smooth wave around the entity's current value) so the
// graph card renders with no recorder. Same (id, t) → same value, so refetches don't jump.
function synthHistory(states: Record<string, HassEntity>, id: string, start: number, end: number): Array<{ s: string; lu: number }> {
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

/** Apply one HA service call to a state map (immutably) — the same transitions the dev
 *  harness implements, so toggling/dragging a card in a live preview behaves like real HA. */
function applyService(
  prev: Record<string, HassEntity>,
  service: string,
  data?: Record<string, unknown>,
  target?: ServiceTarget,
): Record<string, HassEntity> {
  const states = { ...prev };
  for (const id of ids(target)) {
    const e = states[id];
    if (!e) continue;
    if (service === 'turn_off') {
      states[id] = { ...e, state: 'off' };
    } else if (service === 'turn_on') {
      const bp = data?.brightness_pct as number | undefined;
      states[id] = { ...e, state: 'on', attributes: { ...e.attributes, brightness: bp != null ? Math.round(bp * 2.55) : (e.attributes.brightness ?? 204) } };
    } else if (service === 'toggle') {
      states[id] = { ...e, state: e.state === 'on' ? 'off' : 'on' };
    } else if (service === 'set_temperature') {
      states[id] = { ...e, attributes: { ...e.attributes, ...(data ?? {}) } };
    } else if (service === 'set_hvac_mode') {
      const mode = (data?.hvac_mode as string) ?? 'off';
      states[id] = { ...e, state: mode, attributes: { ...e.attributes, hvac_action: ACTION_FOR_MODE[mode] ?? 'idle' } };
    } else if (service === 'lock' || service === 'unlock') {
      states[id] = { ...e, state: service === 'lock' ? 'locked' : 'unlocked' };
    } else if (service === 'open_cover' || service === 'close_cover') {
      const opened = service === 'open_cover';
      states[id] = { ...e, state: opened ? 'open' : 'closed', attributes: { ...e.attributes, current_position: opened ? 100 : 0 } };
    } else if (service === 'stop_cover') {
      states[id] = { ...e, state: ((e.attributes.current_position as number) ?? 0) > 0 ? 'open' : 'closed' };
    } else if (service === 'set_cover_position') {
      const p = (data?.position as number) ?? 0;
      states[id] = { ...e, state: p === 0 ? 'closed' : 'open', attributes: { ...e.attributes, current_position: p } };
    } else if (service === 'media_play_pause') {
      states[id] = { ...e, state: e.state === 'playing' ? 'paused' : 'playing' };
    }
  }
  return states;
}

/**
 * A static mock `hass` object over a state map — `states`, a `callWS` that serves synthetic
 * recorder history (so the graph card charts), and a no-op `callService`. Use this with
 * `<HassProvider>` directly when you need a non-reactive context; most callers want the
 * batteries-included `<SimuiProvider>` below instead.
 */
export function createMockHass(extraStates?: Record<string, HassEntity>): HomeAssistant {
  const states = { ...DEMO_STATES, ...(extraStates ?? {}) };
  return {
    states,
    language: 'en',
    callWS: async (msg) => {
      if (msg.type === 'history/history_during_period') {
        const start = Date.parse(msg.start_time as string);
        const end = Date.parse(msg.end_time as string);
        const out: Record<string, unknown> = {};
        for (const id of (msg.entity_ids as string[]) ?? []) out[id] = synthHistory(states, id, start, end);
        return out as never;
      }
      return {} as never;
    },
    callService: () => {},
  };
}

/**
 * Wrap one or more SimUI cards so they render with realistic demo Home Assistant state and
 * no running HA. This is the easy path for composing a dashboard mock:
 *
 * ```tsx
 * <SimuiProvider>
 *   <ChipsCard config={{ type: 'simui-chips-card', entities: ['light.ceiling', 'lock.front'] }} />
 *   <LightCard config={{ type: 'simui-light-card', entity: 'light.office' }} />
 * </SimuiProvider>
 * ```
 *
 * Entity ids come from {@link DEMO_STATES}; pass `states` to add or override entities. The
 * provider is reactive — toggling/dragging a card mutates the mock state just like real HA.
 */
export function SimuiProvider({ states: extra, children }: { states?: Record<string, HassEntity>; children: ReactNode }) {
  const host = useMemo(() => (typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement)), []);
  const [states, setStates] = useState<Record<string, HassEntity>>(() => ({ ...DEMO_STATES, ...(extra ?? {}) }));
  const hass = useMemo<HomeAssistant>(
    () => ({
      states,
      language: 'en',
      callWS: createMockHass(states).callWS,
      callService: (_domain, service, data, target) => setStates((s) => applyService(s, service, data, target)),
    }),
    [states],
  );
  return <HassProvider hass={hass} host={host}>{children}</HassProvider>;
}
