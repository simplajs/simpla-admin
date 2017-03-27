export default {
  properties: {

    loginPrompt: {
      type: Boolean,
      observer: '_toggleLoginPromptObserver'
    }

  },

  /**
   * Observer to prompt for login if editable && !authed
   * @param {Boolean} loginPrompt Whether to prompt for login on editable
   * @return {undefined}
   */
  _toggleLoginPromptObserver(loginPrompt) {
    let { _simplaObservers: observers } = this,
        promptLogin = (editable) => {
          let simplaLogin = this.$['login'],
              checkPrompt = new Promise(function check(resolve) {
                if (typeof simplaLogin.prompt === 'function') {
                  resolve();
                } else {
                  setTimeout(check.bind(null, resolve), 10);
                }
              });

          checkPrompt.then(() => {
            if (editable && !this._authenticated) {
              simplaLogin.prompt().then(loggedIn => {
                Simpla.editable(loggedIn)
              });
            }
          });
        };

    if (loginPrompt) {
      promptLogin(Simpla.getState('editable'));
      observers.login = Simpla.observeState('editable', promptLogin);
    } else {
      observers.login && observers.login.unobserve();
    }
  }
}