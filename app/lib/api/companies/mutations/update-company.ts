import { createServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable, type CompanyStatus } from "~/db/schema/companies";
import { UpdateCompanyInfosSchema, UpdateCompanyMediaSchema } from "~/lib/validator/company.schema";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";

export const updateCompanyStatus = createServerFn({ method: "POST" })
	.validator((data: { companyId: string; status: CompanyStatus }) => data)
	.handler(async ({ data: { companyId, status } }) => {
		try {
			await db.update(companiesTable).set({ status }).where(eq(companiesTable.id, companyId));
		} catch (error) {
			console.error(error);
		}
	});

export const updateCompanyInfos = createServerFn({ method: "POST" })
	.validator((data: FormData) => {
		const decodedFormData = decode(data, {
			arrays: ["categories"],
			booleans: ["rqth"],
		});
		return v.parse(UpdateCompanyInfosSchema, decodedFormData);
	})
	.handler(async ({ data }) => {
		try {
			const { categories, ...rest } = data;
			await db.transaction(async (tx) => {
				const [company] = await tx
					.update(companiesTable)
					.set(rest)
					.where(eq(companiesTable.id, data.companyId))
					.returning();

				// Update categories
				if (categories.length > 0) {
					await tx
						.delete(companyCategoriesTable)
						.where(eq(companyCategoriesTable.company_id, company.id));
					await tx.insert(companyCategoriesTable).values(
						categories.map((category) => ({
							company_id: company.id,
							category_id: category,
						})),
					);
				}
			});
		} catch (error) {
			console.error(error);
		}
	});

export const updateCompanyMedia = createServerFn({ method: "POST" })
	.validator((data: FormData) => {
		const decodedFormData = decode(data, {
			files: ["logo", "gallery"],
		});
		return v.parse(UpdateCompanyMediaSchema, decodedFormData);
	})
	.handler(async ({ data }) => {
		try {
			const { logo, gallery } = data;
		} catch (error) {
			console.error(error);
		}
	});
