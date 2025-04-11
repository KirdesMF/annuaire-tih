// app/routes/__root.tsx
import type { ReactNode } from "react";
import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { Outlet, HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { Header } from "~/components/header";
import appCSS from "~/styles/app.css?url";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";
import { Toaster } from "sonner";

const getSession = createServerFn({ method: "GET" }).handler(async () => {
	const request = getWebRequest();

	if (!request) return null;

	const session = await auth.api.getSession({ headers: request.headers });
	return session;
});

const sessionQueryOptions = queryOptions({
	queryKey: ["user", "session"],
	queryFn: ({ signal }) => getSession({ signal }),
});

export type RootRouterContext = {
	queryClient: QueryClient;
	// session: Awaited<ReturnType<typeof getSession>>;
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
		return { session };
	},
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
	return (
		<html lang="fr">
			<head>
				<HeadContent />
			</head>
			<body className="font-sans text-gray-700 isolate">
				<Header />
				{children}
				<Toaster />
				<ReactQueryDevtools buttonPosition="bottom-left" />
				<Scripts />
			</body>
		</html>
	);
}
