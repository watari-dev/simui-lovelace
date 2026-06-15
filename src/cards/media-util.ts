import type { HassEntity } from '../core/types';

// MediaPlayerEntityFeature bits
export const MEDIA_PAUSE = 1;
export const MEDIA_PREVIOUS = 16;
export const MEDIA_NEXT = 32;
export const MEDIA_PLAY = 16384;

export interface MediaView {
  state: string;
  playing: boolean;
  active: boolean; // on / playing / paused / buffering (not off / idle / standby)
  mediaTitle: string;
  mediaSub: string;
  art: string | null;
  tint: string;
}

const INACTIVE = new Set(['off', 'idle', 'standby', 'unavailable', 'unknown']);

export function readMedia(e: HassEntity | undefined, dead: boolean): MediaView {
  const a = e?.attributes ?? {};
  const state = e?.state ?? 'off';
  return {
    state,
    playing: state === 'playing' || state === 'buffering',
    active: !dead && !INACTIVE.has(state),
    mediaTitle: (a.media_title as string) || '',
    mediaSub:
      (a.media_artist as string) ||
      (a.media_series_title as string) ||
      (a.media_album_name as string) ||
      (a.app_name as string) ||
      '',
    art: (a.entity_picture as string) || null,
    tint: 'var(--cool)',
  };
}
