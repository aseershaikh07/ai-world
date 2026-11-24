import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { catalogQuery, fmtCtx, fmtPrice } from "@/lib/api";
import { Tag } from "@/components/Shell";
import type { Capability, Model } from "@/lib/data";

interface CompareSearchParams {
  ids?: string;
}

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>): CompareSearchParams => {
    return typeof search["ids"] === "string" ? { ids: search["ids"] } : {};
  },
  head: () => ({
    meta: [
      { title: "Side-by-Side Model Comparison — AI-World" },
      {
        name: "description",
        content:
          "Direct architectural and economic comparison of AI models across token pricing, context size, modalities, and public evaluation benchmarks.",
      },
      { property: "og:title", content: "Side-by-Side Model Comparison — AI-World" },
      {
        property: "og:description",
        content:
          "Direct architectural and economic comparison of AI models across token pricing, context size, modalities, and public evaluation benchmarks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: ModelComparisonView,
});

const ALL_CAPABILITIES: readonly Capability[] = [
  "reasoning",
  "tools",
  "vision",
  "code",
  "json",
  "streaming",
] as const;

const PRESETS = [
  {
    name: "Frontier Reasoning",
    ids: "gpt-5,claude-sonnet-4-5,gemini-2-5-pro,grok-4",
  },
  {
    name: "Open Weights Heavyweights",
    ids: "deepseek-r1,llama-4-maverick,mistral-large-2,qwen3-235b",
  },
  {
    name: "High-Speed / Low Cost",
    ids: "gpt-4o-mini,gemini-2-5-flash,claude-haiku-4-5,deepseek-v3-1",
  },
];

function ModelComparisonView() {
  const { models, labs } = useSuspenseQuery(catalogQuery).data;
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/compare" });

  const selectedModelIds = useMemo(() => {
    const raw = ids ?? "claude-sonnet-4-5,gpt-5,gemini-2-5-pro";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [ids]);

  const selectedModels = useMemo(() => {
    return selectedModelIds
      .map((id) => models.find((m) => m.id === id))
      .filter((m): m is Model => Boolean(m));
  }, [selectedModelIds, models]);

  const updateSelection = (newIds: string[]) => {
    navigate({
      search: {
        ids: newIds.join(","),
      },
    });
  };

  const addModel = (modelId: string) => {
    if (!modelId || selectedModelIds.includes(modelId) || selectedModelIds.length >= 4) return;
    updateSelection([...selectedModelIds, modelId]);
  };

  const removeModel = (modelId: string) => {
    updateSelection(selectedModelIds.filter((id) => id !== modelId));
  };

  const getLabName = (labId: string) => labs.find((l) => l.id === labId)?.name ?? labId;

  // Calculates which model has best value for row
  const getBestMetricValue = (getValue: (m: Model) => number, isLowestBest = false) => {
    const validValues = selectedModels.map(getValue).filter((val) => val > 0);
    if (!validValues.length) return -1;
    return isLowestBest ? Math.min(...validValues) : Math.max(...validValues);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Matrix Evaluator
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="font-mono text-xs text-muted-foreground">Up to 4 models</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Side-by-Side Model Comparison
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Evaluate parameters, token costs per million tokens, context architectures, and public
          benchmark scores.
        </p>
      </div>

      {/* Comparison Presets */}
      <div className="flex flex-wrap items-center gap-2 border-y border-border/60 py-3">
        <span className="font-mono text-xs text-muted-foreground mr-1">Presets:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => updateSelection(preset.ids.split(","))}
            className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground transition cursor-pointer"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Model Selection Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {selectedModels.map((model) => (
          <div
            key={model.id}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-card px-3 py-1.5 font-mono text-xs shadow-sm"
          >
            <span className="font-semibold text-foreground">{model.name}</span>
            <span className="text-[10px] text-muted-foreground">({getLabName(model.labId)})</span>
            <button
              type="button"
              onClick={() => removeModel(model.id)}
              className="ml-1 text-muted-foreground hover:text-destructive cursor-pointer"
              title="Remove model"
            >
              ✕
            </button>
          </div>
        ))}

        {selectedModels.length < 4 && (
          <div className="relative">
            <select
              value=""
              onChange={(e) => addModel(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-1.5 font-mono text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="">+ Add model to compare...</option>
              {models
                .filter((m) => !selectedModelIds.includes(m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({getLabName(m.labId)})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Matrix Table */}
      {selectedModels.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border/80 bg-card/60 shadow-md">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="p-4 text-left font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground w-48">
                  Specification
                </th>
                {selectedModels.map((model) => (
                  <th key={model.id} className="p-4 text-left align-top">
                    <Link
                      to="/models/$id"
                      params={{ id: model.id }}
                      className="font-display text-base font-bold text-foreground hover:text-primary transition-colors block"
                    >
                      {model.name}
                    </Link>
                    <div className="mt-0.5 text-xs font-normal text-muted-foreground">
                      {getLabName(model.labId)}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Tag variant={model.openWeights ? "success" : "default"}>
                        {model.openWeights ? "Open" : "Proprietary"}
                      </Tag>
                      <Tag variant="outline">{model.type}</Tag>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60 font-mono text-xs">
              {/* Release date */}
              <tr>
                <td className="p-4 text-muted-foreground font-sans">Release Date</td>
                {selectedModels.map((model) => (
                  <td key={model.id} className="p-4 text-foreground">
                    {model.release}
                  </td>
                ))}
              </tr>

              {/* Input Price */}
              {(() => {
                const bestInput = getBestMetricValue((m) => m.inputPrice, true);
                return (
                  <tr className="bg-secondary/10">
                    <td className="p-4 text-muted-foreground font-sans font-medium">
                      Input / 1M Tokens
                    </td>
                    {selectedModels.map((model) => {
                      const isBest = model.inputPrice === bestInput && selectedModels.length > 1;
                      return (
                        <td key={model.id} className="p-4">
                          <span
                            className={`font-semibold ${isBest ? "text-primary" : "text-foreground"}`}
                          >
                            {fmtPrice(model.inputPrice)}
                          </span>
                          {isBest && (
                            <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.2 text-[10px] text-primary font-bold">
                              Cheapest
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* Output Price */}
              {(() => {
                const bestOutput = getBestMetricValue((m) => m.outputPrice, true);
                return (
                  <tr>
                    <td className="p-4 text-muted-foreground font-sans font-medium">
                      Output / 1M Tokens
                    </td>
                    {selectedModels.map((model) => {
                      const isBest = model.outputPrice === bestOutput && selectedModels.length > 1;
                      return (
                        <td key={model.id} className="p-4">
                          <span
                            className={`font-semibold ${isBest ? "text-primary" : "text-foreground"}`}
                          >
                            {fmtPrice(model.outputPrice)}
                          </span>
                          {isBest && (
                            <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.2 text-[10px] text-primary font-bold">
                              Cheapest
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* Context Window */}
              {(() => {
                const maxContext = getBestMetricValue((m) => m.context, false);
                return (
                  <tr className="bg-secondary/10">
                    <td className="p-4 text-muted-foreground font-sans font-medium">
                      Context Window
                    </td>
                    {selectedModels.map((model) => {
                      const isMax = model.context === maxContext && selectedModels.length > 1;
                      return (
                        <td key={model.id} className="p-4">
                          <span
                            className={`font-semibold ${isMax ? "text-sky-400" : "text-foreground"}`}
                          >
                            {fmtCtx(model.context)}
                          </span>
                          {isMax && (
                            <span className="ml-2 rounded bg-sky-500/10 px-1.5 py-0.2 text-[10px] text-sky-400 font-bold">
                              Largest
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* Section Header: Benchmarks */}
              <tr className="bg-secondary/40">
                <td
                  colSpan={selectedModels.length + 1}
                  className="px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary"
                >
                  Evaluations & Benchmarks
                </td>
              </tr>

              {/* Arena Elo */}
              {(() => {
                const bestArena = getBestMetricValue((m) => m.benchmarks.arena, false);
                return (
                  <tr>
                    <td className="p-4 text-muted-foreground font-sans">LMSYS Arena Elo</td>
                    {selectedModels.map((model) => {
                      const score = model.benchmarks.arena;
                      const isBest = score === bestArena && selectedModels.length > 1 && score > 0;
                      return (
                        <td key={model.id} className="p-4">
                          {score > 0 ? (
                            <span
                              className={`font-bold ${isBest ? "text-primary" : "text-foreground"}`}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* MMLU */}
              {(() => {
                const bestMmlu = getBestMetricValue((m) => m.benchmarks.mmlu, false);
                return (
                  <tr>
                    <td className="p-4 text-muted-foreground font-sans">
                      MMLU (General Knowledge)
                    </td>
                    {selectedModels.map((model) => {
                      const score = model.benchmarks.mmlu;
                      const isBest = score === bestMmlu && selectedModels.length > 1 && score > 0;
                      return (
                        <td key={model.id} className="p-4">
                          {score > 0 ? (
                            <span className={isBest ? "font-bold text-primary" : "text-foreground"}>
                              {score.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* HumanEval */}
              {(() => {
                const bestHe = getBestMetricValue((m) => m.benchmarks.humaneval, false);
                return (
                  <tr>
                    <td className="p-4 text-muted-foreground font-sans">HumanEval (Coding)</td>
                    {selectedModels.map((model) => {
                      const score = model.benchmarks.humaneval;
                      const isBest = score === bestHe && selectedModels.length > 1 && score > 0;
                      return (
                        <td key={model.id} className="p-4">
                          {score > 0 ? (
                            <span className={isBest ? "font-bold text-primary" : "text-foreground"}>
                              {score.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* GPQA */}
              {(() => {
                const bestGpqa = getBestMetricValue((m) => m.benchmarks.gpqa, false);
                return (
                  <tr>
                    <td className="p-4 text-muted-foreground font-sans">GPQA (Graduate Science)</td>
                    {selectedModels.map((model) => {
                      const score = model.benchmarks.gpqa;
                      const isBest = score === bestGpqa && selectedModels.length > 1 && score > 0;
                      return (
                        <td key={model.id} className="p-4">
                          {score > 0 ? (
                            <span className={isBest ? "font-bold text-primary" : "text-foreground"}>
                              {score.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()}

              {/* Section Header: Capabilities */}
              <tr className="bg-secondary/40">
                <td
                  colSpan={selectedModels.length + 1}
                  className="px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary"
                >
                  Architectural Capabilities
                </td>
              </tr>

              {ALL_CAPABILITIES.map((cap) => (
                <tr key={cap}>
                  <td className="p-4 text-muted-foreground font-sans capitalize">{cap}</td>
                  {selectedModels.map((model) => {
                    const hasCap = model.capabilities.includes(cap);
                    return (
                      <td key={model.id} className="p-4">
                        {hasCap ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-primary">
                            <span className="text-emerald-400">✓</span> Supported
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Providers Available */}
              <tr>
                <td className="p-4 text-muted-foreground font-sans">Inference Endpoints</td>
                {selectedModels.map((model) => (
                  <td key={model.id} className="p-4 text-foreground">
                    {model.providers.length} provider{model.providers.length === 1 ? "" : "s"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Select at least one model to build the comparison matrix.
          </p>
        </div>
      )}
    </div>
  );
}
