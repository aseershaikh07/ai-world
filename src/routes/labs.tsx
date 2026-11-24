import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { catalogQuery } from "@/lib/api";
import { Chip, Tag } from "@/components/Shell";

export const Route = createFileRoute("/labs")({
  head: () => ({
    meta: [
      { title: "AI Research Labs & Inference Providers — AI-World" },
      {
        name: "description",
        content: "Explore the foundation research laboratories, creators, and cloud inference platforms hosting modern AI models.",
      },
      { property: "og:title", content: "AI Research Labs & Inference Providers — AI-World" },
      {
        property: "og:description",
        content: "Explore the foundation research laboratories, creators, and cloud inference platforms hosting modern AI models.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: LabsAndProvidersDirectory,
});

function LabsAndProvidersDirectory() {
  const { models, labs, providers } = useSuspenseQuery(catalogQuery).data;
  const [activeTab, setActiveTab] = useState<"labs" | "providers">("labs");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Ecosystem</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-mono text-xs text-muted-foreground">Foundations & Infrastructure</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Labs & Inference Providers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Directory of research organizations producing frontier weights and the cloud API providers serving them to production.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60 pb-3">
        <Chip active={activeTab === "labs"} onClick={() => setActiveTab("labs")}>
          Research Labs ({labs.length})
        </Chip>
        <Chip active={activeTab === "providers"} onClick={() => setActiveTab("providers")}>
          API & Cloud Providers ({providers.length})
        </Chip>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeTab === "labs"
          ? labs.map((lab) => {
              const labModels = models
                .filter((m) => m.labId === lab.id)
                .sort((a, b) => b.release.localeCompare(a.release));

              return (
                <section
                  key={lab.id}
                  className="rounded-xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {lab.name}
                        </h2>
                        <div className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                          <span>{lab.country}</span>
                          <span>•</span>
                          <span>Founded {lab.founded}</span>
                        </div>
                      </div>

                      <Tag variant="accent">{labModels.length} models</Tag>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {lab.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Indexed Models
                    </span>
                    <ul className="space-y-2">
                      {labModels.map((model) => (
                        <li key={model.id} className="flex items-center justify-between text-xs">
                          <Link
                            to="/models/$id"
                            params={{ id: model.id }}
                            className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{model.name}</span>
                            <Tag variant={model.openWeights ? "success" : "default"}>
                              {model.openWeights ? "Open" : "Proprietary"}
                            </Tag>
                          </Link>
                          <span className="font-mono text-muted-foreground">{model.release}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })
          : providers.map((provider) => {
              const hostedModels = models.filter((m) => m.providers.includes(provider.id));

              return (
                <section
                  key={provider.id}
                  className="rounded-xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {provider.name}
                        </h2>
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                        >
                          <span>{provider.url.replace(/^https?:\/\//, "")}</span>
                          <span>↗</span>
                        </a>
                      </div>

                      <Tag variant="accent">{hostedModels.length} models</Tag>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Inference endpoint serving production APIs for foundation models.
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Supported Models
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hostedModels.map((model) => (
                        <Link key={model.id} to="/models/$id" params={{ id: model.id }}>
                          <Tag variant="outline">{model.name}</Tag>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
      </div>
    </div>
  );
}
