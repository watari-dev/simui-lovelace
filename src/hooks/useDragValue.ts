import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { clamp } from '../util';

/**
 * "The tile IS the slider." A pointer drag — horizontal OR vertical — anywhere over
 * the host maps to a 0–100 value with optimistic local state and a debounced commit.
 * Returns `{ value, dragging, moved, handlers, fillStyle }`. (Ported verbatim from the
 * simUI panel — it has no Home Assistant coupling.)
 */
export interface DragValueOptions {
  value: number;
  onCommit: (value: number) => void;
  axis?: 'vertical' | 'horizontal' | 'auto';
  commitMs?: number;
  step?: number;
  disabled?: boolean;
  threshold?: number;
}

export interface DragValueResult {
  value: number;
  dragging: boolean;
  moved: () => boolean;
  handlers: { onPointerDown: (e: ReactPointerEvent) => void };
  fillStyle: CSSProperties;
}

function snap(v: number, step: number): number {
  if (step <= 0) return clamp(Math.round(v), 0, 100);
  return clamp(Math.round(v / step) * step, 0, 100);
}

export function useDragValue(opts: DragValueOptions): DragValueResult {
  const { value: external, onCommit, axis = 'auto', commitMs = 120, step = 1, disabled, threshold = 4 } = opts;

  const [value, setValue] = useState(() => snap(external, step));
  const [dragging, setDragging] = useState(false);
  const [lockedAxis, setLockedAxis] = useState<'vertical' | 'horizontal'>(axis === 'auto' ? 'vertical' : axis);

  const draggingRef = useRef(false);
  const valueRef = useRef(value);
  const rectRef = useRef<DOMRect | null>(null);
  const lockAxisRef = useRef<'vertical' | 'horizontal' | null>(axis === 'auto' ? null : axis);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const pointRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);

  const lastCommitRef = useRef(0);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  const flushCommit = useCallback(() => {
    if (commitTimer.current != null) {
      clearTimeout(commitTimer.current);
      commitTimer.current = null;
    }
    if (pendingRef.current != null) {
      const v = pendingRef.current;
      pendingRef.current = null;
      lastCommitRef.current = Date.now();
      onCommitRef.current(v);
    }
  }, []);

  const scheduleCommit = useCallback(
    (v: number) => {
      pendingRef.current = v;
      const now = Date.now();
      const wait = Math.max(0, commitMs - (now - lastCommitRef.current));
      if (commitTimer.current != null) clearTimeout(commitTimer.current);
      commitTimer.current = setTimeout(flushCommit, wait);
    },
    [commitMs, flushCommit],
  );

  useEffect(() => {
    if (draggingRef.current || pendingRef.current != null) return;
    const next = snap(external, step);
    valueRef.current = next;
    setValue(next);
  }, [external, step]);

  const apply = useCallback(() => {
    rafRef.current = null;
    const rect = rectRef.current;
    const pt = pointRef.current;
    if (!rect || !pt) return;

    if (lockAxisRef.current == null && startRef.current) {
      const dx = Math.abs(pt.x - startRef.current.x);
      const dy = Math.abs(pt.y - startRef.current.y);
      if (dx > threshold || dy > threshold) {
        const a = dy >= dx ? 'vertical' : 'horizontal';
        lockAxisRef.current = a;
        setLockedAxis(a);
      }
    }
    const active = lockAxisRef.current ?? 'vertical';

    let raw: number;
    if (active === 'vertical') {
      raw = rect.height > 0 ? ((rect.bottom - pt.y) / rect.height) * 100 : 0;
    } else {
      raw = rect.width > 0 ? ((pt.x - rect.left) / rect.width) * 100 : 0;
    }
    const next = snap(raw, step);
    if (next !== valueRef.current) {
      valueRef.current = next;
      setValue(next);
      scheduleCommit(next);
    }
  }, [step, threshold, scheduleCommit]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      pointRef.current = { x: e.clientX, y: e.clientY };
      if (startRef.current && !movedRef.current) {
        const dx = Math.abs(e.clientX - startRef.current.x);
        const dy = Math.abs(e.clientY - startRef.current.y);
        if (dx > threshold || dy > threshold) movedRef.current = true;
      }
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
    };

    const onUp = () => {
      draggingRef.current = false;
      setDragging(false);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (movedRef.current) {
        if (pendingRef.current == null) pendingRef.current = valueRef.current;
        flushCommit();
      }
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, threshold, apply, flushCommit]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (commitTimer.current != null) clearTimeout(commitTimer.current);
    },
    [],
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (disabled) return;
      if (e.button != null && e.button !== 0) return;
      const el = e.currentTarget as HTMLElement;
      rectRef.current = el.getBoundingClientRect();
      startRef.current = { x: e.clientX, y: e.clientY };
      pointRef.current = { x: e.clientX, y: e.clientY };
      movedRef.current = false;
      lockAxisRef.current = axis === 'auto' ? null : axis;
      draggingRef.current = true;
      setDragging(true);
    },
    [disabled, axis],
  );

  const fillStyle: CSSProperties = lockedAxis === 'horizontal' ? { width: `${value}%` } : { height: `${value}%` };
  const moved = useCallback(() => movedRef.current, []);

  return { value, dragging, moved, handlers: { onPointerDown }, fillStyle };
}
