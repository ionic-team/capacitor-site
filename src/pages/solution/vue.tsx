import React from 'react';
import { ResponsiveContainer, Heading, Paragraph } from '../../ds';
import SolutionPage from '../../components/SolutionPage';

export const SolutionVue = () => {
  return (
    <SolutionPage solutionId="vue">
      <ResponsiveContainer id="getting-started" as="section">
        <article className="step">
          <sup className="ui-heading-6">01</sup>
          <div className="heading-group">
            <Heading>Install Capacitor.</Heading>
            <Paragraph>
              Add Capacitor to your project and create a config for your app
            </Paragraph>
          </div>
          <div className="code-panel">
            <code-snippet
              language="shell-session"
              code={`
npm install @capacitor/core @capacitor/cli
npx cap init [name] [id] --web-dir=build
`}
            />
          </div>
        </article>

        <article className="step">
          <sup className="ui-heading-6">02</sup>
          <div className="heading-group">
            <Heading>Build the Web App.</Heading>
            <Paragraph>
              The compiled web assets will be copied into each Capacitor native
              platform during the next step.
            </Paragraph>
          </div>
          <div className="code-panel">
            <code-snippet
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
            <Heading>Install the native platforms you want to target.</Heading>
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
              Capacitor's native projects exist in their own top-level folders
              and should be considered part of your app (check them into source
              control).
            </Paragraph>
          </div>
          <div className="code-panel">
            <code-snippet
              language="shell-session"
              code={`
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
              With Capacitor installed, adding calls to native device features
              is as straight forward as calling other JavaScript methods
            </Paragraph>
          </div>
          <div className="code-panel">
            <code-snippet
              language="markup"
              code={`
<template>
<div>
  <h1>Geolocation</h1>
  <p>Your location is:</p>
  <p>Latitude: {{loc?.coords.latitude}}</p>
  <p>Longitude: {{loc?.coords.longitude}}</p>

  <button @click="getCurrentPosition">
    Get Current Location
  </button>
</div>
</template>

<script>
import { Plugins } from '@capacitor/core'
export default {
  name: 'App',
  data() {
    return{ loc: null }
  },
  methods: {
    async getCurrentPosition(){
      const { Geolocation } = Plugins;
      const loc = await Geolocation.getCurrentPosition()
      this.loc = loc
    }
  }
}
</script>
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
    </SolutionPage>
  );
};

export default SolutionVue;
