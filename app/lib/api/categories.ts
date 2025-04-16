import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { queryOptions } from "@tanstack/react-query";

export const getCategories = createServerFn({
	method: "GET",
}).handler(async () => {
	const categories = await db.select().from(categoriesTable);
	return categories;
});

export const categoriesQueryOptions = queryOptions({
	queryKey: ["categories"],
	queryFn: () => getCategories(),
	staleTime: 1000 * 60 * 60 * 24,
});
