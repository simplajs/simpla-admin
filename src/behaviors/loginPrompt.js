import waitFor from 'p-wait-for';

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
              promptAvailable = () => typeof simplaLogin.prompt === 'function';

          if (!editable || this._authenticated) {
            return
          };

          if (parseInt(Simpla.version) === 3) {
            Simpla.login();
          } else {
            waitFor(promptAvailable, 1).then(() => {
              simplaLogin.prompt()
                .then(loggedIn => Simpla.editable(loggedIn));
            });
          }
        };

    if (!loginPrompt) {
      observers.login && observers.login.unobserve();
      return;
    }

    promptLogin(Simpla.getState('editable'));
    observers.login = Simpla.observeState('editable', promptLogin);
  }
}