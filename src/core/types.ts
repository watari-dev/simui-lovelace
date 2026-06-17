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
  /** The home-assistant-js-websocket Connection (subset) — used for the weather forecast
   *  subscription (`weather/subscribe_forecast`). Absent in the standalone dev harness. */
  connection?: {
    subscribeMessage: <T = unknown>(callback: (event: T) => void, msg: { type: string } & Record<string, unknown>) => Promise<() => void>;
  };
  themes?: unknown;
  language?: string;
  locale?: unknown;
}

/** Base config shared by every SimUI card. `icon` overrides the device-class default
 *  (an `mdi:…` name, rendered via HA's <ha-icon>); omit to keep the automatic icon.
 *  `tap_action` configures what tapping the card body does (default: more-info). */
export interface BaseCardConfig {
  type: string;
  entity?: string;
  name?: string;
  icon?: string;
  tap_action?: import('./actions').ActionConfig;
  hold_action?: import('./actions').ActionConfig;
  double_tap_action?: import('./actions').ActionConfig;
}

/** The Lovelace custom-card contract (the subset SimUI cards implement). */
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: BaseCardConfig): void;
  getCardSize(): number | Promise<number>;
}
