import { createRoot, type Root } from 'react-dom/client';
import { StrictMode, type ComponentType } from 'react';
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
}

/**
 * Wrap a React component as a Lovelace custom card. Each instance owns a shadow root
 * (style isolation — nothing leaks into HA, and HA's theme vars still inherit in), a
 * React root rendered once, and re-renders whenever HA pushes a new `hass` or the
 * config changes. The component reads state via the hooks in `./hass`.
 */
export function defineCard<C extends BaseCardConfig>(
  tag: string,
  Component: ComponentType<CardComponentProps<C>>,
  opts: DefineOptions<C> = {},
): void {
  const editorTag = opts.editor ? defineCardEditor(tag, opts.editor) : undefined;

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
      this._hass = hass;
      this._render();
    }
    get hass(): HomeAssistant | undefined {
      return this._hass;
    }

    getCardSize(): number {
      return 1;
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
        shadow.append(style, mount);
        this._root = createRoot(mount);
      }
      this._root.render(
        <StrictMode>
          <HassProvider hass={this._hass} host={this}>
            <Component config={this._config} />
          </HassProvider>
        </StrictMode>,
      );
    }
  }

  if (!customElements.get(tag)) customElements.define(tag, SimuiCard);
}
