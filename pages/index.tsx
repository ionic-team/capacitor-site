import IndexPage from "../src/components/pages";

import { GetStaticProps } from "next";
import { getPage } from "../src/prismic";

const Index = (props) => <IndexPage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const pageData = await getPage("capacitor_homepage");
  const whitepaperAd = await getPage("capacitor_whitepaper_ad");
  const announcementData = await getPage("capacitor_homepage_announcement");

  console.log("Loaded data", pageData);

  return {
    props: {
      ...pageData.data,
      whitepaper_ad: whitepaperAd.data,
      announcement: announcementData.data,
    },
  };
};

export default Index;
