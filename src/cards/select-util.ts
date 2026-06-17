import { ListChecks, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';

export interface SelectOption { option: string; name?: string; icon?: string; }

/** Label an option preserving its casing (only underscores → spaces + first-char capitalised),
 *  so all-caps values like "DIVA" or "Port 0" survive — unlike prettyState which lowercases. */
export function labelOption(opt: string, overrides?: SelectOption[]): string {
  const o = overrides?.find((x) => x.option === opt);
  if (o?.name) return o.name;
  const s = opt.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface SelectView {
  options: string[];
  current: string | null;
  index: number;
  count: number;
  serviceDomain: string;
  next: string | null;
  prev: string | null;
  Icon: LucideIcon;
  tint: string;
  entityIcon?: string;
}

/** Normalize a select / input_select entity. The option SET is the live attributes.options —
 *  never synthesised; `serviceDomain` keeps select.* vs input_select.* correct. */
export function readSelect(e: HassEntity | undefined, dead: boolean): SelectView {
  const a = e?.attributes ?? {};
  const options = Array.isArray(a.options) ? (a.options as string[]) : [];
  const current = !dead && e ? e.state : null;
  const index = current != null ? options.indexOf(current) : -1;
  const count = options.length;
  const anchor = index >= 0 ? index : 0;
  return {
    options,
    current,
    index,
    count,
    serviceDomain: e ? e.entity_id.split('.', 1)[0] : 'select',
    next: count > 0 ? options[(anchor + 1) % count] : null,
    prev: count > 0 ? options[(anchor - 1 + count) % count] : null,
    Icon: ListChecks,
    tint: 'var(--cool)',
    entityIcon: typeof a.icon === 'string' ? (a.icon as string) : undefined,
  };
}
