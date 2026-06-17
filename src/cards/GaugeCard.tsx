import { type CSSProperties } from 'react';
import { Gauge } from 'lucide-react';
import { useActions, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { readGauge } from './gauge-util';
import { ChipRow, GaugeArc, discIcon, type ActionChip } from './luminous';

/** One severity band: starts at `from`, runs to the next band (or max). `color` is an accent token. */
export interface GaugeSeverity {
  from: number;
  color?: string;
}

export interface GaugeCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Arc start (default 0). */
  min?: number;
  /** Arc end (default 100 for %, else auto from the value). */
  max?: number;
  /** Force an accent colour — overrides the device-class tint and the severity colour. */
  color?: string;
  /** Coloured thresholds. Each band starts at `from` and runs to the next band (or max). */
  severity?: GaugeSeverity[];
  /** Tint the whole fill by the active band (default true). */
  severity_fill?: boolean;
  /** Decimal places for the centre value. Default: 0 for integers, else 1. */
  precision?: number;
  /** Show the unit beside the value (default true). */
  show_unit?: boolean;
  /** Show min / max end-labels (default true; hidden when compact). */
  show_minmax?: boolean;
  /** Custom action buttons beneath the gauge. */
  buttons?: ActionChip[];
  compact?: boolean;
}

const fmt = (n: number, p: number): string => (Number.isInteger(n) && p === 0 ? `${n}` : n.toFixed(p));

/**
 * SimUI gauge card — a radial gauge for any numeric entity: a 270° Luminous arc filled to the
 * value within its range, the value big in the centre, optional severity colour bands. A
 * TradingView-precise read-out tile; read-only (tap → more-info / configured action).
 */
export function GaugeCard({ config }: CardComponentProps<GaugeCardConfig>) {
  const e = useEntity(config.entity);
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const actions = useActionHandler(config, config.entity);
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readGauge(e, config, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--cool)' } as CSSProperties} role="button" aria-label="Select a Gauge" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Gauge, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a Gauge</div>
        </div>
      </div>
    );
  }

  const num = v.valid ? fmt(v.value, v.precision) : dead ? 'Unavailable' : v.label;
  const showUnit = v.valid && config.show_unit !== false && !!v.unit;
  const value = <>{num}{showUnit && <span className="u">{v.unit}</span>}</>;

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: v.activeColor } as CSSProperties}
      role="button"
      aria-label={`${name}: ${v.valid ? num + (v.unit ?? '') : v.label}`}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <span className="disc" aria-hidden="true">{renderIcon(config.icon, compact ? 18 : 21, discIcon(v.Icon, compact ? 18 : 21))}</span>
          {compact ? <div className="num tnum">{value}</div> : <span />}
        </div>
        {compact ? <div className="cname" title={name}>{name}</div> : <div className="eye" title={name}>{name}</div>}
      </div>
      <div className="ctl">
        {compact ? (
          <div className="gauge compact"><GaugeArc pct={v.pct} color={v.activeColor} size={84} strokeWidth={9} /></div>
        ) : (
          <>
            <div className="gauge">
              <GaugeArc pct={v.pct} color={v.activeColor} />
              <div className="gauge-center"><div className="num tnum">{value}</div></div>
            </div>
            {config.show_minmax !== false && <div className="gauge-ends"><span>{fmt(v.min, 0)}</span><span>{fmt(v.max, 0)}</span></div>}
            <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />
          </>
        )}
      </div>
    </div>
  );
}
