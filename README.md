# Simpla Admin
![Version][bower-badge] [![Build status][travis-badge]][travis-url] [![Bower dependencies][bowerdeps-badge]][bowerdeps-url] ![Size][size-badge] <br> 
[![Published][webcomponents-badge]][webcomponents-url] [![Simpla slack group][slack-badge]][slack-url]

Simpla-admin is a lightweight, beautiful admin component for the [Simpla](https://www.simpla.io) content system. It provides everything you need to manage a Simpla app - login prompts, edit mode management, save controls, notifications, keyboard shortcuts, etc.

## Installation and setup

Install simpla-admin with Bower (Yarn support coming soon)

```sh
$ bower install simpla-admin --save
```

Include the Simpla library and setup a project (read more about [setting up Simpla](https://www.simpla.io/docs/guides/get-started))

```html
<script src="https://unpkg.com/simpla@^2.0.0/simpla.min.js"></script>
<script>
  // TODO: replace 'project-id' with your project ID
  Simpla.init('project-id')
</script>
```

Then import simpla-admin into the `<head>` of your document. It will automatically attach and load itself as a singleton when Simpla enters edit mode.

```html
<link rel="import" href="/bower_components/simpla-admin/simpla-admin.html" async>
```

### Polyfills for cross-browser support

Simpla-admin relies on emerging standards, for full cross-browser support make sure you include the [Web Components Lite](https://github.com/webcomponents/webcomponentsjs) polyfill.

```html
<script src="https://unpkg.com/webcomponents.js@^0.7.24/webcomponents-lite.min.js"></script>
```

## Hashtracking

Simpla-admin binds `#edit` to Simpla's edit mode. To enter edit mode, add `#edit` to the end of your URL. To exit edit mode, remove `#edit` from the URL. Simpla-admin will automatically attach and load itself when you enter edit mode.

You can disable hashtracking with the `hashTracking` property

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.hashTracking = false;
```

## Login prompts

If you're not authenticated when trying to enter edit mode, simpla-admin will prompt you to login with the [`<simpla-login>`](https://www.webcomponents.org/element/SimplaElements/simpla-login) element. Exiting the login modal without logging in exits edit mode. 

The user will be prompted for login regardless of whether you enter edit mode via simpla-admin (by adding `#edit` to the URL) or programmatically with Simpla (ie: `Simpla.editable(true)`).

You can disable login prompts with the `loginPrompt` property, and do your own authentication with the `Simpla.login()` method

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.loginPrompt = false;
```

## Hotkeys

Simpla-admin binds keyboard shortcuts to several common actions:

Shortcut           | Description                              
------------------ | -----------                              
`cmd`/`ctrl` + `s` | Save                                     
`cmd`/`ctrl` + `e` | Toggle edit mode (only if authenticated) 

You can disable all hotkeys with the `hotkeys` property

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.hotkeys = false;
```

## Click disabling

Simpla-admin makes a page non-interactive while you are editing it, so you can work with content inside interactive elements (links, buttons, lightboxes) without accidentally leaving the page. To re-enable clicks, toggle off edit mode with `cmd`/`ctrl` + `e` or the simpla-admin menu. Your changes will remain in the local buffer until you either save or reload the page.

You can stop this behavior with the `protectEditing` property

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.protectEditing = false;
```

## Notifications

Simpla-admin displays notifications for things like content saves with [`<simpla-notify>`](https://www.webcomponents.org/element/SimplaElements/simpla-notify). You can display your own custom notifications by firing a `simpla-notification` window event with a `text` property

```js
var notification = new CustomEvent('simpla-notification', { 
  detail: {
    text: 'something happened'
  } 
});

window.dispatchEvent(notification);
```

## API reference
 
Simpla-admin attaches itself to `window` as a global singleton, you can access it from `window.SimplaAdmin`.

### Properties

Property       | Type    | Default | Description                                                   
-------------- | ------- | ------- | -----------                                                   
`hashTracking` | Boolean | `true`  | Whether to bind edit mode to `#edit` in the URL
`loginPrompt`  | Boolean | `true`  | Whether to visually prompt for login if the user is not authenticated
`hotkeys`      | Boolean | `true`  | Whether to enable keyboard shortcuts for common actions

Set properties on `window.SimplaAdmin` directly 

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.hashTracking = false;
```
  
## Contributing

If you find any issues with simpla-admin please report them! If you'd like to see a new feature in supported file an issue or let us know in Simpla's public [Slack group](https://slack.simpla.io). We also happily accept PRs. 

---

MIT © Simpla <friends@simpla.io>

[bower-badge]: https://img.shields.io/bower/v/simpla-admin.svg
[bowerlicense-badge]: https://img.shields.io/bower/l/simpla-admin.svg
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-admin.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-admin
[bowerdeps-badge]: https://img.shields.io/gemnasium/SimplaElements/simpla-admin.svg
[bowerdeps-url]: https://gemnasium.com/bower/simpla-admin
[size-badge]: https://badges.herokuapp.com/size/github/SimplaElements/simpla-admin/master/simpla-admin.html?gzip=true&color=blue
[webcomponents-badge]: https://img.shields.io/badge/webcomponents.org-published-blue.svg
[webcomponents-url]: https://www.webcomponents.org/element/SimplaElements/simpla-admin
[slack-badge]: http://slack.simpla.io/badge.svg
[slack-url]: https://slack.simpla.io

