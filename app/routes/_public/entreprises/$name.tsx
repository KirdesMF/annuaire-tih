import { createFileRoute, Link } from "@tanstack/react-router";
import { setCompanyQueryOptions } from "~/lib/api/companies";
import * as v from "valibot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CopyButton } from "~/components/copy-button";
import { CompanyLogo } from "~/components/company-logo";
import { FacebookIcon } from "~/components/icons/facebook";
import { InstagramIcon } from "~/components/icons/instagram";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { CalendlyIcon } from "~/components/icons/calendly";
import type { Entries } from "~/utils/types";
import { Separator } from "radix-ui";
import { EmailIcon } from "~/components/icons/email";
import { PhoneIcon } from "~/components/icons/phone";
import { GlobeIcon } from "~/components/icons/globe";
import { LinkChainIcon } from "~/components/icons/link-chain";

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
	pendingComponent: () => <div>Loading...</div>,
	errorComponent: () => <div>Error</div>,
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

const SOCIAL_MEDIA_ICONS = {
	facebook: <FacebookIcon className="size-5" />,
	instagram: <InstagramIcon className="size-5" />,
	linkedin: <LinkedinIcon className="size-5" />,
	calendly: <CalendlyIcon className="size-5" />,
} as const;

function RouteComponent() {
	const search = Route.useSearch();
	const { data } = useSuspenseQuery(setCompanyQueryOptions(search.id));
	const { session } = Route.useLoaderData();

	if (!data) return <div>Company not found</div>;

	const isSocialMediaEmpty = Object.values(data.social_media).every((value) => value === "");

	return (
		<main className="px-4 py-8 grid gap-4">
			<div className="container flex justify-between gap-4 border border-gray-300 p-6 rounded-sm">
				<div className="flex flex-col gap-2">
					<CompanyLogo company={data} size="lg" />
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold">{data.name}</h1>
						<CopyButton>{data.siret}</CopyButton>
						{session?.user?.id === data.user_id && (
							<Link
								to={"/compte/entreprises/$id/edit"}
								params={{ id: data.id }}
								className="border border-gray-300 px-2 py-1 rounded-sm text-xs h-min"
							>
								Edit
							</Link>
						)}
					</div>
					<ul className="flex flex-wrap gap-2">
						{data.categories?.map((category) => (
							<li key={category} className="bg-gray-100 px-2 py-1 rounded-sm text-xs">
								{category}
							</li>
						))}
					</ul>
				</div>

				<div className="flex gap-2">
					<button type="button" className="bg-gray-100 p-2 rounded-sm cursor-pointer h-min">
						<LinkChainIcon className="size-5" />
					</button>
				</div>
			</div>

			<div className="container flex gap-2">
				<div className="flex-1 flex flex-col justify-center gap-4 border border-gray-300 p-6 rounded-sm">
					<div className="flex flex-col gap-2">
						{data.email ? (
							<div className="flex items-center gap-2">
								<EmailIcon className="size-5" />
								<p className="text-xs text-gray-500">{data.email}</p>
							</div>
						) : null}

						{data.phone ? (
							<div className="flex items-center gap-2">
								<PhoneIcon className="size-5" />
								<p className="text-xs text-gray-500">{data.phone}</p>
							</div>
						) : null}

						{data.website ? (
							<div className="flex items-center gap-2">
								<GlobeIcon className="size-5" />
								<a
									href={data.website}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-gray-500"
								>
									{data.website}
								</a>
							</div>
						) : null}
					</div>

					{!isSocialMediaEmpty ? (
						<ul className="flex gap-2">
							{(Object.entries(data.social_media || {}) as Entries<typeof data.social_media>).map(
								([key, value]) => (
									<li key={key}>
										<a href={value} target="_blank" rel="noopener noreferrer">
											{SOCIAL_MEDIA_ICONS[key]}
										</a>
									</li>
								),
							)}
						</ul>
					) : null}
				</div>

				<div className="flex-1 border border-gray-300 p-6 rounded-sm flex flex-col gap-2">
					<p className="text-sm text-gray-500">
						<span className="font-bold">Entrepreneur:</span> {data.business_owner}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">Zone géographique:</span> {data.service_area}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">Mode de travail:</span>{" "}
						{WORK_MODES[data.work_mode ?? "not_specified"]}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">RQTH:</span> {data.rqth ? "Oui" : "Non"}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">Sous domaine:</span> {data.subdomain}
					</p>
				</div>
			</div>

			<div className="container border border-gray-300 p-6 rounded-sm grid gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-bold">Description</h2>
					<p className="text-sm text-gray-500 text-pretty">{data.description}</p>
				</div>

				<Separator.Root className="h-px bg-gray-300 my-4" />

				<ul className="flex flex-wrap gap-2">
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
			</div>
		</main>
	);
}
