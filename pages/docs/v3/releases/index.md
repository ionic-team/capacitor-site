---
title: Release Notes
description: The release history and upgrade instructions for Capacitor
---

# Release Notes

This is a list of releases and any corresponding upgrade instructions. For a comprehensive list of changes, see [`CHANGELOG.md`](https://github.com/ionic-team/capacitor/blob/HEAD/CHANGELOG.md).

## 3.0.0 (WIP)

Capacitor 3 brings crucial updates to the ecosystem and exciting new features.

Read the Capacitor 3.0 announcement &#8250; (TODO)

### NodeJS 12+

Node 8 has reached end-of-life. Node 10 will reach end-of-life on April 30th, 2021. Capacitor 3 requires NodeJS 12 or greater. (Latest LTS version is recommended.)

### ES2017+

Capacitor 3 now builds for ES2017 environments, instead of ES5. The [plugin template has also been updated](https://github.com/ionic-team/capacitor/pull/3427/files#diff-b22b3d0cbb7d8f6fdfe1f6f1d9e84b7d) to target ES2017, and third-party plugins are encouraged to update their targets.

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

### iOS

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
-  @Override
-  public void onCreate(Bundle savedInstanceState) {
-    super.onCreate(savedInstanceState);
-
-    // Initializes the Bridge
-    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
-      // Additional plugins you've installed go here
-      add(Plugin1.class);
-      add(Plugin2.class);
-    }});
-  }
 }
```

If your app includes custom plugins, you do still have to register the plugins in `onCreate`:

```java
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(PluginInMyApp.class);
  }
}
```

#### Update Gradle to 6.5

Android Studio now recommends Gradle 6.5. (TODO)

## 2.0.0

Capacitor 2 makes some tooling updates including the adoption of Swift 5 in iOS and AndroidX for Android.

[Read the Capacitor 2.0 announcement &#8250;](https://ionicframework.com/blog/announcing-capacitor-2-0/)

### iOS

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

### API Changes

Check [`CHANGELOG.md`](https://github.com/ionic-team/capacitor/blob/main/CHANGELOG.md#200-2020-04-03).

## 1.1.0

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
