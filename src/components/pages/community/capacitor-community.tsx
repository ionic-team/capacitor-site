import { Component, Host, h } from '@stencil/core';
import { Heading, Paragraph, Grid, Col, ResponsiveContainer } from '@ionic-internal/ionic-ds';

@Component({
  tag: 'capacitor-community',
  styleUrl: 'capacitor-community.scss',
  scoped: true,
})
export class CapacitorCommunity {

  render() {
    return (
      <Host>
        
        <newsletter-signup />
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }

  Top = () => (
    <div></div>
  )

}
