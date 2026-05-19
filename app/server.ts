import type { Register } from "@tanstack/react-router";
import {
  createStartHandler,
  defaultRenderHandler,
  type RequestHandler,
} from "@tanstack/react-start/server";

const fetch = createStartHandler(defaultRenderHandler);

export type ServerEntry = { fetch: RequestHandler<Register> };

export default {
  fetch,
} satisfies ServerEntry;
