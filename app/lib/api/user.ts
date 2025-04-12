import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { auth } from "~/lib/auth/auth.server";
import { getWebRequest } from "@tanstack/react-start/server";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

export const getUserCompanies = createServerFn({ method: "GET" }).handler(async () => {
	const request = getWebRequest();
	if (!request) return;

	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) throw redirect({ to: "/login" });

	// Get companies
	const companiesQuery = await db
		.select({
			id: companiesTable.id,
			name: companiesTable.name,
			description: companiesTable.description,
			status: companiesTable.status,
			siret: companiesTable.siret,
			logo: companiesTable.logo,
		})
		.from(companiesTable)
		.where(eq(companiesTable.user_id, session.user.id));

	// Then get categories in a separate query
	const categories = await db
		.select({
			company_id: companyCategoriesTable.company_id,
			category_id: categoriesTable.id,
			category_name: categoriesTable.name,
		})
		.from(companyCategoriesTable)
		.leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
		.where(
			inArray(
				companyCategoriesTable.company_id,
				companiesQuery.map((c) => c.id),
			),
		);

	return companiesQuery.map((company) => ({
		...company,
		categories: categories.filter((c) => c.company_id === company.id),
	}));
});

export const userCompaniesQueryOptions = queryOptions({
	queryKey: ["user", "companies"],
	queryFn: () => getUserCompanies(),
});
