import { createContext, useContext, type ReactNode } from 'react';
import type { HomeAssistant, HassEntity, ServiceTarget } from './types';

interface HassCtxValue {
  hass: HomeAssistant;
  /** The card's host element — events fire from here so they cross the shadow boundary. */
  host: HTMLElement;
}

const HassCtx = createContext<HassCtxValue | null>(null);

export function HassProvider({ hass, host, children }: { hass: HomeAssistant; host: HTMLElement; children: ReactNode }) {
  return <HassCtx.Provider value={{ hass, host }}>{children}</HassCtx.Provider>;
}

function useCtx(): HassCtxValue {
  const v = useContext(HassCtx);
  if (!v) throw new Error('SimUI card rendered without a HassProvider');
  return v;
}

/** Read one entity's live state from the injected hass. The card re-renders whenever
 *  HA pushes a new `hass`, so this is always current. */
export function useEntity(entityId: string | undefined): HassEntity | undefined {
  const { hass } = useCtx();
  return entityId ? hass.states[entityId] : undefined;
}

export function useCallService() {
  const { hass } = useCtx();
  return (domain: string, service: string, data?: Record<string, unknown>, target?: ServiceTarget) =>
    hass.callService(domain, service, data, target);
}

/** Open Home Assistant's own more-info dialog for an entity (its native detail sheet). */
export function useMoreInfo() {
  const { host } = useCtx();
  return (entityId: string) => fireEvent(host, 'hass-more-info', { entityId });
}

export function fireEvent(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: false }));
}
