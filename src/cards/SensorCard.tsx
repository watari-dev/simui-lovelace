import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useEntity, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { domainOf, friendly, isActivateKey, isUnavailable } from '../util';
import { formatSensor, sensorIcon, sensorTint, VALID_COLORS } from './sensor-util';

export interface SensorCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Override the device-class tint: warm | cool | up | down | grey. */
  color?: string;
}

/**
 * SimUI sensor card — a read-only ULM tile with the *value* as the headline (bold) and the
 * name beneath it (dim), an icon disc tinted by device class. Tap opens HA's more-info.
 */
export function SensorCard({ config }: CardComponentProps<SensorCardConfig>) {
  const e = useEntity(config.entity);
  const moreInfo = useMoreInfo();

  const dead = isUnavailable(e);
  const dc = e?.attributes.device_class as string | undefined;
  const Icon = sensorIcon(dc);
  const tint = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const value = !config.entity ? '—' : dead ? 'Unavailable' : e ? formatSensor(e) : 'Unknown';

  // A live analogue reading is always "active"; a binary_sensor is only active when 'on'
  // (so an `off` motion/contact sensor isn't tinted as if it were tripped).
  const binary = !!e && domainOf(e.entity_id) === 'binary_sensor';
  const active = !dead && !!e && (!binary || e.state === 'on');
  const open = () => config.entity && moreInfo(config.entity);

  const cls = `simui-tile${active ? ' is-on' : ''}${dead ? ' is-unavailable' : ''}`;

  return (
    <div
      className={cls}
      style={{ ['--tile-tint' as string]: tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${value}`}
      tabIndex={0}
      onClick={open}
      onKeyDown={(ev: ReactKeyboardEvent) => {
        if (isActivateKey(ev.key)) {
          ev.preventDefault();
          open();
        }
      }}
      onContextMenu={(ev) => {
        ev.preventDefault();
        if (config.entity) moreInfo(config.entity);
      }}
    >
      <span className="simui-tile-ic" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="simui-tile-name simui-tile-value" title={value}>{value}</span>
      <span className="simui-tile-state" title={name}>{config.entity ? name : 'Select a sensor'}</span>
    </div>
  );
}
