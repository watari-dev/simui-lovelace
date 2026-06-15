import { domainOf } from '../util';
import type { HomeAssistant, ServiceTarget } from './types';

// Inlined (not imported from ./hass) to avoid a circular import — same semantics as fireEvent.
function fire(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: false }));
}

/** A Lovelace tap/hold action config (the subset SimUI supports). Mirrors HA's `ui_action`
 *  selector so the visual editor's native action picker produces it. */
export interface ActionConfig {
  action: 'more-info' | 'toggle' | 'navigate' | 'url' | 'perform-action' | 'call-service' | 'none';
  entity?: string;
  navigation_path?: string;
  url_path?: string;
  /** New HA key. */
  perform_action?: string; // "domain.service"
  /** Legacy alias for perform_action. */
  service?: string;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  target?: ServiceTarget;
}

/** Execute a configured action (default: more-info on `defaultEntity`). */
export function runAction(
  host: HTMLElement,
  hass: HomeAssistant,
  action: ActionConfig | undefined,
  defaultEntity?: string,
): void {
  const a: ActionConfig = action ?? { action: 'more-info' };
  const entity = a.entity ?? defaultEntity;

  switch (a.action) {
    case 'none':
      return;
    case 'more-info':
      if (entity) fire(host, 'hass-more-info', { entityId: entity });
      return;
    case 'toggle':
      if (entity) hass.callService(domainOf(entity), 'toggle', {}, { entity_id: entity });
      return;
    case 'navigate':
      if (a.navigation_path) {
        history.pushState(null, '', a.navigation_path);
        fire(host, 'location-changed', { replace: false });
      }
      return;
    case 'url':
      if (a.url_path) window.open(a.url_path, a.url_path.startsWith('/') ? '_self' : '_blank');
      return;
    case 'perform-action':
    case 'call-service': {
      const svc = a.perform_action ?? a.service;
      if (svc && svc.includes('.')) {
        const [domain, service] = svc.split('.', 2);
        hass.callService(domain, service, a.data ?? a.service_data ?? {}, a.target);
      }
      return;
    }
  }
}
