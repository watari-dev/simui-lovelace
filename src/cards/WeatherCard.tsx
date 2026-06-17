import { type CSSProperties } from 'react';
import { CloudSun, Droplets, Thermometer, Wind } from 'lucide-react';
import { useActions, useEntity, useForecast, useLanguage, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig } from '../core/types';
import { friendly, isUnavailable } from '../util';
import { renderIcon } from '../core/icon';
import { conditionLabel, readWeather, weatherIcon } from './weather-util';
import { ChipRow, accentVar, discIcon, type ActionChip } from './luminous';

export interface WeatherCardConfig extends BaseCardConfig {
  entity: string;
  name?: string;
  /** Force an accent colour (default from the current condition). */
  color?: string;
  /** Forecast strip: daily (default) · hourly · twice_daily · none. */
  forecast_type?: 'daily' | 'hourly' | 'twice_daily' | 'none';
  /** How many forecast cells (default 5, clamped 1–10). */
  forecast_slots?: number;
  /** Show the feels-like · humidity · wind detail row (default true). */
  show_details?: boolean;
  /** Back-compat alias for forecast_type:'none'. */
  show_forecast?: boolean;
  /** Custom action buttons. */
  buttons?: ActionChip[];
  compact?: boolean;
}

const r = (n: number): string => `${Math.round(n)}`;

/**
 * SimUI weather card — the Luminous wide card: a condition disc + big temperature, a feels-like /
 * humidity / wind detail row, and a forecast strip (subscribed live via weather/subscribe_forecast).
 */
export function WeatherCard({ config }: CardComponentProps<WeatherCardConfig>) {
  const e = useEntity(config.entity);
  const moreInfo = useMoreInfo();
  const runBtn = useActions();
  const actions = useActionHandler(config, config.entity);
  const locale = useLanguage();
  const compact = config.compact === true;

  const ftype = config.show_forecast === false ? 'none' : config.forecast_type ?? 'daily';
  const { forecast } = useForecast(config.entity, ftype);

  const dead = isUnavailable(e);
  const v = readWeather(e, dead);
  const name = config.name ?? (e ? friendly(e) : config.entity);

  if (!config.entity) {
    return (
      <div className="card weather is-unavailable" style={{ ['--acc']: 'var(--cool)', height: '100%' } as CSSProperties}>
        <div className="ghead"><div className="glabel"><div className="disc">{discIcon(CloudSun, 26)}</div><div><div className="gtitle">Select a weather entity</div><div className="gsub">Set up</div></div></div></div>
      </div>
    );
  }

  const slots = Math.max(1, Math.min(10, config.forecast_slots ?? 5));
  const cells = forecast.slice(0, compact ? Math.min(4, slots) : slots);
  const showForecast = ftype !== 'none' && cells.length >= 2;
  const cellLabel = (datetime: string, isDay?: boolean): string => {
    const d = new Date(datetime);
    if (ftype === 'hourly') return d.toLocaleTimeString(locale, { hour: 'numeric' });
    if (ftype === 'twice_daily') return isDay === false ? 'Night' : d.toLocaleDateString(locale, { weekday: 'short' });
    return d.toLocaleDateString(locale, { weekday: 'short' });
  };

  return (
    <div
      className={`card weather${compact ? ' weather--compact' : ''}${dead ? ' is-unavailable' : ''}`}
      style={{ ['--acc']: accentVar(config.color) ?? v.tint, height: '100%' } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${name}: ${v.label}${v.temp != null ? `, ${r(v.temp)}${v.unit}` : ''}`}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); moreInfo(config.entity); }}
    >
      <div className="ghead">
        <div className="glabel">
          <div className="disc">{renderIcon(config.icon, 26, discIcon(v.Icon, 26))}</div>
          <div><div className="gtitle" title={name}>{name}</div><div className="gsub">{v.label}</div></div>
        </div>
        <div className="wtemp">{v.temp != null && !dead ? r(v.temp) : '—'}<span className="u">{v.unit}</span></div>
      </div>

      {!compact && config.show_details !== false && (v.feelsLike != null || v.humidity != null || v.windSpeed != null) && (
        <div className="wdetail">
          {v.feelsLike != null && <div className="wstat"><Thermometer />Feels <b className="tnum">{r(v.feelsLike)}{v.unit}</b></div>}
          {v.humidity != null && <div className="wstat"><Droplets /><b className="tnum">{r(v.humidity)}%</b></div>}
          {v.windSpeed != null && <div className="wstat"><Wind /><b className="tnum">{r(v.windSpeed)}</b> {v.windUnit}{v.windDir && ` ${v.windDir}`}</div>}
        </div>
      )}

      {showForecast && (
        <div className="wforecast">
          {cells.map((item, i) => {
            const Icon = weatherIcon(item.condition);
            return (
              <div key={i} className="wfcell">
                <span className="wflabel">{cellLabel(item.datetime, item.is_daytime)}</span>
                <Icon size={20} strokeWidth={1.8} aria-label={conditionLabel(item.condition)} />
                <div className="wftemps">
                  <span className="wfhi">{item.temperature != null ? `${r(item.temperature)}°` : '—'}</span>
                  {item.templow != null && <span className="wflo">{r(item.templow)}°</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ChipRow chips={config.buttons} run={(a) => runBtn(a, config.entity)} />
    </div>
  );
}
