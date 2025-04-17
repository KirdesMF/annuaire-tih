import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL } from 'node:url';
import { isRedirect, isNotFound, isPlainObject as isPlainObject$1, encode as encode$1 } from '@tanstack/router-core';
import E$1 from 'tiny-invariant';
import { eventHandler as eventHandler$1, toWebRequest, getResponseStatus, getEvent, createStartHandler, defineHandlerCallback, transformReadableStreamWithRouter, transformPipeableStreamWithRouter, getHeaders } from '@tanstack/start-server-core';
import { startSerializer, createServerFn, mergeHeaders as mergeHeaders$2 } from '@tanstack/start-client-core';
import { createRouter as createRouter$2, createRootRouteWithContext, createFileRoute, RouterProvider, lazyRouteComponent, redirect, Outlet, HeadContent, Scripts, Link, useRouter } from '@tanstack/react-router';
import { jsx, jsxs } from 'react/jsx-runtime';
import { QueryClient, queryOptions, useMutation } from '@tanstack/react-query';
import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { DropdownMenu, Avatar } from 'radix-ui';
import { useState } from 'react';
import { pgTable, timestamp, text, boolean, varchar, jsonb, uuid, index } from 'drizzle-orm/pg-core';
import { Toaster, toast } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as e$1 from 'valibot';
import { sql } from 'drizzle-orm';
import { decode as decode$1 } from 'decode-formdata';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { PassThrough } from 'node:stream';
import { isbot } from 'isbot';
import N$1 from 'react-dom/server';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$2 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$2){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _$1(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$2.prototype),c}function g(...n){return function(...e){for(const t of n)t(...e);}}const m$1=_$1();let A$2 = class A extends m$1{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$2;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$2{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H$1(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$1(n){return typeof n?.entries=="function"}function S$1(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C=new Set([101,204,205,304]);async function b$1(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S$1(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => undefined);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== undefined) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : undefined;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : undefined;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, undefined);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, undefined);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, undefined)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, undefined, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, undefined, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === undefined && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l$1=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l$1;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l$1(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController: AbortController$1 });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {}
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","dir":"./public","base":"/","root":"/Users/kirdes/Dev/@annuaire-tih","order":0,"outDir":"/Users/kirdes/Dev/@annuaire-tih/.vinxi/build/public"},{"name":"client","type":"client","target":"browser","handler":"app/client.tsx","base":"/_build","build":{"sourcemap":true},"root":"/Users/kirdes/Dev/@annuaire-tih","outDir":"/Users/kirdes/Dev/@annuaire-tih/.vinxi/build/client","order":1},{"name":"ssr","type":"http","target":"server","handler":"app/ssr.tsx","link":{"client":"client"},"root":"/Users/kirdes/Dev/@annuaire-tih","base":"/","outDir":"/Users/kirdes/Dev/@annuaire-tih/.vinxi/build/ssr","order":2},{"name":"server","type":"http","target":"server","base":"/_server","handler":"node_modules/@tanstack/start-server-functions-handler/dist/esm/index.js","root":"/Users/kirdes/Dev/@annuaire-tih","outDir":"/Users/kirdes/Dev/@annuaire-tih/.vinxi/build/server","order":3},{"name":"api","base":"/api","type":"http","handler":"app/api.ts","target":"server","root":"/Users/kirdes/Dev/@annuaire-tih","outDir":"/Users/kirdes/Dev/@annuaire-tih/.vinxi/build/api","order":4}],"server":{"preset":"netlify","experimental":{"asyncContext":true}},"root":"/Users/kirdes/Dev/@annuaire-tih"};
				const buildManifest = {"client":{"/Users/kirdes/Dev/@annuaire-tih/app/styles/app.css":{"file":"assets/app-DkE24agH.css","src":"/Users/kirdes/Dev/@annuaire-tih/app/styles/app.css"},"__vite-browser-external":{"file":"assets/__vite-browser-external-BIHI7g3E.js","name":"__vite-browser-external","src":"__vite-browser-external","isDynamicEntry":true},"_client-CB7jT4PR.js":{"file":"assets/client-CB7jT4PR.js","name":"client","dynamicImports":["__vite-browser-external","__vite-browser-external","__vite-browser-external","__vite-browser-external","app/routes/_protected/route.tsx?tsr-split=component","app/routes/_admin/route.tsx?tsr-split=component","app/routes/_public/index.tsx?tsr-split=component","app/routes/_public/sources.tsx?tsr-split=component","app/routes/_public/partner.tsx?tsr-split=component","app/routes/_public/faq.tsx?tsr-split=component","app/routes/_public/contact.tsx?tsr-split=component","app/routes/_public/about.tsx?tsr-split=component","app/routes/_protected/reference.tsx?tsr-split=component","app/routes/_auth/signup.tsx?tsr-split=component","app/routes/_auth/reset-password.tsx?tsr-split=component","app/routes/_auth/login.tsx?tsr-split=component","app/routes/_auth/forgot-password.tsx?tsr-split=component","app/routes/_protected/_compte/route.tsx?tsr-split=component","app/routes/_public/entrepreneurs/index.tsx?tsr-split=component","app/routes/_public/categories/index.tsx?tsr-split=component","app/routes/_public/entreprises/$name.tsx?tsr-split=errorComponent","app/routes/_public/entreprises/$name.tsx?tsr-split=pendingComponent","app/routes/_public/entreprises/$name.tsx?tsr-split=component","app/routes/_public/categories/$id.tsx?tsr-split=component","app/routes/_admin/admin/dashboard.tsx?tsr-split=component","app/routes/_protected/_compte/compte/preferences.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/index.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/preview.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/add.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx?tsr-split=component"],"assets":["assets/app-DkE24agH.css"]},"_close-ibM140p9.js":{"file":"assets/close-ibM140p9.js","name":"close","imports":["_client-CB7jT4PR.js"]},"_cn-B3Z9kGEY.js":{"file":"assets/cn-B3Z9kGEY.js","name":"cn"},"_company-logo-CUirh31U.js":{"file":"assets/company-logo-CUirh31U.js","name":"company-logo","imports":["_client-CB7jT4PR.js","_cn-B3Z9kGEY.js"]},"_globe-Dg21mcrR.js":{"file":"assets/globe-Dg21mcrR.js","name":"globe","imports":["_client-CB7jT4PR.js"]},"_index-DGV-PNAM.js":{"file":"assets/index-DGV-PNAM.js","name":"index","imports":["_client-CB7jT4PR.js"]},"_label-zriPn8DN.js":{"file":"assets/label-zriPn8DN.js","name":"label","imports":["_client-CB7jT4PR.js","_cn-B3Z9kGEY.js"]},"_plus-CE-jRqin.js":{"file":"assets/plus-CE-jRqin.js","name":"plus","imports":["_client-CB7jT4PR.js"]},"_useServerFn-B1ugu9gG.js":{"file":"assets/useServerFn-B1ugu9gG.js","name":"useServerFn","imports":["_client-CB7jT4PR.js"]},"_useSuspenseQuery-BCzDeUkk.js":{"file":"assets/useSuspenseQuery-BCzDeUkk.js","name":"useSuspenseQuery","imports":["_client-CB7jT4PR.js"]},"app/assets/img/banner.png":{"file":"assets/banner-Evc62HPL.png","src":"app/assets/img/banner.png"},"app/routes/_admin/admin/dashboard.tsx?tsr-split=component":{"file":"assets/dashboard-DitFG9XU.js","name":"dashboard","src":"app/routes/_admin/admin/dashboard.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_admin/route.tsx?tsr-split=component":{"file":"assets/route-CMobPOeh.js","name":"route","src":"app/routes/_admin/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_auth/forgot-password.tsx?tsr-split=component":{"file":"assets/forgot-password-Ch14ZsWG.js","name":"forgot-password","src":"app/routes/_auth/forgot-password.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_auth/login.tsx?tsr-split=component":{"file":"assets/login-Bsq-XteZ.js","name":"login","src":"app/routes/_auth/login.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_label-zriPn8DN.js","_useServerFn-B1ugu9gG.js","_cn-B3Z9kGEY.js"]},"app/routes/_auth/reset-password.tsx?tsr-split=component":{"file":"assets/reset-password-Dyd7AwH-.js","name":"reset-password","src":"app/routes/_auth/reset-password.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_auth/signup.tsx?tsr-split=component":{"file":"assets/signup-ScXFk1AS.js","name":"signup","src":"app/routes/_auth/signup.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_label-zriPn8DN.js","_useServerFn-B1ugu9gG.js","_cn-B3Z9kGEY.js"]},"app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx?tsr-split=component":{"file":"assets/edit-Ois6yBLp.js","name":"edit","src":"app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_protected/_compte/compte/entreprises/add.tsx?tsr-split=component":{"file":"assets/add-DL3p4RED.js","name":"add","src":"app/routes/_protected/_compte/compte/entreprises/add.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_label-zriPn8DN.js","_close-ibM140p9.js","_globe-Dg21mcrR.js","_plus-CE-jRqin.js","_useServerFn-B1ugu9gG.js","_index-DGV-PNAM.js","_cn-B3Z9kGEY.js"]},"app/routes/_protected/_compte/compte/entreprises/index.tsx?tsr-split=component":{"file":"assets/index-DEX7-AyS.js","name":"index","src":"app/routes/_protected/_compte/compte/entreprises/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_useSuspenseQuery-BCzDeUkk.js","_company-logo-CUirh31U.js","_plus-CE-jRqin.js","_close-ibM140p9.js","_index-DGV-PNAM.js","_cn-B3Z9kGEY.js"]},"app/routes/_protected/_compte/compte/entreprises/preview.tsx?tsr-split=component":{"file":"assets/preview-Doy6qfsC.js","name":"preview","src":"app/routes/_protected/_compte/compte/entreprises/preview.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_protected/_compte/compte/preferences.tsx?tsr-split=component":{"file":"assets/preferences-CGMvnx95.js","name":"preferences","src":"app/routes/_protected/_compte/compte/preferences.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_protected/_compte/route.tsx?tsr-split=component":{"file":"assets/route-BfEHZMKb.js","name":"route","src":"app/routes/_protected/_compte/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_useSuspenseQuery-BCzDeUkk.js","_plus-CE-jRqin.js","_index-DGV-PNAM.js"]},"app/routes/_protected/reference.tsx?tsr-split=component":{"file":"assets/reference-Dc7Hczxt.js","name":"reference","src":"app/routes/_protected/reference.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_label-zriPn8DN.js","_cn-B3Z9kGEY.js"]},"app/routes/_protected/route.tsx?tsr-split=component":{"file":"assets/route-BQ_YnPIs.js","name":"route","src":"app/routes/_protected/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/about.tsx?tsr-split=component":{"file":"assets/about-CDm5eMTs.js","name":"about","src":"app/routes/_public/about.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/categories/$id.tsx?tsr-split=component":{"file":"assets/_id-Bh2d8V8l.js","name":"_id","src":"app/routes/_public/categories/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/categories/index.tsx?tsr-split=component":{"file":"assets/index-B6ljv-ng.js","name":"index","src":"app/routes/_public/categories/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/contact.tsx?tsr-split=component":{"file":"assets/contact-Cm1coCqk.js","name":"contact","src":"app/routes/_public/contact.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/entrepreneurs/index.tsx?tsr-split=component":{"file":"assets/index-D_gHckN5.js","name":"index","src":"app/routes/_public/entrepreneurs/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/entreprises/$name.tsx?tsr-split=component":{"file":"assets/_name-Bqtpi1OW.js","name":"_name","src":"app/routes/_public/entreprises/$name.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_useSuspenseQuery-BCzDeUkk.js","_company-logo-CUirh31U.js","_globe-Dg21mcrR.js","_index-DGV-PNAM.js","_cn-B3Z9kGEY.js"]},"app/routes/_public/entreprises/$name.tsx?tsr-split=errorComponent":{"file":"assets/_name-DauuxJxv.js","name":"_name","src":"app/routes/_public/entreprises/$name.tsx?tsr-split=errorComponent","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/entreprises/$name.tsx?tsr-split=pendingComponent":{"file":"assets/_name-D5C2eH-j.js","name":"_name","src":"app/routes/_public/entreprises/$name.tsx?tsr-split=pendingComponent","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/faq.tsx?tsr-split=component":{"file":"assets/faq-2lOw6jof.js","name":"faq","src":"app/routes/_public/faq.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/index.tsx?tsr-split=component":{"file":"assets/index-SQ4Sx7_8.js","name":"index","src":"app/routes/_public/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js","_useSuspenseQuery-BCzDeUkk.js"],"assets":["assets/banner-Evc62HPL.png"]},"app/routes/_public/partner.tsx?tsr-split=component":{"file":"assets/partner-DaJ_FA9X.js","name":"partner","src":"app/routes/_public/partner.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"app/routes/_public/sources.tsx?tsr-split=component":{"file":"assets/sources-DGaDPANq.js","name":"sources","src":"app/routes/_public/sources.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CB7jT4PR.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-CYiiBgAW.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_client-CB7jT4PR.js"]}},"ssr":{"/Users/kirdes/Dev/@annuaire-tih/app/styles/app.css":{"file":"assets/app-BvlQHg4K.css","src":"/Users/kirdes/Dev/@annuaire-tih/app/styles/app.css"},"_close--xrcrNXd.js":{"file":"assets/close--xrcrNXd.js","name":"close"},"_cn-bhneXptQ.js":{"file":"assets/cn-bhneXptQ.js","name":"cn"},"_company-logo-DcDO8tdb.js":{"file":"assets/company-logo-DcDO8tdb.js","name":"company-logo","imports":["_cn-bhneXptQ.js"]},"_globe-BUymkEPS.js":{"file":"assets/globe-BUymkEPS.js","name":"globe"},"_label-B1qOmGit.js":{"file":"assets/label-B1qOmGit.js","name":"label","imports":["_cn-bhneXptQ.js"]},"_plus-BVAK8_Jr.js":{"file":"assets/plus-BVAK8_Jr.js","name":"plus"},"_ssr-B2yzgCJC.js":{"file":"assets/ssr-B2yzgCJC.js","name":"ssr","dynamicImports":["app/routes/_protected/route.tsx?tsr-split=component","app/routes/_admin/route.tsx?tsr-split=component","app/routes/_public/index.tsx?tsr-split=component","app/routes/_public/sources.tsx?tsr-split=component","app/routes/_public/partner.tsx?tsr-split=component","app/routes/_public/faq.tsx?tsr-split=component","app/routes/_public/contact.tsx?tsr-split=component","app/routes/_public/about.tsx?tsr-split=component","app/routes/_protected/reference.tsx?tsr-split=component","app/routes/_auth/signup.tsx?tsr-split=component","app/routes/_auth/reset-password.tsx?tsr-split=component","app/routes/_auth/login.tsx?tsr-split=component","app/routes/_auth/forgot-password.tsx?tsr-split=component","app/routes/_protected/_compte/route.tsx?tsr-split=component","app/routes/_public/entrepreneurs/index.tsx?tsr-split=component","app/routes/_public/categories/index.tsx?tsr-split=component","app/routes/_public/entreprises/$name.tsx?tsr-split=errorComponent","app/routes/_public/entreprises/$name.tsx?tsr-split=pendingComponent","app/routes/_public/entreprises/$name.tsx?tsr-split=component","app/routes/_public/categories/$id.tsx?tsr-split=component","app/routes/_admin/admin/dashboard.tsx?tsr-split=component","app/routes/_protected/_compte/compte/preferences.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/index.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/preview.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/add.tsx?tsr-split=component","app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx?tsr-split=component"],"assets":["assets/app-BvlQHg4K.css"]},"_useServerFn-DtzmTnlI.js":{"file":"assets/useServerFn-DtzmTnlI.js","name":"useServerFn"},"app/assets/img/banner.png":{"file":"assets/banner-Evc62HPL.png","src":"app/assets/img/banner.png"},"app/routes/_admin/admin/dashboard.tsx?tsr-split=component":{"file":"assets/dashboard-DKZIHeQn.js","name":"dashboard","src":"app/routes/_admin/admin/dashboard.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_admin/route.tsx?tsr-split=component":{"file":"assets/route-BCnNEv89.js","name":"route","src":"app/routes/_admin/route.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_auth/forgot-password.tsx?tsr-split=component":{"file":"assets/forgot-password-zixOiwS0.js","name":"forgot-password","src":"app/routes/_auth/forgot-password.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_auth/login.tsx?tsr-split=component":{"file":"assets/login-CGV7q78E.js","name":"login","src":"app/routes/_auth/login.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_label-B1qOmGit.js","_ssr-B2yzgCJC.js","_useServerFn-DtzmTnlI.js","_cn-bhneXptQ.js"]},"app/routes/_auth/reset-password.tsx?tsr-split=component":{"file":"assets/reset-password-BTYIFHqi.js","name":"reset-password","src":"app/routes/_auth/reset-password.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_auth/signup.tsx?tsr-split=component":{"file":"assets/signup-DUsuYvOo.js","name":"signup","src":"app/routes/_auth/signup.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_label-B1qOmGit.js","_ssr-B2yzgCJC.js","_useServerFn-DtzmTnlI.js","_cn-bhneXptQ.js"]},"app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx?tsr-split=component":{"file":"assets/edit-BUeGVjF3.js","name":"edit","src":"app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-B2yzgCJC.js"]},"app/routes/_protected/_compte/compte/entreprises/add.tsx?tsr-split=component":{"file":"assets/add-E_Tm_DAB.js","name":"add","src":"app/routes/_protected/_compte/compte/entreprises/add.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_label-B1qOmGit.js","_close--xrcrNXd.js","_ssr-B2yzgCJC.js","_globe-BUymkEPS.js","_plus-BVAK8_Jr.js","_useServerFn-DtzmTnlI.js","_cn-bhneXptQ.js"]},"app/routes/_protected/_compte/compte/entreprises/index.tsx?tsr-split=component":{"file":"assets/index-Bra5vMkb.js","name":"index","src":"app/routes/_protected/_compte/compte/entreprises/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_company-logo-DcDO8tdb.js","_plus-BVAK8_Jr.js","_close--xrcrNXd.js","_ssr-B2yzgCJC.js","_cn-bhneXptQ.js"]},"app/routes/_protected/_compte/compte/entreprises/preview.tsx?tsr-split=component":{"file":"assets/preview-B1J1KjWU.js","name":"preview","src":"app/routes/_protected/_compte/compte/entreprises/preview.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_protected/_compte/compte/preferences.tsx?tsr-split=component":{"file":"assets/preferences-Dr09Y8h4.js","name":"preferences","src":"app/routes/_protected/_compte/compte/preferences.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_protected/_compte/route.tsx?tsr-split=component":{"file":"assets/route-CWvq02Wb.js","name":"route","src":"app/routes/_protected/_compte/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_plus-BVAK8_Jr.js","_ssr-B2yzgCJC.js"]},"app/routes/_protected/reference.tsx?tsr-split=component":{"file":"assets/reference-hrPmoKVH.js","name":"reference","src":"app/routes/_protected/reference.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_label-B1qOmGit.js","_cn-bhneXptQ.js"]},"app/routes/_protected/route.tsx?tsr-split=component":{"file":"assets/route-CjDoFr0g.js","name":"route","src":"app/routes/_protected/route.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/about.tsx?tsr-split=component":{"file":"assets/about-CzFvV-7i.js","name":"about","src":"app/routes/_public/about.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/categories/$id.tsx?tsr-split=component":{"file":"assets/_id-BXU5h-k8.js","name":"_id","src":"app/routes/_public/categories/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-B2yzgCJC.js"]},"app/routes/_public/categories/index.tsx?tsr-split=component":{"file":"assets/index-DDQFu39X.js","name":"index","src":"app/routes/_public/categories/index.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/contact.tsx?tsr-split=component":{"file":"assets/contact-D_SEO6t2.js","name":"contact","src":"app/routes/_public/contact.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/entrepreneurs/index.tsx?tsr-split=component":{"file":"assets/index-CSm5gLhj.js","name":"index","src":"app/routes/_public/entrepreneurs/index.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/entreprises/$name.tsx?tsr-split=component":{"file":"assets/_name-soSzPmJt.js","name":"_name","src":"app/routes/_public/entreprises/$name.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-B2yzgCJC.js","_company-logo-DcDO8tdb.js","_globe-BUymkEPS.js","_cn-bhneXptQ.js"]},"app/routes/_public/entreprises/$name.tsx?tsr-split=errorComponent":{"file":"assets/_name-BD5xRgOT.js","name":"_name","src":"app/routes/_public/entreprises/$name.tsx?tsr-split=errorComponent","isDynamicEntry":true},"app/routes/_public/entreprises/$name.tsx?tsr-split=pendingComponent":{"file":"assets/_name-RW2G6P8z.js","name":"_name","src":"app/routes/_public/entreprises/$name.tsx?tsr-split=pendingComponent","isDynamicEntry":true},"app/routes/_public/faq.tsx?tsr-split=component":{"file":"assets/faq-BE3u91NJ.js","name":"faq","src":"app/routes/_public/faq.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/index.tsx?tsr-split=component":{"file":"assets/index-BEVw6ugx.js","name":"index","src":"app/routes/_public/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-B2yzgCJC.js"],"assets":["assets/banner-Evc62HPL.png"]},"app/routes/_public/partner.tsx?tsr-split=component":{"file":"assets/partner-eGLwnrmV.js","name":"partner","src":"app/routes/_public/partner.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_public/sources.tsx?tsr-split=component":{"file":"assets/sources-CPVzUGRn.js","name":"sources","src":"app/routes/_public/sources.tsx?tsr-split=component","isDynamicEntry":true},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_ssr-B2yzgCJC.js"]}},"server":{"/Users/kirdes/Dev/@annuaire-tih/app/styles/app.css":{"file":"assets/app-BvlQHg4K.css","src":"/Users/kirdes/Dev/@annuaire-tih/app/styles/app.css"},"_auth.server-CEln8Kin.js":{"file":"assets/auth.server-CEln8Kin.js","name":"auth.server","imports":["_index-8Htcofqc.js"]},"_categories-BGVwlHfX.js":{"file":"assets/categories-BGVwlHfX.js","name":"categories"},"_company-categories-Dsd3WCXy.js":{"file":"assets/company-categories-Dsd3WCXy.js","name":"company-categories","imports":["_auth.server-CEln8Kin.js","_categories-BGVwlHfX.js"]},"_index-8Htcofqc.js":{"file":"assets/index-8Htcofqc.js","name":"index"},"_label-BcVNeqdH.js":{"file":"assets/label-BcVNeqdH.js","name":"label"},"app/lib/api/categories.ts?tsr-directive-use-server=":{"file":"assets/categories-4UjoYAyj.js","name":"categories","src":"app/lib/api/categories.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-8Htcofqc.js","_categories-BGVwlHfX.js"]},"app/lib/api/companies.ts?tsr-directive-use-server=":{"file":"assets/companies-Co9WOiyO.js","name":"companies","src":"app/lib/api/companies.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-8Htcofqc.js","_company-categories-Dsd3WCXy.js","_auth.server-CEln8Kin.js","_categories-BGVwlHfX.js"]},"app/lib/api/user.ts?tsr-directive-use-server=":{"file":"assets/user-DodAozgJ.js","name":"user","src":"app/lib/api/user.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-8Htcofqc.js","_categories-BGVwlHfX.js","_company-categories-Dsd3WCXy.js","_auth.server-CEln8Kin.js"]},"app/routes/__root.tsx?tsr-directive-use-server=":{"file":"assets/__root-314AODrE.js","name":"__root","src":"app/routes/__root.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_auth.server-CEln8Kin.js","_index-8Htcofqc.js"],"assets":["assets/app-BvlQHg4K.css"]},"app/routes/_auth/login.tsx?tsr-directive-use-server=":{"file":"assets/login-BhSqD-hQ.js","name":"login","src":"app/routes/_auth/login.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_auth.server-CEln8Kin.js","_index-8Htcofqc.js"],"dynamicImports":["app/routes/_auth/login.tsx?tsr-split=component"]},"app/routes/_auth/login.tsx?tsr-split=component":{"file":"assets/login-02gR8xUb.js","name":"login","src":"app/routes/_auth/login.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_label-BcVNeqdH.js","_auth.server-CEln8Kin.js","_index-8Htcofqc.js"]},"app/routes/_auth/signup.tsx?tsr-directive-use-server=":{"file":"assets/signup-DcEYNaAi.js","name":"signup","src":"app/routes/_auth/signup.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_auth.server-CEln8Kin.js","_index-8Htcofqc.js"],"dynamicImports":["app/routes/_auth/signup.tsx?tsr-split=component"]},"app/routes/_auth/signup.tsx?tsr-split=component":{"file":"assets/signup-C_1YHVpu.js","name":"signup","src":"app/routes/_auth/signup.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_label-BcVNeqdH.js","_auth.server-CEln8Kin.js","_index-8Htcofqc.js"]},"virtual:$vinxi/handler/server":{"file":"server.js","name":"server","src":"virtual:$vinxi/handler/server","isEntry":true,"dynamicImports":["app/routes/__root.tsx?tsr-directive-use-server=","app/routes/_auth/signup.tsx?tsr-directive-use-server=","app/routes/_auth/login.tsx?tsr-directive-use-server=","app/lib/api/categories.ts?tsr-directive-use-server=","app/lib/api/companies.ts?tsr-directive-use-server=","app/lib/api/companies.ts?tsr-directive-use-server=","app/lib/api/companies.ts?tsr-directive-use-server=","app/lib/api/user.ts?tsr-directive-use-server="]}},"api":{"_index-BGf5JDnY.js":{"file":"assets/index-BGf5JDnY.js","name":"index","dynamicImports":["app/routes/api/auth/$.ts?pick=APIRoute","app/routes/api/auth/$.ts?pick=APIRoute"]},"app/routes/api/auth/$.ts?pick=APIRoute":{"file":"_.js","name":"_","src":"app/routes/api/auth/$.ts?pick=APIRoute","isEntry":true,"isDynamicEntry":true,"imports":["_index-BGf5JDnY.js"]},"virtual:$vinxi/handler/api":{"file":"api.js","name":"api","src":"virtual:$vinxi/handler/api","isEntry":true,"imports":["_index-BGf5JDnY.js"]}}};

				const routeManifest = {"api":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 




			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const O = { "app_routes_root_tsx--getSession_createServerFn_handler": { functionName: "getSession_createServerFn_handler", importer: () => import('../build/__root-314AODrE.mjs') }, "app_routes_auth_signup_tsx--signupFn_createServerFn_handler": { functionName: "signupFn_createServerFn_handler", importer: () => import('../build/signup-DcEYNaAi.mjs') }, "app_routes_auth_login_tsx--loginFn_createServerFn_handler": { functionName: "loginFn_createServerFn_handler", importer: () => import('../build/login-BhSqD-hQ.mjs') }, "app_lib_api_categories_ts--getCategories_createServerFn_handler": { functionName: "getCategories_createServerFn_handler", importer: () => import('../build/categories-4UjoYAyj.mjs') }, "app_lib_api_companies_ts--addCompany_createServerFn_handler": { functionName: "addCompany_createServerFn_handler", importer: () => import('../build/companies-Co9WOiyO.mjs') }, "app_lib_api_companies_ts--deleteCompany_createServerFn_handler": { functionName: "deleteCompany_createServerFn_handler", importer: () => import('../build/companies-Co9WOiyO.mjs') }, "app_lib_api_companies_ts--getCompany_createServerFn_handler": { functionName: "getCompany_createServerFn_handler", importer: () => import('../build/companies-Co9WOiyO.mjs') }, "app_lib_api_user_ts--getUserCompanies_createServerFn_handler": { functionName: "getUserCompanies_createServerFn_handler", importer: () => import('../build/user-DodAozgJ.mjs') } }, P$1 = eventHandler$1(D$2), u$1 = O;
async function D$2(r) {
  const t = toWebRequest(r);
  return await A$1({ request: t, event: r });
}
function L(r) {
  return r.replace(/^\/|\/$/g, "");
}
async function A$1({ request: r, event: t }) {
  const a = new AbortController(), i = a.signal, v = () => a.abort();
  t.node.req.on("close", v);
  const h = r.method, g = new URL(r.url, "http://localhost:3000"), R = new RegExp(`${L("/_server")}/([^/?#]+)`), F = g.pathname.match(R), o = F ? F[1] : null, c = Object.fromEntries(g.searchParams.entries()), _ = "createServerFn" in c, x = "raw" in c;
  if (typeof o != "string") throw new Error("Invalid server action param for serverFnId: " + o);
  const m = u$1[o];
  if (!m) throw console.log("serverFnManifest", u$1), new Error("Server function info not found for " + o);
  let p;
  if (p = await m.importer(), !p) throw console.log("serverFnManifest", u$1), new Error("Server function module not resolved for " + o);
  const s = p[m.functionName];
  if (!s) throw console.log("serverFnManifest", u$1), console.log("fnModule", p), new Error(`Server function module export not resolved for serverFn ID: ${o}`);
  const b = ["multipart/form-data", "application/x-www-form-urlencoded"], l = await (async () => {
    try {
      let e = await (async () => {
        if (r.headers.get("Content-Type") && b.some((n) => {
          var S;
          return (S = r.headers.get("Content-Type")) == null ? void 0 : S.includes(n);
        })) return E$1(h.toLowerCase() !== "get", "GET requests with FormData payloads are not supported"), await s(await r.formData(), i);
        if (h.toLowerCase() === "get") {
          let n = c;
          return _ && (n = c.payload), n = n && startSerializer.parse(n), await s(n, i);
        }
        const d = await r.text(), w = startSerializer.parse(d);
        return _ ? await s(w, i) : await s(...w, i);
      })();
      return e.result instanceof Response ? e.result : !_ && (e = e.result, e instanceof Response) ? e : isRedirect(e) || isNotFound(e) ? N(e) : new Response(e !== void 0 ? startSerializer.stringify(e) : void 0, { status: getResponseStatus(getEvent()), headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return e instanceof Response ? e : isRedirect(e) || isNotFound(e) ? N(e) : (console.info(), console.info("Server Fn Error!"), console.info(), console.error(e), console.info(), new Response(startSerializer.stringify(e), { status: 500, headers: { "Content-Type": "application/json" } }));
    }
  })();
  if (t.node.req.removeListener("close", v), x) return l;
  if (l.headers.get("Content-Type") === "application/json") {
    const d = await l.clone().text();
    d && JSON.stringify(JSON.parse(d));
  }
  return l;
}
function N(r) {
  const { headers: t, ...a } = r;
  return new Response(JSON.stringify(a), { status: 200, headers: { "Content-Type": "application/json", ...t || {} } });
}

const _ = [{ path: "/__root", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/__root.tsx" }, { path: "/_admin/route", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_admin/route.tsx" }, { path: "/_auth/forgot-password", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_auth/forgot-password.tsx" }, { path: "/_auth/login", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_auth/login.tsx" }, { path: "/_auth/reset-password", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_auth/reset-password.tsx" }, { path: "/_auth/signup", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_auth/signup.tsx" }, { path: "/_protected/reference", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/reference.tsx" }, { path: "/_protected/route", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/route.tsx" }, { path: "/_public/about", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/about.tsx" }, { path: "/_public/contact", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/contact.tsx" }, { path: "/_public/faq", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/faq.tsx" }, { path: "/_public", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/index.tsx" }, { path: "/_public/partner", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/partner.tsx" }, { path: "/_public/sources", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/sources.tsx" }, { path: "/_admin/admin/dashboard", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_admin/admin/dashboard.tsx" }, { path: "/_protected/_compte/route", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/_compte/route.tsx" }, { path: "/_public/categories/:$id?", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/categories/$id.tsx" }, { path: "/_public/categories", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/categories/index.tsx" }, { path: "/_public/entrepreneurs", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/entrepreneurs/index.tsx" }, { path: "/_public/entreprises/:$name?", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_public/entreprises/$name.tsx" }, { path: "/api/auth/*splat", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/api/auth/$.ts", $APIRoute: { src: "app/routes/api/auth/$.ts?pick=APIRoute", build: () => import('../build/_.mjs'), import: () => import('../build/_.mjs') } }, { path: "/_protected/_compte/compte/preferences", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/_compte/compte/preferences.tsx" }, { path: "/_protected/_compte/compte/entreprises/add", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/_compte/compte/entreprises/add.tsx" }, { path: "/_protected/_compte/compte/entreprises", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/_compte/compte/entreprises/index.tsx" }, { path: "/_protected/_compte/compte/entreprises/preview", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/_compte/compte/entreprises/preview.tsx" }, { path: "/_protected/_compte/compte/entreprises/:$id?/edit", filePath: "/Users/kirdes/Dev/@annuaire-tih/app/routes/_protected/_compte/compte/entreprises/$id/edit.tsx" }], m = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
function b(e) {
  return eventHandler$1(async (s) => {
    const a = toWebRequest(s);
    return await e({ request: a });
  });
}
const k = (e) => (s) => ({ path: e, methods: s });
function P(e, s) {
  const a = e.pathname.split("/").filter(Boolean), p = s.sort((r, t) => {
    const i = r.routePath.split("/").filter(Boolean);
    return t.routePath.split("/").filter(Boolean).length - i.length;
  }).filter((r) => {
    const t = r.routePath.split("/").filter(Boolean);
    return a.length >= t.length;
  });
  for (const r of p) {
    const t = r.routePath.split("/").filter(Boolean), i = {};
    let o = true;
    for (let n = 0; n < t.length; n++) {
      const h = t[n], c = a[n];
      if (h.startsWith("$")) if (h === "$") {
        const u = a.slice(n).join("/");
        if (u !== "") i["*"] = u, i._splat = u;
        else {
          o = false;
          break;
        }
      } else {
        const u = h.slice(1);
        i[u] = c;
      }
      else if (h !== c) {
        o = false;
        break;
      }
    }
    if (o) return { routePath: r.routePath, params: i, payload: r.payload };
  }
}
const l = _.filter((e) => e.$APIRoute);
function v(e) {
  const s = [];
  return e.forEach((a) => {
    const r = a.path.split("/").filter(Boolean).map((t) => t === "*splat" ? "$" : t.startsWith(":$") && t.endsWith("?") ? t.slice(1, -1) : t).join("/");
    s.push({ routePath: `/${r}`, payload: a });
  }), s;
}
const D$1 = async ({ request: e }) => {
  if (!l.length) return new Response("No routes found", { status: 404 });
  if (!m.includes(e.method)) return new Response("Method not allowed", { status: 405 });
  const s = v(l), a = new URL(e.url, "http://localhost:3000"), p = P(a, s);
  if (!p) return new Response("Not found", { status: 404 });
  let r;
  try {
    r = await p.payload.$APIRoute.import().then((o) => o.APIRoute);
  } catch (o) {
    return console.error("Error importing route file:", o), new Response("Internal server error", { status: 500 });
  }
  if (!r) return new Response("Internal server error", { status: 500 });
  const t = e.method, i = r.methods[t];
  return i ? await i({ request: e, params: p.params }) : new Response("Method not allowed", { status: 405 });
};

const d = b(D$1);

function j(e) {
  return jsx(RouterProvider, { router: e.router });
}
const Ge = defineHandlerCallback(async ({ request: e, router: n, responseHeaders: o }) => {
  if (typeof N$1.renderToReadableStream == "function") {
    const p = await N$1.renderToReadableStream(jsx(j, { router: n }), { signal: e.signal });
    isbot(e.headers.get("User-Agent")) && await p.allReady;
    const m = transformReadableStreamWithRouter(n, p);
    return new Response(m, { status: n.state.statusCode, headers: o });
  }
  if (typeof N$1.renderToPipeableStream == "function") {
    const p = new PassThrough();
    try {
      const _ = N$1.renderToPipeableStream(jsx(j, { router: n }), { ...isbot(e.headers.get("User-Agent")) ? { onAllReady() {
        _.pipe(p);
      } } : { onShellReady() {
        _.pipe(p);
      } }, onError: (f, d) => {
        console.error("Error in renderToPipeableStream:", f, d);
      } });
    } catch (_) {
      console.error("Error in renderToPipeableStream:", _);
    }
    const m = transformPipeableStreamWithRouter(n, p);
    return new Response(m, { status: n.state.statusCode, headers: o });
  }
  throw new Error("No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.");
}), Ue = () => ({ routes: { __root__: { filePath: "__root.tsx", children: ["/_admin", "/_protected", "/_auth/forgot-password", "/_auth/login", "/_auth/reset-password", "/_auth/signup", "/_public/about", "/_public/contact", "/_public/faq", "/_public/partner", "/_public/sources", "/_public/", "/_public/categories/$id", "/_public/entreprises/$name", "/_public/categories/", "/_public/entrepreneurs/"], preloads: ["/_build/assets/client-CYiiBgAW.js", "/_build/assets/client-CB7jT4PR.js"] }, "/_admin": { filePath: "_admin/route.tsx", children: ["/_admin/admin/dashboard"] }, "/_protected": { filePath: "_protected/route.tsx", children: ["/_protected/_compte", "/_protected/reference"] }, "/_protected/_compte": { filePath: "_protected/_compte/route.tsx", parent: "/_protected", children: ["/_protected/_compte/compte/preferences", "/_protected/_compte/compte/entreprises/add", "/_protected/_compte/compte/entreprises/preview", "/_protected/_compte/compte/entreprises/", "/_protected/_compte/compte/entreprises/$id/edit"] }, "/_auth/forgot-password": { filePath: "_auth/forgot-password.tsx" }, "/_auth/login": { filePath: "_auth/login.tsx" }, "/_auth/reset-password": { filePath: "_auth/reset-password.tsx" }, "/_auth/signup": { filePath: "_auth/signup.tsx" }, "/_protected/reference": { filePath: "_protected/reference.tsx", parent: "/_protected" }, "/_public/about": { filePath: "_public/about.tsx" }, "/_public/contact": { filePath: "_public/contact.tsx" }, "/_public/faq": { filePath: "_public/faq.tsx" }, "/_public/partner": { filePath: "_public/partner.tsx" }, "/_public/sources": { filePath: "_public/sources.tsx" }, "/_public/": { filePath: "_public/index.tsx" }, "/_admin/admin/dashboard": { filePath: "_admin/admin/dashboard.tsx", parent: "/_admin" }, "/_public/categories/$id": { filePath: "_public/categories/$id.tsx" }, "/_public/entreprises/$name": { filePath: "_public/entreprises/$name.tsx" }, "/_public/categories/": { filePath: "_public/categories/index.tsx" }, "/_public/entrepreneurs/": { filePath: "_public/entrepreneurs/index.tsx" }, "/_protected/_compte/compte/preferences": { filePath: "_protected/_compte/compte/preferences.tsx", parent: "/_protected/_compte" }, "/_protected/_compte/compte/entreprises/add": { filePath: "_protected/_compte/compte/entreprises/add.tsx", parent: "/_protected/_compte" }, "/_protected/_compte/compte/entreprises/preview": { filePath: "_protected/_compte/compte/entreprises/preview.tsx", parent: "/_protected/_compte" }, "/_protected/_compte/compte/entreprises/": { filePath: "_protected/_compte/compte/entreprises/index.tsx", parent: "/_protected/_compte" }, "/_protected/_compte/compte/entreprises/$id/edit": { filePath: "_protected/_compte/compte/entreprises/$id/edit.tsx", parent: "/_protected/_compte" } } });
function Je(e) {
  return globalThis.MANIFEST[e];
}
function Ye() {
  var _a;
  const e = Ue(), n = e.routes.__root__ = e.routes.__root__ || {};
  n.assets = n.assets || [];
  let o = "";
  const p = Je("client"), m = (_a = p.inputs[p.handler]) == null ? void 0 : _a.output.path;
  return m || E$1(m, "Could not find client entry in vinxi manifest"), n.assets.push({ tag: "script", attrs: { type: "module", suppressHydrationWarning: true, async: true }, children: `${o}import("${m}")` }), e;
}
function Xe() {
  const e = Ye();
  return { ...e, routes: Object.fromEntries(Object.entries(e.routes).map(([n, o]) => {
    const { preloads: p, assets: m } = o;
    return [n, { preloads: p, assets: m }];
  })) };
}
async function Ze(e, n, o) {
  var p;
  const m = n[0];
  if (isPlainObject$1(m) && m.method) {
    const d = m, P = d.data instanceof FormData ? "formData" : "payload", I = new Headers({ ...P === "payload" ? { "content-type": "application/json", accept: "application/json" } : {}, ...d.headers instanceof Headers ? Object.fromEntries(d.headers.entries()) : d.headers });
    if (d.method === "GET") {
      const b = encode$1({ payload: startSerializer.stringify({ data: d.data, context: d.context }) });
      b && (e.includes("?") ? e += `&${b}` : e += `?${b}`);
    }
    e.includes("?") ? e += "&createServerFn" : e += "?createServerFn", d.response === "raw" && (e += "&raw");
    const _e = await o(e, { method: d.method, headers: I, signal: d.signal, ...et(d) }), z = await M(_e);
    if ((p = z.headers.get("content-type")) != null && p.includes("application/json")) {
      const b = startSerializer.decode(await z.json());
      if (isRedirect(b) || isNotFound(b) || b instanceof Error) throw b;
      return b;
    }
    return z;
  }
  const _ = await M(await o(e, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(n) })), f = _.headers.get("content-type");
  return f && f.includes("application/json") ? startSerializer.decode(await _.json()) : _.text();
}
function et(e) {
  var _a;
  return e.method === "POST" ? e.data instanceof FormData ? (e.data.set("__TSR_CONTEXT", startSerializer.stringify(e.context)), { body: e.data }) : { body: startSerializer.stringify({ data: (_a = e.data) != null ? _a : null, context: e.context }) } : {};
}
async function M(e) {
  if (!e.ok) {
    const n = e.headers.get("content-type");
    throw n && n.includes("application/json") ? startSerializer.decode(await e.json()) : new Error(await e.text());
  }
  return e;
}
function tt(e) {
  return e.replace(/^\/|\/$/g, "");
}
const x = (e, n) => {
  const o = `/${tt(n)}/${e}`;
  return Object.assign((...m) => Ze(o, m, async (_, f) => {
    f.headers = mergeHeaders$2(getHeaders(), f.headers);
    const d = await $fetch.native(_, f), P = getEvent(), I = mergeHeaders$2(d.headers, P.___ssrRpcResponseHeaders);
    return P.___ssrRpcResponseHeaders = I, d;
  }), { url: o, functionId: e });
};
function rt(e) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...e, children: [jsx("title", { children: "Linkedin" }), jsx("path", { fill: "currentColor", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" })] });
}
const D = createAuthClient({ plugins: [adminClient()] });
function nt(e) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...e, children: [jsx("title", { children: "Logout" }), jsx("path", { fill: "currentColor", d: "M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h5.903q.214 0 .357.143t.143.357t-.143.357t-.357.143H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h5.904q.214 0 .357.143t.143.357t-.143.357t-.357.143zm12.444-7.5H9.692q-.213 0-.356-.143T9.192 12t.143-.357t.357-.143h8.368l-1.971-1.971q-.141-.14-.15-.338q-.01-.199.15-.364q.159-.165.353-.168q.195-.003.36.162l2.614 2.613q.242.243.242.566t-.243.566l-2.613 2.613q-.146.146-.347.153t-.366-.159q-.16-.165-.157-.357t.162-.35z" })] });
}
function ot(e) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...e, children: [jsx("title", { children: "Settings account" }), jsx("path", { fill: "currentColor", d: "M14.654 21.846q-.529 0-.9-.37t-.37-.899v-5.923q0-.529.37-.9t.9-.37h5.923q.529 0 .899.37t.37.9v5.923q0 .529-.37.899t-.899.37zM11 17.386V21h-.098q-.348 0-.576-.229t-.29-.571l-.263-2.092q-.479-.145-1.036-.454q-.556-.31-.947-.664l-1.915.824q-.317.14-.644.03t-.504-.415L3.648 15.57q-.177-.305-.104-.638t.348-.546l1.672-1.25q-.045-.272-.073-.559q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626l-1.672-1.25q-.275-.213-.338-.555t.113-.648l1.06-1.8q.177-.287.504-.406t.644.021l1.896.804q.448-.373.97-.673q.52-.3 1.013-.464l.283-2.092q.061-.342.318-.571T10.96 3h2.08q.349 0 .605.229q.257.229.319.571l.263 2.112q.575.202 1.016.463t.909.654l1.992-.804q.318-.14.645-.021t.503.406l1.06 1.819q.177.306.104.641q-.073.336-.348.544l-1.216.911q-.176.135-.362.133t-.346-.173t-.148-.38t.183-.347l1.225-.908l-.994-1.7l-2.552 1.07q-.454-.499-1.193-.935q-.74-.435-1.4-.577L13 4h-1.994l-.312 2.689q-.756.161-1.39.52q-.633.358-1.26.985L5.55 7.15l-.994 1.7l2.169 1.62q-.125.336-.175.73t-.05.82q0 .38.05.755t.156.73l-2.15 1.645l.994 1.7l2.475-1.05q.6.606 1.363.999t1.612.588m.973-7.887q-1.046 0-1.773.724T9.473 12q0 .467.16.89t.479.777q.16.183.366.206q.207.023.384-.136q.177-.154.181-.355t-.154-.347q-.208-.2-.312-.47T10.473 12q0-.625.438-1.063t1.062-.437q.289 0 .565.116q.276.117.476.324q.146.148.338.134q.192-.015.346-.191q.154-.177.134-.381t-.198-.364q-.311-.3-.753-.469t-.908-.169m5.643 8.962q-.625 0-1.197.191q-.571.191-1.057.56q-.287.22-.44.445t-.153.456q0 .136.106.242t.242.105h5.097q.105 0 .177-.095q.07-.097.07-.252q0-.231-.152-.456q-.153-.225-.44-.444q-.486-.37-1.057-.561t-1.196-.191m0-.846q.528 0 .899-.37q.37-.371.37-.9t-.37-.899t-.9-.37q-.528 0-.899.37q-.37.37-.37.9q0 .528.37.898t.9.37" })] });
}
function st(e) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...e, children: [jsx("title", { children: "Entreprise" }), jsx("path", { fill: "currentColor", d: "M4.616 20q-.691 0-1.153-.462T3 18.384V8.616q0-.691.463-1.153T4.615 7H9V5.615q0-.69.463-1.153T10.616 4h2.769q.69 0 1.153.462T15 5.615V7h4.385q.69 0 1.152.463T21 8.616v9.769q0 .69-.463 1.153T19.385 20zm0-1h14.769q.23 0 .423-.192t.192-.424V8.616q0-.231-.192-.424T19.385 8H4.615q-.23 0-.423.192T4 8.616v9.769q0 .23.192.423t.423.192M10 7h4V5.615q0-.23-.192-.423T13.385 5h-2.77q-.23 0-.423.192T10 5.615zM4 19V8z" })] });
}
function at(e) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...e, children: [jsx("title", { children: "Add" }), jsx("path", { fill: "currentColor", d: "M18 20v-3h-3v-2h3v-3h2v3h3v2h-3v3zM3 21q-.825 0-1.412-.587T1 19V5q0-.825.588-1.412T3 3h14q.825 0 1.413.588T19 5v5h-2V8H3v11h13v2z" })] });
}
function it(e) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...e, children: [jsx("title", { children: "Dashboard" }), jsx("path", { fill: "currentColor", d: "M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1H11.5V5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192m6.885 0h5.885q.23 0 .423-.192t.192-.424V12h-6.5zm0-8H19V5.616q0-.231-.192-.424T18.384 5H12.5z" })] });
}
const ct = ["admin", "user", "superadmin"], lt = (e) => e ? ct.includes(e) : false, S = pgTable("user", { id: text("id").primaryKey(), name: varchar("first_name", { length: 255 }).notNull(), email: varchar("email", { length: 255 }).notNull().unique(), emailVerified: boolean("email_verified").notNull(), image: varchar("image", { length: 255 }), createdAt: timestamp("created_at").notNull(), updatedAt: timestamp("updated_at").notNull(), role: varchar("role", { length: 255 }).$type().default("user").notNull(), banned: boolean("banned"), banReason: text("ban_reason"), banExpires: timestamp("ban_expires") });
pgTable("session", { id: text("id").primaryKey(), expiresAt: timestamp("expires_at").notNull(), token: text("token").notNull().unique(), createdAt: timestamp("created_at").notNull(), updatedAt: timestamp("updated_at").notNull(), ipAddress: text("ip_address"), userAgent: text("user_agent"), userId: text("user_id").notNull().references(() => S.id, { onDelete: "cascade" }), impersonatedBy: text("impersonated_by") });
pgTable("account", { id: text("id").primaryKey(), accountId: text("account_id").notNull(), providerId: text("provider_id").notNull(), userId: text("user_id").notNull().references(() => S.id, { onDelete: "cascade" }), accessToken: text("access_token"), refreshToken: text("refresh_token"), idToken: text("id_token"), accessTokenExpiresAt: timestamp("access_token_expires_at"), refreshTokenExpiresAt: timestamp("refresh_token_expires_at"), scope: text("scope"), password: text("password"), createdAt: timestamp("created_at").notNull(), updatedAt: timestamp("updated_at").notNull() });
pgTable("verification", { id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(), expiresAt: timestamp("expires_at").notNull(), createdAt: timestamp("created_at"), updatedAt: timestamp("updated_at") });
function pt() {
  const { data: e } = D.useSession(), n = e == null ? void 0 : e.user.role;
  return { isAdmin: lt(n) && (n === "admin" || n === "superadmin") };
}
const dt = [{ label: "Qui sommes-nous ?", to: "/about" }, { label: "FAQ", to: "/faq" }, { label: "Sources", to: "/sources" }, { label: "Contact", to: "/contact" }];
function ut({ session: e, queryClient: n }) {
  return jsx("header", { className: "px-16 py-1.5 border-b border-gray-200 backdrop-blur-sm", children: jsxs("nav", { className: "flex items-center justify-between", children: [jsxs("ul", { className: "flex items-center gap-4", children: [jsx("li", { children: jsx(Link, { to: "/", className: "text-sm font-light", children: "Annuaire TIH" }) }), dt.map((o) => jsx("li", { children: jsx(Link, { to: o.to, className: "text-sm font-light", activeProps: { className: "text-blue-700" }, children: o.label }) }, o.to))] }), jsxs("div", { className: "flex items-center gap-4", children: [jsx("a", { href: "https://linkedin.com/groups/13011531", target: "_blank", rel: "noopener noreferrer", className: "hover:text-blue-700 transition-colors", children: jsx(rt, { className: "size-5" }) }), jsx(mt, { session: e }), jsx(ht, { session: e }), jsx(gt, { session: e, queryClient: n })] })] }) });
}
function mt({ session: e }) {
  return e ? null : jsx(Link, { to: "/signup", className: "text-xs px-2 py-1 rounded-sm border border-gray-400", children: "Se r\xE9f\xE9rencer" });
}
function ht({ session: e }) {
  return e ? null : jsx(Link, { to: "/login", className: "text-xs px-2 py-1 rounded-sm border border-gray-400 cursor-pointer", children: "Login" });
}
function gt({ session: e, queryClient: n }) {
  const o = useRouter(), [p, m] = useState("light"), { isAdmin: _ } = pt(), { mutate: f } = useMutation({ mutationFn: () => D.signOut(), onSuccess: () => {
    n.clear(), toast.success("Vous \xEAtes d\xE9connect\xE9"), o.navigate({ to: "/" });
  } });
  if (!e) return null;
  async function d() {
    f();
  }
  return jsxs(DropdownMenu.Root, { children: [jsx(DropdownMenu.Trigger, { className: "rounded-full cursor-pointer", children: jsx(_t, { session: e }) }), jsx(DropdownMenu.Portal, { children: jsxs(DropdownMenu.Content, { sideOffset: 2, align: "end", className: "bg-white border rounded-sm border-gray-200 min-w-64 overflow-hidden p-1 shadow-xs", children: [jsxs("div", { className: "flex flex-col p-2", children: [jsx("span", { className: "text-sm", children: e.user.name }), jsx("span", { className: "truncate text-xs", children: e.user.email })] }), jsx(DropdownMenu.Separator, { className: "h-px bg-gray-200 my-1 -mx-1" }), jsxs(DropdownMenu.Group, { children: [jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/compte/entreprises/add", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(at, { className: "size-4" }), jsx("span", { className: "text-xs", children: "R\xE9f\xE9rencer" })] }) }), jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/compte/entreprises", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(st, { className: "size-4" }), jsx("span", { className: "text-xs", children: "Mes entreprises" })] }) }), jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/compte/preferences", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(ot, { className: "size-4" }), jsx("span", { className: "text-xs", children: "Mon compte" })] }) }), _ ? jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/admin/dashboard", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(it, { className: "size-4" }), jsx("span", { className: "text-xs", children: "Admin dashboard" })] }) }) : null] }), jsx(DropdownMenu.Separator, { className: "h-px bg-gray-200 my-1 -mx-1" }), jsxs(DropdownMenu.Group, { children: [jsx(DropdownMenu.Label, { className: "text-sm font-light px-2 py-1.5", children: "Th\xE8me" }), jsxs(DropdownMenu.RadioGroup, { value: p, onValueChange: m, children: [jsxs(DropdownMenu.RadioItem, { value: "light", className: "text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center", children: [jsx(DropdownMenu.ItemIndicator, { className: "absolute start-2", children: jsx("span", { className: "size-2 rounded-full flex bg-gray-400" }) }), "Light"] }), jsxs(DropdownMenu.RadioItem, { value: "dark", className: "text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center", children: [jsx(DropdownMenu.ItemIndicator, { className: "absolute start-2", children: jsx("span", { className: "size-2 rounded-full flex bg-gray-400" }) }), "Dark"] }), jsxs(DropdownMenu.RadioItem, { value: "system", className: "text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center", children: [jsx(DropdownMenu.ItemIndicator, { className: "absolute start-2", children: jsx("span", { className: "size-2 rounded-full flex bg-gray-400" }) }), "System"] })] })] }), jsx(DropdownMenu.Separator, { className: "h-px bg-gray-200 my-1 -mx-1" }), jsx(DropdownMenu.Group, { children: jsxs(DropdownMenu.Item, { onSelect: () => d(), className: "text-xs px-2 py-1.5 outline-none cursor-pointer flex items-center gap-2 data-highlighted:bg-gray-100", children: [jsx(nt, { className: "size-4" }), jsx("span", { children: "Se d\xE9connecter" })] }) })] }) })] });
}
function _t({ session: e }) {
  var _a;
  if (!e) return null;
  const n = (_a = e.user.name) == null ? void 0 : _a.split(" ").map((o) => o[0]).join("");
  return e.user.image ? jsxs(Avatar.Root, { className: "size-6 rounded-full", children: [jsx(Avatar.Image, { src: e.user.image, alt: e.user.name, className: "size-full rounded-full" }), jsx(Avatar.Fallback, { className: "size-full leading-1", children: n })] }) : jsx(Avatar.Root, { className: "size-8 rounded-full border border-gray-200 flex", children: jsx(Avatar.Fallback, { className: "size-full leading-1 text-xs grid place-items-center text-blue-500", children: n }) });
}
const ft = "/_build/assets/app-BvlQHg4K.css", bt = x("app_routes_root_tsx--getSession_createServerFn_handler", "/_server"), yt = createServerFn({ method: "GET" }).handler(bt), Rt = queryOptions({ queryKey: ["user", "session"], queryFn: ({ signal: e }) => yt({ signal: e }) }), u = createRootRouteWithContext()({ head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "Annuaire TIH" }], links: [{ rel: "stylesheet", href: ft }] }), beforeLoad: async ({ context: e }) => ({ session: await e.queryClient.fetchQuery(Rt) }), notFoundComponent: () => jsx("div", { children: "Not found" }), component: xt });
function xt() {
  return jsx(vt, { children: jsx(Outlet, {}) });
}
function vt({ children: e }) {
  const { session: n, queryClient: o } = u.useRouteContext();
  return jsxs("html", { lang: "fr", children: [jsx("head", { children: jsx(HeadContent, {}) }), jsxs("body", { className: "font-sans text-gray-700 isolate", children: [jsx(ut, { session: n, queryClient: o }), e, jsx(Toaster, {}), jsx(ReactQueryDevtools, { buttonPosition: "bottom-left" }), jsx(Scripts, {})] })] });
}
const $t = () => import('../build/route-CjDoFr0g.mjs'), Q = createFileRoute("/_protected")({ component: lazyRouteComponent($t, "component", () => Q.ssr), beforeLoad: async ({ context: e }) => {
  var _a;
  if (!((_a = e.session) == null ? void 0 : _a.user)) throw redirect({ to: "/login" });
} }), qt = () => import('../build/route-BCnNEv89.mjs'), B = createFileRoute("/_admin")({ beforeLoad: ({ context: e }) => {
  var _a;
  if (!((_a = e.session) == null ? void 0 : _a.user)) throw redirect({ to: "/login" });
  const n = e.session.user.role;
  if (n !== "admin" && n !== "superadmin") throw redirect({ to: "/login" });
}, component: lazyRouteComponent(qt, "component", () => B.ssr) }), wt = x("app_lib_api_categories_ts--getCategories_createServerFn_handler", "/_server"), Ct = createServerFn({ method: "GET" }).handler(wt), W = queryOptions({ queryKey: ["categories"], queryFn: () => Ct(), staleTime: 1e3 * 60 * 60 * 24 }), Pt = () => import('../build/index-BEVw6ugx.mjs'), K = createFileRoute("/_public/")({ component: lazyRouteComponent(Pt, "component", () => K.ssr), loader: async ({ context: e }) => {
  await e.queryClient.ensureQueryData(W);
} }), Nt = () => import('../build/sources-CPVzUGRn.mjs'), G = createFileRoute("/_public/sources")({ component: lazyRouteComponent(Nt, "component", () => G.ssr) }), St = () => import('../build/partner-eGLwnrmV.mjs'), U = createFileRoute("/_public/partner")({ component: lazyRouteComponent(St, "component", () => U.ssr) }), Tt = () => import('../build/faq-BE3u91NJ.mjs'), J = createFileRoute("/_public/faq")({ component: lazyRouteComponent(Tt, "component", () => J.ssr) }), It = () => import('../build/contact-D_SEO6t2.mjs'), Y = createFileRoute("/_public/contact")({ component: lazyRouteComponent(It, "component", () => Y.ssr) }), zt = () => import('../build/about-CzFvV-7i.mjs'), X = createFileRoute("/_public/about")({ component: lazyRouteComponent(zt, "component", () => X.ssr) }), Ft = () => import('../build/reference-hrPmoKVH.mjs'), Z = createFileRoute("/_protected/reference")({ component: lazyRouteComponent(Ft, "component", () => Z.ssr) }), Lt = () => import('../build/signup-DUsuYvOo.mjs'), At = e$1.object({ email: e$1.pipe(e$1.string(), e$1.nonEmpty("Veuillez entrer votre email"), e$1.email("Veuillez entrer un email valide")), password: e$1.pipe(e$1.string(), e$1.minLength(8, "Le mot de passe doit contenir au moins 8 caract\xE8res"), e$1.maxLength(100, "Le mot de passe doit contenir au plus 100 caract\xE8res")), firstName: e$1.pipe(e$1.string(), e$1.nonEmpty("Veuillez entrer votre pr\xE9nom"), e$1.maxLength(100, "Le pr\xE9nom doit contenir au plus 100 caract\xE8res")), lastName: e$1.pipe(e$1.string(), e$1.nonEmpty("Veuillez entrer votre nom"), e$1.maxLength(100, "Le nom doit contenir au plus 100 caract\xE8res")) }), Vt = x("app_routes_auth_signup_tsx--signupFn_createServerFn_handler", "/_server"), cn = createServerFn().validator((e) => e$1.parse(At, e)).handler(Vt), ee = createFileRoute("/_auth/signup")({ component: lazyRouteComponent(Lt, "component", () => ee.ssr), beforeLoad: async ({ context: e }) => {
  var _a;
  if ((_a = e.session) == null ? void 0 : _a.user) throw redirect({ to: "/compte/entreprises" });
} }), Et = () => import('../build/reset-password-BTYIFHqi.mjs'), te = createFileRoute("/_auth/reset-password")({ component: lazyRouteComponent(Et, "component", () => te.ssr) }), kt = () => import('../build/login-CGV7q78E.mjs'), jt = e$1.object({ email: e$1.pipe(e$1.string(), e$1.email()), password: e$1.pipe(e$1.string(), e$1.minLength(8)) }), Mt = x("app_routes_auth_login_tsx--loginFn_createServerFn_handler", "/_server"), ln = createServerFn({ method: "POST" }).validator((e) => e$1.parse(jt, e)).handler(Mt), re = createFileRoute("/_auth/login")({ component: lazyRouteComponent(kt, "component", () => re.ssr), beforeLoad: async ({ context: e }) => {
  var _a;
  if ((_a = e.session) == null ? void 0 : _a.user) throw redirect({ to: "/compte/entreprises" });
} }), Ht = () => import('../build/forgot-password-zixOiwS0.mjs'), ne = createFileRoute("/_auth/forgot-password")({ component: lazyRouteComponent(Ht, "component", () => ne.ssr) }), Ot = x("app_lib_api_user_ts--getUserCompanies_createServerFn_handler", "/_server"), Dt = createServerFn({ method: "GET" }).handler(Ot), A = queryOptions({ queryKey: ["user", "companies"], queryFn: () => Dt(), staleTime: 1e3 * 60 * 60 * 24 }), Qt = () => import('../build/route-CWvq02Wb.mjs'), oe = createFileRoute("/_protected/_compte")({ component: lazyRouteComponent(Qt, "component", () => oe.ssr), loader: async ({ context: e }) => e.queryClient.ensureQueryData(A) || [] }), Bt = () => import('../build/index-CSm5gLhj.mjs'), se = createFileRoute("/_public/entrepreneurs/")({ component: lazyRouteComponent(Bt, "component", () => se.ssr) }), Wt = () => import('../build/index-DDQFu39X.mjs'), ae = createFileRoute("/_public/categories/")({ component: lazyRouteComponent(Wt, "component", () => ae.ssr) });
pgTable("companies", { id: uuid("id").primaryKey().defaultRandom(), status: varchar("status").$type().notNull().default("pending"), created_at: timestamp("created_at").notNull().defaultNow(), updated_at: timestamp("updated_at").notNull().defaultNow(), created_by: text("created_by").references(() => S.id, { onDelete: "cascade" }).notNull(), user_id: text("user_id").references(() => S.id, { onDelete: "cascade" }).notNull(), name: varchar("name", { length: 255 }).notNull().unique(), siret: varchar("siret", { length: 14 }).notNull(), business_owner: varchar("business_owner", { length: 255 }), description: varchar("description", { length: 1500 }), website: varchar("website", { length: 255 }), location: varchar("location", { length: 255 }), service_area: varchar("service_area", { length: 255 }), subdomain: varchar("subdomain", { length: 100 }), work_mode: varchar("work_mode").$type(), email: varchar("email", { length: 255 }), phone: varchar("phone", { length: 24 }), rqth: boolean("rqth").notNull().default(false), logo: jsonb("logo").$type(), gallery: jsonb("gallery").$type(), social_media: jsonb("social_media").$type().notNull().default({ facebook: "", calendly: "", linkedin: "", instagram: "" }) }, (e) => [index("company_search_index").using("gin", sql`to_tsvector('french', ${e.name} || ' ' || ${e.subdomain} || ' ' || ${e.description})`)]);
const Kt = ["remote", "hybrid", "onsite", "not_specified"], Gt = e$1.object({ name: e$1.pipe(e$1.string(), e$1.nonEmpty("Veuillez entrer le nom de l'entreprise"), e$1.maxLength(255, "Le nom de l'entreprise doit contenir au plus 255 caract\xE8res")), siret: e$1.pipe(e$1.string(), e$1.nonEmpty("Veuillez entrer le siret de l'entreprise"), e$1.length(14, "Le siret de l'entreprise doit contenir 14 caract\xE8res")), categories: e$1.pipe(e$1.array(e$1.string()), e$1.minLength(1, "Veuillez s\xE9lectionner au moins une cat\xE9gorie"), e$1.maxLength(3, "Veuillez s\xE9lectionner au plus 3 cat\xE9gories")), business_owner: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.nonEmpty("Veuillez entrer le nom du responsable de l'entreprise"), e$1.maxLength(255, "Le nom du responsable de l'entreprise doit contenir au plus 255 caract\xE8res"))]), description: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.maxLength(1500, "La description de l'entreprise doit contenir au plus 1500 caract\xE8res"))]), website: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.url("Veuillez entrer une url valide"))]), location: e$1.optional(e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.maxLength(255, "La localisation doit contenir au plus 255 caract\xE8res"))])), service_area: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.maxLength(255, "La zone de service doit contenir au plus 255 caract\xE8res"))]), subdomain: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.maxLength(100, "Le sous-domaine doit contenir au plus 100 caract\xE8res"))]), email: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.email("Veuillez entrer une adresse email valide"))]), phone: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.maxLength(24, "Le num\xE9ro de t\xE9l\xE9phone doit contenir au plus 24 caract\xE8res"))]), work_mode: e$1.nullable(e$1.picklist(Kt)), rqth: e$1.optional(e$1.boolean()), logo: e$1.optional(e$1.pipe(e$1.instance(File), e$1.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"], "Veuillez entrer un fichier valide pour le logo"), e$1.maxSize(1024 * 1024 * 3, "La taille du fichier doit \xEAtre inf\xE9rieure \xE0 3MB"))), gallery: e$1.optional(e$1.pipe(e$1.array(e$1.pipe(e$1.instance(File), e$1.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"], "Veuillez entrer un fichier valide pour la galerie"), e$1.maxSize(1024 * 1024 * 2, "La taille du fichier doit \xEAtre inf\xE9rieure \xE0 2MB"))), e$1.maxLength(2, "Veuillez entrer au plus 2 images"))), facebook: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.url("Veuillez entrer une url valide"), e$1.startsWith("https://www.facebook.com/", "Veuillez entrer une url facebook valide"))]), instagram: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.url("Veuillez entrer une url valide"), e$1.startsWith("https://www.instagram.com/", "Veuillez entrer une url instagram valide"))]), linkedin: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.url("Veuillez entrer une url valide"), e$1.startsWith("https://www.linkedin.com/company/", "Veuillez entrer une url linkedin valide"))]), calendly: e$1.union([e$1.literal(""), e$1.pipe(e$1.string(), e$1.url("Veuillez entrer une url valide"), e$1.startsWith("https://calendly.com/", "Veuillez entrer une url calendly valide"))]) }), Ut = x("app_lib_api_companies_ts--addCompany_createServerFn_handler", "/_server"), pn = createServerFn({ method: "POST" }).validator((e) => {
  const n = decode$1(e, { files: ["logo", "gallery"], arrays: ["categories", "gallery"], booleans: ["rqth"] });
  return e$1.parse(Gt, n);
}).handler(Ut), Jt = x("app_lib_api_companies_ts--deleteCompany_createServerFn_handler", "/_server"), dn = createServerFn({ method: "POST" }).validator((e) => e).handler(Jt), Yt = x("app_lib_api_companies_ts--getCompany_createServerFn_handler", "/_server"), Xt = createServerFn({ method: "GET" }).validator((e) => e).handler(Yt);
function Zt(e) {
  return queryOptions({ queryKey: ["company", e], queryFn: () => Xt({ data: e }), staleTime: 1e3 * 60 * 60 * 24 });
}
const er = () => import('../build/_name-BD5xRgOT.mjs'), tr = () => import('../build/_name-RW2G6P8z.mjs'), rr = () => import('../build/_name-soSzPmJt.mjs'), nr = e$1.object({ id: e$1.string() }), ie = createFileRoute("/_public/entreprises/$name")({ component: lazyRouteComponent(rr, "component", () => ie.ssr), pendingComponent: lazyRouteComponent(tr, "pendingComponent"), errorComponent: lazyRouteComponent(er, "errorComponent"), validateSearch: nr, loaderDeps: ({ search: { id: e } }) => ({ id: e }), loader: async ({ context: e, deps: { id: n } }) => {
  const o = await e.queryClient.ensureQueryData(Zt(n)), p = e.session;
  return { company: o, session: p };
} }), or = () => import('../build/_id-BXU5h-k8.mjs'), ce = createFileRoute("/_public/categories/$id")({ component: lazyRouteComponent(or, "component", () => ce.ssr) }), sr = () => import('../build/dashboard-DKZIHeQn.mjs'), le = createFileRoute("/_admin/admin/dashboard")({ component: lazyRouteComponent(sr, "component", () => le.ssr) }), ar = () => import('../build/preferences-Dr09Y8h4.mjs'), pe = createFileRoute("/_protected/_compte/compte/preferences")({ component: lazyRouteComponent(ar, "component", () => pe.ssr) }), ir = () => import('../build/index-Bra5vMkb.mjs'), de = createFileRoute("/_protected/_compte/compte/entreprises/")({ loader: async ({ context: e }) => await e.queryClient.ensureQueryData(A), component: lazyRouteComponent(ir, "component", () => de.ssr) }), cr = () => import('../build/preview-B1J1KjWU.mjs'), ue = createFileRoute("/_protected/_compte/compte/entreprises/preview")({ component: lazyRouteComponent(cr, "component", () => ue.ssr) }), lr = () => import('../build/add-E_Tm_DAB.mjs'), me = createFileRoute("/_protected/_compte/compte/entreprises/add")({ component: lazyRouteComponent(lr, "component", () => me.ssr), beforeLoad: async ({ context: e }) => {
  const n = await e.queryClient.ensureQueryData(A);
  if (n && (n == null ? void 0 : n.length) >= 3) throw toast.error("Vous ne pouvez pas cr\xE9er plus de 3 entreprises"), redirect({ to: "/compte/entreprises" });
}, loader: ({ context: e }) => e.queryClient.ensureQueryData(W) }), pr = () => import('../build/edit-BUeGVjF3.mjs'), he = createFileRoute("/_protected/_compte/compte/entreprises/$id/edit")({ component: lazyRouteComponent(pr, "component", () => he.ssr) }), V = Q.update({ id: "/_protected", getParentRoute: () => u }), ge = B.update({ id: "/_admin", getParentRoute: () => u }), dr = K.update({ id: "/_public/", path: "/", getParentRoute: () => u }), ur = G.update({ id: "/_public/sources", path: "/sources", getParentRoute: () => u }), mr = U.update({ id: "/_public/partner", path: "/partner", getParentRoute: () => u }), hr = J.update({ id: "/_public/faq", path: "/faq", getParentRoute: () => u }), gr = Y.update({ id: "/_public/contact", path: "/contact", getParentRoute: () => u }), _r = X.update({ id: "/_public/about", path: "/about", getParentRoute: () => u }), fr = Z.update({ id: "/reference", path: "/reference", getParentRoute: () => V }), br = ee.update({ id: "/_auth/signup", path: "/signup", getParentRoute: () => u }), yr = te.update({ id: "/_auth/reset-password", path: "/reset-password", getParentRoute: () => u }), Rr = re.update({ id: "/_auth/login", path: "/login", getParentRoute: () => u }), xr = ne.update({ id: "/_auth/forgot-password", path: "/forgot-password", getParentRoute: () => u }), q = oe.update({ id: "/_compte", getParentRoute: () => V }), vr = se.update({ id: "/_public/entrepreneurs/", path: "/entrepreneurs/", getParentRoute: () => u }), $r = ae.update({ id: "/_public/categories/", path: "/categories/", getParentRoute: () => u }), qr = ie.update({ id: "/_public/entreprises/$name", path: "/entreprises/$name", getParentRoute: () => u }), wr = ce.update({ id: "/_public/categories/$id", path: "/categories/$id", getParentRoute: () => u }), Cr = le.update({ id: "/admin/dashboard", path: "/admin/dashboard", getParentRoute: () => ge }), Pr = pe.update({ id: "/compte/preferences", path: "/compte/preferences", getParentRoute: () => q }), Nr = de.update({ id: "/compte/entreprises/", path: "/compte/entreprises/", getParentRoute: () => q }), Sr = ue.update({ id: "/compte/entreprises/preview", path: "/compte/entreprises/preview", getParentRoute: () => q }), Tr = me.update({ id: "/compte/entreprises/add", path: "/compte/entreprises/add", getParentRoute: () => q }), Ir = he.update({ id: "/compte/entreprises/$id/edit", path: "/compte/entreprises/$id/edit", getParentRoute: () => q }), zr = { AdminAdminDashboardRoute: Cr }, Fr = ge._addFileChildren(zr), Lr = { ProtectedCompteComptePreferencesRoute: Pr, ProtectedCompteCompteEntreprisesAddRoute: Tr, ProtectedCompteCompteEntreprisesPreviewRoute: Sr, ProtectedCompteCompteEntreprisesIndexRoute: Nr, ProtectedCompteCompteEntreprisesIdEditRoute: Ir }, Ar = q._addFileChildren(Lr), Vr = { ProtectedCompteRouteRoute: Ar, ProtectedReferenceRoute: fr }, Er = V._addFileChildren(Vr), kr = { AdminRouteRoute: Fr, ProtectedRouteRoute: Er, AuthForgotPasswordRoute: xr, AuthLoginRoute: Rr, AuthResetPasswordRoute: yr, AuthSignupRoute: br, PublicAboutRoute: _r, PublicContactRoute: gr, PublicFaqRoute: hr, PublicPartnerRoute: mr, PublicSourcesRoute: ur, PublicIndexRoute: dr, PublicCategoriesIdRoute: wr, PublicEntreprisesNameRoute: qr, PublicCategoriesIndexRoute: $r, PublicEntrepreneursIndexRoute: vr }, jr = u._addFileChildren(kr)._addFileTypes(), H = new QueryClient();
function Mr() {
  return routerWithQueryClient(createRouter$2({ routeTree: jr, context: { queryClient: H }, scrollRestoration: true }), H);
}
const un = createStartHandler({ createRouter: Mr, getRouterManifest: Xe })(Ge);

const handlers = [
  { route: '/_server', handler: P$1, lazy: false, middleware: true, method: undefined },
  { route: '/api', handler: d, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: un, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O$1(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const nitroApp = useNitroApp();
const handler = async (req) => {
  const url = new URL(req.url);
  const relativeUrl = `${url.pathname}${url.search}`;
  const r = await nitroApp.localCall({
    url: relativeUrl,
    headers: req.headers,
    method: req.method,
    body: req.body
  });
  const headers = normalizeResponseHeaders({
    ...getCacheHeaders(url.pathname),
    ...r.headers
  });
  return new Response(r.body, {
    status: r.status,
    headers
  });
};
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
function normalizeResponseHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of Object.entries(headers)) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else if (header !== void 0) {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}
function getCacheHeaders(url) {
  const { isr } = getRouteRulesForPath(url);
  if (isr) {
    const maxAge = typeof isr === "number" ? isr : ONE_YEAR_IN_SECONDS;
    const revalidateDirective = typeof isr === "number" ? `stale-while-revalidate=${ONE_YEAR_IN_SECONDS}` : "must-revalidate";
    return {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": `public, max-age=${maxAge}, ${revalidateDirective}, durable`
    };
  }
  return {};
}

export { A, Gt as G, W, Zt as Z, ce as a, dn as b, cn as c, de as d, handler as e, he as h, ie as i, k, ln as l, me as m, pn as p, rt as r };
//# sourceMappingURL=nitro.mjs.map
