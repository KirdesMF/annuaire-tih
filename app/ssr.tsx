// app/ssr.tsx
import {
  createStartHandler,
  defaultStreamHandler,
  eventHandler,
  getRequestURL,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { rejectInvalidCategoryRequest } from "./lib/category-request";
import { createRouter } from "./router";

const handleSsr = createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);

export default eventHandler((event) => {
  // Reject scanner inputs before constructing the router, reading sessions, or querying the DB.
  const rejection = rejectInvalidCategoryRequest(getRequestURL(event));
  return rejection ?? handleSsr(event);
});
