import RenderTypes from './render';
import { shouldApplyToHead, applyToHead } from './dom';
const headExists = document && document.head;
const validTagNames = Object.keys(RenderTypes);
const isValidNode = (node) => validTagNames.indexOf(node.vtag) > -1;
const renderNode = (node, utils) => RenderTypes[node.vtag](node, document.head, utils);
export const Helmet = (_props, children, utils) => {
    console.log("HELMET2");
    console.trace();
    // eval('debugger');
    if (!headExists) {
        return null;
    }
    const rendered = [];
    const validChildren = [];
    utils.forEach(children, (n) => {
        if (isValidNode(n)) {
            validChildren.push(n);
            rendered.push(renderNode(n, utils));
        }
    });
    console.log('RENDERING NODES', rendered, rendered.filter(shouldApplyToHead));
    // Build an HTMLElement for each provided virtual child
    rendered
        .filter(shouldApplyToHead)
        .forEach(applyToHead);
    return null;
};
export default Helmet;
