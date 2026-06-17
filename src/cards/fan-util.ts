import { Fan, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';
import { supportsFeature } from '../util';

// FanEntityFeature bits.
export const FAN_SET_SPEED = 1, FAN_OSCILLATE = 2, FAN_DIRECTION = 4, FAN_PRESET_MODE = 8;

export interface FanView {
  on: boolean;
  pct: number;
  hasSpeed: boolean;
  step: number;
  /** Dot count derived from percentage_step (e.g. a 10%-step fan → 10 dots), or null to use the default. */
  segments: number | null;
  canOscillate: boolean;
  oscillating: boolean;
  canDirection: boolean;
  direction: 'forward' | 'reverse' | null;
  presetModes: string[];
  presetMode: string | null;
  hasPreset: boolean;
  Icon: LucideIcon;
  tint: string;
  label: string;
}

/** Normalize a fan entity into a view object — speed, presets, oscillate, direction; every
 *  attribute guarded so on/off-only fans (no percentage/preset/oscillate) degrade cleanly. */
export function readFan(e: HassEntity | undefined, dead: boolean): FanView {
  const a = e?.attributes ?? {};
  const on = !dead && e?.state === 'on';
  const percentage = a.percentage as number | undefined;
  const hasSpeed = !!e && supportsFeature(e, FAN_SET_SPEED) && percentage != null;
  const pct = on ? Math.round(percentage ?? 0) : 0;
  const step = (a.percentage_step as number | undefined) ?? 1;
  const dots = step > 0 ? Math.round(100 / step) : 0;
  const segments = dots >= 4 && dots <= 14 && Math.abs(dots * step - 100) < 0.5 ? dots : null;
  const presetModes = (a.preset_modes as string[] | undefined) ?? [];
  const presetMode = (a.preset_mode as string | undefined) ?? null;
  return {
    on,
    pct,
    hasSpeed,
    step,
    segments,
    canOscillate: !!e && supportsFeature(e, FAN_OSCILLATE),
    oscillating: a.oscillating === true,
    canDirection: !!e && supportsFeature(e, FAN_DIRECTION),
    direction: (a.direction as 'forward' | 'reverse' | undefined) ?? null,
    presetModes,
    presetMode,
    hasPreset: !!e && supportsFeature(e, FAN_PRESET_MODE) && presetModes.length > 0,
    Icon: Fan,
    tint: 'var(--cool)',
    label: !on ? 'Off' : presetMode ?? (hasSpeed ? `${pct}%` : 'On'),
  };
}
