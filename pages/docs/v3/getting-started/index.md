---
title: Installing Capacitor
description: Installing Capacitor
contributors:
  - dotNetkow
  - jcesarmobile
---

# Installing Capacitor

This guide will help you install Capacitor into an existing frontend web app.

> If starting a new app, we recommend using the documentation from your JavaScript framework of choice and then following this guide to integrate Capacitor.
>
> You can also create a new basic app with `npm init @capacitor/app`.

Capacitor provides a native mobile runtime and API layer for web apps. It does not come with any specific set of UI controls. We recommend you use a mobile component framework (such as [Ionic Framework](https://ionicframework.com/)).

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
npm install @capacitor/core@next @capacitor/cli@next
```

Then, initialize Capacitor using the CLI questionnaire:

```bash
npx cap init
```

> The `npx cap` command is how Capacitor is executed locally on the command-line in your project. [Learn more about the Capacitor CLI](/docs/cli).

Finally, add an import to `@capacitor/core` to the TypeScript or JavaScript file that bootstraps your app. This will include the Capacitor JavaScript bridge into your app.

For example, in a React app, add the following import to `src/index.tsx`:

```diff-typescript
+import '@capacitor/core';
 import React from 'react';
 import ReactDOM from 'react-dom';
 import App from './App';

 ReactDOM.render(<App />, document.getElementById('root'));
```

## Where to go next

[Get started with iOS &#8250;](/docs/ios)

[Get started with Android &#8250;](/docs/android)

[Developer Workflow Guide &#8250;](/docs/basics/workflow)
