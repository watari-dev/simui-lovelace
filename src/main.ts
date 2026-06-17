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
import { FanCard, type FanCardConfig } from './cards/FanCard';
import { ButtonCard, type ButtonCardConfig } from './cards/ButtonCard';
import { GaugeCard, type GaugeCardConfig } from './cards/GaugeCard';
import { AlarmCard, type AlarmCardConfig } from './cards/AlarmCard';
import { VacuumCard, type VacuumCardConfig } from './cards/VacuumCard';
import { WeatherCard, type WeatherCardConfig } from './cards/WeatherCard';
import { SelectCard, type SelectCardConfig } from './cards/SelectCard';

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
const SLIDER_OPTIONS = [
  { value: 'dots', label: 'Dots' },
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'none', label: 'Hidden' },
];
const SLIDER_FIELD = { name: 'slider', selector: { select: { mode: 'dropdown', options: SLIDER_OPTIONS } } };
// A generic, opt-in row of custom action buttons (name · icon · tap action) — shared by the
// cards that have no domain-specific control row (sensor / lock / media / graph / energy).
const BUTTONS_FIELD = {
  name: 'buttons',
  selector: {
    object: {
      multiple: true,
      label_field: 'name',
      translation_key: 'button',
      fields: {
        name: { required: true, selector: { text: {} } },
        icon: { selector: { icon: {} } },
        tap_action: { selector: { ui_action: {} } },
      },
    },
  },
};
const BUTTONS_LABEL = 'Action buttons';
const BUTTONS_HELP = 'Optional buttons beneath the card — each runs its tap action (default: more-info).';
// Sections (grid) view footprints (of 12 columns; rows:'auto' = content height). Without these
// HA spans a custom card across all 12 columns — so tiles need a smaller default footprint.
const TILE_GRID = { columns: 6, rows: 'auto', min_columns: 3, min_rows: 2 } as const;   // half-width entity tiles
const WIDE_GRID = { columns: 12, rows: 'auto', min_columns: 6, min_rows: 2 } as const;   // media
const TALL_GRID = { columns: 12, rows: 'auto', min_columns: 6, min_rows: 4 } as const;   // graph / energy
const STRIP_GRID = { columns: 12, rows: 'auto', min_columns: 4, min_rows: 1 } as const;  // chips strip

// ── Register the cards ────────────────────────────────────────────────────────
defineCard<LightCardConfig>('simui-light-card', LightCard, {
  gridOptions: TILE_GRID,
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
      SLIDER_FIELD,
      { name: 'slider_target', selector: { select: { mode: 'dropdown', options: [{ value: 'brightness', label: 'Brightness' }, { value: 'color_temp', label: 'Colour temperature' }] } } },
      { name: 'show_color_controls', selector: { boolean: {} } },
      {
        name: 'color_controls',
        selector: {
          object: {
            multiple: true,
            label_field: 'name',
            translation_key: 'preset',
            fields: {
              name: { required: true, selector: { text: {} } },
              icon: { selector: { icon: {} } },
              kelvin: { selector: { number: { min: 1500, max: 8000, step: 50, mode: 'box', unit_of_measurement: 'K' } } },
              brightness: { selector: { number: { min: 1, max: 100, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
              effect: { selector: { text: {} } },
            },
          },
        },
      },
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: {
      entity: 'Light',
      name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS,
      use_light_color: 'Tint with the bulb’s colour', color: 'Accent colour (override)',
      slider: 'Brightness slider style', slider_target: 'Slider controls',
      show_color_controls: 'Show preset chips', color_controls: 'Preset chips', compact: 'Compact (dense)',
    },
    helpers: {
      use_light_color: 'On: the tile takes the light’s live colour. Off: a calm warm yellow.',
      slider: 'Dots, a solid bar, a thin line, or hidden.',
      slider_target: 'Drag to set brightness, or the colour temperature (warm ↔ cool).',
      color_controls: 'Add / name / reorder chips, each applying a colour-temp + brightness preset. Empty ⇒ Warm / Cool / Scene.',
    },
    defaults: { use_light_color: true, slider: 'dots', slider_target: 'brightness', show_color_controls: true },
  },
});

defineCard<ClimateCardConfig>('simui-climate-card', ClimateCard, {
  gridOptions: TILE_GRID,
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
      { name: 'show_track', selector: { boolean: {} } },
      { name: 'show_modes', selector: { boolean: {} } },
      {
        name: 'modes',
        selector: {
          object: {
            multiple: true,
            label_field: 'name',
            translation_key: 'mode',
            fields: {
              name: { required: true, selector: { text: {} } },
              icon: { selector: { icon: {} } },
              mode: { selector: { text: {} } },
              preset: { selector: { text: {} } },
              temperature: { selector: { number: { min: 5, max: 35, step: 0.5, mode: 'box', unit_of_measurement: '°' } } },
            },
          },
        },
      },
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Thermostat', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', show_track: 'Temperature track', show_modes: 'Show mode chips', modes: 'Mode chips', compact: 'Compact (dense)' },
    helpers: { modes: 'Each chip sets an HVAC mode, a preset, or a temperature. Empty ⇒ Heat / Auto / Cool from the entity.' },
    defaults: { show_track: true, show_modes: true },
  },
});

defineCard<SensorCardConfig>('simui-sensor-card', SensorCard, {
  gridOptions: TILE_GRID,
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
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Sensor', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour', sparkline: '24 h sparkline', show_delta: '24 h delta badge', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: { color: 'Overrides the automatic colour picked from the sensor’s device class.', buttons: BUTTONS_HELP },
    defaults: { sparkline: true, show_delta: true },
  },
});

defineCard<GraphCardConfig>('simui-graph-card', GraphCard, {
  gridOptions: TALL_GRID,
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
      BUTTONS_FIELD,
    ],
    labels: {
      entity: 'Sensor',
      secondary: 'Second series (optional)',
      name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS,
      color: 'Accent colour',
      hours: 'Default range (hours)',
      line_width: 'Line width', fill: 'Fill under the line', show_stats: 'Show min / avg / max',
      buttons: BUTTONS_LABEL,
    },
    helpers: {
      color: 'Overrides the automatic colour picked from the sensor’s device class.',
      secondary: 'A second sensor overlaid on the same chart (e.g. humidity over temperature).',
      buttons: BUTTONS_HELP,
    },
    defaults: { hours: 24, fill: true, show_stats: true, line_width: 2.4 },
  },
  cardSize: 4,
});

defineCard<CoverCardConfig>('simui-cover-card', CoverCard, {
  gridOptions: TILE_GRID,
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
      SLIDER_FIELD,
      { name: 'slider_target', selector: { select: { mode: 'dropdown', options: [{ value: 'position', label: 'Position' }, { value: 'tilt', label: 'Tilt' }] } } },
      { name: 'show_buttons', selector: { boolean: {} } },
      {
        name: 'buttons',
        selector: {
          object: {
            multiple: true,
            label_field: 'name',
            translation_key: 'button',
            fields: {
              name: { required: true, selector: { text: {} } },
              icon: { selector: { icon: {} } },
              service: { selector: { select: { mode: 'dropdown', options: [{ value: 'open', label: 'Open' }, { value: 'close', label: 'Close' }, { value: 'stop', label: 'Stop' }, { value: 'toggle', label: 'Toggle' }] } } },
              position: { selector: { number: { min: 0, max: 100, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
              tilt: { selector: { number: { min: 0, max: 100, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
            },
          },
        },
      },
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Cover', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', slider: 'Position slider style', slider_target: 'Slider controls', show_buttons: 'Show button row', buttons: 'Buttons', compact: 'Compact (dense)' },
    helpers: {
      slider_target: 'Drag to set the opening position, or the slat tilt (venetian/tilting covers).',
      buttons: 'Each button runs a cover service, or moves to a position / tilt. Empty ⇒ Open / Stop / Close.',
    },
    defaults: { slider: 'dots', slider_target: 'position', show_buttons: true },
  },
});

defineCard<LockCardConfig>('simui-lock-card', LockCard, {
  gridOptions: TILE_GRID,
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
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Lock', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: { buttons: BUTTONS_HELP },
  },
});

defineCard<MediaCardConfig>('simui-media-card', MediaCard, {
  gridOptions: WIDE_GRID,
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('media_player.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'media_player' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      BUTTONS_FIELD,
    ],
    labels: { entity: 'Media player', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, buttons: BUTTONS_LABEL },
    helpers: { buttons: BUTTONS_HELP },
  },
  cardSize: 3,
});

defineCard<ChipsCardConfig>('simui-chips-card', ChipsCard, {
  gridOptions: STRIP_GRID,
  stubConfig: (hass) => {
    if (!hass) return { entities: [] };
    const pick = (p: string) => Object.keys(hass.states).find((id) => id.startsWith(p));
    return { entities: [pick('light.'), pick('sensor.'), pick('lock.')].filter((x): x is string => !!x) };
  },
  entities: (c) => (c.chips ? c.chips.map((ch) => ch.entity).filter((x): x is string => !!x) : c.entities ?? []),
  editor: {
    schema: [
      { name: 'entities', selector: { entity: { multiple: true } } },
      {
        name: 'chips',
        selector: {
          object: {
            multiple: true,
            label_field: 'name',
            translation_key: 'chip',
            fields: {
              entity: { selector: { entity: {} } },
              name: { selector: { text: {} } },
              icon: { selector: { icon: {} } },
              color: { selector: { select: { mode: 'dropdown', options: COLOR_OPTIONS } } },
              tap_action: { selector: { ui_action: {} } },
            },
          },
        },
      },
    ],
    labels: { entities: 'Entities (simple)', chips: 'Chips (advanced)' },
    helpers: {
      entities: 'A quick list of entities, each shown as a status chip.',
      chips: 'Per-chip control — entity, custom name / icon / colour, and tap action. Overrides the simple list above.',
    },
  },
});

defineCard<EnergyFlowCardConfig>('simui-energy-flow-card', EnergyFlowCard, {
  gridOptions: TALL_GRID,
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
      BUTTONS_FIELD,
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
      buttons: BUTTONS_LABEL,
    },
    helpers: { grid: 'Signed: + importing, − exporting', battery: 'Signed: + discharging, − charging', buttons: BUTTONS_HELP },
  },
});

defineCard<FanCardConfig>('simui-fan-card', FanCard, {
  gridOptions: TILE_GRID,
  stubConfig: (hass) => ({ entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('fan.')) ?? '' : '' }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'fan' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      SLIDER_FIELD,
      { name: 'show_oscillate', selector: { boolean: {} } },
      { name: 'show_presets', selector: { boolean: {} } },
      { name: 'show_direction', selector: { boolean: {} } },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Fan', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', slider: 'Speed slider style', show_oscillate: 'Show oscillate chip', show_presets: 'Show preset chips', show_direction: 'Show direction chip', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: { buttons: BUTTONS_HELP },
    defaults: { slider: 'dots', show_oscillate: true, show_presets: true, show_direction: true },
  },
});

defineCard<ButtonCardConfig>('simui-button-card', ButtonCard, {
  gridOptions: TILE_GRID,
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('scene.')) ?? Object.keys(hass.states).find((id) => id.startsWith('script.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', selector: { entity: { domain: ['scene', 'script'] } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'subtitle', selector: { text: {} } },
      { name: 'show_state', selector: { boolean: {} } },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Scene or script (optional)', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', subtitle: 'Subtitle (optional)', show_state: 'Show run state', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: {
      entity: 'Pick a scene or script to run on tap. Leave empty and set a Tap action for a pure action button.',
      subtitle: 'A small caption under the name. Defaults to the last-run time / “Tap to run”.',
      buttons: BUTTONS_HELP,
    },
    defaults: { show_state: true },
  },
});

defineCard<GaugeCardConfig>('simui-gauge-card', GaugeCard, {
  gridOptions: TILE_GRID,
  cardSize: 2,
  stubConfig: (hass) => ({
    entity: hass
      ? Object.keys(hass.states).find((id) => (id.startsWith('sensor.') || id.startsWith('number.') || id.startsWith('input_number.')) && hass.states[id].attributes.unit_of_measurement != null && !Number.isNaN(Number(hass.states[id].state))) ?? Object.keys(hass.states).find((id) => id.startsWith('sensor.')) ?? ''
      : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: ['sensor', 'number', 'input_number', 'counter'] } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'min', selector: { number: { mode: 'box' } } },
      { name: 'max', selector: { number: { mode: 'box' } } },
      { name: 'precision', selector: { number: { min: 0, max: 4, step: 1, mode: 'box' } } },
      { name: 'show_unit', selector: { boolean: {} } },
      { name: 'show_minmax', selector: { boolean: {} } },
      { name: 'severity_fill', selector: { boolean: {} } },
      {
        name: 'severity',
        selector: { object: { multiple: true, label_field: 'from', translation_key: 'severity', fields: { from: { required: true, selector: { number: { mode: 'box' } } }, color: { selector: { select: { mode: 'dropdown', options: COLOR_OPTIONS } } } } } },
      },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Gauge entity', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', min: 'Minimum', max: 'Maximum', precision: 'Decimal places', show_unit: 'Show unit', show_minmax: 'Show min / max labels', severity_fill: 'Fill by severity band', severity: 'Severity bands', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: {
      color: 'Overrides the device-class tint and the severity colour.',
      min: 'Arc start. Default 0.',
      max: 'Arc end. Default 100 for %, else auto from the value.',
      severity: 'Coloured thresholds — each band starts at “from” and runs to the next (or max). e.g. 0 green · 60 amber · 85 red.',
      severity_fill: 'On: the whole fill tints by the active band. Off: fill stays one accent.',
      buttons: BUTTONS_HELP,
    },
    defaults: { show_unit: true, show_minmax: true, severity_fill: true },
  },
});

defineCard<AlarmCardConfig>('simui-alarm-card', AlarmCard, {
  gridOptions: TILE_GRID,
  stubConfig: (hass) => ({ entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('alarm_control_panel.')) ?? '' : '' }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'alarm_control_panel' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      {
        name: 'arm_actions',
        selector: { select: { multiple: true, mode: 'list', options: [{ value: 'arm_home', label: 'Arm Home' }, { value: 'arm_away', label: 'Arm Away' }, { value: 'arm_night', label: 'Arm Night' }, { value: 'arm_vacation', label: 'Arm Vacation' }, { value: 'arm_custom_bypass', label: 'Arm Custom Bypass' }] } },
      },
      { name: 'show_status', selector: { boolean: {} } },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Alarm panel', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', arm_actions: 'Arm buttons', show_status: 'Show status line', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: {
      arm_actions: 'Which arm modes to offer, in order. Empty ⇒ auto from what the panel supports. A Disarm button appears automatically when armed.',
      color: 'Overrides the automatic state colour (green disarmed · amber armed home/night · coral armed away · red triggered).',
      buttons: BUTTONS_HELP,
    },
    defaults: { show_status: true },
  },
});

defineCard<VacuumCardConfig>('simui-vacuum-card', VacuumCard, {
  gridOptions: TILE_GRID,
  stubConfig: (hass) => ({ entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('vacuum.')) ?? '' : '' }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'vacuum' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      {
        name: 'actions',
        selector: { select: { multiple: true, mode: 'list', options: [{ value: 'start', label: 'Clean / Resume' }, { value: 'pause', label: 'Pause' }, { value: 'stop', label: 'Stop' }, { value: 'return_to_base', label: 'Dock' }, { value: 'locate', label: 'Locate' }] } },
      },
      { name: 'show_fan_speed', selector: { boolean: {} } },
      { name: 'show_battery', selector: { boolean: {} } },
      { name: 'show_status', selector: { boolean: {} } },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Vacuum', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', actions: 'Action buttons', show_fan_speed: 'Show fan-speed chips', show_battery: 'Show battery %', show_status: 'Show status line', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: {
      actions: 'Which controls to offer, in order. Empty ⇒ auto from what the vacuum supports (Clean / Pause / Stop / Dock / Locate).',
      color: 'Overrides the automatic state colour (blue cleaning · green docked · amber paused · grey idle · red error).',
      show_fan_speed: 'Show suction-power chips from the vacuum’s fan_speed_list. Hidden when unsupported.',
      buttons: BUTTONS_HELP,
    },
    defaults: { show_fan_speed: true, show_battery: true, show_status: true },
  },
});

defineCard<WeatherCardConfig>('simui-weather-card', WeatherCard, {
  gridOptions: WIDE_GRID,
  cardSize: 4,
  stubConfig: (hass) => ({ entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('weather.')) ?? '' : '' }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: 'weather' } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'forecast_type', selector: { select: { mode: 'dropdown', options: [{ value: 'daily', label: 'Daily' }, { value: 'hourly', label: 'Hourly' }, { value: 'twice_daily', label: 'Twice daily' }, { value: 'none', label: 'Hidden' }] } } },
      { name: 'forecast_slots', selector: { number: { min: 1, max: 10, step: 1, mode: 'slider' } } },
      { name: 'show_details', selector: { boolean: {} } },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Weather', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', forecast_type: 'Forecast', forecast_slots: 'Forecast days / hours', show_details: 'Detail row (feels-like · humidity · wind)', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: {
      color: 'Overrides the automatic colour picked from the current condition.',
      forecast_type: 'Daily, hourly, or twice-daily — gated by what the integration provides. “Hidden” drops the strip.',
      forecast_slots: 'How many forecast cells to show (default 5).',
      buttons: BUTTONS_HELP,
    },
    defaults: { forecast_type: 'daily', forecast_slots: 5, show_details: true },
  },
});

defineCard<SelectCardConfig>('simui-select-card', SelectCard, {
  gridOptions: TILE_GRID,
  stubConfig: (hass) => ({
    entity: hass ? Object.keys(hass.states).find((id) => id.startsWith('select.')) ?? Object.keys(hass.states).find((id) => id.startsWith('input_select.')) ?? '' : '',
  }),
  editor: {
    schema: [
      { name: 'entity', required: true, selector: { entity: { domain: ['select', 'input_select'] } } },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      ...ACTION_FIELDS,
      COLOR_FIELD,
      { name: 'mode', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'Auto (chips or dropdown)' }, { value: 'chips', label: 'Chips' }, { value: 'dropdown', label: 'Dropdown' }, { value: 'cycle', label: 'Cycle (tap to advance)' }] } } },
      { name: 'chip_threshold', selector: { number: { min: 2, max: 12, step: 1, mode: 'box' } } },
      { name: 'show_control', selector: { boolean: {} } },
      {
        name: 'options',
        selector: { object: { multiple: true, label_field: 'option', translation_key: 'select_option', fields: { option: { required: true, selector: { text: {} } }, name: { selector: { text: {} } }, icon: { selector: { icon: {} } } } } },
      },
      BUTTONS_FIELD,
      { name: 'compact', selector: { boolean: {} } },
    ],
    labels: { entity: 'Select entity', name: 'Name (optional)', icon: 'Icon (optional)', ...ACTION_LABELS, color: 'Accent colour (override)', mode: 'Picker style', chip_threshold: 'Max chips before dropdown', show_control: 'Show the picker', options: 'Option labels', buttons: BUTTONS_LABEL, compact: 'Compact (dense)' },
    helpers: {
      mode: 'Auto shows chips for a few options and a dropdown for many. Cycle hides the picker and advances on tap.',
      chip_threshold: 'In Auto mode, option lists longer than this become a dropdown. Default 5.',
      options: 'Rename or icon individual options. Add an entry whose “option” exactly matches a value the entity offers — others fall back to the raw name.',
      buttons: BUTTONS_HELP,
    },
    defaults: { mode: 'auto', chip_threshold: 5, show_control: true },
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
  {
    type: 'simui-fan-card',
    name: 'SimUI Fan',
    description: 'A minimalist fan tile — tap to toggle, drag to set speed, oscillate / preset / direction chips.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-button-card',
    name: 'SimUI Button',
    description: 'A scene / script action tile — tap the glowing disc to activate. Works with any action, no entity needed.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-gauge-card',
    name: 'SimUI Gauge',
    description: 'A radial gauge for a numeric sensor — a precise arc, big centre value, severity bands.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-alarm-card',
    name: 'SimUI Alarm',
    description: 'A minimalist alarm panel tile — armed state big, one-tap arm / disarm, tinted by state.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-vacuum-card',
    name: 'SimUI Vacuum',
    description: 'A minimalist robot-vacuum tile — state big, battery %, and Clean / Pause / Stop / Dock / Locate controls.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-weather-card',
    name: 'SimUI Weather',
    description: 'A minimalist weather card — condition, big temperature, feels-like / humidity / wind, and a forecast strip.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
  {
    type: 'simui-select-card',
    name: 'SimUI Select',
    description: 'A minimalist option-picker tile — the current choice big, chips for a few options or a dropdown for many.',
    preview: true,
    documentationURL: 'https://github.com/watari-dev/simui-lovelace',
  },
);

console.info(
  `%c SimUI Cards %c ${__SIMUI_VERSION__} `,
  'background:#fcd663;color:#1d1d1d;font-weight:600;border-radius:4px 0 0 4px;padding:2px 6px',
  'background:#1d1d1d;color:#fcd663;border-radius:0 4px 4px 0;padding:2px 6px',
);
