---
title: JavaScript Utilities
description: Capacitor's JavaScript Utilities
url: /docs/basics/javascript-utilities
contributors:
  - dotNetkow
---

# Capacitor JavaScript Utilities

<p class="intro">Capacitor has a number of JavaScript utilities that are useful when developing apps. Simply import Capacitor from `@capacitor/core` then call the desired utility function:</p>

```typescript
import { Capacitor } from '@capacitor/core';
// Call Utility function
```

## convertFileSrc



Capacitor apps are hosted on a local HTTP server and are served with the http:// protocol. Some plugins, however, attempt to access device files via the file:// protocol. To avoid difficulties between http:// and file://, paths to device files must be rewritten to use the local HTTP server. For example, `file:///path/to/device/file` must be rewritten as `http://<host>:<port>/<prefix>/path/to/device/file` before being rendered in the app.

`convertFileSrc: (filePath: string) => string;`

```typescript
// file:///path/to/device/file
const savedPhotoFile = await Filesystem.writeFile({
  path: "myFile.jpg",
  data: base64Data,
  directory: FilesystemDirectory.Data
});

// http://
const savedPhoto = Capacitor.convertFileSrc(savedPhotoFile.uri),
document.getElementById("savedPhoto").src = savedPhoto;
```

```html
<!-- Angular HTML template -->
<img id="savedPhoto" />
```

## getPlatform

Get the name of the platform the app is currently running on: `web, ios, android`.

`getPlatform: () => string;`

```typescript
if (Capacitor.getPlatform() === 'ios') {
  // do something
}
```

## isNative



`isNative?: boolean;`

```typescript
if (Capacitor.isNative) {

}
```



## isPluginAvailable

Check if plugin is available on the currently running platform. Works with Core and custom plugins.

`isPluginAvailable: (name: string) => boolean;`

```typescript
const isAvailable = Capacitor.isPluginAvailable('Camera');

if (!isAvailable) {
  // Have the user upload a file instead
} else {
  // Otherwise, make the call:
  const image = await Camera.getPhoto({
    resultType: CameraResultType.Uri
  });
}
```




