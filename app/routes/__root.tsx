// app/routes/__root.tsx
import type { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { Header } from "~/components/header";
import appCSS from "~/styles/app.css?url";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
			<body className="font-sans text-gray-700">
				<Header />
				{children}
				<Scripts />
				<ReactQueryDevtools buttonPosition="bottom-left" />{" "}
			</body>
		</html>
	);
}
