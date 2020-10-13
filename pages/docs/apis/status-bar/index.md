---
title: Status Bar
description: Status Bar API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="ios,android"></plugin-platforms>

# Status Bar

The StatusBar API Provides methods for configuring the style of the Status Bar, along with showing or hiding it.

<!--DOCGEN_INDEX_START-->
* [setStyle()](#setstyle)
* [setBackgroundColor()](#setbackgroundcolor)
* [show()](#show)
* [hide()](#hide)
* [getInfo()](#getinfo)
* [setOverlaysWebView()](#setoverlayswebview)
* [Interfaces](#interfaces)
* [Enums](#enums)
<!--DOCGEN_INDEX_END-->

## iOS Note

This plugin requires "View controller-based status bar appearance" (`UIViewControllerBasedStatusBarAppearance`) set to `YES` in `Info.plist`. Read about [Configuring iOS](/docs/ios/configuration) for help.

The status bar visibility defaults to visible and the style defaults to `StatusBarStyle.Light`. You can change these defaults by adding `UIStatusBarHidden` and or `UIStatusBarStyle` in the `Info.plist`.

`setBackgroundColor` and `setOverlaysWebView` are currently not supported on iOS devices.

## Events

* statusTap

## Example

```typescript
// Events (iOS only)
window.addEventListener('statusTap', function () {
  console.log("statusbar tapped");
});

//API
import {
  Plugins,
  StatusBarStyle,
} from '@capacitor/core';

const { StatusBar } = Plugins;

export class StatusBarExample {
  isStatusBarLight = true

  changeStatusBar() {
    StatusBar.setStyle({
      style: this.isStatusBarLight ? StatusBarStyle.Dark : StatusBarStyle.Light
    });
    this.isStatusBarLight = !this.isStatusBarLight;

    // Display content under transparent status bar (Android only)
    StatusBar.setOverlaysWebView({
      overlay: true
    });
  }

  hideStatusBar() {
    StatusBar.hide();
  }

  showStatusBar() {
    StatusBar.show();
  }
}
```

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### setStyle

```typescript
setStyle(options: StatusBarStyleOptions) => Promise<void>
```

Set the current style of the status bar

| Param       | Type                                            |
| ----------- | ----------------------------------------------- |
| **options** | [StatusBarStyleOptions](#statusbarstyleoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### setBackgroundColor

```typescript
setBackgroundColor(options: StatusBarBackgroundColorOptions) => Promise<void>
```

Set the background color of the status bar

| Param       | Type                                                                |
| ----------- | ------------------------------------------------------------------- |
| **options** | [StatusBarBackgroundColorOptions](#statusbarbackgroundcoloroptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### show

```typescript
show(options?: StatusBarAnimationOptions) => Promise<void>
```

Show the status bar

| Param       | Type                                                    |
| ----------- | ------------------------------------------------------- |
| **options** | [StatusBarAnimationOptions](#statusbaranimationoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### hide

```typescript
hide(options?: StatusBarAnimationOptions) => Promise<void>
```

Hide the status bar

| Param       | Type                                                    |
| ----------- | ------------------------------------------------------- |
| **options** | [StatusBarAnimationOptions](#statusbaranimationoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### getInfo

```typescript
getInfo() => Promise<StatusBarInfoResult>
```

Get info about the current state of the status bar

**Returns:** Promise&lt;[StatusBarInfoResult](#statusbarinforesult)&gt;

--------------------


### setOverlaysWebView

```typescript
setOverlaysWebView(options: StatusBarOverlaysWebviewOptions) => Promise<void>
```

Set whether or not the status bar should overlay the webview to allow usage of the space
around a device "notch"

| Param       | Type                                                                |
| ----------- | ------------------------------------------------------------------- |
| **options** | [StatusBarOverlaysWebviewOptions](#statusbaroverlayswebviewoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### Interfaces


#### StatusBarStyleOptions

| Prop      | Type                              |
| --------- | --------------------------------- |
| **style** | [StatusBarStyle](#statusbarstyle) |


#### StatusBarBackgroundColorOptions

| Prop      | Type   |
| --------- | ------ |
| **color** | string |


#### StatusBarAnimationOptions

| Prop          | Type                                      | Description                                                             |
| ------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| **animation** | [StatusBarAnimation](#statusbaranimation) | iOS only. The type of status bar animation used when showing or hiding. |


#### StatusBarInfoResult

| Prop         | Type                              |
| ------------ | --------------------------------- |
| **visible**  | boolean                           |
| **style**    | [StatusBarStyle](#statusbarstyle) |
| **color**    | string                            |
| **overlays** | boolean                           |


#### StatusBarOverlaysWebviewOptions

| Prop        | Type    |
| ----------- | ------- |
| **overlay** | boolean |


### Enums


#### StatusBarStyle

| Members   | Value   | Description                      |
| --------- | ------- | -------------------------------- |
| **Dark**  | "DARK"  | Light text for dark backgrounds. |
| **Light** | "LIGHT" | Dark text for light backgrounds. |


#### StatusBarAnimation

| Members   | Value   | Description                       |
| --------- | ------- | --------------------------------- |
| **None**  | "NONE"  | No animation during show/hide.    |
| **Slide** | "SLIDE" | Slide animation during show/hide. |
| **Fade**  | "FADE"  | Fade animation during show/hide.  |


<!--DOCGEN_API_END-->
