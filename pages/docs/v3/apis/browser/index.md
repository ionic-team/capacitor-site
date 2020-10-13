---
title: Browser
description: Browser API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Browser

<!--DOCGEN_INDEX_START-->
* [open()](#open)
* [prefetch()](#prefetch)
* [close()](#close)
* [addListener()](#addlistener)
* [addListener()](#addlistener)
* [removeAllListeners()](#removealllisteners)
* [Interfaces](#interfaces)
<!--DOCGEN_INDEX_END-->

The Browser API makes it easy to open an in-app browser session to show external web content,
handle authentication flows, and more.

On iOS this uses `SFSafariViewController` and is compliant with leading oAuth service in-app-browser requirements.

```typescript
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

await Browser.open({ url: 'http://capacitorjs.com/' });
```

## API

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### open

```typescript
open(options: BrowserOpenOptions) => Promise<void>
```

Open a page with the given URL

| Param       | Type                                      |
| ----------- | ----------------------------------------- |
| **options** | [BrowserOpenOptions](#browseropenoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### prefetch

```typescript
prefetch(options: BrowserPrefetchOptions) => Promise<void>
```

Hint to the browser that the given URLs will be accessed
to improve initial loading times.

Only functional on Android, is a no-op on iOS

| Param       | Type                                              |
| ----------- | ------------------------------------------------- |
| **options** | [BrowserPrefetchOptions](#browserprefetchoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### close

```typescript
close() => Promise<void>
```

Close an open browser. Only works on iOS and Web environment, otherwise is a no-op

**Returns:** Promise&lt;void&gt;

--------------------


### addListener

```typescript
addListener(eventName: 'browserFinished', listenerFunc: (info: any) => void) => PluginListenerHandle
```

| Param            | Type                |
| ---------------- | ------------------- |
| **eventName**    | "browserFinished"   |
| **listenerFunc** | (info: any) => void |

**Returns:** [PluginListenerHandle](#pluginlistenerhandle)

--------------------


### addListener

```typescript
addListener(eventName: 'browserPageLoaded', listenerFunc: (info: any) => void) => PluginListenerHandle
```

| Param            | Type                |
| ---------------- | ------------------- |
| **eventName**    | "browserPageLoaded" |
| **listenerFunc** | (info: any) => void |

**Returns:** [PluginListenerHandle](#pluginlistenerhandle)

--------------------


### removeAllListeners

```typescript
removeAllListeners() => void
```

Remove all native listeners for this plugin

**Returns:** void

--------------------


### Interfaces


#### BrowserOpenOptions

| Prop                  | Type                      | Description                                                                                                   |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **url**               | string                    | The URL to open the browser to                                                                                |
| **windowName**        | string                    | Web only: Optional target for browser open. Follows the `target` property for window.open. Defaults to _blank |
| **toolbarColor**      | string                    | A hex color to set the toolbar color to.                                                                      |
| **presentationStyle** | "fullscreen" \| "popover" | iOS only: The presentation style of the browser. Defaults to fullscreen.                                      |


#### BrowserPrefetchOptions

| Prop     | Type     |
| -------- | -------- |
| **urls** | string[] |


#### PluginListenerHandle

| Prop       | Type       |
| ---------- | ---------- |
| **remove** | () => void |


<!--DOCGEN_API_END-->
