import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// OneAtlas Vite & TanStack Start build configuration
export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});
