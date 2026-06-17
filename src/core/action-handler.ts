import { useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useActions } from './hass';
import type { ActionConfig } from './actions';
import { isActivateKey } from '../util';

interface ActionConfigs {
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

const HOLD_MS = 500; // press-and-hold threshold (mirrors HA's action-handler)
const DOUBLE_MS = 250; // window to register a second tap

/**
 * Wire a card root for native tap / hold / double-tap gestures — the same model HA's own
 * cards use. Returns props to spread on the element. `opts.moved` lets a drag control
 * (brightness / position / temperature) suppress the tap so a slide never fires an action.
 *
 * Hold fires mid-press at HOLD_MS (unless the pointer moved into a drag); the click that
 * follows the release is swallowed. With a double_tap_action set, a single tap is held back
 * for DOUBLE_MS to see if a second tap lands.
 */
export function useActionHandler(config: ActionConfigs, entity?: string, opts?: { moved?: () => boolean }) {
  const run = useActions();
  const moved = opts?.moved;
  const s = useRef({ down: false, held: false, holdTimer: 0, clicks: 0, clickTimer: 0 }).current;

  const fire = (a?: ActionConfig) => run(a, entity);
  const clearHold = () => {
    s.down = false;
    if (s.holdTimer) { clearTimeout(s.holdTimer); s.holdTimer = 0; }
  };

  const onPointerDown = () => {
    s.down = true;
    s.held = false;
    if (config.hold_action) {
      s.holdTimer = window.setTimeout(() => {
        s.holdTimer = 0;
        if (s.down && !moved?.()) { s.held = true; fire(config.hold_action); }
      }, HOLD_MS);
    }
  };

  const onClick = () => {
    clearHold();
    if (s.held) { s.held = false; return; } // a hold already fired — swallow the click
    if (moved?.()) return; // a drag, not a tap
    if (config.double_tap_action) {
      s.clicks += 1;
      if (s.clicks === 1) {
        s.clickTimer = window.setTimeout(() => {
          if (s.clicks === 1) fire(config.tap_action);
          s.clicks = 0;
        }, DOUBLE_MS);
      } else {
        if (s.clickTimer) { clearTimeout(s.clickTimer); s.clickTimer = 0; }
        s.clicks = 0;
        fire(config.double_tap_action);
      }
      return;
    }
    fire(config.tap_action);
  };

  const onKeyDown = (ev: ReactKeyboardEvent) => {
    if (isActivateKey(ev.key)) { ev.preventDefault(); fire(config.tap_action); }
  };

  return { onClick, onPointerDown, onPointerUp: clearHold, onPointerCancel: clearHold, onPointerLeave: clearHold, onKeyDown };
}
