import type { MapParamData } from '@stencil/router';
import fs from 'fs';
import { join } from 'path';
import { parseMarkdown, MarkdownResults, JsxAstNode } from '@stencil/ssg/parse';

const repoRootDir = join(__dirname, '..', '..');
const blogDir = join(repoRootDir, 'pages', 'blog');

export interface BlogData extends MarkdownResults {
  authorName?: string;
  authorEmail?: string;
  authorUrl?: string;
  authorImageName?: string;
  authorDescription?: string;
  description?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  date?: string;
  preview?: boolean;
}

export const getAllBlogData: MapParamData = async () => {
  const results: BlogData[] = [];

  const fileNames = fs.readdirSync(blogDir);

  await Promise.all(
    fileNames.map(async file => {
      const fileName = file.split('.')[0];
      const page = await getFormattedData(fileName, true);

      results.push(page);
    }),
  );

  results.sort((a: BlogData, b: BlogData) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  return results;
};

export const getBlogData: MapParamData = async ({ slug }) => {
  return getFormattedData(slug);
};

const getFormattedData = async (slug: string, preview = false) => {
  const opts = getParseOpts(preview);
  const blogPath = join(blogDir, slug);
  let results: BlogData = await parseMarkdown(blogPath, opts);

  const authorString = results.attributes.author;
  const emailIndex = authorString.indexOf('<');
  results.authorName = authorString.slice(0, emailIndex).trim();
  results.authorEmail = authorString
    .slice(emailIndex + 1, authorString.indexOf('>'))
    .trim();
  results.authorUrl = results.attributes.authorUrl;
  results.authorImageName = results.attributes.authorImageName;
  results.authorDescription = results.attributes.authorDescription;

  results.date = new Date(results.attributes.date).toISOString();

  results.featuredImage = results.attributes.featuredImage;
  results.featuredImageAlt = results.attributes.featuredImageAlt;

  results.preview = hasPreviewMarker(results.ast);

  results = updateAnchors(results, slug);

  return results;
};

const updateAnchors = (results: BlogData, slug: string) => {
  let { ast, anchors } = results;
  ast = ast.map((node: JsxAstNode) => updateAnchorJsx(node, slug));

  anchors = anchors.map(({ text, href }) => {
    if (!href) return;

    return {
      text,
      href: href.replace('$POST', `/blog/${slug}`),
    };
  });

  return results;
};

const updateAnchorJsx = (node: JsxAstNode, slug: string) => {
  if (!node) return;

  if (node[0] === 'a') {
    const props = node[1];

    if (props.hasOwnProperty('href') && props.href.includes('$POST')) {
      props.href = props.href.replace('$POST', `/blog/${slug}`);
    }

    return node;
  }

  if (Array.isArray(node) && node.length > 0) {
    return node.map((node: JsxAstNode) => updateAnchorJsx(node, slug));
  }

  return node;
};

const hasPreviewMarker = (ast: JsxAstNode[]) => {
  const hasPreview = ast.find(item => item[0] === 'preview-end');

  return !!hasPreview;
};

const getParseOpts = (preview: boolean) => {
  if (preview) {
    return {
      async beforeHtmlSerialize(frag: DocumentFragment) {
        if (frag.querySelector('preview-end')) {
          const notInPreview = frag.querySelectorAll('preview-end ~ *');

          notInPreview.forEach(el => el.remove());
        }
      },
    };
  }
};
