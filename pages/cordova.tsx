import { GetStaticProps } from 'next';
import CordovaPage from '../src/pages/cordova/Cordova';
import { getPage } from '../src/prismic';

const Cordova = (props) => <CordovaPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const announcementBarData = await getPage('announcement_bar');

  return {
    props: {
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Cordova;
