---
title: Installing Capacitor
description: Installing Capacitor
contributors:
  - thomasvidas
---

# Installing Capacitor

There are two ways to create your Capacitor application. You can using the `@capacitor/create-app` package to create a Capacitor application from scratch, or you can add Capacitor to your already existing web project.

Remember to make sure your [environment is set up](/docs/getting-started/environment-setup) for the platforms you will be building for.

## Creating a new Capacitor application

The `@capacitor/create-app` package can be used to quickly create a Capacitor application. You can run the following command in an empty directory to scaffold a new Capacitor 4 application.

```bash
npm init @capacitor/app
```

## Adding Capacitor to your existing web application

Capacitor was designed to drop into any modern JavaScript web app. Capacitor expects the following statements to be true in order to work properly:

- Your project must have a `package.json` file.
- Your project must have a separate directory for built web assets (by default `www`).
- Your project must have an `index.html` file with a `<head>` tag in the root of the web assets directory.

### Install Capacitor

In the root of your app, install Capacitor's main npm depdencies: Our core JavaScript runtime and our command line interface (CLI).

```bash
npm i @capacitor/core
npm i -D @capacitor/cli
```

### Initialize your Capacitor config

Then, initialize Capacitor using the CLI questionnaire:

```bash
npx cap init
```

The CLI will ask you a few questions, starting with your app name, and the package id you would like to use for your app.

> The `npx cap` command is how Capacitor is executed locally on the command-line in your project. [Learn more about the Capacitor CLI](/docs/cli).

### Create your Android and iOS projects

After the Capacitor core is installed, you can install the Android and iOS platforms.

```bash
npm i @capacitor/android @capacitor/ios
```

Once the platforms have been added to your `package.json`, you can run the following commands to create your Android and iOS projects for your native application.

```bash
npx cap add android
npx cap add ios
```

### Sync your web code to your native project

Once you've created your native projects, you can sync your web application to your native project by running the following command.

```bash
npx cap sync
```

`npx cap sync` will copy your built web application, by default `www`, to your native project and install the native projects dependencies.

> You can customize what folder is copied over by modifying the `webDir` variable in your [Capacitor Config](/docs/v4/config) file that is created during `npx cap init`.

## Where to go next

[Get started with iOS &#8250;](/docs/ios)

[Get started with Android &#8250;](/docs/android)

[Developer Workflow Guide &#8250;](/docs/basics/workflow)
