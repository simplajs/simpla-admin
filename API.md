# API Reference
 
Simpla-admin attaches itself to `window` as a global singleton, you can access it from `window.SimplaAdmin`.

## Properties

Custom properties of `<simpla-admin>`, available on the `window.SimplaAdmin` singleton

Property         | Type      | Default | Description                                                   
---------------- | --------- | ------- | -----------                                                   
`hashTracking`   | `Boolean` | `true`  | Whether to bind edit mode to `#edit` in the URL
`loginPrompt`    | `Boolean` | `true`  | Whether to visually prompt for login if the user is not authenticated
`hotkeys`        | `Boolean` | `true`  | Whether to enable keyboard shortcuts for common actions
`protectEditing` | `Boolean` | `true`  | Whether to enable accidental click protection while editing

```js
window.SimplaAdmin = window.SimplaAdmin || {};
SimplaAdmin.hashTracking = false;
```
