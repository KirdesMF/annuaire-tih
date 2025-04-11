import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";
import { parseSetCookieHeader } from "better-auth/cookies";

/**
 * @description This plugin is used to handle cookies for server action with better-auth.
 * @see https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/integrations/next-js.ts
 * @see https://www.better-auth.com/docs/integrations/next#server-action-cookies
 */
export function tanstackStartCookies() {
  return {
    id: "tanstack-start-cookies",
    hooks: {
      after: [
        {
          matcher: () => true,
          handler: createAuthMiddleware(async (context) => {
            // skip if router context
            if ("_flag" in context && context._flag === "router") return;

            const { responseHeaders } = context.context;
            if (!(responseHeaders instanceof Headers)) return;

            const setCookieHeader = responseHeaders.get("set-cookie");
            if (!setCookieHeader) return;

            const cookies = parseSetCookieHeader(setCookieHeader);
            const { setCookie } = await import("@tanstack/react-start/server");

            for (const [name, data] of cookies) {
              if (!name) return;

              try {
                setCookie(name, decodeURIComponent(data.value), {
                  sameSite: data.samesite,
                  secure: data.secure,
                  maxAge: data.maxage,
                  httpOnly: data.httponly,
                  path: data.path,
                  domain: data.domain,
                  // partitioned: data.partitioned,
                });
              } catch (error) {
                console.error(`Error setting cookie ${name}: ${error}`);
              }
            }
            return;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
}
