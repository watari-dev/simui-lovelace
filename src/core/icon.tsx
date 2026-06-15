import { createElement, type CSSProperties, type ReactNode } from 'react';

/**
 * Render an icon, honouring a user's `icon:` override. When set (an `mdi:…` name) and HA's
 * `<ha-icon>` element is available (i.e. running inside Home Assistant), render that;
 * otherwise fall back to the card's device-class default (a lucide glyph). The standalone
 * dev harness has no `ha-icon`, so it shows the fallback unless a stub is registered.
 */
export function renderIcon(override: string | undefined, size: number, fallback: ReactNode): ReactNode {
  if (override && typeof customElements !== 'undefined' && customElements.get('ha-icon')) {
    return createElement('ha-icon', {
      icon: override,
      style: { ['--mdc-icon-size']: `${size}px`, color: 'currentColor', display: 'inline-flex' } as CSSProperties,
    });
  }
  return fallback;
}
