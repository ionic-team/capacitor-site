import type { ChildNode } from '@stencil/core';
export declare const hasAttributes: ({ vattrs }: ChildNode, requiredAttrs?: string[]) => boolean;
export declare const isTextNode: ({ vtext }: ChildNode) => boolean;
export declare const isElement: (val: any) => boolean;
export declare const isElementArray: (val: any) => boolean;
