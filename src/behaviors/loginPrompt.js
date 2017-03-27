export default {
  properties: {

    loginPrompt: {
      type: Boolean,
      observer: '_promptLoginOnEditable'
    }

  },

  /**
   * Observer to prompt for login if editable && !authed
   * @return {undefined}
   */
  _promptLoginOnEditable(loginPrompt) {
    let { _simplaObservers: observers } = this,
        simplaLogin = this.$['login'],
        promptLogin = (editable) => {
          if (editable && !this._authenticated) {
            simplaLogin.prompt().then(loggedIn => {
              Simpla.editable(loggedIn)
            });
          }
        },
        initialPrompt = () => {
          let shouldPrompt = Simpla.getState('editable') && loginPrompt;

          if (typeof simplaLogin.prompt === 'function') {
            promptLogin(shouldPrompt);
          } else {
            setTimeout(initialPrompt, 10);
          }
        };

    if (loginPrompt) {
      initialPrompt();
      observers.login = Simpla.observeState('editable', promptLogin);
    } else {
      observers.login && observers.login.unobserve();
    }
  }
}