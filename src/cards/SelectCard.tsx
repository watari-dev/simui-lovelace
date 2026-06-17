import { type CSSProperties, type MouseEvent } from 'react';
import { ListChecks } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { labelOption, readSelect, type SelectOption } from './select-util';
import { ChipRow, accentVar, discIcon, type ActionChip } from './luminous';

export interface SelectCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (default cool). */
  color?: string;
  /** Picker style: auto (chips or dropdown) · chips · dropdown · cycle (tap disc to advance). */
  mode?: 'auto' | 'chips' | 'dropdown' | 'cycle';
  /** Max options shown as chips in auto mode (default 5); above this → dropdown. */
  chip_threshold?: number;
  /** Per-option relabel / icon (does not add or remove options). */
  options?: SelectOption[];
  /** Show the picker control (default true). */
  show_control?: boolean;
  /** Custom action buttons beneath the picker. */
  buttons?: ActionChip[];
  compact?: boolean;
}

const HARD_CAP = 12;

/**
 * SimUI select card — the Luminous tile for select / input_select: the current option big, and a
 * picker — chips for a few options, a compact dropdown for many, or a tap-to-cycle disc. Honours
 * both `select` and `input_select` automatically.
 */
export function SelectCard({ config }: CardComponentProps<SelectCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const actions = useActionHandler(config, config.entity);
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readSelect(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--cool)' } as CSSProperties} role="button" aria-label="Select an option list" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(ListChecks, compact ? 18 : 21)}</span></div>
          <div className="cname">Select an option list</div>
        </div>
      </div>
    );
  }

  const setOption = (opt: string) => { if (!dead) call(v.serviceDomain, 'select_option', { option: opt }, { entity_id: config.entity }); };
  const stop = (ev: { stopPropagation: () => void }) => ev.stopPropagation();

  const resolved =
    config.mode === 'cycle' ? 'cycle'
      : config.mode === 'dropdown' ? 'dropdown'
        : config.mode === 'chips' ? (v.count > HARD_CAP ? 'dropdown' : 'chips')
          : v.count === 0 ? 'none'
            : v.count <= (config.chip_threshold ?? 5) ? 'chips' : 'dropdown';

  const discTap = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    if (config.mode === 'cycle' && v.next) setOption(v.next);
    else moreInfo(config.entity);
  };

  const currentLabel = dead ? 'Unavailable' : v.current != null ? labelOption(v.current, config.options) : '—';
  const sz = currentLabel.length > 14 ? '20px' : currentLabel.length > 9 ? '26px' : '32px';
  const showControl = !compact && config.show_control !== false && resolved !== 'none';
  const useNative = resolved === 'dropdown' || (compact && config.show_control !== false && resolved !== 'cycle' && resolved !== 'none');

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? v.tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${currentLabel}`}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <button type="button" className="disc" aria-label="Options" onClick={discTap} onPointerDown={stop}>
            {renderIcon(config.icon ?? v.entityIcon, compact ? 18 : 21, discIcon(ListChecks, compact ? 18 : 21))}
          </button>
          {compact ? <div className="num selval" style={{ fontSize: '18px' }}>{currentLabel}</div> : <div className="badge"><span className="pt" />{dead ? 'Off' : `${v.count} options`}</div>}
        </div>
        {compact ? (
          <div className="cname" title={name}>{name}</div>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap"><div className="num selval" style={{ fontSize: sz }}>{currentLabel}</div></div>
          </div>
        )}
      </div>
      <div className="ctl">
        {(showControl || (compact && config.show_control !== false && resolved !== 'none')) && (
          useNative ? (
            <select className="selnative" value={v.current ?? ''} disabled={dead} onChange={(ev) => { ev.stopPropagation(); setOption(ev.target.value); }} onClick={stop} onPointerDown={stop}>
              {v.index < 0 && <option value="" disabled>—</option>}
              {v.options.map((o) => <option key={o} value={o}>{labelOption(o, config.options)}</option>)}
            </select>
          ) : resolved === 'cycle' ? (
            <div className="chips">
              <button type="button" disabled={dead || v.count < 2} onClick={(ev) => { stop(ev); if (v.prev) setOption(v.prev); }} onPointerDown={stop}>‹ Prev</button>
              <button type="button" disabled={dead || v.count < 2} onClick={(ev) => { stop(ev); if (v.next) setOption(v.next); }} onPointerDown={stop}>Next ›</button>
            </div>
          ) : resolved === 'chips' ? (
            <div className="chips selchips">
              {v.options.slice(0, HARD_CAP).map((o) => {
                const ov = config.options?.find((x) => x.option === o);
                return (
                  <button key={o} type="button" className={o === v.current ? 'on' : ''} disabled={dead} onClick={(ev) => { stop(ev); setOption(o); }} onPointerDown={stop}>
                    {ov?.icon ? <span className="chip-ic">{renderIcon(ov.icon, 15, null)}</span> : null}{labelOption(o, config.options)}
                  </button>
                );
              })}
            </div>
          ) : null
        )}
        {!compact && <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />}
      </div>
    </div>
  );
}
