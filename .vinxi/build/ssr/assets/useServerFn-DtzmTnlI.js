import{isRedirect as e}from"@tanstack/router-core";import{useRouter as c}from"@tanstack/react-router";function u(o){const t=c();return async(...i)=>{try{const r=await o(...i);if(e(r))throw r;return r}catch(r){if(e(r)){const n=t.resolveRedirect({...r,_fromLocation:t.state.location});return t.navigate(n)}throw r}}}export{u};
