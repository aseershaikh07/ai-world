import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { catalogQuery, fmtCtx, fmtPrice } from "@/lib/api";
import { Tag } from "@/components/Shell";

export const Route = createFileRoute("/models/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(catalogQuery);
    const model = data.models.find((item) => item.id === params.id);
    if (!model) throw notFound();
    return { name: model.name, description: model.description };
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.name ?? "Model Specifications"} — AI-World`;
    const desc = loaderData?.description ?? "Foundation model specifications, pricing, and benchmarks.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="rounded-xl border border-border p-12 text-center">
      <h2 className="font-display text-xl font-bold">Model Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground">The model you requested is not currently indexed.</p>
      <Link to="/" className="mt-4 inline-block font-mono text-xs text-primary hover:underline">
        ← Return to model directory
      </Link>
    </div>
  ),
  component: ModelSpecificationView,
});

function ModelSpecificationView() {
  const { id } = Route.useParams();
  const { models, labs, providers } = useSuspenseQuery(catalogQuery).data;

  const model = models.find((x) => x.id === id);
  if (!model) return null;

  const lab = labs.find((l) => l.id === model.labId);
  const benchmarks = model.benchmarks;

  // Interactive Token Economics Calculator State
  const [calcInputTokens, setCalcInputTokens] = useState<number>(50_000);
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(10_000);

  const estimatedCost =
    (calcInputTokens / 1_000_000) * model.inputPrice +
    (calcOutputTokens / 1_000_000) * model.outputPrice;

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors">
          AI-World
        </Link>
        <span>/</span>
        <Link to="/" className="hover:text-primary transition-colors">
          Models
        </Link>
        <span>/</span>
        <span className="text-foreground">{model.name}</span>
      </div>

      {/* Model Hero Header */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card/80 to-card/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-primary">{lab?.name}</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="font-mono text-xs text-muted-foreground">Released {model.release}</span>
              <Tag variant={model.openWeights ? "success" : "default"}>
                {model.openWeights ? "Open Weights" : "Proprietary"}
              </Tag>
            </div>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              {model.name}
            </h1>

            <p className="mt-3 max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              {model.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/compare"
              search={{ ids: model.id }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition hover:opacity-90 shadow-sm"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5" />
                <path d="M4 20L21 3" />
                <path d="M21 16v5h-5" />
                <path d="M15 15l6 6" />
                <path d="M4 4l5 5" />
              </svg>
              Compare with Rivals
            </Link>
          </div>
        </div>

        {/* 4-Stat Specification Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Input Cost / 1M Tokens" value={fmtPrice(model.inputPrice)} />
          <StatCard label="Output Cost / 1M Tokens" value={fmtPrice(model.outputPrice)} />
          <StatCard label="Context Limit" value={fmtCtx(model.context)} />
          <StatCard
            label="Arena Elo Rating"
            value={benchmarks.arena ? `${benchmarks.arena}` : "N/A"}
          />
        </div>
      </div>

      {/* Main Grid: Specs & Calculator */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Token Pricing Calculator */}
        <section className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Token Economics Calculator
            </h2>
            <span className="font-mono text-xs text-muted-foreground">Estimator</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Calculate invocation expenses for your projected workload volume.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">Prompt Input Tokens</span>
                <span className="text-foreground font-semibold">{calcInputTokens.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min={1_000}
                max={200_000}
                step={1_000}
                value={calcInputTokens}
                onChange={(e) => setCalcInputTokens(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">Completion Output Tokens</span>
                <span className="text-foreground font-semibold">{calcOutputTokens.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min={500}
                max={50_000}
                step={500}
                value={calcOutputTokens}
                onChange={(e) => setCalcOutputTokens(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>

            <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-4">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                Estimated Cost per Request
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-extrabold text-primary">
                  ${estimatedCost.toFixed(4)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  (${(estimatedCost * 1_000).toFixed(2)} per 1,000 requests)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmark Evaluation Card */}
        <section className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Evaluation Benchmarks
            </h2>
            <span className="font-mono text-xs text-muted-foreground">Standardized</span>
          </div>

          {benchmarks.arena ? (
            <div className="mt-5 space-y-4">
              <BenchmarkProgressBar label="MMLU (Knowledge)" value={benchmarks.mmlu} />
              <BenchmarkProgressBar label="HumanEval (Python)" value={benchmarks.humaneval} />
              <BenchmarkProgressBar label="GPQA Diamond (Reasoning)" value={benchmarks.gpqa} />
              <div className="mt-3 border-t border-border/60 pt-3 flex items-center justify-between font-mono text-xs">
                <span className="text-muted-foreground">LMSYS Chatbot Arena</span>
                <span className="font-bold text-foreground">{benchmarks.arena} Elo</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-sm text-muted-foreground">
              Standardized language benchmarks are not applicable for this model modality.
            </div>
          )}
        </section>

        {/* Architecture & Modalities */}
        <section className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Modalities & Architecture
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <span className="font-mono text-xs text-muted-foreground block mb-1.5">Supported Modalities:</span>
              <div className="flex flex-wrap gap-1.5">
                {model.modalities.map((mod) => (
                  <Tag key={mod} variant="default">
                    {mod}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="font-mono text-xs text-muted-foreground block mb-1.5">Core Capabilities:</span>
              <div className="flex flex-wrap gap-1.5">
                {model.capabilities.length > 0 ? (
                  model.capabilities.map((cap) => (
                    <Tag key={cap} variant="accent">
                      {cap}
                    </Tag>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Basic inference</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Available Providers */}
        <section className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Inference Providers
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Platforms hosting direct API access for this model:
          </p>
          <ul className="mt-4 divide-y divide-border/60 text-xs">
            {model.providers.map((providerId) => {
              const provider = providers.find((p) => p.id === providerId);
              return (
                <li key={providerId} className="flex items-center justify-between py-2.5">
                  <span className="font-medium text-foreground">{provider?.name ?? providerId}</span>
                  {provider?.url && (
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Endpoint</span>
                      <span>↗</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/50 p-4">
      <span className="font-mono text-[11px] text-muted-foreground uppercase">{label}</span>
      <div className="mt-1 font-display text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function BenchmarkProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value.toFixed(1)}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
