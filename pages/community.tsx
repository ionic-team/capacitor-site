import { GetStaticProps } from "next";
import CommunityPage from "../src/pages/community/Community";
import { getPage } from "../src/prismic";

const Community = (props) => <CommunityPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const pageData = await getPage("capacitor_community");
  const announcementBarData = await getPage("announcement_bar");

  return {
    props: {
      ...pageData.data,
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Community;
