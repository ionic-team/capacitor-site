'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const attrHandler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop];
    }
    if (!isNaN(prop)) {
      return obj.__items[prop];
    }
    return undefined;
  },
};
const createAttributeProxy = (caseInsensitive) => new Proxy(new MockAttributeMap(caseInsensitive), attrHandler);
class MockAttributeMap {
  constructor(caseInsensitive = false) {
    this.caseInsensitive = caseInsensitive;
    this.__items = [];
  }
  get length() {
    return this.__items.length;
  }
  item(index) {
    return this.__items[index] || null;
  }
  setNamedItem(attr) {
    attr.namespaceURI = null;
    this.setNamedItemNS(attr);
  }
  setNamedItemNS(attr) {
    if (attr != null && attr.value != null) {
      attr.value = String(attr.value);
    }
    const existingAttr = this.__items.find(a => a.name === attr.name && a.namespaceURI === attr.namespaceURI);
    if (existingAttr != null) {
      existingAttr.value = attr.value;
    }
    else {
      this.__items.push(attr);
    }
  }
  getNamedItem(attrName) {
    if (this.caseInsensitive) {
      attrName = attrName.toLowerCase();
    }
    return this.getNamedItemNS(null, attrName);
  }
  getNamedItemNS(namespaceURI, attrName) {
    namespaceURI = getNamespaceURI(namespaceURI);
    return this.__items.find(attr => attr.name === attrName && getNamespaceURI(attr.namespaceURI) === namespaceURI) || null;
  }
  removeNamedItem(attr) {
    this.removeNamedItemNS(attr);
  }
  removeNamedItemNS(attr) {
    for (let i = 0, ii = this.__items.length; i < ii; i++) {
      if (this.__items[i].name === attr.name && this.__items[i].namespaceURI === attr.namespaceURI) {
        this.__items.splice(i, 1);
        break;
      }
    }
  }
}
function getNamespaceURI(namespaceURI) {
  return namespaceURI === XLINK_NS ? null : namespaceURI;
}
function cloneAttributes(srcAttrs, sortByName = false) {
  const dstAttrs = new MockAttributeMap(srcAttrs.caseInsensitive);
  if (srcAttrs != null) {
    const attrLen = srcAttrs.length;
    if (sortByName && attrLen > 1) {
      const sortedAttrs = [];
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        sortedAttrs.push(dstAttr);
      }
      sortedAttrs.sort(sortAttributes).forEach(attr => {
        dstAttrs.setNamedItemNS(attr);
      });
    }
    else {
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        dstAttrs.setNamedItemNS(dstAttr);
      }
    }
  }
  return dstAttrs;
}
function sortAttributes(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}
class MockAttr {
  constructor(attrName, attrValue, namespaceURI = null) {
    this._name = attrName;
    this._value = String(attrValue);
    this._namespaceURI = namespaceURI;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = String(value);
  }
  get nodeName() {
    return this._name;
  }
  set nodeName(value) {
    this._name = value;
  }
  get nodeValue() {
    return this._value;
  }
  set nodeValue(value) {
    this._value = String(value);
  }
  get namespaceURI() {
    return this._namespaceURI;
  }
  set namespaceURI(namespaceURI) {
    this._namespaceURI = namespaceURI;
  }
}

class MockCustomElementRegistry {
  constructor(win) {
    this.win = win;
  }
  define(tagName, cstr, options) {
    if (tagName.toLowerCase() !== tagName) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
    }
    if (this.__registry == null) {
      this.__registry = new Map();
    }
    this.__registry.set(tagName, { cstr, options });
    if (this.__whenDefined != null) {
      const whenDefinedResolveFns = this.__whenDefined.get(tagName);
      if (whenDefinedResolveFns != null) {
        whenDefinedResolveFns.forEach(whenDefinedResolveFn => {
          whenDefinedResolveFn();
        });
        whenDefinedResolveFns.length = 0;
        this.__whenDefined.delete(tagName);
      }
    }
    const doc = this.win.document;
    if (doc != null) {
      const hosts = doc.querySelectorAll(tagName);
      hosts.forEach(host => {
        if (upgradedElements.has(host) === false) {
          tempDisableCallbacks.add(doc);
          const upgradedCmp = createCustomElement(this, doc, tagName);
          for (let i = 0; i < host.childNodes.length; i++) {
            const childNode = host.childNodes[i];
            childNode.remove();
            upgradedCmp.appendChild(childNode);
          }
          tempDisableCallbacks.delete(doc);
          if (proxyElements.has(host)) {
            proxyElements.set(host, upgradedCmp);
          }
        }
        fireConnectedCallback(host);
      });
    }
  }
  get(tagName) {
    if (this.__registry != null) {
      const def = this.__registry.get(tagName.toLowerCase());
      if (def != null) {
        return def.cstr;
      }
    }
    return undefined;
  }
  upgrade(_rootNode) {
    //
  }
  clear() {
    if (this.__registry != null) {
      this.__registry.clear();
    }
    if (this.__whenDefined != null) {
      this.__whenDefined.clear();
    }
  }
  whenDefined(tagName) {
    tagName = tagName.toLowerCase();
    if (this.__registry != null && this.__registry.has(tagName) === true) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      if (this.__whenDefined == null) {
        this.__whenDefined = new Map();
      }
      let whenDefinedResolveFns = this.__whenDefined.get(tagName);
      if (whenDefinedResolveFns == null) {
        whenDefinedResolveFns = [];
        this.__whenDefined.set(tagName, whenDefinedResolveFns);
      }
      whenDefinedResolveFns.push(resolve);
    });
  }
}
function createCustomElement(customElements, ownerDocument, tagName) {
  const Cstr = customElements.get(tagName);
  if (Cstr != null) {
    const cmp = new Cstr(ownerDocument);
    cmp.nodeName = tagName.toUpperCase();
    upgradedElements.add(cmp);
    return cmp;
  }
  const host = new Proxy({}, {
    get(obj, prop) {
      const elm = proxyElements.get(host);
      if (elm != null) {
        return elm[prop];
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      const elm = proxyElements.get(host);
      if (elm != null) {
        elm[prop] = val;
      }
      else {
        obj[prop] = val;
      }
      return true;
    },
    has(obj, prop) {
      const elm = proxyElements.get(host);
      if (prop in elm) {
        return true;
      }
      if (prop in obj) {
        return true;
      }
      return false;
    },
  });
  const elm = new MockHTMLElement(ownerDocument, tagName);
  proxyElements.set(host, elm);
  return host;
}
const proxyElements = new WeakMap();
const upgradedElements = new WeakSet();
function connectNode(ownerDocument, node) {
  node.ownerDocument = ownerDocument;
  if (node.nodeType === 1 /* ELEMENT_NODE */) {
    if (ownerDocument != null && node.nodeName.includes('-')) {
      const win = ownerDocument.defaultView;
      if (win != null && typeof node.connectedCallback === 'function' && node.isConnected) {
        fireConnectedCallback(node);
      }
      const shadowRoot = node.shadowRoot;
      if (shadowRoot != null) {
        shadowRoot.childNodes.forEach(childNode => {
          connectNode(ownerDocument, childNode);
        });
      }
    }
    node.childNodes.forEach(childNode => {
      connectNode(ownerDocument, childNode);
    });
  }
  else {
    node.childNodes.forEach(childNode => {
      childNode.ownerDocument = ownerDocument;
    });
  }
}
function fireConnectedCallback(node) {
  if (typeof node.connectedCallback === 'function') {
    if (tempDisableCallbacks.has(node.ownerDocument) === false) {
      try {
        node.connectedCallback();
      }
      catch (e) {
        console.error(e);
      }
    }
  }
}
function disconnectNode(node) {
  if (node.nodeType === 1 /* ELEMENT_NODE */) {
    if (node.nodeName.includes('-') === true && typeof node.disconnectedCallback === 'function') {
      if (tempDisableCallbacks.has(node.ownerDocument) === false) {
        try {
          node.disconnectedCallback();
        }
        catch (e) {
          console.error(e);
        }
      }
    }
    node.childNodes.forEach(disconnectNode);
  }
}
function attributeChanged(node, attrName, oldValue, newValue) {
  attrName = attrName.toLowerCase();
  const observedAttributes = node.constructor.observedAttributes;
  if (Array.isArray(observedAttributes) === true && observedAttributes.some(obs => obs.toLowerCase() === attrName) === true) {
    try {
      node.attributeChangedCallback(attrName, oldValue, newValue);
    }
    catch (e) {
      console.error(e);
    }
  }
}
function checkAttributeChanged(node) {
  return node.nodeName.includes('-') === true && typeof node.attributeChangedCallback === 'function';
}
const tempDisableCallbacks = new Set();

function dataset(elm) {
  const ds = {};
  const attributes = elm.attributes;
  const attrLen = attributes.length;
  for (let i = 0; i < attrLen; i++) {
    const attr = attributes.item(i);
    const nodeName = attr.nodeName;
    if (nodeName.startsWith('data-')) {
      ds[dashToPascalCase(nodeName)] = attr.nodeValue;
    }
  }
  return new Proxy(ds, {
    get(_obj, camelCaseProp) {
      return ds[camelCaseProp];
    },
    set(_obj, camelCaseProp, value) {
      const dataAttr = toDataAttribute(camelCaseProp);
      elm.setAttribute(dataAttr, value);
      return true;
    },
  });
}
function toDataAttribute(str) {
  return ('data-' +
    String(str)
      .replace(/([A-Z0-9])/g, g => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
      .toLowerCase());
}
function dashToPascalCase(str) {
  str = String(str).substr(5);
  return str
    .split('-')
    .map((segment, index) => {
    if (index === 0) {
      return segment.charAt(0).toLowerCase() + segment.slice(1);
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  })
    .join('');
}

const Sizzle = (function() {

const window = {
  document: {
  createElement() {
    return {};
  },
  nodeType: 9,
  documentElement: {
    nodeType: 1,
    nodeName: 'HTML'
  }
  }
};

const module = { exports: {} };

/*! Sizzle v2.3.5 | (c) JS Foundation and other contributors | js.foundation */
!function(e){var t,n,r,i,o,u,l,a,c,s,d,f,p,h,g,m,y,v,w,b="sizzle"+1*new Date,N=e.document,C=0,x=0,E=ae(),A=ae(),S=ae(),D=ae(),T=function(e,t){return e===t&&(d=!0),0},L={}.hasOwnProperty,q=[],I=q.pop,B=q.push,R=q.push,$=q.slice,k=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return -1},H="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",P="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",z="\\["+M+"*("+P+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+P+"))|)"+M+"*\\]",F=":("+P+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+z+")*)|.*)\\)|)",O=new RegExp(M+"+","g"),j=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),G=new RegExp("^"+M+"*,"+M+"*"),U=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),V=new RegExp(M+"|>"),X=new RegExp(F),J=new RegExp("^"+P+"$"),K={ID:new RegExp("^#("+P+")"),CLASS:new RegExp("^\\.("+P+")"),TAG:new RegExp("^("+P+"|[*])"),ATTR:new RegExp("^"+z),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+H+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/HTML$/i,W=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){f();},ue=ve(function(e){return !0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{R.apply(q=$.call(N.childNodes),N.childNodes),q[N.childNodes.length].nodeType;}catch(e){R={apply:q.length?function(e,t){B.apply(e,$.call(t));}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1;}};}function le(e,t,r,i){var o,l,c,s,d,h,y,v=t&&t.ownerDocument,N=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==N&&9!==N&&11!==N)return r;if(!i&&(f(t),t=t||p,g)){if(11!==N&&(d=_.exec(e)))if(o=d[1]){if(9===N){if(!(c=t.getElementById(o)))return r;if(c.id===o)return r.push(c),r}else if(v&&(c=v.getElementById(o))&&w(t,c)&&c.id===o)return r.push(c),r}else{if(d[2])return R.apply(r,t.getElementsByTagName(e)),r;if((o=d[3])&&n.getElementsByClassName&&t.getElementsByClassName)return R.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!D[e+" "]&&(!m||!m.test(e))&&(1!==N||"object"!==t.nodeName.toLowerCase())){if(y=e,v=t,1===N&&(V.test(e)||U.test(e))){(v=ee.test(e)&&ge(t.parentNode)||t)===t&&n.scope||((s=t.getAttribute("id"))?s=s.replace(re,ie):t.setAttribute("id",s=b)),l=(h=u(e)).length;while(l--)h[l]=(s?"#"+s:":scope")+" "+ye(h[l]);y=h.join(",");}try{return R.apply(r,v.querySelectorAll(y)),r}catch(t){D(e,!0);}finally{s===b&&t.removeAttribute("id");}}}return a(e.replace(j,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function ce(e){return e[b]=!0,e}function se(e){var t=p.createElement("fieldset");try{return !!e(t)}catch(e){return !1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null;}}function de(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t;}function fe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return -1;return e?1:-1}function pe(e){return function(t){return "form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ue(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return ce(function(t){return t=+t,ce(function(n,r){var i,o=e([],n.length,t),u=o.length;while(u--)n[i=o[u]]&&(n[i]=!(r[i]=n[i]));})})}function ge(e){return e&&void 0!==e.getElementsByTagName&&e}n=le.support={},o=le.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return !Q.test(t||n&&n.nodeName||"HTML")},f=le.setDocument=function(e){var t,i,u=e?e.ownerDocument||e:N;return u!=p&&9===u.nodeType&&u.documentElement?(p=u,h=p.documentElement,g=!o(p),N!=p&&(i=p.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",oe,!1):i.attachEvent&&i.attachEvent("onunload",oe)),n.scope=se(function(e){return h.appendChild(e).appendChild(p.createElement("div")),void 0!==e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),n.attributes=se(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=se(function(e){return e.appendChild(p.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Z.test(p.getElementsByClassName),n.getById=se(function(e){return h.appendChild(e).id=b,!p.getElementsByName||!p.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return [o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return [o]}return []}}),r.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&g)return t.getElementsByClassName(e)},y=[],m=[],(n.qsa=Z.test(p.querySelectorAll))&&(se(function(e){var t;h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&m.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||m.push("\\["+M+"*(?:value|"+H+")"),e.querySelectorAll("[id~="+b+"-]").length||m.push("~="),(t=p.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||m.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||m.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||m.push(".#.+[+~]"),e.querySelectorAll("\\\f"),m.push("[\\r\\n\\f]");}),se(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=p.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&m.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&m.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&m.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),m.push(",.*:");})),(n.matchesSelector=Z.test(v=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&se(function(e){n.disconnectedMatch=v.call(e,"*"),v.call(e,"[s!='']:x"),y.push("!=",F);}),m=m.length&&new RegExp(m.join("|")),y=y.length&&new RegExp(y.join("|")),t=Z.test(h.compareDocumentPosition),w=t||Z.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return !0;return !1},T=t?function(e,t){if(e===t)return d=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e==p||e.ownerDocument==N&&w(N,e)?-1:t==p||t.ownerDocument==N&&w(N,t)?1:s?k(s,e)-k(s,t):0:4&r?-1:1)}:function(e,t){if(e===t)return d=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,u=[e],l=[t];if(!i||!o)return e==p?-1:t==p?1:i?-1:o?1:s?k(s,e)-k(s,t):0;if(i===o)return fe(e,t);n=e;while(n=n.parentNode)u.unshift(n);n=t;while(n=n.parentNode)l.unshift(n);while(u[r]===l[r])r++;return r?fe(u[r],l[r]):u[r]==N?-1:l[r]==N?1:0},p):p},le.matches=function(e,t){return le(e,null,null,t)},le.matchesSelector=function(e,t){if(f(e),n.matchesSelector&&g&&!D[t+" "]&&(!y||!y.test(t))&&(!m||!m.test(t)))try{var r=v.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){D(t,!0);}return le(t,p,null,[e]).length>0},le.contains=function(e,t){return (e.ownerDocument||e)!=p&&f(e),w(e,t)},le.attr=function(e,t){(e.ownerDocument||e)!=p&&f(e);var i=r.attrHandle[t.toLowerCase()],o=i&&L.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},le.escape=function(e){return (e+"").replace(re,ie)},le.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},le.uniqueSort=function(e){var t,r=[],i=0,o=0;if(d=!n.detectDuplicates,s=!n.sortStable&&e.slice(0),e.sort(T),d){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1);}return s=null,e},i=le.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e);}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=le.selectors={cacheLength:50,createPseudo:ce,match:K,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||le.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&le.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return K.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=u(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return "*"===e?function(){return !0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=le.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace(O," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),u="last"!==e.slice(-4),l="of-type"===t;return 1===r&&0===i?function(e){return !!e.parentNode}:function(t,n,a){var c,s,d,f,p,h,g=o!==u?"nextSibling":"previousSibling",m=t.parentNode,y=l&&t.nodeName.toLowerCase(),v=!a&&!l,w=!1;if(m){if(o){while(g){f=t;while(f=f[g])if(l?f.nodeName.toLowerCase()===y:1===f.nodeType)return !1;h=g="only"===e&&!h&&"nextSibling";}return !0}if(h=[u?m.firstChild:m.lastChild],u&&v){w=(p=(c=(s=(d=(f=m)[b]||(f[b]={}))[f.uniqueID]||(d[f.uniqueID]={}))[e]||[])[0]===C&&c[1])&&c[2],f=p&&m.childNodes[p];while(f=++p&&f&&f[g]||(w=p=0)||h.pop())if(1===f.nodeType&&++w&&f===t){s[e]=[C,p,w];break}}else if(v&&(w=p=(c=(s=(d=(f=t)[b]||(f[b]={}))[f.uniqueID]||(d[f.uniqueID]={}))[e]||[])[0]===C&&c[1]),!1===w)while(f=++p&&f&&f[g]||(w=p=0)||h.pop())if((l?f.nodeName.toLowerCase()===y:1===f.nodeType)&&++w&&(v&&((s=(d=f[b]||(f[b]={}))[f.uniqueID]||(d[f.uniqueID]={}))[e]=[C,w]),f===t))break;return (w-=i)===r||w%r==0&&w/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||le.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?ce(function(e,n){var r,o=i(e,t),u=o.length;while(u--)e[r=k(e,o[u])]=!(n[r]=o[u]);}):function(e){return i(e,0,n)}):i}},pseudos:{not:ce(function(e){var t=[],n=[],r=l(e.replace(j,"$1"));return r[b]?ce(function(e,t,n,i){var o,u=r(e,null,i,[]),l=e.length;while(l--)(o=u[l])&&(e[l]=!(t[l]=o));}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:ce(function(e){return function(t){return le(e,t).length>0}}),contains:ce(function(e){return e=e.replace(te,ne),function(t){return (t.textContent||i(t)).indexOf(e)>-1}}),lang:ce(function(e){return J.test(e||"")||le.error("unsupported lang: "+e),e=e.replace(te,ne).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return (n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return !1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:pe(!1),disabled:pe(!0),checked:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return !1;return !0},parent:function(e){return !r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return W.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return "input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return "input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return [0]}),last:he(function(e,t){return [t-1]}),eq:he(function(e,t,n){return [n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in {radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=function(e){return function(t){return "input"===t.nodeName.toLowerCase()&&t.type===e}}(t);for(t in {submit:!0,reset:!0})r.pseudos[t]=function(e){return function(t){var n=t.nodeName.toLowerCase();return ("input"===n||"button"===n)&&t.type===e}}(t);function me(){}me.prototype=r.filters=r.pseudos,r.setFilters=new me,u=le.tokenize=function(e,t){var n,i,o,u,l,a,c,s=A[e+" "];if(s)return t?0:s.slice(0);l=e,a=[],c=r.preFilter;while(l){n&&!(i=G.exec(l))||(i&&(l=l.slice(i[0].length)||l),a.push(o=[])),n=!1,(i=U.exec(l))&&(n=i.shift(),o.push({value:n,type:i[0].replace(j," ")}),l=l.slice(n.length));for(u in r.filter)!(i=K[u].exec(l))||c[u]&&!(i=c[u](i))||(n=i.shift(),o.push({value:n,type:u,matches:i}),l=l.slice(n.length));if(!n)break}return t?l.length:l?le.error(e):A(e,a).slice(0)};function ye(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function ve(e,t,n){var r=t.dir,i=t.next,o=i||r,u=n&&"parentNode"===o,l=x++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||u)return e(t,n,i);return !1}:function(t,n,a){var c,s,d,f=[C,l];if(a){while(t=t[r])if((1===t.nodeType||u)&&e(t,n,a))return !0}else while(t=t[r])if(1===t.nodeType||u)if(d=t[b]||(t[b]={}),s=d[t.uniqueID]||(d[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((c=s[o])&&c[0]===C&&c[1]===l)return f[2]=c[2];if(s[o]=f,f[2]=e(t,n,a))return !0}return !1}}function we(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return !1;return !0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)le(e,t[r],n);return n}function Ne(e,t,n,r,i){for(var o,u=[],l=0,a=e.length,c=null!=t;l<a;l++)(o=e[l])&&(n&&!n(o,r,i)||(u.push(o),c&&t.push(l)));return u}function Ce(e,t,n,r,i,o){return r&&!r[b]&&(r=Ce(r)),i&&!i[b]&&(i=Ce(i,o)),ce(function(o,u,l,a){var c,s,d,f=[],p=[],h=u.length,g=o||be(t||"*",l.nodeType?[l]:l,[]),m=!e||!o&&t?g:Ne(g,f,e,l,a),y=n?i||(o?e:h||r)?[]:u:m;if(n&&n(m,y,l,a),r){c=Ne(y,p),r(c,[],l,a),s=c.length;while(s--)(d=c[s])&&(y[p[s]]=!(m[p[s]]=d));}if(o){if(i||e){if(i){c=[],s=y.length;while(s--)(d=y[s])&&c.push(m[s]=d);i(null,y=[],c,a);}s=y.length;while(s--)(d=y[s])&&(c=i?k(o,d):f[s])>-1&&(o[c]=!(u[c]=d));}}else y=Ne(y===u?y.splice(h,y.length):y),i?i(null,u,y,a):R.apply(u,y);})}function xe(e){for(var t,n,i,o=e.length,u=r.relative[e[0].type],l=u||r.relative[" "],a=u?1:0,s=ve(function(e){return e===t},l,!0),d=ve(function(e){return k(t,e)>-1},l,!0),f=[function(e,n,r){var i=!u&&(r||n!==c)||((t=n).nodeType?s(e,n,r):d(e,n,r));return t=null,i}];a<o;a++)if(n=r.relative[e[a].type])f=[ve(we(f),n)];else{if((n=r.filter[e[a].type].apply(null,e[a].matches))[b]){for(i=++a;i<o;i++)if(r.relative[e[i].type])break;return Ce(a>1&&we(f),a>1&&ye(e.slice(0,a-1).concat({value:" "===e[a-2].type?"*":""})).replace(j,"$1"),n,a<i&&xe(e.slice(a,i)),i<o&&xe(e=e.slice(i)),i<o&&ye(e))}f.push(n);}return we(f)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,u,l,a,s){var d,h,m,y=0,v="0",w=o&&[],b=[],N=c,x=o||i&&r.find.TAG("*",s),E=C+=null==N?1:Math.random()||.1,A=x.length;for(s&&(c=u==p||u||s);v!==A&&null!=(d=x[v]);v++){if(i&&d){h=0,u||d.ownerDocument==p||(f(d),l=!g);while(m=e[h++])if(m(d,u||p,l)){a.push(d);break}s&&(C=E);}n&&((d=!m&&d)&&y--,o&&w.push(d));}if(y+=v,n&&v!==y){h=0;while(m=t[h++])m(w,b,u,l);if(o){if(y>0)while(v--)w[v]||b[v]||(b[v]=I.call(a));b=Ne(b);}R.apply(a,b),s&&!o&&b.length>0&&y+t.length>1&&le.uniqueSort(a);}return s&&(C=E,c=N),w};return n?ce(o):o}l=le.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=u(e)),n=t.length;while(n--)(o=xe(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e;}return o},a=le.select=function(e,t,n,i){var o,a,c,s,d,f="function"==typeof e&&e,p=!i&&u(e=f.selector||e);if(n=n||[],1===p.length){if((a=p[0]=p[0].slice(0)).length>2&&"ID"===(c=a[0]).type&&9===t.nodeType&&g&&r.relative[a[1].type]){if(!(t=(r.find.ID(c.matches[0].replace(te,ne),t)||[])[0]))return n;f&&(t=t.parentNode),e=e.slice(a.shift().value.length);}o=K.needsContext.test(e)?0:a.length;while(o--){if(c=a[o],r.relative[s=c.type])break;if((d=r.find[s])&&(i=d(c.matches[0].replace(te,ne),ee.test(a[0].type)&&ge(t.parentNode)||t))){if(a.splice(o,1),!(e=i.length&&ye(a)))return R.apply(n,i),n;break}}}return (f||l(e,p))(i,t,!g,n,!t||ee.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(T).join("")===b,n.detectDuplicates=!!d,f(),n.sortDetached=se(function(e){return 1&e.compareDocumentPosition(p.createElement("fieldset"))}),se(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||de("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&se(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||de("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),se(function(e){return null==e.getAttribute("disabled")})||de(H,function(e,t,n){var r;if(!n)return !0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null});var Ae=e.Sizzle;le.noConflict=function(){return e.Sizzle===le&&(e.Sizzle=Ae),le},"function"==typeof define&&define.amd?define(function(){return le}):"undefined"!=typeof module&&module.exports?module.exports=le:e.Sizzle=le;}(window);


return module.exports;
})();

function matches(selector, elm) {
  const r = Sizzle.matches(selector, [elm]);
  return r.length > 0;
}
function selectOne(selector, elm) {
  const r = Sizzle(selector, elm);
  return r[0] || null;
}
function selectAll(selector, elm) {
  return Sizzle(selector, elm);
}

class MockClassList {
  constructor(elm) {
    this.elm = elm;
  }
  add(...classNames) {
    const clsNames = getItems(this.elm);
    let updated = false;
    classNames.forEach(className => {
      className = String(className);
      validateClass(className);
      if (clsNames.includes(className) === false) {
        clsNames.push(className);
        updated = true;
      }
    });
    if (updated) {
      this.elm.setAttributeNS(null, 'class', clsNames.join(' '));
    }
  }
  remove(...classNames) {
    const clsNames = getItems(this.elm);
    let updated = false;
    classNames.forEach(className => {
      className = String(className);
      validateClass(className);
      const index = clsNames.indexOf(className);
      if (index > -1) {
        clsNames.splice(index, 1);
        updated = true;
      }
    });
    if (updated) {
      this.elm.setAttributeNS(null, 'class', clsNames.filter(c => c.length > 0).join(' '));
    }
  }
  contains(className) {
    className = String(className);
    return getItems(this.elm).includes(className);
  }
  toggle(className) {
    className = String(className);
    if (this.contains(className) === true) {
      this.remove(className);
    }
    else {
      this.add(className);
    }
  }
  get length() {
    return getItems(this.elm).length;
  }
  item(index) {
    return getItems(this.elm)[index];
  }
  toString() {
    return getItems(this.elm).join(' ');
  }
}
function validateClass(className) {
  if (className === '') {
    throw new Error('The token provided must not be empty.');
  }
  if (/\s/.test(className)) {
    throw new Error(`The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`);
  }
}
function getItems(elm) {
  const className = elm.getAttribute('class');
  if (typeof className === 'string' && className.length > 0) {
    return className
      .trim()
      .split(' ')
      .filter(c => c.length > 0);
  }
  return [];
}

class MockCSSStyleDeclaration {
  constructor() {
    this._styles = new Map();
  }
  setProperty(prop, value) {
    prop = jsCaseToCssCase(prop);
    if (value == null || value === '') {
      this._styles.delete(prop);
    }
    else {
      this._styles.set(prop, String(value));
    }
  }
  getPropertyValue(prop) {
    prop = jsCaseToCssCase(prop);
    return String(this._styles.get(prop) || '');
  }
  removeProperty(prop) {
    prop = jsCaseToCssCase(prop);
    this._styles.delete(prop);
  }
  get length() {
    return this._styles.size;
  }
  get cssText() {
    const cssText = [];
    this._styles.forEach((value, prop) => {
      cssText.push(`${prop}: ${value};`);
    });
    return cssText.join(' ').trim();
  }
  set cssText(cssText) {
    if (cssText == null || cssText === '') {
      this._styles.clear();
      return;
    }
    cssText.split(';').forEach(rule => {
      rule = rule.trim();
      if (rule.length > 0) {
        const splt = rule.split(':');
        if (splt.length > 1) {
          const prop = splt[0].trim();
          const value = splt[1].trim();
          if (prop !== '' && value !== '') {
            this._styles.set(jsCaseToCssCase(prop), value);
          }
        }
      }
    });
  }
}
function createCSSStyleDeclaration() {
  return new Proxy(new MockCSSStyleDeclaration(), cssProxyHandler);
}
const cssProxyHandler = {
  get(cssStyle, prop) {
    if (prop in cssStyle) {
      return cssStyle[prop];
    }
    prop = cssCaseToJsCase(prop);
    return cssStyle.getPropertyValue(prop);
  },
  set(cssStyle, prop, value) {
    if (prop in cssStyle) {
      cssStyle[prop] = value;
    }
    else {
      cssStyle.setProperty(prop, value);
    }
    return true;
  },
};
function cssCaseToJsCase(str) {
  // font-size to fontSize
  if (str.length > 1 && str.includes('-') === true) {
    str = str
      .toLowerCase()
      .split('-')
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join('');
    str = str.substr(0, 1).toLowerCase() + str.substr(1);
  }
  return str;
}
function jsCaseToCssCase(str) {
  // fontSize to font-size
  if (str.length > 1 && str.includes('-') === false && /[A-Z]/.test(str) === true) {
    str = str
      .replace(/([A-Z])/g, g => ' ' + g[0])
      .trim()
      .replace(/ /g, '-')
      .toLowerCase();
  }
  return str;
}

class MockEvent {
  constructor(type, eventInitDict) {
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.composed = false;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.srcElement = null;
    this.target = null;
    if (typeof type !== 'string') {
      throw new Error(`Event type required`);
    }
    this.type = type;
    this.timeStamp = Date.now();
    if (eventInitDict != null) {
      Object.assign(this, eventInitDict);
    }
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
  stopImmediatePropagation() {
    this.cancelBubble = true;
  }
}
class MockCustomEvent extends MockEvent {
  constructor(type, customEventInitDic) {
    super(type);
    this.detail = null;
    if (customEventInitDic != null) {
      Object.assign(this, customEventInitDic);
    }
  }
}
class MockKeyboardEvent extends MockEvent {
  constructor(type, keyboardEventInitDic) {
    super(type);
    this.code = '';
    this.key = '';
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;
    this.location = 0;
    this.repeat = false;
    if (keyboardEventInitDic != null) {
      Object.assign(this, keyboardEventInitDic);
    }
  }
}
class MockMouseEvent extends MockEvent {
  constructor(type, mouseEventInitDic) {
    super(type);
    this.screenX = 0;
    this.screenY = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.altKey = false;
    this.metaKey = false;
    this.button = 0;
    this.buttons = 0;
    this.relatedTarget = null;
    if (mouseEventInitDic != null) {
      Object.assign(this, mouseEventInitDic);
    }
  }
}
class MockEventListener {
  constructor(type, handler) {
    this.type = type;
    this.handler = handler;
  }
}
function addEventListener(elm, type, handler) {
  const target = elm;
  if (target.__listeners == null) {
    target.__listeners = [];
  }
  target.__listeners.push(new MockEventListener(type, handler));
}
function removeEventListener(elm, type, handler) {
  const target = elm;
  if (target != null && Array.isArray(target.__listeners) === true) {
    const elmListener = target.__listeners.find(e => e.type === type && e.handler === handler);
    if (elmListener != null) {
      const index = target.__listeners.indexOf(elmListener);
      target.__listeners.splice(index, 1);
    }
  }
}
function resetEventListeners(target) {
  if (target != null && target.__listeners != null) {
    target.__listeners = null;
  }
}
function triggerEventListener(elm, ev) {
  if (elm == null || ev.cancelBubble === true) {
    return;
  }
  const target = elm;
  ev.currentTarget = elm;
  if (Array.isArray(target.__listeners) === true) {
    const listeners = target.__listeners.filter(e => e.type === ev.type);
    listeners.forEach(listener => {
      try {
        listener.handler.call(target, ev);
      }
      catch (err) {
        console.error(err);
      }
    });
  }
  if (ev.bubbles === false) {
    return;
  }
  if (elm.nodeName === "#document" /* DOCUMENT_NODE */) {
    triggerEventListener(elm.defaultView, ev);
  }
  else {
    triggerEventListener(elm.parentElement, ev);
  }
}
function dispatchEvent(currentTarget, ev) {
  ev.target = currentTarget;
  triggerEventListener(currentTarget, ev);
  return true;
}

function serializeNodeToHtml(elm, opts = {}) {
  const output = {
    currentLineWidth: 0,
    indent: 0,
    isWithinBody: false,
    text: [],
  };
  if (opts.prettyHtml) {
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 2;
    }
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = true;
    }
    opts.approximateLineWidth = -1;
  }
  else {
    opts.prettyHtml = false;
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = false;
    }
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 0;
    }
  }
  if (typeof opts.approximateLineWidth !== 'number') {
    opts.approximateLineWidth = -1;
  }
  if (typeof opts.removeEmptyAttributes !== 'boolean') {
    opts.removeEmptyAttributes = true;
  }
  if (typeof opts.removeAttributeQuotes !== 'boolean') {
    opts.removeAttributeQuotes = false;
  }
  if (typeof opts.removeBooleanAttributeQuotes !== 'boolean') {
    opts.removeBooleanAttributeQuotes = false;
  }
  if (typeof opts.removeHtmlComments !== 'boolean') {
    opts.removeHtmlComments = false;
  }
  if (typeof opts.serializeShadowRoot !== 'boolean') {
    opts.serializeShadowRoot = false;
  }
  if (opts.outerHtml) {
    serializeToHtml(elm, opts, output, false);
  }
  else {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
      serializeToHtml(elm.childNodes[i], opts, output, false);
    }
  }
  if (output.text[0] === '\n') {
    output.text.shift();
  }
  if (output.text[output.text.length - 1] === '\n') {
    output.text.pop();
  }
  return output.text.join('');
}
function serializeToHtml(node, opts, output, isShadowRoot) {
  if (node.nodeType === 1 /* ELEMENT_NODE */ || isShadowRoot) {
    const tagName = isShadowRoot ? 'mock:shadow-root' : getTagName(node);
    if (tagName === 'body') {
      output.isWithinBody = true;
    }
    const ignoreTag = opts.excludeTags != null && opts.excludeTags.includes(tagName);
    if (ignoreTag === false) {
      if (opts.newLines) {
        output.text.push('\n');
        output.currentLineWidth = 0;
      }
      if (opts.indentSpaces > 0) {
        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
        output.currentLineWidth += output.indent;
      }
      output.text.push('<' + tagName);
      output.currentLineWidth += tagName.length + 1;
      const attrsLength = node.attributes.length;
      const attributes = opts.prettyHtml && attrsLength > 1 ? cloneAttributes(node.attributes, true) : node.attributes;
      for (let i = 0; i < attrsLength; i++) {
        const attr = attributes.item(i);
        const attrName = attr.name;
        if (attrName === 'style') {
          continue;
        }
        let attrValue = attr.value;
        if (opts.removeEmptyAttributes && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName)) {
          continue;
        }
        const attrNamespaceURI = attr.namespaceURI;
        if (attrNamespaceURI == null) {
          output.currentLineWidth += attrName.length + 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            output.text.push('\n' + attrName);
            output.currentLineWidth = 0;
          }
          else {
            output.text.push(' ' + attrName);
          }
        }
        else if (attrNamespaceURI === 'http://www.w3.org/XML/1998/namespace') {
          output.text.push(' xml:' + attrName);
          output.currentLineWidth += attrName.length + 5;
        }
        else if (attrNamespaceURI === 'http://www.w3.org/2000/xmlns/') {
          if (attrName !== 'xmlns') {
            output.text.push(' xmlns:' + attrName);
            output.currentLineWidth += attrName.length + 7;
          }
          else {
            output.text.push(' ' + attrName);
            output.currentLineWidth += attrName.length + 1;
          }
        }
        else if (attrNamespaceURI === XLINK_NS) {
          output.text.push(' xlink:' + attrName);
          output.currentLineWidth += attrName.length + 7;
        }
        else {
          output.text.push(' ' + attrNamespaceURI + ':' + attrName);
          output.currentLineWidth += attrNamespaceURI.length + attrName.length + 2;
        }
        if (opts.prettyHtml && attrName === 'class') {
          attrValue = attr.value = attrValue
            .split(' ')
            .filter(t => t !== '')
            .sort()
            .join(' ')
            .trim();
        }
        if (attrValue === '') {
          if (opts.removeBooleanAttributeQuotes && BOOLEAN_ATTR.has(attrName)) {
            continue;
          }
          if (opts.removeEmptyAttributes && attrName.startsWith('data-')) {
            continue;
          }
        }
        if (opts.removeAttributeQuotes && CAN_REMOVE_ATTR_QUOTES.test(attrValue)) {
          output.text.push('=' + escapeString(attrValue, true));
          output.currentLineWidth += attrValue.length + 1;
        }
        else {
          output.text.push('="' + escapeString(attrValue, true) + '"');
          output.currentLineWidth += attrValue.length + 3;
        }
      }
      if (node.hasAttribute('style')) {
        const cssText = node.style.cssText;
        if (opts.approximateLineWidth > 0 && output.currentLineWidth + cssText.length + 10 > opts.approximateLineWidth) {
          output.text.push(`\nstyle="${cssText}">`);
          output.currentLineWidth = 0;
        }
        else {
          output.text.push(` style="${cssText}">`);
          output.currentLineWidth += cssText.length + 10;
        }
      }
      else {
        output.text.push('>');
        output.currentLineWidth += 1;
      }
    }
    if (EMPTY_ELEMENTS.has(tagName) === false) {
      if (opts.serializeShadowRoot && node.shadowRoot != null) {
        output.indent = output.indent + opts.indentSpaces;
        serializeToHtml(node.shadowRoot, opts, output, true);
        output.indent = output.indent - opts.indentSpaces;
        if (opts.newLines &&
          (node.childNodes.length === 0 || (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 /* TEXT_NODE */ && node.childNodes[0].nodeValue.trim() === ''))) {
          output.text.push('\n');
          output.currentLineWidth = 0;
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
      }
      if (opts.excludeTagContent == null || opts.excludeTagContent.includes(tagName) === false) {
        const childNodes = tagName === 'template' ? node.content.childNodes : node.childNodes;
        const childNodeLength = childNodes.length;
        if (childNodeLength > 0) {
          if (childNodeLength === 1 && childNodes[0].nodeType === 3 /* TEXT_NODE */ && (typeof childNodes[0].nodeValue !== 'string' || childNodes[0].nodeValue.trim() === '')) ;
          else {
            if (opts.indentSpaces > 0 && ignoreTag === false) {
              output.indent = output.indent + opts.indentSpaces;
            }
            for (let i = 0; i < childNodeLength; i++) {
              serializeToHtml(childNodes[i], opts, output, false);
            }
            if (ignoreTag === false) {
              if (opts.newLines) {
                output.text.push('\n');
                output.currentLineWidth = 0;
              }
              if (opts.indentSpaces > 0) {
                output.indent = output.indent - opts.indentSpaces;
                for (let i = 0; i < output.indent; i++) {
                  output.text.push(' ');
                }
                output.currentLineWidth += output.indent;
              }
            }
          }
        }
        if (ignoreTag === false) {
          output.text.push('</' + tagName + '>');
          output.currentLineWidth += tagName.length + 3;
        }
      }
    }
    if (opts.approximateLineWidth > 0 && STRUCTURE_ELEMENTS.has(tagName)) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }
    if (tagName === 'body') {
      output.isWithinBody = false;
    }
  }
  else if (node.nodeType === 3 /* TEXT_NODE */) {
    let textContent = node.nodeValue;
    if (typeof textContent === 'string') {
      const trimmedTextContent = textContent.trim();
      if (trimmedTextContent === '') {
        // this text node is whitespace only
        if (isWithinWhitespaceSensitive(node)) {
          // whitespace matters within this element
          // just add the exact text we were given
          output.text.push(textContent);
          output.currentLineWidth += textContent.length;
        }
        else if (opts.approximateLineWidth > 0 && !output.isWithinBody) ;
        else if (!opts.prettyHtml) {
          // this text node is only whitespace, and it's not
          // within a whitespace sensitive element like <pre> or <code>
          // so replace the entire white space with a single new line
          output.currentLineWidth += 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            // good enough for a new line
            // for perf these are all just estimates
            // we don't care to ensure exact line lengths
            output.text.push('\n');
            output.currentLineWidth = 0;
          }
          else {
            // let's keep it all on the same line yet
            output.text.push(' ');
          }
        }
      }
      else {
        // this text node has text content
        if (opts.newLines) {
          output.text.push('\n');
          output.currentLineWidth = 0;
        }
        if (opts.indentSpaces > 0) {
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
        let textContentLength = textContent.length;
        if (textContentLength > 0) {
          // this text node has text content
          const parentTagName = node.parentNode != null && node.parentNode.nodeType === 1 /* ELEMENT_NODE */ ? node.parentNode.nodeName : null;
          if (NON_ESCAPABLE_CONTENT.has(parentTagName)) {
            // this text node cannot have its content escaped since it's going
            // into an element like <style> or <script>
            if (isWithinWhitespaceSensitive(node)) {
              output.text.push(textContent);
            }
            else {
              output.text.push(trimmedTextContent);
              textContentLength = trimmedTextContent.length;
            }
            output.currentLineWidth += textContentLength;
          }
          else {
            // this text node is going into a normal element and html can be escaped
            if (opts.prettyHtml) {
              // pretty print the text node
              output.text.push(escapeString(textContent.replace(/\s\s+/g, ' ').trim(), false));
              output.currentLineWidth += textContentLength;
            }
            else {
              // not pretty printing the text node
              if (isWithinWhitespaceSensitive(node)) {
                output.currentLineWidth += textContentLength;
              }
              else {
                // this element is not a whitespace sensitive one, like <pre> or <code> so
                // any whitespace at the start and end can be cleaned up to just be one space
                if (/\s/.test(textContent.charAt(0))) {
                  textContent = ' ' + textContent.trimLeft();
                }
                textContentLength = textContent.length;
                if (textContentLength > 1) {
                  if (/\s/.test(textContent.charAt(textContentLength - 1))) {
                    if (opts.approximateLineWidth > 0 && output.currentLineWidth + textContentLength > opts.approximateLineWidth) {
                      textContent = textContent.trimRight() + '\n';
                      output.currentLineWidth = 0;
                    }
                    else {
                      textContent = textContent.trimRight() + ' ';
                    }
                  }
                }
                output.currentLineWidth += textContentLength;
              }
              output.text.push(escapeString(textContent, false));
            }
          }
        }
      }
    }
  }
  else if (node.nodeType === 8 /* COMMENT_NODE */) {
    const nodeValue = node.nodeValue;
    if (opts.removeHtmlComments) {
      const isHydrateAnnotation = nodeValue.startsWith(CONTENT_REF_ID + '.') ||
        nodeValue.startsWith(ORG_LOCATION_ID + '.') ||
        nodeValue.startsWith(SLOT_NODE_ID + '.') ||
        nodeValue.startsWith(TEXT_NODE_ID + '.');
      if (!isHydrateAnnotation) {
        return;
      }
    }
    if (opts.newLines) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }
    if (opts.indentSpaces > 0) {
      for (let i = 0; i < output.indent; i++) {
        output.text.push(' ');
      }
      output.currentLineWidth += output.indent;
    }
    output.text.push('<!--' + nodeValue + '-->');
    output.currentLineWidth += nodeValue.length + 7;
  }
  else if (node.nodeType === 10 /* DOCUMENT_TYPE_NODE */) {
    output.text.push('<!doctype html>');
  }
}
const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>\/\\-]+$/;
function getTagName(element) {
  if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return element.nodeName.toLowerCase();
  }
  else {
    return element.nodeName;
  }
}
function escapeString(str, attrMode) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');
  if (attrMode) {
    return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  }
  return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}
function isWithinWhitespaceSensitive(node) {
  while (node != null) {
    if (WHITESPACE_SENSITIVE.has(node.nodeName)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
/*@__PURE__*/ const NON_ESCAPABLE_CONTENT = new Set(['STYLE', 'SCRIPT', 'IFRAME', 'NOSCRIPT', 'XMP', 'NOEMBED', 'NOFRAMES', 'PLAINTEXT']);
/*@__PURE__*/ const WHITESPACE_SENSITIVE = new Set(['CODE', 'OUTPUT', 'PLAINTEXT', 'PRE', 'TEMPLATE', 'TEXTAREA']);
/*@__PURE__*/ const EMPTY_ELEMENTS = new Set([
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'embed',
  'frame',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'trace',
  'wbr',
]);
/*@__PURE__*/ const REMOVE_EMPTY_ATTR = new Set(['class', 'dir', 'id', 'lang', 'name', 'title']);
/*@__PURE__*/ const BOOLEAN_ATTR = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'compact',
  'controls',
  'declare',
  'default',
  'defaultchecked',
  'defaultmuted',
  'defaultselected',
  'defer',
  'disabled',
  'enabled',
  'formnovalidate',
  'hidden',
  'indeterminate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nohref',
  'nomodule',
  'noresize',
  'noshade',
  'novalidate',
  'nowrap',
  'open',
  'pauseonexit',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'seamless',
  'selected',
  'sortable',
  'truespeed',
  'typemustmatch',
  'visible',
]);
/*@__PURE__*/ const STRUCTURE_ELEMENTS = new Set(['html', 'body', 'head', 'iframe', 'meta', 'link', 'base', 'title', 'script', 'style']);

const parse5=/*@__PURE__*/function(e){const t=[65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];var n="�",s={EOF:-1,NULL:0,TABULATION:9,CARRIAGE_RETURN:13,LINE_FEED:10,FORM_FEED:12,SPACE:32,EXCLAMATION_MARK:33,QUOTATION_MARK:34,NUMBER_SIGN:35,AMPERSAND:38,APOSTROPHE:39,HYPHEN_MINUS:45,SOLIDUS:47,DIGIT_0:48,DIGIT_9:57,SEMICOLON:59,LESS_THAN_SIGN:60,EQUALS_SIGN:61,GREATER_THAN_SIGN:62,QUESTION_MARK:63,LATIN_CAPITAL_A:65,LATIN_CAPITAL_F:70,LATIN_CAPITAL_X:88,LATIN_CAPITAL_Z:90,RIGHT_SQUARE_BRACKET:93,GRAVE_ACCENT:96,LATIN_SMALL_A:97,LATIN_SMALL_F:102,LATIN_SMALL_X:120,LATIN_SMALL_Z:122,REPLACEMENT_CHARACTER:65533},r={DASH_DASH_STRING:[45,45],DOCTYPE_STRING:[68,79,67,84,89,80,69],CDATA_START_STRING:[91,67,68,65,84,65,91],SCRIPT_STRING:[115,99,114,105,112,116],PUBLIC_STRING:[80,85,66,76,73,67],SYSTEM_STRING:[83,89,83,84,69,77]},i=function(e){return e>=55296&&e<=57343},T=function(e){return e>=56320&&e<=57343},o=function(e,t){return 1024*(e-55296)+9216+t},E=function(e){return 32!==e&&10!==e&&13!==e&&9!==e&&12!==e&&e>=1&&e<=31||e>=127&&e<=159},a=function(e){return e>=64976&&e<=65007||t.indexOf(e)>-1},_="control-character-in-input-stream",A="noncharacter-in-input-stream",h="surrogate-in-input-stream",c="non-void-html-element-start-tag-with-trailing-solidus",l="end-tag-with-attributes",m="end-tag-with-trailing-solidus",p="unexpected-solidus-in-tag",N="unexpected-null-character",u="unexpected-question-mark-instead-of-tag-name",O="invalid-first-character-of-tag-name",S="unexpected-equals-sign-before-attribute-name",C="missing-end-tag-name",d="unexpected-character-in-attribute-name",R="unknown-named-character-reference",I="missing-semicolon-after-character-reference",f="unexpected-character-after-doctype-system-identifier",M="unexpected-character-in-unquoted-attribute-value",L="eof-before-tag-name",D="eof-in-tag",g="missing-attribute-value",P="missing-whitespace-between-attributes",k="missing-whitespace-after-doctype-public-keyword",H="missing-whitespace-between-doctype-public-and-system-identifiers",U="missing-whitespace-after-doctype-system-keyword",F="missing-quote-before-doctype-public-identifier",B="missing-quote-before-doctype-system-identifier",G="missing-doctype-public-identifier",K="missing-doctype-system-identifier",b="abrupt-doctype-public-identifier",Y="abrupt-doctype-system-identifier",x="cdata-in-html-content",y="incorrectly-opened-comment",v="eof-in-script-html-comment-like-text",w="eof-in-doctype",Q="nested-comment",X="abrupt-closing-of-empty-comment",W="eof-in-comment",V="incorrectly-closed-comment",j="eof-in-cdata",z="absence-of-digits-in-numeric-character-reference",q="null-character-reference",J="surrogate-character-reference",Z="character-reference-outside-unicode-range",$="control-character-reference",ee="noncharacter-character-reference",te="missing-whitespace-before-doctype-name",ne="missing-doctype-name",se="invalid-character-sequence-after-doctype-name",re="duplicate-attribute",ie="non-conforming-doctype",Te="missing-doctype",oe="misplaced-doctype",Ee="end-tag-without-matching-open-element",ae="closing-of-element-with-open-child-elements",_e="disallowed-content-in-noscript-in-head",Ae="open-elements-left-after-eof",he="abandoned-head-element-child",ce="misplaced-start-tag-for-head-element",le="nested-noscript-in-head",me="eof-in-element-that-can-contain-only-text";const pe=s;var Ne=class{constructor(){this.html=null,this.pos=-1,this.lastGapPos=-1,this.lastCharPos=-1,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=65536;}_err(){}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos;}_processSurrogate(e){if(this.pos!==this.lastCharPos){const t=this.html.charCodeAt(this.pos+1);if(T(t))return this.pos++,this._addGap(),o(e,t)}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,pe.EOF;return this._err(h),e}dropParsedChunk(){this.pos>this.bufferWaterline&&(this.lastCharPos-=this.pos,this.html=this.html.substring(this.pos),this.pos=0,this.lastGapPos=-1,this.gapStack=[]);}write(e,t){this.html?this.html+=e:this.html=e,this.lastCharPos=this.html.length-1,this.endOfChunkHit=!1,this.lastChunkWritten=t;}insertHtmlAtCurrentPos(e){this.html=this.html.substring(0,this.pos+1)+e+this.html.substring(this.pos+1,this.html.length),this.lastCharPos=this.html.length-1,this.endOfChunkHit=!1;}advance(){if(this.pos++,this.pos>this.lastCharPos)return this.endOfChunkHit=!this.lastChunkWritten,pe.EOF;let e=this.html.charCodeAt(this.pos);if(this.skipNextNewLine&&e===pe.LINE_FEED)return this.skipNextNewLine=!1,this._addGap(),this.advance();if(e===pe.CARRIAGE_RETURN)return this.skipNextNewLine=!0,pe.LINE_FEED;return this.skipNextNewLine=!1,i(e)&&(e=this._processSurrogate(e)),e>31&&e<127||e===pe.LINE_FEED||e===pe.CARRIAGE_RETURN||e>159&&e<64976||this._checkForProblematicCharacters(e),e}_checkForProblematicCharacters(e){E(e)?this._err(_):a(e)&&this._err(A);}retreat(){this.pos===this.lastGapPos&&(this.lastGapPos=this.gapStack.pop(),this.pos--),this.pos--;}},ue=new Uint16Array([4,52,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,106,303,412,810,1432,1701,1796,1987,2114,2360,2420,2484,3170,3251,4140,4393,4575,4610,5106,5512,5728,6117,6274,6315,6345,6427,6516,7002,7910,8733,9323,9870,10170,10631,10893,11318,11386,11467,12773,13092,14474,14922,15448,15542,16419,17666,18166,18611,19004,19095,19298,19397,4,16,69,77,97,98,99,102,103,108,109,110,111,112,114,115,116,117,140,150,158,169,176,194,199,210,216,222,226,242,256,266,283,294,108,105,103,5,198,1,59,148,1,198,80,5,38,1,59,156,1,38,99,117,116,101,5,193,1,59,167,1,193,114,101,118,101,59,1,258,4,2,105,121,182,191,114,99,5,194,1,59,189,1,194,59,1,1040,114,59,3,55349,56580,114,97,118,101,5,192,1,59,208,1,192,112,104,97,59,1,913,97,99,114,59,1,256,100,59,1,10835,4,2,103,112,232,237,111,110,59,1,260,102,59,3,55349,56632,112,108,121,70,117,110,99,116,105,111,110,59,1,8289,105,110,103,5,197,1,59,264,1,197,4,2,99,115,272,277,114,59,3,55349,56476,105,103,110,59,1,8788,105,108,100,101,5,195,1,59,292,1,195,109,108,5,196,1,59,301,1,196,4,8,97,99,101,102,111,114,115,117,321,350,354,383,388,394,400,405,4,2,99,114,327,336,107,115,108,97,115,104,59,1,8726,4,2,118,119,342,345,59,1,10983,101,100,59,1,8966,121,59,1,1041,4,3,99,114,116,362,369,379,97,117,115,101,59,1,8757,110,111,117,108,108,105,115,59,1,8492,97,59,1,914,114,59,3,55349,56581,112,102,59,3,55349,56633,101,118,101,59,1,728,99,114,59,1,8492,109,112,101,113,59,1,8782,4,14,72,79,97,99,100,101,102,104,105,108,111,114,115,117,442,447,456,504,542,547,569,573,577,616,678,784,790,796,99,121,59,1,1063,80,89,5,169,1,59,454,1,169,4,3,99,112,121,464,470,497,117,116,101,59,1,262,4,2,59,105,476,478,1,8914,116,97,108,68,105,102,102,101,114,101,110,116,105,97,108,68,59,1,8517,108,101,121,115,59,1,8493,4,4,97,101,105,111,514,520,530,535,114,111,110,59,1,268,100,105,108,5,199,1,59,528,1,199,114,99,59,1,264,110,105,110,116,59,1,8752,111,116,59,1,266,4,2,100,110,553,560,105,108,108,97,59,1,184,116,101,114,68,111,116,59,1,183,114,59,1,8493,105,59,1,935,114,99,108,101,4,4,68,77,80,84,591,596,603,609,111,116,59,1,8857,105,110,117,115,59,1,8854,108,117,115,59,1,8853,105,109,101,115,59,1,8855,111,4,2,99,115,623,646,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8754,101,67,117,114,108,121,4,2,68,81,658,671,111,117,98,108,101,81,117,111,116,101,59,1,8221,117,111,116,101,59,1,8217,4,4,108,110,112,117,688,701,736,753,111,110,4,2,59,101,696,698,1,8759,59,1,10868,4,3,103,105,116,709,717,722,114,117,101,110,116,59,1,8801,110,116,59,1,8751,111,117,114,73,110,116,101,103,114,97,108,59,1,8750,4,2,102,114,742,745,59,1,8450,111,100,117,99,116,59,1,8720,110,116,101,114,67,108,111,99,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8755,111,115,115,59,1,10799,99,114,59,3,55349,56478,112,4,2,59,67,803,805,1,8915,97,112,59,1,8781,4,11,68,74,83,90,97,99,101,102,105,111,115,834,850,855,860,865,888,903,916,921,1011,1415,4,2,59,111,840,842,1,8517,116,114,97,104,100,59,1,10513,99,121,59,1,1026,99,121,59,1,1029,99,121,59,1,1039,4,3,103,114,115,873,879,883,103,101,114,59,1,8225,114,59,1,8609,104,118,59,1,10980,4,2,97,121,894,900,114,111,110,59,1,270,59,1,1044,108,4,2,59,116,910,912,1,8711,97,59,1,916,114,59,3,55349,56583,4,2,97,102,927,998,4,2,99,109,933,992,114,105,116,105,99,97,108,4,4,65,68,71,84,950,957,978,985,99,117,116,101,59,1,180,111,4,2,116,117,964,967,59,1,729,98,108,101,65,99,117,116,101,59,1,733,114,97,118,101,59,1,96,105,108,100,101,59,1,732,111,110,100,59,1,8900,102,101,114,101,110,116,105,97,108,68,59,1,8518,4,4,112,116,117,119,1021,1026,1048,1249,102,59,3,55349,56635,4,3,59,68,69,1034,1036,1041,1,168,111,116,59,1,8412,113,117,97,108,59,1,8784,98,108,101,4,6,67,68,76,82,85,86,1065,1082,1101,1189,1211,1236,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8751,111,4,2,116,119,1089,1092,59,1,168,110,65,114,114,111,119,59,1,8659,4,2,101,111,1107,1141,102,116,4,3,65,82,84,1117,1124,1136,114,114,111,119,59,1,8656,105,103,104,116,65,114,114,111,119,59,1,8660,101,101,59,1,10980,110,103,4,2,76,82,1149,1177,101,102,116,4,2,65,82,1158,1165,114,114,111,119,59,1,10232,105,103,104,116,65,114,114,111,119,59,1,10234,105,103,104,116,65,114,114,111,119,59,1,10233,105,103,104,116,4,2,65,84,1199,1206,114,114,111,119,59,1,8658,101,101,59,1,8872,112,4,2,65,68,1218,1225,114,114,111,119,59,1,8657,111,119,110,65,114,114,111,119,59,1,8661,101,114,116,105,99,97,108,66,97,114,59,1,8741,110,4,6,65,66,76,82,84,97,1264,1292,1299,1352,1391,1408,114,114,111,119,4,3,59,66,85,1276,1278,1283,1,8595,97,114,59,1,10515,112,65,114,114,111,119,59,1,8693,114,101,118,101,59,1,785,101,102,116,4,3,82,84,86,1310,1323,1334,105,103,104,116,86,101,99,116,111,114,59,1,10576,101,101,86,101,99,116,111,114,59,1,10590,101,99,116,111,114,4,2,59,66,1345,1347,1,8637,97,114,59,1,10582,105,103,104,116,4,2,84,86,1362,1373,101,101,86,101,99,116,111,114,59,1,10591,101,99,116,111,114,4,2,59,66,1384,1386,1,8641,97,114,59,1,10583,101,101,4,2,59,65,1399,1401,1,8868,114,114,111,119,59,1,8615,114,114,111,119,59,1,8659,4,2,99,116,1421,1426,114,59,3,55349,56479,114,111,107,59,1,272,4,16,78,84,97,99,100,102,103,108,109,111,112,113,115,116,117,120,1466,1470,1478,1489,1515,1520,1525,1536,1544,1593,1609,1617,1650,1664,1668,1677,71,59,1,330,72,5,208,1,59,1476,1,208,99,117,116,101,5,201,1,59,1487,1,201,4,3,97,105,121,1497,1503,1512,114,111,110,59,1,282,114,99,5,202,1,59,1510,1,202,59,1,1069,111,116,59,1,278,114,59,3,55349,56584,114,97,118,101,5,200,1,59,1534,1,200,101,109,101,110,116,59,1,8712,4,2,97,112,1550,1555,99,114,59,1,274,116,121,4,2,83,86,1563,1576,109,97,108,108,83,113,117,97,114,101,59,1,9723,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9643,4,2,103,112,1599,1604,111,110,59,1,280,102,59,3,55349,56636,115,105,108,111,110,59,1,917,117,4,2,97,105,1624,1640,108,4,2,59,84,1631,1633,1,10869,105,108,100,101,59,1,8770,108,105,98,114,105,117,109,59,1,8652,4,2,99,105,1656,1660,114,59,1,8496,109,59,1,10867,97,59,1,919,109,108,5,203,1,59,1675,1,203,4,2,105,112,1683,1689,115,116,115,59,1,8707,111,110,101,110,116,105,97,108,69,59,1,8519,4,5,99,102,105,111,115,1713,1717,1722,1762,1791,121,59,1,1060,114,59,3,55349,56585,108,108,101,100,4,2,83,86,1732,1745,109,97,108,108,83,113,117,97,114,101,59,1,9724,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9642,4,3,112,114,117,1770,1775,1781,102,59,3,55349,56637,65,108,108,59,1,8704,114,105,101,114,116,114,102,59,1,8497,99,114,59,1,8497,4,12,74,84,97,98,99,100,102,103,111,114,115,116,1822,1827,1834,1848,1855,1877,1882,1887,1890,1896,1978,1984,99,121,59,1,1027,5,62,1,59,1832,1,62,109,109,97,4,2,59,100,1843,1845,1,915,59,1,988,114,101,118,101,59,1,286,4,3,101,105,121,1863,1869,1874,100,105,108,59,1,290,114,99,59,1,284,59,1,1043,111,116,59,1,288,114,59,3,55349,56586,59,1,8921,112,102,59,3,55349,56638,101,97,116,101,114,4,6,69,70,71,76,83,84,1915,1933,1944,1953,1959,1971,113,117,97,108,4,2,59,76,1925,1927,1,8805,101,115,115,59,1,8923,117,108,108,69,113,117,97,108,59,1,8807,114,101,97,116,101,114,59,1,10914,101,115,115,59,1,8823,108,97,110,116,69,113,117,97,108,59,1,10878,105,108,100,101,59,1,8819,99,114,59,3,55349,56482,59,1,8811,4,8,65,97,99,102,105,111,115,117,2005,2012,2026,2032,2036,2049,2073,2089,82,68,99,121,59,1,1066,4,2,99,116,2018,2023,101,107,59,1,711,59,1,94,105,114,99,59,1,292,114,59,1,8460,108,98,101,114,116,83,112,97,99,101,59,1,8459,4,2,112,114,2055,2059,102,59,1,8461,105,122,111,110,116,97,108,76,105,110,101,59,1,9472,4,2,99,116,2079,2083,114,59,1,8459,114,111,107,59,1,294,109,112,4,2,68,69,2097,2107,111,119,110,72,117,109,112,59,1,8782,113,117,97,108,59,1,8783,4,14,69,74,79,97,99,100,102,103,109,110,111,115,116,117,2144,2149,2155,2160,2171,2189,2194,2198,2209,2245,2307,2329,2334,2341,99,121,59,1,1045,108,105,103,59,1,306,99,121,59,1,1025,99,117,116,101,5,205,1,59,2169,1,205,4,2,105,121,2177,2186,114,99,5,206,1,59,2184,1,206,59,1,1048,111,116,59,1,304,114,59,1,8465,114,97,118,101,5,204,1,59,2207,1,204,4,3,59,97,112,2217,2219,2238,1,8465,4,2,99,103,2225,2229,114,59,1,298,105,110,97,114,121,73,59,1,8520,108,105,101,115,59,1,8658,4,2,116,118,2251,2281,4,2,59,101,2257,2259,1,8748,4,2,103,114,2265,2271,114,97,108,59,1,8747,115,101,99,116,105,111,110,59,1,8898,105,115,105,98,108,101,4,2,67,84,2293,2300,111,109,109,97,59,1,8291,105,109,101,115,59,1,8290,4,3,103,112,116,2315,2320,2325,111,110,59,1,302,102,59,3,55349,56640,97,59,1,921,99,114,59,1,8464,105,108,100,101,59,1,296,4,2,107,109,2347,2352,99,121,59,1,1030,108,5,207,1,59,2358,1,207,4,5,99,102,111,115,117,2372,2386,2391,2397,2414,4,2,105,121,2378,2383,114,99,59,1,308,59,1,1049,114,59,3,55349,56589,112,102,59,3,55349,56641,4,2,99,101,2403,2408,114,59,3,55349,56485,114,99,121,59,1,1032,107,99,121,59,1,1028,4,7,72,74,97,99,102,111,115,2436,2441,2446,2452,2467,2472,2478,99,121,59,1,1061,99,121,59,1,1036,112,112,97,59,1,922,4,2,101,121,2458,2464,100,105,108,59,1,310,59,1,1050,114,59,3,55349,56590,112,102,59,3,55349,56642,99,114,59,3,55349,56486,4,11,74,84,97,99,101,102,108,109,111,115,116,2508,2513,2520,2562,2585,2981,2986,3004,3011,3146,3167,99,121,59,1,1033,5,60,1,59,2518,1,60,4,5,99,109,110,112,114,2532,2538,2544,2548,2558,117,116,101,59,1,313,98,100,97,59,1,923,103,59,1,10218,108,97,99,101,116,114,102,59,1,8466,114,59,1,8606,4,3,97,101,121,2570,2576,2582,114,111,110,59,1,317,100,105,108,59,1,315,59,1,1051,4,2,102,115,2591,2907,116,4,10,65,67,68,70,82,84,85,86,97,114,2614,2663,2672,2728,2735,2760,2820,2870,2888,2895,4,2,110,114,2620,2633,103,108,101,66,114,97,99,107,101,116,59,1,10216,114,111,119,4,3,59,66,82,2644,2646,2651,1,8592,97,114,59,1,8676,105,103,104,116,65,114,114,111,119,59,1,8646,101,105,108,105,110,103,59,1,8968,111,4,2,117,119,2679,2692,98,108,101,66,114,97,99,107,101,116,59,1,10214,110,4,2,84,86,2699,2710,101,101,86,101,99,116,111,114,59,1,10593,101,99,116,111,114,4,2,59,66,2721,2723,1,8643,97,114,59,1,10585,108,111,111,114,59,1,8970,105,103,104,116,4,2,65,86,2745,2752,114,114,111,119,59,1,8596,101,99,116,111,114,59,1,10574,4,2,101,114,2766,2792,101,4,3,59,65,86,2775,2777,2784,1,8867,114,114,111,119,59,1,8612,101,99,116,111,114,59,1,10586,105,97,110,103,108,101,4,3,59,66,69,2806,2808,2813,1,8882,97,114,59,1,10703,113,117,97,108,59,1,8884,112,4,3,68,84,86,2829,2841,2852,111,119,110,86,101,99,116,111,114,59,1,10577,101,101,86,101,99,116,111,114,59,1,10592,101,99,116,111,114,4,2,59,66,2863,2865,1,8639,97,114,59,1,10584,101,99,116,111,114,4,2,59,66,2881,2883,1,8636,97,114,59,1,10578,114,114,111,119,59,1,8656,105,103,104,116,97,114,114,111,119,59,1,8660,115,4,6,69,70,71,76,83,84,2922,2936,2947,2956,2962,2974,113,117,97,108,71,114,101,97,116,101,114,59,1,8922,117,108,108,69,113,117,97,108,59,1,8806,114,101,97,116,101,114,59,1,8822,101,115,115,59,1,10913,108,97,110,116,69,113,117,97,108,59,1,10877,105,108,100,101,59,1,8818,114,59,3,55349,56591,4,2,59,101,2992,2994,1,8920,102,116,97,114,114,111,119,59,1,8666,105,100,111,116,59,1,319,4,3,110,112,119,3019,3110,3115,103,4,4,76,82,108,114,3030,3058,3070,3098,101,102,116,4,2,65,82,3039,3046,114,114,111,119,59,1,10229,105,103,104,116,65,114,114,111,119,59,1,10231,105,103,104,116,65,114,114,111,119,59,1,10230,101,102,116,4,2,97,114,3079,3086,114,114,111,119,59,1,10232,105,103,104,116,97,114,114,111,119,59,1,10234,105,103,104,116,97,114,114,111,119,59,1,10233,102,59,3,55349,56643,101,114,4,2,76,82,3123,3134,101,102,116,65,114,114,111,119,59,1,8601,105,103,104,116,65,114,114,111,119,59,1,8600,4,3,99,104,116,3154,3158,3161,114,59,1,8466,59,1,8624,114,111,107,59,1,321,59,1,8810,4,8,97,99,101,102,105,111,115,117,3188,3192,3196,3222,3227,3237,3243,3248,112,59,1,10501,121,59,1,1052,4,2,100,108,3202,3213,105,117,109,83,112,97,99,101,59,1,8287,108,105,110,116,114,102,59,1,8499,114,59,3,55349,56592,110,117,115,80,108,117,115,59,1,8723,112,102,59,3,55349,56644,99,114,59,1,8499,59,1,924,4,9,74,97,99,101,102,111,115,116,117,3271,3276,3283,3306,3422,3427,4120,4126,4137,99,121,59,1,1034,99,117,116,101,59,1,323,4,3,97,101,121,3291,3297,3303,114,111,110,59,1,327,100,105,108,59,1,325,59,1,1053,4,3,103,115,119,3314,3380,3415,97,116,105,118,101,4,3,77,84,86,3327,3340,3365,101,100,105,117,109,83,112,97,99,101,59,1,8203,104,105,4,2,99,110,3348,3357,107,83,112,97,99,101,59,1,8203,83,112,97,99,101,59,1,8203,101,114,121,84,104,105,110,83,112,97,99,101,59,1,8203,116,101,100,4,2,71,76,3389,3405,114,101,97,116,101,114,71,114,101,97,116,101,114,59,1,8811,101,115,115,76,101,115,115,59,1,8810,76,105,110,101,59,1,10,114,59,3,55349,56593,4,4,66,110,112,116,3437,3444,3460,3464,114,101,97,107,59,1,8288,66,114,101,97,107,105,110,103,83,112,97,99,101,59,1,160,102,59,1,8469,4,13,59,67,68,69,71,72,76,78,80,82,83,84,86,3492,3494,3517,3536,3578,3657,3685,3784,3823,3860,3915,4066,4107,1,10988,4,2,111,117,3500,3510,110,103,114,117,101,110,116,59,1,8802,112,67,97,112,59,1,8813,111,117,98,108,101,86,101,114,116,105,99,97,108,66,97,114,59,1,8742,4,3,108,113,120,3544,3552,3571,101,109,101,110,116,59,1,8713,117,97,108,4,2,59,84,3561,3563,1,8800,105,108,100,101,59,3,8770,824,105,115,116,115,59,1,8708,114,101,97,116,101,114,4,7,59,69,70,71,76,83,84,3600,3602,3609,3621,3631,3637,3650,1,8815,113,117,97,108,59,1,8817,117,108,108,69,113,117,97,108,59,3,8807,824,114,101,97,116,101,114,59,3,8811,824,101,115,115,59,1,8825,108,97,110,116,69,113,117,97,108,59,3,10878,824,105,108,100,101,59,1,8821,117,109,112,4,2,68,69,3666,3677,111,119,110,72,117,109,112,59,3,8782,824,113,117,97,108,59,3,8783,824,101,4,2,102,115,3692,3724,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3709,3711,3717,1,8938,97,114,59,3,10703,824,113,117,97,108,59,1,8940,115,4,6,59,69,71,76,83,84,3739,3741,3748,3757,3764,3777,1,8814,113,117,97,108,59,1,8816,114,101,97,116,101,114,59,1,8824,101,115,115,59,3,8810,824,108,97,110,116,69,113,117,97,108,59,3,10877,824,105,108,100,101,59,1,8820,101,115,116,101,100,4,2,71,76,3795,3812,114,101,97,116,101,114,71,114,101,97,116,101,114,59,3,10914,824,101,115,115,76,101,115,115,59,3,10913,824,114,101,99,101,100,101,115,4,3,59,69,83,3838,3840,3848,1,8832,113,117,97,108,59,3,10927,824,108,97,110,116,69,113,117,97,108,59,1,8928,4,2,101,105,3866,3881,118,101,114,115,101,69,108,101,109,101,110,116,59,1,8716,103,104,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3900,3902,3908,1,8939,97,114,59,3,10704,824,113,117,97,108,59,1,8941,4,2,113,117,3921,3973,117,97,114,101,83,117,4,2,98,112,3933,3952,115,101,116,4,2,59,69,3942,3945,3,8847,824,113,117,97,108,59,1,8930,101,114,115,101,116,4,2,59,69,3963,3966,3,8848,824,113,117,97,108,59,1,8931,4,3,98,99,112,3981,4e3,4045,115,101,116,4,2,59,69,3990,3993,3,8834,8402,113,117,97,108,59,1,8840,99,101,101,100,115,4,4,59,69,83,84,4015,4017,4025,4037,1,8833,113,117,97,108,59,3,10928,824,108,97,110,116,69,113,117,97,108,59,1,8929,105,108,100,101,59,3,8831,824,101,114,115,101,116,4,2,59,69,4056,4059,3,8835,8402,113,117,97,108,59,1,8841,105,108,100,101,4,4,59,69,70,84,4080,4082,4089,4100,1,8769,113,117,97,108,59,1,8772,117,108,108,69,113,117,97,108,59,1,8775,105,108,100,101,59,1,8777,101,114,116,105,99,97,108,66,97,114,59,1,8740,99,114,59,3,55349,56489,105,108,100,101,5,209,1,59,4135,1,209,59,1,925,4,14,69,97,99,100,102,103,109,111,112,114,115,116,117,118,4170,4176,4187,4205,4212,4217,4228,4253,4259,4292,4295,4316,4337,4346,108,105,103,59,1,338,99,117,116,101,5,211,1,59,4185,1,211,4,2,105,121,4193,4202,114,99,5,212,1,59,4200,1,212,59,1,1054,98,108,97,99,59,1,336,114,59,3,55349,56594,114,97,118,101,5,210,1,59,4226,1,210,4,3,97,101,105,4236,4241,4246,99,114,59,1,332,103,97,59,1,937,99,114,111,110,59,1,927,112,102,59,3,55349,56646,101,110,67,117,114,108,121,4,2,68,81,4272,4285,111,117,98,108,101,81,117,111,116,101,59,1,8220,117,111,116,101,59,1,8216,59,1,10836,4,2,99,108,4301,4306,114,59,3,55349,56490,97,115,104,5,216,1,59,4314,1,216,105,4,2,108,109,4323,4332,100,101,5,213,1,59,4330,1,213,101,115,59,1,10807,109,108,5,214,1,59,4344,1,214,101,114,4,2,66,80,4354,4380,4,2,97,114,4360,4364,114,59,1,8254,97,99,4,2,101,107,4372,4375,59,1,9182,101,116,59,1,9140,97,114,101,110,116,104,101,115,105,115,59,1,9180,4,9,97,99,102,104,105,108,111,114,115,4413,4422,4426,4431,4435,4438,4448,4471,4561,114,116,105,97,108,68,59,1,8706,121,59,1,1055,114,59,3,55349,56595,105,59,1,934,59,1,928,117,115,77,105,110,117,115,59,1,177,4,2,105,112,4454,4467,110,99,97,114,101,112,108,97,110,101,59,1,8460,102,59,1,8473,4,4,59,101,105,111,4481,4483,4526,4531,1,10939,99,101,100,101,115,4,4,59,69,83,84,4498,4500,4507,4519,1,8826,113,117,97,108,59,1,10927,108,97,110,116,69,113,117,97,108,59,1,8828,105,108,100,101,59,1,8830,109,101,59,1,8243,4,2,100,112,4537,4543,117,99,116,59,1,8719,111,114,116,105,111,110,4,2,59,97,4555,4557,1,8759,108,59,1,8733,4,2,99,105,4567,4572,114,59,3,55349,56491,59,1,936,4,4,85,102,111,115,4585,4594,4599,4604,79,84,5,34,1,59,4592,1,34,114,59,3,55349,56596,112,102,59,1,8474,99,114,59,3,55349,56492,4,12,66,69,97,99,101,102,104,105,111,114,115,117,4636,4642,4650,4681,4704,4763,4767,4771,5047,5069,5081,5094,97,114,114,59,1,10512,71,5,174,1,59,4648,1,174,4,3,99,110,114,4658,4664,4668,117,116,101,59,1,340,103,59,1,10219,114,4,2,59,116,4675,4677,1,8608,108,59,1,10518,4,3,97,101,121,4689,4695,4701,114,111,110,59,1,344,100,105,108,59,1,342,59,1,1056,4,2,59,118,4710,4712,1,8476,101,114,115,101,4,2,69,85,4722,4748,4,2,108,113,4728,4736,101,109,101,110,116,59,1,8715,117,105,108,105,98,114,105,117,109,59,1,8651,112,69,113,117,105,108,105,98,114,105,117,109,59,1,10607,114,59,1,8476,111,59,1,929,103,104,116,4,8,65,67,68,70,84,85,86,97,4792,4840,4849,4905,4912,4972,5022,5040,4,2,110,114,4798,4811,103,108,101,66,114,97,99,107,101,116,59,1,10217,114,111,119,4,3,59,66,76,4822,4824,4829,1,8594,97,114,59,1,8677,101,102,116,65,114,114,111,119,59,1,8644,101,105,108,105,110,103,59,1,8969,111,4,2,117,119,4856,4869,98,108,101,66,114,97,99,107,101,116,59,1,10215,110,4,2,84,86,4876,4887,101,101,86,101,99,116,111,114,59,1,10589,101,99,116,111,114,4,2,59,66,4898,4900,1,8642,97,114,59,1,10581,108,111,111,114,59,1,8971,4,2,101,114,4918,4944,101,4,3,59,65,86,4927,4929,4936,1,8866,114,114,111,119,59,1,8614,101,99,116,111,114,59,1,10587,105,97,110,103,108,101,4,3,59,66,69,4958,4960,4965,1,8883,97,114,59,1,10704,113,117,97,108,59,1,8885,112,4,3,68,84,86,4981,4993,5004,111,119,110,86,101,99,116,111,114,59,1,10575,101,101,86,101,99,116,111,114,59,1,10588,101,99,116,111,114,4,2,59,66,5015,5017,1,8638,97,114,59,1,10580,101,99,116,111,114,4,2,59,66,5033,5035,1,8640,97,114,59,1,10579,114,114,111,119,59,1,8658,4,2,112,117,5053,5057,102,59,1,8477,110,100,73,109,112,108,105,101,115,59,1,10608,105,103,104,116,97,114,114,111,119,59,1,8667,4,2,99,104,5087,5091,114,59,1,8475,59,1,8625,108,101,68,101,108,97,121,101,100,59,1,10740,4,13,72,79,97,99,102,104,105,109,111,113,115,116,117,5134,5150,5157,5164,5198,5203,5259,5265,5277,5283,5374,5380,5385,4,2,67,99,5140,5146,72,99,121,59,1,1065,121,59,1,1064,70,84,99,121,59,1,1068,99,117,116,101,59,1,346,4,5,59,97,101,105,121,5176,5178,5184,5190,5195,1,10940,114,111,110,59,1,352,100,105,108,59,1,350,114,99,59,1,348,59,1,1057,114,59,3,55349,56598,111,114,116,4,4,68,76,82,85,5216,5227,5238,5250,111,119,110,65,114,114,111,119,59,1,8595,101,102,116,65,114,114,111,119,59,1,8592,105,103,104,116,65,114,114,111,119,59,1,8594,112,65,114,114,111,119,59,1,8593,103,109,97,59,1,931,97,108,108,67,105,114,99,108,101,59,1,8728,112,102,59,3,55349,56650,4,2,114,117,5289,5293,116,59,1,8730,97,114,101,4,4,59,73,83,85,5306,5308,5322,5367,1,9633,110,116,101,114,115,101,99,116,105,111,110,59,1,8851,117,4,2,98,112,5329,5347,115,101,116,4,2,59,69,5338,5340,1,8847,113,117,97,108,59,1,8849,101,114,115,101,116,4,2,59,69,5358,5360,1,8848,113,117,97,108,59,1,8850,110,105,111,110,59,1,8852,99,114,59,3,55349,56494,97,114,59,1,8902,4,4,98,99,109,112,5395,5420,5475,5478,4,2,59,115,5401,5403,1,8912,101,116,4,2,59,69,5411,5413,1,8912,113,117,97,108,59,1,8838,4,2,99,104,5426,5468,101,101,100,115,4,4,59,69,83,84,5440,5442,5449,5461,1,8827,113,117,97,108,59,1,10928,108,97,110,116,69,113,117,97,108,59,1,8829,105,108,100,101,59,1,8831,84,104,97,116,59,1,8715,59,1,8721,4,3,59,101,115,5486,5488,5507,1,8913,114,115,101,116,4,2,59,69,5498,5500,1,8835,113,117,97,108,59,1,8839,101,116,59,1,8913,4,11,72,82,83,97,99,102,104,105,111,114,115,5536,5546,5552,5567,5579,5602,5607,5655,5695,5701,5711,79,82,78,5,222,1,59,5544,1,222,65,68,69,59,1,8482,4,2,72,99,5558,5563,99,121,59,1,1035,121,59,1,1062,4,2,98,117,5573,5576,59,1,9,59,1,932,4,3,97,101,121,5587,5593,5599,114,111,110,59,1,356,100,105,108,59,1,354,59,1,1058,114,59,3,55349,56599,4,2,101,105,5613,5631,4,2,114,116,5619,5627,101,102,111,114,101,59,1,8756,97,59,1,920,4,2,99,110,5637,5647,107,83,112,97,99,101,59,3,8287,8202,83,112,97,99,101,59,1,8201,108,100,101,4,4,59,69,70,84,5668,5670,5677,5688,1,8764,113,117,97,108,59,1,8771,117,108,108,69,113,117,97,108,59,1,8773,105,108,100,101,59,1,8776,112,102,59,3,55349,56651,105,112,108,101,68,111,116,59,1,8411,4,2,99,116,5717,5722,114,59,3,55349,56495,114,111,107,59,1,358,4,14,97,98,99,100,102,103,109,110,111,112,114,115,116,117,5758,5789,5805,5823,5830,5835,5846,5852,5921,5937,6089,6095,6101,6108,4,2,99,114,5764,5774,117,116,101,5,218,1,59,5772,1,218,114,4,2,59,111,5781,5783,1,8607,99,105,114,59,1,10569,114,4,2,99,101,5796,5800,121,59,1,1038,118,101,59,1,364,4,2,105,121,5811,5820,114,99,5,219,1,59,5818,1,219,59,1,1059,98,108,97,99,59,1,368,114,59,3,55349,56600,114,97,118,101,5,217,1,59,5844,1,217,97,99,114,59,1,362,4,2,100,105,5858,5905,101,114,4,2,66,80,5866,5892,4,2,97,114,5872,5876,114,59,1,95,97,99,4,2,101,107,5884,5887,59,1,9183,101,116,59,1,9141,97,114,101,110,116,104,101,115,105,115,59,1,9181,111,110,4,2,59,80,5913,5915,1,8899,108,117,115,59,1,8846,4,2,103,112,5927,5932,111,110,59,1,370,102,59,3,55349,56652,4,8,65,68,69,84,97,100,112,115,5955,5985,5996,6009,6026,6033,6044,6075,114,114,111,119,4,3,59,66,68,5967,5969,5974,1,8593,97,114,59,1,10514,111,119,110,65,114,114,111,119,59,1,8645,111,119,110,65,114,114,111,119,59,1,8597,113,117,105,108,105,98,114,105,117,109,59,1,10606,101,101,4,2,59,65,6017,6019,1,8869,114,114,111,119,59,1,8613,114,114,111,119,59,1,8657,111,119,110,97,114,114,111,119,59,1,8661,101,114,4,2,76,82,6052,6063,101,102,116,65,114,114,111,119,59,1,8598,105,103,104,116,65,114,114,111,119,59,1,8599,105,4,2,59,108,6082,6084,1,978,111,110,59,1,933,105,110,103,59,1,366,99,114,59,3,55349,56496,105,108,100,101,59,1,360,109,108,5,220,1,59,6115,1,220,4,9,68,98,99,100,101,102,111,115,118,6137,6143,6148,6152,6166,6250,6255,6261,6267,97,115,104,59,1,8875,97,114,59,1,10987,121,59,1,1042,97,115,104,4,2,59,108,6161,6163,1,8873,59,1,10982,4,2,101,114,6172,6175,59,1,8897,4,3,98,116,121,6183,6188,6238,97,114,59,1,8214,4,2,59,105,6194,6196,1,8214,99,97,108,4,4,66,76,83,84,6209,6214,6220,6231,97,114,59,1,8739,105,110,101,59,1,124,101,112,97,114,97,116,111,114,59,1,10072,105,108,100,101,59,1,8768,84,104,105,110,83,112,97,99,101,59,1,8202,114,59,3,55349,56601,112,102,59,3,55349,56653,99,114,59,3,55349,56497,100,97,115,104,59,1,8874,4,5,99,101,102,111,115,6286,6292,6298,6303,6309,105,114,99,59,1,372,100,103,101,59,1,8896,114,59,3,55349,56602,112,102,59,3,55349,56654,99,114,59,3,55349,56498,4,4,102,105,111,115,6325,6330,6333,6339,114,59,3,55349,56603,59,1,926,112,102,59,3,55349,56655,99,114,59,3,55349,56499,4,9,65,73,85,97,99,102,111,115,117,6365,6370,6375,6380,6391,6405,6410,6416,6422,99,121,59,1,1071,99,121,59,1,1031,99,121,59,1,1070,99,117,116,101,5,221,1,59,6389,1,221,4,2,105,121,6397,6402,114,99,59,1,374,59,1,1067,114,59,3,55349,56604,112,102,59,3,55349,56656,99,114,59,3,55349,56500,109,108,59,1,376,4,8,72,97,99,100,101,102,111,115,6445,6450,6457,6472,6477,6501,6505,6510,99,121,59,1,1046,99,117,116,101,59,1,377,4,2,97,121,6463,6469,114,111,110,59,1,381,59,1,1047,111,116,59,1,379,4,2,114,116,6483,6497,111,87,105,100,116,104,83,112,97,99,101,59,1,8203,97,59,1,918,114,59,1,8488,112,102,59,1,8484,99,114,59,3,55349,56501,4,16,97,98,99,101,102,103,108,109,110,111,112,114,115,116,117,119,6550,6561,6568,6612,6622,6634,6645,6672,6699,6854,6870,6923,6933,6963,6974,6983,99,117,116,101,5,225,1,59,6559,1,225,114,101,118,101,59,1,259,4,6,59,69,100,105,117,121,6582,6584,6588,6591,6600,6609,1,8766,59,3,8766,819,59,1,8767,114,99,5,226,1,59,6598,1,226,116,101,5,180,1,59,6607,1,180,59,1,1072,108,105,103,5,230,1,59,6620,1,230,4,2,59,114,6628,6630,1,8289,59,3,55349,56606,114,97,118,101,5,224,1,59,6643,1,224,4,2,101,112,6651,6667,4,2,102,112,6657,6663,115,121,109,59,1,8501,104,59,1,8501,104,97,59,1,945,4,2,97,112,6678,6692,4,2,99,108,6684,6688,114,59,1,257,103,59,1,10815,5,38,1,59,6697,1,38,4,2,100,103,6705,6737,4,5,59,97,100,115,118,6717,6719,6724,6727,6734,1,8743,110,100,59,1,10837,59,1,10844,108,111,112,101,59,1,10840,59,1,10842,4,7,59,101,108,109,114,115,122,6753,6755,6758,6762,6814,6835,6848,1,8736,59,1,10660,101,59,1,8736,115,100,4,2,59,97,6770,6772,1,8737,4,8,97,98,99,100,101,102,103,104,6790,6793,6796,6799,6802,6805,6808,6811,59,1,10664,59,1,10665,59,1,10666,59,1,10667,59,1,10668,59,1,10669,59,1,10670,59,1,10671,116,4,2,59,118,6821,6823,1,8735,98,4,2,59,100,6830,6832,1,8894,59,1,10653,4,2,112,116,6841,6845,104,59,1,8738,59,1,197,97,114,114,59,1,9084,4,2,103,112,6860,6865,111,110,59,1,261,102,59,3,55349,56658,4,7,59,69,97,101,105,111,112,6886,6888,6891,6897,6900,6904,6908,1,8776,59,1,10864,99,105,114,59,1,10863,59,1,8778,100,59,1,8779,115,59,1,39,114,111,120,4,2,59,101,6917,6919,1,8776,113,59,1,8778,105,110,103,5,229,1,59,6931,1,229,4,3,99,116,121,6941,6946,6949,114,59,3,55349,56502,59,1,42,109,112,4,2,59,101,6957,6959,1,8776,113,59,1,8781,105,108,100,101,5,227,1,59,6972,1,227,109,108,5,228,1,59,6981,1,228,4,2,99,105,6989,6997,111,110,105,110,116,59,1,8755,110,116,59,1,10769,4,16,78,97,98,99,100,101,102,105,107,108,110,111,112,114,115,117,7036,7041,7119,7135,7149,7155,7219,7224,7347,7354,7463,7489,7786,7793,7814,7866,111,116,59,1,10989,4,2,99,114,7047,7094,107,4,4,99,101,112,115,7058,7064,7073,7080,111,110,103,59,1,8780,112,115,105,108,111,110,59,1,1014,114,105,109,101,59,1,8245,105,109,4,2,59,101,7088,7090,1,8765,113,59,1,8909,4,2,118,119,7100,7105,101,101,59,1,8893,101,100,4,2,59,103,7113,7115,1,8965,101,59,1,8965,114,107,4,2,59,116,7127,7129,1,9141,98,114,107,59,1,9142,4,2,111,121,7141,7146,110,103,59,1,8780,59,1,1073,113,117,111,59,1,8222,4,5,99,109,112,114,116,7167,7181,7188,7193,7199,97,117,115,4,2,59,101,7176,7178,1,8757,59,1,8757,112,116,121,118,59,1,10672,115,105,59,1,1014,110,111,117,59,1,8492,4,3,97,104,119,7207,7210,7213,59,1,946,59,1,8502,101,101,110,59,1,8812,114,59,3,55349,56607,103,4,7,99,111,115,116,117,118,119,7241,7262,7288,7305,7328,7335,7340,4,3,97,105,117,7249,7253,7258,112,59,1,8898,114,99,59,1,9711,112,59,1,8899,4,3,100,112,116,7270,7275,7281,111,116,59,1,10752,108,117,115,59,1,10753,105,109,101,115,59,1,10754,4,2,113,116,7294,7300,99,117,112,59,1,10758,97,114,59,1,9733,114,105,97,110,103,108,101,4,2,100,117,7318,7324,111,119,110,59,1,9661,112,59,1,9651,112,108,117,115,59,1,10756,101,101,59,1,8897,101,100,103,101,59,1,8896,97,114,111,119,59,1,10509,4,3,97,107,111,7362,7436,7458,4,2,99,110,7368,7432,107,4,3,108,115,116,7377,7386,7394,111,122,101,110,103,101,59,1,10731,113,117,97,114,101,59,1,9642,114,105,97,110,103,108,101,4,4,59,100,108,114,7411,7413,7419,7425,1,9652,111,119,110,59,1,9662,101,102,116,59,1,9666,105,103,104,116,59,1,9656,107,59,1,9251,4,2,49,51,7442,7454,4,2,50,52,7448,7451,59,1,9618,59,1,9617,52,59,1,9619,99,107,59,1,9608,4,2,101,111,7469,7485,4,2,59,113,7475,7478,3,61,8421,117,105,118,59,3,8801,8421,116,59,1,8976,4,4,112,116,119,120,7499,7504,7517,7523,102,59,3,55349,56659,4,2,59,116,7510,7512,1,8869,111,109,59,1,8869,116,105,101,59,1,8904,4,12,68,72,85,86,98,100,104,109,112,116,117,118,7549,7571,7597,7619,7655,7660,7682,7708,7715,7721,7728,7750,4,4,76,82,108,114,7559,7562,7565,7568,59,1,9559,59,1,9556,59,1,9558,59,1,9555,4,5,59,68,85,100,117,7583,7585,7588,7591,7594,1,9552,59,1,9574,59,1,9577,59,1,9572,59,1,9575,4,4,76,82,108,114,7607,7610,7613,7616,59,1,9565,59,1,9562,59,1,9564,59,1,9561,4,7,59,72,76,82,104,108,114,7635,7637,7640,7643,7646,7649,7652,1,9553,59,1,9580,59,1,9571,59,1,9568,59,1,9579,59,1,9570,59,1,9567,111,120,59,1,10697,4,4,76,82,108,114,7670,7673,7676,7679,59,1,9557,59,1,9554,59,1,9488,59,1,9484,4,5,59,68,85,100,117,7694,7696,7699,7702,7705,1,9472,59,1,9573,59,1,9576,59,1,9516,59,1,9524,105,110,117,115,59,1,8863,108,117,115,59,1,8862,105,109,101,115,59,1,8864,4,4,76,82,108,114,7738,7741,7744,7747,59,1,9563,59,1,9560,59,1,9496,59,1,9492,4,7,59,72,76,82,104,108,114,7766,7768,7771,7774,7777,7780,7783,1,9474,59,1,9578,59,1,9569,59,1,9566,59,1,9532,59,1,9508,59,1,9500,114,105,109,101,59,1,8245,4,2,101,118,7799,7804,118,101,59,1,728,98,97,114,5,166,1,59,7812,1,166,4,4,99,101,105,111,7824,7829,7834,7846,114,59,3,55349,56503,109,105,59,1,8271,109,4,2,59,101,7841,7843,1,8765,59,1,8909,108,4,3,59,98,104,7855,7857,7860,1,92,59,1,10693,115,117,98,59,1,10184,4,2,108,109,7872,7885,108,4,2,59,101,7879,7881,1,8226,116,59,1,8226,112,4,3,59,69,101,7894,7896,7899,1,8782,59,1,10926,4,2,59,113,7905,7907,1,8783,59,1,8783,4,15,97,99,100,101,102,104,105,108,111,114,115,116,117,119,121,7942,8021,8075,8080,8121,8126,8157,8279,8295,8430,8446,8485,8491,8707,8726,4,3,99,112,114,7950,7956,8007,117,116,101,59,1,263,4,6,59,97,98,99,100,115,7970,7972,7977,7984,7998,8003,1,8745,110,100,59,1,10820,114,99,117,112,59,1,10825,4,2,97,117,7990,7994,112,59,1,10827,112,59,1,10823,111,116,59,1,10816,59,3,8745,65024,4,2,101,111,8013,8017,116,59,1,8257,110,59,1,711,4,4,97,101,105,117,8031,8046,8056,8061,4,2,112,114,8037,8041,115,59,1,10829,111,110,59,1,269,100,105,108,5,231,1,59,8054,1,231,114,99,59,1,265,112,115,4,2,59,115,8069,8071,1,10828,109,59,1,10832,111,116,59,1,267,4,3,100,109,110,8088,8097,8104,105,108,5,184,1,59,8095,1,184,112,116,121,118,59,1,10674,116,5,162,2,59,101,8112,8114,1,162,114,100,111,116,59,1,183,114,59,3,55349,56608,4,3,99,101,105,8134,8138,8154,121,59,1,1095,99,107,4,2,59,109,8146,8148,1,10003,97,114,107,59,1,10003,59,1,967,114,4,7,59,69,99,101,102,109,115,8174,8176,8179,8258,8261,8268,8273,1,9675,59,1,10691,4,3,59,101,108,8187,8189,8193,1,710,113,59,1,8791,101,4,2,97,100,8200,8223,114,114,111,119,4,2,108,114,8210,8216,101,102,116,59,1,8634,105,103,104,116,59,1,8635,4,5,82,83,97,99,100,8235,8238,8241,8246,8252,59,1,174,59,1,9416,115,116,59,1,8859,105,114,99,59,1,8858,97,115,104,59,1,8861,59,1,8791,110,105,110,116,59,1,10768,105,100,59,1,10991,99,105,114,59,1,10690,117,98,115,4,2,59,117,8288,8290,1,9827,105,116,59,1,9827,4,4,108,109,110,112,8305,8326,8376,8400,111,110,4,2,59,101,8313,8315,1,58,4,2,59,113,8321,8323,1,8788,59,1,8788,4,2,109,112,8332,8344,97,4,2,59,116,8339,8341,1,44,59,1,64,4,3,59,102,108,8352,8354,8358,1,8705,110,59,1,8728,101,4,2,109,120,8365,8371,101,110,116,59,1,8705,101,115,59,1,8450,4,2,103,105,8382,8395,4,2,59,100,8388,8390,1,8773,111,116,59,1,10861,110,116,59,1,8750,4,3,102,114,121,8408,8412,8417,59,3,55349,56660,111,100,59,1,8720,5,169,2,59,115,8424,8426,1,169,114,59,1,8471,4,2,97,111,8436,8441,114,114,59,1,8629,115,115,59,1,10007,4,2,99,117,8452,8457,114,59,3,55349,56504,4,2,98,112,8463,8474,4,2,59,101,8469,8471,1,10959,59,1,10961,4,2,59,101,8480,8482,1,10960,59,1,10962,100,111,116,59,1,8943,4,7,100,101,108,112,114,118,119,8507,8522,8536,8550,8600,8697,8702,97,114,114,4,2,108,114,8516,8519,59,1,10552,59,1,10549,4,2,112,115,8528,8532,114,59,1,8926,99,59,1,8927,97,114,114,4,2,59,112,8545,8547,1,8630,59,1,10557,4,6,59,98,99,100,111,115,8564,8566,8573,8587,8592,8596,1,8746,114,99,97,112,59,1,10824,4,2,97,117,8579,8583,112,59,1,10822,112,59,1,10826,111,116,59,1,8845,114,59,1,10821,59,3,8746,65024,4,4,97,108,114,118,8610,8623,8663,8672,114,114,4,2,59,109,8618,8620,1,8631,59,1,10556,121,4,3,101,118,119,8632,8651,8656,113,4,2,112,115,8639,8645,114,101,99,59,1,8926,117,99,99,59,1,8927,101,101,59,1,8910,101,100,103,101,59,1,8911,101,110,5,164,1,59,8670,1,164,101,97,114,114,111,119,4,2,108,114,8684,8690,101,102,116,59,1,8630,105,103,104,116,59,1,8631,101,101,59,1,8910,101,100,59,1,8911,4,2,99,105,8713,8721,111,110,105,110,116,59,1,8754,110,116,59,1,8753,108,99,116,121,59,1,9005,4,19,65,72,97,98,99,100,101,102,104,105,106,108,111,114,115,116,117,119,122,8773,8778,8783,8821,8839,8854,8887,8914,8930,8944,9036,9041,9058,9197,9227,9258,9281,9297,9305,114,114,59,1,8659,97,114,59,1,10597,4,4,103,108,114,115,8793,8799,8805,8809,103,101,114,59,1,8224,101,116,104,59,1,8504,114,59,1,8595,104,4,2,59,118,8816,8818,1,8208,59,1,8867,4,2,107,108,8827,8834,97,114,111,119,59,1,10511,97,99,59,1,733,4,2,97,121,8845,8851,114,111,110,59,1,271,59,1,1076,4,3,59,97,111,8862,8864,8880,1,8518,4,2,103,114,8870,8876,103,101,114,59,1,8225,114,59,1,8650,116,115,101,113,59,1,10871,4,3,103,108,109,8895,8902,8907,5,176,1,59,8900,1,176,116,97,59,1,948,112,116,121,118,59,1,10673,4,2,105,114,8920,8926,115,104,116,59,1,10623,59,3,55349,56609,97,114,4,2,108,114,8938,8941,59,1,8643,59,1,8642,4,5,97,101,103,115,118,8956,8986,8989,8996,9001,109,4,3,59,111,115,8965,8967,8983,1,8900,110,100,4,2,59,115,8975,8977,1,8900,117,105,116,59,1,9830,59,1,9830,59,1,168,97,109,109,97,59,1,989,105,110,59,1,8946,4,3,59,105,111,9009,9011,9031,1,247,100,101,5,247,2,59,111,9020,9022,1,247,110,116,105,109,101,115,59,1,8903,110,120,59,1,8903,99,121,59,1,1106,99,4,2,111,114,9048,9053,114,110,59,1,8990,111,112,59,1,8973,4,5,108,112,116,117,119,9070,9076,9081,9130,9144,108,97,114,59,1,36,102,59,3,55349,56661,4,5,59,101,109,112,115,9093,9095,9109,9116,9122,1,729,113,4,2,59,100,9102,9104,1,8784,111,116,59,1,8785,105,110,117,115,59,1,8760,108,117,115,59,1,8724,113,117,97,114,101,59,1,8865,98,108,101,98,97,114,119,101,100,103,101,59,1,8966,110,4,3,97,100,104,9153,9160,9172,114,114,111,119,59,1,8595,111,119,110,97,114,114,111,119,115,59,1,8650,97,114,112,111,111,110,4,2,108,114,9184,9190,101,102,116,59,1,8643,105,103,104,116,59,1,8642,4,2,98,99,9203,9211,107,97,114,111,119,59,1,10512,4,2,111,114,9217,9222,114,110,59,1,8991,111,112,59,1,8972,4,3,99,111,116,9235,9248,9252,4,2,114,121,9241,9245,59,3,55349,56505,59,1,1109,108,59,1,10742,114,111,107,59,1,273,4,2,100,114,9264,9269,111,116,59,1,8945,105,4,2,59,102,9276,9278,1,9663,59,1,9662,4,2,97,104,9287,9292,114,114,59,1,8693,97,114,59,1,10607,97,110,103,108,101,59,1,10662,4,2,99,105,9311,9315,121,59,1,1119,103,114,97,114,114,59,1,10239,4,18,68,97,99,100,101,102,103,108,109,110,111,112,113,114,115,116,117,120,9361,9376,9398,9439,9444,9447,9462,9495,9531,9585,9598,9614,9659,9755,9771,9792,9808,9826,4,2,68,111,9367,9372,111,116,59,1,10871,116,59,1,8785,4,2,99,115,9382,9392,117,116,101,5,233,1,59,9390,1,233,116,101,114,59,1,10862,4,4,97,105,111,121,9408,9414,9430,9436,114,111,110,59,1,283,114,4,2,59,99,9421,9423,1,8790,5,234,1,59,9428,1,234,108,111,110,59,1,8789,59,1,1101,111,116,59,1,279,59,1,8519,4,2,68,114,9453,9458,111,116,59,1,8786,59,3,55349,56610,4,3,59,114,115,9470,9472,9482,1,10906,97,118,101,5,232,1,59,9480,1,232,4,2,59,100,9488,9490,1,10902,111,116,59,1,10904,4,4,59,105,108,115,9505,9507,9515,9518,1,10905,110,116,101,114,115,59,1,9191,59,1,8467,4,2,59,100,9524,9526,1,10901,111,116,59,1,10903,4,3,97,112,115,9539,9544,9564,99,114,59,1,275,116,121,4,3,59,115,118,9554,9556,9561,1,8709,101,116,59,1,8709,59,1,8709,112,4,2,49,59,9571,9583,4,2,51,52,9577,9580,59,1,8196,59,1,8197,1,8195,4,2,103,115,9591,9594,59,1,331,112,59,1,8194,4,2,103,112,9604,9609,111,110,59,1,281,102,59,3,55349,56662,4,3,97,108,115,9622,9635,9640,114,4,2,59,115,9629,9631,1,8917,108,59,1,10723,117,115,59,1,10865,105,4,3,59,108,118,9649,9651,9656,1,949,111,110,59,1,949,59,1,1013,4,4,99,115,117,118,9669,9686,9716,9747,4,2,105,111,9675,9680,114,99,59,1,8790,108,111,110,59,1,8789,4,2,105,108,9692,9696,109,59,1,8770,97,110,116,4,2,103,108,9705,9710,116,114,59,1,10902,101,115,115,59,1,10901,4,3,97,101,105,9724,9729,9734,108,115,59,1,61,115,116,59,1,8799,118,4,2,59,68,9741,9743,1,8801,68,59,1,10872,112,97,114,115,108,59,1,10725,4,2,68,97,9761,9766,111,116,59,1,8787,114,114,59,1,10609,4,3,99,100,105,9779,9783,9788,114,59,1,8495,111,116,59,1,8784,109,59,1,8770,4,2,97,104,9798,9801,59,1,951,5,240,1,59,9806,1,240,4,2,109,114,9814,9822,108,5,235,1,59,9820,1,235,111,59,1,8364,4,3,99,105,112,9834,9838,9843,108,59,1,33,115,116,59,1,8707,4,2,101,111,9849,9859,99,116,97,116,105,111,110,59,1,8496,110,101,110,116,105,97,108,101,59,1,8519,4,12,97,99,101,102,105,106,108,110,111,112,114,115,9896,9910,9914,9921,9954,9960,9967,9989,9994,10027,10036,10164,108,108,105,110,103,100,111,116,115,101,113,59,1,8786,121,59,1,1092,109,97,108,101,59,1,9792,4,3,105,108,114,9929,9935,9950,108,105,103,59,1,64259,4,2,105,108,9941,9945,103,59,1,64256,105,103,59,1,64260,59,3,55349,56611,108,105,103,59,1,64257,108,105,103,59,3,102,106,4,3,97,108,116,9975,9979,9984,116,59,1,9837,105,103,59,1,64258,110,115,59,1,9649,111,102,59,1,402,4,2,112,114,1e4,10005,102,59,3,55349,56663,4,2,97,107,10011,10016,108,108,59,1,8704,4,2,59,118,10022,10024,1,8916,59,1,10969,97,114,116,105,110,116,59,1,10765,4,2,97,111,10042,10159,4,2,99,115,10048,10155,4,6,49,50,51,52,53,55,10062,10102,10114,10135,10139,10151,4,6,50,51,52,53,54,56,10076,10083,10086,10093,10096,10099,5,189,1,59,10081,1,189,59,1,8531,5,188,1,59,10091,1,188,59,1,8533,59,1,8537,59,1,8539,4,2,51,53,10108,10111,59,1,8532,59,1,8534,4,3,52,53,56,10122,10129,10132,5,190,1,59,10127,1,190,59,1,8535,59,1,8540,53,59,1,8536,4,2,54,56,10145,10148,59,1,8538,59,1,8541,56,59,1,8542,108,59,1,8260,119,110,59,1,8994,99,114,59,3,55349,56507,4,17,69,97,98,99,100,101,102,103,105,106,108,110,111,114,115,116,118,10206,10217,10247,10254,10268,10273,10358,10363,10374,10380,10385,10406,10458,10464,10470,10497,10610,4,2,59,108,10212,10214,1,8807,59,1,10892,4,3,99,109,112,10225,10231,10244,117,116,101,59,1,501,109,97,4,2,59,100,10239,10241,1,947,59,1,989,59,1,10886,114,101,118,101,59,1,287,4,2,105,121,10260,10265,114,99,59,1,285,59,1,1075,111,116,59,1,289,4,4,59,108,113,115,10283,10285,10288,10308,1,8805,59,1,8923,4,3,59,113,115,10296,10298,10301,1,8805,59,1,8807,108,97,110,116,59,1,10878,4,4,59,99,100,108,10318,10320,10324,10345,1,10878,99,59,1,10921,111,116,4,2,59,111,10332,10334,1,10880,4,2,59,108,10340,10342,1,10882,59,1,10884,4,2,59,101,10351,10354,3,8923,65024,115,59,1,10900,114,59,3,55349,56612,4,2,59,103,10369,10371,1,8811,59,1,8921,109,101,108,59,1,8503,99,121,59,1,1107,4,4,59,69,97,106,10395,10397,10400,10403,1,8823,59,1,10898,59,1,10917,59,1,10916,4,4,69,97,101,115,10416,10419,10434,10453,59,1,8809,112,4,2,59,112,10426,10428,1,10890,114,111,120,59,1,10890,4,2,59,113,10440,10442,1,10888,4,2,59,113,10448,10450,1,10888,59,1,8809,105,109,59,1,8935,112,102,59,3,55349,56664,97,118,101,59,1,96,4,2,99,105,10476,10480,114,59,1,8458,109,4,3,59,101,108,10489,10491,10494,1,8819,59,1,10894,59,1,10896,5,62,6,59,99,100,108,113,114,10512,10514,10527,10532,10538,10545,1,62,4,2,99,105,10520,10523,59,1,10919,114,59,1,10874,111,116,59,1,8919,80,97,114,59,1,10645,117,101,115,116,59,1,10876,4,5,97,100,101,108,115,10557,10574,10579,10599,10605,4,2,112,114,10563,10570,112,114,111,120,59,1,10886,114,59,1,10616,111,116,59,1,8919,113,4,2,108,113,10586,10592,101,115,115,59,1,8923,108,101,115,115,59,1,10892,101,115,115,59,1,8823,105,109,59,1,8819,4,2,101,110,10616,10626,114,116,110,101,113,113,59,3,8809,65024,69,59,3,8809,65024,4,10,65,97,98,99,101,102,107,111,115,121,10653,10658,10713,10718,10724,10760,10765,10786,10850,10875,114,114,59,1,8660,4,4,105,108,109,114,10668,10674,10678,10684,114,115,112,59,1,8202,102,59,1,189,105,108,116,59,1,8459,4,2,100,114,10690,10695,99,121,59,1,1098,4,3,59,99,119,10703,10705,10710,1,8596,105,114,59,1,10568,59,1,8621,97,114,59,1,8463,105,114,99,59,1,293,4,3,97,108,114,10732,10748,10754,114,116,115,4,2,59,117,10741,10743,1,9829,105,116,59,1,9829,108,105,112,59,1,8230,99,111,110,59,1,8889,114,59,3,55349,56613,115,4,2,101,119,10772,10779,97,114,111,119,59,1,10533,97,114,111,119,59,1,10534,4,5,97,109,111,112,114,10798,10803,10809,10839,10844,114,114,59,1,8703,116,104,116,59,1,8763,107,4,2,108,114,10816,10827,101,102,116,97,114,114,111,119,59,1,8617,105,103,104,116,97,114,114,111,119,59,1,8618,102,59,3,55349,56665,98,97,114,59,1,8213,4,3,99,108,116,10858,10863,10869,114,59,3,55349,56509,97,115,104,59,1,8463,114,111,107,59,1,295,4,2,98,112,10881,10887,117,108,108,59,1,8259,104,101,110,59,1,8208,4,15,97,99,101,102,103,105,106,109,110,111,112,113,115,116,117,10925,10936,10958,10977,10990,11001,11039,11045,11101,11192,11220,11226,11237,11285,11299,99,117,116,101,5,237,1,59,10934,1,237,4,3,59,105,121,10944,10946,10955,1,8291,114,99,5,238,1,59,10953,1,238,59,1,1080,4,2,99,120,10964,10968,121,59,1,1077,99,108,5,161,1,59,10975,1,161,4,2,102,114,10983,10986,59,1,8660,59,3,55349,56614,114,97,118,101,5,236,1,59,10999,1,236,4,4,59,105,110,111,11011,11013,11028,11034,1,8520,4,2,105,110,11019,11024,110,116,59,1,10764,116,59,1,8749,102,105,110,59,1,10716,116,97,59,1,8489,108,105,103,59,1,307,4,3,97,111,112,11053,11092,11096,4,3,99,103,116,11061,11065,11088,114,59,1,299,4,3,101,108,112,11073,11076,11082,59,1,8465,105,110,101,59,1,8464,97,114,116,59,1,8465,104,59,1,305,102,59,1,8887,101,100,59,1,437,4,5,59,99,102,111,116,11113,11115,11121,11136,11142,1,8712,97,114,101,59,1,8453,105,110,4,2,59,116,11129,11131,1,8734,105,101,59,1,10717,100,111,116,59,1,305,4,5,59,99,101,108,112,11154,11156,11161,11179,11186,1,8747,97,108,59,1,8890,4,2,103,114,11167,11173,101,114,115,59,1,8484,99,97,108,59,1,8890,97,114,104,107,59,1,10775,114,111,100,59,1,10812,4,4,99,103,112,116,11202,11206,11211,11216,121,59,1,1105,111,110,59,1,303,102,59,3,55349,56666,97,59,1,953,114,111,100,59,1,10812,117,101,115,116,5,191,1,59,11235,1,191,4,2,99,105,11243,11248,114,59,3,55349,56510,110,4,5,59,69,100,115,118,11261,11263,11266,11271,11282,1,8712,59,1,8953,111,116,59,1,8949,4,2,59,118,11277,11279,1,8948,59,1,8947,59,1,8712,4,2,59,105,11291,11293,1,8290,108,100,101,59,1,297,4,2,107,109,11305,11310,99,121,59,1,1110,108,5,239,1,59,11316,1,239,4,6,99,102,109,111,115,117,11332,11346,11351,11357,11363,11380,4,2,105,121,11338,11343,114,99,59,1,309,59,1,1081,114,59,3,55349,56615,97,116,104,59,1,567,112,102,59,3,55349,56667,4,2,99,101,11369,11374,114,59,3,55349,56511,114,99,121,59,1,1112,107,99,121,59,1,1108,4,8,97,99,102,103,104,106,111,115,11404,11418,11433,11438,11445,11450,11455,11461,112,112,97,4,2,59,118,11413,11415,1,954,59,1,1008,4,2,101,121,11424,11430,100,105,108,59,1,311,59,1,1082,114,59,3,55349,56616,114,101,101,110,59,1,312,99,121,59,1,1093,99,121,59,1,1116,112,102,59,3,55349,56668,99,114,59,3,55349,56512,4,23,65,66,69,72,97,98,99,100,101,102,103,104,106,108,109,110,111,112,114,115,116,117,118,11515,11538,11544,11555,11560,11721,11780,11818,11868,12136,12160,12171,12203,12208,12246,12275,12327,12509,12523,12569,12641,12732,12752,4,3,97,114,116,11523,11528,11532,114,114,59,1,8666,114,59,1,8656,97,105,108,59,1,10523,97,114,114,59,1,10510,4,2,59,103,11550,11552,1,8806,59,1,10891,97,114,59,1,10594,4,9,99,101,103,109,110,112,113,114,116,11580,11586,11594,11600,11606,11624,11627,11636,11694,117,116,101,59,1,314,109,112,116,121,118,59,1,10676,114,97,110,59,1,8466,98,100,97,59,1,955,103,4,3,59,100,108,11615,11617,11620,1,10216,59,1,10641,101,59,1,10216,59,1,10885,117,111,5,171,1,59,11634,1,171,114,4,8,59,98,102,104,108,112,115,116,11655,11657,11669,11673,11677,11681,11685,11690,1,8592,4,2,59,102,11663,11665,1,8676,115,59,1,10527,115,59,1,10525,107,59,1,8617,112,59,1,8619,108,59,1,10553,105,109,59,1,10611,108,59,1,8610,4,3,59,97,101,11702,11704,11709,1,10923,105,108,59,1,10521,4,2,59,115,11715,11717,1,10925,59,3,10925,65024,4,3,97,98,114,11729,11734,11739,114,114,59,1,10508,114,107,59,1,10098,4,2,97,107,11745,11758,99,4,2,101,107,11752,11755,59,1,123,59,1,91,4,2,101,115,11764,11767,59,1,10635,108,4,2,100,117,11774,11777,59,1,10639,59,1,10637,4,4,97,101,117,121,11790,11796,11811,11815,114,111,110,59,1,318,4,2,100,105,11802,11807,105,108,59,1,316,108,59,1,8968,98,59,1,123,59,1,1083,4,4,99,113,114,115,11828,11832,11845,11864,97,59,1,10550,117,111,4,2,59,114,11840,11842,1,8220,59,1,8222,4,2,100,117,11851,11857,104,97,114,59,1,10599,115,104,97,114,59,1,10571,104,59,1,8626,4,5,59,102,103,113,115,11880,11882,12008,12011,12031,1,8804,116,4,5,97,104,108,114,116,11895,11913,11935,11947,11996,114,114,111,119,4,2,59,116,11905,11907,1,8592,97,105,108,59,1,8610,97,114,112,111,111,110,4,2,100,117,11925,11931,111,119,110,59,1,8637,112,59,1,8636,101,102,116,97,114,114,111,119,115,59,1,8647,105,103,104,116,4,3,97,104,115,11959,11974,11984,114,114,111,119,4,2,59,115,11969,11971,1,8596,59,1,8646,97,114,112,111,111,110,115,59,1,8651,113,117,105,103,97,114,114,111,119,59,1,8621,104,114,101,101,116,105,109,101,115,59,1,8907,59,1,8922,4,3,59,113,115,12019,12021,12024,1,8804,59,1,8806,108,97,110,116,59,1,10877,4,5,59,99,100,103,115,12043,12045,12049,12070,12083,1,10877,99,59,1,10920,111,116,4,2,59,111,12057,12059,1,10879,4,2,59,114,12065,12067,1,10881,59,1,10883,4,2,59,101,12076,12079,3,8922,65024,115,59,1,10899,4,5,97,100,101,103,115,12095,12103,12108,12126,12131,112,112,114,111,120,59,1,10885,111,116,59,1,8918,113,4,2,103,113,12115,12120,116,114,59,1,8922,103,116,114,59,1,10891,116,114,59,1,8822,105,109,59,1,8818,4,3,105,108,114,12144,12150,12156,115,104,116,59,1,10620,111,111,114,59,1,8970,59,3,55349,56617,4,2,59,69,12166,12168,1,8822,59,1,10897,4,2,97,98,12177,12198,114,4,2,100,117,12184,12187,59,1,8637,4,2,59,108,12193,12195,1,8636,59,1,10602,108,107,59,1,9604,99,121,59,1,1113,4,5,59,97,99,104,116,12220,12222,12227,12235,12241,1,8810,114,114,59,1,8647,111,114,110,101,114,59,1,8990,97,114,100,59,1,10603,114,105,59,1,9722,4,2,105,111,12252,12258,100,111,116,59,1,320,117,115,116,4,2,59,97,12267,12269,1,9136,99,104,101,59,1,9136,4,4,69,97,101,115,12285,12288,12303,12322,59,1,8808,112,4,2,59,112,12295,12297,1,10889,114,111,120,59,1,10889,4,2,59,113,12309,12311,1,10887,4,2,59,113,12317,12319,1,10887,59,1,8808,105,109,59,1,8934,4,8,97,98,110,111,112,116,119,122,12345,12359,12364,12421,12446,12467,12474,12490,4,2,110,114,12351,12355,103,59,1,10220,114,59,1,8701,114,107,59,1,10214,103,4,3,108,109,114,12373,12401,12409,101,102,116,4,2,97,114,12382,12389,114,114,111,119,59,1,10229,105,103,104,116,97,114,114,111,119,59,1,10231,97,112,115,116,111,59,1,10236,105,103,104,116,97,114,114,111,119,59,1,10230,112,97,114,114,111,119,4,2,108,114,12433,12439,101,102,116,59,1,8619,105,103,104,116,59,1,8620,4,3,97,102,108,12454,12458,12462,114,59,1,10629,59,3,55349,56669,117,115,59,1,10797,105,109,101,115,59,1,10804,4,2,97,98,12480,12485,115,116,59,1,8727,97,114,59,1,95,4,3,59,101,102,12498,12500,12506,1,9674,110,103,101,59,1,9674,59,1,10731,97,114,4,2,59,108,12517,12519,1,40,116,59,1,10643,4,5,97,99,104,109,116,12535,12540,12548,12561,12564,114,114,59,1,8646,111,114,110,101,114,59,1,8991,97,114,4,2,59,100,12556,12558,1,8651,59,1,10605,59,1,8206,114,105,59,1,8895,4,6,97,99,104,105,113,116,12583,12589,12594,12597,12614,12635,113,117,111,59,1,8249,114,59,3,55349,56513,59,1,8624,109,4,3,59,101,103,12606,12608,12611,1,8818,59,1,10893,59,1,10895,4,2,98,117,12620,12623,59,1,91,111,4,2,59,114,12630,12632,1,8216,59,1,8218,114,111,107,59,1,322,5,60,8,59,99,100,104,105,108,113,114,12660,12662,12675,12680,12686,12692,12698,12705,1,60,4,2,99,105,12668,12671,59,1,10918,114,59,1,10873,111,116,59,1,8918,114,101,101,59,1,8907,109,101,115,59,1,8905,97,114,114,59,1,10614,117,101,115,116,59,1,10875,4,2,80,105,12711,12716,97,114,59,1,10646,4,3,59,101,102,12724,12726,12729,1,9667,59,1,8884,59,1,9666,114,4,2,100,117,12739,12746,115,104,97,114,59,1,10570,104,97,114,59,1,10598,4,2,101,110,12758,12768,114,116,110,101,113,113,59,3,8808,65024,69,59,3,8808,65024,4,14,68,97,99,100,101,102,104,105,108,110,111,112,115,117,12803,12809,12893,12908,12914,12928,12933,12937,13011,13025,13032,13049,13052,13069,68,111,116,59,1,8762,4,4,99,108,112,114,12819,12827,12849,12887,114,5,175,1,59,12825,1,175,4,2,101,116,12833,12836,59,1,9794,4,2,59,101,12842,12844,1,10016,115,101,59,1,10016,4,2,59,115,12855,12857,1,8614,116,111,4,4,59,100,108,117,12869,12871,12877,12883,1,8614,111,119,110,59,1,8615,101,102,116,59,1,8612,112,59,1,8613,107,101,114,59,1,9646,4,2,111,121,12899,12905,109,109,97,59,1,10793,59,1,1084,97,115,104,59,1,8212,97,115,117,114,101,100,97,110,103,108,101,59,1,8737,114,59,3,55349,56618,111,59,1,8487,4,3,99,100,110,12945,12954,12985,114,111,5,181,1,59,12952,1,181,4,4,59,97,99,100,12964,12966,12971,12976,1,8739,115,116,59,1,42,105,114,59,1,10992,111,116,5,183,1,59,12983,1,183,117,115,4,3,59,98,100,12995,12997,13e3,1,8722,59,1,8863,4,2,59,117,13006,13008,1,8760,59,1,10794,4,2,99,100,13017,13021,112,59,1,10971,114,59,1,8230,112,108,117,115,59,1,8723,4,2,100,112,13038,13044,101,108,115,59,1,8871,102,59,3,55349,56670,59,1,8723,4,2,99,116,13058,13063,114,59,3,55349,56514,112,111,115,59,1,8766,4,3,59,108,109,13077,13079,13087,1,956,116,105,109,97,112,59,1,8888,97,112,59,1,8888,4,24,71,76,82,86,97,98,99,100,101,102,103,104,105,106,108,109,111,112,114,115,116,117,118,119,13142,13165,13217,13229,13247,13330,13359,13414,13420,13508,13513,13579,13602,13626,13631,13762,13767,13855,13936,13995,14214,14285,14312,14432,4,2,103,116,13148,13152,59,3,8921,824,4,2,59,118,13158,13161,3,8811,8402,59,3,8811,824,4,3,101,108,116,13173,13200,13204,102,116,4,2,97,114,13181,13188,114,114,111,119,59,1,8653,105,103,104,116,97,114,114,111,119,59,1,8654,59,3,8920,824,4,2,59,118,13210,13213,3,8810,8402,59,3,8810,824,105,103,104,116,97,114,114,111,119,59,1,8655,4,2,68,100,13235,13241,97,115,104,59,1,8879,97,115,104,59,1,8878,4,5,98,99,110,112,116,13259,13264,13270,13275,13308,108,97,59,1,8711,117,116,101,59,1,324,103,59,3,8736,8402,4,5,59,69,105,111,112,13287,13289,13293,13298,13302,1,8777,59,3,10864,824,100,59,3,8779,824,115,59,1,329,114,111,120,59,1,8777,117,114,4,2,59,97,13316,13318,1,9838,108,4,2,59,115,13325,13327,1,9838,59,1,8469,4,2,115,117,13336,13344,112,5,160,1,59,13342,1,160,109,112,4,2,59,101,13352,13355,3,8782,824,59,3,8783,824,4,5,97,101,111,117,121,13371,13385,13391,13407,13411,4,2,112,114,13377,13380,59,1,10819,111,110,59,1,328,100,105,108,59,1,326,110,103,4,2,59,100,13399,13401,1,8775,111,116,59,3,10861,824,112,59,1,10818,59,1,1085,97,115,104,59,1,8211,4,7,59,65,97,100,113,115,120,13436,13438,13443,13466,13472,13478,13494,1,8800,114,114,59,1,8663,114,4,2,104,114,13450,13454,107,59,1,10532,4,2,59,111,13460,13462,1,8599,119,59,1,8599,111,116,59,3,8784,824,117,105,118,59,1,8802,4,2,101,105,13484,13489,97,114,59,1,10536,109,59,3,8770,824,105,115,116,4,2,59,115,13503,13505,1,8708,59,1,8708,114,59,3,55349,56619,4,4,69,101,115,116,13523,13527,13563,13568,59,3,8807,824,4,3,59,113,115,13535,13537,13559,1,8817,4,3,59,113,115,13545,13547,13551,1,8817,59,3,8807,824,108,97,110,116,59,3,10878,824,59,3,10878,824,105,109,59,1,8821,4,2,59,114,13574,13576,1,8815,59,1,8815,4,3,65,97,112,13587,13592,13597,114,114,59,1,8654,114,114,59,1,8622,97,114,59,1,10994,4,3,59,115,118,13610,13612,13623,1,8715,4,2,59,100,13618,13620,1,8956,59,1,8954,59,1,8715,99,121,59,1,1114,4,7,65,69,97,100,101,115,116,13647,13652,13656,13661,13665,13737,13742,114,114,59,1,8653,59,3,8806,824,114,114,59,1,8602,114,59,1,8229,4,4,59,102,113,115,13675,13677,13703,13725,1,8816,116,4,2,97,114,13684,13691,114,114,111,119,59,1,8602,105,103,104,116,97,114,114,111,119,59,1,8622,4,3,59,113,115,13711,13713,13717,1,8816,59,3,8806,824,108,97,110,116,59,3,10877,824,4,2,59,115,13731,13734,3,10877,824,59,1,8814,105,109,59,1,8820,4,2,59,114,13748,13750,1,8814,105,4,2,59,101,13757,13759,1,8938,59,1,8940,105,100,59,1,8740,4,2,112,116,13773,13778,102,59,3,55349,56671,5,172,3,59,105,110,13787,13789,13829,1,172,110,4,4,59,69,100,118,13800,13802,13806,13812,1,8713,59,3,8953,824,111,116,59,3,8949,824,4,3,97,98,99,13820,13823,13826,59,1,8713,59,1,8951,59,1,8950,105,4,2,59,118,13836,13838,1,8716,4,3,97,98,99,13846,13849,13852,59,1,8716,59,1,8958,59,1,8957,4,3,97,111,114,13863,13892,13899,114,4,4,59,97,115,116,13874,13876,13883,13888,1,8742,108,108,101,108,59,1,8742,108,59,3,11005,8421,59,3,8706,824,108,105,110,116,59,1,10772,4,3,59,99,101,13907,13909,13914,1,8832,117,101,59,1,8928,4,2,59,99,13920,13923,3,10927,824,4,2,59,101,13929,13931,1,8832,113,59,3,10927,824,4,4,65,97,105,116,13946,13951,13971,13982,114,114,59,1,8655,114,114,4,3,59,99,119,13961,13963,13967,1,8603,59,3,10547,824,59,3,8605,824,103,104,116,97,114,114,111,119,59,1,8603,114,105,4,2,59,101,13990,13992,1,8939,59,1,8941,4,7,99,104,105,109,112,113,117,14011,14036,14060,14080,14085,14090,14106,4,4,59,99,101,114,14021,14023,14028,14032,1,8833,117,101,59,1,8929,59,3,10928,824,59,3,55349,56515,111,114,116,4,2,109,112,14045,14050,105,100,59,1,8740,97,114,97,108,108,101,108,59,1,8742,109,4,2,59,101,14067,14069,1,8769,4,2,59,113,14075,14077,1,8772,59,1,8772,105,100,59,1,8740,97,114,59,1,8742,115,117,4,2,98,112,14098,14102,101,59,1,8930,101,59,1,8931,4,3,98,99,112,14114,14157,14171,4,4,59,69,101,115,14124,14126,14130,14133,1,8836,59,3,10949,824,59,1,8840,101,116,4,2,59,101,14141,14144,3,8834,8402,113,4,2,59,113,14151,14153,1,8840,59,3,10949,824,99,4,2,59,101,14164,14166,1,8833,113,59,3,10928,824,4,4,59,69,101,115,14181,14183,14187,14190,1,8837,59,3,10950,824,59,1,8841,101,116,4,2,59,101,14198,14201,3,8835,8402,113,4,2,59,113,14208,14210,1,8841,59,3,10950,824,4,4,103,105,108,114,14224,14228,14238,14242,108,59,1,8825,108,100,101,5,241,1,59,14236,1,241,103,59,1,8824,105,97,110,103,108,101,4,2,108,114,14254,14269,101,102,116,4,2,59,101,14263,14265,1,8938,113,59,1,8940,105,103,104,116,4,2,59,101,14279,14281,1,8939,113,59,1,8941,4,2,59,109,14291,14293,1,957,4,3,59,101,115,14301,14303,14308,1,35,114,111,59,1,8470,112,59,1,8199,4,9,68,72,97,100,103,105,108,114,115,14332,14338,14344,14349,14355,14369,14376,14408,14426,97,115,104,59,1,8877,97,114,114,59,1,10500,112,59,3,8781,8402,97,115,104,59,1,8876,4,2,101,116,14361,14365,59,3,8805,8402,59,3,62,8402,110,102,105,110,59,1,10718,4,3,65,101,116,14384,14389,14393,114,114,59,1,10498,59,3,8804,8402,4,2,59,114,14399,14402,3,60,8402,105,101,59,3,8884,8402,4,2,65,116,14414,14419,114,114,59,1,10499,114,105,101,59,3,8885,8402,105,109,59,3,8764,8402,4,3,65,97,110,14440,14445,14468,114,114,59,1,8662,114,4,2,104,114,14452,14456,107,59,1,10531,4,2,59,111,14462,14464,1,8598,119,59,1,8598,101,97,114,59,1,10535,4,18,83,97,99,100,101,102,103,104,105,108,109,111,112,114,115,116,117,118,14512,14515,14535,14560,14597,14603,14618,14643,14657,14662,14701,14741,14747,14769,14851,14877,14907,14916,59,1,9416,4,2,99,115,14521,14531,117,116,101,5,243,1,59,14529,1,243,116,59,1,8859,4,2,105,121,14541,14557,114,4,2,59,99,14548,14550,1,8858,5,244,1,59,14555,1,244,59,1,1086,4,5,97,98,105,111,115,14572,14577,14583,14587,14591,115,104,59,1,8861,108,97,99,59,1,337,118,59,1,10808,116,59,1,8857,111,108,100,59,1,10684,108,105,103,59,1,339,4,2,99,114,14609,14614,105,114,59,1,10687,59,3,55349,56620,4,3,111,114,116,14626,14630,14640,110,59,1,731,97,118,101,5,242,1,59,14638,1,242,59,1,10689,4,2,98,109,14649,14654,97,114,59,1,10677,59,1,937,110,116,59,1,8750,4,4,97,99,105,116,14672,14677,14693,14698,114,114,59,1,8634,4,2,105,114,14683,14687,114,59,1,10686,111,115,115,59,1,10683,110,101,59,1,8254,59,1,10688,4,3,97,101,105,14709,14714,14719,99,114,59,1,333,103,97,59,1,969,4,3,99,100,110,14727,14733,14736,114,111,110,59,1,959,59,1,10678,117,115,59,1,8854,112,102,59,3,55349,56672,4,3,97,101,108,14755,14759,14764,114,59,1,10679,114,112,59,1,10681,117,115,59,1,8853,4,7,59,97,100,105,111,115,118,14785,14787,14792,14831,14837,14841,14848,1,8744,114,114,59,1,8635,4,4,59,101,102,109,14802,14804,14817,14824,1,10845,114,4,2,59,111,14811,14813,1,8500,102,59,1,8500,5,170,1,59,14822,1,170,5,186,1,59,14829,1,186,103,111,102,59,1,8886,114,59,1,10838,108,111,112,101,59,1,10839,59,1,10843,4,3,99,108,111,14859,14863,14873,114,59,1,8500,97,115,104,5,248,1,59,14871,1,248,108,59,1,8856,105,4,2,108,109,14884,14893,100,101,5,245,1,59,14891,1,245,101,115,4,2,59,97,14901,14903,1,8855,115,59,1,10806,109,108,5,246,1,59,14914,1,246,98,97,114,59,1,9021,4,12,97,99,101,102,104,105,108,109,111,114,115,117,14948,14992,14996,15033,15038,15068,15090,15189,15192,15222,15427,15441,114,4,4,59,97,115,116,14959,14961,14976,14989,1,8741,5,182,2,59,108,14968,14970,1,182,108,101,108,59,1,8741,4,2,105,108,14982,14986,109,59,1,10995,59,1,11005,59,1,8706,121,59,1,1087,114,4,5,99,105,109,112,116,15009,15014,15019,15024,15027,110,116,59,1,37,111,100,59,1,46,105,108,59,1,8240,59,1,8869,101,110,107,59,1,8241,114,59,3,55349,56621,4,3,105,109,111,15046,15057,15063,4,2,59,118,15052,15054,1,966,59,1,981,109,97,116,59,1,8499,110,101,59,1,9742,4,3,59,116,118,15076,15078,15087,1,960,99,104,102,111,114,107,59,1,8916,59,1,982,4,2,97,117,15096,15119,110,4,2,99,107,15103,15115,107,4,2,59,104,15110,15112,1,8463,59,1,8462,118,59,1,8463,115,4,9,59,97,98,99,100,101,109,115,116,15140,15142,15148,15151,15156,15168,15171,15179,15184,1,43,99,105,114,59,1,10787,59,1,8862,105,114,59,1,10786,4,2,111,117,15162,15165,59,1,8724,59,1,10789,59,1,10866,110,5,177,1,59,15177,1,177,105,109,59,1,10790,119,111,59,1,10791,59,1,177,4,3,105,112,117,15200,15208,15213,110,116,105,110,116,59,1,10773,102,59,3,55349,56673,110,100,5,163,1,59,15220,1,163,4,10,59,69,97,99,101,105,110,111,115,117,15244,15246,15249,15253,15258,15334,15347,15367,15416,15421,1,8826,59,1,10931,112,59,1,10935,117,101,59,1,8828,4,2,59,99,15264,15266,1,10927,4,6,59,97,99,101,110,115,15280,15282,15290,15299,15303,15329,1,8826,112,112,114,111,120,59,1,10935,117,114,108,121,101,113,59,1,8828,113,59,1,10927,4,3,97,101,115,15311,15319,15324,112,112,114,111,120,59,1,10937,113,113,59,1,10933,105,109,59,1,8936,105,109,59,1,8830,109,101,4,2,59,115,15342,15344,1,8242,59,1,8473,4,3,69,97,115,15355,15358,15362,59,1,10933,112,59,1,10937,105,109,59,1,8936,4,3,100,102,112,15375,15378,15404,59,1,8719,4,3,97,108,115,15386,15392,15398,108,97,114,59,1,9006,105,110,101,59,1,8978,117,114,102,59,1,8979,4,2,59,116,15410,15412,1,8733,111,59,1,8733,105,109,59,1,8830,114,101,108,59,1,8880,4,2,99,105,15433,15438,114,59,3,55349,56517,59,1,968,110,99,115,112,59,1,8200,4,6,102,105,111,112,115,117,15462,15467,15472,15478,15485,15491,114,59,3,55349,56622,110,116,59,1,10764,112,102,59,3,55349,56674,114,105,109,101,59,1,8279,99,114,59,3,55349,56518,4,3,97,101,111,15499,15520,15534,116,4,2,101,105,15506,15515,114,110,105,111,110,115,59,1,8461,110,116,59,1,10774,115,116,4,2,59,101,15528,15530,1,63,113,59,1,8799,116,5,34,1,59,15540,1,34,4,21,65,66,72,97,98,99,100,101,102,104,105,108,109,110,111,112,114,115,116,117,120,15586,15609,15615,15620,15796,15855,15893,15931,15977,16001,16039,16183,16204,16222,16228,16285,16312,16318,16363,16408,16416,4,3,97,114,116,15594,15599,15603,114,114,59,1,8667,114,59,1,8658,97,105,108,59,1,10524,97,114,114,59,1,10511,97,114,59,1,10596,4,7,99,100,101,110,113,114,116,15636,15651,15656,15664,15687,15696,15770,4,2,101,117,15642,15646,59,3,8765,817,116,101,59,1,341,105,99,59,1,8730,109,112,116,121,118,59,1,10675,103,4,4,59,100,101,108,15675,15677,15680,15683,1,10217,59,1,10642,59,1,10661,101,59,1,10217,117,111,5,187,1,59,15694,1,187,114,4,11,59,97,98,99,102,104,108,112,115,116,119,15721,15723,15727,15739,15742,15746,15750,15754,15758,15763,15767,1,8594,112,59,1,10613,4,2,59,102,15733,15735,1,8677,115,59,1,10528,59,1,10547,115,59,1,10526,107,59,1,8618,112,59,1,8620,108,59,1,10565,105,109,59,1,10612,108,59,1,8611,59,1,8605,4,2,97,105,15776,15781,105,108,59,1,10522,111,4,2,59,110,15788,15790,1,8758,97,108,115,59,1,8474,4,3,97,98,114,15804,15809,15814,114,114,59,1,10509,114,107,59,1,10099,4,2,97,107,15820,15833,99,4,2,101,107,15827,15830,59,1,125,59,1,93,4,2,101,115,15839,15842,59,1,10636,108,4,2,100,117,15849,15852,59,1,10638,59,1,10640,4,4,97,101,117,121,15865,15871,15886,15890,114,111,110,59,1,345,4,2,100,105,15877,15882,105,108,59,1,343,108,59,1,8969,98,59,1,125,59,1,1088,4,4,99,108,113,115,15903,15907,15914,15927,97,59,1,10551,100,104,97,114,59,1,10601,117,111,4,2,59,114,15922,15924,1,8221,59,1,8221,104,59,1,8627,4,3,97,99,103,15939,15966,15970,108,4,4,59,105,112,115,15950,15952,15957,15963,1,8476,110,101,59,1,8475,97,114,116,59,1,8476,59,1,8477,116,59,1,9645,5,174,1,59,15975,1,174,4,3,105,108,114,15985,15991,15997,115,104,116,59,1,10621,111,111,114,59,1,8971,59,3,55349,56623,4,2,97,111,16007,16028,114,4,2,100,117,16014,16017,59,1,8641,4,2,59,108,16023,16025,1,8640,59,1,10604,4,2,59,118,16034,16036,1,961,59,1,1009,4,3,103,110,115,16047,16167,16171,104,116,4,6,97,104,108,114,115,116,16063,16081,16103,16130,16143,16155,114,114,111,119,4,2,59,116,16073,16075,1,8594,97,105,108,59,1,8611,97,114,112,111,111,110,4,2,100,117,16093,16099,111,119,110,59,1,8641,112,59,1,8640,101,102,116,4,2,97,104,16112,16120,114,114,111,119,115,59,1,8644,97,114,112,111,111,110,115,59,1,8652,105,103,104,116,97,114,114,111,119,115,59,1,8649,113,117,105,103,97,114,114,111,119,59,1,8605,104,114,101,101,116,105,109,101,115,59,1,8908,103,59,1,730,105,110,103,100,111,116,115,101,113,59,1,8787,4,3,97,104,109,16191,16196,16201,114,114,59,1,8644,97,114,59,1,8652,59,1,8207,111,117,115,116,4,2,59,97,16214,16216,1,9137,99,104,101,59,1,9137,109,105,100,59,1,10990,4,4,97,98,112,116,16238,16252,16257,16278,4,2,110,114,16244,16248,103,59,1,10221,114,59,1,8702,114,107,59,1,10215,4,3,97,102,108,16265,16269,16273,114,59,1,10630,59,3,55349,56675,117,115,59,1,10798,105,109,101,115,59,1,10805,4,2,97,112,16291,16304,114,4,2,59,103,16298,16300,1,41,116,59,1,10644,111,108,105,110,116,59,1,10770,97,114,114,59,1,8649,4,4,97,99,104,113,16328,16334,16339,16342,113,117,111,59,1,8250,114,59,3,55349,56519,59,1,8625,4,2,98,117,16348,16351,59,1,93,111,4,2,59,114,16358,16360,1,8217,59,1,8217,4,3,104,105,114,16371,16377,16383,114,101,101,59,1,8908,109,101,115,59,1,8906,105,4,4,59,101,102,108,16394,16396,16399,16402,1,9657,59,1,8885,59,1,9656,116,114,105,59,1,10702,108,117,104,97,114,59,1,10600,59,1,8478,4,19,97,98,99,100,101,102,104,105,108,109,111,112,113,114,115,116,117,119,122,16459,16466,16472,16572,16590,16672,16687,16746,16844,16850,16924,16963,16988,17115,17121,17154,17206,17614,17656,99,117,116,101,59,1,347,113,117,111,59,1,8218,4,10,59,69,97,99,101,105,110,112,115,121,16494,16496,16499,16513,16518,16531,16536,16556,16564,16569,1,8827,59,1,10932,4,2,112,114,16505,16508,59,1,10936,111,110,59,1,353,117,101,59,1,8829,4,2,59,100,16524,16526,1,10928,105,108,59,1,351,114,99,59,1,349,4,3,69,97,115,16544,16547,16551,59,1,10934,112,59,1,10938,105,109,59,1,8937,111,108,105,110,116,59,1,10771,105,109,59,1,8831,59,1,1089,111,116,4,3,59,98,101,16582,16584,16587,1,8901,59,1,8865,59,1,10854,4,7,65,97,99,109,115,116,120,16606,16611,16634,16642,16646,16652,16668,114,114,59,1,8664,114,4,2,104,114,16618,16622,107,59,1,10533,4,2,59,111,16628,16630,1,8600,119,59,1,8600,116,5,167,1,59,16640,1,167,105,59,1,59,119,97,114,59,1,10537,109,4,2,105,110,16659,16665,110,117,115,59,1,8726,59,1,8726,116,59,1,10038,114,4,2,59,111,16679,16682,3,55349,56624,119,110,59,1,8994,4,4,97,99,111,121,16697,16702,16716,16739,114,112,59,1,9839,4,2,104,121,16708,16713,99,121,59,1,1097,59,1,1096,114,116,4,2,109,112,16724,16729,105,100,59,1,8739,97,114,97,108,108,101,108,59,1,8741,5,173,1,59,16744,1,173,4,2,103,109,16752,16770,109,97,4,3,59,102,118,16762,16764,16767,1,963,59,1,962,59,1,962,4,8,59,100,101,103,108,110,112,114,16788,16790,16795,16806,16817,16828,16832,16838,1,8764,111,116,59,1,10858,4,2,59,113,16801,16803,1,8771,59,1,8771,4,2,59,69,16812,16814,1,10910,59,1,10912,4,2,59,69,16823,16825,1,10909,59,1,10911,101,59,1,8774,108,117,115,59,1,10788,97,114,114,59,1,10610,97,114,114,59,1,8592,4,4,97,101,105,116,16860,16883,16891,16904,4,2,108,115,16866,16878,108,115,101,116,109,105,110,117,115,59,1,8726,104,112,59,1,10803,112,97,114,115,108,59,1,10724,4,2,100,108,16897,16900,59,1,8739,101,59,1,8995,4,2,59,101,16910,16912,1,10922,4,2,59,115,16918,16920,1,10924,59,3,10924,65024,4,3,102,108,112,16932,16938,16958,116,99,121,59,1,1100,4,2,59,98,16944,16946,1,47,4,2,59,97,16952,16954,1,10692,114,59,1,9023,102,59,3,55349,56676,97,4,2,100,114,16970,16985,101,115,4,2,59,117,16978,16980,1,9824,105,116,59,1,9824,59,1,8741,4,3,99,115,117,16996,17028,17089,4,2,97,117,17002,17015,112,4,2,59,115,17009,17011,1,8851,59,3,8851,65024,112,4,2,59,115,17022,17024,1,8852,59,3,8852,65024,117,4,2,98,112,17035,17062,4,3,59,101,115,17043,17045,17048,1,8847,59,1,8849,101,116,4,2,59,101,17056,17058,1,8847,113,59,1,8849,4,3,59,101,115,17070,17072,17075,1,8848,59,1,8850,101,116,4,2,59,101,17083,17085,1,8848,113,59,1,8850,4,3,59,97,102,17097,17099,17112,1,9633,114,4,2,101,102,17106,17109,59,1,9633,59,1,9642,59,1,9642,97,114,114,59,1,8594,4,4,99,101,109,116,17131,17136,17142,17148,114,59,3,55349,56520,116,109,110,59,1,8726,105,108,101,59,1,8995,97,114,102,59,1,8902,4,2,97,114,17160,17172,114,4,2,59,102,17167,17169,1,9734,59,1,9733,4,2,97,110,17178,17202,105,103,104,116,4,2,101,112,17188,17197,112,115,105,108,111,110,59,1,1013,104,105,59,1,981,115,59,1,175,4,5,98,99,109,110,112,17218,17351,17420,17423,17427,4,9,59,69,100,101,109,110,112,114,115,17238,17240,17243,17248,17261,17267,17279,17285,17291,1,8834,59,1,10949,111,116,59,1,10941,4,2,59,100,17254,17256,1,8838,111,116,59,1,10947,117,108,116,59,1,10945,4,2,69,101,17273,17276,59,1,10955,59,1,8842,108,117,115,59,1,10943,97,114,114,59,1,10617,4,3,101,105,117,17299,17335,17339,116,4,3,59,101,110,17308,17310,17322,1,8834,113,4,2,59,113,17317,17319,1,8838,59,1,10949,101,113,4,2,59,113,17330,17332,1,8842,59,1,10955,109,59,1,10951,4,2,98,112,17345,17348,59,1,10965,59,1,10963,99,4,6,59,97,99,101,110,115,17366,17368,17376,17385,17389,17415,1,8827,112,112,114,111,120,59,1,10936,117,114,108,121,101,113,59,1,8829,113,59,1,10928,4,3,97,101,115,17397,17405,17410,112,112,114,111,120,59,1,10938,113,113,59,1,10934,105,109,59,1,8937,105,109,59,1,8831,59,1,8721,103,59,1,9834,4,13,49,50,51,59,69,100,101,104,108,109,110,112,115,17455,17462,17469,17476,17478,17481,17496,17509,17524,17530,17536,17548,17554,5,185,1,59,17460,1,185,5,178,1,59,17467,1,178,5,179,1,59,17474,1,179,1,8835,59,1,10950,4,2,111,115,17487,17491,116,59,1,10942,117,98,59,1,10968,4,2,59,100,17502,17504,1,8839,111,116,59,1,10948,115,4,2,111,117,17516,17520,108,59,1,10185,98,59,1,10967,97,114,114,59,1,10619,117,108,116,59,1,10946,4,2,69,101,17542,17545,59,1,10956,59,1,8843,108,117,115,59,1,10944,4,3,101,105,117,17562,17598,17602,116,4,3,59,101,110,17571,17573,17585,1,8835,113,4,2,59,113,17580,17582,1,8839,59,1,10950,101,113,4,2,59,113,17593,17595,1,8843,59,1,10956,109,59,1,10952,4,2,98,112,17608,17611,59,1,10964,59,1,10966,4,3,65,97,110,17622,17627,17650,114,114,59,1,8665,114,4,2,104,114,17634,17638,107,59,1,10534,4,2,59,111,17644,17646,1,8601,119,59,1,8601,119,97,114,59,1,10538,108,105,103,5,223,1,59,17664,1,223,4,13,97,98,99,100,101,102,104,105,111,112,114,115,119,17694,17709,17714,17737,17742,17749,17754,17860,17905,17957,17964,18090,18122,4,2,114,117,17700,17706,103,101,116,59,1,8982,59,1,964,114,107,59,1,9140,4,3,97,101,121,17722,17728,17734,114,111,110,59,1,357,100,105,108,59,1,355,59,1,1090,111,116,59,1,8411,108,114,101,99,59,1,8981,114,59,3,55349,56625,4,4,101,105,107,111,17764,17805,17836,17851,4,2,114,116,17770,17786,101,4,2,52,102,17777,17780,59,1,8756,111,114,101,59,1,8756,97,4,3,59,115,118,17795,17797,17802,1,952,121,109,59,1,977,59,1,977,4,2,99,110,17811,17831,107,4,2,97,115,17818,17826,112,112,114,111,120,59,1,8776,105,109,59,1,8764,115,112,59,1,8201,4,2,97,115,17842,17846,112,59,1,8776,105,109,59,1,8764,114,110,5,254,1,59,17858,1,254,4,3,108,109,110,17868,17873,17901,100,101,59,1,732,101,115,5,215,3,59,98,100,17884,17886,17898,1,215,4,2,59,97,17892,17894,1,8864,114,59,1,10801,59,1,10800,116,59,1,8749,4,3,101,112,115,17913,17917,17953,97,59,1,10536,4,4,59,98,99,102,17927,17929,17934,17939,1,8868,111,116,59,1,9014,105,114,59,1,10993,4,2,59,111,17945,17948,3,55349,56677,114,107,59,1,10970,97,59,1,10537,114,105,109,101,59,1,8244,4,3,97,105,112,17972,17977,18082,100,101,59,1,8482,4,7,97,100,101,109,112,115,116,17993,18051,18056,18059,18066,18072,18076,110,103,108,101,4,5,59,100,108,113,114,18009,18011,18017,18032,18035,1,9653,111,119,110,59,1,9663,101,102,116,4,2,59,101,18026,18028,1,9667,113,59,1,8884,59,1,8796,105,103,104,116,4,2,59,101,18045,18047,1,9657,113,59,1,8885,111,116,59,1,9708,59,1,8796,105,110,117,115,59,1,10810,108,117,115,59,1,10809,98,59,1,10701,105,109,101,59,1,10811,101,122,105,117,109,59,1,9186,4,3,99,104,116,18098,18111,18116,4,2,114,121,18104,18108,59,3,55349,56521,59,1,1094,99,121,59,1,1115,114,111,107,59,1,359,4,2,105,111,18128,18133,120,116,59,1,8812,104,101,97,100,4,2,108,114,18143,18154,101,102,116,97,114,114,111,119,59,1,8606,105,103,104,116,97,114,114,111,119,59,1,8608,4,18,65,72,97,98,99,100,102,103,104,108,109,111,112,114,115,116,117,119,18204,18209,18214,18234,18250,18268,18292,18308,18319,18343,18379,18397,18413,18504,18547,18553,18584,18603,114,114,59,1,8657,97,114,59,1,10595,4,2,99,114,18220,18230,117,116,101,5,250,1,59,18228,1,250,114,59,1,8593,114,4,2,99,101,18241,18245,121,59,1,1118,118,101,59,1,365,4,2,105,121,18256,18265,114,99,5,251,1,59,18263,1,251,59,1,1091,4,3,97,98,104,18276,18281,18287,114,114,59,1,8645,108,97,99,59,1,369,97,114,59,1,10606,4,2,105,114,18298,18304,115,104,116,59,1,10622,59,3,55349,56626,114,97,118,101,5,249,1,59,18317,1,249,4,2,97,98,18325,18338,114,4,2,108,114,18332,18335,59,1,8639,59,1,8638,108,107,59,1,9600,4,2,99,116,18349,18374,4,2,111,114,18355,18369,114,110,4,2,59,101,18363,18365,1,8988,114,59,1,8988,111,112,59,1,8975,114,105,59,1,9720,4,2,97,108,18385,18390,99,114,59,1,363,5,168,1,59,18395,1,168,4,2,103,112,18403,18408,111,110,59,1,371,102,59,3,55349,56678,4,6,97,100,104,108,115,117,18427,18434,18445,18470,18475,18494,114,114,111,119,59,1,8593,111,119,110,97,114,114,111,119,59,1,8597,97,114,112,111,111,110,4,2,108,114,18457,18463,101,102,116,59,1,8639,105,103,104,116,59,1,8638,117,115,59,1,8846,105,4,3,59,104,108,18484,18486,18489,1,965,59,1,978,111,110,59,1,965,112,97,114,114,111,119,115,59,1,8648,4,3,99,105,116,18512,18537,18542,4,2,111,114,18518,18532,114,110,4,2,59,101,18526,18528,1,8989,114,59,1,8989,111,112,59,1,8974,110,103,59,1,367,114,105,59,1,9721,99,114,59,3,55349,56522,4,3,100,105,114,18561,18566,18572,111,116,59,1,8944,108,100,101,59,1,361,105,4,2,59,102,18579,18581,1,9653,59,1,9652,4,2,97,109,18590,18595,114,114,59,1,8648,108,5,252,1,59,18601,1,252,97,110,103,108,101,59,1,10663,4,15,65,66,68,97,99,100,101,102,108,110,111,112,114,115,122,18643,18648,18661,18667,18847,18851,18857,18904,18909,18915,18931,18937,18943,18949,18996,114,114,59,1,8661,97,114,4,2,59,118,18656,18658,1,10984,59,1,10985,97,115,104,59,1,8872,4,2,110,114,18673,18679,103,114,116,59,1,10652,4,7,101,107,110,112,114,115,116,18695,18704,18711,18720,18742,18754,18810,112,115,105,108,111,110,59,1,1013,97,112,112,97,59,1,1008,111,116,104,105,110,103,59,1,8709,4,3,104,105,114,18728,18732,18735,105,59,1,981,59,1,982,111,112,116,111,59,1,8733,4,2,59,104,18748,18750,1,8597,111,59,1,1009,4,2,105,117,18760,18766,103,109,97,59,1,962,4,2,98,112,18772,18791,115,101,116,110,101,113,4,2,59,113,18784,18787,3,8842,65024,59,3,10955,65024,115,101,116,110,101,113,4,2,59,113,18803,18806,3,8843,65024,59,3,10956,65024,4,2,104,114,18816,18822,101,116,97,59,1,977,105,97,110,103,108,101,4,2,108,114,18834,18840,101,102,116,59,1,8882,105,103,104,116,59,1,8883,121,59,1,1074,97,115,104,59,1,8866,4,3,101,108,114,18865,18884,18890,4,3,59,98,101,18873,18875,18880,1,8744,97,114,59,1,8891,113,59,1,8794,108,105,112,59,1,8942,4,2,98,116,18896,18901,97,114,59,1,124,59,1,124,114,59,3,55349,56627,116,114,105,59,1,8882,115,117,4,2,98,112,18923,18927,59,3,8834,8402,59,3,8835,8402,112,102,59,3,55349,56679,114,111,112,59,1,8733,116,114,105,59,1,8883,4,2,99,117,18955,18960,114,59,3,55349,56523,4,2,98,112,18966,18981,110,4,2,69,101,18973,18977,59,3,10955,65024,59,3,8842,65024,110,4,2,69,101,18988,18992,59,3,10956,65024,59,3,8843,65024,105,103,122,97,103,59,1,10650,4,7,99,101,102,111,112,114,115,19020,19026,19061,19066,19072,19075,19089,105,114,99,59,1,373,4,2,100,105,19032,19055,4,2,98,103,19038,19043,97,114,59,1,10847,101,4,2,59,113,19050,19052,1,8743,59,1,8793,101,114,112,59,1,8472,114,59,3,55349,56628,112,102,59,3,55349,56680,59,1,8472,4,2,59,101,19081,19083,1,8768,97,116,104,59,1,8768,99,114,59,3,55349,56524,4,14,99,100,102,104,105,108,109,110,111,114,115,117,118,119,19125,19146,19152,19157,19173,19176,19192,19197,19202,19236,19252,19269,19286,19291,4,3,97,105,117,19133,19137,19142,112,59,1,8898,114,99,59,1,9711,112,59,1,8899,116,114,105,59,1,9661,114,59,3,55349,56629,4,2,65,97,19163,19168,114,114,59,1,10234,114,114,59,1,10231,59,1,958,4,2,65,97,19182,19187,114,114,59,1,10232,114,114,59,1,10229,97,112,59,1,10236,105,115,59,1,8955,4,3,100,112,116,19210,19215,19230,111,116,59,1,10752,4,2,102,108,19221,19225,59,3,55349,56681,117,115,59,1,10753,105,109,101,59,1,10754,4,2,65,97,19242,19247,114,114,59,1,10233,114,114,59,1,10230,4,2,99,113,19258,19263,114,59,3,55349,56525,99,117,112,59,1,10758,4,2,112,116,19275,19281,108,117,115,59,1,10756,114,105,59,1,9651,101,101,59,1,8897,101,100,103,101,59,1,8896,4,8,97,99,101,102,105,111,115,117,19316,19335,19349,19357,19362,19367,19373,19379,99,4,2,117,121,19323,19332,116,101,5,253,1,59,19330,1,253,59,1,1103,4,2,105,121,19341,19346,114,99,59,1,375,59,1,1099,110,5,165,1,59,19355,1,165,114,59,3,55349,56630,99,121,59,1,1111,112,102,59,3,55349,56682,99,114,59,3,55349,56526,4,2,99,109,19385,19389,121,59,1,1102,108,5,255,1,59,19395,1,255,4,10,97,99,100,101,102,104,105,111,115,119,19419,19426,19441,19446,19462,19467,19472,19480,19486,19492,99,117,116,101,59,1,378,4,2,97,121,19432,19438,114,111,110,59,1,382,59,1,1079,111,116,59,1,380,4,2,101,116,19452,19458,116,114,102,59,1,8488,97,59,1,950,114,59,3,55349,56631,99,121,59,1,1078,103,114,97,114,114,59,1,8669,112,102,59,3,55349,56683,99,114,59,3,55349,56527,4,2,106,110,19498,19501,59,1,8205,106,59,1,8204]);const Oe=s,Se=r,Ce={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376},de="DATA_STATE";function Re(e){return e===Oe.SPACE||e===Oe.LINE_FEED||e===Oe.TABULATION||e===Oe.FORM_FEED}function Ie(e){return e>=Oe.DIGIT_0&&e<=Oe.DIGIT_9}function fe(e){return e>=Oe.LATIN_CAPITAL_A&&e<=Oe.LATIN_CAPITAL_Z}function Me(e){return e>=Oe.LATIN_SMALL_A&&e<=Oe.LATIN_SMALL_Z}function Le(e){return Me(e)||fe(e)}function De(e){return Le(e)||Ie(e)}function ge(e){return e>=Oe.LATIN_CAPITAL_A&&e<=Oe.LATIN_CAPITAL_F}function Pe(e){return e>=Oe.LATIN_SMALL_A&&e<=Oe.LATIN_SMALL_F}function ke(e){return e+32}function He(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode(e>>>10&1023|55296)+String.fromCharCode(56320|1023&e))}function Ue(e){return String.fromCharCode(ke(e))}function Fe(e,t){const n=ue[++e];let s=++e,r=s+n-1;for(;s<=r;){const e=s+r>>>1,i=ue[e];if(i<t)s=e+1;else{if(!(i>t))return ue[e+n];r=e-1;}}return -1}class Be{constructor(){this.preprocessor=new Ne,this.tokenQueue=[],this.allowCDATA=!1,this.state=de,this.returnState="",this.charRefCode=-1,this.tempBuff=[],this.lastStartTagName="",this.consumedAfterSnapshot=-1,this.active=!1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr=null;}_err(){}_errOnNextCodePoint(e){this._consume(),this._err(e),this._unconsume();}getNextToken(){for(;!this.tokenQueue.length&&this.active;){this.consumedAfterSnapshot=0;const e=this._consume();this._ensureHibernation()||this[this.state](e);}return this.tokenQueue.shift()}write(e,t){this.active=!0,this.preprocessor.write(e,t);}insertHtmlAtCurrentPos(e){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(e);}_ensureHibernation(){if(this.preprocessor.endOfChunkHit){for(;this.consumedAfterSnapshot>0;this.consumedAfterSnapshot--)this.preprocessor.retreat();return this.active=!1,this.tokenQueue.push({type:Be.HIBERNATION_TOKEN}),!0}return !1}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_unconsume(){this.consumedAfterSnapshot--,this.preprocessor.retreat();}_reconsumeInState(e){this.state=e,this._unconsume();}_consumeSequenceIfMatch(e,t,n){let s=0,r=!0;const i=e.length;let T=0,o=t,E=void 0;for(;T<i;T++){if(T>0&&(o=this._consume(),s++),o===Oe.EOF){r=!1;break}if(E=e[T],o!==E&&(n||o!==ke(E))){r=!1;break}}if(!r)for(;s--;)this._unconsume();return r}_isTempBufferEqualToScriptString(){if(this.tempBuff.length!==Se.SCRIPT_STRING.length)return !1;for(let e=0;e<this.tempBuff.length;e++)if(this.tempBuff[e]!==Se.SCRIPT_STRING[e])return !1;return !0}_createStartTagToken(){this.currentToken={type:Be.START_TAG_TOKEN,tagName:"",selfClosing:!1,ackSelfClosing:!1,attrs:[]};}_createEndTagToken(){this.currentToken={type:Be.END_TAG_TOKEN,tagName:"",selfClosing:!1,attrs:[]};}_createCommentToken(){this.currentToken={type:Be.COMMENT_TOKEN,data:""};}_createDoctypeToken(e){this.currentToken={type:Be.DOCTYPE_TOKEN,name:e,forceQuirks:!1,publicId:null,systemId:null};}_createCharacterToken(e,t){this.currentCharacterToken={type:e,chars:t};}_createEOFToken(){this.currentToken={type:Be.EOF_TOKEN};}_createAttr(e){this.currentAttr={name:e,value:""};}_leaveAttrName(e){null===Be.getTokenAttr(this.currentToken,this.currentAttr.name)?this.currentToken.attrs.push(this.currentAttr):this._err(re),this.state=e;}_leaveAttrValue(e){this.state=e;}_emitCurrentToken(){this._emitCurrentCharacterToken();const e=this.currentToken;this.currentToken=null,e.type===Be.START_TAG_TOKEN?this.lastStartTagName=e.tagName:e.type===Be.END_TAG_TOKEN&&(e.attrs.length>0&&this._err(l),e.selfClosing&&this._err(m)),this.tokenQueue.push(e);}_emitCurrentCharacterToken(){this.currentCharacterToken&&(this.tokenQueue.push(this.currentCharacterToken),this.currentCharacterToken=null);}_emitEOFToken(){this._createEOFToken(),this._emitCurrentToken();}_appendCharToCurrentCharacterToken(e,t){this.currentCharacterToken&&this.currentCharacterToken.type!==e&&this._emitCurrentCharacterToken(),this.currentCharacterToken?this.currentCharacterToken.chars+=t:this._createCharacterToken(e,t);}_emitCodePoint(e){let t=Be.CHARACTER_TOKEN;Re(e)?t=Be.WHITESPACE_CHARACTER_TOKEN:e===Oe.NULL&&(t=Be.NULL_CHARACTER_TOKEN),this._appendCharToCurrentCharacterToken(t,He(e));}_emitSeveralCodePoints(e){for(let t=0;t<e.length;t++)this._emitCodePoint(e[t]);}_emitChars(e){this._appendCharToCurrentCharacterToken(Be.CHARACTER_TOKEN,e);}_matchNamedCharacterReference(e){let t=null,n=1,s=Fe(0,e);for(this.tempBuff.push(e);s>-1;){const e=ue[s],r=e<7;r&&1&e&&(t=2&e?[ue[++s],ue[++s]]:[ue[++s]],n=0);const i=this._consume();if(this.tempBuff.push(i),n++,i===Oe.EOF)break;s=r?4&e?Fe(s,i):-1:i===e?++s:-1;}for(;n--;)this.tempBuff.pop(),this._unconsume();return t}_isCharacterReferenceInAttribute(){return "ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE"===this.returnState||"ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE"===this.returnState||"ATTRIBUTE_VALUE_UNQUOTED_STATE"===this.returnState}_isCharacterReferenceAttributeQuirk(e){if(!e&&this._isCharacterReferenceInAttribute()){const e=this._consume();return this._unconsume(),e===Oe.EQUALS_SIGN||De(e)}return !1}_flushCodePointsConsumedAsCharacterReference(){if(this._isCharacterReferenceInAttribute())for(let e=0;e<this.tempBuff.length;e++)this.currentAttr.value+=He(this.tempBuff[e]);else this._emitSeveralCodePoints(this.tempBuff);this.tempBuff=[];}[de](e){this.preprocessor.dropParsedChunk(),e===Oe.LESS_THAN_SIGN?this.state="TAG_OPEN_STATE":e===Oe.AMPERSAND?(this.returnState=de,this.state="CHARACTER_REFERENCE_STATE"):e===Oe.NULL?(this._err(N),this._emitCodePoint(e)):e===Oe.EOF?this._emitEOFToken():this._emitCodePoint(e);}RCDATA_STATE(e){this.preprocessor.dropParsedChunk(),e===Oe.AMPERSAND?(this.returnState="RCDATA_STATE",this.state="CHARACTER_REFERENCE_STATE"):e===Oe.LESS_THAN_SIGN?this.state="RCDATA_LESS_THAN_SIGN_STATE":e===Oe.NULL?(this._err(N),this._emitChars(n)):e===Oe.EOF?this._emitEOFToken():this._emitCodePoint(e);}RAWTEXT_STATE(e){this.preprocessor.dropParsedChunk(),e===Oe.LESS_THAN_SIGN?this.state="RAWTEXT_LESS_THAN_SIGN_STATE":e===Oe.NULL?(this._err(N),this._emitChars(n)):e===Oe.EOF?this._emitEOFToken():this._emitCodePoint(e);}SCRIPT_DATA_STATE(e){this.preprocessor.dropParsedChunk(),e===Oe.LESS_THAN_SIGN?this.state="SCRIPT_DATA_LESS_THAN_SIGN_STATE":e===Oe.NULL?(this._err(N),this._emitChars(n)):e===Oe.EOF?this._emitEOFToken():this._emitCodePoint(e);}PLAINTEXT_STATE(e){this.preprocessor.dropParsedChunk(),e===Oe.NULL?(this._err(N),this._emitChars(n)):e===Oe.EOF?this._emitEOFToken():this._emitCodePoint(e);}TAG_OPEN_STATE(e){e===Oe.EXCLAMATION_MARK?this.state="MARKUP_DECLARATION_OPEN_STATE":e===Oe.SOLIDUS?this.state="END_TAG_OPEN_STATE":Le(e)?(this._createStartTagToken(),this._reconsumeInState("TAG_NAME_STATE")):e===Oe.QUESTION_MARK?(this._err(u),this._createCommentToken(),this._reconsumeInState("BOGUS_COMMENT_STATE")):e===Oe.EOF?(this._err(L),this._emitChars("<"),this._emitEOFToken()):(this._err(O),this._emitChars("<"),this._reconsumeInState(de));}END_TAG_OPEN_STATE(e){Le(e)?(this._createEndTagToken(),this._reconsumeInState("TAG_NAME_STATE")):e===Oe.GREATER_THAN_SIGN?(this._err(C),this.state=de):e===Oe.EOF?(this._err(L),this._emitChars("</"),this._emitEOFToken()):(this._err(O),this._createCommentToken(),this._reconsumeInState("BOGUS_COMMENT_STATE"));}TAG_NAME_STATE(e){Re(e)?this.state="BEFORE_ATTRIBUTE_NAME_STATE":e===Oe.SOLIDUS?this.state="SELF_CLOSING_START_TAG_STATE":e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):fe(e)?this.currentToken.tagName+=Ue(e):e===Oe.NULL?(this._err(N),this.currentToken.tagName+=n):e===Oe.EOF?(this._err(D),this._emitEOFToken()):this.currentToken.tagName+=He(e);}RCDATA_LESS_THAN_SIGN_STATE(e){e===Oe.SOLIDUS?(this.tempBuff=[],this.state="RCDATA_END_TAG_OPEN_STATE"):(this._emitChars("<"),this._reconsumeInState("RCDATA_STATE"));}RCDATA_END_TAG_OPEN_STATE(e){Le(e)?(this._createEndTagToken(),this._reconsumeInState("RCDATA_END_TAG_NAME_STATE")):(this._emitChars("</"),this._reconsumeInState("RCDATA_STATE"));}RCDATA_END_TAG_NAME_STATE(e){if(fe(e))this.currentToken.tagName+=Ue(e),this.tempBuff.push(e);else if(Me(e))this.currentToken.tagName+=He(e),this.tempBuff.push(e);else{if(this.lastStartTagName===this.currentToken.tagName){if(Re(e))return void(this.state="BEFORE_ATTRIBUTE_NAME_STATE");if(e===Oe.SOLIDUS)return void(this.state="SELF_CLOSING_START_TAG_STATE");if(e===Oe.GREATER_THAN_SIGN)return this.state=de,void this._emitCurrentToken()}this._emitChars("</"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState("RCDATA_STATE");}}RAWTEXT_LESS_THAN_SIGN_STATE(e){e===Oe.SOLIDUS?(this.tempBuff=[],this.state="RAWTEXT_END_TAG_OPEN_STATE"):(this._emitChars("<"),this._reconsumeInState("RAWTEXT_STATE"));}RAWTEXT_END_TAG_OPEN_STATE(e){Le(e)?(this._createEndTagToken(),this._reconsumeInState("RAWTEXT_END_TAG_NAME_STATE")):(this._emitChars("</"),this._reconsumeInState("RAWTEXT_STATE"));}RAWTEXT_END_TAG_NAME_STATE(e){if(fe(e))this.currentToken.tagName+=Ue(e),this.tempBuff.push(e);else if(Me(e))this.currentToken.tagName+=He(e),this.tempBuff.push(e);else{if(this.lastStartTagName===this.currentToken.tagName){if(Re(e))return void(this.state="BEFORE_ATTRIBUTE_NAME_STATE");if(e===Oe.SOLIDUS)return void(this.state="SELF_CLOSING_START_TAG_STATE");if(e===Oe.GREATER_THAN_SIGN)return this._emitCurrentToken(),void(this.state=de)}this._emitChars("</"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState("RAWTEXT_STATE");}}SCRIPT_DATA_LESS_THAN_SIGN_STATE(e){e===Oe.SOLIDUS?(this.tempBuff=[],this.state="SCRIPT_DATA_END_TAG_OPEN_STATE"):e===Oe.EXCLAMATION_MARK?(this.state="SCRIPT_DATA_ESCAPE_START_STATE",this._emitChars("<!")):(this._emitChars("<"),this._reconsumeInState("SCRIPT_DATA_STATE"));}SCRIPT_DATA_END_TAG_OPEN_STATE(e){Le(e)?(this._createEndTagToken(),this._reconsumeInState("SCRIPT_DATA_END_TAG_NAME_STATE")):(this._emitChars("</"),this._reconsumeInState("SCRIPT_DATA_STATE"));}SCRIPT_DATA_END_TAG_NAME_STATE(e){if(fe(e))this.currentToken.tagName+=Ue(e),this.tempBuff.push(e);else if(Me(e))this.currentToken.tagName+=He(e),this.tempBuff.push(e);else{if(this.lastStartTagName===this.currentToken.tagName){if(Re(e))return void(this.state="BEFORE_ATTRIBUTE_NAME_STATE");if(e===Oe.SOLIDUS)return void(this.state="SELF_CLOSING_START_TAG_STATE");if(e===Oe.GREATER_THAN_SIGN)return this._emitCurrentToken(),void(this.state=de)}this._emitChars("</"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState("SCRIPT_DATA_STATE");}}SCRIPT_DATA_ESCAPE_START_STATE(e){e===Oe.HYPHEN_MINUS?(this.state="SCRIPT_DATA_ESCAPE_START_DASH_STATE",this._emitChars("-")):this._reconsumeInState("SCRIPT_DATA_STATE");}SCRIPT_DATA_ESCAPE_START_DASH_STATE(e){e===Oe.HYPHEN_MINUS?(this.state="SCRIPT_DATA_ESCAPED_DASH_DASH_STATE",this._emitChars("-")):this._reconsumeInState("SCRIPT_DATA_STATE");}SCRIPT_DATA_ESCAPED_STATE(e){e===Oe.HYPHEN_MINUS?(this.state="SCRIPT_DATA_ESCAPED_DASH_STATE",this._emitChars("-")):e===Oe.LESS_THAN_SIGN?this.state="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE":e===Oe.NULL?(this._err(N),this._emitChars(n)):e===Oe.EOF?(this._err(v),this._emitEOFToken()):this._emitCodePoint(e);}SCRIPT_DATA_ESCAPED_DASH_STATE(e){e===Oe.HYPHEN_MINUS?(this.state="SCRIPT_DATA_ESCAPED_DASH_DASH_STATE",this._emitChars("-")):e===Oe.LESS_THAN_SIGN?this.state="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE":e===Oe.NULL?(this._err(N),this.state="SCRIPT_DATA_ESCAPED_STATE",this._emitChars(n)):e===Oe.EOF?(this._err(v),this._emitEOFToken()):(this.state="SCRIPT_DATA_ESCAPED_STATE",this._emitCodePoint(e));}SCRIPT_DATA_ESCAPED_DASH_DASH_STATE(e){e===Oe.HYPHEN_MINUS?this._emitChars("-"):e===Oe.LESS_THAN_SIGN?this.state="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE":e===Oe.GREATER_THAN_SIGN?(this.state="SCRIPT_DATA_STATE",this._emitChars(">")):e===Oe.NULL?(this._err(N),this.state="SCRIPT_DATA_ESCAPED_STATE",this._emitChars(n)):e===Oe.EOF?(this._err(v),this._emitEOFToken()):(this.state="SCRIPT_DATA_ESCAPED_STATE",this._emitCodePoint(e));}SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE(e){e===Oe.SOLIDUS?(this.tempBuff=[],this.state="SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE"):Le(e)?(this.tempBuff=[],this._emitChars("<"),this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE")):(this._emitChars("<"),this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE"));}SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE(e){Le(e)?(this._createEndTagToken(),this._reconsumeInState("SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE")):(this._emitChars("</"),this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE"));}SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE(e){if(fe(e))this.currentToken.tagName+=Ue(e),this.tempBuff.push(e);else if(Me(e))this.currentToken.tagName+=He(e),this.tempBuff.push(e);else{if(this.lastStartTagName===this.currentToken.tagName){if(Re(e))return void(this.state="BEFORE_ATTRIBUTE_NAME_STATE");if(e===Oe.SOLIDUS)return void(this.state="SELF_CLOSING_START_TAG_STATE");if(e===Oe.GREATER_THAN_SIGN)return this._emitCurrentToken(),void(this.state=de)}this._emitChars("</"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE");}}SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE(e){Re(e)||e===Oe.SOLIDUS||e===Oe.GREATER_THAN_SIGN?(this.state=this._isTempBufferEqualToScriptString()?"SCRIPT_DATA_DOUBLE_ESCAPED_STATE":"SCRIPT_DATA_ESCAPED_STATE",this._emitCodePoint(e)):fe(e)?(this.tempBuff.push(ke(e)),this._emitCodePoint(e)):Me(e)?(this.tempBuff.push(e),this._emitCodePoint(e)):this._reconsumeInState("SCRIPT_DATA_ESCAPED_STATE");}SCRIPT_DATA_DOUBLE_ESCAPED_STATE(e){e===Oe.HYPHEN_MINUS?(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE",this._emitChars("-")):e===Oe.LESS_THAN_SIGN?(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE",this._emitChars("<")):e===Oe.NULL?(this._err(N),this._emitChars(n)):e===Oe.EOF?(this._err(v),this._emitEOFToken()):this._emitCodePoint(e);}SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE(e){e===Oe.HYPHEN_MINUS?(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE",this._emitChars("-")):e===Oe.LESS_THAN_SIGN?(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE",this._emitChars("<")):e===Oe.NULL?(this._err(N),this.state="SCRIPT_DATA_DOUBLE_ESCAPED_STATE",this._emitChars(n)):e===Oe.EOF?(this._err(v),this._emitEOFToken()):(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_STATE",this._emitCodePoint(e));}SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE(e){e===Oe.HYPHEN_MINUS?this._emitChars("-"):e===Oe.LESS_THAN_SIGN?(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE",this._emitChars("<")):e===Oe.GREATER_THAN_SIGN?(this.state="SCRIPT_DATA_STATE",this._emitChars(">")):e===Oe.NULL?(this._err(N),this.state="SCRIPT_DATA_DOUBLE_ESCAPED_STATE",this._emitChars(n)):e===Oe.EOF?(this._err(v),this._emitEOFToken()):(this.state="SCRIPT_DATA_DOUBLE_ESCAPED_STATE",this._emitCodePoint(e));}SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE(e){e===Oe.SOLIDUS?(this.tempBuff=[],this.state="SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE",this._emitChars("/")):this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE");}SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE(e){Re(e)||e===Oe.SOLIDUS||e===Oe.GREATER_THAN_SIGN?(this.state=this._isTempBufferEqualToScriptString()?"SCRIPT_DATA_ESCAPED_STATE":"SCRIPT_DATA_DOUBLE_ESCAPED_STATE",this._emitCodePoint(e)):fe(e)?(this.tempBuff.push(ke(e)),this._emitCodePoint(e)):Me(e)?(this.tempBuff.push(e),this._emitCodePoint(e)):this._reconsumeInState("SCRIPT_DATA_DOUBLE_ESCAPED_STATE");}BEFORE_ATTRIBUTE_NAME_STATE(e){Re(e)||(e===Oe.SOLIDUS||e===Oe.GREATER_THAN_SIGN||e===Oe.EOF?this._reconsumeInState("AFTER_ATTRIBUTE_NAME_STATE"):e===Oe.EQUALS_SIGN?(this._err(S),this._createAttr("="),this.state="ATTRIBUTE_NAME_STATE"):(this._createAttr(""),this._reconsumeInState("ATTRIBUTE_NAME_STATE")));}ATTRIBUTE_NAME_STATE(e){Re(e)||e===Oe.SOLIDUS||e===Oe.GREATER_THAN_SIGN||e===Oe.EOF?(this._leaveAttrName("AFTER_ATTRIBUTE_NAME_STATE"),this._unconsume()):e===Oe.EQUALS_SIGN?this._leaveAttrName("BEFORE_ATTRIBUTE_VALUE_STATE"):fe(e)?this.currentAttr.name+=Ue(e):e===Oe.QUOTATION_MARK||e===Oe.APOSTROPHE||e===Oe.LESS_THAN_SIGN?(this._err(d),this.currentAttr.name+=He(e)):e===Oe.NULL?(this._err(N),this.currentAttr.name+=n):this.currentAttr.name+=He(e);}AFTER_ATTRIBUTE_NAME_STATE(e){Re(e)||(e===Oe.SOLIDUS?this.state="SELF_CLOSING_START_TAG_STATE":e===Oe.EQUALS_SIGN?this.state="BEFORE_ATTRIBUTE_VALUE_STATE":e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(D),this._emitEOFToken()):(this._createAttr(""),this._reconsumeInState("ATTRIBUTE_NAME_STATE")));}BEFORE_ATTRIBUTE_VALUE_STATE(e){Re(e)||(e===Oe.QUOTATION_MARK?this.state="ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE":e===Oe.APOSTROPHE?this.state="ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE":e===Oe.GREATER_THAN_SIGN?(this._err(g),this.state=de,this._emitCurrentToken()):this._reconsumeInState("ATTRIBUTE_VALUE_UNQUOTED_STATE"));}ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE(e){e===Oe.QUOTATION_MARK?this.state="AFTER_ATTRIBUTE_VALUE_QUOTED_STATE":e===Oe.AMPERSAND?(this.returnState="ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE",this.state="CHARACTER_REFERENCE_STATE"):e===Oe.NULL?(this._err(N),this.currentAttr.value+=n):e===Oe.EOF?(this._err(D),this._emitEOFToken()):this.currentAttr.value+=He(e);}ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE(e){e===Oe.APOSTROPHE?this.state="AFTER_ATTRIBUTE_VALUE_QUOTED_STATE":e===Oe.AMPERSAND?(this.returnState="ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE",this.state="CHARACTER_REFERENCE_STATE"):e===Oe.NULL?(this._err(N),this.currentAttr.value+=n):e===Oe.EOF?(this._err(D),this._emitEOFToken()):this.currentAttr.value+=He(e);}ATTRIBUTE_VALUE_UNQUOTED_STATE(e){Re(e)?this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE"):e===Oe.AMPERSAND?(this.returnState="ATTRIBUTE_VALUE_UNQUOTED_STATE",this.state="CHARACTER_REFERENCE_STATE"):e===Oe.GREATER_THAN_SIGN?(this._leaveAttrValue(de),this._emitCurrentToken()):e===Oe.NULL?(this._err(N),this.currentAttr.value+=n):e===Oe.QUOTATION_MARK||e===Oe.APOSTROPHE||e===Oe.LESS_THAN_SIGN||e===Oe.EQUALS_SIGN||e===Oe.GRAVE_ACCENT?(this._err(M),this.currentAttr.value+=He(e)):e===Oe.EOF?(this._err(D),this._emitEOFToken()):this.currentAttr.value+=He(e);}AFTER_ATTRIBUTE_VALUE_QUOTED_STATE(e){Re(e)?this._leaveAttrValue("BEFORE_ATTRIBUTE_NAME_STATE"):e===Oe.SOLIDUS?this._leaveAttrValue("SELF_CLOSING_START_TAG_STATE"):e===Oe.GREATER_THAN_SIGN?(this._leaveAttrValue(de),this._emitCurrentToken()):e===Oe.EOF?(this._err(D),this._emitEOFToken()):(this._err(P),this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE"));}SELF_CLOSING_START_TAG_STATE(e){e===Oe.GREATER_THAN_SIGN?(this.currentToken.selfClosing=!0,this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(D),this._emitEOFToken()):(this._err(p),this._reconsumeInState("BEFORE_ATTRIBUTE_NAME_STATE"));}BOGUS_COMMENT_STATE(e){e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._emitCurrentToken(),this._emitEOFToken()):e===Oe.NULL?(this._err(N),this.currentToken.data+=n):this.currentToken.data+=He(e);}MARKUP_DECLARATION_OPEN_STATE(e){this._consumeSequenceIfMatch(Se.DASH_DASH_STRING,e,!0)?(this._createCommentToken(),this.state="COMMENT_START_STATE"):this._consumeSequenceIfMatch(Se.DOCTYPE_STRING,e,!1)?this.state="DOCTYPE_STATE":this._consumeSequenceIfMatch(Se.CDATA_START_STRING,e,!0)?this.allowCDATA?this.state="CDATA_SECTION_STATE":(this._err(x),this._createCommentToken(),this.currentToken.data="[CDATA[",this.state="BOGUS_COMMENT_STATE"):this._ensureHibernation()||(this._err(y),this._createCommentToken(),this._reconsumeInState("BOGUS_COMMENT_STATE"));}COMMENT_START_STATE(e){e===Oe.HYPHEN_MINUS?this.state="COMMENT_START_DASH_STATE":e===Oe.GREATER_THAN_SIGN?(this._err(X),this.state=de,this._emitCurrentToken()):this._reconsumeInState("COMMENT_STATE");}COMMENT_START_DASH_STATE(e){e===Oe.HYPHEN_MINUS?this.state="COMMENT_END_STATE":e===Oe.GREATER_THAN_SIGN?(this._err(X),this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(W),this._emitCurrentToken(),this._emitEOFToken()):(this.currentToken.data+="-",this._reconsumeInState("COMMENT_STATE"));}COMMENT_STATE(e){e===Oe.HYPHEN_MINUS?this.state="COMMENT_END_DASH_STATE":e===Oe.LESS_THAN_SIGN?(this.currentToken.data+="<",this.state="COMMENT_LESS_THAN_SIGN_STATE"):e===Oe.NULL?(this._err(N),this.currentToken.data+=n):e===Oe.EOF?(this._err(W),this._emitCurrentToken(),this._emitEOFToken()):this.currentToken.data+=He(e);}COMMENT_LESS_THAN_SIGN_STATE(e){e===Oe.EXCLAMATION_MARK?(this.currentToken.data+="!",this.state="COMMENT_LESS_THAN_SIGN_BANG_STATE"):e===Oe.LESS_THAN_SIGN?this.currentToken.data+="!":this._reconsumeInState("COMMENT_STATE");}COMMENT_LESS_THAN_SIGN_BANG_STATE(e){e===Oe.HYPHEN_MINUS?this.state="COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE":this._reconsumeInState("COMMENT_STATE");}COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE(e){e===Oe.HYPHEN_MINUS?this.state="COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE":this._reconsumeInState("COMMENT_END_DASH_STATE");}COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE(e){e!==Oe.GREATER_THAN_SIGN&&e!==Oe.EOF&&this._err(Q),this._reconsumeInState("COMMENT_END_STATE");}COMMENT_END_DASH_STATE(e){e===Oe.HYPHEN_MINUS?this.state="COMMENT_END_STATE":e===Oe.EOF?(this._err(W),this._emitCurrentToken(),this._emitEOFToken()):(this.currentToken.data+="-",this._reconsumeInState("COMMENT_STATE"));}COMMENT_END_STATE(e){e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):e===Oe.EXCLAMATION_MARK?this.state="COMMENT_END_BANG_STATE":e===Oe.HYPHEN_MINUS?this.currentToken.data+="-":e===Oe.EOF?(this._err(W),this._emitCurrentToken(),this._emitEOFToken()):(this.currentToken.data+="--",this._reconsumeInState("COMMENT_STATE"));}COMMENT_END_BANG_STATE(e){e===Oe.HYPHEN_MINUS?(this.currentToken.data+="--!",this.state="COMMENT_END_DASH_STATE"):e===Oe.GREATER_THAN_SIGN?(this._err(V),this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(W),this._emitCurrentToken(),this._emitEOFToken()):(this.currentToken.data+="--!",this._reconsumeInState("COMMENT_STATE"));}DOCTYPE_STATE(e){Re(e)?this.state="BEFORE_DOCTYPE_NAME_STATE":e===Oe.GREATER_THAN_SIGN?this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE"):e===Oe.EOF?(this._err(w),this._createDoctypeToken(null),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(te),this._reconsumeInState("BEFORE_DOCTYPE_NAME_STATE"));}BEFORE_DOCTYPE_NAME_STATE(e){Re(e)||(fe(e)?(this._createDoctypeToken(Ue(e)),this.state="DOCTYPE_NAME_STATE"):e===Oe.NULL?(this._err(N),this._createDoctypeToken(n),this.state="DOCTYPE_NAME_STATE"):e===Oe.GREATER_THAN_SIGN?(this._err(ne),this._createDoctypeToken(null),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=de):e===Oe.EOF?(this._err(w),this._createDoctypeToken(null),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._createDoctypeToken(He(e)),this.state="DOCTYPE_NAME_STATE"));}DOCTYPE_NAME_STATE(e){Re(e)?this.state="AFTER_DOCTYPE_NAME_STATE":e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):fe(e)?this.currentToken.name+=Ue(e):e===Oe.NULL?(this._err(N),this.currentToken.name+=n):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):this.currentToken.name+=He(e);}AFTER_DOCTYPE_NAME_STATE(e){Re(e)||(e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):this._consumeSequenceIfMatch(Se.PUBLIC_STRING,e,!1)?this.state="AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE":this._consumeSequenceIfMatch(Se.SYSTEM_STRING,e,!1)?this.state="AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE":this._ensureHibernation()||(this._err(se),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE")));}AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE(e){Re(e)?this.state="BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE":e===Oe.QUOTATION_MARK?(this._err(k),this.currentToken.publicId="",this.state="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE"):e===Oe.APOSTROPHE?(this._err(k),this.currentToken.publicId="",this.state="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE"):e===Oe.GREATER_THAN_SIGN?(this._err(G),this.currentToken.forceQuirks=!0,this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(F),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE"));}BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE(e){Re(e)||(e===Oe.QUOTATION_MARK?(this.currentToken.publicId="",this.state="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE"):e===Oe.APOSTROPHE?(this.currentToken.publicId="",this.state="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE"):e===Oe.GREATER_THAN_SIGN?(this._err(G),this.currentToken.forceQuirks=!0,this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(F),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE")));}DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE(e){e===Oe.QUOTATION_MARK?this.state="AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE":e===Oe.NULL?(this._err(N),this.currentToken.publicId+=n):e===Oe.GREATER_THAN_SIGN?(this._err(b),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=de):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):this.currentToken.publicId+=He(e);}DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE(e){e===Oe.APOSTROPHE?this.state="AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE":e===Oe.NULL?(this._err(N),this.currentToken.publicId+=n):e===Oe.GREATER_THAN_SIGN?(this._err(b),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=de):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):this.currentToken.publicId+=He(e);}AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE(e){Re(e)?this.state="BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE":e===Oe.GREATER_THAN_SIGN?(this.state=de,this._emitCurrentToken()):e===Oe.QUOTATION_MARK?(this._err(H),this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"):e===Oe.APOSTROPHE?(this._err(H),this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(B),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE"));}BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE(e){Re(e)||(e===Oe.GREATER_THAN_SIGN?(this._emitCurrentToken(),this.state=de):e===Oe.QUOTATION_MARK?(this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"):e===Oe.APOSTROPHE?(this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(B),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE")));}AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE(e){Re(e)?this.state="BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE":e===Oe.QUOTATION_MARK?(this._err(U),this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"):e===Oe.APOSTROPHE?(this._err(U),this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"):e===Oe.GREATER_THAN_SIGN?(this._err(K),this.currentToken.forceQuirks=!0,this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(B),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE"));}BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE(e){Re(e)||(e===Oe.QUOTATION_MARK?(this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE"):e===Oe.APOSTROPHE?(this.currentToken.systemId="",this.state="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE"):e===Oe.GREATER_THAN_SIGN?(this._err(K),this.currentToken.forceQuirks=!0,this.state=de,this._emitCurrentToken()):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(B),this.currentToken.forceQuirks=!0,this._reconsumeInState("BOGUS_DOCTYPE_STATE")));}DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE(e){e===Oe.QUOTATION_MARK?this.state="AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE":e===Oe.NULL?(this._err(N),this.currentToken.systemId+=n):e===Oe.GREATER_THAN_SIGN?(this._err(Y),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=de):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):this.currentToken.systemId+=He(e);}DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE(e){e===Oe.APOSTROPHE?this.state="AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE":e===Oe.NULL?(this._err(N),this.currentToken.systemId+=n):e===Oe.GREATER_THAN_SIGN?(this._err(Y),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=de):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):this.currentToken.systemId+=He(e);}AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE(e){Re(e)||(e===Oe.GREATER_THAN_SIGN?(this._emitCurrentToken(),this.state=de):e===Oe.EOF?(this._err(w),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._emitEOFToken()):(this._err(f),this._reconsumeInState("BOGUS_DOCTYPE_STATE")));}BOGUS_DOCTYPE_STATE(e){e===Oe.GREATER_THAN_SIGN?(this._emitCurrentToken(),this.state=de):e===Oe.NULL?this._err(N):e===Oe.EOF&&(this._emitCurrentToken(),this._emitEOFToken());}CDATA_SECTION_STATE(e){e===Oe.RIGHT_SQUARE_BRACKET?this.state="CDATA_SECTION_BRACKET_STATE":e===Oe.EOF?(this._err(j),this._emitEOFToken()):this._emitCodePoint(e);}CDATA_SECTION_BRACKET_STATE(e){e===Oe.RIGHT_SQUARE_BRACKET?this.state="CDATA_SECTION_END_STATE":(this._emitChars("]"),this._reconsumeInState("CDATA_SECTION_STATE"));}CDATA_SECTION_END_STATE(e){e===Oe.GREATER_THAN_SIGN?this.state=de:e===Oe.RIGHT_SQUARE_BRACKET?this._emitChars("]"):(this._emitChars("]]"),this._reconsumeInState("CDATA_SECTION_STATE"));}CHARACTER_REFERENCE_STATE(e){this.tempBuff=[Oe.AMPERSAND],e===Oe.NUMBER_SIGN?(this.tempBuff.push(e),this.state="NUMERIC_CHARACTER_REFERENCE_STATE"):De(e)?this._reconsumeInState("NAMED_CHARACTER_REFERENCE_STATE"):(this._flushCodePointsConsumedAsCharacterReference(),this._reconsumeInState(this.returnState));}NAMED_CHARACTER_REFERENCE_STATE(e){const t=this._matchNamedCharacterReference(e);if(this._ensureHibernation())this.tempBuff=[Oe.AMPERSAND];else if(t){const e=this.tempBuff[this.tempBuff.length-1]===Oe.SEMICOLON;this._isCharacterReferenceAttributeQuirk(e)||(e||this._errOnNextCodePoint(I),this.tempBuff=t),this._flushCodePointsConsumedAsCharacterReference(),this.state=this.returnState;}else this._flushCodePointsConsumedAsCharacterReference(),this.state="AMBIGUOS_AMPERSAND_STATE";}AMBIGUOS_AMPERSAND_STATE(e){De(e)?this._isCharacterReferenceInAttribute()?this.currentAttr.value+=He(e):this._emitCodePoint(e):(e===Oe.SEMICOLON&&this._err(R),this._reconsumeInState(this.returnState));}NUMERIC_CHARACTER_REFERENCE_STATE(e){this.charRefCode=0,e===Oe.LATIN_SMALL_X||e===Oe.LATIN_CAPITAL_X?(this.tempBuff.push(e),this.state="HEXADEMICAL_CHARACTER_REFERENCE_START_STATE"):this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_START_STATE");}HEXADEMICAL_CHARACTER_REFERENCE_START_STATE(e){!function(e){return Ie(e)||ge(e)||Pe(e)}(e)?(this._err(z),this._flushCodePointsConsumedAsCharacterReference(),this._reconsumeInState(this.returnState)):this._reconsumeInState("HEXADEMICAL_CHARACTER_REFERENCE_STATE");}DECIMAL_CHARACTER_REFERENCE_START_STATE(e){Ie(e)?this._reconsumeInState("DECIMAL_CHARACTER_REFERENCE_STATE"):(this._err(z),this._flushCodePointsConsumedAsCharacterReference(),this._reconsumeInState(this.returnState));}HEXADEMICAL_CHARACTER_REFERENCE_STATE(e){ge(e)?this.charRefCode=16*this.charRefCode+e-55:Pe(e)?this.charRefCode=16*this.charRefCode+e-87:Ie(e)?this.charRefCode=16*this.charRefCode+e-48:e===Oe.SEMICOLON?this.state="NUMERIC_CHARACTER_REFERENCE_END_STATE":(this._err(I),this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE"));}DECIMAL_CHARACTER_REFERENCE_STATE(e){Ie(e)?this.charRefCode=10*this.charRefCode+e-48:e===Oe.SEMICOLON?this.state="NUMERIC_CHARACTER_REFERENCE_END_STATE":(this._err(I),this._reconsumeInState("NUMERIC_CHARACTER_REFERENCE_END_STATE"));}NUMERIC_CHARACTER_REFERENCE_END_STATE(){if(this.charRefCode===Oe.NULL)this._err(q),this.charRefCode=Oe.REPLACEMENT_CHARACTER;else if(this.charRefCode>1114111)this._err(Z),this.charRefCode=Oe.REPLACEMENT_CHARACTER;else if(i(this.charRefCode))this._err(J),this.charRefCode=Oe.REPLACEMENT_CHARACTER;else if(a(this.charRefCode))this._err(ee);else if(E(this.charRefCode)||this.charRefCode===Oe.CARRIAGE_RETURN){this._err($);const e=Ce[this.charRefCode];e&&(this.charRefCode=e);}this.tempBuff=[this.charRefCode],this._flushCodePointsConsumedAsCharacterReference(),this._reconsumeInState(this.returnState);}}Be.CHARACTER_TOKEN="CHARACTER_TOKEN",Be.NULL_CHARACTER_TOKEN="NULL_CHARACTER_TOKEN",Be.WHITESPACE_CHARACTER_TOKEN="WHITESPACE_CHARACTER_TOKEN",Be.START_TAG_TOKEN="START_TAG_TOKEN",Be.END_TAG_TOKEN="END_TAG_TOKEN",Be.COMMENT_TOKEN="COMMENT_TOKEN",Be.DOCTYPE_TOKEN="DOCTYPE_TOKEN",Be.EOF_TOKEN="EOF_TOKEN",Be.HIBERNATION_TOKEN="HIBERNATION_TOKEN",Be.MODE={DATA:de,RCDATA:"RCDATA_STATE",RAWTEXT:"RAWTEXT_STATE",SCRIPT_DATA:"SCRIPT_DATA_STATE",PLAINTEXT:"PLAINTEXT_STATE"},Be.getTokenAttr=function(e,t){for(let n=e.attrs.length-1;n>=0;n--)if(e.attrs[n].name===t)return e.attrs[n].value;return null};var Ge=Be;function Ke(e,t){return e(t={exports:{}},t.exports),t.exports}var be=Ke((function(e,t){const n=t.NAMESPACES={HTML:"http://www.w3.org/1999/xhtml",MATHML:"http://www.w3.org/1998/Math/MathML",SVG:"http://www.w3.org/2000/svg",XLINK:"http://www.w3.org/1999/xlink",XML:"http://www.w3.org/XML/1998/namespace",XMLNS:"http://www.w3.org/2000/xmlns/"};t.ATTRS={TYPE:"type",ACTION:"action",ENCODING:"encoding",PROMPT:"prompt",NAME:"name",COLOR:"color",FACE:"face",SIZE:"size"},t.DOCUMENT_MODE={NO_QUIRKS:"no-quirks",QUIRKS:"quirks",LIMITED_QUIRKS:"limited-quirks"};const s=t.TAG_NAMES={A:"a",ADDRESS:"address",ANNOTATION_XML:"annotation-xml",APPLET:"applet",AREA:"area",ARTICLE:"article",ASIDE:"aside",B:"b",BASE:"base",BASEFONT:"basefont",BGSOUND:"bgsound",BIG:"big",BLOCKQUOTE:"blockquote",BODY:"body",BR:"br",BUTTON:"button",CAPTION:"caption",CENTER:"center",CODE:"code",COL:"col",COLGROUP:"colgroup",DD:"dd",DESC:"desc",DETAILS:"details",DIALOG:"dialog",DIR:"dir",DIV:"div",DL:"dl",DT:"dt",EM:"em",EMBED:"embed",FIELDSET:"fieldset",FIGCAPTION:"figcaption",FIGURE:"figure",FONT:"font",FOOTER:"footer",FOREIGN_OBJECT:"foreignObject",FORM:"form",FRAME:"frame",FRAMESET:"frameset",H1:"h1",H2:"h2",H3:"h3",H4:"h4",H5:"h5",H6:"h6",HEAD:"head",HEADER:"header",HGROUP:"hgroup",HR:"hr",HTML:"html",I:"i",IMG:"img",IMAGE:"image",INPUT:"input",IFRAME:"iframe",KEYGEN:"keygen",LABEL:"label",LI:"li",LINK:"link",LISTING:"listing",MAIN:"main",MALIGNMARK:"malignmark",MARQUEE:"marquee",MATH:"math",MENU:"menu",META:"meta",MGLYPH:"mglyph",MI:"mi",MO:"mo",MN:"mn",MS:"ms",MTEXT:"mtext",NAV:"nav",NOBR:"nobr",NOFRAMES:"noframes",NOEMBED:"noembed",NOSCRIPT:"noscript",OBJECT:"object",OL:"ol",OPTGROUP:"optgroup",OPTION:"option",P:"p",PARAM:"param",PLAINTEXT:"plaintext",PRE:"pre",RB:"rb",RP:"rp",RT:"rt",RTC:"rtc",RUBY:"ruby",S:"s",SCRIPT:"script",SECTION:"section",SELECT:"select",SOURCE:"source",SMALL:"small",SPAN:"span",STRIKE:"strike",STRONG:"strong",STYLE:"style",SUB:"sub",SUMMARY:"summary",SUP:"sup",TABLE:"table",TBODY:"tbody",TEMPLATE:"template",TEXTAREA:"textarea",TFOOT:"tfoot",TD:"td",TH:"th",THEAD:"thead",TITLE:"title",TR:"tr",TRACK:"track",TT:"tt",U:"u",UL:"ul",SVG:"svg",VAR:"var",WBR:"wbr",XMP:"xmp"};t.SPECIAL_ELEMENTS={[n.HTML]:{[s.ADDRESS]:!0,[s.APPLET]:!0,[s.AREA]:!0,[s.ARTICLE]:!0,[s.ASIDE]:!0,[s.BASE]:!0,[s.BASEFONT]:!0,[s.BGSOUND]:!0,[s.BLOCKQUOTE]:!0,[s.BODY]:!0,[s.BR]:!0,[s.BUTTON]:!0,[s.CAPTION]:!0,[s.CENTER]:!0,[s.COL]:!0,[s.COLGROUP]:!0,[s.DD]:!0,[s.DETAILS]:!0,[s.DIR]:!0,[s.DIV]:!0,[s.DL]:!0,[s.DT]:!0,[s.EMBED]:!0,[s.FIELDSET]:!0,[s.FIGCAPTION]:!0,[s.FIGURE]:!0,[s.FOOTER]:!0,[s.FORM]:!0,[s.FRAME]:!0,[s.FRAMESET]:!0,[s.H1]:!0,[s.H2]:!0,[s.H3]:!0,[s.H4]:!0,[s.H5]:!0,[s.H6]:!0,[s.HEAD]:!0,[s.HEADER]:!0,[s.HGROUP]:!0,[s.HR]:!0,[s.HTML]:!0,[s.IFRAME]:!0,[s.IMG]:!0,[s.INPUT]:!0,[s.LI]:!0,[s.LINK]:!0,[s.LISTING]:!0,[s.MAIN]:!0,[s.MARQUEE]:!0,[s.MENU]:!0,[s.META]:!0,[s.NAV]:!0,[s.NOEMBED]:!0,[s.NOFRAMES]:!0,[s.NOSCRIPT]:!0,[s.OBJECT]:!0,[s.OL]:!0,[s.P]:!0,[s.PARAM]:!0,[s.PLAINTEXT]:!0,[s.PRE]:!0,[s.SCRIPT]:!0,[s.SECTION]:!0,[s.SELECT]:!0,[s.SOURCE]:!0,[s.STYLE]:!0,[s.SUMMARY]:!0,[s.TABLE]:!0,[s.TBODY]:!0,[s.TD]:!0,[s.TEMPLATE]:!0,[s.TEXTAREA]:!0,[s.TFOOT]:!0,[s.TH]:!0,[s.THEAD]:!0,[s.TITLE]:!0,[s.TR]:!0,[s.TRACK]:!0,[s.UL]:!0,[s.WBR]:!0,[s.XMP]:!0},[n.MATHML]:{[s.MI]:!0,[s.MO]:!0,[s.MN]:!0,[s.MS]:!0,[s.MTEXT]:!0,[s.ANNOTATION_XML]:!0},[n.SVG]:{[s.TITLE]:!0,[s.FOREIGN_OBJECT]:!0,[s.DESC]:!0}};}));be.NAMESPACES,be.ATTRS,be.DOCUMENT_MODE,be.TAG_NAMES,be.SPECIAL_ELEMENTS;const Ye=be.TAG_NAMES,xe=be.NAMESPACES;function ye(e){switch(e.length){case 1:return e===Ye.P;case 2:return e===Ye.RB||e===Ye.RP||e===Ye.RT||e===Ye.DD||e===Ye.DT||e===Ye.LI;case 3:return e===Ye.RTC;case 6:return e===Ye.OPTION;case 8:return e===Ye.OPTGROUP}return !1}function ve(e){switch(e.length){case 1:return e===Ye.P;case 2:return e===Ye.RB||e===Ye.RP||e===Ye.RT||e===Ye.DD||e===Ye.DT||e===Ye.LI||e===Ye.TD||e===Ye.TH||e===Ye.TR;case 3:return e===Ye.RTC;case 5:return e===Ye.TBODY||e===Ye.TFOOT||e===Ye.THEAD;case 6:return e===Ye.OPTION;case 7:return e===Ye.CAPTION;case 8:return e===Ye.OPTGROUP||e===Ye.COLGROUP}return !1}function we(e,t){switch(e.length){case 2:if(e===Ye.TD||e===Ye.TH)return t===xe.HTML;if(e===Ye.MI||e===Ye.MO||e===Ye.MN||e===Ye.MS)return t===xe.MATHML;break;case 4:if(e===Ye.HTML)return t===xe.HTML;if(e===Ye.DESC)return t===xe.SVG;break;case 5:if(e===Ye.TABLE)return t===xe.HTML;if(e===Ye.MTEXT)return t===xe.MATHML;if(e===Ye.TITLE)return t===xe.SVG;break;case 6:return (e===Ye.APPLET||e===Ye.OBJECT)&&t===xe.HTML;case 7:return (e===Ye.CAPTION||e===Ye.MARQUEE)&&t===xe.HTML;case 8:return e===Ye.TEMPLATE&&t===xe.HTML;case 13:return e===Ye.FOREIGN_OBJECT&&t===xe.SVG;case 14:return e===Ye.ANNOTATION_XML&&t===xe.MATHML}return !1}var Qe=class{constructor(e,t){this.stackTop=-1,this.items=[],this.current=e,this.currentTagName=null,this.currentTmplContent=null,this.tmplCount=0,this.treeAdapter=t;}_indexOf(e){let t=-1;for(let n=this.stackTop;n>=0;n--)if(this.items[n]===e){t=n;break}return t}_isInTemplate(){return this.currentTagName===Ye.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===xe.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagName=this.current&&this.treeAdapter.getTagName(this.current),this.currentTmplContent=this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):null;}push(e){this.items[++this.stackTop]=e,this._updateCurrentElement(),this._isInTemplate()&&this.tmplCount++;}pop(){this.stackTop--,this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this._updateCurrentElement();}replace(e,t){const n=this._indexOf(e);this.items[n]=t,n===this.stackTop&&this._updateCurrentElement();}insertAfter(e,t){const n=this._indexOf(e)+1;this.items.splice(n,0,t),n===++this.stackTop&&this._updateCurrentElement();}popUntilTagNamePopped(e){for(;this.stackTop>-1;){const t=this.currentTagName,n=this.treeAdapter.getNamespaceURI(this.current);if(this.pop(),t===e&&n===xe.HTML)break}}popUntilElementPopped(e){for(;this.stackTop>-1;){const t=this.current;if(this.pop(),t===e)break}}popUntilNumberedHeaderPopped(){for(;this.stackTop>-1;){const e=this.currentTagName,t=this.treeAdapter.getNamespaceURI(this.current);if(this.pop(),e===Ye.H1||e===Ye.H2||e===Ye.H3||e===Ye.H4||e===Ye.H5||e===Ye.H6&&t===xe.HTML)break}}popUntilTableCellPopped(){for(;this.stackTop>-1;){const e=this.currentTagName,t=this.treeAdapter.getNamespaceURI(this.current);if(this.pop(),e===Ye.TD||e===Ye.TH&&t===xe.HTML)break}}popAllUpToHtmlElement(){this.stackTop=0,this._updateCurrentElement();}clearBackToTableContext(){for(;this.currentTagName!==Ye.TABLE&&this.currentTagName!==Ye.TEMPLATE&&this.currentTagName!==Ye.HTML||this.treeAdapter.getNamespaceURI(this.current)!==xe.HTML;)this.pop();}clearBackToTableBodyContext(){for(;this.currentTagName!==Ye.TBODY&&this.currentTagName!==Ye.TFOOT&&this.currentTagName!==Ye.THEAD&&this.currentTagName!==Ye.TEMPLATE&&this.currentTagName!==Ye.HTML||this.treeAdapter.getNamespaceURI(this.current)!==xe.HTML;)this.pop();}clearBackToTableRowContext(){for(;this.currentTagName!==Ye.TR&&this.currentTagName!==Ye.TEMPLATE&&this.currentTagName!==Ye.HTML||this.treeAdapter.getNamespaceURI(this.current)!==xe.HTML;)this.pop();}remove(e){for(let t=this.stackTop;t>=0;t--)if(this.items[t]===e){this.items.splice(t,1),this.stackTop--,this._updateCurrentElement();break}}tryPeekProperlyNestedBodyElement(){const e=this.items[1];return e&&this.treeAdapter.getTagName(e)===Ye.BODY?e:null}contains(e){return this._indexOf(e)>-1}getCommonAncestor(e){let t=this._indexOf(e);return --t>=0?this.items[t]:null}isRootHtmlElementCurrent(){return 0===this.stackTop&&this.currentTagName===Ye.HTML}hasInScope(e){for(let t=this.stackTop;t>=0;t--){const n=this.treeAdapter.getTagName(this.items[t]),s=this.treeAdapter.getNamespaceURI(this.items[t]);if(n===e&&s===xe.HTML)return !0;if(we(n,s))return !1}return !0}hasNumberedHeaderInScope(){for(let e=this.stackTop;e>=0;e--){const t=this.treeAdapter.getTagName(this.items[e]),n=this.treeAdapter.getNamespaceURI(this.items[e]);if((t===Ye.H1||t===Ye.H2||t===Ye.H3||t===Ye.H4||t===Ye.H5||t===Ye.H6)&&n===xe.HTML)return !0;if(we(t,n))return !1}return !0}hasInListItemScope(e){for(let t=this.stackTop;t>=0;t--){const n=this.treeAdapter.getTagName(this.items[t]),s=this.treeAdapter.getNamespaceURI(this.items[t]);if(n===e&&s===xe.HTML)return !0;if((n===Ye.UL||n===Ye.OL)&&s===xe.HTML||we(n,s))return !1}return !0}hasInButtonScope(e){for(let t=this.stackTop;t>=0;t--){const n=this.treeAdapter.getTagName(this.items[t]),s=this.treeAdapter.getNamespaceURI(this.items[t]);if(n===e&&s===xe.HTML)return !0;if(n===Ye.BUTTON&&s===xe.HTML||we(n,s))return !1}return !0}hasInTableScope(e){for(let t=this.stackTop;t>=0;t--){const n=this.treeAdapter.getTagName(this.items[t]);if(this.treeAdapter.getNamespaceURI(this.items[t])===xe.HTML){if(n===e)return !0;if(n===Ye.TABLE||n===Ye.TEMPLATE||n===Ye.HTML)return !1}}return !0}hasTableBodyContextInTableScope(){for(let e=this.stackTop;e>=0;e--){const t=this.treeAdapter.getTagName(this.items[e]);if(this.treeAdapter.getNamespaceURI(this.items[e])===xe.HTML){if(t===Ye.TBODY||t===Ye.THEAD||t===Ye.TFOOT)return !0;if(t===Ye.TABLE||t===Ye.HTML)return !1}}return !0}hasInSelectScope(e){for(let t=this.stackTop;t>=0;t--){const n=this.treeAdapter.getTagName(this.items[t]);if(this.treeAdapter.getNamespaceURI(this.items[t])===xe.HTML){if(n===e)return !0;if(n!==Ye.OPTION&&n!==Ye.OPTGROUP)return !1}}return !0}generateImpliedEndTags(){for(;ye(this.currentTagName);)this.pop();}generateImpliedEndTagsThoroughly(){for(;ve(this.currentTagName);)this.pop();}generateImpliedEndTagsWithExclusion(e){for(;ye(this.currentTagName)&&this.currentTagName!==e;)this.pop();}};class Xe{constructor(e){this.length=0,this.entries=[],this.treeAdapter=e,this.bookmark=null;}_getNoahArkConditionCandidates(e){const t=[];if(this.length>=3){const n=this.treeAdapter.getAttrList(e).length,s=this.treeAdapter.getTagName(e),r=this.treeAdapter.getNamespaceURI(e);for(let e=this.length-1;e>=0;e--){const i=this.entries[e];if(i.type===Xe.MARKER_ENTRY)break;const T=i.element,o=this.treeAdapter.getAttrList(T);this.treeAdapter.getTagName(T)===s&&this.treeAdapter.getNamespaceURI(T)===r&&o.length===n&&t.push({idx:e,attrs:o});}}return t.length<3?[]:t}_ensureNoahArkCondition(e){const t=this._getNoahArkConditionCandidates(e);let n=t.length;if(n){const s=this.treeAdapter.getAttrList(e),r=s.length,i=Object.create(null);for(let e=0;e<r;e++){const t=s[e];i[t.name]=t.value;}for(let e=0;e<r;e++)for(let s=0;s<n;s++){const r=t[s].attrs[e];if(i[r.name]!==r.value&&(t.splice(s,1),n--),t.length<3)return}for(let e=n-1;e>=2;e--)this.entries.splice(t[e].idx,1),this.length--;}}insertMarker(){this.entries.push({type:Xe.MARKER_ENTRY}),this.length++;}pushElement(e,t){this._ensureNoahArkCondition(e),this.entries.push({type:Xe.ELEMENT_ENTRY,element:e,token:t}),this.length++;}insertElementAfterBookmark(e,t){let n=this.length-1;for(;n>=0&&this.entries[n]!==this.bookmark;n--);this.entries.splice(n+1,0,{type:Xe.ELEMENT_ENTRY,element:e,token:t}),this.length++;}removeEntry(e){for(let t=this.length-1;t>=0;t--)if(this.entries[t]===e){this.entries.splice(t,1),this.length--;break}}clearToLastMarker(){for(;this.length;){const e=this.entries.pop();if(this.length--,e.type===Xe.MARKER_ENTRY)break}}getElementEntryInScopeWithTagName(e){for(let t=this.length-1;t>=0;t--){const n=this.entries[t];if(n.type===Xe.MARKER_ENTRY)return null;if(this.treeAdapter.getTagName(n.element)===e)return n}return null}getElementEntry(e){for(let t=this.length-1;t>=0;t--){const n=this.entries[t];if(n.type===Xe.ELEMENT_ENTRY&&n.element===e)return n}return null}}Xe.MARKER_ENTRY="MARKER_ENTRY",Xe.ELEMENT_ENTRY="ELEMENT_ENTRY";var We=Xe;class Ve{constructor(e){const t={},n=this._getOverriddenMethods(this,t);for(const s of Object.keys(n))"function"==typeof n[s]&&(t[s]=e[s],e[s]=n[s]);}_getOverriddenMethods(){throw new Error("Not implemented")}}Ve.install=function(e,t,n){e.__mixins||(e.__mixins=[]);for(let n=0;n<e.__mixins.length;n++)if(e.__mixins[n].constructor===t)return e.__mixins[n];const s=new t(e,n);return e.__mixins.push(s),s};var je=Ve;var ze=class extends je{constructor(e){super(e),this.preprocessor=e,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.offset=0,this.col=0,this.line=1;}_getOverriddenMethods(e,t){return {advance(){const n=this.pos+1,s=this.html[n];return e.isEol&&(e.isEol=!1,e.line++,e.lineStartPos=n),("\n"===s||"\r"===s&&"\n"!==this.html[n+1])&&(e.isEol=!0),e.col=n-e.lineStartPos+1,e.offset=e.droppedBufferSize+n,t.advance.call(this)},retreat(){t.retreat.call(this),e.isEol=!1,e.col=this.pos-e.lineStartPos+1;},dropParsedChunk(){const n=this.pos;t.dropParsedChunk.call(this);const s=n-this.pos;e.lineStartPos-=s,e.droppedBufferSize+=s,e.offset=e.droppedBufferSize+this.pos;}}}};var qe=class extends je{constructor(e){super(e),this.tokenizer=e,this.posTracker=je.install(e.preprocessor,ze),this.currentAttrLocation=null,this.ctLoc=null;}_getCurrentLocation(){return {startLine:this.posTracker.line,startCol:this.posTracker.col,startOffset:this.posTracker.offset,endLine:-1,endCol:-1,endOffset:-1}}_attachCurrentAttrLocationInfo(){this.currentAttrLocation.endLine=this.posTracker.line,this.currentAttrLocation.endCol=this.posTracker.col,this.currentAttrLocation.endOffset=this.posTracker.offset;const e=this.tokenizer.currentToken,t=this.tokenizer.currentAttr;e.location.attrs||(e.location.attrs=Object.create(null)),e.location.attrs[t.name]=this.currentAttrLocation;}_getOverriddenMethods(e,t){const n={_createStartTagToken(){t._createStartTagToken.call(this),this.currentToken.location=e.ctLoc;},_createEndTagToken(){t._createEndTagToken.call(this),this.currentToken.location=e.ctLoc;},_createCommentToken(){t._createCommentToken.call(this),this.currentToken.location=e.ctLoc;},_createDoctypeToken(n){t._createDoctypeToken.call(this,n),this.currentToken.location=e.ctLoc;},_createCharacterToken(n,s){t._createCharacterToken.call(this,n,s),this.currentCharacterToken.location=e.ctLoc;},_createEOFToken(){t._createEOFToken.call(this),this.currentToken.location=e._getCurrentLocation();},_createAttr(n){t._createAttr.call(this,n),e.currentAttrLocation=e._getCurrentLocation();},_leaveAttrName(n){t._leaveAttrName.call(this,n),e._attachCurrentAttrLocationInfo();},_leaveAttrValue(n){t._leaveAttrValue.call(this,n),e._attachCurrentAttrLocationInfo();},_emitCurrentToken(){const n=this.currentToken.location;this.currentCharacterToken&&(this.currentCharacterToken.location.endLine=n.startLine,this.currentCharacterToken.location.endCol=n.startCol,this.currentCharacterToken.location.endOffset=n.startOffset),this.currentToken.type===Ge.EOF_TOKEN?(n.endLine=n.startLine,n.endCol=n.startCol,n.endOffset=n.startOffset):(n.endLine=e.posTracker.line,n.endCol=e.posTracker.col+1,n.endOffset=e.posTracker.offset+1),t._emitCurrentToken.call(this);},_emitCurrentCharacterToken(){const n=this.currentCharacterToken&&this.currentCharacterToken.location;n&&-1===n.endOffset&&(n.endLine=e.posTracker.line,n.endCol=e.posTracker.col,n.endOffset=e.posTracker.offset),t._emitCurrentCharacterToken.call(this);}};return Object.keys(Ge.MODE).forEach(s=>{const r=Ge.MODE[s];n[r]=function(n){e.ctLoc=e._getCurrentLocation(),t[r].call(this,n);};}),n}};var Je=class extends je{constructor(e,t){super(e),this.onItemPop=t.onItemPop;}_getOverriddenMethods(e,t){return {pop(){e.onItemPop(this.current),t.pop.call(this);},popAllUpToHtmlElement(){for(let t=this.stackTop;t>0;t--)e.onItemPop(this.items[t]);t.popAllUpToHtmlElement.call(this);},remove(n){e.onItemPop(this.current),t.remove.call(this,n);}}}};const Ze=be.TAG_NAMES;var $e=class extends je{constructor(e){super(e),this.parser=e,this.treeAdapter=this.parser.treeAdapter,this.posTracker=null,this.lastStartTagToken=null,this.lastFosterParentingLocation=null,this.currentToken=null;}_setStartLocation(e){let t=null;this.lastStartTagToken&&(t=Object.assign({},this.lastStartTagToken.location),t.startTag=this.lastStartTagToken.location),this.treeAdapter.setNodeSourceCodeLocation(e,t);}_setEndLocation(e,t){const n=this.treeAdapter.getNodeSourceCodeLocation(e);if(n&&t.location){const s=t.location,r=this.treeAdapter.getTagName(e);t.type===Ge.END_TAG_TOKEN&&r===t.tagName?(n.endTag=Object.assign({},s),n.endLine=s.endLine,n.endCol=s.endCol,n.endOffset=s.endOffset):(n.endLine=s.startLine,n.endCol=s.startCol,n.endOffset=s.startOffset);}}_getOverriddenMethods(e,t){return {_bootstrap(n,s){t._bootstrap.call(this,n,s),e.lastStartTagToken=null,e.lastFosterParentingLocation=null,e.currentToken=null;const r=je.install(this.tokenizer,qe);e.posTracker=r.posTracker,je.install(this.openElements,Je,{onItemPop:function(t){e._setEndLocation(t,e.currentToken);}});},_runParsingLoop(n){t._runParsingLoop.call(this,n);for(let t=this.openElements.stackTop;t>=0;t--)e._setEndLocation(this.openElements.items[t],e.currentToken);},_processTokenInForeignContent(n){e.currentToken=n,t._processTokenInForeignContent.call(this,n);},_processToken(n){if(e.currentToken=n,t._processToken.call(this,n),n.type===Ge.END_TAG_TOKEN&&(n.tagName===Ze.HTML||n.tagName===Ze.BODY&&this.openElements.hasInScope(Ze.BODY)))for(let t=this.openElements.stackTop;t>=0;t--){const s=this.openElements.items[t];if(this.treeAdapter.getTagName(s)===n.tagName){e._setEndLocation(s,n);break}}},_setDocumentType(e){t._setDocumentType.call(this,e);const n=this.treeAdapter.getChildNodes(this.document),s=n.length;for(let t=0;t<s;t++){const s=n[t];if(this.treeAdapter.isDocumentTypeNode(s)){this.treeAdapter.setNodeSourceCodeLocation(s,e.location);break}}},_attachElementToTree(n){e._setStartLocation(n),e.lastStartTagToken=null,t._attachElementToTree.call(this,n);},_appendElement(n,s){e.lastStartTagToken=n,t._appendElement.call(this,n,s);},_insertElement(n,s){e.lastStartTagToken=n,t._insertElement.call(this,n,s);},_insertTemplate(n){e.lastStartTagToken=n,t._insertTemplate.call(this,n);const s=this.treeAdapter.getTemplateContent(this.openElements.current);this.treeAdapter.setNodeSourceCodeLocation(s,null);},_insertFakeRootElement(){t._insertFakeRootElement.call(this),this.treeAdapter.setNodeSourceCodeLocation(this.openElements.current,null);},_appendCommentNode(e,n){t._appendCommentNode.call(this,e,n);const s=this.treeAdapter.getChildNodes(n),r=s[s.length-1];this.treeAdapter.setNodeSourceCodeLocation(r,e.location);},_findFosterParentingLocation(){return e.lastFosterParentingLocation=t._findFosterParentingLocation.call(this),e.lastFosterParentingLocation},_insertCharacters(n){t._insertCharacters.call(this,n);const s=this._shouldFosterParentOnInsertion(),r=s&&e.lastFosterParentingLocation.parent||this.openElements.currentTmplContent||this.openElements.current,i=this.treeAdapter.getChildNodes(r),T=s&&e.lastFosterParentingLocation.beforeElement?i.indexOf(e.lastFosterParentingLocation.beforeElement)-1:i.length-1,o=i[T],E=this.treeAdapter.getNodeSourceCodeLocation(o);E?(E.endLine=n.location.endLine,E.endCol=n.location.endCol,E.endOffset=n.location.endOffset):this.treeAdapter.setNodeSourceCodeLocation(o,n.location);}}}};var et=class extends je{constructor(e,t){super(e),this.posTracker=null,this.onParseError=t.onParseError;}_setErrorLocation(e){e.startLine=e.endLine=this.posTracker.line,e.startCol=e.endCol=this.posTracker.col,e.startOffset=e.endOffset=this.posTracker.offset;}_reportError(e){const t={code:e,startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1};this._setErrorLocation(t),this.onParseError(t);}_getOverriddenMethods(e){return {_err(t){e._reportError(t);}}}};var tt=class extends et{constructor(e,t){super(e,t),this.posTracker=je.install(e,ze),this.lastErrOffset=-1;}_reportError(e){this.lastErrOffset!==this.posTracker.offset&&(this.lastErrOffset=this.posTracker.offset,super._reportError(e));}};var nt=class extends et{constructor(e,t){super(e,t);const n=je.install(e.preprocessor,tt,t);this.posTracker=n.posTracker;}};var st=class extends et{constructor(e,t){super(e,t),this.opts=t,this.ctLoc=null,this.locBeforeToken=!1;}_setErrorLocation(e){this.ctLoc&&(e.startLine=this.ctLoc.startLine,e.startCol=this.ctLoc.startCol,e.startOffset=this.ctLoc.startOffset,e.endLine=this.locBeforeToken?this.ctLoc.startLine:this.ctLoc.endLine,e.endCol=this.locBeforeToken?this.ctLoc.startCol:this.ctLoc.endCol,e.endOffset=this.locBeforeToken?this.ctLoc.startOffset:this.ctLoc.endOffset);}_getOverriddenMethods(e,t){return {_bootstrap(n,s){t._bootstrap.call(this,n,s),je.install(this.tokenizer,nt,e.opts),je.install(this.tokenizer,qe);},_processInputToken(n){e.ctLoc=n.location,t._processInputToken.call(this,n);},_err(t,n){e.locBeforeToken=n&&n.beforeToken,e._reportError(t);}}}},rt=Ke((function(e,t){const{DOCUMENT_MODE:n}=be;t.createDocument=function(){return {nodeName:"#document",mode:n.NO_QUIRKS,childNodes:[]}},t.createDocumentFragment=function(){return {nodeName:"#document-fragment",childNodes:[]}},t.createElement=function(e,t,n){return {nodeName:e,tagName:e,attrs:n,namespaceURI:t,childNodes:[],parentNode:null}},t.createCommentNode=function(e){return {nodeName:"#comment",data:e,parentNode:null}};const s=function(e){return {nodeName:"#text",value:e,parentNode:null}},r=t.appendChild=function(e,t){e.childNodes.push(t),t.parentNode=e;},i=t.insertBefore=function(e,t,n){const s=e.childNodes.indexOf(n);e.childNodes.splice(s,0,t),t.parentNode=e;};t.setTemplateContent=function(e,t){e.content=t;},t.getTemplateContent=function(e){return e.content},t.setDocumentType=function(e,t,n,s){let i=null;for(let t=0;t<e.childNodes.length;t++)if("#documentType"===e.childNodes[t].nodeName){i=e.childNodes[t];break}i?(i.name=t,i.publicId=n,i.systemId=s):r(e,{nodeName:"#documentType",name:t,publicId:n,systemId:s});},t.setDocumentMode=function(e,t){e.mode=t;},t.getDocumentMode=function(e){return e.mode},t.detachNode=function(e){if(e.parentNode){const t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null;}},t.insertText=function(e,t){if(e.childNodes.length){const n=e.childNodes[e.childNodes.length-1];if("#text"===n.nodeName)return void(n.value+=t)}r(e,s(t));},t.insertTextBefore=function(e,t,n){const r=e.childNodes[e.childNodes.indexOf(n)-1];r&&"#text"===r.nodeName?r.value+=t:i(e,s(t),n);},t.adoptAttributes=function(e,t){const n=[];for(let t=0;t<e.attrs.length;t++)n.push(e.attrs[t].name);for(let s=0;s<t.length;s++)-1===n.indexOf(t[s].name)&&e.attrs.push(t[s]);},t.getFirstChild=function(e){return e.childNodes[0]},t.getChildNodes=function(e){return e.childNodes},t.getParentNode=function(e){return e.parentNode},t.getAttrList=function(e){return e.attrs},t.getTagName=function(e){return e.tagName},t.getNamespaceURI=function(e){return e.namespaceURI},t.getTextNodeContent=function(e){return e.value},t.getCommentNodeContent=function(e){return e.data},t.getDocumentTypeNodeName=function(e){return e.name},t.getDocumentTypeNodePublicId=function(e){return e.publicId},t.getDocumentTypeNodeSystemId=function(e){return e.systemId},t.isTextNode=function(e){return "#text"===e.nodeName},t.isCommentNode=function(e){return "#comment"===e.nodeName},t.isDocumentTypeNode=function(e){return "#documentType"===e.nodeName},t.isElementNode=function(e){return !!e.tagName},t.setNodeSourceCodeLocation=function(e,t){e.sourceCodeLocation=t;},t.getNodeSourceCodeLocation=function(e){return e.sourceCodeLocation};}));rt.createDocument,rt.createDocumentFragment,rt.createElement,rt.createCommentNode,rt.appendChild,rt.insertBefore,rt.setTemplateContent,rt.getTemplateContent,rt.setDocumentType,rt.setDocumentMode,rt.getDocumentMode,rt.detachNode,rt.insertText,rt.insertTextBefore,rt.adoptAttributes,rt.getFirstChild,rt.getChildNodes,rt.getParentNode,rt.getAttrList,rt.getTagName,rt.getNamespaceURI,rt.getTextNodeContent,rt.getCommentNodeContent,rt.getDocumentTypeNodeName,rt.getDocumentTypeNodePublicId,rt.getDocumentTypeNodeSystemId,rt.isTextNode,rt.isCommentNode,rt.isDocumentTypeNode,rt.isElementNode,rt.setNodeSourceCodeLocation,rt.getNodeSourceCodeLocation;const{DOCUMENT_MODE:it}=be,Tt=["+//silmaril//dtd html pro v0r11 19970101//","-//as//dtd html 3.0 aswedit + extensions//","-//advasoft ltd//dtd html 3.0 aswedit + extensions//","-//ietf//dtd html 2.0 level 1//","-//ietf//dtd html 2.0 level 2//","-//ietf//dtd html 2.0 strict level 1//","-//ietf//dtd html 2.0 strict level 2//","-//ietf//dtd html 2.0 strict//","-//ietf//dtd html 2.0//","-//ietf//dtd html 2.1e//","-//ietf//dtd html 3.0//","-//ietf//dtd html 3.2 final//","-//ietf//dtd html 3.2//","-//ietf//dtd html 3//","-//ietf//dtd html level 0//","-//ietf//dtd html level 1//","-//ietf//dtd html level 2//","-//ietf//dtd html level 3//","-//ietf//dtd html strict level 0//","-//ietf//dtd html strict level 1//","-//ietf//dtd html strict level 2//","-//ietf//dtd html strict level 3//","-//ietf//dtd html strict//","-//ietf//dtd html//","-//metrius//dtd metrius presentational//","-//microsoft//dtd internet explorer 2.0 html strict//","-//microsoft//dtd internet explorer 2.0 html//","-//microsoft//dtd internet explorer 2.0 tables//","-//microsoft//dtd internet explorer 3.0 html strict//","-//microsoft//dtd internet explorer 3.0 html//","-//microsoft//dtd internet explorer 3.0 tables//","-//netscape comm. corp.//dtd html//","-//netscape comm. corp.//dtd strict html//","-//o'reilly and associates//dtd html 2.0//","-//o'reilly and associates//dtd html extended 1.0//","-//o'reilly and associates//dtd html extended relaxed 1.0//","-//sq//dtd html 2.0 hotmetal + extensions//","-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//","-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//","-//spyglass//dtd html 2.0 extended//","-//sun microsystems corp.//dtd hotjava html//","-//sun microsystems corp.//dtd hotjava strict html//","-//w3c//dtd html 3 1995-03-24//","-//w3c//dtd html 3.2 draft//","-//w3c//dtd html 3.2 final//","-//w3c//dtd html 3.2//","-//w3c//dtd html 3.2s draft//","-//w3c//dtd html 4.0 frameset//","-//w3c//dtd html 4.0 transitional//","-//w3c//dtd html experimental 19960712//","-//w3c//dtd html experimental 970421//","-//w3c//dtd w3 html//","-//w3o//dtd w3 html 3.0//","-//webtechs//dtd mozilla html 2.0//","-//webtechs//dtd mozilla html//"],ot=Tt.concat(["-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"]),Et=["-//w3o//dtd w3 html strict 3.0//en//","-/w3c/dtd html 4.0 transitional/en","html"],at=["-//w3c//dtd xhtml 1.0 frameset//","-//w3c//dtd xhtml 1.0 transitional//"],_t=at.concat(["-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"]);function At(e,t){for(let n=0;n<t.length;n++)if(0===e.indexOf(t[n]))return !0;return !1}var ht=function(e){return "html"===e.name&&null===e.publicId&&(null===e.systemId||"about:legacy-compat"===e.systemId)},ct=function(e){if("html"!==e.name)return it.QUIRKS;const t=e.systemId;if(t&&"http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"===t.toLowerCase())return it.QUIRKS;let n=e.publicId;if(null!==n){if(n=n.toLowerCase(),Et.indexOf(n)>-1)return it.QUIRKS;let e=null===t?ot:Tt;if(At(n,e))return it.QUIRKS;if(e=null===t?at:_t,At(n,e))return it.LIMITED_QUIRKS}return it.NO_QUIRKS},lt=Ke((function(e,t){const n=be.TAG_NAMES,s=be.NAMESPACES,r=be.ATTRS,i="text/html",T="application/xhtml+xml",o={attributename:"attributeName",attributetype:"attributeType",basefrequency:"baseFrequency",baseprofile:"baseProfile",calcmode:"calcMode",clippathunits:"clipPathUnits",diffuseconstant:"diffuseConstant",edgemode:"edgeMode",filterunits:"filterUnits",glyphref:"glyphRef",gradienttransform:"gradientTransform",gradientunits:"gradientUnits",kernelmatrix:"kernelMatrix",kernelunitlength:"kernelUnitLength",keypoints:"keyPoints",keysplines:"keySplines",keytimes:"keyTimes",lengthadjust:"lengthAdjust",limitingconeangle:"limitingConeAngle",markerheight:"markerHeight",markerunits:"markerUnits",markerwidth:"markerWidth",maskcontentunits:"maskContentUnits",maskunits:"maskUnits",numoctaves:"numOctaves",pathlength:"pathLength",patterncontentunits:"patternContentUnits",patterntransform:"patternTransform",patternunits:"patternUnits",pointsatx:"pointsAtX",pointsaty:"pointsAtY",pointsatz:"pointsAtZ",preservealpha:"preserveAlpha",preserveaspectratio:"preserveAspectRatio",primitiveunits:"primitiveUnits",refx:"refX",refy:"refY",repeatcount:"repeatCount",repeatdur:"repeatDur",requiredextensions:"requiredExtensions",requiredfeatures:"requiredFeatures",specularconstant:"specularConstant",specularexponent:"specularExponent",spreadmethod:"spreadMethod",startoffset:"startOffset",stddeviation:"stdDeviation",stitchtiles:"stitchTiles",surfacescale:"surfaceScale",systemlanguage:"systemLanguage",tablevalues:"tableValues",targetx:"targetX",targety:"targetY",textlength:"textLength",viewbox:"viewBox",viewtarget:"viewTarget",xchannelselector:"xChannelSelector",ychannelselector:"yChannelSelector",zoomandpan:"zoomAndPan"},E={"xlink:actuate":{prefix:"xlink",name:"actuate",namespace:s.XLINK},"xlink:arcrole":{prefix:"xlink",name:"arcrole",namespace:s.XLINK},"xlink:href":{prefix:"xlink",name:"href",namespace:s.XLINK},"xlink:role":{prefix:"xlink",name:"role",namespace:s.XLINK},"xlink:show":{prefix:"xlink",name:"show",namespace:s.XLINK},"xlink:title":{prefix:"xlink",name:"title",namespace:s.XLINK},"xlink:type":{prefix:"xlink",name:"type",namespace:s.XLINK},"xml:base":{prefix:"xml",name:"base",namespace:s.XML},"xml:lang":{prefix:"xml",name:"lang",namespace:s.XML},"xml:space":{prefix:"xml",name:"space",namespace:s.XML},xmlns:{prefix:"",name:"xmlns",namespace:s.XMLNS},"xmlns:xlink":{prefix:"xmlns",name:"xlink",namespace:s.XMLNS}},a=t.SVG_TAG_NAMES_ADJUSTMENT_MAP={altglyph:"altGlyph",altglyphdef:"altGlyphDef",altglyphitem:"altGlyphItem",animatecolor:"animateColor",animatemotion:"animateMotion",animatetransform:"animateTransform",clippath:"clipPath",feblend:"feBlend",fecolormatrix:"feColorMatrix",fecomponenttransfer:"feComponentTransfer",fecomposite:"feComposite",feconvolvematrix:"feConvolveMatrix",fediffuselighting:"feDiffuseLighting",fedisplacementmap:"feDisplacementMap",fedistantlight:"feDistantLight",feflood:"feFlood",fefunca:"feFuncA",fefuncb:"feFuncB",fefuncg:"feFuncG",fefuncr:"feFuncR",fegaussianblur:"feGaussianBlur",feimage:"feImage",femerge:"feMerge",femergenode:"feMergeNode",femorphology:"feMorphology",feoffset:"feOffset",fepointlight:"fePointLight",fespecularlighting:"feSpecularLighting",fespotlight:"feSpotLight",fetile:"feTile",feturbulence:"feTurbulence",foreignobject:"foreignObject",glyphref:"glyphRef",lineargradient:"linearGradient",radialgradient:"radialGradient",textpath:"textPath"},_={[n.B]:!0,[n.BIG]:!0,[n.BLOCKQUOTE]:!0,[n.BODY]:!0,[n.BR]:!0,[n.CENTER]:!0,[n.CODE]:!0,[n.DD]:!0,[n.DIV]:!0,[n.DL]:!0,[n.DT]:!0,[n.EM]:!0,[n.EMBED]:!0,[n.H1]:!0,[n.H2]:!0,[n.H3]:!0,[n.H4]:!0,[n.H5]:!0,[n.H6]:!0,[n.HEAD]:!0,[n.HR]:!0,[n.I]:!0,[n.IMG]:!0,[n.LI]:!0,[n.LISTING]:!0,[n.MENU]:!0,[n.META]:!0,[n.NOBR]:!0,[n.OL]:!0,[n.P]:!0,[n.PRE]:!0,[n.RUBY]:!0,[n.S]:!0,[n.SMALL]:!0,[n.SPAN]:!0,[n.STRONG]:!0,[n.STRIKE]:!0,[n.SUB]:!0,[n.SUP]:!0,[n.TABLE]:!0,[n.TT]:!0,[n.U]:!0,[n.UL]:!0,[n.VAR]:!0};t.causesExit=function(e){const t=e.tagName;return !!(t===n.FONT&&(null!==Ge.getTokenAttr(e,r.COLOR)||null!==Ge.getTokenAttr(e,r.SIZE)||null!==Ge.getTokenAttr(e,r.FACE)))||_[t]},t.adjustTokenMathMLAttrs=function(e){for(let t=0;t<e.attrs.length;t++)if("definitionurl"===e.attrs[t].name){e.attrs[t].name="definitionURL";break}},t.adjustTokenSVGAttrs=function(e){for(let t=0;t<e.attrs.length;t++){const n=o[e.attrs[t].name];n&&(e.attrs[t].name=n);}},t.adjustTokenXMLAttrs=function(e){for(let t=0;t<e.attrs.length;t++){const n=E[e.attrs[t].name];n&&(e.attrs[t].prefix=n.prefix,e.attrs[t].name=n.name,e.attrs[t].namespace=n.namespace);}},t.adjustTokenSVGTagName=function(e){const t=a[e.tagName];t&&(e.tagName=t);},t.isIntegrationPoint=function(e,t,o,E){return !(E&&E!==s.HTML||!function(e,t,o){if(t===s.MATHML&&e===n.ANNOTATION_XML)for(let e=0;e<o.length;e++)if(o[e].name===r.ENCODING){const t=o[e].value.toLowerCase();return t===i||t===T}return t===s.SVG&&(e===n.FOREIGN_OBJECT||e===n.DESC||e===n.TITLE)}(e,t,o))||!(E&&E!==s.MATHML||!function(e,t){return t===s.MATHML&&(e===n.MI||e===n.MO||e===n.MN||e===n.MS||e===n.MTEXT)}(e,t))};}));lt.SVG_TAG_NAMES_ADJUSTMENT_MAP,lt.causesExit,lt.adjustTokenMathMLAttrs,lt.adjustTokenSVGAttrs,lt.adjustTokenXMLAttrs,lt.adjustTokenSVGTagName,lt.isIntegrationPoint;const mt=be.TAG_NAMES,pt=be.NAMESPACES,Nt=be.ATTRS,ut={scriptingEnabled:!0,sourceCodeLocationInfo:!1,onParseError:null,treeAdapter:rt},Ot="IN_TABLE_MODE",St={[mt.TR]:"IN_ROW_MODE",[mt.TBODY]:"IN_TABLE_BODY_MODE",[mt.THEAD]:"IN_TABLE_BODY_MODE",[mt.TFOOT]:"IN_TABLE_BODY_MODE",[mt.CAPTION]:"IN_CAPTION_MODE",[mt.COLGROUP]:"IN_COLUMN_GROUP_MODE",[mt.TABLE]:Ot,[mt.BODY]:"IN_BODY_MODE",[mt.FRAMESET]:"IN_FRAMESET_MODE"},Ct={[mt.CAPTION]:Ot,[mt.COLGROUP]:Ot,[mt.TBODY]:Ot,[mt.TFOOT]:Ot,[mt.THEAD]:Ot,[mt.COL]:"IN_COLUMN_GROUP_MODE",[mt.TR]:"IN_TABLE_BODY_MODE",[mt.TD]:"IN_ROW_MODE",[mt.TH]:"IN_ROW_MODE"},dt={INITIAL_MODE:{[Ge.CHARACTER_TOKEN]:Kt,[Ge.NULL_CHARACTER_TOKEN]:Kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:kt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:function(e,t){e._setDocumentType(t);const n=t.forceQuirks?be.DOCUMENT_MODE.QUIRKS:ct(t);ht(t)||e._err(ie);e.treeAdapter.setDocumentMode(e.document,n),e.insertionMode="BEFORE_HTML_MODE";},[Ge.START_TAG_TOKEN]:Kt,[Ge.END_TAG_TOKEN]:Kt,[Ge.EOF_TOKEN]:Kt},BEFORE_HTML_MODE:{[Ge.CHARACTER_TOKEN]:bt,[Ge.NULL_CHARACTER_TOKEN]:bt,[Ge.WHITESPACE_CHARACTER_TOKEN]:kt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){t.tagName===mt.HTML?(e._insertElement(t,pt.HTML),e.insertionMode="BEFORE_HEAD_MODE"):bt(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n!==mt.HTML&&n!==mt.HEAD&&n!==mt.BODY&&n!==mt.BR||bt(e,t);},[Ge.EOF_TOKEN]:bt},BEFORE_HEAD_MODE:{[Ge.CHARACTER_TOKEN]:Yt,[Ge.NULL_CHARACTER_TOKEN]:Yt,[Ge.WHITESPACE_CHARACTER_TOKEN]:kt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:Ht,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.HEAD?(e._insertElement(t,pt.HTML),e.headElement=e.openElements.current,e.insertionMode="IN_HEAD_MODE"):Yt(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HEAD||n===mt.BODY||n===mt.HTML||n===mt.BR?Yt(e,t):e._err(Ee);},[Ge.EOF_TOKEN]:Yt},IN_HEAD_MODE:{[Ge.CHARACTER_TOKEN]:vt,[Ge.NULL_CHARACTER_TOKEN]:vt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:Ht,[Ge.START_TAG_TOKEN]:xt,[Ge.END_TAG_TOKEN]:yt,[Ge.EOF_TOKEN]:vt},IN_HEAD_NO_SCRIPT_MODE:{[Ge.CHARACTER_TOKEN]:wt,[Ge.NULL_CHARACTER_TOKEN]:wt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:Ht,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.BASEFONT||n===mt.BGSOUND||n===mt.HEAD||n===mt.LINK||n===mt.META||n===mt.NOFRAMES||n===mt.STYLE?xt(e,t):n===mt.NOSCRIPT?e._err(le):wt(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.NOSCRIPT?(e.openElements.pop(),e.insertionMode="IN_HEAD_MODE"):n===mt.BR?wt(e,t):e._err(Ee);},[Ge.EOF_TOKEN]:wt},AFTER_HEAD_MODE:{[Ge.CHARACTER_TOKEN]:Qt,[Ge.NULL_CHARACTER_TOKEN]:Qt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:Ht,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.BODY?(e._insertElement(t,pt.HTML),e.framesetOk=!1,e.insertionMode="IN_BODY_MODE"):n===mt.FRAMESET?(e._insertElement(t,pt.HTML),e.insertionMode="IN_FRAMESET_MODE"):n===mt.BASE||n===mt.BASEFONT||n===mt.BGSOUND||n===mt.LINK||n===mt.META||n===mt.NOFRAMES||n===mt.SCRIPT||n===mt.STYLE||n===mt.TEMPLATE||n===mt.TITLE?(e._err(he),e.openElements.push(e.headElement),xt(e,t),e.openElements.remove(e.headElement)):n===mt.HEAD?e._err(ce):Qt(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.BODY||n===mt.HTML||n===mt.BR?Qt(e,t):n===mt.TEMPLATE?yt(e,t):e._err(Ee);},[Ge.EOF_TOKEN]:Qt},IN_BODY_MODE:{[Ge.CHARACTER_TOKEN]:Wt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:sn,[Ge.END_TAG_TOKEN]:En,[Ge.EOF_TOKEN]:an},TEXT_MODE:{[Ge.CHARACTER_TOKEN]:Bt,[Ge.NULL_CHARACTER_TOKEN]:Bt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:kt,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:kt,[Ge.END_TAG_TOKEN]:function(e,t){t.tagName===mt.SCRIPT&&(e.pendingScript=e.openElements.current);e.openElements.pop(),e.insertionMode=e.originalInsertionMode;},[Ge.EOF_TOKEN]:function(e,t){e._err(me),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e._processToken(t);}},[Ot]:{[Ge.CHARACTER_TOKEN]:_n,[Ge.NULL_CHARACTER_TOKEN]:_n,[Ge.WHITESPACE_CHARACTER_TOKEN]:_n,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:An,[Ge.END_TAG_TOKEN]:hn,[Ge.EOF_TOKEN]:an},IN_TABLE_TEXT_MODE:{[Ge.CHARACTER_TOKEN]:function(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0;},[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:function(e,t){e.pendingCharacterTokens.push(t);},[Ge.COMMENT_TOKEN]:ln,[Ge.DOCTYPE_TOKEN]:ln,[Ge.START_TAG_TOKEN]:ln,[Ge.END_TAG_TOKEN]:ln,[Ge.EOF_TOKEN]:ln},IN_CAPTION_MODE:{[Ge.CHARACTER_TOKEN]:Wt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.CAPTION||n===mt.COL||n===mt.COLGROUP||n===mt.TBODY||n===mt.TD||n===mt.TFOOT||n===mt.TH||n===mt.THEAD||n===mt.TR?e.openElements.hasInTableScope(mt.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(mt.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Ot,e._processToken(t)):sn(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.CAPTION||n===mt.TABLE?e.openElements.hasInTableScope(mt.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(mt.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Ot,n===mt.TABLE&&e._processToken(t)):n!==mt.BODY&&n!==mt.COL&&n!==mt.COLGROUP&&n!==mt.HTML&&n!==mt.TBODY&&n!==mt.TD&&n!==mt.TFOOT&&n!==mt.TH&&n!==mt.THEAD&&n!==mt.TR&&En(e,t);},[Ge.EOF_TOKEN]:an},IN_COLUMN_GROUP_MODE:{[Ge.CHARACTER_TOKEN]:mn,[Ge.NULL_CHARACTER_TOKEN]:mn,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.COL?(e._appendElement(t,pt.HTML),t.ackSelfClosing=!0):n===mt.TEMPLATE?xt(e,t):mn(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.COLGROUP?e.openElements.currentTagName===mt.COLGROUP&&(e.openElements.pop(),e.insertionMode=Ot):n===mt.TEMPLATE?yt(e,t):n!==mt.COL&&mn(e,t);},[Ge.EOF_TOKEN]:an},IN_TABLE_BODY_MODE:{[Ge.CHARACTER_TOKEN]:_n,[Ge.NULL_CHARACTER_TOKEN]:_n,[Ge.WHITESPACE_CHARACTER_TOKEN]:_n,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.TR?(e.openElements.clearBackToTableBodyContext(),e._insertElement(t,pt.HTML),e.insertionMode="IN_ROW_MODE"):n===mt.TH||n===mt.TD?(e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(mt.TR),e.insertionMode="IN_ROW_MODE",e._processToken(t)):n===mt.CAPTION||n===mt.COL||n===mt.COLGROUP||n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD?e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Ot,e._processToken(t)):An(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD?e.openElements.hasInTableScope(n)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Ot):n===mt.TABLE?e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Ot,e._processToken(t)):(n!==mt.BODY&&n!==mt.CAPTION&&n!==mt.COL&&n!==mt.COLGROUP||n!==mt.HTML&&n!==mt.TD&&n!==mt.TH&&n!==mt.TR)&&hn(e,t);},[Ge.EOF_TOKEN]:an},IN_ROW_MODE:{[Ge.CHARACTER_TOKEN]:_n,[Ge.NULL_CHARACTER_TOKEN]:_n,[Ge.WHITESPACE_CHARACTER_TOKEN]:_n,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.TH||n===mt.TD?(e.openElements.clearBackToTableRowContext(),e._insertElement(t,pt.HTML),e.insertionMode="IN_CELL_MODE",e.activeFormattingElements.insertMarker()):n===mt.CAPTION||n===mt.COL||n===mt.COLGROUP||n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD||n===mt.TR?e.openElements.hasInTableScope(mt.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode="IN_TABLE_BODY_MODE",e._processToken(t)):An(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.TR?e.openElements.hasInTableScope(mt.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode="IN_TABLE_BODY_MODE"):n===mt.TABLE?e.openElements.hasInTableScope(mt.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode="IN_TABLE_BODY_MODE",e._processToken(t)):n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD?(e.openElements.hasInTableScope(n)||e.openElements.hasInTableScope(mt.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode="IN_TABLE_BODY_MODE",e._processToken(t)):(n!==mt.BODY&&n!==mt.CAPTION&&n!==mt.COL&&n!==mt.COLGROUP||n!==mt.HTML&&n!==mt.TD&&n!==mt.TH)&&hn(e,t);},[Ge.EOF_TOKEN]:an},IN_CELL_MODE:{[Ge.CHARACTER_TOKEN]:Wt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.CAPTION||n===mt.COL||n===mt.COLGROUP||n===mt.TBODY||n===mt.TD||n===mt.TFOOT||n===mt.TH||n===mt.THEAD||n===mt.TR?(e.openElements.hasInTableScope(mt.TD)||e.openElements.hasInTableScope(mt.TH))&&(e._closeTableCell(),e._processToken(t)):sn(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.TD||n===mt.TH?e.openElements.hasInTableScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker(),e.insertionMode="IN_ROW_MODE"):n===mt.TABLE||n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD||n===mt.TR?e.openElements.hasInTableScope(n)&&(e._closeTableCell(),e._processToken(t)):n!==mt.BODY&&n!==mt.CAPTION&&n!==mt.COL&&n!==mt.COLGROUP&&n!==mt.HTML&&En(e,t);},[Ge.EOF_TOKEN]:an},IN_SELECT_MODE:{[Ge.CHARACTER_TOKEN]:Bt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:pn,[Ge.END_TAG_TOKEN]:Nn,[Ge.EOF_TOKEN]:an},IN_SELECT_IN_TABLE_MODE:{[Ge.CHARACTER_TOKEN]:Bt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.CAPTION||n===mt.TABLE||n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD||n===mt.TR||n===mt.TD||n===mt.TH?(e.openElements.popUntilTagNamePopped(mt.SELECT),e._resetInsertionMode(),e._processToken(t)):pn(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.CAPTION||n===mt.TABLE||n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD||n===mt.TR||n===mt.TD||n===mt.TH?e.openElements.hasInTableScope(n)&&(e.openElements.popUntilTagNamePopped(mt.SELECT),e._resetInsertionMode(),e._processToken(t)):Nn(e,t);},[Ge.EOF_TOKEN]:an},IN_TEMPLATE_MODE:{[Ge.CHARACTER_TOKEN]:Wt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;if(n===mt.BASE||n===mt.BASEFONT||n===mt.BGSOUND||n===mt.LINK||n===mt.META||n===mt.NOFRAMES||n===mt.SCRIPT||n===mt.STYLE||n===mt.TEMPLATE||n===mt.TITLE)xt(e,t);else{const s=Ct[n]||"IN_BODY_MODE";e._popTmplInsertionMode(),e._pushTmplInsertionMode(s),e.insertionMode=s,e._processToken(t);}},[Ge.END_TAG_TOKEN]:function(e,t){t.tagName===mt.TEMPLATE&&yt(e,t);},[Ge.EOF_TOKEN]:un},AFTER_BODY_MODE:{[Ge.CHARACTER_TOKEN]:On,[Ge.NULL_CHARACTER_TOKEN]:On,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:function(e,t){e._appendCommentNode(t,e.openElements.items[0]);},[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){t.tagName===mt.HTML?sn(e,t):On(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){t.tagName===mt.HTML?e.fragmentContext||(e.insertionMode="AFTER_AFTER_BODY_MODE"):On(e,t);},[Ge.EOF_TOKEN]:Gt},IN_FRAMESET_MODE:{[Ge.CHARACTER_TOKEN]:kt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.FRAMESET?e._insertElement(t,pt.HTML):n===mt.FRAME?(e._appendElement(t,pt.HTML),t.ackSelfClosing=!0):n===mt.NOFRAMES&&xt(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){t.tagName!==mt.FRAMESET||e.openElements.isRootHtmlElementCurrent()||(e.openElements.pop(),e.fragmentContext||e.openElements.currentTagName===mt.FRAMESET||(e.insertionMode="AFTER_FRAMESET_MODE"));},[Ge.EOF_TOKEN]:Gt},AFTER_FRAMESET_MODE:{[Ge.CHARACTER_TOKEN]:kt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Bt,[Ge.COMMENT_TOKEN]:Ut,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.NOFRAMES&&xt(e,t);},[Ge.END_TAG_TOKEN]:function(e,t){t.tagName===mt.HTML&&(e.insertionMode="AFTER_AFTER_FRAMESET_MODE");},[Ge.EOF_TOKEN]:Gt},AFTER_AFTER_BODY_MODE:{[Ge.CHARACTER_TOKEN]:Sn,[Ge.NULL_CHARACTER_TOKEN]:Sn,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:Ft,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){t.tagName===mt.HTML?sn(e,t):Sn(e,t);},[Ge.END_TAG_TOKEN]:Sn,[Ge.EOF_TOKEN]:Gt},AFTER_AFTER_FRAMESET_MODE:{[Ge.CHARACTER_TOKEN]:kt,[Ge.NULL_CHARACTER_TOKEN]:kt,[Ge.WHITESPACE_CHARACTER_TOKEN]:Xt,[Ge.COMMENT_TOKEN]:Ft,[Ge.DOCTYPE_TOKEN]:kt,[Ge.START_TAG_TOKEN]:function(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.NOFRAMES&&xt(e,t);},[Ge.END_TAG_TOKEN]:kt,[Ge.EOF_TOKEN]:Gt}};var Rt=class{constructor(e){this.options=function(e,t){return [e,t=t||Object.create(null)].reduce((e,t)=>(Object.keys(t).forEach(n=>{e[n]=t[n];}),e),Object.create(null))}(ut,e),this.treeAdapter=this.options.treeAdapter,this.pendingScript=null,this.options.sourceCodeLocationInfo&&je.install(this,$e),this.options.onParseError&&je.install(this,st,{onParseError:this.options.onParseError});}parse(e){const t=this.treeAdapter.createDocument();return this._bootstrap(t,null),this.tokenizer.write(e,!0),this._runParsingLoop(null),t}parseFragment(e,t){t||(t=this.treeAdapter.createElement(mt.TEMPLATE,pt.HTML,[]));const n=this.treeAdapter.createElement("documentmock",pt.HTML,[]);this._bootstrap(n,t),this.treeAdapter.getTagName(t)===mt.TEMPLATE&&this._pushTmplInsertionMode("IN_TEMPLATE_MODE"),this._initTokenizerForFragmentParsing(),this._insertFakeRootElement(),this._resetInsertionMode(),this._findFormInFragmentContext(),this.tokenizer.write(e,!0),this._runParsingLoop(null);const s=this.treeAdapter.getFirstChild(n),r=this.treeAdapter.createDocumentFragment();return this._adoptNodes(s,r),r}_bootstrap(e,t){this.tokenizer=new Ge(this.options),this.stopped=!1,this.insertionMode="INITIAL_MODE",this.originalInsertionMode="",this.document=e,this.fragmentContext=t,this.headElement=null,this.formElement=null,this.openElements=new Qe(this.document,this.treeAdapter),this.activeFormattingElements=new We(this.treeAdapter),this.tmplInsertionModeStack=[],this.tmplInsertionModeStackTop=-1,this.currentTmplInsertionMode=null,this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1;}_err(){}_runParsingLoop(e){for(;!this.stopped;){this._setupTokenizerCDATAMode();const t=this.tokenizer.getNextToken();if(t.type===Ge.HIBERNATION_TOKEN)break;if(this.skipNextNewLine&&(this.skipNextNewLine=!1,t.type===Ge.WHITESPACE_CHARACTER_TOKEN&&"\n"===t.chars[0])){if(1===t.chars.length)continue;t.chars=t.chars.substr(1);}if(this._processInputToken(t),e&&this.pendingScript)break}}runParsingLoopForCurrentChunk(e,t){if(this._runParsingLoop(t),t&&this.pendingScript){const e=this.pendingScript;return this.pendingScript=null,void t(e)}e&&e();}_setupTokenizerCDATAMode(){const e=this._getAdjustedCurrentElement();this.tokenizer.allowCDATA=e&&e!==this.document&&this.treeAdapter.getNamespaceURI(e)!==pt.HTML&&!this._isIntegrationPoint(e);}_switchToTextParsing(e,t){this._insertElement(e,pt.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode="TEXT_MODE";}switchToPlaintextParsing(){this.insertionMode="TEXT_MODE",this.originalInsertionMode="IN_BODY_MODE",this.tokenizer.state=Ge.MODE.PLAINTEXT;}_getAdjustedCurrentElement(){return 0===this.openElements.stackTop&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let e=this.fragmentContext;do{if(this.treeAdapter.getTagName(e)===mt.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e);}while(e)}_initTokenizerForFragmentParsing(){if(this.treeAdapter.getNamespaceURI(this.fragmentContext)===pt.HTML){const e=this.treeAdapter.getTagName(this.fragmentContext);e===mt.TITLE||e===mt.TEXTAREA?this.tokenizer.state=Ge.MODE.RCDATA:e===mt.STYLE||e===mt.XMP||e===mt.IFRAME||e===mt.NOEMBED||e===mt.NOFRAMES||e===mt.NOSCRIPT?this.tokenizer.state=Ge.MODE.RAWTEXT:e===mt.SCRIPT?this.tokenizer.state=Ge.MODE.SCRIPT_DATA:e===mt.PLAINTEXT&&(this.tokenizer.state=Ge.MODE.PLAINTEXT);}}_setDocumentType(e){const t=e.name||"",n=e.publicId||"",s=e.systemId||"";this.treeAdapter.setDocumentType(this.document,t,n,s);}_attachElementToTree(e){if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else{const t=this.openElements.currentTmplContent||this.openElements.current;this.treeAdapter.appendChild(t,e);}}_appendElement(e,t){const n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n);}_insertElement(e,t){const n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n),this.openElements.push(n);}_insertFakeElement(e){const t=this.treeAdapter.createElement(e,pt.HTML,[]);this._attachElementToTree(t),this.openElements.push(t);}_insertTemplate(e){const t=this.treeAdapter.createElement(e.tagName,pt.HTML,e.attrs),n=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,n),this._attachElementToTree(t),this.openElements.push(t);}_insertFakeRootElement(){const e=this.treeAdapter.createElement(mt.HTML,pt.HTML,[]);this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e);}_appendCommentNode(e,t){const n=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,n);}_insertCharacters(e){if(this._shouldFosterParentOnInsertion())this._fosterParentText(e.chars);else{const t=this.openElements.currentTmplContent||this.openElements.current;this.treeAdapter.insertText(t,e.chars);}}_adoptNodes(e,t){for(let n=this.treeAdapter.getFirstChild(e);n;n=this.treeAdapter.getFirstChild(e))this.treeAdapter.detachNode(n),this.treeAdapter.appendChild(t,n);}_shouldProcessTokenInForeignContent(e){const t=this._getAdjustedCurrentElement();if(!t||t===this.document)return !1;const n=this.treeAdapter.getNamespaceURI(t);if(n===pt.HTML)return !1;if(this.treeAdapter.getTagName(t)===mt.ANNOTATION_XML&&n===pt.MATHML&&e.type===Ge.START_TAG_TOKEN&&e.tagName===mt.SVG)return !1;const s=e.type===Ge.CHARACTER_TOKEN||e.type===Ge.NULL_CHARACTER_TOKEN||e.type===Ge.WHITESPACE_CHARACTER_TOKEN;return (!(e.type===Ge.START_TAG_TOKEN&&e.tagName!==mt.MGLYPH&&e.tagName!==mt.MALIGNMARK)&&!s||!this._isIntegrationPoint(t,pt.MATHML))&&((e.type!==Ge.START_TAG_TOKEN&&!s||!this._isIntegrationPoint(t,pt.HTML))&&e.type!==Ge.EOF_TOKEN)}_processToken(e){dt[this.insertionMode][e.type](this,e);}_processTokenInBodyMode(e){dt.IN_BODY_MODE[e.type](this,e);}_processTokenInForeignContent(e){e.type===Ge.CHARACTER_TOKEN?function(e,t){e._insertCharacters(t),e.framesetOk=!1;}(this,e):e.type===Ge.NULL_CHARACTER_TOKEN?function(e,t){t.chars=n,e._insertCharacters(t);}(this,e):e.type===Ge.WHITESPACE_CHARACTER_TOKEN?Bt(this,e):e.type===Ge.COMMENT_TOKEN?Ut(this,e):e.type===Ge.START_TAG_TOKEN?function(e,t){if(lt.causesExit(t)&&!e.fragmentContext){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==pt.HTML&&!e._isIntegrationPoint(e.openElements.current);)e.openElements.pop();e._processToken(t);}else{const n=e._getAdjustedCurrentElement(),s=e.treeAdapter.getNamespaceURI(n);s===pt.MATHML?lt.adjustTokenMathMLAttrs(t):s===pt.SVG&&(lt.adjustTokenSVGTagName(t),lt.adjustTokenSVGAttrs(t)),lt.adjustTokenXMLAttrs(t),t.selfClosing?e._appendElement(t,s):e._insertElement(t,s),t.ackSelfClosing=!0;}}(this,e):e.type===Ge.END_TAG_TOKEN&&function(e,t){for(let n=e.openElements.stackTop;n>0;n--){const s=e.openElements.items[n];if(e.treeAdapter.getNamespaceURI(s)===pt.HTML){e._processToken(t);break}if(e.treeAdapter.getTagName(s).toLowerCase()===t.tagName){e.openElements.popUntilElementPopped(s);break}}}(this,e);}_processInputToken(e){this._shouldProcessTokenInForeignContent(e)?this._processTokenInForeignContent(e):this._processToken(e),e.type===Ge.START_TAG_TOKEN&&e.selfClosing&&!e.ackSelfClosing&&this._err(c);}_isIntegrationPoint(e,t){const n=this.treeAdapter.getTagName(e),s=this.treeAdapter.getNamespaceURI(e),r=this.treeAdapter.getAttrList(e);return lt.isIntegrationPoint(n,s,r,t)}_reconstructActiveFormattingElements(){const e=this.activeFormattingElements.length;if(e){let t=e,n=null;do{if(t--,n=this.activeFormattingElements.entries[t],n.type===We.MARKER_ENTRY||this.openElements.contains(n.element)){t++;break}}while(t>0);for(let s=t;s<e;s++)n=this.activeFormattingElements.entries[s],this._insertElement(n.token,this.treeAdapter.getNamespaceURI(n.element)),n.element=this.openElements.current;}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode="IN_ROW_MODE";}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(mt.P),this.openElements.popUntilTagNamePopped(mt.P);}_resetInsertionMode(){for(let e=this.openElements.stackTop,t=!1;e>=0;e--){let n=this.openElements.items[e];0===e&&(t=!0,this.fragmentContext&&(n=this.fragmentContext));const s=this.treeAdapter.getTagName(n),r=St[s];if(r){this.insertionMode=r;break}if(!(t||s!==mt.TD&&s!==mt.TH)){this.insertionMode="IN_CELL_MODE";break}if(!t&&s===mt.HEAD){this.insertionMode="IN_HEAD_MODE";break}if(s===mt.SELECT){this._resetInsertionModeForSelect(e);break}if(s===mt.TEMPLATE){this.insertionMode=this.currentTmplInsertionMode;break}if(s===mt.HTML){this.insertionMode=this.headElement?"AFTER_HEAD_MODE":"BEFORE_HEAD_MODE";break}if(t){this.insertionMode="IN_BODY_MODE";break}}}_resetInsertionModeForSelect(e){if(e>0)for(let t=e-1;t>0;t--){const e=this.openElements.items[t],n=this.treeAdapter.getTagName(e);if(n===mt.TEMPLATE)break;if(n===mt.TABLE)return void(this.insertionMode="IN_SELECT_IN_TABLE_MODE")}this.insertionMode="IN_SELECT_MODE";}_pushTmplInsertionMode(e){this.tmplInsertionModeStack.push(e),this.tmplInsertionModeStackTop++,this.currentTmplInsertionMode=e;}_popTmplInsertionMode(){this.tmplInsertionModeStack.pop(),this.tmplInsertionModeStackTop--,this.currentTmplInsertionMode=this.tmplInsertionModeStack[this.tmplInsertionModeStackTop];}_isElementCausesFosterParenting(e){const t=this.treeAdapter.getTagName(e);return t===mt.TABLE||t===mt.TBODY||t===mt.TFOOT||t===mt.THEAD||t===mt.TR}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this._isElementCausesFosterParenting(this.openElements.current)}_findFosterParentingLocation(){const e={parent:null,beforeElement:null};for(let t=this.openElements.stackTop;t>=0;t--){const n=this.openElements.items[t],s=this.treeAdapter.getTagName(n),r=this.treeAdapter.getNamespaceURI(n);if(s===mt.TEMPLATE&&r===pt.HTML){e.parent=this.treeAdapter.getTemplateContent(n);break}if(s===mt.TABLE){e.parent=this.treeAdapter.getParentNode(n),e.parent?e.beforeElement=n:e.parent=this.openElements.items[t-1];break}}return e.parent||(e.parent=this.openElements.items[0]),e}_fosterParentElement(e){const t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e);}_fosterParentText(e){const t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertTextBefore(t.parent,e,t.beforeElement):this.treeAdapter.insertText(t.parent,e);}_isSpecialElement(e){const t=this.treeAdapter.getTagName(e),n=this.treeAdapter.getNamespaceURI(e);return be.SPECIAL_ELEMENTS[n][t]}};function It(e,t){let n=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return n?e.openElements.contains(n.element)?e.openElements.hasInScope(t.tagName)||(n=null):(e.activeFormattingElements.removeEntry(n),n=null):on(e,t),n}function ft(e,t){let n=null;for(let s=e.openElements.stackTop;s>=0;s--){const r=e.openElements.items[s];if(r===t.element)break;e._isSpecialElement(r)&&(n=r);}return n||(e.openElements.popUntilElementPopped(t.element),e.activeFormattingElements.removeEntry(t)),n}function Mt(e,t,n){let s=t,r=e.openElements.getCommonAncestor(t);for(let i=0,T=r;T!==n;i++,T=r){r=e.openElements.getCommonAncestor(T);const n=e.activeFormattingElements.getElementEntry(T),o=n&&i>=3;!n||o?(o&&e.activeFormattingElements.removeEntry(n),e.openElements.remove(T)):(T=Lt(e,n),s===t&&(e.activeFormattingElements.bookmark=n),e.treeAdapter.detachNode(s),e.treeAdapter.appendChild(T,s),s=T);}return s}function Lt(e,t){const n=e.treeAdapter.getNamespaceURI(t.element),s=e.treeAdapter.createElement(t.token.tagName,n,t.token.attrs);return e.openElements.replace(t.element,s),t.element=s,s}function Dt(e,t,n){if(e._isElementCausesFosterParenting(t))e._fosterParentElement(n);else{const s=e.treeAdapter.getTagName(t),r=e.treeAdapter.getNamespaceURI(t);s===mt.TEMPLATE&&r===pt.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,n);}}function gt(e,t,n){const s=e.treeAdapter.getNamespaceURI(n.element),r=n.token,i=e.treeAdapter.createElement(r.tagName,s,r.attrs);e._adoptNodes(t,i),e.treeAdapter.appendChild(t,i),e.activeFormattingElements.insertElementAfterBookmark(i,n.token),e.activeFormattingElements.removeEntry(n),e.openElements.remove(n.element),e.openElements.insertAfter(t,i);}function Pt(e,t){let n;for(let s=0;s<8&&(n=It(e,t),n);s++){const t=ft(e,n);if(!t)break;e.activeFormattingElements.bookmark=n;const s=Mt(e,t,n.element),r=e.openElements.getCommonAncestor(n.element);e.treeAdapter.detachNode(s),Dt(e,r,s),gt(e,t,n);}}function kt(){}function Ht(e){e._err(oe);}function Ut(e,t){e._appendCommentNode(t,e.openElements.currentTmplContent||e.openElements.current);}function Ft(e,t){e._appendCommentNode(t,e.document);}function Bt(e,t){e._insertCharacters(t);}function Gt(e){e.stopped=!0;}function Kt(e,t){e._err(Te,{beforeToken:!0}),e.treeAdapter.setDocumentMode(e.document,be.DOCUMENT_MODE.QUIRKS),e.insertionMode="BEFORE_HTML_MODE",e._processToken(t);}function bt(e,t){e._insertFakeRootElement(),e.insertionMode="BEFORE_HEAD_MODE",e._processToken(t);}function Yt(e,t){e._insertFakeElement(mt.HEAD),e.headElement=e.openElements.current,e.insertionMode="IN_HEAD_MODE",e._processToken(t);}function xt(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.BASE||n===mt.BASEFONT||n===mt.BGSOUND||n===mt.LINK||n===mt.META?(e._appendElement(t,pt.HTML),t.ackSelfClosing=!0):n===mt.TITLE?e._switchToTextParsing(t,Ge.MODE.RCDATA):n===mt.NOSCRIPT?e.options.scriptingEnabled?e._switchToTextParsing(t,Ge.MODE.RAWTEXT):(e._insertElement(t,pt.HTML),e.insertionMode="IN_HEAD_NO_SCRIPT_MODE"):n===mt.NOFRAMES||n===mt.STYLE?e._switchToTextParsing(t,Ge.MODE.RAWTEXT):n===mt.SCRIPT?e._switchToTextParsing(t,Ge.MODE.SCRIPT_DATA):n===mt.TEMPLATE?(e._insertTemplate(t,pt.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode="IN_TEMPLATE_MODE",e._pushTmplInsertionMode("IN_TEMPLATE_MODE")):n===mt.HEAD?e._err(ce):vt(e,t);}function yt(e,t){const n=t.tagName;n===mt.HEAD?(e.openElements.pop(),e.insertionMode="AFTER_HEAD_MODE"):n===mt.BODY||n===mt.BR||n===mt.HTML?vt(e,t):n===mt.TEMPLATE&&e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagName!==mt.TEMPLATE&&e._err(ae),e.openElements.popUntilTagNamePopped(mt.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e._popTmplInsertionMode(),e._resetInsertionMode()):e._err(Ee);}function vt(e,t){e.openElements.pop(),e.insertionMode="AFTER_HEAD_MODE",e._processToken(t);}function wt(e,t){const n=t.type===Ge.EOF_TOKEN?Ae:_e;e._err(n),e.openElements.pop(),e.insertionMode="IN_HEAD_MODE",e._processToken(t);}function Qt(e,t){e._insertFakeElement(mt.BODY),e.insertionMode="IN_BODY_MODE",e._processToken(t);}function Xt(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t);}function Wt(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1;}function Vt(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML);}function jt(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML),e.skipNextNewLine=!0,e.framesetOk=!1;}function zt(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}function qt(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1;}function Jt(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,pt.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}function Zt(e,t){e._appendElement(t,pt.HTML),t.ackSelfClosing=!0;}function $t(e,t){e._switchToTextParsing(t,Ge.MODE.RAWTEXT);}function en(e,t){e.openElements.currentTagName===mt.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML);}function tn(e,t){e.openElements.hasInScope(mt.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,pt.HTML);}function nn(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML);}function sn(e,t){const n=t.tagName;switch(n.length){case 1:n===mt.I||n===mt.S||n===mt.B||n===mt.U?zt(e,t):n===mt.P?Vt(e,t):n===mt.A?function(e,t){const n=e.activeFormattingElements.getElementEntryInScopeWithTagName(mt.A);n&&(Pt(e,t),e.openElements.remove(n.element),e.activeFormattingElements.removeEntry(n)),e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t):nn(e,t);break;case 2:n===mt.DL||n===mt.OL||n===mt.UL?Vt(e,t):n===mt.H1||n===mt.H2||n===mt.H3||n===mt.H4||n===mt.H5||n===mt.H6?function(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement();const n=e.openElements.currentTagName;n!==mt.H1&&n!==mt.H2&&n!==mt.H3&&n!==mt.H4&&n!==mt.H5&&n!==mt.H6||e.openElements.pop(),e._insertElement(t,pt.HTML);}(e,t):n===mt.LI||n===mt.DD||n===mt.DT?function(e,t){e.framesetOk=!1;const n=t.tagName;for(let t=e.openElements.stackTop;t>=0;t--){const s=e.openElements.items[t],r=e.treeAdapter.getTagName(s);let i=null;if(n===mt.LI&&r===mt.LI?i=mt.LI:n!==mt.DD&&n!==mt.DT||r!==mt.DD&&r!==mt.DT||(i=r),i){e.openElements.generateImpliedEndTagsWithExclusion(i),e.openElements.popUntilTagNamePopped(i);break}if(r!==mt.ADDRESS&&r!==mt.DIV&&r!==mt.P&&e._isSpecialElement(s))break}e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML);}(e,t):n===mt.EM||n===mt.TT?zt(e,t):n===mt.BR?Jt(e,t):n===mt.HR?function(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._appendElement(t,pt.HTML),e.framesetOk=!1,e.ackSelfClosing=!0;}(e,t):n===mt.RB?tn(e,t):n===mt.RT||n===mt.RP?function(e,t){e.openElements.hasInScope(mt.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(mt.RTC),e._insertElement(t,pt.HTML);}(e,t):n!==mt.TH&&n!==mt.TD&&n!==mt.TR&&nn(e,t);break;case 3:n===mt.DIV||n===mt.DIR||n===mt.NAV?Vt(e,t):n===mt.PRE?jt(e,t):n===mt.BIG?zt(e,t):n===mt.IMG||n===mt.WBR?Jt(e,t):n===mt.XMP?function(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,Ge.MODE.RAWTEXT);}(e,t):n===mt.SVG?function(e,t){e._reconstructActiveFormattingElements(),lt.adjustTokenSVGAttrs(t),lt.adjustTokenXMLAttrs(t),t.selfClosing?e._appendElement(t,pt.SVG):e._insertElement(t,pt.SVG),t.ackSelfClosing=!0;}(e,t):n===mt.RTC?tn(e,t):n!==mt.COL&&nn(e,t);break;case 4:n===mt.HTML?function(e,t){0===e.openElements.tmplCount&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs);}(e,t):n===mt.BASE||n===mt.LINK||n===mt.META?xt(e,t):n===mt.BODY?function(e,t){const n=e.openElements.tryPeekProperlyNestedBodyElement();n&&0===e.openElements.tmplCount&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(n,t.attrs));}(e,t):n===mt.MAIN||n===mt.MENU?Vt(e,t):n===mt.FORM?function(e,t){const n=e.openElements.tmplCount>0;e.formElement&&!n||(e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML),n||(e.formElement=e.openElements.current));}(e,t):n===mt.CODE||n===mt.FONT?zt(e,t):n===mt.NOBR?function(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(mt.NOBR)&&(Pt(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,pt.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t):n===mt.AREA?Jt(e,t):n===mt.MATH?function(e,t){e._reconstructActiveFormattingElements(),lt.adjustTokenMathMLAttrs(t),lt.adjustTokenXMLAttrs(t),t.selfClosing?e._appendElement(t,pt.MATHML):e._insertElement(t,pt.MATHML),t.ackSelfClosing=!0;}(e,t):n===mt.MENU?function(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML);}(e,t):n!==mt.HEAD&&nn(e,t);break;case 5:n===mt.STYLE||n===mt.TITLE?xt(e,t):n===mt.ASIDE?Vt(e,t):n===mt.SMALL?zt(e,t):n===mt.TABLE?function(e,t){e.treeAdapter.getDocumentMode(e.document)!==be.DOCUMENT_MODE.QUIRKS&&e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML),e.framesetOk=!1,e.insertionMode=Ot;}(e,t):n===mt.EMBED?Jt(e,t):n===mt.INPUT?function(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,pt.HTML);const n=Ge.getTokenAttr(t,Nt.TYPE);n&&"hidden"===n.toLowerCase()||(e.framesetOk=!1),t.ackSelfClosing=!0;}(e,t):n===mt.PARAM||n===mt.TRACK?Zt(e,t):n===mt.IMAGE?function(e,t){t.tagName=mt.IMG,Jt(e,t);}(e,t):n!==mt.FRAME&&n!==mt.TBODY&&n!==mt.TFOOT&&n!==mt.THEAD&&nn(e,t);break;case 6:n===mt.SCRIPT?xt(e,t):n===mt.CENTER||n===mt.FIGURE||n===mt.FOOTER||n===mt.HEADER||n===mt.HGROUP||n===mt.DIALOG?Vt(e,t):n===mt.BUTTON?function(e,t){e.openElements.hasInScope(mt.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(mt.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML),e.framesetOk=!1;}(e,t):n===mt.STRIKE||n===mt.STRONG?zt(e,t):n===mt.APPLET||n===mt.OBJECT?qt(e,t):n===mt.KEYGEN?Jt(e,t):n===mt.SOURCE?Zt(e,t):n===mt.IFRAME?function(e,t){e.framesetOk=!1,e._switchToTextParsing(t,Ge.MODE.RAWTEXT);}(e,t):n===mt.SELECT?function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,pt.HTML),e.framesetOk=!1,e.insertionMode===Ot||"IN_CAPTION_MODE"===e.insertionMode||"IN_TABLE_BODY_MODE"===e.insertionMode||"IN_ROW_MODE"===e.insertionMode||"IN_CELL_MODE"===e.insertionMode?e.insertionMode="IN_SELECT_IN_TABLE_MODE":e.insertionMode="IN_SELECT_MODE";}(e,t):n===mt.OPTION?en(e,t):nn(e,t);break;case 7:n===mt.BGSOUND?xt(e,t):n===mt.DETAILS||n===mt.ADDRESS||n===mt.ARTICLE||n===mt.SECTION||n===mt.SUMMARY?Vt(e,t):n===mt.LISTING?jt(e,t):n===mt.MARQUEE?qt(e,t):n===mt.NOEMBED?$t(e,t):n!==mt.CAPTION&&nn(e,t);break;case 8:n===mt.BASEFONT?xt(e,t):n===mt.FRAMESET?function(e,t){const n=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&n&&(e.treeAdapter.detachNode(n),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,pt.HTML),e.insertionMode="IN_FRAMESET_MODE");}(e,t):n===mt.FIELDSET?Vt(e,t):n===mt.TEXTAREA?function(e,t){e._insertElement(t,pt.HTML),e.skipNextNewLine=!0,e.tokenizer.state=Ge.MODE.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode="TEXT_MODE";}(e,t):n===mt.TEMPLATE?xt(e,t):n===mt.NOSCRIPT?e.options.scriptingEnabled?$t(e,t):nn(e,t):n===mt.OPTGROUP?en(e,t):n!==mt.COLGROUP&&nn(e,t);break;case 9:n===mt.PLAINTEXT?function(e,t){e.openElements.hasInButtonScope(mt.P)&&e._closePElement(),e._insertElement(t,pt.HTML),e.tokenizer.state=Ge.MODE.PLAINTEXT;}(e,t):nn(e,t);break;case 10:n===mt.BLOCKQUOTE||n===mt.FIGCAPTION?Vt(e,t):nn(e,t);break;default:nn(e,t);}}function rn(e,t){const n=t.tagName;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n));}function Tn(e,t){const n=t.tagName;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker());}function on(e,t){const n=t.tagName;for(let t=e.openElements.stackTop;t>0;t--){const s=e.openElements.items[t];if(e.treeAdapter.getTagName(s)===n){e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilElementPopped(s);break}if(e._isSpecialElement(s))break}}function En(e,t){const n=t.tagName;switch(n.length){case 1:n===mt.A||n===mt.B||n===mt.I||n===mt.S||n===mt.U?Pt(e,t):n===mt.P?function(e){e.openElements.hasInButtonScope(mt.P)||e._insertFakeElement(mt.P),e._closePElement();}(e):on(e,t);break;case 2:n===mt.DL||n===mt.UL||n===mt.OL?rn(e,t):n===mt.LI?function(e){e.openElements.hasInListItemScope(mt.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(mt.LI),e.openElements.popUntilTagNamePopped(mt.LI));}(e):n===mt.DD||n===mt.DT?function(e,t){const n=t.tagName;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilTagNamePopped(n));}(e,t):n===mt.H1||n===mt.H2||n===mt.H3||n===mt.H4||n===mt.H5||n===mt.H6?function(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped());}(e):n===mt.BR?function(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(mt.BR),e.openElements.pop(),e.framesetOk=!1;}(e):n===mt.EM||n===mt.TT?Pt(e,t):on(e,t);break;case 3:n===mt.BIG?Pt(e,t):n===mt.DIR||n===mt.DIV||n===mt.NAV||n===mt.PRE?rn(e,t):on(e,t);break;case 4:n===mt.BODY?function(e){e.openElements.hasInScope(mt.BODY)&&(e.insertionMode="AFTER_BODY_MODE");}(e):n===mt.HTML?function(e,t){e.openElements.hasInScope(mt.BODY)&&(e.insertionMode="AFTER_BODY_MODE",e._processToken(t));}(e,t):n===mt.FORM?function(e){const t=e.openElements.tmplCount>0,n=e.formElement;t||(e.formElement=null),(n||t)&&e.openElements.hasInScope(mt.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(mt.FORM):e.openElements.remove(n));}(e):n===mt.CODE||n===mt.FONT||n===mt.NOBR?Pt(e,t):n===mt.MAIN||n===mt.MENU?rn(e,t):on(e,t);break;case 5:n===mt.ASIDE?rn(e,t):n===mt.SMALL?Pt(e,t):on(e,t);break;case 6:n===mt.CENTER||n===mt.FIGURE||n===mt.FOOTER||n===mt.HEADER||n===mt.HGROUP||n===mt.DIALOG?rn(e,t):n===mt.APPLET||n===mt.OBJECT?Tn(e,t):n===mt.STRIKE||n===mt.STRONG?Pt(e,t):on(e,t);break;case 7:n===mt.ADDRESS||n===mt.ARTICLE||n===mt.DETAILS||n===mt.SECTION||n===mt.SUMMARY||n===mt.LISTING?rn(e,t):n===mt.MARQUEE?Tn(e,t):on(e,t);break;case 8:n===mt.FIELDSET?rn(e,t):n===mt.TEMPLATE?yt(e,t):on(e,t);break;case 10:n===mt.BLOCKQUOTE||n===mt.FIGCAPTION?rn(e,t):on(e,t);break;default:on(e,t);}}function an(e,t){e.tmplInsertionModeStackTop>-1?un(e,t):e.stopped=!0;}function _n(e,t){const n=e.openElements.currentTagName;n===mt.TABLE||n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD||n===mt.TR?(e.pendingCharacterTokens=[],e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode="IN_TABLE_TEXT_MODE",e._processToken(t)):cn(e,t);}function An(e,t){const n=t.tagName;switch(n.length){case 2:n===mt.TD||n===mt.TH||n===mt.TR?function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(mt.TBODY),e.insertionMode="IN_TABLE_BODY_MODE",e._processToken(t);}(e,t):cn(e,t);break;case 3:n===mt.COL?function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(mt.COLGROUP),e.insertionMode="IN_COLUMN_GROUP_MODE",e._processToken(t);}(e,t):cn(e,t);break;case 4:n===mt.FORM?function(e,t){e.formElement||0!==e.openElements.tmplCount||(e._insertElement(t,pt.HTML),e.formElement=e.openElements.current,e.openElements.pop());}(e,t):cn(e,t);break;case 5:n===mt.TABLE?function(e,t){e.openElements.hasInTableScope(mt.TABLE)&&(e.openElements.popUntilTagNamePopped(mt.TABLE),e._resetInsertionMode(),e._processToken(t));}(e,t):n===mt.STYLE?xt(e,t):n===mt.TBODY||n===mt.TFOOT||n===mt.THEAD?function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,pt.HTML),e.insertionMode="IN_TABLE_BODY_MODE";}(e,t):n===mt.INPUT?function(e,t){const n=Ge.getTokenAttr(t,Nt.TYPE);n&&"hidden"===n.toLowerCase()?e._appendElement(t,pt.HTML):cn(e,t),t.ackSelfClosing=!0;}(e,t):cn(e,t);break;case 6:n===mt.SCRIPT?xt(e,t):cn(e,t);break;case 7:n===mt.CAPTION?function(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,pt.HTML),e.insertionMode="IN_CAPTION_MODE";}(e,t):cn(e,t);break;case 8:n===mt.COLGROUP?function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,pt.HTML),e.insertionMode="IN_COLUMN_GROUP_MODE";}(e,t):n===mt.TEMPLATE?xt(e,t):cn(e,t);break;default:cn(e,t);}}function hn(e,t){const n=t.tagName;n===mt.TABLE?e.openElements.hasInTableScope(mt.TABLE)&&(e.openElements.popUntilTagNamePopped(mt.TABLE),e._resetInsertionMode()):n===mt.TEMPLATE?yt(e,t):n!==mt.BODY&&n!==mt.CAPTION&&n!==mt.COL&&n!==mt.COLGROUP&&n!==mt.HTML&&n!==mt.TBODY&&n!==mt.TD&&n!==mt.TFOOT&&n!==mt.TH&&n!==mt.THEAD&&n!==mt.TR&&cn(e,t);}function cn(e,t){const n=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,e._processTokenInBodyMode(t),e.fosterParentingEnabled=n;}function ln(e,t){let n=0;if(e.hasNonWhitespacePendingCharacterToken)for(;n<e.pendingCharacterTokens.length;n++)cn(e,e.pendingCharacterTokens[n]);else for(;n<e.pendingCharacterTokens.length;n++)e._insertCharacters(e.pendingCharacterTokens[n]);e.insertionMode=e.originalInsertionMode,e._processToken(t);}function mn(e,t){e.openElements.currentTagName===mt.COLGROUP&&(e.openElements.pop(),e.insertionMode=Ot,e._processToken(t));}function pn(e,t){const n=t.tagName;n===mt.HTML?sn(e,t):n===mt.OPTION?(e.openElements.currentTagName===mt.OPTION&&e.openElements.pop(),e._insertElement(t,pt.HTML)):n===mt.OPTGROUP?(e.openElements.currentTagName===mt.OPTION&&e.openElements.pop(),e.openElements.currentTagName===mt.OPTGROUP&&e.openElements.pop(),e._insertElement(t,pt.HTML)):n===mt.INPUT||n===mt.KEYGEN||n===mt.TEXTAREA||n===mt.SELECT?e.openElements.hasInSelectScope(mt.SELECT)&&(e.openElements.popUntilTagNamePopped(mt.SELECT),e._resetInsertionMode(),n!==mt.SELECT&&e._processToken(t)):n!==mt.SCRIPT&&n!==mt.TEMPLATE||xt(e,t);}function Nn(e,t){const n=t.tagName;if(n===mt.OPTGROUP){const t=e.openElements.items[e.openElements.stackTop-1],n=t&&e.treeAdapter.getTagName(t);e.openElements.currentTagName===mt.OPTION&&n===mt.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagName===mt.OPTGROUP&&e.openElements.pop();}else n===mt.OPTION?e.openElements.currentTagName===mt.OPTION&&e.openElements.pop():n===mt.SELECT&&e.openElements.hasInSelectScope(mt.SELECT)?(e.openElements.popUntilTagNamePopped(mt.SELECT),e._resetInsertionMode()):n===mt.TEMPLATE&&yt(e,t);}function un(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(mt.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e._popTmplInsertionMode(),e._resetInsertionMode(),e._processToken(t)):e.stopped=!0;}function On(e,t){e.insertionMode="IN_BODY_MODE",e._processToken(t);}function Sn(e,t){e.insertionMode="IN_BODY_MODE",e._processToken(t);}be.TAG_NAMES,be.NAMESPACES;return e.parse=function(e,t){return new Rt(t).parse(e)},e.parseFragment=function(e,t,n){return "string"==typeof e&&(n=t,t=e,e=null),new Rt(n).parseFragment(t,e)},e}({});function parse(e,t){return parse5.parse(e,t)}function parseFragment(e,t){return parse5.parseFragment(e,t)}

const docParser = new WeakMap();
function parseDocumentUtil(ownerDocument, html) {
  const doc = parse(html.trim(), getParser(ownerDocument));
  doc.documentElement = doc.firstElementChild;
  doc.head = doc.documentElement.firstElementChild;
  doc.body = doc.head.nextElementSibling;
  return doc;
}
function parseFragmentUtil(ownerDocument, html) {
  if (typeof html === 'string') {
    html = html.trim();
  }
  else {
    html = '';
  }
  const frag = parseFragment(html, getParser(ownerDocument));
  return frag;
}
function getParser(ownerDocument) {
  let parseOptions = docParser.get(ownerDocument);
  if (parseOptions != null) {
    return parseOptions;
  }
  const treeAdapter = {
    createDocument() {
      const doc = ownerDocument.createElement("#document" /* DOCUMENT_NODE */);
      doc['x-mode'] = 'no-quirks';
      return doc;
    },
    createDocumentFragment() {
      return ownerDocument.createDocumentFragment();
    },
    createElement(tagName, namespaceURI, attrs) {
      const elm = ownerDocument.createElementNS(namespaceURI, tagName);
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.namespace == null || attr.namespace === 'http://www.w3.org/1999/xhtml') {
          elm.setAttribute(attr.name, attr.value);
        }
        else {
          elm.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
      return elm;
    },
    createCommentNode(data) {
      return ownerDocument.createComment(data);
    },
    appendChild(parentNode, newNode) {
      parentNode.appendChild(newNode);
    },
    insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
    },
    setTemplateContent(templateElement, contentElement) {
      templateElement.content = contentElement;
    },
    getTemplateContent(templateElement) {
      return templateElement.content;
    },
    setDocumentType(doc, name, publicId, systemId) {
      let doctypeNode = doc.childNodes.find(n => n.nodeType === 10 /* DOCUMENT_TYPE_NODE */);
      if (doctypeNode == null) {
        doctypeNode = ownerDocument.createDocumentTypeNode();
        doc.insertBefore(doctypeNode, doc.firstChild);
      }
      doctypeNode.nodeValue = '!DOCTYPE';
      doctypeNode['x-name'] = name;
      doctypeNode['x-publicId'] = publicId;
      doctypeNode['x-systemId'] = systemId;
    },
    setDocumentMode(doc, mode) {
      doc['x-mode'] = mode;
    },
    getDocumentMode(doc) {
      return doc['x-mode'];
    },
    detachNode(node) {
      node.remove();
    },
    insertText(parentNode, text) {
      const lastChild = parentNode.lastChild;
      if (lastChild != null && lastChild.nodeType === 3 /* TEXT_NODE */) {
        lastChild.nodeValue += text;
      }
      else {
        parentNode.appendChild(ownerDocument.createTextNode(text));
      }
    },
    insertTextBefore(parentNode, text, referenceNode) {
      const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
      if (prevNode != null && prevNode.nodeType === 3 /* TEXT_NODE */) {
        prevNode.nodeValue += text;
      }
      else {
        parentNode.insertBefore(ownerDocument.createTextNode(text), referenceNode);
      }
    },
    adoptAttributes(recipient, attrs) {
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (recipient.hasAttributeNS(attr.namespace, attr.name) === false) {
          recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
    },
    getFirstChild(node) {
      return node.childNodes[0];
    },
    getChildNodes(node) {
      return node.childNodes;
    },
    getParentNode(node) {
      return node.parentNode;
    },
    getAttrList(element) {
      const attrs = element.attributes.__items.map(attr => {
        return {
          name: attr.name,
          value: attr.value,
          namespace: attr.namespaceURI,
          prefix: null,
        };
      });
      return attrs;
    },
    getTagName(element) {
      if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        return element.nodeName.toLowerCase();
      }
      else {
        return element.nodeName;
      }
    },
    getNamespaceURI(element) {
      return element.namespaceURI;
    },
    getTextNodeContent(textNode) {
      return textNode.nodeValue;
    },
    getCommentNodeContent(commentNode) {
      return commentNode.nodeValue;
    },
    getDocumentTypeNodeName(doctypeNode) {
      return doctypeNode['x-name'];
    },
    getDocumentTypeNodePublicId(doctypeNode) {
      return doctypeNode['x-publicId'];
    },
    getDocumentTypeNodeSystemId(doctypeNode) {
      return doctypeNode['x-systemId'];
    },
    isTextNode(node) {
      return node.nodeType === 3 /* TEXT_NODE */;
    },
    isCommentNode(node) {
      return node.nodeType === 8 /* COMMENT_NODE */;
    },
    isDocumentTypeNode(node) {
      return node.nodeType === 10 /* DOCUMENT_TYPE_NODE */;
    },
    isElementNode(node) {
      return node.nodeType === 1 /* ELEMENT_NODE */;
    },
  };
  parseOptions = {
    treeAdapter: treeAdapter,
  };
  docParser.set(ownerDocument, parseOptions);
  return parseOptions;
}

class MockNode {
  constructor(ownerDocument, nodeType, nodeName, nodeValue) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
    this.parentNode = null;
    this.childNodes = [];
  }
  appendChild(newNode) {
    if (newNode.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
      const nodes = newNode.childNodes.slice();
      for (const child of nodes) {
        this.appendChild(child);
      }
    }
    else {
      newNode.remove();
      newNode.parentNode = this;
      this.childNodes.push(newNode);
      connectNode(this.ownerDocument, newNode);
    }
    return newNode;
  }
  append(...items) {
    items.forEach(item => {
      const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
      this.appendChild(isNode ? item : this.ownerDocument.createTextNode(String(item)));
    });
  }
  prepend(...items) {
    const firstChild = this.firstChild;
    items.forEach(item => {
      const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
      this.insertBefore(isNode ? item : this.ownerDocument.createTextNode(String(item)), firstChild);
    });
  }
  cloneNode(deep) {
    throw new Error(`invalid node type to clone: ${this.nodeType}, deep: ${deep}`);
  }
  compareDocumentPosition(_other) {
    // unimplemented
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    return -1;
  }
  get firstChild() {
    return this.childNodes[0] || null;
  }
  insertBefore(newNode, referenceNode) {
    if (newNode.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
      for (let i = 0, ii = newNode.childNodes.length; i < ii; i++) {
        insertBefore(this, newNode.childNodes[i], referenceNode);
      }
    }
    else {
      insertBefore(this, newNode, referenceNode);
    }
    return newNode;
  }
  get isConnected() {
    let node = this;
    while (node != null) {
      if (node.nodeType === 9 /* DOCUMENT_NODE */) {
        return true;
      }
      node = node.parentNode;
      if (node != null && node.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
        node = node.host;
      }
    }
    return false;
  }
  isSameNode(node) {
    return this === node;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }
  get nextSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) + 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }
  get parentElement() {
    return this.parentNode || null;
  }
  set parentElement(value) {
    this.parentNode = value;
  }
  get previousSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) - 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }
  contains(otherNode) {
    return this.childNodes.includes(otherNode);
  }
  removeChild(childNode) {
    const index = this.childNodes.indexOf(childNode);
    if (index > -1) {
      this.childNodes.splice(index, 1);
      if (this.nodeType === 1 /* ELEMENT_NODE */) {
        const wasConnected = this.isConnected;
        childNode.parentNode = null;
        if (wasConnected === true) {
          disconnectNode(childNode);
        }
      }
      else {
        childNode.parentNode = null;
      }
    }
    else {
      throw new Error(`node not found within childNodes during removeChild`);
    }
    return childNode;
  }
  remove() {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
  replaceChild(newChild, oldChild) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild);
      oldChild.remove();
      return newChild;
    }
    return null;
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(value) {
    this.nodeValue = String(value);
  }
}
MockNode.ELEMENT_NODE = 1;
MockNode.TEXT_NODE = 3;
MockNode.PROCESSING_INSTRUCTION_NODE = 7;
MockNode.COMMENT_NODE = 8;
MockNode.DOCUMENT_NODE = 9;
MockNode.DOCUMENT_TYPE_NODE = 10;
MockNode.DOCUMENT_FRAGMENT_NODE = 11;
class MockNodeList {
  constructor(ownerDocument, childNodes, length) {
    this.ownerDocument = ownerDocument;
    this.childNodes = childNodes;
    this.length = length;
  }
}
class MockElement extends MockNode {
  constructor(ownerDocument, nodeName) {
    super(ownerDocument, 1 /* ELEMENT_NODE */, typeof nodeName === 'string' ? nodeName : null, null);
    this.namespaceURI = null;
  }
  addEventListener(type, handler) {
    addEventListener(this, type, handler);
  }
  attachShadow(_opts) {
    const shadowRoot = this.ownerDocument.createDocumentFragment();
    this.shadowRoot = shadowRoot;
    return shadowRoot;
  }
  get shadowRoot() {
    return this.__shadowRoot || null;
  }
  set shadowRoot(shadowRoot) {
    if (shadowRoot != null) {
      shadowRoot.host = this;
      this.__shadowRoot = shadowRoot;
    }
    else {
      delete this.__shadowRoot;
    }
  }
  get attributes() {
    if (this.__attributeMap == null) {
      this.__attributeMap = createAttributeProxy(false);
    }
    return this.__attributeMap;
  }
  set attributes(attrs) {
    this.__attributeMap = attrs;
  }
  get children() {
    return this.childNodes.filter(n => n.nodeType === 1 /* ELEMENT_NODE */);
  }
  get childElementCount() {
    return this.childNodes.filter(n => n.nodeType === 1 /* ELEMENT_NODE */).length;
  }
  get className() {
    return this.getAttributeNS(null, 'class') || '';
  }
  set className(value) {
    this.setAttributeNS(null, 'class', value);
  }
  get classList() {
    return new MockClassList(this);
  }
  click() {
    dispatchEvent(this, new MockEvent('click', { bubbles: true, cancelable: true, composed: true }));
  }
  cloneNode(_deep) {
    // implemented on MockElement.prototype from within element.ts
    return null;
  }
  closest(selector) {
    let elm = this;
    while (elm != null) {
      if (elm.matches(selector)) {
        return elm;
      }
      elm = elm.parentNode;
    }
    return null;
  }
  get dataset() {
    return dataset(this);
  }
  get dir() {
    return this.getAttributeNS(null, 'dir') || '';
  }
  set dir(value) {
    this.setAttributeNS(null, 'dir', value);
  }
  dispatchEvent(ev) {
    return dispatchEvent(this, ev);
  }
  get firstElementChild() {
    return this.children[0] || null;
  }
  getAttribute(attrName) {
    if (attrName === 'style') {
      if (this.__style != null && this.__style.length > 0) {
        return this.style.cssText;
      }
      return null;
    }
    const attr = this.attributes.getNamedItem(attrName);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }
  getAttributeNS(namespaceURI, attrName) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }
  getBoundingClientRect() {
    return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 };
  }
  getRootNode(opts) {
    const isComposed = opts != null && opts.composed === true;
    let node = this;
    while (node.parentNode != null) {
      node = node.parentNode;
      if (isComposed === true && node.parentNode == null && node.host != null) {
        node = node.host;
      }
    }
    return node;
  }
  hasChildNodes() {
    return this.childNodes.length > 0;
  }
  get id() {
    return this.getAttributeNS(null, 'id') || '';
  }
  set id(value) {
    this.setAttributeNS(null, 'id', value);
  }
  get innerHTML() {
    if (this.childNodes.length === 0) {
      return '';
    }
    return serializeNodeToHtml(this, {
      newLines: false,
      indentSpaces: 0,
    });
  }
  set innerHTML(html) {
    if (NON_ESCAPABLE_CONTENT.has(this.nodeName) === true) {
      setTextContent(this, html);
    }
    else {
      for (let i = this.childNodes.length - 1; i >= 0; i--) {
        this.removeChild(this.childNodes[i]);
      }
      if (typeof html === 'string') {
        const frag = parseFragmentUtil(this.ownerDocument, html);
        while (frag.childNodes.length > 0) {
          this.appendChild(frag.childNodes[0]);
        }
      }
    }
  }
  get innerText() {
    const text = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set innerText(value) {
    setTextContent(this, value);
  }
  insertAdjacentElement(position, elm) {
    if (position === 'beforebegin') {
      insertBefore(this.parentNode, elm, this);
    }
    else if (position === 'afterbegin') {
      this.prepend(elm);
    }
    else if (position === 'beforeend') {
      this.appendChild(elm);
    }
    else if (position === 'afterend') {
      insertBefore(this.parentNode, elm, this.nextSibling);
    }
    return elm;
  }
  insertAdjacentHTML(position, html) {
    const frag = parseFragmentUtil(this.ownerDocument, html);
    if (position === 'beforebegin') {
      while (frag.childNodes.length > 0) {
        insertBefore(this.parentNode, frag.childNodes[0], this);
      }
    }
    else if (position === 'afterbegin') {
      while (frag.childNodes.length > 0) {
        this.prepend(frag.childNodes[frag.childNodes.length - 1]);
      }
    }
    else if (position === 'beforeend') {
      while (frag.childNodes.length > 0) {
        this.appendChild(frag.childNodes[0]);
      }
    }
    else if (position === 'afterend') {
      while (frag.childNodes.length > 0) {
        insertBefore(this.parentNode, frag.childNodes[frag.childNodes.length - 1], this.nextSibling);
      }
    }
  }
  insertAdjacentText(position, text) {
    const elm = this.ownerDocument.createTextNode(text);
    if (position === 'beforebegin') {
      insertBefore(this.parentNode, elm, this);
    }
    else if (position === 'afterbegin') {
      this.prepend(elm);
    }
    else if (position === 'beforeend') {
      this.appendChild(elm);
    }
    else if (position === 'afterend') {
      insertBefore(this.parentNode, elm, this.nextSibling);
    }
  }
  hasAttribute(attrName) {
    if (attrName === 'style') {
      return this.__style != null && this.__style.length > 0;
    }
    return this.getAttribute(attrName) !== null;
  }
  hasAttributeNS(namespaceURI, name) {
    return this.getAttributeNS(namespaceURI, name) !== null;
  }
  get hidden() {
    return this.hasAttributeNS(null, 'hidden');
  }
  set hidden(isHidden) {
    if (isHidden === true) {
      this.setAttributeNS(null, 'hidden', '');
    }
    else {
      this.removeAttributeNS(null, 'hidden');
    }
  }
  get lang() {
    return this.getAttributeNS(null, 'lang') || '';
  }
  set lang(value) {
    this.setAttributeNS(null, 'lang', value);
  }
  get lastElementChild() {
    const children = this.children;
    return children[children.length - 1] || null;
  }
  matches(selector) {
    return matches(selector, this);
  }
  get nextElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null &&
      (parentElement.nodeType === 1 /* ELEMENT_NODE */ || parentElement.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */ || parentElement.nodeType === 9 /* DOCUMENT_NODE */)) {
      const children = parentElement.children;
      const index = children.indexOf(this) + 1;
      return parentElement.children[index] || null;
    }
    return null;
  }
  get outerHTML() {
    return serializeNodeToHtml(this, {
      newLines: false,
      outerHtml: true,
      indentSpaces: 0,
    });
  }
  get previousElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null &&
      (parentElement.nodeType === 1 /* ELEMENT_NODE */ || parentElement.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */ || parentElement.nodeType === 9 /* DOCUMENT_NODE */)) {
      const children = parentElement.children;
      const index = children.indexOf(this) - 1;
      return parentElement.children[index] || null;
    }
    return null;
  }
  getElementsByClassName(classNames) {
    const classes = classNames
      .trim()
      .split(' ')
      .filter(c => c.length > 0);
    const results = [];
    getElementsByClassName(this, classes, results);
    return results;
  }
  getElementsByTagName(tagName) {
    const results = [];
    getElementsByTagName(this, tagName.toLowerCase(), results);
    return results;
  }
  querySelector(selector) {
    return selectOne(selector, this);
  }
  querySelectorAll(selector) {
    return selectAll(selector, this);
  }
  removeAttribute(attrName) {
    if (attrName === 'style') {
      delete this.__style;
    }
    else {
      const attr = this.attributes.getNamedItem(attrName);
      if (attr != null) {
        this.attributes.removeNamedItemNS(attr);
        if (checkAttributeChanged(this) === true) {
          attributeChanged(this, attrName, attr.value, null);
        }
      }
    }
  }
  removeAttributeNS(namespaceURI, attrName) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      this.attributes.removeNamedItemNS(attr);
      if (checkAttributeChanged(this) === true) {
        attributeChanged(this, attrName, attr.value, null);
      }
    }
  }
  removeEventListener(type, handler) {
    removeEventListener(this, type, handler);
  }
  setAttribute(attrName, value) {
    if (attrName === 'style') {
      this.style = value;
    }
    else {
      const attributes = this.attributes;
      let attr = attributes.getNamedItem(attrName);
      const checkAttrChanged = checkAttributeChanged(this);
      if (attr != null) {
        if (checkAttrChanged === true) {
          const oldValue = attr.value;
          attr.value = value;
          if (oldValue !== attr.value) {
            attributeChanged(this, attr.name, oldValue, attr.value);
          }
        }
        else {
          attr.value = value;
        }
      }
      else {
        if (attributes.caseInsensitive) {
          attrName = attrName.toLowerCase();
        }
        attr = new MockAttr(attrName, value);
        attributes.__items.push(attr);
        if (checkAttrChanged === true) {
          attributeChanged(this, attrName, null, attr.value);
        }
      }
    }
  }
  setAttributeNS(namespaceURI, attrName, value) {
    const attributes = this.attributes;
    let attr = attributes.getNamedItemNS(namespaceURI, attrName);
    const checkAttrChanged = checkAttributeChanged(this);
    if (attr != null) {
      if (checkAttrChanged === true) {
        const oldValue = attr.value;
        attr.value = value;
        if (oldValue !== attr.value) {
          attributeChanged(this, attr.name, oldValue, attr.value);
        }
      }
      else {
        attr.value = value;
      }
    }
    else {
      attr = new MockAttr(attrName, value, namespaceURI);
      attributes.__items.push(attr);
      if (checkAttrChanged === true) {
        attributeChanged(this, attrName, null, attr.value);
      }
    }
  }
  get style() {
    if (this.__style == null) {
      this.__style = createCSSStyleDeclaration();
    }
    return this.__style;
  }
  set style(val) {
    if (typeof val === 'string') {
      if (this.__style == null) {
        this.__style = createCSSStyleDeclaration();
      }
      this.__style.cssText = val;
    }
    else {
      this.__style = val;
    }
  }
  get tabIndex() {
    return parseInt(this.getAttributeNS(null, 'tabindex') || '-1', 10);
  }
  set tabIndex(value) {
    this.setAttributeNS(null, 'tabindex', value);
  }
  get tagName() {
    return this.nodeName;
  }
  set tagName(value) {
    this.nodeName = value;
  }
  get textContent() {
    const text = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set textContent(value) {
    setTextContent(this, value);
  }
  get title() {
    return this.getAttributeNS(null, 'title') || '';
  }
  set title(value) {
    this.setAttributeNS(null, 'title', value);
  }
  onanimationstart() {
    /**/
  }
  onanimationend() {
    /**/
  }
  onanimationiteration() {
    /**/
  }
  onabort() {
    /**/
  }
  onauxclick() {
    /**/
  }
  onbeforecopy() {
    /**/
  }
  onbeforecut() {
    /**/
  }
  onbeforepaste() {
    /**/
  }
  onblur() {
    /**/
  }
  oncancel() {
    /**/
  }
  oncanplay() {
    /**/
  }
  oncanplaythrough() {
    /**/
  }
  onchange() {
    /**/
  }
  onclick() {
    /**/
  }
  onclose() {
    /**/
  }
  oncontextmenu() {
    /**/
  }
  oncopy() {
    /**/
  }
  oncuechange() {
    /**/
  }
  oncut() {
    /**/
  }
  ondblclick() {
    /**/
  }
  ondrag() {
    /**/
  }
  ondragend() {
    /**/
  }
  ondragenter() {
    /**/
  }
  ondragleave() {
    /**/
  }
  ondragover() {
    /**/
  }
  ondragstart() {
    /**/
  }
  ondrop() {
    /**/
  }
  ondurationchange() {
    /**/
  }
  onemptied() {
    /**/
  }
  onended() {
    /**/
  }
  onerror() {
    /**/
  }
  onfocus() {
    /**/
  }
  onformdata() {
    /**/
  }
  onfullscreenchange() {
    /**/
  }
  onfullscreenerror() {
    /**/
  }
  ongotpointercapture() {
    /**/
  }
  oninput() {
    /**/
  }
  oninvalid() {
    /**/
  }
  onkeydown() {
    /**/
  }
  onkeypress() {
    /**/
  }
  onkeyup() {
    /**/
  }
  onload() {
    /**/
  }
  onloadeddata() {
    /**/
  }
  onloadedmetadata() {
    /**/
  }
  onloadstart() {
    /**/
  }
  onlostpointercapture() {
    /**/
  }
  onmousedown() {
    /**/
  }
  onmouseenter() {
    /**/
  }
  onmouseleave() {
    /**/
  }
  onmousemove() {
    /**/
  }
  onmouseout() {
    /**/
  }
  onmouseover() {
    /**/
  }
  onmouseup() {
    /**/
  }
  onmousewheel() {
    /**/
  }
  onpaste() {
    /**/
  }
  onpause() {
    /**/
  }
  onplay() {
    /**/
  }
  onplaying() {
    /**/
  }
  onpointercancel() {
    /**/
  }
  onpointerdown() {
    /**/
  }
  onpointerenter() {
    /**/
  }
  onpointerleave() {
    /**/
  }
  onpointermove() {
    /**/
  }
  onpointerout() {
    /**/
  }
  onpointerover() {
    /**/
  }
  onpointerup() {
    /**/
  }
  onprogress() {
    /**/
  }
  onratechange() {
    /**/
  }
  onreset() {
    /**/
  }
  onresize() {
    /**/
  }
  onscroll() {
    /**/
  }
  onsearch() {
    /**/
  }
  onseeked() {
    /**/
  }
  onseeking() {
    /**/
  }
  onselect() {
    /**/
  }
  onselectstart() {
    /**/
  }
  onstalled() {
    /**/
  }
  onsubmit() {
    /**/
  }
  onsuspend() {
    /**/
  }
  ontimeupdate() {
    /**/
  }
  ontoggle() {
    /**/
  }
  onvolumechange() {
    /**/
  }
  onwaiting() {
    /**/
  }
  onwebkitfullscreenchange() {
    /**/
  }
  onwebkitfullscreenerror() {
    /**/
  }
  onwheel() {
    /**/
  }
  toString(opts) {
    return serializeNodeToHtml(this, opts);
  }
}
function getElementsByClassName(elm, classNames, foundElms) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    for (let j = 0, jj = classNames.length; j < jj; j++) {
      if (childElm.classList.contains(classNames[j])) {
        foundElms.push(childElm);
      }
    }
    getElementsByClassName(childElm, classNames, foundElms);
  }
}
function getElementsByTagName(elm, tagName, foundElms) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (tagName === '*' || childElm.nodeName.toLowerCase() === tagName) {
      foundElms.push(childElm);
    }
    getElementsByTagName(childElm, tagName, foundElms);
  }
}
function resetElement(elm) {
  resetEventListeners(elm);
  delete elm.__attributeMap;
  delete elm.__shadowRoot;
  delete elm.__style;
}
function insertBefore(parentNode, newNode, referenceNode) {
  if (newNode !== referenceNode) {
    newNode.remove();
    newNode.parentNode = parentNode;
    newNode.ownerDocument = parentNode.ownerDocument;
    if (referenceNode != null) {
      const index = parentNode.childNodes.indexOf(referenceNode);
      if (index > -1) {
        parentNode.childNodes.splice(index, 0, newNode);
      }
      else {
        throw new Error(`referenceNode not found in parentNode.childNodes`);
      }
    }
    else {
      parentNode.childNodes.push(newNode);
    }
    connectNode(parentNode.ownerDocument, newNode);
  }
  return newNode;
}
class MockHTMLElement extends MockElement {
  constructor(ownerDocument, nodeName) {
    super(ownerDocument, typeof nodeName === 'string' ? nodeName.toUpperCase() : null);
    this.namespaceURI = 'http://www.w3.org/1999/xhtml';
  }
  get tagName() {
    return this.nodeName;
  }
  set tagName(value) {
    this.nodeName = value;
  }
  get attributes() {
    if (this.__attributeMap == null) {
      this.__attributeMap = createAttributeProxy(true);
    }
    return this.__attributeMap;
  }
  set attributes(attrs) {
    this.__attributeMap = attrs;
  }
}
class MockTextNode extends MockNode {
  constructor(ownerDocument, text) {
    super(ownerDocument, 3 /* TEXT_NODE */, "#text" /* TEXT_NODE */, text);
  }
  cloneNode(_deep) {
    return new MockTextNode(null, this.nodeValue);
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }
  get data() {
    return this.nodeValue;
  }
  set data(text) {
    this.nodeValue = text;
  }
  get wholeText() {
    if (this.parentNode != null) {
      const text = [];
      for (let i = 0, ii = this.parentNode.childNodes.length; i < ii; i++) {
        const childNode = this.parentNode.childNodes[i];
        if (childNode.nodeType === 3 /* TEXT_NODE */) {
          text.push(childNode.nodeValue);
        }
      }
      return text.join('');
    }
    return this.nodeValue;
  }
}
function getTextContent(childNodes, text) {
  for (let i = 0, ii = childNodes.length; i < ii; i++) {
    const childNode = childNodes[i];
    if (childNode.nodeType === 3 /* TEXT_NODE */) {
      text.push(childNode.nodeValue);
    }
    else if (childNode.nodeType === 1 /* ELEMENT_NODE */) {
      getTextContent(childNode.childNodes, text);
    }
  }
}
function setTextContent(elm, text) {
  for (let i = elm.childNodes.length - 1; i >= 0; i--) {
    elm.removeChild(elm.childNodes[i]);
  }
  const textNode = new MockTextNode(elm.ownerDocument, text);
  elm.appendChild(textNode);
}

class MockComment extends MockNode {
  constructor(ownerDocument, data) {
    super(ownerDocument, 8 /* COMMENT_NODE */, "#comment" /* COMMENT_NODE */, data);
  }
  cloneNode(_deep) {
    return new MockComment(null, this.nodeValue);
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }
}

class MockDocumentFragment extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, null);
    this.nodeName = "#document-fragment" /* DOCUMENT_FRAGMENT_NODE */;
    this.nodeType = 11 /* DOCUMENT_FRAGMENT_NODE */;
  }
  getElementById(id) {
    return getElementById(this, id);
  }
  cloneNode(deep) {
    const cloned = new MockDocumentFragment(null);
    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const childNode = this.childNodes[i];
        if (childNode.nodeType === 1 /* ELEMENT_NODE */ || childNode.nodeType === 3 /* TEXT_NODE */ || childNode.nodeType === 8 /* COMMENT_NODE */) {
          const clonedChildNode = this.childNodes[i].cloneNode(true);
          cloned.appendChild(clonedChildNode);
        }
      }
    }
    return cloned;
  }
}

class MockDocumentTypeNode extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, '!DOCTYPE');
    this.nodeType = 10 /* DOCUMENT_TYPE_NODE */;
    this.setAttribute('html', '');
  }
}

class MockCSSRule {
  constructor(parentStyleSheet) {
    this.parentStyleSheet = parentStyleSheet;
    this.cssText = '';
    this.type = 0;
  }
}
class MockCSSStyleSheet {
  constructor(ownerNode) {
    this.type = 'text/css';
    this.parentStyleSheet = null;
    this.cssRules = [];
    this.ownerNode = ownerNode;
  }
  get rules() {
    return this.cssRules;
  }
  set rules(rules) {
    this.cssRules = rules;
  }
  deleteRule(index) {
    if (index >= 0 && index < this.cssRules.length) {
      this.cssRules.splice(index, 1);
      updateStyleTextNode(this.ownerNode);
    }
  }
  insertRule(rule, index = 0) {
    if (typeof index !== 'number') {
      index = 0;
    }
    if (index < 0) {
      index = 0;
    }
    if (index > this.cssRules.length) {
      index = this.cssRules.length;
    }
    const cssRule = new MockCSSRule(this);
    cssRule.cssText = rule;
    this.cssRules.splice(index, 0, cssRule);
    updateStyleTextNode(this.ownerNode);
    return index;
  }
}
function getStyleElementText(styleElm) {
  const output = [];
  for (let i = 0; i < styleElm.childNodes.length; i++) {
    output.push(styleElm.childNodes[i].nodeValue);
  }
  return output.join('');
}
function setStyleElementText(styleElm, text) {
  // keeping the innerHTML and the sheet.cssRules connected
  // is not technically correct, but since we're doing
  // SSR we'll need to turn any assigned cssRules into
  // real text, not just properties that aren't rendered
  const sheet = styleElm.sheet;
  sheet.cssRules.length = 0;
  sheet.insertRule(text);
  updateStyleTextNode(styleElm);
}
function updateStyleTextNode(styleElm) {
  const childNodeLen = styleElm.childNodes.length;
  if (childNodeLen > 1) {
    for (let i = childNodeLen - 1; i >= 1; i--) {
      styleElm.removeChild(styleElm.childNodes[i]);
    }
  }
  else if (childNodeLen < 1) {
    styleElm.appendChild(styleElm.ownerDocument.createTextNode(''));
  }
  const textNode = styleElm.childNodes[0];
  textNode.nodeValue = styleElm.sheet.cssRules.map(r => r.cssText).join('\n');
}

function createElement(ownerDocument, tagName) {
  if (typeof tagName !== 'string' || tagName === '' || !/^[a-z0-9-_:]+$/i.test(tagName)) {
    throw new Error(`The tag name provided (${tagName}) is not a valid name.`);
  }
  tagName = tagName.toLowerCase();
  switch (tagName) {
    case 'a':
      return new MockAnchorElement(ownerDocument);
    case 'base':
      return new MockBaseElement(ownerDocument);
    case 'button':
      return new MockButtonElement(ownerDocument);
    case 'canvas':
      return new MockCanvasElement(ownerDocument);
    case 'form':
      return new MockFormElement(ownerDocument);
    case 'img':
      return new MockImageElement(ownerDocument);
    case 'input':
      return new MockInputElement(ownerDocument);
    case 'link':
      return new MockLinkElement(ownerDocument);
    case 'meta':
      return new MockMetaElement(ownerDocument);
    case 'script':
      return new MockScriptElement(ownerDocument);
    case 'style':
      return new MockStyleElement(ownerDocument);
    case 'template':
      return new MockTemplateElement(ownerDocument);
    case 'title':
      return new MockTitleElement(ownerDocument);
  }
  if (ownerDocument != null && tagName.includes('-')) {
    const win = ownerDocument.defaultView;
    if (win != null && win.customElements != null) {
      return createCustomElement(win.customElements, ownerDocument, tagName);
    }
  }
  return new MockHTMLElement(ownerDocument, tagName);
}
function createElementNS(ownerDocument, namespaceURI, tagName) {
  if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return createElement(ownerDocument, tagName);
  }
  else if (namespaceURI === 'http://www.w3.org/2000/svg') {
    return new MockSVGElement(ownerDocument, tagName);
  }
  else {
    return new MockElement(ownerDocument, tagName);
  }
}
class MockAnchorElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'a');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
class MockButtonElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'button');
  }
}
patchPropAttributes(MockButtonElement.prototype, {
  type: String,
}, {
  type: 'submit',
});
class MockImageElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'img');
  }
  get src() {
    return fullUrl(this, 'src');
  }
  set src(value) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockImageElement.prototype, {
  height: Number,
  width: Number,
});
class MockInputElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'input');
  }
  get list() {
    const listId = this.getAttribute('list');
    if (listId) {
      return this.ownerDocument.getElementById(listId);
    }
    return null;
  }
}
patchPropAttributes(MockInputElement.prototype, {
  accept: String,
  autocomplete: String,
  autofocus: Boolean,
  capture: String,
  checked: Boolean,
  disabled: Boolean,
  form: String,
  formaction: String,
  formenctype: String,
  formmethod: String,
  formnovalidate: String,
  formtarget: String,
  height: Number,
  inputmode: String,
  max: String,
  maxLength: Number,
  min: String,
  minLength: Number,
  multiple: Boolean,
  name: String,
  pattern: String,
  placeholder: String,
  required: Boolean,
  readOnly: Boolean,
  size: Number,
  spellCheck: Boolean,
  src: String,
  step: String,
  type: String,
  value: String,
  width: Number,
}, {
  type: 'text',
});
class MockFormElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'form');
  }
}
patchPropAttributes(MockFormElement.prototype, {
  name: String,
});
class MockLinkElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'link');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
patchPropAttributes(MockLinkElement.prototype, {
  crossorigin: String,
  media: String,
  rel: String,
  type: String,
});
class MockMetaElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'meta');
  }
}
patchPropAttributes(MockMetaElement.prototype, {
  charset: String,
  content: String,
  name: String,
});
class MockScriptElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'script');
  }
  get src() {
    return fullUrl(this, 'src');
  }
  set src(value) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockScriptElement.prototype, {
  type: String,
});
class MockStyleElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'style');
    this.sheet = new MockCSSStyleSheet(this);
  }
  get innerHTML() {
    return getStyleElementText(this);
  }
  set innerHTML(value) {
    setStyleElementText(this, value);
  }
  get innerText() {
    return getStyleElementText(this);
  }
  set innerText(value) {
    setStyleElementText(this, value);
  }
  get textContent() {
    return getStyleElementText(this);
  }
  set textContent(value) {
    setStyleElementText(this, value);
  }
}
class MockSVGElement extends MockElement {
  // SVGElement properties and methods
  get ownerSVGElement() {
    return null;
  }
  get viewportElement() {
    return null;
  }
  focus() {
    /**/
  }
  onunload() {
    /**/
  }
  // SVGGeometryElement properties and methods
  get pathLength() {
    return 0;
  }
  isPointInFill(_pt) {
    return false;
  }
  isPointInStroke(_pt) {
    return false;
  }
  getTotalLength() {
    return 0;
  }
}
class MockBaseElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'base');
  }
  get href() {
    return fullUrl(this, 'href');
  }
  set href(value) {
    this.setAttribute('href', value);
  }
}
class MockTemplateElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'template');
    this.content = new MockDocumentFragment(ownerDocument);
  }
  get innerHTML() {
    return this.content.innerHTML;
  }
  set innerHTML(html) {
    this.content.innerHTML = html;
  }
  cloneNode(deep) {
    const cloned = new MockTemplateElement(null);
    cloned.attributes = cloneAttributes(this.attributes);
    const styleCssText = this.getAttribute('style');
    if (styleCssText != null && styleCssText.length > 0) {
      cloned.setAttribute('style', styleCssText);
    }
    cloned.content = this.content.cloneNode(deep);
    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const clonedChildNode = this.childNodes[i].cloneNode(true);
        cloned.appendChild(clonedChildNode);
      }
    }
    return cloned;
  }
}
class MockTitleElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'title');
  }
  get text() {
    return this.textContent;
  }
  set text(value) {
    this.textContent = value;
  }
}
class MockCanvasElement extends MockHTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, 'canvas');
  }
  getContext() {
    return {
      fillRect: function () {
        return;
      },
      clearRect: function () {
        return;
      },
      getImageData: function (_, __, w, h) {
        return {
          data: new Array(w * h * 4),
        };
      },
      putImageData: function () {
        return;
      },
      createImageData: function () {
        return [];
      },
      setTransform: function () {
        return;
      },
      drawImage: function () {
        return;
      },
      save: function () {
        return;
      },
      fillText: function () {
        return;
      },
      restore: function () {
        return;
      },
      beginPath: function () {
        return;
      },
      moveTo: function () {
        return;
      },
      lineTo: function () {
        return;
      },
      closePath: function () {
        return;
      },
      stroke: function () {
        return;
      },
      translate: function () {
        return;
      },
      scale: function () {
        return;
      },
      rotate: function () {
        return;
      },
      arc: function () {
        return;
      },
      fill: function () {
        return;
      },
      measureText: function () {
        return { width: 0 };
      },
      transform: function () {
        return;
      },
      rect: function () {
        return;
      },
      clip: function () {
        return;
      },
    };
  }
}
function fullUrl(elm, attrName) {
  const val = elm.getAttribute(attrName) || '';
  if (elm.ownerDocument != null) {
    const win = elm.ownerDocument.defaultView;
    if (win != null) {
      const loc = win.location;
      if (loc != null) {
        try {
          const url = new URL(val, loc.href);
          return url.href;
        }
        catch (e) { }
      }
    }
  }
  return val.replace(/\'|\"/g, '').trim();
}
function patchPropAttributes(prototype, attrs, defaults = {}) {
  Object.keys(attrs).forEach(propName => {
    const attr = attrs[propName];
    const defaultValue = defaults[propName];
    if (attr === Boolean) {
      Object.defineProperty(prototype, propName, {
        get() {
          return this.hasAttribute(propName);
        },
        set(value) {
          if (value) {
            this.setAttribute(propName, '');
          }
          else {
            this.removeAttribute(propName);
          }
        },
      });
    }
    else if (attr === Number) {
      Object.defineProperty(prototype, propName, {
        get() {
          const value = this.getAttribute(propName);
          return value ? parseInt(value, 10) : defaultValue === undefined ? 0 : defaultValue;
        },
        set(value) {
          this.setAttribute(propName, value);
        },
      });
    }
    else {
      Object.defineProperty(prototype, propName, {
        get() {
          return this.hasAttribute(propName) ? this.getAttribute(propName) : defaultValue || '';
        },
        set(value) {
          this.setAttribute(propName, value);
        },
      });
    }
  });
}
MockElement.prototype.cloneNode = function (deep) {
  // because we're creating elements, which extending specific HTML base classes there
  // is a MockElement circular reference that bundling has trouble dealing with so
  // the fix is to add cloneNode() to MockElement's prototype after the HTML classes
  const cloned = createElement(this.ownerDocument, this.nodeName);
  cloned.attributes = cloneAttributes(this.attributes);
  const styleCssText = this.getAttribute('style');
  if (styleCssText != null && styleCssText.length > 0) {
    cloned.setAttribute('style', styleCssText);
  }
  if (deep) {
    for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
      const clonedChildNode = this.childNodes[i].cloneNode(true);
      cloned.appendChild(clonedChildNode);
    }
  }
  return cloned;
};

let sharedDocument;
function parseHtmlToDocument(html, ownerDocument = null) {
  if (ownerDocument == null) {
    if (sharedDocument == null) {
      sharedDocument = new MockDocument();
    }
    ownerDocument = sharedDocument;
  }
  return parseDocumentUtil(ownerDocument, html);
}
function parseHtmlToFragment(html, ownerDocument = null) {
  if (ownerDocument == null) {
    if (sharedDocument == null) {
      sharedDocument = new MockDocument();
    }
    ownerDocument = sharedDocument;
  }
  return parseFragmentUtil(ownerDocument, html);
}

class MockHeaders {
  constructor(init) {
    this._values = [];
    if (typeof init === 'object') {
      if (typeof init[Symbol.iterator] === 'function') {
        const kvs = [];
        for (const kv of init) {
          if (typeof kv[Symbol.iterator] === 'function') {
            kvs.push([...kv]);
          }
        }
        for (const kv of kvs) {
          this.append(kv[0], kv[1]);
        }
      }
      else {
        for (const key in init) {
          this.append(key, init[key]);
        }
      }
    }
  }
  append(key, value) {
    this._values.push([key, value + '']);
  }
  delete(key) {
    key = key.toLowerCase();
    for (let i = this._values.length - 1; i >= 0; i--) {
      if (this._values[i][0].toLowerCase() === key) {
        this._values.splice(i, 1);
      }
    }
  }
  entries() {
    const entries = [];
    for (const kv of this.keys()) {
      entries.push([kv, this.get(kv)]);
    }
    let index = -1;
    return {
      next() {
        index++;
        return {
          value: entries[index],
          done: !entries[index],
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  forEach(cb) {
    for (const kv of this.entries()) {
      cb(kv[1], kv[0]);
    }
  }
  get(key) {
    const rtn = [];
    key = key.toLowerCase();
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key) {
        rtn.push(kv[1]);
      }
    }
    return rtn.length > 0 ? rtn.join(', ') : null;
  }
  has(key) {
    key = key.toLowerCase();
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key) {
        return true;
      }
    }
    return false;
  }
  keys() {
    const keys = [];
    for (const kv of this._values) {
      const key = kv[0].toLowerCase();
      if (!keys.includes(key)) {
        keys.push(key);
      }
    }
    let index = -1;
    return {
      next() {
        index++;
        return {
          value: keys[index],
          done: !keys[index],
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  set(key, value) {
    for (const kv of this._values) {
      if (kv[0].toLowerCase() === key.toLowerCase()) {
        kv[1] = value + '';
        return;
      }
    }
    this.append(key, value);
  }
  values() {
    const values = this._values;
    let index = -1;
    return {
      next() {
        index++;
        const done = !values[index];
        return {
          value: done ? undefined : values[index][1],
          done,
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

class MockRequest {
  constructor(input, init = {}) {
    this._method = 'GET';
    this._url = '/';
    this.bodyUsed = false;
    this.cache = 'default';
    this.credentials = 'same-origin';
    this.integrity = '';
    this.keepalive = false;
    this.mode = 'cors';
    this.redirect = 'follow';
    this.referrer = 'about:client';
    this.referrerPolicy = '';
    if (typeof input === 'string') {
      this.url = input;
    }
    else if (input) {
      Object.assign(this, input);
      this.headers = new MockHeaders(input.headers);
    }
    Object.assign(this, init);
    if (init.headers) {
      this.headers = new MockHeaders(init.headers);
    }
    if (!this.headers) {
      this.headers = new MockHeaders();
    }
  }
  get url() {
    if (typeof this._url === 'string') {
      return new URL(this._url, location.href).href;
    }
    return new URL('/', location.href).href;
  }
  set url(value) {
    this._url = value;
  }
  get method() {
    if (typeof this._method === 'string') {
      return this._method.toUpperCase();
    }
    return 'GET';
  }
  set method(value) {
    this._method = value;
  }
  clone() {
    const clone = Object.assign({}, this);
    clone.headers = new MockHeaders(this.headers);
    return new MockRequest(clone);
  }
}
class MockResponse {
  constructor(body, init = {}) {
    this.ok = true;
    this.status = 200;
    this.statusText = '';
    this.type = 'default';
    this.url = '';
    this._body = body;
    if (init) {
      Object.assign(this, init);
    }
    this.headers = new MockHeaders(init.headers);
  }
  async json() {
    return JSON.parse(this._body);
  }
  async text() {
    return this._body;
  }
  clone() {
    const initClone = Object.assign({}, this);
    initClone.headers = new MockHeaders(this.headers);
    return new MockResponse(this._body, initClone);
  }
}

function setupGlobal(gbl) {
  if (gbl.window == null) {
    const win = (gbl.window = new MockWindow());
    WINDOW_FUNCTIONS.forEach(fnName => {
      if (!(fnName in gbl)) {
        gbl[fnName] = win[fnName].bind(win);
      }
    });
    WINDOW_PROPS.forEach(propName => {
      if (!(propName in gbl)) {
        Object.defineProperty(gbl, propName, {
          get() {
            return win[propName];
          },
          set(val) {
            win[propName] = val;
          },
          configurable: true,
          enumerable: true,
        });
      }
    });
    GLOBAL_CONSTRUCTORS.forEach(([cstrName]) => {
      gbl[cstrName] = win[cstrName];
    });
  }
  return gbl.window;
}
function teardownGlobal(gbl) {
  const win = gbl.window;
  if (win && typeof win.close === 'function') {
    win.close();
  }
}
function patchWindow(winToBePatched) {
  const mockWin = new MockWindow(false);
  WINDOW_FUNCTIONS.forEach(fnName => {
    if (typeof winToBePatched[fnName] !== 'function') {
      winToBePatched[fnName] = mockWin[fnName].bind(mockWin);
    }
  });
  WINDOW_PROPS.forEach(propName => {
    if (winToBePatched === undefined) {
      Object.defineProperty(winToBePatched, propName, {
        get() {
          return mockWin[propName];
        },
        set(val) {
          mockWin[propName] = val;
        },
        configurable: true,
        enumerable: true,
      });
    }
  });
}
function addGlobalsToWindowPrototype(mockWinPrototype) {
  GLOBAL_CONSTRUCTORS.forEach(([cstrName, Cstr]) => {
    Object.defineProperty(mockWinPrototype, cstrName, {
      get() {
        return this['__' + cstrName] || Cstr;
      },
      set(cstr) {
        this['__' + cstrName] = cstr;
      },
      configurable: true,
      enumerable: true,
    });
  });
}
const WINDOW_FUNCTIONS = [
  'addEventListener',
  'alert',
  'blur',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'clearInterval',
  'clearTimeout',
  'close',
  'confirm',
  'dispatchEvent',
  'focus',
  'getComputedStyle',
  'matchMedia',
  'open',
  'prompt',
  'removeEventListener',
  'requestAnimationFrame',
  'requestIdleCallback',
  'URL',
];
const WINDOW_PROPS = [
  'customElements',
  'devicePixelRatio',
  'document',
  'history',
  'innerHeight',
  'innerWidth',
  'localStorage',
  'location',
  'navigator',
  'pageXOffset',
  'pageYOffset',
  'performance',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scrollX',
  'scrollY',
  'sessionStorage',
  'CSS',
  'CustomEvent',
  'Event',
  'Element',
  'HTMLElement',
  'Node',
  'NodeList',
  'KeyboardEvent',
  'MouseEvent',
];
const GLOBAL_CONSTRUCTORS = [
  ['CustomEvent', MockCustomEvent],
  ['Event', MockEvent],
  ['Headers', MockHeaders],
  ['KeyboardEvent', MockKeyboardEvent],
  ['MouseEvent', MockMouseEvent],
  ['Request', MockRequest],
  ['Response', MockResponse],
  ['HTMLAnchorElement', MockAnchorElement],
  ['HTMLBaseElement', MockBaseElement],
  ['HTMLButtonElement', MockButtonElement],
  ['HTMLCanvasElement', MockCanvasElement],
  ['HTMLFormElement', MockFormElement],
  ['HTMLImageElement', MockImageElement],
  ['HTMLInputElement', MockInputElement],
  ['HTMLLinkElement', MockLinkElement],
  ['HTMLMetaElement', MockMetaElement],
  ['HTMLScriptElement', MockScriptElement],
  ['HTMLStyleElement', MockStyleElement],
  ['HTMLTemplateElement', MockTemplateElement],
  ['HTMLTitleElement', MockTitleElement],
];

const consoleNoop = () => {
  /**/
};
function createConsole() {
  return {
    debug: consoleNoop,
    error: consoleNoop,
    info: consoleNoop,
    log: consoleNoop,
    warn: consoleNoop,
    dir: consoleNoop,
    dirxml: consoleNoop,
    table: consoleNoop,
    trace: consoleNoop,
    group: consoleNoop,
    groupCollapsed: consoleNoop,
    groupEnd: consoleNoop,
    clear: consoleNoop,
    count: consoleNoop,
    countReset: consoleNoop,
    assert: consoleNoop,
    profile: consoleNoop,
    profileEnd: consoleNoop,
    time: consoleNoop,
    timeLog: consoleNoop,
    timeEnd: consoleNoop,
    timeStamp: consoleNoop,
    context: consoleNoop,
    memory: consoleNoop,
  };
}

class MockHistory {
  constructor() {
    this.items = [];
  }
  get length() {
    return this.items.length;
  }
  back() {
    this.go(-1);
  }
  forward() {
    this.go(1);
  }
  go(_value) {
    //
  }
  pushState(_state, _title, _url) {
    //
  }
  replaceState(_state, _title, _url) {
    //
  }
}

class MockIntersectionObserver {
  constructor() {
    /**/
  }
  disconnect() {
    /**/
  }
  observe() {
    /**/
  }
  takeRecords() {
    return [];
  }
  unobserve() {
    /**/
  }
}

class MockLocation {
  constructor() {
    this.ancestorOrigins = null;
    this.protocol = '';
    this.host = '';
    this.hostname = '';
    this.port = '';
    this.pathname = '';
    this.search = '';
    this.hash = '';
    this.username = '';
    this.password = '';
    this.origin = '';
    this._href = '';
  }
  get href() {
    return this._href;
  }
  set href(value) {
    const url = new URL(value, 'http://mockdoc.stenciljs.com');
    this._href = url.href;
    this.protocol = url.protocol;
    this.host = url.host;
    this.port = url.port;
    this.pathname = url.pathname;
    this.search = url.search;
    this.hash = url.hash;
    this.username = url.username;
    this.password = url.password;
    this.origin = url.origin;
  }
  assign(_url) {
    //
  }
  reload(_forcedReload) {
    //
  }
  replace(_url) {
    //
  }
  toString() {
    return this.href;
  }
}

class MockNavigator {
  constructor() {
    this.appCodeName = 'MockNavigator';
    this.appName = 'MockNavigator';
    this.appVersion = 'MockNavigator';
    this.platform = 'MockNavigator';
    this.userAgent = 'MockNavigator';
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
class MockPerformance {
  constructor() {
    this.timeOrigin = Date.now();
  }
  addEventListener() {
    //
  }
  clearMarks() {
    //
  }
  clearMeasures() {
    //
  }
  clearResourceTimings() {
    //
  }
  dispatchEvent() {
    return true;
  }
  getEntries() {
    return [];
  }
  getEntriesByName() {
    return [];
  }
  getEntriesByType() {
    return [];
  }
  mark() {
    //
  }
  measure() {
    //
  }
  get navigation() {
    return {};
  }
  now() {
    return Date.now() - this.timeOrigin;
  }
  get onresourcetimingbufferfull() {
    return null;
  }
  removeEventListener() {
    //
  }
  setResourceTimingBufferSize() {
    //
  }
  get timing() {
    return {};
  }
  toJSON() {
    //
  }
}
function resetPerformance(perf) {
  if (perf != null) {
    try {
      perf.timeOrigin = Date.now();
    }
    catch (e) { }
  }
}

class MockStorage {
  constructor() {
    this.items = new Map();
  }
  key(_value) {
    //
  }
  getItem(key) {
    key = String(key);
    if (this.items.has(key)) {
      return this.items.get(key);
    }
    return null;
  }
  setItem(key, value) {
    if (value == null) {
      value = 'null';
    }
    this.items.set(String(key), String(value));
  }
  removeItem(key) {
    this.items.delete(String(key));
  }
  clear() {
    this.items.clear();
  }
}

const nativeClearInterval = clearInterval;
const nativeClearTimeout = clearTimeout;
const nativeSetInterval = setInterval;
const nativeSetTimeout = setTimeout;
const nativeURL = URL;
class MockWindow {
  constructor(html = null) {
    if (html !== false) {
      this.document = new MockDocument(html, this);
    }
    else {
      this.document = null;
    }
    this.performance = new MockPerformance();
    this.customElements = new MockCustomElementRegistry(this);
    this.console = createConsole();
    resetWindowDefaults(this);
    resetWindowDimensions(this);
  }
  addEventListener(type, handler) {
    addEventListener(this, type, handler);
  }
  alert(msg) {
    if (this.console) {
      this.console.debug(msg);
    }
    else {
      console.debug(msg);
    }
  }
  blur() {
    /**/
  }
  cancelAnimationFrame(id) {
    this.__clearTimeout(id);
  }
  cancelIdleCallback(id) {
    this.__clearTimeout(id);
  }
  get CharacterData() {
    if (this.__charDataCstr == null) {
      const ownerDocument = this.document;
      this.__charDataCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct CharacterData');
        }
      };
    }
    return this.__charDataCstr;
  }
  set CharacterData(charDataCstr) {
    this.__charDataCstr = charDataCstr;
  }
  clearInterval(id) {
    this.__clearInterval(id);
  }
  clearTimeout(id) {
    this.__clearTimeout(id);
  }
  close() {
    resetWindow(this);
  }
  confirm() {
    return false;
  }
  get CSS() {
    return {
      supports: () => true,
    };
  }
  get Document() {
    if (this.__docCstr == null) {
      const win = this;
      this.__docCstr = class extends MockDocument {
        constructor() {
          super(false, win);
          throw new Error('Illegal constructor: cannot construct Document');
        }
      };
    }
    return this.__docCstr;
  }
  set Document(docCstr) {
    this.__docCstr = docCstr;
  }
  get DocumentFragment() {
    if (this.__docFragCstr == null) {
      const ownerDocument = this.document;
      this.__docFragCstr = class extends MockDocumentFragment {
        constructor() {
          super(ownerDocument);
          throw new Error('Illegal constructor: cannot construct DocumentFragment');
        }
      };
    }
    return this.__docFragCstr;
  }
  set DocumentFragment(docFragCstr) {
    this.__docFragCstr = docFragCstr;
  }
  get DocumentType() {
    if (this.__docTypeCstr == null) {
      const ownerDocument = this.document;
      this.__docTypeCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct DocumentType');
        }
      };
    }
    return this.__docTypeCstr;
  }
  set DocumentType(docTypeCstr) {
    this.__docTypeCstr = docTypeCstr;
  }
  get DOMTokenList() {
    if (this.__domTokenListCstr == null) {
      this.__domTokenListCstr = class MockDOMTokenList {
      };
    }
    return this.__domTokenListCstr;
  }
  set DOMTokenList(domTokenListCstr) {
    this.__domTokenListCstr = domTokenListCstr;
  }
  dispatchEvent(ev) {
    return dispatchEvent(this, ev);
  }
  get Element() {
    if (this.__elementCstr == null) {
      const ownerDocument = this.document;
      this.__elementCstr = class extends MockElement {
        constructor() {
          super(ownerDocument, '');
          throw new Error('Illegal constructor: cannot construct Element');
        }
      };
    }
    return this.__elementCstr;
  }
  focus() {
    /**/
  }
  getComputedStyle(_) {
    return {
      cssText: '',
      length: 0,
      parentRule: null,
      getPropertyPriority() {
        return null;
      },
      getPropertyValue() {
        return '';
      },
      item() {
        return null;
      },
      removeProperty() {
        return null;
      },
      setProperty() {
        return null;
      },
    };
  }
  get globalThis() {
    return this;
  }
  get history() {
    if (this.__history == null) {
      this.__history = new MockHistory();
    }
    return this.__history;
  }
  set history(hsty) {
    this.__history = hsty;
  }
  get JSON() {
    return JSON;
  }
  get HTMLElement() {
    if (this.__htmlElementCstr == null) {
      const ownerDocument = this.document;
      this.__htmlElementCstr = class extends MockHTMLElement {
        constructor() {
          super(ownerDocument, '');
          const observedAttributes = this.constructor.observedAttributes;
          if (Array.isArray(observedAttributes) && typeof this.attributeChangedCallback === 'function') {
            observedAttributes.forEach(attrName => {
              const attrValue = this.getAttribute(attrName);
              if (attrValue != null) {
                this.attributeChangedCallback(attrName, null, attrValue);
              }
            });
          }
        }
      };
    }
    return this.__htmlElementCstr;
  }
  set HTMLElement(htmlElementCstr) {
    this.__htmlElementCstr = htmlElementCstr;
  }
  get IntersectionObserver() {
    return MockIntersectionObserver;
  }
  get localStorage() {
    if (this.__localStorage == null) {
      this.__localStorage = new MockStorage();
    }
    return this.__localStorage;
  }
  set localStorage(locStorage) {
    this.__localStorage = locStorage;
  }
  get location() {
    if (this.__location == null) {
      this.__location = new MockLocation();
    }
    return this.__location;
  }
  set location(val) {
    if (typeof val === 'string') {
      if (this.__location == null) {
        this.__location = new MockLocation();
      }
      this.__location.href = val;
    }
    else {
      this.__location = val;
    }
  }
  matchMedia() {
    return {
      matches: false,
    };
  }
  get Node() {
    if (this.__nodeCstr == null) {
      const ownerDocument = this.document;
      this.__nodeCstr = class extends MockNode {
        constructor() {
          super(ownerDocument, 0, 'test', '');
          throw new Error('Illegal constructor: cannot construct Node');
        }
      };
    }
    return this.__nodeCstr;
  }
  get NodeList() {
    if (this.__nodeListCstr == null) {
      const ownerDocument = this.document;
      this.__nodeListCstr = class extends MockNodeList {
        constructor() {
          super(ownerDocument, [], 0);
          throw new Error('Illegal constructor: cannot construct NodeList');
        }
      };
    }
    return this.__nodeListCstr;
  }
  get navigator() {
    if (this.__navigator == null) {
      this.__navigator = new MockNavigator();
    }
    return this.__navigator;
  }
  set navigator(nav) {
    this.__navigator = nav;
  }
  get parent() {
    return null;
  }
  prompt() {
    return '';
  }
  open() {
    return null;
  }
  get origin() {
    return this.location.origin;
  }
  removeEventListener(type, handler) {
    removeEventListener(this, type, handler);
  }
  requestAnimationFrame(callback) {
    return this.setTimeout(() => {
      callback(Date.now());
    }, 0);
  }
  requestIdleCallback(callback) {
    return this.setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 0,
      });
    }, 0);
  }
  scroll(_x, _y) {
    /**/
  }
  scrollBy(_x, _y) {
    /**/
  }
  scrollTo(_x, _y) {
    /**/
  }
  get self() {
    return this;
  }
  get sessionStorage() {
    if (this.__sessionStorage == null) {
      this.__sessionStorage = new MockStorage();
    }
    return this.__sessionStorage;
  }
  set sessionStorage(locStorage) {
    this.__sessionStorage = locStorage;
  }
  setInterval(callback, ms, ...args) {
    if (this.__timeouts == null) {
      this.__timeouts = new Set();
    }
    ms = Math.min(ms, this.__maxTimeout);
    if (this.__allowInterval) {
      const intervalId = this.__setInterval(() => {
        this.__timeouts.delete(intervalId);
        try {
          callback(...args);
        }
        catch (e) {
          if (this.console) {
            this.console.error(e);
          }
          else {
            console.error(e);
          }
        }
      }, ms);
      this.__timeouts.add(intervalId);
      return intervalId;
    }
    const timeoutId = this.__setTimeout(() => {
      this.__timeouts.delete(timeoutId);
      try {
        callback(...args);
      }
      catch (e) {
        if (this.console) {
          this.console.error(e);
        }
        else {
          console.error(e);
        }
      }
    }, ms);
    this.__timeouts.add(timeoutId);
    return timeoutId;
  }
  setTimeout(callback, ms, ...args) {
    if (this.__timeouts == null) {
      this.__timeouts = new Set();
    }
    ms = Math.min(ms, this.__maxTimeout);
    const timeoutId = this.__setTimeout(() => {
      this.__timeouts.delete(timeoutId);
      try {
        callback(...args);
      }
      catch (e) {
        if (this.console) {
          this.console.error(e);
        }
        else {
          console.error(e);
        }
      }
    }, ms);
    this.__timeouts.add(timeoutId);
    return timeoutId;
  }
  get top() {
    return this;
  }
  get window() {
    return this;
  }
  onanimationstart() {
    /**/
  }
  onanimationend() {
    /**/
  }
  onanimationiteration() {
    /**/
  }
  onabort() {
    /**/
  }
  onauxclick() {
    /**/
  }
  onbeforecopy() {
    /**/
  }
  onbeforecut() {
    /**/
  }
  onbeforepaste() {
    /**/
  }
  onblur() {
    /**/
  }
  oncancel() {
    /**/
  }
  oncanplay() {
    /**/
  }
  oncanplaythrough() {
    /**/
  }
  onchange() {
    /**/
  }
  onclick() {
    /**/
  }
  onclose() {
    /**/
  }
  oncontextmenu() {
    /**/
  }
  oncopy() {
    /**/
  }
  oncuechange() {
    /**/
  }
  oncut() {
    /**/
  }
  ondblclick() {
    /**/
  }
  ondrag() {
    /**/
  }
  ondragend() {
    /**/
  }
  ondragenter() {
    /**/
  }
  ondragleave() {
    /**/
  }
  ondragover() {
    /**/
  }
  ondragstart() {
    /**/
  }
  ondrop() {
    /**/
  }
  ondurationchange() {
    /**/
  }
  onemptied() {
    /**/
  }
  onended() {
    /**/
  }
  onerror() {
    /**/
  }
  onfocus() {
    /**/
  }
  onformdata() {
    /**/
  }
  onfullscreenchange() {
    /**/
  }
  onfullscreenerror() {
    /**/
  }
  ongotpointercapture() {
    /**/
  }
  oninput() {
    /**/
  }
  oninvalid() {
    /**/
  }
  onkeydown() {
    /**/
  }
  onkeypress() {
    /**/
  }
  onkeyup() {
    /**/
  }
  onload() {
    /**/
  }
  onloadeddata() {
    /**/
  }
  onloadedmetadata() {
    /**/
  }
  onloadstart() {
    /**/
  }
  onlostpointercapture() {
    /**/
  }
  onmousedown() {
    /**/
  }
  onmouseenter() {
    /**/
  }
  onmouseleave() {
    /**/
  }
  onmousemove() {
    /**/
  }
  onmouseout() {
    /**/
  }
  onmouseover() {
    /**/
  }
  onmouseup() {
    /**/
  }
  onmousewheel() {
    /**/
  }
  onpaste() {
    /**/
  }
  onpause() {
    /**/
  }
  onplay() {
    /**/
  }
  onplaying() {
    /**/
  }
  onpointercancel() {
    /**/
  }
  onpointerdown() {
    /**/
  }
  onpointerenter() {
    /**/
  }
  onpointerleave() {
    /**/
  }
  onpointermove() {
    /**/
  }
  onpointerout() {
    /**/
  }
  onpointerover() {
    /**/
  }
  onpointerup() {
    /**/
  }
  onprogress() {
    /**/
  }
  onratechange() {
    /**/
  }
  onreset() {
    /**/
  }
  onresize() {
    /**/
  }
  onscroll() {
    /**/
  }
  onsearch() {
    /**/
  }
  onseeked() {
    /**/
  }
  onseeking() {
    /**/
  }
  onselect() {
    /**/
  }
  onselectstart() {
    /**/
  }
  onstalled() {
    /**/
  }
  onsubmit() {
    /**/
  }
  onsuspend() {
    /**/
  }
  ontimeupdate() {
    /**/
  }
  ontoggle() {
    /**/
  }
  onvolumechange() {
    /**/
  }
  onwaiting() {
    /**/
  }
  onwebkitfullscreenchange() {
    /**/
  }
  onwebkitfullscreenerror() {
    /**/
  }
  onwheel() {
    /**/
  }
}
addGlobalsToWindowPrototype(MockWindow.prototype);
function resetWindowDefaults(win) {
  win.__clearInterval = nativeClearInterval;
  win.__clearTimeout = nativeClearTimeout;
  win.__setInterval = nativeSetInterval;
  win.__setTimeout = nativeSetTimeout;
  win.__maxTimeout = 30000;
  win.__allowInterval = true;
  win.URL = nativeURL;
}
function cloneWindow(srcWin, opts = {}) {
  if (srcWin == null) {
    return null;
  }
  const clonedWin = new MockWindow(false);
  if (!opts.customElementProxy) {
    srcWin.customElements = null;
  }
  if (srcWin.document != null) {
    const clonedDoc = new MockDocument(false, clonedWin);
    clonedWin.document = clonedDoc;
    clonedDoc.documentElement = srcWin.document.documentElement.cloneNode(true);
  }
  else {
    clonedWin.document = new MockDocument(null, clonedWin);
  }
  return clonedWin;
}
function cloneDocument(srcDoc) {
  if (srcDoc == null) {
    return null;
  }
  const dstWin = cloneWindow(srcDoc.defaultView);
  return dstWin.document;
}
/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 */
function constrainTimeouts(win) {
  win.__allowInterval = false;
  win.__maxTimeout = 0;
}
function resetWindow(win) {
  if (win != null) {
    if (win.__timeouts) {
      win.__timeouts.forEach(timeoutId => {
        nativeClearInterval(timeoutId);
        nativeClearTimeout(timeoutId);
      });
      win.__timeouts.clear();
    }
    if (win.customElements && win.customElements.clear) {
      win.customElements.clear();
    }
    resetDocument(win.document);
    resetPerformance(win.performance);
    for (const key in win) {
      if (win.hasOwnProperty(key) && key !== 'document' && key !== 'performance' && key !== 'customElements') {
        delete win[key];
      }
    }
    resetWindowDefaults(win);
    resetWindowDimensions(win);
    resetEventListeners(win);
    if (win.document != null) {
      try {
        win.document.defaultView = win;
      }
      catch (e) { }
    }
  }
}
function resetWindowDimensions(win) {
  try {
    win.devicePixelRatio = 1;
    win.innerHeight = 768;
    win.innerWidth = 1366;
    win.pageXOffset = 0;
    win.pageYOffset = 0;
    win.screenLeft = 0;
    win.screenTop = 0;
    win.screenX = 0;
    win.screenY = 0;
    win.scrollX = 0;
    win.scrollY = 0;
    win.screen = {
      availHeight: win.innerHeight,
      availLeft: 0,
      availTop: 0,
      availWidth: win.innerWidth,
      colorDepth: 24,
      height: win.innerHeight,
      keepAwake: false,
      orientation: {
        angle: 0,
        type: 'portrait-primary',
      },
      pixelDepth: 24,
      width: win.innerWidth,
    };
  }
  catch (e) { }
}

class MockDocument extends MockHTMLElement {
  constructor(html = null, win = null) {
    super(null, null);
    this.nodeName = "#document" /* DOCUMENT_NODE */;
    this.nodeType = 9 /* DOCUMENT_NODE */;
    this.defaultView = win;
    this.cookie = '';
    this.referrer = '';
    this.appendChild(this.createDocumentTypeNode());
    if (typeof html === 'string') {
      const parsedDoc = parseDocumentUtil(this, html);
      const documentElement = parsedDoc.children.find(elm => elm.nodeName === 'HTML');
      if (documentElement != null) {
        this.appendChild(documentElement);
        setOwnerDocument(documentElement, this);
      }
    }
    else if (html !== false) {
      const documentElement = new MockHTMLElement(this, 'html');
      this.appendChild(documentElement);
      documentElement.appendChild(new MockHTMLElement(this, 'head'));
      documentElement.appendChild(new MockHTMLElement(this, 'body'));
    }
  }
  get location() {
    if (this.defaultView != null) {
      return this.defaultView.location;
    }
    return null;
  }
  set location(val) {
    if (this.defaultView != null) {
      this.defaultView.location = val;
    }
  }
  get baseURI() {
    const baseNode = this.head.childNodes.find(node => node.nodeName === 'BASE');
    if (baseNode) {
      return baseNode.href;
    }
    return this.URL;
  }
  get URL() {
    return this.location.href;
  }
  get styleSheets() {
    return this.querySelectorAll('style');
  }
  get scripts() {
    return this.querySelectorAll('script');
  }
  get forms() {
    return this.querySelectorAll('form');
  }
  get images() {
    return this.querySelectorAll('img');
  }
  get scrollingElement() {
    return this.documentElement;
  }
  get documentElement() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeName === 'HTML') {
        return this.childNodes[i];
      }
    }
    const documentElement = new MockHTMLElement(this, 'html');
    this.appendChild(documentElement);
    return documentElement;
  }
  set documentElement(documentElement) {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeType !== 10 /* DOCUMENT_TYPE_NODE */) {
        this.childNodes[i].remove();
      }
    }
    if (documentElement != null) {
      this.appendChild(documentElement);
      setOwnerDocument(documentElement, this);
    }
  }
  get head() {
    const documentElement = this.documentElement;
    for (let i = 0; i < documentElement.childNodes.length; i++) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        return documentElement.childNodes[i];
      }
    }
    const head = new MockHTMLElement(this, 'head');
    documentElement.insertBefore(head, documentElement.firstChild);
    return head;
  }
  set head(head) {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        documentElement.childNodes[i].remove();
      }
    }
    if (head != null) {
      documentElement.insertBefore(head, documentElement.firstChild);
      setOwnerDocument(head, this);
    }
  }
  get body() {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        return documentElement.childNodes[i];
      }
    }
    const body = new MockHTMLElement(this, 'body');
    documentElement.appendChild(body);
    return body;
  }
  set body(body) {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        documentElement.childNodes[i].remove();
      }
    }
    if (body != null) {
      documentElement.appendChild(body);
      setOwnerDocument(body, this);
    }
  }
  appendChild(newNode) {
    newNode.remove();
    newNode.parentNode = this;
    this.childNodes.push(newNode);
    return newNode;
  }
  createComment(data) {
    return new MockComment(this, data);
  }
  createAttribute(attrName) {
    return new MockAttr(attrName.toLowerCase(), '');
  }
  createAttributeNS(namespaceURI, attrName) {
    return new MockAttr(attrName, '', namespaceURI);
  }
  createElement(tagName) {
    if (tagName === "#document" /* DOCUMENT_NODE */) {
      const doc = new MockDocument(false);
      doc.nodeName = tagName;
      doc.parentNode = null;
      return doc;
    }
    return createElement(this, tagName);
  }
  createElementNS(namespaceURI, tagName) {
    const elmNs = createElementNS(this, namespaceURI, tagName);
    elmNs.namespaceURI = namespaceURI;
    return elmNs;
  }
  createTextNode(text) {
    return new MockTextNode(this, text);
  }
  createDocumentFragment() {
    return new MockDocumentFragment(this);
  }
  createDocumentTypeNode() {
    return new MockDocumentTypeNode(this);
  }
  getElementById(id) {
    return getElementById(this, id);
  }
  getElementsByName(elmName) {
    return getElementsByName(this, elmName.toLowerCase());
  }
  get title() {
    const title = this.head.childNodes.find(elm => elm.nodeName === 'TITLE');
    if (title != null) {
      return title.textContent;
    }
    return '';
  }
  set title(value) {
    const head = this.head;
    let title = head.childNodes.find(elm => elm.nodeName === 'TITLE');
    if (title == null) {
      title = this.createElement('title');
      head.appendChild(title);
    }
    title.textContent = value;
  }
}
function createDocument(html = null) {
  return new MockWindow(html).document;
}
function createFragment(html) {
  return parseHtmlToFragment(html, null);
}
function resetDocument(doc) {
  if (doc != null) {
    resetEventListeners(doc);
    const documentElement = doc.documentElement;
    if (documentElement != null) {
      resetElement(documentElement);
      for (let i = 0, ii = documentElement.childNodes.length; i < ii; i++) {
        const childNode = documentElement.childNodes[i];
        resetElement(childNode);
        childNode.childNodes.length = 0;
      }
    }
    for (const key in doc) {
      if (doc.hasOwnProperty(key) && !DOC_KEY_KEEPERS.has(key)) {
        delete doc[key];
      }
    }
    try {
      doc.nodeName = "#document" /* DOCUMENT_NODE */;
    }
    catch (e) { }
    try {
      doc.nodeType = 9 /* DOCUMENT_NODE */;
    }
    catch (e) { }
    try {
      doc.cookie = '';
    }
    catch (e) { }
    try {
      doc.referrer = '';
    }
    catch (e) { }
  }
}
const DOC_KEY_KEEPERS = new Set(['nodeName', 'nodeType', 'nodeValue', 'ownerDocument', 'parentNode', 'childNodes', '_shadowRoot']);
function getElementById(elm, id) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.id === id) {
      return childElm;
    }
    const childElmFound = getElementById(childElm, id);
    if (childElmFound != null) {
      return childElmFound;
    }
  }
  return null;
}
function getElementsByName(elm, elmName, foundElms = []) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.name && childElm.name.toLowerCase() === elmName) {
      foundElms.push(childElm);
    }
    getElementsByName(childElm, elmName, foundElms);
  }
  return foundElms;
}
function setOwnerDocument(elm, ownerDocument) {
  for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
    elm.childNodes[i].ownerDocument = ownerDocument;
    if (elm.childNodes[i].nodeType === 1 /* ELEMENT_NODE */) {
      setOwnerDocument(elm.childNodes[i], ownerDocument);
    }
  }
}

function hydrateFactory($stencilWindow, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve) {
  var globalThis = $stencilWindow;
  var self = $stencilWindow;
  var top = $stencilWindow;
  var parent = $stencilWindow;

  var addEventListener = $stencilWindow.addEventListener.bind($stencilWindow);
  var alert = $stencilWindow.alert.bind($stencilWindow);
  var blur = $stencilWindow.blur.bind($stencilWindow);
  var cancelAnimationFrame = $stencilWindow.cancelAnimationFrame.bind($stencilWindow);
  var cancelIdleCallback = $stencilWindow.cancelIdleCallback.bind($stencilWindow);
  var clearInterval = $stencilWindow.clearInterval.bind($stencilWindow);
  var clearTimeout = $stencilWindow.clearTimeout.bind($stencilWindow);
  var close = () => {};
  var confirm = $stencilWindow.confirm.bind($stencilWindow);
  var dispatchEvent = $stencilWindow.dispatchEvent.bind($stencilWindow);
  var focus = $stencilWindow.focus.bind($stencilWindow);
  var getComputedStyle = $stencilWindow.getComputedStyle.bind($stencilWindow);
  var matchMedia = $stencilWindow.matchMedia.bind($stencilWindow);
  var open = $stencilWindow.open.bind($stencilWindow);
  var prompt = $stencilWindow.prompt.bind($stencilWindow);
  var removeEventListener = $stencilWindow.removeEventListener.bind($stencilWindow);
  var requestAnimationFrame = $stencilWindow.requestAnimationFrame.bind($stencilWindow);
  var requestIdleCallback = $stencilWindow.requestIdleCallback.bind($stencilWindow);
  var setInterval = $stencilWindow.setInterval.bind($stencilWindow);
  var setTimeout = $stencilWindow.setTimeout.bind($stencilWindow);

  var CharacterData = $stencilWindow.CharacterData;
  var CSS = $stencilWindow.CSS;
  var CustomEvent = $stencilWindow.CustomEvent;
  var Document = $stencilWindow.Document;
  var DocumentFragment = $stencilWindow.DocumentFragment;
  var DocumentType = $stencilWindow.DocumentType;
  var DOMTokenList = $stencilWindow.DOMTokenList;
  var Element = $stencilWindow.Element;
  var Event = $stencilWindow.Event;
  var HTMLElement = $stencilWindow.HTMLElement;
  var IntersectionObserver = $stencilWindow.IntersectionObserver;
  var KeyboardEvent = $stencilWindow.KeyboardEvent;
  var MouseEvent = $stencilWindow.MouseEvent;
  var Node = $stencilWindow.Node;
  var NodeList = $stencilWindow.NodeList;
  var URL = $stencilWindow.URL;

  var console = $stencilWindow.console;
  var customElements = $stencilWindow.customElements;
  var history = $stencilWindow.history;
  var localStorage = $stencilWindow.localStorage;
  var location = $stencilWindow.location;
  var navigator = $stencilWindow.navigator;
  var performance = $stencilWindow.performance;
  var sessionStorage = $stencilWindow.sessionStorage;

  var devicePixelRatio = $stencilWindow.devicePixelRatio;
  var innerHeight = $stencilWindow.innerHeight;
  var innerWidth = $stencilWindow.innerWidth;
  var origin = $stencilWindow.origin;
  var pageXOffset = $stencilWindow.pageXOffset;
  var pageYOffset = $stencilWindow.pageYOffset;
  var screen = $stencilWindow.screen;
  var screenLeft = $stencilWindow.screenLeft;
  var screenTop = $stencilWindow.screenTop;
  var screenX = $stencilWindow.screenX;
  var screenY = $stencilWindow.screenY;
  var scrollX = $stencilWindow.scrollX;
  var scrollY = $stencilWindow.scrollY;
  var exports = {};

  function hydrateAppClosure($stencilWindow) {
  const window = $stencilWindow;
  const document = $stencilWindow.document;
  /*hydrateAppClosure start*/


const NAMESPACE = 'app';

/*
 Stencil Hydrate Platform v1.13.0-4 | MIT Licensed | https://stenciljs.com
 */

const addHostEventListeners = (elm, hostRef, listeners, attachParentListeners) => {
    if ( listeners) {
        listeners.map(([flags, name, method]) => {
            const target =  getHostListenerTarget(elm, flags) ;
            const handler = hostListenerProxy(hostRef, method);
            const opts = hostListenerOpts(flags);
            plt.ael(target, name, handler, opts);
            (hostRef.$rmListeners$ = hostRef.$rmListeners$ || []).push(() => plt.rel(target, name, handler, opts));
        });
    }
};
const hostListenerProxy = (hostRef, methodName) => (ev) => {
    {
        if (hostRef.$flags$ & 256 /* isListenReady */) {
            // instance is ready, let's call it's member method for this event
            hostRef.$lazyInstance$[methodName](ev);
        }
        else {
            (hostRef.$queuedListeners$ = hostRef.$queuedListeners$ || []).push([methodName, ev]);
        }
    }
};
const getHostListenerTarget = (elm, flags) => {
    if ( flags & 8 /* TargetWindow */)
        return win;
    return elm;
};
// prettier-ignore
const hostListenerOpts = (flags) =>  (flags & 2 /* Capture */) !== 0;

const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const HYDRATE_ID = 's-id';
const HYDRATED_STYLE_ID = 'sty-id';
const HYDRATE_CHILD_ID = 'c-id';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const createTime = (fnName, tagName = '') => {
    {
        return () => {
            return;
        };
    }
};
const uniqueTime = (key, measureText) => {
    {
        return () => {
            return;
        };
    }
};

const rootAppliedStyles = new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = styles.get(scopeId);
    {
        style = cssText;
    }
    styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
    let scopeId =  getScopeId(cmpMeta.$tagName$);
    let style = styles.get(scopeId);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = styleContainerNode.nodeType === 11 /* DocumentFragment */ ? styleContainerNode : doc;
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, (appliedStyles = new Set()));
            }
            if (!appliedStyles.has(scopeId)) {
                if ( styleContainerNode.host && (styleElm = styleContainerNode.querySelector(`[${HYDRATED_STYLE_ID}="${scopeId}"]`))) {
                    // This is only happening on native shadow-dom, do not needs CSS var shim
                    styleElm.innerHTML = style;
                }
                else {
                    {
                        styleElm = doc.createElement('style');
                        styleElm.innerHTML = style;
                    }
                    {
                        styleElm.setAttribute(HYDRATED_STYLE_ID, scopeId);
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
    }
    return scopeId;
};
const attachStyles = (hostRef) => {
    const cmpMeta = hostRef.$cmpMeta$;
    const elm = hostRef.$hostElement$;
    const flags = cmpMeta.$flags$;
    const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
    const scopeId = addStyle( elm.getRootNode(), cmpMeta);
    if ( flags & 10 /* needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
        if ( flags & 2 /* scopedCssEncapsulation */) {
            elm.classList.add(scopeId + '-s');
        }
    }
    endAttachStyles();
};
const getScopeId = (tagName, mode) => 'sc-' + ( tagName);

/**
 * Default style mode id
 */
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};
/**
 * Namespaces
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';

const isDef = (v) => v != null;
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};

/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// const stack: any[] = [];
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let key = null;
    let slotName = null;
    let simple = false;
    let lastSimple = false;
    let vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if ((simple = typeof nodeName !== 'function' && !isComplexType(child))) {
                    child = String(child);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    if (vnodeData) {
        // normalize class / classname attributes
        if ( vnodeData.key) {
            key = vnodeData.key;
        }
        if ( vnodeData.name) {
            slotName = vnodeData.name;
        }
        {
            const classData = vnodeData.className || vnodeData.class;
            if (classData) {
                vnodeData.class =
                    typeof classData !== 'object'
                        ? classData
                        : Object.keys(classData)
                            .filter(k => classData[k])
                            .join(' ');
            }
        }
    }
    if ( typeof nodeName === 'function') {
        // nodeName is a functional component
        return nodeName(vnodeData === null ? {} : vnodeData, vNodeChildren, vdomFnUtils);
    }
    const vnode = newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    {
        vnode.$key$ = key;
    }
    {
        vnode.$name$ = slotName;
    }
    return vnode;
};
const newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null,
    };
    {
        vnode.$attrs$ = null;
    }
    {
        vnode.$key$ = null;
    }
    {
        vnode.$name$ = null;
    }
    return vnode;
};
const Host = {};
const isHost = (node) => node && node.$tag$ === Host;
const vdomFnUtils = {
    forEach: (children, cb) => children.map(convertToPublic).forEach(cb),
    map: (children, cb) => children
        .map(convertToPublic)
        .map(cb)
        .map(convertToPrivate),
};
const convertToPublic = (node) => ({
    vattrs: node.$attrs$,
    vchildren: node.$children$,
    vkey: node.$key$,
    vname: node.$name$,
    vtag: node.$tag$,
    vtext: node.$text$,
});
const convertToPrivate = (node) => {
    const vnode = newVNode(node.vtag, node.vtext);
    vnode.$attrs$ = node.vattrs;
    vnode.$children$ = node.vchildren;
    vnode.$key$ = node.vkey;
    vnode.$name$ = node.vname;
    return vnode;
};

/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
    if (oldValue !== newValue) {
        let isProp = isMemberInElement(elm, memberName);
        let ln = memberName.toLowerCase();
        if ( memberName === 'class') {
            const classList = elm.classList;
            const oldClasses = parseClassList(oldValue);
            const newClasses = parseClassList(newValue);
            classList.remove(...oldClasses.filter(c => c && !newClasses.includes(c)));
            classList.add(...newClasses.filter(c => c && !oldClasses.includes(c)));
        }
        else if ( memberName === 'style') {
            // update style attribute, css properties and values
            {
                for (const prop in oldValue) {
                    if (!newValue || newValue[prop] == null) {
                        {
                            elm.style[prop] = '';
                        }
                    }
                }
            }
            for (const prop in newValue) {
                if (!oldValue || newValue[prop] !== oldValue[prop]) {
                    {
                        elm.style[prop] = newValue[prop];
                    }
                }
            }
        }
        else if ( memberName === 'key') ;
        else if ( memberName === 'ref') {
            // minifier will clean this up
            if (newValue) {
                newValue(elm);
            }
        }
        else if ( ( !isProp ) && memberName[0] === 'o' && memberName[1] === 'n') {
            // Event Handlers
            // so if the member name starts with "on" and the 3rd characters is
            // a capital letter, and it's not already a member on the element,
            // then we're assuming it's an event listener
            if (memberName[2] === '-') {
                // on- prefixed events
                // allows to be explicit about the dom event to listen without any magic
                // under the hood:
                // <my-cmp on-click> // listens for "click"
                // <my-cmp on-Click> // listens for "Click"
                // <my-cmp on-ionChange> // listens for "ionChange"
                // <my-cmp on-EVENTS> // listens for "EVENTS"
                memberName = memberName.slice(3);
            }
            else if (isMemberInElement(win, ln)) {
                // standard event
                // the JSX attribute could have been "onMouseOver" and the
                // member name "onmouseover" is on the window's prototype
                // so let's add the listener "mouseover", which is all lowercased
                memberName = ln.slice(2);
            }
            else {
                // custom event
                // the JSX attribute could have been "onMyCustomEvent"
                // so let's trim off the "on" prefix and lowercase the first character
                // and add the listener "myCustomEvent"
                // except for the first character, we keep the event name case
                memberName = ln[2] + memberName.slice(3);
            }
            if (oldValue) {
                plt.rel(elm, memberName, oldValue, false);
            }
            if (newValue) {
                plt.ael(elm, memberName, newValue, false);
            }
        }
        else {
            // Set property if it exists and it's not a SVG
            const isComplex = isComplexType(newValue);
            if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
                try {
                    if (!elm.tagName.includes('-')) {
                        let n = newValue == null ? '' : newValue;
                        // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                        if (memberName === 'list') {
                            isProp = false;
                            // tslint:disable-next-line: triple-equals
                        }
                        else if (oldValue == null || elm[memberName] != n) {
                            elm[memberName] = n;
                        }
                    }
                    else {
                        elm[memberName] = newValue;
                    }
                }
                catch (e) { }
            }
            /**
             * Need to manually update attribute if:
             * - memberName is not an attribute
             * - if we are rendering the host element in order to reflect attribute
             * - if it's a SVG, since properties might not work in <svg>
             * - if the newValue is null/undefined or 'false'.
             */
            let xlink = false;
            {
                if (ln !== (ln = ln.replace(/^xlink\:?/, ''))) {
                    memberName = ln;
                    xlink = true;
                }
            }
            if (newValue == null || newValue === false) {
                if ( xlink) {
                    elm.removeAttributeNS(XLINK_NS, memberName);
                }
                else {
                    elm.removeAttribute(memberName);
                }
            }
            else if ((!isProp || flags & 4 /* isHost */ || isSvg) && !isComplex) {
                newValue = newValue === true ? '' : newValue;
                if ( xlink) {
                    elm.setAttributeNS(XLINK_NS, memberName, newValue);
                }
                else {
                    elm.setAttribute(memberName, newValue);
                }
            }
        }
    }
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => (!value ? [] : value.split(parseClassListRegex));

const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = newVnode.$elm$.nodeType === 11 /* DocumentFragment */ && newVnode.$elm$.host ? newVnode.$elm$.host : newVnode.$elm$;
    const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
    {
        // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
            if (!(memberName in newVnodeAttrs)) {
                setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
            }
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
    }
};

let scopeId;
let contentRef;
let hostTagName;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    // tslint:disable-next-line: prefer-const
    let newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    let oldVNode;
    if ( !useNativeShadowDom) {
        // remember for later we need to check to relocate nodes
        checkSlotRelocate = true;
        if (newVNode.$tag$ === 'slot') {
            if (scopeId) {
                // scoped css needs to add its scoped id to the parent element
                parentElm.classList.add(scopeId + '-s');
            }
            newVNode.$flags$ |= newVNode.$children$
                ? // slot element has fallback content
                    2 /* isSlotFallback */
                : // slot element does not have fallback content
                    1 /* isSlotReference */;
        }
    }
    if ( newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
    }
    else if ( newVNode.$flags$ & 1 /* isSlotReference */) {
        // create a slot reference node
        elm = newVNode.$elm$ =  slotReferenceDebugNode(newVNode) ;
    }
    else {
        if ( !isSvgMode) {
            isSvgMode = newVNode.$tag$ === 'svg';
        }
        // create element
        elm = newVNode.$elm$ = ( doc.createElementNS(isSvgMode ? SVG_NS : HTML_NS,  newVNode.$flags$ & 2 /* isSlotFallback */ ? 'slot-fb' : newVNode.$tag$)
            );
        if ( isSvgMode && newVNode.$tag$ === 'foreignObject') {
            isSvgMode = false;
        }
        // add css classes, attrs, props, listeners, etc.
        {
            updateElement(null, newVNode, isSvgMode);
        }
        if ( isDef(scopeId) && elm['s-si'] !== scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i, elm);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.appendChild(childNode);
                }
            }
        }
        {
            if (newVNode.$tag$ === 'svg') {
                // Only reset the SVG context when we're exiting <svg> element
                isSvgMode = false;
            }
            else if (elm.tagName === 'foreignObject') {
                // Reenter SVG context when we're exiting <foreignObject> element
                isSvgMode = true;
            }
        }
    }
    {
        elm['s-hn'] = hostTagName;
        if (newVNode.$flags$ & (2 /* isSlotFallback */ | 1 /* isSlotReference */)) {
            // remember the content reference comment
            elm['s-sr'] = true;
            // remember the content reference comment
            elm['s-cr'] = contentRef;
            // remember the slot name, or empty string for default slot
            elm['s-sn'] = newVNode.$name$ || '';
            // check if we've got an old vnode for this slot
            oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];
            if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
                // we've got an old slot vnode and the wrapper is being replaced
                // so let's move the old slot content back to it's original location
                putBackInOriginalLocation(oldParentVNode.$elm$, false);
            }
        }
    }
    return elm;
};
const putBackInOriginalLocation = (parentElm, recursive) => {
    plt.$flags$ |= 1 /* isTmpDisconnected */;
    const oldSlotChildNodes = parentElm.childNodes;
    for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
        const childNode = oldSlotChildNodes[i];
        if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
            // // this child node in the old element is from another component
            // // remove this node from the old slot's parent
            // childNode.remove();
            // and relocate it back to it's original location
            parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode));
            // remove the old original location comment entirely
            // later on the patch function will know what to do
            // and move this to the correct spot in need be
            childNode['s-ol'].remove();
            childNode['s-ol'] = undefined;
            checkSlotRelocate = true;
        }
        if (recursive) {
            putBackInOriginalLocation(childNode, recursive);
        }
    }
    plt.$flags$ &= ~1 /* isTmpDisconnected */;
};
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = (( parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm);
    let childNode;
    if ( containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx, parentElm);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode,  referenceNode(before) );
            }
        }
    }
};
const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
    for (; startIdx <= endIdx; ++startIdx) {
        if ((vnode = vnodes[startIdx])) {
            elm = vnode.$elm$;
            callNodeRefs(vnode);
            {
                // we're removing this element
                // so it's possible we need to show slot fallback content now
                checkSlotFallbackVisibility = true;
                if (elm['s-ol']) {
                    // remove the original location comment
                    elm['s-ol'].remove();
                }
                else {
                    // it's possible that child nodes of the node
                    // that's being removed are slot nodes
                    putBackInOriginalLocation(elm, true);
                }
            }
            // remove the vnode's element from the dom
            elm.remove();
        }
    }
};
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let idxInOld = 0;
    let i = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    let elmToMove;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // Vnode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            if ( (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
            }
            patch(oldStartVnode, newEndVnode);
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            if ( (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
            }
            patch(oldEndVnode, newStartVnode);
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            // createKeyToOldIdx
            idxInOld = -1;
            {
                for (i = oldStartIdx; i <= oldEndIdx; ++i) {
                    if (oldCh[i] && oldCh[i].$key$ !== null && oldCh[i].$key$ === newStartVnode.$key$) {
                        idxInOld = i;
                        break;
                    }
                }
            }
            if ( idxInOld >= 0) {
                elmToMove = oldCh[idxInOld];
                if (elmToMove.$tag$ !== newStartVnode.$tag$) {
                    node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);
                }
                else {
                    patch(elmToMove, newStartVnode);
                    oldCh[idxInOld] = undefined;
                    node = elmToMove.$elm$;
                }
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                // new element
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                {
                    parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$, newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if ( newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
};
const isSameVnode = (vnode1, vnode2) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (vnode1.$tag$ === vnode2.$tag$) {
        if ( vnode1.$tag$ === 'slot') {
            return vnode1.$name$ === vnode2.$name$;
        }
        {
            return vnode1.$key$ === vnode2.$key$;
        }
    }
    return false;
};
const referenceNode = (node) => {
    // this node was relocated to a new location in the dom
    // because of some other component's slot
    // but we still have an html comment in place of where
    // it's original location was according to it's original vdom
    return (node && node['s-ol']) || node;
};
const parentReferenceNode = (node) => (node['s-ol'] ? node['s-ol'] : node).parentNode;
const patch = (oldVNode, newVNode) => {
    const elm = (newVNode.$elm$ = oldVNode.$elm$);
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    const tag = newVNode.$tag$;
    const text = newVNode.$text$;
    let defaultHolder;
    if ( text === null) {
        {
            // test if we're rendering an svg element, or still rendering nodes inside of one
            // only add this to the when the compiler sees we're using an svg somewhere
            isSvgMode = tag === 'svg' ? true : tag === 'foreignObject' ? false : isSvgMode;
        }
        // element node
        {
            if ( tag === 'slot') ;
            else {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(oldVNode, newVNode, isSvgMode);
            }
        }
        if ( oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if ( oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if ( oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
        if ( isSvgMode && tag === 'svg') {
            isSvgMode = false;
        }
    }
    else if ( (defaultHolder = elm['s-cr'])) {
        // this element has slotted content
        defaultHolder.parentNode.textContent = text;
    }
    else if ( oldVNode.$text$ !== text) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.data = text;
    }
};
const updateFallbackSlotVisibility = (elm) => {
    // tslint:disable-next-line: prefer-const
    let childNodes = elm.childNodes;
    let childNode;
    let i;
    let ilen;
    let j;
    let slotNameAttr;
    let nodeType;
    for (i = 0, ilen = childNodes.length; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode.nodeType === 1 /* ElementNode */) {
            if (childNode['s-sr']) {
                // this is a slot fallback node
                // get the slot name for this slot reference node
                slotNameAttr = childNode['s-sn'];
                // by default always show a fallback slot node
                // then hide it if there are other slots in the light dom
                childNode.hidden = false;
                for (j = 0; j < ilen; j++) {
                    if (childNodes[j]['s-hn'] !== childNode['s-hn']) {
                        // this sibling node is from a different component
                        nodeType = childNodes[j].nodeType;
                        if (slotNameAttr !== '') {
                            // this is a named fallback slot node
                            if (nodeType === 1 /* ElementNode */ && slotNameAttr === childNodes[j].getAttribute('slot')) {
                                childNode.hidden = true;
                                break;
                            }
                        }
                        else {
                            // this is a default fallback slot node
                            // any element or text node (with content)
                            // should hide the default fallback slot node
                            if (nodeType === 1 /* ElementNode */ || (nodeType === 3 /* TextNode */ && childNodes[j].textContent.trim() !== '')) {
                                childNode.hidden = true;
                                break;
                            }
                        }
                    }
                }
            }
            // keep drilling down
            updateFallbackSlotVisibility(childNode);
        }
    }
};
const relocateNodes = [];
const relocateSlotContent = (elm) => {
    // tslint:disable-next-line: prefer-const
    let childNode;
    let node;
    let hostContentNodes;
    let slotNameAttr;
    let relocateNodeData;
    let j;
    let i = 0;
    let childNodes = elm.childNodes;
    let ilen = childNodes.length;
    for (; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && (node = childNode['s-cr'])) {
            // first got the content reference comment node
            // then we got it's parent, which is where all the host content is in now
            hostContentNodes = node.parentNode.childNodes;
            slotNameAttr = childNode['s-sn'];
            for (j = hostContentNodes.length - 1; j >= 0; j--) {
                node = hostContentNodes[j];
                if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
                    // let's do some relocating to its new home
                    // but never relocate a content reference node
                    // that is suppose to always represent the original content location
                    if (isNodeLocatedInSlot(node, slotNameAttr)) {
                        // it's possible we've already decided to relocate this node
                        relocateNodeData = relocateNodes.find(r => r.$nodeToRelocate$ === node);
                        // made some changes to slots
                        // let's make sure we also double check
                        // fallbacks are correctly hidden or shown
                        checkSlotFallbackVisibility = true;
                        node['s-sn'] = node['s-sn'] || slotNameAttr;
                        if (relocateNodeData) {
                            // previously we never found a slot home for this node
                            // but turns out we did, so let's remember it now
                            relocateNodeData.$slotRefNode$ = childNode;
                        }
                        else {
                            // add to our list of nodes to relocate
                            relocateNodes.push({
                                $slotRefNode$: childNode,
                                $nodeToRelocate$: node,
                            });
                        }
                        if (node['s-sr']) {
                            relocateNodes.map(relocateNode => {
                                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                                    relocateNodeData = relocateNodes.find(r => r.$nodeToRelocate$ === node);
                                    if (relocateNodeData && !relocateNode.$slotRefNode$) {
                                        relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                                    }
                                }
                            });
                        }
                    }
                    else if (!relocateNodes.some(r => r.$nodeToRelocate$ === node)) {
                        // so far this element does not have a slot home, not setting slotRefNode on purpose
                        // if we never find a home for this element then we'll need to hide it
                        relocateNodes.push({
                            $nodeToRelocate$: node,
                        });
                    }
                }
            }
        }
        if (childNode.nodeType === 1 /* ElementNode */) {
            relocateSlotContent(childNode);
        }
    }
};
const isNodeLocatedInSlot = (nodeToRelocate, slotNameAttr) => {
    if (nodeToRelocate.nodeType === 1 /* ElementNode */) {
        if (nodeToRelocate.getAttribute('slot') === null && slotNameAttr === '') {
            return true;
        }
        if (nodeToRelocate.getAttribute('slot') === slotNameAttr) {
            return true;
        }
        return false;
    }
    if (nodeToRelocate['s-sn'] === slotNameAttr) {
        return true;
    }
    return slotNameAttr === '';
};
const callNodeRefs = (vNode) => {
    {
        vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
        vNode.$children$ && vNode.$children$.map(callNodeRefs);
    }
};
const renderVdom = (hostRef, renderFnResults) => {
    const hostElm = hostRef.$hostElement$;
    const cmpMeta = hostRef.$cmpMeta$;
    const oldVNode = hostRef.$vnode$ || newVNode(null, null);
    const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
    hostTagName = hostElm.tagName;
    if ( cmpMeta.$attrsToReflect$) {
        rootVnode.$attrs$ = rootVnode.$attrs$ || {};
        cmpMeta.$attrsToReflect$.map(([propName, attribute]) => (rootVnode.$attrs$[attribute] = hostElm[propName]));
    }
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = ( hostElm.shadowRoot || hostElm );
    {
        scopeId = hostElm['s-sc'];
    }
    {
        contentRef = hostElm['s-cr'];
        useNativeShadowDom = supportsShadow ;
        // always reset
        checkSlotFallbackVisibility = false;
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
    {
        // while we're moving nodes around existing nodes, temporarily disable
        // the disconnectCallback from working
        plt.$flags$ |= 1 /* isTmpDisconnected */;
        if (checkSlotRelocate) {
            relocateSlotContent(rootVnode.$elm$);
            let relocateData;
            let nodeToRelocate;
            let orgLocationNode;
            let parentNodeRef;
            let insertBeforeNode;
            let refNode;
            let i = 0;
            for (; i < relocateNodes.length; i++) {
                relocateData = relocateNodes[i];
                nodeToRelocate = relocateData.$nodeToRelocate$;
                if (!nodeToRelocate['s-ol']) {
                    // add a reference node marking this node's original location
                    // keep a reference to this node for later lookups
                    orgLocationNode =  originalLocationDebugNode(nodeToRelocate) ;
                    orgLocationNode['s-nr'] = nodeToRelocate;
                    nodeToRelocate.parentNode.insertBefore((nodeToRelocate['s-ol'] = orgLocationNode), nodeToRelocate);
                }
            }
            for (i = 0; i < relocateNodes.length; i++) {
                relocateData = relocateNodes[i];
                nodeToRelocate = relocateData.$nodeToRelocate$;
                if (relocateData.$slotRefNode$) {
                    // by default we're just going to insert it directly
                    // after the slot reference node
                    parentNodeRef = relocateData.$slotRefNode$.parentNode;
                    insertBeforeNode = relocateData.$slotRefNode$.nextSibling;
                    orgLocationNode = nodeToRelocate['s-ol'];
                    while ((orgLocationNode = orgLocationNode.previousSibling)) {
                        refNode = orgLocationNode['s-nr'];
                        if (refNode && refNode['s-sn'] === nodeToRelocate['s-sn'] && parentNodeRef === refNode.parentNode) {
                            refNode = refNode.nextSibling;
                            if (!refNode || !refNode['s-nr']) {
                                insertBeforeNode = refNode;
                                break;
                            }
                        }
                    }
                    if ((!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode) || nodeToRelocate.nextSibling !== insertBeforeNode) {
                        // we've checked that it's worth while to relocate
                        // since that the node to relocate
                        // has a different next sibling or parent relocated
                        if (nodeToRelocate !== insertBeforeNode) {
                            if (!nodeToRelocate['s-hn'] && nodeToRelocate['s-ol']) {
                                // probably a component in the index.html that doesn't have it's hostname set
                                nodeToRelocate['s-hn'] = nodeToRelocate['s-ol'].parentNode.nodeName;
                            }
                            // add it back to the dom but in its new home
                            parentNodeRef.insertBefore(nodeToRelocate, insertBeforeNode);
                        }
                    }
                }
                else {
                    // this node doesn't have a slot home to go to, so let's hide it
                    if (nodeToRelocate.nodeType === 1 /* ElementNode */) {
                        nodeToRelocate.hidden = true;
                    }
                }
            }
        }
        if (checkSlotFallbackVisibility) {
            updateFallbackSlotVisibility(rootVnode.$elm$);
        }
        // done moving nodes around
        // allow the disconnect callback to work again
        plt.$flags$ &= ~1 /* isTmpDisconnected */;
        // always reset
        relocateNodes.length = 0;
    }
};
// slot comment debug nodes only created with the `--debug` flag
// otherwise these nodes are text nodes w/out content
const slotReferenceDebugNode = (slotVNode) => doc.createComment(`<slot${slotVNode.$name$ ? ' name="' + slotVNode.$name$ + '"' : ''}> (host=${hostTagName.toLowerCase()})`);
const originalLocationDebugNode = (nodeToRelocate) => doc.createComment(`org-location for ` + (nodeToRelocate.localName ? `<${nodeToRelocate.localName}> (host=${nodeToRelocate['s-hn']})` : `[${nodeToRelocate.textContent}]`));

const getElement = (ref) => ( getHostRef(ref).$hostElement$ );

const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            return emitEvent(elm, name, {
                bubbles: !!(flags & 4 /* Bubbles */),
                composed: !!(flags & 2 /* Composed */),
                cancelable: !!(flags & 1 /* Cancellable */),
                detail,
            });
        },
    };
};
const emitEvent = (elm, name, opts) => {
    const ev = new ( win.CustomEvent )(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};

const attachToAncestor = (hostRef, ancestorComponent) => {
    if ( ancestorComponent && !hostRef.$onRenderResolve$ && ancestorComponent['s-p']) {
        ancestorComponent['s-p'].push(new Promise(r => (hostRef.$onRenderResolve$ = r)));
    }
};
const scheduleUpdate = (hostRef, isInitialLoad) => {
    {
        hostRef.$flags$ |= 16 /* isQueuedForUpdate */;
    }
    if ( hostRef.$flags$ & 4 /* isWaitingForChildren */) {
        hostRef.$flags$ |= 512 /* needsRerender */;
        return;
    }
    attachToAncestor(hostRef, hostRef.$ancestorComponent$);
    // there is no ancestorc omponent or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    const dispatch = () => dispatchHooks(hostRef, isInitialLoad);
    return  writeTask(dispatch) ;
};
const dispatchHooks = (hostRef, isInitialLoad) => {
    const endSchedule = createTime('scheduleUpdate', hostRef.$cmpMeta$.$tagName$);
    const instance =  hostRef.$lazyInstance$ ;
    let promise;
    if (isInitialLoad) {
        {
            hostRef.$flags$ |= 256 /* isListenReady */;
            if (hostRef.$queuedListeners$) {
                hostRef.$queuedListeners$.map(([methodName, event]) => safeCall(instance, methodName, event));
                hostRef.$queuedListeners$ = null;
            }
        }
        {
            promise = safeCall(instance, 'componentWillLoad');
        }
    }
    endSchedule();
    return then(promise, () => (updateComponent(hostRef, instance, isInitialLoad)));
};
const updateComponent = (hostRef, instance, isInitialLoad) => {
    // updateComponent
    const elm = hostRef.$hostElement$;
    const endUpdate = createTime('update', hostRef.$cmpMeta$.$tagName$);
    const rc = elm['s-rc'];
    if ( isInitialLoad) {
        // DOM WRITE!
        attachStyles(hostRef);
    }
    const endRender = createTime('render', hostRef.$cmpMeta$.$tagName$);
    {
        {
            // looks like we've got child nodes to render into this host element
            // or we need to update the css class/attrs on the host element
            // DOM WRITE!
            renderVdom(hostRef, callRender(instance));
        }
    }
    {
        hostRef.$flags$ &= ~16 /* isQueuedForUpdate */;
    }
    {
        try {
            // manually connected child components during server-side hydrate
            serverSideConnected(elm);
            if (isInitialLoad) {
                // using only during server-side hydrate
                if (hostRef.$cmpMeta$.$flags$ & 1 /* shadowDomEncapsulation */) {
                    elm['s-en'] = '';
                }
                else if (hostRef.$cmpMeta$.$flags$ & 2 /* scopedCssEncapsulation */) {
                    elm['s-en'] = 'c';
                }
            }
        }
        catch (e) {
            consoleError(e);
        }
    }
    {
        hostRef.$flags$ |= 2 /* hasRendered */;
    }
    if ( rc) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        rc.map(cb => cb());
        elm['s-rc'] = undefined;
    }
    endRender();
    endUpdate();
    {
        const childrenPromises = elm['s-p'];
        const postUpdate = () => postUpdateComponent(hostRef);
        if (childrenPromises.length === 0) {
            postUpdate();
        }
        else {
            Promise.all(childrenPromises).then(postUpdate);
            hostRef.$flags$ |= 4 /* isWaitingForChildren */;
            childrenPromises.length = 0;
        }
    }
};
let renderingRef = null;
const callRender = (instance) => {
    try {
        renderingRef = instance;
        instance =  instance.render() ;
    }
    catch (e) {
        consoleError(e);
    }
    renderingRef = null;
    return instance;
};
const getRenderingRef = () => renderingRef;
const postUpdateComponent = (hostRef) => {
    const tagName = hostRef.$cmpMeta$.$tagName$;
    const elm = hostRef.$hostElement$;
    const endPostUpdate = createTime('postUpdate', tagName);
    const instance =  hostRef.$lazyInstance$ ;
    const ancestorComponent = hostRef.$ancestorComponent$;
    if (!(hostRef.$flags$ & 64 /* hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* hasLoadedComponent */;
        {
            // DOM WRITE!
            addHydratedFlag(elm);
        }
        {
            safeCall(instance, 'componentDidLoad');
        }
        endPostUpdate();
        {
            hostRef.$onReadyResolve$(elm);
            if (!ancestorComponent) {
                appDidLoad();
            }
        }
    }
    else {
        {
            safeCall(instance, 'componentDidUpdate');
        }
        endPostUpdate();
    }
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    {
        if (hostRef.$onRenderResolve$) {
            hostRef.$onRenderResolve$();
            hostRef.$onRenderResolve$ = undefined;
        }
        if (hostRef.$flags$ & 512 /* needsRerender */) {
            nextTick(() => scheduleUpdate(hostRef, false));
        }
        hostRef.$flags$ &= ~(4 /* isWaitingForChildren */ | 512 /* needsRerender */);
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
const forceUpdate = (ref) => {
    {
        const hostRef = getHostRef(ref);
        const isConnected = hostRef.$hostElement$.isConnected;
        if (isConnected && (hostRef.$flags$ & (2 /* hasRendered */ | 16 /* isQueuedForUpdate */)) === 2 /* hasRendered */) {
            scheduleUpdate(hostRef, false);
        }
        // Returns "true" when the forced update was successfully scheduled
        return isConnected;
    }
};
const appDidLoad = (who) => {
    // on appload
    // we have finish the first big initial render
    {
        addHydratedFlag(doc.documentElement);
    }
    nextTick(() => emitEvent(win, 'appload', { detail: { namespace: NAMESPACE } }));
};
const safeCall = (instance, method, arg) => {
    if (instance && instance[method]) {
        try {
            return instance[method](arg);
        }
        catch (e) {
            consoleError(e);
        }
    }
    return undefined;
};
const then = (promise, thenFn) => {
    return promise && promise.then ? promise.then(thenFn) : thenFn();
};
const addHydratedFlag = (elm) => ( elm.classList.add('hydrated') );
const serverSideConnected = (elm) => {
    const children = elm.children;
    if (children != null) {
        for (let i = 0, ii = children.length; i < ii; i++) {
            const childElm = children[i];
            if (typeof childElm.connectedCallback === 'function') {
                childElm.connectedCallback();
            }
            serverSideConnected(childElm);
        }
    }
};

const initializeClientHydrate = (hostElm, tagName, hostId, hostRef) => {
    const endHydrate = createTime('hydrateClient', tagName);
    const shadowRoot = hostElm.shadowRoot;
    const childRenderNodes = [];
    const slotNodes = [];
    const shadowRootNodes =  shadowRoot ? [] : null;
    const vnode = (hostRef.$vnode$ = newVNode(tagName, null));
    if (!plt.$orgLocNodes$) {
        initializeDocumentHydrate(doc.body, (plt.$orgLocNodes$ = new Map()));
    }
    hostElm[HYDRATE_ID] = hostId;
    hostElm.removeAttribute(HYDRATE_ID);
    clientHydrate(vnode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, hostElm, hostId);
    childRenderNodes.map(c => {
        const orgLocationId = c.$hostId$ + '.' + c.$nodeId$;
        const orgLocationNode = plt.$orgLocNodes$.get(orgLocationId);
        const node = c.$elm$;
        if (orgLocationNode && supportsShadow && orgLocationNode['s-en'] === '') {
            orgLocationNode.parentNode.insertBefore(node, orgLocationNode.nextSibling);
        }
        if (!shadowRoot) {
            node['s-hn'] = tagName;
            if (orgLocationNode) {
                node['s-ol'] = orgLocationNode;
                node['s-ol']['s-nr'] = node;
            }
        }
        plt.$orgLocNodes$.delete(orgLocationId);
    });
    if ( shadowRoot) {
        shadowRootNodes.map(shadowRootNode => {
            if (shadowRootNode) {
                shadowRoot.appendChild(shadowRootNode);
            }
        });
    }
    endHydrate();
};
const clientHydrate = (parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node, hostId) => {
    let childNodeType;
    let childIdSplt;
    let childVNode;
    let i;
    if (node.nodeType === 1 /* ElementNode */) {
        childNodeType = node.getAttribute(HYDRATE_CHILD_ID);
        if (childNodeType) {
            // got the node data from the element's attribute
            // `${hostId}.${nodeId}.${depth}.${index}`
            childIdSplt = childNodeType.split('.');
            if (childIdSplt[0] === hostId || childIdSplt[0] === '0') {
                childVNode = {
                    $flags$: 0,
                    $hostId$: childIdSplt[0],
                    $nodeId$: childIdSplt[1],
                    $depth$: childIdSplt[2],
                    $index$: childIdSplt[3],
                    $tag$: node.tagName.toLowerCase(),
                    $elm$: node,
                    $attrs$: null,
                    $children$: null,
                    $key$: null,
                    $name$: null,
                    $text$: null,
                };
                childRenderNodes.push(childVNode);
                node.removeAttribute(HYDRATE_CHILD_ID);
                // this is a new child vnode
                // so ensure its parent vnode has the vchildren array
                if (!parentVNode.$children$) {
                    parentVNode.$children$ = [];
                }
                // add our child vnode to a specific index of the vnode's children
                parentVNode.$children$[childVNode.$index$] = childVNode;
                // this is now the new parent vnode for all the next child checks
                parentVNode = childVNode;
                if (shadowRootNodes && childVNode.$depth$ === '0') {
                    shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                }
            }
        }
        // recursively drill down, end to start so we can remove nodes
        for (i = node.childNodes.length - 1; i >= 0; i--) {
            clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.childNodes[i], hostId);
        }
        if (node.shadowRoot) {
            // keep drilling down through the shadow root nodes
            for (i = node.shadowRoot.childNodes.length - 1; i >= 0; i--) {
                clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.shadowRoot.childNodes[i], hostId);
            }
        }
    }
    else if (node.nodeType === 8 /* CommentNode */) {
        // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}`
        childIdSplt = node.nodeValue.split('.');
        if (childIdSplt[1] === hostId || childIdSplt[1] === '0') {
            // comment node for either the host id or a 0 host id
            childNodeType = childIdSplt[0];
            childVNode = {
                $flags$: 0,
                $hostId$: childIdSplt[1],
                $nodeId$: childIdSplt[2],
                $depth$: childIdSplt[3],
                $index$: childIdSplt[4],
                $elm$: node,
                $attrs$: null,
                $children$: null,
                $key$: null,
                $name$: null,
                $tag$: null,
                $text$: null,
            };
            if (childNodeType === TEXT_NODE_ID) {
                childVNode.$elm$ = node.nextSibling;
                if (childVNode.$elm$ && childVNode.$elm$.nodeType === 3 /* TextNode */) {
                    childVNode.$text$ = childVNode.$elm$.textContent;
                    childRenderNodes.push(childVNode);
                    // remove the text comment since it's no longer needed
                    node.remove();
                    if (!parentVNode.$children$) {
                        parentVNode.$children$ = [];
                    }
                    parentVNode.$children$[childVNode.$index$] = childVNode;
                    if (shadowRootNodes && childVNode.$depth$ === '0') {
                        shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                    }
                }
            }
            else if (childVNode.$hostId$ === hostId) {
                // this comment node is specifcally for this host id
                if (childNodeType === SLOT_NODE_ID) {
                    // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}`;
                    childVNode.$tag$ = 'slot';
                    if (childIdSplt[5]) {
                        node['s-sn'] = childVNode.$name$ = childIdSplt[5];
                    }
                    else {
                        node['s-sn'] = '';
                    }
                    node['s-sr'] = true;
                    if ( shadowRootNodes) {
                        // browser support shadowRoot and this is a shadow dom component
                        // create an actual slot element
                        childVNode.$elm$ = doc.createElement(childVNode.$tag$);
                        if (childVNode.$name$) {
                            // add the slot name attribute
                            childVNode.$elm$.setAttribute('name', childVNode.$name$);
                        }
                        // insert the new slot element before the slot comment
                        node.parentNode.insertBefore(childVNode.$elm$, node);
                        // remove the slot comment since it's not needed for shadow
                        node.remove();
                        if (childVNode.$depth$ === '0') {
                            shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                        }
                    }
                    slotNodes.push(childVNode);
                    if (!parentVNode.$children$) {
                        parentVNode.$children$ = [];
                    }
                    parentVNode.$children$[childVNode.$index$] = childVNode;
                }
                else if (childNodeType === CONTENT_REF_ID) {
                    // `${CONTENT_REF_ID}.${hostId}`;
                    if ( shadowRootNodes) {
                        // remove the content ref comment since it's not needed for shadow
                        node.remove();
                    }
                    else {
                        hostElm['s-cr'] = node;
                        node['s-cn'] = true;
                    }
                }
            }
        }
    }
    else if (parentVNode && parentVNode.$tag$ === 'style') {
        const vnode = newVNode(null, node.textContent);
        vnode.$elm$ = node;
        vnode.$index$ = '0';
        parentVNode.$children$ = [vnode];
    }
};
const initializeDocumentHydrate = (node, orgLocNodes) => {
    if (node.nodeType === 1 /* ElementNode */) {
        let i = 0;
        for (; i < node.childNodes.length; i++) {
            initializeDocumentHydrate(node.childNodes[i], orgLocNodes);
        }
        if (node.shadowRoot) {
            for (i = 0; i < node.shadowRoot.childNodes.length; i++) {
                initializeDocumentHydrate(node.shadowRoot.childNodes[i], orgLocNodes);
            }
        }
    }
    else if (node.nodeType === 8 /* CommentNode */) {
        const childIdSplt = node.nodeValue.split('.');
        if (childIdSplt[0] === ORG_LOCATION_ID) {
            orgLocNodes.set(childIdSplt[1] + '.' + childIdSplt[2], node);
            node.nodeValue = '';
            // useful to know if the original location is
            // the root light-dom of a shadow dom component
            node['s-en'] = childIdSplt[3];
        }
    }
};

const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if ( propType & 4 /* Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return propValue === 'false' ? false : propValue === '' || !!propValue;
        }
        if ( propType & 1 /* String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};

const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance =  hostRef.$lazyInstance$ ;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    if (( !(flags & 8 /* isConstructingInstance */) || oldVal === undefined) && newVal !== oldVal) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if ( instance) {
            // get an array of method names of watch functions to call
            if ( cmpMeta.$watchers$ && flags & 128 /* isWatchReady */) {
                const watchMethods = cmpMeta.$watchers$[propName];
                if (watchMethods) {
                    // this instance is watching for when this property changed
                    watchMethods.map(watchMethodName => {
                        try {
                            // fire off each of the watch methods that are watching this property
                            instance[watchMethodName](newVal, oldVal, propName);
                        }
                        catch (e) {
                            consoleError(e);
                        }
                    });
                }
            }
            if ( (flags & (2 /* hasRendered */ | 16 /* isQueuedForUpdate */)) === 2 /* hasRendered */) {
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(hostRef, false);
            }
        }
    }
};

const proxyComponent = (Cstr, cmpMeta, flags) => {
    if ( cmpMeta.$members$) {
        if ( Cstr.watchers) {
            cmpMeta.$watchers$ = Cstr.watchers;
        }
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        const prototype = Cstr.prototype;
        members.map(([memberName, [memberFlags]]) => {
            if ( (memberFlags & 31 /* Prop */ || (( flags & 2 /* proxyState */) && memberFlags & 32 /* State */))) {
                // proxyComponent - prop
                Object.defineProperty(prototype, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
        });
        if ( ( flags & 1 /* isElementConstructor */)) {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
                plt.jmp(() => {
                    const propName = attrNameToPropName.get(attrName);
                    this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
                });
            };
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            Cstr.observedAttributes = members
                .filter(([_, m]) => m[0] & 15 /* HasAttribute */) // filter to only keep props that should match attributes
                .map(([propName, m]) => {
                const attrName = m[1] || propName;
                attrNameToPropName.set(attrName, propName);
                if ( m[0] & 512 /* ReflectAttr */) {
                    cmpMeta.$attrsToReflect$.push([propName, attrName]);
                }
                return attrName;
            });
        }
    }
    return Cstr;
};

const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
    // initializeComponent
    if ( (hostRef.$flags$ & 32 /* hasInitializedComponent */) === 0) {
        // we haven't initialized this element yet
        hostRef.$flags$ |= 32 /* hasInitializedComponent */;
        if ( hostRef.$modeName$) {
            elm.setAttribute('s-mode', hostRef.$modeName$);
        }
        {
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            Cstr = loadModule(cmpMeta);
            if (Cstr.then) {
                // Await creates a micro-task avoid if possible
                const endLoad = uniqueTime();
                Cstr = await Cstr;
                endLoad();
            }
            if ( !Cstr.isProxied) {
                // we'eve never proxied this Constructor before
                // let's add the getters/setters to its prototype before
                // the first time we create an instance of the implementation
                {
                    cmpMeta.$watchers$ = Cstr.watchers;
                }
                proxyComponent(Cstr, cmpMeta, 2 /* proxyState */);
                Cstr.isProxied = true;
            }
            const endNewInstance = createTime('createInstance', cmpMeta.$tagName$);
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
            {
                hostRef.$flags$ |= 8 /* isConstructingInstance */;
            }
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
                new Cstr(hostRef);
            }
            catch (e) {
                consoleError(e);
            }
            {
                hostRef.$flags$ &= ~8 /* isConstructingInstance */;
            }
            {
                hostRef.$flags$ |= 128 /* isWatchReady */;
            }
            endNewInstance();
            fireConnectedCallback(hostRef.$lazyInstance$);
        }
        const scopeId =  getScopeId(cmpMeta.$tagName$);
        if ( !styles.has(scopeId) && Cstr.style) {
            const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            registerStyle(scopeId, style);
            endRegisterStyles();
        }
    }
    // we've successfully created a lazy instance
    const ancestorComponent = hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(hostRef, true);
    if ( ancestorComponent && ancestorComponent['s-rc']) {
        // this is the intial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        ancestorComponent['s-rc'].push(schedule);
    }
    else {
        schedule();
    }
};
const fireConnectedCallback = (instance) => {
    {
        safeCall(instance, 'connectedCallback');
    }
};

const connectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const cmpMeta = hostRef.$cmpMeta$;
        const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);
        if (!(hostRef.$flags$ & 1 /* hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* hasConnected */;
            let hostId;
            {
                hostId = elm.getAttribute(HYDRATE_ID);
                if (hostId) {
                    initializeClientHydrate(elm, cmpMeta.$tagName$, hostId, hostRef);
                }
            }
            if ( !hostId) {
                // initUpdate
                // if the slot polyfill is required we'll need to put some nodes
                // in here to act as original content anchors as we move nodes around
                // host element has been connected to the DOM
                {
                    setContentReference(elm);
                }
            }
            {
                // find the first ancestor component (if there is one) and register
                // this component as one of the actively loading child components for its ancestor
                let ancestorComponent = elm;
                while ((ancestorComponent = ancestorComponent.parentNode || ancestorComponent.host)) {
                    // climb up the ancestors looking for the first
                    // component that hasn't finished its lifecycle update yet
                    if (( ancestorComponent.nodeType === 1 /* ElementNode */ && ancestorComponent.hasAttribute('s-id') && ancestorComponent['s-p']) ||
                        ancestorComponent['s-p']) {
                        // we found this components first ancestor component
                        // keep a reference to this component's ancestor component
                        attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
                        break;
                    }
                }
            }
            {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
        else {
            // not the first time this has connected
            // reattach any event listeners to the host
            // since they would have been removed when disconnected
            addHostEventListeners(elm, hostRef, cmpMeta.$listeners$);
            // fire off connectedCallback() on component instance
            fireConnectedCallback(hostRef.$lazyInstance$);
        }
        endConnected();
    }
};
const setContentReference = (elm) => {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    const contentRefElm = (elm['s-cr'] = doc.createComment( ''));
    contentRefElm['s-cn'] = true;
    elm.insertBefore(contentRefElm, elm.firstChild);
};

const getAssetPath = (path) => {
    const assetUrl = new URL(path, plt.$resourcesUrl$);
    return assetUrl.origin !== win.location.origin ? assetUrl.href : assetUrl.pathname;
};

const getContext = (_elm, context) => {
    if (context in Context) {
        return Context[context];
    }
    else if (context === 'window') {
        return win;
    }
    else if (context === 'document') {
        return doc;
    }
    else if (context === 'isServer' || context === 'isPrerender') {
        return  true ;
    }
    else if (context === 'isClient') {
        return  false ;
    }
    else if (context === 'resourcesUrl' || context === 'publicPath') {
        return getAssetPath('.');
    }
    else if (context === 'queue') {
        return {
            write: writeTask,
            read: readTask,
            tick: {
                then(cb) {
                    return nextTick(cb);
                },
            },
        };
    }
    return undefined;
};

const insertVdomAnnotations = (doc, staticComponents) => {
    if (doc != null) {
        const docData = {
            hostIds: 0,
            rootLevelIds: 0,
            staticComponents: new Set(staticComponents),
        };
        const orgLocationNodes = [];
        parseVNodeAnnotations(doc, doc.body, docData, orgLocationNodes);
        orgLocationNodes.forEach(orgLocationNode => {
            if (orgLocationNode != null) {
                const nodeRef = orgLocationNode['s-nr'];
                let hostId = nodeRef['s-host-id'];
                let nodeId = nodeRef['s-node-id'];
                let childId = `${hostId}.${nodeId}`;
                if (hostId == null) {
                    hostId = 0;
                    docData.rootLevelIds++;
                    nodeId = docData.rootLevelIds;
                    childId = `${hostId}.${nodeId}`;
                    if (nodeRef.nodeType === 1 /* ElementNode */) {
                        nodeRef.setAttribute(HYDRATE_CHILD_ID, childId);
                    }
                    else if (nodeRef.nodeType === 3 /* TextNode */) {
                        if (hostId === 0) {
                            const textContent = nodeRef.nodeValue.trim();
                            if (textContent === '') {
                                // useless whitespace node at the document root
                                orgLocationNode.remove();
                                return;
                            }
                        }
                        const commentBeforeTextNode = doc.createComment(childId);
                        commentBeforeTextNode.nodeValue = `${TEXT_NODE_ID}.${childId}`;
                        nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
                    }
                }
                let orgLocationNodeId = `${ORG_LOCATION_ID}.${childId}`;
                const orgLocationParentNode = orgLocationNode.parentElement;
                if (orgLocationParentNode) {
                    if (orgLocationParentNode['s-en'] === '') {
                        // ending with a "." means that the parent element
                        // of this node's original location is a SHADOW dom element
                        // and this node is apart of the root level light dom
                        orgLocationNodeId += `.`;
                    }
                    else if (orgLocationParentNode['s-en'] === 'c') {
                        // ending with a ".c" means that the parent element
                        // of this node's original location is a SCOPED element
                        // and this node is apart of the root level light dom
                        orgLocationNodeId += `.c`;
                    }
                }
                orgLocationNode.nodeValue = orgLocationNodeId;
            }
        });
    }
};
const parseVNodeAnnotations = (doc, node, docData, orgLocationNodes) => {
    if (node == null) {
        return;
    }
    if (node['s-nr'] != null) {
        orgLocationNodes.push(node);
    }
    if (node.nodeType === 1 /* ElementNode */) {
        node.childNodes.forEach(childNode => {
            const hostRef = getHostRef(childNode);
            if (hostRef != null && !docData.staticComponents.has(childNode.nodeName.toLowerCase())) {
                const cmpData = {
                    nodeIds: 0,
                };
                insertVNodeAnnotations(doc, childNode, hostRef.$vnode$, docData, cmpData);
            }
            parseVNodeAnnotations(doc, childNode, docData, orgLocationNodes);
        });
    }
};
const insertVNodeAnnotations = (doc, hostElm, vnode, docData, cmpData) => {
    if (vnode != null) {
        const hostId = ++docData.hostIds;
        hostElm.setAttribute(HYDRATE_ID, hostId);
        if (hostElm['s-cr'] != null) {
            hostElm['s-cr'].nodeValue = `${CONTENT_REF_ID}.${hostId}`;
        }
        if (vnode.$children$ != null) {
            const depth = 0;
            vnode.$children$.forEach((vnodeChild, index) => {
                insertChildVNodeAnnotations(doc, vnodeChild, cmpData, hostId, depth, index);
            });
        }
    }
};
const insertChildVNodeAnnotations = (doc, vnodeChild, cmpData, hostId, depth, index) => {
    const childElm = vnodeChild.$elm$;
    if (childElm == null) {
        return;
    }
    const nodeId = cmpData.nodeIds++;
    const childId = `${hostId}.${nodeId}.${depth}.${index}`;
    childElm['s-host-id'] = hostId;
    childElm['s-node-id'] = nodeId;
    if (childElm.nodeType === 1 /* ElementNode */) {
        childElm.setAttribute(HYDRATE_CHILD_ID, childId);
    }
    else if (childElm.nodeType === 3 /* TextNode */) {
        const parentNode = childElm.parentNode;
        if (parentNode.nodeName !== 'STYLE') {
            const textNodeId = `${TEXT_NODE_ID}.${childId}`;
            const commentBeforeTextNode = doc.createComment(textNodeId);
            parentNode.insertBefore(commentBeforeTextNode, childElm);
        }
    }
    else if (childElm.nodeType === 8 /* CommentNode */) {
        if (childElm['s-sr']) {
            const slotName = childElm['s-sn'] || '';
            const slotNodeId = `${SLOT_NODE_ID}.${childId}.${slotName}`;
            childElm.nodeValue = slotNodeId;
        }
    }
    if (vnodeChild.$children$ != null) {
        const childDepth = depth + 1;
        vnodeChild.$children$.forEach((vnode, index) => {
            insertChildVNodeAnnotations(doc, vnode, cmpData, hostId, childDepth, index);
        });
    }
};

function proxyHostElement(elm, cmpMeta) {
    if (typeof elm.componentOnReady !== 'function') {
        elm.componentOnReady = componentOnReady;
    }
    if (typeof elm.forceUpdate !== 'function') {
        elm.forceUpdate = forceUpdate$1;
    }
    if (cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */) {
        elm.shadowRoot = elm;
    }
    if (cmpMeta.$members$ != null) {
        const hostRef = getHostRef(elm);
        const members = Object.entries(cmpMeta.$members$);
        members.forEach(([memberName, m]) => {
            const memberFlags = m[0];
            if (memberFlags & 31 /* Prop */) {
                const attributeName = m[1] || memberName;
                const attrValue = elm.getAttribute(attributeName);
                if (attrValue != null) {
                    const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
                    hostRef.$instanceValues$.set(memberName, parsedAttrValue);
                }
                const ownValue = elm[memberName];
                if (ownValue !== undefined) {
                    // we've got an actual value already set on the host element
                    // let's add that to our instance values and pull it off the element
                    // so the getter/setter kicks in instead, but still getting this value
                    hostRef.$instanceValues$.set(memberName, ownValue);
                    delete elm[memberName];
                }
                // create the getter/setter on the host element for this property name
                Object.defineProperty(elm, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
            else if (memberFlags & 64 /* Method */) {
                Object.defineProperty(elm, memberName, {
                    value() {
                        const ref = getHostRef(this);
                        const args = arguments;
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName].apply(ref.$lazyInstance$, args)).catch(consoleError);
                    },
                });
            }
        });
    }
}
function componentOnReady() {
    return getHostRef(this).$onReadyPromise$;
}
function forceUpdate$1() {
    /**/
}

function hydrateApp(win, opts, results, afterHydrate, resolve) {
    const connectedElements = new Set();
    const createdElements = new Set();
    const waitingElements = new Set();
    const orgDocumentCreateElement = win.document.createElement;
    const orgDocumentCreateElementNS = win.document.createElementNS;
    const resolved = Promise.resolve();
    let tmrId;
    function hydratedComplete() {
        global.clearTimeout(tmrId);
        createdElements.clear();
        connectedElements.clear();
        try {
            if (opts.clientHydrateAnnotations) {
                insertVdomAnnotations(win.document, opts.staticComponents);
            }
            win.document.createElement = orgDocumentCreateElement;
            win.document.createElementNS = orgDocumentCreateElementNS;
        }
        catch (e) {
            renderCatchError(opts, results, e);
        }
        afterHydrate(win, opts, results, resolve);
    }
    function hydratedError(err) {
        renderCatchError(opts, results, err);
        hydratedComplete();
    }
    function timeoutExceeded() {
        hydratedError(`Hydrate exceeded timeout${waitingOnElementsMsg(waitingElements)}`);
    }
    try {
        function patchedConnectedCallback() {
            return connectElement(this);
        }
        function patchElement(elm) {
            if (isValidComponent(elm, opts)) {
                // this element is a valid component
                const hostRef = getHostRef(elm);
                if (!hostRef) {
                    // we haven't registered this component's host element yet
                    // get the component's constructor
                    const Cstr = loadModule({
                        $tagName$: elm.nodeName.toLowerCase(),
                        $flags$: null,
                    });
                    if (Cstr != null && Cstr.cmpMeta != null) {
                        // we found valid component metadata
                        createdElements.add(elm);
                        elm.connectedCallback = patchedConnectedCallback;
                        // register the host element
                        registerHost(elm, Cstr.cmpMeta);
                        // proxy the host element with the component's metadata
                        proxyHostElement(elm, Cstr.cmpMeta);
                    }
                }
            }
        }
        function patchChild(elm) {
            if (elm != null && elm.nodeType === 1) {
                patchElement(elm);
                const children = elm.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    patchChild(children[i]);
                }
            }
        }
        function connectElement(elm) {
            createdElements.delete(elm);
            if (isValidComponent(elm, opts) && results.hydratedCount < opts.maxHydrateCount) {
                // this is a valid component to hydrate
                // and we haven't hit our max hydrated count yet
                if (!connectedElements.has(elm) && shouldHydrate(elm)) {
                    // we haven't connected this component yet
                    // and all of its ancestor elements are valid too
                    // add it to our Set so we know it's already being connected
                    connectedElements.add(elm);
                    return hydrateComponent(win, results, elm.nodeName, elm, waitingElements);
                }
            }
            return resolved;
        }
        function waitLoop() {
            const toConnect = Array.from(createdElements).filter(elm => elm.parentElement);
            if (toConnect.length > 0) {
                return Promise.all(toConnect.map(connectElement)).then(waitLoop);
            }
            return resolved;
        }
        win.document.createElement = function patchedCreateElement(tagName) {
            const elm = orgDocumentCreateElement.call(win.document, tagName);
            patchElement(elm);
            return elm;
        };
        win.document.createElementNS = function patchedCreateElement(namespaceURI, tagName) {
            const elm = orgDocumentCreateElementNS.call(win.document, namespaceURI, tagName);
            patchElement(elm);
            return elm;
        };
        // ensure we use nodejs's native setTimeout, not the mocked hydrate app scoped one
        tmrId = global.setTimeout(timeoutExceeded, opts.timeout);
        plt.$resourcesUrl$ = new URL(opts.resourcesUrl || './', doc.baseURI).href;
        patchChild(win.document.body);
        waitLoop().then(hydratedComplete).catch(hydratedError);
    }
    catch (e) {
        hydratedError(e);
    }
}
async function hydrateComponent(win, results, tagName, elm, waitingElements) {
    tagName = tagName.toLowerCase();
    const Cstr = loadModule({
        $tagName$: tagName,
        $flags$: null,
    });
    if (Cstr != null) {
        const cmpMeta = Cstr.cmpMeta;
        if (cmpMeta != null) {
            waitingElements.add(elm);
            try {
                connectedCallback(elm);
                await elm.componentOnReady();
                results.hydratedCount++;
                const ref = getHostRef(elm);
                const modeName = !ref.$modeName$ ? '$' : ref.$modeName$;
                if (!results.components.some(c => c.tag === tagName && c.mode === modeName)) {
                    results.components.push({
                        tag: tagName,
                        mode: modeName,
                        count: 0,
                        depth: -1,
                    });
                }
            }
            catch (e) {
                win.console.error(e);
            }
            waitingElements.delete(elm);
        }
    }
}
function isValidComponent(elm, opts) {
    if (elm != null && elm.nodeType === 1) {
        // playing it safe and not using elm.tagName or elm.localName on purpose
        const tagName = elm.nodeName;
        if (typeof tagName === 'string' && tagName.includes('-')) {
            if (opts.excludeComponents.includes(tagName.toLowerCase())) {
                // this tagName we DO NOT want to hydrate
                return false;
            }
            // all good, this is a valid component
            return true;
        }
    }
    return false;
}
function shouldHydrate(elm) {
    if (elm.nodeType === 9) {
        return true;
    }
    if (NO_HYDRATE_TAGS.has(elm.nodeName)) {
        return false;
    }
    if (elm.hasAttribute('no-prerender')) {
        return false;
    }
    const parentNode = elm.parentNode;
    if (parentNode == null) {
        return true;
    }
    return shouldHydrate(parentNode);
}
const NO_HYDRATE_TAGS = new Set(['CODE', 'HEAD', 'IFRAME', 'INPUT', 'OBJECT', 'OUTPUT', 'NOSCRIPT', 'PRE', 'SCRIPT', 'SELECT', 'STYLE', 'TEMPLATE', 'TEXTAREA']);
function renderCatchError(opts, results, err) {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Hydrate Error',
        messageText: '',
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (opts.url) {
        try {
            const u = new URL(opts.url);
            if (u.pathname !== '/') {
                diagnostic.header += ': ' + u.pathname;
            }
        }
        catch (e) { }
    }
    if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else if (err.message != null) {
            diagnostic.messageText = err.message.toString();
        }
        else {
            diagnostic.messageText = err.toString();
        }
    }
    results.diagnostics.push(diagnostic);
}
function printTag(elm) {
    let tag = `<${elm.nodeName.toLowerCase()}`;
    if (Array.isArray(elm.attributes)) {
        for (let i = 0; i < elm.attributes.length; i++) {
            const attr = elm.attributes[i];
            tag += ` ${attr.name}`;
            if (attr.value !== '') {
                tag += `="${attr.value}"`;
            }
        }
    }
    tag += `>`;
    return tag;
}
function waitingOnElementMsg(waitingElement) {
    let msg = '';
    if (waitingElement) {
        const lines = [];
        msg = ' - waiting on:';
        let elm = waitingElement;
        while (elm && elm.nodeType !== 9 && elm.nodeName !== 'BODY') {
            lines.unshift(printTag(elm));
            elm = elm.parentElement;
        }
        let indent = '';
        for (const ln of lines) {
            indent += '  ';
            msg += `\n${indent}${ln}`;
        }
    }
    return msg;
}
function waitingOnElementsMsg(waitingElements) {
    return Array.from(waitingElements).map(waitingOnElementMsg);
}

const cmpModules = new Map();
const getModule = (tagName) => {
    if (typeof tagName === 'string') {
        tagName = tagName.toLowerCase();
        const cmpModule = cmpModules.get(tagName);
        if (cmpModule != null) {
            return cmpModule[tagName];
        }
    }
    return null;
};
const loadModule = (cmpMeta, _hostRef, _hmrVersionId) => {
    return getModule(cmpMeta.$tagName$);
};
const isMemberInElement = (elm, memberName) => {
    if (elm != null) {
        if (memberName in elm) {
            return true;
        }
        const cstr = getModule(elm.nodeName);
        if (cstr != null) {
            const hostRef = cstr;
            if (hostRef != null && hostRef.cmpMeta != null && hostRef.cmpMeta.$members$ != null) {
                return memberName in hostRef.cmpMeta.$members$;
            }
        }
    }
    return false;
};
const registerComponents = (Cstrs) => {
    for (const Cstr of Cstrs) {
        // using this format so it follows exactly how client-side modules work
        const exportName = Cstr.cmpMeta.$tagName$;
        cmpModules.set(exportName, {
            [exportName]: Cstr,
        });
    }
};
const win = window;
const doc = win.document;
const readTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
const writeTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
const resolved = /*@__PURE__*/ Promise.resolve();
const nextTick = /*@__PURE__*/ (cb) => resolved.then(cb);
const consoleError = (e) => {
    if (e != null) {
        console.error(e.stack || e.message || e);
    }
};
/*hydrate context start*/ const Context = {}; /*hydrate context end*/
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: h => h(),
    raf: h => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};
const supportsShadow = false;
const hostRefs = new WeakMap();
const getHostRef = (ref) => hostRefs.get(ref);
const registerInstance = (lazyInstance, hostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);
const registerHost = (elm, cmpMeta) => {
    const hostRef = {
        $flags$: 0,
        $cmpMeta$: cmpMeta,
        $hostElement$: elm,
        $instanceValues$: new Map(),
        $renderCount$: 0,
    };
    hostRef.$onInstancePromise$ = new Promise(r => (hostRef.$onInstanceResolve$ = r));
    hostRef.$onReadyPromise$ = new Promise(r => (hostRef.$onReadyResolve$ = r));
    elm['s-p'] = [];
    elm['s-rc'] = [];
    addHostEventListeners(elm, hostRef, cmpMeta.$listeners$);
    return hostRefs.set(elm, hostRef);
};
const styles = new Map();

const anchorLinkCss = ":root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}anchor-link{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}anchor-link.hover-anchor{position:absolute;margin-left:-25px;color:#d6d1d1}.anchor-link-relative{position:relative}.anchor-link-relative{position:relative}@media screen and (max-width: 768px){anchor-link.hover-anchor{margin-left:-18px}}";

/**
 * Used in the generated doc markup as well as the site, so don't remve this
 * even if it looks like no one is using it
 */
class AnchorLink {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    handleClick(_e) {
        if (document.location.hash !== '#' + this.to) {
            document.location.hash = this.to;
            let scrollTop = document.querySelector('html').scrollTop;
            // Update scroll top to clear the header bar
            window.scrollTo(0, scrollTop - 80);
        }
        else {
            document.location.hash = '';
            document.location.hash = this.to;
        }
    }
    render() {
        return (h("div", { onClick: this.handleClick.bind(this) }, h("slot", null)));
    }
    static get style() { return anchorLinkCss; }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "anchor-link",
        "$members$": {
            "to": [1]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const appendToMap = (map, propName, value) => {
    const items = map.get(propName);
    if (!items) {
        map.set(propName, [value]);
    }
    else if (!items.includes(value)) {
        items.push(value);
    }
};
const debounce = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = 0;
            fn(...args);
        }, ms);
    };
};

/**
 * Check if a possible element isConnected.
 * The property might not be there, so we check for it.
 *
 * We want it to return true if isConnected is not a property,
 * otherwise we would remove these elements and would not update.
 *
 * Better leak in Edge than to be useless.
 */
const isConnected = (maybeElement) => !('isConnected' in maybeElement) || maybeElement.isConnected;
const cleanupElements = debounce((map) => {
    for (let key of map.keys()) {
        map.set(key, map.get(key).filter(isConnected));
    }
}, 2000);
const stencilSubscription = ({ on }) => {
    const elmsToUpdate = new Map();
    if (typeof getRenderingRef === 'function') {
        // If we are not in a stencil project, we do nothing.
        // This function is not really exported by @stencil/core.
        on('dispose', () => {
            elmsToUpdate.clear();
        });
        on('get', (propName) => {
            const elm = getRenderingRef();
            if (elm) {
                appendToMap(elmsToUpdate, propName, elm);
            }
        });
        on('set', (propName) => {
            const elements = elmsToUpdate.get(propName);
            if (elements) {
                elmsToUpdate.set(propName, elements.filter(forceUpdate));
            }
            cleanupElements(elmsToUpdate);
        });
        on('reset', () => {
            elmsToUpdate.forEach((elms) => elms.forEach(forceUpdate));
            cleanupElements(elmsToUpdate);
        });
    }
};

const createObservableMap = (defaultState, shouldUpdate = (a, b) => a !== b) => {
    let states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
    const handlers = {
        dispose: [],
        get: [],
        set: [],
        reset: [],
    };
    const reset = () => {
        states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
        handlers.reset.forEach((cb) => cb());
    };
    const dispose = () => {
        // Call first dispose as resetting the state would
        // cause less updates ;)
        handlers.dispose.forEach((cb) => cb());
        reset();
    };
    const get = (propName) => {
        handlers.get.forEach((cb) => cb(propName));
        return states.get(propName);
    };
    const set = (propName, value) => {
        const oldValue = states.get(propName);
        if (shouldUpdate(value, oldValue, propName)) {
            states.set(propName, value);
            handlers.set.forEach((cb) => cb(propName, value, oldValue));
        }
    };
    const state = (typeof Proxy === 'undefined'
        ? {}
        : new Proxy(defaultState, {
            get(_, propName) {
                return get(propName);
            },
            ownKeys(_) {
                return Array.from(states.keys());
            },
            getOwnPropertyDescriptor() {
                return {
                    enumerable: true,
                    configurable: true,
                };
            },
            has(_, propName) {
                return states.has(propName);
            },
            set(_, propName, value) {
                set(propName, value);
                return true;
            },
        }));
    const on = (eventName, callback) => {
        handlers[eventName].push(callback);
        return () => {
            removeFromArray(handlers[eventName], callback);
        };
    };
    const onChange = (propName, cb) => {
        const unSet = on('set', (key, newValue) => {
            if (key === propName) {
                cb(newValue);
            }
        });
        const unReset = on('reset', () => cb(defaultState[propName]));
        return () => {
            unSet();
            unReset();
        };
    };
    const use = (...subscriptions) => subscriptions.forEach((subscription) => {
        if (subscription.set) {
            on('set', subscription.set);
        }
        if (subscription.get) {
            on('get', subscription.get);
        }
        if (subscription.reset) {
            on('reset', subscription.reset);
        }
    });
    return {
        state,
        get,
        set,
        on,
        onChange,
        use,
        dispose,
        reset,
    };
};
const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        array.length--;
    }
};

const createStore = (defaultState, shouldUpdate) => {
    const map = createObservableMap(defaultState, shouldUpdate);
    stencilSubscription(map);
    return map;
};

const { state } = createStore({
    isLeftSidebarIn: false,
    pageTheme: 'light'
});

const capacitorSiteCss = "code[class*=language-],pre[class*=language-]{color:black;background:none;text-shadow:0 1px white;font-family:Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,code[class*=language-] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,code[class*=language-] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*=language-]::selection,pre[class*=language-] ::selection,code[class*=language-]::selection,code[class*=language-] ::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:0.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:0.1em;border-radius:0.3em;white-space:normal}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:slategray}.token.punctuation{color:#999}.namespace{opacity:0.7}.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted{color:#905}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted{color:#690}.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#9a6e3a;background:hsla(0, 0%, 100%, 0.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.function,.token.class-name{color:#DD4A68}.token.regex,.token.important,.token.variable{color:#e90}.token.important,.token.bold{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}:root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}.push{margin-top:70px}.push-sm{margin-top:36px}.block{display:block}.pull-left{float:left}.pull-right{float:right}.no-scroll{overflow:hidden}.sticky{position:-webkit-sticky;position:sticky;top:100px;max-height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden}.btn{-webkit-transition:all 0.15s ease;transition:all 0.15s ease;text-decoration:none;border:none;outline:none;font-size:13px;font-weight:700;text-transform:uppercase;padding:12px 14px;border-radius:4px;letter-spacing:0.04em;-webkit-box-shadow:var(--button-shadow);box-shadow:var(--button-shadow);cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center}.btn a{text-decoration:none}.btn app-icon{margin-right:8px;opacity:0.8}.btn:hover{text-decoration:none;-webkit-transform:translateY(1px);transform:translateY(1px);-webkit-box-shadow:var(--button-shadow-hover);box-shadow:var(--button-shadow-hover)}.btn--primary{background:var(--color-dodger-blue);color:var(--color-white)}.btn--secondary{background:var(--color-white);color:var(--color-dodger-blue)}.btn--tertiary{background:#F4F4FD;color:var(--color-dodger-blue);-webkit-box-shadow:none;box-shadow:none}.btn--tertiary:hover{background-color:#ececf9;-webkit-box-shadow:none;box-shadow:none;-webkit-transform:none;transform:none}.btn--small{letter-spacing:-0.02em;text-transform:none;font-size:15px;padding:5px 12px 7px;font-weight:500;border-radius:8px;min-height:38px}*{-webkit-box-sizing:border-box;box-sizing:border-box}capacitor-site{min-height:100%;display:block}site-root{-ms-flex:1;flex:1}.page-theme--dark{background:var(--c-carbon-100);color:var(--c-indigo-10)}.page-theme--dark .ui-heading,.page-theme--dark h1,.page-theme--dark h2,.page-theme--dark h3,.page-theme--dark h4,.page-theme--dark h5{color:var(--c-indigo-10)}.page-theme--dark p{color:var(--c-indigo-10)}.no-scroll{overflow:hidden}.left-sidebar-in{-webkit-animation-name:slideIn;animation-name:slideIn;-webkit-animation-duration:0.7s;animation-duration:0.7s;-webkit-animation-timing-function:cubic-bezier(0.19, 1, 0.22, 1);animation-timing-function:cubic-bezier(0.19, 1, 0.22, 1);-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes slideIn{from{left:0}to{left:calc(100vw - 56px)}}@keyframes slideIn{from{left:0}to{left:calc(100vw - 56px)}}.left-sidebar-out{-webkit-animation-name:slideOut;animation-name:slideOut;-webkit-animation-duration:0.7s;animation-duration:0.7s;-webkit-animation-timing-function:cubic-bezier(0.19, 1, 0.22, 1);animation-timing-function:cubic-bezier(0.19, 1, 0.22, 1);-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes slideOut{from{left:calc(100vw - 56px)}to{left:0}}@keyframes slideOut{from{left:calc(100vw - 56px)}to{left:0}}.root{position:relative}.row{display:-ms-flexbox;display:flex}.col{-ms-flex:1;flex:1}.container{max-width:1280px;width:100%;margin:auto;padding:0 24px}.container-flex{display:-ms-flexbox;display:flex}document-component>div{display:-ms-flexbox;display:flex}doc-content .input-with-button{display:-ms-flexbox;display:flex;height:50px;max-width:460px;-ms-flex:1;flex:1}doc-content .input-with-button input{-ms-flex:1;flex:1;height:100%}doc-content .input-with-button button{-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:1;flex-shrink:1;margin:0;border:0;border-radius:0px 3px 3px 0;height:100%}doc-content .input-with-button button:hover{-webkit-transform:none;transform:none}.measure-lg{max-width:670px}.app{height:100%}::-moz-selection{background:#98d2ff}::selection{background:#98d2ff}::-moz-selection{background:#98d2ff}html,body{font-family:\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";width:100%;height:100%;padding:0;margin:0;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;scroll-padding-top:80px}body{background-color:#fff}h1,h2,h3,h4{color:#16161d;letter-spacing:0px;font-weight:700}h1{font-size:32px;letter-spacing:-0.02em;font-weight:700}h2{font-size:22px;letter-spacing:-0.02em;font-weight:600}h2,h3{margin-top:64px;margin-bottom:8px}h2 code{font-weight:600;font-family:\"Roboto Mono\", \"Source Code Pro\", monospace;font-size:20px;color:#16161D;background:#ecf4fb;margin-left:6px;padding:4px 8px;border-radius:4px}ul li{font-size:14px;margin-top:16px}ol li{color:#4a5568;font-size:15px;line-height:1.8em;margin:16px 0}p,ul{color:#4a5568;font-size:15px;line-height:1.8em;margin:16px 0px}strong,b{font-weight:500}a{-webkit-transition:border 0.3s;transition:border 0.3s;color:#1d9aff;border-bottom:1px solid transparent}a:hover{border-bottom-color:rgba(29, 154, 255, 0.3)}p a{font-weight:500}.intro{font-size:18px;margin-bottom:24px;letter-spacing:-0.01em}.intro code{font-size:18px}blockquote{background:rgba(255, 250, 237, 0.8);border-left:4px solid #ffcc5f;border-radius:2px 4px 4px 2px;color:#736545 !important;font-size:14px;line-height:1.8em;margin:auto;padding:16px 20px}.wrapper{line-height:32px;min-height:100%;padding-top:100px;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-ms-flex-pack:start;justify-content:flex-start;-ms-flex-line-pack:stretch;align-content:stretch;-ms-flex-align:start;align-items:flex-start}.nextButton{background:#5851ff;color:white;text-decoration:none;border:none;font-size:13px;font-weight:600;text-transform:uppercase;padding:12px 14px;border-radius:4px;-webkit-box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);outline:none;letter-spacing:0.04em;-webkit-transition:all 0.15s ease;transition:all 0.15s ease;cursor:pointer;float:right;margin-right:5px}.nextButton:hover{text-decoration:none;-webkit-transform:translateY(1px);transform:translateY(1px);-webkit-box-shadow:0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16);box-shadow:0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16)}.backButton{color:#5851ff;background:white;text-decoration:none;float:left;border:none;font-size:13px;font-weight:600;text-transform:uppercase;padding:12px 14px;border-radius:4px;-webkit-box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);outline:none;letter-spacing:0.04em;-webkit-transition:all 0.15s ease;transition:all 0.15s ease;cursor:pointer;margin-bottom:15px;margin-left:5px}.backButton:hover{text-decoration:none;-webkit-transform:translateY(1px);transform:translateY(1px);-webkit-box-shadow:0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16);box-shadow:0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.16)}pre{word-break:break-all;word-wrap:break-word;display:block;white-space:pre-wrap;margin:24px 0px 28px;border-radius:4px;color:#16161D;background-color:#f8f8f8}pre code{font-weight:500;display:block;overflow-x:auto;word-wrap:normal;white-space:pre-wrap;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:14px;line-height:20px}code{font-weight:400;font-family:\"Roboto Mono\", \"Source Code Pro\", monospace;font-size:14px}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-keyword,.hljs-formula{color:#db00e9}.hljs-section,.hljs-name,.hljs-selector-tag,.hljs-deletion,.hljs-subst{color:#2973b7}.hljs-tag{color:#2973b7}.hljs-literal{color:#56b6c2}.hljs-string,.hljs-regexp,.hljs-addition,.hljs-attribute,.hljs-meta-string{color:#2cc17e}.hljs-built_in,.hljs-class .hljs-title{color:#db00e9}.hljs-attr,.hljs-variable,.hljs-template-variable,.hljs-type,.hljs-selector-class,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-number{color:#d19a66}.hljs-attr{color:#525252}.hljs-symbol,.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-title{color:#2973b7}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}.hljs-link{text-decoration:underline}@media screen and (max-width: 355px){.wrapper{padding-top:100px}}@media screen and (max-width: 450px){.wrapper{padding-top:80px}site-header stencil-route-link a{display:initial}}@media screen and (max-width: 590px){.wrapper{margin-right:0;margin-left:0;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.wrapper .pull-right{padding:0 15px;width:100%;min-height:100vh}.wrapper .pull-left{position:relative;padding:15px;width:100%;bottom:0;background-color:#16161d}.wrapper .pull-left *{color:#ffffff}}@media screen and (min-width: 590px){.wrapper .pull-left{min-width:250px;max-width:250px;position:-webkit-sticky;position:sticky;top:50px}.wrapper .pull-right{padding-left:96px;padding-right:32px;-ms-flex:1 1 auto;flex:1 1 auto;overflow:auto;min-height:100vh}}.document .container{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}.document plugin-platforms{display:block;float:right}.document plugin-platforms .platform{margin-left:8px}.document img{max-width:100%}.document h1:first-child anchor-link{display:none}.document ul{-webkit-padding-start:0px}.document ul li,.document ul code{font-size:16px;margin-left:18px}.document p a{color:#1d9aff;text-decoration:none}.document p code,.document ul code,.document ol code{padding:0 4px 3px;background-color:#ecf4fb;color:#16161D;border-radius:3px}.document #introButton{background:#1d9aff;color:white;text-decoration:none;border:none;font-size:13px;font-weight:600;text-transform:uppercase;padding:16px 20px;border-radius:2px;-webkit-box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);outline:none;letter-spacing:0.04em;-webkit-transition:all 0.15s ease;transition:all 0.15s ease;cursor:pointer}.document #introButton:hover{-webkit-box-shadow:0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);box-shadow:0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);-webkit-transform:translateY(1px);transform:translateY(1px)}";

class App {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("site-root", null, h("div", { class: `page-theme--${state.pageTheme}` }, h("site-platform-bar", { productName: "Capacitor" }), h("capacitor-site-header", null), h("capacitor-site-routes", null))));
    }
    get el() { return getElement(this); }
    static get style() { return capacitorSiteCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "capacitor-site",
        "$members$": {
            "isLeftSidebarIn": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const appBurgerCss = ":root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}app-burger{display:none;position:fixed;top:0px;left:0px;z-index:999}app-burger>div{padding:18px;display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:center;justify-content:center}app-burger>div:hover app-icon{opacity:1}app-burger .icon-menu{display:block}app-burger .icon-close{display:none}app-burger app-icon{-webkit-transition:opacity 0.3s;transition:opacity 0.3s;opacity:0.7;cursor:pointer}app-burger.left-sidebar-in>div{height:100vh;padding-right:50px}app-burger.left-sidebar-in .icon-menu{display:none}app-burger.left-sidebar-in .icon-close{display:block}@media screen and (max-width: 768px){app-burger{display:block}}";

class AppBurger {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.burgerClick = createEvent(this, "burgerClick", 7);
    }
    handleBurgerClicked() {
        this.burgerClick.emit();
    }
    render() {
        return (h("div", { class: "burger", onClick: () => this.handleBurgerClicked() }, h("app-icon", { name: "menu" }), h("app-icon", { name: "close" })));
    }
    static get style() { return appBurgerCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "app-burger",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const appIconCss = "app-icon .icon-checkmark{fill:#4CAFFF;width:15px;height:11px}app-icon .icon-targetblank{fill:#86869c;width:9px;height:9px}app-icon .icon-slack,app-icon .icon-twitter{fill:#16161d;width:20px;height:20px}app-icon .icon-menu{fill:#4CAFFF;width:17px;height:15px}app-icon .icon-close{fill:#4CAFFF;width:14px;height:14px}app-icon .icon-more{fill:#4CAFFF;width:4px;height:18px}.landing-page app-icon .icon-slack,.landing-page app-icon .icon-twitter{fill:#4CAFFF;width:20px;height:20px}";

class AppIcon {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("svg", { class: `icon icon-${this.name}` }, h("use", { xlinkHref: `#icon-${this.name}` })));
    }
    static get style() { return appIconCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "app-icon",
        "$members$": {
            "name": [1]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const appMarkedCss = "app-marked{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex:1;flex:1;min-width:0;width:100%;padding-top:86px;padding-bottom:32px;padding-left:32px}code[class*=language-],pre[class*=language-]{-moz-tab-size:2;-o-tab-size:2;tab-size:2;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none;white-space:normal;word-wrap:normal;font-size:14px;line-height:20px;color:#e4e4e4;text-shadow:none}pre[class*=language-],:not(pre)>code[class*=language-]{background:#212431}pre[class*=language-]{border-radius:4px;border:none;overflow:auto;position:relative}pre[class*=language-] code{white-space:pre;display:block;margin:22px 24px !important;display:block}:not(pre)>code[class*=language-]{padding:0.15em 0.2em 0.05em;border-radius:0.3em;border:0.13em solid #7a6652;-webkit-box-shadow:1px 1px 0.3em -0.1em #000 inset;box-shadow:1px 1px 0.3em -0.1em #000 inset}pre[class*=language-]{position:relative}pre .line-highlight{position:absolute;left:0;right:0;padding:0 0 0 22px;background:rgba(86, 90, 101, 0.4)}.token.comment{color:#5c6370;font-style:italic}.token.function{color:#61aeee}.token.class-name,.token.builtin{color:#e6c07b}.token.namespace{opacity:0.7}.token.prolog,.token.doctype,.token.cdata{color:#6f705e}.token.boolean,.token.number{color:#a77afe}.token.string{color:#98c379}.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#e6d06c}.token.selector,.token.inserted{color:#a6e22d}.token.atrule,.token.keyword,.token.important,.token.deleted{color:#c678dd}.token.regex,.token.statement{color:#76d9e6}.token.placeholder,.token.variable{color:#fff}.token.important,.token.statement,.token.bold{font-weight:bold}.token.operator,.token.punctuation{color:#bebec5}.token.entity{cursor:help}.token.italic{font-style:italic}code.language-markup{color:#f9f9f9}code.language-markup .token.tag,.token.tag{color:#da5686}code.language-markup .token.attr-name,.token.attr-name{color:#98c379}code.language-markup .token.attr-value,.token.attr-value{color:#e6d06c}code.language-markup .token.style,code.language-markup .token.script{color:#76d9e6}code.language-markup .token.script .token.keyword{color:#76d9e6}";

class AppMarked {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.docsContent = {};
    }
    componentWillLoad() {
        return this.fetchNewContent(this.fetchPath);
    }
    fetchNewContent(docPath, oldDocPath) {
        if (docPath == null || docPath === oldDocPath) {
            return;
        }
        return fetchContent(this.fetchPath).then(data => {
            if (data != null) {
                this.docsContent = data;
            }
        });
    }
    render() {
        return this.renderer ? this.renderer(this.docsContent) : null;
    }
    static get watchers() { return {
        "fetchPath": ["fetchNewContent"]
    }; }
    static get style() { return appMarkedCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "app-marked",
        "$members$": {
            "fetchPath": [1, "fetch-path"],
            "renderer": [16],
            "docsContent": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}
const localCache = new Map();
function fetchContent(path) {
    let promise = localCache.get(path);
    if (!promise) {
        promise = fetch(path, { cache: 'force-cache' }).then(response => response.json());
        localCache.set(path, promise);
    }
    return promise;
}

class AvcCodeType {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        if (this.typeId) {
            return (h("anchor-link", { to: `type-${this.typeId}` }, h("slot", null)));
        }
        return (h("slot", null));
    }
    static get style() { return ":host {\n    color: #5EB6FC;\n    display: inline-block;\n    color: $link-color;\n    font-weight: 500;\n  }"; }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "avc-code-type",
        "$members$": {
            "typeId": [1, "type-id"]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var prismicRichtext_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}("undefined"!=typeof self?self:commonjsGlobal,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r});},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}([function(e,t,n){var r=n(3);e.exports=function(e){return function t(n){return 0===arguments.length||r(n)?t:e.apply(this,arguments)}};},function(e,t,n){var r=n(0),o=n(3);e.exports=function(e){return function t(n,i){switch(arguments.length){case 0:return t;case 1:return o(n)?t:r(function(t){return e(n,t)});default:return o(n)&&o(i)?t:o(n)?r(function(t){return e(t,i)}):o(i)?r(function(t){return e(n,t)}):e(n,i)}}};},function(e,t,n){var r;function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0}),t.PRIORITIES=t.NODE_TYPES=void 0;var i={heading1:"heading1",heading2:"heading2",heading3:"heading3",heading4:"heading4",heading5:"heading5",heading6:"heading6",paragraph:"paragraph",preformatted:"preformatted",strong:"strong",em:"em",listItem:"list-item",oListItem:"o-list-item",list:"group-list-item",oList:"group-o-list-item",image:"image",embed:"embed",hyperlink:"hyperlink",label:"label",span:"span"};t.NODE_TYPES=i;var u=(o(r={},i.heading1,4),o(r,i.heading2,4),o(r,i.heading3,4),o(r,i.heading4,4),o(r,i.heading5,4),o(r,i.heading6,4),o(r,i.paragraph,3),o(r,i.preformatted,5),o(r,i.strong,6),o(r,i.em,6),o(r,i.oList,1),o(r,i.list,1),o(r,i.listItem,1),o(r,i.oListItem,1),o(r,i.image,1),o(r,i.embed,1),o(r,i.hyperlink,3),o(r,i.label,4),o(r,i.span,7),r);t.PRIORITIES=u;},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]};},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=d(n(12)),o=d(n(15)),i=d(n(16)),u=d(n(17)),c=d(n(21)),a=d(n(7)),l=n(23),f=n(2),s=n(8);function d(e){return e&&e.__esModule?e:{default:e}}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function h(e){return function(e){if(Array.isArray(e))return e}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function y(e,t){var n=t.others.reduce(function(n,r){var o=n.inner,i=n.outer,u=function(e,t,n){return n.start<t.start?{inner:s.SpanNode.slice(n,t.start,n.end,e),outer:s.SpanNode.slice(n,n.start,t.start,e)}:n.end>t.end?{inner:s.SpanNode.slice(n,n.start,t.end,e),outer:s.SpanNode.slice(n,t.end,n.end,e)}:{inner:n}}(e,t.elected,r);return {inner:o.concat(u.inner),outer:u.outer?i.concat(u.outer):i}},{inner:[],outer:[]}),r=n.inner,o=n.outer;return [t.elected.setChildren(x(e,r,t.elected.boundaries()))].concat(b(e,o))}function v(e){return function(e,t){return t.reduce(function(t,n){var r=(0, c.default)(t);if(r){if(r.some(function(e){return e.isParentOf(n)}))return (0, u.default)(t).concat([r.concat(n)]);var o=(0, c.default)(r);return o&&e(o,n)?(0, u.default)(t).concat([r.concat(n)]):t.concat([[n]])}return [[n]]},[])}(function(e,t){return e.end>=t.start},(0, i.default)([function(e,t){return e.start-t.start},function(e,t){return e.end-t.end}],e))}function m(e){if(0===e.length)throw new Error("Unable to elect node on empty list");var t=h(e.sort(function(e,t){if(e.isParentOf(t))return -1;if(t.isParentOf(e))return 1;var n=f.PRIORITIES[e.type]-f.PRIORITIES[t.type];return 0===n?e.text.length-t.text.length:n}));return {elected:t[0],others:t.slice(1)}}function x(e,t,n){if(t.length>0)return function(e,t,n){return t.reduce(function(r,o,i){var u=[],c=0===i&&o.start>n.lower,a=i===t.length-1&&n.upper>o.end;if(c){var l=new s.TextNode(n.lower,o.start,e.slice(n.lower,o.start));u=u.concat(l);}else{var f=t[i-1];if(f&&o.start>f.end){var d=e.slice(f.end,o.start),p=new s.TextNode(f.end,o.start,d);u=u.concat(p);}}if(u=u.concat(o),a){var h=new s.TextNode(o.end,n.upper,e.slice(o.end,n.upper));u=u.concat(h);}return r.concat(u)},[])}(e,b(e,t),n);var r=e.slice(n.lower,n.upper);return [new s.TextNode(n.lower,n.upper,r)]}function b(e,t){var n=v((0, o.default)(function(e){return e.start},t)).map(m),i=(0, r.default)(n.map(function(t){return y(e,t)}));return (0, o.default)(function(e){return e.start},i)}var g=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);}var t,n,r;return t=e,r=[{key:"fromRichText",value:function(e){return {key:(0, a.default)(),children:e.reduce(function(e,t,n){if(l.RichTextBlock.isEmbedBlock(t.type)||l.RichTextBlock.isImageBlock(t.type))return e.concat(new s.BlockNode(t.type,t));var r=function(e){var t=e.spans.map(function(t){var n=e.text.slice(t.start,t.end);return new s.SpanNode(t.start,t.end,t.type,n,[],t)}),n={lower:0,upper:e.text.length};return x(e.text,t,n)}(t),o=e[e.length-1];if(l.RichTextBlock.isListItem(t.type)&&o&&o instanceof s.ListBlockNode){var i=new s.ListItemBlockNode(t,r),c=o.addChild(i);return (0, u.default)(e).concat(c)}if(l.RichTextBlock.isOrderedListItem(t.type)&&o&&o instanceof s.OrderedListBlockNode){var a=new s.OrderedListItemBlockNode(t,r),f=o.addChild(a);return (0, u.default)(e).concat(f)}if(l.RichTextBlock.isListItem(t.type)){var d=new s.ListItemBlockNode(t,r),p=new s.ListBlockNode(l.RichTextBlock.emptyList(),[d]);return e.concat(p)}if(l.RichTextBlock.isOrderedListItem(t.type)){var h=new s.OrderedListItemBlockNode(t,r),y=new s.OrderedListBlockNode(l.RichTextBlock.emptyOrderedList(),[h]);return e.concat(y)}return e.concat(new s.BlockNode(t.type,t,r))},[])}}}],(n=null)&&p(t.prototype,n),r&&p(t,r),e}();t.default=g;},function(e,t){e.exports=Array.isArray||function(e){return null!=e&&e.length>=0&&"[object Array]"===Object.prototype.toString.call(e)};},function(e,t){e.exports=function(e){return "[object String]"===Object.prototype.toString.call(e)};},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=(new Date).getTime();return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:3&n|8).toString(16)})};},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.ListBlockNode=t.OrderedListBlockNode=t.OrderedListItemBlockNode=t.ListItemBlockNode=t.BlockNode=t.TextNode=t.SpanNode=t.Node=void 0;var r,o=(r=n(7))&&r.__esModule?r:{default:r},i=n(2);function u(e){return (u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function a(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),e}function l(e,t){return !t||"object"!==u(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return (f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t);}function d(e,t){return (d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var h=function e(t,n,r){p(this,e),this.key=(0, o.default)(),this.type=t,this.element=n,this.children=r;};t.Node=h;var y=function(e){function t(e,n,r,o,i,u){var c;return p(this,t),(c=l(this,f(t).call(this,r,u,i))).start=e,c.end=n,c.text=o,c.children=i,c}return s(t,h),a(t,[{key:"boundaries",value:function(){return {lower:this.start,upper:this.end}}},{key:"isParentOf",value:function(e){return this.start<=e.start&&this.end>=e.end}},{key:"setChildren",value:function(e){return new t(this.start,this.end,this.type,this.text,e,this.element)}}],[{key:"slice",value:function(e,n,r,o){return new t(n,r,e.type,o.slice(n,r),e.children,e.element)}}]),t}();t.SpanNode=y;var v=function(e){function t(e,n,r){p(this,t);var o={type:i.NODE_TYPES.span,start:e,end:n,text:r};return l(this,f(t).call(this,e,n,i.NODE_TYPES.span,r,[],o))}return s(t,y),t}();t.TextNode=v;var m=function(e){function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return p(this,t),l(this,f(t).call(this,e,n,r))}return s(t,h),t}();t.BlockNode=m;var x=function(e){function t(e,n){return p(this,t),l(this,f(t).call(this,i.NODE_TYPES.listItem,e,n))}return s(t,m),t}();t.ListItemBlockNode=x;var b=function(e){function t(e,n){return p(this,t),l(this,f(t).call(this,i.NODE_TYPES.oListItem,e,n))}return s(t,m),t}();t.OrderedListItemBlockNode=b;var g=function(e){function t(e,n){return p(this,t),l(this,f(t).call(this,i.NODE_TYPES.oList,e,n))}return s(t,m),a(t,[{key:"addChild",value:function(e){var n=this.children.concat(e);return new t(this.element,n)}}]),t}();t.OrderedListBlockNode=g;var O=function(e){function t(e,n){return p(this,t),l(this,f(t).call(this,i.NODE_TYPES.list,e,n))}return s(t,m),a(t,[{key:"addChild",value:function(e){var n=this.children.concat(e);return new t(this.element,n)}}]),t}();t.ListBlockNode=O;},function(e,t,n){e.exports=n(10);},function(e,t,n){var r=c(n(11)),o=c(n(4)),i=c(n(24)),u=n(2);function c(e){return e&&e.__esModule?e:{default:e}}e.exports={asText:r.default,asTree:o.default.fromRichText,serialize:i.default,Elements:u.NODE_TYPES};},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(e,t){var n="string"==typeof t?t:" ";return e.map(function(e){return e.text}).join(n)};t.default=r;},function(e,t,n){var r=n(0)(n(13)(!0));e.exports=r;},function(e,t,n){var r=n(14);e.exports=function(e){return function t(n){for(var o,i,u,c=[],a=0,l=n.length;a<l;){if(r(n[a]))for(u=0,i=(o=e?t(n[a]):n[a]).length;u<i;)c[c.length]=o[u],u+=1;else c[c.length]=n[a];a+=1;}return c}};},function(e,t,n){var r=n(0),o=n(5),i=n(6),u=r(function(e){return !!o(e)||!!e&&("object"==typeof e&&(!i(e)&&(1===e.nodeType?!!e.length:0===e.length||e.length>0&&(e.hasOwnProperty(0)&&e.hasOwnProperty(e.length-1)))))});e.exports=u;},function(e,t,n){var r=n(1)(function(e,t){return Array.prototype.slice.call(t,0).sort(function(t,n){var r=e(t),o=e(n);return r<o?-1:r>o?1:0})});e.exports=r;},function(e,t,n){var r=n(1)(function(e,t){return Array.prototype.slice.call(t,0).sort(function(t,n){for(var r=0,o=0;0===r&&o<e.length;)r=e[o](t,n),o+=1;return r})});e.exports=r;},function(e,t,n){var r=n(18)(0,-1);e.exports=r;},function(e,t,n){var r=n(19),o=n(20)(r("slice",function(e,t,n){return Array.prototype.slice.call(n,e,t)}));e.exports=o;},function(e,t,n){var r=n(5);e.exports=function(e,t){return function(){var n=arguments.length;if(0===n)return t();var o=arguments[n-1];return r(o)||"function"!=typeof o[e]?t.apply(this,arguments):o[e].apply(o,Array.prototype.slice.call(arguments,0,n-1))}};},function(e,t,n){var r=n(0),o=n(1),i=n(3);e.exports=function(e){return function t(n,u,c){switch(arguments.length){case 0:return t;case 1:return i(n)?t:o(function(t,r){return e(n,t,r)});case 2:return i(n)&&i(u)?t:i(n)?o(function(t,n){return e(t,u,n)}):i(u)?o(function(t,r){return e(n,t,r)}):r(function(t){return e(n,u,t)});default:return i(n)&&i(u)&&i(c)?t:i(n)&&i(u)?o(function(t,n){return e(t,n,c)}):i(n)&&i(c)?o(function(t,n){return e(t,u,n)}):i(u)&&i(c)?o(function(t,r){return e(n,t,r)}):i(n)?r(function(t){return e(t,u,c)}):i(u)?r(function(t){return e(n,t,c)}):i(c)?r(function(t){return e(n,u,t)}):e(n,u,c)}}};},function(e,t,n){var r=n(22)(-1);e.exports=r;},function(e,t,n){var r=n(1),o=n(6),i=r(function(e,t){var n=e<0?t.length+e:e;return o(t)?t.charAt(n):t[n]});e.exports=i;},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.RichTextBlock=void 0;var r=n(2);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}var i=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.type=t,this.text=n,this.spans=r;}var t,n,i;return t=e,i=[{key:"isEmbedBlock",value:function(e){return e===r.NODE_TYPES.embed}},{key:"isImageBlock",value:function(e){return e===r.NODE_TYPES.image}},{key:"isList",value:function(e){return e===r.NODE_TYPES.list}},{key:"isOrderedList",value:function(e){return e===r.NODE_TYPES.oList}},{key:"isListItem",value:function(e){return e===r.NODE_TYPES.listItem}},{key:"isOrderedListItem",value:function(e){return e===r.NODE_TYPES.oListItem}},{key:"emptyList",value:function(){return {type:r.NODE_TYPES.list,spans:[],text:""}}},{key:"emptyOrderedList",value:function(){return {type:r.NODE_TYPES.oList,spans:[],text:""}}}],(n=null)&&o(t.prototype,n),i&&o(t,i),e}();t.RichTextBlock=i;},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(4))&&r.__esModule?r:{default:r},i=n(8);var u=function(e,t,n){return o.default.fromRichText(e).children.map(function(e,r){return function(e,t,n,r){return function e(n,o){var u=n instanceof i.SpanNode?n.text:null,c=n.children.reduce(function(t,n,r){return t.concat([e(n,r)])},[]),a=r&&r(n.type,n.element,u,c,o);return a||t(n.type,n.element,u,c,o)}(e,n)}(e,t,r,n)})};t.default=u;}])});
});

unwrapExports(prismicRichtext_min);

var prismicHelpers_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}("undefined"!=typeof self?self:commonjsGlobal,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r});},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){e.exports=n(1);},function(e,t,n){var r=n(2),o=n(3);e.exports={Link:r,Date:o};},function(e,t,n){e.exports={url:function(e,t){if(e&&[e.link_type,e._linkType,e.linkType].some((function(e){return e&&["Document","Link.Document","Link.document"].includes(e)}))&&t&&"function"==typeof t){var n=t(e);if(n)return n}return e&&e.url?e.url:""}};},function(e,t){e.exports=function(e){if(!e)return null;var t=24==e.length?"".concat(e.substring(0,22),":").concat(e.substring(22,24)):e;return new Date(t)};}])}));
});

unwrapExports(prismicHelpers_min);

let defaultRouter;
const createRouter = (opts) => {
    var _a;
    const win = window;
    const url = new URL(win.location.href);
    const parseURL = (_a = opts === null || opts === void 0 ? void 0 : opts.parseURL) !== null && _a !== void 0 ? _a : DEFAULT_PARSE_URL;
    const { state, onChange, dispose } = createStore({
        url,
        activePath: parseURL(url)
    }, (newV, oldV, prop) => {
        if (prop === 'url') {
            return newV.href !== oldV.href;
        }
        return newV !== oldV;
    });
    const push = (href) => {
        history.pushState(null, null, href);
        const url = new URL(href, document.baseURI);
        state.url = url;
        state.activePath = parseURL(url);
    };
    const match = (routes) => {
        const { activePath } = state;
        for (let route of routes) {
            const params = matchPath(activePath, route.path);
            if (params) {
                if (route.to != null) {
                    push(route.to);
                    return match(routes);
                }
                else {
                    return { params, route };
                }
            }
        }
        return undefined;
    };
    const navigationChanged = () => {
        const url = new URL(win.location.href);
        state.url = url;
        state.activePath = parseURL(url);
    };
    const Switch = (_, childrenRoutes) => {
        const result = match(childrenRoutes);
        if (result) {
            if (typeof result.route.jsx === 'function') {
                return result.route.jsx(result.params);
            }
            else {
                return result.route.jsx;
            }
        }
    };
    const disposeRouter = () => {
        defaultRouter = undefined;
        win.removeEventListener('popstate', navigationChanged);
        dispose();
    };
    const router = defaultRouter = {
        Switch,
        get url() {
            return state.url;
        },
        get activePath() {
            return state.activePath;
        },
        push,
        onChange: onChange,
        dispose: disposeRouter,
    };
    // Initial update
    navigationChanged();
    // Listen URL changes
    win.addEventListener('popstate', navigationChanged);
    return router;
};
const Route = (props, children) => {
    var _a;
    if ('to' in props) {
        return {
            path: props.path,
            to: props.to,
        };
    }
    return {
        path: props.path,
        id: props.id,
        jsx: (_a = props.render) !== null && _a !== void 0 ? _a : children,
    };
};
const href = (href, router = defaultRouter) => {
    return {
        href,
        onClick: (ev) => {
            ev.preventDefault();
            router.push(href);
        },
    };
};
const matchPath = (pathname, path) => {
    if (typeof path === 'string') {
        if (path === pathname) {
            return {};
        }
    }
    else if (typeof path === 'function') {
        const params = path(pathname);
        if (params) {
            return params === true
                ? {}
                : { ...params };
        }
    }
    else {
        const results = path.exec(pathname);
        if (results) {
            path.lastIndex = 0;
            return { ...results };
        }
    }
    return undefined;
};
const DEFAULT_PARSE_URL = (url) => {
    return url.pathname.toLowerCase();
};

/**
 * TS adaption of https://github.com/pillarjs/path-to-regexp/blob/master/index.js
 */
/**
 * Default configs.
 */
const DEFAULT_DELIMITER = '/';
const DEFAULT_DELIMITERS = './';
/**
 * The main path matching regexp utility.
 */
const PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g');
/**
 * Parse a string for the raw tokens.
 */
const parse = (str, options) => {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
    var delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS;
    var pathEscaped = false;
    var res;
    while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;
        // Ignore already escaped sequences.
        if (escaped) {
            path += escaped[1];
            pathEscaped = true;
            continue;
        }
        var prev = '';
        var next = str[index];
        var name = res[2];
        var capture = res[3];
        var group = res[4];
        var modifier = res[5];
        if (!pathEscaped && path.length) {
            var k = path.length - 1;
            if (delimiters.indexOf(path[k]) > -1) {
                prev = path[k];
                path = path.slice(0, k);
            }
        }
        // Push the current path onto the tokens.
        if (path) {
            tokens.push(path);
            path = '';
            pathEscaped = false;
        }
        var partial = prev !== '' && next !== undefined && next !== prev;
        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var delimiter = prev || defaultDelimiter;
        var pattern = capture || group;
        tokens.push({
            name: name || key++,
            prefix: prev,
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            partial: partial,
            pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
        });
    }
    // Push any remaining characters.
    if (path || index < str.length) {
        tokens.push(path + str.substr(index));
    }
    return tokens;
};
/**
 * Escape a regular expression string.
 */
const escapeString = (str) => {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
};
/**
 * Escape the capturing group by escaping special characters and meaning.
 */
const escapeGroup = (group) => {
    return group.replace(/([=!:$/()])/g, '\\$1');
};
/**
 * Get the flags for a regexp from the options.
 */
const flags = (options) => {
    return options && options.sensitive ? '' : 'i';
};
/**
 * Pull out keys from a regexp.
 */
const regexpToRegexp = (path, keys) => {
    if (!keys)
        return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                partial: false,
                pattern: null
            });
        }
    }
    return path;
};
/**
 * Transform an array into a regexp.
 */
const arrayToRegexp = (path, keys, options) => {
    var parts = [];
    for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
    }
    return new RegExp('(?:' + parts.join('|') + ')', flags(options));
};
/**
 * Create a path regexp from string input.
 */
const stringToRegexp = (path, keys, options) => {
    return tokensToRegExp(parse(path, options), keys, options);
};
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
const tokensToRegExp = (tokens, keys, options) => {
    options = options || {};
    var strict = options.strict;
    var end = options.end !== false;
    var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER);
    var delimiters = options.delimiters || DEFAULT_DELIMITERS;
    var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
    var route = '';
    var isEndDelimited = false;
    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (typeof token === 'string') {
            route += escapeString(token);
            isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1;
        }
        else {
            var prefix = escapeString(token.prefix || '');
            var capture = token.repeat
                ? '(?:' + token.pattern + ')(?:' + prefix + '(?:' + token.pattern + '))*'
                : token.pattern;
            if (keys)
                keys.push(token);
            if (token.optional) {
                if (token.partial) {
                    route += prefix + '(' + capture + ')?';
                }
                else {
                    route += '(?:' + prefix + '(' + capture + '))?';
                }
            }
            else {
                route += prefix + '(' + capture + ')';
            }
        }
    }
    if (end) {
        if (!strict)
            route += '(?:' + delimiter + ')?';
        route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
    }
    else {
        if (!strict)
            route += '(?:' + delimiter + '(?=' + endsWith + '))?';
        if (!isEndDelimited)
            route += '(?=' + delimiter + '|' + endsWith + ')';
    }
    return new RegExp('^' + route, flags(options));
};
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
const pathToRegexp = (path, keys, options) => {
    if (path instanceof RegExp) {
        return regexpToRegexp(path, keys);
    }
    if (Array.isArray(path)) {
        return arrayToRegexp(path, keys, options);
    }
    return stringToRegexp(path, keys, options);
};

let cacheCount = 0;
const patternCache = {};
const cacheLimit = 10000;
// Memoized function for creating the path match regex
const compilePath = (pattern, options) => {
    const cacheKey = `${options.end}${options.strict}`;
    const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});
    const cachePattern = JSON.stringify(pattern);
    if (cache[cachePattern]) {
        return cache[cachePattern];
    }
    const keys = [];
    const re = pathToRegexp(pattern, keys, options);
    const compiledPattern = { re, keys };
    if (cacheCount < cacheLimit) {
        cache[cachePattern] = compiledPattern;
        cacheCount += 1;
    }
    return compiledPattern;
};
const match = (pathname, options = {}) => {
    const { exact = false, strict = false } = options;
    const { re, keys } = compilePath(pathname, { end: exact, strict });
    return (path) => {
        const match = re.exec(path);
        if (!match) {
            return undefined;
        }
        const [url, ...values] = match;
        const isExact = path === url;
        if (exact && !isExact) {
            return undefined;
        }
        return keys.reduce((memo, key, index) => {
            memo[key.name] = values[index];
            return memo;
        }, {});
    };
};

// Given a set of provided props and extra props,
// merge to two except for the class prop which is concated
const applyProps = (props, extra = {}) => {
    const allKeys = new Set(Object.keys(props).concat(Object.keys(extra)));
    return Array.from(allKeys).reduce((v, k) => {
        if (k in extra) {
            if (k === 'class') {
                v[k] = `${extra[k]} ${props[k] ? props[k] : ''}`;
            }
            else {
                v[k] = extra[k];
            }
        }
        else if (k in props) {
            v[k] = props[k];
        }
        return v;
    }, {});
};

const AnchorButton = (props, children) => h("a", Object.assign({}, applyProps(props, { class: 'ui-button' })), children);

const Button = (props, children) => (h("button", Object.assign({}, applyProps(props, { class: 'ui-button' })), children));

const Card = (props, children) => (h("div", Object.assign({}, applyProps(props, {
    class: `ui-card${props.embelish !== false ? ' ui-card--embelish' : ''}`,
})), children));

const CardContent = (props, children) => (h("div", Object.assign({}, applyProps(props, { class: 'ui-card-content' })), children));

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const DateTime = (_a) => {
    var { date, format = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    } } = _a, props = __rest(_a, ["date", "format"]);
    const formatter = new Intl.DateTimeFormat('en-US', Object.assign({}, format));
    return h("time", Object.assign({}, applyProps(props, { class: 'ui-date' })), formatter.format(date));
};

var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const applyClasses = (cols, xs, sm, md, lg) => {
    const classes = [];
    // General class, doesn't apply column behavior but
    // can be useful for selectors
    classes.push('ui-col');
    if (cols) {
        classes.push(`ui-col-${cols}`);
    }
    else {
        // If no "cols" is specified, add a default 12 to make content go full width
        // in the smallest viewport sizes
        classes.push(`ui-col-12`);
    }
    if (xs) {
        classes.push(`ui-col-xs-${xs}`);
    }
    if (sm) {
        classes.push(`ui-col-sm-${sm}`);
    }
    if (md) {
        classes.push(`ui-col-md-${md}`);
    }
    if (lg) {
        classes.push(`ui-col-lg-${lg}`);
    }
    return classes.join(' ');
};
const Col = (_a, children) => {
    var { cols, xs, sm, md, lg } = _a, props = __rest$1(_a, ["cols", "xs", "sm", "md", "lg"]);
    return (h("div", Object.assign({}, applyProps(props, { class: applyClasses(cols, xs, sm, md, lg) })), children));
};

var __rest$2 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/*
interface GridProps {
  bordered?: boolean;

  xsCols?: number | null;
  smCols?: number | null;
  mdCols?: number | null;
  lgCols?: number | null;

  cols?: number;
  [key: string]: any;
}

const getColClasses = (
  xsCols: number | null,
  smCols: number | null,
  mdCols: number | null,
  lgCols: number | null) => (
    [ ['xs', xsCols], ['sm', smCols], ['md', mdCols], ['lg', lgCols] ].reduce((str, c) => {
      const ct = c[0];
      const cn = c[1];
      if (cn) {
        return `${str} ui-grid-cols-${ct}-${cn}`;
      }
      return str;
    }, '')
  );
*/
const Grid = (_a, children) => {
    var props = __rest$2(_a, []);
    return h("div", Object.assign({}, applyProps(props, { class: `ui-grid` })), children);
};

// import { h } from '@stencil/core';
const listeners = [];
const visible = [];
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((e) => {
        if (e.intersectionRatio > 0) {
            if (visible.indexOf(e.target) < 0) {
                visible.push(e.target);
            }
        }
        else {
            visible.splice(visible.indexOf(e.target), 1);
        }
    });
    listeners.forEach((l) => l({ entries, observer, visible }));
}, { threshold: [0, 1] });
const observe = (el) => el && observer.observe(el);

var __rest$3 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const Heading = (_a, children) => {
    var { level = 3, bordered = false, leading = false, strong = false } = _a, props = __rest$3(_a, ["level", "bordered", "leading", "strong"]);
    const Tag = `h${level}`;
    const classes = [
        `ui-heading`,
        ` ui-heading-${level}`,
        `${bordered ? ` ui-heading--bordered` : ``}`,
        `${leading ? ` ui-heading--leading` : ``}`,
        `${strong ? ` ui-heading--strong` : ``}`
    ];
    return (h(Tag, Object.assign({}, applyProps(props, { class: classes.join('') }), { ref: (e) => observe(e) }), children));
};

const Paragraph = (props, children) => h("p", Object.assign({}, applyProps(props, { class: 'ui-paragraph' })), children);

const ResponsiveContainer = (props, children) => (h("div", Object.assign({}, applyProps(props, { class: 'ui-container' })), children));

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
/**
 * @name parseISO
 * @category Common Helpers
 * @summary Parse ISO string
 *
 * @description
 * Parse the given string in ISO 8601 format and return an instance of Date.
 *
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument isn't a string, the function cannot parse the string or
 * the values are invalid, it returns Invalid Date.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * - The previous `parse` implementation was renamed to `parseISO`.
 *
 *   ```javascript
 *   // Before v2.0.0
 *   parse('2016-01-01')
 *
 *   // v2.0.0 onward
 *   parseISO('2016-01-01')
 *   ```
 *
 * - `parseISO` now validates separate date and time values in ISO-8601 strings
 *   and returns `Invalid Date` if the date is invalid.
 *
 *   ```javascript
 *   parseISO('2018-13-32')
 *   //=> Invalid Date
 *   ```
 *
 * - `parseISO` now doesn't fall back to `new Date` constructor
 *   if it fails to parse a string argument. Instead, it returns `Invalid Date`.
 *
 * @param {String} argument - the value to convert
 * @param {Object} [options] - an object with options.
 * @param {0|1|2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = parseISO('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * var result = parseISO('+02014101', { additionalDigits: 1 })
 * //=> Fri Apr 11 2014 00:00:00
 */

function parseISO(argument, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var additionalDigits = options.additionalDigits == null ? DEFAULT_ADDITIONAL_DIGITS : toInteger(options.additionalDigits);

  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError('additionalDigits must be 0, 1 or 2');
  }

  if (!(typeof argument === 'string' || Object.prototype.toString.call(argument) === '[object String]')) {
    return new Date(NaN);
  }

  var dateStrings = splitDateString(argument);
  var date;

  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }

  if (isNaN(date) || !date) {
    return new Date(NaN);
  }

  var timestamp = date.getTime();
  var time = 0;
  var offset;

  if (dateStrings.time) {
    time = parseTime(dateStrings.time);

    if (isNaN(time) || time === null) {
      return new Date(NaN);
    }
  }

  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);

    if (isNaN(offset)) {
      return new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time); // js parsed string assuming it's in UTC timezone
    // but we need it to be parsed in our timezone
    // so we use utc values to build date in our timezone.
    // Year values from 0 to 99 map to the years 1900 to 1999
    // so set year explicitly with setFullYear.

    var result = new Date(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate(), dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    result.setFullYear(dirtyDate.getUTCFullYear());
    return result;
  }

  return new Date(timestamp + time + offset);
}

function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;

  if (/:/.test(array[0])) {
    dateStrings.date = null;
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];

    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }

  if (timeString) {
    var token = patterns.timezone.exec(timeString);

    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  var regex = new RegExp('^(?:(\\d{4}|[+-]\\d{' + (4 + additionalDigits) + '})|(\\d{2}|[+-]\\d{' + (2 + additionalDigits) + '})$)');
  var captures = dateString.match(regex); // Invalid ISO-formatted year

  if (!captures) return {
    year: null
  };
  var year = captures[1] && parseInt(captures[1]);
  var century = captures[2] && parseInt(captures[2]);
  return {
    year: century == null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) return null;
  var captures = dateString.match(dateRegex); // Invalid ISO-formatted string

  if (!captures) return null;
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;

  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }

    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = new Date(0);

    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return new Date(NaN);
    }

    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}

function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}

function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures) return null; // Invalid ISO-formatted time

  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);

  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }

  return hours * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000;
}

function parseTimeUnit(value) {
  return value && parseFloat(value.replace(',', '.')) || 0;
}

function parseTimezone(timezoneString) {
  if (timezoneString === 'Z') return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  var sign = captures[1] === '+' ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;

  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }

  return sign * (hours * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE);
}

function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
} // Validation functions
// February is null to handle the leap year (using ||)


var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100;
}

function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}

function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}

function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}

function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }

  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}

function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}

const Router = createRouter();

const getBlogPostUrl = (doc) => `/blog/${doc.slug}`;
const BlogPost = ({ post, single = true }) => {
    const content = single ? post.html : post.html;
    return (h("div", { class: "blog-post__wrap" },
        single && h("a", Object.assign({}, href('/blog', Router)), "Blog"),
        h("div", { class: "blog-post" },
            h(Heading, { level: 2 }, post.title),
            h(PostAuthor, { authorName: post.authorName, dateString: post.date }),
            h(PostContent, { html: content }),
            !single && h("a", Object.assign({}, href(getBlogPostUrl(post), Router)),
                "Continue reading ",
                h("ion-icon", { name: "arrow-forward" })),
            single && h("disqus-comments", { url: getBlogPostUrl(post), id: post.slug }))));
};
const PostContent = ({ html }) => (h("div", { innerHTML: html }));
const PostAuthor = ({ authorName, dateString }) => {
    const date = parseISO(dateString);
    return (h("div", { class: "blog-post__author" },
        h("span", null,
            "By ",
            authorName,
            " on ",
            h(DateTime, { date: date }))));
};

var posts = [
	{
		title: "Announcing Capacitor 2.0",
		authorName: "Max Lynch",
		authorEmail: "max@ionic.io",
		slug: "announcing-capacitor-2-0",
		date: "2020-04-08T08:00:00.000Z",
		contents: "---\ntitle: Announcing Capacitor 2.0\ndate: 2020-04-08 08:00:00\nauthor: Max Lynch <max@ionic.io>\n---\n\nToday we are excited to announce capacitor 2.0.\n\n## This is a heading\n\nHere's some content\n\n```bash\nnpm install cool-thing\n```",
		html: "<p>Today we are excited to announce capacitor 2.0.</p>\n<h2 id=\"this-is-a-heading\">This is a heading</h2>\n<p>Here&#39;s some content</p>\n<pre><code class=\"language-bash\"><span class=\"token function\">npm</span> <span class=\"token function\">install</span> cool-thing</code></pre>\n",
		meta: {
			title: "Announcing Capacitor 2.0",
			date: "2020-04-08T08:00:00.000Z",
			author: "Max Lynch <max@ionic.io>"
		}
	},
	{
		title: "Announcing Capacitor 1.0",
		authorName: "Max Lynch",
		authorEmail: "max@ionic.io",
		slug: "announcing-capacitor-1-0",
		date: "2019-05-22T08:00:00.000Z",
		contents: "---\ntitle: Announcing Capacitor 1.0\ndate: 2019-05-22 08:00:00\nauthor: Max Lynch <max@ionic.io>\n---\n\nToday I’m thrilled to announce the 1.0 release of [Capacitor](/), Ionic’s new Native API Container that makes it easy to build web apps that run on iOS, Android, and the web as Progressive Web Apps—with full access to native functionality on each platform.\n",
		html: "<p>Today I’m thrilled to announce the 1.0 release of <a href=\"/\">Capacitor</a>, Ionic’s new Native API Container that makes it easy to build web apps that run on iOS, Android, and the web as Progressive Web Apps—with full access to native functionality on each platform.</p>\n",
		meta: {
			title: "Announcing Capacitor 1.0",
			date: "2019-05-22T08:00:00.000Z",
			author: "Max Lynch <max@ionic.io>"
		}
	}
];

const blogPageCss = ".sc-blog-page-h{display:block;background:#F5F5F5;padding-top:100px;height:100%}.ui-heading.sc-blog-page{font-family:var(--f-family-text)}h2.sc-blog-page{margin-top:0}a.sc-blog-page{text-decoration:none}.blog-posts.sc-blog-page{margin:0 auto;padding-bottom:96px;max-width:830px}.blog-posts__heading.sc-blog-page{margin-bottom:32px}.blog-posts__heading.sc-blog-page .ui-heading.sc-blog-page{font-size:28px;font-weight:600}.blog-post.sc-blog-page{padding:96px;background:white;border-radius:4px;-webkit-box-shadow:var(--elevation-2);box-shadow:var(--elevation-2)}.blog-post.sc-blog-page ion-icon.sc-blog-page{vertical-align:middle}.blog-post.sc-blog-page .ui-heading.sc-blog-page{margin:0}.blog-post.sc-blog-page p.sc-blog-page{color:#111}.blog-post.sc-blog-page li.sc-blog-page{margin-top:6px}.blog-post__wrap.sc-blog-page{margin:0 auto;padding-bottom:96px;max-width:830px}.blog-post__author.sc-blog-page{color:#92A0B3;margin-top:32px;margin-bottom:56px}.blog-post__author.sc-blog-page img.sc-blog-page{display:inline-block;vertical-align:middle;margin-top:-2px;height:28px;border-radius:50%;margin-right:8px}";

class BlogPage {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async componentWillLoad() {
        this.posts = posts.slice(0, 10);
    }
    render() {
        if (this.posts) {
            console.log('Rendering posts', this.posts);
            return (h(AllPosts, { posts: this.posts }));
        }
        return null;
    }
    static get style() { return blogPageCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "blog-page",
        "$members$": {
            "posts": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}
const AllPosts = ({ posts }) => {
    return (h("div", { class: "blog-posts" }, h("hgroup", { class: "blog-posts__heading" }, h(Heading, { level: 3 }, "Blog")), posts.map(p => h(BlogPost, { post: p, single: false }))));
};

const blogPageCss$1 = ".sc-blog-post-h{display:block;background:#F5F5F5;padding-top:100px;height:100%}.ui-heading.sc-blog-post{font-family:var(--f-family-text)}h2.sc-blog-post{margin-top:0}a.sc-blog-post{text-decoration:none}.blog-posts.sc-blog-post{margin:0 auto;padding-bottom:96px;max-width:830px}.blog-posts__heading.sc-blog-post{margin-bottom:32px}.blog-posts__heading.sc-blog-post .ui-heading.sc-blog-post{font-size:28px;font-weight:600}.blog-post.sc-blog-post{padding:96px;background:white;border-radius:4px;-webkit-box-shadow:var(--elevation-2);box-shadow:var(--elevation-2)}.blog-post.sc-blog-post ion-icon.sc-blog-post{vertical-align:middle}.blog-post.sc-blog-post .ui-heading.sc-blog-post{margin:0}.blog-post.sc-blog-post p.sc-blog-post{color:#111}.blog-post.sc-blog-post li.sc-blog-post{margin-top:6px}.blog-post__wrap.sc-blog-post{margin:0 auto;padding-bottom:96px;max-width:830px}.blog-post__author.sc-blog-post{color:#92A0B3;margin-top:32px;margin-bottom:56px}.blog-post__author.sc-blog-post img.sc-blog-post{display:inline-block;vertical-align:middle;margin-top:-2px;height:28px;border-radius:50%;margin-right:8px}";

class BlogPage$1 {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async componentWillLoad() {
        console.log('BLOG COMPONENT WILL LOAD');
        const { slug } = this;
        if (slug) {
            this.slug = slug;
            this.post = posts.find(p => p.slug === this.slug);
            console.log('Fetching blog post', slug, this.post);
        }
    }
    render() {
        if (this.slug && this.post) {
            return (h(BlogPost, { post: this.post }));
        }
        return null;
    }
    static get style() { return blogPageCss$1; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "blog-post",
        "$members$": {
            "slug": [1],
            "post": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const capacitorCommunityCss = ".sc-capacitor-community-h{display:block}hgroup.sc-capacitor-community{text-align:center;padding:var(--space-11) 0;max-width:560px;margin:auto}hgroup.sc-capacitor-community .ui-heading.sc-capacitor-community{font-family:var(--f-family-display);font-weight:600;letter-spacing:var(--f-tracking-dense);color:var(--c-carbon-100)}.ui-col.sc-capacitor-community a.sc-capacitor-community{display:block}.ui-col.sc-capacitor-community img.sc-capacitor-community{display:block;max-width:100%}.ui-col.sc-capacitor-community .ui-heading.sc-capacitor-community{margin:32px 0 24px;font-size:20px;font-family:var(--f-family-text)}";

class CapacitorCommunity {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h(ResponsiveContainer, null, h("hgroup", null, h(Heading, { level: 1 }, "Community"), h(Paragraph, null, "Capacitor is a large and growing project with a passionate community. Engage with the Capacitor team and other helpful community members through the forum, Capacitor Community org, and Twitter.")), h(Grid, null, h(Col, { md: 4, sm: 4, xs: 4, cols: 12 }, h("a", { href: "https://github.com/ionic-team/capacitor/discussions" }, h("img", { src: "/assets/img/community/support-community-forum.png", alt: "GitHub Discussions" })), h(Heading, { level: 2 }, "GitHub Discussions"), h(Paragraph, null, "Join the community in discussing new features, asking questions, and help others get started")), h(Col, { md: 4, sm: 4, xs: 4, cols: 12 }, h("a", { href: "https://github.com/capacitor-community" }, h("img", { src: "/assets/img/community/support-community.png", alt: "GitHub Discussions" })), h(Heading, { level: 2 }, "Capacitor Community"), h(Paragraph, null, "View a list of curated community plugins to enhance your app even more. From music controls, advanced native HTTP, and more")), h(Col, { md: 4, sm: 4, xs: 4, cols: 12 }, h("a", { href: "https://twitter.com/capacitorjs" }, h("img", { src: "/assets/img/community/support-twitter.png", alt: "GitHub Discussions" })), h(Heading, { level: 2 }, "Twitter"), h(Paragraph, null, "Found a potential bug in Capacitor? Let us know on Github and consider sending a Pull Request to become a contributor"))))));
    }
    static get style() { return capacitorCommunityCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "capacitor-community",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const capacitorSiteFooterCss = ".sc-capacitor-site-footer-h{display:block;border-top:1px solid var(--c-indigo-20);padding:64px 0}.copyright.sc-capacitor-site-footer p.sc-capacitor-site-footer{color:var(--c-indigo-70)}.copyright.sc-capacitor-site-footer a.sc-capacitor-site-footer{color:var(--c-indigo-70);font-weight:normal}img.logo.sc-capacitor-site-footer{width:106px}.ui-heading.sc-capacitor-site-footer{color:var(--c-carbon-80)}ul.sc-capacitor-site-footer li.sc-capacitor-site-footer{margin-top:6px}ul.sc-capacitor-site-footer li.sc-capacitor-site-footer a.sc-capacitor-site-footer{color:var(--c-indigo-70)}";

class CapacitorSiteFooter {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h("footer", null, h(ResponsiveContainer, null, h(Grid, null, h(Col, { md: 6, sm: 6, xs: 12, cols: 12, class: "copyright" }, h("img", { src: "/assets/img/logo-white2.png", alt: "Capacitor Logo", class: "logo" }), h("p", null, "Copyright @ ", (new Date()).getFullYear(), " Drifty Co."), h("p", null, h("a", { href: "https://ionic.io" }, "Ionic Open Source"), " | Released under ", h("span", { id: "mit" }, "MIT License"))), h(Col, { md: 6, sm: 6, xs: 12, cols: 12 }, h(Grid, null, h(Col, { md: 4, sm: 4, xs: 4, cols: 4 }, h(Heading, { level: 5 }, "Developers"), h("ul", null, h("li", null, h("a", { href: "/docs/getting-started" }, "Install")), h("li", null, h("a", { href: "/docs" }, "Docs")), h("li", null, h("a", { href: "/docs/apis" }, "APIs")))), h(Col, { md: 4, sm: 4, xs: 4, cols: 4 }, h(Heading, { level: 5 }, "Resources"), h("ul", null, h("li", null, h("a", { href: "/community" }, "Community")), h("li", null, h("a", { href: "/blog" }, "Blog")), h("li", null, h("a", { href: "https://github.com/ionic-team/capacitor/discussions" }, "Discussions")))), h(Col, { md: 4, sm: 4, xs: 4, cols: 4 }, h(Heading, { level: 5 }, "Connect"), h("ul", null, h("li", null, h("a", { href: "https://github.com/ionic-team/capacitor" }, "GitHub")), h("li", null, h("a", { href: "https://twitter.com/capacitorjs" }, "Twitter")), h("li", null, h("a", { href: "https://ionic.io" }, "Ionic")))))))))));
    }
    static get style() { return capacitorSiteFooterCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "capacitor-site-footer",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const capacitorSiteRoutesCss = ":host{display:block}";

class CapacitorSiteRoutes {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentWillLoad() {
        Router.onChange('url', (newValue, _oldValue) => {
            window.gtag('config', 'UA-44023830-42', { 'page_path': newValue.pathname + newValue.search });
            state.isLeftSidebarIn = false;
            state.pageTheme = 'light';
        });
    }
    render() {
        return (h(Host, null, h(Router.Switch, null, h(Route, { path: "/" }, h("landing-page", null)), h(Route, { path: match('/blog', { exact: true }), render: () => {
                return h("blog-page", null);
            } }), h(Route, { path: match('/blog/:slug'), render: ({ slug }) => {
                return h("blog-post", { slug: slug });
            } }), h(Route, { path: "/enterprise" }, h("capacitor-enterprise", null)), h(Route, { path: "/community" }, h("capacitor-community", null)), h(Route, { path: "/docs" }, h("document-component", { page: "/docs/" })), h(Route, { path: match('/docs/:pageName*'), render: ({ pageName }) => (h("document-component", { page: `/docs/${pageName}` })) }))));
    }
    static get style() { return capacitorSiteRoutesCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "capacitor-site-routes",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const codeSnippetCss = "/*!@code[class*=language-],\npre[class*=language-]*/code[class*=language-].sc-code-snippet,pre[class*=language-].sc-code-snippet{color:#ccc;background:none;font-family:Consolas, Monaco, \"Andale Mono\", \"Ubuntu Mono\", monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}/*!@pre[class*=language-]*/pre[class*=language-].sc-code-snippet{padding:1em;margin:0.5em 0;overflow:auto}/*!@:not(pre) > code[class*=language-],\npre[class*=language-]*/.sc-code-snippet:not(pre)>code[class*=language-].sc-code-snippet,pre[class*=language-].sc-code-snippet{background:#2d2d2d}/*!@:not(pre) > code[class*=language-]*/.sc-code-snippet:not(pre)>code[class*=language-].sc-code-snippet{padding:0.1em;border-radius:0.3em;white-space:normal}/*!@.token.comment,\n.token.block-comment,\n.token.prolog,\n.token.doctype,\n.token.cdata*/.token.comment.sc-code-snippet,.token.block-comment.sc-code-snippet,.token.prolog.sc-code-snippet,.token.doctype.sc-code-snippet,.token.cdata.sc-code-snippet{color:#999}/*!@.token.punctuation*/.token.punctuation.sc-code-snippet{color:#ccc}/*!@.token.tag,\n.token.attr-name,\n.token.namespace,\n.token.deleted*/.token.tag.sc-code-snippet,.token.attr-name.sc-code-snippet,.token.namespace.sc-code-snippet,.token.deleted.sc-code-snippet{color:#e2777a}/*!@.token.function-name*/.token.function-name.sc-code-snippet{color:#6196cc}/*!@.token.boolean,\n.token.number,\n.token.function*/.token.boolean.sc-code-snippet,.token.number.sc-code-snippet,.token.function.sc-code-snippet{color:#f08d49}/*!@.token.property,\n.token.class-name,\n.token.constant,\n.token.symbol*/.token.property.sc-code-snippet,.token.class-name.sc-code-snippet,.token.constant.sc-code-snippet,.token.symbol.sc-code-snippet{color:#f8c555}/*!@.token.selector,\n.token.important,\n.token.atrule,\n.token.keyword,\n.token.builtin*/.token.selector.sc-code-snippet,.token.important.sc-code-snippet,.token.atrule.sc-code-snippet,.token.keyword.sc-code-snippet,.token.builtin.sc-code-snippet{color:#cc99cd}/*!@.token.string,\n.token.char,\n.token.attr-value,\n.token.regex,\n.token.variable*/.token.string.sc-code-snippet,.token.char.sc-code-snippet,.token.attr-value.sc-code-snippet,.token.regex.sc-code-snippet,.token.variable.sc-code-snippet{color:#7ec699}/*!@.token.operator,\n.token.entity,\n.token.url*/.token.operator.sc-code-snippet,.token.entity.sc-code-snippet,.token.url.sc-code-snippet{color:#67cdcc}/*!@.token.important,\n.token.bold*/.token.important.sc-code-snippet,.token.bold.sc-code-snippet{font-weight:bold}/*!@.token.italic*/.token.italic.sc-code-snippet{font-style:italic}/*!@.token.entity*/.token.entity.sc-code-snippet{cursor:help}/*!@.token.inserted*/.token.inserted.sc-code-snippet{color:green}/*!@:host*/.sc-code-snippet-h{display:block}/*!@:not(pre) > code[class*=language-], pre[class*=language-]*/.sc-code-snippet:not(pre)>code[class*=language-].sc-code-snippet,pre[class*=language-].sc-code-snippet{background:#0B2231;border-radius:8px}/*!@:not(pre) > code[class*=language-] code, pre[class*=language-] code*/.sc-code-snippet:not(pre)>code[class*=language-].sc-code-snippet code.sc-code-snippet,pre[class*=language-].sc-code-snippet code.sc-code-snippet{font-size:14px;color:var(--c-carbon-10)}";

class CodeSnippet {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentDidLoad() {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/prismjs@latest/components/prism-' + this.language + '.js';
        script.async = true;
        script.addEventListener('load', () => {
            window.Prism.highlightElement(this.codeRef, false);
        });
        this.scriptEl = script;
        this.el.appendChild(script);
    }
    componentDidUnload() {
        var _a, _b;
        (_b = (_a = this.scriptEl) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.scriptEl);
    }
    render() {
        return (h(Host, null, h("pre", null, h("code", { class: `language-${this.language}`, ref: e => this.codeRef = e }, this.code.trim()))));
    }
    get el() { return getElement(this); }
    static get style() { return codeSnippetCss; }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "code-snippet",
        "$members$": {
            "language": [1],
            "code": [1]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const contributorListCss = "contributor-list{display:block}contributor-list ul.img-list{display:-ms-flexbox;display:flex;-ms-flex-direction:row-reverse;flex-direction:row-reverse;-ms-flex-pack:end;justify-content:flex-end;list-style:none;margin:0;padding:0}contributor-list li:last-child{margin-left:0 !important}contributor-list li:not(:last-child){margin-left:-10px}contributor-list img{border:solid 2px var(--background);border-radius:50%;height:32px;width:32px;border:2px solid #FFF}contributor-list a.contributor-img{display:block;border:none;-webkit-transition:-webkit-transform 50ms ease-out;transition:-webkit-transform 50ms ease-out;transition:transform 50ms ease-out;transition:transform 50ms ease-out, -webkit-transform 50ms ease-out}@media (hover: hover){contributor-list a:hover{-webkit-transform:scale(1.125);transform:scale(1.125);z-index:1}}";

class ContributorList {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.contributors = [];
        this.link = (contributor) => `https://github.com/${contributor}`;
    }
    render() {
        if (this.contributors.length === 0) {
            return null;
        }
        return (h("ul", { class: "img-list" }, this.contributors.reverse().map(contributor => (h("li", null, h("a", { class: "contributor-img", target: "_blank", href: this.link(contributor) }, h("img", { src: `https://github.com/${contributor}.png?size=90`, title: `Contributor ${contributor}` })))))));
    }
    static get style() { return contributorListCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "contributor-list",
        "$members$": {
            "contributors": [16],
            "link": [16]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const demoCss = "@charset \"UTF-8\";:root{--c-white:#ffffff;--c-black:#000000;--c-blue-0:#f0f6ff;--c-blue-10:#e3edff;--c-blue-20:#cddfff;--c-blue-30:#b2ceff;--c-blue-40:#97bdff;--c-blue-50:#7cabff;--c-blue-60:#639bff;--c-blue-70:#4d8dff;--c-blue-80:#3880ff;--c-blue-90:#1b6dff;--c-blue-100:#0054e9;--c-ionic-brand:var(--c-blue-80);--c-gray-0:#f3f3f3;--c-gray-10:#e4e4e4;--c-gray-20:#c8c8c8;--c-gray-30:#aeaeae;--c-gray-40:#959595;--c-gray-50:#818181;--c-gray-60:#6d6d6d;--c-gray-70:#5f5f5f;--c-gray-80:#474747;--c-gray-90:#2f2f2f;--c-gray-100:#141414;--c-carbon-0:#eef1f3;--c-carbon-10:#d7dde2;--c-carbon-20:#b4bcc6;--c-carbon-30:#98a2ad;--c-carbon-40:#7d8894;--c-carbon-50:#677483;--c-carbon-60:#556170;--c-carbon-70:#434f5e;--c-carbon-80:#35404e;--c-carbon-90:#222d3a;--c-carbon-100:#03060b;--c-indigo-0:#fbfbfd;--c-indigo-10:#f6f8fb;--c-indigo-20:#e9edf3;--c-indigo-30:#dee3ea;--c-indigo-40:#ced6e0;--c-indigo-50:#b2becd;--c-indigo-60:#92a0b3;--c-indigo-70:#73849a;--c-indigo-80:#445b78;--c-indigo-90:#2d4665;--c-indigo-100:#001a3a;--c-green-0:#effff3;--c-green-10:#e7ffee;--c-green-20:#d0ffdd;--c-green-30:#b8ffcb;--c-green-40:#97ffb3;--c-green-50:#71f895;--c-green-60:#4ef27a;--c-green-70:#31e962;--c-green-80:#18dd4c;--c-green-90:#00d338;--c-green-100:#00b831;--c-lime-0:#f8fff0;--c-lime-10:#f2ffe1;--c-lime-20:#eeffd8;--c-lime-30:#e5ffc3;--c-lime-40:#d8ffa7;--c-lime-50:#c8ff83;--c-lime-60:#b7f964;--c-lime-70:#a7f544;--c-lime-80:#97ec2d;--c-lime-90:#87e017;--c-lime-100:#75d100;--c-lavender-0:#f6f8ff;--c-lavender-10:#e5ebff;--c-lavender-20:#ced9ff;--c-lavender-30:#b6c6ff;--c-lavender-40:#9fb5ff;--c-lavender-50:#8aa4ff;--c-lavender-60:#7493ff;--c-lavender-70:#597eff;--c-lavender-80:#3c67ff;--c-lavender-90:#194bfd;--c-lavender-100:#0033e8;--c-purple-0:#f4f4ff;--c-purple-10:#e9eaff;--c-purple-20:#d0d2ff;--c-purple-30:#b6b9f9;--c-purple-40:#9a99fc;--c-purple-50:#8482fb;--c-purple-60:#786df9;--c-purple-70:#6e5afd;--c-purple-80:#6030ff;--c-purple-90:#4712fb;--c-purple-100:#3400e5;--c-pink-0:#fff2fb;--c-pink-10:#ffe3f6;--c-pink-20:#ffd4f1;--c-pink-30:#ffc7ec;--c-pink-40:#ffb6e8;--c-pink-50:#ff9cdf;--c-pink-60:#fc82d5;--c-pink-70:#f567c8;--c-pink-80:#ef4cbb;--c-pink-90:#f02fb2;--c-pink-100:#e410a1;--c-red-0:#fff2f2;--c-red-10:#ffdddd;--c-red-20:#ffc8c7;--c-red-30:#ffb6b5;--c-red-40:#ff9e9c;--c-red-50:#ff8a88;--c-red-60:#ff7370;--c-red-70:#ff605b;--c-red-80:#ff4747;--c-red-90:#ff201a;--c-red-100:#e70700;--c-orange-0:#fff5f0;--c-orange-10:#ffede5;--c-orange-20:#ffdfd1;--c-orange-30:#ffd0bc;--c-orange-40:#ffc0a5;--c-orange-50:#ffaf8c;--c-orange-60:#ff9b70;--c-orange-70:#ff8753;--c-orange-80:#ff7336;--c-orange-90:#ff5b13;--c-orange-100:#eb4700;--c-yellow-0:#fffbef;--c-yellow-10:#fff8e3;--c-yellow-20:#fff6d8;--c-yellow-30:#fff3c9;--c-yellow-50:#ffedad;--c-yellow-50:#ffe78f;--c-yellow-60:#ffe072;--c-yellow-70:#ffd84d;--c-yellow-80:#ffd130;--c-yellow-90:#ffc805;--c-yellow-100:#f5bf00;--c-aqua-0:#f0fff9;--c-aqua-10:#e5fff6;--c-aqua-20:#d5ffef;--c-aqua-30:#c0ffe8;--c-aqua-40:#aaffe0;--c-aqua-50:#90fbd4;--c-aqua-60:#70f6c5;--c-aqua-70:#4deeb2;--c-aqua-80:#32e2a1;--c-aqua-90:#00db8a;--c-aqua-100:#00cc80;--c-teal-0:#eefeff;--c-teal-10:#dffdff;--c-teal-20:#d0fdff;--c-teal-30:#bbfcff;--c-teal-40:#a2fcff;--c-teal-50:#8bfbff;--c-teal-60:#73f6fb;--c-teal-70:#55ecf2;--c-teal-80:#35e2e9;--c-teal-90:#1bd2d9;--c-teal-100:#00b9c0;--c-cyan-0:#f3faff;--c-cyan-10:#e8f5ff;--c-cyan-20:#d3ecff;--c-cyan-30:#bfe4ff;--c-cyan-40:#a7daff;--c-cyan-50:#8dcfff;--c-cyan-60:#77c6ff;--c-cyan-70:#62bdff;--c-cyan-80:#46b1ff;--c-cyan-90:#24a3ff;--c-cyan-100:#0091fa}@font-face{font-family:Eina;font-display:swap;src:url(/assets/fonts/eina/eina-01-bold.woff2) format(\"woff2\"), url(/assets/fonts/eina/eina-01-bold.woff) format(\"woff\"), url(/assets/fonts/eina/eina-01-bold.ttf) format(\"ttf\"), url(/assets/fonts/eina/eina-01-bold.eot?#iefix) format(\"eot\");font-weight:700;unicode-range:U+000-5FF}@font-face{font-family:Eina;font-display:swap;src:url(/assets/fonts/eina/eina-01-semibold.woff2) format(\"woff2\"), url(/assets/fonts/eina/eina-01-semibold.woff) format(\"woff\"), url(/assets/fonts/eina/eina-01-semibold.ttf) format(\"ttf\"), url(/assets/fonts/eina/eina-01-semibold.eot?#iefix) format(\"eot\");font-weight:600;unicode-range:U+000-5FF}@font-face{font-family:Eina;font-display:swap;src:url(/assets/fonts/eina/eina-01-regular.woff2) format(\"woff2\"), url(/assets/fonts/eina/eina-01-regular.woff) format(\"woff\"), url(/assets/fonts/eina/eina-01-regular.ttf) format(\"ttf\"), url(/assets/fonts/eina/eina-01-regular.eot?#iefix) format(\"eot\");font-weight:400;unicode-range:U+000-5FF}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:400;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Regular.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Regular.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:400;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Italic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Italic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:500;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Medium.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Medium.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:500;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-MediumItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-MediumItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:600;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-SemiBold.woff2) format(\"woff2\"), url(/assets/fonts/Inter-SemiBold.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:600;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-SemiBoldItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-SemiBoldItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:700;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Bold.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Bold.woff) format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:700;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-BoldItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-BoldItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:800;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-ExtraBold.woff2) format(\"woff2\"), url(/assets/fonts/Inter-ExtraBold.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:800;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-ExtraBoldItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-ExtraBoldItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:900;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Black.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Black.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:900;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-BlackItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-BlackItalic.woff) format(\"woff\")}@font-face{font-family:FreightTextPro;font-display:swap;font-weight:400;unicode-range:U+000-5FF;src:url(/assets/fonts/29D26A_0_0.eot);src:url(/assets/fonts/29D26A_0_0.eot?#iefix) format(\"embedded-opentype\"), url(/assets/fonts/29D26A_0_0.woff) format(\"woff\"), url(/assets/fonts/29D26A_0_0.ttf) format(\"truetype\")}@font-face{font-family:FreightTextPro;font-display:swap;font-weight:500;unicode-range:U+000-5FF;src:url(/assets/fonts/29D26A_1_0.eot);src:url(/assets/fonts/29D26A_1_0.eot?#iefix) format(\"embedded-opentype\"), url(/assets/fonts/29D26A_1_0.woff) format(\"woff\"), url(/assets/fonts/29D26A_1_0.ttf) format(\"truetype\")}:root{--f-family-display:\"Eina\", \"Helvetica Neue\", Helvetica, sans-serif;--f-family-text:\"Inter\", \"Inter UI\", Helvetica, Arial, sans-serif;--f-family-system:apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;--f-family-monospace:\"SF Mono\", \"Roboto Mono\", Menlo, monospace;--f-family-serif:\"Adobe Caslon\", Georgia, Times, \"Times New Roman\", serif;--f-size-root:16px;--f-size-0:0.625rem;--f-size-1:0.6875rem;--f-size-2:0.75rem;--f-size-3:0.8125rem;--f-size-4:0.875rem;--f-size-5:1.00rem;--f-size-6:1.25rem;--f-size-7:1.50rem;--f-size-8:2.00rem;--f-size-9:2.50rem;--f-size-10:3.00rem;--f-size-11:3.50rem;--f-size-12:4.00rem;--f-size-13:4.50rem;--f-size-14:5.00rem;--f-size-15:5.50rem;--f-size-16:6.00rem;--f-leading-solid:1.0;--f-leading-title:1.12;--f-leading-body:1.6;--f-leading-prose:1.8;--f-tracking-dense:-0.04em;--f-tracking-tight:-0.02em;--f-tracking-solid:0.00em;--f-tracking-wide:0.04em;--f-tracking-super:0.08em;--f-tracking-extra:0.16em;--f-weight-light:300;--f-weight-regular:400;--f-weight-medium:500;--f-weight-semibold:600;--f-weight-bold:700}:root{--space-0:0.25rem;--space-1:0.50rem;--space-2:0.75rem;--space-3:1.00rem;--space-4:1.25rem;--space-5:1.5rem;--space-6:2.00rem;--space-7:2.50rem;--space-8:3.00rem;--space-9:4.00rem;--space-10:5.00rem;--space-11:6.00rem;--space-12:8.00rem;--space-13:10.00rem;--space-14:12.00rem;--space-15:14.00rem;--space-16:16.00rem;}:root{--radii-0:0;--radii-1:6px;--radii-2:8px;--radii-3:16px;--radii-4:100%}:root{--elevation-0:none;--elevation-1:0px 1px 2px rgba(2, 8, 20, 0.10), 0px 0px 1px rgba(2, 8, 20, 0.08);--elevation-2:0px 2px 4px rgba(2, 8, 20, 0.10), 0px 1px 2px rgba(2, 8, 20, 0.08);--elevation-3:0px 4px 8px rgba(2, 8, 20, 0.08), 0px 2px 4px rgba(2, 8, 20, 0.08);--elevation-4:0px 8px 16px rgba(2, 8, 20, 0.08), 0px 4px 8px rgba(2, 8, 20, 0.08);--elevation-5:0px 16px 32px rgba(2, 8, 20, 0.08), 0px 8px 16px rgba(2, 8, 20, 0.08);--elevation-6:0px 32px 64px rgba(2, 8, 20, 0.08), 0px 16px 32px rgba(2, 8, 20, 0.10)}:root{--z-subnav:1000;--z-header-dropdown:1005}.ui-blockquote{background:#f2f5f8;border-radius:4px;position:relative;padding:64px 80px 68px 111px;color:#5e749a;font-family:\"Adobe Caslon\", Georgia, Times, \"Times New Roman\", serif;font-style:italic;border:none;margin:77px -16px 54px}.ui-blockquote:before{position:absolute;top:-6px;left:54px;font-size:180px;content:\"“\";color:#e3e7ec}.ui-breadcrumbs{font-size:13px;line-height:14px;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center}.ui-breadcrumbs li{display:inline-block}.ui-breadcrumbs li:first-child a{padding-left:0}.ui-breadcrumbs li:last-child a{color:var(--c-carbon-100);font-weight:500}.ui-breadcrumbs a{color:var(--c-carbon-50);font-size:13px;line-height:14px;padding:16px 2px;display:inline-block}.ui-breadcrumbs .nav-sep{display:inline-block;font-size:16px;font-weight:400;color:rgba(65, 77, 92, 0.2);margin:0 6px}.ui-breakpoint{display:none !important}@media (max-width: 480px){.ui-breakpoint-mobile{display:block !important}}@media (max-width: 480px){.ui-breakpoint-mobile.ui-breakpoint-inline-block{display:inline-block !important}}@media (min-width: 480px) and (max-width: 768px){.ui-breakpoint-tablet{display:block !important}}@media (min-width: 480px) and (max-width: 768px){.ui-breakpoint-tablet.ui-breakpoint-inline-block{display:inline-block !important}}@media (min-width: 768px){.ui-breakpoint-desktop{display:block !important}}@media (min-width: 768px){.ui-breakpoint-desktop.ui-breakpoint-inline-block{display:inline-block !important}}.ui-button{cursor:pointer;display:inline-block;font-weight:500;border-radius:8px;line-height:1.4em;padding:16px 20px;-webkit-transition:all 0.3s ease;transition:all 0.3s ease;font-size:16px;border:0px solid rgba(0, 0, 0, 0);color:#fff;background:var(--button-background, var(--c-ionic-brand));letter-spacing:0.01em}.ui-card--embelish{background-color:#fff;border-radius:6px;-webkit-box-shadow:var(--elevation-4);box-shadow:var(--elevation-4);border-radius:14px}.ui-card--embelish .ui-card-content{padding:32px}.ui-container{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width: 768px){.ui-container{width:750px}}@media (min-width: 992px){.ui-container{width:970px}}@media (min-width: 1104px){.ui-container{width:1054px}}.ui-grid{display:grid;-webkit-column-gap:56px;-moz-column-gap:56px;column-gap:56px;row-gap:96px;grid-template-columns:repeat(12, minmax(0, 1fr))}@media (max-width: 480px){.ui-grid{-webkit-column-gap:0;-moz-column-gap:0;column-gap:0;row-gap:48px}}@media (max-width: 768px){.ui-grid{-webkit-column-gap:0;-moz-column-gap:0;column-gap:0;row-gap:24px}}.ui-grid .ui-col-1{grid-column-end:span 1}.ui-grid .ui-col-2{grid-column-end:span 2}.ui-grid .ui-col-3{grid-column-end:span 3}.ui-grid .ui-col-4{grid-column-end:span 4}.ui-grid .ui-col-5{grid-column-end:span 5}.ui-grid .ui-col-6{grid-column-end:span 6}.ui-grid .ui-col-7{grid-column-end:span 7}.ui-grid .ui-col-8{grid-column-end:span 8}.ui-grid .ui-col-9{grid-column-end:span 9}.ui-grid .ui-col-10{grid-column-end:span 10}.ui-grid .ui-col-11{grid-column-end:span 11}.ui-grid .ui-col-12{grid-column-end:span 12}@media (min-width: 480px){.ui-grid .ui-col-xs-1{grid-column-end:span 1}.ui-grid .ui-col-xs-2{grid-column-end:span 2}.ui-grid .ui-col-xs-3{grid-column-end:span 3}.ui-grid .ui-col-xs-4{grid-column-end:span 4}.ui-grid .ui-col-xs-5{grid-column-end:span 5}.ui-grid .ui-col-xs-6{grid-column-end:span 6}.ui-grid .ui-col-xs-7{grid-column-end:span 7}.ui-grid .ui-col-xs-8{grid-column-end:span 8}.ui-grid .ui-col-xs-9{grid-column-end:span 9}.ui-grid .ui-col-xs-10{grid-column-end:span 10}.ui-grid .ui-col-xs-11{grid-column-end:span 11}.ui-grid .ui-col-xs-12{grid-column-end:span 12}}@media (min-width: 768px){.ui-grid .ui-col-sm-1{grid-column-end:span 1}.ui-grid .ui-col-sm-2{grid-column-end:span 2}.ui-grid .ui-col-sm-3{grid-column-end:span 3}.ui-grid .ui-col-sm-4{grid-column-end:span 4}.ui-grid .ui-col-sm-5{grid-column-end:span 5}.ui-grid .ui-col-sm-6{grid-column-end:span 6}.ui-grid .ui-col-sm-7{grid-column-end:span 7}.ui-grid .ui-col-sm-8{grid-column-end:span 8}.ui-grid .ui-col-sm-9{grid-column-end:span 9}.ui-grid .ui-col-sm-10{grid-column-end:span 10}.ui-grid .ui-col-sm-11{grid-column-end:span 11}.ui-grid .ui-col-sm-12{grid-column-end:span 12}}@media (min-width: 992px){.ui-grid .ui-col-md-1{grid-column-end:span 1}.ui-grid .ui-col-md-2{grid-column-end:span 2}.ui-grid .ui-col-md-3{grid-column-end:span 3}.ui-grid .ui-col-md-4{grid-column-end:span 4}.ui-grid .ui-col-md-5{grid-column-end:span 5}.ui-grid .ui-col-md-6{grid-column-end:span 6}.ui-grid .ui-col-md-7{grid-column-end:span 7}.ui-grid .ui-col-md-8{grid-column-end:span 8}.ui-grid .ui-col-md-9{grid-column-end:span 9}.ui-grid .ui-col-md-10{grid-column-end:span 10}.ui-grid .ui-col-md-11{grid-column-end:span 11}.ui-grid .ui-col-md-12{grid-column-end:span 12}}@media (min-width: 1200px){.ui-grid .ui-col-lg-1{grid-column-end:span 1}.ui-grid .ui-col-lg-2{grid-column-end:span 2}.ui-grid .ui-col-lg-3{grid-column-end:span 3}.ui-grid .ui-col-lg-4{grid-column-end:span 4}.ui-grid .ui-col-lg-5{grid-column-end:span 5}.ui-grid .ui-col-lg-6{grid-column-end:span 6}.ui-grid .ui-col-lg-7{grid-column-end:span 7}.ui-grid .ui-col-lg-8{grid-column-end:span 8}.ui-grid .ui-col-lg-9{grid-column-end:span 9}.ui-grid .ui-col-lg-10{grid-column-end:span 10}.ui-grid .ui-col-lg-11{grid-column-end:span 11}.ui-grid .ui-col-lg-12{grid-column-end:span 12}}.ui-heading{--title-font-family:var(--f-family-display);--subtitle-font-family:var(--f-family-text);--heading-color-dark:var(--c-carbon-90);--heading-color-light:var(--c-indigo-70);--h1-size:var(--f-size-12);--h1-leading:var(--f-leading-solid);--h1-weight:var(--f-weight-bold);--h2-size:var(--f-size-10);--h3-size:var(--f-size-8);--h4-size:var(--f-size-6);--h5-size:var(--f-size-5);--h6-size:var(--f-size-2);margin:0;line-height:var(--f-leading-title)}.ui-theme--editorial .ui-heading{--title-font-family:var(--f-family-text);--h1-size:var(--f-size-9);--h1-leading:var(--f-leading-title);--h1-weight:var(--f-weight-semibold);--h2-size:var(--f-size-8);--h3-size:var(--f-size-7);--h4-size:var(--f-size-6);--h5-size:var(--f-size-5);--h6-size:var(--f-size-0)}.ui-heading-1{font-family:var(--title-font-family);font-size:var(--h1-size);line-height:var(--h1-leading);letter-spacing:var(--f-tracking-dense);font-weight:var(--h1-weight);color:var(--heading-color-dark)}.ui-heading-2{font-family:var(--title-font-family);font-size:var(--h2-size);letter-spacing:var(--f-tracking-dense);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-3{font-family:var(--title-font-family);font-size:var(--h3-size);letter-spacing:var(--f-tracking-dense);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-4{font-family:var(--subtitle-font-family);font-size:var(--h4-size);letter-spacing:var(--f-tracking-tight);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-5{font-family:var(--subtitle-font-family);font-size:var(--h5-size);letter-spacing:var(--f-tracking-tight);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-6{font-family:var(--subtitle-font-family);font-size:var(--h6-size);letter-spacing:var(--f-tracking-extra);font-weight:var(--f-weight-bold);text-transform:uppercase;color:var(--heading-color-light)}.ui-heading--bordered{border-bottom:1px solid var(--c-indigo-30);margin-bottom:var(--space-5);padding-bottom:var(--space-2)}.ui-heading--strong{font-weight:var(--f-weight-bold)}.ui-heading--leading{line-height:var(--f-leading-text)}.ui-skeleton{display:block;width:100%;height:inherit;margin-top:4px;margin-bottom:4px;background:#EEEEEE;line-height:10px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}.ui-skeleton--animated{position:relative;background:-webkit-gradient(linear, left top, right top, color-stop(8%, rgba(0, 0, 0, 0.065)), color-stop(18%, rgba(0, 0, 0, 0.135)), color-stop(33%, rgba(0, 0, 0, 0.065)));background:linear-gradient(to right, rgba(0, 0, 0, 0.065) 8%, rgba(0, 0, 0, 0.135) 18%, rgba(0, 0, 0, 0.065) 33%);background-size:800px 104px;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-name:shimmer;animation-name:shimmer;-webkit-animation-timing-function:linear;animation-timing-function:linear}@-webkit-keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}span{display:inline-block}.prismic-raw-html{width:100%;overflow:auto}.prismic-raw-html table{overflow-x:auto;margin-right:-15px;padding-right:15px;-webkit-box-sizing:content-box;box-sizing:content-box;font-size:13px;border-collapse:collapse;border-spacing:0;margin-bottom:48px}.prismic-raw-html table td,.prismic-raw-html table th{text-align:left;min-width:120px;padding-right:12px;padding-top:12px;padding-bottom:12px}.prismic-raw-html table td:last-child,.prismic-raw-html table th:last-child{padding-right:0}.prismic-raw-html table th,.prismic-raw-html table b{font-weight:600}.prismic-raw-html table tbody tr td{border-top:1px solid #DEE3EA}.prismic-raw-html table tbody tr:first-child td{border-top:none}.prismic-raw-html table>thead>tr>th{border-bottom:1px solid #E9EDF3;font-weight:600}*{-webkit-box-sizing:border-box;box-sizing:border-box}html,body{padding:0;margin:0;width:100%;height:100%}body{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;font-family:var(--f-family-text);font-size:var(--f-size-root);line-height:var(--f-leading-body);letter-spacing:var(--f-tracking-tight);color:var(--c-carbon-90);position:relative;overflow-x:hidden}body.no-scroll{overflow:hidden}a{text-decoration:none;color:var(--c-ionic-brand)}stencil-route-link a{color:inherit}ul{margin:0;padding:0}li{list-style:none}hr{border:none;height:1px;background:var(--c-indigo-30);margin:var(--space-6) 0}:host{display:block}.demos{padding:48px}.demo{margin-bottom:48px}";

class Demo {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { class: "demos" }, h(ButtonDemo, null), h(HeadingDemo, null), h(GridDemo, null), h(CardDemo, null)));
    }
    static get style() { return demoCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "shared-demo",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}
const ButtonDemo = () => (h("div", { class: "demo demo-button" }, h(Heading, { level: 3, bordered: true }, "Buttons"), h(Button, null, "Button")));
const HeadingDemo = () => (h("div", { class: "demo demo-heading" }, h(Heading, { level: 3, bordered: true }, "Headings"), h(Heading, { level: 1 }, "Level 1"), h(Heading, { level: 2 }, "Level 2"), h(Heading, { level: 3 }, "Level 3"), h(Heading, { level: 4 }, "Level 4"), h(Heading, { level: 5 }, "Level 5")));
const GridDemo = () => (h("div", { class: "demo demo-grid" }, h(Heading, { level: 3, bordered: true }, "Grid"), h(Grid, { class: "demo demo-grid" }, h(Col, { md: 3, sm: 3, xs: 3, cols: 12 }, "Column 1"), h(Col, { md: 3, sm: 3, xs: 3, cols: 12 }, "Column 2"), h(Col, { md: 3, sm: 3, xs: 3, cols: 12 }, "Column 3"), h(Col, { md: 3, sm: 3, xs: 3, cols: 12 }, "Column 4"))));
const CardDemo = () => (h("div", { class: "demo demo-card" }, h(Heading, { level: 3, bordered: true }, "Cards"), h(Card, null, h(CardContent, null, h("hgroup", null, h(Heading, { level: 3 }, "Card"), h(Paragraph, null, "Unicorn next level roof party health goth, squid brooklyn pabst biodiesel kickstarter man bun small batch kale chips flexitarian. Edison bulb selfies mumblecore ethical, helvetica affogato palo santo. Taxidermy humblebrag hexagon, pabst stumptown PBR&B succulents. Lumbersexual fam shabby chic cardigan lomo quinoa put a bird on it salvia authentic hell of migas aesthetic truffaut gentrify tattooed. Migas direct trade polaroid distillery, ugh brunch farm-to-table fingerstache vaporware readymade occupy aesthetic four dollar toast. Freegan lyft vegan ramps vexillologist taxidermy listicle vinyl blue bottle pug."))))));

class DocSnippet {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { class: "snippet" }));
    }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "doc-snippet",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const isObject = (val) => !Array.isArray(val) && val !== null && typeof val === 'object';
const hasChildren = ({ vchildren }) => Array.isArray(vchildren);
const hasAttributes = ({ vattrs }, requiredAttrs = []) => isObject(vattrs) && requiredAttrs.every(vattrs.hasOwnProperty.bind(vattrs));
const isTextNode = ({ vtext }) => typeof vtext === 'string';
// Can't use instanceof HTMLElement because MockHTMLElement during pre-rendering isn't
const isElement = (val) => typeof val === 'object' && val.nodeType === 1 && typeof val.ownerDocument === 'object';
const isElementArray = (val) => Array.isArray(val) && val.every(isElement);
const convertToPublic$1 = (node) => ({
    vattrs: node.$attrs$,
    vchildren: node.$children$,
    vkey: node.$key$,
    vname: node.$name$,
    vtag: node.$tag$,
    vtext: node.$text$,
});

const createElement = ({ vtag, vattrs, vchildren, vtext }) => {
    if (vtext != null) {
        return document.createTextNode(vtext);
    }
    const element = document.createElement(vtag);
    if (vattrs != null) {
        for (const key in vattrs) {
            element.setAttribute(key, vattrs[key]);
        }
    }
    if (vchildren != null) {
        for (const child of vchildren) {
            element.appendChild(createElement(convertToPublic$1(child)));
        }
    }
    return element;
};
const shouldApplyToHead = (val) => isElement(val) || (isElementArray(val) && val.length === 2);
const applyToHead = (element) => {
    if (Array.isArray(element)) {
        return document.head.replaceChild(element[0], element[1]);
    }
    return document.head.appendChild(element);
};

function title(node, head) {
    const firstChild = (node.vchildren || [])[0];
    if (hasChildren(node) && isTextNode(convertToPublic$1(firstChild))) {
        return [createElement(node), head.querySelector('title')];
    }
}
function meta(node, head) {
    var _a, _b, _c;
    const namePropKey = ((_a = node.vattrs) === null || _a === void 0 ? void 0 : _a.property) ? 'property' : 'name';
    const namePropValue = ((_b = node.vattrs) === null || _b === void 0 ? void 0 : _b.property) || ((_c = node.vattrs) === null || _c === void 0 ? void 0 : _c.name);
    const existingElement = head.querySelector(`meta[${namePropKey}="${namePropValue}"]`);
    if (existingElement !== null) {
        return [createElement(node), existingElement];
    }
    else {
        return createElement(node);
    }
}
function link(node) {
    if (!hasChildren(node)) {
        return createElement(node);
    }
}
function style(node) {
    const firstChild = (node.vchildren || [])[0];
    if (hasChildren(node) && isTextNode(convertToPublic$1(firstChild))) {
        return createElement(node);
    }
}
function script(node) {
    if (hasChildren(node) || hasAttributes(node)) {
        return createElement(node);
    }
}
function base(node) {
    if (!hasChildren(node) && hasAttributes(node)) {
        return createElement(node);
    }
}
const template = createElement;
const noscript = createElement; // SSR only
const types = {
    title,
    meta,
    link,
    style,
    script,
    base,
    template,
    noscript,
};

const headExists = document && document.head;
const validTagNames = Object.keys(types);
const isValidNode = (node) => validTagNames.indexOf(node.$tag$) > -1;
const renderNode = (node) => types[node.vtag](node, document.head);
const Helmet = (_props, children, utils) => {
    if (!headExists) {
        return null;
    }
    const validChildren = children.filter(isValidNode);
    // Build an HTMLElement for each provided virtual child
    const rendered = [];
    utils.forEach(validChildren, (n) => {
        rendered.push(renderNode(n));
    });
    rendered
        .filter(shouldApplyToHead)
        .forEach(applyToHead);
    return null;
};

var siteStructure = [
	{
		text: "Getting Started",
		children: [
			{
				text: "Introduction",
				filePath: "/assets/docs-content/index.json",
				url: "/docs/"
			},
			{
				text: "Required Dependencies",
				filePath: "/assets/docs-content/getting-started/dependencies.json",
				url: "/docs/getting-started/dependencies"
			},
			{
				text: "Installation",
				filePath: "/assets/docs-content/getting-started/index.json",
				url: "/docs/getting-started"
			},
			{
				text: "Using with Ionic",
				filePath: "/assets/docs-content/getting-started/with-ionic.json",
				url: "/docs/getting-started/with-ionic"
			}
		]
	},
	{
		text: "Basics",
		children: [
			{
				text: "Development Workflow",
				filePath: "/assets/docs-content/basics/workflow.json",
				url: "/docs/basics/workflow"
			},
			{
				text: "Opening Native IDE",
				filePath: "/assets/docs-content/basics/opening-native-projects.json",
				url: "/docs/basics/opening-native-projects"
			},
			{
				text: "Building your App",
				filePath: "/assets/docs-content/basics/building-your-app.json",
				url: "/docs/basics/building-your-app"
			},
			{
				text: "Running your App",
				filePath: "/assets/docs-content/basics/running-your-app.json",
				url: "/docs/basics/running-your-app"
			},
			{
				text: "Using Plugins",
				filePath: "/assets/docs-content/basics/using-plugins.json",
				url: "/docs/basics/using-plugins"
			},
			{
				text: "Native Project Configuration",
				filePath: "/assets/docs-content/basics/configuring-your-app.json",
				url: "/docs/basics/configuring-your-app"
			},
			{
				text: "Progressive Web Apps",
				filePath: "/assets/docs-content/basics/progressive-web-app.json",
				url: "/docs/basics/progressive-web-app"
			}
		]
	},
	{
		text: "Cordova/PhoneGap",
		children: [
			{
				text: "Introduction",
				filePath: "/assets/docs-content/cordova/index.json",
				url: "/docs/cordova"
			},
			{
				text: "Migration Strategy",
				filePath: "/assets/docs-content/cordova/migration-strategy.json",
				url: "/docs/cordova/migration-strategy"
			},
			{
				text: "Cordova to Capacitor Migration",
				filePath: "/assets/docs-content/cordova/migrating-from-cordova-to-capacitor.json",
				url: "/docs/cordova/migrating-from-cordova-to-capacitor"
			},
			{
				text: "Cordova/Ionic Native Plugins",
				filePath: "/assets/docs-content/cordova/using-cordova-plugins.json",
				url: "/docs/cordova/using-cordova-plugins"
			},
			{
				text: "Known Incompatible Plugins",
				filePath: "/assets/docs-content/cordova/known-incompatible-plugins.json",
				url: "/docs/cordova/known-incompatible-plugins"
			}
		]
	},
	{
		text: "Guides",
		children: [
			{
				text: "Ionic Framework Camera App",
				filePath: "/assets/docs-content/guides/ionic-framework-app.json",
				url: "/docs/guides/ionic-framework-app"
			},
			{
				text: "Push Notifications - Firebase",
				filePath: "/assets/docs-content/guides/push-notifications-firebase.json",
				url: "/docs/guides/push-notifications-firebase"
			},
			{
				text: "Deep Links",
				filePath: "/assets/docs-content/guides/deep-links.json",
				url: "/docs/guides/deep-links"
			},
			{
				text: "Community Guides",
				filePath: "/assets/docs-content/guides/community.json",
				url: "/docs/guides/community"
			}
		]
	},
	{
		text: "iOS",
		children: [
			{
				text: "Getting Started",
				filePath: "/assets/docs-content/ios/index.json",
				url: "/docs/ios"
			},
			{
				text: "Configuration",
				filePath: "/assets/docs-content/ios/configuration.json",
				url: "/docs/ios/configuration"
			},
			{
				text: "Updating",
				filePath: "/assets/docs-content/ios/updating.json",
				url: "/docs/ios/updating"
			},
			{
				text: "Custom Native Code",
				filePath: "/assets/docs-content/ios/custom-code.json",
				url: "/docs/ios/custom-code"
			},
			{
				text: "Deploying to App Store",
				filePath: "https://www.joshmorony.com/deploying-capacitor-applications-to-ios-development-distribution/"
			},
			{
				text: "Troubleshooting",
				filePath: "/assets/docs-content/ios/troubleshooting.json",
				url: "/docs/ios/troubleshooting"
			}
		]
	},
	{
		text: "Android",
		children: [
			{
				text: "Getting Started",
				filePath: "/assets/docs-content/android/index.json",
				url: "/docs/android"
			},
			{
				text: "Configuration",
				filePath: "/assets/docs-content/android/configuration.json",
				url: "/docs/android/configuration"
			},
			{
				text: "Updating",
				filePath: "/assets/docs-content/android/updating.json",
				url: "/docs/android/updating"
			},
			{
				text: "Custom Native Code",
				filePath: "/assets/docs-content/android/custom-code.json",
				url: "/docs/android/custom-code"
			},
			{
				text: "Deploying to Google Play",
				filePath: "https://www.joshmorony.com/deploying-capacitor-applications-to-android-development-distribution/"
			},
			{
				text: "Troubleshooting",
				filePath: "/assets/docs-content/android/troubleshooting.json",
				url: "/docs/android/troubleshooting"
			}
		]
	},
	{
		text: "Web/PWA",
		children: [
			{
				text: "Getting Started",
				filePath: "/assets/docs-content/web/index.json",
				url: "/docs/web"
			},
			{
				text: "PWA Elements",
				filePath: "/assets/docs-content/web/pwa-elements.json",
				url: "/docs/pwa-elements"
			}
		]
	},
	{
		text: "Electron",
		children: [
			{
				text: "Getting Started",
				filePath: "/assets/docs-content/electron/index.json",
				url: "/docs/electron"
			},
			{
				text: "Updating",
				filePath: "/assets/docs-content/electron/updating.json",
				url: "/docs/electron/updating"
			}
		]
	},
	{
		text: "Creating Plugins",
		children: [
			{
				text: "Introduction",
				filePath: "/assets/docs-content/plugins/index.json",
				url: "/docs/plugins"
			},
			{
				text: "iOS Guide",
				filePath: "/assets/docs-content/plugins/ios.json",
				url: "/docs/plugins/ios"
			},
			{
				text: "Android Guide",
				filePath: "/assets/docs-content/plugins/android.json",
				url: "/docs/plugins/android"
			},
			{
				text: "Web/PWA Guide",
				filePath: "/assets/docs-content/plugins/web.json",
				url: "/docs/plugins/web"
			},
			{
				text: "JavaScript Guide",
				filePath: "/assets/docs-content/plugins/js.json",
				url: "/docs/plugins/js"
			}
		]
	},
	{
		text: "APIs",
		children: [
			{
				text: "Introduction",
				filePath: "/assets/docs-content/apis/index.json",
				url: "/docs/apis"
			},
			{
				text: "Community Plugins",
				filePath: "/assets/docs-content/community/plugins.json",
				url: "/docs/community/plugins"
			},
			{
				text: "Accessibility",
				filePath: "/assets/docs-content/apis/accessibility/index.json",
				url: "/docs/apis/accessibility"
			},
			{
				text: "App",
				filePath: "/assets/docs-content/apis/app/index.json",
				url: "/docs/apis/app"
			},
			{
				text: "Background Task",
				filePath: "/assets/docs-content/apis/background-task/index.json",
				url: "/docs/apis/background-task"
			},
			{
				text: "Browser",
				filePath: "/assets/docs-content/apis/browser/index.json",
				url: "/docs/apis/browser"
			},
			{
				text: "Camera",
				filePath: "/assets/docs-content/apis/camera/index.json",
				url: "/docs/apis/camera"
			},
			{
				text: "Clipboard",
				filePath: "/assets/docs-content/apis/clipboard/index.json",
				url: "/docs/apis/clipboard"
			},
			{
				text: "Console",
				filePath: "/assets/docs-content/apis/console/index.json",
				url: "/docs/apis/console"
			},
			{
				text: "Device",
				filePath: "/assets/docs-content/apis/device/index.json",
				url: "/docs/apis/device"
			},
			{
				text: "Filesystem",
				filePath: "/assets/docs-content/apis/filesystem/index.json",
				url: "/docs/apis/filesystem"
			},
			{
				text: "Geolocation",
				filePath: "/assets/docs-content/apis/geolocation/index.json",
				url: "/docs/apis/geolocation"
			},
			{
				text: "Haptics",
				filePath: "/assets/docs-content/apis/haptics/index.json",
				url: "/docs/apis/haptics"
			},
			{
				text: "Keyboard",
				filePath: "/assets/docs-content/apis/keyboard/index.json",
				url: "/docs/apis/keyboard"
			},
			{
				text: "Local Notifications",
				filePath: "/assets/docs-content/apis/local-notifications/index.json",
				url: "/docs/apis/local-notifications"
			},
			{
				text: "Modals",
				filePath: "/assets/docs-content/apis/modals/index.json",
				url: "/docs/apis/modals"
			},
			{
				text: "Motion",
				filePath: "/assets/docs-content/apis/motion/index.json",
				url: "/docs/apis/motion"
			},
			{
				text: "Network",
				filePath: "/assets/docs-content/apis/network/index.json",
				url: "/docs/apis/network"
			},
			{
				text: "Permissions",
				filePath: "/assets/docs-content/apis/permissions/index.json",
				url: "/docs/apis/permissions"
			},
			{
				text: "Push Notifications",
				filePath: "/assets/docs-content/apis/push-notifications/index.json",
				url: "/docs/apis/push-notifications"
			},
			{
				text: "Share",
				filePath: "/assets/docs-content/apis/share/index.json",
				url: "/docs/apis/share"
			},
			{
				text: "Splash Screen",
				filePath: "/assets/docs-content/apis/splash-screen/index.json",
				url: "/docs/apis/splash-screen"
			},
			{
				text: "Status Bar",
				filePath: "/assets/docs-content/apis/status-bar/index.json",
				url: "/docs/apis/status-bar"
			},
			{
				text: "Storage",
				filePath: "/assets/docs-content/apis/storage/index.json",
				url: "/docs/apis/storage"
			},
			{
				text: "Toast",
				filePath: "/assets/docs-content/apis/toast/index.json",
				url: "/docs/apis/toast"
			}
		]
	}
];

function findItem(siteStructureList, url, foundData = { parent: null }) {
    for (const item of siteStructureList) {
        if (item.url === url) {
            foundData.item = item;
        }
        else if (foundData.item != null && item.url != null) {
            foundData.nextItem = item;
        }
        else if (item.url != null && foundData.item == null) {
            foundData.prevItem = item;
        }
        else if (item.children && item.children.length > 0) {
            if (foundData.item == null) {
                foundData.parent = item;
            }
            foundData = findItem(item.children, url, foundData);
        }
        if (foundData.item != null && foundData.nextItem != null) {
            return foundData;
        }
    }
    return foundData;
}

const handleRoutableLinkClick = (e) => {
    if (e.metaKey || e.ctrlKey) {
        return;
    }
    if (e && (e.which == 2 || e.button == 4)) {
        return;
    }
    if (e.target.tagName === 'A') {
        const href = e.target.href;
        const u = new URL(href);
        if (u.origin === window.location.origin) {
            e.stopPropagation();
            e.preventDefault();
            Router.push(u.pathname);
        }
    }
};

const documentComponentCss = ":root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}document-component .container{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}document-component plugin-platforms{display:block;float:right}document-component plugin-platforms .platform{margin-left:8px}document-component table,document-component td,document-component th{border:1px solid #eee;border-collapse:collapse}document-component table{width:100%}document-component table th{text-align:left;padding:4px}document-component table td{font-size:12px;line-height:18px;vertical-align:top;padding:4px;min-width:150px}document-component table td code{font-size:12px}document-component .heading-link{position:relative;text-decoration:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;color:#2d2d4c}document-component .heading-link:hover{border-bottom:1px solid transparent}document-component .heading-link ion-icon{-webkit-transition:opacity 0.2s;transition:opacity 0.2s;position:absolute;left:-24px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;opacity:0}document-component .heading-link:hover ion-icon{opacity:0.8}document-component img{max-width:100%;margin:8px 0}document-component h1:first-child anchor-link{display:none}document-component ul{-webkit-padding-start:16px}document-component ul li,document-component ul code{font-size:14px;margin-top:16px}document-component p a{color:#1d9aff;text-decoration:none}document-component p code,document-component ul code,document-component ol code{padding:1px 4px 2px;background-color:#ecf4fb;color:#16161D;border-radius:3px}document-component #introButton{background:#1d9aff;color:white;text-decoration:none;border:none;font-size:13px;font-weight:600;text-transform:uppercase;padding:12px 14px;border-radius:4px;-webkit-box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);box-shadow:0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);outline:none;letter-spacing:0.04em;-webkit-transition:all 0.15s ease;transition:all 0.15s ease;cursor:pointer}document-component #introButton:hover{-webkit-box-shadow:0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);box-shadow:0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);-webkit-transform:translateY(1px);transform:translateY(1px)}document-component .btn.pull-left,document-component .btn.pull-right{margin:64px 8px 20px}";

class DocumentComponent {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.pages = [];
        this.page = null;
    }
    componentWillLoad() {
        return this.fetchNewContent(this.page);
    }
    fetchNewContent(page, oldPage) {
        console.log('Fetching new page', page);
        if (page == null || page === oldPage) {
            return;
        }
        const foundData = findItem(siteStructure, this.page);
        this.item = foundData.item;
        this.nextItem = foundData.nextItem;
        this.prevItem = foundData.prevItem;
        this.parent = foundData.parent;
    }
    render() {
        // debugger;
        if (this.item == null) {
            return h("h1", null, "Page not found");
        }
        return (h("div", { class: "container" }, h("app-burger", null), h("docs-menu", { selectedParent: this.parent, siteStructureList: siteStructure }), h("app-marked", { fetchPath: this.item.filePath, renderer: (docsContent) => [
                h(Helmet, null, h("title", null, docsContent.title ? `${docsContent.title} - Capacitor` : 'Capacitor')),
                h("div", { class: "doc-content" }, h("div", { class: "measure-lg" }, h("div", { onClick: handleRoutableLinkClick, innerHTML: docsContent.content }), h("h2", null, "Contributors"), h("contributor-list", { contributors: docsContent.contributors }), h("lower-content-nav", { next: this.nextItem, prev: this.prevItem }))),
                h("in-page-navigation", { pageLinks: docsContent.headings, srcUrl: docsContent.srcPath, currentPageUrl: docsContent.url })
            ] })));
    }
    static get watchers() { return {
        "page": ["fetchNewContent"]
    }; }
    static get style() { return documentComponentCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "document-component",
        "$members$": {
            "pages": [16],
            "page": [1],
            "item": [32],
            "nextItem": [32],
            "prevItem": [32],
            "parent": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const enterpriseCss = ":root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}capacitor-enterprise{display:block;margin:76px 0}capacitor-enterprise .cta h1{margin-top:0}capacitor-enterprise .cta .btn{margin-top:24px;background-color:#111;color:white}capacitor-enterprise .container{max-width:1024px;margin:auto}capacitor-enterprise .points{display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));-webkit-column-gap:16px;-moz-column-gap:16px;column-gap:16px;row-gap:24px}@media (max-width: 480px){capacitor-enterprise .points{grid-template-columns:1fr}}capacitor-enterprise hgroup{text-align:center}capacitor-enterprise .hs-form{margin:48px auto;max-width:420px !important;font-weight:400}capacitor-enterprise .hs-form .hs-form-required{display:none}capacitor-enterprise .hs-form form fieldset.form-columns-2 .input{margin-right:12px}capacitor-enterprise .hs-form form.stacked .field{margin-bottom:4px}capacitor-enterprise .hs-form .hs-input,capacitor-enterprise .hs-form input.hs-input,capacitor-enterprise .hs-form select.hs-input{-webkit-appearance:none;appearance:none;-moz-appearance:none;border:1px solid #e1e5ed;font-weight:500;border-radius:4px;-webkit-transition:border-color 0.2s;transition:border-color 0.2s;-webkit-box-shadow:none;box-shadow:none;outline:none;height:30px;padding:6px 12px;font-size:14px;line-height:1.428571429}capacitor-enterprise .hs-form .hs-input:placeholder,capacitor-enterprise .hs-form input.hs-input:placeholder,capacitor-enterprise .hs-form select.hs-input:placeholder{color:#aaa}capacitor-enterprise .hs-form .hs-input:hover,capacitor-enterprise .hs-form .hs-input:focus,capacitor-enterprise .hs-form .hs-input:active,capacitor-enterprise .hs-form input.hs-input:hover,capacitor-enterprise .hs-form input.hs-input:focus,capacitor-enterprise .hs-form input.hs-input:active,capacitor-enterprise .hs-form select.hs-input:hover,capacitor-enterprise .hs-form select.hs-input:focus,capacitor-enterprise .hs-form select.hs-input:active{outline:none;border-color:#3880ff;-webkit-box-shadow:none;box-shadow:none}capacitor-enterprise .hs-form .hs-input.hs-input.error,capacitor-enterprise .hs-form input.hs-input.hs-input.error,capacitor-enterprise .hs-form select.hs-input.hs-input.error{border-color:#ee0000}capacitor-enterprise .hs-form select.hs-input{height:44px;width:calc(100% + 6px) !important}capacitor-enterprise .hs-form textarea.hs-input{padding:12px;width:calc(100% + 3px) !important;min-height:192px}capacitor-enterprise .hs-form .hs_submit input.hs-button{font-size:13px;padding:10px 18px 10px;margin-right:-14px;margin-top:-36px;line-height:23px;float:right;font-weight:600;letter-spacing:0;text-transform:none;text-shadow:none;background:#3880ff;border:0;outline:0;-webkit-transition:all 0.2s linear;transition:all 0.2s linear;-webkit-box-shadow:0 1px 3px rgba(0, 0, 0, 0.12);box-shadow:0 1px 3px rgba(0, 0, 0, 0.12)}capacitor-enterprise .hs-form .hs_submit input.hs-button:hover{border:0;-webkit-box-shadow:0 4px 8px rgba(0, 0, 0, 0.12);box-shadow:0 4px 8px rgba(0, 0, 0, 0.12);background:#5995fc;color:#fff;outline:0}capacitor-enterprise .hs-form .hs_submit input.hs-button:active,capacitor-enterprise .hs-form .hs_submit input.hs-button:active:not(.inactive):not(.link),capacitor-enterprise .hs-form .hs_submit input.hs-button:focus:not(.inactive){border:0;color:#fff;-webkit-box-shadow:inset 0 1px 4px rgba(0, 0, 0, 0.2);box-shadow:inset 0 1px 4px rgba(0, 0, 0, 0.2);background:#5995fc;outline:0}capacitor-enterprise .hs-form .submitted-message{font-size:18px;padding:34px 0 78px;text-align:center;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;font-weight:400;color:#35af55;max-width:410px;background-color:white;margin:0 auto}capacitor-enterprise .hs-form .submitted-message:before{content:\"\";display:block;background-image:url(\"/img/checkmark-light-green.svg\");background-repeat:no-repeat;background-size:100%;width:42px;height:42px;margin-bottom:12px}capacitor-enterprise .modal .hs-form .hs_submit input.hs-button{padding:0}capacitor-enterprise .hs-form,capacitor-enterprise .hs-form fieldset,capacitor-enterprise .hs-form iframe{max-width:100%}capacitor-enterprise .hs-form .hs-form-field{margin-top:16px}capacitor-enterprise .hs-form label{margin-bottom:3px}capacitor-enterprise .hs-form .hs-form-required{display:inline;color:#F45454;margin-left:4px}capacitor-enterprise .hs-form .hs-richtext{margin-top:8px}capacitor-enterprise .hs-form .hs-input,capacitor-enterprise .hs-form input.hs-input{-webkit-transition:border 0.3s;transition:border 0.3s;font-weight:500;background-color:#fff;background-image:none;border:1px solid #ced6e3;line-height:1.39286;border-radius:4px;padding:11px 15px;font-size:15px;margin-bottom:0;color:#505863}capacitor-enterprise .hs-form input.hs-input[type=number]{float:none}capacitor-enterprise .hs-form input.hs-input[type=text],capacitor-enterprise .hs-form input.hs-input[type=email],capacitor-enterprise .hs-form input.hs-input[type=tel]{height:auto;width:100%;float:none}capacitor-enterprise .hs-form input.hs-input[type=text]:focus,capacitor-enterprise .hs-form input.hs-input[type=email]:focus,capacitor-enterprise .hs-form input.hs-input[type=tel]:focus{border-color:#629eff}capacitor-enterprise .hs-form input.hs-input[type=radio],capacitor-enterprise .hs-form input.hs-input[type=checkbox]{height:auto;margin-right:8px}capacitor-enterprise .hs-form .hs-form-booleancheckbox-display{display:-ms-flexbox;display:flex}capacitor-enterprise .hs-form select.hs-input{height:44px;-webkit-appearance:none;appearance:none;-moz-appearance:none;background-image:linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);background-position:calc(100% - 20px) 50%, calc(100% - 15px) 50%;background-size:5px 5px, 5px 5px, 1px 1.5em;background-repeat:no-repeat}capacitor-enterprise .hs-form form fieldset.form-columns-2 .input{margin:0}capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field{padding:0 10px}capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field:first-child{padding-left:0}capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field:last-child{padding-right:0}capacitor-enterprise .hs-form .inputs-list,capacitor-enterprise .hs-form .hs-error-msgs{margin:0;padding:0;list-style-type:none}capacitor-enterprise .hs-form .inputs-list.multi-container{overflow:hidden}capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child,capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child~li{width:50%;float:left;padding-right:11px}capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child~li:nth-child(even){padding-right:0;padding-left:11px}capacitor-enterprise .hs-form .hs-form-checkbox-display{margin-top:4px;display:-ms-flexbox;display:flex}capacitor-enterprise .hs-form .hs-form-checkbox-display .hs-input[type=checkbox]{margin-right:10px}capacitor-enterprise .hs-form .hs-form-checkbox-display span{font-size:15px;color:#505863}capacitor-enterprise .hs-form .hs-error-msgs{padding:5px 0 0;font-size:11px;color:#F45454}capacitor-enterprise .hs-form .hs_submit{margin-top:30px}capacitor-enterprise .hs-form .hs_submit input.hs-button{-webkit-transition:all 0.3s ease;transition:all 0.3s ease;margin:0;float:none;font-size:16px;font-weight:700;padding:12px 20px;vertical-align:middle;color:white;background:#3880ff;-webkit-box-shadow:0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12);box-shadow:0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12);border-radius:4px;line-height:18px;letter-spacing:-0.01em}capacitor-enterprise .hs-form .hs_submit input.hs-button:hover{-webkit-box-shadow:0 7px 14px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);box-shadow:0 7px 14px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);background:#4d8dfd;color:#fff;outline:none}@media (max-width: 480px){capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field{width:100%;float:none;padding:0}capacitor-enterprise .hs-form fieldset.form-columns-2 .hs-form-field+.hs-form-field{margin-top:24px}capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child,capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child~li{width:100%;float:none;padding-right:0}capacitor-enterprise .hs-form .inputs-list.multi-container li:nth-last-child(n+6):first-child~li:nth-child(even){padding-left:0}capacitor-enterprise .hs-form .hs_submit input.hs-button{width:100%}}capacitor-enterprise .hubspot-override--large .hs-form label:not(.hs-form-booleancheckbox-display){text-transform:uppercase;font-size:12px;letter-spacing:0.05em;margin-bottom:6px}capacitor-enterprise .hubspot-override--large .hs-form .hs-form-booleancheckbox-display{font-size:15px}capacitor-enterprise .hubspot-override--large .hs-form .hs-richtext p span,capacitor-enterprise .hubspot-override--large .hs-form .hs-richtext p a{font-size:15px}capacitor-enterprise .hubspot-override--large .hs-form .hs-input,capacitor-enterprise .hubspot-override--large .hs-form input.hs-input{padding:16px 20px 18px;font-size:18px}capacitor-enterprise .hubspot-override--large .hs-form select.hs-input{text-indent:10px;height:60px}@-moz-document url-prefix(){capacitor-enterprise .hubspot-override--large .hs-form select.hs-input{text-indent:0}}capacitor-enterprise .hubspot-override--large .hs-form .hs-error-msgs label{font-size:11px;letter-spacing:0;text-transform:none}capacitor-enterprise .hubspot-override--large .hs-form fieldset.form-columns-2 .hs-form-field{padding:0 20px}capacitor-enterprise .hubspot-override--large .hs-form .hs_submit{text-align:center;padding-top:18px}capacitor-enterprise .hubspot-override--large .hs-form .hs_submit input.hs-button{padding:22px 27px 24px;border-radius:6px}@media (max-width: 480px){capacitor-enterprise .hubspot-override--large .hs-form fieldset.form-columns-2 .hs-form-field{padding:0}}capacitor-enterprise .hubspot-override--measure{max-width:748px;margin-left:auto;margin-right:auto}";

class Enterprise {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentWillLoad() {
        state.pageTheme = 'dark';
    }
    componentDidLoad() {
        const hbsScript = document.createElement('script');
        hbsScript.src = '//js.hsforms.net/forms/v2.js';
        hbsScript.type = 'text/javascript';
        hbsScript.charset = 'utf-8';
        hbsScript.addEventListener('load', () => {
            window.hbspt.forms.create({
                portalId: '3776657',
                formId: 'd0019a78-110e-4d28-b356-56357b4abe4b',
                target: '#scripts',
                css: ''
            });
        });
        document.body.appendChild(hbsScript);
        // el.appendChild(hbsScript);
    }
    render() {
        return (h("div", { class: "enterprise" }, h(ResponsiveContainer, null, h(Grid, { class: "cta" }, h(Col, { md: 6, sm: 6, xs: 12, cols: 12 }, h("h1", null, "Capacitor for Enterprises"), h("p", null, "Powerful solution for mission-critical enterprise apps", h("br", null), "across consumer and employee-facing", h("br", null), "iOS, Android, and Progressive Web Apps."), h("a", { href: "#contact" }, "Get in touch ->")))), h("section", { class: "section" }, h("div", { class: "container" }, h("hgroup", null, h("h2", null, "Enterprise mobile development, made easy"), h("p", null, "Meet your development goals with premium software and services that accelerate development and reduce project risk.")), h("div", { class: "points" }, h("div", { class: "point" }, h("h3", null, "Build with confidence"), h("p", null, "Enjoy peace of mind knowing the native plugins you depend on are built and maintained by a team you can trust, and backed by mission-critical support and expert services.")), h("div", { class: "point" }, h("h3", null, "Protect your users & data"), h("p", null, "Give your users the best possible mobile security, with advanced biometric authentication, SSO integration, and the latest in secure encrypted storage.")), h("div", { class: "point" }, h("h3", null, "Accelerate your mobile projects"), h("p", null, "Save valuable time and effort that would normally be spent chasing plugins and building from scratch. Capacitor Enterprise delivers everything you need on Day 1."))))), h("section", { id: "highlights" }, h("div", { class: "container" }, h("div", { class: "highlight" }, h("h2", null, "World-class support"), h("p", null, "Get guaranteed response SLAs through the app lifecycle. Ionic's professional support team is on-hand to help you troubleshoot and address issues occurring at the native layer.")), h("div", { class: "highlight" }, h("h2", null, "Stable, secure plugin library"), h("p", null, "Native features maintained by our team of native experts. Active subscribers get ongoing updates to supported plugins, to keep pace with OS and API changes, and evolving devices.")), h("div", { class: "highlight" }, h("h2", null, "Pre-built solutions"), h("p", null, "Accelerate development with pre-built native solutions to common mobile use cases, like biometrics, authentication, and encrypted offline storage. Built by mobile experts. Deployed in minutes.")), h("div", { class: "highlight" }, h("h2", null, "Expert help & guidance"), h("p", null, "Our team of native experts will work with you to define a native strategy that fits your unique goals and challenges. From architectural reviews to performance & security audits.")))), h("section", { id: "key-features" }, h("div", { class: "container" }, h("hgroup", null, h("h2", null, "Key features"), h("p", null, "Premium software and services to help you reach your development goals")), h("div", { class: "points" }, h("div", { class: "point" }, h("h3", null, "Core Device Plugins"), h("p", null, "Everything you need to deliver the core functionality your users expect, from essentials like camera and geolocation, to payments and security.")), h("div", { class: "point" }, h("h3", null, "Biometrics Sign-in"), h("p", null, "Add a critical layer of protection width advanced biometrics that locks down sensitive data, by employing the latest in native security best practices.")), h("div", { class: "point" }, h("h3", null, "Auth Integration"), h("p", null, "Easily connect through existing authentication providers, including Auth0, Azure Active Directory, and AWS Cognito--from any mobile device.")), h("div", { class: "point" }, h("h3", null, "Secure Offline Storage"), h("p", null, "Deliver secure, offline-first mobile experiences with a flexible mobile storage solution that uses military-grade encryption to prevent unwanted access and secure user data.")), h("div", { class: "point" }, h("h3", null, "Guaranteed SLA"), h("p", null, "Timely support and troubleshooting when you need it most. Get expert help directly from our team with guaranteed response times.")), h("div", { class: "point" }, h("h3", null, "Guidance & Expertise"), h("p", null, "Ensure your team is utilizing best practices when adding native functionality, helping you meet your deadlines while avoiding costly tech debt."))))), h("section", null, h("div", { class: "container" }, h("hgroup", null, h("h2", null, "Use Cases")), h("div", null, h("h3", null, "Mission-critical projects"), h("p", null, "When your brand and company reputation are on the line, you need a solution that will work on Day 1. Capacitor Enterprise is a great fit for teams building mission-critical projects who want to minimize project risk and reach their goals.")), h("div", null, h("h3", null, "Highly secure apps"), h("p", null, "Handling sensitive user or company data? Protect what matters most with advanced mobile security solutions that take advantage of the latest in native security best practices--from biometrics to military-grade encryption.")), h("div", null, h("h3", null, "Accelerated timeline"), h("p", null, "Facing an aggressive release timeline? We can help. Our pre-built solutions will save you weeks or months of coding from scratch, while our native mobile experts can help you find ways to speed up development and better reach your goals.")))), h("section", { id: "contact" }, h("div", { class: "container" }, h("hgroup", null, h("h2", null, "Learn more"), h("p", null, "Fill out form below to receive more information on Capacitor Enterprise."))), h("div", { id: "scripts", class: "hubspot-override" }))));
    }
    static get style() { return enterpriseCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "capacitor-enterprise",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const getName = (iconName, icon, mode, ios, md) => {
    // default to "md" if somehow the mode wasn't set
    mode = (mode && toLower(mode)) === 'ios' ? 'ios' : 'md';
    // if an icon was passed in using the ios or md attributes
    // set the iconName to whatever was passed in
    if (ios && mode === 'ios') {
        iconName = toLower(ios);
    }
    else if (md && mode === 'md') {
        iconName = toLower(md);
    }
    else {
        if (!iconName && icon && !isSrc(icon)) {
            iconName = icon;
        }
        if (isStr(iconName)) {
            iconName = toLower(iconName);
        }
    }
    if (!isStr(iconName) || iconName.trim() === '') {
        return null;
    }
    // only allow alpha characters and dash
    const invalidChars = iconName.replace(/[a-z]|-|\d/gi, '');
    if (invalidChars !== '') {
        return null;
    }
    return iconName;
};
const isSrc = (str) => str.length > 0 && /(\/|\.)/.test(str);
const isStr = (val) => typeof val === 'string';
const toLower = (val) => val.toLowerCase();

const iconCss = "/*!@:host*/.sc-ion-icon-h{display:inline-block;width:1em;height:1em;contain:strict;fill:currentColor;-webkit-box-sizing:content-box !important;box-sizing:content-box !important}/*!@:host .ionicon*/.sc-ion-icon-h .ionicon.sc-ion-icon{stroke:currentColor}/*!@.ionicon-fill-none*/.ionicon-fill-none.sc-ion-icon{fill:none}/*!@.ionicon-stroke-width*/.ionicon-stroke-width.sc-ion-icon{stroke-width:32px;stroke-width:var(--ionicon-stroke-width, 32px)}/*!@.icon-inner,\n.ionicon,\nsvg*/.icon-inner.sc-ion-icon,.ionicon.sc-ion-icon,svg.sc-ion-icon{display:block;height:100%;width:100%}/*!@:host(.flip-rtl) .icon-inner*/.flip-rtl.sc-ion-icon-h .icon-inner.sc-ion-icon{-webkit-transform:scaleX(-1);transform:scaleX(-1)}/*!@:host(.icon-small)*/.icon-small.sc-ion-icon-h{font-size:18px !important}/*!@:host(.icon-large)*/.icon-large.sc-ion-icon-h{font-size:32px !important}/*!@:host(.ion-color)*/.ion-color.sc-ion-icon-h{color:var(--ion-color-base) !important}/*!@:host(.ion-color-primary)*/.ion-color-primary.sc-ion-icon-h{--ion-color-base:var(--ion-color-primary, #3880ff)}/*!@:host(.ion-color-secondary)*/.ion-color-secondary.sc-ion-icon-h{--ion-color-base:var(--ion-color-secondary, #0cd1e8)}/*!@:host(.ion-color-tertiary)*/.ion-color-tertiary.sc-ion-icon-h{--ion-color-base:var(--ion-color-tertiary, #f4a942)}/*!@:host(.ion-color-success)*/.ion-color-success.sc-ion-icon-h{--ion-color-base:var(--ion-color-success, #10dc60)}/*!@:host(.ion-color-warning)*/.ion-color-warning.sc-ion-icon-h{--ion-color-base:var(--ion-color-warning, #ffce00)}/*!@:host(.ion-color-danger)*/.ion-color-danger.sc-ion-icon-h{--ion-color-base:var(--ion-color-danger, #f14141)}/*!@:host(.ion-color-light)*/.ion-color-light.sc-ion-icon-h{--ion-color-base:var(--ion-color-light, #f4f5f8)}/*!@:host(.ion-color-medium)*/.ion-color-medium.sc-ion-icon-h{--ion-color-base:var(--ion-color-medium, #989aa2)}/*!@:host(.ion-color-dark)*/.ion-color-dark.sc-ion-icon-h{--ion-color-base:var(--ion-color-dark, #222428)}";

class Icon {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isVisible = false;
        /**
         * The mode determines which platform styles to use.
         */
        this.mode = getIonMode();
        /**
         * If enabled, ion-icon will be loaded lazily when it's visible in the viewport.
         * Default, `false`.
         */
        this.lazy = false;
    }
    connectedCallback() {
        // purposely do not return the promise here because loading
        // the svg file should not hold up loading the app
        // only load the svg if it's visible
        this.waitUntilVisible(this.el, '50px', () => {
            this.isVisible = true;
            this.loadIcon();
        });
    }
    disconnectedCallback() {
        if (this.io) {
            this.io.disconnect();
            this.io = undefined;
        }
    }
    waitUntilVisible(el, rootMargin, cb) {
        {
            // browser doesn't support IntersectionObserver
            // so just fallback to always show it
            cb();
        }
    }
    loadIcon() {
        if (!this.ariaLabel) {
            const label = getName(this.name, this.icon, this.mode, this.ios, this.md);
            // user did not provide a label
            // come up with the label based on the icon name
            if (label) {
                this.ariaLabel = label.replace(/\-/g, ' ');
            }
        }
    }
    render() {
        const mode = this.mode || 'md';
        const flipRtl = this.flipRtl || (this.ariaLabel && (this.ariaLabel.indexOf('arrow') > -1 || this.ariaLabel.indexOf('chevron') > -1) && this.flipRtl !== false);
        return (h(Host, { role: "img", class: Object.assign(Object.assign({ [mode]: true }, createColorClasses(this.color)), { [`icon-${this.size}`]: !!this.size, 'flip-rtl': !!flipRtl && this.el.ownerDocument.dir === 'rtl' }) }, ( h("div", { class: "icon-inner" }))));
    }
    static get assetsDirs() { return ["svg"]; }
    get el() { return getElement(this); }
    static get watchers() { return {
        "name": ["loadIcon"],
        "src": ["loadIcon"],
        "icon": ["loadIcon"]
    }; }
    static get style() { return iconCss; }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "ion-icon",
        "$members$": {
            "mode": [1025],
            "color": [1],
            "ariaLabel": [1537, "aria-label"],
            "ios": [1],
            "md": [1],
            "flipRtl": [4, "flip-rtl"],
            "name": [1],
            "src": [1],
            "icon": [8],
            "size": [1],
            "lazy": [4],
            "svgContent": [32],
            "isVisible": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": [["ariaLabel", "aria-label"]]
    }; }
}
const getIonMode = () =>  'md';
const createColorClasses = (color) => {
    return (color) ? {
        'ion-color': true,
        [`ion-color-${color}`]: true
    } : null;
};

const inPageNavigationCss = "in-page-navigation{-ms-flex:0 0 180px;flex:0 0 180px;height:100%;padding-top:26px;padding-left:16px}in-page-navigation h5{text-transform:uppercase;font-size:11px;margin-top:0;margin-bottom:12px;font-weight:600;color:#a0aec0;letter-spacing:.05em}in-page-navigation .heading-links{list-style:none;line-height:1;padding:0;margin:0;--indent-size:12px;margin-left:calc(var(--indent-size) * -2)}in-page-navigation .heading-links li{width:188px;overflow:hidden;text-overflow:ellipsis}in-page-navigation .heading-links li+li{margin-top:8px}in-page-navigation .heading-links a{font-weight:400;color:var(--color-gunpowder);font-size:13px;line-height:18px;font-weight:500;border:none;text-decoration:none;border:none !important;-webkit-transition:.2s color ease;transition:.2s color ease}in-page-navigation .heading-links a:hover{color:var(--color-woodsmoke)}in-page-navigation .heading-links a:hover{border:none}in-page-navigation .heading-links .heading-link:hover,in-page-navigation .heading-links .heading-link.selected{border-bottom:none !important;-webkit-transform:translateX(calc(var(--indent-size) * 1 + 2px));transform:translateX(calc(var(--indent-size) * 1 + 2px))}in-page-navigation li.heading-link{padding-left:12px;margin-left:0;border-left:2px solid transparent;-webkit-transition:.2s transform ease;transition:.2s transform ease}in-page-navigation li.heading-link.selected{border-left:2px solid var(--color-dodger-blue)}in-page-navigation li.heading-link.selected a{color:var(--color-dodger-blue);font-weight:600}in-page-navigation li.size-h2{-webkit-transform:translateX(calc(var(--indent-size) * 1));transform:translateX(calc(var(--indent-size) * 1));font-weight:600}in-page-navigation li.size-h3{-webkit-transform:translateX(calc(var(--indent-size) * 2));transform:translateX(calc(var(--indent-size) * 2))}in-page-navigation li.size-h4{-webkit-transform:translateX(calc(var(--indent-size) * 3));transform:translateX(calc(var(--indent-size) * 3))}in-page-navigation li.size-h3 a,in-page-navigation li.size-h4 a{font-weight:400;color:#6c6c8b}in-page-navigation li.size-h3:hover a,in-page-navigation li.size-h4:hover a{color:var(--color-gunpowder)}in-page-navigation li.heading-link.size-h3:hover,in-page-navigation li.heading-link.size-h3.selected{-webkit-transform:translateX(calc(var(--indent-size) * 2 + 2px));transform:translateX(calc(var(--indent-size) * 2 + 2px))}in-page-navigation li.heading-link.size-h4:hover,in-page-navigation li.heading-link.size-h4.selected{-webkit-transform:translateX(calc(var(--indent-size) * 3 + 2px));transform:translateX(calc(var(--indent-size) * 3 + 2px))}in-page-navigation .submit-edit-link{font-size:12px;display:inline-block;color:var(--color-dodger-blue);font-weight:600;text-decoration:none;display:-ms-flexbox;display:flex}in-page-navigation .submit-edit-link svg{width:16px;fill:currentColor}in-page-navigation .submit-edit-link span{-webkit-transition:border 0.2s;transition:border 0.2s;height:16px;margin-left:6px;border-bottom:1px solid transparent}in-page-navigation .submit-edit-link:hover span{border-bottom:1px solid var(--color-cadet-blue)}in-page-navigation .heading-links+.submit-edit-link{margin-top:28px;border-bottom:none}@media screen and (max-width: 1024px){in-page-navigation{display:none}}";

class InPageNavigtion {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.pageLinks = [];
        this.srcUrl = '';
        this.currentPageUrl = '';
        this.itemOffsets = [];
        this.selectedId = null;
    }
    function() {
        const itemIndex = this.itemOffsets.findIndex(item => item.topOffset > window.scrollY);
        if (itemIndex === 0 || this.itemOffsets[this.itemOffsets.length - 1] === undefined) {
            this.selectedId = null;
        }
        else if (itemIndex === -1) {
            this.selectedId = this.itemOffsets[this.itemOffsets.length - 1].id;
        }
        else {
            this.selectedId = this.itemOffsets[itemIndex - 1].id;
        }
    }
    updateItemOffsets() {
        requestAnimationFrame(() => {
            this.itemOffsets = this.pageLinks.map((pl) => {
                const item = document.getElementById(pl.id);
                return {
                    id: pl.id,
                    topOffset: item.getBoundingClientRect().top + window.scrollY
                };
            });
        });
    }
    componentDidLoad() {
        this.updateItemOffsets();
    }
    ghIcon() {
        return (h("svg", { id: "icon-github", viewBox: "0 0 512 512", width: "100%", height: "100%" }, h("path", { d: "M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9 1.4.3 2.6.4 3.8.4 8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1-8.4 1.9-15.9 2.7-22.6 2.7-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1 10.5 0 20-3.4 25.6-6 2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8 0 0 1.6-.5 5-.5 8.1 0 26.4 3.1 56.6 24.1 17.9-5.1 37-7.6 56.1-7.7 19 .1 38.2 2.6 56.1 7.7 30.2-21 48.5-24.1 56.6-24.1 3.4 0 5 .5 5 .5 12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5 1.2 0 2.6-.1 4-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z" })));
    }
    stripTags(html) {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
    render() {
        const pageLinks = this.pageLinks.filter(pl => pl.level !== 1);
        const submitEditLink = (h("a", { class: "submit-edit-link", href: `https://github.com/ionic-team/capacitor/tree/master/site/${this.srcUrl}` }, this.ghIcon(), h("span", null, "Submit an edit")));
        if (pageLinks.length === 0) {
            return (h("div", { class: "sticky" }, submitEditLink));
        }
        return (h("div", { class: "sticky" }, h("h5", null, "Contents"), h("ul", { class: "heading-links" }, pageLinks.map(pl => (h("li", { class: {
                'heading-link': true,
                [`size-h${pl.level}`]: true,
                'selected': this.selectedId === pl.id
            } }, h("a", { href: `${this.currentPageUrl}#${pl.id}` }, this.stripTags(pl.text)))))), submitEditLink));
    }
    static get watchers() { return {
        "pageLinks": ["updateItemOffsets"]
    }; }
    static get style() { return inPageNavigationCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "in-page-navigation",
        "$members$": {
            "pageLinks": [16],
            "srcUrl": [1, "src-url"],
            "currentPageUrl": [1, "current-page-url"],
            "itemOffsets": [32],
            "selectedId": [32]
        },
        "$listeners$": [[9, "scroll", "function"], [9, "resize", "updateItemOffsets"]],
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const landingPageCss = ".sc-landing-page:root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}.sc-landing-page-h{display:block}section.sc-landing-page{margin-bottom:196px}.hero.sc-landing-page{margin-bottom:96px;background:url(\"/assets/img/landing/bg.png\") no-repeat transparent;background-size:cover}.hero.sc-landing-page img.sc-landing-page{max-width:100%}.hero__heading.sc-landing-page{padding-top:64px}.hero__heading.sc-landing-page h1.sc-landing-page{font-size:64px;line-height:100%;letter-spacing:var(--f-tracking-dense);color:var(--c-carbon-100);margin-bottom:16px}.hero__heading.sc-landing-page h3.sc-landing-page{margin-top:12px;margin-bottom:16px;font-size:22px;line-height:160%;letter-spacing:var(--f-tracking-tight);color:#2D4665;font-weight:normal}.hero__graphic.sc-landing-page{padding-top:64px}.hero__buttons.sc-landing-page .ui-button.sc-landing-page{-webkit-box-shadow:0px 1px 2px rgba(2, 8, 20, 0.1);box-shadow:0px 1px 2px rgba(2, 8, 20, 0.1)}.hero__buttons.sc-landing-page .ui-button.sc-landing-page:first-child{margin-right:16px}.hero__buttons.sc-landing-page .btn-white.sc-landing-page{background:white;-webkit-box-shadow:0px 1px 2px rgba(2, 8, 20, 0.1);box-shadow:0px 1px 2px rgba(2, 8, 20, 0.1);color:var(--color-capacitor-blue)}.points.sc-landing-page .ui-paragraph.sc-landing-page{max-width:540px;margin-bottom:64px}.points__img.sc-landing-page{width:64px;margin-left:-10px}.points.sc-landing-page h2.sc-landing-page{margin:0}.section--getting-started.sc-landing-page hgroup.sc-landing-page{margin-bottom:96px}.section--getting-started.sc-landing-page hgroup.sc-landing-page .ui-heading.sc-landing-page{font-size:48px;font-weight:600;color:var(--c-carbon-100);letter-spacing:var(--f-tracking-dense)}.section--getting-started__step.sc-landing-page{padding-bottom:120px}.section--getting-started__step.sc-landing-page:last-child{padding-bottom:0}.section--getting-started__step.sc-landing-page .ui-col.sc-landing-page:first-child{font-size:12px;color:var(--c-carbon-40);font-family:var(--f-family-monospace);text-align:center;height:calc(100% + 120px)}.section--getting-started__step.sc-landing-page .ui-col.sc-landing-page:first-child:after{content:\"\";display:block;margin-top:35px !important;height:75%;width:1px;margin:auto;background:var(--c-carbon-10)}.section--getting-started.sc-landing-page .ui-col.sc-landing-page .ui-heading.sc-landing-page{font-size:28px;font-weight:600;letter-spacing:var(--f-tracking-tight)}.section--platforms.sc-landing-page hgroup.sc-landing-page{text-align:center;max-width:560px;margin:auto}.section--platforms__all.sc-landing-page{text-align:center;margin-top:96px}.section--platforms__all.sc-landing-page img.sc-landing-page{max-width:100%;max-height:412px;margin-right:96px}.section--platforms__all.sc-landing-page img.sc-landing-page:last-child{margin-right:0}";

class LandingPage {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h(MetaHead, null), h("section", { class: "hero" }, h(ResponsiveContainer, null, h(Grid, null, h(Col, { md: 6, sm: 6, xs: 6, cols: 12 }, h("hgroup", { class: "hero__heading" }, h("h1", null, "A cross-platform native runtime for web apps."), h("h3", null, "Capacitor turns any web app into a native app so you can run one app across iOS, Android, and the Web with the same code."), h("div", { class: "hero__buttons" }, h(AnchorButton, { href: "/docs/getting-started/", id: "get-started" }, "Get Started"), h(AnchorButton, { href: "/docs/", id: "explore-docs", class: "btn-white" }, "Explore Docs")))), h(Col, { md: 6, sm: 6, xs: 6, cols: 12, class: "hero__graphic" }, h("img", { src: "/assets/img/landing/hero-graphic.png", alt: "Capacitor Architecture Diagram" }))), h("img", { src: "/assets/img/supported-icons.png", alt: "Supported platforms", style: { height: '16px' } }))), h(GettingStartedSection, null), h(ResponsiveContainer, null, h("section", { class: "points" }, h(Heading, { level: 2 }, "Why Capacitor?"), h(Paragraph, null, "Leverage Capacitor\u2019s native runtime for connecting web apps to native functionality across iOS, Android, and the mobile web (PWA) \u2014 all from a single shared codebase."), h(Grid, null, h(Col, { md: 4, sm: 4, xs: 4, cols: 6 }, h("div", null, h("img", { class: "points__img", src: "/assets/img/landing/why-cross-platform.png", alt: "Cross Platform" }), h("h2", null, "Cross Platform"), h("p", null, "Build web apps that run equally well on iOS, Android, and as Progressive Web Apps"))), h(Col, { md: 4, sm: 4, xs: 4, cols: 6 }, h("div", { class: "points__item points__item--nativeaccess" }, h("img", { class: "points__img", src: "/assets/img/landing/why-native.png", alt: "Native" }), h("h2", null, "Native Access"), h("p", null, "Access the full Native SDK on each platform, and easily deploy to App Stores (and the web!)"))), h(Col, { md: 4, sm: 4, xs: 4, cols: 6 }, h("div", { class: "points__item points__item--extensible" }, h("img", { class: "points__img", src: "/assets/img/landing/why-extensible.png", alt: "Extensible" }), h("h2", null, "Extensible"), h("p", null, "Easily add custom native functionality with a simple Plugin API, or use existing Cordova plugins with our compatibility layer."))), h(Col, { md: 4, sm: 4, xs: 4, cols: 6 }, h("div", { class: "points__item points__item--webnative" }, h("img", { class: "points__img", src: "/assets/img/landing/why-web-to-native.png", alt: "Web To Native" }), h("h2", null, "Web Native"), h("p", null, "Build apps with standardized web technologies that will work for decades, and easily reach users on the app stores ", h("i", null, "and"), " the mobile web."))), h(Col, { md: 4, sm: 4, xs: 4, cols: 6 }, h("div", { class: "points__item points__item--extensible" }, h("img", { class: "points__img", src: "/assets/img/landing/why-production-ready.png", alt: "Production Ready" }), h("h2", null, "Production Ready"), h("p", null, "Powering apps with millions of users and backed by a company dedicated to app development, Capacitor is ready for serious production apps, today."))), h(Col, { md: 4, sm: 4, xs: 4, cols: 6 }, h("div", { class: "points__item points__item--opensource" }, h("img", { class: "points__img", src: "/assets/img/landing/why-oss.png", alt: "Open Source" }), h("h2", null, "Open Source"), h("p", null, "Capacitor is completely open source (MIT) and maintained by ", h("a", { href: "http://ionicframework.com/" }, "Ionic"), " and its community."))))), h("section", { class: "section--platforms" }, h("hgroup", null, h(Heading, { level: 3 }, "Target native mobile and web.", h("br", null), "All from a single codebase."), h(Paragraph, null, "Build cross-platform apps that work seemlessly across iOS, Android, desktop, and the web. Reduce maintenance and development time with a powerful app foundation that lets you build once and deploy anywhere.")), h("div", { class: "section--platforms__all" }, h("img", { src: "/assets/img/landing/target-native.png", alt: "Capacitor targets Native" })))), h("newsletter-signup", null), h("pre-footer", null), h("capacitor-site-footer", null)));
    }
    static get style() { return landingPageCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "landing-page",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}
const GettingStartedSection = () => (h("section", { class: "section--getting-started" }, h(ResponsiveContainer, null, h("hgroup", null, h(Heading, { level: 2 }, "Getting started is easy.")), h(Grid, { class: "section--getting-started__step" }, h(Col, { cols: 1 }, "01"), h(Col, { md: 5, sm: 5, xs: 5, cols: 12 }, h(Heading, { level: 3 }, "Drop Capacitor into any existing web app.")), h(Col, { md: 6, sm: 6, xs: 6, cols: 12 }, h("code-snippet", { language: "shell-session", code: `
npm install @capacitor/cli @capacitor/core
npx cap init
` }))), h(Grid, { class: "section--getting-started__step" }, h(Col, { cols: 1 }, "02"), h(Col, { md: 5, sm: 5, xs: 5, cols: 12 }, h(Heading, { level: 3 }, "Install the native platforms you want to target.")), h(Col, { md: 6, sm: 6, xs: 6, cols: 12 }, h("code-snippet", { language: "shell-session", code: `
npx cap add ios
npx cap add android
` }))), h(Grid, { class: "section--getting-started__step" }, h(Col, { cols: 1 }, "03"), h(Col, { md: 5, sm: 5, xs: 5, cols: 12 }, h(Heading, { level: 3 }, "Access core Native APIs or extend with your own.")), h(Col, { md: 6, sm: 6, xs: 6, cols: 12 }, h("code-snippet", { language: "typescript", code: `
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

LocalNotifications.schedule({
  notifications: [
    {
      title: "On sale",
      body: "Widgets are 10% off. Act fast!",
      id: 1,
      schedule: { at: new Date(Date.now() + 1000 * 5) },
      sound: null,
      attachments: null,
      actionTypeId: "",
      extra: null
    }
  ]
});
` }))))));
const MetaHead = () => (h(Helmet, null, h("title", null, "Capacitor: Universal Web Applications"), h("meta", { name: "description", content: 'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript' }), h("meta", { name: "twitter:card", content: "summary_large_image" }), h("meta", { name: "twitter:site", content: "@getcapacitor" }), h("meta", { name: "twitter:creator", content: "getcapacitor" }), h("meta", { name: "twitter:title", content: "Build cross-platform apps with web technologies" }), h("meta", { name: "twitter:description", content: "Build cross-platform apps with web technologies" })));

const lowerContentNavCss = "lower-content-nav{display:block;overflow:hidden}";

class LowerContentNav {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return [
            (this.prev != null ?
                h("a", { href: this.prev.url, class: "pull-left btn btn--secondary" }, "Back") :
                null),
            (this.next != null ?
                h("a", { href: this.next.url, class: "pull-right btn btn--primary" }, "Next") :
                null)
        ];
    }
    static get style() { return lowerContentNavCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "lower-content-nav",
        "$members$": {
            "next": [16],
            "prev": [16]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const newsletterSignupCss = ".sc-newsletter-signup:root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}.newsletter.sc-newsletter-signup{padding:48px 0;border-top:1px solid var(--c-indigo-20);border-bottom:1px solid var(--c-indigo-20)}.newsletter.sc-newsletter-signup .ui-grid.sc-newsletter-signup{-ms-flex-align:center;align-items:center}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup{padding-right:40px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup img.sc-newsletter-signup{width:64px;height:64px;margin-right:16px;display:inline-block;vertical-align:middle}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup div.sc-newsletter-signup{-ms-flex:1;flex:1}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup h2.sc-newsletter-signup{margin:0 0 6px}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup p.sc-newsletter-signup{margin:0;line-height:23px}.newsletter.sc-newsletter-signup form.sc-newsletter-signup{display:-ms-flexbox;display:flex}.newsletter.sc-newsletter-signup form.sc-newsletter-signup input.sc-newsletter-signup{-ms-flex:1;flex:1;padding:5px 10px 5px 16px;margin-right:8px;width:200px;min-height:calc(100% - 1px);background-color:#fff;border:1px solid var(--c-indigo-30);border-radius:6px;font-size:16px;font-weight:400;color:#070D12;letter-spacing:-0.22px}.newsletter.sc-newsletter-signup form.sc-newsletter-signup input.sc-newsletter-signup:placeholder{color:#6D6C82}.newsletter.sc-newsletter-signup form.sc-newsletter-signup button.sc-newsletter-signup{-ms-flex:0;flex:0;background-color:#119EFF;color:white}@media screen and (max-width: 768px){.newsletter.sc-newsletter-signup .container.sc-newsletter-signup{-ms-flex-direction:column;flex-direction:column;text-align:center;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup,.newsletter.sc-newsletter-signup form.sc-newsletter-signup{-ms-flex:0 0 100%;flex:0 0 100%}.newsletter.sc-newsletter-signup hgroup.sc-newsletter-signup{padding:0}.newsletter.sc-newsletter-signup form.sc-newsletter-signup{margin-top:24px;width:100%;-ms-flex-pack:center;justify-content:center}}.landing-page.sc-newsletter-signup .newsletter.sc-newsletter-signup{background-color:#102331}";

class NewsletterSignup {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("section", { class: "newsletter" }, h(ResponsiveContainer, null, h(Grid, null, h(Col, { md: 6, sm: 6, xs: 6, cols: 12 }, h("hgroup", null, h("img", { src: "/assets/img/newsletter-icon.png", alt: "newsletter" }), h("div", null, h(Heading, { level: 4 }, "The Capacitor Newsletter"), h("p", null, "Keep up to date with the latest Capacitor news and updates")))), h(Col, { md: 6, sm: 6, xs: 6, cols: 12 }, h("form", { action: "https://codiqa.createsend.com/t/t/s/flhuhj/", method: "post" }, h("input", { "aria-label": "Email address", type: "email", placeholder: "Email address", id: "fieldEmail", name: "cm-flhuhj-flhuhj", required: true }), h(Button, { type: 'submit' }, "Subscribe")))))));
    }
    static get style() { return newsletterSignupCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "newsletter-signup",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const platformBarCss = ".sc-site-platform-bar-h{display:block;background:var(--c-carbon-100)}.platform-bar__container.sc-site-platform-bar{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.platform-bar__logo.sc-site-platform-bar{-ms-flex:1;flex:1}.platform-bar__logo.sc-site-platform-bar img.sc-site-platform-bar{height:24px;margin:6px 0;vertical-align:middle}.platform-bar__desc.sc-site-platform-bar{-ms-flex:1;flex:1;-ms-flex-line-pack:end;align-content:flex-end;color:#ccc;font-size:var(--f-size-2);line-height:160%;text-align:right;letter-spacing:var(--f-tracking-tight)}.platform-bar__desc.sc-site-platform-bar strong.sc-site-platform-bar{color:white}.platform-bar__desc.sc-site-platform-bar a.sc-site-platform-bar{color:white;text-decoration:none}";

class PlatformBar {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h(ResponsiveContainer, { class: "platform-bar__container" }, h("div", { class: "platform-bar__logo" }, h("a", { href: "https://ionic.io/" }, h("img", { src: "/assets/ionic-logo.png", alt: "Ionic Logo" }))), h("div", { class: "platform-bar__desc" }, "See how ", h("strong", null, this.productName), " fits into the ", h("a", { href: "https://ionic.io/" }, "Ionic Ecosystem"), " ->"))));
    }
    static get style() { return platformBarCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "site-platform-bar",
        "$members$": {
            "productName": [1, "product-name"]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const pluginApiCss = "plugin-api .avc-code-plugin-index ul anchor-link div{display:inline-block}plugin-api .avc-code-plugin-index anchor-link{color:#5EB6FC;cursor:pointer}plugin-api .avc-code-plugin-name{display:none}plugin-api .avc-code-method-anchor-point{height:20px}plugin-api .avc-code-method{margin-bottom:25px}plugin-api .avc-code-method .avc-code-method-header{margin-top:15px}plugin-api .avc-code-method .avc-code-method-comment{margin:20px 0}plugin-api .avc-code-method-signature{font-family:monospace;padding:8px;background-color:#eee;border-radius:3px}plugin-api .avc-code-method-params .avc-code-method-param-info .avc-code-method-param-info-name{font-size:14px;font-weight:bold}plugin-api .avc-code-method-params .avc-code-method-param-info .avc-code-type-name,plugin-api .avc-code-method-params .avc-code-method-param-info avc-code-type{margin-left:5px;margin-right:5px;font-style:italic}plugin-api .avc-code-method-params .avc-code-method-param-info .avc-code-method-param-comment{display:inline-block}plugin-api .avc-code-method-params .avc-code-method-returns-label{font-weight:bold;font-size:14px;text-transform:lowercase}plugin-api .avc-code-string{color:#5EB6FC}plugin-api .avc-code-interface{margin-top:25px;font-family:monospace;line-height:18px}plugin-api .avc-code-interface-param{margin-left:25px;margin:8px 0 8px 25px}plugin-api .avc-code-param-comment{color:#8b94a5}";

class PluginApi {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isServer = getContext(this, "isServer");
    }
    componentWillLoad() {
        if (this.isServer) {
            return;
        }
        const url = `api${this.index ? '-index' : ''}.html`;
        return fetch(`/assets/docs-content/apis/${this.name}/${url}`)
            .then(response => {
            return response.text();
        })
            .then(data => {
            this.content = data;
            const el = document.createElement('div');
            el.innerHTML = data;
        });
    }
    componentDidUpdate() {
        this.bindHeadings(this.el);
    }
    bindHeadings(el) {
        if (this.isServer) {
            return;
        }
        const headings = Array.from(el.querySelectorAll('h1,h2,h3,h4,h5'));
        headings.forEach(h => {
            h.classList.add('anchor-link-relative');
            var link = document.createElement('anchor-link');
            link.className = 'hover-anchor';
            if (h.id) {
                link.to = h.id;
            }
            link.innerHTML = '#';
            h.insertBefore(link, h.firstChild);
        });
    }
    render() {
        return (h("div", null, h("div", { innerHTML: this.content })));
    }
    get el() { return getElement(this); }
    static get style() { return pluginApiCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "plugin-api",
        "$members$": {
            "name": [1],
            "index": [4],
            "content": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const pluginPlatformsCss = "plugin-platforms{display:block}plugin-platforms .platforms .platform{display:inline-block}";

class PluginPlatforms {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.platforms = "";
    }
    render() {
        const platforms = this.platforms.split(',');
        return (h("div", { class: "platforms" }, platforms.map(platform => {
            return (h("div", { class: `platform platform-icon-${platform}` }, platform));
        })));
    }
    static get style() { return pluginPlatformsCss; }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "plugin-platforms",
        "$members$": {
            "platforms": [1]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const preFooterCss = ".sc-pre-footer-h{display:block}img.sc-pre-footer{width:48px;height:48px}.ui-grid.sc-pre-footer{gap:0}.ui-col.sc-pre-footer{padding:64px 0}.ui-col.sc-pre-footer:first-child{border-right:1px solid var(--c-indigo-20)}.ui-col.sc-pre-footer:last-child{padding-left:86px}";

class PreFooter {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h(ResponsiveContainer, null, h(Grid, null, h(Col, { md: 6, sm: 6, xs: 12, cols: 12 }, h("a", { href: "/docs" }, h("img", { src: "/assets/img/docs.png", alt: "Read the docs" }), h(Heading, { level: 4 }, "Read the Docs ->"), h("p", null, "Install Capacitor and learn how to start building with it"))), h(Col, { md: 6, sm: 6, xs: 12, cols: 12 }, h("a", { href: "/docs/apis" }, h("img", { src: "/assets/img/native-apis.png", alt: "Explore the Native APIs" }), h(Heading, { level: 4 }, "Explore Native APIs ->"), h("p", null, "Explore Native APIs that are available to all Capacitor apps")))))));
    }
    static get style() { return preFooterCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "pre-footer",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const capacitorSiteHeaderCss = ".sc-capacitor-site-header:root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}.sc-capacitor-site-header-h{background-color:#fff;display:block;padding:6px 0;-webkit-box-shadow:0px 1px 0px rgba(0, 0, 0, 0.06);box-shadow:0px 1px 0px rgba(0, 0, 0, 0.06);--link-color:var(--c-carbon-90)}.page-theme--dark .sc-capacitor-site-header-h{background-color:transparent;--link-color:white}.site-header.sc-capacitor-site-header{display:-ms-flexbox;display:flex}.site-header--scrolled.sc-capacitor-site-header{-webkit-box-shadow:0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 0px rgba(0, 0, 0, 0.02);box-shadow:0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 0px rgba(0, 0, 0, 0.02)}.site-header__container.sc-capacitor-site-header{padding-top:20px;padding-bottom:20px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}.site-header__logo-link.sc-capacitor-site-header{margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;border:0}.site-header__logo-link.sc-capacitor-site-header img.sc-capacitor-site-header{height:22px}.site-header__menu.sc-capacitor-site-header{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.site-header__menu.sc-capacitor-site-header a.sc-capacitor-site-header{margin:0 24px;-webkit-transition:border 0.3s, color 0.3s;transition:border 0.3s, color 0.3s;font-size:14px;border-bottom:3px solid transparent;vertical-align:top;color:var(--link-color);opacity:0.4;text-decoration:none;font-weight:500;letter-spacing:-0.02em}.site-header__menu.sc-capacitor-site-header a.link--active.sc-capacitor-site-header{opacity:1}.site-header__menu.sc-capacitor-site-header .link.sc-capacitor-site-header,.site-header__menu.sc-capacitor-site-header .link--external.sc-capacitor-site-header{position:relative;border:0;-webkit-transition:color 0.3s;transition:color 0.3s}.site-header__menu.sc-capacitor-site-header .link--external.sc-capacitor-site-header .icon.sc-capacitor-site-header{margin-left:6px;-webkit-transition:top 0.2s, left 0.2s;transition:top 0.2s, left 0.2s;position:relative}.site-header__menu.sc-capacitor-site-header .link--external.sc-capacitor-site-header:hover{color:#000}.site-header__menu.sc-capacitor-site-header .link--external.sc-capacitor-site-header:hover .icon.sc-capacitor-site-header{left:1px;top:-1px}.site-header__buttons.sc-capacitor-site-header .ui-button.sc-capacitor-site-header{font-size:var(--f-size-4);letter-spacing:var(--f-tracking-tight);line-height:18px;padding:6px 6px;margin-left:5px}.site-header__buttons__github.sc-capacitor-site-header{background:#fff;border:1px solid #EBEFF4;color:var(--c-indigo-80);line-height:0}.site-header__buttons__github.sc-capacitor-site-header ion-icon.sc-capacitor-site-header{vertical-align:middle}.site-header__buttons__install.sc-capacitor-site-header{background:var(--color-capacitor-blue)}";

const formatNumber = (n) => {
    if (n > 1000) {
        return (n / 1000).toFixed(1) + 'K';
    }
    return n;
};
class SiteHeader {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isScrolled = false;
    }
    async componentWillLoad() {
        try {
            const ret = await fetch("https://api.github.com/repos/ionic-team/capacitor");
            const json = await ret.json();
            this.starCount = formatNumber(json.stargazers_count);
        }
        catch (e) {
            console.error('Unable to get stars', e);
        }
    }
    handleDropdownEnter() {
        this.isDropdownShown = true;
    }
    handleDropdownLeave() {
        this.isDropdownShown = false;
    }
    render() {
        return (h(ResponsiveContainer, { class: "site-header" }, h("a", Object.assign({}, href('/'), { class: "site-header__logo-link" }), state.pageTheme === 'dark' ? (h("img", { src: "/assets/img/heading/logo-white.png", alt: "Capacitor Logo" })) : (h("img", { src: "/assets/img/heading/logo-black.png", alt: "Capacitor Logo" }))), h("div", { class: "site-header__menu" }, h(NavLink, { path: "/#features" }, "Features"), h(NavLink, { path: "/docs" }, "Docs"), h(NavLink, { path: "/community" }, "Community"), h(NavLink, { path: "/blog" }, "Blog"), h(NavLink, { path: "/enterprise" }, "Enterprise")), h("div", { class: "site-header__buttons" }, h(AnchorButton, { href: "https://github.com/ionic-team/capacitor", class: "site-header__buttons__github" }, h("ion-icon", { name: "logo-github" }), this.starCount ? this.starCount : 'GitHub'), h(Button, { class: "site-header__buttons__install" }, "Install"))));
    }
    get el() { return getElement(this); }
    static get style() { return capacitorSiteHeaderCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "capacitor-site-header",
        "$members$": {
            "isMobileMenuShown": [32],
            "isDropdownShown": [32],
            "isScrolled": [32],
            "starCount": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}
const NavLink = ({ path }, children) => {
    // Detect active if path equals the route path or the current active path plus
    // the route hash equals the path, to support links like /#features
    const active = Router.activePath === path ||
        Router.activePath + Router.url.hash === path;
    return (h("a", Object.assign({}, href(path), { class: {
            'link--active': active
        } }), children));
};

const docsMenuCss = ".sc-docs-menu:root{--color-capacitor-blue:#119EFF;--button-background:var(--color-capacitor-blue);--color-woodsmoke:#16161D;--color-dolphin:#626177;--color-gunpowder:#505061;--color-manatee:#8888A2;--color-cadet-blue:#abb2bf;--color-whisper:#EBEBF7;--color-selago:#F4F4FD;--color-white-lilac:#f8f8fc;--color-white:#fff;--color-green-haze:#00AB47;--color-dodger-blue:#1d9aff;--color-dodger-blue-hover:rgba(#1d9aff, 0.2);--color-old-lace:#fdf5e4;--color-wheatfield:#F1E3C5;--color-pirate-gold:#9A6400;--button-shadow:0 8px 16px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.08);--button-shadow-hover:0 4px 6px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.08);--ease-out-expo:cubic-bezier(0.19, 1, 0.22, 1)}.sc-docs-menu-h{display:block;-ms-flex:0 0 auto;flex:0 0 auto;margin-top:100px}@media screen and (max-width: 768px){.sc-docs-menu-h{position:fixed;top:0;left:0;background:var(--color-woodsmoke);z-index:999;padding:20px;width:calc(100vw - 56px);-webkit-transform:translateX(calc(-100vw + 56px));transform:translateX(calc(-100vw + 56px));height:100%;overflow-y:scroll}.sc-docs-menu-h .menu-list.sc-docs-menu .section-label.sc-docs-menu{color:white}.sc-docs-menu-h .menu-list.sc-docs-menu a.sc-docs-menu{color:rgba(255, 255, 255, 0.6)}.sc-docs-menu-h .menu-list.sc-docs-menu a.sc-docs-menu:hover:not(.link-active){color:white}}.section-label.sc-docs-menu{color:var(--color-woodsmoke);margin-bottom:0;font-size:14px;font-weight:600}.menu-list.sc-docs-menu li.sc-docs-menu,.menu-list.sc-docs-menu ul.sc-docs-menu li.sc-docs-menu{list-style-type:none;margin:0;padding:0}.menu-list.sc-docs-menu{margin-top:0;padding:0}.menu-list.sc-docs-menu .section-label.sc-docs-menu:first-of-type{margin-top:0;margin-bottom:0}.menu-list.sc-docs-menu ul.sc-docs-menu{padding:0;margin-top:0;margin-bottom:0}.menu-list.sc-docs-menu li.sc-docs-menu{font-size:14px}.menu-list.sc-docs-menu>li.sc-docs-menu+li.sc-docs-menu{margin-top:8px}.menu-list.sc-docs-menu a.sc-docs-menu{font-weight:400;color:#6c6c8b;text-decoration:none;border:0;cursor:pointer}.menu-list.sc-docs-menu a.sc-docs-menu:hover{border:0}.menu-list.sc-docs-menu>li.sc-docs-menu>a.sc-docs-menu{cursor:pointer}.menu-list.sc-docs-menu>li.sc-docs-menu>a.sc-docs-menu ion-icon.sc-docs-menu{color:var(--c-carbon-90);font-weight:bold;font-size:14px;vertical-align:middle;margin-right:8px}.menu-list.sc-docs-menu .link-active.sc-docs-menu{font-weight:500;color:var(--color-dodger-blue)}.menu-list.sc-docs-menu a.sc-docs-menu:hover:not(.link-active){color:var(--color-woodsmoke)}.menu-list.sc-docs-menu ul.sc-docs-menu li.sc-docs-menu{padding-left:22px;-webkit-transition:80ms height;transition:80ms height;height:26px;display:block;overflow:hidden}.menu-list.sc-docs-menu ul.sc-docs-menu li.sc-docs-menu a.sc-docs-menu{display:block;-webkit-transition:0.2s color ease, 0.2s -webkit-transform ease;transition:0.2s color ease, 0.2s -webkit-transform ease;transition:0.2s transform ease, 0.2s color ease;transition:0.2s transform ease, 0.2s color ease, 0.2s -webkit-transform ease}.menu-list.sc-docs-menu ul.sc-docs-menu li.sc-docs-menu:hover a.sc-docs-menu,.menu-list.sc-docs-menu ul.sc-docs-menu li.sc-docs-menu a.link-active.sc-docs-menu{-webkit-transform:translateX(2px);transform:translateX(2px)}.menu-list.sc-docs-menu ul.collapsed.sc-docs-menu li.sc-docs-menu{height:0}";

class SiteMenu {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.siteStructureList = [];
        this.selectedParent = null;
        this.closeList = [];
        this.toggleParent = (itemNumber) => {
            return (e) => {
                e.preventDefault();
                if (this.closeList.indexOf(itemNumber) !== -1) {
                    this.closeList.splice(this.closeList.indexOf(itemNumber), 1);
                    this.closeList = [...this.closeList];
                }
                else {
                    this.closeList = [...this.closeList, itemNumber];
                }
                console.log(e, this.closeList);
            };
        };
    }
    componentWillLoad() {
        this.closeList = this.siteStructureList.map((_item, i) => i);
        this.closeList.shift();
    }
    render() {
        return (h("div", { class: "sticky" }, h("div", null, h("ul", { class: "menu-list" }, this.siteStructureList.map((item, i) => {
            const collapsed = this.closeList.indexOf(i) !== -1;
            return (h("li", null, h("a", { href: "#", onClick: this.toggleParent(i), class: { collapsed } }, collapsed ? h("ion-icon", { name: "chevron-forward" }) : h("ion-icon", { name: "chevron-down" }), h("span", { class: "section-label" }, item.text)), h("ul", { class: { collapsed } }, item.children.map((childItem) => {
                return (h("li", null, (childItem.url) ?
                    h("a", Object.assign({}, href(childItem.url)), childItem.text) :
                    h("a", { rel: "noopener", class: "link--external", target: "_blank", href: childItem.filePath }, childItem.text)));
            }))));
        })))));
    }
    static get style() { return docsMenuCss; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "docs-menu",
        "$members$": {
            "siteStructureList": [16],
            "selectedParent": [1040],
            "closeList": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const siteModalCss = ":root{--modal-z-index:1100;--modal-backdrop-z-index:1090;--modal-width:768px;--modal-padding:48px;--modal-border-radius:24px}site-modal{display:block;pointer-events:none;position:fixed;top:0;left:0;bottom:0;right:0;z-index:var(--modal-z-index)}.modal__backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:var(--modal-backdrop-z-index);-webkit-transition:opacity 300ms ease-in-out;transition:opacity 300ms ease-in-out;background-color:#000;opacity:0}.modal__backdrop.in{opacity:0.5}.modal__backdrop.out{opacity:0}.modal__wrap{-webkit-transition:-webkit-transform 300ms cubic-bezier(0.32, 0.72, 0, 1);transition:-webkit-transform 300ms cubic-bezier(0.32, 0.72, 0, 1);transition:transform 300ms cubic-bezier(0.32, 0.72, 0, 1);transition:transform 300ms cubic-bezier(0.32, 0.72, 0, 1), -webkit-transform 300ms cubic-bezier(0.32, 0.72, 0, 1);-webkit-transform:translateY(-120%);transform:translateY(-120%)}.modal__wrap.in{-webkit-transform:translate(0%);transform:translate(0%)}.modal__content{pointer-events:auto;max-width:var(--modal-width);margin:76px auto;background:white;position:relative;border-radius:var(--modal-border-radius)}.modal__content .modal__close-button{position:absolute;top:-10px;right:-10px;background:#fff;color:var(--c-carbon-90);padding:0;text-align:center;border:0;border-radius:100%;height:30px;width:30px;-webkit-box-shadow:var(--elevation-2);box-shadow:var(--elevation-2);outline:0}.modal__content .modal__close-button ion-icon{vertical-align:middle;margin-top:-3px}.modal__body{padding:var(--modal-padding);max-height:calc(100vh - 76px);overflow:auto}.modal__body h1,.modal__body h2,.modal__body h3,.modal__body h4,.modal__body h5{margin-top:0}";

class SiteModal {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.open = false;
        this.visible = false;
        this.OPEN_DELAY = 500;
        this.CLOSE_DELAY = 500;
        this.close = () => {
            this.visible = false;
            this.hideBackdrop();
            setTimeout(() => {
                this.open = false;
            }, this.CLOSE_DELAY);
        };
        this.openBackdrop = () => {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal__backdrop';
            document.body.appendChild(backdrop);
            this.initBackdrop(backdrop);
            this.backdropEl = backdrop;
            requestAnimationFrame(() => {
                backdrop.classList.add('in');
            });
        };
        this.hideBackdrop = () => {
            if (!this.backdropEl) {
                return;
            }
            this.backdropEl.classList.add('out');
            setTimeout(() => {
                var _a;
                document.body.removeChild(this.backdropEl);
                this.backdropEl = null;
                this.modalClose && this.modalClose();
                (_a = this.onModalClose) === null || _a === void 0 ? void 0 : _a.emit();
            }, this.CLOSE_DELAY);
        };
        this.checkBackdrop = () => { };
        this.initBackdrop = (el) => {
            el.addEventListener('click', (_e) => {
                this.close();
            });
        };
        this.onModalClose = createEvent(this, "modalClose", 7);
    }
    componentDidLoad() {
        this.checkBackdrop();
    }
    handleKeyUp(e) {
        if (this.open && e.key === 'Escape') {
            this.close();
        }
    }
    openChanged() {
        if (this.open && !this.backdropEl) {
            this.openBackdrop();
        }
        else if (!this.open && this.backdropEl) {
            this.hideBackdrop();
        }
        requestAnimationFrame(() => {
            this.visible = this.open;
        });
    }
    render() {
        return (h(Host, { style: {
                display: this.open ? 'block' : 'none',
            } }, h("div", { class: `modal__wrap${this.visible ? ` in` : ``}` }, h("div", { class: `modal__content` }, h(Button, { class: "modal__close-button", onClick: this.close }, h("ion-icon", { name: "close" })), h("div", { class: "modal__body" }, h("slot", null))))));
    }
    static get watchers() { return {
        "open": ["openChanged"]
    }; }
    static get style() { return siteModalCss; }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "site-modal",
        "$members$": {
            "open": [1028],
            "modalClose": [16],
            "visible": [32]
        },
        "$listeners$": [[8, "keyup", "handleKeyUp"]],
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const siteRootCss = "@charset \"UTF-8\";:root{--c-white:#ffffff;--c-black:#000000;--c-blue-0:#f0f6ff;--c-blue-10:#e3edff;--c-blue-20:#cddfff;--c-blue-30:#b2ceff;--c-blue-40:#97bdff;--c-blue-50:#7cabff;--c-blue-60:#639bff;--c-blue-70:#4d8dff;--c-blue-80:#3880ff;--c-blue-90:#1b6dff;--c-blue-100:#0054e9;--c-ionic-brand:var(--c-blue-80);--c-gray-0:#f3f3f3;--c-gray-10:#e4e4e4;--c-gray-20:#c8c8c8;--c-gray-30:#aeaeae;--c-gray-40:#959595;--c-gray-50:#818181;--c-gray-60:#6d6d6d;--c-gray-70:#5f5f5f;--c-gray-80:#474747;--c-gray-90:#2f2f2f;--c-gray-100:#141414;--c-carbon-0:#eef1f3;--c-carbon-10:#d7dde2;--c-carbon-20:#b4bcc6;--c-carbon-30:#98a2ad;--c-carbon-40:#7d8894;--c-carbon-50:#677483;--c-carbon-60:#556170;--c-carbon-70:#434f5e;--c-carbon-80:#35404e;--c-carbon-90:#222d3a;--c-carbon-100:#03060b;--c-indigo-0:#fbfbfd;--c-indigo-10:#f6f8fb;--c-indigo-20:#e9edf3;--c-indigo-30:#dee3ea;--c-indigo-40:#ced6e0;--c-indigo-50:#b2becd;--c-indigo-60:#92a0b3;--c-indigo-70:#73849a;--c-indigo-80:#445b78;--c-indigo-90:#2d4665;--c-indigo-100:#001a3a;--c-green-0:#effff3;--c-green-10:#e7ffee;--c-green-20:#d0ffdd;--c-green-30:#b8ffcb;--c-green-40:#97ffb3;--c-green-50:#71f895;--c-green-60:#4ef27a;--c-green-70:#31e962;--c-green-80:#18dd4c;--c-green-90:#00d338;--c-green-100:#00b831;--c-lime-0:#f8fff0;--c-lime-10:#f2ffe1;--c-lime-20:#eeffd8;--c-lime-30:#e5ffc3;--c-lime-40:#d8ffa7;--c-lime-50:#c8ff83;--c-lime-60:#b7f964;--c-lime-70:#a7f544;--c-lime-80:#97ec2d;--c-lime-90:#87e017;--c-lime-100:#75d100;--c-lavender-0:#f6f8ff;--c-lavender-10:#e5ebff;--c-lavender-20:#ced9ff;--c-lavender-30:#b6c6ff;--c-lavender-40:#9fb5ff;--c-lavender-50:#8aa4ff;--c-lavender-60:#7493ff;--c-lavender-70:#597eff;--c-lavender-80:#3c67ff;--c-lavender-90:#194bfd;--c-lavender-100:#0033e8;--c-purple-0:#f4f4ff;--c-purple-10:#e9eaff;--c-purple-20:#d0d2ff;--c-purple-30:#b6b9f9;--c-purple-40:#9a99fc;--c-purple-50:#8482fb;--c-purple-60:#786df9;--c-purple-70:#6e5afd;--c-purple-80:#6030ff;--c-purple-90:#4712fb;--c-purple-100:#3400e5;--c-pink-0:#fff2fb;--c-pink-10:#ffe3f6;--c-pink-20:#ffd4f1;--c-pink-30:#ffc7ec;--c-pink-40:#ffb6e8;--c-pink-50:#ff9cdf;--c-pink-60:#fc82d5;--c-pink-70:#f567c8;--c-pink-80:#ef4cbb;--c-pink-90:#f02fb2;--c-pink-100:#e410a1;--c-red-0:#fff2f2;--c-red-10:#ffdddd;--c-red-20:#ffc8c7;--c-red-30:#ffb6b5;--c-red-40:#ff9e9c;--c-red-50:#ff8a88;--c-red-60:#ff7370;--c-red-70:#ff605b;--c-red-80:#ff4747;--c-red-90:#ff201a;--c-red-100:#e70700;--c-orange-0:#fff5f0;--c-orange-10:#ffede5;--c-orange-20:#ffdfd1;--c-orange-30:#ffd0bc;--c-orange-40:#ffc0a5;--c-orange-50:#ffaf8c;--c-orange-60:#ff9b70;--c-orange-70:#ff8753;--c-orange-80:#ff7336;--c-orange-90:#ff5b13;--c-orange-100:#eb4700;--c-yellow-0:#fffbef;--c-yellow-10:#fff8e3;--c-yellow-20:#fff6d8;--c-yellow-30:#fff3c9;--c-yellow-50:#ffedad;--c-yellow-50:#ffe78f;--c-yellow-60:#ffe072;--c-yellow-70:#ffd84d;--c-yellow-80:#ffd130;--c-yellow-90:#ffc805;--c-yellow-100:#f5bf00;--c-aqua-0:#f0fff9;--c-aqua-10:#e5fff6;--c-aqua-20:#d5ffef;--c-aqua-30:#c0ffe8;--c-aqua-40:#aaffe0;--c-aqua-50:#90fbd4;--c-aqua-60:#70f6c5;--c-aqua-70:#4deeb2;--c-aqua-80:#32e2a1;--c-aqua-90:#00db8a;--c-aqua-100:#00cc80;--c-teal-0:#eefeff;--c-teal-10:#dffdff;--c-teal-20:#d0fdff;--c-teal-30:#bbfcff;--c-teal-40:#a2fcff;--c-teal-50:#8bfbff;--c-teal-60:#73f6fb;--c-teal-70:#55ecf2;--c-teal-80:#35e2e9;--c-teal-90:#1bd2d9;--c-teal-100:#00b9c0;--c-cyan-0:#f3faff;--c-cyan-10:#e8f5ff;--c-cyan-20:#d3ecff;--c-cyan-30:#bfe4ff;--c-cyan-40:#a7daff;--c-cyan-50:#8dcfff;--c-cyan-60:#77c6ff;--c-cyan-70:#62bdff;--c-cyan-80:#46b1ff;--c-cyan-90:#24a3ff;--c-cyan-100:#0091fa}@font-face{font-family:Eina;font-display:swap;src:url(/assets/fonts/eina/eina-01-bold.woff2) format(\"woff2\"), url(/assets/fonts/eina/eina-01-bold.woff) format(\"woff\"), url(/assets/fonts/eina/eina-01-bold.ttf) format(\"ttf\"), url(/assets/fonts/eina/eina-01-bold.eot?#iefix) format(\"eot\");font-weight:700;unicode-range:U+000-5FF}@font-face{font-family:Eina;font-display:swap;src:url(/assets/fonts/eina/eina-01-semibold.woff2) format(\"woff2\"), url(/assets/fonts/eina/eina-01-semibold.woff) format(\"woff\"), url(/assets/fonts/eina/eina-01-semibold.ttf) format(\"ttf\"), url(/assets/fonts/eina/eina-01-semibold.eot?#iefix) format(\"eot\");font-weight:600;unicode-range:U+000-5FF}@font-face{font-family:Eina;font-display:swap;src:url(/assets/fonts/eina/eina-01-regular.woff2) format(\"woff2\"), url(/assets/fonts/eina/eina-01-regular.woff) format(\"woff\"), url(/assets/fonts/eina/eina-01-regular.ttf) format(\"ttf\"), url(/assets/fonts/eina/eina-01-regular.eot?#iefix) format(\"eot\");font-weight:400;unicode-range:U+000-5FF}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:400;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Regular.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Regular.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:400;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Italic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Italic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:500;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Medium.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Medium.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:500;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-MediumItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-MediumItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:600;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-SemiBold.woff2) format(\"woff2\"), url(/assets/fonts/Inter-SemiBold.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:600;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-SemiBoldItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-SemiBoldItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:700;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Bold.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Bold.woff) format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:700;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-BoldItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-BoldItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:800;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-ExtraBold.woff2) format(\"woff2\"), url(/assets/fonts/Inter-ExtraBold.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:800;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-ExtraBoldItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-ExtraBoldItalic.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:normal;font-weight:900;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-Black.woff2) format(\"woff2\"), url(/assets/fonts/Inter-Black.woff) format(\"woff\")}@font-face{font-family:Inter;font-display:swap;font-style:italic;font-weight:900;unicode-range:U+000-5FF;src:url(/assets/fonts/Inter-BlackItalic.woff2) format(\"woff2\"), url(/assets/fonts/Inter-BlackItalic.woff) format(\"woff\")}@font-face{font-family:FreightTextPro;font-display:swap;font-weight:400;unicode-range:U+000-5FF;src:url(/assets/fonts/29D26A_0_0.eot);src:url(/assets/fonts/29D26A_0_0.eot?#iefix) format(\"embedded-opentype\"), url(/assets/fonts/29D26A_0_0.woff) format(\"woff\"), url(/assets/fonts/29D26A_0_0.ttf) format(\"truetype\")}@font-face{font-family:FreightTextPro;font-display:swap;font-weight:500;unicode-range:U+000-5FF;src:url(/assets/fonts/29D26A_1_0.eot);src:url(/assets/fonts/29D26A_1_0.eot?#iefix) format(\"embedded-opentype\"), url(/assets/fonts/29D26A_1_0.woff) format(\"woff\"), url(/assets/fonts/29D26A_1_0.ttf) format(\"truetype\")}:root{--f-family-display:\"Eina\", \"Helvetica Neue\", Helvetica, sans-serif;--f-family-text:\"Inter\", \"Inter UI\", Helvetica, Arial, sans-serif;--f-family-system:apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;--f-family-monospace:\"SF Mono\", \"Roboto Mono\", Menlo, monospace;--f-family-serif:\"Adobe Caslon\", Georgia, Times, \"Times New Roman\", serif;--f-size-root:16px;--f-size-0:0.625rem;--f-size-1:0.6875rem;--f-size-2:0.75rem;--f-size-3:0.8125rem;--f-size-4:0.875rem;--f-size-5:1.00rem;--f-size-6:1.25rem;--f-size-7:1.50rem;--f-size-8:2.00rem;--f-size-9:2.50rem;--f-size-10:3.00rem;--f-size-11:3.50rem;--f-size-12:4.00rem;--f-size-13:4.50rem;--f-size-14:5.00rem;--f-size-15:5.50rem;--f-size-16:6.00rem;--f-leading-solid:1.0;--f-leading-title:1.12;--f-leading-body:1.6;--f-leading-prose:1.8;--f-tracking-dense:-0.04em;--f-tracking-tight:-0.02em;--f-tracking-solid:0.00em;--f-tracking-wide:0.04em;--f-tracking-super:0.08em;--f-tracking-extra:0.16em;--f-weight-light:300;--f-weight-regular:400;--f-weight-medium:500;--f-weight-semibold:600;--f-weight-bold:700}:root{--space-0:0.25rem;--space-1:0.50rem;--space-2:0.75rem;--space-3:1.00rem;--space-4:1.25rem;--space-5:1.5rem;--space-6:2.00rem;--space-7:2.50rem;--space-8:3.00rem;--space-9:4.00rem;--space-10:5.00rem;--space-11:6.00rem;--space-12:8.00rem;--space-13:10.00rem;--space-14:12.00rem;--space-15:14.00rem;--space-16:16.00rem;}:root{--radii-0:0;--radii-1:6px;--radii-2:8px;--radii-3:16px;--radii-4:100%}:root{--elevation-0:none;--elevation-1:0px 1px 2px rgba(2, 8, 20, 0.10), 0px 0px 1px rgba(2, 8, 20, 0.08);--elevation-2:0px 2px 4px rgba(2, 8, 20, 0.10), 0px 1px 2px rgba(2, 8, 20, 0.08);--elevation-3:0px 4px 8px rgba(2, 8, 20, 0.08), 0px 2px 4px rgba(2, 8, 20, 0.08);--elevation-4:0px 8px 16px rgba(2, 8, 20, 0.08), 0px 4px 8px rgba(2, 8, 20, 0.08);--elevation-5:0px 16px 32px rgba(2, 8, 20, 0.08), 0px 8px 16px rgba(2, 8, 20, 0.08);--elevation-6:0px 32px 64px rgba(2, 8, 20, 0.08), 0px 16px 32px rgba(2, 8, 20, 0.10)}:root{--z-subnav:1000;--z-header-dropdown:1005}.ui-blockquote{background:#f2f5f8;border-radius:4px;position:relative;padding:64px 80px 68px 111px;color:#5e749a;font-family:\"Adobe Caslon\", Georgia, Times, \"Times New Roman\", serif;font-style:italic;border:none;margin:77px -16px 54px}.ui-blockquote:before{position:absolute;top:-6px;left:54px;font-size:180px;content:\"“\";color:#e3e7ec}.ui-breadcrumbs{font-size:13px;line-height:14px;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center}.ui-breadcrumbs li{display:inline-block}.ui-breadcrumbs li:first-child a{padding-left:0}.ui-breadcrumbs li:last-child a{color:var(--c-carbon-100);font-weight:500}.ui-breadcrumbs a{color:var(--c-carbon-50);font-size:13px;line-height:14px;padding:16px 2px;display:inline-block}.ui-breadcrumbs .nav-sep{display:inline-block;font-size:16px;font-weight:400;color:rgba(65, 77, 92, 0.2);margin:0 6px}.ui-breakpoint{display:none !important}@media (max-width: 480px){.ui-breakpoint-mobile{display:block !important}}@media (max-width: 480px){.ui-breakpoint-mobile.ui-breakpoint-inline-block{display:inline-block !important}}@media (min-width: 480px) and (max-width: 768px){.ui-breakpoint-tablet{display:block !important}}@media (min-width: 480px) and (max-width: 768px){.ui-breakpoint-tablet.ui-breakpoint-inline-block{display:inline-block !important}}@media (min-width: 768px){.ui-breakpoint-desktop{display:block !important}}@media (min-width: 768px){.ui-breakpoint-desktop.ui-breakpoint-inline-block{display:inline-block !important}}.ui-button{cursor:pointer;display:inline-block;font-weight:500;border-radius:8px;line-height:1.4em;padding:16px 20px;-webkit-transition:all 0.3s ease;transition:all 0.3s ease;font-size:16px;border:0px solid rgba(0, 0, 0, 0);color:#fff;background:var(--button-background, var(--c-ionic-brand));letter-spacing:0.01em}.ui-card--embelish{background-color:#fff;border-radius:6px;-webkit-box-shadow:var(--elevation-4);box-shadow:var(--elevation-4);border-radius:14px}.ui-card--embelish .ui-card-content{padding:32px}.ui-container{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width: 768px){.ui-container{width:750px}}@media (min-width: 992px){.ui-container{width:970px}}@media (min-width: 1104px){.ui-container{width:1054px}}.ui-grid{display:grid;-webkit-column-gap:56px;-moz-column-gap:56px;column-gap:56px;row-gap:96px;grid-template-columns:repeat(12, minmax(0, 1fr))}@media (max-width: 480px){.ui-grid{-webkit-column-gap:0;-moz-column-gap:0;column-gap:0;row-gap:48px}}@media (max-width: 768px){.ui-grid{-webkit-column-gap:0;-moz-column-gap:0;column-gap:0;row-gap:24px}}.ui-grid .ui-col-1{grid-column-end:span 1}.ui-grid .ui-col-2{grid-column-end:span 2}.ui-grid .ui-col-3{grid-column-end:span 3}.ui-grid .ui-col-4{grid-column-end:span 4}.ui-grid .ui-col-5{grid-column-end:span 5}.ui-grid .ui-col-6{grid-column-end:span 6}.ui-grid .ui-col-7{grid-column-end:span 7}.ui-grid .ui-col-8{grid-column-end:span 8}.ui-grid .ui-col-9{grid-column-end:span 9}.ui-grid .ui-col-10{grid-column-end:span 10}.ui-grid .ui-col-11{grid-column-end:span 11}.ui-grid .ui-col-12{grid-column-end:span 12}@media (min-width: 480px){.ui-grid .ui-col-xs-1{grid-column-end:span 1}.ui-grid .ui-col-xs-2{grid-column-end:span 2}.ui-grid .ui-col-xs-3{grid-column-end:span 3}.ui-grid .ui-col-xs-4{grid-column-end:span 4}.ui-grid .ui-col-xs-5{grid-column-end:span 5}.ui-grid .ui-col-xs-6{grid-column-end:span 6}.ui-grid .ui-col-xs-7{grid-column-end:span 7}.ui-grid .ui-col-xs-8{grid-column-end:span 8}.ui-grid .ui-col-xs-9{grid-column-end:span 9}.ui-grid .ui-col-xs-10{grid-column-end:span 10}.ui-grid .ui-col-xs-11{grid-column-end:span 11}.ui-grid .ui-col-xs-12{grid-column-end:span 12}}@media (min-width: 768px){.ui-grid .ui-col-sm-1{grid-column-end:span 1}.ui-grid .ui-col-sm-2{grid-column-end:span 2}.ui-grid .ui-col-sm-3{grid-column-end:span 3}.ui-grid .ui-col-sm-4{grid-column-end:span 4}.ui-grid .ui-col-sm-5{grid-column-end:span 5}.ui-grid .ui-col-sm-6{grid-column-end:span 6}.ui-grid .ui-col-sm-7{grid-column-end:span 7}.ui-grid .ui-col-sm-8{grid-column-end:span 8}.ui-grid .ui-col-sm-9{grid-column-end:span 9}.ui-grid .ui-col-sm-10{grid-column-end:span 10}.ui-grid .ui-col-sm-11{grid-column-end:span 11}.ui-grid .ui-col-sm-12{grid-column-end:span 12}}@media (min-width: 992px){.ui-grid .ui-col-md-1{grid-column-end:span 1}.ui-grid .ui-col-md-2{grid-column-end:span 2}.ui-grid .ui-col-md-3{grid-column-end:span 3}.ui-grid .ui-col-md-4{grid-column-end:span 4}.ui-grid .ui-col-md-5{grid-column-end:span 5}.ui-grid .ui-col-md-6{grid-column-end:span 6}.ui-grid .ui-col-md-7{grid-column-end:span 7}.ui-grid .ui-col-md-8{grid-column-end:span 8}.ui-grid .ui-col-md-9{grid-column-end:span 9}.ui-grid .ui-col-md-10{grid-column-end:span 10}.ui-grid .ui-col-md-11{grid-column-end:span 11}.ui-grid .ui-col-md-12{grid-column-end:span 12}}@media (min-width: 1200px){.ui-grid .ui-col-lg-1{grid-column-end:span 1}.ui-grid .ui-col-lg-2{grid-column-end:span 2}.ui-grid .ui-col-lg-3{grid-column-end:span 3}.ui-grid .ui-col-lg-4{grid-column-end:span 4}.ui-grid .ui-col-lg-5{grid-column-end:span 5}.ui-grid .ui-col-lg-6{grid-column-end:span 6}.ui-grid .ui-col-lg-7{grid-column-end:span 7}.ui-grid .ui-col-lg-8{grid-column-end:span 8}.ui-grid .ui-col-lg-9{grid-column-end:span 9}.ui-grid .ui-col-lg-10{grid-column-end:span 10}.ui-grid .ui-col-lg-11{grid-column-end:span 11}.ui-grid .ui-col-lg-12{grid-column-end:span 12}}.ui-heading{--title-font-family:var(--f-family-display);--subtitle-font-family:var(--f-family-text);--heading-color-dark:var(--c-carbon-90);--heading-color-light:var(--c-indigo-70);--h1-size:var(--f-size-12);--h1-leading:var(--f-leading-solid);--h1-weight:var(--f-weight-bold);--h2-size:var(--f-size-10);--h3-size:var(--f-size-8);--h4-size:var(--f-size-6);--h5-size:var(--f-size-5);--h6-size:var(--f-size-2);margin:0;line-height:var(--f-leading-title)}.ui-theme--editorial .ui-heading{--title-font-family:var(--f-family-text);--h1-size:var(--f-size-9);--h1-leading:var(--f-leading-title);--h1-weight:var(--f-weight-semibold);--h2-size:var(--f-size-8);--h3-size:var(--f-size-7);--h4-size:var(--f-size-6);--h5-size:var(--f-size-5);--h6-size:var(--f-size-0)}.ui-heading-1{font-family:var(--title-font-family);font-size:var(--h1-size);line-height:var(--h1-leading);letter-spacing:var(--f-tracking-dense);font-weight:var(--h1-weight);color:var(--heading-color-dark)}.ui-heading-2{font-family:var(--title-font-family);font-size:var(--h2-size);letter-spacing:var(--f-tracking-dense);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-3{font-family:var(--title-font-family);font-size:var(--h3-size);letter-spacing:var(--f-tracking-dense);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-4{font-family:var(--subtitle-font-family);font-size:var(--h4-size);letter-spacing:var(--f-tracking-tight);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-5{font-family:var(--subtitle-font-family);font-size:var(--h5-size);letter-spacing:var(--f-tracking-tight);font-weight:var(--f-weight-semibold);color:var(--heading-color-dark)}.ui-heading-6{font-family:var(--subtitle-font-family);font-size:var(--h6-size);letter-spacing:var(--f-tracking-extra);font-weight:var(--f-weight-bold);text-transform:uppercase;color:var(--heading-color-light)}.ui-heading--bordered{border-bottom:1px solid var(--c-indigo-30);margin-bottom:var(--space-5);padding-bottom:var(--space-2)}.ui-heading--strong{font-weight:var(--f-weight-bold)}.ui-heading--leading{line-height:var(--f-leading-text)}.ui-skeleton{display:block;width:100%;height:inherit;margin-top:4px;margin-bottom:4px;background:#EEEEEE;line-height:10px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}.ui-skeleton--animated{position:relative;background:-webkit-gradient(linear, left top, right top, color-stop(8%, rgba(0, 0, 0, 0.065)), color-stop(18%, rgba(0, 0, 0, 0.135)), color-stop(33%, rgba(0, 0, 0, 0.065)));background:linear-gradient(to right, rgba(0, 0, 0, 0.065) 8%, rgba(0, 0, 0, 0.135) 18%, rgba(0, 0, 0, 0.065) 33%);background-size:800px 104px;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-name:shimmer;animation-name:shimmer;-webkit-animation-timing-function:linear;animation-timing-function:linear}@-webkit-keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}span{display:inline-block}.prismic-raw-html{width:100%;overflow:auto}.prismic-raw-html table{overflow-x:auto;margin-right:-15px;padding-right:15px;-webkit-box-sizing:content-box;box-sizing:content-box;font-size:13px;border-collapse:collapse;border-spacing:0;margin-bottom:48px}.prismic-raw-html table td,.prismic-raw-html table th{text-align:left;min-width:120px;padding-right:12px;padding-top:12px;padding-bottom:12px}.prismic-raw-html table td:last-child,.prismic-raw-html table th:last-child{padding-right:0}.prismic-raw-html table th,.prismic-raw-html table b{font-weight:600}.prismic-raw-html table tbody tr td{border-top:1px solid #DEE3EA}.prismic-raw-html table tbody tr:first-child td{border-top:none}.prismic-raw-html table>thead>tr>th{border-bottom:1px solid #E9EDF3;font-weight:600}*{-webkit-box-sizing:border-box;box-sizing:border-box}html,body{padding:0;margin:0;width:100%;height:100%}body{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;font-family:var(--f-family-text);font-size:var(--f-size-root);line-height:var(--f-leading-body);letter-spacing:var(--f-tracking-tight);color:var(--c-carbon-90);position:relative;overflow-x:hidden}body.no-scroll{overflow:hidden}a{text-decoration:none;color:var(--c-ionic-brand)}stencil-route-link a{color:inherit}ul{margin:0;padding:0}li{list-style:none}hr{border:none;height:1px;background:var(--c-indigo-30);margin:var(--space-6) 0}site-root{display:block;width:100%;height:100%}";

class SiteRoot {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h("slot", null)));
    }
    static get style() { return siteRootCss; }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "site-root",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

registerComponents([
  AnchorLink,
  App,
  AppBurger,
  AppIcon,
  AppMarked,
  AvcCodeType,
  BlogPage,
  BlogPage$1,
  CapacitorCommunity,
  CapacitorSiteFooter,
  CapacitorSiteRoutes,
  CodeSnippet,
  ContributorList,
  Demo,
  DocSnippet,
  DocumentComponent,
  Enterprise,
  Icon,
  InPageNavigtion,
  LandingPage,
  LowerContentNav,
  NewsletterSignup,
  PlatformBar,
  PluginApi,
  PluginPlatforms,
  PreFooter,
  SiteHeader,
  SiteMenu,
  SiteModal,
  SiteRoot,
]);

exports.hydrateApp = hydrateApp;


  /*hydrateAppClosure end*/
  hydrateApp(window, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve);
  }

  hydrateAppClosure($stencilWindow);
}

/*
 Stencil Hydrate Runner v1.13.0-4 | MIT Licensed | https://stenciljs.com
 */

const templateWindows = new Map();
function createWindowFromHtml(templateHtml, uniqueId) {
    let templateWindow = templateWindows.get(uniqueId);
    if (templateWindow == null) {
        templateWindow = new MockWindow(templateHtml);
        templateWindows.set(uniqueId, templateWindow);
    }
    const win = cloneWindow(templateWindow);
    return win;
}

const URL_ = /*@__PURE__*/ (() => {
  if (typeof URL === 'function') {
    return URL;
  }
  const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  if (typeof requireFunc === 'function') {
    try {
      return requireFunc('url').URL;
    } catch (e) {}
  }
  return function() {};
})();

function normalizeHydrateOptions(inputOpts) {
    const outputOpts = Object.assign({
        serializeToHtml: false,
        destroyWindow: false,
        destroyDocument: false,
    }, inputOpts || {});
    if (typeof outputOpts.clientHydrateAnnotations !== 'boolean') {
        outputOpts.clientHydrateAnnotations = true;
    }
    if (typeof outputOpts.constrainTimeouts !== 'boolean') {
        outputOpts.constrainTimeouts = true;
    }
    if (typeof outputOpts.maxHydrateCount !== 'number') {
        outputOpts.maxHydrateCount = 300;
    }
    if (typeof outputOpts.runtimeLogging !== 'boolean') {
        outputOpts.runtimeLogging = false;
    }
    if (typeof outputOpts.timeout !== 'number') {
        outputOpts.timeout = 15000;
    }
    if (Array.isArray(outputOpts.excludeComponents)) {
        outputOpts.excludeComponents = outputOpts.excludeComponents.filter(filterValidTags).map(mapValidTags);
    }
    else {
        outputOpts.excludeComponents = [];
    }
    if (Array.isArray(outputOpts.staticComponents)) {
        outputOpts.staticComponents = outputOpts.staticComponents.filter(filterValidTags).map(mapValidTags);
    }
    else {
        outputOpts.staticComponents = [];
    }
    return outputOpts;
}
function filterValidTags(tag) {
    return typeof tag === 'string' && tag.includes('-');
}
function mapValidTags(tag) {
    return tag.trim().toLowerCase();
}
function generateHydrateResults(opts) {
    if (typeof opts.url !== 'string') {
        opts.url = `https://hydrate.stenciljs.com/`;
    }
    const results = {
        diagnostics: [],
        url: opts.url,
        host: null,
        hostname: null,
        href: null,
        pathname: null,
        port: null,
        search: null,
        hash: null,
        html: null,
        httpStatus: null,
        hydratedCount: 0,
        anchors: [],
        components: [],
        imgs: [],
        scripts: [],
        styles: [],
        title: null,
    };
    try {
        const url = new URL_(opts.url, `https://hydrate.stenciljs.com/`);
        results.url = url.href;
        results.host = url.host;
        results.hostname = url.hostname;
        results.href = url.href;
        results.port = url.port;
        results.pathname = url.pathname;
        results.search = url.search;
        results.hash = url.hash;
    }
    catch (e) {
        renderCatchError(results, e);
    }
    return results;
}
function renderBuildDiagnostic(results, level, header, msg) {
    const diagnostic = {
        level: level,
        type: 'build',
        header: header,
        messageText: msg,
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (results.pathname) {
        if (results.pathname !== '/') {
            diagnostic.header += ': ' + results.pathname;
        }
    }
    else if (results.url) {
        diagnostic.header += ': ' + results.url;
    }
    results.diagnostics.push(diagnostic);
    return diagnostic;
}
function renderBuildError(results, msg) {
    return renderBuildDiagnostic(results, 'error', 'Hydrate Error', msg);
}
function renderCatchError(results, err) {
    const diagnostic = renderBuildError(results, null);
    if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else {
            if (err.message != null) {
                diagnostic.messageText = err.message.toString();
            }
            else {
                diagnostic.messageText = err.toString();
            }
        }
    }
    return diagnostic;
}

const IS_NODE_ENV = typeof global !== 'undefined' &&
    typeof require === 'function' &&
    !!global.process &&
    Array.isArray(global.process.argv) &&
    typeof __filename === 'string' &&
    (!global.origin || typeof global.origin !== 'string');
const IS_NODE_WINDOWS_ENV = IS_NODE_ENV && global.process.platform === 'win32';

const isString = (v) => typeof v === 'string';
const isPromise = (v) => !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';

const catchError = (diagnostics, err, msg) => {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Build Error',
        messageText: 'build error',
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (isString(msg)) {
        diagnostic.messageText = msg;
    }
    else if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else {
            if (err.message != null) {
                diagnostic.messageText = err.message.toString();
            }
            else {
                diagnostic.messageText = err.toString();
            }
        }
    }
    if (diagnostics != null && !shouldIgnoreError(diagnostic.messageText)) {
        diagnostics.push(diagnostic);
    }
    return diagnostic;
};
const hasError = (diagnostics) => {
    if (diagnostics == null || diagnostics.length === 0) {
        return false;
    }
    return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
};
const shouldIgnoreError = (msg) => {
    return msg === TASK_CANCELED_MSG;
};
const TASK_CANCELED_MSG = `task canceled`;

function runtimeLogging(win, opts, results) {
    try {
        const pathname = win.location.pathname;
        win.console.error = (...msgs) => {
            renderCatchError(results, [...msgs].join(', '));
            if (opts.runtimeLogging) {
                runtimeLog(pathname, 'error', msgs);
            }
        };
        win.console.debug = (...msgs) => {
            renderBuildDiagnostic(results, 'debug', 'Hydrate Debug', [...msgs].join(', '));
            if (opts.runtimeLogging) {
                runtimeLog(pathname, 'debug', msgs);
            }
        };
        if (opts.runtimeLogging) {
            ['log', 'warn', 'assert', 'info', 'trace'].forEach(type => {
                win.console[type] = (...msgs) => {
                    runtimeLog(pathname, type, msgs);
                };
            });
        }
    }
    catch (e) {
        renderCatchError(results, e);
    }
}
function runtimeLog(pathname, type, msgs) {
    global.console[type].apply(global.console, [`[ ${pathname}  ${type} ] `, ...msgs]);
}

function initializeWindow(win, opts, results) {
    try {
        win.location.href = opts.url;
    }
    catch (e) {
        renderCatchError(results, e);
    }
    if (typeof opts.userAgent === 'string') {
        try {
            win.navigator.userAgent = opts.userAgent;
        }
        catch (e) { }
    }
    if (typeof opts.cookie === 'string') {
        try {
            win.document.cookie = opts.cookie;
        }
        catch (e) { }
    }
    if (typeof opts.referrer === 'string') {
        try {
            win.document.referrer = opts.referrer;
        }
        catch (e) { }
    }
    if (typeof opts.direction === 'string') {
        try {
            win.document.documentElement.setAttribute('dir', opts.direction);
        }
        catch (e) { }
    }
    if (typeof opts.language === 'string') {
        try {
            win.document.documentElement.setAttribute('lang', opts.language);
        }
        catch (e) { }
    }
    try {
        win.customElements = null;
    }
    catch (e) { }
    if (opts.constrainTimeouts) {
        constrainTimeouts(win);
    }
    runtimeLogging(win, opts, results);
    return win;
}

function inspectElement(results, elm, depth) {
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        const tagName = childElm.nodeName.toLowerCase();
        if (tagName.includes('-')) {
            // we've already collected components that were hydrated
            // now that the document is completed we can count how
            // many they are and their depth
            const cmp = results.components.find(c => c.tag === tagName);
            if (cmp != null) {
                cmp.count++;
                if (depth > cmp.depth) {
                    cmp.depth = depth;
                }
            }
        }
        else {
            switch (tagName) {
                case 'a':
                    const anchor = collectAttributes(childElm);
                    anchor.href = childElm.href;
                    if (typeof anchor.href === 'string') {
                        if (!results.anchors.some(a => a.href === anchor.href)) {
                            results.anchors.push(anchor);
                        }
                    }
                    break;
                case 'img':
                    const img = collectAttributes(childElm);
                    img.src = childElm.src;
                    if (typeof img.src === 'string') {
                        if (!results.imgs.some(a => a.src === img.src)) {
                            results.imgs.push(img);
                        }
                    }
                    break;
                case 'link':
                    const link = collectAttributes(childElm);
                    link.href = childElm.href;
                    if (typeof link.rel === 'string' && link.rel.toLowerCase() === 'stylesheet') {
                        if (typeof link.href === 'string') {
                            if (!results.styles.some(s => s.link === link.href)) {
                                delete link.rel;
                                delete link.type;
                                results.styles.push(link);
                            }
                        }
                    }
                    break;
                case 'script':
                    const script = collectAttributes(childElm);
                    script.src = childElm.src;
                    if (typeof script.src === 'string') {
                        if (!results.scripts.some(s => s.src === script.src)) {
                            results.scripts.push(script);
                        }
                    }
                    break;
            }
        }
        depth++;
        inspectElement(results, childElm, depth);
    }
}
function collectAttributes(node) {
    const parsedElm = {};
    const attrs = node.attributes;
    for (let i = 0, ii = attrs.length; i < ii; i++) {
        const attr = attrs.item(i);
        const attrName = attr.nodeName.toLowerCase();
        if (SKIP_ATTRS.has(attrName)) {
            continue;
        }
        const attrValue = attr.nodeValue;
        if (attrName === 'class' && attrValue === '') {
            continue;
        }
        parsedElm[attrName] = attrValue;
    }
    return parsedElm;
}
const SKIP_ATTRS = new Set(['s-id', 'c-id']);

function patchDomImplementation(doc, opts) {
    let win;
    if (doc.defaultView != null) {
        opts.destroyWindow = true;
        patchWindow(doc.defaultView);
        win = doc.defaultView;
    }
    else {
        opts.destroyWindow = true;
        opts.destroyDocument = false;
        win = new MockWindow(false);
    }
    if (win.document !== doc) {
        win.document = doc;
    }
    if (doc.defaultView !== win) {
        doc.defaultView = win;
    }
    const HTMLElement = doc.documentElement.constructor.prototype;
    if (typeof HTMLElement.getRootNode !== 'function') {
        const elm = doc.createElement('unknown-element');
        const HTMLUnknownElement = elm.constructor.prototype;
        HTMLUnknownElement.getRootNode = getRootNode;
    }
    if (typeof doc.createEvent === 'function') {
        const CustomEvent = doc.createEvent('CustomEvent').constructor;
        if (win.CustomEvent !== CustomEvent) {
            win.CustomEvent = CustomEvent;
        }
    }
    try {
        doc.baseURI;
    }
    catch (e) {
        Object.defineProperty(doc, 'baseURI', {
            get() {
                const baseElm = doc.querySelector('base[href]');
                if (baseElm) {
                    return new URL(baseElm.getAttribute('href'), win.location.href).href;
                }
                return win.location.href;
            },
        });
    }
    return win;
}
function getRootNode(opts) {
    const isComposed = opts != null && opts.composed === true;
    let node = this;
    while (node.parentNode != null) {
        node = node.parentNode;
        if (isComposed === true && node.parentNode == null && node.host != null) {
            node = node.host;
        }
    }
    return node;
}

const relocateMetaCharset = (doc) => {
    const head = doc.head;
    let charsetElm = head.querySelector('meta[charset]');
    if (charsetElm == null) {
        // doesn't have <meta charset>, so create it
        charsetElm = doc.createElement('meta');
        charsetElm.setAttribute('charset', 'utf-8');
    }
    else {
        // take the current one out of its existing location
        charsetElm.remove();
    }
    // ensure the <meta charset> is the first node in <head>
    head.insertBefore(charsetElm, head.firstChild);
};

const getUsedSelectors = (elm) => {
    const usedSelectors = {
        attrs: new Set(),
        classNames: new Set(),
        ids: new Set(),
        tags: new Set(),
    };
    collectUsedSelectors(usedSelectors, elm);
    return usedSelectors;
};
const collectUsedSelectors = (usedSelectors, elm) => {
    if (elm != null && elm.nodeType === 1) {
        // tags
        const children = elm.children;
        const tagName = elm.nodeName.toLowerCase();
        usedSelectors.tags.add(tagName);
        // attributes
        const attributes = elm.attributes;
        for (let i = 0, l = attributes.length; i < l; i++) {
            const attr = attributes.item(i);
            const attrName = attr.name.toLowerCase();
            usedSelectors.attrs.add(attrName);
            if (attrName === 'class') {
                // classes
                const classList = elm.classList;
                for (let i = 0, l = classList.length; i < l; i++) {
                    usedSelectors.classNames.add(classList.item(i));
                }
            }
            else if (attrName === 'id') {
                // ids
                usedSelectors.ids.add(attr.value);
            }
        }
        // drill down
        if (children) {
            for (let i = 0, l = children.length; i < l; i++) {
                collectUsedSelectors(usedSelectors, children[i]);
            }
        }
    }
};

const parseCss = (css, filePath) => {
    let lineno = 1;
    let column = 1;
    const diagnostics = [];
    const updatePosition = (str) => {
        const lines = str.match(/\n/g);
        if (lines)
            lineno += lines.length;
        const i = str.lastIndexOf('\n');
        column = ~i ? str.length - i : column + str.length;
    };
    const position = () => {
        const start = { line: lineno, column: column };
        return (node) => {
            node.position = new ParsePosition(start);
            whitespace();
            return node;
        };
    };
    const error = (msg) => {
        const srcLines = css.split('\n');
        const d = {
            level: 'error',
            type: 'css',
            language: 'css',
            header: 'CSS Parse',
            messageText: msg,
            absFilePath: filePath,
            lines: [
                {
                    lineIndex: lineno - 1,
                    lineNumber: lineno,
                    errorCharStart: column,
                    text: css[lineno - 1],
                },
            ],
        };
        if (lineno > 1) {
            const previousLine = {
                lineIndex: lineno - 1,
                lineNumber: lineno - 1,
                text: css[lineno - 2],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.unshift(previousLine);
        }
        if (lineno + 2 < srcLines.length) {
            const nextLine = {
                lineIndex: lineno,
                lineNumber: lineno + 1,
                text: srcLines[lineno],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.push(nextLine);
        }
        diagnostics.push(d);
        return null;
    };
    const stylesheet = () => {
        const rulesList = rules();
        return {
            type: 'stylesheet',
            stylesheet: {
                source: filePath,
                rules: rulesList,
            },
        };
    };
    const open = () => match(/^{\s*/);
    const close = () => match(/^}/);
    const match = (re) => {
        const m = re.exec(css);
        if (!m)
            return;
        const str = m[0];
        updatePosition(str);
        css = css.slice(str.length);
        return m;
    };
    const rules = () => {
        let node;
        const rules = [];
        whitespace();
        comments(rules);
        while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
            if (node !== false) {
                rules.push(node);
                comments(rules);
            }
        }
        return rules;
    };
    /**
     * Parse whitespace.
     */
    const whitespace = () => match(/^\s*/);
    const comments = (rules) => {
        let c;
        rules = rules || [];
        while ((c = comment())) {
            if (c !== false) {
                rules.push(c);
            }
        }
        return rules;
    };
    const comment = () => {
        const pos = position();
        if ('/' !== css.charAt(0) || '*' !== css.charAt(1))
            return null;
        let i = 2;
        while ('' !== css.charAt(i) && ('*' !== css.charAt(i) || '/' !== css.charAt(i + 1)))
            ++i;
        i += 2;
        if ('' === css.charAt(i - 1)) {
            return error('End of comment missing');
        }
        const comment = css.slice(2, i - 2);
        column += 2;
        updatePosition(comment);
        css = css.slice(i);
        column += 2;
        return pos({
            type: 'comment',
            comment,
        });
    };
    const selector = () => {
        const m = match(/^([^{]+)/);
        if (!m)
            return null;
        return trim(m[0])
            .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
            .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
            return m.replace(/,/g, '\u200C');
        })
            .split(/\s*(?![^(]*\)),\s*/)
            .map(function (s) {
            return s.replace(/\u200C/g, ',');
        });
    };
    const declaration = () => {
        const pos = position();
        // prop
        let prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!prop)
            return null;
        prop = trim(prop[0]);
        // :
        if (!match(/^:\s*/))
            return error(`property missing ':'`);
        // val
        const val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
        const ret = pos({
            type: 'declaration',
            property: prop.replace(commentre, ''),
            value: val ? trim(val[0]).replace(commentre, '') : '',
        });
        match(/^[;\s]*/);
        return ret;
    };
    const declarations = () => {
        const decls = [];
        if (!open())
            return error(`missing '{'`);
        comments(decls);
        // declarations
        let decl;
        while ((decl = declaration())) {
            if (decl !== false) {
                decls.push(decl);
                comments(decls);
            }
        }
        if (!close())
            return error(`missing '}'`);
        return decls;
    };
    const keyframe = () => {
        let m;
        const values = [];
        const pos = position();
        while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
            values.push(m[1]);
            match(/^,\s*/);
        }
        if (!values.length)
            return null;
        return pos({
            type: 'keyframe',
            values,
            declarations: declarations(),
        });
    };
    const atkeyframes = () => {
        const pos = position();
        let m = match(/^@([-\w]+)?keyframes\s*/);
        if (!m)
            return null;
        const vendor = m[1];
        // identifier
        m = match(/^([-\w]+)\s*/);
        if (!m)
            return error(`@keyframes missing name`);
        const name = m[1];
        if (!open())
            return error(`@keyframes missing '{'`);
        let frame;
        let frames = comments();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close())
            return error(`@keyframes missing '}'`);
        return pos({
            type: 'keyframes',
            name: name,
            vendor: vendor,
            keyframes: frames,
        });
    };
    const atsupports = () => {
        const pos = position();
        const m = match(/^@supports *([^{]+)/);
        if (!m)
            return null;
        const supports = trim(m[1]);
        if (!open())
            return error(`@supports missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@supports missing '}'`);
        return pos({
            type: 'supports',
            supports: supports,
            rules: style,
        });
    };
    const athost = () => {
        const pos = position();
        const m = match(/^@host\s*/);
        if (!m)
            return null;
        if (!open())
            return error(`@host missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@host missing '}'`);
        return pos({
            type: 'host',
            rules: style,
        });
    };
    const atmedia = () => {
        const pos = position();
        const m = match(/^@media *([^{]+)/);
        if (!m)
            return null;
        const media = trim(m[1]);
        if (!open())
            return error(`@media missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@media missing '}'`);
        return pos({
            type: 'media',
            media: media,
            rules: style,
        });
    };
    const atcustommedia = () => {
        const pos = position();
        const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (!m)
            return null;
        return pos({
            type: 'custom-media',
            name: trim(m[1]),
            media: trim(m[2]),
        });
    };
    const atpage = () => {
        const pos = position();
        const m = match(/^@page */);
        if (!m)
            return null;
        const sel = selector() || [];
        if (!open())
            return error(`@page missing '{'`);
        let decls = comments();
        let decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close())
            return error(`@page missing '}'`);
        return pos({
            type: 'page',
            selectors: sel,
            declarations: decls,
        });
    };
    const atdocument = () => {
        const pos = position();
        const m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m)
            return null;
        const vendor = trim(m[1]);
        const doc = trim(m[2]);
        if (!open())
            return error(`@document missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@document missing '}'`);
        return pos({
            type: 'document',
            document: doc,
            vendor: vendor,
            rules: style,
        });
    };
    const atfontface = () => {
        const pos = position();
        const m = match(/^@font-face\s*/);
        if (!m)
            return null;
        if (!open())
            return error(`@font-face missing '{'`);
        let decls = comments();
        let decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close())
            return error(`@font-face missing '}'`);
        return pos({
            type: 'font-face',
            declarations: decls,
        });
    };
    const _compileAtrule = (name) => {
        const re = new RegExp('^@' + name + '\\s*([^;]+);');
        return () => {
            const pos = position();
            const m = match(re);
            if (!m)
                return null;
            const ret = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
        };
    };
    const atimport = _compileAtrule('import');
    const atcharset = _compileAtrule('charset');
    const atnamespace = _compileAtrule('namespace');
    const atrule = () => {
        if (css[0] !== '@')
            return null;
        return atkeyframes() || atmedia() || atcustommedia() || atsupports() || atimport() || atcharset() || atnamespace() || atdocument() || atpage() || athost() || atfontface();
    };
    const rule = () => {
        const pos = position();
        const sel = selector();
        if (!sel)
            return error('selector missing');
        comments();
        return pos({
            type: 'rule',
            selectors: sel,
            declarations: declarations(),
        });
    };
    class ParsePosition {
        constructor(start) {
            this.start = start;
            this.end = { line: lineno, column: column };
            this.source = filePath;
        }
    }
    ParsePosition.prototype.content = css;
    return Object.assign({ diagnostics }, addParent(stylesheet()));
};
const trim = (str) => (str ? str.trim() : '');
/**
 * Adds non-enumerable parent node reference to each node.
 */
const addParent = (obj, parent) => {
    const isNode = obj && typeof obj.type === 'string';
    const childParent = isNode ? obj : parent;
    for (const k in obj) {
        const value = obj[k];
        if (Array.isArray(value)) {
            value.forEach(function (v) {
                addParent(v, childParent);
            });
        }
        else if (value && typeof value === 'object') {
            addParent(value, childParent);
        }
    }
    if (isNode) {
        Object.defineProperty(obj, 'parent', {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null,
        });
    }
    return obj;
};
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

const getCssSelectors = (sel) => {
    // reusing global SELECTORS since this is a synchronous operation
    SELECTORS.all.length = SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;
    sel = sel
        .replace(/\./g, ' .')
        .replace(/\#/g, ' #')
        .replace(/\[/g, ' [')
        .replace(/\>/g, ' > ')
        .replace(/\+/g, ' + ')
        .replace(/\~/g, ' ~ ')
        .replace(/\*/g, ' * ')
        .replace(/\:not\((.*?)\)/g, ' ');
    const items = sel.split(' ');
    for (let i = 0, l = items.length; i < l; i++) {
        items[i] = items[i].split(':')[0];
        if (items[i].length === 0)
            continue;
        if (items[i].charAt(0) === '.') {
            SELECTORS.classNames.push(items[i].substr(1));
        }
        else if (items[i].charAt(0) === '#') {
            SELECTORS.ids.push(items[i].substr(1));
        }
        else if (items[i].charAt(0) === '[') {
            items[i] = items[i]
                .substr(1)
                .split('=')[0]
                .split(']')[0]
                .trim();
            SELECTORS.attrs.push(items[i].toLowerCase());
        }
        else if (/[a-z]/g.test(items[i].charAt(0))) {
            SELECTORS.tags.push(items[i].toLowerCase());
        }
    }
    SELECTORS.classNames = SELECTORS.classNames.sort((a, b) => {
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    });
    return SELECTORS;
};
const SELECTORS = {
    all: [],
    tags: [],
    classNames: [],
    ids: [],
    attrs: [],
};

const serializeCss = (stylesheet, serializeOpts) => {
    const usedSelectors = serializeOpts.usedSelectors || null;
    const opts = {
        usedSelectors: usedSelectors || null,
        hasUsedAttrs: !!usedSelectors && usedSelectors.attrs.size > 0,
        hasUsedClassNames: !!usedSelectors && usedSelectors.classNames.size > 0,
        hasUsedIds: !!usedSelectors && usedSelectors.ids.size > 0,
        hasUsedTags: !!usedSelectors && usedSelectors.tags.size > 0,
    };
    const rules = stylesheet.rules;
    if (!rules) {
        return '';
    }
    const rulesLen = rules.length;
    const out = [];
    for (let i = 0; i < rulesLen; i++) {
        out.push(serializeCssVisitNode(opts, rules[i], i, rulesLen));
    }
    return out.join('');
};
const serializeCssVisitNode = (opts, node, index, len) => {
    const nodeType = node.type;
    if (nodeType === 'declaration') {
        return serializeCssDeclaration(node, index, len);
    }
    if (nodeType === 'rule') {
        return serializeCssRule(opts, node);
    }
    if (nodeType === 'comment') {
        if (node.comment[0] === '!') {
            return `/*${node.comment}*/`;
        }
        else {
            return '';
        }
    }
    if (nodeType === 'media') {
        return serializeCssMedia(opts, node);
    }
    if (nodeType === 'keyframes') {
        return serializeCssKeyframes(opts, node);
    }
    if (nodeType === 'keyframe') {
        return serializeCssKeyframe(opts, node);
    }
    if (nodeType === 'font-face') {
        return serializeCssFontFace(opts, node);
    }
    if (nodeType === 'supports') {
        return serializeCssSupports(opts, node);
    }
    if (nodeType === 'import') {
        return '@import ' + node.import + ';';
    }
    if (nodeType === 'charset') {
        return '@charset ' + node.charset + ';';
    }
    if (nodeType === 'page') {
        return serializeCssPage(opts, node);
    }
    if (nodeType === 'host') {
        return '@host{' + serializeCssMapVisit(opts, node.rules) + '}';
    }
    if (nodeType === 'custom-media') {
        return '@custom-media ' + node.name + ' ' + node.media + ';';
    }
    if (nodeType === 'document') {
        return serializeCssDocument(opts, node);
    }
    if (nodeType === 'namespace') {
        return '@namespace ' + node.namespace + ';';
    }
    return '';
};
const serializeCssRule = (opts, node) => {
    const decls = node.declarations;
    const usedSelectors = opts.usedSelectors;
    const selectors = node.selectors.slice();
    if (decls == null || decls.length === 0) {
        return '';
    }
    if (usedSelectors) {
        let i;
        let j;
        let include = true;
        for (i = selectors.length - 1; i >= 0; i--) {
            const sel = getCssSelectors(selectors[i]);
            include = true;
            // classes
            let jlen = sel.classNames.length;
            if (jlen > 0 && opts.hasUsedClassNames) {
                for (j = 0; j < jlen; j++) {
                    if (!usedSelectors.classNames.has(sel.classNames[j])) {
                        include = false;
                        break;
                    }
                }
            }
            // tags
            if (include && opts.hasUsedTags) {
                jlen = sel.tags.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.tags.has(sel.tags[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            // attrs
            if (include && opts.hasUsedAttrs) {
                jlen = sel.attrs.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.attrs.has(sel.attrs[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            // ids
            if (include && opts.hasUsedIds) {
                jlen = sel.ids.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.ids.has(sel.ids[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            if (!include) {
                selectors.splice(i, 1);
            }
        }
    }
    if (selectors.length === 0) {
        return '';
    }
    const cleanedSelectors = [];
    let cleanedSelector = '';
    for (const selector of node.selectors) {
        cleanedSelector = removeSelectorWhitespace(selector);
        if (!cleanedSelectors.includes(cleanedSelector)) {
            cleanedSelectors.push(cleanedSelector);
        }
    }
    return `${cleanedSelectors}{${serializeCssMapVisit(opts, decls)}}`;
};
const serializeCssDeclaration = (node, index, len) => {
    if (node.value === '') {
        return '';
    }
    if (len - 1 === index) {
        return node.property + ':' + node.value;
    }
    return node.property + ':' + node.value + ';';
};
const serializeCssMedia = (opts, node) => {
    const mediaCss = serializeCssMapVisit(opts, node.rules);
    if (mediaCss === '') {
        return '';
    }
    return '@media ' + removeMediaWhitespace(node.media) + '{' + mediaCss + '}';
};
const serializeCssKeyframes = (opts, node) => {
    const keyframesCss = serializeCssMapVisit(opts, node.keyframes);
    if (keyframesCss === '') {
        return '';
    }
    return '@' + (node.vendor || '') + 'keyframes ' + node.name + '{' + keyframesCss + '}';
};
const serializeCssKeyframe = (opts, node) => {
    return node.values.join(',') + '{' + serializeCssMapVisit(opts, node.declarations) + '}';
};
const serializeCssFontFace = (opts, node) => {
    const fontCss = serializeCssMapVisit(opts, node.declarations);
    if (fontCss === '') {
        return '';
    }
    return '@font-face{' + fontCss + '}';
};
const serializeCssSupports = (opts, node) => {
    const supportsCss = serializeCssMapVisit(opts, node.rules);
    if (supportsCss === '') {
        return '';
    }
    return '@supports ' + node.supports + '{' + supportsCss + '}';
};
const serializeCssPage = (opts, node) => {
    const sel = node.selectors.join(', ');
    return '@page ' + sel + '{' + serializeCssMapVisit(opts, node.declarations) + '}';
};
const serializeCssDocument = (opts, node) => {
    const documentCss = serializeCssMapVisit(opts, node.rules);
    const doc = '@' + (node.vendor || '') + 'document ' + node.document;
    if (documentCss === '') {
        return '';
    }
    return doc + '{' + documentCss + '}';
};
const serializeCssMapVisit = (opts, nodes) => {
    let rtn = '';
    if (nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            rtn += serializeCssVisitNode(opts, nodes[i], i, len);
        }
    }
    return rtn;
};
const removeSelectorWhitespace = (selector) => {
    let rtn = '';
    let char = '';
    let inAttr = false;
    selector = selector.trim();
    for (let i = 0, l = selector.length; i < l; i++) {
        char = selector[i];
        if (char === '[' && rtn[rtn.length - 1] !== '\\') {
            inAttr = true;
        }
        else if (char === ']' && rtn[rtn.length - 1] !== '\\') {
            inAttr = false;
        }
        if (!inAttr && CSS_WS_REG.test(char)) {
            if (CSS_NEXT_CHAR_REG.test(selector[i + 1])) {
                continue;
            }
            if (CSS_PREV_CHAR_REG.test(rtn[rtn.length - 1])) {
                continue;
            }
            rtn += ' ';
        }
        else {
            rtn += char;
        }
    }
    return rtn;
};
const removeMediaWhitespace = (media) => {
    let rtn = '';
    let char = '';
    media = media.trim();
    for (let i = 0, l = media.length; i < l; i++) {
        char = media[i];
        if (CSS_WS_REG.test(char)) {
            if (CSS_WS_REG.test(rtn[rtn.length - 1])) {
                continue;
            }
            rtn += ' ';
        }
        else {
            rtn += char;
        }
    }
    return rtn;
};
const CSS_WS_REG = /\s/;
const CSS_NEXT_CHAR_REG = /[>\(\)\~\,\+\s]/;
const CSS_PREV_CHAR_REG = /[>\(\~\,\+]/;

const removeUnusedStyles = (doc, diagnostics) => {
    try {
        const styleElms = doc.head.querySelectorAll(`style[data-styles]`);
        const styleLen = styleElms.length;
        if (styleLen > 0) {
            // pick out all of the selectors that are actually
            // being used in the html document
            const usedSelectors = getUsedSelectors(doc.documentElement);
            for (let i = 0; i < styleLen; i++) {
                removeUnusedStyleText(usedSelectors, diagnostics, styleElms[i]);
            }
        }
    }
    catch (e) {
        catchError(diagnostics, e);
    }
};
const removeUnusedStyleText = (usedSelectors, diagnostics, styleElm) => {
    try {
        // parse the css from being applied to the document
        const parseResults = parseCss(styleElm.innerHTML);
        diagnostics.push(...parseResults.diagnostics);
        if (hasError(diagnostics)) {
            return;
        }
        try {
            // convert the parsed css back into a string
            // but only keeping what was found in our active selectors
            styleElm.innerHTML = serializeCss(parseResults.stylesheet, {
                usedSelectors,
            });
        }
        catch (e) {
            diagnostics.push({
                level: 'warn',
                type: 'css',
                header: 'CSS Stringify',
                messageText: e,
            });
        }
    }
    catch (e) {
        diagnostics.push({
            level: 'warn',
            type: 'css',
            header: 'CSS Parse',
            messageText: e,
        });
    }
};

const updateCanonicalLink = (doc, href) => {
    // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
    // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />
    let canonicalLinkElm = doc.head.querySelector('link[rel="canonical"]');
    if (typeof href === 'string') {
        // have a valid href to add
        if (canonicalLinkElm == null) {
            // don't have a <link> element yet, create one
            canonicalLinkElm = doc.createElement('link');
            canonicalLinkElm.setAttribute('rel', 'canonical');
            doc.head.appendChild(canonicalLinkElm);
        }
        // set the href attribute
        canonicalLinkElm.setAttribute('href', href);
    }
    else {
        // don't have a href
        if (canonicalLinkElm != null) {
            // but there is a canonical link in the head so let's remove it
            const existingHref = canonicalLinkElm.getAttribute('href');
            if (!existingHref) {
                canonicalLinkElm.parentNode.removeChild(canonicalLinkElm);
            }
        }
    }
};

function renderToString(html, options) {
    const opts = normalizeHydrateOptions(options);
    opts.serializeToHtml = true;
    return new Promise(resolve => {
        const results = generateHydrateResults(opts);
        if (hasError(results.diagnostics)) {
            resolve(results);
        }
        else if (typeof html === 'string') {
            try {
                opts.destroyWindow = true;
                opts.destroyDocument = true;
                const win = new MockWindow(html);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else if (isValidDocument(html)) {
            try {
                opts.destroyDocument = false;
                const win = patchDomImplementation(html, opts);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else {
            renderBuildError(results, `Invalid html or document. Must be either a valid "html" string, or DOM "document".`);
            resolve(results);
        }
    });
}
function hydrateDocument(doc, options) {
    const opts = normalizeHydrateOptions(options);
    opts.serializeToHtml = false;
    return new Promise(resolve => {
        const results = generateHydrateResults(opts);
        if (hasError(results.diagnostics)) {
            resolve(results);
        }
        else if (typeof doc === 'string') {
            try {
                opts.destroyWindow = true;
                opts.destroyDocument = true;
                const win = new MockWindow(doc);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else if (isValidDocument(doc)) {
            try {
                opts.destroyDocument = false;
                const win = patchDomImplementation(doc, opts);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else {
            renderBuildError(results, `Invalid html or document. Must be either a valid "html" string, or DOM "document".`);
            resolve(results);
        }
    });
}
function render(win, opts, results, resolve) {
    if (!process.__stencilErrors) {
        process.__stencilErrors = true;
        process.on('unhandledRejection', e => {
            console.log('unhandledRejection', e);
        });
    }
    initializeWindow(win, opts, results);
    if (typeof opts.beforeHydrate === 'function') {
        try {
            const rtn = opts.beforeHydrate(win.document);
            if (isPromise(rtn)) {
                rtn.then(() => {
                    hydrateFactory(win, opts, results, afterHydrate, resolve);
                });
            }
            else {
                hydrateFactory(win, opts, results, afterHydrate, resolve);
            }
        }
        catch (e) {
            renderCatchError(results, e);
            finalizeHydrate(win, win.document, opts, results, resolve);
        }
    }
    else {
        hydrateFactory(win, opts, results, afterHydrate, resolve);
    }
}
function afterHydrate(win, opts, results, resolve) {
    if (typeof opts.afterHydrate === 'function') {
        try {
            const rtn = opts.afterHydrate(win.document);
            if (isPromise(rtn)) {
                rtn.then(() => {
                    finalizeHydrate(win, win.document, opts, results, resolve);
                });
            }
            else {
                finalizeHydrate(win, win.document, opts, results, resolve);
            }
        }
        catch (e) {
            renderCatchError(results, e);
            finalizeHydrate(win, win.document, opts, results, resolve);
        }
    }
    else {
        finalizeHydrate(win, win.document, opts, results, resolve);
    }
}
function finalizeHydrate(win, doc, opts, results, resolve) {
    try {
        inspectElement(results, doc.documentElement, 0);
        if (opts.removeUnusedStyles !== false) {
            try {
                removeUnusedStyles(doc, results.diagnostics);
            }
            catch (e) {
                renderCatchError(results, e);
            }
        }
        if (typeof opts.title === 'string') {
            try {
                doc.title = opts.title;
            }
            catch (e) {
                renderCatchError(results, e);
            }
        }
        results.title = doc.title;
        if (opts.removeScripts) {
            removeScripts(doc.documentElement);
        }
        try {
            updateCanonicalLink(doc, opts.canonicalUrl);
        }
        catch (e) {
            renderCatchError(results, e);
        }
        try {
            relocateMetaCharset(doc);
        }
        catch (e) { }
        if (!hasError(results.diagnostics)) {
            results.httpStatus = 200;
        }
        try {
            const metaStatus = doc.head.querySelector('meta[http-equiv="status"]');
            if (metaStatus != null) {
                const metaStatusContent = metaStatus.getAttribute('content');
                if (metaStatusContent && metaStatusContent.length > 0) {
                    results.httpStatus = parseInt(metaStatusContent, 10);
                }
            }
        }
        catch (e) { }
        if (opts.clientHydrateAnnotations) {
            doc.documentElement.classList.add('hydrated');
        }
        if (opts.serializeToHtml) {
            results.html = serializeDocumentToString(doc, opts);
        }
    }
    catch (e) {
        renderCatchError(results, e);
    }
    if (opts.destroyWindow) {
        try {
            if (!opts.destroyDocument) {
                win.document = null;
                doc.defaultView = null;
            }
            win.close();
        }
        catch (e) {
            renderCatchError(results, e);
        }
    }
    resolve(results);
}
function serializeDocumentToString(doc, opts) {
    return serializeNodeToHtml(doc, {
        approximateLineWidth: opts.approximateLineWidth,
        outerHtml: false,
        prettyHtml: opts.prettyHtml,
        removeAttributeQuotes: opts.removeAttributeQuotes,
        removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
        removeEmptyAttributes: opts.removeEmptyAttributes,
        removeHtmlComments: opts.removeHtmlComments,
        serializeShadowRoot: false,
    });
}
function isValidDocument(doc) {
    return doc != null && doc.nodeType === 9 && doc.documentElement != null && doc.documentElement.nodeType === 1 && doc.body != null && doc.body.nodeType === 1;
}
function removeScripts(elm) {
    const children = elm.children;
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        removeScripts(child);
        if (child.nodeName === 'SCRIPT' || (child.nodeName === 'LINK' && child.getAttribute('rel') === 'modulepreload')) {
            child.remove();
        }
    }
}

exports.createWindowFromHtml = createWindowFromHtml;
exports.hydrateDocument = hydrateDocument;
exports.renderToString = renderToString;
exports.serializeDocumentToString = serializeDocumentToString;
