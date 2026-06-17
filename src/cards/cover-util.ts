import { Blinds, DoorClosed, DoorOpen, Warehouse, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';
import { prettyState, supportsFeature } from '../util';

// CoverEntityFeature bits
export const COVER_OPEN = 1;
export const COVER_CLOSE = 2;
export const COVER_SET_POSITION = 4;
export const COVER_STOP = 8;
export const COVER_SET_TILT_POSITION = 128;

function coverIcon(dc: string | undefined, open: boolean): LucideIcon {
  if (dc === 'garage') return Warehouse;
  if (dc === 'door' || dc === 'gate') return open ? DoorOpen : DoorClosed;
  return Blinds; // blind / shade / shutter / curtain / awning / window / default
}

export interface CoverView {
  position: number | null; // 0 closed … 100 open
  tilt: number | null; // 0 … 100, or null if not a tilting cover
  open: boolean;
  moving: boolean;
  settable: boolean; // supports set_position → draggable
  canTilt: boolean; // supports set_tilt_position
  canOpen: boolean;
  canClose: boolean;
  canStop: boolean;
  Icon: LucideIcon;
  tint: string;
  label: string;
}

export function readCover(e: HassEntity | undefined, dead: boolean): CoverView {
  const a = e?.attributes ?? {};
  const state = e?.state ?? 'closed';
  const position = typeof a.current_position === 'number' ? a.current_position : null;
  const tilt = typeof a.current_tilt_position === 'number' ? a.current_tilt_position : null;
  const moving = state === 'opening' || state === 'closing';
  const open = state === 'open' || state === 'opening' || (position != null && position > 0);

  const label = moving
    ? prettyState(state)
    : position != null
      ? position === 0
        ? 'Closed'
        : position === 100
          ? 'Open'
          : `${position}% open`
      : prettyState(state);

  return {
    position,
    tilt,
    open,
    moving,
    settable: !dead && !!e && supportsFeature(e, COVER_SET_POSITION) && position != null,
    canTilt: !!e && supportsFeature(e, COVER_SET_TILT_POSITION),
    canOpen: !!e && supportsFeature(e, COVER_OPEN),
    canClose: !!e && supportsFeature(e, COVER_CLOSE),
    canStop: !!e && supportsFeature(e, COVER_STOP),
    Icon: coverIcon(a.device_class as string | undefined, open),
    tint: 'var(--cool)',
    label,
  };
}
