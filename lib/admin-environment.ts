export function isDevelopmentAdminEnvironment() {
  return process.env.NODE_ENV === "development";
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

export function shouldShowAdminDashboardLink() {
  return isDevelopmentAdminEnvironment();
}
