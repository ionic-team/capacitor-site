import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import {
  ResponsiveContainer,
  PrismicRichText,
  PrismicResponsiveImage,
  Grid,
  Col,
} from '../../ds';
import { getPage } from '../../data.server/prismic';

import './community-page.scss';

interface Props {
  data: any;
}

function CommunityPage(props: Props): JSX.Element {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchPrismicContent = async () => {
      const page = await getPage({}, { pathname: '/community' });
      setData(page);
    };
    fetchPrismicContent();
  }, []);

  if (!data) {
    return null;
  }

  const Top = () => {
    const { top, top__list } = data;

    return (
      <ResponsiveContainer id="top" as="section">
        <div className="heading-group">
          <PrismicRichText richText={top} paragraphLevel={2} />
        </div>
        <div className="cards">
          {top__list.map(({ image, text, link: { target, url } }) => (
            <a target={target} href={url} className="card">
              <div className="image-wrapper">
                <PrismicResponsiveImage image={image} />
              </div>
              <PrismicRichText richText={text} />
            </a>
          ))}
        </div>
      </ResponsiveContainer>
    );
  };

  const Websites = () => {
    const { websites__list } = data;

    const dimensions = ['40x32', '40x34', '34x40', '40x40'];

    return (
      <ResponsiveContainer id="websites" as="section">
        <Grid>
          {websites__list.map(({ icon, text, link }, i) => {
            const [width, height] = dimensions[i].split('x');

            return (
              <Col cols={12} xs={6} md={3}>
                <div className="image-wrapper">
                  <PrismicResponsiveImage
                    width={width}
                    height={height}
                    image={icon}
                  />
                </div>
                <PrismicRichText richText={text} />
                <PrismicRichText className="link" richText={link} />
              </Col>
            );
          })}
        </Grid>
      </ResponsiveContainer>
    );
  };

  return (
    <Layout>
      <meta-tags
        page-title="Community"
        description={'Get connected and get help from the Capacitor community'}
      />
      <Top />
      <Websites />
      <ResponsiveContainer id="newsletter" as="section">
        <newsletter-signup />
      </ResponsiveContainer>
      <pre-footer />
      <capacitor-site-footer />
    </Layout>
  );
}

export default CommunityPage;
