import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { catalogQuery, fmtCtx, fmtPrice } from "@/lib/api";
import { Chip, Tag } from "@/components/Shell";
import type { Capability, Model } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-World — Frontier & Open AI Model Directory" },
      {
        name: "description",
        content: "Search, filter, and compare 18+ leading AI models by research lab, inference provider, capabilities, context length, and pricing.",
      },
      { property: "og:title", content: "AI-World — Frontier & Open AI Model Directory" },
      {
        property: "og:description",
        content: "Search, filter, and compare 18+ leading AI models by research lab, inference provider, capabilities, context length, and pricing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: ModelCatalogIndex,
});

const CAPABILITIES: Capability[] = ["reasoning", "tools", "vision", "code", "json", "streaming"];
const MODEL_TYPES = ["chat", "embedding", "image", "audio"] as const;

type SortOption = "release" | "inputPrice" | "context" | "name" | "arena";

function toggleItem<T>(collection: T[], item: T): T[] {
  return collection.includes(item)
    ? collection.filter((existing) => existing !== item)
    : [...collection, item];
}

function ModelCatalogIndex() {
  const { models, labs, providers } = useSuspenseQuery(catalogQuery).data;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<Capability[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [openWeightsFilter, setOpenWeightsFilter] = useState<"all" | "open" | "closed">("all");
  const [sortBy, setSortBy] = useState<SortOption>("release");

  const getLabName = (labId: string) => labs.find((lab) => lab.id === labId)?.name ?? labId;

  // Stats calculation
  const totalOpenWeights = useMemo(() => models.filter((m) => m.openWeights).length, [models]);
  const maxContext = useMemo(() => Math.max(...models.map((m) => m.context)), [models]);

  const filteredModels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return models
      .filter((model) => {
        if (!query) return true;
        const matchesName = model.name.toLowerCase().includes(query);
        const matchesLab = getLabName(model.labId).toLowerCase().includes(query);
        const matchesDesc = model.description.toLowerCase().includes(query);
        return matchesName || matchesLab || matchesDesc;
      })
      .filter((model) => {
        if (!selectedLabs.length) return true;
        return selectedLabs.includes(model.labId);
      })
      .filter((model) => {
        if (!selectedProviders.length) return true;
        return model.providers.some((provider) => selectedProviders.includes(provider));
      })
      .filter((model) => {
        if (!selectedCapabilities.length) return true;
        return selectedCapabilities.every((cap) => model.capabilities.includes(cap));
      })
      .filter((model) => {
        if (!selectedTypes.length) return true;
        return selectedTypes.includes(model.type);
      })
      .filter((model) => {
        if (openWeightsFilter === "open") return model.openWeights;
        if (openWeightsFilter === "closed") return !model.openWeights;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "release":
            return b.release.localeCompare(a.release);
          case "name":
            return a.name.localeCompare(b.name);
          case "context":
            return b.context - a.context;
          case "inputPrice":
            return a.inputPrice - b.inputPrice;
          case "arena":
            return (b.benchmarks.arena || 0) - (a.benchmarks.arena || 0);
          default:
            return 0;
        }
      });
  }, [
    models,
    searchQuery,
    selectedLabs,
    selectedProviders,
    selectedCapabilities,
    selectedTypes,
    openWeightsFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLabs([]);
    setSelectedProviders([]);
    setSelectedCapabilities([]);
    setSelectedTypes([]);
    setOpenWeightsFilter("all");
    setSortBy("release");
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedLabs.length > 0 ||
    selectedProviders.length > 0 ||
    selectedCapabilities.length > 0 ||
    selectedTypes.length > 0 ||
    openWeightsFilter !== "all";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card/80 to-card/30 p-6 sm:p-10 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI-World Database
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Updated Q1 2026
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
          Every AI Foundation Model. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-300 to-sky-300">
            One Single Map.
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Index of <strong>{models.length} foundation models</strong> across <strong>{labs.length} frontier research labs</strong>.
          Compare input/output token pricing, context architecture, and third-party benchmark evaluations.
        </p>

        {/* Quick Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
          <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">Models Indexed</span>
            <div className="mt-1 font-display text-xl font-bold text-foreground">{models.length}</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">Research Labs</span>
            <div className="mt-1 font-display text-xl font-bold text-foreground">{labs.length}</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">Open Weights</span>
            <div className="mt-1 font-display text-xl font-bold text-emerald-400">{totalOpenWeights} models</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur">
            <span className="font-mono text-[11px] text-muted-foreground uppercase">Max Context</span>
            <div className="mt-1 font-display text-xl font-bold text-sky-400">{fmtCtx(maxContext)} tokens</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model name (e.g. Claude 3.7, DeepSeek R1), lab, or capability..."
            className="w-full rounded-xl border border-input/80 bg-background/90 py-3.5 pl-11 pr-24 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-10 flex items-center pr-2 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              clear
            </button>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <kbd className="hidden sm:inline-block rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
          </div>
        </div>
      </section>

      {/* Main Grid View */}
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar Filters */}
        <aside className="rounded-2xl border border-border bg-card/85 p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                </svg>
              </span>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">
                Filter Catalog
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg bg-primary/10 px-2.5 py-1 font-sans text-xs font-bold text-primary hover:bg-primary/20 transition cursor-pointer"
              >
                Reset all
              </button>
            )}
          </div>

          <FilterGroup title="Weight License">
            <Chip active={openWeightsFilter === "all"} onClick={() => setOpenWeightsFilter("all")}>
              All Models
            </Chip>
            <Chip active={openWeightsFilter === "open"} onClick={() => setOpenWeightsFilter("open")}>
              Open Weights
            </Chip>
            <Chip active={openWeightsFilter === "closed"} onClick={() => setOpenWeightsFilter("closed")}>
              Proprietary API
            </Chip>
          </FilterGroup>

          <FilterGroup title="Research Lab">
            {labs.map((lab) => {
              const count = models.filter((m) => m.labId === lab.id).length;
              return (
                <Chip
                  key={lab.id}
                  active={selectedLabs.includes(lab.id)}
                  onClick={() => setSelectedLabs(toggleItem(selectedLabs, lab.id))}
                  count={count}
                >
                  {lab.name}
                </Chip>
              );
            })}
          </FilterGroup>

          <FilterGroup title="Core Capabilities">
            {CAPABILITIES.map((cap) => (
              <Chip
                key={cap}
                active={selectedCapabilities.includes(cap)}
                onClick={() => setSelectedCapabilities(toggleItem(selectedCapabilities, cap))}
              >
                {cap}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="Model Modality">
            {MODEL_TYPES.map((type) => (
              <Chip
                key={type}
                active={selectedTypes.includes(type)}
                onClick={() => setSelectedTypes(toggleItem(selectedTypes, type))}
              >
                {type}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="Inference Host">
            {providers.map((p) => (
              <Chip
                key={p.id}
                active={selectedProviders.includes(p.id)}
                onClick={() => setSelectedProviders(toggleItem(selectedProviders, p.id))}
              >
                {p.name}
              </Chip>
            ))}
          </FilterGroup>
        </aside>

        {/* Model Results */}
        <div>
          {/* Header Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-2.5">
            <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <span>Showing <strong>{filteredModels.length}</strong> of {models.length} models</span>
              {hasActiveFilters && (
                <span className="rounded bg-primary/10 px-2.5 py-0.5 text-primary text-xs font-semibold">
                  Filtered
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-sans text-sm font-medium text-muted-foreground">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-input bg-card px-3 py-1.5 font-sans text-sm font-medium text-foreground outline-none focus:border-primary cursor-pointer"
              >
                <option value="release">Newest Release</option>
                <option value="arena">Arena Elo Leader</option>
                <option value="inputPrice">Cheapest Input ($/1M)</option>
                <option value="context">Largest Context Window</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredModels.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  labName={getLabName(model.labId)}
                  onCompare={() => navigate({ to: "/compare", search: { ids: model.id } })}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">No matching models found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try loosening your filters or searching for different capabilities.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex items-center rounded-lg bg-primary px-3 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h4 className="font-sans text-xs sm:text-[13px] font-bold uppercase tracking-wider text-foreground/90 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

interface ModelCardProps {
  model: Model;
  labName: string;
  onCompare: () => void;
}

function ModelCard({ model, labName, onCompare }: ModelCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 sm:p-6 transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5">
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm sm:text-[15px] text-primary font-bold">{labName}</span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="font-sans text-xs sm:text-sm text-muted-foreground font-medium">{model.release}</span>
            </div>
            <Link to="/models/$id" params={{ id: model.id }} className="block mt-1.5">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                {model.name}
              </h3>
            </Link>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Tag variant={model.openWeights ? "success" : "default"}>
              {model.openWeights ? "Open Weights" : "Proprietary"}
            </Tag>
            {model.benchmarks.arena > 0 && (
              <span className="font-mono text-xs sm:text-sm font-bold text-sky-400">
                {model.benchmarks.arena} Elo
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-3.5 line-clamp-2 text-sm sm:text-[14.5px] text-muted-foreground leading-relaxed">
          {model.description}
        </p>

        {/* Capabilities Pills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {model.capabilities.slice(0, 4).map((cap) => (
            <Tag key={cap} variant="outline">
              {cap}
            </Tag>
          ))}
          {model.capabilities.length > 4 && (
            <span className="font-sans text-xs font-semibold text-muted-foreground self-center px-1">
              +{model.capabilities.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Pricing and Context Footer */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <dl className="grid grid-cols-3 gap-3">
          <div>
            <dt className="font-sans text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input / 1M</dt>
            <dd className="mt-1 font-mono text-sm sm:text-base font-bold text-foreground">{fmtPrice(model.inputPrice)}</dd>
          </div>
          <div>
            <dt className="font-sans text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output / 1M</dt>
            <dd className="mt-1 font-mono text-sm sm:text-base font-bold text-foreground">{fmtPrice(model.outputPrice)}</dd>
          </div>
          <div>
            <dt className="font-sans text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Context</dt>
            <dd className="mt-1 font-mono text-sm sm:text-base font-bold text-foreground">{fmtCtx(model.context)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between pt-2">
          <Link
            to="/models/$id"
            params={{ id: model.id }}
            className="font-sans text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>Inspect specs</span>
            <span aria-hidden="true">→</span>
          </Link>

          <button
            type="button"
            onClick={onCompare}
            className="rounded-lg border border-border bg-secondary/80 px-3 py-1.5 font-sans text-xs sm:text-sm font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground cursor-pointer transition"
          >
            + Compare
          </button>
        </div>
      </div>
    </div>
  );
}
