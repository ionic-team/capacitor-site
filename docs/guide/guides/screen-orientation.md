---
title: Screen Orientation Configuration
description: Manage screen orientation settings in your Capacitor app
url: /docs/guides/screen-orientation
contributors:
  - mlynch
---

## Screen Orientation in your Capacitor App

Many apps work well in portrait and landscape device orientations. However, many don't, and there are good reasons to require an app to function solely or occasionally in one mode or the other.

## Global Orientation Settings

To set a global setting for orientation in your Capacitor app, you'll set the configuration value necessary for the platform you're targeting.

### iOS Configuration

To limit the allowed orientations for iOS, open Xcode and open the general settings for the project. Then, select the orientations your app will support:

![Orientation Settings on iOS](/assets/img/docs/guides/screen-orientation/ios.png)

### Android Configuration

On Android, orientation can be set by modifying the `AndroidManifest.xml` and setting `android:screenOrientation` on the `<activity>` entry for your main app activity. See the [Android Manifest Documentation](https://developer.android.com/guide/topics/manifest/activity-element#screen) for details on the possible entries. 

## Dynamic Orientation Settings

Many apps need to support multiple orientations, with the ability to lock orientations occasionally depending on the content.

Capacitor supports this through the `cordova-plugin-screen-orientation` plugin:

```shell
npm install cordova-plugin-screen-orientation
npx cap update
```

Then, use the `lock` and `unlock` methods available on `window.screen.orientation`:

```typescript
window.screen.orientation.lock('portrait');
window.screen.orientation.lock('landscape');

// To unlock orientation which will default back to the global setting:
window.screen.orientation.unlock();
```

See the [Orientation Plugin Docs](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-screen-orientation/) for the full range of possible orientation values and configuration options.