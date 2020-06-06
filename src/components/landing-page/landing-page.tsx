import { Component, h } from '@stencil/core';

import Helmet from '@stencil/helmet';
import { ResponsiveContainer, Grid, Col, AnchorButton, Heading, Paragraph } from '@ionic-internal/sites-shared';

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
          <img src="/assets/img/supported-icons.png" alt="Supported platforms" style={{height: '16px'}}/>
        </section>

        <section class="points">
          <Heading level={2}>Why Capacitor?</Heading>
          <Paragraph>
            Leverage Capacitor’s native runtime for connecting web apps to native functionality across iOS, Android, and the mobile web (PWA) — all from a single shared codebase.
          </Paragraph>
          <Grid>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div>
                <img class="points__img" src="/assets/img/capacitor-why-cross-platform.png" alt="Cross Platform" />
                <h2>Cross Platform</h2>

                <p>
                  Build web apps that run equally well on iOS, Android, and as Progressive Web Apps
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--nativeaccess">
                <img class="points__img" src="/assets/img/capacitor-why-native.png" alt="Native" />
                <h2>Native Access</h2>

                <p>
                  Access the full Native SDK on each platform, and
                  easily deploy to App Stores (and the web!)
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--extensible">
                <img class="points__img" src="/assets/img/capacitor-why-extensible.png" alt="Extensible" />
                <h2>Extensible</h2>

                <p>
                  Easily add custom native functionality with a simple Plugin API, or
                  use existing Cordova plugins with our compatibility layer.
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--webnative">
                <img class="points__img" src="/assets/img/capacitor-why-web-to-native.png" alt="Web To Native" />
                <h2>Web Native</h2>
                <p>
                  Build apps with standardized web technologies that will work for decades, and
                  easily reach users on the app stores <i>and</i> the mobile web.
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--extensible">
                <img class="points__img" src="/assets/img/capacitor-why-production-ready.png" alt="Production Ready" />
                <h2>Production Ready</h2>

                <p>
                  Powering apps with millions of users and backed by a company dedicated
                  to app development, Capacitor is ready for serious production apps, today.
                </p>
              </div>
            </Col>
            <Col md={4} sm={4} xs={4} cols={6}>
              <div class="points__item points__item--opensource">
                <img class="points__img" src="/assets/img/capacitor-why-oss.png" alt="Open Source" />
                <h2>Open Source</h2>

                <p>
                  Capacitor is completely open source (MIT) and maintained
                  by <a href="http://ionicframework.com/">Ionic</a> and its community.
                </p>
              </div>
            </Col>
          </Grid>
        </section>
        <section class="section--platforms">
          <hgroup>
            <Heading level={3}>
              Target native mobile and web.<br />
              All from a single codebase.
            </Heading>
            <Paragraph>
              Build cross-platform apps that work seemlessly across iOS, Android, desktop, and the web. Reduce maintenance and development time with a powerful app foundation that lets you build once and deploy anywhere.
            </Paragraph>
          </hgroup>
          <div class="section--platforms__logos">
            <img src="/assets/img/landing/ios.png" alt="iOS" />
            <img src="/assets/img/landing/android.png" alt="iOS" />
            <img src="/assets/img/landing/javascript.png" alt="iOS" />
            <img src="/assets/img/landing/pwa.png" alt="iOS" />
          </div>
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