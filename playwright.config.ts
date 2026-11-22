import { defineConfig, devices } from '@playwright/test';

const BASE = 'http://localhost:5173/AdventCalendar2026/';

/** Section 17.2: mobile viewport against the Firebase emulator. */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    ...devices['iPhone 13'],
    browserName: 'chromium',
    // The boot film shows a still picture and gets out of the way quickly.
    reducedMotion: 'reduce',
    baseURL: BASE,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'firebase emulators:start --only auth,firestore --project demo-hogwarts',
      url: 'http://127.0.0.1:8080',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npx vite --mode emulator --port 5173 --strictPort',
      url: BASE,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
