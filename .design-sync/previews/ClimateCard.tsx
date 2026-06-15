import { ClimateCard } from 'simui-lovelace';

export const Heating = () => (
  <ClimateCard config={{ type: 'simui-climate-card', entity: 'climate.living' }} />
);

export const Cooling = () => (
  <ClimateCard config={{ type: 'simui-climate-card', entity: 'climate.bedroom' }} />
);

export const DualSetpoint = () => (
  <ClimateCard config={{ type: 'simui-climate-card', entity: 'climate.guest' }} />
);

export const Off = () => (
  <ClimateCard config={{ type: 'simui-climate-card', entity: 'climate.hall' }} />
);
