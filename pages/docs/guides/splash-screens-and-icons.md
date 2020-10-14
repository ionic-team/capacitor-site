---
title: Creating Splash Screens and Icons
description: Use cordova-res to generate resource images for native projects
contributors:
  - dotNetkow
---

#  Creating Splash Screens and Icons

Initial support for splash screen and icon generation is now available. For complete details, see the [cordova-res docs](https://github.com/ionic-team/cordova-res).

First, install `cordova-res`:

```bash
$ npm install -g cordova-res
```

`cordova-res` expects a Cordova-like structure: place one icon and one splash screen file in a top-level `resources` folder within your project, like so:

```
resources/
├── icon.png
└── splash.png
```

If you are building an Android application, the files required in order to generate adaptive icons as [noted here](https://github.com/ionic-team/cordova-res#adaptive-icons) may can also be added. In this case, the directory structure will look like this:

```
resources/
├── icon.png
└── splash.png
└── android/
    └── icon-background.png
    └── icon-foreground.png
```

Next, run the following to generate all images then copy them into the native projects:

```bash
$ cordova-res ios --skip-config --copy
$ cordova-res android --skip-config --copy
```
