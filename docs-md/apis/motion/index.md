---
title: Motion
description: Motion API
url: /docs/apis/motion
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Motion

The Motion API tracks accelerometer and device orientation (compass heading, etc.)

<plugin-api index="true" name="motion"></plugin-api>

## Permissions

This plugin is currently implemented using Web APIs. Most browsers require permission before using this API. To request, permission, prompt the user for permission on any user-initiated action (such as a button click):

```typescript
document.getElementById('start-button').addEventListener('click', async () => {
  try {
    await DeviceMotionEvent.requestPermission();
  } catch (e) {
    // Handle error
    return;
  }

  // Once the user approves, can start listening:
  const { Motion } = Capacitor.Plugins;
  Capacitor.Plugins.Motion.addListener('accel', (event) => {
  });
});
```

### Example

```typescript
const { Motion } = Capacitor.Plugins;
Motion.addListener('accel', (event) => {
});
```

See the [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) API to understand the data supplied in `event`.

### API

<plugin-api name="motion"></plugin-api>
