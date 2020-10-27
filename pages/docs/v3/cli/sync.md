---
title: CLI Command - cap sync
description: Capacitor CLI command - cap sync
contributors:
  - dotNetkow
---

# Capacitor CLI - cap sync

This command runs [`copy`](/docs/cli/copy) and then [`update`](/docs/cli/update).

```bash
npx cap sync [options] [platform]
```

<strong>Inputs:</strong>

- `platform` (optional): `android`, `ios`

<strong>Options:</strong>

- `--deployment`: Podfile.lock won't be deleted and pod install will use `--deployment` option.

<strong>Example output:</strong>

```
√ Copying web assets from www to android\app\src\main\assets\public in 3.37s
√ Copying native bridge in 5.80ms
√ Copying capacitor.config.json in 2.59ms
√ copy in 3.43s
√ Updating Android plugins in 11.48ms
  Found 1 Capacitor plugin for android:
    capacitor-mapbox (0.0.1)
√ update android in 105.91ms
√ copy in 409.80μp
√ update web in 6.80μp
Sync finished in 3.563s
```
