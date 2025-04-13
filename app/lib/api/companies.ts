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
import { uploadImageToCloudinary } from "../cloudinary";

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
	.validator((data: FormData) => {
		return v.parse(AddCompanySchema, {
			name: data.get("name"),
			siret: data.get("siret"),
			description: data.get("description"),
			logo: data.get("logo"),
			categories: data.getAll("categories"),
		});
	})
	.handler(async ({ data }) => {
		const request = getWebRequest();
		if (!request) throw new Error("Request not found");

		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) throw redirect({ to: "/login" });

		const { name, siret, description, categories, logo, images } = data;

		try {
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

				if (logo) {
					const { secure_url, public_id } = await uploadImageToCloudinary({
						file: logo,
						companyId: company.id,
						type: "logo",
					});

					await tx
						.update(companiesTable)
						.set({
							logo: { secureUrl: secure_url, publicId: public_id },
						})
						.where(eq(companiesTable.id, company.id));
				}

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
