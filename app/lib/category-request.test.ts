import { describe, expect, test } from "bun:test";
import { defaultStringifySearch } from "@tanstack/react-router";
import { rejectInvalidCategoryRequest } from "./category-request";

const categoryId = "Abcdefghijklmnopqrstuvwxyz0123_-";

function categoryUrl(id: string = categoryId, name = "Bien-être et beauté") {
  const url = new URL("https://example.test/categories/bien-etre-et-beaute");
  url.search = defaultStringifySearch({ id, name });
  return url;
}

describe("early category request validation", () => {
  test("preserves valid category links and TanStack's string encoding", () => {
    for (const name of [
      "Bien-être et beauté",
      "Arts graphiques et création artistique",
      "L'art & le bien-être",
      "123",
      "true",
    ]) {
      expect(rejectInvalidCategoryRequest(categoryUrl(categoryId, name))).toBeUndefined();
    }
    expect(rejectInvalidCategoryRequest(categoryUrl("0".repeat(32)))).toBeUndefined();
    expect(rejectInvalidCategoryRequest(categoryUrl("_".repeat(32)))).toBeUndefined();
    const trailingSlash = categoryUrl();
    trailingSlash.pathname += "/";
    expect(rejectInvalidCategoryRequest(trailingSlash)).toBeUndefined();
  });

  test("rejects injection patterns without reflecting the input", async () => {
    const attacks = [
      `${categoryId}' UNION ALL SELECT NULL,'scanner-marker',NULL-- suffix`,
      `${categoryId}\`)))) OR (SELECT COUNT(*) FROM INFORMATION_SCHEMA.PLUGINS)-- -`,
      "' OR 1=1--",
      "A".repeat(10_000),
      `${"A".repeat(31)}\n`,
      "A".repeat(31),
      "A".repeat(33),
    ];
    for (const id of attacks) {
      const response = rejectInvalidCategoryRequest(categoryUrl(id));
      expect(response?.status).toBe(400);
      expect(response?.headers.get("Cache-Control")).toBe("no-store");
      expect(await response?.text()).toBe("Requête de catégorie invalide.");
    }
  });

  test("rejects missing, duplicate, non-string, and oversized search values", () => {
    for (const search of [
      "",
      "?name=Test",
      `?id=${categoryId}`,
      `?id=${categoryId}&id=${categoryId}&name=Test`,
      `?id=${categoryId}&name=Test&name=Other`,
      `?id=${categoryId}&name=123`,
      `?id=${categoryId}&name=${"a".repeat(256)}`,
      `?id=${categoryId}&name=`,
      `?id=${encodeURIComponent(JSON.stringify([categoryId]))}&name=Test`,
    ]) {
      const url = categoryUrl();
      url.search = search;
      expect(rejectInvalidCategoryRequest(url)?.status).toBe(400);
    }
  });

  test("also rejects attacks against case variants and encoded category prefixes", () => {
    for (const prefix of ["CATEGORIES", "%63ategories", "categor%69es"]) {
      const url = categoryUrl("invalid");
      url.pathname = `/${prefix}/bien-etre-et-beaute`;
      expect(rejectInvalidCategoryRequest(url)?.status).toBe(400);
    }
  });

  test("bounds slugs and handles malformed encoding without throwing", () => {
    for (const slug of ["", "a".repeat(256), "%E0%A4%A", "a%2Fb", "a/b"]) {
      const url = categoryUrl();
      url.pathname = `/categories/${slug}`;
      expect(rejectInvalidCategoryRequest(url)?.status).toBe(400);
    }
  });

  test("leaves unrelated routes and extra tracking parameters alone", () => {
    for (const path of [
      "/",
      "/about",
      "/api/auth/sign-in",
      "/admin/dashboard",
      "/categories-other/test",
    ]) {
      expect(
        rejectInvalidCategoryRequest(new URL(`${path}?id=invalid`, "https://example.test")),
      ).toBeUndefined();
    }
    const url = categoryUrl();
    url.searchParams.set("utm_source", "newsletter");
    expect(rejectInvalidCategoryRequest(url)).toBeUndefined();
  });

  test("SSR entry rejects bad requests before delegating to session/database-backed rendering", async () => {
    // Run separately so framework mocks cannot affect the other server-function tests.
    const program = `
      import { expect, mock } from "bun:test";
      import * as server from "@tanstack/react-start/server";
      let renders = 0;
      mock.module("@tanstack/react-start/server", () => ({
        ...server,
        createStartHandler: () => () => () => {
          renders++;
          return new Response("SSR reached");
        },
      }));
      mock.module("@tanstack/react-start/router-manifest", () => ({ getRouterManifest: () => ({}) }));
      mock.module("./app/router.tsx", () => ({ createRouter: () => { throw new Error("Unexpected router initialization"); } }));
      const { default: handler } = await import("./app/ssr.tsx");
      const app = server.createApp();
      app.use(handler);
      const requestHandler = server.toWebHandler(app);
      const invalid = await requestHandler(new Request("https://example.test/categories/test?id=invalid&name=Test"));
      expect(invalid.status).toBe(400);
      expect(renders).toBe(0);
      const valid = await requestHandler(new Request(${JSON.stringify(categoryUrl().href)}));
      expect(valid.status).toBe(200);
      expect(renders).toBe(1);
      const unrelated = await requestHandler(new Request("https://example.test/about"));
      expect(unrelated.status).toBe(200);
      expect(renders).toBe(2);
    `;
    const child = Bun.spawn([process.execPath, "--no-env-file", "-e", program], {
      cwd: process.cwd(),
      env: { PATH: process.env.PATH ?? "" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    expect({ exitCode, stdout, stderr }).toEqual({ exitCode: 0, stdout: "", stderr: "" });
  });
});
