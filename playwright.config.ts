import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  expect: { timeout: 15000 },
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  webServer: [
    {
      command: "node tests/fixtures/upstream.mjs",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: false,
    },
    {
      command:
        process.env.PLAYWRIGHT_SERVER_COMMAND ||
        "npm run dev -- --host 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100",
      env: {
        NUXT_API_BASE: "http://127.0.0.1:3101",
        HOST: "127.0.0.1",
        PORT: "3100",
      },
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
