import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { Thermometer } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable, prettyState, stepKey } from '../util';
import { renderIcon } from '../core/icon';
import { degrees, readClimate } from './climate-util';

export interface ClimateCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
}

// HA doesn't expose a "last mode", and hvac_modes[] is in driver-declaration order — so the
// first non-off entry is unreliable (it's `fan_only` on many ACs). Prefer a real conditioning
// mode: heat_cool/auto self-regulate, then heat, then cool, with fan/dry last.
const PREFERRED_MODES = ['heat_cool', 'auto', 'heat', 'cool', 'dry', 'fan_only'];

/**
 * SimUI climate card — the ULM thermostat tile: an icon disc tinted by hvac action
 * (heating → red, cooling → blue), the name, and a "current → target" line. Drag the
 * tile to set the target temperature; tap the disc toggles on/off; tap the body /
 * right-click opens HA's native more-info.
 */
export function ClimateCard({ config }: CardComponentProps<ClimateCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runTap = useActions();

  const dead = isUnavailable(e);
  const v = readClimate(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  const drag = useDragValue({
    value: v.target ?? v.min,
    axis: 'vertical',
    step: v.step,
    min: v.min,
    max: v.max,
    disabled: !v.settable,
    onCommit: (t) => call('climate', 'set_temperature', { temperature: t }, { entity_id: config.entity }),
  });

  // No entity yet (fresh editor) — placeholder, rendered after every hook runs.
  if (!config.entity) {
    return (
      <div className="simui-tile is-unavailable" role="button" aria-label="Select a thermostat" tabIndex={0}>
        <span className="simui-tile-ic" aria-hidden="true">
          <Thermometer size={20} strokeWidth={2} />
        </span>
        <span className="simui-tile-name">Select a thermostat</span>
        <span className="simui-tile-state">Set up</span>
      </div>
    );
  }

  const target = v.settable ? drag.value : v.target;
  const stateLine = dead
    ? 'Unavailable'
    : !v.on
      ? 'Off'
      : v.dual && v.low != null && v.high != null
        ? `${degrees(v.low)}–${degrees(v.high)}`
        : target != null
          ? v.current != null
            ? `${degrees(v.current)} → ${degrees(target)}`
            : degrees(target)
          : v.current != null
            ? degrees(v.current)
            : prettyState(e?.state ?? 'off');

  const onBody = () => {
    if (drag.moved()) return;
    runTap(config.tap_action, config.entity);
  };
  const onIcon = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    if (v.on) {
      call('climate', 'set_hvac_mode', { hvac_mode: 'off' }, { entity_id: config.entity });
      return;
    }
    const modes = (e?.attributes.hvac_modes as string[] | undefined) ?? [];
    const primary = PREFERRED_MODES.find((m) => modes.includes(m)) ?? modes.find((m) => m !== 'off');
    if (!primary) return; // no actionable mode — don't toggle on with a guess
    call('climate', 'set_hvac_mode', { hvac_mode: primary }, { entity_id: config.entity });
  };
  const onKeyDown = (ev: ReactKeyboardEvent) => {
    if (v.settable && target != null) {
      const next = stepKey(ev.key, target, v.step, v.min, v.max);
      if (next != null) {
        ev.preventDefault();
        call('climate', 'set_temperature', { temperature: next }, { entity_id: config.entity });
        return;
      }
    }
    if (isActivateKey(ev.key)) {
      ev.preventDefault();
      moreInfo(config.entity);
    }
  };

  const Icon = v.Icon;
  const settable = v.settable;
  const cls =
    `simui-tile${v.on ? ' is-on' : ''}${drag.dragging ? ' is-dragging' : ''}${dead ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--tile-tint' as string]: v.tint } as CSSProperties}
      role={settable ? 'slider' : 'button'}
      aria-label={settable ? `${name} target temperature` : name}
      aria-valuemin={settable ? v.min : undefined}
      aria-valuemax={settable ? v.max : undefined}
      aria-valuenow={settable && target != null ? target : undefined}
      aria-valuetext={settable && target != null ? degrees(target) : undefined}
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
        aria-label={v.on ? 'Turn off' : 'Turn on'}
        onClick={onIcon}
        onPointerDown={(ev) => ev.stopPropagation()}
        onKeyDown={(ev) => ev.stopPropagation()}
      >
        {renderIcon(config.icon, 20, <Icon size={20} strokeWidth={2} />)}
      </button>
      <span className="simui-tile-name" title={name}>{name}</span>
      <span className="simui-tile-state">{stateLine}</span>
    </div>
  );
}
