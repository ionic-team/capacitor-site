import { h } from '@stencil/core';
import Helmet from '@stencil/helmet';

export const MetaTags = ({
  title = 'Capacitor: Cross-platform native runtime for web apps',
  description = 'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript',
  image = 'https://capacitorjs.com/assets/img/og.png',
  authorTwitter = '@capacitorjs',
  ogType = 'website',
}: {
  title?: string;
  description?: string;
  image?: string;
  authorTwitter?: string;
  ogType?: string;
}) => {
  const site = 'https://capacitorjs.com';
  const prettyTitle =
    title === 'Capacitor: Cross-platform native runtime for web apps'
      ? title
      : `${title} - Capacitor`;
  return (
    <Helmet>
      <title>{prettyTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={prettyTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {/* Fixed domain and strip out hashtags and query strings */}
      <meta property="og:url" content={`${site}${location.pathname}`} />
      <meta name="twitter:title" content={prettyTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={authorTwitter} />
    </Helmet>
  );
};
