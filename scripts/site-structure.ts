import remark from 'remark';
import { promisify } from 'util';
import fs from 'fs';
import path, { dirname, basename } from 'path';
import frontMatter from 'front-matter';
import { generateSiteStructure } from './markdown-renderer';
import { DOCS_FILES } from './common';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async function() {
  for (var i = 0; i < DOCS_FILES.length; i++) {
    const SOURCE_FILE = DOCS_FILES[i].readme;
    const DESTINATION_FILE = DOCS_FILES[i].structure;
    const ASSET_DIR = DOCS_FILES[i].assets;

    const markdownContents = await readFile(SOURCE_FILE, { encoding: 'utf8' });

    const lexer = remark();
    const nodes: any = lexer.parse(markdownContents);
    const metadataList = generateSiteStructure(nodes);

    await walkUpdateChildren(metadataList, SOURCE_FILE, ASSET_DIR);
    await writeFile(DESTINATION_FILE, JSON.stringify(metadataList, null, 2), {
      encoding: 'utf8'
    });
  }

})();

async function walkUpdateChildren(itemList, sourcePath, assetsPath) {
  for (const item of itemList) {
    if (item.filePath && item.filePath.indexOf('//') === -1) {
      const fullPath = path.join(path.dirname(sourcePath), item.filePath);
      const url = await getMarkdownFileSitePath(fullPath);
      const jsonPath = path.join(
        assetsPath,
        dirname(item.filePath),
        basename(item.filePath, '.md') + '.json'
      )

      item.url = url;
      item.filePath = jsonPath;
    }
    if (item.children) {
      await walkUpdateChildren(item.children, sourcePath, assetsPath);
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