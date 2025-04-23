import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Separator } from "radix-ui";
import { PlusIcon } from "~/components/icons/plus";
import { userCompaniesQuery } from "~/lib/api/users/queries/get-user-companies";

export const Route = createFileRoute("/_protected/compte")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(userCompaniesQuery(context.user.id));
	},
});

function RouteComponent() {
	const context = Route.useRouteContext();
	const companies = useSuspenseQuery(userCompaniesQuery(context.user.id));

	return (
		<div className="flex min-h-[calc(100svh-45px)]">
			<aside className="sticky inset-y-0 border-e border-gray-200 px-1 py-2">
				<nav>
					<ul className="flex flex-col gap-2">
						<li className="flex flex-col gap-1">
							<Link
								to="/compte/entreprises"
								className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none text-gray-500 hover:text-gray-900 transition-colors"
								activeProps={{ className: "data-[status=active]:text-blue-700" }}
							>
								Mes entreprises
							</Link>

							<ul className="ms-4">
								<li>
									<Link
										to="/compte/entreprises/create"
										className="text-xs font-light flex items-center gap-1 px-4 py-1.5 text-gray-500 hover:text-gray-900 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
										disabled={companies.data && companies.data.length >= 3}
										activeProps={{
											className:
												"data-[status=active]:text-blue-700 data-[status=active]:font-medium",
										}}
									>
										<PlusIcon className="size-3" />
										Référencer
									</Link>
								</li>
							</ul>
						</li>

						<Separator.Root
							orientation="horizontal"
							decorative
							className="h-px bg-gray-200 -mx-1"
						/>

						<li>
							<Link
								to="/compte/preferences"
								className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none text-gray-500 hover:text-gray-900 transition-colors"
								activeProps={{ className: "data-[status=active]:text-blue-700" }}
							>
								Preférences
							</Link>
						</li>

						<Separator.Root
							orientation="horizontal"
							decorative
							className="h-px bg-gray-200 -mx-1"
						/>
					</ul>
				</nav>
			</aside>

			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
