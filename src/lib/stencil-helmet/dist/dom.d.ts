import type { ChildNode, FunctionalUtilities } from '@stencil/core';
export declare const createElement: ({ vtag, vattrs, vchildren, vtext }: ChildNode, utils: FunctionalUtilities) => HTMLElement | Text;
export declare const shouldApplyToHead: (val: any) => boolean;
export declare const applyToHead: (element: HTMLElement | HTMLElement[]) => HTMLElement;
