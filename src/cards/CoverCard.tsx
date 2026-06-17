import { type CSSProperties } from 'react';
import { Blinds } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { ActionConfig } from '../core/actions';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { readCover } from './cover-util';
import { DotBar, Seg2, Sec, TileHead, accentVar, discIcon, sliderKeys, type SliderStyle } from './luminous';

/** One configurable cover button — a service, a position/tilt preset, or an action. */
export interface CoverButton {
  name?: string;
  icon?: string;
  /** A cover service: open · close · stop · toggle. */
  service?: 'open' | 'close' | 'stop' | 'toggle';
  /** Move to a specific opening position (0–100). */
  position?: number;
  /** Move to a specific tilt (0–100). */
  tilt?: number;
  /** Run an arbitrary action instead. */
  tap_action?: ActionConfig;
}

export interface CoverCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (overrides the default cover tint). */
  color?: string;
  /** Position slider style: dots (default) · bar · line · none (hidden). */
  slider?: SliderStyle | 'none';
  /** What the slider sets: position (default) or tilt (for venetian/tilting covers). */
  slider_target?: 'position' | 'tilt';
  /** Show the button row (default true). */
  show_buttons?: boolean;
  /** The buttons. Omit for the default Open / Stop / Close. */
  buttons?: CoverButton[];
  compact?: boolean;
}

const DEFAULT_COVER_BUTTONS: CoverButton[] = [
  { name: 'Open', icon: 'mdi:arrow-up', service: 'open' },
  { name: 'Stop', icon: 'mdi:stop', service: 'stop' },
  { name: 'Close', icon: 'mdi:arrow-down', service: 'close' },
];

/**
 * SimUI cover card — the Luminous tile for blinds/garage/shades: a device-class disc, the
 * open-percent big, the signature dot-bar (drag to set position), and ▲ Open / Stop / ▼ Close
 * chips gated by the cover's features.
 */
export function CoverCard({ config }: CardComponentProps<CoverCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runButton = useActions();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readCover(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  // The slider can drive position (default) or tilt, for venetian/tilting covers.
  const tiltMode = config.slider_target === 'tilt' && v.canTilt;
  const setPosition = (p: number) => call('cover', 'set_cover_position', { position: p }, { entity_id: config.entity });
  const setTilt = (p: number) => call('cover', 'set_cover_tilt_position', { tilt_position: p }, { entity_id: config.entity });
  const sliderSettable = tiltMode ? !dead && v.tilt != null : v.settable;
  const sliderLive = tiltMode ? v.tilt ?? 0 : v.position ?? 0;
  const setSlider = tiltMode ? setTilt : setPosition;
  const drag = useDragValue({ value: sliderLive, axis: 'horizontal', step: 1, min: 0, max: 100, disabled: !sliderSettable, onCommit: setSlider });
  const sliderVal = sliderSettable ? drag.value : sliderLive;
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
  const hasSlider = tiltMode ? v.tilt != null : v.position != null;
  const fullyOpen = v.position != null ? v.position === 100 : v.open;
  const fullyClosed = v.position != null ? v.position === 0 : !v.open;

  const valueNode = hasSlider ? <>{sliderVal}<span className="u">%</span></> : v.open ? 'Open' : 'Closed';

  const svc = (s: string, data?: Record<string, unknown>) => () => call('cover', s, data ?? {}, { entity_id: config.entity });
  const buttons = config.buttons ?? DEFAULT_COVER_BUTTONS;
  const resolveButton = (b: CoverButton): { run?: () => void; disabled: boolean; active: boolean } => {
    if (b.tap_action) return { run: () => runButton(b.tap_action, config.entity), disabled: dead, active: false };
    if (b.position != null) return { run: svc('set_cover_position', { position: b.position }), disabled: dead || !v.settable, active: v.position === b.position };
    if (b.tilt != null) return { run: svc('set_cover_tilt_position', { tilt_position: b.tilt }), disabled: dead || !v.canTilt, active: v.tilt === b.tilt };
    switch (b.service) {
      case 'open': { const run = v.canOpen ? svc('open_cover') : v.settable ? svc('set_cover_position', { position: 100 }) : undefined; return { run, disabled: !run || (fullyOpen && !v.moving), active: false }; }
      case 'close': { const run = v.canClose ? svc('close_cover') : v.settable ? svc('set_cover_position', { position: 0 }) : undefined; return { run, disabled: !run || (fullyClosed && !v.moving), active: false }; }
      case 'stop': { const run = v.canStop ? svc('stop_cover') : undefined; return { run, disabled: !run, active: v.moving }; }
      case 'toggle': return { run: svc('toggle'), disabled: dead, active: false };
      default: return { disabled: true, active: false };
    }
  };

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
        {compact ? (
          <>
            <div className="thead"><span className="disc" aria-hidden="true">{renderIcon(config.icon, 18, discIcon(Icon, 18))}</span><div className="num tnum">{valueNode}</div></div>
            <div className="cname" title={name}>{name}</div>
          </>
        ) : (
          <>
            <TileHead disc={<span className="disc" aria-hidden="true">{renderIcon(config.icon, 21, discIcon(Icon, 21))}</span>} name={name} active={v.open} />
            <div className="valrow">
              <div className="numwrap"><div className="num tnum">{valueNode}</div><div className="nsub">{tiltMode ? 'Tilt' : 'Position'}</div></div>
              <Sec stats={!tiltMode && v.canTilt && v.tilt != null ? [{ l: 'Tilt', v: <>{v.tilt}<span className="u">°</span></> }] : undefined} />
            </div>
          </>
        )}
      </div>
      <div className="ctl">
        {hasSlider && config.slider !== 'none' && (
          <DotBar
            value={sliderVal}
            segments={compact ? 12 : 14}
            settable={sliderSettable}
            handlers={drag.handlers}
            ariaLabel={`${name} ${tiltMode ? 'tilt' : 'position'}`}
            onKeyDown={sliderKeys(sliderVal, setSlider)}
            variant={config.slider ?? 'dots'}
          />
        )}
        {!compact && config.show_buttons !== false && buttons.length > 0 && (
          <Seg2 items={buttons.map((b, i) => { const { run, disabled, active } = resolveButton(b); return { key: String(i), label: b.name, icon: b.icon, active, disabled, onClick: () => run?.() }; })} />
        )}
      </div>
    </div>
  );
}
