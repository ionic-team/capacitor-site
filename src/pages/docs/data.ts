import { join } from 'path';

import { getGithubData } from '../../github';
import { hookUpDesignSystem } from '../../markdown/hookup-design-system';
import { parseMarkdown } from '../../markdown/parse-markdown';
import { getPageNavigation } from '../../markdown/parse-page-navigation';
import { parseTableOfContents } from '../../markdown/parse-table-of-contents';
import { MarkdownResults, PageNavigation, TableOfContents } from '../../markdown/types';
import { getPage } from '../../prismic';

export interface DocsData extends MarkdownResults {
  contributors?: string[];
  lastUpdated?: string;
  navigation?: PageNavigation;
  editUrl?: string;
  editApiUrl?: string;
  tableOfContents?: TableOfContents;
  template?: DocsTemplate;
  announcement_bar?: any;
  canonicalUrl?: string;
}

export type DocsTemplate = 'docs' | 'plugins' | 'cli';

const repoRootDir = join(__dirname, '..', '..', '..');

export const getDocsData = async (docsDir?: string, id?: string) => {
  if (!id) {
    id = 'index.md';
  }

  const results: DocsData = await parseMarkdown(join(docsDir, id), {
    headingAnchors: true,
    beforeHtmlSerialize(frag: DocumentFragment) {
      hookUpDesignSystem(frag);
    },
  });

  results.template = getTemplateFromPath(results.filePath);

  results.tableOfContents = await getTableOfContents(docsDir, results.template);

  results.navigation = await getPageNavigation(docsDir, results.filePath, {
    tableOfContents: results.tableOfContents,
  });

  const githubData = await getGithubData(repoRootDir, results.filePath);

  results.lastUpdated = githubData.lastUpdated;
  results.editUrl = githubData.repoFileUrl;

  if (results.attributes?.editUrl) {
    results.editUrl = results.attributes.editUrl;
  }

  if (results.attributes?.editApiUrl) {
    results.editApiUrl = results.attributes.editApiUrl;
  }

  results.contributors = [];
  if (Array.isArray(githubData.contributors)) {
    results.contributors.push(...githubData.contributors);
  }
  if (Array.isArray(results.attributes?.contributors)) {
    results.contributors.push(...results.attributes.contributors);
  }
  results.contributors = Array.from(new Set(results.contributors));

  results.announcement_bar = await getPage('announcement_bar');
  results.canonicalUrl = results.attributes.canonicalUrl || null;

  return results;
};

const cachedToc = new Map<string, TableOfContents>();

const getTableOfContents = async (docsDir: string, template: DocsTemplate) => {
  let toc = cachedToc.get(template);
  if (!toc) {
    let tocPath: string;
    if (template === 'cli' || template === 'plugins') {
      tocPath = join(docsDir, template, 'README.md');
    } else {
      tocPath = join(docsDir, 'README.md');
    }
    toc = await parseTableOfContents(tocPath, docsDir);
    // strip out the /v3 from the urls
    toc.root.forEach((root) => root.children.forEach((child) => (child.url = child.url.replace('/v3', ''))));
    cachedToc.set(template, toc);
  }
  return toc;
};

const getTemplateFromPath = (path: string): DocsTemplate => {
  // For when I'm testing on my windows boot -Jared
  // const isDev = !globalThis.location.origin.includes('https://');

  // if (isDev) {
  //   const path = globalThis.location.href;

  //   if (path.includes('/plugins') || path.includes('/apis')) {
  //     return 'plugins';
  //   }
  //   if (path.includes('/cli')) {
  //     return 'cli';
  //   }
  // }

  if (typeof path === 'string') {
    if (path.includes('/plugins') || path.includes('/apis')) {
      return 'plugins';
    }
    if (path.includes('/cli')) {
      return 'cli';
    }
  }
  return 'docs';
};
