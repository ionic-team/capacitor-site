import { GetStaticProps } from 'next';
import { join } from 'path';
import { getDocsData } from '../../../src/pages/docs/data';

import DocsPage from '../../../src/pages/docs/Docs';
import { getPage } from '../../../src/prismic';

const repoRootDir = join(__dirname, '..', '..', '..', '..');
const pagesDir = join(repoRootDir, 'content');
const docsDir = join(pagesDir, 'docs', 'v2');
//const docsDir = join('docs', 'v3');

const Docs = (props) => <DocsPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await getDocsData(pagesDir, docsDir);
  const announcementBarData = await getPage('announcement_bar');

  return {
    props: {
      data,
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Docs;
