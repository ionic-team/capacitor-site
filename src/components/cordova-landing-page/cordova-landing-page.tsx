import { Component, h, Host, State } from '@stencil/core';

import Helmet from '@stencil/helmet';
import { ResponsiveContainer, Grid, Col, Paragraph, Heading } from '@ionic-internal/sites-shared';
import { Tabs, Tab, TabBar, TabBarButton } from '../tabs';

@Component({
  tag: 'cordova-landing-page',
  styleUrl: 'cordova-landing-page.scss',
  scoped: true
})
export class CordovaLandingPage {
  @State() selectedCodeTab: string = 'before' ;
  
  render() {
    return (
      <Host>
        <MetaHead />
        <section class="hero">
          <ResponsiveContainer>
            <Grid>
              <Col md={8} sm={8} xs={8} cols={12}>
                <hgroup class="hero__heading">
                  <Heading level={2}>
                    Cordova to Capacitor Migration
                  </Heading>
                  <Heading level={3}>
                  99% backward-compatibility with Cordova and a modern development experience. <a href="/docs/cordova" target="_blank">Learn more.</a>
                  </Heading>
                </hgroup>
              </Col>
            </Grid>
          </ResponsiveContainer>
        </section>
        <GettingStartedSection
          selectedCodeTab={this.selectedCodeTab}
          setSelectedCodeTab={(tab: string) => { this.selectedCodeTab = tab}} />

        <MoreResourcesSection />
        <newsletter-signup />
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }
}

const GettingStartedSection = ({ selectedCodeTab, setSelectedCodeTab}: { selectedCodeTab: string, setSelectedCodeTab: (tab: string) => void }) => (
  <section class="section--getting-started">
    <ResponsiveContainer>
      <Grid class="section--getting-started__step">
        <Col cols={1}>01</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Create a new code branch.</Heading>
          <Paragraph>
            Recommended, but not required.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
cd my-app
git checkout -b cap-migration
          `}/>
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>02</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Install Capacitor.</Heading>
          <Paragraph>
            Create the Capacitor app using the Cordova app's name and id found in `config.xml`.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
npm install @capacitor/cli @capacitor/core
npx cap init [name] [id]
`} />
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>03</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Build the Web App.</Heading>
          <Paragraph>
            The compiled web assets will be copied into each Capacitor native platform 
            during the next step.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
# Most web apps
npm run build

# Ionic app
ionic build
`} />
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>04</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Install the native platforms you want to target.</Heading>
          <img src="/assets/img/landing/apple.png" alt="Apple" class="apple" />
          <img src="/assets/img/landing/android.png" alt="Android" class="android" />
          <Paragraph>
          Capacitor native projects exist in their own top-level folders and should be considered 
          part of your app (check them into source control).
          Any existing Cordova plugins are automatically installed into each native project. 🎉
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
npx cap add android
npx cap add ios
`} />
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>05</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Recreate Splash Screens and Icons.</Heading>
          <Paragraph>
          Reuse the existing splash screen/icon images, located in the top-level `resources` folder of your Cordova project, 
          using the `cordova-res` tool. Images are copied into each native project.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
npm install -g cordova-res

cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
`} />
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>06</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Audit existing Cordova plugins.</Heading>
          <Paragraph>
          Review all of Capacitor's <a href="/docs/apis" target="_blank">core</a> and <a href="/docs/community/plugins" target="_blank">community</a> plugins. 
            You may be able to switch to the Capacitor-equivalent Cordova plugin, such as the Camera.
          </Paragraph>
          <Paragraph>
            Remove unneeded ones to improve performance and reduce app size.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <Tabs>
            <TabBar>
              <TabBarButton
                selected={selectedCodeTab === 'before'}
                tabSelect={() => setSelectedCodeTab('before')}>
                Cordova Camera
              </TabBarButton>
              <TabBarButton
                selected={selectedCodeTab === 'after'}
                tabSelect={() => setSelectedCodeTab('after')}>
                Capacitor Camera
              </TabBarButton>
            </TabBar>
            <Tab selected={selectedCodeTab === 'before'}>
              <code-snippet
                style={{ '--border-radius': '0 0 8px 8px' }}
                language="typescript"
                code={`
import { Camera } from '@ionic-native/camera/ngx';

constructor(private camera: Camera) {}

const photo = await this.camera.getPicture({
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  allowEdit: true,
  saveToPhotoAlbum: true
});
`} />
            </Tab>
            <Tab
              selected={selectedCodeTab === 'after'}>
              <code-snippet
                style={{ '--border-radius': '0 0 8px 8px' }}
                language="typescript"
                code={`
import { Plugins } from '@capacitor/core';

const { Camera } = Plugins;

const photo = await Camera.getPhoto({
  quality: 100,
  resultType: CameraResultType.Uri,
  allowEditing: true,
  saveToGallery: true
});
`} />
            </Tab>
        </Tabs>
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>07</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Remove Cordova from your project.</Heading>
          <Paragraph>
          After successful migration testing, Cordova can be removed from the project.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
# Remove a Cordova plugin
npm uninstall cordova-plugin-name
npx cap sync

# Delete Cordova folders and files
rm config.xml
rm -R platforms/
rm -R plugins/
`} />
        </Col>
      </Grid>
      <Grid class="section--getting-started__step">
        <Col cols={1}>08</Col>
        <Col md={5} sm={5} xs={5} cols={12}>
          <Heading level={3}>Continue your Capacitor Journey.</Heading>
          <Paragraph>
          This is only the beginning. Learn more about <a href="/docs/cordova/using-cordova-plugins" target="_blank">using Cordova plugins</a> in 
          a Capacitor project, check out the Capacitor <a href="/docs/basics/workflow" target="_blank">development workflow</a>, or 
          create your own <a href="/docs/plugins" target="_blank">native plugin</a>.
          </Paragraph>
        </Col>
        <Col md={6} sm={6} xs={6} cols={12}>
          <code-snippet language="shell-session" code={`
# Install a Cordova plugin
npm install cordova-plugin-name
npx cap sync

# Create a custom plugin
npx @capacitor/cli plugin:generate
`} />
        </Col>
      </Grid>
      </ResponsiveContainer>
      </section>
)

const MoreResourcesSection = () => (
  <ResponsiveContainer class="section--more-resources">
    <hgroup>
      <Heading level={3}>More Resources</Heading>
      <Paragraph>
        Explore these resources to learn more about Capacitor
        <br />
        and make your Cordova migration easier.
      </Paragraph>
    </hgroup>
    <more-resources resources={[
      { uid: 'capacitor-vs-cordova-modern-hybrid-app-development', type: 'article' },
      { uid: 'capacitor-2-launch', type: 'webinar' },
      { uid: 'migrating-from-phonegap-build-to-ionic-appflow', type: 'blog' },
      { uid: 'thanks-to-capacitor-ive-fallen-in-love-with-mobile-again', type: 'blog' },
      { uid: 'the-modern-hybrid-app-developer', type: 'blog' },
    ]} />
  </ResponsiveContainer>
)

const MetaHead = () => (
  <Helmet>
    <title>Capacitor: Cross-platform native runtime for web apps</title>
    <meta
      name="description"
      content={'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript'}
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@capacitorjs" />
    <meta name="twitter:creator" content="capacitorjs" />
    <meta name="twitter:title" content="Build cross-platform apps with web technologies" />
    <meta
      name="twitter:description"
      content="Build cross-platform apps with web technologies"
    />
  </Helmet>
)
