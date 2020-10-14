---
title: Capacitor Required Dependencies
description: Required Dependencies for different platforms
contributors:
  - mlynch
  - dotNetkow
---

# Capacitor Required Dependencies

Capacitor has a number of dependencies depending on which platforms you're targeting and which operating systems you are developing on.

## Requirements

You will need [NodeJS 10.3.0](https://nodejs.org) or later to get started. For specific platforms, follow each guide below to ensure you have the correct dependencies installed.

### Running your App

To run your app on hardware and virtual devices, you will need to install [`native-run`](https://github.com/ionic-team/native-run/):

```bash
npm install -g native-run
```

## iOS Development

To build iOS apps, you will need **macOS**. You will also need to download and set up [Xcode](https://developer.apple.com/xcode/).

Additionally, you'll need to install [CocoaPods](https://cocoapods.org/) (`sudo gem install cocoapods`), and install the **Xcode Command Line tools** (either from Xcode, or running `xcode-select --install`).

> [Ionic Appflow](http://ionicframework.com/appflow) can be used to perform iOS cloud builds if you don't have a Mac.

## Android Development

To build Android apps, you will need to download and set up [Android Studio](https://developer.android.com/studio/index.html).
