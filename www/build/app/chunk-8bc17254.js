const h = window.App.h;

import { a as createProviderConsumer } from './chunk-8e0d955e.js';

var SiteProviderConsumer = createProviderConsumer({
    isLeftSidebarIn: false,
    toggleLeftSidebar: () => { }
}, (subscribe, child) => h("context-consumer", { subscribe: subscribe, renderer: child }));

export { SiteProviderConsumer as a };
