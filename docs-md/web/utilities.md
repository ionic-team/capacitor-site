---
title: JavaScript Utilities
description: Capacitor's JavaScript Utilities
url: /docs/web/utilities
contributors:
  - dotNetkow
---

# JavaScript Utilities

<p class="intro">Capacitor has several JavaScript utilities useful for ensuring apps run successfully across multiple platforms with the same codebase. Simply import Capacitor then call the desired utility function:</p>

```typescript
import { Capacitor } from '@capacitor/core';
const isAvailable = Capacitor.isPluginAvailable('Camera');
```

## convertFileSrc

`convertFileSrc: (filePath: string) => string;`

Convert a device filepath into a Web View-friendly path.

Capacitor apps are hosted on a local HTTP server and are served with the HTTP protocol. However, device files are accessed via the File protocol. To avoid difficulties between `http://` and `file://`, paths to device files must be rewritten to use the local HTTP server. For example, `file:///path/to/device/file` must be rewritten as `http://<host>:<port>/<prefix>/path/to/device/file` before being rendered in the app.

```typescript
// file:///path/to/device/photo.jpg
const savedPhotoFile = await Filesystem.writeFile({
  path: "myFile.jpg",
  data: base64Data,
  directory: FilesystemDirectory.Data
});

// http://localhost/path/to/device/photo.jpg
const savedPhoto = Capacitor.convertFileSrc(savedPhotoFile.uri),
document.getElementById("savedPhoto").src = savedPhoto;
```

```html
<img id="savedPhoto" />
```

## getPlatform

`getPlatform: () => string;`

Get the name of the platform the app is currently running on: `web, ios, android`.

```typescript
if (Capacitor.getPlatform() === 'ios') {
  // do something
}
```

## isNative

`isNative?: boolean;`

Check whether the currently running platform is native (`ios, android`).

```typescript
if (Capacitor.isNative) {
  // do something
}
```

## isPluginAvailable

`isPluginAvailable: (name: string) => boolean;`

Check if plugin is available on the currently running platform. The plugin name is defined in the Web plugin's configuration (`web.ts`). Works with both Capacitor Core and custom plugins.

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
