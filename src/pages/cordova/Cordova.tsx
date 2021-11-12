import { useState } from 'react';
import Link from 'next/link';
import AnnouncementBar from '../../components/announcement-bar/AnnouncementBar';
import CodeSnippet from '../../components/code-snippet/CodeSnippet';
import SiteFooter from '../../components/site/SiteFooter';
import SiteHeader from '../../components/site/SiteHeader';
import SiteMeta from '../../components/site/SiteMeta';
import SitePreFooter from '../../components/site/SitePreFooter';
import Heading from '../../components/ui/Heading';
import Paragraph from '../../components/ui/Paragraph';
import ResponsiveContainer from '../../components/ui/ResponsiveContainer';
import CordovaStyles from './Cordova.styles';
import CodeTabs from '../../components/code-tabs/CodeTabs';
import NewsletterSignup from '../../components/newsletter-signup/NewsletterSignup';

const CordovaPage = (data) => {
  const [selectedCodeTab, setSelectedCodeTab] = useState<string>('before');

  return (
    <>
      <SiteMeta title={`Cordova to Capacitor Migration`} description={'A step by step guide to migrating your app'} />
      <AnnouncementBar {...data.announcement_bar} />
      <SiteHeader />
      <CordovaStyles>
        <Top />
        <GettingStarted />

        <MoreResources />

        <ResponsiveContainer id="newsletter">
          <NewsletterSignup />
        </ResponsiveContainer>
        <SitePreFooter />
        <SiteFooter />
      </CordovaStyles>
    </>
  );
};

const Top = () => (
  <ResponsiveContainer id="top" as="section">
    <div className="heading-group">
      <Heading level={2} as="h1">
        Cordova to Capacitor Migration
      </Heading>
      <Paragraph level={2}>A modern development experience and 99% backward-compatibility with Cordova.</Paragraph>
      {/* <Button anchor href="#code-branch" id="get-started">
          Get Started
        </Button> */}
    </div>
  </ResponsiveContainer>
);

const GettingStarted = () => (
  <ResponsiveContainer id="getting-started" as="section">
    <article className="step">
      <sup className="ui-heading-6">01</sup>
      <div className="heading-group">
        <Heading level={3} id="code-branch">
          Create a new code branch.
        </Heading>
        <Paragraph>Recommended, but not required.</Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
          language="shell-session"
          code={`
cd my-app
git checkout -b cap-migration
          `}
        />
      </div>
    </article>
    <article className="step">
      <sup className="ui-heading-6">02</sup>
      <div className="heading-group">
        <Heading level={3}>Install Capacitor.</Heading>
        <Paragraph>Create the Capacitor app using the Cordova app's name and id found in `config.xml`.</Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
          language="shell-session"
          code={`
npm install @capacitor/cli @capacitor/core
npx cap init [name] [id]
`}
        />
      </div>
    </article>
    <article className="step">
      <sup className="ui-heading-6">03</sup>
      <div className="heading-group">
        <Heading level={3}>Build the Web App.</Heading>
        <Paragraph>
          The compiled web assets will be copied into each Capacitor native platform during the next step.
        </Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
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
    <article className="step">
      <sup className="ui-heading-6">04</sup>
      <div className="heading-group">
        <Heading level={3}>Install the native platforms you want to target.</Heading>
        <div className="platforms">
          <img
            loading="lazy"
            src="/assets/img/landing/apple.png"
            alt="Apple"
            className="apple"
            width="22"
            height="26"
          />
          <img
            loading="lazy"
            src="/assets/img/landing/android.png"
            alt="Android"
            className="android"
            width="27"
            height="23"
          />
        </div>
        <Paragraph>
          Capacitor native projects exist in their own top-level folders and should be considered part of your app
          (check them into source control). Any existing Cordova plugins are automatically installed into each native
          project. 🎉
        </Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
          language="shell-session"
          code={`
npx cap add android
npx cap add ios
`}
        />
      </div>
    </article>
    <article className="step">
      <sup className="ui-heading-6">05</sup>
      <div className="heading-group">
        <Heading level={3}>Recreate Splash Screens and Icons.</Heading>
        <Paragraph>
          Reuse the existing splash screen/icon images, located in the top-level `resources` folder of your Cordova
          project, using the `cordova-res` tool. Images are copied into each native project.
        </Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
          language="shell-session"
          code={`
npm install -g cordova-res

cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
`}
        />
      </div>
    </article>
    <article className="step">
      <sup className="ui-heading-6">06</sup>
      <div className="heading-group">
        <Heading level={3}>Audit existing Cordova plugins.</Heading>
        <Paragraph>
          Review all of Capacitor's{' '}
          <Link href="/docs/apis">
            <a target="_blank">core</a>
          </Link>{' '}
          and{' '}
          <Link href="/docs/plugins/community">
            <a target="_blank">community</a>
          </Link>{' '}
          plugins. You may be able to switch to the Capacitor-equivalent Cordova plugin, such as the Camera.
        </Paragraph>
        <Paragraph>Remove unneeded ones to improve performance and reduce app size.</Paragraph>
      </div>
      <div className="code-panel">
        <CodeTabs
          data={{
            tabs: ['Cordova Camera', 'Capacitor Camera'],
            languages: ['typescript'],
            code: [
              `
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
`,
            ],
          }}
        />
      </div>
    </article>
    <article className="step">
      <sup className="ui-heading-6">07</sup>
      <div className="heading-group">
        <Heading level={3}>Remove Cordova from your project.</Heading>
        <Paragraph>After successful migration testing, Cordova can be removed from the project.</Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
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
    <article className="step">
      <sup className="ui-heading-6">08</sup>
      <div className="heading-group">
        <Heading level={3}>Continue your Capacitor Journey.</Heading>
        <Paragraph>
          This is only the beginning. Learn more about
          <Link href="/docs/plugins/cordova">
            <a>using Cordova plugins</a>
          </Link>{' '}
          in a Capacitor project, check out the Capacitor{' '}
          <Link href="/docs/basics/workflow">
            <a>development workflow</a>
          </Link>
          , or create your own{' '}
          <Link href="/docs/plugins">
            <a>native plugin</a>
          </Link>
          .
        </Paragraph>
      </div>
      <div className="code-panel">
        <CodeSnippet
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

const MoreResources = () => (
  <ResponsiveContainer id="more-resources">
    <div className="heading-group">
      <Heading level={3}>More Resources</Heading>
      <Paragraph>
        Explore these resources to learn more about Capacitor
        <br />
        and make your Cordova migration easier.
      </Paragraph>
    </div>
    {/*
    <MoreResources
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
    */}
  </ResponsiveContainer>
);

export default CordovaPage;
