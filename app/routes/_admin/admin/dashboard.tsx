import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import type { CompanyStatus } from "~/db/schema/companies";
import { allCompaniesQueryOptions, updateCompanyStatus } from "~/lib/api/companies";
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
	const context = Route.useRouteContext();
	const { data: companies } = useSuspenseQuery(allCompaniesQueryOptions);
	const { data: users } = useSuspenseQuery(allUsersQueryOptions);
	const { mutate } = useMutation({ mutationFn: useServerFn(updateCompanyStatus) });

	function onAction(companyId: string, action: CompanyStatus) {
		mutate(
			{ data: { companyId, status: action } },
			{
				onSuccess: () => {
					toast.success("Company status updated");
					context.queryClient.invalidateQueries({ queryKey: ["companies"] });
				},
			},
		);
	}

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

								<div className="flex gap-2">
									<button
										name="action"
										value="accept"
										type="submit"
										className="bg-green-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={company.status === "active"}
										onClick={() => onAction(company.id, "active")}
									>
										Accepter
									</button>
									<button
										name="action"
										value="reject"
										type="submit"
										className="bg-red-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={company.status === "rejected"}
										onClick={() => onAction(company.id, "rejected")}
									>
										Rejeter
									</button>

									<button
										type="button"
										className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={company.status === "pending"}
										onClick={() => onAction(company.id, "pending")}
									>
										En attente
									</button>
								</div>
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
