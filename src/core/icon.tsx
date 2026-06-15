import { createElement, useEffect, useState, type CSSProperties, type ReactNode } from 'react';

/** True once HA's `<ha-icon>` custom element is registered. */
function haIconReady(): boolean {
  return typeof customElements !== 'undefined' && !!customElements.get('ha-icon');
}

/**
 * Render an icon, honouring a user's `icon:` override. When set (an `mdi:…` name) and HA's
 * `<ha-icon>` element is available (i.e. running inside Home Assistant), render that;
 * otherwise fall back to the card's device-class default (a lucide glyph). The standalone
 * dev harness has no `ha-icon`, so it shows the fallback unless a stub is registered.
 *
 * HA can register `<ha-icon>` *after* a card first paints (it's loaded lazily). We recover:
 * `customElements.whenDefined` flips state once it lands, upgrading the icon from the lucide
 * fallback to the real glyph instead of leaving it stuck on the fallback for the card's life.
 */
function EntityIcon({ override, size, fallback }: { override?: string; size: number; fallback: ReactNode }) {
  const [ready, setReady] = useState(haIconReady);

  useEffect(() => {
    if (ready || !override || typeof customElements === 'undefined') return;
    let live = true;
    customElements.whenDefined('ha-icon').then(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, [ready, override]);

  if (override && ready) {
    return createElement('ha-icon', {
      icon: override,
      style: { ['--mdc-icon-size']: `${size}px`, color: 'currentColor', display: 'inline-flex' } as CSSProperties,
    });
  }
  return fallback;
}

/** Render an icon, honouring a user's `icon:` override (see {@link EntityIcon}). */
export function renderIcon(override: string | undefined, size: number, fallback: ReactNode): ReactNode {
  return createElement(EntityIcon, { override, size, fallback });
}
