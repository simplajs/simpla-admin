export default {
  /**
   * Init login prompt observer
   * Called by Polymer on attach
   * @return {undefined}
   */
  attached() {
    this._promptLoginOnEditable();
  },

  /**
   * Observer to prompt for login if editable && !authed
   * @return {undefined}
   */
  _promptLoginOnEditable() {
    let simplaLogin = this.$['login'],
        promptLogin = (editable) => {
          if (editable && !this._authenticated) {
            simplaLogin.prompt()
              .then(loggedIn => Simpla.editable(loggedIn));
          }
        },
        initialPrompt = () => {
          if (typeof simplaLogin.prompt === 'function') {
            promptLogin(Simpla.getState('editable'));
          } else {
            setTimeout(initialPrompt, 10);
          }
        },
        observer = Simpla.observeState('editable', promptLogin);

    initialPrompt();
    this._simplaObservers.push(observer);
  }
}