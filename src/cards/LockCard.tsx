import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { Lock, LockOpen } from 'lucide-react';
import { useCallService, useEntity, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable, prettyState } from '../util';
import { renderIcon } from '../core/icon';

export interface LockCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
}

// Lock states → tint: locked = secure (green), unlocked = attention (amber),
// jammed = alert (coral), in-progress = active (blue).
const TINT: Record<string, string> = {
  locked: 'var(--up)',
  unlocked: 'var(--warm)',
  open: 'var(--warm)',
  jammed: 'var(--down)',
  locking: 'var(--cool)',
  unlocking: 'var(--cool)',
};

/**
 * SimUI lock card — the ULM tile for a lock: an icon disc tinted by state (locked → green,
 * unlocked → amber, jammed → coral). Tap the disc to lock/unlock; tap the body for more-info.
 */
export function LockCard({ config }: CardComponentProps<LockCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();

  const dead = isUnavailable(e);
  const state = e?.state ?? 'unknown';
  const locked = state === 'locked';
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const tint = TINT[state] ?? 'var(--cool)';
  const Icon = locked || state === 'locking' || state === 'jammed' ? Lock : LockOpen;

  const transitioning = state === 'locking' || state === 'unlocking';
  const open = () => config.entity && moreInfo(config.entity);
  const onIcon = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead || !config.entity || transitioning) return; // don't fight an in-progress lock/unlock
    call('lock', locked ? 'unlock' : 'lock', {}, { entity_id: config.entity });
  };

  if (!config.entity) {
    return (
      <div className="simui-tile is-unavailable" role="button" aria-label="Select a lock" tabIndex={0}>
        <span className="simui-tile-ic" aria-hidden="true">
          <Lock size={20} strokeWidth={2} />
        </span>
        <span className="simui-tile-name">Select a lock</span>
        <span className="simui-tile-state">Set up</span>
      </div>
    );
  }

  const cls = `simui-tile${!dead ? ' is-on' : ''}${dead ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--tile-tint' as string]: tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${prettyState(state)}`}
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
      <button
        type="button"
        className="simui-tile-ic"
        aria-label={state === 'locking' ? 'Locking' : state === 'unlocking' ? 'Unlocking' : locked ? 'Unlock' : 'Lock'}
        disabled={transitioning}
        onClick={onIcon}
        onPointerDown={(ev) => ev.stopPropagation()}
        onKeyDown={(ev) => ev.stopPropagation()}
      >
        {renderIcon(config.icon, 20, <Icon size={20} strokeWidth={2} />)}
      </button>
      <span className="simui-tile-name" title={name}>{name}</span>
      <span className="simui-tile-state">{dead ? 'Unavailable' : prettyState(state)}</span>
    </div>
  );
}
