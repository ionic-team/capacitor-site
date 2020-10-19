---
title: Installing Capacitor
description: Installing Capacitor
contributors:
  - dotNetkow
  - jcesarmobile
---

# Installing Capacitor

This guide will help you install Capacitor into an existing frontend web app. You can also start a new app with `npm init @capacitor/app`.

Capacitor provides a native mobile runtime and API layer for web apps. It does not come with any specific set of UI controls, which you will most likely need unless you're building a game or something similar. We recommend you start a Capacitor project with your mobile frontend framework of choice (such as [Ionic Framework](https://ionicframework.com/)).

## Before you start

Make sure your [environment is set up](/docs/getting-started/environment-setup) for the platforms you will be building for.

## Project Requirements

Capacitor was designed to drop into any modern JavaScript web app. Projects must meet the following requirements:

- Must have a `package.json` file.
- Must have a separate directory for web assets.
- Must have an `index.html` file with a `<head>` tag in the root of the web assets directory.

## Adding Capacitor to your app

In the root of your app, install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
```

Then, initialize Capacitor using the CLI questionnaire:

```bash
npx cap init
```

## Where to go next

[Get started with iOS &#8250;](/docs/ios)
[Get started with Android &#8250;](/docs/android)
[Developer Workflow Guide &#8250;](/docs/basics/workflow)
