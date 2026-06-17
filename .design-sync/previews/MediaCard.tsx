import { MediaCard } from 'simui-lovelace';

export const Playing = () => (
  <MediaCard config={{ type: 'simui-media-card', entity: 'media_player.living' }} />
);

export const Paused = () => (
  <MediaCard config={{ type: 'simui-media-card', entity: 'media_player.kitchen' }} />
);

export const Off = () => (
  <MediaCard config={{ type: 'simui-media-card', entity: 'media_player.bedroom' }} />
);
