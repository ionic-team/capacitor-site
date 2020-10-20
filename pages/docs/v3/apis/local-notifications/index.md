---
title: Local Notifications
description: Local Notifications API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Local Notifications

The Local Notification API provides a way to schedule "local" notifications - notifications that are scheduled and delivered on the device as opposed to "push" notifications sent from a server.

Local Notifications are great for reminding the user about a change in the app since they last visited, providing reminder features, and delivering offline information with the app being in the foreground.

<docgen-index>
* [schedule()](#schedule)
* [getPending()](#getpending)
* [registerActionTypes()](#registeractiontypes)
* [cancel()](#cancel)
* [areEnabled()](#areenabled)
* [createChannel()](#createchannel)
* [deleteChannel()](#deletechannel)
* [listChannels()](#listchannels)
* [requestPermission()](#requestpermission)
* [addListener()](#addlistener)
* [addListener()](#addlistener)
* [removeAllListeners()](#removealllisteners)
* [Interfaces](#interfaces)
</docgen-index>

## Example

```typescript
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

const notifs = await LocalNotifications.schedule({
  notifications: [
    {
      title: "Title",
      body: "Body",
      id: 1,
      schedule: { at: new Date(Date.now() + 1000 * 5) },
      sound: null,
      attachments: null,
      actionTypeId: "",
      extra: null
    }
  ]
});
console.log('scheduled notifications', notifs);
```

## Local Notifications configuration (Android only)

The local notification plugin allows the following configuration values to be added in `capacitor.config.json` for the Android platform:

- `smallIcon`: It allows you to set the default icon for the local notification.
- `iconColor`: It allows you to set the default color for the local notification icon.
- `sound`: It allows you to set the default notification sound. On Android 26+ it sets the default channel sound and can't be changed unless the app is uninstalled.

```json
 "plugins": {
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#488AFF",
      "sound": "beep.wav"
    }
  }
```

## API

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### schedule

```typescript
schedule(options: { notifications: LocalNotification[]; }) => Promise<LocalNotificationScheduleResult>
```

| Param       | Type                                    |
| ----------- | --------------------------------------- |
| **options** | { notifications: LocalNotification[]; } |

**Returns:** Promise&lt;[LocalNotificationScheduleResult](#localnotificationscheduleresult)&gt;

--------------------


### getPending

```typescript
getPending() => Promise<LocalNotificationPendingList>
```

**Returns:** Promise&lt;[LocalNotificationPendingList](#localnotificationpendinglist)&gt;

--------------------


### registerActionTypes

```typescript
registerActionTypes(options: { types: LocalNotificationActionType[]; }) => Promise<void>
```

| Param       | Type                                      |
| ----------- | ----------------------------------------- |
| **options** | { types: LocalNotificationActionType[]; } |

**Returns:** Promise&lt;void&gt;

--------------------


### cancel

```typescript
cancel(pending: LocalNotificationPendingList) => Promise<void>
```

| Param       | Type                                                          |
| ----------- | ------------------------------------------------------------- |
| **pending** | [LocalNotificationPendingList](#localnotificationpendinglist) |

**Returns:** Promise&lt;void&gt;

--------------------


### areEnabled

```typescript
areEnabled() => Promise<LocalNotificationEnabledResult>
```

**Returns:** Promise&lt;[LocalNotificationEnabledResult](#localnotificationenabledresult)&gt;

--------------------


### createChannel

```typescript
createChannel(channel: NotificationChannel) => Promise<void>
```

| Param       | Type                                        |
| ----------- | ------------------------------------------- |
| **channel** | [NotificationChannel](#notificationchannel) |

**Returns:** Promise&lt;void&gt;

--------------------


### deleteChannel

```typescript
deleteChannel(channel: NotificationChannel) => Promise<void>
```

| Param       | Type                                        |
| ----------- | ------------------------------------------- |
| **channel** | [NotificationChannel](#notificationchannel) |

**Returns:** Promise&lt;void&gt;

--------------------


### listChannels

```typescript
listChannels() => Promise<NotificationChannelList>
```

**Returns:** Promise&lt;[NotificationChannelList](#notificationchannellist)&gt;

--------------------


### requestPermission

```typescript
requestPermission() => Promise<NotificationPermissionResponse>
```

**Returns:** Promise&lt;[NotificationPermissionResponse](#notificationpermissionresponse)&gt;

--------------------


### addListener

```typescript
addListener(eventName: 'localNotificationReceived', listenerFunc: (notification: LocalNotification) => void) => PluginListenerHandle
```

| Param            | Type                                      |
| ---------------- | ----------------------------------------- |
| **eventName**    | "localNotificationReceived"               |
| **listenerFunc** | (notification: LocalNotification) => void |

**Returns:** [PluginListenerHandle](#pluginlistenerhandle)

--------------------


### addListener

```typescript
addListener(eventName: 'localNotificationActionPerformed', listenerFunc: (notificationAction: LocalNotificationActionPerformed) => void) => PluginListenerHandle
```

| Param            | Type                                                           |
| ---------------- | -------------------------------------------------------------- |
| **eventName**    | "localNotificationActionPerformed"                             |
| **listenerFunc** | (notificationAction: LocalNotificationActionPerformed) => void |

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


#### LocalNotificationScheduleResult


#### LocalNotification

| Prop                 | Type                                                    | Description                                                                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **title**            | string                                                  |                                                                                                                                                                                                                                                                        |
| **body**             | string                                                  |                                                                                                                                                                                                                                                                        |
| **id**               | number                                                  |                                                                                                                                                                                                                                                                        |
| **schedule**         | [LocalNotificationSchedule](#localnotificationschedule) |                                                                                                                                                                                                                                                                        |
| **sound**            | string                                                  | Name of the audio file with extension. On iOS the file should be in the app bundle. On Android the file should be on res/raw folder. Doesn't work on Android version 26+ (Android O and newer), for Recommended format is .wav because is supported by both platforms. |
| **smallIcon**        | string                                                  | Android-only: set a custom statusbar icon. If set, it overrides default icon from capacitor.config.json                                                                                                                                                                |
| **iconColor**        | string                                                  | Android only: set the color of the notification icon                                                                                                                                                                                                                   |
| **attachments**      | LocalNotificationAttachment[]                           |                                                                                                                                                                                                                                                                        |
| **actionTypeId**     | string                                                  |                                                                                                                                                                                                                                                                        |
| **extra**            | any                                                     |                                                                                                                                                                                                                                                                        |
| **threadIdentifier** | string                                                  | iOS only: set the thread identifier for notification grouping                                                                                                                                                                                                          |
| **summaryArgument**  | string                                                  | iOS 12+ only: set the summary argument for notification grouping                                                                                                                                                                                                       |
| **group**            | string                                                  | Android only: set the group identifier for notification grouping, like threadIdentifier on iOS.                                                                                                                                                                        |
| **groupSummary**     | boolean                                                 | Android only: designate this notification as the summary for a group (should be used with the `group` property).                                                                                                                                                       |
| **channelId**        | string                                                  | Android only: set the notification channel on which local notification will generate. If channel with the given name does not exist then the notification will not fire. If not provided, it will use the default channel.                                             |
| **ongoing**          | boolean                                                 | Android only: set the notification ongoing. If set to true the notification can't be swiped away.                                                                                                                                                                      |
| **autoCancel**       | boolean                                                 | Android only: set the notification to be removed automatically when the user clicks on it                                                                                                                                                                              |


#### LocalNotificationSchedule

| Prop        | Type                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| **at**      | [Date](#date)                                                                         |
| **repeats** | boolean                                                                               |
| **every**   | "year" \| "month" \| "two-weeks" \| "week" \| "day" \| "hour" \| "minute" \| "second" |
| **count**   | number                                                                                |
| **on**      | { year?: number; month?: number; day?: number; hour?: number; minute?: number; }      |


#### Date

Enables basic storage and retrieval of dates and times.

| Method                 | Signature                                                          | Description                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **toString**           | () => string                                                       | Returns a string representation of a date. The format of the string depends on the locale.                                              |
| **toDateString**       | () => string                                                       | Returns a date as a string value.                                                                                                       |
| **toTimeString**       | () => string                                                       | Returns a time as a string value.                                                                                                       |
| **toLocaleString**     | () => string                                                       | Returns a value as a string value appropriate to the host environment's current locale.                                                 |
| **toLocaleDateString** | () => string                                                       | Returns a date as a string value appropriate to the host environment's current locale.                                                  |
| **toLocaleTimeString** | () => string                                                       | Returns a time as a string value appropriate to the host environment's current locale.                                                  |
| **valueOf**            | () => number                                                       | Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.                                                      |
| **getTime**            | () => number                                                       | Gets the time value in milliseconds.                                                                                                    |
| **getFullYear**        | () => number                                                       | Gets the year, using local time.                                                                                                        |
| **getUTCFullYear**     | () => number                                                       | Gets the year using Universal Coordinated Time (UTC).                                                                                   |
| **getMonth**           | () => number                                                       | Gets the month, using local time.                                                                                                       |
| **getUTCMonth**        | () => number                                                       | Gets the month of a Date object using Universal Coordinated Time (UTC).                                                                 |
| **getDate**            | () => number                                                       | Gets the day-of-the-month, using local time.                                                                                            |
| **getUTCDate**         | () => number                                                       | Gets the day-of-the-month, using Universal Coordinated Time (UTC).                                                                      |
| **getDay**             | () => number                                                       | Gets the day of the week, using local time.                                                                                             |
| **getUTCDay**          | () => number                                                       | Gets the day of the week using Universal Coordinated Time (UTC).                                                                        |
| **getHours**           | () => number                                                       | Gets the hours in a date, using local time.                                                                                             |
| **getUTCHours**        | () => number                                                       | Gets the hours value in a Date object using Universal Coordinated Time (UTC).                                                           |
| **getMinutes**         | () => number                                                       | Gets the minutes of a Date object, using local time.                                                                                    |
| **getUTCMinutes**      | () => number                                                       | Gets the minutes of a Date object using Universal Coordinated Time (UTC).                                                               |
| **getSeconds**         | () => number                                                       | Gets the seconds of a Date object, using local time.                                                                                    |
| **getUTCSeconds**      | () => number                                                       | Gets the seconds of a Date object using Universal Coordinated Time (UTC).                                                               |
| **getMilliseconds**    | () => number                                                       | Gets the milliseconds of a Date, using local time.                                                                                      |
| **getUTCMilliseconds** | () => number                                                       | Gets the milliseconds of a Date object using Universal Coordinated Time (UTC).                                                          |
| **getTimezoneOffset**  | () => number                                                       | Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC).                             |
| **setTime**            | (time: number) => number                                           | Sets the date and time value in the Date object.                                                                                        |
| **setMilliseconds**    | (ms: number) => number                                             | Sets the milliseconds value in the Date object using local time.                                                                        |
| **setUTCMilliseconds** | (ms: number) => number                                             | Sets the milliseconds value in the Date object using Universal Coordinated Time (UTC).                                                  |
| **setSeconds**         | (sec: number, ms?: number) => number                               | Sets the seconds value in the Date object using local time.                                                                             |
| **setUTCSeconds**      | (sec: number, ms?: number) => number                               | Sets the seconds value in the Date object using Universal Coordinated Time (UTC).                                                       |
| **setMinutes**         | (min: number, sec?: number, ms?: number) => number                 | Sets the minutes value in the Date object using local time.                                                                             |
| **setUTCMinutes**      | (min: number, sec?: number, ms?: number) => number                 | Sets the minutes value in the Date object using Universal Coordinated Time (UTC).                                                       |
| **setHours**           | (hours: number, min?: number, sec?: number, ms?: number) => number | Sets the hour value in the Date object using local time.                                                                                |
| **setUTCHours**        | (hours: number, min?: number, sec?: number, ms?: number) => number | Sets the hours value in the Date object using Universal Coordinated Time (UTC).                                                         |
| **setDate**            | (date: number) => number                                           | Sets the numeric day-of-the-month value of the Date object using local time.                                                            |
| **setUTCDate**         | (date: number) => number                                           | Sets the numeric day of the month in the Date object using Universal Coordinated Time (UTC).                                            |
| **setMonth**           | (month: number, date?: number) => number                           | Sets the month value in the Date object using local time.                                                                               |
| **setUTCMonth**        | (month: number, date?: number) => number                           | Sets the month value in the Date object using Universal Coordinated Time (UTC).                                                         |
| **setFullYear**        | (year: number, month?: number, date?: number) => number            | Sets the year of the Date object using local time.                                                                                      |
| **setUTCFullYear**     | (year: number, month?: number, date?: number) => number            | Sets the year value in the Date object using Universal Coordinated Time (UTC).                                                          |
| **toUTCString**        | () => string                                                       | Returns a date converted to a string using Universal Coordinated Time (UTC).                                                            |
| **toISOString**        | () => string                                                       | Returns a date as a string value in ISO format.                                                                                         |
| **toJSON**             | (key?: any) => string                                              | Used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization. |


#### LocalNotificationAttachment

| Prop        | Type                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| **id**      | string                                                                    |
| **url**     | string                                                                    |
| **options** | [LocalNotificationAttachmentOptions](#localnotificationattachmentoptions) |


#### LocalNotificationAttachmentOptions

| Prop                                                           | Type   |
| -------------------------------------------------------------- | ------ |
| **iosUNNotificationAttachmentOptionsTypeHintKey**              | string |
| **iosUNNotificationAttachmentOptionsThumbnailHiddenKey**       | string |
| **iosUNNotificationAttachmentOptionsThumbnailClippingRectKey** | string |
| **iosUNNotificationAttachmentOptionsThumbnailTimeKey**         | string |


#### LocalNotificationPendingList

| Prop              | Type                       |
| ----------------- | -------------------------- |
| **notifications** | LocalNotificationRequest[] |


#### LocalNotificationRequest

| Prop   | Type   |
| ------ | ------ |
| **id** | string |


#### LocalNotificationActionType

| Prop                                 | Type                      |
| ------------------------------------ | ------------------------- |
| **id**                               | string                    |
| **actions**                          | LocalNotificationAction[] |
| **iosHiddenPreviewsBodyPlaceholder** | string                    |
| **iosCustomDismissAction**           | boolean                   |
| **iosAllowInCarPlay**                | boolean                   |
| **iosHiddenPreviewsShowTitle**       | boolean                   |
| **iosHiddenPreviewsShowSubtitle**    | boolean                   |


#### LocalNotificationAction

| Prop                       | Type    |
| -------------------------- | ------- |
| **id**                     | string  |
| **title**                  | string  |
| **requiresAuthentication** | boolean |
| **foreground**             | boolean |
| **destructive**            | boolean |
| **input**                  | boolean |
| **inputButtonTitle**       | string  |
| **inputPlaceholder**       | string  |


#### LocalNotificationEnabledResult

| Prop      | Type    | Description                                               |
| --------- | ------- | --------------------------------------------------------- |
| **value** | boolean | Whether the device has Local Notifications enabled or not |


#### NotificationChannel

| Prop            | Type                  |
| --------------- | --------------------- |
| **id**          | string                |
| **name**        | string                |
| **description** | string                |
| **sound**       | string                |
| **importance**  | 1 \| 2 \| 5 \| 4 \| 3 |
| **visibility**  | 0 \| 1 \| -1          |
| **lights**      | boolean               |
| **lightColor**  | string                |
| **vibration**   | boolean               |


#### NotificationChannelList

| Prop         | Type                  |
| ------------ | --------------------- |
| **channels** | NotificationChannel[] |


#### NotificationPermissionResponse

| Prop        | Type    |
| ----------- | ------- |
| **granted** | boolean |


#### PluginListenerHandle

| Prop       | Type       |
| ---------- | ---------- |
| **remove** | () => void |


#### LocalNotificationActionPerformed

| Prop             | Type                                    |
| ---------------- | --------------------------------------- |
| **actionId**     | string                                  |
| **inputValue**   | string                                  |
| **notification** | [LocalNotification](#localnotification) |


</docgen-api>
