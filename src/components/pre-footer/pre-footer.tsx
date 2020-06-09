import { Component, Host, h } from '@stencil/core';
import { Grid, Col, ResponsiveContainer, Heading } from '@ionic-internal/sites-shared';

@Component({
  tag: 'pre-footer',
  styleUrl: 'pre-footer.scss',
  scoped: true,
})
export class PreFooter {

  render() {
    return (
      <Host>
        <ResponsiveContainer>
          <Grid>
            <Col md={6} sm={6} xs={12} cols={12}>
              <a href="/docs">
                <img src="/assets/img/docs.png" alt="Read the docs" />
                <Heading level={4}>Read the Docs -></Heading>
                <p>
                  Install Capacitor and learn how to start building with it
                </p>
              </a>
            </Col>
            <Col md={6} sm={6} xs={12} cols={12}>
              <a href="/docs/apis">
                <img src="/assets/img/native-apis.png" alt="Explore the Native APIs" />
                <Heading level={4}>Explore Native APIs -></Heading>
                <p>
                  Explore Native APIs that are available to all Capacitor apps
                </p>
              </a>
            </Col>
          </Grid>
        </ResponsiveContainer>
      </Host>
    );
  }

}
