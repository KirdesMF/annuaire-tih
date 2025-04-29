// app/routes/__root.tsx
import { type QueryClient, queryOptions } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "~/components/providers/theme-provider";
import { SiteHeader } from "~/components/site-header";
import { auth } from "~/lib/auth/auth.server";
import { getThemeServerFn } from "~/lib/theme";
import appCSS from "~/styles/app.css?url";

const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  if (!request) return null;
  return await auth.api.getSession({ headers: request.headers });
});

const sessionQueryOptions = queryOptions({
  queryKey: ["user", "session"],
  queryFn: ({ signal }) => getSession({ signal }),
});

export type RootRouterContext = { queryClient: QueryClient };

export const Route = createRootRouteWithContext<RootRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Annuaire TIH" },
    ],
    links: [{ rel: "stylesheet", href: appCSS }],
  }),
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.fetchQuery(sessionQueryOptions);
    return { user: session?.user };
  },
  loader: () => getThemeServerFn(),
  component: RootComponent,
});

function RootComponent() {
  const theme = Route.useLoaderData();

  return (
    <ThemeProvider theme={theme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = Route.useRouteContext();
  const { theme } = useTheme();

  return (
    <html lang="fr" data-theme={theme}>
      <head>
        <HeadContent />
      </head>

      <body className="font-sans isolate bg-background text-foreground">
        <SiteHeader user={user} />
        {children}
        <Toaster />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
