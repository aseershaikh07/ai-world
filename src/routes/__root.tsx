import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Shell } from "../components/Shell";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border border-border/80 bg-card/60 p-8 shadow-2xl backdrop-blur-md max-w-md w-full">
        <span className="font-mono text-xs uppercase tracking-widest text-primary">Error 404</span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The requested route does not exist in the AI-World model index or has been relocated.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90"
          >
            Return to Index
          </Link>
          <Link
            to="/compare"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary/80 px-4 py-2 font-mono text-xs font-medium text-foreground transition hover:bg-secondary"
          >
            Compare Models
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border border-destructive/30 bg-card/80 p-8 shadow-2xl backdrop-blur-md max-w-lg w-full text-left">
        <div className="flex items-center gap-2 text-destructive">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            Application Runtime Error
          </span>
        </div>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          An unexpected error occurred during rendering
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong while loading this view."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Retry Action
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-4 py-2 font-mono text-xs font-medium text-foreground transition hover:bg-secondary/70"
          >
            Reload Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI-World — AI Model Discovery & Intelligence" },
      {
        name: "description",
        content:
          "Discover, compare and benchmark frontier and open-weights AI models across leading research labs and inference providers.",
      },
      { property: "og:title", content: "AI-World — AI Model Discovery & Intelligence" },
      {
        property: "og:description",
        content:
          "Discover, compare and benchmark frontier and open-weights AI models across leading research labs and inference providers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@aiworld" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=20261121" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=20261121" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=20261121" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=20261121" },
      { rel: "shortcut icon", href: "/favicon.ico?v=20261121" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Shell>
        <Outlet />
      </Shell>
    </QueryClientProvider>
  );
}
