import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { allCompaniesQueryOptions } from "~/lib/api/companies";
import { allUsersQueryOptions } from "~/lib/api/user";

export const Route = createFileRoute("/_admin/admin/dashboard")({
	component: RouteComponent,
	pendingComponent: () => <div>Loading...</div>,
	loader: async ({ context }) => {
		const [companies, users] = await Promise.all([
			context.queryClient.prefetchQuery(allCompaniesQueryOptions),
			context.queryClient.prefetchQuery(allUsersQueryOptions),
		]);

		return { companies, users };
	},
});

function RouteComponent() {
	const { data: companies } = useSuspenseQuery(allCompaniesQueryOptions);
	const { data: users } = useSuspenseQuery(allUsersQueryOptions);
	return (
		<main>
			<div className="container px-4 py-6 grid gap-6">
				<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

				<div className="grid gap-4">
					<h2 className="text-lg font-bold">Companies</h2>
					<div className="grid gap-4">
						{companies?.map((company) => (
							<div
								key={company.id}
								className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
							>
								<h2 className="text-lg font-bold">{company.name}</h2>
								<p>{company.status}</p>
							</div>
						))}
					</div>
				</div>

				<div className="grid gap-4">
					<h2 className="text-lg font-bold">Users</h2>
					<div className="grid gap-4">
						{users?.map((user) => (
							<div
								key={user.id}
								className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
							>
								<p>{user.name}</p>
								<p>{user.email}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
