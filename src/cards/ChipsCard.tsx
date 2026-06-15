import { type CSSProperties } from 'react';
import { useHass, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly } from '../util';
import { chipView } from './chip-util';

export interface ChipsCardConfig extends BaseCardConfig {
  /** Entities to show as a row of status chips. */
  entities?: string[];
}

/**
 * SimUI chips card — a wrapping row of compact status pills, one per entity: a small icon
 * tinted by state + a short value/state label. Tap a chip for HA's more-info. A glanceable
 * status strip (lights on, temperature, locks, presence…) for the top of a dashboard.
 */
export function ChipsCard({ config }: CardComponentProps<ChipsCardConfig>) {
  const hass = useHass();
  const moreInfo = useMoreInfo();
  const ids = config.entities ?? [];

  if (ids.length === 0) {
    return <div className="simui-chips simui-chips-empty">Add entities to show as chips</div>;
  }

  return (
    <div className="simui-chips">
      {ids.map((id) => {
        const e = hass.states[id];
        const v = chipView(e, id);
        const Icon = v.Icon;
        const name = e ? friendly(e) : id;
        return (
          <button
            key={id}
            type="button"
            className={`simui-chip${v.active ? ' is-on' : ''}${v.dead ? ' is-unavailable' : ''}`}
            style={{ ['--tile-tint' as string]: v.tint } as CSSProperties}
            aria-label={`${name}: ${v.label}`}
            title={name}
            onClick={() => moreInfo(id)}
            onContextMenu={(ev) => {
              ev.preventDefault();
              moreInfo(id);
            }}
          >
            <span className="simui-chip-ic" aria-hidden="true">
              <Icon size={16} strokeWidth={2} />
            </span>
            {v.label && <span className="simui-chip-label">{v.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
