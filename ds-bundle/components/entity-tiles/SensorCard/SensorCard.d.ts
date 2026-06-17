import * as React from 'react';

/**
 * SensorCard — from simui-lovelace@0.2.0.
 */
export interface SensorCardProps {
config: { entity: string; name?: string; icon?: string; color?: "warm" | "cool" | "up" | "down" | "grey"; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}

export declare const SensorCard: React.ComponentType<SensorCardProps>;
