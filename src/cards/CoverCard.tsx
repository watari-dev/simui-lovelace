import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { Blinds } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable, stepKey } from '../util';
import { renderIcon } from '../core/icon';
import { readCover } from './cover-util';

export interface CoverCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
}

/**
 * SimUI cover card — the ULM tile for blinds/garage/shades: a device-class icon disc, the
 * name, and an "N% open" line. Drag the tile to set position (covers that support it); tap
 * the disc to open/close (or stop while moving); tap the body for more-info.
 */
export function CoverCard({ config }: CardComponentProps<CoverCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runTap = useActions();

  const dead = isUnavailable(e);
  const v = readCover(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  const drag = useDragValue({
    value: v.position ?? 0,
    axis: 'vertical',
    step: 1,
    disabled: !v.settable,
    onCommit: (p) => call('cover', 'set_cover_position', { position: p }, { entity_id: config.entity }),
  });

  if (!config.entity) {
    return (
      <div className="simui-tile is-unavailable" role="button" aria-label="Select a cover" tabIndex={0}>
        <span className="simui-tile-ic" aria-hidden="true">
          <Blinds size={20} strokeWidth={2} />
        </span>
        <span className="simui-tile-name">Select a cover</span>
        <span className="simui-tile-state">Set up</span>
      </div>
    );
  }

  const position = v.settable ? drag.value : v.position;
  const label = v.settable && !v.moving && position != null
    ? position === 0 ? 'Closed' : position === 100 ? 'Open' : `${position}% open`
    : v.label;

  const onBody = () => {
    if (drag.moved()) return;
    runTap(config.tap_action, config.entity);
  };
  const closed = v.position != null ? v.position === 0 : e?.state === 'closed';
  const onIcon = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    if (v.moving) {
      if (v.canStop) call('cover', 'stop_cover', {}, { entity_id: config.entity });
      return;
    }
    // Honour the OPEN/CLOSE feature bits; fall back to set_position for position-only covers.
    if (closed) {
      if (v.canOpen) call('cover', 'open_cover', {}, { entity_id: config.entity });
      else if (v.settable) call('cover', 'set_cover_position', { position: 100 }, { entity_id: config.entity });
    } else {
      if (v.canClose) call('cover', 'close_cover', {}, { entity_id: config.entity });
      else if (v.settable) call('cover', 'set_cover_position', { position: 0 }, { entity_id: config.entity });
    }
  };
  const onKeyDown = (ev: ReactKeyboardEvent) => {
    if (v.settable && position != null) {
      const next = stepKey(ev.key, position, 5, 0, 100);
      if (next != null) {
        ev.preventDefault();
        call('cover', 'set_cover_position', { position: next }, { entity_id: config.entity });
        return;
      }
    }
    if (isActivateKey(ev.key)) {
      ev.preventDefault();
      onBody();
    }
  };

  const Icon = v.Icon;
  const settable = v.settable;
  // The disc only acts when the relevant feature exists (or position is settable).
  const discActionable = v.moving ? v.canStop : closed ? v.canOpen || v.settable : v.canClose || v.settable;
  const discLabel = v.moving ? (v.canStop ? 'Stop' : 'Moving') : closed ? 'Open' : 'Close';
  // Disc is tinted when open/moving, dim when closed (is-on gated on v.open).
  const cls =
    `simui-tile${v.open ? ' is-on' : ''}${drag.dragging ? ' is-dragging' : ''}${dead ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--tile-tint' as string]: v.tint } as CSSProperties}
      role={settable ? 'slider' : 'button'}
      aria-label={settable ? `${name} position` : name}
      aria-valuemin={settable ? 0 : undefined}
      aria-valuemax={settable ? 100 : undefined}
      aria-valuenow={settable && position != null ? position : undefined}
      aria-valuetext={settable && position != null ? `${position}% open` : undefined}
      tabIndex={0}
      onClick={onBody}
      onKeyDown={onKeyDown}
      onContextMenu={(ev) => {
        ev.preventDefault();
        moreInfo(config.entity);
      }}
      {...(settable ? drag.handlers : {})}
    >
      <button
        type="button"
        className="simui-tile-ic"
        aria-label={discLabel}
        disabled={!discActionable}
        onClick={onIcon}
        onPointerDown={(ev) => ev.stopPropagation()}
        onKeyDown={(ev) => ev.stopPropagation()}
      >
        {renderIcon(config.icon, 20, <Icon size={20} strokeWidth={2} />)}
      </button>
      <span className="simui-tile-name" title={name}>{name}</span>
      <span className="simui-tile-state">{dead ? 'Unavailable' : label}</span>
    </div>
  );
}
