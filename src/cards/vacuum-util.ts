import { BatteryCharging, Bot, CircleAlert, Home, Pause, Play, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';
import { prettyState, supportsFeature } from '../util';

// VacuumEntityFeature bits.
export const VAC_PAUSE = 4, VAC_STOP = 8, VAC_RETURN_HOME = 16, VAC_FAN_SPEED = 32, VAC_LOCATE = 512, VAC_START = 8192;

export type VacuumAction = 'start' | 'pause' | 'stop' | 'return_to_base' | 'locate';

interface StateMeta { word: string; short: string; Icon: LucideIcon; tint: string; cleaning: boolean; }
const STATES: Record<string, StateMeta> = {
  cleaning: { word: 'Cleaning', short: 'On', Icon: Play, tint: 'var(--cool)', cleaning: true },
  returning: { word: 'Returning', short: 'Return', Icon: Home, tint: 'var(--cool)', cleaning: true },
  paused: { word: 'Paused', short: 'Paused', Icon: Pause, tint: 'var(--warm)', cleaning: false },
  idle: { word: 'Idle', short: 'Idle', Icon: Bot, tint: 'var(--grey)', cleaning: false },
  docked: { word: 'Docked', short: 'Dock', Icon: BatteryCharging, tint: 'var(--up)', cleaning: false },
  error: { word: 'Error', short: 'Error', Icon: CircleAlert, tint: 'var(--down)', cleaning: false },
};
const ALIAS: Record<string, string> = { on: 'cleaning', off: 'idle' };

const FEATURE: Record<VacuumAction, number> = { start: VAC_START, pause: VAC_PAUSE, stop: VAC_STOP, return_to_base: VAC_RETURN_HOME, locate: VAC_LOCATE };
export const ACTION_ORDER: VacuumAction[] = ['start', 'pause', 'stop', 'return_to_base', 'locate'];
export const ACTION_LABEL: Record<VacuumAction, string> = { start: 'Clean', pause: 'Pause', stop: 'Stop', return_to_base: 'Dock', locate: 'Locate' };

export interface VacuumView {
  state: string;
  word: string;
  short: string;
  Icon: LucideIcon;
  tint: string;
  cleaning: boolean;
  error: boolean;
  battery: number | null;
  fanSpeed: string | null;
  fanSpeedList: string[];
  hasFanSpeed: boolean;
  available: VacuumAction[];
  canStart: boolean;
  canPause: boolean;
  canStop: boolean;
  caption: string;
}

/** Normalize a vacuum entity — state → word/tint/icon, supported actions, battery, fan speed.
 *  Every attribute guarded so a minimal vacuum (start/stop only, no battery) degrades cleanly. */
export function readVacuum(e: HassEntity | undefined, dead: boolean): VacuumView {
  const a = e?.attributes ?? {};
  const raw = e?.state ?? 'unknown';
  const key = ALIAS[raw] ?? raw;
  const meta = STATES[key] ?? { word: prettyState(raw), short: prettyState(raw), Icon: Bot, tint: 'var(--grey)', cleaning: false };

  const battery = typeof a.battery_level === 'number' ? Math.round(a.battery_level as number) : null;
  const fanSpeedList = Array.isArray(a.fan_speed_list) ? (a.fan_speed_list as string[]) : [];
  const fanSpeed = typeof a.fan_speed === 'string' ? (a.fan_speed as string) : null;
  const available = e ? ACTION_ORDER.filter((act) => supportsFeature(e, FEATURE[act])) : [];

  const status = typeof a.status === 'string' ? (a.status as string) : null;
  const cleanedArea = typeof a.cleaned_area === 'number' ? (a.cleaned_area as number) : null;
  let caption: string;
  if (dead) caption = 'Unavailable';
  else if (key === 'error') caption = status ?? 'Error';
  else if (meta.cleaning && cleanedArea != null && cleanedArea > 0) caption = `${meta.word} · ${cleanedArea} m²`;
  else caption = status ?? meta.word;

  return {
    state: key,
    word: meta.word,
    short: meta.short,
    Icon: meta.Icon,
    tint: meta.tint,
    cleaning: meta.cleaning,
    error: key === 'error',
    battery,
    fanSpeed,
    fanSpeedList,
    hasFanSpeed: !!e && supportsFeature(e, VAC_FAN_SPEED) && fanSpeedList.length > 0,
    available,
    canStart: available.includes('start'),
    canPause: available.includes('pause'),
    canStop: available.includes('stop'),
    caption,
  };
}
