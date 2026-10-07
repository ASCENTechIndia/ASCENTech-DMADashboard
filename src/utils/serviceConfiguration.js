export const ACTIVE_SERVICES_STORAGE_KEY = "dma_active_services_v1";

export function normalizeServiceName(name) {
  return typeof name === "string" ? name.trim().toLowerCase() : "";
}

export function readServiceConfiguration() {
  const stored = window.localStorage.getItem(ACTIVE_SERVICES_STORAGE_KEY);
  if (stored === null) return {};

  const configuration = JSON.parse(stored);
  if (
    configuration === null ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    throw new Error("Saved service configuration has an invalid format.");
  }

  return configuration;
}

export function saveServiceConfiguration(configuration) {
  window.localStorage.setItem(
    ACTIVE_SERVICES_STORAGE_KEY,
    JSON.stringify(configuration),
  );
}

export function filterConfiguredServices(services, corporationId) {
  if (corporationId === "ALL" || corporationId === null || corporationId === undefined) {
    return services;
  }

  const configuration = readServiceConfiguration();
  const activeServices = configuration[String(corporationId)];

  // If no services configured or empty array, return all services instead of hiding everything
  if (!Array.isArray(activeServices) || activeServices.length === 0) {
    return services;
  }

  const activeServiceNames = new Set(activeServices);
  const filtered = services.filter((service) =>
    activeServiceNames.has(normalizeServiceName(service.title)),
  );

  // Fallback: If filtering resulted in 0 cards, don't leave the dashboard blank
  return filtered.length > 0 ? filtered : services;
}
