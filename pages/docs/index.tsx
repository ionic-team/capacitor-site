import { GetStaticProps } from 'next';
import { join } from 'path';
import { getDocsData } from '../../src/pages/docs/data';

import DocsPage from '../../src/pages/docs/Docs';

const docsDir = join('docs', 'v3');

const Docs = (props) => <DocsPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await getDocsData(docsDir);
  console.log('Got docs data', JSON.stringify(data, null, 2));

  return {
    props: {
      data,
    },
  };
};

export default Docs;
