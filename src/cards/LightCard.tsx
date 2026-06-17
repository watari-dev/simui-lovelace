import { type CSSProperties, type MouseEvent } from 'react';
import { Lightbulb } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { lightHasBrightness, lightTint } from './light-color';
import { DotBar, discIcon, sliderKeys } from './luminous';

export interface LightCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Tint the tile with the bulb's own colour (default true). false ⇒ always warm. */
  use_light_color?: boolean;
  /** Glanceable footprint for dense dashboards. */
  compact?: boolean;
}

const kelvinLabel = (k: number): string => `${k < 3500 ? 'Warm' : k > 5000 ? 'Cool' : 'Neutral'} · ${k}K`;

/**
 * SimUI light card — the Luminous tile: a glowing accent disc (tap to toggle) over a big
 * brightness numeral, with the signature draggable dot-bar and Warm/Cool/Scene mode chips.
 * Tints with the bulb's own colour. Drag the dot-bar to set brightness; the disc toggles;
 * tap the body / right-click opens HA's more-info.
 */
export function LightCard({ config }: CardComponentProps<LightCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runTap = useActions();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const on = !!e && e.state === 'on';
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const hasBrightness = !!e && lightHasBrightness(e.attributes);
  const settable = !dead && hasBrightness;
  const acc = e && config.use_light_color !== false ? lightTint(e.attributes) : 'var(--warm)';

  const brightness = (e?.attributes.brightness as number | undefined) ?? 0;
  const livePct = on ? Math.max(1, Math.round((brightness / 255) * 100)) : 0;

  const setBrightness = (v: number) =>
    v <= 0
      ? call('light', 'turn_off', {}, { entity_id: config.entity })
      : call('light', 'turn_on', { brightness_pct: v }, { entity_id: config.entity });

  const drag = useDragValue({ value: livePct, axis: 'horizontal', step: 1, min: 0, max: 100, disabled: !settable, onCommit: setBrightness });
  const pct = settable ? drag.value : livePct;

  const modes = (e?.attributes.supported_color_modes as string[] | undefined) ?? [];
  const hasColorTemp = modes.includes('color_temp');
  const kelvin = e?.attributes.color_temp_kelvin as number | undefined;
  const sub = kelvin ? kelvinLabel(kelvin) : '';

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--warm)' } as CSSProperties} role="button" aria-label="Select a light" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Lightbulb, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a light</div>
        </div>
      </div>
    );
  }

  const toggle = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (!dead) call('light', on ? 'turn_off' : 'turn_on', {}, { entity_id: config.entity });
  };
  const setTemp = (k: number) => (ev: MouseEvent) => {
    ev.stopPropagation();
    call('light', 'turn_on', { color_temp_kelvin: k }, { entity_id: config.entity });
  };
  const openMore = (ev: MouseEvent) => {
    ev.stopPropagation();
    moreInfo(config.entity);
  };
  const warmActive = on && kelvin != null && kelvin < 3500;
  const coolActive = on && kelvin != null && kelvin >= 3500;

  const valueNode = settable ? (
    <>{pct}<span className="u">%</span></>
  ) : (
    on ? 'On' : 'Off'
  );

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: acc } as CSSProperties}
      role="button"
      aria-label={name}
      tabIndex={0}
      onClick={() => { if (!drag.moved()) runTap(config.tap_action, config.entity); }}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        <div className="thead">
          <button type="button" className="disc" aria-label={on ? 'Turn off' : 'Turn on'} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()}>
            {renderIcon(config.icon, compact ? 18 : 21, discIcon(Lightbulb, compact ? 18 : 21))}
          </button>
          {compact ? (
            <div className="num tnum">{valueNode}</div>
          ) : (
            <div className="badge"><span className="pt" />{on ? 'On' : 'Off'}</div>
          )}
        </div>
        {compact ? (
          <div className="cname" title={name}>{name}</div>
        ) : (
          <div>
            <div className="eye" title={name}>{name}</div>
            <div className="numwrap">
              <div className="num tnum">{valueNode}</div>
              {sub && <div className="nsub">{sub}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="ctl">
        <DotBar
          value={pct}
          segments={compact ? 12 : 14}
          settable={settable}
          handlers={drag.handlers}
          ariaLabel={`${name} brightness`}
          onKeyDown={sliderKeys(pct, setBrightness)}
        />
        {!compact && hasColorTemp && (
          <div className="chips">
            <button type="button" className={warmActive ? 'on' : ''} onClick={setTemp(2700)} onPointerDown={(ev) => ev.stopPropagation()}>Warm</button>
            <button type="button" className={coolActive ? 'on' : ''} onClick={setTemp(5000)} onPointerDown={(ev) => ev.stopPropagation()}>Cool</button>
            <button type="button" onClick={openMore} onPointerDown={(ev) => ev.stopPropagation()}>Scene</button>
          </div>
        )}
      </div>
    </div>
  );
}
