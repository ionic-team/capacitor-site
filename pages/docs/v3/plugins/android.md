---
title: Capacitor Android Plugin Guide
description: Capacitor Android Plugin Guide
contributors:
  - mlynch
  - jcesarmobile
---

# Capacitor Android Plugin Guide

Building Capacitor plugins for Android involves writing Java or [Kotlin](https://developer.android.com/kotlin/overview) to interface with Android SDKs.

## Getting Started

To get started, first generate a plugin as shown in the [Getting Started](/docs/plugins) section of the Plugin guide.

Next, open `my-plugin/android/` in Android Studio. You then want to navigate to the `.java` file for your plugin, which changes depending on the Plugin ID and Plugin Class Name you used when creating the plugin.

For example, for a plugin with the ID `com.domain.myplugin` and the Plugin Class Name `MyPlugin`, you would find the `.java` file at `android/src/main/java/com/domain/myplugin/MyPlugin.java`.

## Using Kotlin

Capacitor uses Java by default but you can use Kotlin instead, if you prefer.

After generating a plugin, right click the Java plugin class in Android Studio and select the "Convert Java file to Kotlin file" option from the menu. Android Studio will walk you through configuring the project for Kotlin support. Once this is completed, right click the Java class again and re-select the conversion option to convert it to a Kotlin class.

## Plugin Basics

A Capacitor plugin for Android is a simple Java class that extends `com.getcapacitor.Plugin` and has a `@CapacitorPlugin()` annotation.
It has some methods with `@PluginMethod()` annotation that will be callable from JavaScript.

Once your plugin is generated, you can start editing it by opening the file with the Plugin class name you choose on the generator.

### Simple Example

In the generated example, there is a simple echo plugin with an `echo` function that simply returns a value that it was given.

This example demonstrates a couple core components of Capacitor plugins: receiving data from a Plugin Call, and returning data back to the caller.

`EchoPlugin.java`

```java
package android.plugin.test;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Echo")
public class EchoPlugin extends Plugin {

    @PluginMethod()
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", value);
        call.success(ret);
    }
}
```

### Accessing Called Data

Each plugin method receives an instance of `com.getcapacitor.PluginCall` containing all the information of the plugin method invocation from the client.

A client can send any data that can be JSON serialized, such as numbers, text, booleans, objects, and arrays. This data
is accessible on the `getData` field of the call instance, or by using convenience methods such as `getString` or `getObject`.

For example, here is how you'd get data passed to your method:

```java
@PluginMethod()
public void storeContact(PluginCall call) {
  String name = call.getString("yourName", "default name");
  JSObject address = call.getObject("address", new JSObject());
  boolean isAwesome = call.getBoolean("isAwesome", false);

  if (!call.getData().has("id")) {
    call.reject("Must provide an id");
    return;
  }
  // ...

  call.resolve();
}
```

Notice the various ways data can be accessed on the `PluginCall` instance, including how to check for a key using `getData`'s `has` method.

### Returning Data Back

A plugin call can either succeed or fail. Plugin calls borrow method names from JavaScript promises: call `resolve()` to indicate success (optionally returning data) and use `reject()` to indicate failure with an error message.

The `resolve()` method of `PluginCall` takes a `JSObject` and supports JSON-serializable data types. Here's an example of returning data back to the client:

```java
JSObject ret = new JSObject();
ret.put("added", true);
JSObject info = new JSObject();
info.put("id", "unique-id-1234");
ret.put("info", info);
call.resolve(ret);
```

To fail, or reject a call, use `call.reject`, passing an error string and optionally an error code and `Exception` instance

```java
call.reject(exception.getLocalizedMessage(), null, exception);
```

## Permissions

If your plugin has functionality on Android that requires permissions from the end user, then you will need to implement the permissions pattern. If you haven't yet set up your permission aliases and status interfaces yet, see the [Permissions section in the Web guide](/docs/plugins/web#permissions).

### Annotation Changes

> Still using `@NativePlugin`? See the [upgrade guide](/docs/updating/plugins/3-0#use-the-new-capacitorplugin-annotation) to switch to `@CapacitorPlugin`.

```diff-java
 @CapacitorPlugin(
     name = "FooBar",
+    permissions = {
+        @Permission(
+            alias = "camera",
+            strings = { Manifest.permission.CAMERA }
+        ),
+        @Permission(
+            alias = "storage",
+            strings = {
+                Manifest.permission.READ_EXTERNAL_STORAGE,
+                Manifest.permission.WRITE_EXTERNAL_STORAGE
+            }
+        )
+    }
 )
 public class FooBarPlugin extends Plugin {
     ...
```

Define the permissions element in the `@CapacitorPlugin` annotation. One or more `@Permission` elements can be defined inside this array, each containing zero or more Android permission strings. Each permission element should be given a short alias describing the purpose.

Group permission strings in each `@Permission` by the distinct pieces of functionality of your plugin. If your plugin requires permissions in other platforms but not Android, then define the permission with the same alias but an empty array for `strings`. This causes the result of the permission request to automatically return as 'granted' for that permission alias.

```diff-java
 @CapacitorPlugin(
     name = "FooBar",
+    permissions = {
+        @Permission(
+            alias = "notifications",
+            strings = {}
+        )
+    }
 )
 public class FooBarPlugin extends Plugin {
     ...
```

### Implementing Permission Requests

Defining the permissions in the `@CapacitorPlugin` annotation is enough to enable functional `checkPermissions` and `requestPermissions` calls from a web app. However, you may also decide to wrap your own permission checks and requests around functionality in a plugin.

#### Callback

Create a private method with parameters `(PluginCall, Map<String, PermissionState>)` and provide the name of the method in the `@PluginMethod` annotation on the plugin call. This callback will run after the completion of a permission request initiated with the associated call object.

```diff-java
+ @PluginMethod(permissionCallback = "cameraPermsCallback")
 public void takePhoto(PluginCall call) {
   if (needPermission()) {
+    requestPermissionForAlias("camera", call);
   } else {
     loadCamera(call);
   }
 }

+ private void cameraPermsCallback(PluginCall call, Map<String, PermissionState> permissionStatus) {
+   if (permissionStatus.get("camera") == PermissionState.GRANTED) {
+     loadCamera(call);
+   } else {
+     call.reject("Permission is required to take a picture");
+   }
+ }
```

#### Initiating a Permission Request

Permission requests are initiated by calling one of the request helper methods.

For a single permission `requestPermissionForAlias` may be used. Multiple aliases can be provided to `requestPermissionForAliases`. Use `requestAllPermissions` to request all permissions defined in the plugin annotation.

```diff-java
 @PluginMethod(permissionCallback = "cameraPermsCallback")
 public void takePhoto(PluginCall call) {
   if (needPermission()) {
+    requestAllPermissions(call);
   } else {
     loadCamera(call);
   }
 }

 private void cameraPermsCallback(PluginCall call, Map<String, PermissionState> permissionStatus) {
   ...
 }
```

## Error Handling

### Unavailable

This error can be thrown to indicate that the functionality can't be used right now, usually because it requires a newer Android API version.

```java
@PluginMethod
public void methodThatUsesNewAndroidAPI(PluginCall call) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        // TODO implementation
    } else {
        call.unavailable('Not available on Android API 25 or earlier.');
    }
}
```

> It is recommended to gracefully degrade the experience with older APIs as much as possible. Use `unavailable` sparingly.

### Unimplemented

Use this error to indicate that a method can't be implemented for Android.

```java
@PluginMethod
public void methodThatRequiresIOS(PluginCall call) {
    call.unimplemented('Not implemented on Android.');
}
```

## Presenting Native Screens

To present a Native Screen over the Capacitor screen we will use [Android's Intents](https://developer.android.com/guide/components/intents-filters). Intents allow you to start an activity from your app, or from another app. [See Common Intents](https://developer.android.com/guide/components/intents-common)

### Intents without Result(s)

Most times you just want to present the native Activity,
in this case you can just trigger the [relevant action](https://developer.android.com/guide/components/intents-common).

```java
Intent intent = new Intent(Intent.ACTION_VIEW);
getActivity().startActivity(intent);
```

### Intents with Result(s)

Sometimes when you launch an Intent, you expect some result back. In that case you want to use `startActivityForResult`.

Make sure to register your intents [unique request](https://developer.android.com/training/basics/intents/result#StartActivity) code with `@CapacitorPlugin` in order for
`handleOnActivityResult` to be triggered.

```java
@CapacitorPlugin(
  requestCodes={MyPlugin.REQUEST_IMAGE_PICK} // register request code(s) for intent results
)
class ImagePicker extends Plugin {
  protected static final int REQUEST_IMAGE_PICK = 12345; // Unique request code

  @PluginMethod()
  public void pickImage(PluginCall call) {
    Intent intent = new Intent(Intent.ACTION_PICK);
    intent.setType("image/*");

    startActivityForResult(call, intent, REQUEST_IMAGE_PICK);
  }

  // in order to handle the intents result, you have to @Override handleOnActivityResult
  @Override
  protected void handleOnActivityResult(PluginCall lastPluginCall, int requestCode, int resultCode, Intent data) {
    if (lastPluginCall == null) {
      return;
    }

    if (requestCode == REQUEST_IMAGE_PICK) {
      // Do something with the data
    }
  }
}
```

## Plugin Events

Plugins can emit their own events that you can listen by attaching a listener to the plugin object like this:

```typescript
import { MyPlugin } from 'my-plugin';

MyPlugin.addListener('myPluginEvent', (info: any) => {
  console.log('myPluginEvent was fired');
});
```

To emit the event from the Java plugin class:

```java
JSObject ret = new JSObject();
ret.put("value", "some value");
notifyListeners("myPluginEvent", ret);
```

To remove a listener from the plugin object:

```typescript
import { MyPlugin } from 'my-plugin';

const myPluginEventListener = MyPlugin.addListener(
  'myPluginEvent',
  (info: any) => {
    console.log('myPluginEvent was fired');
  },
);

myPluginEventListener.remove();
```

> It is also possible to trigger global events on `window`. See the docs for [`triggerJSEvent`](/docs/core-apis/android#triggerjsevent).

## Override navigation

Capacitor plugins can override the webview navigation. For that the plugin can override `public Boolean shouldOverrideLoad(Uri url)` method.
Returning `true` causes the WebView to abort loading the URL.
Returning `false` causes the WebView to continue loading the URL.
Returning `null` will defer to the default Capacitor policy.
