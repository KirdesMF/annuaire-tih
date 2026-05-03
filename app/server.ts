import {
  createStartHandler,
  defaultRenderHandler,
  type RequestHandler,
} from "@tanstack/react-start/server";
import type { Register } from "@tanstack/react-router";

const fetch = createStartHandler(defaultRenderHandler);

export type ServerEntry = { fetch: RequestHandler<Register> };

export default {
  fetch,
} satisfies ServerEntry;
