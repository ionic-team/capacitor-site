import { PrerenderConfig } from '@stencil/core';

export const config: PrerenderConfig = {
  hydrateOptions() {
    return {
      timeout: 30000,
    };
  },
  filterUrl(url) {
    if (url.pathname === '/docs/pwa-elements' || url.pathname === '/docs/v3/pwa-elements' || url.pathname === '/docs/v2/pwa-elements') {
      // gets a redirect in prod  
      return false;
    }
    return true;
  },
  entryUrls: [
    '/',

    // v3 docs not crawlable for now, manually add it as an entry url
    '/docs/v3'
  ]
};
