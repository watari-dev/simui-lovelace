import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useCallService, useEntity, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable, prettyState, supportsFeature } from '../util';
import { MEDIA_NEXT, MEDIA_PAUSE, MEDIA_PLAY, MEDIA_PREVIOUS, readMedia } from './media-util';

export interface MediaCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
}

/**
 * SimUI media card — album art (or a music disc), the track title + artist (or the player
 * state), and transport controls (prev / play-pause / next) gated by the player's features.
 * Tap the body for more-info.
 */
export function MediaCard({ config }: CardComponentProps<MediaCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();

  const dead = isUnavailable(e);
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const v = readMedia(e, dead);

  const hasTrack = v.active && !!v.mediaTitle;
  const title = !config.entity ? 'Select a media player' : hasTrack ? v.mediaTitle : name;
  const subtitle = !config.entity
    ? 'Set up'
    : dead
      ? 'Unavailable'
      : hasTrack
        ? v.mediaSub || name
        : prettyState(v.state);

  const supports = (bit: number) => !!e && supportsFeature(e, bit);
  const ctl = (service: string) => (ev: MouseEvent) => {
    ev.stopPropagation();
    if (config.entity) call('media_player', service, {}, { entity_id: config.entity });
  };
  const stopKey = (ev: ReactKeyboardEvent) => ev.stopPropagation();
  const open = () => config.entity && moreInfo(config.entity);

  const cls = `simui-media${v.active ? ' is-on' : ''}${dead || !config.entity ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--tile-tint' as string]: v.tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${subtitle}`}
      tabIndex={0}
      onClick={open}
      onKeyDown={(ev: ReactKeyboardEvent) => {
        if (isActivateKey(ev.key)) {
          ev.preventDefault();
          open();
        }
      }}
      onContextMenu={(ev) => {
        ev.preventDefault();
        open();
      }}
    >
      <span
        className="simui-media-art"
        style={v.art ? { backgroundImage: `url("${v.art}")` } : undefined}
        aria-hidden="true"
      >
        {!v.art && <Music size={20} strokeWidth={2} />}
      </span>

      <span className="simui-media-body">
        <span className="simui-media-title" title={title}>{title}</span>
        <span className="simui-media-sub" title={subtitle}>{subtitle}</span>
      </span>

      {config.entity && !dead && v.active && (
        <span className="simui-media-ctrl">
          {supports(MEDIA_PREVIOUS) && (
            <button type="button" className="simui-media-btn" aria-label="Previous" onClick={ctl('media_previous_track')} onKeyDown={stopKey}>
              <SkipBack size={17} fill="currentColor" />
            </button>
          )}
          {(supports(MEDIA_PLAY) || supports(MEDIA_PAUSE)) && (
            <button
              type="button"
              className="simui-media-btn primary"
              aria-label={v.playing ? 'Pause' : 'Play'}
              onClick={ctl('media_play_pause')}
              onKeyDown={stopKey}
            >
              {v.playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
          )}
          {supports(MEDIA_NEXT) && (
            <button type="button" className="simui-media-btn" aria-label="Next" onClick={ctl('media_next_track')} onKeyDown={stopKey}>
              <SkipForward size={17} fill="currentColor" />
            </button>
          )}
        </span>
      )}
    </div>
  );
}
