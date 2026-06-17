import { LockCard } from 'simui-lovelace';

export const Locked = () => (
  <LockCard config={{ type: 'simui-lock-card', entity: 'lock.front' }} />
);

export const Unlocked = () => (
  <LockCard config={{ type: 'simui-lock-card', entity: 'lock.back' }} />
);

export const Jammed = () => (
  <LockCard config={{ type: 'simui-lock-card', entity: 'lock.side' }} />
);
