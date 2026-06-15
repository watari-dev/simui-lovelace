import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { Lightbulb } from 'lucide-react';
import { useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable, stepKey } from '../util';
import { lightHasBrightness, lightTint } from './light-color';

export interface LightCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Tint the tile with the bulb's own colour (default true). false ⇒ always soft yellow. */
  use_light_color?: boolean;
}

/**
 * SimUI light card — the UI-Lovelace-Minimalist entity tile: a round icon disc on the
 * left (tap to toggle, it carries the state colour), the name + a dim state line stacked
 * to its right, and a whisper-thin brightness underline when on. Drag anywhere sets
 * brightness; tap the body / right-click opens HA's native more-info dialog.
 */
export function LightCard({ config }: CardComponentProps<LightCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();

  const dead = isUnavailable(e);
  const on = !!e && e.state === 'on';
  const name = config.name ?? (e ? friendly(e) : config.entity);

  // Brightness-only when the light actually supports it; an on/off-only light just toggles.
  const hasBrightness = !!e && lightHasBrightness(e.attributes);
  const settable = !dead && hasBrightness;
  // Tint with the bulb's own colour (Apple-Home), unless the user opted out.
  const tint = e && config.use_light_color !== false ? lightTint(e.attributes) : 'var(--warm)';

  const brightness = (e?.attributes.brightness as number | undefined) ?? 0;
  const livePct = on ? Math.max(1, Math.round((brightness / 255) * 100)) : 0;

  const drag = useDragValue({
    value: livePct,
    axis: 'vertical',
    step: 1,
    disabled: !settable,
    onCommit: (v) => call('light', 'turn_on', { brightness_pct: v }, { entity_id: config.entity }),
  });

  // No entity chosen yet (fresh card in the editor) — a calm placeholder, never a crash.
  // (Rendered after every hook runs, so hook order stays stable as the entity is picked.)
  if (!config.entity) {
    return (
      <div className="simui-tile is-unavailable" role="button" aria-label="Select a light" tabIndex={0}>
        <span className="simui-tile-ic" aria-hidden="true">
          <Lightbulb size={20} strokeWidth={2} />
        </span>
        <span className="simui-tile-name">Select a light</span>
        <span className="simui-tile-state">Set up</span>
      </div>
    );
  }

  const value = dead ? 0 : drag.value;
  const readout = dead ? 'Unavailable' : !hasBrightness ? (on ? 'On' : 'Off') : on ? `${value}%` : 'Off';

  const onBody = () => {
    if (drag.moved()) return; // a drag set brightness — don't also open the dialog
    moreInfo(config.entity);
  };
  const onIcon = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    call('light', on ? 'turn_off' : 'turn_on', {}, { entity_id: config.entity });
  };
  const onKeyDown = (ev: ReactKeyboardEvent) => {
    if (settable) {
      const next = stepKey(ev.key, value, 5, 0, 100); // 5% keyboard steps
      if (next != null) {
        ev.preventDefault();
        if (next === 0) call('light', 'turn_off', {}, { entity_id: config.entity });
        else call('light', 'turn_on', { brightness_pct: next }, { entity_id: config.entity });
        return;
      }
    }
    if (isActivateKey(ev.key)) {
      ev.preventDefault();
      moreInfo(config.entity);
    }
  };

  const cls =
    `simui-tile${on ? ' is-on' : ''}${drag.dragging ? ' is-dragging' : ''}${dead ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--tile-tint' as string]: tint } as CSSProperties}
      role={settable ? 'slider' : 'button'}
      aria-label={settable ? `${name} brightness` : name}
      aria-valuemin={settable ? 0 : undefined}
      aria-valuemax={settable ? 100 : undefined}
      aria-valuenow={settable ? value : undefined}
      aria-valuetext={settable ? `${value}%` : undefined}
      tabIndex={0}
      onClick={onBody}
      onKeyDown={onKeyDown}
      onContextMenu={(ev) => {
        ev.preventDefault();
        moreInfo(config.entity);
      }}
      {...(settable ? drag.handlers : {})}
    >
      <button
        type="button"
        className="simui-tile-ic"
        aria-label={on ? 'Turn off' : 'Turn on'}
        onClick={onIcon}
        onPointerDown={(ev) => ev.stopPropagation()}
        onKeyDown={(ev) => ev.stopPropagation()}
      >
        <Lightbulb size={20} strokeWidth={2} {...(on ? { fill: 'currentColor', fillOpacity: 0.18 } : {})} />
      </button>
      <span className="simui-tile-name" title={name}>{name}</span>
      <span className="simui-tile-state">{readout}</span>
    </div>
  );
}
