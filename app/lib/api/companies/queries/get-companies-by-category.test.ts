import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";

const categoryId = "Abcdefghijklmnopqrstuvwxyz0123_-";
const rows = [
  {
    companies: { id: "company-1", status: "active" },
    company_categories: { company_id: "company-1", category_id: categoryId },
  },
];
const where = mock((_predicate: SQL | undefined) => ({ orderBy: async () => rows }));
const getDb = mock(() => ({
  select: () => ({ from: () => ({ innerJoin: () => ({ where }) }) }),
}));
const setResponseStatus = mock((_status: number) => {});

mock.module("~/db", () => ({ getDb }));
mock.module("@tanstack/react-start/server", () => ({ setResponseStatus }));
mock.module("@tanstack/react-start", () => ({
  createServerFn: () => ({
    handler: (handler: () => Promise<unknown>) => handler,
    validator: (validate: (data: unknown) => unknown) => ({
      handler:
        (handler: (context: { data: unknown }) => Promise<unknown>) =>
        async (options: { data: unknown }) =>
          handler({ data: validate(options.data) }),
    }),
  }),
}));

const { getCompaniesByCategory } = await import("./get-companies-by-category");
// Exercise malformed HTTP payloads that a typed TypeScript caller cannot construct.
const invoke = (data: unknown) => Reflect.apply(getCompaniesByCategory, undefined, [{ data }]);

beforeEach(() => {
  getDb.mockClear();
  where.mockClear();
  setResponseStatus.mockClear();
});

describe("public category server function", () => {
  test("rejects malformed IDs before accessing the database", async () => {
    for (const invalidId of [
      null,
      123,
      "",
      "a".repeat(31),
      "a".repeat(33),
      `${categoryId}' UNION SELECT NULL--`,
      `${"a".repeat(31)}\n`,
    ]) {
      await expect(invoke({ categoryId: invalidId, status: "active" })).rejects.toThrow(
        "Requête de catégorie invalide",
      );
    }
    expect(getDb).not.toHaveBeenCalled();
    expect(setResponseStatus).toHaveBeenCalledWith(400);
  });

  test("rejects attempts to request pending or rejected companies before database access", async () => {
    for (const status of ["pending", "rejected", "unknown", null]) {
      await expect(invoke({ categoryId, status })).rejects.toThrow("Requête de catégorie invalide");
    }
    expect(getDb).not.toHaveBeenCalled();
    expect(setResponseStatus).toHaveBeenCalledWith(400);
  });

  test("preserves valid requests and parameterizes the ID with a fixed public status", async () => {
    const result = await getCompaniesByCategory({ data: { categoryId, status: "active" } });
    expect(result.companies.map((company) => company.id)).toEqual(["company-1"]);
    expect(result.categories.map((category) => category.category_id)).toEqual([categoryId]);
    const predicate = where.mock.calls[0][0];
    if (!predicate) throw new Error("Missing category predicate");
    const query = new PgDialect().sqlToQuery(predicate);
    expect(query.params).toEqual([categoryId, "active"]);
    expect(query.sql).not.toContain(categoryId);
    expect(setResponseStatus).not.toHaveBeenCalled();
  });
});
