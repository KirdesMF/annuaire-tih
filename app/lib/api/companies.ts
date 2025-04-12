import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { AddCompanySchema, type AddCompanyData } from "../schemas/company";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import { redirect } from "@tanstack/react-router";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";

export const getCompanies = createServerFn({
	method: "GET",
}).handler(async () => {
	const companies = await db.select().from(companiesTable);
	return companies;
});

export const companiesQueryOptions = queryOptions({
	queryKey: ["companies"],
	queryFn: () => getCompanies(),
});

export const deleteCompany = createServerFn({ method: "POST" })
	.validator((companyId: string) => companyId as string)
	.handler(async ({ data: companyId }) => {
		try {
			await db.delete(companiesTable).where(eq(companiesTable.id, companyId));
		} catch (error) {
			console.error(error);
		}
	});

export const addCompany = createServerFn({ method: "POST" })
	.validator((data: unknown) => v.parse(AddCompanySchema, data))
	.handler(async ({ data }) => {
		const request = getWebRequest();

		if (!request) return;

		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw redirect({ to: "/login" });
		}

		try {
			const { name, siret, description, categories } = data;

			await db.transaction(async (tx) => {
				const [company] = await tx
					.insert(companiesTable)
					.values({
						name,
						siret,
						user_id: session.user.id,
						created_by: session.user.id,
						description,
					})
					.returning();

				await tx.insert(companyCategoriesTable).values(
					categories.map((category) => ({
						company_id: company.id,
						category_id: category,
					})),
				);
			});
		} catch (error) {
			console.error(error);
		}
	});
