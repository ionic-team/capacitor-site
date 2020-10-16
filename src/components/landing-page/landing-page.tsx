import { Component, h, Host, Prop, State } from '@stencil/core';
import { href } from '../../stencil-router-v2';
import Helmet from '@stencil/helmet';
import {
  ResponsiveContainer,
  Grid,
  Col,
  Heading,
  Paragraph,
  Breakpoint,
  Button,
  PrismicRichText,
  PrismicResponsiveImage,
} from '@ionic-internal/ionic-ds';
import { Tabs, Tab, TabBar, TabBarButton } from '../tabs';
import FancyUnderline from '../FancyUnderline';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss',
  scoped: true,
})
export class LandingPage {
  @Prop() data: any;
  @State() selectedCodeTab: string = 'notifications';
  @State() showHubspotForm = false;
  @State() hubspotFormSubmitted = false;



  Top = () => {
    const { top, top__ctas, top__link, top__hero, top__icons } = this.data;
    const { primary, secondary } = top__ctas[0];

    return (
      <section id="top">
        <div class="background"></div>
        <ResponsiveContainer>
          <div class="heading-group">
            <Announcement data={this.data} />
            <PrismicRichText richText={top} paragraphLevel={2} />
            <div class="buttons">
              <Button 
                kind="round"
                anchor
                href="/docs/getting-started"
                class="primary"
              >
                {primary} <span class="arrow">-&gt;</span>
              </Button>
              <Button
                kind="round"
                variation="light"
                anchor
                href="/docs"
                class="secondary"
              >
                {secondary}
              </Button>
            </div>
            <a class="link | ui-paragraph-4" href="/cordova">
              {top__link}
              <span class="arrow">-&gt;</span>
            </a>
            <PrismicResponsiveImage
              loading="eager"
              image={top__icons}
              params = {{
                w: '91',
                h: '16'
              }}
            />
          </div>
          <div class="image-wrapper">
            <PrismicResponsiveImage
              loading="eager"
              image={top__hero}
            />
          </div>          
        </ResponsiveContainer>
      </section>
    );
  }

  Started = ({
    selectedCodeTab,
    setSelectedCodeTab,
  }: {
    selectedCodeTab: string;
    setSelectedCodeTab: (tab: string) => void;
  }) => {
    const { started, started__list, started__icons } = this.data;

    const panels = [
      <code-snippet
        language="shell-session"
        code={`npm install @capacitor/cli @capacitor/core\nnpx cap init`}
      />,
      <code-snippet
        language="shell-session"
        code={`npx cap add ios\nnpx cap add android`}
      />,
      <Tabs>
        <TabBar>
          <TabBarButton
            selected={selectedCodeTab === 'notifications'}
            tabSelect={() => setSelectedCodeTab('notifications')}
          >
            Notifications
          </TabBarButton>
          <TabBarButton
            selected={selectedCodeTab === 'geolocation'}
            tabSelect={() => setSelectedCodeTab('geolocation')}
          >
            Geolocation
          </TabBarButton>
          <TabBarButton
            selected={selectedCodeTab === 'camera'}
            tabSelect={() => setSelectedCodeTab('camera')}
          >
            Camera
          </TabBarButton>
          <TabBarButton
            selected={selectedCodeTab === 'custom'}
            tabSelect={() => setSelectedCodeTab('custom')}
          >
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
`}
          />
        </Tab>
        <Tab selected={selectedCodeTab === 'geolocation'}>
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
`}
          />
        </Tab>
        <Tab selected={selectedCodeTab === 'camera'}>
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
`}
          />
        </Tab>
        <Tab selected={selectedCodeTab === 'custom'}>
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
`}
          />
        </Tab>
      </Tabs>
    ]

    const dimensions = [ '22x26', '27x23']
    
  
    return (
      <ResponsiveContainer id="started" as="section">
        <div class="heading-group">
          <PrismicRichText richText={started} />
        </div>
        {started__list.map(({ number, title }, i) => (
          <div class="step">
            <sup class="ui-heading-6">{number}</sup>
            <div class="heading-wrapper">
              <Heading>{title}</Heading>
              {i === 1
              ? <div class="platforms">
                  {started__icons.map(({ icon }, i) => (
                    <PrismicResponsiveImage
                      image={icon}
                      width={dimensions[i].split('x')[0]}
                      height={dimensions[i].split('x')[1]}
                    />
                  ))}
                </div>
              : null
              }
            </div>
            <div class="panel">
              {panels[i]}
            </div>
          </div>
        ))}
      </ResponsiveContainer>
    )
  };

  Native = () => {
    const { native, native__list } = this.data;

    const dimensions = ['48x64', '60x64', '60x64'];

    return (
      <ResponsiveContainer id="native" as="section">
        <div class="heading-group">
          <PrismicRichText richText={native} />
        </div>
        <Grid>
          {native__list.map(({ icon, item }, i: number) => (
            <Col xs={6} sm={4} cols={12}>
              <PrismicResponsiveImage
                image={icon}
                width={dimensions[i].split('x')[0]}
                height={dimensions[i].split('x')[1]}
              />
              <PrismicRichText richText={item} />
            </Col>
          ))}
        </Grid>
      </ResponsiveContainer>
    );
  }

  Features = () => {
    const { features, features__list, features__link } = this.data;

    const dimensions = [
      '40x32', '40x32', '32x32', '33x32', '28x32', '32x32', '32x32', '32x30',
    ]

    return (
      <section id="features">
        <ResponsiveContainer>
          <div class="heading-group">
            <PrismicRichText richText={features} />
            <a href="/docs/api" class="link">
              {features__link}
              <span class="arrow">-&gt;</span>
            </a>
          </div>
          <Grid>
            {features__list.map(({ icon, item }, i: number) => (
              <Col xs={6} sm={4} md={3} cols={12}>
                <PrismicResponsiveImage
                  image={icon}
                  width={dimensions[i].split('x')[0]}
                  height={dimensions[i].split('x')[1]}
                />
                <PrismicRichText richText={item} />
              </Col>
            ))}
          </Grid>
        </ResponsiveContainer>
      </section>
    );
  }

  Framework = () => {
    const { framework, framework__list } = this.data;


    return (
      <ResponsiveContainer id="framework" as="section">
        <div class="heading-group">
          <PrismicRichText richText={framework} paragraphLevel={2} />
        </div>
        <Grid>
          {framework__list.map(({ logo }) => (
            <Col sm={3} cols={6}>
              <PrismicResponsiveImage
                image={logo}
                width={272}
                height={200}
              />
            </Col>
          ))}
        </Grid>
      </ResponsiveContainer>
    );
  }

  render() {
    const { Top, Started, Native, Features, Framework } = this;

    console.log(this.data);

    return (
      <Host>
        <MetaHead />
        <Top />
        <Started
          selectedCodeTab={this.selectedCodeTab}
          setSelectedCodeTab={(tab: string) => {
            this.selectedCodeTab = tab;
          }}
        />
        <WhitepaperCTA
          show={() => (this.showHubspotForm = true)}
          hide={() => (this.showHubspotForm = false)}
          shown={this.showHubspotForm}
          submitted={this.hubspotFormSubmitted}
        />
        <Native />
        <Features />
        <Framework />
      
        <pre-footer />
        <newsletter-signup />
        <capacitor-site-footer />
      </Host>
    );
  }
}



const WhitepaperCTA = ({ show, hide, shown, submitted }) => [
  <section class="whitepaperCta">
    <ResponsiveContainer>
      <img
        src="/assets/img/landing/book@2x.png"
        srcset="/assets/img/landing/book@1x.png 1x,
                    /assets/img/landing/book@2x.png 2x"
        loading="lazy"
        width="512"
        height="383"
        alt="Book Cover: Building cross-platform apps with Capacitor"
      />
      <div class="whitepaperCta__content">
        <Heading>
          See when and why to use Capacitor to build cross-platform apps.&nbsp;
          <span>We wrote a guide to help you get started.</span>
        </Heading>
        <Button anchor onClick={() => show()}>
          Read our Guide <span style={{ letterSpacing: '0' }}>{'->'}</span>
        </Button>
      </div>
    </ResponsiveContainer>
  </section>,
  <site-modal open={shown} modalClose={() => hide()}>
    <hgroup>
      <Heading level={2}>Building Cross-Platform Apps with Capacitor</Heading>
      <p>Fill out the form below to download our free whitepaper</p>
    </hgroup>
    <capacitor-hubspot-form
      formId={'9151dc0b-42d9-479f-b7b8-649e0e7bd1bc'}
      ajax={false}
      onFormSubmitted={() => submitted()}
    />
  </site-modal>,
];

const Announcement = ({ data }) => {
  if (!data?.tag_text) return '';
  return (
    <a
      class="feature__register"
      href={data.link.url}
      target="_blank"
      rel="noopener nofollow"
    >
      <div class="feature__register__tag">{data.tag_text}</div>
      <Breakpoint sm={true} display='inline-block' class="feature__register__text">
        <span class="text__content">
          {data.desktop_text}{' '}
          <span style={{ 'letter-spacing': '0' }}>-&gt;</span>
        </span>
      </Breakpoint>
      <Breakpoint
        xs={true}
        sm={false}
        display='inline-block'
        class="feature__register__text"
      >
        <span class="text__content">
          {data.mobile_text}{' '}
          <span style={{ 'letter-spacing': '0' }}>-&gt;</span>
        </span>
      </Breakpoint>
    </a>
  );
};

const MetaHead = () => (
  <Helmet>
    <title>Capacitor: Cross-platform native runtime for web apps</title>
    <meta
      name="description"
      content={
        'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript'
      }
    />
    <meta
      property="og:description"
      content="Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript"
    />
    <meta property="og:site_name" content="Capacitor" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@capacitorjs" />
    <meta name="twitter:creator" content="capacitorjs" />
    <meta
      name="twitter:title"
      content="Build cross-platform apps with web technologies"
    />
    <meta
      name="twitter:description"
      content="Build cross-platform apps with web technologies"
    />
    <meta
      name="twitter:image"
      content="https://capacitorjs.com/assets/img/og.png"
    />
    <meta
      property="og:image"
      content="https://capacitorjs.com/assets/img/og.png"
    />
    <meta property="og:url" content="https://capacitorjs.com/" />
  </Helmet>
);
