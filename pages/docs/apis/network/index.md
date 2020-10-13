---
title: Network
description: Network API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Network

The Network API provides events for monitoring network status changes, along with querying the current state of the network.

<!--DOCGEN_INDEX_START-->
* [getStatus()](#getstatus)
* [addListener()](#addlistener)
* [removeAllListeners()](#removealllisteners)
* [Interfaces](#interfaces)
<!--DOCGEN_INDEX_END-->

## Example

```typescript
import { Plugins } from '@capacitor/core';

const { Network } = Plugins;

let handler = Network.addListener('networkStatusChange', (status) => {
  console.log("Network status changed", status);
});
// To stop listening:
// handler.remove();

// Get the current network status
let status = await Network.getStatus();

// Example output:
{
  "connected": true,
  "connectionType": "wifi"
}
```

## Android Note

The Network API requires the following permission be added to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

This permission allows the app to access information about the current network, such as whether it is connected to wifi or cellular.

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### getStatus

```typescript
getStatus() => Promise<NetworkStatus>
```

Query the current network status

**Returns:** Promise&lt;[NetworkStatus](#networkstatus)&gt;

--------------------


### addListener

```typescript
addListener(eventName: 'networkStatusChange', listenerFunc: (status: NetworkStatus) => void) => PluginListenerHandle
```

Listen for network status change events

| Param            | Type                            |
| ---------------- | ------------------------------- |
| **eventName**    | "networkStatusChange"           |
| **listenerFunc** | (status: NetworkStatus) => void |

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


#### NetworkStatus

| Prop               | Type                                        |
| ------------------ | ------------------------------------------- |
| **connected**      | boolean                                     |
| **connectionType** | "none" \| "unknown" \| "wifi" \| "cellular" |


#### PluginListenerHandle

| Prop       | Type       |
| ---------- | ---------- |
| **remove** | () => void |


<!--DOCGEN_API_END-->
