import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import {
  ResponsiveContainer,
  Heading,
  Button,
  PrismicRichText,
  PrismicResponsiveImage,
  Paragraph,
} from '../../ds';
import { getPage } from '../../data.server/prismic';

import './enterprise-page.scss';

interface Props {
  data: any;
}

function EnterprisePage(props: Props): JSX.Element {
  const [data, setData] = useState(null);
  const [ebookModalOpen, setEbookModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrismicContent = async () => {
      const page = await getPage({}, { pathname: '/enterprise' });
      setData(page);
    };
    fetchPrismicContent();
  }, []);

  if (!data) {
    return null;
  }

  const Top = () => {
    const { top } = data;
    const { title, text, cta_1, cta_2, background } = top[0];

    return (
      <section id="top">
        <PrismicResponsiveImage image={background} className="background" />
        <ResponsiveContainer>
          <div className="heading-group">
            <Heading level={1}>{title}</Heading>
            <Paragraph level={2}>{text}</Paragraph>
            <div className="cta-row">
              <Button anchor href="#demo" kind="round">
                {cta_1}
                <span className="arrow"> -&gt;</span>
              </Button>
              <a
                href="https://ionic.io/contact/sales"
                className="link btn-link"
              >
                {cta_2}
                <span className="arrow"> -&gt;</span>
              </a>
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Companies = () => {
    const { companies } = data;

    const companies__list = [
      ['nationwide', '34x42'],
      ['target', '31x42'],
      ['burger-king', '39x41'],
      ['home-depot', '34x34'],
      ['nbc', '51x30'],
      ['microsoft', '35x35'],
      ['amtrak', '58x25'],
      ['general-electric', '35x35'],
    ];

    return (
      <section id="companies">
        <ResponsiveContainer>
          <Heading level={2}>{companies}</Heading>
          <div className="logos">
            <div className="row1">
              {companies__list.slice(0, 4).map((stats, i) => (
                <img
                  width={stats[1].split('x')[0]}
                  height={stats[1].split('x')[1]}
                  src={`./assets-enterprise-page/companies/${i}@2x.png`}
                  loading="lazy"
                  alt={`${stats[0]} logo`}
                />
              ))}
            </div>
            <div className="row2">
              {companies__list.slice(0, 4).map((stats, i) => (
                <img
                  width={stats[1].split('x')[0]}
                  height={stats[1].split('x')[1]}
                  src={`./assets-enterprise-page/companies/${
                    i + companies__list.length / 2
                  }@2x.png`}
                  loading="lazy"
                  alt={`${stats[0]} logo`}
                />
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Native = () => {
    const { native, native__list } = data;
    const { supertext, title, subtext } = native[0];

    const icons = [
      ['three blocks with up arrow', '64x64'],
      ['fingerprint icon with lock symbol', '76x64'],
      ['clock icon with up arrow', '64x64'],
    ];

    return (
      <ResponsiveContainer id="native" as="section">
        <div className="heading-group">
          <p className="ui-heading-6">
            <sup>{supertext}</sup>
          </p>
          <PrismicRichText richText={title} />
          <Paragraph level={2}>{subtext}</Paragraph>
        </div>
        <ul className="list">
          {native__list.map(({ title, text }, i) => (
            <li key={icons[i][0]}>
              <img
                width={icons[i][1].split('x')[0]}
                height={icons[i][1].split('x')[1]}
                src={`/assets-enterprise-page/native/${i}@2x.png`}
                loading="lazy"
              />
              <Heading level={4} as="h3">
                {title}
              </Heading>
              <Paragraph leading="prose">{text}</Paragraph>
            </li>
          ))}
        </ul>
      </ResponsiveContainer>
    );
  };

  const Ebook = () => {
    const { ebook } = data;
    const { text, cta, background, book } = ebook[0];

    return (
      <section id="ebook">
        <ResponsiveContainer>
          <site-modal
            open={ebookModalOpen}
            onModalClose={() => setEbookModalOpen(false)}
          >
            <Heading level={2}>
              Building Cross-platform Apps with Capacitor
            </Heading>
            <hubspot-form formId="9151dc0b-42d9-479f-b7b8-649e0e7bd1bc" />
          </site-modal>
          <div className="wrapper">
            <PrismicResponsiveImage image={background} className="background" />
            <div className="content">
              <div className="image-wrapper">
                <PrismicResponsiveImage image={book} />
              </div>
              <div className="heading-group">
                <PrismicRichText paragraphLevel={1} richText={text} />
                <Button
                  kind="round"
                  size="md"
                  onClick={() => setEbookModalOpen(true)}
                >
                  {cta} <span className="arrow"> -&gt;</span>
                </Button>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Approach = () => {
    const {
      approach,
      approach_traditional,
      approach_traditional__list,
      approach_web,
      approach_web__list,
    } = data;
    const { supertext, title } = approach[0];

    return (
      <section id="approach">
        <ResponsiveContainer>
          <div className="heading-group">
            <p className="ui-heading-6">
              <sup>{supertext}</sup>
            </p>
            <PrismicRichText richText={title} />
          </div>
          <div className="split">
            <article className="traditional column">
              <Heading>{approach_traditional[0]['title']}</Heading>
              <Paragraph>{approach_traditional[0]['text']}</Paragraph>
              <PrismicResponsiveImage
                image={approach_traditional[0]['image']}
              />
              <div className="list">
                <Heading level={4}>
                  {approach_traditional[0]['subtitle']}
                </Heading>
                <ul>
                  {approach_traditional__list.map(({ text, icon }) => (
                    <li>
                      <PrismicResponsiveImage image={icon} />
                      <Paragraph>{text}</Paragraph>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            <article className="web column">
              <Heading>{approach_web[0]['title']}</Heading>
              <Paragraph>{approach_web[0]['text']}</Paragraph>
              <PrismicResponsiveImage image={approach_web[0]['image']} />
              <div className="list">
                <Heading level={4}>{approach_web[0]['subtitle']}</Heading>
                <ul>
                  {approach_web__list.map(({ text, icon }) => (
                    <li>
                      <PrismicResponsiveImage image={icon} />
                      <Paragraph>{text}</Paragraph>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Plugins = () => {
    const { plugins } = data;
    const { supertext, title, subtext, image } = plugins[0];

    return (
      <section id="plugins">
        <ResponsiveContainer>
          <div className="wrapper">
            <div className="heading-group">
              <p className="ui-heading-6">
                <sup>{supertext}</sup>
              </p>
              <PrismicRichText richText={title} />
              <Paragraph level={2}>{subtext}</Paragraph>
            </div>
            <div className="image-wrapper">
              <PrismicResponsiveImage image={image} />
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Security = () => {
    const { security } = data;
    const { supertext, title, subtext, image } = security[0];

    return (
      <section id="security">
        <ResponsiveContainer>
          <div className="wrapper">
            <div className="image-wrapper">
              <PrismicResponsiveImage image={image} />
            </div>
            <div className="heading-group">
              <p className="ui-heading-6">
                <sup>{supertext}</sup>
              </p>
              <PrismicRichText richText={title} />
              <PrismicRichText richText={subtext} paragraphLevel={2} />
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const SupportGuidance = () => {
    const { support_guidance } = data;

    return (
      <section id="support-guidance">
        <ResponsiveContainer>
          <div className="wrapper">
            {support_guidance.map(({ image, title, text }) => (
              <article>
                <PrismicResponsiveImage image={image} />
                <Heading level={3}>{title}</Heading>
                <Paragraph level={2}>{text}</Paragraph>
              </article>
            ))}
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Features = () => {
    const { features, features__list } = data;
    const { supertext, title, subtext } = features[0];

    return (
      <section id="features">
        <ResponsiveContainer>
          <div className="wrapper">
            <div className="heading-group">
              <p className="ui-heading-6">
                <sup>{supertext}</sup>
              </p>
              <PrismicRichText richText={title} />
              <Paragraph level={2}>{subtext}</Paragraph>
            </div>
            <ul>
              {features__list.map(({ icon, title, text }) => (
                <li>
                  <div className="image-wrapper">
                    <PrismicResponsiveImage image={icon} />
                  </div>
                  <div>
                    <Heading level={4} as="h3">
                      {title}
                    </Heading>
                    <Paragraph>{text}</Paragraph>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Editions = () => {
    const { editions } = data;
    const {
      supertext,
      title,
      paragraph_1,
      paragraph_2,
      cta_1,
      cta_2,
    } = editions[0];

    const images = [
      ['burger-king', '36x38'],
      ['fidelity', '113x32'],
      ['hr-block', '32x32'],
      ['communo', '102x24'],
      ['usaa', '27x32'],
      ['ibm', '64x26'],
      ['bcbs', '62x32'],
      ['test-kitchen', '77x28'],
      ['home-depot', '32x32'],
    ];

    return (
      <section id="editions">
        <ResponsiveContainer>
          <div className="wrapper">
            <div className="heading-group">
              <p className="ui-heading-6">
                <sup>{supertext}</sup>
              </p>
              <PrismicRichText richText={title} />
              <PrismicRichText richText={paragraph_1} paragraphLevel={2} />
              <PrismicRichText richText={paragraph_2} paragraphLevel={2} />
              <div className="cta-row">
                <Button href="#demo" anchor kind="round">
                  {cta_1}
                  <span className="arrow"> -&gt;</span>
                </Button>
                <a
                  href="https://ionic.io/contact/sales"
                  className="link btn-link"
                >
                  {cta_2}
                  <span className="arrow"> -&gt;</span>
                </a>
              </div>
            </div>
            <div className="logos">
              <div className="row0">
                {images.slice(0, 3).map((stats, i) => (
                  <div className="image-wrapper">
                    <img
                      src={`./assets-enterprise-page/editions/${i}@2x.png`}
                      width={stats[1].split('x')[0]}
                      height={stats[1].split('x')[1]}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="row1">
                {images.slice(3, 6).map((stats, i) => (
                  <div className="image-wrapper">
                    <img
                      src={`/assets-enterprise-page/editions/${i + 3}@2x.png`}
                      width={stats[1].split('x')[0]}
                      height={stats[1].split('x')[1]}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="row2">
                {images.slice(6, 9).map((stats, i) => (
                  <div className="image-wrapper">
                    <img
                      src={`/assets-enterprise-page/editions/${i + 6}@2x.png`}
                      width={stats[1].split('x')[0]}
                      height={stats[1].split('x')[1]}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Demo = () => {
    const { demo } = data;
    const { supertext, title } = demo[0];

    return (
      <section id="demo">
        <ResponsiveContainer>
          <div className="heading-group">
            <p className="ui-heading-6">
              <sup>{supertext}</sup>
            </p>
            <Heading level={2}>{title}</Heading>
          </div>
          <hubspot-form formId="d0019a78-110e-4d28-b356-56357b4abe4b" />
        </ResponsiveContainer>
      </section>
    );
  };

  return (
    <Layout>
      <meta-tags />
      <enterprise-subnav />
      <Top />
      <Companies />
      <Native />
      <Ebook />
      <Approach />
      <Plugins />
      <Security />
      <SupportGuidance />
      <Features />
      <Editions />
      <Demo />
      <pre-footer />
      <capacitor-site-footer />
    </Layout>
  );
}

export default EnterprisePage;
