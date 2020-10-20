---
title: Haptics
description: Haptics API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="ios,android"></plugin-platforms>

# Haptics

The Haptics API provides physical feedback to the user through touch or vibration.

<docgen-index>
* [impact()](#impact)
* [notification()](#notification)
* [vibrate()](#vibrate)
* [selectionStart()](#selectionstart)
* [selectionChanged()](#selectionchanged)
* [selectionEnd()](#selectionend)
* [Interfaces](#interfaces)
* [Enums](#enums)
</docgen-index>

## Android Notes

To use vibration, you must add this permission to your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.VIBRATE" />
```

## Example

```typescript
import {
  Plugins,
  HapticsImpactStyle
} from '@capacitor/core';

const { Haptics } = Plugins;

export class HapticsExample {
  hapticsImpact(style = HapticsImpactStyle.Heavy) {
    Haptics.impact({
      style: style
    });
  }

  hapticsImpactMedium(style) {
    this.hapticsImpact(HapticsImpactStyle.Medium);
  }

  hapticsImpactLight(style) {
    this.hapticsImpact(HapticsImpactStyle.Light);
  }

  hapticsVibrate() {
    Haptics.vibrate();
  }

  hapticsSelectionStart() {
    Haptics.selectionStart();
  }

  hapticsSelectionChanged() {
    Haptics.selectionChanged();
  }

  hapticsSelectionEnd() {
    Haptics.selectionEnd();
  }
}
```

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### impact

```typescript
impact(options: HapticsImpactOptions) => void
```

Trigger a haptics "impact" feedback

| Param       | Type                                          |
| ----------- | --------------------------------------------- |
| **options** | [HapticsImpactOptions](#hapticsimpactoptions) |

**Returns:** void

--------------------


### notification

```typescript
notification(options: HapticsNotificationOptions) => void
```

Trigger a haptics "notification" feedback

| Param       | Type                                                      |
| ----------- | --------------------------------------------------------- |
| **options** | [HapticsNotificationOptions](#hapticsnotificationoptions) |

**Returns:** void

--------------------


### vibrate

```typescript
vibrate() => void
```

Vibrate the device

**Returns:** void

--------------------


### selectionStart

```typescript
selectionStart() => void
```

Trigger a selection started haptic hint

**Returns:** void

--------------------


### selectionChanged

```typescript
selectionChanged() => void
```

Trigger a selection changed haptic hint. If a selection was
started already, this will cause the device to provide haptic
feedback

**Returns:** void

--------------------


### selectionEnd

```typescript
selectionEnd() => void
```

If selectionStart() was called, selectionEnd() ends the selection.
For example, call this when a user has lifted their finger from a control

**Returns:** void

--------------------


### Interfaces


#### HapticsImpactOptions

| Prop      | Type                                      |
| --------- | ----------------------------------------- |
| **style** | [HapticsImpactStyle](#hapticsimpactstyle) |


#### HapticsNotificationOptions

| Prop     | Type                                                |
| -------- | --------------------------------------------------- |
| **type** | [HapticsNotificationType](#hapticsnotificationtype) |


### Enums


#### HapticsImpactStyle

| Members    | Value    |
| ---------- | -------- |
| **Heavy**  | "HEAVY"  |
| **Medium** | "MEDIUM" |
| **Light**  | "LIGHT"  |


#### HapticsNotificationType

| Members     | Value     |
| ----------- | --------- |
| **SUCCESS** | "SUCCESS" |
| **WARNING** | "WARNING" |
| **ERROR**   | "ERROR"   |


</docgen-api>