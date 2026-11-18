import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { compileAll, INK_DIR, writeOutputs } from './scripts/ink-compiler.ts';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')) as { version: string };

/** content:compile in watch mode for the dev server (Section 15.3). */
function inkWatch(): Plugin {
  const run = () => {
    const result = compileAll();
    for (const e of result.errors) console.error(`[ink] ${e}`);
    writeOutputs(result);
  };
  return {
    name: 'ink-watch',
    apply: 'serve',
    buildStart: run,
    configureServer(server) {
      server.watcher.add(INK_DIR);
      server.watcher.on('change', (file) => {
        if (file.endsWith('.ink')) run();
      });
    },
  };
}

export const appDefines = {
  __APP_VERSION__: JSON.stringify(pkg.version),
  __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
};

export default defineConfig({
  // GitHub Pages project site: https://redderd.github.io/AdventCalendar2026/
  base: '/AdventCalendar2026/',
  plugins: [
    react(),
    inkWatch(),
    // [UI-5] Home-screen app: standalone, portrait, midnight-blue splash, Advent clock icon.
    // The service worker precaches the build; Firestore keeps its own offline cache (no runtime caching here).
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-180.png'],
      manifest: {
        name: 'Hogwarts und die Adventsuhr',
        short_name: 'Adventsuhr',
        lang: 'de',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b1530',
        theme_color: '#0b1530',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,woff2,json}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  define: appDefines,
  server: { host: true },
});
