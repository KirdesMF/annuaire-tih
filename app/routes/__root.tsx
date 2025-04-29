import { type QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
// app/routes/__root.tsx
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SiteHeader } from "~/components/site-header";
import { auth } from "~/lib/auth/auth.server";
import { colorSchemeQuery } from "~/lib/cookies/color-scheme.cookie";
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

export type RootRouterContext = {
  queryClient: QueryClient;
};

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
  loader: async ({ context }) => {
    const colorScheme = await context.queryClient.fetchQuery(colorSchemeQuery);
    return { colorScheme };
  },
  notFoundComponent: () => <div>Not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = Route.useRouteContext();
  const { data: colorScheme } = useSuspenseQuery(colorSchemeQuery);

  return (
    <html
      lang="fr"
      data-theme={colorScheme}
      style={{ colorScheme: colorScheme === "system" ? undefined : colorScheme }}
    >
      <head>
        <HeadContent />
      </head>

      <body className="font-sans isolate dark:bg-gray-950 dark:text-white">
        <SiteHeader user={user} />
        {children}
        <Toaster />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
