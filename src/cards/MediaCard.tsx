import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, useEffect, useState } from 'react';
import { Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable, prettyState, supportsFeature } from '../util';
import { renderIcon } from '../core/icon';
import { MEDIA_NEXT, MEDIA_PAUSE, MEDIA_PLAY, MEDIA_PREVIOUS, readMedia } from './media-util';

export interface MediaCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
}

const mmss = (s: number): string => (Number.isFinite(s) && s >= 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '');

/**
 * SimUI media card — the Luminous player: album art (or a spinning vinyl disc), the eyebrow
 * "Now Playing", title + artist, a progress scrubber with times, and centred transport
 * controls (prev / play-pause / next) gated by the player's features.
 */
export function MediaCard({ config }: CardComponentProps<MediaCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runTap = useActions();

  const dead = isUnavailable(e);
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const v = readMedia(e, dead);
  const acc = '#b06ef0';

  const hasTrack = v.active && !!v.mediaTitle;
  const title = !config.entity ? 'Select a media player' : hasTrack ? v.mediaTitle : name;
  const sub = !config.entity ? 'Set up' : dead ? 'Unavailable' : hasTrack ? v.mediaSub || name : prettyState(v.state);
  const eyebrow = v.active ? `Now Playing · ${name}` : name;

  // Live scrubber: HA samples media_position once (at positionUpdatedAt), so during playback we
  // advance it locally on a 1s tick instead of letting it sit frozen between HA state pushes.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!v.playing || v.positionUpdatedAt == null || v.position == null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [v.playing, v.positionUpdatedAt, v.position]);
  const livePos =
    v.position == null
      ? null
      : v.playing && v.positionUpdatedAt != null
        ? Math.min(v.duration ?? Infinity, v.position + (now - v.positionUpdatedAt) / 1000)
        : v.position;
  const pct = v.duration && livePos != null ? Math.max(0, Math.min(100, (livePos / v.duration) * 100)) : 0;

  const supports = (bit: number) => !!e && supportsFeature(e, bit);
  const ctl = (service: string) => (ev: MouseEvent) => { ev.stopPropagation(); if (config.entity) call('media_player', service, {}, { entity_id: config.entity }); };
  const stopKey = (ev: ReactKeyboardEvent) => ev.stopPropagation();
  const open = () => config.entity && runTap(config.tap_action, config.entity);

  return (
    <div
      className={`card media${dead || !config.entity ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: acc, height: '100%' } as CSSProperties}
      role="button"
      aria-label={`${title}: ${sub}`}
      tabIndex={0}
      onClick={open}
      onKeyDown={(ev: ReactKeyboardEvent) => { if (isActivateKey(ev.key)) { ev.preventDefault(); open(); } }}
      onContextMenu={(ev) => { ev.preventDefault(); if (config.entity) moreInfo(config.entity); }}
    >
      <div className={`art${v.art ? ' has-art' : ''}`} style={v.art ? { backgroundImage: `url("${v.art}")` } : undefined} aria-hidden="true">
        {!v.art && <div className="disc-spin" style={{ animationPlayState: v.playing ? 'running' : 'paused' }} />}
        {!v.art && (
          <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.85)' }}>
            {renderIcon(config.icon, 26, <Music size={26} strokeWidth={1.8} />)}
          </span>
        )}
      </div>

      <div className="minfo">
        <div className="meye" title={eyebrow}>{eyebrow}</div>
        <div className="mtitle" title={title}>{title}</div>
        <div className="martist" title={sub}>{sub}</div>
        {v.active && v.duration ? (
          <>
            <div className="scrub"><i style={{ width: `${pct}%` }} /></div>
            <div className="mtime"><span>{mmss(livePos ?? 0)}</span><span>{mmss(v.duration)}</span></div>
          </>
        ) : null}
        {config.entity && !dead && (v.active || supports(MEDIA_PLAY) || supports(MEDIA_PAUSE)) && (
          <div className="transport">
            {supports(MEDIA_PREVIOUS) && (
              <button type="button" className="mbtn" aria-label="Previous" onClick={ctl('media_previous_track')} onPointerDown={(ev) => ev.stopPropagation()} onKeyDown={stopKey}><SkipBack /></button>
            )}
            {(supports(MEDIA_PLAY) || supports(MEDIA_PAUSE)) && (
              <button type="button" className="mbtn play" aria-label={v.playing ? 'Pause' : 'Play'} onClick={ctl('media_play_pause')} onPointerDown={(ev) => ev.stopPropagation()} onKeyDown={stopKey}>{v.playing ? <Pause /> : <Play />}</button>
            )}
            {supports(MEDIA_NEXT) && (
              <button type="button" className="mbtn" aria-label="Next" onClick={ctl('media_next_track')} onPointerDown={(ev) => ev.stopPropagation()} onKeyDown={stopKey}><SkipForward /></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
