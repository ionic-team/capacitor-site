import { useEffect, useState } from 'react';
import { getPage, PrismicRichText } from '../../prismic';
import { trackClick, trackView } from '../../util/tracking-service';

const InternalAd = () => {
  const [ad, setAd] = useState<any | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      setAd(await getPage('docs_ad'));
      if (!ad) {
        return;
      }
      // give the page a chance to reflow
      timeout = setTimeout(() => {
        trackView(ad.ad_id);
      }, 50);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!ad) {
    return null;
  }

  return (
    <a href={ad.ad_url.url} target={ad.ad_url.target} onClick={(e) => trackClick(ad.ad_id, e.nativeEvent)}>
      {/* Reponsive image since Prismic supports it out of the box */}
      <picture>
        <source media="(min-width: 37.5em)" src={ad.ad_image.url} />
        <source src={ad.ad_image['1x'].url} />
        <img
          src={ad.ad_image.url}
          alt={ad.ad_image.alt}
          height={ad.ad_image['1x'].dimensions.height}
          width={ad.ad_image['1x'].dimensions.width}
        />
        <p>{ad.ad_image.alt}</p>
      </picture>
      <PrismicRichText render={ad.ad_copy} />
      {/*
      <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(ad.ad_copy)}}></div>
      */}
    </a>
  );
};

export default InternalAd;
