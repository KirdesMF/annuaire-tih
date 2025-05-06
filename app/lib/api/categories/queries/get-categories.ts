import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { categoriesTable } from "~/db/schema/categories";

export const getCategories = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const categories = await db.select().from(categoriesTable);
    return categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: () => getCategories(),
  staleTime: 1000 * 60 * 60 * 24,
});
