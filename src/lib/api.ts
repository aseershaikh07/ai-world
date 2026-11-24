import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { labs, models, providers, type Lab, type Model, type Provider } from "./data";

export interface CatalogData {
  models: Model[];
  labs: Lab[];
  providers: Provider[];
}

/**
 * Server function fetching full model catalog
 */
const fetchCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<CatalogData> => ({
  models,
  labs,
  providers,
}));

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => fetchCatalog(),
  staleTime: 60_000,
});

/**
 * Format context token counts into human readable strings (e.g. 1.0M, 128K)
 */
export function fmtCtx(tokens: number): string {
  if (tokens === 0) return "—";
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return `${millions.toFixed(millions >= 10 ? 0 : 1)}M`;
  }
  return `${Math.round(tokens / 1_000)}K`;
}

/**
 * Format token pricing into readable currency string
 */
export function fmtPrice(price: number): string {
  if (price === 0) return "Free";
  if (price < 0.01) {
    return `$${price.toFixed(3)}`;
  }
  return `$${price.toFixed(2)}`;
}
