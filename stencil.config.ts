import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

import dotenvPlugin from 'rollup-plugin-dotenv';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  devServer: {
    openBrowser: false,
    logRequests: true,
  },
  outputTargets: [
    {
      type: 'www',
      prerenderConfig: './prerender.config.ts',
      baseUrl: 'https://capacitorjs.com/',
      serviceWorker: null,
      copy: [
        {
          src: '../node_modules/@ionic-internal/ionic-ds/www/assets/fonts',
          dest: 'assets/fonts',
        },
      ],
    },
  ],
  plugins: [
    sass({
      includePaths: ['ds'],
    }),
    dotenvPlugin(),
  ],
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  }
};
