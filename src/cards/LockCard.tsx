import { type CSSProperties, type MouseEvent } from 'react';
import { Lock, LockOpen } from 'lucide-react';
import { useActions, useCallService, useEntity, useLanguage, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable, prettyState } from '../util';
import { renderIcon } from '../core/icon';
import { discIcon } from './luminous';

export interface LockCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  compact?: boolean;
}

// Lock states → accent: locked = secure (green); unlocked/open = attention (coral);
// jammed = alert (coral); in-progress = active (blue).
const TINT: Record<string, string> = {
  locked: 'var(--up)',
  unlocked: 'var(--down)',
  open: 'var(--down)',
  jammed: 'var(--down)',
  locking: 'var(--cool)',
  unlocking: 'var(--cool)',
};
const WORD: Record<string, string> = { locked: 'Secured', unlocked: 'Unlocked', open: 'Open', jammed: 'Jammed' };

/**
 * SimUI lock card — the Luminous tile for a lock: a disc tinted by state (green secured,
 * coral unlocked), the state as a big word, and a toggle switch on a captioned bottom row.
 * Flipping the switch / tapping the disc locks or unlocks.
 */
export function LockCard({ config }: CardComponentProps<LockCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runTap = useActions();
  const locale = useLanguage();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const state = e?.state ?? 'unknown';
  const locked = state === 'locked';
  const transitioning = state === 'locking' || state === 'unlocking';
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const tint = TINT[state] ?? 'var(--cool)';
  const Icon = locked || state === 'locking' || state === 'jammed' ? Lock : LockOpen;
  const word = dead ? 'Unavailable' : WORD[state] ?? prettyState(state);

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--up)' } as CSSProperties} role="button" aria-label="Select a lock" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Lock, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a lock</div>
        </div>
      </div>
    );
  }

  const time = e?.last_changed ? new Date(e.last_changed).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : null;
  const caption = dead ? 'Unavailable' : `${prettyState(state)}${time ? ` · ${time}` : ''}`;

  const toggle = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead || transitioning) return;
    call('lock', locked ? 'unlock' : 'lock', {}, { entity_id: config.entity });
  };

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${locked ? ' locked' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${prettyState(state)}`}
      tabIndex={0}
      onClick={() => runTap(config.tap_action, config.entity)}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <button type="button" className="disc" aria-label={locked ? 'Unlock' : 'Lock'} disabled={transitioning} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()}>
            {renderIcon(config.icon, compact ? 18 : 21, discIcon(Icon, compact ? 18 : 21))}
          </button>
          {compact ? (
            <button type="button" className="sw" aria-label={locked ? 'Unlock' : 'Lock'} aria-pressed={locked} disabled={transitioning} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()} />
          ) : (
            <div className="badge"><span className="pt" />{dead ? 'Off' : locked ? 'Locked' : prettyState(state)}</div>
          )}
        </div>
        {compact ? (
          <div className="cname">{word}</div>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap"><div className="num" style={{ fontSize: '32px' }}>{word}</div></div>
          </div>
        )}
      </div>
      <div className="ctl">
        {compact ? (
          <div className="csub">{caption}</div>
        ) : (
          <>
            <div className="hr" />
            <div className="lockrow">
              <div className="ltxt">{caption}</div>
              <button type="button" className="sw" aria-label={locked ? 'Unlock' : 'Lock'} aria-pressed={locked} disabled={transitioning} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
