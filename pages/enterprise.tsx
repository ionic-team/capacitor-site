import { GetStaticProps } from "next";
import EnterprisePage from "../src/pages/enterprise/Enterprise";
import { getPage } from "../src/prismic";

const Enterprise = (props) => <EnterprisePage {...props} />;

export const getStaticProps: GetStaticProps = async (context) => {
  const pageData = await getPage("capacitor_enterprise");
  const announcementBarData = await getPage("announcement_bar");

  return {
    props: {
      ...pageData.data,
      announcement_bar: announcementBarData.data,
    },
  };
};

export default Enterprise;
