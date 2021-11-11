import { lstat, readdir } from 'fs';
import { GetStaticProps } from 'next';
import { basename, join, sep } from 'path';
import glob from 'glob';
import { getDocsData } from '../../src/pages/docs/data';

import DocsPage from '../../src/pages/docs/Docs';
import { getPage } from '../../src/prismic';

const repoRootDir = join(__dirname, '..', '..', '..', '..');
const pagesDir = join(repoRootDir, 'content');
const docsDir = join(pagesDir, 'docs', 'v3');
//const docsDir = join('docs', 'v3');

const Docs = (props) => <DocsPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const id = (context.params.id as string[]).join('/');
  const data = await getDocsData(pagesDir, docsDir, id as string);
  const announcementBarData = await getPage('announcement_bar');

  return {
    props: {
      data,
      announcement_bar: announcementBarData.data,
    },
  };
};

export async function getStaticPaths() {
  const paths = await getPaths();
  console.log('Got paths', paths[0]);
  return {
    paths,
    fallback: true,
  };
}

async function getPaths() {
  const data = await getDocsData(pagesDir, docsDir);

  return new Promise((resolve, reject) => {
    glob('content/docs/v3/**/*.md', (err, res) => {
      const paths = [];

      for (const file of res) {
        let id = file.replace('content/docs/v3/', '').replace('.md', '');

        const base = basename(id);
        if (base === 'README') {
          continue;
        }
        if (base === 'index') {
          id = id.replace('index', '');
        }
        console.log(id);

        const parts = id.split(sep);

        paths.push({ params: { id: parts } });
      }

      resolve(paths);
    });
  });
}

export default Docs;
