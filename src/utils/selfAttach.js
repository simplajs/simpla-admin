function attachWhenReady(element) {
  let attachIfReady = () => {
    if (document.body) {
      document.body.appendChild(element);
      document.removeEventListener('readystatechange', attachIfReady);
      return true;
    }

    return false;
  };

  attachIfReady() || document.addEventListener('readystatechange', attachIfReady);
}

/**
 * Attaches simpla-admin to the users document
 * @param  {Boolean} shouldAttach Whether simpla-admin should be attached
 * @return {undefined}
 */
function conditionallyAttach(shouldAttach) {
  let alreadyAttached = document.querySelector('simpla-admin'),
      adminElement;

  if (shouldAttach && !alreadyAttached) {
    adminElement = document.createElement('simpla-admin');
    attachWhenReady(adminElement);
  }
}

/**
 * Self attach simpla-admin when editable or authenticated
 * @return {undefined}
 */
export default {
  _simplaObservers: [],

  observe() {
    let { editable, authenticated } = Simpla.getState(),
        shouldAttach = editable || authenticated;

    conditionallyAttach(shouldAttach);

    this._simplaObservers = [
      Simpla.observeState('authenticated', conditionallyAttach),
      Simpla.observeState('editable', conditionallyAttach)
    ];
  },

  unobserve() {
    this._simplaObservers.forEach(observer => observer.unobserve());
    this._simplaObservers = [];
  }
}
