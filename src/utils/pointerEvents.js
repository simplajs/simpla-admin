const IGNORED_ELEMENTS = [ 'simpla-admin' ];
const EVENTS_TO_BLOCK = [ 'click', 'tap' ];

let elementStore = new Map(),
    observer;

/**
 * Cancel given event by preventing default and stopping propagation
 * @param  {Event} event Event to cancel
 * @return {undefined}
 */
function cancel(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Checks if the given node is an editable element. Editable means the element
 *  is a Simpla Element and it is not a special ignored element e.g. simpla-admin
 * @param  {Node}   node  Node to check if it's an editable element
 * @return {Boolean}      True if editable element, false otherwise
 */
function isEditableElement(node) {
  const prefixed = (str) => str.indexOf('simpla-') === 0,
        ignored = (name) => IGNORED_ELEMENTS.includes(name),
        isEditableName = (name) => name && prefixed(name) && !ignored(name);

  let is;

  if (isEditableName(node.localName)) {
    return true;
  }

  is = node.getAttribute && node.getAttribute('is');
  return isEditableName(is);
}

/**
 * Get all editable elements in the given list.
 * @param  {(NodeList|Node[])} list List of nodes to check
 * @return {HTMLElement[]}          Array of editable elements
 */
function editableElementsIn(list) {
  return Array.prototype.filter.call(list, isEditableElement);
}

/**
 * Gets all elements that are currently stored and have their click events blocked
 * @param  {(NodeList|Node[])} list NodeList or Array of nodes to check
 * @return {HTMLElement[]}          Array of elements that have click listeners blocked
 */
function blockedElementsIn(list) {
  return Array.prototype.filter.call(list, element => elementStore.has(element));
}

/**
 * Cancel click events on the given element
 * @param  {HTMLElement} element Element to cancel click events on
 * @return {undefined}
 */
function cancelClicksOn(element) {
  elementStore.set(element, 0);
  EVENTS_TO_BLOCK.forEach(event => {
    element.addEventListener(event, cancel);
  });
}

/**
 * Restore click events on the given element
 * @param  {HTMLElement} element Element to restore click events on
 * @return {undefined}
 */
function restoreClicksOn(element) {
  elementStore.delete(element);
  EVENTS_TO_BLOCK.forEach(event => {
    element.removeEventListener(event, cancel);
  });
}

/**
 * Core observer which watches elements to block click events / restore click
 *  events on
 * @type {MutationObserver}
 */
observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    editableElementsIn(mutation.addedNodes)
      .forEach(cancelClicksOn);

    blockedElementsIn(mutation.removedNodes)
      .forEach(restoreClicksOn);
  });
})

export default {
  /**
   * Enable pointerEvents on non-Simpla elements
   * @return {undefined}
   */
  enable() {
    elementStore.forEach(restoreClicksOn);
    observer.disconnect();
  },

  /**
   * Disable pointerEvents on non-Simpla elements
   * @return {undefined}
   */
  disable() {
    editableElementsIn(document.querySelectorAll('*'))
      .forEach(cancelClicksOn);

    observer.observe(document.body, { childList: true, subtree: true });
  }
}
