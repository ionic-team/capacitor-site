import tokens from "@ionic-internal/ionic-ds/dist/tokens/tokens.json";

const { fonts, fontSizes, letterSpacings, fontWeights, colors } = tokens;

const headingStyleMap = {
  1: {
    font: fonts.pro,
    fontWeight: fontWeights.medium,
    letterSpacing: "-0.01em",
    fontFeatureSettings: "'ss01' on, 'ss02' on",
    poster: {
      font: fonts.pro,
      letterSpacing: letterSpacings.tight,
      fontWeight: fontWeights.medium,
      fontFeatureSettings: "'ss01' on, 'ss02' on",
    },
  },
  2: {
    font: fonts.pro,
    letterSpacing: "0",
    fontWeight: fontWeights.medium,
    fontFeatureSettings: "'ss01' on, 'ss02' on",
    poster: {
      font: fonts.pro,
      letterSpacing: "-0.01em",
      fontWeight: fontWeights.medium,
      fontFeatureSettings: "'ss01' on, 'ss02' on",
    },
  },
  3: {
    font: fonts.pro,
    letterSpacing: "0",
    size: fontSizes["32"],
    fontWeight: fontWeights.medium,
    fontFeatureSettings: "'ss01' on, 'ss02' on",
    poster: {
      font: fonts.pro,
      letterSpacing: "-0.01em",
      fontWeight: fontWeights.medium,
      fontFeatureSettings: "'ss01' on, 'ss02' on",
    },
  },
  4: {
    font: fonts.pro,
    letterSpacing: "0.01em",
    fontWeight: fontWeights.medium,
    fontFeatureSettings: "'ss01' on, 'ss02' on",
    poster: {
      font: fonts.pro,
      letterSpacing: "-0.01em",
      fontWeight: fontWeights.medium,
      fontFeatureSettings: "'ss01' on, 'ss02' on",
    },
  },
  5: {
    font: fonts.pro,
    letterSpacing: "0.01em",
    fontWeight: fontWeights.medium,
    fontFeatureSettings: "'ss01' on, 'ss02' on",
  },
  6: {
    font: fonts.proMono,
    fontWeight: fontWeights.medium,
    size: fontSizes["14"],
    color: colors.indigo["60"],
    fontFeatureSettings: "'ss01' on, 'ss02' on",
    transform: "uppercase",
  },
};

export default headingStyleMap;
