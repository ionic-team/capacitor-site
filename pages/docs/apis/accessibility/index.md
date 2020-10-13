---
title: Accessibility
description: Accessibility API
pluginapi: AccessibilityPlugin
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Accessibility

The Accessibility API makes it easy to know when a user has a screen reader enabled, as well as programmatically speaking
labels through the connected screen reader.

<!--DOCGEN_INDEX_START-->
* [isScreenReaderEnabled()](#isscreenreaderenabled)
* [speak()](#speak)
* [addListener()](#addlistener)
* [removeAllListeners()](#removealllisteners)
* [Interfaces](#interfaces)
<!--DOCGEN_INDEX_END-->

## Example

```typescript
import { Plugins } from '@capacitor/core';

const { Accessibility, Modals } = Plugins;

Accessibility.addListener('accessibilityScreenReaderStateChange', (state) => {
  console.log(state.value);
});

async isVoiceOverEnabled() {
  var vo = await Accessibility.isScreenReaderEnabled();
  alert('Voice over enabled? ' + vo.value);
}

async speak() {
  var value = await Modals.prompt({
    title: "Value to speak",
    message: "Enter the value to speak"
  });

  Accessibility.speak({value: value.value});
}
```

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### isScreenReaderEnabled

```typescript
isScreenReaderEnabled() => Promise<ScreenReaderEnabledResult>
```

Check if a screen reader is enabled on the device

**Returns:** Promise&lt;[ScreenReaderEnabledResult](#screenreaderenabledresult)&gt;

--------------------


### speak

```typescript
speak(options: AccessibilitySpeakOptions) => Promise<void>
```

Speak a string with a connected screen reader.

| Param       | Type                                                    |
| ----------- | ------------------------------------------------------- |
| **options** | [AccessibilitySpeakOptions](#accessibilityspeakoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### addListener

```typescript
addListener(eventName: 'accessibilityScreenReaderStateChange', listenerFunc: ScreenReaderStateChangeCallback) => PluginListenerHandle
```

Listen for screen reader state change (on/off)

| Param            | Type                                       |
| ---------------- | ------------------------------------------ |
| **eventName**    | "accessibilityScreenReaderStateChange"     |
| **listenerFunc** | (state: ScreenReaderEnabledResult) => void |

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


#### ScreenReaderEnabledResult

| Prop      | Type    |
| --------- | ------- |
| **value** | boolean |


#### AccessibilitySpeakOptions

| Prop         | Type   | Description                                                                                                                                                             |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **value**    | string | The string to speak                                                                                                                                                     |
| **language** | string | The language to speak the string in, as its [ISO 639-1 Code](https://www.loc.gov/standards/iso639-2/php/code_list.php) (ex: "en"). Currently only supported on Android. |


#### PluginListenerHandle

| Prop       | Type       |
| ---------- | ---------- |
| **remove** | () => void |


<!--DOCGEN_API_END-->
