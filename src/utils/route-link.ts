import Router from '../router';
import { SiteStructureItem } from '../global/definitions';

import guideStructure from '../assets/guide-structure.json';
import referenceStructure from '../assets/reference-structure.json';

export const handleRoutableLinkClick = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey) {
    return;
  }

  if (e && (e.which == 2 || e.button == 4)) {
    return;
  }

  if ((e.target as HTMLElement).tagName === 'A') {
    const href = (e.target as HTMLAnchorElement).href;
    const u = new URL(href);
    if (u.origin === window.location.origin) {
      e.stopPropagation();
      e.preventDefault();
      Router.push(u.pathname);
    }
  }
}

export const getTemplateFromPath = (path: string): 'guide' | 'reference' => {
  const re = /^\/docs\/([^\/]+).*/;
  const m = re.exec(path);

  if (m) {
    const p = m[1];

    if (['apis', 'reference'].includes(p)) {
      return 'reference';
    }
  }

  return 'guide';
}

export const getSiteStructureList = (path: string): SiteStructureItem[] => {
  const template = getTemplateFromPath(path);

  return template === 'reference' ? referenceStructure : guideStructure;
}