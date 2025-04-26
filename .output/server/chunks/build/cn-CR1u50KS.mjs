import{aM as t,aN as r,p as o,aO as n}from"../nitro/nitro.mjs";function d(t){const r=o();return async(...o)=>{try{const r=await t(...o);if(n(r))throw r;return r}catch(t){if(n(t)){const o=r.resolveRedirect({...t,_fromLocation:r.state.location});return r.navigate(o)}throw t}}}function l(...o){return t(r(o))}export{d,l};
//# sourceMappingURL=cn-CR1u50KS.mjs.map
