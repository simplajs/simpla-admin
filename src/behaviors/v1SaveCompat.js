const NOTIFICATIONS = {
  saved: 'changes saved',
  saveFailed: 'something went wrong, try again?'
};

export default {
  /**
   * Save with v1 element compatibility
   * @return {undefined}
   */
  save() {
    let leftToSave = 0,
        successfulSaves = 0,
        failedSaves = 0,
        haveTriedAll = false,
        triedToSave,
        ensureV2Saved,
        finished,
        trySave;

    if (Simpla.save) {
      ensureV2Saved = Simpla.save();
    } else {
      ensureV2Saved = Promise.resolve();
    }

    /**
     * Fires saved, if there were no fails, otherwise fires save-failed
     * @return {[type]} [description]
     */
    finished = () => {
      let success = () => {
            this.busy = false;
            this.fire('simpla-notification', {
              text: NOTIFICATIONS.saved
            });
          },
          failed = () => {
            this.busy = false;
            this.fire('simpla-notification', {
              text: NOTIFICATIONS.saveFailed
            });
          };

      ensureV2Saved
        .then(() => {
          if (failedSaves !== 0) {
            return Promise.reject();
          }
          success();
        })
        .catch(failed);
    };

    trySave = (element) => {
      let addElement,
          removeElement,
          willSave,
          saved = () => removeElement(true),
          failed = () => removeElement(false);

      /**
       * Add the element, then listen for a saved or errored event
       * @return {undefined}
       */
      addElement = function() {
        // Add listeners and incremement leftToSave
        leftToSave++;
        element.addEventListener('saved', saved);
        element.addEventListener('error', failed);
      };

      /**
       * Removes the element i.e. the save request was completed, successful or not
       * @param  {Boolean} success If the save was successful or not
       * @return {undefined}
       */
      removeElement = function(success) {
        // Done with the element, remove listeners and decrement leftToSave
        leftToSave--;
        element.removeEventListener('saved', saved);
        element.removeEventListener('error', failed);

        if (success) {
          successfulSaves++;
        } else {
          failedSaves++;
        }

        // If it's not waiting on any more saves call finished.
        if (leftToSave === 0 && haveTriedAll) {
          finished();
        }
      };

      // Only add the element if the save request actually occurs
      willSave = element.save();
      if (willSave) {
        addElement();
      }

      return !!willSave;
    }

    this.busy = true;

    // For each element, make a save request, then keep track of the successes
    //  of these requests, emited saved or save-failed once all requests have
    //  come back, and the success of them is known
    triedToSave = simpla.elements.map(trySave).filter(didSave => !!didSave).length;

    haveTriedAll = true;

    if (triedToSave === 0) {
      // Dummy time taken to save
      finished();
    }
  }
}