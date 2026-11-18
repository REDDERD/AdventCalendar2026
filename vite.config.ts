import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
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
  plugins: [react(), inkWatch()],
  define: appDefines,
  server: { host: true },
});
