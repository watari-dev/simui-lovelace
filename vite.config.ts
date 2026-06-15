import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

// Build: a single self-registering ES module (dist/simui-lovelace.js) that HA loads
// as a Lovelace resource — React + all cards bundled inline, no external imports.
// Dev: `vite` serves index.html → src/dev/main-dev.tsx (a mock-hass harness) so the
// cards can be developed + screenshotted without a running Home Assistant.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    // Vite library mode does NOT replace process.env.NODE_ENV in bundled deps (React),
    // so the shipped file would do `process.env.NODE_ENV === 'production'` at load and
    // throw `ReferenceError: process is not defined` in the browser. Force it for builds
    // only (dev keeps Vite's own NODE_ENV handling) — this also selects React's prod
    // path, drops StrictMode's double-render, and shrinks the bundle ~5×.
    ...(command === 'build' ? { 'process.env.NODE_ENV': JSON.stringify('production') } : {}),
    __SIMUI_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: () => 'simui-lovelace.js',
    },
    rollupOptions: { output: { codeSplitting: false } },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
  },
  server: { port: 5174, host: true },
}));
