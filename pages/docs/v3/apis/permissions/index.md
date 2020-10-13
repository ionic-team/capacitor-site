---
title: Permissions
description: Permissions API
contributors:
  - mlynch
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Permissions

The Permissions API provides methods to check if certain permissions have been granted before requesting them.

This can be useful, for example, to avoid a user denying a permission request due to lack of context behind why the app is requesting the permission. Instead, checking the permission
first and optionally displaying a custom UI to prepare the user for the permission check could increase permission allow rates and improve user experience.

## API

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### query

```typescript
query(options: PermissionsOptions) => Promise<PermissionResult>
```

| Param       | Type                                      |
| ----------- | ----------------------------------------- |
| **options** | [PermissionsOptions](#permissionsoptions) |

**Returns:** Promise&lt;[PermissionResult](#permissionresult)&gt;

--------------------


### Interfaces


#### PermissionResult

| Prop      | Type                              |
| --------- | --------------------------------- |
| **state** | "denied" \| "granted" \| "prompt" |


#### PermissionsOptions

| Prop     | Type                              |
| -------- | --------------------------------- |
| **name** | [PermissionType](#permissiontype) |


### Enums


#### PermissionType

| Members            | Value             |
| ------------------ | ----------------- |
| **Camera**         | "camera"          |
| **Photos**         | "photos"          |
| **Geolocation**    | "geolocation"     |
| **Notifications**  | "notifications"   |
| **ClipboardRead**  | "clipboard-read"  |
| **ClipboardWrite** | "clipboard-write" |
| **Microphone**     | "microphone"      |


<!--DOCGEN_API_END-->
