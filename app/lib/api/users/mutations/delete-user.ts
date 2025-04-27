import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { auth } from "~/lib/auth/auth.server";
import { deleteCompanyFromCloudinary } from "~/lib/cloudinary";

export const deleteUser = createServerFn({ method: "POST" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const request = getWebRequest();
    if (!request) throw new Error("Request not found");

    // get all companies of the user
    const companies = await getDb()
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.user_id, data.userId));

    // remove all images from cloudinary
    for (const company of companies) {
      await deleteCompanyFromCloudinary(company.slug);
    }

    // delete user
    await auth.api.deleteUser({ body: {}, headers: request.headers });

    throw redirect({ to: "/" });
  });
