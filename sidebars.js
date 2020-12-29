module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'index',
        'getting-started/environment-setup',
        'getting-started',
        'getting-started/with-ionic',
      ],
    },
    {
      type: 'category',
      label: 'Basics',
      items: [
        'basics/workflow',
        'basics/using-plugins',
        'basics/configuring-your-app',
      ],
    },
    {
      type: 'category',
      label: 'Upgrade Guides',
      items: [
        'updating/3-0',
        'updating/2-0',
        'updating/1-1',
        'updating/plugins/3-0',
      ],
    },
    {
      type: 'category',
      label: 'Cordova/PhoneGap',
      items: [
        'cordova',
        'cordova/migration-strategy',
        'cordova/migrating-from-cordova-to-capacitor',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'guides/ads',
        'guides/angular',
        'guides/ci-cd',
        'guides/deep-links',
        'guides/deploying-updates',
        'guides/in-app-purchases',
        'guides/live-reload',
        'guides/push-notifications-firebase',
        'guides/react-hooks',
        'guides/screen-orientation',
        'guides/security',
        'guides/splash-screens-and-icons',
        'guides/storage',
        'guides/community',
      ],
    },
    {
      type: 'category',
      label: 'iOS',
      items: [
        'ios',
        'ios/configuration',
        'ios/custom-code',
        'ios/deploying-to-app-store',
        'ios/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Android',
      items: [
        'android',
        'android/configuration',
        'android/custom-code',
        'android/deploying-to-google-play',
        'android/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Web/PWA',
      items: [
        'web',
        'web/progressive-web-apps',
        'web/pwa-elements',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'config',
        'core-apis',
        {
          type: 'link',
          label: 'Plugin APIs',
          href: '/docs/apis',
        },
        {
          type: 'link',
          label: 'CLI',
          href: '/docs/cli',
        },
      ],
    },
  ],

  plugins: [
    {
      type: 'category',
      label: 'Overview',
      items: [
        'plugins',
        'apis',
        'plugins/community',
        'plugins/cordova',
        'plugins/enterprise',
      ],
    },
    {
      type: 'category',
      label: 'APIs',
      items: [
        'apis/action-sheet',
        'apis/app',
        'apis/app-launcher',
        'apis/browser',
        'apis/clipboard',
        'apis/camera',
        'apis/device',
        'apis/dialog',
        'apis/filesystem',
        'apis/geolocation',
        'apis/haptics',
        'apis/keyboard',
        'apis/motion',
        'apis/network',
        'apis/screen-reader',
        'apis/share',
        'apis/splash-screen',
        'apis/status-bar',
        'apis/storage',
        'apis/text-zoom',
        'apis/toast',
      ],
    },
    {
      type: 'category',
      label: 'Creating Plugins',
      collapsed: false,
      items: [
        'plugins/creating-plugins',
        'plugins/workflow',
        'plugins/ios',
        'plugins/android',
        'plugins/web',
      ],
    },
  ],

  cli: [
    {
      type: 'category',
      label: 'Overview',
      items: [
        'cli',
      ],
    },
    {
      type: 'category',
      label: 'Command List',
      collapsed: false,
      items: [
        'cli/add',
        'cli/copy',
        'cli/list',
        'cli/open',
        'cli/run',
        'cli/sync',
        'cli/update',
      ],
    },
  ],
};
