import CodeSnippet from '../../components/code-snippet/CodeSnippet';
import Heading from '../../components/ui/Heading';
import Paragraph from '../../components/ui/Paragraph';
import ResponsiveContainer from '../../components/ui/ResponsiveContainer';

const SolutionEmber = () => {
  return (
    <>
      <ResponsiveContainer id="getting-started" as="section">
        <article className="step">
          <sup className="ui-heading-6">01</sup>
          <div className="heading-group">
            <Heading level={3} id="install">
              Install Capacitor.
            </Heading>
            <Paragraph>Add Capacitor to your project and create a config for your app</Paragraph>
          </div>
          <div className="code-panel">
            <CodeSnippet
              language="shell-session"
              code={`
npm install @capacitor/core @capacitor/cli
npx cap init [name] [id] --web-dir=dist
`}
            />
          </div>
        </article>

        <article className="step">
          <sup className="ui-heading-6">02</sup>
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
npm run build
`}
            />
          </div>
        </article>

        <article className="step">
          <sup className="ui-heading-6">03</sup>
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
              Capacitor's native projects exist in their own top-level folders and should be considered part of your app
              (check them into source control).
            </Paragraph>
          </div>
          <div className="code-panel">
            <CodeSnippet
              language="shell-session"
              code={`
npm i @capacitor/ios @capacitor/android
npx cap add android
npx cap add ios
`}
            />
          </div>
        </article>

        <article className="step">
          <sup className="ui-heading-6">04</sup>
          <div className="heading-group">
            <Heading level={3}>Adding calls to Native APIs</Heading>
            <Paragraph>
              With Capacitor installed, adding calls to native device features is as straight forward as calling other
              JavaScript methods
            </Paragraph>
          </div>
          <div className="code-panel">
            <CodeSnippet
              language="javascript"
              code={`
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Geolocation } from '@capacitor/geolocation';
export default class GeolocationComponent extends Component {
  @tracked loc = null;

  @action
  async getCurrentPosition(){
    const loc = await Geolocation.getCurrentPosition()
    this.loc = loc
  }
}
`}
            />
          </div>
        </article>
      </ResponsiveContainer>
      <section id="continue">
        <ResponsiveContainer>
          <Heading level={3}>Continue your Capacitor Journey.</Heading>
          <Paragraph>
            This is only the beginning. Learn more about the Capacitor{' '}
            <a href="/docs/basics/workflow" target="_blank">
              development workflow
            </a>{' '}
            or using more{' '}
            <a href="/docs/apis" target="_blank">
              {' '}
              native APIs
            </a>{' '}
            .
          </Paragraph>
        </ResponsiveContainer>
      </section>
    </>
  );
};

export default SolutionEmber;
