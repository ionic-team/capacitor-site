import { GetStaticProps } from 'next';
import { join } from 'path';
import { getDocsData } from '../../src/pages/docs/data';

import DocsPage from '../../src/pages/docs/Docs';
import { getPage } from '../../src/prismic';

const docsDir = join('docs', 'v3');

const Docs = (props) => <DocsPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await getDocsData(docsDir, context.params.id as string);
  const announcementBarData = await getPage('announcement_bar');

  return {
    props: {
      data,
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Docs;
