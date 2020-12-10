---
title: Release Notes
description: The release history and upgrade instructions for Capacitor
---

# Release Notes

This is a list of releases and any corresponding upgrade instructions. For a comprehensive list of changes, see [`CHANGELOG.md`](https://github.com/ionic-team/capacitor/blob/HEAD/CHANGELOG.md).

## 2.0.0

### iOS

#### Update native project to Swift 5

Capacitor 2.0 uses Swift 5. It's recommended to update your native project to also use Swift 5.

1. From Xcode click **Edit** -> **Convert** -> **To Current Swift Syntax**.
1. **App.app** will appear selected, click **Next** button.
1. Then a message will say **No source changes necessary**.
1. Finally, click the **Update** button.

### Android

#### AndroidX

Capacitor 2.0 uses AndroidX for Android support library dependencies as recommended by Google, so the native project needs to be updated to use AndroidX as well.

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
