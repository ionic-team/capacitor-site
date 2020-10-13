---
title: CLI Commands 
description: Capacitor CLI command reference list
contributors:
  - dotNetkow
---

# Capacitor CLI Reference

The Capacitor command-line interface (CLI) tool is used to develop Capacitor apps. View installation details [here](/docs/getting-started).

## Add

Add a native platform project to your project.

```bash
npx cap add <platform>
```

<strong>Inputs:</strong>
- `platform` (required): `android`, `ios`

## Cap

View all available CLI commands and options.

```bash
npx cap [-V] [-h]
```

<strong>Options:</strong>
- `-V, --version` (optional): Output the version number
- `-h, --help` (optional): Output usage information. Can be used with individual commands too.

## Copy

Copy the web app build and Capacitor configuration file into the native platform project. Run this each time you make changes to your web app or change a configuration value in `capacitor.config.json`.

```bash
npx cap copy [platform]
```

<strong>Inputs:</strong>
- `platform` (optional): `android`, `ios`

<strong>Example output:</strong>
```
√ Copying web assets from www to android\app\src\main\assets\public in 2.64s
√ Copying web assets from www to ios/App/public in 450ms
√ Copying native bridge in 7.32ms
√ Copying capacitor.config.json in 3.22ms
√ copy in 2.74s
√ copy in 1.10ms
```

## Create

Create a new Capacitor project with a stock project structure if you'd rather start fresh and plan to add a UI/frontend framework separately.

```bash
npx @capacitor/cli create [options] [directory] [name] [id]
```

<strong>Inputs:</strong>
- `directory` (optional): Directory to create the new app in, such as `c:\src\myapp` 
- `name` (optional): App name
- `id` (optional): App Package Id (in Java package format, no dashes), such as `com.example.app`

<strong>Options:</strong>
- `--npm-client <npmClient>`: npm client to use for dependency installation

## Doctor

Check each native project for common errors and compare the latest Capacitor dependencies available with the currently installed dependencies.

```bash
npx cap doctor [platform]
```

<strong>Inputs:</strong>
- `platform` (optional): `android`, `ios`

<strong>Example output:</strong>
```
Latest Dependencies:
  @capacitor/cli: 2.2.0
  @capacitor/core: 2.2.0
  @capacitor/android: 2.2.0
  @capacitor/ios: 2.2.0

Installed Dependencies:
  @capacitor/ios not installed
  @capacitor/cli 2.1.0
  @capacitor/core 2.1.0
  @capacitor/android 2.1.0
```

## Init

Initialize a new Capacitor project within an existing web app. All provided values (App name, App Id, WebDir, etc.) are written to `capacitor.config.json`.

```bash
npx cap init [options] [appName] [appId]
```

<strong>Inputs:</strong>
- `appName` (optional): Name of app
- `appId` (optional): App Package Id (in Java package format, no dashes), such as `com.example.app`

<strong>Options:</strong>
 - `--web-dir <value>`: Directory of your project's built web assets (default: `www`)
 - `--npm-client <npmClient>`: npm client to use for dependency installation

## List

List all installed Cordova and Capacitor plugins.

```bash
npx cap ls [platform]
```

<strong>Inputs:</strong>
- `platform` (optional): `android`, `ios`

<strong>Example output:</strong>
```
Found 1 Capacitor plugin for android:
    capacitor-mapbox (0.0.1)
Found 2 Cordova plugins for android:
    cordova-plugin-camera
    cordova-plugin-splashscreen
```

## Open

Opens the native project workspace in the specified native IDE (Xcode for iOS, Android Studio for Android). Once open, use the native IDEs to build, simulate, and run your app on a device.

```bash
npx cap open <platform>
```

<strong>Inputs:</strong>
- `platform` (required): `android`, `ios`

## Plugin Generate

Create a new custom Capacitor plugin. This starts a wizard that prompts you for information about your new plugin. More information on developing plugins [here](/docs/plugins).

```bash
# Capacitor CLI already installed in project
npx cap plugin:generate

# Capacitor CLI not installed
npx @capacitor/cli plugin:generate
```

## Serve

Serves a Capacitor Progressive Web App in the browser, using the `webDir` directory specified in `capacitor.config.json`.

```bash
npx cap serve
```

## Sync

Run the [Copy](#copy) and [Update](#update) commands together.

```bash
npx cap sync [options] [platform]
```

<strong>Inputs:</strong>
- `platform` (optional): `android`, `ios`

<strong>Options:</strong>
- `--deployment`: Podfile.lock won't be deleted and pod install will use `--deployment` option.

<strong>Example output:</strong>
```
√ Copying web assets from www to android\app\src\main\assets\public in 3.37s
√ Copying native bridge in 5.80ms
√ Copying capacitor.config.json in 2.59ms
√ copy in 3.43s
√ Updating Android plugins in 11.48ms
  Found 1 Capacitor plugin for android:
    capacitor-mapbox (0.0.1)
√ update android in 105.91ms
√ copy in 409.80μp
√ update web in 6.80μp
Sync finished in 3.563s
```

## Update

Updates the native plugins and dependencies referenced in `package.json`.

```bash
npx cap update
```

<strong>Inputs:</strong>
- `platform` (optional): `android`, `ios`

<strong>Options:</strong>
- `--deployment`: Podfile.lock won't be deleted and pod install will use `--deployment` option.
