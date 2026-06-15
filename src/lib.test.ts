import { describe, it, expect } from 'vitest';
import { clamp, domainOf, isActivateKey, isUnavailable, prettyState, stepKey, supportsFeature } from './util';
import { lightHasBrightness, lightTint } from './cards/light-color';
import { formatSensor } from './cards/sensor-util';
import { degrees, readClimate } from './cards/climate-util';
import { readCover } from './cards/cover-util';
import { readMedia } from './cards/media-util';
import type { HassEntity } from './core/types';

const ent = (state: string, attributes: Record<string, unknown> = {}): HassEntity => ({
  entity_id: 'x.y',
  state,
  attributes,
});

describe('util', () => {
  it('clamp', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it('stepKey maps slider keys', () => {
    expect(stepKey('ArrowUp', 50, 1, 0, 100)).toBe(51);
    expect(stepKey('ArrowDown', 50, 1, 0, 100)).toBe(49);
    expect(stepKey('Home', 50, 1, 0, 100)).toBe(0);
    expect(stepKey('End', 50, 1, 0, 100)).toBe(100);
    expect(stepKey('PageUp', 50, 1, 0, 100)).toBe(60);
    expect(stepKey('ArrowUp', 100, 1, 0, 100)).toBe(100); // clamped
    expect(stepKey('q', 50, 1, 0, 100)).toBeNull();
  });

  it('isActivateKey / domainOf / prettyState', () => {
    expect(isActivateKey('Enter')).toBe(true);
    expect(isActivateKey(' ')).toBe(true);
    expect(isActivateKey('a')).toBe(false);
    expect(domainOf('light.kitchen')).toBe('light');
    expect(prettyState('heat_cool')).toBe('Heat cool');
  });

  it('isUnavailable / supportsFeature', () => {
    expect(isUnavailable(undefined)).toBe(true);
    expect(isUnavailable(ent('unavailable'))).toBe(true);
    expect(isUnavailable(ent('on'))).toBe(false);
    expect(supportsFeature(ent('on', { supported_features: 15 }), 4)).toBe(true);
    expect(supportsFeature(ent('on', { supported_features: 15 }), 16)).toBe(false);
  });
});

describe('light-color', () => {
  it('lightHasBrightness', () => {
    expect(lightHasBrightness({ supported_color_modes: ['onoff'] })).toBe(false);
    expect(lightHasBrightness({ supported_color_modes: ['brightness'] })).toBe(true);
    expect(lightHasBrightness({ brightness: 100 })).toBe(true);
    expect(lightHasBrightness({})).toBe(false);
  });

  it('lightTint returns a triplet or the warm token', () => {
    expect(lightTint({})).toBe('var(--warm)');
    expect(lightTint({ rgb_color: [124, 96, 240] })).toMatch(/^\d+, \d+, \d+$/);
  });
});

describe('sensor-util.formatSensor', () => {
  it('appends unit only to numeric states', () => {
    expect(formatSensor(ent('21.5', { unit_of_measurement: '°C' }))).toBe('21.5°C');
    expect(formatSensor(ent('68', { unit_of_measurement: '%' }))).toBe('68%');
    expect(formatSensor(ent('1013', { unit_of_measurement: 'hPa' }))).toBe('1013 hPa');
    expect(formatSensor(ent('none', { unit_of_measurement: '°C' }))).toBe('None'); // no 'none°C'
    expect(formatSensor(ent('Home'))).toBe('Home');
  });
});

describe('climate-util', () => {
  it('degrees', () => {
    expect(degrees(22)).toBe('22°');
    expect(degrees(21.5)).toBe('21.5°');
  });

  it('readClimate heating + single setpoint is settable', () => {
    const v = readClimate(ent('heat', { hvac_action: 'heating', temperature: 21, current_temperature: 19, min_temp: 7, max_temp: 30 }), false);
    expect(v.on).toBe(true);
    expect(v.tint).toBe('var(--heat)'); // heating uses --heat; --down stays reserved for alert/fault
    expect(v.settable).toBe(true);
    expect(v.target).toBe(21);
  });

  it('readClimate cooling tint is --cool', () => {
    const v = readClimate(ent('cool', { hvac_action: 'cooling', temperature: 22, current_temperature: 25 }), false);
    expect(v.tint).toBe('var(--cool)');
    expect(v.target).toBe(22);
  });

  it('readClimate dual-setpoint is not drag-settable', () => {
    const v = readClimate(ent('heat_cool', { target_temp_low: 19, target_temp_high: 24 }), false);
    expect(v.dual).toBe(true);
    expect(v.settable).toBe(false);
  });
});

describe('cover-util.readCover', () => {
  it('derives position, open, and feature flags', () => {
    const v = readCover(ent('open', { current_position: 60, supported_features: 15 }), false);
    expect(v.position).toBe(60);
    expect(v.open).toBe(true);
    expect(v.settable).toBe(true);
    expect(v.canOpen).toBe(true);
    expect(v.canStop).toBe(true);
  });

  it('position-only cover (features=4) has no open/close', () => {
    const v = readCover(ent('open', { current_position: 50, supported_features: 4 }), false);
    expect(v.settable).toBe(true);
    expect(v.canOpen).toBe(false);
    expect(v.canClose).toBe(false);
  });
});

describe('media-util.readMedia', () => {
  it('active + valid art', () => {
    const v = readMedia(ent('playing', { media_title: 'Redbone', entity_picture: '/api/foo.jpg' }), false);
    expect(v.active).toBe(true);
    expect(v.playing).toBe(true);
    expect(v.art).toBe('/api/foo.jpg');
  });

  it('off is inactive', () => {
    expect(readMedia(ent('off', {}), false).active).toBe(false);
  });

  it('rejects an entity_picture that tries to break out of url()', () => {
    const v = readMedia(ent('playing', { entity_picture: 'a"),url("https://evil.example/beacon' }), false);
    expect(v.art).toBeNull();
  });
});
