import * as React from 'react';

/**
 * ClimateCard — from simui-lovelace@0.2.0.
 */
export interface ClimateCardProps {
config: { entity: string; name?: string; icon?: string; tap_action?: { action: "more-info" | "toggle" | "navigate" | "url" | "perform-action" | "none"; entity?: string; navigation_path?: string; url_path?: string; perform_action?: string; data?: Record<string, unknown> }; type?: string }
}

export declare const ClimateCard: React.ComponentType<ClimateCardProps>;
