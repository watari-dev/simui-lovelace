import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import { AreaSeries, ColorType, CrosshairMode, LineSeries, LineStyle, LineType, createChart, type IChartApi, type ISeriesApi, type LineWidth, type UTCTimestamp } from 'lightweight-charts';
import { useActions, useEntity, useHistory, useLanguage, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly } from '../util';
import { renderIcon } from '../core/icon';
import { sensorIcon, sensorTint, VALID_COLORS } from './sensor-util';
import { ChipRow, discIcon, type ActionChip } from './luminous';

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
  /** Line stroke width in px, clamped to 1–4 (default 2). */
  line_width?: number;
  /** Show the Min / Avg / Max / Now stats footer (default true). */
  show_stats?: boolean;
  /** Custom action buttons shown beneath the chart. */
  buttons?: ActionChip[];
}

const rangeLabel = (h: number): string => (h < 24 ? `${h}h` : `${Math.round(h / 24)}d`);

interface Stats { cur: number; min: number; max: number; avg: number; }
function statsOf(pts: { t: number; v: number }[]): Stats | null {
  if (pts.length < 2) return null;
  let mn = Infinity, mx = -Infinity, sum = 0;
  for (const p of pts) { if (p.v < mn) mn = p.v; if (p.v > mx) mx = p.v; sum += p.v; }
  return { cur: pts[pts.length - 1].v, min: mn, max: mx, avg: sum / pts.length };
}

/** Resolve a CSS colour (incl. `var(--x)`) to a concrete rgb string the canvas can paint. */
function resolveColor(host: HTMLElement, value: string): string {
  const probe = document.createElement('span');
  probe.style.cssText = `color:${value};display:none`;
  host.appendChild(probe);
  const c = getComputedStyle(probe).color || value;
  probe.remove();
  return c;
}
const withAlpha = (rgb: string, a: number): string => (rgb.startsWith('rgb(') ? rgb.replace('rgb(', 'rgba(').replace(')', `, ${a})`) : rgb);

/** Map history points → lightweight-charts data (epoch seconds, strictly ascending, de-duped). */
function toData(pts: { t: number; v: number }[]): { time: UTCTimestamp; value: number }[] {
  const out: { time: UTCTimestamp; value: number }[] = [];
  let last = -1;
  for (const p of pts) {
    const s = Math.floor(p.t / 1000);
    if (s === last) out[out.length - 1] = { time: s as UTCTimestamp, value: p.v };
    else { out.push({ time: s as UTCTimestamp, value: p.v }); last = s; }
  }
  return out;
}

/**
 * SimUI graph card — the Luminous history chart, powered by TradingView's lightweight-charts:
 * a full-bleed area/line series with a magnet crosshair + value readout, hairline gridlines, a
 * range toggle, and a Min / Avg / Max / Now stats footer. Supports an optional second series.
 */
export function GraphCard({ config }: CardComponentProps<GraphCardConfig>) {
  const e = useEntity(config.entity);
  const e2 = useEntity(config.secondary ?? '');
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const actions = useActionHandler(config, config.entity);
  const locale = useLanguage();

  const ranges = config.ranges ?? [1, 12, 24, 168];
  const [hours, setHours] = useState(config.hours ?? 24);
  useEffect(() => setHours(config.hours ?? 24), [config.hours]);

  const { points: hist } = useHistory(config.entity, hours);
  const { points: hist2 } = useHistory(config.secondary ?? '', hours);

  const dc = e?.attributes.device_class as string | undefined;
  const Icon = sensorIcon(dc);
  const accent = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const sub = (config.secondary ? 'Two series · last ' : 'Live · last ') + rangeLabel(hours);
  const unit = (e?.attributes.unit_of_measurement as string) ?? '';
  const unit2 = (e2?.attributes.unit_of_measurement as string) ?? '';
  const fill = config.fill !== false;
  const hasSecondary = !!config.secondary;
  const lineWidth = Math.max(1, Math.min(4, Math.round(config.line_width ?? 2))) as LineWidth;

  const p1 = useMemo(() => statsOf(hist), [hist]);
  const p2 = useMemo(() => (hasSecondary ? statsOf(hist2) : null), [hist2, hasSecondary]);

  // OS light/dark toggle → restyle the canvas (which can't read CSS vars live).
  const [themeKey, setThemeKey] = useState(0);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const h = () => setThemeKey((k) => k + 1);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const primaryRef = useRef<ISeriesApi<'Area' | 'Line'> | null>(null);
  const secondaryRef = useRef<ISeriesApi<'Line'> | null>(null);

  // 1) create the chart once per structural change.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = createChart(el, {
      autoSize: false,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#888', fontSize: 11, attributionLogo: false },
      grid: { vertLines: { visible: false }, horzLines: { color: 'transparent' } },
      rightPriceScale: { visible: false }, leftPriceScale: { visible: false },
      timeScale: { visible: false, borderVisible: false },
      crosshair: { mode: CrosshairMode.Magnet, vertLine: { width: 1 as LineWidth, style: LineStyle.Dashed, labelVisible: false }, horzLine: { visible: false } },
      handleScroll: false, handleScale: false,
    });
    primaryRef.current = fill
      ? chart.addSeries(AreaSeries, { lineWidth, lineType: LineType.Curved, priceLineVisible: false, lastValueVisible: false, crosshairMarkerRadius: 3 })
      : chart.addSeries(LineSeries, { lineWidth, lineType: LineType.Curved, priceLineVisible: false, lastValueVisible: false, crosshairMarkerRadius: 3 });
    if (hasSecondary) secondaryRef.current = chart.addSeries(LineSeries, { lineWidth, lineType: LineType.Curved, priceLineVisible: false, lastValueVisible: false });
    chart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; primaryRef.current = null; secondaryRef.current = null; };
  }, [hasSecondary, fill, lineWidth]);

  // 2) theme — resolve the accent + neutrals to concrete colours and apply (follows light/dark).
  useEffect(() => {
    const el = containerRef.current, chart = chartRef.current, prim = primaryRef.current;
    if (!el || !chart || !prim) return;
    const acc = resolveColor(el, accent);
    chart.applyOptions({ layout: { textColor: resolveColor(el, 'var(--muted)') }, grid: { horzLines: { color: resolveColor(el, 'var(--border)') } }, crosshair: { vertLine: { color: acc } } });
    prim.applyOptions(fill ? { lineColor: acc, topColor: withAlpha(acc, 0.3), bottomColor: withAlpha(acc, 0) } as never : { color: acc } as never);
    secondaryRef.current?.applyOptions({ color: resolveColor(el, 'var(--up)') });
  }, [accent, fill, themeKey, hasSecondary]);

  // 3) push data + re-fit on range / data change.
  useEffect(() => {
    const chart = chartRef.current, prim = primaryRef.current;
    if (!chart || !prim) return;
    prim.setData(toData(hist));
    secondaryRef.current?.setData(toData(hist2));
    chart.timeScale().fitContent();
  }, [hist, hist2]);

  const fmtV = (v: number): string => (Math.abs(v) >= 100 ? Math.round(v).toLocaleString(locale) : (Math.round(v * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 }));
  const delta = p1 ? p1.cur - p1.avg : 0;

  // The chart container is ALWAYS mounted (so the create effect fires once on mount and stays
  // stable) — only the header detail / range toggle / stats are gated on having data.
  return (
    <div
      className="card graph"
      style={{ ['--acc']: accent, height: '100%' } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${name} history`}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); if (config.entity) moreInfo(config.entity); }}
    >
      <div className="ghead">
        <div className="glabel">
          <div className="disc">{renderIcon(config.icon, 21, discIcon(config.entity ? Icon : Activity, 21))}</div>
          <div><div className="gtitle" title={name}>{config.entity ? name : 'Select a sensor'}</div><div className="gsub">{p1 ? sub : config.entity ? 'No history yet' : 'Set up'}</div></div>
        </div>
        {p1 && (
          <div className="gval">
            <b className="tnum">{fmtV(p1.cur)}{unit && <span className="u">{unit}</span>}</b>
            {p2 ? <span style={{ color: 'var(--muted)' }}>{fmtV(p2.cur)}{unit2}</span> : <span>{delta >= 0 ? '▲' : '▼'} {fmtV(Math.abs(delta))}{unit ? ' ' + unit : ''} vs avg</span>}
          </div>
        )}
      </div>

      {p1 && ranges.length > 0 && (
        <div className="granges">
          {ranges.map((h) => (
            <button key={h} type="button" className={h === hours ? 'on' : ''} aria-pressed={h === hours} onClick={(ev) => { ev.stopPropagation(); setHours(h); }} onPointerDown={(ev) => ev.stopPropagation()}>{rangeLabel(h)}</button>
          ))}
        </div>
      )}

      <div className="gchartwrap">
        <div className="gchart" ref={containerRef} />
        {!p1 && <div className="gempty">{config.entity ? 'Not enough history yet' : 'Pick a sensor to chart'}</div>}
      </div>

      {p1 && config.show_stats !== false && (
        <div className="gstats">
          <div>Min<b className="tnum">{fmtV(p1.min)}{unit}</b></div>
          <div>Avg<b className="tnum">{fmtV(p1.avg)}{unit}</b></div>
          <div>Max<b className="tnum">{fmtV(p1.max)}{unit}</b></div>
          <div>Now<b className="tnum">{fmtV(p1.cur)}{unit}</b></div>
        </div>
      )}

      <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />
    </div>
  );
}
