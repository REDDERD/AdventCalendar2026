import { defineConfig } from 'vitest/config';

/** [SEC-1] Rules tests; run inside `firebase emulators:exec` (npm run test:rules). */
export default defineConfig({
  test: {
    include: ['tests/rules/**/*.test.ts'],
    environment: 'node',
    testTimeout: 20000,
    fileParallelism: false,
  },
});
