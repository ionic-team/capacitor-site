import { Component, Host, h } from '@stencil/core';
import { Heading, Paragraph, Grid, Col, ResponsiveContainer } from '@ionic-internal/sites-shared';

@Component({
  tag: 'capacitor-community',
  styleUrl: 'capacitor-community.scss',
  scoped: true,
})
export class CapacitorCommunity {

  render() {
    return (
      <Host>
        <ResponsiveContainer>
          <hgroup>
            <Heading level={1}>Community</Heading>
            <Paragraph>
              Capacitor is a large and growing project with a passionate community. Engage with the Capacitor team and other helpful community members through the forum, Capacitor Community org, and Twitter.
            </Paragraph>
          </hgroup>
          <Grid>
            <Col md={4} sm={4} xs={4} cols={12}>
              <a href="https://github.com/ionic-team/capacitor/discussions">
                <img src="/assets/img/community/support-community-forum.png" alt="GitHub Discussions" />
              </a>
              <Heading level={2}>GitHub Discussions</Heading>
              <Paragraph>
                Join the community in discussing new features, asking questions, and help others get started
              </Paragraph>
            </Col>
            <Col md={4} sm={4} xs={4} cols={12}>
              <a href="https://github.com/capacitor-community">
                <img src="/assets/img/community/support-community.png" alt="Community Organization" />
              </a>
              <Heading level={2}>Community Organization</Heading>
              <Paragraph>
                View a list of curated community plugins to enhance your app even more. From music controls, advanced native HTTP, and more
              </Paragraph>
            </Col>
            <Col md={4} sm={4} xs={4} cols={12}>
              <a href="https://twitter.com/capacitorjs">
                <img src="/assets/img/community/support-twitter.png" alt="Capacitor Twitter" />
              </a>
              <Heading level={2}>Capacitor Twitter</Heading>
              <Paragraph>
                Get the latest news and join the community by following us on Twitter
              </Paragraph>
            </Col>
          </Grid>
        </ResponsiveContainer>
      </Host>
    );
  }

}
