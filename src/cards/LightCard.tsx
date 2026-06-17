import { type CSSProperties, type MouseEvent } from 'react';
import { Lightbulb } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import { useDragValue } from '../hooks/useDragValue';
import type { CardComponentProps } from '../core/react-card';
import type { ActionConfig } from '../core/actions';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { lightHasBrightness, lightTint } from './light-color';
import { DotBar, Seg2, Sec, TileHead, accentVar, discIcon, sliderKeys, type SliderStyle } from './luminous';

/** One configurable preset chip — applies a lighting scene to this light, or runs an action. */
export interface LightChip {
  name?: string;
  icon?: string;
  /** Apply a colour temperature (kelvin). */
  kelvin?: number;
  /** Apply a brightness (0–100 %). */
  brightness?: number;
  /** Apply an RGB colour. */
  rgb?: [number, number, number];
  /** Apply a light effect by name. */
  effect?: string;
  /** Run an arbitrary action instead of the shortcuts above. */
  tap_action?: ActionConfig;
}

export interface LightCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Tint the tile with the bulb's own colour (default true). false ⇒ always warm. */
  use_light_color?: boolean;
  /** Force an accent colour: warm | cool | up | down | grey | heat (overrides use_light_color). */
  color?: string;
  /** Brightness slider style: dots (default) · bar · line · none (hidden). */
  slider?: SliderStyle | 'none';
  /** What the slider sets: brightness (default) or color_temp (warm↔cool). */
  slider_target?: 'brightness' | 'color_temp';
  /** Show the preset-chip row (default true). */
  show_color_controls?: boolean;
  /** The preset chips. Omit for the default Warm / Cool / Scene on colour-temp lights. */
  color_controls?: LightChip[];
  /** Glanceable footprint for dense dashboards. */
  compact?: boolean;
}

const kelvinLabel = (k: number): string => `${k < 3500 ? 'Warm' : k > 5000 ? 'Cool' : 'Neutral'} · ${k}K`;
const DEFAULT_CHIPS: LightChip[] = [{ name: 'Warm', kelvin: 2700 }, { name: 'Cool', kelvin: 5000 }, { name: 'Scene' }];

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
  const runChip = useActions();
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const on = !!e && e.state === 'on';
  const name = config.name ?? (e ? friendly(e) : config.entity);
  const hasBrightness = !!e && lightHasBrightness(e.attributes);
  const modes = (e?.attributes.supported_color_modes as string[] | undefined) ?? [];
  const hasColorTemp = modes.includes('color_temp');
  const kelvin = e?.attributes.color_temp_kelvin as number | undefined;
  // The slider can drive brightness (default) or colour temperature, if supported.
  const tempMode = config.slider_target === 'color_temp' && hasColorTemp;
  const acc = accentVar(config.color) ?? (e && config.use_light_color !== false ? lightTint(e.attributes) : 'var(--warm)');

  const brightness = (e?.attributes.brightness as number | undefined) ?? 0;
  const livePct = on ? Math.max(1, Math.round((brightness / 255) * 100)) : 0;
  const minK = (e?.attributes.min_color_temp_kelvin as number | undefined) ?? 2000;
  const maxK = (e?.attributes.max_color_temp_kelvin as number | undefined) ?? 6500;
  const kSpan = maxK - minK || 1;
  const tempPct = on && kelvin != null ? Math.max(0, Math.min(100, ((kelvin - minK) / kSpan) * 100)) : 0;

  const setBrightness = (v: number) =>
    v <= 0
      ? call('light', 'turn_off', {}, { entity_id: config.entity })
      : call('light', 'turn_on', { brightness_pct: v }, { entity_id: config.entity });
  const setColorTemp = (v: number) =>
    call('light', 'turn_on', { color_temp_kelvin: Math.round(minK + (Math.max(0, Math.min(100, v)) / 100) * kSpan) }, { entity_id: config.entity });

  const settable = !dead && (tempMode ? hasColorTemp : hasBrightness);
  const setSlider = tempMode ? setColorTemp : setBrightness;
  const drag = useDragValue({ value: tempMode ? tempPct : livePct, axis: 'horizontal', step: 1, min: 0, max: 100, disabled: !settable, onCommit: setSlider });
  const pct = settable ? drag.value : tempMode ? tempPct : livePct;
  const actions = useActionHandler(config, config.entity, { moved: drag.moved });

  const liveKelvin = Math.round(minK + (pct / 100) * kSpan);
  const sub = tempMode ? (on ? `${livePct}% brightness` : '') : kelvin ? kelvinLabel(kelvin) : '';

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
  const applyChip = (c: LightChip) => (ev: MouseEvent) => {
    ev.stopPropagation();
    if (c.tap_action) { runChip(c.tap_action, config.entity); return; }
    const data: Record<string, unknown> = {};
    if (c.kelvin != null) data.color_temp_kelvin = c.kelvin;
    if (c.brightness != null) data.brightness_pct = c.brightness;
    if (c.rgb) data.rgb_color = c.rgb;
    if (c.effect) data.effect = c.effect;
    if (Object.keys(data).length) call('light', 'turn_on', data, { entity_id: config.entity });
    else moreInfo(config.entity);
  };
  const chips = config.color_controls ?? (hasColorTemp ? DEFAULT_CHIPS : []);
  const showChips = !compact && config.show_color_controls !== false && chips.length > 0;

  const valueNode = !settable ? (on ? 'On' : 'Off') : tempMode ? (
    <>{liveKelvin}<span className="u">K</span></>
  ) : (
    <>{pct}<span className="u">%</span></>
  );

  const discBtn = (
    <button type="button" className="disc" aria-label={on ? 'Turn off' : 'Turn on'} onClick={toggle} onPointerDown={(ev) => ev.stopPropagation()}>
      {renderIcon(config.icon, compact ? 18 : 21, discIcon(Lightbulb, compact ? 18 : 21))}
    </button>
  );

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: acc } as CSSProperties}
      role="button"
      aria-label={name}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        {compact ? (
          <>
            <div className="thead">{discBtn}<div className="num tnum">{valueNode}</div></div>
            <div className="cname" title={name}>{name}</div>
          </>
        ) : (
          <>
            <TileHead disc={discBtn} name={name} active={on} />
            <div className="valrow">
              <div className="numwrap"><div className="num tnum">{valueNode}</div>{sub && <div className="nsub">{sub}</div>}</div>
              <Sec swatch={on ? acc : undefined} />
            </div>
          </>
        )}
      </div>
      <div className="ctl">
        {config.slider !== 'none' && (
          <DotBar
            value={pct}
            segments={compact ? 12 : 14}
            settable={settable}
            handlers={drag.handlers}
            ariaLabel={`${name} ${tempMode ? 'colour temperature' : 'brightness'}`}
            onKeyDown={sliderKeys(pct, setSlider)}
            variant={config.slider ?? 'dots'}
          />
        )}
        {showChips && <Seg2 items={chips.map((c, i) => ({ key: String(i), label: c.name, icon: c.icon, active: on && c.kelvin != null && kelvin != null && Math.abs(kelvin - c.kelvin) < 120, onClick: applyChip(c) }))} />}
      </div>
    </div>
  );
}
