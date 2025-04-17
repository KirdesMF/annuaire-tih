import { isRedirect } from '@tanstack/router-core';
import { useRouter } from '@tanstack/react-router';
import { jsx } from 'react/jsx-runtime';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function h(r) {
  const t = useRouter();
  return async (...o) => {
    try {
      const e = await r(...o);
      if (isRedirect(e)) throw e;
      return e;
    } catch (e) {
      if (isRedirect(e)) {
        const a = t.resolveRedirect({ ...e, _fromLocation: t.state.location });
        return t.navigate(a);
      }
      throw e;
    }
  };
}
function i(...r) {
  return twMerge(clsx(r));
}
function w({ className: r, ...t }) {
  return jsx("input", { ...t, className: i("border border-gray-300 rounded-sm p-2 h-9 w-full", r) });
}
function x({ className: r, children: t, ...o }) {
  return jsx("label", { ...o, className: i("text-sm font-light text-gray-700", r), children: t });
}

export { h, w, x };
//# sourceMappingURL=label-BcVNeqdH.mjs.map
