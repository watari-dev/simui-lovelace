import { Flame, Snowflake, Droplets, Fan, Thermometer, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';

export interface ClimateView {
  on: boolean;
  action: string; // hvac_action, or the hvac_mode when no action is reported
  tint: string; // RGB-triplet token
  Icon: LucideIcon;
  current: number | null;
  target: number | null; // single setpoint
  low: number | null; // dual setpoint
  high: number | null;
  dual: boolean;
  step: number;
  min: number;
  max: number;
  settable: boolean; // single-setpoint → draggable target
}

function num(v: unknown): number | null {
  return typeof v === 'number' && !Number.isNaN(v) ? v : null;
}

// ULM colours the icon by hvac_action: heating → warm orange, cooling → blue. We extend the
// read to idle/dry/fan and fall back to the hvac_mode when the entity reports no action.
// Heating uses --heat (not --down) so coral stays reserved for alert/fault/unavailable.
const TINTS: Record<string, string> = {
  heating: 'var(--heat)', heat: 'var(--heat)',
  cooling: 'var(--cool)', cool: 'var(--cool)', fan: 'var(--cool)', fan_only: 'var(--cool)',
  drying: 'var(--warm)', dry: 'var(--warm)',
  idle: 'var(--up)', auto: 'var(--up)', heat_cool: 'var(--up)',
};
const ICONS: Record<string, LucideIcon> = {
  heating: Flame, heat: Flame,
  cooling: Snowflake, cool: Snowflake,
  drying: Droplets, dry: Droplets,
  fan: Fan, fan_only: Fan,
};

export function readClimate(e: HassEntity | undefined, dead: boolean): ClimateView {
  const a = e?.attributes ?? {};
  const mode = e?.state ?? 'off'; // off | heat | cool | auto | heat_cool | dry | fan_only
  const on = !!e && mode !== 'off' && !dead;
  const action = (a.hvac_action as string | undefined) ?? (on ? mode : 'off');

  const low = num(a.target_temp_low);
  const high = num(a.target_temp_high);
  const dual = low != null && high != null;
  const target = num(a.temperature);

  return {
    on,
    action,
    tint: on ? TINTS[action] ?? 'var(--warm)' : 'var(--warm)',
    Icon: ICONS[action] ?? Thermometer,
    current: num(a.current_temperature),
    target,
    low,
    high,
    dual,
    step: num(a.target_temp_step) ?? 0.5,
    min: num(a.min_temp) ?? 7,
    max: num(a.max_temp) ?? 35,
    settable: on && !dual && target != null,
  };
}

/** "22°" / "21.5°" — one decimal only when it isn't whole. */
export function degrees(n: number): string {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}°`;
}
