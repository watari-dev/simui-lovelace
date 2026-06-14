import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build: a single self-registering ES module (dist/simui-lovelace.js) that HA loads
// as a Lovelace resource — React + all cards bundled inline, no external imports.
// Dev: `vite` serves index.html → src/dev/main-dev.tsx (a mock-hass harness) so the
// cards can be developed + screenshotted without a running Home Assistant.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: () => 'simui-lovelace.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
  server: { port: 5174, host: true },
});
