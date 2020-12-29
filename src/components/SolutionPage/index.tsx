import React from 'react';
import Layout from '@theme/Layout';

import { ResponsiveContainer, Heading, Paragraph } from '../../ds';

import { SolutionAngular } from './solution-angular';
import { SolutionReact } from './solution-react';
import { SolutionPreact } from './solution-preact';
import { SolutionVue } from './solution-vue';
import { SolutionEmber } from './solution-ember';
import { SolutionSvelte } from './solution-svelte';
import { SolutionStencil } from './solution-stencil';

import './solution-page.scss';

interface Props {
  children: React.ReactNode;
  solutionId: string;
}

function SolutionPage({ children, solutionId }: Props): JSX.Element {
  let framework: {
    id: string;
    name: string;
    theme: string;
    logo: string;
    dimensions: string;
  };
  framework = solutions.find(entry => entry.id === solutionId);

  return (
    <Layout>
      <meta-tags
        page-title={`Using Capacitor with ${framework.name}`}
        description={`Build iOS, Android, and Progressive Web Apps with ${framework.name}`}
      />
      <ResponsiveContainer id="top" as="section">
        <div className="heading-group">
          <img
            width={framework.dimensions?.split('x')[0]}
            height={framework.dimensions?.split('x')[1]}
            loading="eager"
            src={framework.logo}
            alt={framework.name}
            className="react"
          />
          <Heading level={2} as="h1">
            {framework.name} &amp; Capacitor
          </Heading>
          <Paragraph level={2}>
            Build native mobile apps with web technology and {framework.name}
          </Paragraph>
          {/* <Button
            anchor
            href="#install"
            id="get-started"
            style={{ '--button-background': framework.theme }}
          >
            Get Started
          </Button> */}
        </div>
      </ResponsiveContainer>

      {children}

      <ResponsiveContainer id="newsletter">
        <newsletter-signup />
      </ResponsiveContainer>

      <pre-footer />
      <capacitor-site-footer />
    </Layout>
  );
}

export default SolutionPage;

const solutions = [
  {
    id: 'react',
    name: 'React',
    theme: '#3DD3FF',
    logo: '/img/solutions/react.png',
    dimensions: '252x224',
  },
  {
    id: 'vue',
    name: 'Vue',
    theme: '#42b983',
    logo: '/img/solutions/vue.png',
    dimensions: '222x196',
  },
  {
    id: 'preact',
    name: 'Preact',
    theme: '#673ab8',
    logo: '/img/solutions/preact.png',
    dimensions: '256x256',
  },
  {
    id: 'angular',
    name: 'Angular',
    theme: '#DD002E',
    logo: '/img/solutions/angular.png',
    dimensions: '276x276',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    theme: '#FF3D00',
    logo: '/img/solutions/svelte.png',
    dimensions: '228x212',
  },
  {
    id: 'stencil',
    name: 'Stencil',
    theme: '#4c48ff',
    logo: '/img/solutions/stencil.png',
    dimensions: '228x172',
  },
  {
    id: 'ember',
    name: 'Ember',
    theme: '#E04E39',
    logo: '/img/solutions/ember.png',
    dimensions: '297x284',
  },
];
