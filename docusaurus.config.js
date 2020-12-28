module.exports = {
  title: 'Capacitor',
  tagline: 'A cross-platform native runtime for web apps.',
  url: 'https://capacitorjs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ionic-team',
  projectName: 'capacitor-site',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Capacitor Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs',
          activeBaseRegex: '^/docs(?!/apis|/cli|/plugins)',
          label: 'Docs',
          position: 'right',
        },
        {
          to: 'docs/plugins',
          activeBaseRegex: '^/docs/(apis|plugins)',
          label: 'Plugins',
          position: 'right',
        },
        {
          to: 'docs/cli',
          label: 'CLI',
          position: 'right',
        },
        {
          to: 'community',
          label: 'Community',
          position: 'right',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'right',
        },
        {
          to: 'enterprise',
          label: 'Enterprise',
          position: 'right',
        },
        {
          href: 'https://github.com/ionic-team/capacitor',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://twitter.com/capacitorjs',
          label: 'Twitter',
          position: 'right',
        },
        {
          to: 'docs/getting-started',
          label: 'Install',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Developers',
          items: [
            {
              label: 'Install',
              to: 'docs/getting-started',
            },
            {
              label: 'Docs',
              to: 'docs',
            },
            {
              label: 'Plugins',
              to: 'docs/apis',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Community',
              to: 'community',
            },
            {
              label: 'Blog',
              href: 'blog',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/ionic-team/capacitor/discussions',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ionic-team/capacitor',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/capacitorjs',
            },
            {
              label: 'Ionic',
              href: 'https://ionic.io/',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Capacitor`,
    },
    algolia: {
      apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
      indexName: 'capacitorjs',
    },
    gtag: {
      trackingID: 'UA-44023830-42',
    },
    prism: {
      theme: { plain: {}, styles: [] },
      // https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/vendor/prism/includeLangs.js
      additionalLanguages: [
        'groovy',
        'java',
        'json5',
        'kotlin',
        'ruby',
        'shell-session',
        'swift',
      ],
    },
  },
  plugins: [
    [
      'docusaurus-plugin-sass',
      {
        implementation: require('sass'),
      },
    ],
  ],
  themes: ['@ionic-internal/docusaurus-theme'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ionic-team/capacitor-site/edit/main/',
          versions: {
            current: {
              label: 'v3',
              path: 'v3',
            },
          },
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/ionic-team/capacitor-site/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
