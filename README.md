# OneAtlas (oneatlas.dev)

> Comprehensive AI model discovery, benchmark tracking, and provider intelligence platform.

OneAtlas indexes frontier and open-weights artificial intelligence models across research labs (Anthropic, OpenAI, Google DeepMind, Meta, Mistral, DeepSeek, xAI, Qwen) and inference providers. It enables engineers to evaluate pricing, context windows, benchmark performance, and architectural capabilities side-by-side.

---

## Features

- **Model Atlas & Search:** Real-time search across modalities, capabilities, pricing tiers, and context window sizes.
- **Side-by-Side Comparison:** Compare up to 4 models across pricing ($/1M input & output tokens), context limits, and standardized evaluation benchmarks.
- **Benchmark Leaderboards:** Track models ranked by LMSYS Chatbot Arena Elo, MMLU, HumanEval, and GPQA Diamond with open vs. closed weights filtering.
- **Labs & Providers Directory:** Overview of foundation model creators and the API platforms hosting them.
- **Interactive Token Cost Calculator:** Real-time token economics estimation on model detail pages.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) with Nitro server engine
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **Data Layer:** [TanStack Query](https://tanstack.com/query)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with OKLCH dynamic color system
- **Typography:** Space Grotesk (display & sans) and JetBrains Mono (monospace)
- **Testing:** Vitest & React Testing Library

---

## Getting Started

### Prerequisites

- Node.js 20+ (or Bun 1.1+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/oneatlas/oneatlas.git
cd oneatlas

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be running at `http://localhost:3000`.

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Vite dev server with hot module replacement |
| `build` | `npm run build` | Compiles client and Nitro server production bundles |
| `preview` | `npm run preview` | Previews the production build locally |
| `test` | `npm run test` | Runs the Vitest test suite |
| `lint` | `npm run lint` | Runs ESLint checks |
| `format` | `npm run format` | Formats code with Prettier |

---

## Project Structure

```text
src/
├── components/         # Shared UI shell, navigation, and badges
├── hooks/              # Custom React hooks (useMobile, etc.)
├── lib/                # API queries, data catalog, utility functions
├── routes/             # TanStack Router file-based pages
│   ├── __root.tsx      # Root document shell, head metadata, fonts
│   ├── index.tsx       # Model catalog and filters
│   ├── compare.tsx     # Side-by-side comparison table
│   ├── rankings.tsx    # Benchmark leaderboards
│   ├── labs.tsx        # Research labs & provider directory
│   └── models.$id.tsx  # Individual model specifications & calculator
├── server.ts           # SSR server entry point
├── start.ts            # TanStack Start middleware configuration
└── styles.css          # Tailwind CSS v4 design tokens and theme rules
```

---

## License

MIT License. Designed and maintained for the open AI engineering community.
