import { type CSSProperties, type MouseEvent } from 'react';
import { Blinds } from 'lucide-react';
import { useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable, prettyState } from '../util';
import { renderIcon } from '../core/icon';
import { readCover } from './cover-util';
import { DotBar, accentVar, discIcon, sliderKeys, type SliderStyle } from './luminous';

export interface CoverCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (overrides the default cover tint). */
  color?: string;
  /** Position slider style: dots (default) · bar · line · none (hidden). */
  slider?: SliderStyle | 'none';
  /** Show the Open / Stop / Close buttons (default true). */
  show_buttons?: boolean;
  compact?: boolean;
}

/**
 * SimUI cover card — the Luminous tile for blinds/garage/shades: a device-class disc, the
 * open-percent big, the signature dot-bar (drag to set position), and ▲ Open / Stop / ▼ Close
 * chips gated by the cover's features.
 */
export function CoverCard({ config }: CardComponentProps<CoverCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readCover(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  const setPosition = (p: number) => call('cover', 'set_cover_position', { position: p }, { entity_id: config.entity });
  const drag = useDragValue({ value: v.position ?? 0, axis: 'horizontal', step: 1, min: 0, max: 100, disabled: !v.settable, onCommit: setPosition });
  const position = v.settable ? drag.value : v.position;
  const actions = useActionHandler(config, config.entity, { moved: drag.moved });

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--cool)' } as CSSProperties} role="button" aria-label="Select a cover" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Blinds, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a cover</div>
        </div>
      </div>
    );
  }

  const Icon = v.Icon;
  const hasPos = position != null;
  const badge = dead ? 'Off' : v.moving ? prettyState(e?.state ?? '') : v.open ? 'Open' : 'Closed';
  const fullyOpen = v.position != null ? v.position === 100 : v.open;
  const fullyClosed = v.position != null ? v.position === 0 : !v.open;

  const valueNode = hasPos ? <>{position}<span className="u">%</span></> : v.open ? 'Open' : 'Closed';

  const act = (svc: string, data?: Record<string, unknown>) => (ev: MouseEvent) => {
    ev.stopPropagation();
    call('cover', svc, data ?? {}, { entity_id: config.entity });
  };
  const onOpen = v.canOpen ? act('open_cover') : v.settable ? act('set_cover_position', { position: 100 }) : undefined;
  const onClose = v.canClose ? act('close_cover') : v.settable ? act('set_cover_position', { position: 0 }) : undefined;
  const onStop = v.canStop ? act('stop_cover') : undefined;

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? v.tint } as CSSProperties}
      role="button"
      aria-label={name}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <span className="disc" aria-hidden="true">{renderIcon(config.icon, compact ? 18 : 21, discIcon(Icon, compact ? 18 : 21))}</span>
          {compact ? <div className="num tnum">{valueNode}</div> : <div className="badge"><span className="pt" />{badge}</div>}
        </div>
        {compact ? (
          <div className="cname" title={name}>{name}</div>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap"><div className="num tnum">{valueNode}</div><div className="nsub">Position</div></div>
          </div>
        )}
      </div>
      <div className="ctl">
        {hasPos && config.slider !== 'none' && (
          <DotBar
            value={position ?? 0}
            segments={compact ? 12 : 14}
            settable={v.settable}
            handlers={drag.handlers}
            ariaLabel={`${name} position`}
            onKeyDown={sliderKeys(position ?? 0, setPosition)}
            variant={config.slider ?? 'dots'}
          />
        )}
        {!compact && config.show_buttons !== false && (
          <div className="chips">
            <button type="button" disabled={!onOpen || (fullyOpen && !v.moving)} onClick={onOpen} onPointerDown={(ev) => ev.stopPropagation()}>▲ Open</button>
            <button type="button" className={v.moving ? 'on' : ''} disabled={!onStop} onClick={onStop} onPointerDown={(ev) => ev.stopPropagation()}>Stop</button>
            <button type="button" disabled={!onClose || (fullyClosed && !v.moving)} onClick={onClose} onPointerDown={(ev) => ev.stopPropagation()}>▼ Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
