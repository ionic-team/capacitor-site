import { Component, h } from '@stencil/core';

import Helmet from '@stencil/helmet';
import { ResponsiveContainer, Grid, Col, AnchorButton, Heading } from '@ionic-internal/sites-shared';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss',
  scoped: true
})
export class LandingPage {
  render() {
    return [
      <MetaHead />,
      <ResponsiveContainer>
        <section class="hero">
          <Grid>
            <Col md={6} sm={6} xs={6} cols={12}>
              <hgroup class="hero__heading">
                <h1>
                  A cross-platform native runtime for web apps.
                </h1>
                <h3>
                  Capacitor turns any web app into a native app so you can run
                  one app across iOS, Android, and the Web with the same code.
                </h3>
                <div class="hero__buttons">
                  <AnchorButton href="/docs/getting-started/" id="get-started">
                    Get Started
                  </AnchorButton>
                  <AnchorButton href="/docs/" id="explore-docs" class="btn-white">
                    Explore Docs
                  </AnchorButton>
                </div>
              </hgroup>
            </Col>
            <Col md={6} sm={6} xs={6} cols={12}>
              <img src="/assets/img/landing-graphic.png" alt="Capacitor Architecture Diagram" />
            </Col>
          </Grid>
        </section>

        <section class="points">
          <Heading level={2}>Why Capacitor?</Heading>
          <Grid>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div>
                <h2>Cross Platform</h2>

                <p>
                  Build web apps that run equally well on iOS, Android, and as Progressive Web Apps
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--nativeaccess">
                <h2>Native Access</h2>

                <p>
                  Access the full Native SDK on each platform, and
                  easily deploy to App Stores (and the web!)
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--simple">
                <h2>Use with Ionic</h2>
                <p>
                  Capacitor provides native functionality for web apps, and is optimized
                  for Ionic Framework
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--webnative">
                <h2>Web Native</h2>
                <p>
                  Build apps with standardized web technologies that will work for decades, and
                  easily reach users on the app stores <i>and</i> the mobile web.
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--extensible">
                <h2>Extensible</h2>

                <p>
                  Easily add custom native functionality with a simple Plugin API, or
                  use existing Cordova plugins with our compatibility layer.
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--opensource">
                <h2>Open Source</h2>

                <p>
                  Capacitor is completely open source (MIT) and maintained
                  by <a href="http://ionicframework.com/">Ionic</a> and its community.
                </p>
              </div>
            </Col>
          </Grid>
        </section>
      </ResponsiveContainer>,
      <newsletter-signup />,
      <capacitor-site-footer />
    ];
  }
}

const MetaHead = () => (
  <Helmet>
    <title>Capacitor: Universal Web Applications</title>
    <meta
      name="description"
      content={'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript'}
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@getcapacitor" />
    <meta name="twitter:creator" content="getcapacitor" />
    <meta name="twitter:title" content="Build cross-platform apps with web technologies" />
    <meta
      name="twitter:description"
      content="Build cross-platform apps with web technologies"
    />
    {/*
    <meta name="twitter:image" content="https://ionicframework.com/img/meta/ionic-framework-og.png" />

    <meta property="fb:page_id" content="1321836767955949" />
    <meta property="og:url" content="https://ionicframework.com/resources" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="App Development Trends from the Ionic Framework team" />

    <meta property="og:image" content="https://ionicframework.com/img/meta/ionic-framework-og.png" />
    <meta
      property="og:description"
      content="Expert app development advice, trends, and research from the Ionic Framework team"
    />
    <meta property="og:site_name" content="Ionic Framework" />
    <meta property="article:publisher" content="https://www.facebook.com/ionicframework" />
    <meta property="og:locale" content="en_US" />
    */}
  </Helmet>
)