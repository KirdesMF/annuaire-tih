import { createFileRoute, Link } from "@tanstack/react-router";
import { setCompanyQueryOptions } from "~/lib/api/companies";
import * as v from "valibot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CopyButton } from "~/components/copy-button";
import { CompanyLogo } from "~/components/company-logo";
import { Separator } from "radix-ui";

const WORK_MODES = {
	remote: "À distance",
	hybrid: "Hybride",
	onsite: "Sur site",
	not_specified: "Non spécifié",
} as const;

const SearchSchema = v.object({
	id: v.string(),
});

export const Route = createFileRoute("/_public/entreprises/$name")({
	component: RouteComponent,
	validateSearch: SearchSchema,
	loaderDeps: ({ search: { id } }) => ({ id }),
	loader: async ({ context, deps: { id } }) => {
		const company = await context.queryClient.ensureQueryData(setCompanyQueryOptions(id));
		const session = context.session;

		return {
			company,
			session,
		};
	},
});

function RouteComponent() {
	const search = Route.useSearch();
	const { data, isPending } = useSuspenseQuery(setCompanyQueryOptions(search.id));
	const { session } = Route.useLoaderData();

	if (isPending) return <div>Loading...</div>;
	if (!data) return <div>Company not found</div>;

	return (
		<main className="w-[min(964px,100%)] mx-auto px-4 py-8">
			<CompanyLogo company={data} size="lg" />

			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">{data.name}</h1>
				<CopyButton>{data.siret}</CopyButton>
			</div>

			{session?.user?.id === data.user_id && (
				<div className="flex items-center justify-between gap-4">
					<Link
						to={"/compte/entreprises/$id/edit"}
						params={{ id: data.id }}
						className="bg-gray-100 px-2 py-1 rounded-sm text-sm"
					>
						Edit
					</Link>
				</div>
			)}

			<Separator.Root className="my-6 h-px bg-gray-300" />

			<p className="text-sm text-gray-500">{data.business_owner}</p>

			<p className="text-sm text-gray-500">{data.subdomain}</p>
			<p className="text-sm text-gray-500">{data.description}</p>
			<p className="text-sm text-gray-500">{data.email}</p>
			<p className="text-sm text-gray-500">{data.phone}</p>
			<p className="text-sm text-gray-500">{data.website}</p>
			<p className="text-sm text-gray-500">{data.service_area}</p>
			<p className="text-sm text-gray-500">{WORK_MODES[data.work_mode ?? "not_specified"]}</p>
			<p className="text-sm text-gray-500">RQTH: {data.rqth ? "Oui" : "Non"}</p>
			<p className="text-sm text-gray-500">{data.phone}</p>

			<ul className="flex flex-wrap gap-2">
				{data.categories?.map((category) => (
					<li key={category} className="bg-gray-100 px-2 py-1 rounded-sm text-sm">
						{category}
					</li>
				))}
			</ul>

			<ul>
				{data.gallery?.map((image) => (
					<li key={image.publicId}>
						<img
							src={image.secureUrl}
							alt={data.name}
							className="size-16 aspect-square rounded-sm"
						/>
					</li>
				))}
			</ul>
		</main>
	);
}
