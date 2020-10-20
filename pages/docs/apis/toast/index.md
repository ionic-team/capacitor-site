---
title: Toast
description: Toast API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Toast

The Toast API provides a notification pop up for displaying important information to a user. Just like real toast!

<plugin-api-index name="toast"></plugin-api-index>

## PWA Notes

[PWA Elements](/docs/web/pwa-elements) are required for Toast plugin to work.

## Example

```typescript
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

async show() {
  await Toast.show({
    text: 'Hello!'
  });
}
```

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

## API

### show(...)

```typescript
show(options: ToastShowOptions) => Promise<void>
```

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#toastshowoptions">ToastShowOptions</a></code> |

--------------------


### Interfaces


#### ToastShowOptions

| Prop           | Type                                       | Description                                                                |
| -------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| **`text`**     | <code>string</code>                        |                                                                            |
| **`duration`** | <code>"short" \| "long"</code>             | Duration of the toast, either 'short' (2000ms, default) or 'long' (3500ms) |
| **`position`** | <code>"center" \| "bottom" \| "top"</code> |                                                                            |

</docgen-api>
