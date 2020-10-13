---
title: Storage
description: Storage API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Storage

The Storage API provides a key-value store for simple data.

Mobile OS's may periodically clear data set in `window.localStorage`, so this API should be used instead of `window.localStorage`. This API will fall back to using `localStorage` when running as a Progressive Web App.

On iOS this plugin will use [UserDefaults](https://developer.apple.com/documentation/foundation/userdefaults) and on Android [SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences). Stored data is cleared if the app is uninstalled.

Note: this API is not meant for high-performance data storage applications. Take a look at using SQLite or a separate data engine if your application will store a lot of items, have high read/write load, or require complex querying.

<!--DOCGEN_INDEX_START-->
* [get()](#get)
* [set()](#set)
* [remove()](#remove)
* [clear()](#clear)
* [keys()](#keys)
<!--DOCGEN_INDEX_END-->

## Working with JSON

`Storage` works on Strings only. However, storing JSON blobs is easy: just `JSON.stringify` the object before calling `set`, then `JSON.parse` the value returned from `get`. See the
example below for more details.

This method can also be used to store non-string values, such as numbers and booleans.

## Example

```typescript
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


// JSON "set" example
async setObject() {
  await Storage.set({
    key: 'user',
    value: JSON.stringify({
      id: 1,
      name: 'Max'
    })
  });
}

// JSON "get" example
async getObject() {
  const ret = await Storage.get({ key: 'user' });
  const user = JSON.parse(ret.value);
}

async setItem() {
  await Storage.set({
    key: 'name',
    value: 'Max'
  });
}

async getItem() {
  const { value } = await Storage.get({ key: 'name' });
  console.log('Got item: ', value);
}

async removeItem() {
  await Storage.remove({ key: 'name' });
}

async keys() {
  const { keys } = await Storage.keys();
  console.log('Got keys: ', keys);
}

async clear() {
  await Storage.clear();
}
```

<!--DOCGEN_API_START-->
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### get

```typescript
get(options: { key: string; }) => Promise<{ value: string | null; }>
```

Get the value with the given key.

| Param       | Type             |
| ----------- | ---------------- |
| **options** | { key: string; } |

**Returns:** Promise&lt;{ value: string; }&gt;

--------------------


### set

```typescript
set(options: { key: string; value: string; }) => Promise<void>
```

Set the value for the given key

| Param       | Type                            |
| ----------- | ------------------------------- |
| **options** | { key: string; value: string; } |

**Returns:** Promise&lt;void&gt;

--------------------


### remove

```typescript
remove(options: { key: string; }) => Promise<void>
```

Remove the value for this key (if any)

| Param       | Type             |
| ----------- | ---------------- |
| **options** | { key: string; } |

**Returns:** Promise&lt;void&gt;

--------------------


### clear

```typescript
clear() => Promise<void>
```

Clear stored keys and values.

**Returns:** Promise&lt;void&gt;

--------------------


### keys

```typescript
keys() => Promise<{ keys: string[]; }>
```

Return the list of known keys

**Returns:** Promise&lt;{ keys: string[]; }&gt;

--------------------


<!--DOCGEN_API_END-->
