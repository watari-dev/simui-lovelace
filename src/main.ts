import { defineCard } from './core/react-card';
import { LightCard, type LightCardConfig } from './cards/LightCard';
import { ClimateCard, type ClimateCardConfig } from './cards/ClimateCard';
import { SensorCard, type SensorCardConfig } from './cards/SensorCard';
import { GraphCard, type GraphCardConfig } from './cards/GraphCard';
import { CoverCard, type CoverCardConfig } from './cards/CoverCard';
import { LockCard, type LockCardConfig } from './cards/LockCard';
import { MediaCard, type MediaCardConfig } from './cards/MediaCard';
import { ChipsCard, type ChipsCardConfig } from './cards/ChipsCard';
import { EnergyFlowCard, type EnergyFlowCardConfig } from './cards/EnergyFlowCard';

const COLOR_OPTIONS = [
  { value: 'warm', label: 'Amber' },
  { value: 'cool', label: 'Blue' },
  { value: 'up', label: 'Green' },
  { value: 'heat', label: 'Orange' },
  { value: 'down', label: 'Coral' },
  { value: 'grey', label: 'Grey' },
];
const COLOR_FIELD = { name: 'color', selector: { select: { mode: 'dropdown', options: COLOR_OPTIONS } } } as const;
// tap / hold / double-tap — the native action set, shared by every interactive card.
const ACTION_FIELDS = [
  { name: 'tap_action', selector: { ui_action: {} } },
  { name: 'hold_action', selector: { ui_action: {} } },
  { name: 'double_tap_action', selector: { ui_action: {} } },
];
const ACTION_LABELS = { tap_action: 'Tap action', hold_action: 'Hold action', double_tap_action: 'Double-tap action' };

// ── Register the cards ────────────────────────────────────────────────────────
defineCard<LightCardConfig>('simui-light-card', LightCard, {
  // Auto-pick a light for the card-picker preview; the card itself shows a friendly
  // "Select a light" placeholder until one is chosen (no throwing, graceful degradation).
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('light.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'light' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      { name: 'use_light_color', selector: { boolean: {} } },
      COLOR_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: {
      entity: 'Light',
      name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS,
      use_light_color: 'Tint with the bulb’s colour', color: 'Accent colour (override)', compact: 'Compact (dense)',
    },
    helpers: {
      use_light_color: 'On: the tile takes the light’s live colour. Off: a calm warm yellow.',
    },
    defaults: { use_light_color: true },
  },
});

defineCard<ClimateCardConfig>('simui-climate-card', ClimateCard, {
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('climate.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Thermostat', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', compact: 'Compact (dense)' },
  },
});

defineCard<SensorCardConfig>('simui-sensor-card', SensorCard, {
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('sensor.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: ['sensor', 'binary_sensor'] } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'sparkline', selector: { boolean: {} } },
      { name: 'show_delta', selector: { boolean: {} } },
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Sensor', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour', sparkline: '24 h sparkline', show_delta: '24 h delta badge', compact: 'Compact (dense)' },
    helpers: { color: 'Overrides the automatic colour picked from the sensor’s device class.' },
    defaults: { sparkline: true, show_delta: true },
  },
});

defineCard<GraphCardConfig>('simui-graph-card', GraphCard, {
  stubConfig: (hass) => ({
    entity: hass
      ? Object.keys(hass.states).find(
          (id) => id.startsWith('sensor.') && hass.states[id].attributes.unit_of_measurement != null,
        ) ?? ''
      : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'sensor' } } },
      { name: 'secondary', selector: { entity: { domain: 'sensor' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'hours', selector: { number: { min: 1, max: 720, step: 1, mode: 'box', unit_of_measurement: 'h' } } },
      { name: 'line_width', selector: { number: { min: 1, max: 5, step: 0.2, mode: 'slider' } } },
      { name: 'fill', selector: { boolean: {} } },
      { name: 'show_stats', selector: { boolean: {} } },
    ],
    labels: {
      entity: 'Sensor',
      secondary: 'Second series (optional)',
      name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS,
      color: 'Accent colour',
      hours: 'Default range (hours)',
      line_width: 'Line width', fill: 'Fill under the line', show_stats: 'Show min / avg / max',
    },
    helpers: {
      color: 'Overrides the automatic colour picked from the sensor’s device class.',
      secondary: 'A second sensor overlaid on the same chart (e.g. humidity over temperature).',
    },
    defaults: { hours: 24, fill: true, show_stats: true, line_width: 2.4 },
  },
  cardSize: 4,
});

defineCard<CoverCardConfig>('simui-cover-card', CoverCard, {
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('cover.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'cover' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Cover', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', compact: 'Compact (dense)' },
  },
});

defineCard<LockCardConfig>('simui-lock-card', LockCard, {
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('lock.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'lock' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Lock', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', compact: 'Compact (dense)' },
  },
});

defineCard<MediaCardConfig>('simui-media-card', MediaCard, {
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('media_player.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'media_player' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
    ],
    labels: { entity: 'Media player', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS },
  },
});

defineCard<ChipsCardConfig>('simui-chips-card', ChipsCard, {
  stubConfig: (hass) => {
    if (!hass) return { entities: [] };
    const pick = (p: string) => Object.keys(hass.states).find((id) => id.startsWith(p));
    return { entities: [pick('light.'), pick('sensor.'), pick('lock.')].filter((x): x is string => !!x) };
  },
  entities: (c) => c.entities ?? [],
  editor: {
    schema: [{ name: 'entities', selector: { entity: { multiple: true } } }],
    labels: { entities: 'Entities' },
  },
});

defineCard<EnergyFlowCardConfig>('simui-energy-flow-card', EnergyFlowCard, {
  stubConfig: (hass) => {
    if (!hass) return {};
    const find = (rx: RegExp) => Object.keys(hass.states).find((id) => id.startsWith('sensor.') && rx.test(id));
    return { solar: find(/solar|pv/i), grid: find(/grid|mains/i), battery: find(/battery_power|powerwall/i), battery_soc: find(/soc|state_of_charge|battery_level/i) };
  },
  entities: (c) => [c.solar, c.grid, c.battery, c.battery_soc, c.home],
  cardSize: 5,
  editor: {
    schema: [
      { name: 'name', selector: { text: {} } },
      { name: 'solar', selector: { entity: { domain: 'sensor' } } },
      { name: 'grid', selector: { entity: { domain: 'sensor' } } },
      { name: 'battery', selector: { entity: { domain: 'sensor' } } },
      { name: 'battery_soc', selector: { entity: { domain: 'sensor' } } },
      { name: 'home', selector: { entity: { domain: 'sensor' } } },
      { name: 'grid_invert', selector: { boolean: {} } },
      { name: 'battery_invert', selector: { boolean: {} } },
      ...ACTION_FIELDS,
    ],
    labels: {
      name: 'Name (optional)',
      solar: 'Solar power',
      grid: 'Grid power',
      battery: 'Battery power',
      battery_soc: 'Battery charge %',
      home: 'Home / load power',
      grid_invert: 'Invert grid sign',
      battery_invert: 'Invert battery sign',
      ...ACTION_LABELS,
    },
    helpers: { grid: 'Signed: + importing, − exporting', battery: 'Signed: + discharging, − charging' },
  },
});

// ── Card-picker / HACS metadata ───────────────────────────────────────────────
interface CustomCard {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}
const w = window as unknown as { customCards?: CustomCard[] };
w.customCards = w.customCards ?? [];
w.customCards.push(
  {
    type: 'simui-light-card',
    name: 'SimUI Light',
    description: 'A minimalist light tile — tap to toggle, drag to set brightness.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-climate-card',
    name: 'SimUI Climate',
    description: 'A minimalist thermostat tile — drag to set temperature, tap to toggle.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-sensor-card',
    name: 'SimUI Sensor',
    description: 'A minimalist sensor tile — the value, big, with a device-class icon.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-graph-card',
    name: 'SimUI Graph',
    description: 'A sensor history chart — thin line, soft fill, crosshair readout, range toggle.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-cover-card',
    name: 'SimUI Cover',
    description: 'A minimalist cover tile — drag to set position, tap to open/close/stop.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-lock-card',
    name: 'SimUI Lock',
    description: 'A minimalist lock tile — tap to lock/unlock, tinted by state.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-media-card',
    name: 'SimUI Media',
    description: 'A minimalist media tile — art, title/artist, and transport controls.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-chips-card',
    name: 'SimUI Chips',
    description: 'A row of compact status chips — icon + value, one per entity.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-energy-flow-card',
    name: 'SimUI Energy Flow',
    description: 'A Powerwall-style power-flow diagram — solar, grid, battery, home.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
);

console.info(
  `%c SimUI Cards %c ${__SIMUI_VERSION__} `,
  'background:#fcd663;color:#1d1d1d;font-weight:600;border-radius:4px 0 0 4px;padding:2px 6px',
  'background:#1d1d1d;color:#fcd663;border-radius:0 4px 4px 0;padding:2px 6px',
);
