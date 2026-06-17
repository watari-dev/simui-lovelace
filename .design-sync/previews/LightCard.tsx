import { LightCard } from 'simui-lovelace';

// One cell per state. Names come from each entity's friendly_name (demo state),
// the way the real card derives them. The SimuiProvider wrap is applied by the
// design-sync provider config — these render bare.

export const Brightness = () => (
  <LightCard config={{ type: 'simui-light-card', entity: 'light.ceiling' }} />
);

export const Colour = () => (
  <LightCard config={{ type: 'simui-light-card', entity: 'light.office' }} />
);

export const Off = () => (
  <LightCard config={{ type: 'simui-light-card', entity: 'light.bed' }} />
);

export const Unavailable = () => (
  <LightCard config={{ type: 'simui-light-card', entity: 'light.garage' }} />
);
