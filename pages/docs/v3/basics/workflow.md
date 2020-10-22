---
title: Development Workflow
description: Capacitor Workflow
contributors:
  - dotNetkow
  - mlynch
---

# Capacitor Workflow

Working with Capacitor involves several key additions to your workflow.

## Develop and build your Web App

Capacitor turns your web app into a native binary for each platform. Thus, much of your work will consist of developing and then building a mobile-focused web app.

You will interact with the native platform underneath using Capacitor's plugins (such as [Camera](/docs/apis/camera)), or by using existing Cordova plugins with Capacitor's [Cordova Compatibility](/docs/cordova).

To deploy your web app to native devices, you will first need to build the web assets into an output directory. Consult your JavaScript framework's documentation for the exact command. For most, it's `npm run build`.

[Learn more about building your app &#8250;](/docs/basics/building-your-app)

## Sync your Project

You may wish to sync your web app with your native project(s) in the following circumstances:

* After you install a new Capacitor plugin.
* Before you run your project using a Native IDE.
* When you want to manually copy web assets into your native project(s).
* When you clone your project.
* When you want to setup or reconfigure the native project(s) for Capacitor.
* When you want to install or update native dependencies.

To sync your project, run:

```bash
npx cap sync
```

[Learn more about `sync` &#8250;](/docs/cli#sync)

## Run your Project

There are a few ways to deploy your project on native devices, depending on your use case. Most common is on the command-line with `npx cap run`.

[Learn more about running your app on iOS &#8250;](/docs/ios#running-your-app)

[Learn more about running your app on Android &#8250;](/docs/android#running-your-app)

## Open your Native IDE

You may wish to open your project in a Native IDE in the following circumstances:

* When you want to run your project on a native device using the IDE.
* When you want to debug native Java/Kotlin or Swift/Objective-C code.
* When you want to work on the native side of your app.
* When you want to compile a release build for the app store.

[Learn more about opening your app in Xcode &#8250;](/docs/ios#opening-the-ios-project)

[Learn more about opening your app in Android Studio &#8250;](/docs/android#opening-the-android-project)

## Updating Capacitor

To update Capacitor Core and CLI:

```bash
npm install @capacitor/cli@3
npm install @capacitor/core@3
```

To update any or all of the platforms you are using:

```bash
npm install @capacitor/ios@3
npm install @capacitor/android@3
```

> You can subscribe to the [Capacitor repo](https://github.com/ionic-team/capacitor) to be notified of new releases. At the top of the repository index, click **Watch** -> **Releases only**.
