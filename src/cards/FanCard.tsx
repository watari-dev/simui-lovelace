import { type CSSProperties, type MouseEvent } from 'react';
import { Fan, RefreshCw, Wind } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { readFan } from './fan-util';
import { ChipRow, DotBar, TileHead, accentVar, discIcon, sliderKeys, type ActionChip, type SliderStyle } from './luminous';

export interface FanCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (default cool — fans read as airflow). */
  color?: string;
  /** Speed slider style: dots (default) · bar · line · none (hidden). */
  slider?: SliderStyle | 'none';
  /** Show the control chip row (oscillate / presets / direction). Default true. */
  show_controls?: boolean;
  /** Show the oscillate chip when supported (default true). */
  show_oscillate?: boolean;
  /** Show preset-mode chips when available (default true). */
  show_presets?: boolean;
  /** Show the direction (forward/reverse) chip when supported (default true). */
  show_direction?: boolean;
  /** Override the preset list (else read from the fan's preset_modes). */
  presets?: string[];
  /** Custom action buttons appended to the control row. */
  buttons?: ActionChip[];
  compact?: boolean;
}

/**
 * SimUI fan card — the Luminous tile for a fan: a glowing disc (tap to toggle), the speed big,
 * the signature dot-bar (drag to set speed), and chips for oscillate / preset mode / direction
 * gated by the fan's features. Degrades to a clean on/off tile for switch-style fans.
 */
export function FanCard({ config }: CardComponentProps<FanCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readFan(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  const settable = !dead && v.hasSpeed;
  const setSpeed = (val: number) =>
    val <= 0
      ? call('fan', 'turn_off', {}, { entity_id: config.entity })
      : call('fan', 'set_percentage', { percentage: val }, { entity_id: config.entity });
  const drag = useDragValue({ value: v.pct, axis: 'horizontal', step: v.step, min: 0, max: 100, disabled: !settable, onCommit: setSpeed });
  const pct = settable ? drag.value : v.pct;
  const actions = useActionHandler(config, config.entity, { moved: drag.moved });

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--cool)' } as CSSProperties} role="button" aria-label="Select a fan" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Fan, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a fan</div>
        </div>
      </div>
    );
  }

  const toggle = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (!dead) call('fan', v.on ? 'turn_off' : 'turn_on', {}, { entity_id: config.entity });
  };
  const presets = config.presets ?? v.presetModes;
  const valueNode = !v.hasSpeed ? (v.on ? 'On' : 'Off') : <>{pct}<span className="u">%</span></>;
  const showChips = !compact && config.show_controls !== false;

  const stop = (ev: MouseEvent) => ev.stopPropagation();
  const svc = (service: string, data: Record<string, unknown>) => (ev: MouseEvent) => { ev.stopPropagation(); call('fan', service, data, { entity_id: config.entity }); };

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? v.tint } as CSSProperties}
      role="button"
      aria-label={name}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        {compact ? (
          <>
            <div className="thead">
              <button type="button" className="disc" aria-label={v.on ? 'Turn off' : 'Turn on'} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()}>{renderIcon(config.icon, 18, discIcon(Fan, 18))}</button>
              <div className="num tnum">{valueNode}</div>
            </div>
            <div className="cname" title={name}>{name}</div>
          </>
        ) : (
          <>
            <TileHead disc={<button type="button" className="disc" aria-label={v.on ? 'Turn off' : 'Turn on'} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()}>{renderIcon(config.icon, 21, discIcon(Fan, 21))}</button>} name={name} active={v.on} />
            <div className="valrow"><div className="numwrap"><div className="num tnum">{valueNode}</div>{v.label && <div className="nsub">{v.label}</div>}</div></div>
          </>
        )}
      </div>
      <div className="ctl">
        {v.hasSpeed && config.slider !== 'none' && (
          <DotBar
            value={pct}
            segments={v.segments ?? (compact ? 12 : 14)}
            settable={settable}
            handlers={drag.handlers}
            ariaLabel={`${name} speed`}
            onKeyDown={sliderKeys(pct, setSpeed)}
            variant={config.slider ?? 'dots'}
          />
        )}
        {showChips && (v.canOscillate || v.hasPreset || v.canDirection) && (
          <div className="chips">
            {v.canOscillate && config.show_oscillate !== false && (
              <button type="button" className={v.oscillating ? 'on' : ''} onClick={svc('oscillate', { oscillating: !v.oscillating })} onPointerDown={stop}>
                <span className="chip-ic">{renderIcon('mdi:arrow-oscillating', 15, <Wind size={15} strokeWidth={1.8} />)}</span>Oscillate
              </button>
            )}
            {v.hasPreset && config.show_presets !== false && presets.map((p) => (
              <button key={p} type="button" className={v.presetMode === p ? 'on' : ''} onClick={svc('set_preset_mode', { preset_mode: p })} onPointerDown={stop}>{p}</button>
            ))}
            {v.canDirection && config.show_direction !== false && (
              <button type="button" className={v.direction === 'reverse' ? 'on' : ''} onClick={svc('set_direction', { direction: v.direction === 'forward' ? 'reverse' : 'forward' })} onPointerDown={stop}>
                <span className="chip-ic"><RefreshCw size={15} strokeWidth={1.8} /></span>{v.direction === 'reverse' ? 'Reverse' : 'Forward'}
              </button>
            )}
          </div>
        )}
        {!compact && <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />}
      </div>
    </div>
  );
}
