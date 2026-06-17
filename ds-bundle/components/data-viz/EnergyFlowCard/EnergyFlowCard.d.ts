import * as React from 'react';

/**
 * EnergyFlowCard — from simui-lovelace@0.2.0.
 */
export interface EnergyFlowCardProps {
config: { solar?: string; grid?: string; battery?: string; battery_soc?: string; home?: string; grid_invert?: boolean; battery_invert?: boolean; name?: string; type?: string }
}

export declare const EnergyFlowCard: React.ComponentType<EnergyFlowCardProps>;
