import {
  CircleHelp, Fan, Lightbulb, Lock, LockOpen, MapPin, Music, Power, ShieldAlert, ShieldCheck, ToggleRight,
  type LucideIcon,
} from 'lucide-react';
import type { HassEntity } from '../core/types';
import { domainOf, isUnavailable, prettyState } from '../util';
import { lightHasBrightness, lightTint } from './light-color';
import { formatSensor, sensorIcon, sensorTint } from './sensor-util';
import { readClimate } from './climate-util';
import { readCover } from './cover-util';
import { readMedia } from './media-util';

export interface ChipView {
  Icon: LucideIcon;
  tint: string;
  active: boolean; // icon tinted vs dim
  dead: boolean;
  label: string;
}

/** Map any entity to a compact chip (icon + tint + a short state/value label), dispatching
 *  by domain and reusing the per-card readers. */
export function chipView(entity: HassEntity | undefined, entityId: string): ChipView {
  const dead = isUnavailable(entity);
  if (!entity) return { Icon: CircleHelp, tint: 'var(--grey)', active: false, dead: true, label: '—' };

  const state = entity.state;
  const a = entity.attributes;
  const dc = a.device_class as string | undefined;

  switch (domainOf(entityId)) {
    case 'light': {
      const on = state === 'on';
      const bri = a.brightness as number | undefined;
      const label = dead ? '—' : !on ? 'Off' : lightHasBrightness(a) && bri != null ? `${Math.max(1, Math.round(bri / 2.55))}%` : 'On';
      return { Icon: Lightbulb, tint: on ? lightTint(a) : 'var(--warm)', active: on, dead, label };
    }
    case 'switch':
    case 'input_boolean': {
      const on = state === 'on';
      // A controllable thing that's ON is amber (like lights) — keep --up for good/secure/charging.
      return { Icon: on ? ToggleRight : Power, tint: 'var(--warm)', active: on, dead, label: dead ? '—' : on ? 'On' : 'Off' };
    }
    case 'fan': {
      const on = state === 'on';
      return { Icon: Fan, tint: 'var(--cool)', active: on, dead, label: dead ? '—' : on ? 'On' : 'Off' };
    }
    case 'climate': {
      const v = readClimate(entity, dead);
      return { Icon: v.Icon, tint: v.tint, active: v.on, dead, label: v.current != null ? `${Math.round(v.current)}°` : prettyState(state) };
    }
    case 'cover': {
      const v = readCover(entity, dead);
      return { Icon: v.Icon, tint: v.tint, active: v.open, dead, label: v.label };
    }
    case 'lock': {
      const locked = state === 'locked';
      const tint = locked ? 'var(--up)' : state === 'jammed' ? 'var(--down)' : 'var(--warm)';
      const Icon = locked || state === 'locking' || state === 'jammed' ? Lock : LockOpen;
      return { Icon, tint, active: !dead, dead, label: prettyState(state) };
    }
    case 'media_player': {
      const v = readMedia(entity, dead);
      return { Icon: Music, tint: 'var(--cool)', active: v.active, dead, label: v.active && v.mediaTitle ? v.mediaTitle : prettyState(state) };
    }
    case 'binary_sensor': {
      const on = state === 'on';
      return { Icon: sensorIcon(dc), tint: sensorTint(dc), active: on, dead, label: prettyState(state) };
    }
    case 'sensor':
      return { Icon: sensorIcon(dc), tint: sensorTint(dc), active: !dead, dead, label: dead ? '—' : formatSensor(entity) };
    case 'person':
    case 'device_tracker': {
      const home = state === 'home';
      return { Icon: MapPin, tint: home ? 'var(--up)' : 'var(--grey)', active: home, dead, label: prettyState(state) };
    }
    case 'alarm_control_panel': {
      const armed = state !== 'disarmed';
      return { Icon: armed ? ShieldAlert : ShieldCheck, tint: armed ? 'var(--down)' : 'var(--up)', active: armed, dead, label: prettyState(state) };
    }
    default: {
      const unit = a.unit_of_measurement as string | undefined;
      const active = !dead && state !== 'off' && state !== 'closed';
      return { Icon: sensorIcon(dc), tint: sensorTint(dc), active, dead, label: dead ? '—' : unit ? formatSensor(entity) : prettyState(state) };
    }
  }
}
