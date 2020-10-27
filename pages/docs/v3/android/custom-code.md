---
title: Custom Native Android Code
description: Custom Native Android Code
contributors:
  - mlynch
  - jcesarmobile
  - RoderickQiu
---

# Custom Native Android Code

With Capacitor, you are encouraged to write Java or Kotlin code to implement the native features your app needs.

There may not be [a Capacitor plugin](/docs/plugins) for everything--and that's okay! It is possible to write WebView-accessible native code right in your app.

## WebView-Accessible Native Code

The easiest way to communicate between JavaScript and native code is to build a Capacitor plugin local to your app.

### `MyPlugin.java`

First, create a `MyPlugin.java` file by [opening Android Studio](/docs/android#opening-the-android-project), expanding the **app** module and the **java** folder, right-clicking on your app's Java package, selecting **New** -> **Java Class** from the context menu, and creating the file.

![Android Studio app package](/assets/img/docs/android/studio-app-package.png)

Copy the following Java code into `MyPlugin.java`:

```java
package com.example.myapp;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class MyPlugin extends Plugin {

  @PluginMethod()
  public void echo(PluginCall call) {
    String value = call.getString("value");

    JSObject ret = new JSObject();
    ret.put("value", value);
    call.resolve(ret);
  }
}
```

### Register the Plugin

Capacitor plugins for Android must be registered in `MainActivity.java`.

```diff-java
 // Other imports...
+import com.example.myapp.MyPlugin;

 public class MainActivity extends BridgeActivity {
   @Override
   public void onCreate(Bundle savedInstanceState) {
     super.onCreate(savedInstanceState);

     // Initializes the Bridge
     this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
       // Additional plugins you've installed go here
       // Ex: add(TotallyAwesomePlugin.class);
+      add(MyPlugin.class);
     }});
   }
 }
```

### JavaScript

Once `MyPlugin.java` is created and the class is registered in `MainActivity.java`, the plugin is callable from JavaScript:

```typescript
import { Plugins } from '@capacitor/core';
const { MyPlugin } = Plugins;

const result = await MyPlugin.echo({ value: 'Hello World!' });
console.log(result.value);
```

### Next Steps

[Read the Android Plugin Guide &#8250;](/docs/plugins/android)
