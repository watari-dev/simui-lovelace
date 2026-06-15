import { SensorCard } from 'simui-lovelace';

export const Temperature = () => (
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.temp' }} />
);

export const Humidity = () => (
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.humidity' }} />
);

export const Power = () => (
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.power' }} />
);

export const Battery = () => (
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.battery' }} />
);

export const AirQuality = () => (
  <SensorCard config={{ type: 'simui-sensor-card', entity: 'sensor.co2' }} />
);
