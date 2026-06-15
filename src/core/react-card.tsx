import { createRoot, type Root } from 'react-dom/client';
import { Component as ReactComponent, memo, StrictMode, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import { HassProvider } from './hass';
import type { BaseCardConfig, HomeAssistant } from './types';
import { defineCardEditor, type EditorSpec } from './card-editor';
import styleText from '../styles.css?inline';

export interface CardComponentProps<C extends BaseCardConfig = BaseCardConfig> {
  config: C;
}

interface DefineOptions<C extends BaseCardConfig> {
  /** A starter config for the card-picker preview (gets `hass` so it can auto-pick an entity). */
  stubConfig?: (hass?: HomeAssistant) => Partial<C>;
  /** Throw on an invalid config (HA shows the message in the editor). */
  validate?: (config: C) => void;
  /** A native `ha-form` visual editor (no YAML) — opened by Lovelace's "edit card". */
  editor?: EditorSpec;
  /** Approx height in Lovelace grid units (~50px each) for masonry layout; default 1. */
  cardSize?: number;
}

/** Catches a render throw so one bad card shows an inline message instead of a permanently
 *  blank (or dashboard-breaking) tile. */
class CardErrorBoundary extends ReactComponent<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SimUI] card render error', error, info);
  }
  render() {
    const err = this.state.error;
    if (err) {
      return (
        <div className="simui-tile is-unavailable" role="alert">
          <span className="simui-tile-ic" aria-hidden="true">!</span>
          <span className="simui-tile-name">Card error</span>
          <span className="simui-tile-state" title={err.message}>{err.message}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Wrap a React component as a Lovelace custom card. Each instance owns a shadow root
 * (style isolation — nothing leaks into HA, and HA's theme vars still inherit in), a
 * React root, an error boundary, and re-renders only when its entity's state changes.
 * The component reads state via the hooks in `./hass`.
 */
export function defineCard<C extends BaseCardConfig>(
  tag: string,
  Component: ComponentType<CardComponentProps<C>>,
  opts: DefineOptions<C> = {},
): void {
  const editorTag = opts.editor ? defineCardEditor(tag, opts.editor) : undefined;
  const Memoized = memo(Component);

  class SimuiCard extends HTMLElement {
    private _root?: Root;
    private _hass?: HomeAssistant;
    private _config?: C;

    setConfig(config: C): void {
      if (!config) throw new Error('Invalid configuration');
      opts.validate?.(config);
      this._config = config;
      this._render();
    }

    set hass(hass: HomeAssistant) {
      const prev = this._hass;
      this._hass = hass;
      // HA pushes a new hass object for every state change in the home but preserves the
      // state-object reference of entities that didn't change — so re-render only when our
      // own entity actually changed (or on first paint), not on every unrelated push.
      const id = this._config?.entity;
      if (!this._root || !prev || (id != null && prev.states[id] !== hass.states[id])) {
        this._render();
      }
    }
    get hass(): HomeAssistant | undefined {
      return this._hass;
    }

    getCardSize(): number {
      return opts.cardSize ?? 1;
    }

    static getStubConfig(hass?: HomeAssistant): Partial<C> & { type: string } {
      return { type: tag, ...(opts.stubConfig?.(hass) ?? {}) } as Partial<C> & { type: string };
    }

    static getConfigElement(): HTMLElement | undefined {
      return editorTag ? document.createElement(editorTag) : undefined;
    }

    connectedCallback(): void {
      this._render();
    }

    disconnectedCallback(): void {
      this._root?.unmount();
      this._root = undefined;
    }

    private _render(): void {
      if (!this._hass || !this._config) return;
      if (!this._root) {
        const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = styleText;
        const mount = document.createElement('div');
        // replaceChildren (not append): a disconnected + reconnected card (Lovelace
        // drag-reorder / sections mode) keeps its shadow root, so append stacks duplicates.
        shadow.replaceChildren(style, mount);
        this._root = createRoot(mount);
      }
      this._root.render(
        <StrictMode>
          <CardErrorBoundary>
            <HassProvider hass={this._hass} host={this}>
              <Memoized config={this._config} />
            </HassProvider>
          </CardErrorBoundary>
        </StrictMode>,
      );
    }
  }

  if (!customElements.get(tag)) customElements.define(tag, SimuiCard);
}
