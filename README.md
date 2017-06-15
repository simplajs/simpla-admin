# Simpla Admin
[![Build status][travis-badge]][travis-url] ![Size][size-badge] ![Version][bower-badge] [![Published][webcomponents-badge]][webcomponents-url] [![Simpla slack group][slack-badge]][slack-url]

Simpla-admin is a lightweight, beautiful admin component for the [Simpla][simpla] content system. It provides everything you need to manage a Simpla app (login prompts, edit mode management, save controls, notifications, keyboard shortcuts) while remaining unobtrusive and minimal.

### Contents

- [Installation and setup](#installation-and-setup)
- [Hashtracking](#hashtracking)
- [Login prompts](#login-prompts)
- [Hotkeys](#hotkeys)
- [Accidental click protection](#accidental-click-protection)
- [Notifications](#notifications)
- [Contributing](#contributing)

### Resources

- [API reference][api]
- [Demo][demo]
- [License][license]

## Installation and setup

Install simpla-admin with Bower (Yarn support coming soon)

```sh
$ bower i simpla-admin --save
```

[Setup Simpla][simpla-setup] on your page, then import simpla-admin into your `<head>`. It will automatically attach and load itself as a singleton when Simpla enters edit mode.

```html
<link rel="import" href="/bower_components/simpla-admin/simpla-admin.html" async>
```


## Hashtracking

Simpla-admin binds `#edit` to Simpla's edit mode. To enter edit mode, add `#edit` to the end of your URL. To exit edit mode, remove `#edit` from the URL.

You can disable hashtracking with the `hashTracking` property

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.hashTracking = false;
```

## Login prompts

If you're not authenticated when trying to enter edit mode, simpla-admin will prompt you to login with [`<simpla-login>`](https://www.webcomponents.org/element/SimplaElements/simpla-login). Closing the login modal without logging in exits edit mode. 

The user will be prompted for login regardless of whether you enter edit mode via simpla-admin (`#edit`) or programmatically with Simpla (`Simpla.editable(true)`).

You can disable login prompts with the `loginPrompt` property, and authenticate manually with the `Simpla.login()` method

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.loginPrompt = false;
```

## Hotkeys

Simpla-admin binds keyboard shortcuts to several common actions. On Mac the command key is used, on Windows the control key is used.

Shortcut           | Description                              
------------------ | -----------                              
`cmd`/`ctrl` + `s` | Save                                     
`cmd`/`ctrl` + `e` | Toggle edit mode (only if authenticated) 

You can disable all hotkeys with the `hotkeys` property

```js
window.SimplaAdmin = window.SimplaAdmin || {};
window.SimplaAdmin.hotkeys = false;
```

## Accidental click protection

Simpla-admin makes a page non-interactive while it's being edited, so users can edit content inside interactive elements (links, buttons, lightboxes) without accidentally leaving the page. Toggle off edit mode to re-enable clicks, your changes will remain in the local buffer until you either save or reload the page.

You can disable edit mode protection with the `protectEditing` property

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
  
## Contributing

If you find any issues with simpla-admin please report them! If you'd like to see a new feature supported file an issue or let us know in Simpla's public [Slack group][slack-url]. We also happily accept PRs. 

***

MIT © [Simpla][simpla]

[api]: https://www.webcomponents.org/element/SimplaElements/simpla-admin/page/API.md
[demo]: https://www.webcomponents.org/element/SimplaElements/simpla-admin/demo/demo/index.html
[license]: https://github.com/SimplaElements/simpla-admin/blob/master/LICENSE

[simpla]: https://www.simpla.io
[simpla-setup]: https://www.simpla.io/docs/guides/get-started

[bower-badge]: https://img.shields.io/bower/v/simpla-admin.svg
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-admin.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-admin
[size-badge]: https://badges.herokuapp.com/size/github/SimplaElements/simpla-admin/master/simpla-admin.html?gzip=true
[webcomponents-badge]: https://img.shields.io/badge/webcomponents.org-published-blue.svg
[webcomponents-url]: https://www.webcomponents.org/element/SimplaElements/simpla-admin
[slack-badge]: http://slack.simpla.io/badge.svg
[slack-url]: https://slack.simpla.io

