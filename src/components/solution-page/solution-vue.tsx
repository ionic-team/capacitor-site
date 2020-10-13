import { h } from '@stencil/core';
import { ResponsiveContainer, Grid, Col, Heading, Paragraph } from '@ionic-internal/ionic-ds';
export const SolutionVue = () => {
  return (
    <section class="section--getting-started">
      <ResponsiveContainer>
        <Grid class="section--getting-started__step">
          <Col cols={1}>01</Col>
          <Col md={5} sm={5} xs={5} cols={12}>
            <Heading level={3} id="install">Install Capacitor.</Heading>
            <Paragraph>
              Add Capacitor to your project and create a config for your app
            </Paragraph>
          </Col>
          <Col md={6} sm={6} xs={6} cols={12}>
            <code-snippet
              language="shell-session"
              code={`
npm install @capacitor/core @capacitor/cli
npx cap init [name] [id] --webDir=build
`}
            />
          </Col>
        </Grid>

        <Grid class="section--getting-started__step">
          <Col cols={1}>02</Col>
          <Col md={5} sm={5} xs={5} cols={12}>
            <Heading level={3}>Build the Web App.</Heading>
            <Paragraph>
              The compiled web assets will be copied into each Capacitor native
              platform during the next step.
            </Paragraph>
          </Col>
          <Col md={6} sm={6} xs={6} cols={12}>
            <code-snippet
              language="shell-session"
              code={`
npm run build
`}
            />
          </Col>
        </Grid>

        <Grid class="section--getting-started__step">
          <Col cols={1}>03</Col>
          <Col md={5} sm={5} xs={5} cols={12}>
            <Heading level={3}>
              Install the native platforms you want to target.
            </Heading>
            <img
              src="/assets/img/landing/apple.png"
              alt="Apple"
              class="apple"
            />
            <img
              src="/assets/img/landing/android.png"
              alt="Android"
              class="android"
            />
            <Paragraph>
              Capacitor's native projects exist in their own top-level folders
              and should be considered part of your app (check them into source
              control).
            </Paragraph>
          </Col>
          <Col md={6} sm={6} xs={6} cols={12}>
            <code-snippet
              language="shell-session"
              code={`
npx cap add android
npx cap add ios
`}
            />
          </Col>
        </Grid>

        <Grid class="section--getting-started__step">
          <Col cols={1}>04</Col>
          <Col md={5} sm={5} xs={5} cols={12}>
            <Heading level={3}>Adding calls to Native APIs</Heading>
            <Paragraph>
              With Capacitor installed, adding calls to native device features
              is as straight forward as calling other JavaScript methods
            </Paragraph>
          </Col>
          <Col md={6} sm={6} xs={6} cols={12}>
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
          </Col>
        </Grid>

        <Grid>
          <Col md={12} sm={12} xs={12} cols={12}>
            <Heading level={3}>Continue your Capacitor Journey.</Heading>
            <Paragraph>
              This is only the beginning. Learn more about the Capacitor <a href="/docs/basics/workflow" target="_blank">development workflow </a> or using more<a href="/docs/apis" target="_blank"> native APIs</a> .
            </Paragraph>
          </Col>
        </Grid>
      </ResponsiveContainer>
    </section>
  );
};

