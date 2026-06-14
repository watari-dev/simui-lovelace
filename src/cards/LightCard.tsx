import { type CSSProperties, type MouseEvent } from 'react';
import { Lightbulb } from 'lucide-react';
import { useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';

export interface LightCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
}

/**
 * SimUI light card — the Minimalist "tile is the slider": a round icon disc that
 * toggles in place, a drag anywhere to set brightness, a soft yellow wash + a faint
 * rising fill when on, and a tap on the body opens HA's native more-info dialog.
 */
export function LightCard({ config }: CardComponentProps<LightCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();

  const dead = isUnavailable(e);
  const on = !!e && e.state === 'on';
  const name = config.name ?? (e ? friendly(e) : config.entity);

  const brightness = (e?.attributes.brightness as number | undefined) ?? 0;
  const livePct = on ? Math.max(1, Math.round((brightness / 255) * 100)) : 0;

  const drag = useDragValue({
    value: livePct,
    axis: 'vertical',
    step: 1,
    disabled: dead,
    onCommit: (v) => call('light', 'turn_on', { brightness_pct: v }, { entity_id: config.entity }),
  });

  const value = dead ? 0 : drag.value;

  const onBody = () => {
    if (drag.moved()) return; // a drag set brightness — don't also open the dialog
    moreInfo(config.entity);
  };
  const onIcon = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    call('light', on ? 'turn_off' : 'turn_on', {}, { entity_id: config.entity });
  };

  const fill: CSSProperties = drag.fillStyle;
  const cls =
    `simui-slidertile${on ? ' is-on' : ''}${drag.dragging ? ' is-dragging' : ''}${dead ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--slider-tint' as string]: 'var(--warm)' } as CSSProperties}
      role="slider"
      aria-label={`${name} brightness`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value}%`}
      tabIndex={0}
      onClick={onBody}
      onContextMenu={(ev) => {
        ev.preventDefault();
        moreInfo(config.entity);
      }}
      {...(dead ? {} : drag.handlers)}
    >
      <span className="simui-slidertile-fill" style={fill} aria-hidden="true" />
      <span className="simui-slidertile-body">
        <span className="simui-slidertile-head">
          <button
            type="button"
            className={`simui-slidertile-ic${on ? ' on' : ''}`}
            aria-label={on ? 'Turn off' : 'Turn on'}
            onClick={onIcon}
            onPointerDown={(ev) => ev.stopPropagation()}
          >
            <Lightbulb size={19} strokeWidth={2} {...(on ? { fill: 'currentColor', fillOpacity: 0.16 } : {})} />
          </button>
          <span className="simui-slidertile-pct">{dead ? 'Unavailable' : on ? `${value}%` : 'Off'}</span>
        </span>
        <span className="simui-slidertile-name" title={name}>{name}</span>
      </span>
    </div>
  );
}
