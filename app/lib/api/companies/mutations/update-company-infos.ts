import { createServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { UpdateCompanyInfosSchema } from "~/lib/validator/company.schema";

export const updateCompanyInfos = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const decodedFormData = decode(data, {
      arrays: ["categories"],
      booleans: ["rqth"],
    });
    return v.parse(UpdateCompanyInfosSchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    const { categories, companyId, ...companyData } = data;

    try {
      await getDb().transaction(async (tx) => {
        await tx.update(companiesTable).set(companyData).where(eq(companiesTable.id, companyId));

        if (categories.length > 0) {
          await tx
            .delete(companyCategoriesTable)
            .where(eq(companyCategoriesTable.company_id, companyId));

          await tx.insert(companyCategoriesTable).values(
            categories.map((category) => ({
              company_id: companyId,
              category_id: category,
            })),
          );
        }
      });
    } catch (error) {
      console.error("Failed to update company info:", error);
      throw new Error("Failed to update company information");
    }
  });
