import { defineCard } from './core/react-card';
import { LightCard, type LightCardConfig } from './cards/LightCard';

// ── Register the cards ────────────────────────────────────────────────────────
defineCard<LightCardConfig>('simui-light-card', LightCard, {
  stubConfig: () => ({ entity: '' }),
  validate: (c) => {
    if (!c.entity) throw new Error('simui-light-card: "entity" is required');
  },
});

// ── Card-picker / HACS metadata ───────────────────────────────────────────────
interface CustomCard {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}
const w = window as unknown as { customCards?: CustomCard[] };
w.customCards = w.customCards ?? [];
w.customCards.push({
  type: 'simui-light-card',
  name: 'SimUI Light',
  description: 'A minimalist light tile — tap to toggle, drag to set brightness.',
  preview: true,
  documentationURL: 'https://github.com/watari-dev/simui-lovelace',
});

// eslint-disable-next-line no-console
console.info(
  '%c SimUI Cards %c 0.1.0 ',
  'background:#fcd663;color:#1d1d1d;font-weight:600;border-radius:4px 0 0 4px;padding:2px 6px',
  'background:#1d1d1d;color:#fcd663;border-radius:0 4px 4px 0;padding:2px 6px',
);
