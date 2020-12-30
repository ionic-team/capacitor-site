---
title: Capacitor CLI - cap sync
sidebar_label: sync
description: Capacitor CLI command - cap sync
contributors:
  - dotNetkow
---

This command runs [`copy`](copy.md) and then [`update`](update.md).

```bash
npx cap sync [options] [<platform>]
```

<strong>Inputs:</strong>

- `platform` (optional): `android`, `ios`

<strong>Options:</strong>

- `--deployment`: Podfile.lock won't be deleted and pod install will use `--deployment` option.
