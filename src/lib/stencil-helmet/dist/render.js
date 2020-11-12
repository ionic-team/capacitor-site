import { hasAttributes, isTextNode } from './util';
import { createElement } from './dom';
const hasChildren = (node) => Array.isArray(node.vchildren);
const getFirstChild = (vchildren, utils) => {
    let firstChild = null;
    utils.forEach(vchildren || [], (c, i) => {
        if (i === 0) {
            firstChild = c;
            return;
        }
    });
    return firstChild;
};
function title(node, head, utils) {
    const firstChild = getFirstChild(node.vchildren || [], utils);
    if (firstChild && isTextNode(firstChild)) {
        return [createElement(node, utils), head.querySelector('title')];
    }
}
function meta(node, head, utils) {
    var _a, _b, _c;
    const namePropKey = ((_a = node.vattrs) === null || _a === void 0 ? void 0 : _a.property) ? 'property' : 'name';
    const namePropValue = ((_b = node.vattrs) === null || _b === void 0 ? void 0 : _b.property) || ((_c = node.vattrs) === null || _c === void 0 ? void 0 : _c.name);
    const existingElement = head.querySelector(`meta[${namePropKey}="${namePropValue}"]`);
    if (existingElement !== null) {
        return [createElement(node, utils), existingElement];
    }
    else {
        return createElement(node, utils);
    }
}
function link(node, _head, utils) {
    if (!hasChildren(node)) {
        return createElement(node, utils);
    }
}
function style(node, _head, utils) {
    const firstChild = getFirstChild(node.vchildren || [], utils);
    if (firstChild && isTextNode(firstChild)) {
        return createElement(node, utils);
    }
}
function script(node, _head, utils) {
    if (hasChildren(node) || hasAttributes(node)) {
        return createElement(node, utils);
    }
}
function base(node, _head, utils) {
    if (!hasChildren(node) && hasAttributes(node)) {
        return createElement(node, utils);
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
export default types;
