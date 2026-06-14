import type { HomeAssistant } from './types';

/** One row of an `ha-form` schema (a selector HA renders natively). */
export interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

export interface EditorSpec {
  schema: HaFormSchemaItem[];
  /** Field name → human label shown in the form. */
  labels?: Record<string, string>;
  /** Field name → helper text shown under the field. */
  helpers?: Record<string, string>;
  /** Values merged under the live config so an unset toggle reflects the card's real default. */
  defaults?: Record<string, unknown>;
}

interface HaFormElement extends HTMLElement {
  hass?: HomeAssistant;
  schema?: unknown;
  data?: unknown;
  computeLabel?: (s: { name: string }) => string;
  computeHelper?: (s: { name: string }) => string | undefined;
}

/**
 * Register a `<cardTag>-editor` element that drives HA's native `ha-form` (entity
 * picker, text, toggle…) from a tiny schema — the visual editor Lovelace opens when you
 * click "edit" on the card, so there's no YAML to write. Degrades to a one-line hint when
 * `ha-form` isn't present (e.g. the standalone dev harness). Returns the editor tag.
 */
export function defineCardEditor(cardTag: string, spec: EditorSpec): string {
  const tag = `${cardTag}-editor`;
  if (customElements.get(tag)) return tag;

  class CardEditor extends HTMLElement {
    private _config: Record<string, unknown> = {};
    private _hass?: HomeAssistant;
    private _form?: HaFormElement;

    setConfig(config: Record<string, unknown>): void {
      this._config = config ?? {};
      this._update();
    }

    set hass(hass: HomeAssistant) {
      this._hass = hass;
      this._update();
    }

    connectedCallback(): void {
      this._update();
    }

    private _update(): void {
      // No HA frontend (dev harness): show a hint instead of a broken form.
      if (!customElements.get('ha-form')) {
        if (!this.firstChild) {
          this.textContent = 'The visual editor needs Home Assistant — configure this card in YAML here.';
          this.setAttribute('style', 'display:block;padding:12px;opacity:.7;font:13px/1.5 sans-serif;');
        }
        return;
      }
      if (!this._form) {
        const form = document.createElement('ha-form') as HaFormElement;
        form.computeLabel = (s) => spec.labels?.[s.name] ?? s.name;
        if (spec.helpers) form.computeHelper = (s) => spec.helpers?.[s.name];
        form.addEventListener('value-changed', (ev: Event) => {
          ev.stopPropagation();
          const value = (ev as CustomEvent<{ value: Record<string, unknown> }>).detail.value;
          // Strip editor-only defaults back out so we don't bloat the saved YAML.
          const cleaned = { ...value };
          for (const [k, v] of Object.entries(spec.defaults ?? {})) {
            if (cleaned[k] === v) delete cleaned[k];
          }
          this.dispatchEvent(
            new CustomEvent('config-changed', {
              detail: { config: cleaned },
              bubbles: true,
              composed: true,
            }),
          );
        });
        this.appendChild(form);
        this._form = form;
      }
      this._form.hass = this._hass;
      this._form.schema = spec.schema;
      this._form.data = { ...(spec.defaults ?? {}), ...this._config };
    }
  }

  customElements.define(tag, CardEditor);
  return tag;
}
