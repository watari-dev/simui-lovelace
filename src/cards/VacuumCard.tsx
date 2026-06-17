import { type CSSProperties, type MouseEvent } from 'react';
import { Bot } from 'lucide-react';
import { useActions, useCallService, useEntity, useLanguage, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { ACTION_LABEL, readVacuum, type VacuumAction } from './vacuum-util';
import { ChipRow, DotBar, accentVar, discIcon, type ActionChip } from './luminous';

export interface VacuumCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (overrides the state-based tint). */
  color?: string;
  /** Which action chips to show, in order. Empty ⇒ auto from supported_features. */
  actions?: VacuumAction[];
  /** Show fan-speed chips (default true). */
  show_fan_speed?: boolean;
  /** Show the battery level (default true). */
  show_battery?: boolean;
  /** Show the status caption line (default true). */
  show_status?: boolean;
  /** Custom action buttons beneath the control rows. */
  buttons?: ActionChip[];
  compact?: boolean;
}

/**
 * SimUI vacuum card — the Luminous tile for a robot vacuum: a state-tinted disc (tap to start /
 * pause), the state big, the battery level, and Clean / Pause / Stop / Dock / Locate chips gated
 * by the vacuum's features. Degrades to a clean state tile for minimal integrations.
 */
export function VacuumCard({ config }: CardComponentProps<VacuumCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const actions = useActionHandler(config, config.entity);
  const locale = useLanguage();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readVacuum(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--up)' } as CSSProperties} role="button" aria-label="Select a vacuum" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Bot, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a vacuum</div>
        </div>
      </div>
    );
  }

  const svc = (s: string, data?: Record<string, unknown>) => () => { if (!dead) call('vacuum', s, data ?? {}, { entity_id: config.entity }); };
  const runAction = (a: VacuumAction) => svc(a)();
  const discTap = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    if (v.cleaning) {
      if (v.canPause) runAction('pause');
      else if (v.canStop) runAction('stop');
      else moreInfo(config.entity);
    } else if (v.canStart) runAction('start');
    else moreInfo(config.entity);
  };

  const chosen = (config.actions ?? v.available).filter((a) => v.available.includes(a));
  const chipDisabled = (a: VacuumAction): boolean =>
    dead || (a === 'start' && v.cleaning) || (a === 'pause' && !v.cleaning) || (a === 'stop' && (v.state === 'docked' || v.state === 'idle'));
  const chipActive = (a: VacuumAction): boolean =>
    (a === 'start' && v.state === 'cleaning') || (a === 'pause' && v.state === 'paused') || (a === 'return_to_base' && v.state === 'returning');
  const chipLabel = (a: VacuumAction): string => (a === 'start' && v.state === 'paused' ? 'Resume' : ACTION_LABEL[a]);

  const word = dead ? 'Unavailable' : v.word;
  const stop = (ev: MouseEvent) => ev.stopPropagation();
  const time = e?.last_changed ? new Date(e.last_changed).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : null;
  const caption = dead ? 'Unavailable' : `${v.caption}${time && !v.cleaning ? ` · ${time}` : ''}`;
  const showBattery = config.show_battery !== false && v.battery != null;

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${v.cleaning ? ' cleaning' : ''}${v.error ? ' triggered' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? v.tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${v.word}`}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <button type="button" className="disc" aria-label={v.cleaning ? 'Pause' : 'Start'} disabled={dead} onClick={discTap} onPointerDown={stop}>
            {renderIcon(config.icon, compact ? 18 : 21, discIcon(v.Icon, compact ? 18 : 21))}
          </button>
          {compact ? <span /> : <div className="badge"><span className="pt" />{v.short}</div>}
        </div>
        {compact ? (
          <div className="cname">{word}{showBattery && <span style={{ color: 'var(--muted)', fontWeight: 600 }}> · {v.battery}%</span>}</div>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap"><div className="num" style={{ fontSize: '32px' }}>{word}</div>{showBattery && <div className="nsub">{v.battery}% battery</div>}</div>
          </div>
        )}
      </div>
      <div className="ctl">
        {!compact && showBattery && <DotBar value={v.battery ?? 0} segments={14} settable={false} ariaLabel={`${name} battery`} variant="line" />}
        {compact ? (
          config.show_status !== false && <div className="csub">{caption}</div>
        ) : (
          <>
            <div className="hr" />
            {config.show_status !== false && <div className="ltxt" style={{ fontSize: '12px', color: 'var(--muted)' }}>{caption}</div>}
            {chosen.length > 0 && (
              <div className="chips">
                {chosen.map((a) => (
                  <button key={a} type="button" className={chipActive(a) ? 'on' : ''} disabled={chipDisabled(a)} onClick={(ev) => { stop(ev); runAction(a); }} onPointerDown={stop}>{chipLabel(a)}</button>
                ))}
              </div>
            )}
            {config.show_fan_speed !== false && v.hasFanSpeed && (
              <div className="chips">
                {v.fanSpeedList.map((s) => (
                  <button key={s} type="button" className={v.fanSpeed === s ? 'on' : ''} disabled={dead} onClick={(ev) => { stop(ev); svc('set_fan_speed', { fan_speed: s })(); }} onPointerDown={stop}>{s}</button>
                ))}
              </div>
            )}
            <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />
          </>
        )}
      </div>
    </div>
  );
}
