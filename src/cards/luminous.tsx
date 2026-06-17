import { createElement, useId, useMemo, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { renderIcon } from '../core/icon';
import type { ActionConfig } from '../core/actions';

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

// ── Action chips (generic configurable button row) ────────────────────────────
/** One configurable action button — a name + optional icon that runs a tap action. */
export interface ActionChip {
  name?: string;
  icon?: string;
  /** The action to run on tap. Omit ⇒ the card's default (more-info on its entity). */
  tap_action?: ActionConfig;
}

/**
 * A configurable row of action buttons, shared by the cards that have no domain-specific
 * control row (sensor / lock / media / graph / energy). Each button runs its `tap_action`
 * (or the card default when none is set). Renders nothing when no chips are configured, so
 * it's purely opt-in — a card with no `buttons` looks exactly as before.
 */
export function ChipRow({ chips, run }: { chips?: ActionChip[]; run: (a: ActionConfig | undefined) => void }): ReactNode {
  if (!chips || chips.length === 0) return null;
  return (
    <div className="chips actions">
      {chips.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={(e) => { e.stopPropagation(); run(c.tap_action); }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {c.icon ? <span className="chip-ic">{renderIcon(c.icon, 15, null)}</span> : null}{c.name ?? ''}
        </button>
      ))}
    </div>
  );
}

// ── v4 tile patterns: header (disc + name + status dot), secondary readout, segmented control ──
/** The tight inline header: the glowing disc, the entity name (wraps to 2 lines), and a glowing
 *  status dot (accent when active, dim when not). Replaces the old disc + text-badge header. */
export function TileHead({ disc, name, sub, active }: { disc: ReactNode; name: string; sub?: ReactNode; active?: boolean }): ReactNode {
  return (
    <div className="hdr">
      {disc}
      <div className="hname"><div className="nm" title={name}>{name}</div>{sub != null && sub !== '' ? <div className="st">{sub}</div> : null}</div>
      <span className={`statusdot${active ? '' : ' off'}`} aria-hidden="true" />
    </div>
  );
}

export interface SecStat { l: string; v: ReactNode; }
/** The right-aligned secondary readout in the value row — one or two compact stats (label over
 *  value) and/or a colour swatch, filling the space beside the big numeral. */
export function Sec({ stats, swatch }: { stats?: SecStat[]; swatch?: string }): ReactNode {
  const list = stats ?? [];
  if (!swatch && list.length === 0) return null;
  return (
    <div className="sec">
      {swatch ? <span className="swatch" style={{ ['--swc']: swatch } as CSSProperties} aria-hidden="true" /> : null}
      {list.map((s, i) => <div key={i} className="secstat"><div className="l">{s.l}</div><div className="v tnum">{s.v}</div></div>)}
    </div>
  );
}

export interface Seg2Item { key: string; label?: string; icon?: string; active?: boolean; disabled?: boolean; onClick: (e: ReactMouseEvent) => void; }
/** A connected segmented control for the tile mode-chip rows: a translucent, hairline-divided
 *  track of cells (so it reads as buttons even with nothing active), the active one a filled
 *  accent cell. Renders whatever chip list the card supplies, so the rows stay configurable. */
export function Seg2({ items }: { items: Seg2Item[] }): ReactNode {
  if (items.length === 0) return null;
  return (
    <div className="seg2">
      {items.map((it) => (
        <button key={it.key} type="button" className={it.active ? 'on' : ''} disabled={it.disabled} onClick={(e) => { e.stopPropagation(); it.onClick(e); }} onPointerDown={(e) => e.stopPropagation()}>
          {it.icon ? <span className="chip-ic">{renderIcon(it.icon, 14, null)}</span> : null}{it.label}
        </button>
      ))}
    </div>
  );
}

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

// ── Gauge arc (radial sensor gauge) ─────────────────────────────────────────────
/** A 270° radial gauge arc: a grey track + an accent fill to `pct` (0–1), with the same glow
 *  as the dot-bar. The big value is rendered separately, centred over the dial. */
export function GaugeArc({
  pct,
  color,
  size = 132,
  strokeWidth = 11,
}: {
  pct: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}): ReactNode {
  const start = 135, sweep = 270; // gap at the bottom
  const r = size / 2 - strokeWidth / 2 - 2;
  const c = size / 2;
  const at = (ang: number): string => {
    const a = (ang * Math.PI) / 180;
    return `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
  };
  const d = `M ${at(start)} A ${r} ${r} 0 1 1 ${at(start + sweep)}`;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <svg className="gaugesvg" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path className="gauge-track" d={d} strokeWidth={strokeWidth} pathLength={100} />
      <path className="gauge-fill" d={d} strokeWidth={strokeWidth} pathLength={100} stroke={color} strokeDasharray={`${(p * 100).toFixed(2)} 100`} />
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
