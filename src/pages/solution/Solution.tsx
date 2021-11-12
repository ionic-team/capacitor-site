import SolutionAngular from './Angular';
import SolutionReact from './React';
import SolutionPreact from './Preact';
import SolutionVue from './Vue';
import SolutionEmber from './Ember';
import SolutionSvelte from './Svelte';
import SolutionStencil from './Stencil';
import SiteMeta from '../../components/site/SiteMeta';
import NewsletterSignup from '../../components/newsletter-signup/NewsletterSignup';
import SitePreFooter from '../../components/site/SitePreFooter';
import SiteFooter from '../../components/site/SiteFooter';
import SolutionStyles from './Solution.styles';
import AnnouncementBar from '../../components/announcement-bar/AnnouncementBar';
import SiteHeader from '../../components/site/SiteHeader';
import ResponsiveContainer from '../../components/ui/ResponsiveContainer';
import Heading from '../../components/ui/Heading';
import Paragraph from '../../components/ui/Paragraph';

interface Framework {
  id: string;
  name: string;
  theme: string;
  logo: string;
  dimensions: string;
}

const SolutionPage = ({ solutionId, announcement_bar }) => {
  const framework = solutions.find((entry) => entry.id === solutionId);

  const getComponent = () => {
    switch (solutionId) {
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
  };

  return (
    <>
      <SiteMeta
        title={'Using Capacitor with ' + framework.name}
        description={'Build iOS, Android, and Progressive Web Apps with ' + framework.name}
      />
      <AnnouncementBar {...announcement_bar} />
      <SiteHeader />
      <SolutionStyles>
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
            <Paragraph level={2}>Build native mobile apps with web technology and {framework.name}</Paragraph>
            {/* <Button
              anchor
              href="#install"
              id="get-started"
              style={{ '--button-background': this.framework.theme }}
            >
              Get Started
            </Button> */}
          </div>
        </ResponsiveContainer>

        {getComponent()}

        <ResponsiveContainer id="newsletter">
          <NewsletterSignup />
        </ResponsiveContainer>
      </SolutionStyles>

      <SitePreFooter />
      <SiteFooter />
    </>
  );
};

const solutions: Framework[] = [
  {
    id: 'react',
    name: 'React',
    theme: '#3DD3FF',
    logo: '/assets/img/solutions/react.png',
    dimensions: '252x224',
  },
  {
    id: 'vue',
    name: 'Vue',
    theme: '#42b983',
    logo: '/assets/img/solutions/vue.png',
    dimensions: '222x196',
  },
  {
    id: 'preact',
    name: 'Preact',
    theme: '#673ab8',
    logo: '/assets/img/solutions/preact.png',
    dimensions: '256x256',
  },
  {
    id: 'angular',
    name: 'Angular',
    theme: '#DD002E',
    logo: '/assets/img/solutions/angular.png',
    dimensions: '276x276',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    theme: '#FF3D00',
    logo: '/assets/img/solutions/svelte.png',
    dimensions: '228x212',
  },
  {
    id: 'stencil',
    name: 'Stencil',
    theme: '#4c48ff',
    logo: '/assets/img/solutions/stencil.png',
    dimensions: '228x172',
  },
  {
    id: 'ember',
    name: 'Ember',
    theme: '#E04E39',
    logo: '/assets/img/solutions/ember.png',
    dimensions: '297x284',
  },
];

export default SolutionPage;
