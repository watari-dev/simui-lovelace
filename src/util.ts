import type { HassEntity } from './core/types';

export function domainOf(entityId: string): string {
  return entityId.split('.')[0];
}

export function friendly(entity: HassEntity): string {
  return (entity.attributes.friendly_name as string | undefined) || entity.entity_id;
}

export function prettyState(state: string): string {
  return state.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Bitwise check against an entity's `supported_features` attribute. */
export function supportsFeature(entity: HassEntity, bit: number): boolean {
  const sf = entity.attributes.supported_features as number | undefined;
  return sf != null && (sf & bit) === bit;
}

export function isUnavailable(entity: HassEntity | undefined): boolean {
  return !entity || entity.state === 'unavailable' || entity.state === 'unknown';
}

/**
 * Map a slider keyboard event to the next value (ARIA slider keys), or null if the key
 * isn't a slider key. Arrows = ±step, PageUp/Down = ±10·step, Home/End = min/max.
 */
export function stepKey(key: string, value: number, step: number, min: number, max: number): number | null {
  switch (key) {
    case 'ArrowUp':
    case 'ArrowRight':
      return clamp(value + step, min, max);
    case 'ArrowDown':
    case 'ArrowLeft':
      return clamp(value - step, min, max);
    case 'PageUp':
      return clamp(value + step * 10, min, max);
    case 'PageDown':
      return clamp(value - step * 10, min, max);
    case 'Home':
      return min;
    case 'End':
      return max;
    default:
      return null;
  }
}

/** Whether a key activates a button (Enter or Space). */
export function isActivateKey(key: string): boolean {
  return key === 'Enter' || key === ' ' || key === 'Spacebar';
}
