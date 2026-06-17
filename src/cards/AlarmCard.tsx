import { type CSSProperties, type MouseEvent } from 'react';
import { ShieldOff } from 'lucide-react';
import { useActions, useCallService, useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { ARM_LABEL, ARM_STATE, readAlarm, type AlarmAction } from './alarm-util';
import { ChipRow, Sec, Seg2, TileHead, accentVar, discIcon, type ActionChip, type SecStat, type Seg2Item } from './luminous';

export interface AlarmCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (overrides the state-based tint). */
  color?: string;
  /** Which arm buttons to show, in order. Empty ⇒ auto from supported_features. */
  arm_actions?: AlarmAction[];
  /** Show the status caption line (default true). */
  show_status?: boolean;
  /** Custom action buttons beneath the arm chips. */
  buttons?: ActionChip[];
  compact?: boolean;
}

/**
 * SimUI alarm card — the Luminous tile for an alarm panel: a disc tinted by state (green
 * disarmed, amber armed-home, coral armed-away, red triggered), the armed state as a big word,
 * and one-tap arm / disarm chips gated by the panel's features. Code-protected panels defer to
 * HA's native keypad (more-info) — the card never collects a code.
 */
export function AlarmCard({ config }: CardComponentProps<AlarmCardConfig>) {
  const e = useEntity(config.entity);
  const call = useCallService();
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const actions = useActionHandler(config, config.entity);
  const compact = config.compact === true;

  const dead = isUnavailable(e);
  const v = readAlarm(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  if (!config.entity) {
    return (
      <div className={`tile is-unavailable${compact ? ' compact' : ''}`} style={{ ['--acc']: 'var(--up)' } as CSSProperties} role="button" aria-label="Select an alarm" tabIndex={0}>
        <div className="top">
          <div className="thead"><span className="disc">{discIcon(ShieldOff, compact ? 18 : 21)}</span></div>
          <div className="cname">Select an alarm</div>
        </div>
      </div>
    );
  }

  const arm = (action: AlarmAction) => {
    if (dead || v.pending) return;
    if (v.armCodeRequired) { moreInfo(config.entity); return; }
    call('alarm_control_panel', `alarm_${action}`, {}, { entity_id: config.entity });
  };
  const disarm = () => {
    if (dead || v.pending) return;
    if (v.codeGated) { moreInfo(config.entity); return; }
    call('alarm_control_panel', 'alarm_disarm', {}, { entity_id: config.entity });
  };
  const discTap = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (dead || v.pending) return;
    if (v.armed) disarm();
    else if (v.available.length === 1) arm(v.available[0]);
    else moreInfo(config.entity);
  };

  const armChips = (config.arm_actions ?? v.available).filter((a) => v.available.includes(a));
  const word = dead ? 'Unavailable' : v.word;
  const twoWord = word.includes(' ');
  const changedBy = e?.attributes.changed_by as string | undefined;
  const armSecStats: SecStat[] | undefined = !dead && changedBy ? [{ l: 'By', v: changedBy }] : undefined;
  const armItems: Seg2Item[] = [];
  if (v.armed) armItems.push({ key: 'disarm', label: 'Disarm', active: v.state === 'disarmed', disabled: dead || v.pending, onClick: () => disarm() });
  armChips.forEach((a) => armItems.push({ key: a, label: ARM_LABEL[a], active: v.state === ARM_STATE[a], disabled: dead || v.pending, onClick: () => arm(a) }));
  if (armItems.length === 0) armItems.push({ key: 'open', label: 'Open', onClick: () => moreInfo(config.entity) });

  return (
    <div
      className={`tile${compact ? ' compact' : ''}${v.armed ? ' armed' : ''}${v.triggered ? ' triggered' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? v.tint } as CSSProperties}
      role="button"
      aria-label={`${name}: ${v.word}`}
      tabIndex={0}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="top">
        {compact ? (
          <>
            <div className="thead">
              <button type="button" className="disc" aria-label={v.armed ? 'Disarm' : 'Arm'} disabled={dead || v.pending} onClick={discTap} onPointerDown={(ev) => ev.stopPropagation()}>{renderIcon(config.icon, 18, discIcon(v.Icon, 18))}</button>
              <span />
            </div>
            <div className="cname">{word}</div>
          </>
        ) : (
          <>
            <TileHead disc={<button type="button" className="disc" aria-label={v.armed ? 'Disarm' : 'Arm'} disabled={dead || v.pending} onClick={discTap} onPointerDown={(ev) => ev.stopPropagation()}>{renderIcon(config.icon, 21, discIcon(v.Icon, 21))}</button>} name={name} active={!dead} />
            <div className="valrow">
              <div className="numwrap"><div className="num" style={{ fontSize: twoWord ? '26px' : '32px' }}>{word}</div></div>
              <Sec stats={armSecStats} />
            </div>
          </>
        )}
      </div>
      <div className="ctl">
        {compact ? (
          config.show_status !== false && <div className="csub">{v.caption}</div>
        ) : (
          <>
            <div className="hr" />
            {config.show_status !== false && <div className="ltxt" style={{ fontSize: '12px', color: 'var(--muted)' }}>{v.caption}</div>}
            <Seg2 items={armItems} />
            <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />
          </>
        )}
      </div>
    </div>
  );
}
