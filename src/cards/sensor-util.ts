import {
  Activity, Thermometer, Droplets, Zap, Gauge, Sun, Wind, BatteryMedium,
  Waves, Volume2, Signal, FlaskConical, CloudRain, Timer, DollarSign,
  type LucideIcon,
} from 'lucide-react';
import type { HassEntity } from '../core/types';
import { prettyState } from '../util';

// device_class → a lucide glyph. Generic sensors (no class) fall back to Activity.
const ICONS: Record<string, LucideIcon> = {
  temperature: Thermometer,
  humidity: Droplets,
  moisture: Droplets,
  precipitation: CloudRain,
  precipitation_intensity: CloudRain,
  power: Zap,
  energy: Zap,
  current: Zap,
  voltage: Zap,
  power_factor: Zap,
  pressure: Gauge,
  atmospheric_pressure: Gauge,
  illuminance: Sun,
  irradiance: Sun,
  battery: BatteryMedium,
  carbon_dioxide: Wind,
  carbon_monoxide: Wind,
  pm25: Wind,
  pm10: Wind,
  pm1: Wind,
  volatile_organic_compounds: FlaskConical,
  aqi: Wind,
  sound_pressure: Volume2,
  signal_strength: Signal,
  speed: Waves,
  wind_speed: Wind,
  duration: Timer,
  monetary: DollarSign,
};

// device_class → a tint token (RGB-triplet vars defined in styles.css).
const TINTS: Record<string, string> = {
  temperature: 'var(--warm)',
  humidity: 'var(--cool)',
  moisture: 'var(--cool)',
  precipitation: 'var(--cool)',
  power: 'var(--warm)',
  energy: 'var(--warm)',
  current: 'var(--warm)',
  voltage: 'var(--warm)',
  pressure: 'var(--up)',
  atmospheric_pressure: 'var(--up)',
  illuminance: 'var(--warm)',
  battery: 'var(--up)',
  carbon_dioxide: 'var(--up)',
  carbon_monoxide: 'var(--down)',
  pm25: 'var(--up)',
  pm10: 'var(--up)',
  aqi: 'var(--up)',
  monetary: 'var(--up)',
};

export function sensorIcon(deviceClass?: string): LucideIcon {
  return (deviceClass && ICONS[deviceClass]) || Activity;
}

export function sensorTint(deviceClass?: string): string {
  return (deviceClass && TINTS[deviceClass]) || 'var(--cool)';
}

/** The value line — number + unit (no space before `%`/`°`), or a prettified text state.
 * Only appends the unit to a genuinely numeric state, so a transient `'none'`/`''` from a
 * template/rest sensor doesn't render as `'none°C'`. */
export function formatSensor(e: HassEntity): string {
  const unit = e.attributes.unit_of_measurement as string | undefined;
  const numeric = e.state.trim() !== '' && !Number.isNaN(Number(e.state));
  if (unit && numeric) {
    const sep = unit === '%' || unit.startsWith('°') ? '' : ' ';
    return `${e.state}${sep}${unit}`;
  }
  return prettyState(e.state);
}
