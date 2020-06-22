import remark from 'remark';
import { promisify } from 'util';
import fs from 'fs';
import path, { dirname, basename } from 'path';
import frontMatter from 'front-matter';
import { generateSiteStructure } from './markdown-renderer';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DESTINATION_FILE = './src/assets/docs-structure.json';
const SOURCE_FILE = './docs-md/README.md';
const ASSETS_DIR = '/assets/docs-content';

(async function() {
  const markdownContents = await readFile(SOURCE_FILE, { encoding: 'utf8' });

  const lexer = remark();
  const nodes: any = lexer.parse(markdownContents);
  const metadataList = generateSiteStructure(nodes);

  await walkUpdateChildren(metadataList, SOURCE_FILE);
  await writeFile(DESTINATION_FILE, JSON.stringify(metadataList, null, 2), {
    encoding: 'utf8'
  });
})();

async function walkUpdateChildren(itemList, sourcePath) {
  for (const item of itemList) {
    if (item.filePath && item.filePath.indexOf('//') === -1) {
      const fullPath = path.join(path.dirname(sourcePath), item.filePath);
      const url = await getMarkdownFileSitePath(fullPath);
      const jsonPath = path.join(
        ASSETS_DIR,
        dirname(item.filePath),
        basename(item.filePath, '.md') + '.json'
      )

      item.url = url;
      item.filePath = jsonPath;
    }
    if (item.children) {
      await walkUpdateChildren(item.children, sourcePath);
    }
  }
}

async function getMarkdownFileSitePath(filePath) {
  let markdownContents: any;
  try {
    markdownContents = await readFile(filePath, { encoding: 'utf8' });
  } catch (e) {
    return null;
  }

  if (!markdownContents) {
    return null;
  }
  const metadata: any = frontMatter(markdownContents);

  return (metadata && metadata.attributes ? metadata.attributes.url : null);
}