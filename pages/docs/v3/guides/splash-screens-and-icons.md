---
title: Creating Splash Screens and Icons
description: Use cordova-res to generate resource images for native projects
contributors:
  - dotNetkow
---

# Creating Splash Screens and Icons

Initial support for splash screen and icon generation is now available. For complete details, see the [cordova-res docs](https://github.com/ionic-team/cordova-res).

First, install `cordova-res`:

```bash
npm install -g cordova-res
```

`cordova-res` expects a Cordova-like structure: place one icon and one splash screen file in a top-level `resources` folder within your project, like so:

```
resources/
├── icon.png
└── splash.png
```
In order to fix the errors reported in this StackOverFlow thread: https://stackoverflow.com/questions/66026629/error-occurred-while-copying-resources-android-icon-mdpi-foreground-png, add the following in `resources/android` folder:

```
resources/
|--android/
|----icon-foreground.png
|----icon-background.png
```

Next, run the following to generate all images then copy them into the native projects:

```bash
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

The above command should result in something like the following (without errors):
```
Generated 24 resources for Android
Copied 31 resource items to Android
```
