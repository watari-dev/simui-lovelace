import { ChipsCard } from 'simui-lovelace';

// A glanceable status strip mixing several entity domains.
export const StatusStrip = () => (
  <ChipsCard
    config={{
      type: 'simui-chips-card',
      entities: [
        'light.ceiling',
        'climate.living',
        'sensor.temp',
        'sensor.humidity',
        'cover.living',
        'lock.front',
        'binary_sensor.motion',
      ],
    }}
  />
);

export const Compact = () => (
  <ChipsCard
    config={{ type: 'simui-chips-card', entities: ['light.office', 'lock.front', 'media_player.living'] }}
  />
);
