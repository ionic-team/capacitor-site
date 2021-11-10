import IndexPage from "../src/pages/index";

import { GetStaticProps } from "next";
import { getPage } from "../src/prismic";

const Index = (props) => <IndexPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const pageData = await getPage("capacitor_homepage");
  const whitepaperAd = await getPage("capacitor_whitepaper_ad");
  const announcementData = await getPage("capacitor_homepage_announcement");
  const announcementBarData = await getPage("announcement_bar");

  return {
    props: {
      ...pageData.data,
      whitepaper_ad: whitepaperAd.data,
      announcement: announcementData.data,
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Index;
