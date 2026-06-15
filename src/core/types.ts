// Minimal Home Assistant surface the cards need (HA injects the real `hass`).

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export type ServiceTarget = { entity_id?: string | string[]; area_id?: string | string[]; device_id?: string | string[] };

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: ServiceTarget,
  ) => Promise<unknown> | void;
  /** WebSocket command — used for recorder history (`history/history_during_period`). */
  callWS?: <T = unknown>(msg: { type: string } & Record<string, unknown>) => Promise<T>;
  themes?: unknown;
  language?: string;
  locale?: unknown;
}

/** Base config shared by every SimUI card. `icon` overrides the device-class default
 *  (an `mdi:…` name, rendered via HA's <ha-icon>); omit to keep the automatic icon. */
export interface BaseCardConfig {
  type: string;
  entity?: string;
  name?: string;
  icon?: string;
}

/** The Lovelace custom-card contract (the subset SimUI cards implement). */
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: BaseCardConfig): void;
  getCardSize(): number | Promise<number>;
}
