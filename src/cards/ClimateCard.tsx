import { type CSSProperties, type MouseEvent } from 'react';
import { Thermometer } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useDragValue } from '../hooks/useDragValue';
import { clamp, friendly, isUnavailable, prettyState } from '../util';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { renderIcon } from '../core/icon';
import { readClimate } from './climate-util';
import { TempTrack, discIcon } from './luminous';

export interface ClimateCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
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
  const runTap = useActions();
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
  const knobPct = target != null ? ((target - v.min) / span) * 100 : 50;
  const tickPct = v.current != null ? clamp(((v.current - v.min) / span) * 100, 0, 100) : null;
  const settable = v.settable;
  const unit = '°C';

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
  const setMode = (m: string) => (ev: MouseEvent) => { ev.stopPropagation(); call('climate', 'set_hvac_mode', { hvac_mode: m }, { entity_id: config.entity }); };

  const hvacModes = (e?.attributes.hvac_modes as string[] | undefined) ?? [];
  const modeChips = [
    { label: 'Heat', mode: 'heat' },
    { label: 'Auto', mode: hvacModes.includes('auto') ? 'auto' : 'heat_cool' },
    { label: 'Cool', mode: 'cool' },
  ].filter((c) => hvacModes.includes(c.mode));

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: v.tint } as CSSProperties}
      role="button"
      aria-label={name}
      tabIndex={0}
      onClick={() => { if (!drag.moved()) runTap(config.tap_action, config.entity); }}
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
        <TempTrack
          knobPct={knobPct}
          tickPct={compact ? null : tickPct}
          settable={settable}
          handlers={drag.handlers}
          ariaLabel={`${name} target temperature`}
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
        {!compact && modeChips.length > 0 && (
          <div className="chips">
            {modeChips.map((c) => (
              <button key={c.label} type="button" className={v.on && e?.state === c.mode ? 'on' : ''} onClick={setMode(c.mode)} onPointerDown={(ev) => ev.stopPropagation()}>{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
