import { GetStaticProps } from 'next';
import TelemetryPage from '../src/pages/telemetry/Telemetry';
import { getPage } from '../src/prismic';

const Telemetry = (props) => <TelemetryPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const announcementBarData = await getPage('announcement_bar');

  return {
    props: {
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Telemetry;
