import { Component, h, Host, State } from '@stencil/core';

import Helmet from '@stencil/helmet';
import { ResponsiveContainer, Grid, Col, AnchorButton, Heading, Paragraph, Breakpoint } from '@ionic-internal/sites-shared';
import { Tabs, Tab, TabBar, TabBarButton } from '../tabs';
import FancyUnderline from '../FancyUnderline';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss',
  scoped: true
})
export class LandingPage {
  @State() selectedCodeTab: string = 'notifications' ;
  render() {
    return (
      <Host>
        <MetaHead />
        <section class="hero">
          <div class="hero__background"></div>
          <ResponsiveContainer>
            <Grid>
              <Col md={6} sm={6} xs={6} cols={12}>
                <hgroup class="hero__heading">
                <a class="feature__register" href="https://ionicframework.com/resources/webinars/hybrid-app-development-redefined" target="_blank" rel="noopener nofollow">
                  <div class="feature__register__tag">Live demo</div>
                    <Breakpoint sm={true} display="inline-block" class="feature__register__text">
                      <span class="text__content">
                        Hybrid vs. Native Webinar Wed, July 22nd <span style={{'letter-spacing':'0'}}>-&gt;</span>
                      </span>
                    </Breakpoint>
                    <Breakpoint xs={true} sm={false} display='inline-block' class="feature__register__text">
                      <span class="text__content">
                        Hybrid vs. Native Webinar <span style={{'letter-spacing':'0'}}>-&gt;</span>
                      </span>
                    </Breakpoint>
                </a>
                  <Heading level={1}>
                    A cross-platform native runtime for web apps.
                  </Heading>
                  <Heading level={3}>
                    Capacitor turns any web app into a native app so you can run
                    one app across iOS, Android, and the Web with the same code.
                  </Heading>
                  <div class="hero__buttons">
                    <AnchorButton href="/docs/getting-started" id="get-started">
                      Get Started
                    </AnchorButton>
                    <AnchorButton href="/docs" id="explore-docs" class="btn-white">
                      Explore Docs
                    </AnchorButton>
                  </div>
                </hgroup>
                <div class="cordova-cta">
                  <a href="/cordova">Migrating from Cordova {"->"}</a>
                </div>
                <img class="hero__platforms" src="/assets/img/supported-icons.png" alt="Supported platforms" />
              </Col>
              <Col md={6} sm={6} xs={6} cols={12} class="hero__graphic">
                <img src="/assets/img/landing/hero-graphic.png" alt="Capacitor Architecture Diagram" />
              </Col>
            </Grid>
          </ResponsiveContainer>
        </section>
        <GettingStartedSection
          selectedCodeTab={this.selectedCodeTab}
          setSelectedCodeTab={(tab: string) => { this.selectedCodeTab = tab}}/>
        <ResponsiveContainer>
          <section class="section--web-apps-to-native">
            <hgroup>
              <Heading level={3}>
                Connect web apps to<br />
                <FancyUnderline>native functionality.</FancyUnderline>
              </Heading>
            </hgroup>
            <Grid>
              <Col md={4} sm={4} xs={12} cols={12}>
                <img src="/assets/img/landing/universal-apps.png" alt="Universal apps" />
                <Heading level={4}>
                  Universal apps
                </Heading>
                <Paragraph>
                  Build web-based applications that run equally well across iOS, Android, and as Progressive Web Apps.
                </Paragraph>
              </Col>
              <Col md={4} sm={4} xs={12} cols={12}>
                <img src="/assets/img/landing/native-access.png" alt="Native access" />
                <Heading level={4}>
                  Native access
                </Heading>
                <Paragraph>
                  Access the full Native SDKs on each platform, and easily deploy to the App Stores (and the web).
                </Paragraph>
              </Col>
              <Col md={4} sm={4} xs={12} cols={12}>
                <img src="/assets/img/landing/native-pwas.png" alt="Native PWAs" />
                <Heading level={4}>
                  Native PWAs
                </Heading>
                <Paragraph>
                  Add custom native functionality with a simple Plugin API, or use existing Cordova plugins with our compatibility layer.
                </Paragraph>
              </Col>
            </Grid>
          </section>
          <section class="section--native-features">
            <hgroup>
              <Heading level={3}>
                Cross-platform core<br />
                <FancyUnderline>native features</FancyUnderline>
              </Heading>
            </hgroup>
            <Grid>
              {[
                {
                  key: 'camera',
                  name: 'Camera',
                  desc: 'Capture, save photos, and configure hardware parameters like focus and white balance.'
                },
                {
                  key: 'filesystem',
                  name: 'File System',
                  desc: 'Save and read assets, documents, and other data your users need by accessing native file systems'
                },
                {
                  key: 'geolocation',
                  name: 'Geolocation',
                  desc: 'Build location-aware apps by polling for the current device location or subscribing to location updates.'
                },
                {
                  key: 'accelerometer',
                  name: 'Accelerometer',
                  desc: 'Access the device accelerometer sensors to respond to changes in device motion in 3d space.'
                },
                {
                  key: 'notifications',
                  name: 'Notifications',
                  desc: 'Build applications that send and respond to local and server-pushed notifications'
                },
                {
                  key: 'haptics',
                  name: 'Haptics',
                  desc: 'Use haptic hardware to provide physical feedback for user actions'
                },
                {
                  key: 'accessibility',
                  name: 'Accessibility',
                  desc: 'Respond to changes in accessibility states and extend your app with a11y features'
                },
                {
                  key: 'custom',
                  name: 'Your Own Plugin',
                  desc: 'Extend your app with custom native and web code to provide consistent APIs across platforms.'
                }
              ].map(f => (
              <Col md={3} sm={3} xs={6} cols={12} key={f.key}>
                <img src={`/assets/img/landing/native-${f.key}.png`} alt={f.name} />
                <Heading level={4}>
                  {f.name}
                </Heading>
                <Paragraph>
                  {f.desc}
                </Paragraph>
              </Col>
              ))}
            </Grid>
          </section>
          <section class="section--your-framework">
            <hgroup>
              <Heading level={3}>
                Bring your own web<br />
                <FancyUnderline>framework.</FancyUnderline>
              </Heading>
              <Paragraph>
                Drop Capacitor into any existing web app project, framework or library. Convert an existing React, Angular, Svelte, Vue (or your preferred Web Framework) project to native mobile and use any UI library of your choosing.
              </Paragraph>
            </hgroup>
            <Grid>
              {[
                { color: '#EDFBFF', key: 'react', name: 'React' },
                { color: '#FFEDF1', key: 'angular', name: 'Angular' },
                { color: '#FFF5F2', key: 'svelte', name: 'Svelte' },
                { color: '#EFFAF5', key: 'vue', name: 'Vue' },
                { color: '#F6F8FB', key: 'stencil', name: 'Stencil' },
                { color: '#F0F8FD', key: 'jquery', name: 'jQuery' },
                { color: '#F6F1FD', key: 'bootstrap', name: 'Bootstrap' },
                { color: '#F0F6FF', key: 'ionic', name: 'Ionic' },
                { color: '#EDF9FF', key: 'material-ui', name: 'Material UI' },
                { color: '#FFF5F3', key: 'framework-7', name: 'Framework7' },
                { color: '#F0F7FC', key: 'quasar', name: 'Quasar' },
                { color: '#FEF8EF', key: 'angular-material', name: 'Angular Material' },
              ].map(f => (
                <Col md={3} sm={3} xs={6} cols={12} key={f.key} style={{ background: f.color }} class="framework">
                  <img src={`/assets/img/landing/framework-${f.key}.png`} alt={f.name} />
                </Col>
              ))}
            </Grid>
          </section>
        </ResponsiveContainer>
        <pre-footer />
        <newsletter-signup />
        <capacitor-site-footer />
      </Host>
    );
  }
}

const GettingStartedSection = ({ selectedCodeTab, setSelectedCodeTab}: { selectedCodeTab: string, setSelectedCodeTab: (tab: string) => void }) => (
  <section class="section--getting-started">
    <ResponsiveContainer>
      <hgroup>
        <Heading level={2}>Getting started is easy.</Heading>
      </hgroup>
      <Grid class="section--getting-started__step">
        <Col cols={1}>01</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Drop Capacitor into any existing web app.</Heading>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
npm install @capacitor/cli @capacitor/core
npx cap init
`}/>
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>02</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Install the native platforms you want to target.</Heading>
          <img src="/assets/img/landing/apple.png" alt="Apple" class="apple" />
          <img src="/assets/img/landing/android.png" alt="Android" class="android" />
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
npx cap add ios
npx cap add android
`} />
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>03</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Access APIs on both native and web, or extend with your own.</Heading>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <Tabs>
            <TabBar>
              <TabBarButton
                selected={selectedCodeTab === 'notifications'}
                tabSelect={() => setSelectedCodeTab('notifications')}>
                Notifications
              </TabBarButton>
              <TabBarButton
                selected={selectedCodeTab === 'geolocation'}
                tabSelect={() => setSelectedCodeTab('geolocation')}>
                Geolocation
              </TabBarButton>
              <TabBarButton
                selected={selectedCodeTab === 'camera'}
                tabSelect={() => setSelectedCodeTab('camera')}>
                Camera
              </TabBarButton>
              <TabBarButton
                selected={selectedCodeTab === 'custom'}
                tabSelect={() => setSelectedCodeTab('custom')}>
                Custom
              </TabBarButton>
            </TabBar>
            <Tab selected={selectedCodeTab === 'notifications'}>
              <code-snippet
                style={{ '--border-radius': '0 0 8px 8px' }}
                language="typescript"
                code={`
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

LocalNotifications.schedule({
  notifications: [
    {
      title: "On sale",
      body: "Widgets are 10% off. Act fast!",
      id: 1,
      schedule: { at: new Date(Date.now() + 1000 * 5) },
      sound: null,
      attachments: null,
      actionTypeId: "",
      extra: null
    }
  ]
});
`} />
            </Tab>
            <Tab
              selected={selectedCodeTab === 'geolocation'}>
              <code-snippet
                style={{ '--border-radius': '0 0 8px 8px' }}
                language="typescript"
                code={`
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
// get the users current position
const position = await Geolocation.getCurrentPosition();

// grab latitude & longitude
const latitude = position.coords.latitude;
const longitude = position.coords.longitude;
`} />
            </Tab>
            <Tab
              selected={selectedCodeTab === 'camera'}>
              <code-snippet
                style={{ '--border-radius': '0 0 8px 8px' }}
                language="typescript"
                code={`
import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;
// Take a picture or video, or load from the library
const picture = await Camera.getPicture({
  encodingType: this.camera.EncodingType.JPEG
});
`} />
            </Tab>
            <Tab
              selected={selectedCodeTab === 'custom'}>
              <code-snippet
                style={{ '--border-radius': '0 0 8px 8px' }}
                language="typescript"
                code={`
import Foundation
import Capacitor

// Custom platform code, easily exposed to your web app
// through Capacitor plugin APIs. Build APIs that work
// across iOS, Android, and the web!
@objc(MyAwesomePlugin)
public class MyAwesomePlugin: CAPPlugin {

  @objc public func doNative(_ call: CAPPluginCall) {
    let alert = UIAlertController(title: "Title", message: "Please Select an Option", preferredStyle: .actionSheet)

    // ....
  }
}
`} />
            </Tab>
          </Tabs>
        </Col>
      </Grid>
    </ResponsiveContainer>
  </section>
)

const MetaHead = () => (
  <Helmet>
    <title>Capacitor: Cross-platform native runtime for web apps</title>
    <meta
      name="description"
      content={'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript'}
    />
    <meta
      property="og:description"
      content="Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript"
    />
    <meta property="og:site_name" content="Capacitor" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@capacitorjs" />
    <meta name="twitter:creator" content="capacitorjs" />
    <meta name="twitter:title" content="Build cross-platform apps with web technologies" />
    <meta name="twitter:description" content="Build cross-platform apps with web technologies" />
    <meta name="twitter:image" content="https://capacitorjs.com/assets/img/og.png" />
    <meta property="og:image" content="https://capacitorjs.com/assets/img/og.png" />
    <meta property="og:url" content="https://capacitorjs.com/" />
  </Helmet>
)
