import type { MapParamData } from '../stencil-router-v2';
import {
  getPageNavigation,
  parseMarkdown,
  parseTableOfContents,
  PageNavigation,
  MarkdownResults,
  TableOfContents,
} from '@stencil/ssg/parse';
import { join } from 'path';
import { getGithubData } from './github';

const repoRootDir = join(__dirname, '..', '..');
const pagesDir = join(repoRootDir, 'pages');
const docsDir = join(pagesDir, 'docs');

export interface DocsData extends MarkdownResults {
  contributors?: string[];
  lastUpdated?: string;
  navigation?: PageNavigation;
  repoFileUrl?: string;
  tableOfContents?: TableOfContents;
  template?: DocsTemplate;
}

export type DocsTemplate = 'guide' | 'plugins' | 'reference';

export const getDocsDataV2: MapParamData = async ({ id }) => {
  if (!id) {
    id = 'index.md';
  }

  const results: DocsData = await parseMarkdown(join(docsDir, id), {
    headingAnchors: true,
    beforeHtmlSerialize(frag: DocumentFragment) {
      const headings = frag.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = frag.querySelectorAll('p:not(:first-of-type)');
      const introParagraphs = frag.querySelectorAll('p:first-of-type');

      headings.forEach(heading => {
        const level = heading.nodeName?.split('')[1];

        heading.classList.add(`ui-heading`);
        heading.classList.add(`ui-heading-${level}`);
        heading.classList.add(`ui-theme--editorial`);
      });

      paragraphs.forEach(paragraph => {
        paragraph.classList.add(`ui-paragraph`);
        paragraph.classList.add(`ui-paragraph--prose`);
        paragraph.classList.add(`ui-paragraph-3`);    
      });

      introParagraphs.forEach(paragraph => {
        paragraph.classList.add(`ui-paragraph`);
        paragraph.classList.add(`ui-paragraph--prose`);
        paragraph.classList.add(`ui-paragraph-2`);    
      });
    }
  });

  results.template = getTemplateFromPath(results.filePath);

  results.tableOfContents = await getTableOfContents(results.template);

  results.navigation = await getPageNavigation(pagesDir, results.filePath, {
    tableOfContents: results.tableOfContents,
  });

  const githubData = await getGithubData(repoRootDir, results.filePath);

  results.lastUpdated = githubData.lastUpdated;
  results.repoFileUrl = githubData.repoFileUrl;

  results.contributors = [];
  if (Array.isArray(githubData.contributors)) {
    results.contributors.push(...githubData.contributors);
  }
  if (Array.isArray(results.attributes?.contributors)) {
    results.contributors.push(...results.attributes.contributors);
  }
  results.contributors = Array.from(new Set(results.contributors));

  return results;
};

const cachedToc = new Map<string, TableOfContents>();

const getTableOfContents = async (template: DocsTemplate) => {
  let toc = cachedToc.get(template);
  if (!toc) {
    let tocPath: string;
    if (template === 'reference' || template === 'plugins') {
      tocPath = join(docsDir, template, 'README.md');
    } else {
      tocPath = join(docsDir, 'README.md');
    }
    toc = await parseTableOfContents(tocPath, pagesDir);
    cachedToc.set(template, toc);
  }
  return toc;
};

const getTemplateFromPath = (path: string): DocsTemplate => {

  const isDevServer = globalThis.location.origin.includes('https://');

  if (!isDevServer) {
    const path = globalThis.location.href;

    if (path.includes('/plugins') || path.includes('/apis')) {
      return 'plugins';
    }
    if (path.includes('/reference')) {
      return 'reference';
    }
  }

  if (typeof path === 'string') {
    if (path.includes('/plugins') || path.includes('/apis')) {
      return 'plugins';
    }
    if (path.includes('/reference')) {
      return 'reference';
    }
  }
  return 'guide';
};
