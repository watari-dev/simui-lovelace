import { type CSSProperties, type MouseEvent } from 'react';
import { Thermometer } from 'lucide-react';
import { useActions, useCallService, useEntity, useHass, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import { useDragValue } from '../hooks/useDragValue';
import { clamp, friendly, isUnavailable, prettyState } from '../util';
import type { CardComponentProps } from '../core/react-card';
import type { ActionConfig } from '../core/actions';
import type { BaseCardConfig } from '../core/types';
import { renderIcon } from '../core/icon';
import { readClimate } from './climate-util';
import { TempTrack, accentVar, discIcon } from './luminous';

/** One configurable mode chip — sets an HVAC mode, preset, temperature, or runs an action. */
export interface ClimateChip {
  name?: string;
  icon?: string;
  /** Set the HVAC mode (heat / cool / auto / off …). */
  mode?: string;
  /** Set a preset mode (eco / away / comfort …). */
  preset?: string;
  /** Set a target temperature. */
  temperature?: number;
  /** Run an arbitrary action instead. */
  tap_action?: ActionConfig;
}

export interface ClimateCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (overrides the automatic hvac-action tint). */
  color?: string;
  /** Show the draggable temperature track (default true). */
  show_track?: boolean;
  /** Show the mode-chip row (default true). */
  show_modes?: boolean;
  /** The mode chips. Omit for the default Heat / Auto / Cool derived from hvac_modes. */
  modes?: ClimateChip[];
  compact?: boolean;
}

const fmt = (n: number): string => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

/**
 * SimUI climate card — the Luminous thermostat tile: a disc tinted by hvac action (heating →
 * orange, cooling → blue), the current temperature big, the target surfaced beneath, the
 * gradient temperature track (a tick marks "now", a draggable knob sets the target), and
 * Heat / Auto / Cool mode chips.
 */
export function ClimateCard({ config }: CardComponentProps<ClimateCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runButton = useActions();
  const hass = useHass();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readClimate(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  const drag = useDragValue({
    value: v.target ?? v.min,
    axis: 'horizontal',
    step: v.step,
    min: v.min,
    max: v.max,
    disabled: !v.settable,
    onCommit: (t) => call('climate', 'set_temperature', { temperature: t }, { entity_id: config.entity }),
  });
  const target = v.settable ? drag.value : v.target;
  const actions = useActionHandler(config, config.entity, { moved: drag.moved });

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--heat)' } as CSSProperties} role="button" aria-label="Select a thermostat" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Thermometer, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a thermostat</div>
        </div>
      </div>
    );
  }

  const Icon = v.Icon;
  const span = v.max - v.min || 1;
  // dual-setpoint thermostats have no single target — show the rail + current tick, no knob.
  const knobPct = !v.dual && target != null ? ((target - v.min) / span) * 100 : null;
  const tickPct = v.current != null ? clamp(((v.current - v.min) / span) * 100, 0, 100) : null;
  const settable = v.settable;
  const unit = (hass as unknown as { config?: { unit_system?: { temperature?: string } } })?.config?.unit_system?.temperature ?? '°C';

  const bigVal = dead
    ? '—'
    : v.dual && v.low != null && v.high != null
      ? `${fmt(v.low)}–${fmt(v.high)}`
      : v.current != null
        ? fmt(v.current)
        : target != null
          ? fmt(target)
          : '—';
  const showUnit = !dead && !(v.dual && v.low != null);
  const badge = dead ? 'Off' : !v.on ? 'Off' : prettyState(v.action);
  const sub = !v.on ? 'Off' : v.dual ? 'Range' : target != null ? <>Target <b style={{ color: 'var(--text)', fontWeight: 650 }} className="tnum">{target.toFixed(1)}°</b></> : '';

  const toggle = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    if (v.on) { call('climate', 'set_hvac_mode', { hvac_mode: 'off' }, { entity_id: config.entity }); return; }
    const modes = (e?.attributes.hvac_modes as string[] | undefined) ?? [];
    const primary = ['heat_cool', 'auto', 'heat', 'cool', 'dry', 'fan_only'].find((m) => modes.includes(m)) ?? modes.find((m) => m !== 'off');
    if (primary) call('climate', 'set_hvac_mode', { hvac_mode: primary }, { entity_id: config.entity });
  };
  const hvacModes = (e?.attributes.hvac_modes as string[] | undefined) ?? [];
  const defaultModes: ClimateChip[] = [
    { name: 'Heat', mode: 'heat' },
    { name: 'Auto', mode: hvacModes.includes('auto') ? 'auto' : 'heat_cool' },
    { name: 'Cool', mode: 'cool' },
  ].filter((c) => !!c.mode && hvacModes.includes(c.mode));
  const modeChips = config.modes ?? defaultModes;
  const applyMode = (c: ClimateChip) => (ev: MouseEvent) => {
    ev.stopPropagation();
    if (c.tap_action) { runButton(c.tap_action, config.entity); return; }
    if (c.mode != null) call('climate', 'set_hvac_mode', { hvac_mode: c.mode }, { entity_id: config.entity });
    else if (c.preset != null) call('climate', 'set_preset_mode', { preset_mode: c.preset }, { entity_id: config.entity });
    else if (c.temperature != null) call('climate', 'set_temperature', { temperature: c.temperature }, { entity_id: config.entity });
    else moreInfo(config.entity);
  };
  const modeActive = (c: ClimateChip): boolean =>
    c.mode != null ? v.on && e?.state === c.mode : c.preset != null ? (e?.attributes.preset_mode as string | undefined) === c.preset : false;

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
        <div className="thead">
          <button type="button" className="disc" aria-label={v.on ? 'Turn off' : 'Turn on'} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()}>
            {renderIcon(config.icon, compact ? 18 : 21, discIcon(Icon, compact ? 18 : 21))}
          </button>
          {compact ? (
            <div className="num tnum">{bigVal}{showUnit && <span className="u">°</span>}</div>
          ) : (
            <div className="badge"><span className="pt" />{badge}</div>
          )}
        </div>
        {compact ? (
          <>
            <div className="cname" title={name}>{name}</div>
            <div className="csub">{sub}</div>
          </>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap">
              <div className="num tnum">{bigVal}{showUnit && <span className="u">{unit}</span>}</div>
              <div className="nsub">{sub}</div>
            </div>
          </div>
        )}
      </div>
      <div className="ctl">
        {config.show_track !== false && (
        <TempTrack
          knobPct={knobPct}
          tickPct={compact ? null : tickPct}
          settable={settable}
          handlers={drag.handlers}
          ariaLabel={`${name} target temperature`}
          ariaMin={v.min}
          ariaMax={v.max}
          ariaValue={target ?? undefined}
          ariaNow={target != null ? `${fmt(target)}°` : undefined}
          onKeyDown={(ev) => {
            const cur = target ?? v.min;
            let next: number | null = null;
            if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') next = Math.min(v.max, cur + v.step);
            else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') next = Math.max(v.min, cur - v.step);
            if (next != null) {
              ev.preventDefault();
              ev.stopPropagation();
              call('climate', 'set_temperature', { temperature: next }, { entity_id: config.entity });
            }
          }}
        />
        )}
        {!compact && modeChips.length > 0 && config.show_modes !== false && (
          <div className="chips">
            {modeChips.map((c, i) => (
              <button key={i} type="button" className={modeActive(c) ? 'on' : ''} onClick={applyMode(c)} onPointerDown={(ev) => ev.stopPropagation()}>
                {c.icon ? <span className="chip-ic">{renderIcon(c.icon, 15, null)}</span> : null}{c.name ?? ''}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
