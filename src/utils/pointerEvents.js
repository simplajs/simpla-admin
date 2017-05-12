const EVENTS_TO_BLOCK = [ 'click', 'ontouchend' ];

let observer,
    isolatedElements;

isolatedElements = (() => {
  let elementList;

  if (typeof window.Map !== undefined) {
    return new Map();
  }

  elementList = [];

  return {
    has(element) {
      return elementList.indexOf(element) !== -1;
    },

    set(element, value) {
      let index = elementList.indexOf(element);

      if (index === -1) {
        elementList.push(element);
      }
    },

    delete(element) {
      let index = elementList.indexOf(element);

      if (index !== -1) {
        elementList.splice(index, 1);
      }
    },

    forEach(callback) {
      elementList.forEach((element, i, thisArg) => callback.call(thisArg, 0, element, i));
    }
  }
})();

/**
 * Stops the given event from propagating, and also stops the event if event did
 *  not originate from an input. This means that clicks originating in forms e.g.
 *  file inputs will still work
 * @param  {Event} event Event to cancel
 * @return {undefined}
 */
function stopAndPreventUnimportant(event) {
  if (!event.path[0].localName || event.path[0].localName !== 'input') {
    event.preventDefault();
  }

  event.stopPropagation();
}

/**
 * Check if given element name is Simpla name
 * @param  {string}  name Name to check
 * @return {Boolean}      True if name is name of a simpla element
 */
function isSimplaName(name) {
  const prefixed = (str) => str.indexOf('simpla-') === 0;

  return name && prefixed(name);
}

/**
 * Returns an array of elements in a nodeList
 * @param  {NodeList} list Nodelist to filter
 * @return {HTMLElement[]} Array of element nodes
 */
function elementsIn(list) {
  return Array.prototype.filter.call(list, node => node.nodeType === 1);
}

/**
 * Check if the given element is a Simpla Element
 * @param  {HTMLElement}  element  Element to check
 * @return {Boolean}      True if node is a Simpla Element
 */
function isSimplaElement(element) {
  if (isSimplaName(element.localName)) {
    return true;
  }

  return isSimplaName(element.getAttribute('is'));
}

/**
 * Get all editable elements in the given list
 * @param  {Array} elements Array of elements to check
 * @return {HTMLElement[]}  Array of editable elements
 */
function ignoredElementsIn(elements) {
  const shouldIgnore = element => isSimplaElement(element) ||
                                  window.SimplaAdmin.contains(element) ||
                                  !!element.shadowRoot;

  return elements.filter(shouldIgnore);
}

/**
 * Get all simpla elements in the given list
 * @param  {Array} elements  Array of elements to check
 * @return {HTMLElement[]}   Array of simpla elements
 */
function simplaElementsIn(elements) {
  return elements.filter(isSimplaElement);
}

/**
 * Gets all elements that are currently stored and have their click events blocked
 * @param  {Array} elements  Array of elements to check
 * @return {HTMLElement[]}   Array of elements that have click listeners blocked
 */
function blockedElementsIn(elements) {
  return elements.filter(element => isolatedElements.has(element));
}

/**
 * Set pointer events property on given element to given state
 * @param  {HTMLElement}  element Element to set pointer events on
 * @param  {string=}      state   State of pointer events
 * @return {undefined}
 */
function setPointerEventsOn(element, state = '') {
  element.style.pointerEvents = state;
}

/**
 * Explicitly enable pointer events by setting them to 'auto'
 * @param  {HTMLElement} element Element to set pointer events on
 * @return {undefined}
 */
function enablePointerEventsOn(element) {
  setPointerEventsOn(element, 'auto');
}

/**
 * Explicitly disable pointer events on given element by setting to 'none'
 * @param  {HTMLElement} element HTML to set disable pointer events on
 * @return {undefined}
 */
function disablePointerEventsOn(element) {
  setPointerEventsOn(element, 'none');
}

/**
 * Reset pointer events by setting inline value to ''
 * @param  {HTMLElement} element Element to reset pointer events on
 * @return {undefined}
 */
function resetPointerEventsOn(element) {
  setPointerEventsOn(element, '');
}

/**
 * Cancel click events on the given element
 * @param  {HTMLElement} element Element to cancel click events on
 * @return {undefined}
 */
function cancelClicksAndAllowPointer(element) {
  isolatedElements.set(element, 0);
  enablePointerEventsOn(element);
  EVENTS_TO_BLOCK.forEach(event => {
    element.addEventListener(event, stopAndPreventUnimportant);
  });
}

/**
 * Restore click events on the given element
 * @param  {HTMLElement} element Element to restore click events on
 * @return {undefined}
 */
function restoreClicksAndResetPointer(element) {
  isolatedElements.delete(element);
  resetPointerEventsOn(element);
  EVENTS_TO_BLOCK.forEach(event => {
    element.removeEventListener(event, stopAndPreventUnimportant);
  });
}

/**
 * Core observer which watches elements to block click events / restore click
 *  events on
 * @type {MutationObserver}
 */
observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    const addedElements = elementsIn(mutation.addedNodes),
          removedElemenets = elementsIn(mutation.removedNodes);

    ignoredElementsIn(addedElements)
      .forEach(cancelClicksAndAllowPointer);

    simplaElementsIn(addedElements)
      .forEach(enablePointerEventsOn);

    blockedElementsIn(removedElemenets)
      .forEach(restoreClicksAndResetPointer);
  });
})

export default {
  /**
   * Enable pointerEvents on non-Simpla elements
   * @return {undefined}
   */
  enable() {
    isolatedElements.forEach((_, element) => restoreClicksAndResetPointer(element));
    observer.disconnect();
    resetPointerEventsOn(document.body);
  },

  /**
   * Disable pointerEvents on non-Simpla elements
   * @return {undefined}
   */
  disable() {
    const allElements = elementsIn(document.querySelectorAll('*'));

    ignoredElementsIn(allElements)
      .forEach(cancelClicksAndAllowPointer);

    simplaElementsIn(allElements)
      .forEach(enablePointerEventsOn);

    disablePointerEventsOn(document.body);
    observer.observe(document.body, { childList: true, subtree: true });
  }
}
