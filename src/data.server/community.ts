import { MapParamData } from '@stencil/router';
import {
  getPageNavigation,
  MarkdownResults,
  PageNavigation,
  parseMarkdown,
  TableOfContents,
} from '@stencil/ssg/parse';
import { join } from 'path';
import { hookUpDesignSystem } from './blog';
import { DocsTemplate } from './docs';
import { getGithubData } from './github';


const repoRootDir = join(__dirname, '..', '..');
const pagesDir = join(repoRootDir, 'pages');
const docsDir = join(pagesDir, 'community');


export interface CommunityData extends MarkdownResults {
  contributors?: string[];
  lastUpdated?: string;
  navigation?: PageNavigation;
  editUrl?: string;
  tableOfContents?: TableOfContents;
  template?: DocsTemplate;
  pluginName?: string;
  platforms?: string[];
  npmPackage?: string;
}

export const getCommunityData: MapParamData = async ({ id }) => {
  if (!id) {
    id = 'index.md';
  }

  const results: CommunityData = await parseMarkdown(join(docsDir, id), {
    headingAnchors: true,
    beforeHtmlSerialize(frag: DocumentFragment) {
      hookUpDesignSystem(frag);
    },
  });

  results.pluginName = results.title;
  results.template = 'community';

  results.navigation = await getPageNavigation(pagesDir, results.filePath, {
    tableOfContents: results.tableOfContents,
  });

  const githubData = await getGithubData(repoRootDir, results.filePath);

  results.lastUpdated = githubData.lastUpdated;
  results.editUrl = githubData.repoFileUrl;

  results.contributors = [];
  if (Array.isArray(githubData.contributors)) {
    results.contributors.push(...githubData.contributors);
  }
  if (Array.isArray(results.attributes?.contributors)) {
    results.contributors.push(...results.attributes.contributors);
  }
  results.contributors = Array.from(new Set(results.contributors));

  results.platforms = [];
  if (Array.isArray(results.attributes?.platforms)) {
    results.platforms.push(...results.attributes.platforms);
  }

  return results;
};

