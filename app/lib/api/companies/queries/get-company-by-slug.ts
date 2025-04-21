import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";

export const getCompanyBySlug = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		try {
			const company = await db
				.select()
				.from(companiesTable)
				.where(eq(companiesTable.slug, slug))
				.then((res) => res[0]);

			const categories = await db
				.select()
				.from(companyCategoriesTable)
				.leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
				.where(eq(companyCategoriesTable.company_id, company.id));

			return {
				...company,
				categories: categories.map((c) => c.categories),
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	});

export const companyBySlugQuery = (slug: string) =>
	queryOptions({
		queryKey: ["company", slug],
		queryFn: () => getCompanyBySlug({ data: slug }),
		staleTime: 1000 * 60 * 60 * 24,
		refetchOnWindowFocus: false,
	});
