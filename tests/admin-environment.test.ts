import { afterEach, describe, expect, test, vi } from "vitest";
import {
  isDevelopmentAdminEnvironment,
  isProductionEnvironment,
  shouldShowAdminDashboardLink,
} from "../lib/admin-environment";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin environment helpers", () => {
  test("enables direct admin access and dashboard links in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(isDevelopmentAdminEnvironment()).toBe(true);
    expect(isProductionEnvironment()).toBe(false);
    expect(shouldShowAdminDashboardLink()).toBe(true);
  });

  test("hides dashboard links in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(isDevelopmentAdminEnvironment()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
    expect(shouldShowAdminDashboardLink()).toBe(false);
  });
});
