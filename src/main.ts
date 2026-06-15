import { defineCard } from './core/react-card';
import { LightCard, type LightCardConfig } from './cards/LightCard';
import { ClimateCard, type ClimateCardConfig } from './cards/ClimateCard';
import { SensorCard, type SensorCardConfig } from './cards/SensorCard';
import { GraphCard, type GraphCardConfig } from './cards/GraphCard';

const COLOR_OPTIONS = [
  { value: 'warm', label: 'Amber' },
  { value: 'cool', label: 'Blue' },
  { value: 'up', label: 'Green' },
  { value: 'down', label: 'Coral' },
  { value: 'grey', label: 'Grey' },
];

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
      { name: 'use_light_color', selector: { boolean: {} } },
    ],
    labels: {
      entity: 'Light',
      name: 'Name (optional)',
      use_light_color: 'Tint with the bulb’s colour',
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
    ],
    labels: { entity: 'Thermostat', name: 'Name (optional)' },
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
      { name: 'color', selector: { select: { mode: 'dropdown', options: COLOR_OPTIONS } } },
    ],
    labels: { entity: 'Sensor', name: 'Name (optional)', color: 'Accent colour' },
    helpers: { color: 'Overrides the automatic colour picked from the sensor’s device class.' },
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
      { name: 'name', selector: { text: {} } },
      { name: 'color', selector: { select: { mode: 'dropdown', options: COLOR_OPTIONS } } },
      { name: 'hours', selector: { number: { min: 1, max: 720, step: 1, mode: 'box', unit_of_measurement: 'h' } } },
      { name: 'fill', selector: { boolean: {} } },
    ],
    labels: {
      entity: 'Sensor',
      name: 'Name (optional)',
      color: 'Accent colour',
      hours: 'Default range (hours)',
      fill: 'Fill under the line',
    },
    helpers: { color: 'Overrides the automatic colour picked from the sensor’s device class.' },
    defaults: { fill: true, hours: 24 },
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
);

// eslint-disable-next-line no-console
console.info(
  '%c SimUI Cards %c 0.1.0 ',
  'background:#fcd663;color:#1d1d1d;font-weight:600;border-radius:4px 0 0 4px;padding:2px 6px',
  'background:#1d1d1d;color:#fcd663;border-radius:0 4px 4px 0;padding:2px 6px',
);
