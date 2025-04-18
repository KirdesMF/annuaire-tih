import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";

export const searchCompaniesByTerm = createServerFn({ method: "GET" })
	.validator((term: string) => term)
	.handler(async ({ data: term }) => {
		const searchWords = term
			.split(/\s+/)
			.filter((word) => word.length > 0)
			.map((word) => `${word}:*`); // Add :* for prefix matching

		// Join words with & for AND operation
		const tsQuery = searchWords.join(" & ");

		return await db
			.select()
			.from(companiesTable)
			.where(
				and(
					sql`to_tsvector('french', ${companiesTable.name} || ' ' || ${companiesTable.subdomain} || ' ' || ${companiesTable.description}) @@ to_tsquery('french', ${tsQuery})`,
					eq(companiesTable.status, "active"),
				),
			);
	});

export function setSearchCompaniesByTermQueryOptions(term: string) {
	return queryOptions({
		queryKey: ["search", "companies", term],
		queryFn: ({ signal }) => searchCompaniesByTerm({ data: term, signal }),
		enabled: term.length >= 3,
	});
}
