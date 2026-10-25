import { createRequire } from "node:module"; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap2 = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair2 = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar2 = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar2(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap2;
    exports.isNode = isNode;
    exports.isPair = isPair2;
    exports.isScalar = isScalar2;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path4) {
      const ctrl = callVisitor(key, node, visitor, path4);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path4, ctrl);
        return visit_(key, ctrl, visitor, path4);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path4 = Object.freeze(path4.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path4);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path4 = Object.freeze(path4.concat(node));
          const ck = visit_("key", node.key, visitor, path4);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path4);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path4) {
      const ctrl = await callVisitor(key, node, visitor, path4);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path4, ctrl);
        return visitAsync_(key, ctrl, visitor, path4);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path4 = Object.freeze(path4.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path4);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path4 = Object.freeze(path4.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path4);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path4);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path4) {
      if (typeof visitor === "function")
        return visitor(key, node, path4);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path4);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path4);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path4);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path4);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path4);
      return void 0;
    }
    function replaceNode(key, path4, node) {
      const parent = path4[path4.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag2) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag2.startsWith(prefix))
            return handle + escapeTagName(tag2.substring(prefix.length));
        }
        return tag2[0] === "!" ? tag2 : `!<${tag2}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path4, value) {
      let v = value;
      for (let i = path4.length - 1; i >= 0; --i) {
        const k = path4[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path4) => path4 == null || typeof path4 === "object" && !!path4[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path4, value) {
        if (isEmptyPath(path4))
          this.add(value);
        else {
          const [key, ...rest] = path4;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path4) {
        const [key, ...rest] = path4;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path4, keepScalar) {
        const [key, ...rest] = path4;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path4) {
        const [key, ...rest] = path4;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path4, value) {
        const [key, ...rest] = path4;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text2, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text2;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text2.length <= endStep)
        return text2;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split2 = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text2, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text2[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text2[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text2, i, indent.length);
          end = i + indent.length + endStep;
          split2 = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text2[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split2 = i;
          }
          if (i >= end) {
            if (split2) {
              folds.push(split2);
              end = split2 + endStep;
              split2 = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text2[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text2;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split2 = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text2;
      if (onFold)
        onFold();
      let res = text2.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text2.length;
        if (fold === 0)
          res = `
${indent}${text2.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text2[fold]}\\`;
          res += `
${indent}${text2.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text2, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text2[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text2[++i];
        } else {
          do {
            ch = text2[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text2[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag2) => tag2.default && tag2.tag !== "tag:yaml.org,2002:str" && tag2.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag2 = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag2)
        props.push(doc.directives.tagString(tag2));
      return props.join(" ");
    }
    function stringify2(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify2;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify2.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify2.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag2) => tag2.tag === merge.tag && tag2.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify2 = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify2.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify3 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify3(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify2.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify2.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag: tag2, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag2 || tag2 === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag2 of customTags)
          tags = tags.concat(tag2);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag2) => {
        const tagObj = typeof tag2 === "string" ? tagsByName[tag2] : tag2;
        if (!tagObj) {
          const tagName = JSON.stringify(tag2);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify2.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify2.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify2.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path4, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path4, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag: tag2 } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag2, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path4) {
        if (Collection.isEmptyPath(path4)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path4) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path4, keepScalar) {
        if (Collection.isEmptyPath(path4))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path4, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path4) {
        if (Collection.isEmptyPath(path4))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path4) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path4, value) {
        if (Collection.isEmptyPath(path4)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path4), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path4, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag2 = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag2)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag2)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag2 = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag2)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag: tag2,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st2 of key.end)
              if (st2.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st2 of it.start)
              if (st2.type === "newline")
                return true;
            if (it.sep) {
              for (const st2 of it.sep)
                if (st2.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag2) {
      const NodeClass = tag2?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag2) {
      const NodeClass = tag2?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag2) {
      const isMap2 = fc.start.source === "{";
      const fcName = isMap2 ? "flow map" : "flow sequence";
      const NodeClass = tag2?.nodeClass ?? (isMap2 ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap2 && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st2 of start) {
              switch (st2.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st2.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap2 && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap2 && !props.found && ctx.options.strict) {
              if (sep)
                for (const st2 of sep) {
                  if (st2 === valueProps.found)
                    break;
                  if (st2.type === "newline") {
                    onError(st2, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap2) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap2 ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag2) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag2) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag2) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag2);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag2 = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag2) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag2 = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag2);
      const res = tag2.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag2?.format)
        node.format = tag2.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split2 = source.split(/\n( *)/);
      const first = split2[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split2.length; i += 2)
        lines.push([split2[i], split2[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag2;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag2 = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag2 = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag2 = findScalarTagByTest(ctx, value, token, onError);
      else
        tag2 = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag2.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag2.format)
        scalar.format = tag2.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag2 of schema.tags) {
        if (!tag2.collection && tag2.tag === tagName) {
          if (tag2.default && tag2.test)
            matchWithTest.push(tag2);
          else
            return tag2;
        }
      }
      for (const tag2 of matchWithTest)
        if (tag2.test?.test(value))
          return tag2;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag2 = schema.tags.find((tag3) => (tag3.default === true || atKey && tag3.default === "key") && tag3.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag3) => tag3.default && tag3.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag2.tag !== compat.tag) {
          const ts = directives.tagString(tag2.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag2;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st2 = before[i];
          switch (st2.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st2.source.length;
              continue;
          }
          st2 = before[++i];
          while (st2?.type === "space") {
            offset += st2.source.length;
            st2 = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag: tag2 } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag2)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag2, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag2 ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag: tag2, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag2, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st2 of end)
          switch (st2.type) {
            case "space":
            case "comment":
              props.push(st2);
              break;
            case "newline":
              props.push(st2);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st2) => st2.type === "space" || st2.type === "comment" || st2.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify2 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st2 of token.end)
            res += st2.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st2 of token.end)
              res += st2.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st2 of token.end)
              res += st2.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st2 of start)
        res += st2.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st2 of sep)
          res += st2.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify2;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path4) => {
      let item = cst;
      for (const [field, index] of path4) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path4) => {
      const parent = visit.itemAtPath(cst, path4.slice(0, -1));
      const field = path4[path4.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path4, item, visitor) {
      let ctrl = visitor(item, path4);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path4.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path4);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path4) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar2 = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar2;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter2 = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter2;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st2 = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st2;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st2) => st2.type !== "comment" || st2.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st2 = it.sep[i];
              switch (st2.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st2.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs4 = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs4, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs4);
              } else {
                Object.assign(it, { key: fs4, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs4 = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs4, sep: [] });
              else if (it.sep)
                this.stack.push(fs4);
              else
                Object.assign(it, { key: fs4, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st2) => st2.type === "newline" || st2.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument2(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument2(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify2(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument2;
    exports.stringify = stringify2;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// server/workbench-sync/src/index.ts
import crypto3 from "node:crypto";

// src/sync/text.ts
var import_yaml = __toESM(require_dist(), 1);
var SyncError = class extends Error {
  constructor(message, line) {
    super(message);
    this.line = line;
  }
};
function parseYaml(text2, offset = 0) {
  const counter = new import_yaml.LineCounter();
  const doc = (0, import_yaml.parseDocument)(text2, { lineCounter: counter, uniqueKeys: true, prettyErrors: false });
  const error = doc.errors[0];
  if (error) {
    const last = Math.max(1, text2.replace(/\n$/, "").split("\n").length);
    throw new SyncError(
      `YAML \u65E0\u6CD5\u89E3\u6790\uFF1A${error.message.split("\n")[0]}`,
      Math.min(counter.linePos(error.pos[0]).line, last) + offset
    );
  }
  const lines = /* @__PURE__ */ new Map();
  const walk = (node, prefix) => {
    if (!(0, import_yaml.isMap)(node)) return;
    for (const pair of node.items) {
      if (!(0, import_yaml.isPair)(pair) || !(0, import_yaml.isScalar)(pair.key)) continue;
      const key = prefix + String(pair.key.value);
      if (pair.key.range) lines.set(key, counter.linePos(pair.key.range[0]).line + offset);
      walk(pair.value, key + ".");
    }
  };
  walk(doc.contents, "");
  const data = doc.contents === null ? {} : doc.toJS({ maxAliasCount: 50 });
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new SyncError("YAML \u9876\u5C42\u5E94\u662F\u300C\u952E: \u503C\u300D\u7684\u6620\u5C04\u3002", offset + 1);
  return { data, line: (key) => lines.get(key) };
}
function renderYaml(data) {
  return Object.keys(data).length ? (0, import_yaml.stringify)(data, { lineWidth: 0, minContentWidth: 0 }) : "";
}
function splitFront(text2) {
  text2 = text2.replace(/\r\n/g, "\n");
  if (!text2.startsWith("---\n")) return { yaml: parseYaml(""), body: text2 };
  const end = text2.indexOf("\n---\n", 3), tail = text2.endsWith("\n---") ? text2.length - 4 : -1, close = end >= 0 ? end : tail;
  if (close < 0) throw new SyncError("frontmatter \u7F3A\u5C11\u7ED3\u675F\u7684 ---\u3002", 1);
  return { yaml: parseYaml(text2.slice(4, close + 1), 1), body: text2.slice(close + 5) };
}
function joinFront(data, body) {
  return `---
${renderYaml(data)}---
${body}`;
}
var illegal = /[/\\:*?"<>|\u0000-\u001f\u007f]/g;
function fileStem(title) {
  const stem = title.replace(illegal, "_").trim();
  return stem === "." || stem === ".." ? "_" : stem;
}
function uniqueNames(items, key, title, fallback) {
  const names2 = /* @__PURE__ */ new Map(), used = /* @__PURE__ */ new Set();
  for (const item of items) {
    const t = title(item);
    let stem = fileStem(t) || fileStem(fallback(item));
    if (used.has(stem)) stem = `${stem} ~${fileStem(key(item))}`;
    for (let n = 2; used.has(stem); n++) stem = `${fileStem(t) || "_"} ~${fileStem(key(item))}-${n}`;
    used.add(stem);
    names2.set(key(item), { stem, explicit: stem !== t });
  }
  return names2;
}
var getPath = (source, path4) => path4.reduce((v, k) => v == null ? void 0 : v[k], source);
function setPath(target, path4, value) {
  let node = target;
  for (const key of path4.slice(0, -1)) {
    if (node[key] == null || typeof node[key] !== "object") node[key] = {};
    node = node[key];
  }
  node[path4.at(-1)] = value;
}
var setNested = (target, name, value) => setPath(target, name.split("."), value);
var getNested = (source, name) => getPath(source, name.split("."));
function writeFields(fields3, source, out = {}) {
  for (const field of fields3) {
    let value = getPath(source, field.path);
    if (value === void 0) continue;
    if (field.invert && typeof value === "boolean") value = !value;
    const label = field.labels?.find(([raw]) => raw === value);
    setNested(out, field.name, label ? label[1] : value);
  }
  return out;
}
function typeError(field, value) {
  if (value === null) return !field.nullable && field.type !== "any";
  if (field.type === "any") return false;
  if (field.type === "strings") return !Array.isArray(value) || value.some((v) => typeof v !== "string");
  return typeof value !== field.type;
}
var typeNames = {
  string: "\u6587\u672C",
  number: "\u6570\u5B57",
  boolean: "true \u6216 false",
  strings: "\u6587\u672C\u5217\u8868",
  any: "\u503C"
};
function readFields(fields3, yaml, base, allowed = []) {
  const result = structuredClone(base), known = /* @__PURE__ */ new Set([...fields3.map((f) => f.name), ...allowed]);
  const check = (data, prefix) => {
    for (const [key, value] of Object.entries(data)) {
      const name = prefix + key;
      if (known.has(name)) continue;
      if ([...known].some((k) => k.startsWith(name + ".")) && value && typeof value === "object" && !Array.isArray(value))
        check(value, name + ".");
      else throw new SyncError(`\u672A\u77E5\u7684\u952E\u300C${name}\u300D\u3002`, yaml.line(name));
    }
  };
  check(yaml.data, "");
  for (const field of fields3) {
    let value = getNested(yaml.data, field.name);
    if (value === void 0) continue;
    if (field.labels && typeof value === "string") {
      const hit = field.labels.find(([, label]) => label === value);
      if (hit) value = hit[0];
      else if (field.type !== "string")
        throw new SyncError(
          `\u300C${field.name}\u300D\u5E94\u4E3A ${field.labels.map(([, l]) => l).join(" / ")} \u4E4B\u4E00\u3002`,
          yaml.line(field.name)
        );
    }
    if (typeError(field, value))
      throw new SyncError(
        `\u300C${field.name}\u300D\u5E94\u4E3A${typeNames[field.type]}${field.nullable ? "\u6216 null" : ""}\u3002`,
        yaml.line(field.name)
      );
    if (field.invert && typeof value === "boolean") value = !value;
    setPath(result, field.path, value);
  }
  return result;
}
function otherKeys(fields3, source, hidden2 = []) {
  const covered = /* @__PURE__ */ new Set([...fields3.filter((f) => f.path.length === 1).map((f) => f.path[0]), ...hidden2]);
  return Object.fromEntries(Object.entries(source).filter(([k]) => !covered.has(k)));
}
var sameData = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// src/sync/world.ts
var positions = [
  [0, "\u89D2\u8272\u5B9A\u4E49\u4E4B\u524D"],
  [1, "\u89D2\u8272\u5B9A\u4E49\u4E4B\u540E"],
  [2, "\u4F5C\u8005\u6CE8\u91CA\u4E4B\u524D"],
  [3, "\u4F5C\u8005\u6CE8\u91CA\u4E4B\u540E"],
  [4, "\u6307\u5B9A\u6DF1\u5EA6"],
  [5, "\u793A\u4F8B\u4E4B\u524D"],
  [6, "\u793A\u4F8B\u4E4B\u540E"],
  [7, "Outlet"]
];
var roles = [
  [0, "\u7CFB\u7EDF"],
  [1, "\u7528\u6237"],
  [2, "\u52A9\u624B"]
];
var fields = [
  { name: "\u5173\u952E\u8BCD", path: ["key"], type: "strings" },
  { name: "\u8F85\u52A9\u5173\u952E\u8BCD", path: ["keysecondary"], type: "strings" },
  { name: "\u4F7F\u7528\u8F85\u52A9\u5173\u952E\u8BCD", path: ["selective"], type: "boolean" },
  {
    name: "\u903B\u8F91",
    path: ["selectiveLogic"],
    type: "number",
    labels: [
      [0, "\u4E0E\u4EFB\u610F"],
      [1, "\u975E\u5168\u90E8"],
      [2, "\u975E\u4EFB\u610F"],
      [3, "\u4E0E\u5168\u90E8"]
    ]
  },
  { name: "\u5E38\u9A7B", path: ["constant"], type: "boolean" },
  { name: "\u5411\u91CF\u5316", path: ["vectorized"], type: "boolean" },
  { name: "\u542F\u7528", path: ["disable"], type: "boolean", invert: true },
  { name: "\u6CE8\u5165\u4F4D\u7F6E", path: ["position"], type: "number", labels: positions },
  { name: "\u6DF1\u5EA6", path: ["depth"], type: "number" },
  { name: "\u89D2\u8272", path: ["role"], type: "number", nullable: true, labels: roles },
  { name: "\u987A\u5E8F", path: ["order"], type: "number" },
  { name: "\u6982\u7387", path: ["probability"], type: "number" },
  { name: "\u542F\u7528\u6982\u7387", path: ["useProbability"], type: "boolean" },
  { name: "\u626B\u63CF\u6DF1\u5EA6", path: ["scanDepth"], type: "number", nullable: true },
  { name: "\u7C98\u6027", path: ["sticky"], type: "number", nullable: true },
  { name: "\u51B7\u5374", path: ["cooldown"], type: "number", nullable: true },
  { name: "\u5EF6\u8FDF", path: ["delay"], type: "number", nullable: true },
  { name: "\u5305\u542B\u7EC4", path: ["group"], type: "string" },
  { name: "\u7EC4\u6743\u91CD", path: ["groupWeight"], type: "number" },
  { name: "\u8986\u76D6\u5305\u542B\u7EC4", path: ["groupOverride"], type: "boolean" },
  { name: "\u5206\u7EC4\u8BC4\u5206", path: ["useGroupScoring"], type: "boolean", nullable: true },
  { name: "\u6392\u9664\u9012\u5F52", path: ["excludeRecursion"], type: "boolean" },
  { name: "\u963B\u6B62\u540E\u7EED\u9012\u5F52", path: ["preventRecursion"], type: "boolean" },
  { name: "\u4EC5\u9012\u5F52\u65F6\u89E6\u53D1", path: ["delayUntilRecursion"], type: "any" },
  { name: "\u5339\u914D\u5B8C\u6574\u5355\u8BCD", path: ["matchWholeWords"], type: "boolean", nullable: true },
  { name: "\u533A\u5206\u5927\u5C0F\u5199", path: ["caseSensitive"], type: "boolean", nullable: true }
];
function template(uid) {
  return {
    uid,
    key: [],
    keysecondary: [],
    comment: "",
    content: "",
    constant: false,
    vectorized: false,
    selective: true,
    selectiveLogic: 0,
    addMemo: true,
    order: 100,
    position: 0,
    disable: false,
    ignoreBudget: false,
    excludeRecursion: false,
    preventRecursion: false,
    matchPersonaDescription: false,
    matchCharacterDescription: false,
    matchCharacterPersonality: false,
    matchCharacterDepthPrompt: false,
    matchScenario: false,
    matchCreatorNotes: false,
    delayUntilRecursion: 0,
    probability: 100,
    useProbability: true,
    depth: 4,
    outletName: "",
    group: "",
    groupOverride: false,
    groupWeight: 100,
    scanDepth: null,
    caseSensitive: null,
    matchWholeWords: null,
    useGroupScoring: null,
    automationId: "",
    role: 0,
    sticky: null,
    cooldown: null,
    delay: null,
    triggers: [],
    displayIndex: uid
  };
}
var entriesOf = (book) => Object.entries(book?.entries ?? {}).sort(
  ([a, x], [b, y]) => (x.displayIndex ?? Number(a)) - (y.displayIndex ?? Number(b)) || Number(a) - Number(b)
);
function names(book) {
  return uniqueNames(
    entriesOf(book),
    ([key]) => key,
    ([, e]) => String(e.comment ?? ""),
    ([key]) => `\u6761\u76EE ${key}`
  );
}
var stemOf = (file) => {
  if (!/^[^/]+\.md$/.test(file)) throw new SyncError("\u4E16\u754C\u4E66\u6761\u76EE\u662F\u4E66\u540D\u76EE\u5F55\u4E0B\u7684 .md \u6587\u4EF6\u3002");
  return file.slice(0, -3);
};
var worldCodec = {
  files(book) {
    const files2 = /* @__PURE__ */ new Map(), map = names(book);
    for (const [key, entry] of entriesOf(book)) {
      const name = map.get(key), front = { uid: entry.uid ?? Number(key) };
      if (name.explicit) front.\u6807\u9898 = String(entry.comment ?? "");
      files2.set(`${name.stem}.md`, joinFront(writeFields(fields, entry, front), String(entry.content ?? "")));
    }
    return files2;
  },
  write(book, file, text2) {
    const stem = stemOf(file), { yaml, body } = splitFront(text2), map = names(book), byFile = [...map].find(([, n]) => n.stem === stem)?.[0], uid = yaml.data.uid;
    if (uid !== void 0 && (typeof uid !== "number" || !Number.isInteger(uid)))
      throw new SyncError("uid \u5E94\u4E3A\u6574\u6570\u3002", yaml.line("uid"));
    if (yaml.data.\u6807\u9898 !== void 0 && typeof yaml.data.\u6807\u9898 !== "string")
      throw new SyncError("\u300C\u6807\u9898\u300D\u5E94\u4E3A\u6587\u672C\u3002", yaml.line("\u6807\u9898"));
    const entries = entriesOf(book);
    let key = uid === void 0 ? byFile : entries.find(([k, e]) => (e.uid ?? Number(k)) === uid)?.[0];
    if (uid !== void 0 && !key)
      throw new SyncError(`uid ${uid} \u4E0D\u5728\u8FD9\u672C\u4E16\u754C\u4E66\u91CC\uFF1B\u65B0\u5EFA\u6761\u76EE\u8BF7\u5220\u53BB uid\u3002`, yaml.line("uid"));
    if (key && byFile !== key)
      throw new SyncError(
        `uid ${uid} \u5C5E\u4E8E\u300C${map.get(key).stem}.md\u300D\uFF1B\u65B0\u5EFA\u6761\u76EE\u8BF7\u5220\u53BB uid\uFF0C\u6539\u540D\u8BF7\u91CD\u547D\u540D\u6587\u4EF6\u3002`,
        yaml.line("uid")
      );
    let entry;
    if (key) entry = book.entries[key];
    else {
      const next = Math.max(-1, ...entries.map(([k, e]) => Number(e.uid ?? k))) + 1;
      key = String(next);
      entry = template(next);
    }
    const updated = readFields(fields, yaml, entry, ["uid", "\u6807\u9898"]);
    updated.comment = typeof yaml.data.\u6807\u9898 === "string" ? yaml.data.\u6807\u9898 : key === byFile && map.get(key).explicit ? entry.comment : stem;
    updated.content = body;
    return { ...book, entries: { ...book.entries, [key]: updated } };
  },
  remove(book, file) {
    const stem = stemOf(file), key = [...names(book)].find(([, n]) => n.stem === stem)?.[0];
    if (!key) throw new SyncError("\u6761\u76EE\u4E0D\u5B58\u5728\u3002");
    const entries = { ...book.entries };
    delete entries[key];
    return { ...book, entries };
  },
  rename(book, from, to) {
    const map = names(book), key = [...map].find(([, n]) => n.stem === stemOf(from))?.[0], stem = stemOf(to);
    if (!key) throw new SyncError("\u6761\u76EE\u4E0D\u5B58\u5728\u3002");
    if ([...map].some(([k, n]) => k !== key && n.stem === stem)) throw new SyncError(`\u5DF2\u6709\u6761\u76EE\u300C${stem}\u300D\u3002`);
    return { ...book, entries: { ...book.entries, [key]: { ...book.entries[key], comment: stem } } };
  }
};

// src/sync/character.ts
var texts = [
  ["\u89D2\u8272\u63CF\u8FF0.md", "description"],
  ["\u6027\u683C.md", "personality"],
  ["\u573A\u666F.md", "scenario"],
  ["\u7B2C\u4E00\u6761\u6D88\u606F.md", "first_mes"],
  ["\u5BF9\u8BDD\u793A\u4F8B.md", "mes_example"],
  ["\u7CFB\u7EDF\u63D0\u793A\u8BCD.md", "system_prompt"],
  ["\u5386\u53F2\u540E\u6307\u4EE4.md", "post_history_instructions"],
  ["\u521B\u4F5C\u8005\u6CE8\u91CA.md", "creator_notes"]
];
var CARD = "\u89D2\u8272\u5361.yaml";
var GREETINGS = "\u5907\u9009\u5F00\u573A\u767D";
var fields2 = [
  { name: "\u540D\u79F0", path: ["name"], type: "string" },
  { name: "\u6807\u7B7E", path: ["tags"], type: "strings" },
  { name: "\u521B\u5EFA\u8005", path: ["creator"], type: "string" },
  { name: "\u89D2\u8272\u7248\u672C", path: ["character_version"], type: "string" },
  { name: "\u4E16\u754C\u4E66", path: ["extensions", "world"], type: "string" },
  { name: "\u6536\u85CF", path: ["extensions", "fav"], type: "boolean" },
  { name: "\u53D1\u8A00\u79EF\u6781\u6027", path: ["extensions", "talkativeness"], type: "any" },
  { name: "\u6DF1\u5EA6\u63D0\u793A\u8BCD.\u5185\u5BB9", path: ["extensions", "depth_prompt", "prompt"], type: "string" },
  { name: "\u6DF1\u5EA6\u63D0\u793A\u8BCD.\u6DF1\u5EA6", path: ["extensions", "depth_prompt", "depth"], type: "number" },
  {
    name: "\u6DF1\u5EA6\u63D0\u793A\u8BCD.\u6CE8\u5165\u89D2\u8272",
    path: ["extensions", "depth_prompt", "role"],
    type: "string",
    labels: [
      ["system", "\u7CFB\u7EDF"],
      ["user", "\u7528\u6237"],
      ["assistant", "\u52A9\u624B"]
    ]
  }
];
var greetingFile = (i, count) => `${GREETINGS}/${String(i + 1).padStart(Math.max(2, String(count).length), "0")}.md`;
function greetingIndex(file) {
  const match = file.match(/^备选开场白\/(\d+)\.md$/);
  return match ? Number(match[1]) - 1 : -1;
}
var characterCodec = {
  dirs: [GREETINGS],
  files(data) {
    const files2 = /* @__PURE__ */ new Map([[CARD, renderYaml(writeFields(fields2, data))]]);
    for (const [file, key] of texts) files2.set(file, String(data[key] ?? ""));
    const greetings = Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [];
    greetings.forEach((text2, i) => files2.set(greetingFile(i, greetings.length), String(text2 ?? "")));
    return files2;
  },
  write(data, file, text2) {
    text2 = text2.replace(/\r\n/g, "\n");
    if (file === CARD) {
      const next = readFields(fields2, parseYaml(text2), data);
      if (typeof next.name !== "string" || !next.name.trim()) throw new SyncError("\u300C\u540D\u79F0\u300D\u4E0D\u80FD\u4E3A\u7A7A\u3002", 1);
      return next;
    }
    const field = texts.find(([name]) => name === file)?.[1];
    if (field) return text2 === "" && data[field] === void 0 ? data : { ...data, [field]: text2 };
    const index = greetingIndex(file), greetings = [...Array.isArray(data.alternate_greetings) ? data.alternate_greetings : []];
    if (index < 0) throw new SyncError("\u89D2\u8272\u76EE\u5F55\u91CC\u53EA\u80FD\u5199\u5DF2\u6709\u7684\u6587\u4EF6\u548C\u300C\u5907\u9009\u5F00\u573A\u767D/NN.md\u300D\u3002");
    if (index > greetings.length)
      throw new SyncError(
        `\u5907\u9009\u5F00\u573A\u767D\u8BF7\u6309\u987A\u5E8F\u7F16\u53F7\uFF1A\u4E0B\u4E00\u4E2A\u662F ${greetingFile(greetings.length, greetings.length + 1)}\u3002`
      );
    greetings[index] = text2;
    return { ...data, alternate_greetings: greetings };
  },
  remove(data, file) {
    const index = greetingIndex(file), greetings = [...data.alternate_greetings ?? []];
    if (index < 0 || index >= greetings.length) throw new SyncError("\u53EA\u80FD\u5220\u9664\u5907\u9009\u5F00\u573A\u767D\u3002");
    greetings.splice(index, 1);
    return { ...data, alternate_greetings: greetings };
  }
};
function mirrorCard(card, data) {
  return {
    ...card,
    name: data.name,
    description: data.description ?? "",
    personality: data.personality ?? "",
    scenario: data.scenario ?? "",
    first_mes: data.first_mes ?? "",
    mes_example: data.mes_example ?? "",
    creatorcomment: data.creator_notes ?? "",
    tags: data.tags ?? [],
    talkativeness: data.extensions?.talkativeness ?? card.talkativeness,
    fav: data.extensions?.fav ?? card.fav,
    data
  };
}

// src/sync/preset.ts
var PARAMS = "\u53C2\u6570.yaml";
var PROMPTS = "\u63D0\u793A\u8BCD";
var hidden = ["prompts", "prompt_order", "proxy_password"];
var params = [
  ["temperature", "\u6E29\u5EA6", "number"],
  ["top_p", "Top P", "number"],
  ["top_k", "Top K", "number"],
  ["top_a", "Top A", "number"],
  ["min_p", "Min P", "number"],
  ["frequency_penalty", "\u9891\u7387\u60E9\u7F5A", "number"],
  ["presence_penalty", "\u5B58\u5728\u60E9\u7F5A", "number"],
  ["repetition_penalty", "\u91CD\u590D\u60E9\u7F5A", "number"],
  ["openai_max_tokens", "\u6700\u5927\u56DE\u590D Token", "number"],
  ["openai_max_context", "\u4E0A\u4E0B\u6587 Token \u4E0A\u9650", "number"],
  ["stream_openai", "\u6D41\u5F0F\u4F20\u8F93", "boolean"],
  ["show_thoughts", "\u8BF7\u6C42\u601D\u7EF4\u94FE", "boolean"],
  ["reasoning_effort", "\u601D\u8003\u5F3A\u5EA6", "string"],
  ["seed", "\u968F\u673A\u79CD\u5B50", "number"],
  ["n", "\u56DE\u590D\u6570\u91CF", "number"]
].map(([key, name, type]) => ({ name, path: [key], type }));
var promptFields = [
  {
    name: "\u89D2\u8272",
    path: ["role"],
    type: "string",
    labels: [
      ["system", "\u7CFB\u7EDF"],
      ["user", "\u7528\u6237"],
      ["assistant", "\u52A9\u624B"]
    ]
  },
  {
    name: "\u6CE8\u5165\u4F4D\u7F6E",
    path: ["injection_position"],
    type: "number",
    labels: [
      [0, "\u6309\u5217\u8868\u987A\u5E8F"],
      [1, "\u6307\u5B9A\u804A\u5929\u6DF1\u5EA6"]
    ]
  },
  { name: "\u6DF1\u5EA6", path: ["injection_depth"], type: "number" },
  { name: "\u987A\u5E8F", path: ["injection_order"], type: "number" },
  { name: "\u6807\u8BB0", path: ["marker"], type: "boolean" },
  { name: "\u7CFB\u7EDF\u63D0\u793A\u8BCD", path: ["system_prompt"], type: "boolean" },
  { name: "\u7981\u6B62\u89D2\u8272\u8986\u76D6", path: ["forbid_overrides"], type: "boolean" },
  { name: "\u751F\u6210\u7C7B\u578B", path: ["injection_trigger"], type: "strings" }
];
function orderOf(preset) {
  const lists = Array.isArray(preset.prompt_order) ? preset.prompt_order : [];
  return (lists.find((l) => l.character_id === 100001) ?? lists.find((l) => l.character_id === 1e5) ?? lists[0])?.order;
}
function promptList(preset) {
  const prompts = Array.isArray(preset.prompts) ? preset.prompts : [], order = orderOf(preset) ?? [], listed = order.map((o) => prompts.find((p) => p.identifier === o.identifier)).filter(Boolean);
  return [...listed, ...prompts.filter((p) => !listed.includes(p))].map((prompt, i, all) => {
    const name = String(prompt.name ?? ""), stem = fileStem(name);
    return {
      prompt,
      enabled: order.find((o) => o.identifier === prompt.identifier)?.enabled,
      file: `${PROMPTS}/${String(i + 1).padStart(Math.max(2, String(all.length).length), "0")}-${stem || "_"}.md`,
      explicit: stem !== name
    };
  });
}
function promptName(file) {
  const match = file.match(/^提示词\/(?:\d+-)?([^/]+)\.md$/);
  if (!match) throw new SyncError("\u63D0\u793A\u8BCD\u662F\u300C\u63D0\u793A\u8BCD/\u5E8F\u53F7-\u540D\u79F0.md\u300D\u3002");
  return match[1];
}
var presetCodec = {
  dirs: [PROMPTS],
  files(preset) {
    const out = writeFields(params, preset), other = otherKeys(params, preset, hidden);
    if (Object.keys(other).length) out.\u5176\u4ED6 = other;
    const files2 = /* @__PURE__ */ new Map([[PARAMS, renderYaml(out)]]);
    for (const { prompt, enabled, file, explicit } of promptList(preset)) {
      const front = { identifier: prompt.identifier };
      if (explicit) front.\u540D\u79F0 = String(prompt.name ?? "");
      if (enabled !== void 0) front.\u542F\u7528 = enabled;
      files2.set(file, joinFront(writeFields(promptFields, prompt, front), String(prompt.content ?? "")));
    }
    return files2;
  },
  write(preset, file, text2) {
    if (file === PARAMS) {
      const yaml2 = parseYaml(text2.replace(/\r\n/g, "\n")), next2 = readFields(params, yaml2, preset, ["\u5176\u4ED6"]), other = yaml2.data.\u5176\u4ED6 ?? {};
      if (!other || typeof other !== "object" || Array.isArray(other))
        throw new SyncError("\u300C\u5176\u4ED6\u300D\u5E94\u662F\u300C\u952E: \u503C\u300D\u7684\u6620\u5C04\u3002", yaml2.line("\u5176\u4ED6"));
      for (const key of Object.keys(other))
        if (hidden.includes(key) || params.some((p) => p.path[0] === key))
          throw new SyncError(`\u300C\u5176\u4ED6\u300D\u91CC\u4E0D\u80FD\u5199 ${key}\u3002`, yaml2.line(`\u5176\u4ED6.${key}`));
      return { ...next2, ...other };
    }
    const name = promptName(file), { yaml, body } = splitFront(text2), list = promptList(preset), identifier = yaml.data.identifier, byFile = list.find((p) => p.file === file);
    if (identifier !== void 0 && typeof identifier !== "string")
      throw new SyncError("identifier \u5E94\u4E3A\u6587\u672C\u3002", yaml.line("identifier"));
    if (yaml.data.\u540D\u79F0 !== void 0 && typeof yaml.data.\u540D\u79F0 !== "string")
      throw new SyncError("\u300C\u540D\u79F0\u300D\u5E94\u4E3A\u6587\u672C\u3002", yaml.line("\u540D\u79F0"));
    if (yaml.data.\u542F\u7528 !== void 0 && typeof yaml.data.\u542F\u7528 !== "boolean")
      throw new SyncError("\u300C\u542F\u7528\u300D\u5E94\u4E3A true \u6216 false\u3002", yaml.line("\u542F\u7528"));
    const found = identifier === void 0 ? byFile : list.find((p) => p.prompt.identifier === identifier);
    if (found && byFile !== found)
      throw new SyncError(
        `identifier ${identifier} \u5C5E\u4E8E\u300C${found.file}\u300D\uFF1B\u65B0\u5EFA\u63D0\u793A\u8BCD\u8BF7\u5220\u53BB identifier\uFF0C\u6539\u540D\u8BF7\u91CD\u547D\u540D\u6587\u4EF6\u3002`,
        yaml.line("identifier")
      );
    const prompts = [...preset.prompts ?? []], base = found?.prompt ?? {
      identifier: identifier ?? globalThis.crypto.randomUUID(),
      role: "system",
      system_prompt: false,
      marker: false,
      injection_position: 0,
      injection_depth: 4,
      forbid_overrides: false
    };
    const prompt = readFields(promptFields, yaml, base, ["identifier", "\u540D\u79F0", "\u542F\u7528"]);
    prompt.name = typeof yaml.data.\u540D\u79F0 === "string" ? yaml.data.\u540D\u79F0 : found?.explicit ? base.name : name;
    if (!(body === "" && base.content === void 0)) prompt.content = body;
    const index = prompts.indexOf(base);
    index >= 0 ? prompts[index] = prompt : prompts.push(prompt);
    let next = { ...preset, prompts };
    if (!found || yaml.data.\u542F\u7528 !== void 0)
      next = withOrder(next, prompt.identifier, yaml.data.\u542F\u7528 ?? true);
    return next;
  },
  remove(preset, file) {
    const found = promptList(preset).find((p) => p.file === file);
    if (!found) throw new SyncError("\u63D0\u793A\u8BCD\u4E0D\u5B58\u5728\u3002");
    if (found.prompt.marker || found.prompt.system_prompt) throw new SyncError("\u5185\u7F6E\u63D0\u793A\u8BCD\u548C\u6807\u8BB0\u4E0D\u80FD\u5220\u9664\u3002");
    const id = found.prompt.identifier;
    return {
      ...preset,
      prompts: preset.prompts.filter((p) => p !== found.prompt),
      prompt_order: (preset.prompt_order ?? []).map((l) => ({
        ...l,
        order: (l.order ?? []).filter((o) => o.identifier !== id)
      }))
    };
  },
  rename(preset, from, to) {
    const found = promptList(preset).find((p) => p.file === from);
    if (!found) throw new SyncError("\u63D0\u793A\u8BCD\u4E0D\u5B58\u5728\u3002");
    const name = promptName(to);
    return { ...preset, prompts: preset.prompts.map((p) => p === found.prompt ? { ...p, name } : p) };
  }
};
function withOrder(preset, identifier, enabled) {
  const order = orderOf(preset);
  if (!order)
    return { ...preset, prompt_order: [{ character_id: 100001, order: [{ identifier, enabled }] }] };
  const next = order.some((o) => o.identifier === identifier) ? order.map((o) => o.identifier === identifier ? { ...o, enabled } : o) : [...order, { identifier, enabled }];
  return {
    ...preset,
    prompt_order: preset.prompt_order.map((l) => l.order === order ? { ...l, order: next } : l)
  };
}

// src/sync/settings.ts
var profileFields = [
  {
    name: "\u63A5\u53E3\u7C7B\u578B",
    path: ["mode"],
    type: "string",
    labels: [
      ["cc", "Chat Completion"],
      ["tc", "Text Completion"]
    ]
  },
  ...[
    ["api", "\u670D\u52A1\u7C7B\u578B"],
    ["api-url", "\u670D\u52A1\u5730\u5740"],
    ["model", "\u6A21\u578B"],
    ["preset", "\u7ED1\u5B9A\u9884\u8BBE"],
    ["proxy", "\u4EE3\u7406\u914D\u7F6E"],
    ["secret-id", "\u51ED\u636E\u5F15\u7528"],
    ["reasoning-template", "\u601D\u8003\u6A21\u677F"],
    ["prompt-post-processing", "\u63D0\u793A\u8BCD\u540E\u5904\u7406"],
    ["regex-preset", "\u6B63\u5219\u9884\u8BBE"],
    ["stop-strings", "\u505C\u6B62\u5B57\u7B26\u4E32"],
    ["start-reply-with", "\u56DE\u590D\u524D\u7F00"],
    ["sysprompt", "\u7CFB\u7EDF\u63D0\u793A\u8BCD"],
    ["sysprompt-state", "\u542F\u7528\u7CFB\u7EDF\u63D0\u793A\u8BCD"],
    ["context", "\u4E0A\u4E0B\u6587\u6A21\u677F"],
    ["instruct", "\u6307\u4EE4\u6A21\u677F"],
    ["instruct-state", "\u6307\u4EE4\u6A21\u5F0F"],
    ["tokenizer", "\u5206\u8BCD\u5668"]
  ].map(([key, name]) => ({ name, path: [key], type: "any" })),
  { name: "\u5E94\u7528\u65F6\u8DF3\u8FC7\u7684\u5B57\u6BB5", path: ["exclude"], type: "strings" }
];
var profileNames = (profiles) => uniqueNames(
  profiles,
  (p) => String(p.id),
  (p) => String(p.name ?? ""),
  (p) => String(p.id)
);
var profileCodec = {
  render(profile, explicit) {
    const out = { id: profile.id };
    if (explicit) out.\u540D\u79F0 = profile.name;
    writeFields(profileFields, profile, out);
    const other = otherKeys(profileFields, profile, ["id", "name"]);
    if (Object.keys(other).length) out.\u5176\u4ED6 = other;
    return renderYaml(out);
  },
  parse(profile, stem, explicit, text2) {
    const yaml = parseYaml(text2.replace(/\r\n/g, "\n"));
    if (yaml.data.id !== void 0 && yaml.data.id !== profile.id)
      throw new SyncError("id \u4E0D\u80FD\u4FEE\u6539\uFF1B\u65B0\u5EFA\u8FDE\u63A5\u914D\u7F6E\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002", yaml.line("id"));
    const next = readFields(profileFields, yaml, profile, ["id", "\u540D\u79F0", "\u5176\u4ED6"]), other = yaml.data.\u5176\u4ED6 ?? {};
    if (!other || typeof other !== "object" || Array.isArray(other))
      throw new SyncError("\u300C\u5176\u4ED6\u300D\u5E94\u662F\u300C\u952E: \u503C\u300D\u7684\u6620\u5C04\u3002", yaml.line("\u5176\u4ED6"));
    for (const key of Object.keys(other))
      if (key === "id" || key === "name" || profileFields.some((f) => f.path[0] === key))
        throw new SyncError(`\u300C\u5176\u4ED6\u300D\u91CC\u4E0D\u80FD\u5199 ${key}\u3002`, yaml.line(`\u5176\u4ED6.${key}`));
    const name = typeof yaml.data.\u540D\u79F0 === "string" ? yaml.data.\u540D\u79F0 : explicit ? profile.name : stem;
    if (!String(name).trim()) throw new SyncError("\u8FDE\u63A5\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\u3002", yaml.line("\u540D\u79F0"));
    return { ...next, ...other, name };
  }
};
var personaFields = [
  { name: "\u8BF4\u660E\u6807\u9898", path: ["title"], type: "string" },
  {
    name: "\u6CE8\u5165\u4F4D\u7F6E",
    path: ["position"],
    type: "number",
    labels: [
      [0, "\u63D0\u793A\u8BCD / \u6545\u4E8B\u6A21\u677F"],
      [2, "\u4F5C\u8005\u6CE8\u91CA\u4E4B\u524D"],
      [3, "\u4F5C\u8005\u6CE8\u91CA\u4E4B\u540E"],
      [4, "\u6307\u5B9A\u6DF1\u5EA6"],
      [9, "\u505C\u7528"]
    ]
  },
  { name: "\u6DF1\u5EA6", path: ["depth"], type: "number" },
  { name: "\u6CE8\u5165\u89D2\u8272", path: ["role"], type: "number", labels: roles },
  { name: "\u7ED1\u5B9A\u4E16\u754C\u4E66", path: ["lorebook"], type: "string" }
];
var personaNames = (personas) => uniqueNames(
  personas,
  (p) => String(p.id),
  (p) => String(p.name ?? ""),
  (p) => String(p.id).replace(/\.[^.]+$/, "")
);
var personaCodec = {
  render(persona, id, explicit) {
    const front = { id };
    if (explicit) front.\u540D\u79F0 = persona.name;
    writeFields(personaFields, persona, front);
    const other = otherKeys(personaFields, persona, ["name", "description"]);
    if (Object.keys(other).length) front.\u5176\u4ED6 = other;
    return joinFront(front, String(persona.description ?? ""));
  },
  parse(persona, id, stem, explicit, text2) {
    const { yaml, body } = splitFront(text2);
    if (yaml.data.id !== void 0 && yaml.data.id !== id)
      throw new SyncError("id \u4E0D\u80FD\u4FEE\u6539\uFF1B\u65B0\u5EFA\u7528\u6237\u8BBE\u5B9A\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002", yaml.line("id"));
    const next = readFields(personaFields, yaml, persona, ["id", "\u540D\u79F0", "\u5176\u4ED6"]), other = yaml.data.\u5176\u4ED6 ?? {};
    if (!other || typeof other !== "object" || Array.isArray(other))
      throw new SyncError("\u300C\u5176\u4ED6\u300D\u5E94\u662F\u300C\u952E: \u503C\u300D\u7684\u6620\u5C04\u3002", yaml.line("\u5176\u4ED6"));
    for (const key of Object.keys(other))
      if (["name", "description"].includes(key) || personaFields.some((f) => f.path[0] === key))
        throw new SyncError(`\u300C\u5176\u4ED6\u300D\u91CC\u4E0D\u80FD\u5199 ${key}\u3002`, yaml.line(`\u5176\u4ED6.${key}`));
    const name = typeof yaml.data.\u540D\u79F0 === "string" ? yaml.data.\u540D\u79F0 : explicit ? persona.name : stem;
    return {
      ...next,
      ...other,
      name,
      ...body === "" && persona.description === void 0 ? {} : { description: body }
    };
  }
};

// src/host/ids.ts
function randomId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// src/addons/outline/model.ts
var emptyOutline = () => ({
  version: 1,
  nodes: [],
  selected: "",
  settings: { mode: "caret", send: false, inject: { enabled: false, depth: 4 } }
});
function normalizeOutline(value) {
  if (!value || !Array.isArray(value.nodes)) return emptyOutline();
  if (value.nodes.length > 2e3) throw new Error("\u5927\u7EB2\u6700\u591A\u652F\u6301 2000 \u4E2A\u8282\u70B9\u3002");
  const ids = /* @__PURE__ */ new Set();
  const nodes = value.nodes.map((node) => {
    const id = String(node.id || "");
    if (!id || ids.has(id)) throw new Error("\u8282\u70B9\u6807\u8BC6\u4E3A\u7A7A\u6216\u91CD\u590D\u3002");
    ids.add(id);
    return {
      id,
      parent: node.parent == null ? null : String(node.parent),
      title: String(node.title || "\u672A\u547D\u540D\u8282\u70B9").slice(0, 300),
      content: String(node.content || "").slice(0, 1e5),
      status: ["todo", "active", "done"].includes(node.status) ? node.status : "todo",
      rounds: Math.max(1, Math.min(100, Math.floor(Number(node.rounds) || 1))),
      completed: Math.max(0, Math.min(100, Math.floor(Number(node.completed) || 0)))
    };
  });
  let current = false;
  for (const node of nodes)
    if (node.status === "active") {
      if (current) node.status = "todo";
      current = true;
    }
  for (const node of nodes) {
    let next = node.parent, depth = 0;
    const seen = /* @__PURE__ */ new Set([node.id]);
    while (next) {
      if (!ids.has(next) || seen.has(next) || ++depth > 32) throw new Error("\u5927\u7EB2\u5C42\u7EA7\u65E0\u6548\u6216\u5305\u542B\u5FAA\u73AF\u3002");
      seen.add(next);
      next = nodes.find((n) => n.id === next).parent;
    }
  }
  return {
    version: 1,
    nodes,
    selected: ids.has(value.selected) ? value.selected : nodes[0]?.id || "",
    settings: {
      mode: value.settings?.mode === "replace" ? "replace" : "caret",
      send: value.settings?.send === true,
      inject: {
        enabled: value.settings?.inject?.enabled === true,
        depth: Math.max(0, Math.min(100, Math.floor(Number(value.settings?.inject?.depth ?? 4) || 0)))
      }
    },
    job: value.job && Array.isArray(value.job.queue) ? {
      queue: value.job.queue.filter((id) => ids.has(id)),
      index: Math.max(0, Number(value.job.index) || 0)
    } : void 0
  };
}
function orderedNodes(data, parent = null) {
  return data.nodes.filter((n) => n.parent === parent).flatMap((node) => [node, ...orderedNodes(data, node.id)]);
}

// src/sync/outline.ts
var statuses = [
  ["todo", "\u5F85\u5199"],
  ["active", "\u5F53\u524D"],
  ["done", "\u5B8C\u6210"]
];
var heading = /^(#{1,32}) (.*)$/;
var headingLike = /^\\*#{1,32} /;
var attributes = /^<!--(.*)-->$/;
var outlineCodec = {
  render(data) {
    const depth = (n) => n.parent ? depth(data.nodes.find((p) => p.id === n.parent)) + 1 : 1;
    return orderedNodes(data).map((n) => {
      const status = statuses.find(([s]) => s === n.status)[1], head = `${"#".repeat(depth(n))} ${n.title.replace(/\n/g, " ")}
<!-- id: ${n.id} \xB7 \u72B6\u6001: ${status} \xB7 \u8F6E\u6570: ${n.rounds} \xB7 \u5DF2\u5B8C\u6210: ${n.completed} -->`, body = n.content.split("\n").map((line) => headingLike.test(line) ? "\\" + line : line).join("\n");
      return n.content ? `${head}
${body}` : head;
    }).map((block, i, all) => i < all.length - 1 ? block + "\n\n" : block + "\n").join("");
  },
  parse(base, text2) {
    const lines = text2.replace(/\r\n/g, "\n").split("\n");
    if (lines.at(-1) === "") lines.pop();
    const nodes = [], stack = [], ids = /* @__PURE__ */ new Set();
    let body = null;
    const close = (last) => {
      const node = nodes.at(-1);
      if (!node || !body) return;
      if (!last && body.at(-1) === "") body.pop();
      node.content = body.map((line) => /^\\+#{1,32} /.test(line) ? line.slice(1) : line).join("\n");
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i], match = line.match(heading);
      if (!match) {
        if (body) body.push(line);
        else if (line.trim()) throw new SyncError("\u7B2C\u4E00\u4E2A\u6807\u9898\u4E4B\u524D\u4E0D\u80FD\u6709\u6B63\u6587\u3002", i + 1);
        continue;
      }
      close(false);
      const level = match[1].length;
      if (level > stack.length + 1) throw new SyncError(`\u6807\u9898\u5C42\u7EA7\u8DF3\u7EA7\uFF1A\u4E0A\u4E00\u7EA7\u662F ${stack.length} \u7EA7\u3002`, i + 1);
      stack.length = level - 1;
      const node = {
        id: "",
        parent: stack.at(-1)?.id ?? null,
        title: match[2],
        content: "",
        status: "todo",
        rounds: 1,
        completed: 0
      };
      const attr = lines[i + 1]?.match(attributes);
      if (attr) {
        i++;
        for (const part of attr[1].split("\xB7")) {
          const [key, ...rest] = part.split(":"), name = key.trim(), value = rest.join(":").trim();
          if (!name) continue;
          if (name === "id") node.id = value;
          else if (name === "\u72B6\u6001") {
            const status = statuses.find(([, label]) => label === value)?.[0];
            if (!status)
              throw new SyncError(`\u72B6\u6001\u5E94\u4E3A ${statuses.map(([, l]) => l).join(" / ")} \u4E4B\u4E00\u3002`, i + 1);
            node.status = status;
          } else if (name === "\u8F6E\u6570" || name === "\u5DF2\u5B8C\u6210") {
            const n = Number(value);
            if (!Number.isInteger(n) || n < 0) throw new SyncError(`\u300C${name}\u300D\u5E94\u4E3A\u975E\u8D1F\u6574\u6570\u3002`, i + 1);
            name === "\u8F6E\u6570" ? node.rounds = n : node.completed = n;
          } else throw new SyncError(`\u672A\u77E5\u7684\u8282\u70B9\u5C5E\u6027\u300C${name}\u300D\u3002`, i + 1);
        }
      }
      if (!node.id) node.id = randomId();
      if (ids.has(node.id)) throw new SyncError(`\u8282\u70B9 id ${node.id} \u91CD\u590D\uFF1B\u590D\u5236\u8282\u70B9\u65F6\u8BF7\u5220\u53BB id\u3002`, i + 1);
      ids.add(node.id);
      nodes.push(node);
      stack.push(node);
      body = [];
    }
    close(true);
    try {
      return normalizeOutline({ ...base, nodes });
    } catch (error) {
      throw new SyncError(error instanceof Error ? error.message : String(error));
    }
  }
};

// src/sync/database.ts
var ID = "row_id";
var ESCAPES = { "\\": "\\", "|": "|", n: "\n", r: "\r", t: "	", " ": " " };
function writeCell(value) {
  const escaped = value.replace(
    /[\\|\n\r\t]/g,
    (c) => c === "\n" ? "\\n" : c === "\r" ? "\\r" : c === "	" ? "\\t" : "\\" + c
  );
  return escaped.replace(/^ +| +$/g, (spaces) => "\\ ".repeat(spaces.length));
}
function readCells(line) {
  const cells = [];
  let out = "", keep = 0, started = false, leading, trailing = false;
  const end = () => {
    cells.push(out.slice(0, keep));
    out = "";
    keep = 0;
    started = false;
  };
  for (let i = 0; i < line.length; i++) {
    const c = line[i], space = c === " " || c === "	";
    if (!space) {
      leading ??= c === "|";
      trailing = c === "|";
    }
    if (c === "\\" && i + 1 < line.length) {
      const next = line[++i];
      out += ESCAPES[next] ?? "\\" + next;
      keep = out.length;
      started = true;
    } else if (c === "|") end();
    else if (!started && space) continue;
    else {
      out += c;
      started = true;
      if (!space) keep = out.length;
    }
  }
  end();
  if (leading) cells.shift();
  if (trailing && cells.length) cells.pop();
  return cells;
}
var rowLine = (cells) => `| ${cells.map(writeCell).join(" | ")} |`;
var keyOf = (row) => row.id || `#${row.index}`;
var tableCodec = {
  render(table) {
    const header = [ID, ...table.columns];
    return [
      rowLine(header),
      `|${header.map(() => " --- ").join("|")}|`,
      ...table.rows.map((row) => rowLine([keyOf(row), ...row.cells])),
      ""
    ].join("\n");
  },
  parse(base, text2) {
    const lines = text2.replace(/\r\n/g, "\n").split("\n"), header = [ID, ...base.columns], byKey = new Map(base.rows.map((row) => [keyOf(row), row])), seen = /* @__PURE__ */ new Set(), kept = /* @__PURE__ */ new Map(), added = [];
    let state = "header";
    for (const [i, line] of lines.entries()) {
      const at = i + 1;
      if (!line.trim()) continue;
      if (state === "rule") {
        if (!/^[\s|:-]+$/.test(line) || !line.includes("-"))
          throw new SyncError("\u8868\u5934\u4E0B\u4E00\u884C\u5E94\u662F\u5206\u9694\u884C\uFF0C\u4F8B\u5982 | --- | --- |\u3002", at);
        state = "rows";
        continue;
      }
      if (!line.includes("|")) throw new SyncError("\u8868\u683C\u4E4B\u5916\u4E0D\u80FD\u5199\u5176\u4ED6\u5185\u5BB9\u3002", at);
      const cells = readCells(line);
      if (state === "header") {
        if (cells.length !== header.length || cells.some((c, j) => c !== header[j]))
          throw new SyncError(`\u8868\u5934\u5E94\u4E3A\u300C${header.join(" | ")}\u300D\uFF1B\u5217\u7531\u6570\u636E\u5E93\u63D2\u4EF6\u7684\u6A21\u677F\u51B3\u5B9A\u3002`, at);
        state = "rule";
        continue;
      }
      if (cells.length !== header.length)
        throw new SyncError(`\u8FD9\u4E00\u884C\u6709 ${cells.length} \u5217\uFF0C\u8868\u683C\u6709 ${header.length} \u5217\u3002`, at);
      const [key, ...values] = cells;
      if (!key) {
        added.push(values);
        continue;
      }
      if (!byKey.has(key)) throw new SyncError(`\u6CA1\u6709 row_id \u4E3A\u300C${key}\u300D\u7684\u884C\uFF1B\u65B0\u884C\u8BF7\u628A row_id \u7559\u7A7A\u3002`, at);
      if (seen.has(key)) throw new SyncError(`row_id\u300C${key}\u300D\u51FA\u73B0\u4E86\u4E24\u6B21\u3002`, at);
      seen.add(key);
      kept.set(key, values);
    }
    if (state !== "rows") throw new SyncError("\u7F3A\u5C11\u8868\u5934\u548C\u5206\u9694\u884C\u3002", lines.length);
    return {
      ...base,
      rows: [
        // Rows keep the plug-in's order: there is no call to move a row.
        ...base.rows.filter((row) => kept.has(keyOf(row))).map((row) => ({ ...row, cells: kept.get(keyOf(row)) })),
        ...added.map((cells) => ({ id: "", index: 0, cells }))
      ]
    };
  }
};

// server/workbench-sync/src/hub.ts
import crypto2 from "node:crypto";
import fs3 from "node:fs";
import path3 from "node:path";

// server/workbench-sync/src/space.ts
import fs2 from "node:fs";
import path2 from "node:path";

// server/workbench-sync/src/st.ts
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
function serverRoot() {
  const candidates = [process.argv[1] && path.dirname(fs.realpathSync(process.argv[1])), process.cwd()];
  const root = candidates.find((dir) => dir && fs.existsSync(path.join(dir, "src/character-card-parser.js")));
  if (!root) throw new Error("workbench-sync: SillyTavern server directory not found.");
  return root;
}
var host;
function st() {
  return host ??= (async () => {
    const root = serverRoot(), load = (file) => import(pathToFileURL(path.join(root, file)).href);
    const [card, util] = await Promise.all([load("src/character-card-parser.js"), load("src/util.js")]);
    return { readCard: card.read, writeCard: card.write, getConfigValue: util.getConfigValue };
  })();
}
async function writeAtomic(file, data) {
  const temp = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.${Date.now()}.wbsync`);
  await fs.promises.writeFile(temp, data);
  try {
    await fs.promises.rename(temp, file);
  } catch (error) {
    await fs.promises.rm(temp, { force: true });
    throw error;
  }
}
async function firstLine(file) {
  const handle = await fs.promises.open(file, "r");
  try {
    const chunks = [];
    const buffer = Buffer.alloc(65536);
    for (let position = 0; ; ) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
      if (!bytesRead) break;
      const slice = buffer.subarray(0, bytesRead), end = slice.indexOf(10);
      chunks.push(Buffer.from(end >= 0 ? slice.subarray(0, end) : slice));
      if (end >= 0) break;
      position += bytesRead;
    }
    return Buffer.concat(chunks).toString("utf8");
  } finally {
    await handle.close();
  }
}

// server/workbench-sync/src/space.ts
var OPEN_CHAT = "\u6253\u5F00\u8BE5\u804A\u5929\u540E\u53EF\u540C\u6B65\uFF1A\u6570\u636E\u5E93\u53EA\u540C\u6B65\u5DE5\u4F5C\u53F0\u9875\u9762\u91CC\u5DF2\u6253\u5F00\u7684\u804A\u5929\u3002";
var NotFound = class extends Error {
  constructor(message = "\u6587\u4EF6\u4E0D\u5B58\u5728\u3002") {
    super(message);
  }
};
var Refused = class extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
};
var AREAS = ["\u4E16\u754C\u4E66", "\u89D2\u8272", "\u9884\u8BBE", "\u8FDE\u63A5", "\u7528\u6237\u8BBE\u5B9A", "\u5927\u7EB2", "\u6570\u636E\u5E93"];
var PAGE_DATABASE = "page:database";
var dirs = (names2) => ({
  type: "dir",
  children: names2.map((name) => ({ name, type: "dir" }))
});
var files = (names2) => ({
  type: "dir",
  children: names2.map((name) => ({ name, type: "file" }))
});
var stems = async (dir, ext) => (await fs2.promises.readdir(dir).catch(() => [])).filter((f) => f.endsWith(ext) && !f.startsWith(".")).map((f) => f.slice(0, -ext.length)).sort((a, b) => a.localeCompare(b));
var readJson = async (file) => JSON.parse(await fs2.promises.readFile(file, "utf8"));
var mtimeOf = async (file) => (await fs2.promises.stat(file)).mtimeMs;
var cards = /* @__PURE__ */ new Map();
var settingsCache = /* @__PURE__ */ new Map();
var Space = class {
  constructor(dirs2, databases = () => []) {
    this.dirs = dirs2;
    this.databases = databases;
  }
  async characters() {
    const list = [];
    for (const name of await fs2.promises.readdir(this.dirs.characters).catch(() => [])) {
      if (!name.endsWith(".png") || name.startsWith(".")) continue;
      const file = path2.join(this.dirs.characters, name);
      try {
        const card = await this.card(file);
        list.push({
          avatar: name,
          name: String(card.card.data?.name ?? card.card.name ?? ""),
          card: card.card,
          mtime: card.mtime
        });
      } catch {
      }
    }
    return list.sort((a, b) => a.avatar.localeCompare(b.avatar));
  }
  async card(file) {
    const stat = await fs2.promises.stat(file), cached = cards.get(file);
    if (cached && cached.mtime === stat.mtimeMs && cached.size === stat.size) return cached;
    const { readCard } = await st();
    const entry = {
      mtime: stat.mtimeMs,
      size: stat.size,
      card: JSON.parse(readCard(await fs2.promises.readFile(file)))
    };
    cards.set(file, entry);
    return entry;
  }
  get settingsFile() {
    return path2.join(this.dirs.root, "settings.json");
  }
  async settings() {
    const file = this.settingsFile, stat = await fs2.promises.stat(file), cached = settingsCache.get(file);
    if (cached && cached.mtime === stat.mtimeMs && cached.size === stat.size) return cached;
    const entry = { mtime: stat.mtimeMs, size: stat.size, data: await readJson(file) };
    settingsCache.set(file, entry);
    return entry;
  }
  async profiles() {
    const settings = await this.settings(), list = settings.data.extension_settings?.connectionManager?.profiles ?? [];
    return { list, names: profileNames(list) };
  }
  async personas() {
    const p = (await this.settings()).data.power_user ?? {}, list = Object.entries(p.personas ?? {}).map(([id, name]) => ({ id, name }));
    return {
      list,
      names: personaNames(list),
      descriptions: p.persona_descriptions ?? {}
    };
  }
  async groups() {
    const list = [];
    for (const id of await stems(this.dirs.groups, ".json")) {
      try {
        const group = await readJson(path2.join(this.dirs.groups, id + ".json"));
        list.push({
          id: String(group.id ?? id),
          name: String(group.name ?? id),
          chats: (group.chats ?? []).map(String)
        });
      } catch {
      }
    }
    return list;
  }
  /** Directory names of chat owners: characters as in 角色/, groups marked 「（群组）」. */
  async owners() {
    const characters = await this.characters(), groups = await this.groups(), owners = [
      ...characters.map((c) => ({
        key: "c:" + c.avatar,
        title: c.name,
        avatar: c.avatar,
        group: void 0
      })),
      ...groups.map((g) => ({
        key: "g:" + g.id,
        title: `${g.name}\uFF08\u7FA4\u7EC4\uFF09`,
        avatar: void 0,
        group: g.id
      }))
    ], names2 = uniqueNames(
      owners,
      (o) => o.key,
      (o) => o.title,
      (o) => o.key.slice(2).replace(/\.png$/, "")
    );
    return owners.map((o) => ({
      ...o,
      dir: names2.get(o.key).stem,
      chats: o.group ? groups.find((g) => g.id === o.group).chats : []
    }));
  }
  async chatsOf(owner) {
    if (owner.group) {
      const present = new Set(await stems(this.dirs.groupChats, ".jsonl"));
      return owner.chats.filter((c) => present.has(c));
    }
    return stems(path2.join(this.dirs.chats, owner.avatar.replace(/\.png$/, "")), ".jsonl");
  }
  async locate(segments) {
    if (!segments.length) return dirs([...AREAS]);
    const [area, ...rest] = segments, unit = (u, rel = []) => ({ type: "unit", unit: u, rel: rel.join("/") });
    if (area === "\u4E16\u754C\u4E66" || area === "\u9884\u8BBE") {
      const folder = area === "\u4E16\u754C\u4E66" ? this.dirs.worlds : this.dirs.openAI_Settings, names2 = await stems(folder, ".json");
      if (!rest.length) return dirs(names2);
      if (!names2.includes(rest[0]))
        throw new NotFound(`\u6CA1\u6709\u540D\u4E3A\u300C${rest[0]}\u300D\u7684${area}\u3002\u65B0\u5EFA${area}\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002`);
      return unit(
        {
          kind: area === "\u4E16\u754C\u4E66" ? "world" : "preset",
          id: rest[0],
          path: `${area}/${rest[0]}`,
          single: false,
          source: path2.join(folder, rest[0] + ".json")
        },
        rest.slice(1)
      );
    }
    if (area === "\u89D2\u8272") {
      const list = await this.characters(), names2 = uniqueNames(
        list,
        (c) => c.avatar,
        (c) => c.name,
        (c) => c.avatar.replace(/\.png$/, "")
      );
      if (!rest.length) return dirs(list.map((c) => names2.get(c.avatar).stem));
      const found = list.find((c) => names2.get(c.avatar).stem === rest[0]);
      if (!found) throw new NotFound(`\u6CA1\u6709\u540D\u4E3A\u300C${rest[0]}\u300D\u7684\u89D2\u8272\u3002\u65B0\u5EFA\u89D2\u8272\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002`);
      return unit(
        {
          kind: "character",
          id: found.avatar,
          path: `\u89D2\u8272/${rest[0]}`,
          single: false,
          source: path2.join(this.dirs.characters, found.avatar)
        },
        rest.slice(1)
      );
    }
    if (area === "\u8FDE\u63A5" || area === "\u7528\u6237\u8BBE\u5B9A") {
      const { list, names: names2 } = area === "\u8FDE\u63A5" ? await this.profiles() : await this.personas(), ext = area === "\u8FDE\u63A5" ? ".yaml" : ".md", keyOf2 = (item) => String(item.id);
      if (!rest.length) return files(list.map((item) => names2.get(keyOf2(item)).stem + ext));
      const found = rest.length === 1 && list.find((item) => names2.get(keyOf2(item)).stem + ext === rest[0]);
      if (!found)
        throw new NotFound(
          `\u6CA1\u6709\u300C${rest.join("/")}\u300D\u3002\u65B0\u5EFA${area === "\u8FDE\u63A5" ? "\u8FDE\u63A5\u914D\u7F6E" : "\u7528\u6237\u8BBE\u5B9A"}\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002`
        );
      const name = names2.get(keyOf2(found));
      return unit({
        kind: area === "\u8FDE\u63A5" ? "connection" : "persona",
        id: keyOf2(found),
        path: `${area}/${rest[0]}`,
        single: true,
        source: this.settingsFile,
        stem: name.stem,
        explicit: name.explicit
      });
    }
    if (area === "\u5927\u7EB2") {
      const owners = await this.owners();
      if (!rest.length) {
        const withChats = [];
        for (const owner2 of owners) if ((await this.chatsOf(owner2)).length) withChats.push(owner2.dir);
        return dirs(withChats);
      }
      const owner = owners.find((o) => o.dir === rest[0]);
      if (!owner) throw new NotFound();
      const chats = await this.chatsOf(owner);
      if (rest.length === 1) return files(chats.map((c) => c + ".md"));
      const chat = rest.length === 2 && chats.find((c) => c + ".md" === rest[1]);
      if (!chat) throw new NotFound("\u6CA1\u6709\u8FD9\u4E2A\u804A\u5929\uFF1B\u5927\u7EB2\u968F\u804A\u5929\u521B\u5EFA\u3002");
      return unit({
        kind: "outline",
        id: JSON.stringify({ avatar: owner.avatar, group: owner.group, chat }),
        path: `\u5927\u7EB2/${owner.dir}/${rest[1]}`,
        single: true,
        source: owner.group ? path2.join(this.dirs.groupChats, chat + ".jsonl") : path2.join(this.dirs.chats, owner.avatar.replace(/\.png$/, ""), chat + ".jsonl")
      });
    }
    if (area === "\u6570\u636E\u5E93") {
      const owners = await this.owners(), placed = this.databases().flatMap((view2) => {
        const owner = owners.find((o) => view2.group ? o.group === view2.group : o.avatar === view2.avatar);
        return owner ? [{ view: view2, dir: owner.dir }] : [];
      }), here = placed.filter((p) => p.dir === rest[0]);
      if (!rest.length) return dirs([...new Set(placed.map((p) => p.dir))]);
      if (!here.length) throw new NotFound(OPEN_CHAT);
      if (rest.length === 1) return dirs([...new Set(here.map((p) => p.view.chat))]);
      const view = here.find((p) => p.view.chat === rest[1])?.view;
      if (!view) throw new NotFound(OPEN_CHAT);
      const names2 = uniqueNames(
        view.tables,
        (t) => t.key,
        (t) => t.name,
        (t) => t.key
      ), file = (t) => names2.get(t.key).stem + ".md";
      if (rest.length === 2) return files(view.tables.map(file));
      const table = rest.length === 3 && view.tables.find((t) => file(t) === rest[2]);
      if (!table) throw new NotFound("\u6CA1\u6709\u8FD9\u5F20\u8868\uFF1B\u8868\u7531\u6570\u636E\u5E93\u63D2\u4EF6\u7684\u6A21\u677F\u51B3\u5B9A\u3002");
      return unit({
        kind: "database",
        id: JSON.stringify({ avatar: view.avatar, group: view.group, chat: view.chat, table: table.key }),
        path: `\u6570\u636E\u5E93/${rest.join("/")}`,
        single: true,
        source: PAGE_DATABASE
      });
    }
    throw new NotFound();
  }
  async load(unit) {
    const one = (text2) => /* @__PURE__ */ new Map([["", text2]]);
    switch (unit.kind) {
      case "world": {
        const data = await readJson(unit.source);
        return { data, mtime: await mtimeOf(unit.source), files: worldCodec.files(data) };
      }
      case "preset": {
        const data = await readJson(unit.source);
        return { data, mtime: await mtimeOf(unit.source), files: presetCodec.files(data) };
      }
      case "character": {
        const { card, mtime } = await this.card(unit.source), data = structuredClone(card.data ?? {});
        return { data, mtime, files: characterCodec.files(data) };
      }
      case "connection": {
        const settings = await this.settings(), profile = (settings.data.extension_settings?.connectionManager?.profiles ?? []).find(
          (p) => p.id === unit.id
        );
        if (!profile) throw new NotFound("\u8FDE\u63A5\u914D\u7F6E\u5DF2\u5220\u9664\u3002");
        return {
          data: structuredClone(profile),
          mtime: settings.mtime,
          files: one(profileCodec.render(profile, !!unit.explicit))
        };
      }
      case "persona": {
        const settings = await this.settings(), p = settings.data.power_user ?? {};
        if (!(unit.id in (p.personas ?? {}))) throw new NotFound("\u7528\u6237\u8BBE\u5B9A\u5DF2\u5220\u9664\u3002");
        const data = structuredClone({
          name: p.personas[unit.id],
          ...p.persona_descriptions?.[unit.id] ?? {}
        });
        return {
          data,
          mtime: settings.mtime,
          files: one(personaCodec.render(data, unit.id, !!unit.explicit))
        };
      }
      case "database": {
        const { avatar, group, chat, table } = JSON.parse(unit.id), view = this.databases().find((v) => v.chat === chat && v.avatar === avatar && v.group === group), found = view?.tables.find((t) => t.key === table);
        if (!view || !found) throw new NotFound(OPEN_CHAT);
        return { data: structuredClone(found), mtime: view.time, files: one(tableCodec.render(found)) };
      }
      case "outline": {
        const header = JSON.parse(await firstLine(unit.source) || "{}"), data = normalizeOutline(header.chat_metadata?.workbench_addons?.outline);
        return { data, mtime: await mtimeOf(unit.source), files: one(outlineCodec.render(data)) };
      }
    }
  }
  /** The resource after writing one file; SyncError for unreadable text, Refused for what cannot be written. */
  async apply(unit, loaded, rel, text2) {
    const { data } = loaded;
    switch (unit.kind) {
      case "world":
        return worldCodec.write(data, rel, text2);
      case "preset":
        return presetCodec.write(data, rel, text2);
      case "character":
        return characterCodec.write(data, rel, text2);
      case "connection": {
        const next = profileCodec.parse(data, unit.stem, !!unit.explicit, text2), { list } = await this.profiles();
        if (list.some((p) => p.id !== unit.id && p.name === next.name))
          throw new SyncError(`\u5DF2\u6709\u540D\u4E3A\u300C${next.name}\u300D\u7684\u8FDE\u63A5\u914D\u7F6E\u3002`);
        return next;
      }
      case "persona":
        return personaCodec.parse(data, unit.id, unit.stem, !!unit.explicit, text2);
      case "outline":
        return outlineCodec.parse(data, text2);
      case "database":
        return tableCodec.parse(data, text2);
    }
  }
  remove(unit, loaded, rel) {
    if (unit.kind === "world") return worldCodec.remove(loaded.data, rel);
    if (unit.kind === "preset") return presetCodec.remove(loaded.data, rel);
    if (unit.kind === "character") return characterCodec.remove(loaded.data, rel);
    throw new Refused("\u8FD9\u7C7B\u6587\u4EF6\u4E0D\u80FD\u5220\u9664\uFF1B\u5220\u9664\u8D44\u6E90\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002", 405);
  }
  rename(unit, loaded, from, to) {
    if (unit.kind === "world") return worldCodec.rename(loaded.data, from, to);
    if (unit.kind === "preset") return presetCodec.rename(loaded.data, from, to);
    if (unit.kind === "connection" || unit.kind === "persona") {
      const ext = unit.kind === "connection" ? ".yaml" : ".md";
      if (!to.endsWith(ext) || to.includes("/")) throw new Refused(`\u6539\u540D\u540E\u4ECD\u5E94\u662F\u540C\u4E00\u76EE\u5F55\u4E0B\u7684 ${ext} \u6587\u4EF6\u3002`);
      return { ...loaded.data, name: to.slice(0, -ext.length) };
    }
    throw new Refused("\u8FD9\u7C7B\u6587\u4EF6\u4E0D\u80FD\u6539\u540D\u3002", 405);
  }
  /** Writes a resource straight into SillyTavern's files, for when no workbench page is open. */
  async saveDisk(unit, draft) {
    switch (unit.kind) {
      case "database":
        throw new Refused(OPEN_CHAT, 409);
      case "world":
      case "preset":
        return writeAtomic(unit.source, JSON.stringify(draft, null, 4));
      case "character": {
        const { readCard, writeCard } = await st(), image = await fs2.promises.readFile(unit.source), card = JSON.parse(readCard(image));
        if (!String(draft.name ?? "").trim()) throw new SyncError("\u89D2\u8272\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\u3002");
        return writeAtomic(unit.source, writeCard(image, JSON.stringify(mirrorCard(card, draft))));
      }
      case "connection":
      case "persona":
        return this.saveSettings((settings) => {
          if (unit.kind === "connection") {
            const profiles = settings.extension_settings?.connectionManager?.profiles ?? [], index = profiles.findIndex((p2) => p2.id === unit.id);
            if (index < 0) throw new NotFound("\u8FDE\u63A5\u914D\u7F6E\u5DF2\u5220\u9664\u3002");
            profiles[index] = draft;
            return;
          }
          const p = settings.power_user;
          if (!p?.personas || !(unit.id in p.personas)) throw new NotFound("\u7528\u6237\u8BBE\u5B9A\u5DF2\u5220\u9664\u3002");
          const { name, ...description } = draft;
          p.personas[unit.id] = name;
          p.persona_descriptions = { ...p.persona_descriptions, [unit.id]: description };
          if (settings.user_avatar === unit.id) {
            settings.username = name;
            p.persona_description = description.description ?? "";
            p.persona_description_position = description.position ?? 0;
            p.persona_description_depth = description.depth ?? 2;
            p.persona_description_role = description.role ?? 0;
            p.persona_description_lorebook = description.lorebook ?? "";
          }
        });
      case "outline": {
        const text2 = await fs2.promises.readFile(unit.source, "utf8"), end = text2.indexOf("\n"), header = JSON.parse(end < 0 ? text2 : text2.slice(0, end));
        header.chat_metadata = {
          ...header.chat_metadata,
          workbench_addons: { ...header.chat_metadata?.workbench_addons, outline: draft }
        };
        return writeAtomic(unit.source, JSON.stringify(header) + (end < 0 ? "" : text2.slice(end)));
      }
    }
  }
  async saveSettings(change) {
    const settings = await readJson(this.settingsFile);
    change(settings);
    await writeAtomic(this.settingsFile, JSON.stringify(settings, null, 4));
  }
};

// server/workbench-sync/src/hub.ts
var RELAY_TIMEOUT = 1e4;
var DEBOUNCE = 150;
var hashOf = (text2) => crypto2.createHash("sha1").update(text2).digest("hex").slice(0, 16);
var tag = (v) => `${v.mtime}:${v.hash}`;
var parentOf = (p) => p.split("/").slice(0, -1).join("/");
var split = (p) => p.split("/").filter(Boolean);
var under = (p, dir) => !dir || p === dir || p.startsWith(dir + "/");
var Hub = class _Hub {
  space;
  pages = [];
  ides = /* @__PURE__ */ new Set();
  versions = /* @__PURE__ */ new Map();
  /** Directory listings an IDE has read, to tell it when one changes. */
  listings = /* @__PURE__ */ new Map();
  watchers = [];
  timers = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  queue = Promise.resolve();
  recent = [];
  constructor(dirs2) {
    this.space = new Space(dirs2, () => this.pages.flatMap((p) => p.database ? [p.database] : []));
  }
  // ── Connections ──────────────────────────────────────────────
  attach(role, stream) {
    if (role === "page") {
      const page = { id: crypto2.randomUUID(), stream };
      this.pages.push(page);
      this.send(stream, "hello", { page: page.id, ...this.status() });
      this.broadcastStatus();
      return () => {
        this.pages = this.pages.filter((p) => p !== page);
        this.broadcastStatus();
        if (page.database) this.later(PAGE_DATABASE);
      };
    }
    this.ides.add(stream);
    if (this.ides.size === 1) this.watch();
    this.send(stream, "hello", this.status());
    this.broadcastStatus();
    return () => {
      this.ides.delete(stream);
      if (!this.ides.size) this.unwatch();
      this.broadcastStatus();
    };
  }
  status() {
    return { pages: this.pages.length, clients: this.ides.size, recent: this.recent };
  }
  send(stream, event, data) {
    stream.write(`event: ${event}
data: ${JSON.stringify(data)}

`);
    stream.flush?.();
  }
  broadcastStatus() {
    const status = this.status();
    for (const stream of [...this.ides, ...this.pages.map((p) => p.stream)])
      this.send(stream, "status", status);
  }
  /** The page writes go to: the one connected last; for a database table, the page with its chat open. */
  page(unit) {
    if (unit.kind !== "database") return this.pages.at(-1);
    const { avatar, group, chat } = JSON.parse(unit.id);
    return [...this.pages].reverse().find(({ database: d }) => d && d.chat === chat && d.avatar === avatar && d.group === group);
  }
  /** A page reports the chat it has open and that chat's database tables (null: none). */
  setDatabase(pageId, view) {
    const page = this.pages.find((p) => p.id === pageId);
    if (!page) throw new NotFound("\u9875\u9762\u8FDE\u63A5\u5DF2\u65AD\u5F00\u3002");
    page.database = view ? { ...view, time: Date.now() } : void 0;
    this.later(PAGE_DATABASE);
  }
  reply(request, reply) {
    const waiting = this.pending.get(request);
    if (!waiting) return false;
    clearTimeout(waiting.timer);
    this.pending.delete(request);
    waiting.resolve(reply);
    return true;
  }
  relay(page, unit, base, draft) {
    const request = crypto2.randomUUID();
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(request);
        resolve({
          status: "error",
          message: "\u5DE5\u4F5C\u53F0\u9875\u9762\u6CA1\u6709\u5728 10 \u79D2\u5185\u5B8C\u6210\u5199\u5165\uFF1B\u9875\u9762\u53EF\u80FD\u6B63\u5FD9\uFF0C\u7A0D\u540E\u91CD\u65B0\u8F7D\u5165\u6587\u4EF6\u786E\u8BA4\u7ED3\u679C\u3002"
        });
      }, RELAY_TIMEOUT);
      this.pending.set(request, { resolve, timer });
      this.send(page.stream, "write", {
        request,
        kind: unit.kind,
        id: unit.id,
        path: unit.path,
        base,
        draft
      });
    });
  }
  // ── Versions ─────────────────────────────────────────────────
  /**
   * A file's version: the hash of its text and an mtime of its own, which only moves when its text
   * does. Sibling files rendered from the same source keep theirs, so VS Code sees no false change.
   */
  version(file, text2, unit, sourceMtime) {
    const hash = hashOf(text2), previous = this.versions.get(file);
    if (previous?.hash === hash) return previous;
    const version = {
      hash,
      mtime: previous ? Math.max(Date.now(), previous.mtime + 1) : Math.floor(sourceMtime) || Date.now(),
      size: Buffer.byteLength(text2),
      unit: unit.path,
      source: unit.source
    };
    this.versions.set(file, version);
    return version;
  }
  /** Records a unit's rendered files; returns what changed against what IDEs had seen. */
  track(unit, loaded) {
    const changed = [], created = [], seen = new Set([...this.versions].filter(([, v]) => v.unit === unit.path).map(([p]) => p));
    for (const [rel, text2] of loaded.files) {
      const file = rel ? `${unit.path}/${rel}` : unit.path, previous = this.versions.get(file), version = this.version(file, text2, unit, loaded.mtime);
      seen.delete(file);
      if (!previous) created.push(file);
      else if (previous.hash !== version.hash) changed.push(file);
    }
    for (const file of seen) this.versions.delete(file);
    return { changed, created, deleted: [...seen] };
  }
  push(change) {
    const dirs2 = new Set(change.dirs ?? []);
    for (const file of [...change.created, ...change.deleted]) dirs2.add(parentOf(file));
    if (!change.changed.length && !change.created.length && !change.deleted.length && !dirs2.size) return;
    for (const stream of this.ides) this.send(stream, "changed", { ...change, dirs: [...dirs2] });
  }
  // ── Reads ────────────────────────────────────────────────────
  async open(file) {
    const located = await this.space.locate(split(file));
    if (located.type === "dir") return { located, unit: null, loaded: null };
    const loaded = await this.space.load(located.unit);
    this.push(this.track(located.unit, loaded));
    return { located, unit: located.unit, loaded, rel: located.rel };
  }
  childrenOf(unit, loaded, rel, extraDirs) {
    const prefix = rel ? rel + "/" : "", entries = /* @__PURE__ */ new Map();
    for (const file of loaded.files.keys()) {
      if (!file.startsWith(prefix)) continue;
      const [head, ...rest] = file.slice(prefix.length).split("/");
      entries.set(head, rest.length ? "dir" : "file");
    }
    if (!rel) for (const dir of extraDirs) entries.set(dir, "dir");
    return [...entries].map(([name, type]) => ({ name, type }));
  }
  static extraDirs(unit) {
    return unit.kind === "character" ? ["\u5907\u9009\u5F00\u573A\u767D"] : unit.kind === "preset" ? ["\u63D0\u793A\u8BCD"] : [];
  }
  async list(dir) {
    const opened = await this.open(dir);
    let entries;
    if (!opened.unit) entries = opened.located.type === "dir" ? opened.located.children : [];
    else {
      if (opened.unit.single && !opened.rel) throw new Refused("\u8FD9\u662F\u6587\u4EF6\uFF0C\u4E0D\u662F\u76EE\u5F55\u3002");
      entries = this.childrenOf(opened.unit, opened.loaded, opened.rel, _Hub.extraDirs(opened.unit));
      if (opened.rel && !entries.length && !_Hub.extraDirs(opened.unit).includes(opened.rel))
        throw new NotFound();
    }
    this.listings.set(dir, JSON.stringify(entries));
    return entries;
  }
  async stat(file) {
    const opened = await this.open(file);
    if (!opened.unit) return { type: "dir", mtime: 0, size: 0 };
    const text2 = opened.loaded.files.get(opened.rel);
    if (text2 === void 0) {
      const children = this.childrenOf(opened.unit, opened.loaded, opened.rel, _Hub.extraDirs(opened.unit));
      if (!opened.rel || children.length || _Hub.extraDirs(opened.unit).includes(opened.rel))
        return { type: "dir", mtime: 0, size: 0 };
      throw new NotFound();
    }
    const version = this.versions.get(file);
    return { type: "file", mtime: version.mtime, size: version.size, version: tag(version) };
  }
  async read(file) {
    const opened = await this.open(file);
    const text2 = opened.unit ? opened.loaded.files.get(opened.rel) : void 0;
    if (text2 === void 0) throw opened.unit ? new NotFound() : new Refused("\u8FD9\u662F\u76EE\u5F55\uFF0C\u4E0D\u662F\u6587\u4EF6\u3002");
    const version = this.versions.get(file);
    return { text: text2, version: tag(version), mtime: version.mtime, size: version.size };
  }
  // ── Writes ───────────────────────────────────────────────────
  serial(fn) {
    const run = this.queue.then(fn);
    this.queue = run.catch(() => {
    });
    return run;
  }
  /** Writes a file whose text an IDE last saw at `base` ("" for a file it creates). */
  write(file, text2, base) {
    return this.serial(async () => {
      const opened = await this.open(file);
      if (!opened.unit) throw new Refused("\u4E0D\u80FD\u5728\u8FD9\u91CC\u65B0\u5EFA\u6587\u4EF6\uFF1A\u65B0\u5EFA\u8D44\u6E90\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002", 405);
      const current = opened.loaded.files.get(opened.rel);
      this.checkBase(file, current, base);
      const draft = await this.space.apply(opened.unit, opened.loaded, opened.rel, text2);
      const route2 = await this.commit(file, opened.unit, opened.loaded, draft);
      const after = this.versions.get(file);
      return {
        route: route2,
        ...after ? { version: tag(after), mtime: after.mtime, size: after.size } : {},
        // The stored text differs from what was sent (defaults filled in, quoting): the IDE reloads.
        normalized: after?.hash !== hashOf(text2)
      };
    });
  }
  remove(file, base) {
    return this.serial(async () => {
      const opened = await this.open(file);
      if (!opened.unit) throw new Refused("\u76EE\u5F55\u4E0D\u80FD\u5220\u9664\uFF1B\u5220\u9664\u8D44\u6E90\u8BF7\u5728\u9152\u9986\u4E2D\u64CD\u4F5C\u3002", 405);
      this.checkBase(file, opened.loaded.files.get(opened.rel), base);
      const draft = this.space.remove(opened.unit, opened.loaded, opened.rel);
      return { route: await this.commit(file, opened.unit, opened.loaded, draft) };
    });
  }
  rename(from, to) {
    return this.serial(async () => {
      const opened = await this.open(from);
      if (!opened.unit || opened.loaded.files.get(opened.rel) === void 0) throw new NotFound();
      const unit = opened.unit, rel = unit.single ? path3.posix.relative(parentOf(unit.path), to) : path3.posix.relative(unit.path, to);
      if (rel.startsWith("..") || !rel) throw new Refused("\u53EA\u80FD\u5728\u540C\u4E00\u76EE\u5F55\u91CC\u6539\u540D\u3002");
      const draft = this.space.rename(
        unit,
        opened.loaded,
        unit.single ? path3.posix.basename(from) : opened.rel,
        rel
      );
      const route2 = await this.commit(from, unit, opened.loaded, draft, [parentOf(from)]);
      await this.open(to);
      const after = this.versions.get(to);
      return { route: route2, ...after ? { version: tag(after) } : {} };
    });
  }
  checkBase(file, current, base) {
    if (current === void 0) {
      if (base) throw new Refused("\u6587\u4EF6\u5DF2\u5728\u9152\u9986\u4E2D\u5220\u9664\u3002", 409);
      return;
    }
    const hash = base.split(":")[1];
    if (!hash || hash !== this.versions.get(file)?.hash)
      throw new Refused("\u6587\u4EF6\u5DF2\u5728\u9152\u9986\u4E2D\u4FEE\u6539\uFF1A\u8BF7\u5148\u91CD\u65B0\u8F7D\u5165\uFF0C\u6216\u6BD4\u8F83\u540E\u518D\u4FDD\u5B58\u3002", 409);
  }
  /** Stores a draft through the page when one is connected, else on disk; then pushes what changed. */
  async commit(file, unit, loaded, draft, dirs2 = []) {
    const entry = { time: Date.now(), path: file, route: "none", ok: false };
    try {
      if (sameData(draft, loaded.data)) {
        entry.ok = true;
        return entry.route;
      }
      const page = this.page(unit);
      if (page) {
        const reply = await this.relay(page, unit, loaded.data, draft);
        if (reply.status === "done") entry.route = "page";
        else if (reply.status === "skip" && unit.kind === "outline") {
          await this.space.saveDisk(unit, draft);
          entry.route = "disk";
        } else
          throw new Refused(reply.message || "\u9875\u9762\u6CA1\u6709\u63A5\u53D7\u8FD9\u6B21\u5199\u5165\u3002", reply.status === "skip" ? 409 : 502);
        if (reply.conflicts?.length) entry.message = `\u9875\u9762\u4FDD\u7559\u4E86\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF1A${reply.conflicts.join("\u3001")}`;
      } else {
        await this.space.saveDisk(unit, draft);
        entry.route = "disk";
      }
      entry.ok = true;
      await this.refresh(unit.source, dirs2);
      return entry.route;
    } catch (error) {
      entry.message = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      this.recent.unshift(entry);
      this.recent.splice(20);
      this.broadcastStatus();
    }
  }
  // ── Changes from SillyTavern ─────────────────────────────────
  /**
   * Re-renders every tracked file rendered from `source` and re-reads the listings IDEs have open,
   * then tells IDEs what changed.
   */
  async refresh(source, dirs2 = []) {
    const change = {
      changed: [],
      created: [],
      deleted: [],
      dirs: [...dirs2]
    };
    const units = new Set([...this.versions.values()].filter((v) => v.source === source).map((v) => v.unit));
    for (const unitPath of units) {
      try {
        const located = await this.space.locate(split(unitPath));
        if (located.type !== "unit") throw new NotFound();
        const result = this.track(located.unit, await this.space.load(located.unit));
        change.changed.push(...result.changed);
        change.created.push(...result.created);
        change.deleted.push(...result.deleted);
      } catch {
        for (const [file, version] of this.versions)
          if (version.unit === unitPath) {
            this.versions.delete(file);
            change.deleted.push(file);
          }
      }
    }
    const areas = this.areasOf(source);
    for (const [dir, before] of this.listings) {
      if (!areas.some((area) => under(dir, area))) continue;
      let now = "";
      try {
        const opened = await this.space.locate(split(dir));
        if (opened.type === "dir") now = JSON.stringify(opened.children);
        else if (!units.has(opened.unit.path)) continue;
        else {
          const loaded = await this.space.load(opened.unit);
          now = JSON.stringify(this.childrenOf(opened.unit, loaded, opened.rel, _Hub.extraDirs(opened.unit)));
        }
      } catch {
        this.listings.delete(dir);
        change.dirs.push(parentOf(dir));
        continue;
      }
      if (now !== before) {
        this.listings.set(dir, now);
        change.dirs.push(dir);
      }
    }
    this.push(change);
  }
  /** The top-level folders whose listings a change to `source` can alter. */
  areasOf(source) {
    const d = this.space.dirs, inside = (dir) => source.startsWith(dir + path3.sep);
    if (source === path3.join(d.root, "settings.json")) return ["\u8FDE\u63A5", "\u7528\u6237\u8BBE\u5B9A"];
    if (inside(d.worlds)) return ["\u4E16\u754C\u4E66"];
    if (inside(d.openAI_Settings)) return ["\u9884\u8BBE"];
    if (source === PAGE_DATABASE) return ["\u6570\u636E\u5E93"];
    if (inside(d.characters)) return ["\u89D2\u8272", "\u5927\u7EB2", "\u6570\u636E\u5E93"];
    if (inside(d.groups)) return ["\u5927\u7EB2", "\u6570\u636E\u5E93"];
    if (inside(d.chats) || inside(d.groupChats)) return ["\u5927\u7EB2"];
    return [];
  }
  later(source) {
    clearTimeout(this.timers.get(source));
    this.timers.set(
      source,
      setTimeout(() => {
        this.timers.delete(source);
        void this.serial(() => this.refresh(source)).catch(() => {
        });
      }, DEBOUNCE)
    );
  }
  watch() {
    const d = this.space.dirs, on = (dir, recursive, accept) => {
      try {
        const watcher = fs3.watch(dir, { recursive }, (_type, name) => {
          const file = name?.toString();
          if (file && accept(file) && !path3.basename(file).startsWith("."))
            this.later(path3.join(dir, file));
        });
        watcher.on("error", () => {
        });
        this.watchers.push(watcher);
      } catch {
      }
    };
    on(d.worlds, false, (f) => f.endsWith(".json"));
    on(d.openAI_Settings, false, (f) => f.endsWith(".json"));
    on(d.characters, false, (f) => f.endsWith(".png"));
    on(d.root, false, (f) => f === "settings.json");
    on(d.chats, true, (f) => f.endsWith(".jsonl"));
    on(d.groupChats, false, (f) => f.endsWith(".jsonl"));
    on(d.groups, false, (f) => f.endsWith(".json"));
  }
  unwatch() {
    this.watchers.forEach((w) => w.close());
    this.watchers = [];
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.listings.clear();
  }
  dispose() {
    this.unwatch();
    for (const [request] of this.pending) this.reply(request, { status: "error", message: "\u63D2\u4EF6\u5DF2\u505C\u6B62\u3002" });
    for (const stream of [...this.ides, ...this.pages.map((p) => p.stream)]) stream.end();
  }
};

// server/workbench-sync/src/index.ts
var info = {
  id: "workbench-sync",
  name: "Noval \xB7 Workbench Sync",
  description: "Reads and writes world books, characters, presets, connections, personas, outlines and database tables as readable files."
};
var VERSION = "1";
var hubs = /* @__PURE__ */ new Map();
function hubOf(req) {
  if (!req.user) throw new Refused("\u9700\u8981\u5148\u767B\u5F55\u9152\u9986\u3002", 401);
  const handle = req.user.profile.handle;
  let hub = hubs.get(handle);
  if (!hub) hubs.set(handle, hub = new Hub(req.user.directories));
  return hub;
}
var text = (value) => typeof value === "string" ? value : "";
function pathOf(value) {
  const p = text(value).replace(/^\/+|\/+$/g, "");
  if (p.split("/").some((part) => part === "." || part === ".." || p && !part))
    throw new Refused("\u8DEF\u5F84\u65E0\u6548\u3002");
  return p;
}
async function checkToken(req) {
  const { getConfigValue } = await st(), token = String(getConfigValue("workbenchSync.token", "") ?? "");
  if (!token) return;
  const given = Buffer.from(text(req.headers["x-workbench-sync-token"])), expected = Buffer.from(token);
  if (given.length !== expected.length || !crypto3.timingSafeEqual(given, expected))
    throw new Refused("\u8BBF\u95EE\u4EE4\u724C\u4E0D\u6B63\u786E\uFF08X-Workbench-Sync-Token\uFF09\u3002", 403);
}
function route(handler, ide = true) {
  return async (req, res) => {
    try {
      if (ide) await checkToken(req);
      const result = await handler(req, res);
      if (result !== void 0) res.json(result);
    } catch (error) {
      const [status, body] = error instanceof SyncError ? [422, { error: error.message, line: error.line }] : error instanceof NotFound ? [404, { error: error.message }] : error instanceof Refused ? [error.status, { error: error.message }] : [500, { error: error instanceof Error ? error.message : String(error) }];
      if (status === 500) console.error("workbench-sync:", error);
      res.status(status).json(body);
    }
  };
}
async function init(router) {
  router.get(
    "/info",
    route(async (req) => {
      const hub = hubOf(req), { getConfigValue } = await st();
      return {
        id: info.id,
        version: VERSION,
        user: req.user.profile.handle,
        token: !!getConfigValue("workbenchSync.token", ""),
        ...hub.status()
      };
    }, false)
  );
  router.get(
    "/tree",
    route(async (req) => ({ entries: await hubOf(req).list(pathOf(req.query.path)) }))
  );
  router.get(
    "/stat",
    route(async (req) => hubOf(req).stat(pathOf(req.query.path)))
  );
  router.get(
    "/file",
    route(async (req) => hubOf(req).read(pathOf(req.query.path)))
  );
  router.put(
    "/file",
    route(async (req) => {
      if (typeof req.body?.text !== "string") throw new Refused("\u7F3A\u5C11 text\u3002");
      return hubOf(req).write(pathOf(req.body.path), req.body.text, text(req.body.base));
    })
  );
  router.post(
    "/delete",
    route(async (req) => hubOf(req).remove(pathOf(req.body?.path), text(req.body?.base)))
  );
  router.post(
    "/rename",
    route(async (req) => hubOf(req).rename(pathOf(req.body?.from), pathOf(req.body?.to)))
  );
  router.post(
    "/relay",
    route(async (req) => {
      const reply = req.body;
      if (!hubOf(req).reply(text(reply?.request), reply)) throw new NotFound("\u5199\u5165\u8BF7\u6C42\u5DF2\u8D85\u65F6\u3002");
      return { ok: true };
    }, false)
  );
  router.post(
    "/page-state",
    route(async (req) => {
      const db = req.body?.database;
      const table = (t) => typeof t?.key === "string" && typeof t.name === "string" && Array.isArray(t.columns) && Array.isArray(t.rows);
      if (db !== null && (typeof db?.chat !== "string" || !Array.isArray(db.tables) || !db.tables.every(table)))
        throw new Refused("database \u5E94\u4E3A null \u6216 {chat, tables: [{key, name, columns, rows}]}\u3002");
      hubOf(req).setDatabase(
        text(req.body?.page),
        db && {
          avatar: typeof db.avatar === "string" ? db.avatar : void 0,
          group: typeof db.group === "string" ? db.group : void 0,
          chat: db.chat,
          tables: db.tables
        }
      );
      return { ok: true };
    }, false)
  );
  router.get("/events", async (req, res) => {
    const role = req.query.role === "page" ? "page" : "ide";
    let hub;
    try {
      if (role === "ide") await checkToken(req);
      hub = hubOf(req);
    } catch (error) {
      res.status(error instanceof Refused ? error.status : 500).json({ error: error.message });
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      // no-transform keeps SillyTavern's compression middleware from buffering the stream.
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });
    res.flushHeaders?.();
    const detach = hub.attach(role, res), heartbeat = setInterval(() => {
      res.write(": ping\n\n");
      res.flush?.();
    }, 2e4);
    req.on("close", () => {
      clearInterval(heartbeat);
      detach();
    });
  });
}
async function exit() {
  hubs.forEach((hub) => hub.dispose());
  hubs.clear();
}
export {
  exit,
  info,
  init
};
