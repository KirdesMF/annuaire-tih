import{r as i,D as tt,E as Ct,j as t,F as Et,G as Pt,H as G,I as rt,P as L,J as se,K as nt,M as at,N as Rt,Q as kt,T as It,U as St,V as _t,W as At,X as $t,Y as Ot,Z as Dt,_ as _e,$ as he,a0 as ve,a1 as ye,a2 as le,a3 as zt,a4 as be,a5 as Mt,a6 as O,a7 as Te,a8 as Ve,a9 as qe,aa as Ft,ab as Lt,ac as Tt,ad as D,ae as ue,af as Vt,ag as I,ah as z,ai as de,aj as te,ak as _,al as T,am as Ke,an as Be,ao as Ge,ap as We,aq as qt,ar as Kt,as as Bt,at as we,au as Gt,av as Wt,aw as Xe,a as Xt,u as Ht,ax as Ut,e as Zt,L as Jt,ay as He,t as je}from"./client-CB7jT4PR.js";import{L as E,I as F}from"./label-zriPn8DN.js";import{R as Qt,P as Yt,O as er,b as tr,c as rr}from"./close-ibM140p9.js";import{E as nr,P as ar,G as sr,F as lr,I as or,C as ir}from"./globe-Dg21mcrR.js";import{P as Ne}from"./plus-CE-jRqin.js";import{u as cr}from"./useServerFn-B1ugu9gG.js";import{R as re}from"./index-DGV-PNAM.js";import"./cn-B3Z9kGEY.js";var Ae="Popover",[st,vn]=Pt(Ae,[tt]),oe=tt(),[ur,K]=st(Ae),lt=e=>{const{__scopePopover:n,children:r,open:a,defaultOpen:s,onOpenChange:o,modal:c=!1}=e,d=oe(n),f=i.useRef(null),[u,m]=i.useState(!1),[x=!1,h]=Ct({prop:a,defaultProp:s,onChange:o});return t.jsx(Et,{...d,children:t.jsx(ur,{scope:n,contentId:G(),triggerRef:f,open:x,onOpenChange:h,onOpenToggle:i.useCallback(()=>h(w=>!w),[h]),hasCustomAnchor:u,onCustomAnchorAdd:i.useCallback(()=>m(!0),[]),onCustomAnchorRemove:i.useCallback(()=>m(!1),[]),modal:c,children:r})})};lt.displayName=Ae;var ot="PopoverAnchor",dr=i.forwardRef((e,n)=>{const{__scopePopover:r,...a}=e,s=K(ot,r),o=oe(r),{onCustomAnchorAdd:c,onCustomAnchorRemove:d}=s;return i.useEffect(()=>(c(),()=>d()),[c,d]),t.jsx(nt,{...o,...a,ref:n})});dr.displayName=ot;var it="PopoverTrigger",ct=i.forwardRef((e,n)=>{const{__scopePopover:r,...a}=e,s=K(it,r),o=oe(r),c=rt(n,s.triggerRef),d=t.jsx(L.button,{type:"button","aria-haspopup":"dialog","aria-expanded":s.open,"aria-controls":s.contentId,"data-state":ft(s.open),...a,ref:c,onClick:se(e.onClick,s.onOpenToggle)});return s.hasCustomAnchor?d:t.jsx(nt,{asChild:!0,...o,children:d})});ct.displayName=it;var $e="PopoverPortal",[pr,mr]=st($e,{forceMount:void 0}),ut=e=>{const{__scopePopover:n,forceMount:r,children:a,container:s}=e,o=K($e,n);return t.jsx(pr,{scope:n,forceMount:r,children:t.jsx(at,{present:r||o.open,children:t.jsx(Rt,{asChild:!0,container:s,children:a})})})};ut.displayName=$e;var Q="PopoverContent",dt=i.forwardRef((e,n)=>{const r=mr(Q,e.__scopePopover),{forceMount:a=r.forceMount,...s}=e,o=K(Q,e.__scopePopover);return t.jsx(at,{present:a||o.open,children:o.modal?t.jsx(xr,{...s,ref:n}):t.jsx(gr,{...s,ref:n})})});dt.displayName=Q;var fr=St("PopoverContent.RemoveScroll"),xr=i.forwardRef((e,n)=>{const r=K(Q,e.__scopePopover),a=i.useRef(null),s=rt(n,a),o=i.useRef(!1);return i.useEffect(()=>{const c=a.current;if(c)return kt(c)},[]),t.jsx(It,{as:fr,allowPinchZoom:!0,children:t.jsx(pt,{...e,ref:s,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:se(e.onCloseAutoFocus,c=>{c.preventDefault(),o.current||r.triggerRef.current?.focus()}),onPointerDownOutside:se(e.onPointerDownOutside,c=>{const d=c.detail.originalEvent,f=d.button===0&&d.ctrlKey===!0,u=d.button===2||f;o.current=u},{checkForDefaultPrevented:!1}),onFocusOutside:se(e.onFocusOutside,c=>c.preventDefault(),{checkForDefaultPrevented:!1})})})}),gr=i.forwardRef((e,n)=>{const r=K(Q,e.__scopePopover),a=i.useRef(!1),s=i.useRef(!1);return t.jsx(pt,{...e,ref:n,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:o=>{e.onCloseAutoFocus?.(o),o.defaultPrevented||(a.current||r.triggerRef.current?.focus(),o.preventDefault()),a.current=!1,s.current=!1},onInteractOutside:o=>{e.onInteractOutside?.(o),o.defaultPrevented||(a.current=!0,o.detail.originalEvent.type==="pointerdown"&&(s.current=!0));const c=o.target;r.triggerRef.current?.contains(c)&&o.preventDefault(),o.detail.originalEvent.type==="focusin"&&s.current&&o.preventDefault()}})}),pt=i.forwardRef((e,n)=>{const{__scopePopover:r,trapFocus:a,onOpenAutoFocus:s,onCloseAutoFocus:o,disableOutsidePointerEvents:c,onEscapeKeyDown:d,onPointerDownOutside:f,onFocusOutside:u,onInteractOutside:m,...x}=e,h=K(Q,r),w=oe(r);return _t(),t.jsx(At,{asChild:!0,loop:!0,trapped:a,onMountAutoFocus:s,onUnmountAutoFocus:o,children:t.jsx($t,{asChild:!0,disableOutsidePointerEvents:c,onInteractOutside:m,onEscapeKeyDown:d,onPointerDownOutside:f,onFocusOutside:u,onDismiss:()=>h.onOpenChange(!1),children:t.jsx(Ot,{"data-state":ft(h.open),role:"dialog",id:h.contentId,...w,...x,ref:n,style:{...x.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),mt="PopoverClose",hr=i.forwardRef((e,n)=>{const{__scopePopover:r,...a}=e,s=K(mt,r);return t.jsx(L.button,{type:"button",...a,ref:n,onClick:se(e.onClick,()=>s.onOpenChange(!1))})});hr.displayName=mt;var vr="PopoverArrow",yr=i.forwardRef((e,n)=>{const{__scopePopover:r,...a}=e,s=oe(r);return t.jsx(Dt,{...s,...a,ref:n})});yr.displayName=vr;function ft(e){return e?"open":"closed"}var br=lt,wr=ct,jr=ut,Nr=dt;class Cr{constructor(n,r){this.unique=n,this.name=r}static[_e]="PgIndexBuilderOn";on(...n){return new Ce(n.map(r=>{if(he(r,ve))return r;r=r;const a=new ye(r.name,!!r.keyAsName,r.columnType,r.indexConfig);return r.indexConfig=JSON.parse(JSON.stringify(r.defaultConfig)),a}),this.unique,!1,this.name)}onOnly(...n){return new Ce(n.map(r=>{if(he(r,ve))return r;r=r;const a=new ye(r.name,!!r.keyAsName,r.columnType,r.indexConfig);return r.indexConfig=r.defaultConfig,a}),this.unique,!0,this.name)}using(n,...r){return new Ce(r.map(a=>{if(he(a,ve))return a;a=a;const s=new ye(a.name,!!a.keyAsName,a.columnType,a.indexConfig);return a.indexConfig=JSON.parse(JSON.stringify(a.defaultConfig)),s}),this.unique,!0,this.name,n)}}class Ce{static[_e]="PgIndexBuilder";config;constructor(n,r,a,s,o="btree"){this.config={name:s,columns:n,unique:r,only:a,method:o}}concurrently(){return this.config.concurrently=!0,this}with(n){return this.config.with=n,this}where(n){return this.config.where=n,this}build(n){return new Er(this.config,n)}}class Er{static[_e]="PgIndex";config;constructor(n,r){this.config={...n,table:r}}}function Pr(e){return new Cr(!1,e)}var Ue=1,Rr=.9,kr=.8,Ir=.17,Ee=.1,Pe=.999,Sr=.9999,_r=.99,Ar=/[\\\/_+.#"@\[\(\{&]/,$r=/[\\\/_+.#"@\[\(\{&]/g,Or=/[\s-]/,xt=/[\s-]/g;function ke(e,n,r,a,s,o,c){if(o===n.length)return s===e.length?Ue:_r;var d=`${s},${o}`;if(c[d]!==void 0)return c[d];for(var f=a.charAt(o),u=r.indexOf(f,s),m=0,x,h,w,R;u>=0;)x=ke(e,n,r,a,u+1,o+1,c),x>m&&(u===s?x*=Ue:Ar.test(e.charAt(u-1))?(x*=kr,w=e.slice(s,u-1).match($r),w&&s>0&&(x*=Math.pow(Pe,w.length))):Or.test(e.charAt(u-1))?(x*=Rr,R=e.slice(s,u-1).match(xt),R&&s>0&&(x*=Math.pow(Pe,R.length))):(x*=Ir,s>0&&(x*=Math.pow(Pe,u-s))),e.charAt(u)!==n.charAt(o)&&(x*=Sr)),(x<Ee&&r.charAt(u-1)===a.charAt(o+1)||a.charAt(o+1)===a.charAt(o)&&r.charAt(u-1)!==a.charAt(o))&&(h=ke(e,n,r,a,u+1,o+2,c),h*Ee>x&&(x=h*Ee)),x>m&&(m=x),u=r.indexOf(f,u+1);return c[d]=m,m}function Ze(e){return e.toLowerCase().replace(xt," ")}function Dr(e,n,r){return e=r&&r.length>0?`${e+" "+r.join(" ")}`:e,ke(e,n,Ze(e),Ze(n),0,0,{})}var ne='[cmdk-group=""]',Re='[cmdk-group-items=""]',zr='[cmdk-group-heading=""]',gt='[cmdk-item=""]',Je=`${gt}:not([aria-disabled="true"])`,Ie="cmdk-item-select",Z="data-value",Mr=(e,n,r)=>Dr(e,n,r),ht=i.createContext(void 0),ie=()=>i.useContext(ht),vt=i.createContext(void 0),Oe=()=>i.useContext(vt),yt=i.createContext(void 0),bt=i.forwardRef((e,n)=>{let r=J(()=>{var l,g;return{search:"",value:(g=(l=e.value)!=null?l:e.defaultValue)!=null?g:"",selectedItemId:void 0,filtered:{count:0,items:new Map,groups:new Set}}}),a=J(()=>new Set),s=J(()=>new Map),o=J(()=>new Map),c=J(()=>new Set),d=wt(e),{label:f,children:u,value:m,onValueChange:x,filter:h,shouldFilter:w,loop:R,disablePointerSelection:A=!1,vimBindings:M=!0,...X}=e,Y=G(),y=G(),N=G(),k=i.useRef(null),b=Hr();W(()=>{if(m!==void 0){let l=m.trim();r.current.value=l,P.emit()}},[m]),W(()=>{b(6,De)},[]);let P=i.useMemo(()=>({subscribe:l=>(c.current.add(l),()=>c.current.delete(l)),snapshot:()=>r.current,setState:(l,g,v)=>{var p,j,C,$;if(!Object.is(r.current[l],g)){if(r.current[l]=g,l==="search")fe(),H(),b(1,me);else if(l==="value"){if(document.activeElement.hasAttribute("cmdk-input")||document.activeElement.hasAttribute("cmdk-root")){let S=document.getElementById(N);S?S.focus():(p=document.getElementById(Y))==null||p.focus()}if(b(7,()=>{var S;r.current.selectedItemId=(S=U())==null?void 0:S.id,P.emit()}),v||b(5,De),((j=d.current)==null?void 0:j.value)!==void 0){let S=g??"";($=(C=d.current).onValueChange)==null||$.call(C,S);return}}P.emit()}},emit:()=>{c.current.forEach(l=>l())}}),[]),V=i.useMemo(()=>({value:(l,g,v)=>{var p;g!==((p=o.current.get(l))==null?void 0:p.value)&&(o.current.set(l,{value:g,keywords:v}),r.current.filtered.items.set(l,B(g,v)),b(2,()=>{H(),P.emit()}))},item:(l,g)=>(a.current.add(l),g&&(s.current.has(g)?s.current.get(g).add(l):s.current.set(g,new Set([l]))),b(3,()=>{fe(),H(),r.current.value||me(),P.emit()}),()=>{o.current.delete(l),a.current.delete(l),r.current.filtered.items.delete(l);let v=U();b(4,()=>{fe(),v?.getAttribute("id")===l&&me(),P.emit()})}),group:l=>(s.current.has(l)||s.current.set(l,new Set),()=>{o.current.delete(l),s.current.delete(l)}),filter:()=>d.current.shouldFilter,label:f||e["aria-label"],getDisablePointerSelection:()=>d.current.disablePointerSelection,listId:Y,inputId:N,labelId:y,listInnerRef:k}),[]);function B(l,g){var v,p;let j=(p=(v=d.current)==null?void 0:v.filter)!=null?p:Mr;return l?j(l,r.current.search,g):0}function H(){if(!r.current.search||d.current.shouldFilter===!1)return;let l=r.current.filtered.items,g=[];r.current.filtered.groups.forEach(p=>{let j=s.current.get(p),C=0;j.forEach($=>{let S=l.get($);C=Math.max(S,C)}),g.push([p,C])});let v=k.current;ee().sort((p,j)=>{var C,$;let S=p.getAttribute("id"),ce=j.getAttribute("id");return((C=l.get(ce))!=null?C:0)-(($=l.get(S))!=null?$:0)}).forEach(p=>{let j=p.closest(Re);j?j.appendChild(p.parentElement===j?p:p.closest(`${Re} > *`)):v.appendChild(p.parentElement===v?p:p.closest(`${Re} > *`))}),g.sort((p,j)=>j[1]-p[1]).forEach(p=>{var j;let C=(j=k.current)==null?void 0:j.querySelector(`${ne}[${Z}="${encodeURIComponent(p[0])}"]`);C?.parentElement.appendChild(C)})}function me(){let l=ee().find(v=>v.getAttribute("aria-disabled")!=="true"),g=l?.getAttribute(Z);P.setState("value",g||void 0)}function fe(){var l,g,v,p;if(!r.current.search||d.current.shouldFilter===!1){r.current.filtered.count=a.current.size;return}r.current.filtered.groups=new Set;let j=0;for(let C of a.current){let $=(g=(l=o.current.get(C))==null?void 0:l.value)!=null?g:"",S=(p=(v=o.current.get(C))==null?void 0:v.keywords)!=null?p:[],ce=B($,S);r.current.filtered.items.set(C,ce),ce>0&&j++}for(let[C,$]of s.current)for(let S of $)if(r.current.filtered.items.get(S)>0){r.current.filtered.groups.add(C);break}r.current.filtered.count=j}function De(){var l,g,v;let p=U();p&&(((l=p.parentElement)==null?void 0:l.firstChild)===p&&((v=(g=p.closest(ne))==null?void 0:g.querySelector(zr))==null||v.scrollIntoView({block:"nearest"})),p.scrollIntoView({block:"nearest"}))}function U(){var l;return(l=k.current)==null?void 0:l.querySelector(`${gt}[aria-selected="true"]`)}function ee(){var l;return Array.from(((l=k.current)==null?void 0:l.querySelectorAll(Je))||[])}function xe(l){let g=ee()[l];g&&P.setState("value",g.getAttribute(Z))}function ge(l){var g;let v=U(),p=ee(),j=p.findIndex($=>$===v),C=p[j+l];(g=d.current)!=null&&g.loop&&(C=j+l<0?p[p.length-1]:j+l===p.length?p[0]:p[j+l]),C&&P.setState("value",C.getAttribute(Z))}function ze(l){let g=U(),v=g?.closest(ne),p;for(;v&&!p;)v=l>0?Wr(v,ne):Xr(v,ne),p=v?.querySelector(Je);p?P.setState("value",p.getAttribute(Z)):ge(l)}let Me=()=>xe(ee().length-1),Fe=l=>{l.preventDefault(),l.metaKey?Me():l.altKey?ze(1):ge(1)},Le=l=>{l.preventDefault(),l.metaKey?xe(0):l.altKey?ze(-1):ge(-1)};return i.createElement(L.div,{ref:n,tabIndex:-1,...X,"cmdk-root":"",onKeyDown:l=>{var g;(g=X.onKeyDown)==null||g.call(X,l);let v=l.nativeEvent.isComposing||l.keyCode===229;if(!(l.defaultPrevented||v))switch(l.key){case"n":case"j":{M&&l.ctrlKey&&Fe(l);break}case"ArrowDown":{Fe(l);break}case"p":case"k":{M&&l.ctrlKey&&Le(l);break}case"ArrowUp":{Le(l);break}case"Home":{l.preventDefault(),xe(0);break}case"End":{l.preventDefault(),Me();break}case"Enter":{l.preventDefault();let p=U();if(p){let j=new Event(Ie);p.dispatchEvent(j)}}}}},i.createElement("label",{"cmdk-label":"",htmlFor:V.inputId,id:V.labelId,style:Zr},f),pe(e,l=>i.createElement(vt.Provider,{value:P},i.createElement(ht.Provider,{value:V},l))))}),Fr=i.forwardRef((e,n)=>{var r,a;let s=G(),o=i.useRef(null),c=i.useContext(yt),d=ie(),f=wt(e),u=(a=(r=f.current)==null?void 0:r.forceMount)!=null?a:c?.forceMount;W(()=>{if(!u)return d.item(s,c?.id)},[u]);let m=jt(s,o,[e.value,e.children,o],e.keywords),x=Oe(),h=q(b=>b.value&&b.value===m.current),w=q(b=>u||d.filter()===!1?!0:b.search?b.filtered.items.get(s)>0:!0);i.useEffect(()=>{let b=o.current;if(!(!b||e.disabled))return b.addEventListener(Ie,R),()=>b.removeEventListener(Ie,R)},[w,e.onSelect,e.disabled]);function R(){var b,P;A(),(P=(b=f.current).onSelect)==null||P.call(b,m.current)}function A(){x.setState("value",m.current,!0)}if(!w)return null;let{disabled:M,value:X,onSelect:Y,forceMount:y,keywords:N,...k}=e;return i.createElement(L.div,{ref:le(o,n),...k,id:s,"cmdk-item":"",role:"option","aria-disabled":!!M,"aria-selected":!!h,"data-disabled":!!M,"data-selected":!!h,onPointerMove:M||d.getDisablePointerSelection()?void 0:A,onClick:M?void 0:R},e.children)}),Lr=i.forwardRef((e,n)=>{let{heading:r,children:a,forceMount:s,...o}=e,c=G(),d=i.useRef(null),f=i.useRef(null),u=G(),m=ie(),x=q(w=>s||m.filter()===!1?!0:w.search?w.filtered.groups.has(c):!0);W(()=>m.group(c),[]),jt(c,d,[e.value,e.heading,f]);let h=i.useMemo(()=>({id:c,forceMount:s}),[s]);return i.createElement(L.div,{ref:le(d,n),...o,"cmdk-group":"",role:"presentation",hidden:x?void 0:!0},r&&i.createElement("div",{ref:f,"cmdk-group-heading":"","aria-hidden":!0,id:u},r),pe(e,w=>i.createElement("div",{"cmdk-group-items":"",role:"group","aria-labelledby":r?u:void 0},i.createElement(yt.Provider,{value:h},w))))}),Tr=i.forwardRef((e,n)=>{let{alwaysRender:r,...a}=e,s=i.useRef(null),o=q(c=>!c.search);return!r&&!o?null:i.createElement(L.div,{ref:le(s,n),...a,"cmdk-separator":"",role:"separator"})}),Vr=i.forwardRef((e,n)=>{let{onValueChange:r,...a}=e,s=e.value!=null,o=Oe(),c=q(u=>u.search),d=q(u=>u.selectedItemId),f=ie();return i.useEffect(()=>{e.value!=null&&o.setState("search",e.value)},[e.value]),i.createElement(L.input,{ref:n,...a,"cmdk-input":"",autoComplete:"off",autoCorrect:"off",spellCheck:!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,"aria-controls":f.listId,"aria-labelledby":f.labelId,"aria-activedescendant":d,id:f.inputId,type:"text",value:s?e.value:c,onChange:u=>{s||o.setState("search",u.target.value),r?.(u.target.value)}})}),qr=i.forwardRef((e,n)=>{let{children:r,label:a="Suggestions",...s}=e,o=i.useRef(null),c=i.useRef(null),d=q(u=>u.selectedItemId),f=ie();return i.useEffect(()=>{if(c.current&&o.current){let u=c.current,m=o.current,x,h=new ResizeObserver(()=>{x=requestAnimationFrame(()=>{let w=u.offsetHeight;m.style.setProperty("--cmdk-list-height",w.toFixed(1)+"px")})});return h.observe(u),()=>{cancelAnimationFrame(x),h.unobserve(u)}}},[]),i.createElement(L.div,{ref:le(o,n),...s,"cmdk-list":"",role:"listbox",tabIndex:-1,"aria-activedescendant":d,"aria-label":a,id:f.listId},pe(e,u=>i.createElement("div",{ref:le(c,f.listInnerRef),"cmdk-list-sizer":""},u)))}),Kr=i.forwardRef((e,n)=>{let{open:r,onOpenChange:a,overlayClassName:s,contentClassName:o,container:c,...d}=e;return i.createElement(Qt,{open:r,onOpenChange:a},i.createElement(Yt,{container:c},i.createElement(er,{"cmdk-overlay":"",className:s}),i.createElement(tr,{"aria-label":e.label,"cmdk-dialog":"",className:o},i.createElement(bt,{ref:n,...d}))))}),Br=i.forwardRef((e,n)=>q(r=>r.filtered.count===0)?i.createElement(L.div,{ref:n,...e,"cmdk-empty":"",role:"presentation"}):null),Gr=i.forwardRef((e,n)=>{let{progress:r,children:a,label:s="Loading...",...o}=e;return i.createElement(L.div,{ref:n,...o,"cmdk-loading":"",role:"progressbar","aria-valuenow":r,"aria-valuemin":0,"aria-valuemax":100,"aria-label":s},pe(e,c=>i.createElement("div",{"aria-hidden":!0},c)))}),ae=Object.assign(bt,{List:qr,Item:Fr,Input:Vr,Group:Lr,Separator:Tr,Dialog:Kr,Empty:Br,Loading:Gr});function Wr(e,n){let r=e.nextElementSibling;for(;r;){if(r.matches(n))return r;r=r.nextElementSibling}}function Xr(e,n){let r=e.previousElementSibling;for(;r;){if(r.matches(n))return r;r=r.previousElementSibling}}function wt(e){let n=i.useRef(e);return W(()=>{n.current=e}),n}var W=typeof window>"u"?i.useEffect:i.useLayoutEffect;function J(e){let n=i.useRef();return n.current===void 0&&(n.current=e()),n}function q(e){let n=Oe(),r=()=>e(n.snapshot());return i.useSyncExternalStore(n.subscribe,r,r)}function jt(e,n,r,a=[]){let s=i.useRef(),o=ie();return W(()=>{var c;let d=(()=>{var u;for(let m of r){if(typeof m=="string")return m.trim();if(typeof m=="object"&&"current"in m)return m.current?(u=m.current.textContent)==null?void 0:u.trim():s.current}})(),f=a.map(u=>u.trim());o.value(e,d,f),(c=n.current)==null||c.setAttribute(Z,d),s.current=d}),s}var Hr=()=>{let[e,n]=i.useState(),r=J(()=>new Map);return W(()=>{r.current.forEach(a=>a()),r.current=new Map},[e]),(a,s)=>{r.current.set(a,s),n({})}};function Ur(e){let n=e.type;return typeof n=="function"?n(e.props):"render"in n?n.render(e.props):e}function pe({asChild:e,children:n},r){return e&&i.isValidElement(n)?i.cloneElement(Ur(n),{ref:n.ref},r(n.props.children)):r(n)}var Zr={position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0"};zt("companies",{id:Ft("id").primaryKey().defaultRandom(),status:O("status").$type().notNull().default("pending"),created_at:qe("created_at").notNull().defaultNow(),updated_at:qe("updated_at").notNull().defaultNow(),created_by:Te("created_by").references(()=>Ve.id,{onDelete:"cascade"}).notNull(),user_id:Te("user_id").references(()=>Ve.id,{onDelete:"cascade"}).notNull(),name:O("name",{length:255}).notNull().unique(),siret:O("siret",{length:14}).notNull(),business_owner:O("business_owner",{length:255}),description:O("description",{length:1500}),website:O("website",{length:255}),location:O("location",{length:255}),service_area:O("service_area",{length:255}),subdomain:O("subdomain",{length:100}),work_mode:O("work_mode").$type(),email:O("email",{length:255}),phone:O("phone",{length:24}),rqth:Mt("rqth").notNull().default(!1),logo:be("logo").$type(),gallery:be("gallery").$type(),social_media:be("social_media").$type().notNull().default({facebook:"",calendly:"",linkedin:"",instagram:""})},e=>[Pr("company_search_index").using("gin",Lt`to_tsvector('french', ${e.name} || ' ' || ${e.subdomain} || ' ' || ${e.description})`)]);const Jr=["remote","hybrid","onsite","not_specified"],Qe=Tt({name:I(_(),we("Veuillez entrer le nom de l'entreprise"),T(255,"Le nom de l'entreprise doit contenir au plus 255 caractères")),siret:I(_(),we("Veuillez entrer le siret de l'entreprise"),Wt(14,"Le siret de l'entreprise doit contenir 14 caractères")),categories:I(Ke(_()),Gt(1,"Veuillez sélectionner au moins une catégorie"),T(3,"Veuillez sélectionner au plus 3 catégories")),business_owner:D([z(""),I(_(),we("Veuillez entrer le nom du responsable de l'entreprise"),T(255,"Le nom du responsable de l'entreprise doit contenir au plus 255 caractères"))]),description:D([z(""),I(_(),T(1500,"La description de l'entreprise doit contenir au plus 1500 caractères"))]),website:D([z(""),I(_(),te("Veuillez entrer une url valide"))]),location:ue(D([z(""),I(_(),T(255,"La localisation doit contenir au plus 255 caractères"))])),service_area:D([z(""),I(_(),T(255,"La zone de service doit contenir au plus 255 caractères"))]),subdomain:D([z(""),I(_(),T(100,"Le sous-domaine doit contenir au plus 100 caractères"))]),email:D([z(""),I(_(),Bt("Veuillez entrer une adresse email valide"))]),phone:D([z(""),I(_(),T(24,"Le numéro de téléphone doit contenir au plus 24 caractères"))]),work_mode:Vt(Kt(Jr)),rqth:ue(qt()),logo:ue(I(We(File),Ge(["image/png","image/jpeg","image/jpg","image/webp"],"Veuillez entrer un fichier valide pour le logo"),Be(1024*1024*3,"La taille du fichier doit être inférieure à 3MB"))),gallery:ue(I(Ke(I(We(File),Ge(["image/png","image/jpeg","image/jpg","image/webp"],"Veuillez entrer un fichier valide pour la galerie"),Be(1024*1024*2,"La taille du fichier doit être inférieure à 2MB"))),T(2,"Veuillez entrer au plus 2 images"))),facebook:D([z(""),I(_(),te("Veuillez entrer une url valide"),de("https://www.facebook.com/","Veuillez entrer une url facebook valide"))]),instagram:D([z(""),I(_(),te("Veuillez entrer une url valide"),de("https://www.instagram.com/","Veuillez entrer une url instagram valide"))]),linkedin:D([z(""),I(_(),te("Veuillez entrer une url valide"),de("https://www.linkedin.com/company/","Veuillez entrer une url linkedin valide"))]),calendly:D([z(""),I(_(),te("Veuillez entrer une url valide"),de("https://calendly.com/","Veuillez entrer une url calendly valide"))])});function Qr(e){return t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",...e,children:[t.jsx("title",{children:"Chevron down"}),t.jsx("path",{fill:"currentColor",d:"M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"})]})}var Yr=/^\d+$/u,en=/^-?\d*(?:\.\d+)?$/u,tn=/^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])$/u,rn=/^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])T(?:0\d|1\d|2[0-3]):[0-5]\d$/u,nn=/^(?:0\d|1\d|2[0-3]):[0-5]\d$/u,an=/^(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}$/u,sn=/^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/u;function Nt(e){if(!e||e==="null")return null;if(e!=="undefined"){if(tn.test(e))return new Date(`${e}T00:00:00.000Z`);if(rn.test(e))return new Date(`${e}:00.000Z`);if(sn.test(e)){const[n,r]=e.split("-W"),a=new Date(`${n}-01-01T00:00:00.000Z`);return a.setUTCDate((+r-1)*7+1),a}return nn.test(e)?new Date(`1970-01-01T${e}:00.000Z`):an.test(e)?new Date(`1970-01-01T${e}.000Z`):Yr.test(e)?new Date(+e):new Date(e)}}function ln(e){if(!e||e==="null")return null;if(e!=="undefined")return!(e==="false"||e==="off"||e==="0")}function on(e){if(!e||e==="null")return null;if(e!=="undefined")return en.test(e)?Number(e):Nt(e).getTime()}function cn(e,n,r){if(e?.booleans?.includes(n))return ln(r);if(typeof r=="string"){if(e?.dates?.includes(n))return Nt(r);if(e?.numbers?.includes(n))return on(r)}return r}function Se(e,n,r){return e.reduce((a,s,o)=>a[s]=a[s]||(n[o+1]==="$"?[]:{}),r)}function Ye(e,n){const r=[];if(e.includes(".$.")){const a=(s,o)=>{const[c,...d]=s.split(".$."),f=o?`${o}.${c}`:c,u=Se(f.split("."),s.split("."),n);for(let m=0;m<u.length;m++){const x=`${f}.${m}`;d.length>1?a(d.join(".$."),x):r.push(`${x}.${d[0]}`)}};a(e)}else r.push(e);return r}function et(e,n,r){const[a,s]=typeof n=="function"?[void 0,n]:[n,r];if(a)for(const c of["arrays","booleans","dates","files","numbers"])a[c]?.length&&(a[c]=a[c].map(d=>d.replace(/\[\$\]/g,".$")));const o={};for(const[c,d]of e.entries()){const f=c.replace(/\[(\d+)\]/g,".$1"),u=f.replace(/\.\d+\./g,".$.").replace(/\.\d+$/,".$"),m=f.split("."),x=u.split(".");let h=o;for(let w=0;w<m.length;w++){const R=m[w];if(R==="__proto__"||R==="prototype"||R==="constructor")break;if(w<m.length-1)if(h[R])h=h[R];else{const A=w<m.length-2?x[w+1]==="$":a?.arrays?.includes(x.slice(0,-1).join("."));h=h[R]=A?[]:{}}else if(!a?.files?.includes(u)||d&&(typeof d=="string"||d.size)){let A=cn(a,u,d);s&&(A=s({path:c,input:d,output:A})),a?.arrays?.includes(u)?h[R]?h[R].push(A):h[R]=[A]:h[R]=A}}}if(a?.arrays)for(const c of a.arrays){const d=Ye(c,o);for(const f of d){const u=f.split("."),m=u[u.length-1],x=Se(u.slice(0,-1),c.split("."),o);x[m]||(x[m]=[])}}if(a?.booleans)for(const c of a.booleans){const d=Ye(c,o);for(const f of d){const u=f.split("."),m=u[u.length-1],x=Se(u.slice(0,-1),c.split("."),o);x[m]!==!0&&(x[m]=!1)}}return o}const yn=function(){const n=Xe.useRouteContext(),r=Xe.useLoaderData(),a=Xt(),{mutate:s,isPending:o}=Ht({mutationFn:cr(Ut)}),[c,d]=i.useState(new Set),[f,u]=i.useState({gallery:[]}),[m,x]=i.useState(0),h=i.useRef(null);function w(y){d(N=>N.size>=3?(je.error("Vous ne pouvez pas sélectionner plus de 3 catégories"),N):new Set(N).add(y))}function R(y){d(N=>{const k=new Set(N);return k.delete(y),k})}function A(y){x(y.target.value.length)}function M(y,N,k){const b=y.target.files?.[0];if(!b)return;const P=new FileReader;P.onload=()=>{const V=P.result;N==="logo"&&u(B=>({...B,logo:V})),N==="gallery"&&k&&u(B=>{const H=[...B.gallery];return H[k]=V,{...B,gallery:H}})},P.readAsDataURL(b)}function X(){const y=new FormData(h.current);for(const b of c)y.append("categories",b);const N=et(y,{files:["logo","gallery"],arrays:["categories","gallery"],booleans:["rqth"]}),k=He(Qe,N,{abortPipeEarly:!0});console.log(k)}function Y(y){y.preventDefault();const N=new FormData(y.target);for(const P of c)N.append("categories",P);const k=et(N,{files:["logo","gallery"],arrays:["categories","gallery"],booleans:["rqth"]}),b=He(Qe,k,{abortPipeEarly:!0});if(!b.success){je.error(t.jsx("div",{children:b.issues.map((P,V)=>t.jsx("p",{children:P.message},V))}));return}s({data:N},{onSuccess:()=>{n.queryClient.invalidateQueries({queryKey:["user","companies"]}),je.success("Entreprise créée avec succès"),a.navigate({to:"/compte/entreprises"})}})}return t.jsx("div",{className:"container px-4 py-6",children:t.jsxs("div",{className:"max-w-xl mx-auto",children:[t.jsx("h1",{className:"text-2xl font-bold mb-4",children:"Référencez votre entreprise"}),t.jsxs("form",{className:"flex flex-col gap-3",ref:h,onSubmit:Y,children:[t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Nom de l'entreprise *"}),t.jsx(F,{type:"text",name:"name",placeholder:"Ex: mon entreprise",className:"placeholder:text-xs"})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Siret *"}),t.jsx(F,{type:"text",name:"siret",placeholder:"Ex: 12345678901234",className:"placeholder:text-xs"})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Catégories * (max. 3)"}),t.jsxs(br,{children:[t.jsxs(wr,{className:"h-9 cursor-pointer border rounded-sm border-gray-300 px-2 py-1 text-xs flex items-center justify-between gap-2",children:[t.jsx("span",{className:"rounded-sm text-xs flex items-center gap-2 text-gray-400",children:"Ajouter une catégorie"}),t.jsx(Qr,{className:"size-5 text-gray-500"})]}),t.jsx(jr,{children:t.jsx(Nr,{className:"bg-white w-(--radix-popper-anchor-width)",sideOffset:5,children:t.jsxs(ae,{className:"border rounded-sm border-gray-300",children:[t.jsx(ae.Input,{placeholder:"Rechercher une catégorie",className:"w-full h-10 px-2 outline-none placeholder:text-sm placeholder:font-light"}),t.jsx(ae.Separator,{className:"h-px bg-gray-300"}),t.jsx(ae.List,{className:"max-h-60 overflow-y-auto",children:r.map(y=>t.jsx(ae.Item,{value:y.name,disabled:c.has(y.id),className:"cursor-pointer py-1.5 px-2 aria-selected:bg-gray-100 text-sm font-light aria-disabled:opacity-20",onSelect:()=>w(y.id),children:y.name},y.id))})]})})})]})]}),t.jsx("ul",{className:"flex flex-wrap gap-2",children:Array.from(c).map(y=>{const N=r.find(k=>k.id===y);return N?t.jsxs("li",{className:"bg-gray-400 text-white px-2 py-1 rounded-sm text-xs flex items-center gap-2",children:[t.jsx("span",{className:"max-w-[30ch] truncate",children:N.name}),t.jsx("button",{type:"button",className:"text-white inline-grid place-items-center cursor-pointer",onClick:()=>R(N.id),children:t.jsx(rr,{className:"size-3 text-white"})})]},N.id):null})}),t.jsx(re,{className:"h-px bg-gray-300 my-4"}),t.jsxs("div",{className:"grid gap-1",children:[t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Description"}),t.jsx("textarea",{name:"description",className:"border rounded-sm p-2 border-gray-300 resize-none placeholder:text-xs",rows:4,placeholder:"Entrer une description de mon entreprise...",onChange:A})]}),t.jsxs("span",{className:"text-xs text-gray-500 justify-self-end",children:[m,"/1500"]})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Entrepreneur"}),t.jsx(F,{type:"text",name:"business_owner",placeholder:"Ex: Nom Prénom",className:"placeholder:text-xs"})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Perimètre d'intervention"}),t.jsx(F,{type:"text",name:"service_area",placeholder:"Ex: Paris, Lyon, Marseille",className:"placeholder:text-xs"})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Sous-domaine"}),t.jsx(F,{type:"text",name:"subdomain",placeholder:"Ex: monentreprise",className:"placeholder:text-xs"})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Email"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(nr,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"email",name:"email",placeholder:"Ex: contact@monentreprise.com",className:"placeholder:text-xs outline-none w-full"})]})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Numéro de téléphone"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(ar,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"tel",name:"phone",placeholder:"Ex: 06 06 06 06 06",className:"placeholder:text-xs outline-none w-full"})]})]}),t.jsxs(E,{className:"flex flex-col gap-1",children:[t.jsx("span",{className:"text-xs font-medium",children:"Site web"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(sr,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"text",name:"website",placeholder:"Ex: https://www.monentreprise.com",className:"placeholder:text-xs outline-none w-full"})]})]}),t.jsx(re,{className:"h-px bg-gray-300 my-4"}),t.jsxs("fieldset",{className:"flex flex-col gap-4",children:[t.jsx("legend",{className:"text-xs font-medium mb-2",children:"Réseaux sociaux"}),t.jsxs(E,{children:[t.jsx("span",{className:"sr-only",children:"Linkedin"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(Zt,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"text",name:"linkedin",placeholder:"Ex: https://www.linkedin.com/company/monentreprise",className:"placeholder:text-xs outline-none w-full"})]})]}),t.jsxs(E,{children:[t.jsx("span",{className:"sr-only",children:"Facebook"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(lr,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"text",name:"facebook",placeholder:"Ex: https://www.facebook.com/monentreprise",className:"placeholder:text-xs outline-none w-full"})]})]}),t.jsxs(E,{children:[t.jsx("span",{className:"sr-only",children:"Instagram"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(or,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"text",name:"instagram",placeholder:"Ex: https://www.instagram.com/monentreprise",className:"placeholder:text-xs outline-none w-full"})]})]}),t.jsxs(E,{children:[t.jsx("span",{className:"sr-only",children:"Calendly"}),t.jsxs("div",{className:"flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500",children:[t.jsx(ir,{className:"size-5 text-gray-500"}),t.jsx("input",{type:"text",name:"calendly",placeholder:"Ex: https://calendly.com/monentreprise",className:"placeholder:text-xs outline-none w-full"})]})]})]}),t.jsx(re,{className:"h-px bg-gray-300 my-4"}),t.jsxs("div",{className:"grid gap-8",children:[t.jsxs("fieldset",{className:"flex gap-4",children:[t.jsx("legend",{className:"text-xs font-medium mb-2",children:"Mode de travail"}),t.jsxs(E,{className:"flex items-center gap-1",children:[t.jsx(F,{type:"radio",name:"work_mode",value:"not_specified",defaultChecked:!0,className:"size-4 accent-gray-600"}),t.jsx("span",{className:"text-xs",children:"Non spécifié"})]}),t.jsxs(E,{className:"flex items-center gap-1",children:[t.jsx(F,{type:"radio",name:"work_mode",value:"remote",className:"size-4 accent-gray-600"}),t.jsx("span",{className:"text-xs",children:"À distance"})]}),t.jsxs(E,{className:"flex items-center gap-1",children:[t.jsx(F,{type:"radio",name:"work_mode",value:"onsite",className:"size-4 accent-gray-600"}),t.jsx("span",{className:"text-xs",children:"Sur site"})]}),t.jsxs(E,{className:"flex items-center gap-1",children:[t.jsx(F,{type:"radio",name:"work_mode",value:"hybrid",className:"size-4 accent-gray-600"}),t.jsx("span",{className:"text-xs",children:"Hybride"})]})]}),t.jsxs("fieldset",{className:"flex gap-2",children:[t.jsx("legend",{className:"text-xs font-medium mb-2",children:"RQTH"}),t.jsxs(E,{className:"flex items-center gap-1",children:[t.jsx(F,{type:"radio",name:"rqth",value:"true",className:"size-4 accent-gray-600"}),t.jsx("span",{className:"text-xs",children:"Oui"})]}),t.jsxs(E,{className:"flex items-center gap-1",children:[t.jsx(F,{type:"radio",name:"rqth",value:"false",className:"size-4 accent-gray-600"}),t.jsx("span",{className:"text-xs",children:"Non"})]})]})]}),t.jsx(re,{className:"h-px bg-gray-300 my-4"}),t.jsxs("fieldset",{className:"border rounded-sm border-gray-300 p-4",children:[t.jsx("legend",{className:"text-xs font-medium  bg-white px-2",children:"Images"}),t.jsxs("div",{className:"flex gap-2 justify-center",children:[t.jsxs(E,{className:"relative flex flex-col gap-1 outline-none group",children:[t.jsx("span",{className:"text-xs font-medium",children:"Logo (max. 3MB)"}),t.jsxs("div",{className:"w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500",children:[f.logo?t.jsx("img",{src:f.logo,alt:"Logo",className:"w-full h-full object-cover"}):t.jsx(Ne,{className:"size-8 rounded-full bg-gray-400 p-1 text-white"}),t.jsx("input",{type:"file",className:"absolute inset-0 opacity-0",name:"logo",onChange:y=>M(y,"logo"),accept:"image/*"})]})]}),t.jsxs(E,{className:"relative flex flex-col gap-1 outline-none group",children:[t.jsx("span",{className:"text-xs font-medium",children:"Image 1 (max. 2MB)"}),t.jsxs("div",{className:"w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500",children:[f.gallery[0]?t.jsx("img",{src:f.gallery[0],alt:"gallery 1",className:"w-full h-full object-cover"}):t.jsx(Ne,{className:"size-8 rounded-full bg-gray-400 p-1 text-white"}),t.jsx("input",{type:"file",className:"absolute inset-0 opacity-0",name:"gallery",onChange:y=>M(y,"gallery",0),accept:"image/*"})]})]}),t.jsxs(E,{className:"relative flex flex-col gap-1 outline-none group",children:[t.jsx("span",{className:"text-xs font-medium",children:"Image 2 (max. 2MB)"}),t.jsxs("div",{className:"w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500",children:[f.gallery[1]?t.jsx("img",{src:f.gallery[1],alt:"gallery 2",className:"w-full h-full object-cover"}):t.jsx(Ne,{className:"size-8 rounded-full bg-gray-400 p-1 text-white"}),t.jsx("input",{type:"file",className:"absolute inset-0 opacity-0",name:"gallery",onChange:y=>M(y,"gallery",1),accept:"image/*"})]})]})]})]}),t.jsx(re,{className:"h-px bg-gray-300 my-4"}),t.jsxs("div",{className:"flex gap-2 justify-end",children:[t.jsx(Jt,{to:"/compte/entreprises/preview",className:"bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs",onClick:X,children:"Prévisualiser"}),t.jsx("button",{type:"submit",className:"bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs",disabled:o,children:o?"Création en cours...":"Créer un compte"})]})]})]})})};export{yn as component};
