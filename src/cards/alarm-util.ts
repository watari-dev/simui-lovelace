import { Clock, Shield, ShieldCheck, ShieldOff, ShieldQuestion, Siren, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';
import { prettyState, supportsFeature } from '../util';

// AlarmControlPanelEntityFeature bits.
export const ALARM_ARM_HOME = 1, ALARM_ARM_AWAY = 2, ALARM_ARM_NIGHT = 4, ALARM_TRIGGER = 8, ALARM_ARM_CUSTOM_BYPASS = 16, ALARM_ARM_VACATION = 32;

export type AlarmAction = 'arm_home' | 'arm_away' | 'arm_night' | 'arm_vacation' | 'arm_custom_bypass';

const FEATURE: Record<AlarmAction, number> = {
  arm_home: ALARM_ARM_HOME,
  arm_away: ALARM_ARM_AWAY,
  arm_night: ALARM_ARM_NIGHT,
  arm_vacation: ALARM_ARM_VACATION,
  arm_custom_bypass: ALARM_ARM_CUSTOM_BYPASS,
};
export const ARM_ORDER: AlarmAction[] = ['arm_home', 'arm_away', 'arm_night', 'arm_vacation', 'arm_custom_bypass'];
export const ARM_LABEL: Record<AlarmAction, string> = { arm_home: 'Home', arm_away: 'Away', arm_night: 'Night', arm_vacation: 'Vacation', arm_custom_bypass: 'Custom' };
export const ARM_STATE: Record<AlarmAction, string> = { arm_home: 'armed_home', arm_away: 'armed_away', arm_night: 'armed_night', arm_vacation: 'armed_vacation', arm_custom_bypass: 'armed_custom_bypass' };

interface StateMeta { word: string; short: string; Icon: LucideIcon; tint: string; }
const STATES: Record<string, StateMeta> = {
  disarmed: { word: 'Disarmed', short: 'Off', Icon: ShieldOff, tint: 'var(--up)' },
  armed_home: { word: 'Armed Home', short: 'Home', Icon: ShieldCheck, tint: 'var(--warm)' },
  armed_night: { word: 'Armed Night', short: 'Night', Icon: ShieldCheck, tint: 'var(--warm)' },
  armed_away: { word: 'Armed Away', short: 'Away', Icon: Shield, tint: 'var(--down)' },
  armed_vacation: { word: 'Armed Vacation', short: 'Vacation', Icon: Shield, tint: 'var(--down)' },
  armed_custom_bypass: { word: 'Armed Custom', short: 'Custom', Icon: Shield, tint: 'var(--down)' },
  triggered: { word: 'Triggered', short: 'Alarm', Icon: Siren, tint: 'var(--down)' },
  pending: { word: 'Pending', short: 'Pending', Icon: Clock, tint: 'var(--cool)' },
  arming: { word: 'Arming', short: 'Arming', Icon: Clock, tint: 'var(--cool)' },
  disarming: { word: 'Disarming', short: 'Disarming', Icon: Clock, tint: 'var(--cool)' },
};

export interface AlarmView {
  state: string;
  word: string;
  short: string;
  Icon: LucideIcon;
  tint: string;
  armed: boolean;
  pending: boolean;
  triggered: boolean;
  /** Disarm needs a code (code_format set) → route to more-info, never prompt. */
  codeGated: boolean;
  /** Arming needs a code (code_arm_required) → route to more-info. */
  armCodeRequired: boolean;
  available: AlarmAction[];
  caption: string;
}

/** Normalize an alarm_control_panel entity — state → word/tint/icon, supported arm actions,
 *  code gating, and a status caption. All Alarmo-specific extras degrade gracefully. */
export function readAlarm(e: HassEntity | undefined, dead: boolean): AlarmView {
  const state = e?.state ?? 'unknown';
  const a = e?.attributes ?? {};
  const meta = STATES[state] ?? { word: prettyState(state), short: prettyState(state), Icon: ShieldQuestion, tint: 'var(--grey)' };
  const pending = state === 'arming' || state === 'pending' || state === 'disarming';
  const available = e ? ARM_ORDER.filter((act) => supportsFeature(e, FEATURE[act])) : [];

  const changedBy = a.changed_by as string | undefined;
  const delay = a.delay as number | undefined;
  const open = a.open_sensors && typeof a.open_sensors === 'object' ? Object.keys(a.open_sensors as object) : [];
  let caption: string;
  if (dead) caption = 'Unavailable';
  else if (pending && delay) caption = `${meta.word} · ${delay}s`;
  else if (open.length) caption = `${open.length} sensor${open.length > 1 ? 's' : ''} open`;
  else if (changedBy) caption = `${meta.word} · by ${changedBy}`;
  else caption = meta.word;

  return {
    state,
    word: meta.word,
    short: meta.short,
    Icon: meta.Icon,
    tint: meta.tint,
    armed: state.startsWith('armed') || state === 'triggered',
    pending,
    triggered: state === 'triggered',
    codeGated: a.code_format != null,
    armCodeRequired: a.code_arm_required === true,
    available,
    caption,
  };
}
