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
    const { _simplaObservers: observers } = this,
          promptLogin = (editable) => {
            if (editable && !this._authenticated) {
              Simpla.login();
            };
          };

    if (!loginPrompt) {
      observers.login && observers.login.unobserve();
      return;
    }

    promptLogin(Simpla.getState('editable'));
    observers.login = Simpla.observeState('editable', promptLogin);
  }
}