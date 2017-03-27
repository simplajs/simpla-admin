let HASH = '#edit';

function hashToEditable() {
  let isEdit = window.location.hash === HASH;

  Simpla.editable(isEdit);
}

function editableToHash(editable) {
  window.location.hash = editable ? HASH : '';
}

export default {
  _simplaObserver: {},

  track() {
    hashToEditable();
    window.addEventListener('hashchange', hashToEditable);

    editableToHash(Simpla.getState('editable'));
    this._simplaObserver = Simpla.observeState('editable', editableToHash);
  },

  untrack() {
    window.removeEventListener('hashchange', hashToEditable);
    this._simplaObserver.unobserve && this._simplaObserver.unobserve();
  }
}