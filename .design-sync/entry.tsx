// Design-system entry for claude.ai/design.
//
// src/main.ts (the HACS build entry) only registers custom elements and exports
// nothing importable. This entry re-exports the real React card components plus
// the Home Assistant context + a batteries-included mock-hass provider, so the
// claude.ai/design agent can compose Home Assistant dashboard mockups from the
// genuine SimUI tiles. The compiled bundle assigns every export to window.SimUI.
//
// Cards read live entity state from context: wrap them in <SimuiProvider> (demo
// state, no running HA) — that's the one rule for using SimUI on the web.

// ── The cards (one Lovelace tile each; configured via a `config` prop) ──────────
export { LightCard } from '../src/cards/LightCard';
export { ClimateCard } from '../src/cards/ClimateCard';
export { SensorCard } from '../src/cards/SensorCard';
export { GraphCard } from '../src/cards/GraphCard';
export { CoverCard } from '../src/cards/CoverCard';
export { LockCard } from '../src/cards/LockCard';
export { MediaCard } from '../src/cards/MediaCard';
export { ChipsCard } from '../src/cards/ChipsCard';
export { EnergyFlowCard } from '../src/cards/EnergyFlowCard';

// ── Config types (the `config` prop shape for each card) ────────────────────────
export type { LightCardConfig } from '../src/cards/LightCard';
export type { ClimateCardConfig } from '../src/cards/ClimateCard';
export type { SensorCardConfig } from '../src/cards/SensorCard';
export type { GraphCardConfig } from '../src/cards/GraphCard';
export type { CoverCardConfig } from '../src/cards/CoverCard';
export type { LockCardConfig } from '../src/cards/LockCard';
export type { MediaCardConfig } from '../src/cards/MediaCard';
export type { ChipsCardConfig } from '../src/cards/ChipsCard';
export type { EnergyFlowCardConfig } from '../src/cards/EnergyFlowCard';

// ── HA context + mock-hass helpers ──────────────────────────────────────────────
export { HassProvider } from '../src/core/hass';
export { SimuiProvider, createMockHass, DEMO_STATES } from './mock-hass';
export type { HomeAssistant, HassEntity, BaseCardConfig } from '../src/core/types';
