// NOTE: Custom messages are ignored by most browsers, this is an edge perk
const UNSAVED_WARNING = 'You have unsaved changes, are you sure you want to leave?';

/**
 * Intercepts beforeunload event if Simpla buffer is dirty
 * @param  {Event} e Beforeunload event
 * @return {String}  Warning message (for browsers that support it)
 */
function warnUnsaved(e) {
  let dirtyBuffer = !!Simpla.getState('buffer');

  if (dirtyBuffer) {
    e.returnValue = UNSAVED_WARNING;
    return UNSAVED_WARNING;
  }
}

export default {
  /**
   * Init unsaved changes watchdog on attach
   * @return {undefined}
   */
  attached() {
    window.addEventListener('beforeunload', warnUnsaved);
  },

  /**
   * Clean up listener on detach
   * @return {undefined}
   */
  detached() {
    window.removeEventListener('beforeunload', warnUnsaved);
  }
}