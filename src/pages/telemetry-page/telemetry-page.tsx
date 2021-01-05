import { Component, Host, h, Prop } from '@stencil/core';
import {
  ResponsiveContainer,
  Heading,
  Paragraph,
} from '@ionic-internal/ionic-ds';

@Component({
  tag: 'telemetry-page',
  styleUrl: 'telemetry-page.scss',
  scoped: true,
})
export class TelemetryPage {
  @Prop() data: any;

  render() {
    const { Telemetry } = this;

    return (
      <Host>
        <meta-tags
          page-title="Telemetry"
          description={'Capacitor Telemetry usage information'}
        />
        <Telemetry />

        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }

  Telemetry = () => (
    <ResponsiveContainer id="telemetry" as="section">
      <Heading level={1}>Telemetry</Heading>
      <Paragraph>
        Capacitor collects anonymous telemetry data about general usage. This is
        an opt-in program that provides insight to the Capacitor team to help
        improve the product. By opting in you will be able to provide valuable
        insights that could shape the future of the product.
      </Paragraph>
      <Paragraph>
        You will be asked on project initialization if you would like to enter
        the program. If you opt-out telemetry data will not be collected and you
        will not be asked again.
      </Paragraph>

      <Heading level={3}>Why?</Heading>
      <Paragraph>
        Anonymous telemetry events allow the team to gain insights into how
        Capacitor is being used. With this information we can prioritize fixes
        and features. It also provides the team with a better understanding of
        the developer experience.
      </Paragraph>

      <Heading level={3}> What is Collected?</Heading>
      <Paragraph>
        When a capacitor command is ran we collected the following information
        about this event:
      </Paragraph>
      <ul>
        <li>
          Name of command (<code class="sc-docs-component">add</code>,{' '}
          <code class="sc-docs-component">list</code>,{' '}
          <code class="sc-docs-component">open</code>, etc)
        </li>
        <li>Timestamp</li>
        <li>
          Capacitor machine ID: This is an anonymous UUID that is stored in a
          global config.
        </li>
        <li>Your operating system (Mac, Linux, Windows) and its version.</li>
        <li>Node Version</li>
        <li>@capacitor/core Version</li>
        <li>@capacitor/cli Version</li>
        <li>@capacitor/android Version</li>
        <li>@capacitor/ios Version</li>
        <li>
          Name and Version of Official Capacitor Plugins installed in your
          project
        </li>
      </ul>

      <Heading level={3}>How to opt-in/opt-out</Heading>
      <Paragraph>
        You may opt-out at any time from the program by running{' '}
        <code class="sc-docs-component">npx cap telemetry off</code> in the root
        of your project
      </Paragraph>
      <code-snippet
        language="shell-session"
        code={`
        npx cap telemetry off
        `}
      />
      <Paragraph>
        You can check the status at any time by running the following command in
        the root of your project
      </Paragraph>
      <code-snippet
        language="shell-session"
        code={`
        npx cap telemetry
        `}
      />
      <Paragraph>
        If you would like to rejoin the program and provide telemetry on your
        project then run the following command.
      </Paragraph>
      <code-snippet
        language="shell-session"
        code={`
        npx cap telemetry on
        `}
      />
    </ResponsiveContainer>
  );
}
