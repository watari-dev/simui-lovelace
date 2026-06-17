import { createElement, useId, useMemo, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

/** Shared "Luminous" primitives: the dot-bar, the temperature track, and the sparkline.
 *  The interactive controls are presentational — each card owns its `useDragValue` so the
 *  live value can also drive the big numeral, and passes `value` + the drag `handlers` down. */

interface DragHandlers {
  onPointerDown: (e: ReactPointerEvent) => void;
}

/** Stop a control's pointer/click from bubbling to the tile's tap_action / more-info. */
function swallow(handlers?: DragHandlers): { onPointerDown?: (e: ReactPointerEvent) => void; onClick: (e: { stopPropagation: () => void }) => void } {
  return {
    onClick: (e) => e.stopPropagation(),
    ...(handlers
      ? {
          onPointerDown: (e: ReactPointerEvent) => {
            e.stopPropagation();
            handlers.onPointerDown(e);
          },
        }
      : {}),
  };
}

/** Map a config `color:` accent name to its CSS var — the optional tint override on tiles. */
const ACCENTS = new Set(['warm', 'cool', 'up', 'down', 'grey', 'heat']);
export const accentVar = (name?: string): string | undefined => (name && ACCENTS.has(name) ? `var(--${name})` : undefined);

// ── Dot bar (brightness / position) ───────────────────────────────────────────
export type SliderStyle = 'dots' | 'bar' | 'line';

export function DotBar({
  value,
  segments,
  settable,
  handlers,
  ariaLabel,
  onKeyDown,
  variant = 'dots',
}: {
  value: number; // 0–100
  segments: number;
  settable: boolean;
  handlers?: DragHandlers;
  ariaLabel: string;
  onKeyDown?: (e: ReactKeyboardEvent) => void;
  /** Visual style: segmented dots (default), a solid bar, or a thin line. */
  variant?: SliderStyle;
}): ReactNode {
  const v = Math.max(0, Math.min(100, value));
  const filled = Math.round((v / 100) * segments);
  return (
    <div
      className={`dots st-${variant}`}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-valuetext={`${Math.round(v)}%`}
      tabIndex={settable ? 0 : -1}
      onKeyDown={settable ? onKeyDown : undefined}
      {...swallow(settable ? handlers : undefined)}
    >
      {variant === 'dots' ? (
        Array.from({ length: segments }, (_, i) => <i key={i} className={i < filled ? 'on' : ''} />)
      ) : (
        <span className="track"><span className="fill" style={{ width: `${v}%` }} /></span>
      )}
    </div>
  );
}

// ── Temperature track (climate target) ────────────────────────────────────────
export function TempTrack({
  knobPct,
  tickPct,
  settable,
  handlers,
  ariaLabel,
  ariaNow,
  ariaMin,
  ariaMax,
  ariaValue,
  onKeyDown,
}: {
  knobPct: number | null; // 0–100 (target position), or null to hide the knob (e.g. dual setpoint)
  tickPct: number | null; // 0–100 (current temp marker), or null
  settable: boolean;
  handlers?: DragHandlers;
  ariaLabel: string;
  ariaNow?: string;
  ariaMin?: number;
  ariaMax?: number;
  ariaValue?: number;
  onKeyDown?: (e: ReactKeyboardEvent) => void;
}): ReactNode {
  return (
    <div
      className="track"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={ariaMin}
      aria-valuemax={ariaMax}
      aria-valuenow={ariaValue}
      aria-valuetext={ariaNow}
      tabIndex={settable ? 0 : -1}
      onKeyDown={settable ? onKeyDown : undefined}
      {...swallow(settable ? handlers : undefined)}
    >
      <div className="rail" />
      {tickPct != null && <div className="ttick" style={{ left: `${tickPct}%` }} />}
      {knobPct != null && <div className="tknob" style={{ left: `${Math.max(0, Math.min(100, knobPct))}%` }} />}
    </div>
  );
}

// ── Sparkline ──────────────────────────────────────────────────────────────────
/** Smooth (mid-point cubic) path + a closed area path for a value series. */
export function sparkPath(vals: number[], w: number, h: number, pad = 4): { line: string; area: string } {
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const rng = mx - mn || 1;
  const xs = (i: number) => pad + (i * (w - pad * 2)) / (vals.length - 1);
  const ys = (v: number) => h - pad - ((v - mn) / rng) * (h - pad * 2);
  let d = `M ${xs(0).toFixed(1)} ${ys(vals[0]).toFixed(1)}`;
  for (let i = 1; i < vals.length; i++) {
    const x0 = xs(i - 1);
    const y0 = ys(vals[i - 1]);
    const x1 = xs(i);
    const y1 = ys(vals[i]);
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)} ${cx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return { line: d, area: `${d} L ${(w - pad).toFixed(1)} ${h} L ${pad} ${h} Z` };
}

export function Sparkline({
  values,
  width = 250,
  height = 46,
  color = 'var(--cool)',
  strokeWidth = 2.2,
  fill = true,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
}): ReactNode {
  const gradId = useId().replace(/:/g, '');
  const { line, area } = useMemo(() => sparkPath(values, width, height), [values, width, height]);
  if (values.length < 2) return null;
  return (
    <svg className="spark" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.26" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── Disc icon helper ───────────────────────────────────────────────────────────
/** A lucide glyph sized + weighted for the Luminous disc (1.8px stroke). */
export function discIcon(Icon: (props: Record<string, unknown>) => ReactNode, size: number): ReactNode {
  return createElement(Icon, { size, strokeWidth: 1.8 });
}

/** Keyboard step handler for a 0–100 slider (← →, ↑ ↓) committing via `onCommit`. */
export function sliderKeys(value: number, onCommit: (v: number) => void, step = 5): (e: ReactKeyboardEvent) => void {
  return (e: ReactKeyboardEvent) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(100, value + step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, value - step);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    if (next != null) {
      e.preventDefault();
      e.stopPropagation();
      onCommit(next);
    }
  };
}
