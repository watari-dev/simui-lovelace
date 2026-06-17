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
 * SimUI chips card — a wrapping strip of lit status pills, one per entity: a small glowing
 * icon disc tinted by state + a short value label. Tap a chip for HA's more-info. A
 * glanceable status strip for the top of a dashboard.
 */
export function ChipsCard({ config }: CardComponentProps<ChipsCardConfig>) {
  const hass = useHass();
  const moreInfo = useMoreInfo();
  const ids = config.entities ?? [];

  if (ids.length === 0) {
    return <div className="strip-empty">Add entities to show as chips</div>;
  }

  return (
    <div className="strip">
      {ids.map((id) => {
        const e = hass.states[id];
        const v = chipView(e, id);
        const Icon = v.Icon;
        const name = e ? friendly(e) : id;
        return (
          <button
            key={id}
            type="button"
            className={`chip${v.dead ? ' is-dead' : ''}`}
            style={{ ['--acc']: v.tint } as CSSProperties}
            aria-label={`${name}: ${v.label}`}
            title={name}
            onClick={() => moreInfo(id)}
            onContextMenu={(ev) => { ev.preventDefault(); moreInfo(id); }}
          >
            <span className="cd" aria-hidden="true"><Icon size={15} strokeWidth={1.8} /></span>
            <span className="cv">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
