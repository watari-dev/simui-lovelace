import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from 'react';
import { Play, Sparkles, Zap } from 'lucide-react';
import { useActions, useCallService, useEntity, useLanguage, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { ActionConfig } from '../core/actions';
import type { BaseCardConfig } from '../core/types';
import { domainOf, friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { ChipRow, TileHead, accentVar, discIcon, type ActionChip } from './luminous';

export interface ButtonCardConfig extends BaseCardConfig {
  /** A scene.* or script.* entity. Omit for a pure-action button (tap_action only). */
  entity?: string;
  name?: string;
  /** Force an accent colour (default warm — an "activation" accent). */
  color?: string;
  /** A small caption under the name. Default: the last-run time / "Tap to run". */
  subtitle?: string;
  /** Show the run-state line (default true). */
  show_state?: boolean;
  /** Custom action chips beneath the button. */
  buttons?: ActionChip[];
  compact?: boolean;
}

/**
 * SimUI button card — a Luminous action tile. Tap the glowing disc (or the tile) to activate a
 * scene (scene.turn_on) or run a script (script.turn_on), or fire any configured tap_action —
 * so it doubles as a universal action button with no entity at all. Scripts show a live
 * "Running…" pulse; a press flashes the disc.
 */
export function ButtonCard({ config }: CardComponentProps<ButtonCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const run = useActions();
  const moreInfo = useMoreInfo();
  const locale = useLanguage();
  const compact = config.compact === true;

  const noEntity = !config.entity;
  const dead = !noEntity && isUnavailable(e);
  const domain = e ? domainOf(e.entity_id) : '';
  const isScene = domain === 'scene';
  const isScript = domain === 'script';
  const running = isScript && e?.state === 'on';
  const name = config.name ?? (e ? friendly(e) : 'Button');
  const Icon = isScene ? Sparkles : isScript ? Play : Zap;

  // Momentary "fired" pulse on the disc after a tap.
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  // What a tap runs: an explicit tap_action wins; else the scene/script service.
  const autoTap: ActionConfig | undefined = config.tap_action
    ? config.tap_action
    : isScene
      ? { action: 'perform-action', perform_action: 'scene.turn_on', target: { entity_id: config.entity } }
      : isScript
        ? { action: 'perform-action', perform_action: 'script.turn_on', target: { entity_id: config.entity } }
        : undefined;
  const actions = useActionHandler({ tap_action: autoTap, hold_action: config.hold_action, double_tap_action: config.double_tap_action }, config.entity);

  if (noEntity && !config.tap_action) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--warm)' } as CSSProperties} role="button" aria-label="Select a scene or script" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(Zap, compact ? 18 : 21)}</span></div>
          <div className="cname">Select a scene or script</div>
        </div>
      </div>
    );
  }

  const activate = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead) return;
    if (config.tap_action) run(config.tap_action, config.entity);
    else if (isScene) call('scene', 'turn_on', {}, { entity_id: config.entity });
    else if (isScript) call('script', 'turn_on', {}, { entity_id: config.entity });
    else return;
    setFlash(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 900);
  };

  const runLabel = (): string => {
    if (dead) return 'Unavailable';
    if (running) {
      const current = (e?.attributes.current as number | undefined) ?? 1;
      return current > 1 ? `Running ×${current}` : 'Running…';
    }
    if (config.subtitle) return config.subtitle;
    const lt = e?.attributes.last_triggered as string | undefined;
    if (isScript) {
      if (!lt) return 'Ready';
      const d = new Date(lt);
      const sameDay = Date.now() - d.getTime() < 86400000;
      return `Last run · ${sameDay ? d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`;
    }
    if (isScene) {
      const d = e ? new Date(e.state) : null;
      return d && !Number.isNaN(d.getTime()) ? `Activated · ${d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}` : 'Ready';
    }
    return 'Tap to run';
  };

  const verb = isScene ? 'Activate' : 'Run';
  return (
    <div
      className={`tile${compact ? ' compact' : ''}${flash ? ' fired' : ''}${running ? ' running' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? 'var(--warm)' } as CSSProperties}
      role="button"
      aria-label={name}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); if (config.entity) moreInfo(config.entity); }}
    >
      <div className="top">
        {compact ? (
          <>
            <div className="thead">
              <button type="button" className="disc" aria-label={`Run ${name}`} onClick={activate} onPointerDown={(ev) => ev.stopPropagation()}>{renderIcon(config.icon, 18, discIcon(Icon, 18))}</button>
              <div className="num" style={{ fontSize: '22px' }}>{verb}</div>
            </div>
            <div className="cname" title={name}>{name}</div>
          </>
        ) : (
          <>
            <TileHead disc={<button type="button" className="disc" aria-label={`Run ${name}`} onClick={activate} onPointerDown={(ev) => ev.stopPropagation()}>{renderIcon(config.icon, 21, discIcon(Icon, 21))}</button>} name={name} active={running || flash} />
            <div className="valrow"><div className="numwrap"><div className="num" style={{ fontSize: '30px' }}>{verb}</div></div></div>
          </>
        )}
      </div>
      <div className="ctl">
        {compact ? (
          config.show_state !== false && <div className="csub">{runLabel()}</div>
        ) : (
          <>
            {config.show_state !== false && <div className="csub">{runLabel()}</div>}
            <ChipRow chips={config.buttons} run={(a) => run(a, config.entity)} />
          </>
        )}
      </div>
    </div>
  );
}
