# API Reference
 
Simpla-admin attaches itself to `window` as a global singleton, you can access it from `window.SimplaAdmin`.

## Properties

Properties of `<simpla-admin>` are available on the `window.SimplaAdmin` singleton

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

## Custom events

Event                 | Properties      | Description                                                                                                                                              
--------------------- | --------------- | -----------                                                                                                                                              
`simpla-notification` | `text {String}` | Notifications for [`<simpla-notify>`][simpla-notify], containing a `text` property with notification content 

It's possible to fire your own notification events for simpla-notify (bundled with simpla-admin)

```js
var notification = new CustomEvent('simpla-notification', { 
  detail: {
    text: 'something happened'
  } 
});

window.dispatchEvent(notification);
```

[simpla-notify]: http://webcomponents.org/element/SimplaElements/simpla-notify