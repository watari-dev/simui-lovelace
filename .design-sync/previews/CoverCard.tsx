import { CoverCard } from 'simui-lovelace';

export const Blind = () => (
  <CoverCard config={{ type: 'simui-cover-card', entity: 'cover.living' }} />
);

export const Garage = () => (
  <CoverCard config={{ type: 'simui-cover-card', entity: 'cover.garage' }} />
);

export const Awning = () => (
  <CoverCard config={{ type: 'simui-cover-card', entity: 'cover.awning' }} />
);
