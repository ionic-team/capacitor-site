import { Component, h, Host, Prop, State } from '@stencil/core';
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
} from '@ionic-internal/ionic-ds';
import { Fragment, JSXBase } from '@stencil/core/internal';
import { href } from '@stencil/router';

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

  render() {
    const {
      Top,
      Started,
      Native,
      Features,
      Framework,
      Tweets,
      Cta,
      Companies,
      GetStarted,
      WhitepaperAd,
    } = this;

    return (
      <Host>
        <meta-tags />
        <Top />
        <Started />
        <WhitepaperAd />
        <Native />
        <Features />
        <Framework />
        <Tweets />
        <Cta />
        <Companies />
        <GetStarted />
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }

  Top = () => {
    const { Announcement } = this;
    const { top, top__ctas, top__link, top__hero, top__icons } = this.data;
    const { primary, secondary } = top__ctas[0];

    return (
      <section id="top">
        <div class="background"></div>
        <ResponsiveContainer>
          <div class="heading-group">
            <Announcement />
            <PrismicRichText richText={top} paragraphLevel={2} />
            <div class="buttons">
              <Button
                kind="round"
                anchor
                {...href('/docs/getting-started')}
                class="primary"
              >
                {primary} <span class="arrow"> -&gt;</span>
              </Button>
              <Button
                kind="round"
                variation="light"
                anchor
                {...href('docs/plugins')}
                class="secondary"
              >
                {secondary}
              </Button>
            </div>
            <a class="link | ui-paragraph-4" {...href('/cordova')}>
              {top__link}
              <span class="arrow"> -&gt;</span>
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
          <div class="image-wrapper">
            <PrismicResponsiveImage loading="eager" image={top__hero} />
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  Announcement = () => {
    const {
      tag_text,
      desktop_text,
      mobile_text,
      link,
    } = this.data.announcement;
    const { target, url } = link;

    const newUrl = url.replace(window.location.origin, '');

    return (
      <a
        id="announcement"
        class="feature__register"
        {...href(newUrl)}
        target={target}
        rel={target ? 'noopener' : undefined}
      >
        <div class="tag">{tag_text}</div>
        <Breakpoint sm={true} display="inline-block" class="text">
          <span class="text__content">
            {desktop_text} <span class="arrow">-&gt;</span>
          </span>
        </Breakpoint>
        <Breakpoint xs={true} sm={false} display="inline-block" class="text">
          <span class="text__content">
            {mobile_text} <span class="arrow">-&gt;</span>
          </span>
        </Breakpoint>
      </a>
    );
  };

  Started = () => {
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
      <code-tabs
        data={{
          tabs: ['Notifications', 'Geolocation', 'Camera', 'Custom'],
          languages: ['typescript'],
          code: [
            `
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
});`, //-----------------------------------
            `
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
// get the users current position
const position = await Geolocation.getCurrentPosition();

// grab latitude & longitude
const latitude = position.coords.latitude;
const longitude = position.coords.longitude;
`,
            `
import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;
// Take a picture or video, or load from the library
const picture = await Camera.getPicture({
  encodingType: this.camera.EncodingType.JPEG
});
`, //-----------------------------------
            `
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
`,
          ],
        }}
      />,
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
        <div class="heading-group">
          <PrismicRichText richText={started} />
        </div>
        {started__list.map(({ number, title, text }, i) => (
          <div class="step">
            <sup class="ui-heading-6">{number}</sup>
            <div class="heading-panel-wrapper">
              <div class="heading-wrapper">
                <Heading>{title}</Heading>
                {i === 1 ? (
                  <div class="platforms">
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
              <div class="panel">{panels[i]}</div>
            </div>
          </div>
        ))}
      </ResponsiveContainer>
    );
  };

  WhitepaperAd = () => {
    const { image, text, cta } = this.data.whitepaper_ad;
    const { line1, line2 } = text[0];

    return (
      <Fragment>
        <ResponsiveContainer id="whitepaper" as="section">
          <div class="content-wrapper">
            <div class="image-wrapper">
              <PrismicResponsiveImage image={image} />
            </div>
            <div class="info">
              <Heading>
                <span>{line1}</span> <span>{line2}</span>
              </Heading>
              <Button
                kind="round"
                anchor
                onClick={() => {
                  this.showHubspotForm = true;
                }}
              >
                {cta}
                <span class="arrow">-&gt;</span>
              </Button>
            </div>
          </div>
        </ResponsiveContainer>
        <site-modal
          open={this.showHubspotForm}
          modalClose={() => (this.showHubspotForm = false)}
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
            onFormSubmitted={() => this.hubspotFormSubmitted}
          />
        </site-modal>
      </Fragment>
    );
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
  };

  Features = () => {
    const { features, features__list, features__link } = this.data;
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
          <div class="heading-group">
            <PrismicRichText richText={features} />
            <a {...href('/docs/apis')} class="link | ui-heading-4">
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
  };

  Framework = () => {
    const { framework, framework__list } = this.data;

    const logoTile = (logo: any) => (
      <PrismicResponsiveImage image={logo} width="272" height="200" />
    );

    return (
      <ResponsiveContainer id="framework" as="section">
        <div class="heading-group">
          <PrismicRichText richText={framework} paragraphLevel={2} />
        </div>
        <Grid>
          {framework__list.map(({ logo, link }) => (
            <Col sm={3} cols={6}>
              {link ? <a {...href(link)}>{logoTile(logo)}</a> : logoTile(logo)}
            </Col>
          ))}
        </Grid>
      </ResponsiveContainer>
    );
  };

  Tweets = () => {
    const {
      tweets,
      tweets__list,
      tweets__bottom,
      tweets__bottom__list,
    } = this.data;
    const { title } = tweets[0];
    const { emoji, text } = tweets__bottom[0];

    return (
      <section id="tweets">
        <ResponsiveContainer>
          <div class="heading-group">
            <PrismicRichText richText={title} />
          </div>
          <div class="tweets">
            {tweets__list.map(({ name, handle, text, image }, i) => (
              <article class="tweet" key={i}>
                <div class="title-row">
                  <PrismicResponsiveImage image={image} />
                  <div class="title">
                    <Heading level={5} as="h3">
                      {name}
                    </Heading>
                    <Paragraph level={6}>{handle}</Paragraph>
                  </div>
                  <svg
                    width="16"
                    height="13"
                    viewBox="0 0 16 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 1.54036C15.41 1.80104 14.7794 1.97708 14.1149 2.05833C14.793 1.65208 15.3151 1.00885 15.5592 0.24375C14.9252 0.619531 14.2234 0.89375 13.474 1.03932C12.8739 0.399479 12.0195 0 11.0769 0C9.26298 0 7.79487 1.46927 7.79487 3.28047C7.79487 3.53776 7.822 3.78828 7.87963 4.02865C5.15024 3.89323 2.72939 2.58646 1.1121 0.599219C0.830685 1.08333 0.667938 1.6487 0.667938 2.24792C0.667938 3.38542 1.25111 4.39089 2.13266 4.97995C1.59017 4.96641 1.08159 4.81745 0.640814 4.57031V4.61094C0.640814 6.20208 1.77326 7.52578 3.27527 7.82708C3.00064 7.90156 2.70905 7.94219 2.41068 7.94219C2.20047 7.94219 1.99364 7.92188 1.7936 7.88125C2.21064 9.18464 3.42445 10.1326 4.86205 10.1596C3.73978 11.0398 2.32253 11.5646 0.783217 11.5646C0.518754 11.5646 0.257682 11.5477 0 11.5172C1.44776 12.4583 3.17355 13 5.02479 13C11.0701 13 14.3725 7.99974 14.3725 3.66302C14.3725 3.52083 14.3691 3.37865 14.3624 3.23984C15.0032 2.77604 15.5592 2.20052 16 1.54036Z"
                      fill="#1DA1F2"
                    />
                  </svg>
                </div>

                <PrismicRichText
                  richText={text}
                  paragraphLevel={4}
                  className="content"
                />
              </article>
            ))}
          </div>
          <div class="bottom">
            <Paragraph class="emoji">{emoji}</Paragraph>
            <PrismicRichText richText={text} paragraphLevel={1} />
            <div class="links">
              {tweets__bottom__list.map(({ icon, text, link }) => (
                <a href={link.url} target={link.target}>
                  <article>
                    <PrismicResponsiveImage image={icon} />
                    <Heading level={4}>{text}</Heading>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  // Companies = () => {
  //   const { companies, companies__list } = this.data;

  //   //array structure matches css div placement
  //   const dimensions = [
  //     //groups of 4 (2 groups of 2)
  //     [
  //       //groups of 2
  //       ['38x40', '62x32'],
  //       ['102x30', '82x28'],
  //     ],
  //     [
  //       ['41x40', '152x26'],
  //       ['40x40', '79x32'],
  //     ],
  //   ];

  //   return (
  //     <ResponsiveContainer id="companies" as="section">
  //       <div class="heading-group">
  //         <Paragraph level={2}>{companies}</Paragraph>
  //       </div>
  //       <div class="images">
  //         {dimensions.map((_, i1: number) => (
  //           //row of 4 images (2 groups of 2)
  //           <div class="image-row">
  //             {dimensions[i1].map((_, i2: number) => (
  //               //group of 2 images
  //               <div class="image-group">
  //                 {dimensions[i1][i2].map((dimensions, i3) => (
  //                   <PrismicResponsiveImage
  //                     image={companies__list[i1 * 4 + i2 * 2 + i3].logo}
  //                     width={dimensions.split('x')[0]}
  //                     height={dimensions.split('x')[1]}
  //                   />
  //                 ))}
  //               </div>
  //             ))}
  //           </div>
  //         ))}
  //       </div>
  //     </ResponsiveContainer>
  //   );
  // };

  Cta = () => {
    const { cta } = this.data;
    const { image, title, text, cta1 } = cta[0];

    return (
      <ResponsiveContainer as="section" id="cta">
        <PrismicRichText richText={title} />
        <div class="wrapper">
          <div class="card">
            <PrismicResponsiveImage image={image} class="background" />
            <div class="heading-group">
              <PrismicRichText richText={text} paragraphLevel={1} />
              <Button kind="round" {...href('/enterprise')}>
                {cta1} <span class="arrow"> -&gt;</span>
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    );
  };

  Companies = () => {
    const { companies__list2 } = this.data;

    const dimensions = [
      '33x42',
      '31x42',
      '32x36',
      '34x34',
      '51x30',
      '35x35',
      '58x25',
      '35x35',
    ];

    return (
      <ResponsiveContainer as="section" id="companies">
        <div class="wrapper">
          <div class="image-group first">
            {companies__list2.slice(0, 4).map(({ logo }, i) => (
              <PrismicResponsiveImage
                image={logo}
                width={dimensions[i].split('x')[0]}
                height={dimensions[i].split('x')[1]}
              />
            ))}
          </div>
          <div class="image-group second">
            {companies__list2.slice(4, 8).map(({ logo }, i) => (
              <PrismicResponsiveImage
                image={logo}
                width={dimensions[i + 4].split('x')[0]}
                height={dimensions[i + 4].split('x')[1]}
              />
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    );
  };

  GetStarted = () => {
    const Background = this.getStartedBackground;
    const { get_started, get_started__ctas } = this.data;
    const { primary, secondary } = get_started__ctas[0];

    return (
      <section id="get-started">
        <Background class="background" />
        <ResponsiveContainer>
          <div class="heading-group">
            <PrismicRichText richText={get_started} paragraphLevel={2} />
          </div>
          <div class="ctas">
            <Button
              {...href('/docs/getting-started')}
              anchor
              kind="round"
              variation="light"
              class="primary"
              color="cyan"
            >
              {primary}
              <span class="arrow"> -&gt;</span>
            </Button>
            <Button
              {...href('/docs/plugins')}
              kind="round"
              anchor
              class="secondary"
              color="cyan"
            >
              {secondary}
            </Button>
          </div>
        </ResponsiveContainer>
      </section>
    );
  };

  getStartedBackground = (props?: JSXBase.SVGAttributes) => (
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
          <stop stop-color="#37B3FF" />
          <stop offset="1" stop-color="#0097FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="1092"
          y1="-288"
          x2="1092"
          y2="338"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="white" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="300.5"
          y1="619"
          x2="300.5"
          y2="182"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="1703.5"
          y1="686"
          x2="1703.5"
          y2="249"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}
