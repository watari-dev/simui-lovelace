import { type CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useId, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import { useEntity, useHistory, useLanguage, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly } from '../util';
import { renderIcon } from '../core/icon';
import { sensorIcon, sensorTint, VALID_COLORS } from './sensor-util';
import { discIcon } from './luminous';

export interface GraphCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** A second series overlaid on the same axes (e.g. humidity over temperature). */
  secondary?: string;
  /** Override the device-class tint: warm | cool | up | down | grey. */
  color?: string;
  /** Default range, in hours (default 24). */
  hours?: number;
  /** Range-toggle options, in hours (default [1, 12, 24, 168]). [] hides the toggle. */
  ranges?: number[];
  /** Area fill under the line (default true). */
  fill?: boolean;
  /** Line stroke width in px (default 2.4). */
  line_width?: number;
  /** Show the Min / Avg / Max / Now stats footer (default true). */
  show_stats?: boolean;
}

const W = 512, H = 150, PAD = 6;
const rangeLabel = (h: number): string => (h < 24 ? `${h}h` : `${Math.round(h / 24)}d`);

interface Series { values: number[]; ts: number[]; color: string; unit: string; cur: number; min: number; max: number; avg: number; }

function downsample(points: { t: number; v: number }[], target = 90): { t: number; v: number }[] {
  if (points.length <= target) return points;
  const out: { t: number; v: number }[] = [];
  const bucket = points.length / target;
  for (let i = 0; i < target; i++) {
    const lo = Math.floor(i * bucket), hi = Math.floor((i + 1) * bucket);
    let st = 0, sv = 0, n = 0;
    for (let j = lo; j < hi; j++) { st += points[j].t; sv += points[j].v; n++; }
    out.push(n ? { t: st / n, v: sv / n } : points[lo]);
  }
  return out;
}

/**
 * SimUI graph card — the Luminous history chart: a full-bleed area sparkline with hairline
 * gridlines, a hover crosshair + floating readout, a range toggle, and a Min / Avg / Max /
 * Now stats footer. Supports an optional second series overlaid on the same axes.
 */
export function GraphCard({ config }: CardComponentProps<GraphCardConfig>) {
  const e = useEntity(config.entity);
  const e2 = useEntity(config.secondary ?? '');
  const moreInfo = useMoreInfo();
  const actions = useActionHandler(config, config.entity);
  const locale = useLanguage();
  const gradId = useId().replace(/:/g, '');

  const ranges = config.ranges ?? [1, 12, 24, 168];
  const [hours, setHours] = useState(config.hours ?? 24);
  useEffect(() => setHours(config.hours ?? 24), [config.hours]);
  const [hover, setHover] = useState<number | null>(null);

  const { points: hist } = useHistory(config.entity, hours);
  const { points: hist2 } = useHistory(config.secondary ?? '', hours);

  const dc = e?.attributes.device_class as string | undefined;
  const Icon = sensorIcon(dc);
  const accent = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const sub = (config.secondary ? 'Two series · last ' : 'Live · last ') + rangeLabel(hours);

  const series = useMemo<Series[]>(() => {
    const build = (pts: { t: number; v: number }[], color: string, unit: string): Series | null => {
      if (pts.length < 2) return null;
      const d = downsample(pts);
      const values = d.map((p) => p.v), ts = d.map((p) => p.t);
      let mn = Infinity, mx = -Infinity, sum = 0;
      for (const x of values) { if (x < mn) mn = x; if (x > mx) mx = x; sum += x; }
      return { values, ts, color, unit, cur: values[values.length - 1], min: mn, max: mx, avg: sum / values.length };
    };
    const out: Series[] = [];
    const s1 = build(hist, accent, (e?.attributes.unit_of_measurement as string) ?? '');
    if (s1) out.push(s1);
    if (config.secondary) { const s2 = build(hist2, 'var(--up)', (e2?.attributes.unit_of_measurement as string) ?? ''); if (s2) out.push(s2); }
    return out;
  }, [hist, hist2, accent, config.secondary, e, e2]);

  if (!config.entity || series.length === 0) {
    return (
      <div className="card graph" style={{ ['--acc']: accent, height: '100%' } as CSSProperties}>
        <div className="ghead"><div className="glabel"><div className="disc">{renderIcon(config.icon, 21, discIcon(config.entity ? Icon : Activity, 21))}</div><div><div className="gtitle">{config.entity ? name : 'Select a sensor'}</div><div className="gsub">{config.entity ? 'No history yet' : 'Set up'}</div></div></div></div>
        <div className="gchart"><div className="gempty">{config.entity ? 'Not enough history yet' : 'Pick a sensor to chart'}</div></div>
      </div>
    );
  }

  // shared scale across series (so both fit), then map to the viewBox
  const allMin = Math.min(...series.map((s) => s.min));
  const allMax = Math.max(...series.map((s) => s.max));
  const span = allMax - allMin || 1;
  const pad = span * 0.12;
  const lo = allMin - pad, hi = allMax + pad, vspan = hi - lo;
  const xAt = (i: number, n: number) => PAD + (i * (W - PAD * 2)) / (n - 1);
  const yAt = (v: number) => H - PAD - ((v - lo) / vspan) * (H - PAD * 2);

  const primary = series[0];
  const n = primary.values.length;
  const idx = hover != null ? Math.max(0, Math.min(n - 1, hover)) : n - 1;
  const crossX = xAt(idx, n);
  const fmtV = (v: number) => (Math.abs(v) >= 100 ? Math.round(v).toLocaleString(locale) : (Math.round(v * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 }));
  const readTime = new Date(primary.ts[idx]).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const delta = primary.cur - primary.avg;

  const onMove = (ev: ReactPointerEvent) => {
    const r = ev.currentTarget.getBoundingClientRect();
    if (r.width <= 0) return;
    setHover(Math.round(((ev.clientX - r.left) / r.width) * (n - 1)));
  };

  return (
    <div
      className="card graph"
      style={{ ['--acc']: accent, height: '100%' } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${name} history`}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="ghead">
        <div className="glabel">
          <div className="disc">{renderIcon(config.icon, 21, discIcon(Icon, 21))}</div>
          <div><div className="gtitle" title={name}>{name}</div><div className="gsub">{sub}</div></div>
        </div>
        <div className="gval">
          <b className="tnum">{fmtV(primary.cur)}{primary.unit && <span className="u">{primary.unit}</span>}</b>
          {series[1] ? <span style={{ color: 'var(--muted)' }}>{fmtV(series[1].cur)}{series[1].unit}</span> : <span>{delta >= 0 ? '▲' : '▼'} {fmtV(Math.abs(delta))}{primary.unit ? ' ' + primary.unit : ''} vs avg</span>}
        </div>
      </div>

      {ranges.length > 0 && (
        <div className="granges">
          {ranges.map((h) => (
            <button key={h} type="button" className={h === hours ? 'on' : ''} aria-pressed={h === hours} onClick={(ev) => { ev.stopPropagation(); setHours(h); setHover(null); }} onPointerDown={(ev) => ev.stopPropagation()}>{rangeLabel(h)}</button>
          ))}
        </div>
      )}

      <div className="gchart" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={primary.color} stopOpacity="0.3" />
              <stop offset="1" stopColor={primary.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[1, 2, 3].map((i) => <line key={i} x1="0" y1={(H / 4) * i} x2={W} y2={(H / 4) * i} stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          {series.map((s, si) => {
            const sn = s.values.length;
            // smooth mid-point cubic on the shared scale (so both series share an axis)
            const xs = (i: number) => PAD + (i * (W - PAD * 2)) / (sn - 1);
            let d = `M ${xs(0).toFixed(1)} ${yAt(s.values[0]).toFixed(1)}`;
            for (let i = 1; i < sn; i++) { const x0 = xs(i - 1), y0 = yAt(s.values[i - 1]), x1 = xs(i), y1 = yAt(s.values[i]), cx = (x0 + x1) / 2; d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)} ${cx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`; }
            const areaD = `${d} L ${(W - PAD).toFixed(1)} ${H} L ${PAD} ${H} Z`;
            return (
              <g key={si}>
                {si === 0 && config.fill !== false && <path d={areaD} fill={`url(#${gradId})`} />}
                <path d={d} fill="none" stroke={s.color} strokeWidth={config.line_width ?? 2.4} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
          <line x1={crossX} y1="0" x2={crossX} y2={H} stroke={primary.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.55" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="gread" style={{ left: `${Math.max(9, Math.min(89, (crossX / W) * 100))}%` }}>
          {fmtV(primary.values[idx])}{primary.unit}{series[1] ? ` · ${fmtV(series[1].values[Math.min(idx, series[1].values.length - 1)])}${series[1].unit}` : ''}
          <span>{readTime}</span>
        </div>
      </div>

      {config.show_stats !== false && (
        <div className="gstats">
          <div>Min<b className="tnum">{fmtV(primary.min)}{primary.unit}</b></div>
          <div>Avg<b className="tnum">{fmtV(primary.avg)}{primary.unit}</b></div>
          <div>Max<b className="tnum">{fmtV(primary.max)}{primary.unit}</b></div>
          <div>Now<b className="tnum">{fmtV(primary.cur)}{primary.unit}</b></div>
        </div>
      )}
    </div>
  );
}
