import { type CSSProperties, useMemo } from 'react';
import { useActions, useEntity, useHistory, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { domainOf, friendly, isActivateKey, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { formatSensor, sensorIcon, sensorTint, VALID_COLORS } from './sensor-util';
import { Sparkline, discIcon } from './luminous';

export interface SensorCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Override the device-class tint: warm | cool | up | down | grey. */
  color?: string;
  compact?: boolean;
}

const fmt1 = (n: number): string => (Number.isInteger(n) ? `${n}` : (Math.round(n * 10) / 10).toFixed(1));

/**
 * SimUI sensor card — the Luminous read-out tile: the value big, a device-class disc, a
 * "today" delta badge, and a sparkline of the last 24 h with a min–max / avg stat line.
 */
export function SensorCard({ config }: CardComponentProps<SensorCardConfig>) {
  const e = useEntity(config.entity);
  const moreInfo = useMoreInfo();
  const runTap = useActions();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const dc = e?.attributes.device_class as string | undefined;
  const Icon = sensorIcon(dc);
  const acc = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const unit = e?.attributes.unit_of_measurement as string | undefined;
  const binary = !!e && domainOf(e.entity_id) === 'binary_sensor';

  const { points } = useHistory(!binary && config.entity ? config.entity : '', 24);
  const stats = useMemo(() => {
    if (points.length < 2) return null;
    const vs = points.map((p) => p.v);
    let mn = Infinity, mx = -Infinity, sum = 0;
    for (const x of vs) { if (x < mn) mn = x; if (x > mx) mx = x; sum += x; }
    // downsample to a smooth ~36-point line
    let line = vs;
    if (vs.length > 40) {
      const target = 36, out: number[] = [], bucket = vs.length / target;
      for (let i = 0; i < target; i++) { const lo = Math.floor(i * bucket), hi = Math.floor((i + 1) * bucket); let s = 0, n = 0; for (let j = lo; j < hi; j++) { s += vs[j]; n++; } out.push(n ? s / n : vs[lo]); }
      line = out;
    }
    return { min: mn, max: mx, avg: sum / vs.length, line, first: vs[0] };
  }, [points]);

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--cool)' } as CSSProperties} role="button" aria-label="Select a sensor" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Icon, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a sensor</div>
        </div>
      </div>
    );
  }

  const numeric = !!e && e.state.trim() !== '' && !Number.isNaN(Number(e.state));
  const bigVal = dead ? 'Unavailable' : numeric ? fmt1(Number(e!.state)) : e ? formatSensor(e) : '—';
  const cur = numeric ? Number(e!.state) : NaN;
  const delta = stats && Number.isFinite(cur) ? cur - stats.first : null;
  const deltaUnit = numeric && unit ? unit : '';
  const deltaNode = delta != null && Math.abs(delta) >= 0.05 ? (
    <div className="badge" style={{ ['--acc']: delta >= 0 ? 'var(--up)' : 'var(--down)' } as CSSProperties}>{delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}{fmt1(delta)}{deltaUnit} · 24h</div>
  ) : null;

  const sparkH = compact ? 30 : 46;
  const valueNode = <>{bigVal}{numeric && unit && <span className="u">{unit}</span>}</>;

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: acc } as CSSProperties}
      role="button"
      aria-label={`${name}: ${dead ? 'unavailable' : e ? formatSensor(e) : ''}`}
      tabIndex={0}
      onClick={() => runTap(config.tap_action, config.entity)}
      onKeyDown={(ev) => { if (isActivateKey(ev.key)) { ev.preventDefault(); runTap(config.tap_action, config.entity); } }}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <span className="disc" aria-hidden="true">{renderIcon(config.icon, compact ? 18 : 21, discIcon(Icon, compact ? 18 : 21))}</span>
          {compact ? <div className="num tnum">{valueNode}</div> : (deltaNode ?? <span />)}
        </div>
        {compact ? (
          <div className="cname" title={name}>{name}{delta != null && Math.abs(delta) >= 0.05 && <span style={{ color: delta >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}> {delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}{fmt1(delta)}{deltaUnit}</span>}</div>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap"><div className="num tnum">{valueNode}</div><div className="nsub">Now</div></div>
          </div>
        )}
      </div>
      <div className="ctl">
        {stats && <Sparkline values={stats.line} width={compact ? 180 : 250} height={sparkH} color={acc} strokeWidth={compact ? 2 : 2.2} />}
        {!compact && stats && (
          <div className="statrow">
            <span>24h&nbsp;·&nbsp;{fmt1(stats.min)}–{fmt1(stats.max)}{unit && numeric ? unit : ''}</span>
            <span className="avg">avg {fmt1(stats.avg)}{unit && numeric ? unit : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
