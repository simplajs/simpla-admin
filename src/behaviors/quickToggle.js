const MODIFIER = 'altKey',
      KEY_CODE = 69;

/**
 * Toggles Simpla editable on hotkey combination
 * @param  {Event} e  Keydown event
 * @return {undefined}
 */
function bindEditableToHotkeys(e) {
   if (e.keyCode === KEY_CODE && e[MODIFIER]) {
    Simpla.editable(!Simpla.getState('editable'));
  }
}

export default {
  properties: {

    quickToggle: Boolean

  },

  observers: [
    '_toggleHotkeyListener(_authenticated, quickToggle)'
  ],

  /**
   * Adds or removes hotkey listener based on authenticated state
   * @param  {Boolean} authenticated Current value of authenticated prop
   * @return {undefined}
   */
  _toggleHotkeyListener(authenticated, quickToggle) {
    if (authenticated && quickToggle) {
      document.addEventListener('keydown', bindEditableToHotkeys)
    } else {
      document.removeEventListener('keydown', bindEditableToHotkeys);
    }
  },

  /**
   * Clean up listeners on detach
   * @return {undefined}
   */
  detached() {
    document.removeEventListener('keydown', bindEditableToHotkeys);
  }
}
