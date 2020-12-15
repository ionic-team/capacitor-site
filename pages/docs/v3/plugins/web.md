---
title: Capacitor Web/PWA Plugin Guide
description: Capacitor Web/PWA Plugin Guide
contributors:
  - mlynch
  - jcesarmobile
  - dotNetkow
---

# Capacitor Web/PWA Plugin Guide

Capacitor utilizes a web/native compatibility layer, making it easy to build plugins that have functionality when running natively as well as when running in a PWA on the Web.

## Getting Started

To get started, first generate a plugin as shown in the [Getting Started](/docs/plugins/creating-plugins#plugin-generator) section of the Plugin guide.

Next, open `my-plugin/src/web.ts` in your editor of choice.

## Example

The basic structure of a web plugin for Capacitor looks like this:

```typescript
import { WebPlugin } from '@capacitor/core';

import type { MyPlugin } from './definitions';

export class MyPluginWeb extends WebPlugin implements MyPlugin {
  async echo(options: { value: string }) {
    console.log('ECHO', options);
    return options;
  }
}
```

The `MyPlugin` interface defines the method signatures of your plugin. In TypeScript, we can ensure the web implementation (the `MyPluginWeb` class) correctly implements the interface.
