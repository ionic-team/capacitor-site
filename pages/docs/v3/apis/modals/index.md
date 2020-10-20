---
title: Modals
description: Modals API
contributors:
  - mlynch
  - jcesarmobile
---

<plugin-platforms platforms="pwa,ios,android"></plugin-platforms>

# Modals

The Modals API provides methods for triggering native modal windows for alerts, confirmations, and input prompts, as
well as Action Sheets.

<docgen-index>
* [alert()](#alert)
* [prompt()](#prompt)
* [confirm()](#confirm)
* [showActions()](#showactions)
* [Interfaces](#interfaces)
* [Enums](#enums)
</docgen-index>

## Example

```typescript
import { Plugins } from '@capacitor/core';

const { Modals } = Plugins;

async showAlert() {
  let alertRet = await Modals.alert({
    title: 'Stop',
    message: 'this is an error'
  });
}

async showConfirm() {
  let confirmRet = await Modals.confirm({
    title: 'Confirm',
    message: 'Are you sure you\'d like to press the red button?'
  });
  console.log('Confirm ret', confirmRet);
}

async showPrompt() {
  let promptRet = await Modals.prompt({
    title: 'Hello',
    message: 'What\'s your name?'
  });
  console.log('Prompt ret', promptRet);
}

async showActions() {
  let promptRet = await Modals.showActions({
    title: 'Photo Options',
    message: 'Select an option to perform',
    options: [
      {
        title: 'Upload'
      },
      {
        title: 'Share'
      },
      {
        title: 'Remove',
        style: ActionSheetOptionStyle.Destructive
      }
    ]
  })
  console.log('You selected', promptRet);
}
```

## API

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->
## API

### alert

```typescript
alert(options: AlertOptions) => Promise<void>
```

Show an alert modal

| Param       | Type                          |
| ----------- | ----------------------------- |
| **options** | [AlertOptions](#alertoptions) |

**Returns:** Promise&lt;void&gt;

--------------------


### prompt

```typescript
prompt(options: PromptOptions) => Promise<PromptResult>
```

Show a prompt modal

| Param       | Type                            |
| ----------- | ------------------------------- |
| **options** | [PromptOptions](#promptoptions) |

**Returns:** Promise&lt;[PromptResult](#promptresult)&gt;

--------------------


### confirm

```typescript
confirm(options: ConfirmOptions) => Promise<ConfirmResult>
```

Show a confirmation modal

| Param       | Type                              |
| ----------- | --------------------------------- |
| **options** | [ConfirmOptions](#confirmoptions) |

**Returns:** Promise&lt;[ConfirmResult](#confirmresult)&gt;

--------------------


### showActions

```typescript
showActions(options: ActionSheetOptions) => Promise<ActionSheetResult>
```

Show an Action Sheet style modal with various options for the user
to select.

| Param       | Type                                      |
| ----------- | ----------------------------------------- |
| **options** | [ActionSheetOptions](#actionsheetoptions) |

**Returns:** Promise&lt;[ActionSheetResult](#actionsheetresult)&gt;

--------------------


### Interfaces


#### AlertOptions

| Prop            | Type   |
| --------------- | ------ |
| **title**       | string |
| **message**     | string |
| **buttonTitle** | string |


#### PromptResult

| Prop          | Type    |
| ------------- | ------- |
| **value**     | string  |
| **cancelled** | boolean |


#### PromptOptions

| Prop                  | Type   |
| --------------------- | ------ |
| **title**             | string |
| **message**           | string |
| **okButtonTitle**     | string |
| **cancelButtonTitle** | string |
| **inputPlaceholder**  | string |
| **inputText**         | string |


#### ConfirmResult

| Prop      | Type    |
| --------- | ------- |
| **value** | boolean |


#### ConfirmOptions

| Prop                  | Type   |
| --------------------- | ------ |
| **title**             | string |
| **message**           | string |
| **okButtonTitle**     | string |
| **cancelButtonTitle** | string |


#### ActionSheetResult

| Prop      | Type   |
| --------- | ------ |
| **index** | number |


#### ActionSheetOptions

| Prop        | Type                | Description |
| ----------- | ------------------- | ----------- |
| **title**   | string              |             |
| **message** | string              | iOS only    |
| **options** | ActionSheetOption[] |             |


#### ActionSheetOption

| Prop      | Type                                              | Description                              |
| --------- | ------------------------------------------------- | ---------------------------------------- |
| **title** | string                                            |                                          |
| **style** | [ActionSheetOptionStyle](#actionsheetoptionstyle) |                                          |
| **icon**  | string                                            | Icon for web (ionicon naming convention) |


### Enums


#### ActionSheetOptionStyle

| Members         | Value         |
| --------------- | ------------- |
| **Default**     | "DEFAULT"     |
| **Destructive** | "DESTRUCTIVE" |
| **Cancel**      | "CANCEL"      |


</docgen-api>
