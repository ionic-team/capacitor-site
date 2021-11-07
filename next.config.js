const withTM = require("next-transpile-modules")(["@ionic-internal/ionic-ds"]);

module.exports = withTM({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { ref: true },
        },
      ],
    });

    return config;
  },
});
