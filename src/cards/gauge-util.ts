import { Gauge, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';
import { prettyState } from '../util';
import { accentVar } from './luminous';
import { sensorIcon, sensorTint } from './sensor-util';

export interface GaugeBand { from: number; to: number; color: string; }

export interface GaugeReadConfig {
  min?: number;
  max?: number;
  color?: string;
  severity?: { from: number; color?: string }[];
  severity_fill?: boolean;
  precision?: number;
}

export interface GaugeView {
  valid: boolean;
  value: number;
  min: number;
  max: number;
  pct: number;
  unit?: string;
  Icon: LucideIcon;
  tint: string;
  activeColor: string;
  bands: GaugeBand[];
  precision: number;
  label: string;
}

const PCT_CLASSES = new Set(['battery', 'humidity', 'moisture', 'power_factor']);
const BAND_FALLBACK = ['var(--up)', 'var(--warm)', 'var(--down)'];

/** Round up to a "nice" 1/2/5×10ⁿ ceiling so an unbounded sensor still draws a sane arc. */
function niceCeil(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 1;
  const base = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / base;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * base;
}

/** Normalize a numeric entity into a gauge view: resolved range, fill fraction, severity bands. */
export function readGauge(e: HassEntity | undefined, config: GaugeReadConfig, dead: boolean): GaugeView {
  const a = e?.attributes ?? {};
  const dc = a.device_class as string | undefined;
  const unit = a.unit_of_measurement as string | undefined;
  const raw = e ? Number(e.state) : NaN;
  const valid = !dead && e != null && e.state.trim() !== '' && Number.isFinite(raw);
  const value = valid ? raw : 0;

  const min = config.min ?? 0;
  const pctRange = unit === '%' || (!!dc && PCT_CLASSES.has(dc));
  let max = config.max ?? (pctRange ? 100 : niceCeil(Math.max(value, min + 1)));
  if (max <= min) max = min + 1;
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const sev = (config.severity ?? []).filter((b) => typeof b?.from === 'number').slice().sort((x, y) => x.from - y.from);
  const bands: GaugeBand[] = sev.map((b, i) => ({
    from: b.from,
    to: i + 1 < sev.length ? sev[i + 1].from : max,
    color: accentVar(b.color) ?? BAND_FALLBACK[i % BAND_FALLBACK.length],
  }));

  const baseTint = accentVar(config.color) ?? sensorTint(dc);
  const active = bands.length ? bands.find((b) => value >= b.from && value < b.to) ?? bands[bands.length - 1] : null;
  const activeColor = accentVar(config.color) ?? (active && config.severity_fill !== false ? active.color : baseTint);

  return {
    valid,
    value,
    min,
    max,
    pct,
    unit,
    Icon: sensorIcon(dc) ?? Gauge,
    tint: baseTint,
    activeColor,
    bands,
    precision: config.precision ?? (Number.isInteger(value) ? 0 : 1),
    label: e ? prettyState(e.state) : '—',
  };
}
