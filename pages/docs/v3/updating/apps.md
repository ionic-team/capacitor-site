---
title: Updating Capacitor in your app
description: Guide for updating Capacitor in your app
---

# Updating Capacitor in your app

This is a list of instructions for updating to certain Capacitor versions in your app.

These instructions may include changes in configuration or the build process, updates to dependencies or your development environment, code changes to your app, or anything else to be aware of when updating to newer versions of Capacitor.

> Looking for an [Upgrade Guide for plugins](/docs/updating/plugins)?

## Update to 3.0.0 (WIP)

Capacitor 3 brings crucial updates to the ecosystem and exciting new features.

Read the Capacitor 3.0 announcement &#8250; (TODO)

### NodeJS 12+

Node 8 has reached end-of-life. Node 10 will reach end-of-life on April 30th, 2021. Capacitor 3 requires NodeJS 12 or greater. (Latest LTS version is recommended.)

### ES2017+

Capacitor 3 now builds for ES2017 environments, instead of ES5. The [plugin template has also been updated](https://github.com/ionic-team/capacitor/pull/3427/files#diff-b22b3d0cbb7d8f6fdfe1f6f1d9e84b7d) to target ES2017, and third-party plugins are encouraged to update their targets.

This change should not affect your app unless you are supporting IE11, which Capacitor does not officially support.

### Official Plugins

All plugins have been removed from Capacitor core and placed into their own npm packages. There are several reasons for this (see [#3227](https://github.com/ionic-team/capacitor/issues/3227)) and the core team is confident this is the right way to go.

#### Background Task, Permissions, and Photos plugins removed

- **Background Task**: This plugin appeared to be rarely used and didn't quite work as most devs expected. The core team will readdress background functionality in the future. Subscribe to [#3032](https://github.com/ionic-team/capacitor/issues/3032) for updates.
- **Permissions**: The core team has implemented an alternative to this centralized approach which community plugins may also adopt. See the new Permissions API. (TODO: link)
- **Photos**: This undocumented iOS-only plugin has been removed. Use [`@capacitor-community/media`](https://github.com/capacitor-community/media).

#### Accessibility, App, and Modals plugins split up

- **Accessibility**
  - VoiceOver and TalkBack functionality moved into [**Screen Reader**](/docs/apis/screen-reader)
- **App**
  - App-related info and functionality remains in [**App**](/docs/apis/app)
  - App URL handling (`openUrl()` and `canOpenUrl()`) moved into [**App Launcher**](/docs/apis/app-launcher)
- **Modals**
  - Action Sheet functionality (`showActions()`) moved into [**Action Sheet**](/docs/apis/action-sheet)
  - Dialog window functionality (`alert()`, `prompt()`, and `confirm()`) moved into [**Dialog**](/docs/apis/dialog)

#### Migrating your app to use the new official plugin packages

This change will require you to install each plugin that you were using individually.

1. Search your project for core plugins extracted from the `Plugins` object from `@capacitor/core`
1. Find the corresponding [plugin documentation](/docs/apis), keeping in mind that [some plugins have been split up](#accessibility-app-and-modals-plugins-split-up)
1. Follow the installation instructions for each plugin in the documentation
1. Change the plugin import to import from the plugin's package instead (see [Plugin Imports](#plugin-imports))
1. Follow any instructions in [Backward Incompatible Plugin Changes](#backward-incompatible-plugin-changes)

### Plugin Imports

The `Plugins` object is deprecated, but will continue to work in Capacitor 3. Capacitor plugins should be updated to use the new plugin registration APIs (TODO: link), which will allow them to be imported directly from the plugin's package.

Going forward, the `Plugins` object from `@capacitor/core` should not be used.

```typescript
// OLD
import { Plugins } from '@capacitor/core';
const { AnyPlugin } = Plugins;
```

Importing the plugin directly from the plugin's package is preferred, but the plugin must be updated to work with Capacitor 3 for this to be possible.

```typescript
// NEW
import { AnyPlugin } from 'any-plugin';
```

### Backward Incompatible Plugin Changes

While many of the plugin APIs remain the same to ease the migration process to Capacitor 3, some will require code updates and manual migrations.

- **Accessibility** / **Screen Reader**
  - `isScreenReaderEnabled()` method has been renamed to `isEnabled()`
  - `'accessibilityScreenReaderStateChange'` event has been renamed to `'screenReaderStateChange'`
  - On Android and iOS, `speak()` will only work if a screen reader is currently active. For text-to-speech capabilities while screen readers are active or not, use [`@capacitor-community/text-to-speech`](https://github.com/capacitor-community/text-to-speech).
- **Browser**
  - `prefetch()` has been removed. (TODO: explain)
- **Device**
  - App information has been removed from `getInfo()` (`appVersion`, `appBuild`, `appId` and `appName`). Use the App plugin's [`getInfo()`](/docs/apis/app#getinfo) for this information.
- **Haptics**
  - `HapticsNotificationType` enum keys have been switched from upper case to camel case to match other enums.
- **Share**
  - `share()` method now returns `ShareResult` instead of `any`
  - The return value of `share()` will no longer include `completed`. If it was not completed, it will reject instead.
- **Storage**
  - **Data migration required!** The internal storage mechanism has changed and requires data migration. A convenience method has been added: `migrate()`. To update your app without affecting end users, call `migrate()` before any other methods.

### iOS

Capacitor 3 supports iOS 12+. Xcode 12+ is required.

#### Switch from `CAPBridge` to `ApplicationDelegateProxy` in application events

In `ios/App/App/AppDelegate.swift`, update the following:

```diff-swift
     func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
         // Called when the app was launched with a url. Feel free to add additional processing here,
         // but if you want the App API to support tracking app url opens, make sure to keep this call
-        return CAPBridge.handleOpenUrl(url, options)
+        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
     }

     func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
         // Called when the app was launched with an activity, including Universal Links.
         // Feel free to add additional processing here, but if you want the App API to support
         // tracking app url opens, make sure to keep this call
-        return CAPBridge.handleContinueActivity(userActivity, restorationHandler)
+        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
     }
```

#### Switch from hard-coded `CAPNotifications` to `NSNotification` extensions

In `ios/App/App/AppDelegate.swift`, update the following:

```diff-swift
     override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
         super.touchesBegan(touches, with: event)

         let statusBarRect = UIApplication.shared.statusBarFrame
         guard let touchPoint = event?.allTouches?.first?.location(in: self.window) else { return }

         if statusBarRect.contains(touchPoint) {
-            NotificationCenter.default.post(CAPBridge.statusBarTappedNotification)
+            NotificationCenter.default.post(name: .capacitorStatusBarTapped, object: nil)
         }
     }

     func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
-        NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()), object: deviceToken)
+        NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
     }

     func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
-        NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object: error)
+        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
     }
```

#### Ignore `DerivedData`

Add `DerivedData` to the `ios/.gitignore` file. This is where the Capacitor CLI places native iOS builds.

```diff
 App/Pods
 App/public
 App/Podfile.lock
+DerivedData
 xcuserdata

 # Cordova plugins for Capacitor
```

### Android

#### Switch to automatic Android plugin loading

In Capacitor 3, it is preferred to automatically load the Android plugins (TODO: link). In `MainActivity.java`, the `onCreate` method can be removed. You no longer have to edit this file when adding or removing plugins.

```diff-java
 public class MainActivity extends BridgeActivity {
-    @Override
-    public void onCreate(Bundle savedInstanceState) {
-        super.onCreate(savedInstanceState);
-
-        // Initializes the Bridge
-        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
-            // Additional plugins you've installed go here
-            add(Plugin1.class);
-            add(Plugin2.class);
-        }});
-    }
 }
```

If your app includes custom plugins, you do still have to register the plugins in `onCreate`:

```diff-java
 public class MainActivity extends BridgeActivity {
     @Override
     public void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);

+        registerPlugin(PluginInMyApp.class);
     }
 }
```

#### Update Gradle to 6.5

Android Studio now recommends Gradle 6.5. (TODO)

## Update to 2.0.0

Capacitor 2 makes some tooling updates including the adoption of Swift 5 in iOS and AndroidX for Android.

[Read the Capacitor 2.0 announcement &#8250;](https://ionicframework.com/blog/announcing-capacitor-2-0/)

### Backward Incompatible Plugin Changes

- **Camera**
  - `saveToGallery` default value is now `false` on all platforms
  - if `allowEditing` is `true` and the edit is canceled, the original image is returned
- **Push Notifications**
  - permissions will no longer be requested when `register()` is called, use `requestPermission()`
  - `PushNotificationChannel` renamed to `NotificationChannel`
- **Local Notifications**
  - permissions will no longer be requested when `register()` is called, use `requestPermission()`
  - `schedule()` now returns `LocalNotificationScheduleResult`
- **Toast**
  - unify duration across platforms: short 2000ms, long 3500ms
- **Geolocation**
  - use Fused Location Provider on Android
  - `requireAltitude` removed from `GeolocationOptions`
  - change native location accuracy values on iOS ([more info](https://github.com/ionic-team/capacitor/pull/2420))
- **Filesystem**
  - `createIntermediateDirectories` was removed from `MkdirOptions` (use `recursive` instead)
  - `recursive` option added to writeFile, which changes behavior on Android and web ([more info](https://github.com/ionic-team/capacitor/pull/2487))
  - `Application` directory option removed because it was broken
- **Device**
  - `batteryLevel` and `isCharging` removed from `getInfo()`, use `getBatteryInfo()`
- **Modals**
  - `inputPlaceholder` sets a placeholder instead of text, use `inputText` instead
- **App**
  - `AppRestoredResult` is optional now, returned only if succeeded, otherwise it returns an error
- **Clipboard**
  - `ReadOptions` was removed

### iOS

Capacitor 2 requires Xcode 11+.

#### Update native project to Swift 5

Capacitor 2 uses Swift 5. It's recommended to update your native project to also use Swift 5.

1. From Xcode click **Edit** -> **Convert** -> **To Current Swift Syntax**.
1. **App.app** will appear selected, click **Next** button.
1. Then a message will say **No source changes necessary**.
1. Finally, click the **Update** button.

### Android

#### AndroidX

Capacitor 2 uses AndroidX for Android support library dependencies as recommended by Google, so the native project needs to be updated to use AndroidX as well.

From Android Studio do **Refactor** -> **Migrate to AndroidX**. Then click on **Migrate** button and finally click on **Do Refactor**.

If using Cordova or Capacitor plugins that don't use AndroidX yet, you can use [jetifier](https://www.npmjs.com/package/jetifier) tool to patch them.

```bash
npm install jetifier
npx jetifier
```

To run it automatically after every package install, add `"postinstall": "jetifier"` in the `package.json`.

#### Create common variables

Create a `android/variables.gradle` file with this content:

```groovy
ext {
  minSdkVersion = 21
  compileSdkVersion = 29
  targetSdkVersion = 29
  androidxAppCompatVersion = '1.1.0'
  androidxCoreVersion =  '1.2.0'
  androidxMaterialVersion =  '1.1.0-rc02'
  androidxBrowserVersion =  '1.2.0'
  androidxLocalbroadcastmanagerVersion =  '1.0.0'
  firebaseMessagingVersion =  '20.1.2'
  playServicesLocationVersion =  '17.0.0'
  junitVersion =  '4.12'
  androidxJunitVersion =  '1.1.1'
  androidxEspressoCoreVersion =  '3.2.0'
  cordovaAndroidVersion =  '7.0.0'
}
```

In `android/build.gradle` file, add `apply from: "variables.gradle"`:

```diff-groovy
         classpath 'com.android.tools.build:gradle:4.1.1'
         classpath 'com.google.gms:google-services:4.3.3'

         // NOTE: Do not place your application dependencies here; they belong
         // in the individual module build.gradle files
     }
 }

+apply from: "variables.gradle"

 allprojects {
     repositories {
         google()
         jcenter()

```

#### Use common variables

If you created the `variables.gradle` file, update your project to use them.

In the `android/app/build.gradle` file, make the following updates:

```diff-groovy
 android {
-    compileSdkVersion 28
+    compileSdkVersion rootProject.ext.compileSdkVersion
     defaultConfig {
         applicationId "com.example.app"
-        minSdkVersion 21
-        targetSdkVersion 28
+        minSdkVersion rootProject.ext.minSdkVersion
+        targetSdkVersion rootProject.ext.targetSdkVersion
         versionCode 1
         versionName "1.0"
         testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
```

```diff-groovy
 dependencies {
     implementation fileTree(include: ['*.jar'], dir: 'libs')
-    implementation 'androidx.appcompat:appcompat:1.0.0'
+    implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion"
     implementation project(':capacitor-android')
-    testImplementation 'junit:junit:4.12'
-    androidTestImplementation 'androidx.test.ext:junit:1.1.1'
-    androidTestImplementation 'androidx.test.espresso:espresso-core:3.1.0'
+    testImplementation "junit:junit:$junitVersion"
+    androidTestImplementation "androidx.test.ext:junit:$androidxJunitVersion"
+    androidTestImplementation "androidx.test.espresso:espresso-core:$androidxEspressoCoreVersion"
     implementation project(':capacitor-cordova-android-plugins')
```

> Don't miss the change from single quotes to double quotes. Double quotes are required for variable interpolation.

#### Android Studio plugin update recommended

When you open the Android project in Android Studio, a **Plugin Update Recommended** message will appear. Click on **update**. It will tell you to update Gradle plugin and Gradle. Click **Update** button.

You can also manually update the Gradle plugin and Gradle.

To manually update Gradle plugin, in `android/build.gradle` file, update the `com.android.tool.build:gradle` version to 3.6.1.

To manually update Gradle, in `android/gradle/wrapper/gradle-wrapper.properties`, change `gradle-4.10.1-all.zip` to `gradle-5.6.4-all.zip`.

#### Update Google Services plugin

In `android/build.gradle` file, update the `com.google.gms:google-services` dependency version to 4.3.3.

```diff-groovy
     dependencies {
         classpath 'com.android.tools.build:gradle:4.1.1'
-        classpath 'com.google.gms:google-services:4.2.0'
+        classpath 'com.google.gms:google-services:4.3.3'

         // NOTE: Do not place your application dependencies here; they belong
         // in the individual module build.gradle files
     }
```

#### Change `android:configChanges` to avoid app restarts

In `android/app/src/main/AndroidManifest.xml`, add `|smallestScreenSize|screenLayout|uiMode` in the activity's `android:configChanges` attribute.

```diff-xml
         <activity
-            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
+            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
             android:name="com.example.app"
             android:label="@string/title_activity_main"
             android:theme="@style/AppTheme.NoActionBarLaunch"
             android:launchMode="singleTask">
```

#### Add caches folder to `FileProvider` file paths to avoid permission error when editing gallery images

In `android/app/src/main/res/xml/file_paths.xml` add `<cache-path name="my_cache_images" path="." />`:

```diff-xml
 <?xml version="1.0" encoding="utf-8"?>
 <paths xmlns:android="http://schemas.android.com/apk/res/android">
     <external-path name="my_images" path="." />
+    <cache-path name="my_cache_images" path="." />
 </paths>
```

#### Remove `launch_splash.xml`

The `android/app/src/main/res/drawable/launch_splash.xml` file can be removed because it is no longer used.

### API Changes

Check [`CHANGELOG.md`](https://github.com/ionic-team/capacitor/blob/main/CHANGELOG.md#200-2020-04-03).

## Update to 1.1.0

### iOS

Add `Podfile.lock` to the `ios/.gitignore` file:

```diff
 App/build
 App/Pods
 App/public
+App/Podfile.lock
 xcuserdata

 # Cordova plugins for Capacitor
```

### Android

Remove the `fileprovider_authority` string from the `android/app/src/main/res/values/strings.xml` file:

```diff-xml
     <string name="app_name">My App</string>
     <string name="title_activity_main">My App</string>
     <string name="package_name">com.getcapacitor.myapp</string>
-    <string name="fileprovider_authority">com.getcapacitor.myapp.fileprovider</string>
     <string name="custom_url_scheme">com.getcapacitor.myapp</string>
 </resources>
```
