import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  badge?: string;
}

const NAVIGATION: readonly NavItem[] = [
  { to: "/", label: "Models" },
  { to: "/compare", label: "Compare" },
  { to: "/rankings", label: "Leaderboards" },
  { to: "/labs", label: "Labs & Providers" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Main Header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="group flex items-center transition hover:opacity-95">
              <img
                src="/logo.png"
                alt="one atlas — AI Model Index"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="relative rounded-md px-3 py-1.5 font-sans text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-secondary/40"
                  activeProps={{
                    className: "bg-secondary text-foreground font-semibold shadow-sm border border-border/60",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/compare"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5" />
                <path d="M4 20L21 3" />
                <path d="M21 16v5h-5" />
                <path d="M15 15l6 6" />
                <path d="M4 4l5 5" />
              </svg>
              Quick Compare
            </Link>

            <a
              href="https://github.com/aseershaikh07/one-atlas"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Subnavigation */}
        <div className="flex md:hidden border-t border-border/50 px-4 py-2 overflow-x-auto gap-2 bg-card/40">
          {NAVIGATION.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="shrink-0 rounded-md px-3 py-1 font-mono text-xs text-muted-foreground hover:text-foreground"
              activeProps={{
                className: "bg-secondary text-primary font-medium border border-border/70",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Engineering Footer */}
      <footer className="mt-auto border-t border-border/80 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo-icon.png" alt="OneAtlas Logo" className="h-6 w-6 object-contain" />
                <span className="font-display font-bold text-foreground">OneAtlas Intelligence</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Independent platform indexing frontier foundation models, pricing economics, context architectures, and public benchmark evaluations.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Directory</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition">All Models Index</Link></li>
                <li><Link to="/compare" className="hover:text-primary transition">Side-by-Side Comparison</Link></li>
                <li><Link to="/rankings" className="hover:text-primary transition">Benchmark Leaderboard</Link></li>
                <li><Link to="/labs" className="hover:text-primary transition">Research Labs Directory</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Benchmarks</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><Link to="/rankings" className="hover:text-primary transition">LMSYS Chatbot Arena Elo</Link></li>
                <li><Link to="/rankings" className="hover:text-primary transition">MMLU (Knowledge)</Link></li>
                <li><Link to="/rankings" className="hover:text-primary transition">HumanEval (Code Generation)</Link></li>
                <li><Link to="/rankings" className="hover:text-primary transition">GPQA (Graduate Reasoning)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Transparency</h4>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Data refreshed regularly from official provider API documentation, technical papers, and open evaluation leaderboards.
              </p>
              <div className="mt-3 font-mono text-[11px] text-primary">
                Built for AI Engineers & Researchers
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <p>© {new Date().getFullYear()} OneAtlas Project. All model trademarks belong to their respective labs.</p>
            <p className="flex items-center gap-2">
              <span>TypeScript</span>
              <span>•</span>
              <span>TanStack Start</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Chip({
  children,
  active,
  onClick,
  count,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-all duration-150 cursor-pointer ${
        active
          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm"
          : "border-border/80 bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className={`rounded-full px-1.5 py-0.2 text-[10px] ${
            active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function Tag({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "accent" | "outline";
}) {
  const variantStyles = {
    default: "border-border/80 bg-secondary/70 text-secondary-foreground",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    accent: "border-primary/30 bg-primary/10 text-primary font-medium",
    outline: "border-border bg-transparent text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[11px] tracking-tight ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
