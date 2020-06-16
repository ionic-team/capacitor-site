import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

import dotenvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  taskQueue: 'async',
  devServer: {
    openBrowser: false,
  },
  outputTargets: [
    {
      type: 'www',
      // prerenderConfig: './prerender.config.ts',
      baseUrl: 'https://capacitorjs.com/',
      serviceWorker: null,
      copy: [
        { src: '../node_modules/@ionic-internal/sites-shared/www/assets/fonts', dest: 'assets/fonts' }
      ]
    },
  ],
  plugins: [
    sass({
      includePaths: ['ds'],
    }),
    dotenvPlugin(),
  ],
};