import { useEffect, useRef, useState, type RefObject } from 'react';

/** Track an element's content-box size via ResizeObserver — for sizing an SVG to its box. */
export function useSize<T extends HTMLElement>(): [RefObject<T | null>, { width: number; height: number }] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measure synchronously on mount — immediate (no empty flash) and works even when the
    // tab is hidden and ResizeObserver delivery is throttled. RO then catches later resizes.
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}
