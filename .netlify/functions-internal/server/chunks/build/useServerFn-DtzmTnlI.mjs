import { isRedirect } from '@tanstack/router-core';
import { useRouter } from '@tanstack/react-router';

function u(o) {
  const t = useRouter();
  return async (...i) => {
    try {
      const r = await o(...i);
      if (isRedirect(r)) throw r;
      return r;
    } catch (r) {
      if (isRedirect(r)) {
        const n = t.resolveRedirect({ ...r, _fromLocation: t.state.location });
        return t.navigate(n);
      }
      throw r;
    }
  };
}

export { u };
//# sourceMappingURL=useServerFn-DtzmTnlI.mjs.map
