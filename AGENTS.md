# Engineering Guidelines — OneAtlas

Welcome to the OneAtlas codebase. This document outlines project conventions, architecture, and coding standards.

## Tech Stack
- **Framework:** TanStack Start (SSR + Nitro)
- **Routing:** TanStack Router (file-based routing in `src/routes`)
- **State & Data Fetching:** TanStack React Query (`@tanstack/react-query`)
- **Styling:** Tailwind CSS v4 (`src/styles.css` using OKLCH color tokens)
- **Language:** TypeScript 5.8+
- **Test Runner:** Vitest with jsdom and React Testing Library

## Code Conventions
- Keep components modular, human-readable, and well-typed. Avoid overly terse or minified single-line code styles.
- Follow standard TanStack Start conventions: use loaders and queryOptions for server functions and data fetching.
- Maintain semantic HTML elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`).
- Preserve dark mode styling compatibility via OKLCH tokens defined in `src/styles.css`.

## Development & Verification
- `npm run dev` to start local development server.
- `npm run build` to create a production bundle.
- `npm test` to run the test suite.
