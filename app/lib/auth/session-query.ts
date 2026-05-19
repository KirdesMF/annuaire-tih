import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth.server";

const getSession = createServerFn().handler(async () => {
  return auth().api.getSession({ headers: getRequestHeaders() });
});

export const sessionQueryOptions = queryOptions({
  queryKey: ["user", "session"],
  queryFn: ({ signal }) => getSession({ signal }),
});
