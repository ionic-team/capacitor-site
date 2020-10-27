---
title: Custom Native iOS Code
description: Custom Native iOS Code
contributors:
  - dotNetkow
  - mlynch
---

# Custom Native iOS Code

With Capacitor, you are encouraged to write Swift or Objective-C code to implement the native features your app needs.

There may not be [a Capacitor plugin](/docs/plugins) for everything--and that's okay! It is possible to write WebView-accessible native code right in your app.

## WebView-Accessible Native Code

The easiest way to communicate between JavaScript and native code is to build a Capacitor plugin local to your app.

### `MyPlugin.swift`

First, create a `MyPlugin.swift` file by [opening Xcode](/docs/ios#opening-the-ios-project), right-clicking on the **App** group (under the **App** target), selecting **New File...** from the context menu, choosing **Swift File** in the window, and creating the file.

![New Swift File in Xcode](/assets/img/docs/ios/xcode-new-swift-file.png)

Copy the following Swift code into `MyPlugin.swift`:

```swift
import Capacitor

@objc(MyPlugin)
public class MyPlugin: CAPPlugin {
  @objc func echo(_ call: CAPPluginCall) {
    let value = call.getString("value") ?? ""
    call.success([
        "value": value
    ])
  }
}
```

> The `@objc` decorators are required to make sure Capacitor's runtime (which must use Objective-C for dynamic plugin support) can see it.

### `MyPlugin.m`

Next, create a `MyPlugin.m` file the same way, but choose **Objective-C** in the window. Leave the **File Type** as **Empty File**. If prompted by Xcode to create a Bridging Header, click **Create Bridging Header**.

> Using Xcode to create native files is recommended because it ensures the references are added to the project appropriately.
>
> These changes to project files should be committed to your project along with the new files themselves.

Copy the following Swift code into `MyPlugin.m`:

```objectivec
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(MyPlugin, "MyPlugin",
  CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
```

> These Objective-C macros register your plugin with Capacitor, making `MyPlugin` and its `echo` method available to JavaScript.

### JavaScript

Once `MyPlugin.swift` and `MyPlugin.m` are created, the plugin is callable from JavaScript:

```typescript
import { Plugins } from '@capacitor/core';
const { MyPlugin } = Plugins;

const result = await MyPlugin.echo({ value: 'Hello World!' });
console.log(result.value);
```

### Next Steps

[Read the iOS Plugin Guide &#8250;](/docs/plugins/ios)
