// Derive a tile tint from a light's live colour — the Apple-Home read where an
// "on" light tints its card with its own colour. RGB colours are clamped in HSV so a
// pale or near-white bulb still reads against a dark surface; colour-temp lights map
// to a warm↔cool tint; otherwise the default soft yellow.

type RGB = [number, number, number];

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

function hsvToRgb(h: number, s: number, v: number): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r: number, g: number, b: number;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/** Interpolate warm→cool by colour temperature (Kelvin). Returns an `R, G, B` triplet. */
function tempTint(kelvin: number): string {
  const t = Math.max(0, Math.min(1, (kelvin - 2000) / (6500 - 2000)));
  const warm: RGB = [255, 197, 110]; // ~2000K soft amber
  const cool: RGB = [201, 221, 255]; // ~6500K soft cool white
  const mix = warm.map((w, i) => Math.round(w + (cool[i] - w) * t)) as RGB;
  return `${mix[0]}, ${mix[1]}, ${mix[2]}`;
}

/**
 * The value for `--tile-tint`: an `R, G, B` triplet (so the CSS can take it at any alpha
 * — `rgb(var(--tile-tint))` solid, `rgba(var(--tile-tint), .2)` for the icon-cell wash).
 * Coloured/temp lights resolve to a literal triplet; everything else returns the `--warm`
 * token, itself a triplet the user's ULM theme can override.
 */
export function lightTint(attrs: Record<string, unknown>): string {
  const rgb = attrs.rgb_color as RGB | undefined;
  if (Array.isArray(rgb) && rgb.length === 3) {
    const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    // Keep it visible on a dark surface: floor the saturation + value.
    const [r, g, b] = hsvToRgb(h, Math.max(s, 0.55), Math.max(v, 0.92));
    return `${r}, ${g}, ${b}`;
  }
  const kelvin =
    (attrs.color_temp_kelvin as number | undefined) ??
    (attrs.color_temp ? Math.round(1_000_000 / (attrs.color_temp as number)) : undefined);
  if (kelvin) return tempTint(kelvin);
  return 'var(--warm)';
}

/** Whether the light supports brightness (vs an on/off-only switch-light). */
export function lightHasBrightness(attrs: Record<string, unknown>): boolean {
  const modes = attrs.supported_color_modes as string[] | undefined;
  if (modes && modes.length) return modes.some((m) => m !== 'onoff');
  return attrs.brightness != null;
}
