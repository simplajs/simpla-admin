const MODIFIER = 'metaKey',
      KEY_CODES = {
        edit: 69, // E key
        save: 83 // S key
      };

/**
 * Toggles Simpla editable on hotkey combination
 * @param  {Event} e  Keydown event
 * @return {undefined}
 */
function bindEditableToHotkeys(e) {
   if (e.keyCode === KEY_CODES.edit && e[MODIFIER]) {
    e.preventDefault();
    Simpla.editable(!Simpla.getState('editable'));
  }
}

/**
 * Executes Simpla.save on hotkey combination
 * @param  {Event} e  Keydown event
 * @return {undefined}
 */
function bindSaveToHotkeys(e) {
   if (e.keyCode === KEY_CODES.save && e[MODIFIER]) {
    e.preventDefault();
    document.querySelector('simpla-admin').save();
  }
}

export default {
  properties: {

    hotkeys: Boolean

  },

  observers: [
    '_updateEditableListener(_authenticated, hotkeys)',
    '_updateSaveListener(_editable, hotkeys)',
  ],

  /**
   * Adds or removes editable hotkey listener based on authenticated state
   * @param  {Boolean} authenticated Current value of authenticated prop
   * @return {undefined}
   */
  _updateEditableListener(authenticated, hotkeys) {
    if (authenticated && hotkeys) {
      document.addEventListener('keydown', bindEditableToHotkeys)
    } else {
      document.removeEventListener('keydown', bindEditableToHotkeys);
    }
  },

  /**
   * Adds or removes save hotkey listener based on editable state
   * @param  {Boolean} authenticated Current value of authenticated prop
   * @return {undefined}
   */
  _updateSaveListener(editable, hotkeys) {
    if (editable && hotkeys) {
      document.addEventListener('keydown', bindSaveToHotkeys)
    } else {
      document.removeEventListener('keydown', bindSaveToHotkeys);
    }
  },

  /**
   * Clean up listeners on detach
   * @return {undefined}
   */
  detached() {
    document.removeEventListener('keydown', bindEditableToHotkeys);
    document.removeEventListener('keydown', bindSaveToHotkeys);
  }
}
