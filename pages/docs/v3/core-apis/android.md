---
title: Capacitor Android API
description: The API for Capacitor on Android
---

# Capacitor Android API

Capacitor Android is the native runtime that powers Capacitor apps on Android.

> 🚧 This guide is a work-in-progress. Thanks for your patience!

---

## Saving PluginCall

Notes on persisting plugin calls for asynchronous or repeated operations can be [found here](/docs/core-apis/saving-calls).

---

## Bridge

The Android bridge is the heart of the Capacitor Android library. There are several methods available on the bridge which provide information or change behavior.

When registered with Capacitor, plugins have access to the bridge:

```java
this.bridge
```

### getConfig()

```java
public CapConfig getConfig()
```

This property contains the configuration object known to the Capacitor runtime.

---

### triggerJSEvent(...)

```java
public void triggerJSEvent(final String eventName, final String target)
public void triggerJSEvent(final String eventName, final String target, final String data)
```

Fire an event on a JavaScript [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) such as `window` or `document`. If possible, it is preferred to use [Plugin Events](/docs/plugins/android#plugin-events) instead.

Examples:

```java
bridge.triggerJSEvent("myCustomEvent", "window");
bridge.triggerJSEvent("myCustomEvent", "document", "{ 'dataKey': 'dataValue' }");
```
