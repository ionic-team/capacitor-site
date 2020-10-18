import { Component, Host, h, Prop } from '@stencil/core';
import { ResponsiveContainer, PrismicRichText, Grid, Col, PrismicResponsiveImage } from '@ionic-internal/ionic-ds';


@Component({
  tag: 'capacitor-community',
  styleUrl: 'capacitor-community.scss',
  scoped: true,
})
export class CapacitorCommunity {
  @Prop() data: any;

  render() {
    const { Top } = this;

    return (
      <Host>
        <Top />
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
    )
  }

}
