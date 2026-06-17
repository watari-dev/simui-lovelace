import { Cloud, CloudFog, CloudHail, CloudLightning, CloudRain, CloudRainWind, CloudSnow, CloudSun, Moon, Sun, TriangleAlert, Wind, type LucideIcon } from 'lucide-react';
import type { HassEntity } from '../core/types';
import { prettyState } from '../util';

// WeatherEntityFeature bits.
export const WEATHER_DAILY = 1, WEATHER_HOURLY = 2, WEATHER_TWICE_DAILY = 4;

const CONDITION_ICONS: Record<string, LucideIcon> = {
  sunny: Sun, 'clear-night': Moon, partlycloudy: CloudSun, cloudy: Cloud, fog: CloudFog,
  rainy: CloudRain, pouring: CloudRainWind, snowy: CloudSnow, 'snowy-rainy': CloudHail, hail: CloudHail,
  lightning: CloudLightning, 'lightning-rainy': CloudLightning, windy: Wind, 'windy-variant': Wind, exceptional: TriangleAlert,
};
export function weatherIcon(condition?: string): LucideIcon { return (condition ? CONDITION_ICONS[condition] : undefined) ?? CloudSun; }

const CONDITION_TINTS: Record<string, string> = {
  sunny: 'var(--warm)', 'clear-night': 'var(--warm)', partlycloudy: 'var(--warm)',
  cloudy: 'var(--grey)', fog: 'var(--grey)', windy: 'var(--grey)', 'windy-variant': 'var(--grey)',
  rainy: 'var(--cool)', pouring: 'var(--cool)', snowy: 'var(--cool)', 'snowy-rainy': 'var(--cool)', hail: 'var(--cool)',
  lightning: 'var(--down)', 'lightning-rainy': 'var(--down)', exceptional: 'var(--down)',
};
export function weatherTint(condition?: string): string { return (condition && CONDITION_TINTS[condition]) ?? 'var(--cool)'; }

const LABEL_OVERRIDE: Record<string, string> = { partlycloudy: 'Partly Cloudy', 'clear-night': 'Clear Night', 'snowy-rainy': 'Sleet', 'lightning-rainy': 'Thunderstorm', 'windy-variant': 'Windy' };
export function conditionLabel(condition?: string): string { return condition ? LABEL_OVERRIDE[condition] ?? prettyState(condition) : '—'; }

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export function degToCompass(deg?: number): string { return typeof deg === 'number' ? COMPASS[Math.round(deg / 22.5) % 16] : ''; }

export interface WeatherView {
  Icon: LucideIcon;
  tint: string;
  condition: string;
  label: string;
  temp: number | null;
  unit: string;
  feelsLike: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windUnit: string;
  windDir: string;
}

const num = (x: unknown): number | null => (typeof x === 'number' ? x : null);

/** Map a weather entity's current conditions into a view (icon, tint, temp, wind…). */
export function readWeather(e: HassEntity | undefined, dead: boolean): WeatherView {
  const a = e?.attributes ?? {};
  const condition = e?.state ?? '';
  return {
    Icon: weatherIcon(condition),
    tint: weatherTint(condition),
    condition,
    label: dead ? 'Unavailable' : conditionLabel(condition),
    temp: num(a.temperature),
    unit: (a.temperature_unit as string) ?? '°C',
    feelsLike: num(a.apparent_temperature) ?? num(a.dew_point),
    humidity: num(a.humidity),
    windSpeed: num(a.wind_speed),
    windUnit: (a.wind_speed_unit as string) ?? 'km/h',
    windDir: degToCompass(num(a.wind_bearing) ?? undefined),
  };
}
