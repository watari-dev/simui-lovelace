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

// entity_picture is interpolated into a CSS url("…"); only accept an http(s) or root-relative
// path with no quotes/parens/whitespace, so a crafted attribute can't break out of the url()
// and trigger an attacker-chosen fetch.
const SAFE_ART = /^(https?:\/\/|\/)[^"'()\s]+$/;

export function readMedia(e: HassEntity | undefined, dead: boolean): MediaView {
  const a = e?.attributes ?? {};
  const state = e?.state ?? 'off';
  const rawArt = a.entity_picture as string | undefined;
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
    art: rawArt && SAFE_ART.test(rawArt) ? rawArt : null,
    tint: 'var(--cool)',
  };
}
