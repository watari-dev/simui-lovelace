import { type CSSProperties } from 'react';
import { Zap } from 'lucide-react';
import { useActions, useHass, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { ActionConfig } from '../core/actions';
import type { BaseCardConfig } from '../core/types';
import { friendly } from '../util';
import { renderIcon } from '../core/icon';
import { chipView } from './chip-util';
import { accentVar } from './luminous';

/** One configurable chip — a live entity-status pill, or a pure action button. */
export interface ChipItem {
  /** The entity whose icon / value / tint drive the chip. Omit for a pure action chip. */
  entity?: string;
  /** Override the value label (or label a pure action chip). */
  name?: string;
  /** Override the icon. */
  icon?: string;
  /** Override the accent colour: warm | cool | up | down | grey | heat. */
  color?: string;
  /** Run an action on tap. Default: HA more-info on the entity. */
  tap_action?: ActionConfig;
}

export interface ChipsCardConfig extends BaseCardConfig {
  /** Simple: a plain list of entities, each shown as a status chip. */
  entities?: string[];
  /** Advanced: configurable chips (icon / name / colour / action). Supersedes `entities`. */
  chips?: ChipItem[];
}

/**
 * SimUI chips card — a wrapping strip of lit pills. Each chip is either a live entity-status
 * pill (a glowing icon disc tinted by state + a short value label) or a pure action button.
 * Per-chip you can override the icon, label, accent colour, and tap action. Tap runs the
 * chip's action (default: HA more-info). A glanceable, fully editable status strip.
 */
export function ChipsCard({ config }: CardComponentProps<ChipsCardConfig>) {
  const hass = useHass();
  const moreInfo = useMoreInfo();
  const run = useActions();
  const items: ChipItem[] = config.chips ?? (config.entities ?? []).map((id) => ({ entity: id }));

  if (items.length === 0) {
    return <div className="strip-empty">Add chips to show</div>;
  }

  return (
    <div className="strip">
      {items.map((item, i) => {
        const e = item.entity ? hass.states[item.entity] : undefined;
        const v = item.entity ? chipView(e, item.entity) : null;
        const Icon = v?.Icon;
        const tint = accentVar(item.color) ?? v?.tint ?? 'var(--cool)';
        const label = item.name ?? v?.label ?? '';
        const dead = v?.dead ?? false;
        const title = item.name ?? (e ? friendly(e) : item.entity ?? '');
        const fallback = Icon ? <Icon size={15} strokeWidth={1.8} /> : <Zap size={15} strokeWidth={1.8} />;
        const onTap = () => {
          if (item.tap_action) run(item.tap_action, item.entity);
          else if (item.entity) moreInfo(item.entity);
        };
        return (
          <button
            key={i}
            type="button"
            className={`chip${dead ? ' is-dead' : ''}`}
            style={{ ['--acc']: tint } as CSSProperties}
            aria-label={`${title}${label ? `: ${label}` : ''}`}
            title={title}
            onClick={onTap}
            onContextMenu={(ev) => { ev.preventDefault(); if (item.entity) moreInfo(item.entity); }}
          >
            <span className="cd" aria-hidden="true">{renderIcon(item.icon, 15, fallback)}</span>
            {label ? <span className="cv">{label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
