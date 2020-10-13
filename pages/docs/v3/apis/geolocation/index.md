---
title: Geolocation
description: Geolocation API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Geolocation

The Geolocation API provides simple methods for getting and tracking the current position of the device using GPS, along
with altitude, heading, and speed information if available.

<!--DOCGEN_INDEX_START-->
* [getCurrentPosition()](#getcurrentposition)
* [watchPosition()](#watchposition)
* [clearWatch()](#clearwatch)
* [Interfaces](#interfaces)
<!--DOCGEN_INDEX_END-->

## iOS Notes

Apple requires privacy descriptions to be specified in `Info.plist` for location information:

Name: `Privacy - Location Always Usage Description`
Key: `NSLocationAlwaysUsageDescription`

Name: `Privacy - Location When In Use Usage Description`
Key: `NSLocationWhenInUseUsageDescription`

Read about [Setting iOS Permissions](/docs/ios/configuration/) in the [iOS Guide](/docs/ios/) for more information on setting iOS permissions in Xcode

## Android Notes

This API requires the following permissions be added to your `AndroidManifest.xml`:

```xml
<!-- Geolocation API -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
```

The first two permissions ask for location data, both fine and coarse, and the last line is optional but necessary if your app _requires_ GPS to function. You may leave it out, though keep in mind that this may mean your app is installed on devices lacking GPS hardware.

Read about [Setting Android Permissions](/docs/android/configuration/) in the [Android Guide](/docs/android/) for more information on setting Android permissions.

## Example

```typescript
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

class GeolocationExample {
  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
    })
  }
}
```

## API

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### getCurrentPosition

```typescript
getCurrentPosition(options?: GeolocationOptions) => Promise<GeolocationPosition>
```

Get the current GPS location of the device

| Param       | Type                                      |
| ----------- | ----------------------------------------- |
| **options** | [GeolocationOptions](#geolocationoptions) |

**Returns:** Promise&lt;[GeolocationPosition](#geolocationposition)&gt;

--------------------


### watchPosition

```typescript
watchPosition(options: GeolocationOptions, callback: GeolocationWatchCallback) => CallbackID
```

Set up a watch for location changes. Note that watching for location changes
can consume a large amount of energy. Be smart about listening only when you need to.

| Param        | Type                                               |
| ------------ | -------------------------------------------------- |
| **options**  | [GeolocationOptions](#geolocationoptions)          |
| **callback** | (position: GeolocationPosition, err?: any) => void |

**Returns:** string

--------------------


### clearWatch

```typescript
clearWatch(options: { id: string; }) => Promise<void>
```

Clear a given watch

| Param       | Type            |
| ----------- | --------------- |
| **options** | { id: string; } |

**Returns:** Promise&lt;void&gt;

--------------------


### Interfaces


#### GeolocationPosition

| Prop          | Type                                                                                                                                       | Description                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **timestamp** | number                                                                                                                                     | Creation timestamp for coords                           |
| **coords**    | { latitude: number; longitude: number; accuracy: number; altitudeAccuracy?: number; altitude?: number; speed?: number; heading?: number; } | The GPS coordinates along with the accuracy of the data |


#### GeolocationOptions

| Prop                   | Type    |
| ---------------------- | ------- |
| **enableHighAccuracy** | boolean |
| **timeout**            | number  |
| **maximumAge**         | number  |


<!--DOCGEN_API_END-->
