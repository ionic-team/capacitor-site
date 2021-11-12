module.exports = {
  async redirects() {
    return [
      {
        source: '/solution',
        destination: '/',
        permanent: false,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: { ref: true },
        },
      ],
    });

    return config;
  },
};
