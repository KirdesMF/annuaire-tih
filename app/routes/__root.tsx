// app/routes/__root.tsx
import { useEffect, type ReactNode } from "react";
import { queryOptions, type QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  redirect,
  ScriptOnce,
  useLayoutEffect,
} from "@tanstack/react-router";
import { Header } from "~/components/header";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import { Toaster } from "sonner";
import appCSS from "~/styles/app.css?url";
import { useThemeStore } from "~/stores/theme.store";

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
  const { user, queryClient } = Route.useRouteContext();
  const { setTheme } = useThemeStore();

  useLayoutEffect(() => {
    setTheme(localStorage.getItem("theme") || "system");
  }, [setTheme]);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ScriptOnce>
          {`document.documentElement.dataset.theme = localStorage.theme === 'dark' || (!('theme' in localStorage) && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'`}
        </ScriptOnce>
      </head>

      <body className="font-sans text-gray-700 isolate dark:bg-gray-900 dark:text-gray-100">
        <Header user={user} queryClient={queryClient} />
        {children}
        <Toaster />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
