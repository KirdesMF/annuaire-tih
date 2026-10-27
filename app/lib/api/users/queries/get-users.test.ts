import { beforeEach, describe, expect, mock, test } from "bun:test";

let request: Request | undefined;
let session: { user: { id: string; role: string } } | null;
const accounts = [
  {
    id: "account-1",
    name: "Élodie",
    email: "elodie@example.test",
    role: "user",
    banReason: "private",
  },
];
const getSession = mock(async () => session);
const setResponseStatus = mock((_status: number) => {});
const setResponseHeader = mock((_name: string, _value: string) => {});
const selectAccounts = mock((columns: Record<string, unknown>) => ({
  from: () => ({
    orderBy: async () =>
      accounts.map((account) =>
        Object.fromEntries(
          Object.keys(columns).map((key) => [key, account[key as keyof typeof account]]),
        ),
      ),
  }),
}));
const getDb = mock(() => ({ select: selectAccounts }));

// Invoke the server handler directly with disposable auth/database fixtures, not live services.
mock.module("@tanstack/react-start", () => ({
  createServerFn: () => ({ handler: (handler: () => Promise<unknown>) => handler }),
}));
mock.module("@tanstack/react-start/server", () => ({
  getWebRequest: () => request,
  setResponseStatus,
  setResponseHeader,
}));
mock.module("~/lib/auth/auth.server", () => ({ auth: () => ({ api: { getSession } }) }));
mock.module("~/db", () => ({ getDb }));

const { getUsers } = await import("./get-users");

beforeEach(() => {
  request = new Request("https://example.test/admin/dashboard", {
    headers: { Cookie: "test-session" },
  });
  session = null;
  getSession.mockClear();
  getDb.mockClear();
  selectAccounts.mockClear();
  setResponseStatus.mockClear();
  setResponseHeader.mockClear();
});

describe("admin account directory authorization", () => {
  test("rejects anonymous requests before listing accounts", async () => {
    await expect(getUsers()).rejects.toThrow("Authentification requise");
    expect(setResponseStatus).toHaveBeenCalledWith(401);
    expect(getDb).not.toHaveBeenCalled();
    expect(setResponseHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
  });

  test("rejects calls outside an HTTP request", async () => {
    request = undefined;
    await expect(getUsers()).rejects.toThrow("Authentification requise");
    expect(getSession).not.toHaveBeenCalled();
    expect(getDb).not.toHaveBeenCalled();
  });

  test("rejects regular users before listing accounts", async () => {
    session = { user: { id: "user-1", role: "user" } };
    await expect(getUsers()).rejects.toThrow("Accès réservé aux administrateurs");
    expect(setResponseStatus).toHaveBeenCalledWith(403);
    expect(getDb).not.toHaveBeenCalled();
  });

  for (const role of ["admin", "superadmin"]) {
    test(`allows ${role} with a fresh session check and minimal field selection`, async () => {
      session = { user: { id: "admin-1", role } };
      expect(await getUsers()).toEqual([
        { id: "account-1", name: "Élodie", email: "elodie@example.test", role: "user" },
      ]);
      expect(getSession).toHaveBeenCalledWith({
        headers: request?.headers,
        query: { disableCookieCache: true },
      });
      expect(Object.keys(selectAccounts.mock.calls[0][0])).toEqual(["id", "name", "email", "role"]);
      expect(setResponseHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
    });
  }

  test("does not list accounts if session verification fails", async () => {
    getSession.mockRejectedValueOnce(new Error("Session verification failed"));
    await expect(getUsers()).rejects.toThrow("Session verification failed");
    expect(getDb).not.toHaveBeenCalled();
  });
});
