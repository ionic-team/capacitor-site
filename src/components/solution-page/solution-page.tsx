import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';

import Helmet from '@stencil/helmet';
import {
  ResponsiveContainer,
  Grid,
  Col,
  Heading,
  AnchorButton,
} from '@ionic-internal/ionic-ds';

import { SolutionAngular } from './solution-angular';
import { SolutionReact } from './solution-react';
import { SolutionPreact } from './solution-preact';
import { SolutionVue } from './solution-vue';
import { SolutionEmber } from './solution-ember';
import { SolutionSvelte } from './solution-svelte';
import { SolutionStencil } from './solution-stencil';

@Component({
  tag: 'solution-page',
  styleUrl: 'solution-page.scss',
  scoped: true,
})
export class SolutionPage implements ComponentInterface {
  @Prop() solutionId: string;

  framework: { id: string; name: string; theme: string; logo: string };
  componentWillLoad() {
    this.framework = solutions.find((entry) => entry.id === this.solutionId);
  }
  getComponent() {
    switch (this.solutionId) {
      case 'angular':
        return <SolutionAngular />;
      case 'react':
        return <SolutionReact />;
      case 'preact':
        return <SolutionPreact />;
      case 'vue':
        return <SolutionVue />;
      case 'ember':
        return <SolutionEmber />;
      case 'svelte':
        return <SolutionSvelte />;
      case 'stencil':
        return <SolutionStencil />;
    }
  }
  render() {
    return (
      <Host>
        <MetaHead framework={this.framework} />
        <section class="hero">
          <ResponsiveContainer>
            <Grid>
              <Col md={12} sm={12} xs={12} cols={12}>
                <hgroup class="hero__heading">
                  <img src={this.framework.logo} alt={this.framework.name} class="react" />
                  <Heading level={2}>
                    {this.framework.name} &amp; Capacitor
                  </Heading>
                  <Heading level={3}>
                    Build native mobile apps with web technology and{' '}
                    {this.framework.name}
                  </Heading>
                  <AnchorButton
                    href="#install"
                    id="get-started"
                    style={{ '--button-background': this.framework.theme }}
                  >
                    Get Started
                  </AnchorButton>
                </hgroup>
              </Col>
            </Grid>
          </ResponsiveContainer>
        </section>

        {this.getComponent()}

        <newsletter-signup />
        <pre-footer />
        <capacitor-site-footer />
      </Host>
    );
  }
}

const MetaHead = ({ framework }) => {
  return (
    <Helmet>
      <title>Capacitor: Cross-platform native runtime for web apps</title>
      <meta
        name="description"
        content={`Build iOS, Android, and Progressive Web Apps with ${framework.name}`}
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
};

const solutions = [
  { "id": "react",   "name": "React",   "theme": "#3DD3FF", "logo": "/assets/img/solutions/react.png" },
  { "id": "vue",     "name": "Vue",     "theme": "#42b983", "logo": "/assets/img/solutions/vue.png" },
  { "id": "preact",  "name": "Preact",  "theme": "#673ab8", "logo": "/assets/img/solutions/preact.png"  },
  { "id": "angular", "name": "Angular", "theme": "#DD002E", "logo": "/assets/img/solutions/angular.png"  },
  { "id": "svelte",  "name": "Svelte",  "theme": "#FF3D00", "logo": "/assets/img/solutions/svelte.png"  },
  { "id": "stencil", "name": "Stencil", "theme": "#4c48ff", "logo": "/assets/img/solutions/stencil.png"  },
  { "id": "ember",   "name": "Ember",   "theme": "#E04E39", "logo": "/assets/img/solutions/ember.png"  }
]
