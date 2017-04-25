let HASH = '#edit';

function hashToEditable() {
  let isEdit = window.location.hash === HASH;

  Simpla.editable(isEdit);
}

function editableToHash(editable) {
  window.location.hash = editable ? HASH : '';
}

export default {
  _simplaObserver: null,

  _tracking: false,

  track() {
    hashToEditable();

    if (this._tracking) {
      return;
    }

    window.addEventListener('hashchange', hashToEditable);
    editableToHash(Simpla.getState('editable'));

    this._simplaObserver = Simpla.observeState('editable', editableToHash);
    this._tracking = true;
  },

  untrack() {
    if (this._tracking) {
      window.removeEventListener('hashchange', hashToEditable);
      this._simplaObserver && this._simplaObserver.unobserve();
      this._simplaObserver = null;
      this._tracking = false;
    }
  }
}