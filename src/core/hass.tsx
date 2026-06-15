import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { HomeAssistant, HassEntity, ServiceTarget } from './types';

interface HassCtxValue {
  hass: HomeAssistant;
  /** The card's host element — events fire from here so they cross the shadow boundary. */
  host: HTMLElement;
}

const HassCtx = createContext<HassCtxValue | null>(null);

export function HassProvider({ hass, host, children }: { hass: HomeAssistant; host: HTMLElement; children: ReactNode }) {
  const value = useMemo(() => ({ hass, host }), [hass, host]);
  return <HassCtx.Provider value={value}>{children}</HassCtx.Provider>;
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

/** The raw hass object — for cards that read many entities (chips, energy flow). */
export function useHass(): HomeAssistant {
  return useCtx().hass;
}

export function useCallService() {
  const { hass } = useCtx();
  return (domain: string, service: string, data?: Record<string, unknown>, target?: ServiceTarget) =>
    hass.callService(domain, service, data, target);
}

/** The HA user's language tag (e.g. "en", "fr") for locale-aware number/date formatting. */
export function useLanguage(): string | undefined {
  return useCtx().hass.language;
}

/** Open Home Assistant's own more-info dialog for an entity (its native detail sheet). */
export function useMoreInfo() {
  const { host } = useCtx();
  return (entityId: string) => fireEvent(host, 'hass-more-info', { entityId });
}

export function fireEvent(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: false }));
}

export interface HistoryPoint {
  t: number; // epoch ms
  v: number;
}

interface HistoryState {
  points: HistoryPoint[];
  loading: boolean;
  error: string | null;
}

// HA's `history/history_during_period` returns, per entity, an array of state objects. With
// minimal_response the first is full and the rest are compact: { s: state, lu: epoch-seconds }.
function parseHistory(raw: unknown): HistoryPoint[] {
  if (!Array.isArray(raw)) return [];
  const out: HistoryPoint[] = [];
  for (const e of raw as Record<string, unknown>[]) {
    const s = (e.s ?? e.state) as string | number | undefined;
    const lu = (e.lu ?? e.last_updated ?? e.last_changed) as string | number | undefined;
    const v = Number(s);
    if (lu == null || Number.isNaN(v)) continue;
    const t = typeof lu === 'number' ? lu * 1000 : Date.parse(lu);
    if (!Number.isNaN(t)) out.push({ t, v });
  }
  // The recorder is usually ascending, but DST/restart/overlap can reorder rows — and the
  // chart derives its time domain from the first/last element, so guarantee the order.
  out.sort((a, b) => a.t - b.t);
  return out;
}

/**
 * Fetch a numeric entity's recorder history over the last `hours`. Refetches when the
 * entity or range changes and refreshes every 2 min; does NOT refetch on every state push
 * (the card appends the live value itself for a current right edge). Returns mock-friendly
 * loading/error so the card can degrade gracefully when no recorder/callWS is present.
 */
export function useHistory(entityId: string | undefined, hours: number): HistoryState {
  const { hass } = useCtx();
  const hassRef = useRef(hass);
  hassRef.current = hass;
  const [state, setState] = useState<HistoryState>({ points: [], loading: true, error: null });

  useEffect(() => {
    if (!entityId) {
      setState({ points: [], loading: false, error: null });
      return;
    }
    let cancelled = false;
    const load = () => {
      const callWS = hassRef.current.callWS;
      if (!callWS) {
        setState({ points: [], loading: false, error: 'History unavailable' });
        return;
      }
      const end = new Date();
      const start = new Date(end.getTime() - hours * 3_600_000);
      setState((s) => ({ ...s, loading: s.points.length === 0 }));
      callWS<Record<string, unknown>>({
        type: 'history/history_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [entityId],
        minimal_response: true,
        no_attributes: true,
      })
        .then((res) => {
          if (cancelled) return;
          setState({ points: parseHistory(res?.[entityId]), loading: false, error: null });
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setState({ points: [], loading: false, error: err instanceof Error ? err.message : String(err) });
        });
    };
    load();
    const id = setInterval(load, 120_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [entityId, hours]);

  return state;
}
