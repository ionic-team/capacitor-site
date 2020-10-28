---
title: Creating Capacitor Plugins
description: Creating Capacitor Plugins
contributors:
  - mlynch
  - jcesarmobile
  - dotNetkow
---

# Creating Capacitor Plugins

Plugins in Capacitor enable JavaScript to interface directly with Native APIs.

This guide will help you get started creating a shareable Capacitor plugin which will be published on npm. You can also create Capacitor plugins local to your app. See the custom native code guides for [iOS](/docs/ios/custom-code) and [Android](/docs/android/custom-code).

## Philosophies

If your plugin is intended for the public, we have a few philosophies about Capacitor plugins to share before you get started.

### Working Together

We believe cooperation is going to yield higher quality plugins than competition. This is one of the reasons we created the [Capacitor Community GitHub organization](https://github.com/capacitor-community), which facilitates easier cooperation among the community than if plugins were hosted in personal repositories.

If a plugin exists for a particular topic within the [Capacitor Community](https://github.com/capacitor-community), please consider contributing to it! If a plugin is missing a primary maintainer, the Capacitor team would be happy to consider adding you to the GitHub organization.

### Small in Scope

We believe Capacitor plugins should be reasonably small in scope. With the hybrid approach Capacitor takes, plugins add native code to apps that may or may not be used by apps. By keeping the scope of plugins small, we can ensure apps have a minimal amount of native code that they need. This avoids unnecessary app bloat and warnings/rejections from the App Store due to APIs without usage descriptions, etc.

## Plugin Generator

Ready to begin? Capacitor has [a plugin generator](https://github.com/ionic-team/create-capacitor-plugin) that you can use to begin working on your plugin.

> Before continuing, you may want to make sure you're using the latest Node LTS version and npm 6+.

In a new terminal, run the following:

```bash
npm init @capacitor/plugin
```

The generator will prompt you for input. You can also supply command-line options (see the [GitHub repo](https://github.com/ionic-team/create-capacitor-plugin/)).

## Next Steps

[Learn about the Capacitor plugin development workflow &#8250;](/docs/plugins/workflow)

[Learn about building Android plugins for Capacitor &#8250;](/docs/plugins/android)

[Learn about building iOS plugins for Capacitor &#8250;](/docs/plugins/ios)

[Learn about building Web/PWA plugins for Capacitor &#8250;](/docs/plugins/web)
