import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {
  ResponsiveContainer,
  Grid,
  Col,
  Heading,
  Breakpoint,
  Button,
  PrismicRichText,
  PrismicResponsiveImage,
  Paragraph,
} from '../ds';
import { getPage } from '../data.server/prismic';

import './landing-page.scss';

interface Props {
  data: any;
}

function LandingPage(props: Props): JSX.Element {
  const [data, setData] = useState(null);
  const [showHubspotForm, setShowHubspotForm] = useState(false);
  const [hubspotFormSubmitted, setHubspotFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchPrismicContent = async () => {
      const page = await getPage({}, { pathname: '/' });
      setData(page);
    };
    fetchPrismicContent();
  }, []);

  if (!data) {
    return null;
  }

  const Top = () => {
    const { top, top__ctas, top__link, top__hero, top__icons } = data;
    const { primary, secondary } = top__ctas[0];

    return (
      <section id="top">
        <div className="background"></div>
        <ResponsiveContainer>
          <div className="heading-group">
            <Announcement />
            <PrismicRichText richText={top} paragraphLevel={2} />
            <div className="buttons">
              <Button
                kind="round"
                anchor
                href="/docs/getting-started"
                className="primary"
              >
                {primary} <span className="arrow"> -&gt;</span>
              </Button>
              <Button
                kind="round"
                variation="light"
                anchor
                href="docs/plugins"
                className="secondary"
              >
                {secondary}
              </Button>
            </div>
            <a className="link | ui-paragraph-4" href="/cordova">
              {top__link}
              <span className="arrow"> -&gt;</span>
            </a>
            <PrismicResponsiveImage
              loading="eager"
              image={top__icons}
              params={{
                w: '91',
                h: '16',
              }}
            />
          </div>
          <div className="image-wrapper">
            <PrismicResponsiveImage loading="eager" image={top__hero} />
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const Announcement = () => {
    const { tag_text, desktop_text, mobile_text, link } = data.announcement;
    const { target, url } = link;

    const newUrl = url.replace(window.location.origin, '');

    return (
      <a
        id="announcement"
        className="feature__register"
        href={newUrl}
        target={target}
        rel={target ? 'noopener' : undefined}
      >
        <div className="tag">{tag_text}</div>
        <Breakpoint sm={true} display="inline-block" className="text">
          <span className="text__content">
            {desktop_text} <span className="arrow">-&gt;</span>
          </span>
        </Breakpoint>
        <Breakpoint
          xs={true}
          sm={false}
          display="inline-block"
          className="text"
        >
          <span className="text__content">
            {mobile_text} <span className="arrow">-&gt;</span>
          </span>
        </Breakpoint>
      </a>
    );
  };

  const Started = () => {
    const { started, started__list, started__icons } = data;

    const panels = [
      <CodeBlock className="language-shell-session">
        {`$ npm install @capacitor/cli @capacitor/core
$ npx cap init`}
      </CodeBlock>,
      <CodeBlock className="language-shell-session">
        {`$ npx cap add ios
$ npx cap add android`}
      </CodeBlock>,
      <Tabs
        defaultValue="notifications"
        values={[
          { value: 'notifications', label: 'Notifications' },
          { value: 'geolocation', label: 'Geolocation' },
          { value: 'camera', label: 'Camera' },
          { value: 'custom', label: 'Custom' },
        ]}
      >
        <TabItem value="notifications">
          <CodeBlock className="language-typescript">
            {`import { Plugins } from '@capacitor/core';
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
});`}
          </CodeBlock>
        </TabItem>
        <TabItem value="geolocation">
          <CodeBlock className="language-typescript">
            {`import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
// get the users current position
const position = await Geolocation.getCurrentPosition();

// grab latitude & longitude
const latitude = position.coords.latitude;
const longitude = position.coords.longitude;
`}
          </CodeBlock>
        </TabItem>
        <TabItem value="camera">
          <CodeBlock className="language-typescript">
            {`import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;
// Take a picture or video, or load from the library
const picture = await Camera.getPicture({
  encodingType: this.camera.EncodingType.JPEG
});
`}
          </CodeBlock>
        </TabItem>
        <TabItem value="custom">
          <CodeBlock className="language-swift">
            {`import Foundation
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
          </CodeBlock>
        </TabItem>
      </Tabs>,
      //       <Tabs>
      //         <TabBar>
      //           <TabBarButton
      //             selected={this.selectedCodeTab === 'notifications'}
      //             tabSelect={() => (this.selectedCodeTab = 'notifications')}
      //           >
      //             Notifications
      //           </TabBarButton>
      //           <TabBarButton
      //             selected={this.selectedCodeTab === 'geolocation'}
      //             tabSelect={() => (this.selectedCodeTab = 'geolocation')}
      //           >
      //             Geolocation
      //           </TabBarButton>
      //           <TabBarButton
      //             selected={this.selectedCodeTab === 'camera'}
      //             tabSelect={() => (this.selectedCodeTab = 'camera')}
      //           >
      //             Camera
      //           </TabBarButton>
      //           <TabBarButton
      //             selected={this.selectedCodeTab === 'custom'}
      //             tabSelect={() => (this.selectedCodeTab = 'custom')}
      //           >
      //             Custom
      //           </TabBarButton>
      //         </TabBar>
      //         <Tab selected={this.selectedCodeTab === 'notifications'}>
      //           <code-snippet
      //             style={{ '--border-radius': '0 0 8px 8px' }}
      //             language="typescript"
      //             code={`
      // import { Plugins } from '@capacitor/core';
      // const { LocalNotifications } = Plugins;

      // LocalNotifications.schedule({
      //   notifications: [
      //     {
      //       title: "On sale",
      //       body: "Widgets are 10% off. Act fast!",
      //       id: 1,
      //       schedule: { at: new Date(Date.now() + 1000 * 5) },
      //       sound: null,
      //       attachments: null,
      //       actionTypeId: "",
      //       extra: null
      //     }
      //   ]
      // });
      // `}
      //           />
      //         </Tab>
      //         <Tab selected={this.selectedCodeTab === 'geolocation'}>
      //           <code-snippet
      //             style={{ '--border-radius': '0 0 8px 8px' }}
      //             language="typescript"
      //             code={`
      // import { Plugins } from '@capacitor/core';
      // const { Geolocation } = Plugins;
      // // get the users current position
      // const position = await Geolocation.getCurrentPosition();

      // // grab latitude & longitude
      // const latitude = position.coords.latitude;
      // const longitude = position.coords.longitude;
      // `}
      //           />
      //         </Tab>
      //         <Tab selected={this.selectedCodeTab === 'camera'}>
      //           <code-snippet
      //             style={{ '--border-radius': '0 0 8px 8px' }}
      //             language="typescript"
      //             code={`
      // import { Plugins } from '@capacitor/core';
      // const { Camera } = Plugins;
      // // Take a picture or video, or load from the library
      // const picture = await Camera.getPicture({
      //   encodingType: this.camera.EncodingType.JPEG
      // });
      // `}
      //           />
      //         </Tab>
      //         <Tab selected={this.selectedCodeTab === 'custom'}>
      //           <code-snippet
      //             style={{ '--border-radius': '0 0 8px 8px' }}
      //             language="typescript"
      //             code={`
      // import Foundation
      // import Capacitor

      // // Custom platform code, easily exposed to your web app
      // // through Capacitor plugin APIs. Build APIs that work
      // // across iOS, Android, and the web!
      // @objc(MyAwesomePlugin)
      // public class MyAwesomePlugin: CAPPlugin {

      //   @objc public func doNative(_ call: CAPPluginCall) {
      //   let alert = UIAlertController(title: "Title", message: "Please Select an Option", preferredStyle: .actionSheet)

      //   // ....
      //   }
      // }
      // `}
      //           />
      //         </Tab>
      //       </Tabs>,
    ];

    const dimensions = ['22x26', '27x23'];

    return (
      <ResponsiveContainer id="started" as="section">
        <div className="heading-group">
          <PrismicRichText richText={started} />
        </div>
        {started__list.map(({ number, title, text }, i) => (
          <div className="step">
            <sup className="ui-heading-6">{number}</sup>
            <div className="heading-panel-wrapper">
              <div className="heading-wrapper">
                <Heading>{title}</Heading>
                {i === 1 ? (
                  <div className="platforms">
                    {started__icons.map(({ icon }, i) => (
                      <PrismicResponsiveImage
                        image={icon}
                        width={dimensions[i].split('x')[0]}
                        height={dimensions[i].split('x')[1]}
                      />
                    ))}
                  </div>
                ) : null}
                {text ? <Paragraph>{text}</Paragraph> : null}
              </div>
              <div className="panel">{panels[i]}</div>
            </div>
          </div>
        ))}
      </ResponsiveContainer>
    );
  };

  const WhitepaperAd = () => {
    const { image, text, cta } = data.whitepaper_ad;
    const { line1, line2 } = text[0];

    return (
      <>
        <ResponsiveContainer id="whitepaper" as="section">
          <div className="content-wrapper">
            <div className="image-wrapper">
              <PrismicResponsiveImage image={image} />
            </div>
            <div className="info">
              <Heading>
                <span>{line1}</span> <span>{line2}</span>
              </Heading>
              <Button
                kind="round"
                anchor
                onClick={() => {
                  setShowHubspotForm(true);
                }}
              >
                {cta}
                <span className="arrow">-&gt;</span>
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
        <site-modal
          open={showHubspotForm}
          modalClose={() => setShowHubspotForm(false)}
        >
          <hgroup>
            <Heading level={2}>
              Building Cross-Platform Apps with Capacitor
            </Heading>
            <p>Fill out the form below to download our free whitepaper</p>
          </hgroup>
          <capacitor-hubspot-form
            formId={'9151dc0b-42d9-479f-b7b8-649e0e7bd1bc'}
            ajax={false}
            onFormSubmitted={() => setHubspotFormSubmitted(true)}
          />
        </site-modal>
      </>
    );
  };

  const Native = () => {
    const { native, native__list } = data;
    const dimensions = ['48x64', '60x64', '60x64'];

    return (
      <ResponsiveContainer id="native" as="section">
        <div className="heading-group">
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
  };

  const Features = () => {
    const { features, features__list, features__link } = data;
    const dimensions = [
      '40x32',
      '40x32',
      '32x32',
      '33x32',
      '28x32',
      '32x32',
      '32x32',
      '32x30',
    ];

    return (
      <section id="features">
        <ResponsiveContainer>
          <div className="heading-group">
            <PrismicRichText richText={features} />
            <a href="/docs/apis" className="link | ui-heading-4">
              {features__link}
              <span className="arrow">-&gt;</span>
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
  };

  const Framework = () => {
    const { framework, framework__list } = data;

    const logoTile = (logo: any) => (
      <PrismicResponsiveImage image={logo} width="272" height="200" />
    );

    return (
      <ResponsiveContainer id="framework" as="section">
        <div className="heading-group">
          <PrismicRichText richText={framework} paragraphLevel={2} />
        </div>
        <Grid>
          {framework__list.map(({ logo, link }) => (
            <Col sm={3} cols={6}>
              {link ? <a href={link}>{logoTile(logo)}</a> : logoTile(logo)}
            </Col>
          ))}
        </Grid>
      </ResponsiveContainer>
    );
  };

  const Companies = () => {
    const { companies, companies__list } = data;

    //array structure matches css div placement
    const dimensions = [
      //groups of 4 (2 groups of 2)
      [
        //groups of 2
        ['38x40', '62x32'],
        ['102x30', '82x28'],
      ],
      [
        ['41x40', '152x26'],
        ['40x40', '79x32'],
      ],
    ];

    return (
      <ResponsiveContainer id="companies" as="section">
        <div className="heading-group">
          <Paragraph level={2}>{companies}</Paragraph>
        </div>
        <div className="images">
          {dimensions.map((_, i1: number) => (
            //row of 4 images (2 groups of 2)
            <div className="image-row">
              {dimensions[i1].map((_, i2: number) => (
                //group of 2 images
                <div className="image-group">
                  {dimensions[i1][i2].map((dimensions, i3) => (
                    <PrismicResponsiveImage
                      image={companies__list[i1 * 4 + i2 * 2 + i3].logo}
                      width={dimensions.split('x')[0]}
                      height={dimensions.split('x')[1]}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    );
  };

  const GetStarted = () => {
    const Background = getStartedBackground;
    const { get_started, get_started__ctas } = data;
    const { primary, secondary } = get_started__ctas[0];

    return (
      <section id="get-started">
        <Background className="background" />
        <ResponsiveContainer>
          <div className="heading-group">
            <PrismicRichText richText={get_started} paragraphLevel={2} />
          </div>
          <div className="ctas">
            <Button
              href="/docs/getting-started"
              anchor
              kind="round"
              variation="light"
              className="primary"
              color="cyan"
            >
              {primary}
              <span className="arrow"> -&gt;</span>
            </Button>
            <Button
              href="/docs/plugins"
              kind="round"
              anchor
              className="secondary"
              color="cyan"
            >
              {secondary}
            </Button>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  const getStartedBackground = (props?: JSXBase.SVGAttributes) => (
    <svg
      viewBox="0 0 1800 492"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin slice"
      {...props}
    >
      <mask
        id="get_started_background_mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1800"
        height="492"
      >
        <rect width="1800" height="492" fill="#119EFF" />
      </mask>
      <g mask="url(#get_started_background_mask0)">
        <rect width="1800" height="492" fill="url(#paint0_linear)" />
        <path
          opacity="0.1"
          d="M359 -288H1825V-155.138L985.613 338L359 -31.7071V-288Z"
          fill="url(#paint1_linear)"
        />
        <path
          opacity="0.1"
          d="M-211 619H812V526.251L226.261 182L-211 440.086V619Z"
          fill="url(#paint2_linear)"
        />
        <path
          opacity="0.1"
          d="M1192 686H2215V593.251L1629.26 249L1192 507.086V686Z"
          fill="url(#paint3_linear)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="-6.6919e-06"
          y1="246"
          x2="1809"
          y2="246"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#37B3FF" />
          <stop offset="1" stopColor="#0097FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="1092"
          y1="-288"
          x2="1092"
          y2="338"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="300.5"
          y1="619"
          x2="300.5"
          y2="182"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="1703.5"
          y1="686"
          x2="1703.5"
          y2="249"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <Layout>
      <meta-tags />
      <Top />
      <Started />
      <WhitepaperAd />
      <Native />
      <Features />
      <Framework />
      <Companies />
      <GetStarted />
      <pre-footer />
      <capacitor-site-footer />
    </Layout>
  );
}

export default LandingPage;
