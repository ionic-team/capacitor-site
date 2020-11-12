import { isElement, isElementArray } from './util';
export const createElement = ({ vtag, vattrs, vchildren, vtext }, utils) => {
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
        utils.forEach(vchildren, (child) => {
            element.appendChild(createElement(child, utils));
        });
    }
    return element;
};
export const shouldApplyToHead = (val) => isElement(val) || (isElementArray(val) && val.length === 2);
export const applyToHead = (element) => {
    if (Array.isArray(element)) {
        return document.head.replaceChild(element[0], element[1]);
    }
    return document.head.appendChild(element);
};
