import { QueryClient } from "@tanstack/react-query";
// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      scrollRestoration: true,
      defaultGcTime: 0,
      defaultStaleTime: Number.POSITIVE_INFINITY,
    }),
    queryClient,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
