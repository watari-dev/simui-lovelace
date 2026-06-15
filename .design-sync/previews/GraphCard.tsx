import { GraphCard } from 'simui-lovelace';

// The mock hass serves deterministic synthetic recorder history, so the chart draws.
export const Temperature = () => (
  <GraphCard config={{ type: 'simui-graph-card', entity: 'sensor.temp', hours: 24 }} />
);

export const Power = () => (
  <GraphCard config={{ type: 'simui-graph-card', entity: 'sensor.power', hours: 24, color: 'warm' }} />
);
