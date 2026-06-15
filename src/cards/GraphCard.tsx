import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useActions, useEntity, useHistory, useLanguage, useMoreInfo } from '../core/hass';
import { useSize } from '../hooks/useSize';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isActivateKey, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { formatSensor, sensorIcon, sensorTint, VALID_COLORS } from './sensor-util';
import { HistoryChart } from './HistoryChart';

export interface GraphCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Override the device-class tint: warm | cool | up | down | grey. */
  color?: string;
  /** Default range, in hours (default 24). */
  hours?: number;
  /** Range-toggle options, in hours (default [1, 12, 24, 168]). [] hides the toggle. */
  ranges?: number[];
  /** Area fill under the line (default true). */
  fill?: boolean;
  line_width?: number;
}

const rangeLabel = (h: number): string => (h < 48 ? `${h}h` : h % 24 === 0 ? `${h / 24}d` : `${h}h`);

export function GraphCard({ config }: CardComponentProps<GraphCardConfig>) {
  const e = useEntity(config.entity);
  const moreInfo = useMoreInfo();
  const runTap = useActions();
  const locale = useLanguage();
  const dead = isUnavailable(e);

  const ranges = config.ranges ?? [1, 12, 24, 168];
  const [hours, setHours] = useState(config.hours ?? 24);
  useEffect(() => setHours(config.hours ?? 24), [config.hours]);

  const { points: hist, loading, error } = useHistory(config.entity, hours);
  const [ref, size] = useSize<HTMLDivElement>();

  const dc = e?.attributes.device_class as string | undefined;
  const Icon = sensorIcon(dc);
  const tint = config.color && VALID_COLORS.has(config.color) ? `var(--${config.color})` : sensorTint(dc);
  const unit = (e?.attributes.unit_of_measurement as string | undefined) ?? '';
  const name = config.name ?? (e ? friendly(e) : config.entity);

  // Append the live current value so the right edge is always "now".
  const live = e && !dead ? Number(e.state) : NaN;
  const points = useMemo(() => {
    const pts = hist.slice();
    if (!Number.isNaN(live)) {
      const now = Date.now();
      if (pts.length && now - pts[pts.length - 1].t < 1000) pts[pts.length - 1] = { t: now, v: live };
      else pts.push({ t: now, v: live });
    }
    return pts;
  }, [hist, live]);

  const stats = useMemo(() => {
    if (!points.length) return null;
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (const p of points) {
      if (p.v < min) min = p.v;
      if (p.v > max) max = p.v;
      sum += p.v;
    }
    return { min, max, avg: sum / points.length };
  }, [points]);

  const fmt = (v: number) =>
    Math.abs(v) >= 100 ? Math.round(v).toLocaleString(locale) : (Math.round(v * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
  const valueText = !config.entity ? '—' : dead ? 'Unavailable' : e ? formatSensor(e) : 'Unknown';
  const chartLabel = stats
    ? `${name} history, last ${rangeLabel(hours)}, ${fmt(stats.min)} to ${fmt(stats.max)}${unit ? ` ${unit}` : ''}`
    : `${name} history`;

  const open = () => config.entity && runTap(config.tap_action, config.entity);

  return (
    <div className="simui-graph" style={{ ['--tile-tint' as string]: tint } as CSSProperties}>
      <div
        className="simui-graph-head"
        role="button"
        aria-label={`${name}: ${valueText}`}
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
        <span className="simui-graph-ic" aria-hidden="true">
          {renderIcon(config.icon, 18, <Icon size={18} strokeWidth={2} />)}
        </span>
        <span className="simui-graph-title" title={name}>{config.entity ? name : 'Select a sensor'}</span>
        <span className="simui-graph-value">{valueText}</span>
      </div>

      <div className="simui-graph-chart" ref={ref}>
        {points.length >= 2 ? (
          <HistoryChart
            points={points}
            width={size.width}
            height={size.height}
            hours={hours}
            unit={unit}
            fill={config.fill !== false}
            lineWidth={config.line_width ?? 2}
            ariaLabel={chartLabel}
            locale={locale}
          />
        ) : (
          <span className="simui-graph-empty">
            {!config.entity
              ? 'Pick a sensor to chart'
              : error
                ? error
                : loading
                  ? 'Loading history…'
                  : 'Not enough history yet'}
          </span>
        )}
      </div>

      <div className="simui-graph-foot">
        {config.entity && ranges.length > 0 && (
          <div className="simui-graph-ranges" role="group" aria-label="Range">
            {ranges.map((h) => (
              <button
                key={h}
                type="button"
                className={`simui-graph-range${h === hours ? ' on' : ''}`}
                aria-pressed={h === hours}
                onClick={() => setHours(h)}
              >
                {rangeLabel(h)}
              </button>
            ))}
          </div>
        )}
        {stats && (
          <div className="simui-graph-stats">
            <span>min <b>{fmt(stats.min)}</b></span>
            <span>avg <b>{fmt(stats.avg)}</b></span>
            <span>max <b>{fmt(stats.max)}</b></span>
          </div>
        )}
      </div>
    </div>
  );
}
