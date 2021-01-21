import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import {
  ResponsiveContainer,
  Button,
  PrismicRichText,
  PrismicResponsiveImage,
} from '../../ds';
import { getPage } from '../../data.server/prismic';
import Image from '@theme/IdealImage';
import TestImage from '../../../static/img/og.png';

import '../landing-page.scss';

interface Props {
  data: any;
}

function ImageTestPage(props: Props): JSX.Element {
  const [data, setData] = useState(null);
  const [showHubspotForm, setShowHubspotForm] = useState(false);
  const [hubspotFormSubmitted, setHubspotFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchPrismicContent = async () => {
      const page = await getPage({}, { pathname: '/' });
      setData(page);
    };
    fetchPrismicContent();
  }, []);

  if (!data) {
    return null;
  }

  const Top = () => {
    const { top, top__ctas, top__link, top__hero, top__icons } = data;
    const { primary, secondary } = top__ctas[0];

    return (
      <section id="top">
        <div className="background"></div>
        <ResponsiveContainer>
          <div className="heading-group">
            <PrismicRichText richText={top} paragraphLevel={2} />
            <div className="buttons">
              <Button
                kind="round"
                anchor
                href="/docs/getting-started"
                className="primary"
              >
                {primary} <span className="arrow"> -&gt;</span>
              </Button>
              <Button
                kind="round"
                variation="light"
                anchor
                href="docs/plugins"
                className="secondary"
              >
                {secondary}
              </Button>
            </div>
            <a className="link | ui-paragraph-4" href="/cordova">
              {top__link}
              <span className="arrow"> -&gt;</span>
            </a>
            <PrismicResponsiveImage
              loading="eager"
              image={top__icons}
              params={{
                w: '91',
                h: '16',
              }}
            />
          </div>
          <div className="image-wrapper">
            <PrismicResponsiveImage loading="eager" image={top__hero} />
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const ImageTest = () => {
    return (
      <Image style={{width:'100%'}} img={TestImage} size={400}/>
    );
  }

  return (
    <Layout>
      {/* <meta-tags /> */}
      <Top />
      <ImageTest />
      {/* <capacitor-site-footer /> */}
    </Layout>
  );
}

export default ImageTestPage;
