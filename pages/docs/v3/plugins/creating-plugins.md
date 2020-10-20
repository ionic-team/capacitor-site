---
title: Creating Capacitor Plugins
description: Creating Capacitor Plugins
contributors:
  - mlynch
  - jcesarmobile
  - dotNetkow
---

# Creating Capacitor Plugins

Capacitor plugins can either be added directly to your app or split out into their own packages. For the latter, use the [Plugin Generator](/docs/plugins/creating-plugins#plugin-generator) to begin.

## Plugin Generator

Capacitor has [a plugin generator](https://github.com/ionic-team/create-capacitor-plugin) that you can use to begin working on your plugin.

> Before continuing, you may want to make sure you're using the latest Node LTS version and npm 6+.

In a new terminal, run the following:

```bash
npm init @capacitor/plugin
```

The generator will prompt you for input. You can also supply command-line options (see the [GitHub repo](https://github.com/ionic-team/create-capacitor-plugin/)).

## Next steps

Now it's up to you to make your plugin do something truly awesome! [Read on](./workflow) to learn how to implement new functionality, test the plugin locally, and publish it on npm.

Afterward, check out the details covering how to build for each platform. Follow the [iOS](./ios) guide for information on using Swift (or Obj-C) to build an iOS plugin, the [Android](./android) guide for building Android plugins with Java or Kotlin, the [Web](./web) guide for implementing web and PWA functionality for your plugin, and the [Custom JavaScript](./js) guide for information on how to build a custom JavaScript plugin (i.e. in addition to Capacitor's auto-JS plugin binding).
