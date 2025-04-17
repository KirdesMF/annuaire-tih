import { jsxs, jsx } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { a as ce } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import '@tanstack/router-core';
import 'tiny-invariant';
import '@tanstack/start-server-core';
import '@tanstack/start-client-core';
import '@tanstack/react-query';
import 'better-auth/react';
import 'better-auth/client/plugins';
import 'radix-ui';
import 'react';
import 'drizzle-orm/pg-core';
import 'sonner';
import '@tanstack/react-query-devtools';
import 'valibot';
import 'drizzle-orm';
import 'decode-formdata';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';

const L = function() {
  const t = ce.useParams().id;
  return jsxs("div", { children: [jsxs("h1", { children: ["Hello ", t, "!"] }), jsx(Link, { to: "/categories", children: "Back to categories" })] });
};

export { L as component };
//# sourceMappingURL=_id-BXU5h-k8.mjs.map
