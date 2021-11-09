import Head from "next/head";
import { useRouter } from "next/router";

import Config from "../../../config";

interface Props {
  title?: string;
  description?: string;
  metaImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const SiteMeta: React.FC<Props> = ({
  title,
  description,
  metaImage,
  ogUrl,
  ogType = "website",
  ...props
}) => {
  const router = useRouter();
  ogUrl = ogUrl || `https://${Config.Domain}${router.asPath}`;

  const sameSiteImage = metaImage?.substr(0, 1) === "/";

  if (sameSiteImage) {
    metaImage = `https://${Config.Domain}${metaImage}`;
  }

  const defaultTitle = "Capacitor - Cross-platform apps with web technology";
  const defaultDescription =
    "Build iOS, Android, Desktop, and Progressive Web Apps with HTML, CSS, and JavaScript.";
  const defaultMetaImage = `https://capacitorjs.com/assets/img/og.png`;

  const fullTitle = title ? `${title} - ${defaultTitle}` : defaultTitle;

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <link key="canonical" rel="canonical" href={Config.BaseUrl} />
      <meta
        key="description"
        name="description"
        content={description || defaultDescription}
      />
      <meta
        key="twitter-card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter-site" name="twitter:site" content="@ionicframework" />
      <meta
        key="twitter-creator"
        name="twitter:creator"
        content="ionicframework"
      />
      <meta key="twitter-title" name="twitter:title" content={fullTitle} />
      <meta
        key="twitter-description"
        name="twitter:description"
        content={description}
      />

      <meta
        key="twitter-image"
        name="twitter:image"
        content={metaImage || defaultMetaImage}
      />

      <meta property="fb:page_id" content="1321836767955949" />
      <meta key="og-url" property="og:url" content={ogUrl} />
      <meta key="og-type" property="og:type" content={ogType} />
      <meta key="og-title" property="og:title" content={title} />

      <meta
        key="og-image"
        property="og:image"
        content={metaImage || defaultMetaImage}
      />
      <meta
        key="og-description"
        property="og:description"
        content={description || defaultDescription}
      />
      <meta key="og-site-name" property="og:site_name" content="Ionic" />
      <meta
        property="article:publisher"
        content="https://www.facebook.com/ionicframework"
      />
      <meta property="og:locale" content="en_US" />
      <script
        type="module"
        src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"
      ></script>
      {props.children}
    </Head>
  );
};

export default SiteMeta;
