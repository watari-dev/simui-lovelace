import { useId, useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { HistoryPoint } from '../core/hass';

interface HistoryChartProps {
  points: HistoryPoint[];
  width: number;
  height: number;
  hours: number;
  unit: string;
  fill: boolean;
  lineWidth: number;
  ariaLabel: string;
  locale?: string;
}

const PAD_TOP = 10;
const PAD_BOTTOM = 18;
const PAD_X = 1;

const fmtVal = (v: number, locale?: string): string =>
  Math.abs(v) >= 100
    ? Math.round(v).toLocaleString(locale)
    : (Math.round(v * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 });

function fmtTime(t: number, hours: number, locale?: string): string {
  const d = new Date(t);
  if (hours <= 48) return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

function fmtStamp(t: number, hours: number, locale?: string): string {
  const d = new Date(t);
  const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return hours <= 48 ? time : `${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} ${time}`;
}

/** Average-bucket the series down to ~targetN points so a wide range stays a clean line. */
function downsample(points: HistoryPoint[], targetN: number): HistoryPoint[] {
  if (points.length <= targetN || targetN < 2) return points;
  const out: HistoryPoint[] = [];
  const bucket = points.length / targetN;
  for (let i = 0; i < targetN; i++) {
    const lo = Math.floor(i * bucket);
    const hi = Math.min(points.length, Math.floor((i + 1) * bucket));
    let st = 0;
    let sv = 0;
    for (let j = lo; j < hi; j++) {
      st += points[j].t;
      sv += points[j].v;
    }
    const n = hi - lo || 1;
    out.push({ t: st / n, v: sv / n });
  }
  return out;
}

/**
 * The TradingView-flavoured history chart: thin line, soft gradient area, hairline
 * gridlines, min/max + time labels, and a crosshair that reads out the value at the
 * pointer. Pure given (points, size) — colour comes from the inherited `--tile-tint`.
 * Expects ≥2 sorted points (the card shows a placeholder otherwise).
 */
export function HistoryChart({ points, width, height, hours, unit, fill, lineWidth, ariaLabel, locale }: HistoryChartProps) {
  const gradId = useId();
  // hover is the sample's *timestamp*, not its index — so it survives re-bucketing when the
  // live value is appended (the crosshair stays put instead of teleporting on each tick).
  const [hoverT, setHoverT] = useState<number | null>(null);

  const view = useMemo(() => {
    if (width < 8 || height < 8 || points.length < 2) return null;
    const plotW = width - 2 * PAD_X;
    const plotH = height - PAD_TOP - PAD_BOTTOM;
    const data = downsample(points, Math.max(40, Math.round(plotW)));

    const tMin = data[0].t;
    const tMax = data[data.length - 1].t;
    const tSpan = tMax - tMin || 1;
    let vMin = Infinity;
    let vMax = -Infinity;
    let vSum = 0;
    for (const p of data) {
      if (p.v < vMin) vMin = p.v;
      if (p.v > vMax) vMax = p.v;
      vSum += p.v;
    }
    const vAvg = vSum / data.length;
    const raw = vMax - vMin;
    const pad = raw === 0 ? Math.max(1, Math.abs(vMax) * 0.1) : raw * 0.14;
    const lo = vMin - pad;
    const hi = vMax + pad;
    const vSpan = hi - lo || 1;

    const x = (t: number) => PAD_X + ((t - tMin) / tSpan) * plotW;
    const y = (v: number) => PAD_TOP + (1 - (v - lo) / vSpan) * plotH;

    const xy = data.map((p) => [x(p.t), y(p.v)] as const);
    const line = xy.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
    const baseY = PAD_TOP + plotH;
    const area = `${line} L${xy[xy.length - 1][0].toFixed(1)} ${baseY} L${xy[0][0].toFixed(1)} ${baseY} Z`;

    return { data, xy, line, area, baseY, tMin, tMax, vMin, vMax, vAvg, y };
  }, [points, width, height]);

  if (!view) return null;

  const { data, xy, line, area, baseY, tMin, tMax, vMin, vMax, vAvg, y } = view;
  const last = xy[xy.length - 1];

  const nearestByX = (px: number): number => {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < xy.length; i++) {
      const d = Math.abs(xy[i][0] - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  };

  const onMove = (ev: ReactPointerEvent<SVGRectElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    setHoverT(data[nearestByX(ev.clientX - rect.left)].t);
  };
  const clear = () => setHoverT(null);

  // resolve the hovered timestamp back to the nearest current sample
  let hoverIdx: number | null = null;
  if (hoverT != null) {
    let bestD = Infinity;
    for (let i = 0; i < data.length; i++) {
      const d = Math.abs(data[i].t - hoverT);
      if (d < bestD) {
        bestD = d;
        hoverIdx = i;
      }
    }
  }
  const hp = hoverIdx != null ? data[hoverIdx] : null;
  const hxy = hoverIdx != null ? xy[hoverIdx] : null;
  const tipLeft = hxy ? Math.min(Math.max(hxy[0], 4), width - 4) : 0;
  const tipFlip = hxy ? hxy[0] > width * 0.6 : false;

  // time axis ticks — fewer on a narrow card; a single centred tick if every point shares a time
  const tickCount = tMax === tMin ? 1 : width < 220 ? 2 : width < 360 ? 3 : 4;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const f = tickCount === 1 ? 0.5 : i / (tickCount - 1);
    return { x: PAD_X + f * (width - 2 * PAD_X), t: tMin + f * (tMax - tMin), i };
  });

  return (
    <>
      <svg className="simui-graph-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--tile-tint))', stopOpacity: 0.24 }} />
            <stop offset="55%" style={{ stopColor: 'rgb(var(--tile-tint))', stopOpacity: 0.06 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(var(--tile-tint))', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* gridlines coincide with the data extremes + the average, so the scale lines
            sit on the max/avg/min readouts instead of floating at fixed plot fractions */}
        {[vMax, vAvg, vMin].map((v, i) => {
          const gy = y(v);
          return <line key={i} className="simui-graph-grid" x1={PAD_X} y1={gy} x2={width - PAD_X} y2={gy} />;
        })}

        {fill && <path className="simui-graph-area" d={area} fill={`url(#${gradId})`} />}
        <path className="simui-graph-line" d={line} style={{ strokeWidth: lineWidth }} />

        <circle className="simui-graph-end" cx={last[0]} cy={last[1]} r={3} />

        {/* value labels sit on their gridlines (the real max/min), not the plot edges */}
        <text className="simui-graph-axis" x={width - PAD_X - 2} y={y(vMax) - 3} textAnchor="end">{fmtVal(vMax, locale)}</text>
        <text className="simui-graph-axis" x={width - PAD_X - 2} y={y(vMin) + 10} textAnchor="end">{fmtVal(vMin, locale)}</text>

        {ticks.map((tk) => (
          <text
            key={tk.i}
            className="simui-graph-axis"
            x={tk.x}
            y={height - 5}
            textAnchor={tickCount === 1 ? 'middle' : tk.i === 0 ? 'start' : tk.i === tickCount - 1 ? 'end' : 'middle'}
          >
            {fmtTime(tk.t, hours, locale)}
          </text>
        ))}

        {hxy && (
          <g>
            <line className="simui-graph-cross" x1={hxy[0]} y1={PAD_TOP} x2={hxy[0]} y2={baseY} />
            <circle className="simui-graph-dot" cx={hxy[0]} cy={hxy[1]} r={3.5} />
          </g>
        )}

        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={clear}
          onPointerUp={clear}
          onPointerCancel={clear}
        />
      </svg>

      {hp && (
        <div className="simui-graph-tip" style={{ left: tipLeft, transform: `translateX(${tipFlip ? '-100%' : '0'})` }}>
          <span className="simui-graph-tip-v">
            {fmtVal(hp.v, locale)}
            {unit && <span className="simui-graph-tip-u">{unit}</span>}
          </span>
          <span className="simui-graph-tip-t">{fmtStamp(hp.t, hours, locale)}</span>
        </div>
      )}
    </>
  );
}
