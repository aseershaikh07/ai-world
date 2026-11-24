import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { catalogQuery, fmtPrice } from "@/lib/api";
import { Chip, Tag } from "@/components/Shell";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "AI Model Evaluation Leaderboards — AI-World" },
      {
        name: "description",
        content: "Empirical rankings and leaderboards for frontier and open-source AI models across LMSYS Chatbot Arena Elo, MMLU, HumanEval, and GPQA.",
      },
      { property: "og:title", content: "AI Model Evaluation Leaderboards — AI-World" },
      {
        property: "og:description",
        content: "Empirical rankings and leaderboards for frontier and open-source AI models across LMSYS Chatbot Arena Elo, MMLU, HumanEval, and GPQA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: BenchmarkRankingsView,
});

interface BenchmarkSpec {
  id: "arena" | "mmlu" | "humaneval" | "gpqa";
  name: string;
  category: string;
  description: string;
  minScale: number;
  unit: string;
}

const BENCHMARKS: readonly BenchmarkSpec[] = [
  {
    id: "arena",
    name: "Chatbot Arena Elo",
    category: "Human Preference",
    description: "Crowdsourced blind A/B evaluation by LMSYS where human users judge competing model outputs.",
    minScale: 1200,
    unit: "Elo",
  },
  {
    id: "mmlu",
    name: "MMLU (Massive Multitask)",
    category: "General Knowledge",
    description: "57 subjects across elementary math, US history, computer science, and law (5-shot evaluation).",
    minScale: 50,
    unit: "%",
  },
  {
    id: "humaneval",
    name: "HumanEval",
    category: "Python Coding",
    description: "Zero-shot Python coding benchmark testing algorithmic comprehension and functional problem solving.",
    minScale: 50,
    unit: "%",
  },
  {
    id: "gpqa",
    name: "GPQA Diamond",
    category: "Graduate Reasoning",
    description: "Challenging Google-proof multiple-choice questions written by domain experts with PhDs.",
    minScale: 30,
    unit: "%",
  },
] as const;

type BenchmarkKey = (typeof BENCHMARKS)[number]["id"];
type WeightFilter = "all" | "open" | "closed";

function BenchmarkRankingsView() {
  const { models, labs } = useSuspenseQuery(catalogQuery).data;
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>("arena");
  const [weightFilter, setWeightFilter] = useState<WeightFilter>("all");

  const activeBenchmarkSpec = useMemo(
    () => BENCHMARKS.find((b) => b.id === selectedBenchmark)!,
    [selectedBenchmark]
  );

  const getLabName = (labId: string) => labs.find((l) => l.id === labId)?.name ?? labId;

  const rankedModels = useMemo(() => {
    return models
      .filter((m) => m.type === "chat" && m.benchmarks[selectedBenchmark] > 0)
      .filter((m) => {
        if (weightFilter === "open") return m.openWeights;
        if (weightFilter === "closed") return !m.openWeights;
        return true;
      })
      .sort((a, b) => b.benchmarks[selectedBenchmark] - a.benchmarks[selectedBenchmark]);
  }, [models, selectedBenchmark, weightFilter]);

  const maxScore = useMemo(
    () => Math.max(...rankedModels.map((m) => m.benchmarks[selectedBenchmark]), 1),
    [rankedModels, selectedBenchmark]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Empirical Evals</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-mono text-xs text-muted-foreground">Standardized Benchmarks</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          AI Model Leaderboards
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Comprehensive benchmark results across coding, general knowledge, reasoning, and human preference metrics.
        </p>
      </div>

      {/* Benchmark Selector Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BENCHMARKS.map((bench) => {
          const isActive = selectedBenchmark === bench.id;
          return (
            <button
              key={bench.id}
              type="button"
              onClick={() => setSelectedBenchmark(bench.id)}
              className={`rounded-xl border p-4 text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                  : "border-border/80 bg-card hover:border-primary/50 hover:bg-secondary/40"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {bench.category}
              </span>
              <div className="mt-1 font-display text-base font-bold text-foreground">
                {bench.name}
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {bench.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">License Filter:</span>
          <Chip active={weightFilter === "all"} onClick={() => setWeightFilter("all")}>
            All Weights
          </Chip>
          <Chip active={weightFilter === "open"} onClick={() => setWeightFilter("open")}>
            Open Weights Only
          </Chip>
          <Chip active={weightFilter === "closed"} onClick={() => setWeightFilter("closed")}>
            Proprietary API Only
          </Chip>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Ranking {rankedModels.length} models for {activeBenchmarkSpec.name}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {rankedModels.map((model, index) => {
          const score = model.benchmarks[selectedBenchmark];
          const rank = index + 1;
          const min = activeBenchmarkSpec.minScale;
          const percentage = Math.max(0, Math.min(100, ((score - min) / (maxScore - min)) * 100));

          // Medal styling
          const isTopOne = rank === 1;
          const isTopTwo = rank === 2;
          const isTopThree = rank === 3;

          return (
            <div
              key={model.id}
              className={`grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_14rem_1fr_6rem_6rem] items-center gap-4 rounded-xl border p-4 transition-colors ${
                isTopOne
                  ? "border-primary/60 bg-gradient-to-r from-primary/10 via-card to-card"
                  : isTopTwo
                  ? "border-sky-500/40 bg-card"
                  : isTopThree
                  ? "border-amber-500/40 bg-card"
                  : "border-border/70 bg-card hover:border-border"
              }`}
            >
              {/* Rank Column */}
              <div className="flex items-center justify-center">
                <span
                  className={`font-mono text-base font-bold ${
                    isTopOne
                      ? "text-primary text-lg"
                      : isTopTwo
                      ? "text-sky-400"
                      : isTopThree
                      ? "text-amber-400"
                      : "text-muted-foreground"
                  }`}
                >
                  #{rank}
                </span>
              </div>

              {/* Model Info */}
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/models/$id"
                    params={{ id: model.id }}
                    className="font-display font-bold text-foreground hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    {model.name}
                  </Link>
                  <Tag variant={model.openWeights ? "success" : "default"}>
                    {model.openWeights ? "Open" : "API"}
                  </Tag>
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  {getLabName(model.labId)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="hidden sm:block">
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTopOne
                        ? "bg-gradient-to-r from-primary via-indigo-400 to-sky-400"
                        : "bg-primary/80"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="font-mono text-base font-bold text-foreground">
                  {selectedBenchmark === "arena" ? score : score.toFixed(1)}
                </span>
                <span className="ml-1 font-mono text-xs text-muted-foreground">
                  {activeBenchmarkSpec.unit}
                </span>
              </div>

              {/* Price / Compare Link */}
              <div className="hidden sm:flex flex-col items-end text-right font-mono text-xs">
                <span className="text-muted-foreground">{fmtPrice(model.inputPrice)} /1M</span>
                <Link
                  to="/compare"
                  search={{ ids: model.id }}
                  className="text-primary hover:underline text-[11px] mt-0.5"
                >
                  + Compare
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
