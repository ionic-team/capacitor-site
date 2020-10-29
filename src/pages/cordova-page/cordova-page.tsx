import { Component, h, Host, State } from '@stencil/core';

import Helmet from '@stencil/helmet';
import {
  ResponsiveContainer,
  Paragraph,
  Heading,
} from '@ionic-internal/ionic-ds';
import { href } from '@stencil/router';

@Component({
  tag: 'cordova-page',
  styleUrl: 'cordova-page.scss',
  scoped: true,
})
export class CordovaPage {
  @State() selectedCodeTab: string = 'before';

  render() {
    const { Top, GettingStarted, MoreResources } = this;

    return (
      <Host>
        <MetaHead />

        <Top />
        <GettingStarted />

        <MoreResources />

        <ResponsiveContainer id="newsletter">
          <newsletter-signup />
        </ResponsiveContainer>
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }

  Top = () => (
    <ResponsiveContainer id="top" as="section">
      <div class="heading-group">
        <Heading level={2} as="h1">
          Cordova to Capacitor Migration
        </Heading>
        <Paragraph level={2}>
          A modern development experience and 99% backward-compatibility with
          Cordova.
        </Paragraph>
        {/* <Button anchor href="#code-branch" id="get-started">
          Get Started
        </Button> */}
      </div>
    </ResponsiveContainer>
  );

  GettingStarted = () => (
    <ResponsiveContainer id="getting-started" as="section">
      <article class="step">
        <sup class="ui-heading-6">01</sup>
        <div class="heading-group">
          <Heading level={3} id="code-branch">
            Create a new code branch.
          </Heading>
          <Paragraph>Recommended, but not required.</Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
cd my-app
git checkout -b cap-migration
          `}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">02</sup>
        <div class="heading-group">
          <Heading level={3}>Install Capacitor.</Heading>
          <Paragraph>
            Create the Capacitor app using the Cordova app's name and id found
            in `config.xml`.
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
npm install @capacitor/cli @capacitor/core
npx cap init [name] [id]
`}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">03</sup>
        <div class="heading-group">
          <Heading level={3}>Build the Web App.</Heading>
          <Paragraph>
            The compiled web assets will be copied into each Capacitor native
            platform during the next step.
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
# Most web apps
npm run build

# Ionic app
ionic build
`}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">04</sup>
        <div class="heading-group">
          <Heading level={3}>
            Install the native platforms you want to target.
          </Heading>
          <div class="platforms">
            <img
              loading="lazy"
              src="/assets/img/landing/apple.png"
              alt="Apple"
              class="apple"
              width="22"
              height="26"
            />
            <img
              loading="lazy"
              src="/assets/img/landing/android.png"
              alt="Android"
              class="android"
              width="27"
              height="23"
            />
          </div>
          <Paragraph>
            Capacitor native projects exist in their own top-level folders and
            should be considered part of your app (check them into source
            control). Any existing Cordova plugins are automatically installed
            into each native project. 🎉
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
npx cap add android
npx cap add ios
`}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">05</sup>
        <div class="heading-group">
          <Heading level={3}>Recreate Splash Screens and Icons.</Heading>
          <Paragraph>
            Reuse the existing splash screen/icon images, located in the
            top-level `resources` folder of your Cordova project, using the
            `cordova-res` tool. Images are copied into each native project.
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
npm install -g cordova-res

cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
`}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">06</sup>
        <div class="heading-group">
          <Heading level={3}>Audit existing Cordova plugins.</Heading>
          <Paragraph>
            Review all of Capacitor's{' '}
            <a {...href('/docs/apis')} target="_blank">
              core
            </a>{' '}
            and{' '}
            <a {...href('/docs/plugins/community')} target="_blank">
              community
            </a>{' '}
            plugins. You may be able to switch to the Capacitor-equivalent
            Cordova plugin, such as the Camera.
          </Paragraph>
          <Paragraph>
            Remove unneeded ones to improve performance and reduce app size.
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-tabs
            data={{
              tabs: ['Cordova Camera', 'Capacitor Camera'],
              languages: ['typescript'],
              code: [`
import { Camera } from '@ionic-native/camera/ngx';

constructor(private camera: Camera) {}

const photo = await this.camera.getPicture({
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  allowEdit: true,
  saveToPhotoAlbum: true
});
`, //----------------------------------
`
import { Plugins } from '@capacitor/core';

const { Camera } = Plugins;

const photo = await Camera.getPhoto({
  quality: 100,
  resultType: CameraResultType.Uri,
  allowEditing: true,
  saveToGallery: true
});
`]
            }}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">07</sup>
        <div class="heading-group">
          <Heading level={3}>Remove Cordova from your project.</Heading>
          <Paragraph>
            After successful migration testing, Cordova can be removed from the
            project.
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
# Remove a Cordova plugin
npm uninstall cordova-plugin-name
npx cap sync

# Delete Cordova folders and files
rm config.xml
rm -R platforms/
rm -R plugins/
`}
          />
        </div>
      </article>
      <article class="step">
        <sup class="ui-heading-6">08</sup>
        <div class="heading-group">
          <Heading level={3}>Continue your Capacitor Journey.</Heading>
          <Paragraph>
            This is only the beginning. Learn more about{' '}
            <a {...href('/docs/cordova/using-cordova-plugins')}>
              using Cordova plugins
            </a>{' '}
            in a Capacitor project, check out the Capacitor{' '}
            <a {...href('/docs/basics/workflow')}>development workflow</a>, or
            create your own <a {...href('/docs/plugins')}>native plugin</a>.
          </Paragraph>
        </div>
        <div class="code-panel">
          <code-snippet
            language="shell-session"
            code={`
# Install a Cordova plugin
npm install cordova-plugin-name
npx cap sync

# Create a custom plugin
npx @capacitor/cli plugin:generate
`}
          />
        </div>
      </article>
    </ResponsiveContainer>
  );

  MoreResources = () => (
    <ResponsiveContainer id="more-resources">
      <div class="heading-group">
        <Heading level={3}>More Resources</Heading>
        <Paragraph>
          Explore these resources to learn more about Capacitor
          <br />
          and make your Cordova migration easier.
        </Paragraph>
      </div>
      <more-resources
        resourceData={[
          {
            uid: 'capacitor-vs-cordova-modern-hybrid-app-development',
            type: 'article',
          },
          { uid: 'capacitor-2-launch', type: 'webinar' },
          {
            uid: 'migrating-from-phonegap-build-to-ionic-appflow',
            type: 'blog',
          },
          {
            uid: 'thanks-to-capacitor-ive-fallen-in-love-with-mobile-again',
            type: 'blog',
          },
          { uid: 'the-modern-hybrid-app-developer', type: 'blog' },
        ]}
        routing={{
          base: 'https://ionicframework.com/resources',
        }}
      />
    </ResponsiveContainer>
  );
}

const MetaHead = () => (
  <Helmet>
    <title>Capacitor: Cross-platform native runtime for web apps</title>
    <meta
      name="description"
      content={
        'Build iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript'
      }
    />
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
  </Helmet>
);
