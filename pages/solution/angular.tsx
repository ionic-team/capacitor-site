import { GetStaticProps } from 'next';
import SolutionPage from '../../src/pages/solution/Solution';
import { getPage } from '../../src/prismic';

const Angular = (props) => <SolutionPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const announcementBarData = await getPage('announcement_bar');

  return {
    props: {
      solutionId: 'angular',
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Angular;
