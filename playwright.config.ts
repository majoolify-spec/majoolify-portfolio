import { defineConfig } from "@playwright/test";

const PORT = 3007;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: BASE_URL,
    headless: true,
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
    url: `${BASE_URL}/en`,
    reuseExistingServer: true,
    timeout: 120000,
    env: {
      ...process.env,
      NEXTAUTH_URL: BASE_URL,
      AUTH_SECRET: "playwright-secret",
      ADMIN_BYPASS_TOKEN: "local-admin-token",
      ADMIN_PUBLISH_DRY_RUN: "1",
    },
  },
});
