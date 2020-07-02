import { Component, Host, h } from '@stencil/core';
import { ResponsiveContainer, Grid, Col, Heading } from '@ionic-internal/sites-shared';

@Component({
  tag: 'capacitor-site-footer',
  styleUrl: 'capacitor-site-footer.scss',
  scoped: true,
})
export class CapacitorSiteFooter {
  render() {
    return (
      <Host>
        <footer>
          <ResponsiveContainer>
            <Grid>
              <Col md={6} sm={6} xs={12} cols={12} class="copyright">
                <img src="/assets/img/logo-white2.png" alt="Capacitor Logo" class="logo" />
                <p>
                  © {(new Date()).getFullYear()} Capacitor
                </p>
                <p><a href="https://ionic.io">Ionic Open Source</a> | Released under <span id="mit">MIT License</span></p>
              </Col>
              <Col md={6} sm={6} xs={12} cols={12}>
                <Grid>
                  <Col md={4} sm={4} xs={4} cols={4}>
                    <Heading level={5}>Developers</Heading>
                    <ul>
                      <li><a href="/docs/getting-started">Install</a></li>
                      <li><a href="/docs">Docs</a></li>
                      <li><a href="/docs/apis">Plugins</a></li>
                    </ul>
                  </Col>
                  <Col md={4} sm={4} xs={4} cols={4}>
                    <Heading level={5}>Resources</Heading>
                    <ul>
                      <li><a href="/community">Community</a></li>
                      <li><a href="/blog">Blog</a></li>
                      <li><a href="https://github.com/ionic-team/capacitor/discussions">Discussions</a></li>
                    </ul>
                  </Col>
                  <Col md={4} sm={4} xs={4} cols={4}>
                    <Heading level={5}>Connect</Heading>
                    <ul>
                      <li><a href="https://github.com/ionic-team/capacitor">GitHub</a></li>
                      <li><a href="https://twitter.com/capacitorjs">Twitter</a></li>
                      <li><a href="https://ionic.io">Ionic</a></li>
                    </ul>
                  </Col>
                </Grid>
              </Col>
            </Grid>
          </ResponsiveContainer>
        </footer>
      </Host>
    );
  }

}
