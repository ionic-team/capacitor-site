import { Component, Host, h, Prop } from '@stencil/core';
import {
  ResponsiveContainer,
  PrismicRichText,
  PrismicResponsiveImage,
  Grid,
  Col,
} from '@ionic-internal/ionic-ds';

@Component({
  tag: 'community-page',
  styleUrl: 'community-page.scss',
  scoped: true,
})
export class CommunityPage {
  @Prop() data: any;

  render() {
    const { Top, Websites } = this;

    return (
      <Host>
        <meta-tags
          page-title="Community"
          description={
            'Get connected and get help from the Capacitor community'
          }
        />
        <Top />
        <Websites />
        <ResponsiveContainer id="newsletter" as="section">
          <newsletter-signup />
        </ResponsiveContainer>
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }

  Top = () => {
    const { top, top__list } = this.data;

    return (
      <ResponsiveContainer id="top" as="section">
        <div class="heading-group">
          <PrismicRichText richText={top} paragraphLevel={2} />
        </div>
        <div class="cards">
          {
            // TODO: remove this temporary card
          }
          <a target="_self" href="/community/registry" class="card">
            <div class="image-wrapper">
              <img alt="capacitor logo on card" class="sc-community-page" height="200" loading="lazy" src="https://images.prismic.io/ionicframeworkcom/0b3bfd94-9c60-432a-98a2-f282aea4a8a1_capacitor-community-top-1%402x.png?auto=compress,format&amp;rect=0,0,680,400&amp;w=340&amp;h=200&amp;q=65" srcset="https://images.prismic.io/ionicframeworkcom/0b3bfd94-9c60-432a-98a2-f282aea4a8a1_capacitor-community-top-1%402x.png?auto=compress,format&amp;rect=0,0,680,400&amp;w=340&amp;h=200&amp;q=65 1x, https://images.prismic.io/ionicframeworkcom/0b3bfd94-9c60-432a-98a2-f282aea4a8a1_capacitor-community-top-1%402x.png?auto=compress,format&amp;rect=0,0,680,400&amp;w=680&amp;h=400&amp;q=65 2x" width="340" />
            </div>
            <h4 class="sc-community-page ui-heading ui-heading-4" id="h-github-discussions">
              Plugins Registry</h4>
            <p class="sc-community-page ui-paragraph ui-paragraph--body ui-paragraph-3">
              Join the community in discussing new features, asking questions, and help others get started</p>
          </a>
          {top__list.map(({ image, text, link: { target, url } }) => (
            <a target={target} href={url} class="card">
              <div class="image-wrapper">
                <PrismicResponsiveImage image={image} />
              </div>
              <PrismicRichText richText={text} />
            </a>
          ))}
        </div>
      </ResponsiveContainer>
    );
  };

  Websites = () => {
    const { websites__list } = this.data;

    const dimensions = ['40x32', '40x34', '34x40', '40x40'];

    return (
      <ResponsiveContainer id="websites" as="section">
        <Grid>
          {websites__list.map(({ icon, text, link }, i) => {
            const [width, height] = dimensions[i].split('x');

            return (
              <Col cols={12} xs={6} md={3}>
                <div class="image-wrapper">
                  <PrismicResponsiveImage
                    width={width}
                    height={height}
                    image={icon}
                  />
                </div>
                <PrismicRichText richText={text} />
                <PrismicRichText class="link" richText={link} />
              </Col>
            );
          })}
        </Grid>
      </ResponsiveContainer>
    );
  };
}
