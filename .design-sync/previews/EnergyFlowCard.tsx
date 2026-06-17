import { EnergyFlowCard, SimuiProvider } from 'simui-lovelace';

const FLOW_CONFIG = {
  type: 'simui-energy-flow-card',
  solar: 'sensor.solar_power',
  grid: 'sensor.grid_power',
  battery: 'sensor.battery_power',
  battery_soc: 'sensor.battery_soc',
  home: 'sensor.home_power',
} as const;

// Daytime: solar surplus exporting to grid (green) and charging the battery (blue) —
// the default demo state.
export const SunnySurplus = () => <EnergyFlowCard config={{ ...FLOW_CONFIG }} />;

// Evening: no solar, battery discharging to the home (green) and the grid topping up (blue).
// Override just the power sensors for this cell.
export const NightDraw = () => (
  <SimuiProvider
    states={{
      'sensor.solar_power': { entity_id: 'sensor.solar_power', state: '0', attributes: { friendly_name: 'Solar Power', device_class: 'power', unit_of_measurement: 'W' } },
      'sensor.grid_power': { entity_id: 'sensor.grid_power', state: '1200', attributes: { friendly_name: 'Grid Power', device_class: 'power', unit_of_measurement: 'W' } },
      'sensor.battery_power': { entity_id: 'sensor.battery_power', state: '900', attributes: { friendly_name: 'Battery Power', device_class: 'power', unit_of_measurement: 'W' } },
      'sensor.battery_soc': { entity_id: 'sensor.battery_soc', state: '46', attributes: { friendly_name: 'Battery Charge', device_class: 'battery', unit_of_measurement: '%' } },
      'sensor.home_power': { entity_id: 'sensor.home_power', state: '2100', attributes: { friendly_name: 'Home Power', device_class: 'power', unit_of_measurement: 'W' } },
    }}
  >
    <EnergyFlowCard config={{ ...FLOW_CONFIG }} />
  </SimuiProvider>
);
