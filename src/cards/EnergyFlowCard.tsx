import { type CSSProperties, useMemo } from 'react';
import { useEntity, useMoreInfo } from '../core/hass';
import { useActionHandler } from '../core/action-handler';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig, HassEntity } from '../core/types';
import { isUnavailable } from '../util';

export interface EnergyFlowCardConfig extends BaseCardConfig {
  name?: string;
  solar?: string;
  grid?: string;
  battery?: string;
  battery_soc?: string;
  home?: string;
  /** A positive grid reading normally means importing; set true if yours is reversed. */
  grid_invert?: boolean;
  /** A positive battery reading normally means discharging; set true if reversed. */
  battery_invert?: boolean;
}

// ── viewBox geometry (matches the Luminous reference) ──────────────────────────
const TOP = 14, UH = 188, X0 = 92, BW = 11, RX = 360, VBW = 476, VBH = 202;
const X0B = X0 + BW, MID = (X0B + RX) / 2;
const ACTIVE = 0.05; // 50 W — below this a leg is idle

interface Leg { nm: string; w: number; color: string; nt: string; soc?: number; key?: string; h: number; y: number }

function kw(e: HassEntity | undefined, sign = 1): { kw: number; present: boolean } {
  if (!e || isUnavailable(e)) return { kw: 0, present: false };
  const n = Number(e.state);
  if (!Number.isFinite(n)) return { kw: 0, present: false };
  const unit = e.attributes.unit_of_measurement as string | undefined;
  const v = unit === 'kW' ? n : unit === 'MW' ? n * 1000 : n / 1000;
  return { kw: v * sign, present: true };
}
const fmtKw = (w: number): string => (Math.abs(w) / 1).toFixed(2).replace(/\.?0+$/, '') || '0';
const fmtVal = (w: number): { v: string; u: string } => (Math.abs(w) >= 1 ? { v: fmtKw(w), u: 'kW' } : { v: Math.round(Math.abs(w) * 1000).toString(), u: 'W' });

/**
 * SimUI energy-flow card — the Luminous Sankey: sources on the left, sinks on the right,
 * joined by translucent ribbons whose width is proportional to power, with dots flowing
 * along each ribbon. Derived live from the signed solar / grid / battery / home readings.
 */
export function EnergyFlowCard({ config }: CardComponentProps<EnergyFlowCardConfig>) {
  const moreInfo = useMoreInfo();
  const solarE = useEntity(config.solar ?? '');
  const gridE = useEntity(config.grid ?? '');
  const batteryE = useEntity(config.battery ?? '');
  const socE = useEntity(config.battery_soc ?? '');
  const homeE = useEntity(config.home ?? '');
  const primary = config.solar ?? config.grid ?? config.battery ?? config.home ?? config.battery_soc ?? '';
  const actions = useActionHandler(config, primary);

  const model = useMemo(() => {
    const solar = kw(solarE);
    const grid = kw(gridE, config.grid_invert ? -1 : 1);
    const battery = kw(batteryE, config.battery_invert ? -1 : 1);
    const home = kw(homeE);
    const socRaw = socE && !isUnavailable(socE) ? Number(socE.state) : NaN;
    const soc = Number.isFinite(socRaw) ? Math.min(100, Math.max(0, socRaw)) : undefined;

    const sources: Leg[] = [];
    const sinks: Leg[] = [];
    if (solar.present && Math.abs(solar.kw) >= ACTIVE) sources.push({ nm: 'Solar', w: Math.abs(solar.kw), color: 'var(--warm)', nt: 'Producing', h: 0, y: 0 });
    if (battery.present) {
      if (battery.kw >= ACTIVE) sources.push({ nm: 'Battery', w: battery.kw, color: 'var(--up)', nt: 'Discharging', soc, h: 0, y: 0 });
      else if (battery.kw <= -ACTIVE) sinks.push({ nm: 'Battery', w: -battery.kw, color: 'var(--up)', nt: 'Charging', soc, h: 0, y: 0 });
    }
    const importing = grid.present && grid.kw >= ACTIVE;
    if (grid.present) {
      if (importing) sources.push({ nm: 'Grid', w: grid.kw, color: 'var(--cool)', nt: 'Importing', h: 0, y: 0 });
      else if (grid.kw <= -ACTIVE) sinks.push({ nm: 'Export', w: -grid.kw, color: 'var(--cool)', nt: 'To grid', h: 0, y: 0 });
    }
    const srcTotal = sources.reduce((a, n) => a + n.w, 0);
    const homeW = home.present ? Math.abs(home.kw) : Math.max(0, srcTotal - sinks.reduce((a, n) => a + n.w, 0));
    sinks.unshift({ key: 'home', nm: 'Home', w: homeW, color: 'var(--home)', nt: 'In use', h: 0, y: 0 });

    return { sources, sinks, importing, soc, idle: srcTotal < ACTIVE };
  }, [solarE, gridE, batteryE, socE, homeE, config.grid_invert, config.battery_invert]);

  const { sources, sinks, importing, idle } = model;
  const acc = importing ? 'var(--cool)' : 'var(--up)';
  const statusText = importing ? 'Grid-assisted' : 'Self-powered';

  const sankey = useMemo(() => {
    const srcTotal = sources.reduce((a, n) => a + n.w, 0) || 1;
    const sinkTotal = sinks.reduce((a, n) => a + n.w, 0) || 1;
    const lay = (ns: Leg[], scale: number) => { let y = TOP; ns.forEach((n) => { n.h = n.w * scale; n.y = y; y += n.h; }); };
    lay(sources, UH / srcTotal);
    lay(sinks, UH / sinkTotal);

    const splitting = sources.length === 1;
    const src = sources.map((n) => ({ color: n.color, y: n.y, rem: n.h }));
    const snk = sinks.map((n) => ({ color: n.color, y: n.y, rem: n.h }));
    const ribs: { color: string; sY: number; kY: number; h: number }[] = [];
    let i = 0, j = 0, guard = 0;
    while (i < src.length && j < snk.length && guard++ < 50) {
      const f = Math.min(src[i].rem, snk[j].rem);
      ribs.push({ color: splitting ? snk[j].color : src[i].color, sY: src[i].y, kY: snk[j].y, h: f });
      src[i].y += f; src[i].rem -= f; snk[j].y += f; snk[j].rem -= f;
      if (src[i].rem < 0.2) i++;
      if (snk[j] && snk[j].rem < 0.2) j++;
    }
    // labels: anchor to bar centre, nudge apart, clamp into the band
    const place = (ns: Leg[]) => {
      const MIN = 52;
      const lys = ns.map((n) => n.y + n.h / 2);
      for (let k = 1; k < lys.length; k++) if (lys[k] - lys[k - 1] < MIN) lys[k] = lys[k - 1] + MIN;
      const over = lys.length ? lys[lys.length - 1] - (TOP + UH - 6) : 0;
      if (over > 0) for (let k = 0; k < lys.length; k++) lys[k] -= over;
      return lys;
    };
    return { ribs, srcLy: place(sources), snkLy: place(sinks) };
  }, [sources, sinks]);

  if (!config.solar && !config.grid && !config.battery && !config.home && !config.battery_soc) {
    return <div className="card energy" style={{ ['--acc']: 'var(--up)', height: '100%' } as CSSProperties}><div className="ehead"><span className="etitle"><span className="tick" />{config.name ?? 'Energy'}</span></div><div className="ediagram"><div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 12, opacity: .6 }}>Add power sensors</div></div></div>;
  }

  const dur = 2.4;
  return (
    <div
      className="card energy"
      style={{ ['--acc']: acc, height: '100%' } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={config.name ?? 'Energy flow'}
      {...actions}
      onContextMenu={(ev) => { ev.preventDefault(); if (primary) moreInfo(primary); }}
    >
      <div className="ehead">
        <span className="etitle"><span className="tick" />{config.name ?? 'Energy · Now'}</span>
        <div className="eright">
          <span className="epill"><span className="pt" />{idle ? 'Idle' : statusText}</span>
        </div>
      </div>
      <div className="ediagram">
        <svg viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="none">
          {sankey.ribs.map((r, k) => {
            const gap = r.h > 8 ? 1.25 : 0;
            const sT = r.sY + gap, sB = r.sY + r.h - gap, kT = r.kY + gap, kB = r.kY + r.h - gap;
            return <path key={`r${k}`} className="ribbon" d={`M${X0B},${sT} C${MID},${sT} ${MID},${kT} ${RX},${kT} L${RX},${kB} C${MID},${kB} ${MID},${sB} ${X0B},${sB} Z`} fill={r.color} fillOpacity="0.24" />;
          })}
          {sankey.ribs.map((r, k) => {
            const cs = r.sY + r.h / 2, ck = r.kY + r.h / 2;
            const p = `M${X0B},${cs} C${MID},${cs} ${MID},${ck} ${RX},${ck}`;
            const dots = Math.max(1, Math.min(4, Math.round(r.h / 24)));
            return Array.from({ length: dots }, (_, d) => (
              <circle key={`d${k}_${d}`} r="3" fill={r.color}>
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${(-(dur / dots) * d).toFixed(2)}s`} path={p} calcMode="linear" keyPoints="0;1" keyTimes="0;1" />
              </circle>
            ));
          })}
          {sources.map((n, k) => <rect key={`sb${k}`} x={X0} y={n.y + 1.5} width={BW} height={Math.max(2, n.h - 3)} rx="5" fill={n.color} />)}
          {sinks.map((n, k) => <rect key={`kb${k}`} x={RX} y={n.y + 1.5} width={BW} height={Math.max(2, n.h - 3)} rx="5" fill={n.color} />)}
        </svg>
        <div className="elabels">
          {sources.map((n, k) => {
            const fv = fmtVal(n.w);
            return (
              <div key={`sl${k}`} className="elab src" style={{ right: `${((VBW - (X0 - 12)) / VBW) * 100}%`, top: `${(sankey.srcLy[k] / VBH) * 100}%`, transform: 'translateY(-50%)' }}>
                <span className="nm">{n.nm}</span><span className="v">{fv.v}<span className="u">{fv.u}</span></span><span className="nt">{n.nt}{n.soc != null ? ` · ${Math.round(n.soc)}%` : ''}</span>
              </div>
            );
          })}
          {sinks.map((n, k) => {
            const fv = fmtVal(n.w);
            return (
              <div key={`kl${k}`} className={`elab snk${n.key === 'home' ? ' big' : ''}`} style={{ left: `${((RX + BW + 12) / VBW) * 100}%`, top: `${(sankey.snkLy[k] / VBH) * 100}%`, transform: 'translateY(-50%)' }}>
                <span className="nm">{n.nm}</span><span className="v">{fv.v}<span className="u">{fv.u}</span></span><span className="nt">{n.nt}{n.soc != null ? ` · ${Math.round(n.soc)}%` : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
