import { type CSSProperties, type ReactNode } from 'react';
import { Home as HomeIcon, Sun as SunIcon, Zap as ZapIcon } from 'lucide-react';
import { useEntity, useMoreInfo } from '../core/hass';
import type { CardComponentProps } from '../core/react-card';
import type { BaseCardConfig, HassEntity } from '../core/types';
import { isUnavailable } from '../util';

export interface EnergyFlowCardConfig extends BaseCardConfig {
  name?: string;
  /** Power entities. grid/battery are SIGNED (Powerwall idiom — see below). */
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

/**
 * SimUI energy-flow card — a Powerwall-style diagram of where power is flowing now:
 * Solar / Grid / Battery on a cross around the Home hub, each connected by a wire that
 * colours + animates only when power crosses it. Ported from the simUI panel.
 *
 * Sign conventions (Tesla idiom): solar magnitude → Home; grid >0 = importing (coral),
 * <0 = exporting (green); battery >0 = discharging (green), <0 = charging (blue). Flip
 * with grid_invert / battery_invert.
 */
type Role = 'solar' | 'load' | 'grid' | 'battery';

const VB_W = 260;
const VB_H = 180;
const HUB = { x: VB_W / 2, y: 104 };
const POS: Record<Role, { x: number; y: number }> = {
  solar: { x: VB_W / 2, y: 36 },
  grid: { x: 40, y: HUB.y },
  battery: { x: VB_W - 40, y: HUB.y },
  load: HUB,
};
const ACTIVE_KW = 0.05; // 50 W — below this an edge is idle (no colour, no motion).

type FlowNodeIcon = (props: { soc?: number }) => ReactNode;
const Sun: FlowNodeIcon = () => <SunIcon size={20} strokeWidth={2} />;
const House: FlowNodeIcon = () => <HomeIcon size={20} strokeWidth={2} />;
const Utility: FlowNodeIcon = () => <ZapIcon size={20} strokeWidth={2} />;

/** A battery glyph whose fill tracks state-of-charge (currentColor tints it). */
const Battery: FlowNodeIcon = ({ soc }) => {
  const pct = soc == null ? 0 : Math.min(100, Math.max(0, soc));
  const w = (pct / 100) * 11;
  return (
    <svg width={22} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="7" width="16" height="10" rx="2.2" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="10" width="2.4" height="4" rx="1" fill="currentColor" />
      {soc != null && w > 0 && <rect x="3.5" y="8.5" width={w} height="7" rx="1" fill="currentColor" />}
    </svg>
  );
};

interface Num {
  kw: number;
  dead: boolean;
}
/** Read a POWER entity as kW. `isFinite` rejects NaN/±Infinity; a unitless power sensor
 *  is assumed to be watts (HA's default for device_class power). Not for the SOC slot. */
function numVal(e: HassEntity | undefined): Num {
  if (isUnavailable(e) || !e) return { kw: 0, dead: true };
  const n = Number(e.state);
  if (!Number.isFinite(n)) return { kw: 0, dead: true };
  const unit = e.attributes.unit_of_measurement as string | undefined;
  const kw = unit === 'kW' ? n : unit === 'MW' ? n * 1000 : n / 1000; // W / unitless → watts
  return { kw, dead: false };
}
function fmt(kw: number): string {
  const a = Math.abs(kw);
  if (a >= 10) return Math.round(a).toString();
  if (a >= 1) return a.toFixed(1).replace(/\.0$/, '');
  return Math.round(a * 1000).toString(); // sub-kW → watts
}
const unitFor = (kw: number) => (Math.abs(kw) >= 1 ? 'kW' : 'W');

interface NodeView {
  role: Role;
  icon: FlowNodeIcon;
  label: string;
  accent: string;
  value: number;
  dead: boolean;
  entityId?: string;
  soc?: number;
}
interface EdgeView {
  role: Exclude<Role, 'load'>;
  dir: 'in' | 'out' | 'idle';
  active: boolean;
  accent: string;
  dead: boolean;
}

export function EnergyFlowCard({ config }: CardComponentProps<EnergyFlowCardConfig>) {
  const moreInfo = useMoreInfo();
  const solarE = useEntity(config.solar ?? '');
  const loadE = useEntity(config.home ?? '');
  const gridE = useEntity(config.grid ?? '');
  const batteryE = useEntity(config.battery ?? '');
  const socE = useEntity(config.battery_soc ?? '');

  const gridSign = config.grid_invert ? -1 : 1;
  const batterySign = config.battery_invert ? -1 : 1;

  const solar = numVal(solarE);
  const load = numVal(loadE);
  const grid = numVal(gridE);
  const battery = numVal(batteryE);
  // SOC is a plain 0–100 percent — read directly, not through the kW power conversion.
  const socRaw = socE && !isUnavailable(socE) ? Number(socE.state) : NaN;
  const socPct = Number.isFinite(socRaw) ? Math.min(100, Math.max(0, socRaw)) : undefined;

  const nodes: NodeView[] = [];
  if (config.solar) nodes.push({ role: 'solar', icon: Sun, label: 'Solar', accent: 'var(--warm)', value: Math.abs(solar.kw), dead: solar.dead, entityId: config.solar });
  nodes.push({ role: 'load', icon: House, label: 'Home', accent: 'var(--theme)', value: Math.abs(load.kw), dead: config.home ? load.dead : true, entityId: config.home });
  if (config.grid) nodes.push({ role: 'grid', icon: Utility, label: 'Grid', accent: 'var(--cool)', value: Math.abs(grid.kw), dead: grid.dead, entityId: config.grid });
  if (config.battery || config.battery_soc)
    nodes.push({
      role: 'battery',
      icon: Battery,
      label: 'Battery',
      accent: 'var(--up)',
      value: Math.abs(battery.kw),
      dead: config.battery ? battery.dead : true,
      entityId: config.battery ?? config.battery_soc,
      soc: socPct,
    });

  const edges: EdgeView[] = [];
  if (config.solar) {
    const active = !solar.dead && Math.abs(solar.kw) >= ACTIVE_KW;
    edges.push({ role: 'solar', dir: active ? 'in' : 'idle', active, accent: 'var(--warm)', dead: solar.dead });
  }
  if (config.grid) {
    const importing = grid.kw * gridSign > 0;
    const active = !grid.dead && Math.abs(grid.kw) >= ACTIVE_KW;
    edges.push({ role: 'grid', dir: active ? (importing ? 'in' : 'out') : 'idle', active, accent: importing ? 'var(--down)' : 'var(--up)', dead: grid.dead });
  }
  if (config.battery) {
    const discharging = battery.kw * batterySign > 0;
    const active = !battery.dead && Math.abs(battery.kw) >= ACTIVE_KW;
    edges.push({ role: 'battery', dir: active ? (discharging ? 'in' : 'out') : 'idle', active, accent: discharging ? 'var(--up)' : 'var(--cool)', dead: battery.dead });
  }
  const edgeByRole = new Map(edges.map((e) => [e.role, e]));

  return (
    <div className="simui-eflow">
      <svg className="simui-eflow-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={config.name ?? 'Energy flow'}>
        {(['solar', 'grid', 'battery'] as const).map((role) => {
          const edge = edgeByRole.get(role);
          return edge ? <FlowEdge key={role} from={POS[role]} to={POS.load} edge={edge} /> : null;
        })}
      </svg>
      <div className="simui-eflow-nodes">
        {nodes.map((n) => (
          <FlowNode key={n.role} node={n} onTap={n.entityId ? () => moreInfo(n.entityId as string) : undefined} />
        ))}
      </div>
    </div>
  );
}

function FlowNode({ node, onTap }: { node: NodeView; onTap?: () => void }) {
  const Icon = node.icon;
  const left = (POS[node.role].x / VB_W) * 100;
  const top = (POS[node.role].y / VB_H) * 100;
  return (
    <button
      type="button"
      className={`simui-eflow-node role-${node.role}${node.dead ? ' is-dead' : ''}`}
      style={{ left: `${left}%`, top: `${top}%`, ['--eflow-node' as string]: node.accent } as CSSProperties}
      aria-label={`${node.label}: ${node.dead ? 'unavailable' : `${fmt(node.value)} ${unitFor(node.value)}`}`}
      disabled={!onTap}
      onClick={onTap}
    >
      <span className="simui-eflow-node-ic">
        <Icon soc={node.soc} />
      </span>
      <span className="simui-eflow-node-label">{node.label}</span>
      <span className="simui-eflow-node-val">
        {node.dead ? '—' : (
          <>
            {fmt(node.value)}
            <span className="simui-eflow-node-unit">{unitFor(node.value)}</span>
          </>
        )}
      </span>
      {node.role === 'battery' && node.soc != null && <span className="simui-eflow-node-soc">{Math.round(node.soc)}%</span>}
    </button>
  );
}

function FlowEdge({ from, to, edge }: { from: { x: number; y: number }; to: { x: number; y: number }; edge: EdgeView }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const PAD = 30;
  const x1 = from.x + ux * PAD;
  const y1 = from.y + uy * PAD;
  const x2 = to.x - ux * PAD;
  const y2 = to.y - uy * PAD;
  const cls = `simui-eflow-edge dir-${edge.dir}${edge.active ? ' is-active' : ''}${edge.dead ? ' is-dead' : ''}`;
  return (
    <g className={cls} style={{ ['--eflow-edge' as string]: edge.accent } as CSSProperties}>
      <line className="simui-eflow-wire" x1={x1} y1={y1} x2={x2} y2={y2} />
      {edge.active && <line className="simui-eflow-pulse" x1={x1} y1={y1} x2={x2} y2={y2} pathLength={100} />}
    </g>
  );
}
