import { Component, h, Host, Prop, State } from '@stencil/core';
import {
  ResponsiveContainer,
  Grid,
  Col,
  Heading,
  Breakpoint,
  Button,
  PrismicRichText,
  PrismicResponsiveImage,
  Paragraph,
} from '@ionic-internal/ionic-ds';
import { Fragment, getAssetPath, JSXBase } from '@stencil/core/internal';
import { href } from '@stencil/router';

@Component({
  tag: 'enterprise-page',
  styleUrl: 'enterprise-page.scss',
  scoped: true,
  assetsDirs: ['./assets-enterprise-page'],
})
export class EnterprisePage {
  @Prop() data: any;

  render() {
    const { Top, Companies, Native, Ebook } = this;

    return (
      <Host>
        <meta-tags />
        <Top />
        <Companies />
        <Native />
        <Ebook />
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }

  Top = () => {
    const { top } = this.data;
    const { title, text, cta_1, cta_2, background } = top[0];

    return (
      <section id="top">
        <PrismicResponsiveImage image={background} class="background" />
        <ResponsiveContainer>
          <div class="heading-group">
            <Heading level={1}>{title}</Heading>
            <Paragraph level={2}>{text}</Paragraph>
            <div class="cta-row">
              <Button>
                {cta_1} <span class="arrow"> -&gt;</span>
              </Button>
              <a href="" class="link">
                {cta_2} <span class="arrow"> -&gt;</span>
              </a>
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  Companies = () => {
    const { companies } = this.data;

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
          <Heading level={6} as="h2">
            {companies}
          </Heading>
          <div class="logos">
            <div class="row1">
              {companies__list.slice(0, 4).map((stats, i) => (
                <img
                  width={stats[1].split('x')[0]}
                  height={stats[1].split('x')[1]}
                  src={getAssetPath(
                    `./assets-enterprise-page/companies/${i}@2x.png`,
                  )}
                  loading="lazy"
                  alt={`${stats[0]} logo`}
                />
              ))}
            </div>
            <div class="row2">
              {companies__list.slice(0, 4).map((stats, i) => (
                <img
                  width={stats[1].split('x')[0]}
                  height={stats[1].split('x')[1]}
                  src={getAssetPath(
                    `./assets-enterprise-page/companies/${
                      i + companies__list.length / 2
                    }@2x.png`,
                  )}
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

  Native = () => {
    const { native, native__list } = this.data;
    const { supertext, title, subtext } = native[0];

    const icons = [
      ['three blocks with up arrow', '64x64'],
      ['fingerprint icon with lock symbol', '76x64'],
      ['clock icon with up arrow', '64x64'],
    ];

    return (
      <ResponsiveContainer id="native" as="section">
        <div class="heading-group">
          <p class="ui-heading-6">{supertext}</p>
          <PrismicRichText richText={title} />
          <Paragraph level={2}>{subtext}</Paragraph>
        </div>
        <ul class="list">
          {native__list.map(({ title, text }, i) => (
            <li key={icons[i][0]}>
              <img
                width={icons[i][1].split('x')[0]}
                height={icons[i][1].split('x')[1]}
                src={getAssetPath(
                  `./assets-enterprise-page/native/${i}@2x.png`,
                )}
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

  Ebook = () => {
    const { ebook } = this.data;
    const { text, cta, background, book } = ebook[0];

    return (
      <ResponsiveContainer id="ebook" as="section">
        <PrismicResponsiveImage image={background} class="background" />
        <div class="wrapper">
          <div class="image-wrapper">
            <PrismicResponsiveImage image={book} />
          </div>
          <div class="heading-group">
            <PrismicRichText paragraphLevel={1} richText={text} />
            <Button anchor>
              {cta} <span class="arrow"> -&gt;</span>
            </Button>
          </div>
        </div>
      </ResponsiveContainer>
    );
  };
}
