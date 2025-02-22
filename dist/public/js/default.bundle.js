// @tko/utils 🥊 4.0.0-beta1.3 ESM
const { isArray } = Array;
function arrayForEach(array, action, thisArg) {
  if (arguments.length > 2) {
    action = action.bind(thisArg);
  }
  for (let i = 0, j = array.length; i < j; ++i) {
    action(array[i], i, array);
  }
}
function arrayIndexOf(array, item) {
  return (isArray(array) ? array : [...array]).indexOf(item);
}
function arrayFirst(array, predicate, predicateOwner) {
  return (isArray(array) ? array : [...array]).find(predicate, predicateOwner);
}
function arrayMap(array = [], mapping, thisArg) {
  if (arguments.length > 2) {
    mapping = mapping.bind(thisArg);
  }
  return array === null ? [] : Array.from(array, mapping);
}
function arrayRemoveItem(array, itemToRemove) {
  var index = arrayIndexOf(array, itemToRemove);
  if (index > 0) {
    array.splice(index, 1);
  } else if (index === 0) {
    array.shift();
  }
}
function arrayGetDistinctValues(array = []) {
  const seen = /* @__PURE__ */ new Set();
  if (array === null) {
    return [];
  }
  return (isArray(array) ? array : [...array]).filter((item) => seen.has(item) ? false : seen.add(item));
}
function arrayFilter(array, predicate, thisArg) {
  if (arguments.length > 2) {
    predicate = predicate.bind(thisArg);
  }
  return array === null ? [] : (isArray(array) ? array : [...array]).filter(predicate);
}
function arrayPushAll(array, valuesToPush) {
  if (isArray(valuesToPush)) {
    array.push.apply(array, valuesToPush);
  } else {
    for (var i = 0, j = valuesToPush.length; i < j; i++) {
      array.push(valuesToPush[i]);
    }
  }
  return array;
}
function addOrRemoveItem(array, value, included) {
  var existingEntryIndex = arrayIndexOf(typeof array.peek === "function" ? array.peek() : array, value);
  if (existingEntryIndex < 0) {
    if (included) {
      array.push(value);
    }
  } else {
    if (!included) {
      array.splice(existingEntryIndex, 1);
    }
  }
}
function makeArray(arrayLikeObject) {
  return Array.from(arrayLikeObject);
}
function range(min, max) {
  min = typeof min === "function" ? min() : min;
  max = typeof max === "function" ? max() : max;
  var result = [];
  for (var i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
}
function findMovesInArrayComparison(left, right, limitFailedCompares) {
  if (left.length && right.length) {
    var failedCompares, l, r, leftItem, rightItem;
    for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
      for (r = 0; rightItem = right[r]; ++r) {
        if (leftItem.value === rightItem.value) {
          leftItem.moved = rightItem.index;
          rightItem.moved = leftItem.index;
          right.splice(r, 1);
          failedCompares = r = 0;
          break;
        }
      }
      failedCompares += r;
    }
  }
}
const statusNotInOld = "added";
const statusNotInNew = "deleted";
function compareArrays(oldArray, newArray, options) {
  options = typeof options === "boolean" ? { dontLimitMoves: options } : options || {};
  oldArray = oldArray || [];
  newArray = newArray || [];
  if (oldArray.length < newArray.length) {
    return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
  } else {
    return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
  }
}
function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
  var myMin = Math.min, myMax = Math.max, editDistanceMatrix = [], smlIndex, smlIndexMax = smlArray.length, bigIndex, bigIndexMax = bigArray.length, compareRange = bigIndexMax - smlIndexMax || 1, maxDistance = smlIndexMax + bigIndexMax + 1, thisRow, lastRow, bigIndexMaxForRow, bigIndexMinForRow;
  for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
    lastRow = thisRow;
    editDistanceMatrix.push(thisRow = []);
    bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
    bigIndexMinForRow = myMax(0, smlIndex - 1);
    for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
      if (!bigIndex) {
        thisRow[bigIndex] = smlIndex + 1;
      } else if (!smlIndex) {
        thisRow[bigIndex] = bigIndex + 1;
      } else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1]) {
        thisRow[bigIndex] = lastRow[bigIndex - 1];
      } else {
        var northDistance = lastRow[bigIndex] || maxDistance;
        var westDistance = thisRow[bigIndex - 1] || maxDistance;
        thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
      }
    }
  }
  var editScript = [], meMinusOne, notInSml = [], notInBig = [];
  for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex; ) {
    meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
    if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex - 1]) {
      notInSml.push(editScript[editScript.length] = {
        "status": statusNotInSml,
        "value": bigArray[--bigIndex],
        "index": bigIndex
      });
    } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
      notInBig.push(editScript[editScript.length] = {
        "status": statusNotInBig,
        "value": smlArray[--smlIndex],
        "index": smlIndex
      });
    } else {
      --bigIndex;
      --smlIndex;
      if (!options.sparse) {
        editScript.push({
          "status": "retained",
          "value": bigArray[bigIndex]
        });
      }
    }
  }
  findMovesInArrayComparison(notInBig, notInSml, !options.dontLimitMoves && smlIndexMax * 10);
  return editScript.reverse();
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
const options$1 = {
  deferUpdates: false,
  useOnlyNativeEvents: false,
  protoProperty: "__ko_proto__",
  defaultBindingAttribute: "data-bind",
  allowVirtualElements: true,
  bindingGlobals: /* @__PURE__ */ Object.create(null),
  bindingProviderInstance: null,
  createChildContextWithAs: false,
  jQuery: globalThis.jQuery,
  Promise: globalThis.Promise,
  taskScheduler: null,
  debug: false,
  global: globalThis,
  document: globalThis.document,
  filters: {},
  includeDestroyed: false,
  foreachHidesDestroyed: false,
  onError: function(e) {
    throw e;
  },
  set: function(name, value) {
    options$1[name] = value;
  },
  getBindingHandler() {
  },
  cleanExternalData() {
  }
};
Object.defineProperty(options$1, "$", {
  get: function() {
    return options$1.jQuery;
  }
});

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function catchFunctionErrors(delegate) {
  if (!options$1.onError) {
    return delegate;
  }
  return (...args) => {
    try {
      return delegate(...args);
    } catch (err) {
      options$1.onError(err);
    }
  };
}
function deferError(error) {
  safeSetTimeout(function() {
    throw error;
  }, 0);
}
function safeSetTimeout(handler, timeout) {
  return setTimeout(catchFunctionErrors(handler), timeout);
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function throttle(callback, timeout) {
  var timeoutInstance;
  return function(...args) {
    if (!timeoutInstance) {
      timeoutInstance = safeSetTimeout(function() {
        timeoutInstance = undefined;
        callback(...args);
      }, timeout);
    }
  };
}
function debounce(callback, timeout) {
  var timeoutInstance;
  return function(...args) {
    clearTimeout(timeoutInstance);
    timeoutInstance = safeSetTimeout(() => callback(...args), timeout);
  };
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
const ieVersion = options$1.document && function() {
  var version = 3, div = options$1.document.createElement("div"), iElems = div.getElementsByTagName("i");
  while (div.innerHTML = "<!--[if gt IE " + ++version + "]><i></i><![endif]-->", iElems[0]) {
  }
  if (!version) {
    return ua.match(/MSIE ([^ ]+)/) || ua.match(/rv:([^ )]+)/);
  }
  return version > 4 ? version : undefined;
}();

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function hasOwnProperty(obj, propName) {
  return Object.prototype.hasOwnProperty.call(obj, propName);
}
function isObjectLike(obj) {
  if (obj === null) {
    return false;
  }
  return typeof obj === "object" || typeof obj === "function";
}
function extend(target, source) {
  if (source) {
    for (var prop in source) {
      if (hasOwnProperty(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }
  return target;
}
function objectForEach(obj, action) {
  for (var prop in obj) {
    if (hasOwnProperty(obj, prop)) {
      action(prop, obj[prop]);
    }
  }
}
function objectMap(source, mapping, thisArg) {
  if (!source) {
    return source;
  }
  if (arguments.length > 2) {
    mapping = mapping.bind(thisArg);
  }
  var target = {};
  for (var prop in source) {
    if (hasOwnProperty(source, prop)) {
      target[prop] = mapping(source[prop], prop, source);
    }
  }
  return target;
}
function getObjectOwnProperty(obj, propName) {
  return hasOwnProperty(obj, propName) ? obj[propName] : undefined;
}
function clonePlainObjectDeep(obj, seen) {
  if (!seen) {
    seen = [];
  }
  if (!obj || typeof obj !== "object" || obj.constructor !== Object || seen.indexOf(obj) !== -1) {
    return obj;
  }
  seen.push(obj);
  var result = {};
  for (var prop in obj) {
    if (hasOwnProperty(obj, prop)) {
      result[prop] = clonePlainObjectDeep(obj[prop], seen);
    }
  }
  return result;
}
function safeStringify(value) {
  const seen = /* @__PURE__ */ new Set();
  return JSON.stringify(value, (k, v) => {
    if (seen.has(v)) {
      return "...";
    }
    if (typeof v === "object") {
      seen.add(v);
    }
    return v;
  });
}
function isThenable(object) {
  return isObjectLike(object) && typeof object.then === "function";
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function testOverwrite() {
  try {
    Object.defineProperty(function x() {
    }, "length", {});
    return true;
  } catch (e) {
    return false;
  }
}
const functionSupportsLengthOverwrite = testOverwrite();
function overwriteLengthPropertyIfSupported(fn, descriptor) {
  if (functionSupportsLengthOverwrite) {
    Object.defineProperty(fn, "length", descriptor);
  }
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function stringTrim(string) {
  return string === null || string === undefined ? "" : string.trim ? string.trim() : string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
}
function stringStartsWith(string, startsWith) {
  string = string || "";
  if (startsWith.length > string.length) {
    return false;
  }
  return string.substring(0, startsWith.length) === startsWith;
}
function parseJson(jsonString) {
  if (typeof jsonString === "string") {
    jsonString = stringTrim(jsonString);
    if (jsonString) {
      if (JSON && JSON.parse) {
        return JSON.parse(jsonString);
      }
      return new Function("return " + jsonString)();
    }
  }
  return null;
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var useSymbols = typeof Symbol === "function";
function createSymbolOrString(identifier) {
  return useSymbols ? Symbol(identifier) : identifier;
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var cssClassNameRegex = /\S+/g;
function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
  var addOrRemoveFn;
  if (!classNames) {
    return;
  }
  if (typeof node.classList === "object") {
    addOrRemoveFn = node.classList[shouldHaveClass ? "add" : "remove"];
    arrayForEach(classNames.match(cssClassNameRegex), function(className) {
      addOrRemoveFn.call(node.classList, className);
    });
  } else if (typeof node.className["baseVal"] === "string") {
    toggleObjectClassPropertyString(node.className, "baseVal", classNames, shouldHaveClass);
  } else {
    toggleObjectClassPropertyString(node, "className", classNames, shouldHaveClass);
  }
}
function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
  var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
  arrayForEach(classNames.match(cssClassNameRegex), function(className) {
    addOrRemoveItem(currentClassNames, className, shouldHaveClass);
  });
  obj[prop] = currentClassNames.join(" ");
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var jQueryInstance$1 = options$1.global && options$1.global.jQuery;

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function domNodeIsContainedBy(node, containedByNode) {
  if (node === containedByNode) {
    return true;
  }
  if (node.nodeType === 11) {
    return false;
  }
  if (containedByNode.contains) {
    return containedByNode.contains(node.nodeType !== 1 ? node.parentNode : node);
  }
  if (containedByNode.compareDocumentPosition) {
    return (containedByNode.compareDocumentPosition(node) & 16) == 16;
  }
  while (node && node != containedByNode) {
    node = node.parentNode;
  }
  return !!node;
}
function domNodeIsAttachedToDocument(node) {
  return domNodeIsContainedBy(node, node.ownerDocument.documentElement);
}
function anyDomNodeIsAttachedToDocument(nodes) {
  return !!arrayFirst(nodes, domNodeIsAttachedToDocument);
}
function tagNameLower(element) {
  return element && element.tagName && element.tagName.toLowerCase();
}
function isDomElement(obj) {
  if (window.HTMLElement) {
    return obj instanceof HTMLElement;
  } else {
    return obj && obj.tagName && obj.nodeType === 1;
  }
}
function isDocumentFragment(obj) {
  if (window.DocumentFragment) {
    return obj instanceof DocumentFragment;
  } else {
    return obj && obj.nodeType === 11;
  }
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
const datastoreTime = new Date().getTime();
const dataStoreKeyExpandoPropertyName = `__ko__${datastoreTime}`;
const dataStoreSymbol = Symbol("Knockout data");
var dataStore;
let uniqueId = 0;
const modern = {
  getDataForNode(node, createIfNotFound) {
    let dataForNode = node[dataStoreSymbol];
    if (!dataForNode && createIfNotFound) {
      dataForNode = node[dataStoreSymbol] = {};
    }
    return dataForNode;
  },
  clear(node) {
    if (node[dataStoreSymbol]) {
      delete node[dataStoreSymbol];
      return true;
    }
    return false;
  }
};
const IE = {
  getDataforNode(node, createIfNotFound) {
    let dataStoreKey = node[dataStoreKeyExpandoPropertyName];
    const hasExistingDataStore = dataStoreKey && dataStoreKey !== "null" && dataStore[dataStoreKey];
    if (!hasExistingDataStore) {
      if (!createIfNotFound) {
        return undefined;
      }
      dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
      dataStore[dataStoreKey] = {};
    }
    return dataStore[dataStoreKey];
  },
  clear(node) {
    const dataStoreKey = node[dataStoreKeyExpandoPropertyName];
    if (dataStoreKey) {
      delete dataStore[dataStoreKey];
      node[dataStoreKeyExpandoPropertyName] = null;
      return true;
    }
    return false;
  }
};
const { getDataForNode, clear } = ieVersion ? IE : modern;
function nextKey() {
  return uniqueId++ + dataStoreKeyExpandoPropertyName;
}
function get(node, key) {
  const dataForNode = getDataForNode(node, false);
  return dataForNode && dataForNode[key];
}
function set(node, key, value) {
  var dataForNode = getDataForNode(node, value !== undefined);
  dataForNode && (dataForNode[key] = value);
}
function getOrSet(node, key, value) {
  const dataForNode = getDataForNode(node, true);
  return dataForNode[key] || (dataForNode[key] = value);
}

var domData = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clear: clear,
  get: get,
  getOrSet: getOrSet,
  nextKey: nextKey,
  set: set
});

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var domDataKey = nextKey();
var cleanableNodeTypes = { 1: true, 8: true, 9: true };
var cleanableNodeTypesWithDescendants = { 1: true, 9: true };
function getDisposeCallbacksCollection(node, createIfNotFound) {
  var allDisposeCallbacks = get(node, domDataKey);
  if (allDisposeCallbacks === undefined && createIfNotFound) {
    allDisposeCallbacks = [];
    set(node, domDataKey, allDisposeCallbacks);
  }
  return allDisposeCallbacks;
}
function destroyCallbacksCollection(node) {
  set(node, domDataKey, undefined);
}
function cleanSingleNode(node) {
  var callbacks = getDisposeCallbacksCollection(node, false);
  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i](node);
    }
  }
  clear(node);
  for (let i = 0, j = otherNodeCleanerFunctions.length; i < j; ++i) {
    otherNodeCleanerFunctions[i](node);
  }
  if (options$1.cleanExternalData) {
    options$1.cleanExternalData(node);
  }
  if (cleanableNodeTypesWithDescendants[node.nodeType]) {
    cleanNodesInList(node.childNodes, true);
  }
}
function cleanNodesInList(nodeList, onlyComments) {
  const cleanedNodes = [];
  let lastCleanedNode;
  for (var i = 0; i < nodeList.length; i++) {
    if (!onlyComments || nodeList[i].nodeType === 8) {
      cleanSingleNode(cleanedNodes[cleanedNodes.length] = lastCleanedNode = nodeList[i]);
      if (nodeList[i] !== lastCleanedNode) {
        while (i-- && arrayIndexOf(cleanedNodes, nodeList[i]) === -1) {
        }
      }
    }
  }
}
function addDisposeCallback(node, callback) {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }
  getDisposeCallbacksCollection(node, true).push(callback);
}
function removeDisposeCallback(node, callback) {
  var callbacksCollection = getDisposeCallbacksCollection(node, false);
  if (callbacksCollection) {
    arrayRemoveItem(callbacksCollection, callback);
    if (callbacksCollection.length === 0) {
      destroyCallbacksCollection(node);
    }
  }
}
function cleanNode(node) {
  if (cleanableNodeTypes[node.nodeType]) {
    cleanSingleNode(node);
    if (cleanableNodeTypesWithDescendants[node.nodeType]) {
      cleanNodesInList(node.getElementsByTagName("*"));
    }
  }
  return node;
}
function removeNode(node) {
  cleanNode(node);
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
const otherNodeCleanerFunctions = [];
function addCleaner(fn) {
  otherNodeCleanerFunctions.push(fn);
}
function removeCleaner(fn) {
  const fnIndex = otherNodeCleanerFunctions.indexOf(fn);
  if (fnIndex >= 0) {
    otherNodeCleanerFunctions.splice(fnIndex, 1);
  }
}
function cleanjQueryData(node) {
  var jQueryCleanNodeFn = jQueryInstance$1 ? jQueryInstance$1.cleanData : null;
  if (jQueryCleanNodeFn) {
    jQueryCleanNodeFn([node]);
  }
}
otherNodeCleanerFunctions.push(cleanjQueryData);

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var knownEvents = {}, knownEventTypesByEventName = {};
var keyEventTypeName = options$1.global.navigator && /Firefox\/2/i.test(options$1.global.navigator.userAgent) ? "KeyboardEvent" : "UIEvents";
knownEvents[keyEventTypeName] = ["keyup", "keydown", "keypress"];
knownEvents["MouseEvents"] = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave"
];
objectForEach(knownEvents, function(eventType, knownEventsForType) {
  if (knownEventsForType.length) {
    for (var i = 0, j = knownEventsForType.length; i < j; i++) {
      knownEventTypesByEventName[knownEventsForType[i]] = eventType;
    }
  }
});
function isClickOnCheckableElement(element, eventType) {
  if (tagNameLower(element) !== "input" || !element.type)
    return false;
  if (eventType.toLowerCase() != "click")
    return false;
  var inputType = element.type;
  return inputType == "checkbox" || inputType == "radio";
}
var eventsThatMustBeRegisteredUsingAttachEvent = { "propertychange": true };
let jQueryEventAttachName;
function registerEventHandler(element, eventType, handler, eventOptions = false) {
  const wrappedHandler = catchFunctionErrors(handler);
  const mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
  const mustUseNative = Boolean(eventOptions);
  if (!options$1.useOnlyNativeEvents && !mustUseAttachEvent && !mustUseNative && jQueryInstance$1) {
    if (!jQueryEventAttachName) {
      jQueryEventAttachName = typeof jQueryInstance$1(element).on === "function" ? "on" : "bind";
    }
    jQueryInstance$1(element)[jQueryEventAttachName](eventType, wrappedHandler);
  } else if (!mustUseAttachEvent && typeof element.addEventListener === "function") {
    element.addEventListener(eventType, wrappedHandler, eventOptions);
  } else if (typeof element.attachEvent !== "undefined") {
    const attachEventHandler = function(event) {
      wrappedHandler.call(element, event);
    };
    const attachEventName = "on" + eventType;
    element.attachEvent(attachEventName, attachEventHandler);
    addDisposeCallback(element, function() {
      element.detachEvent(attachEventName, attachEventHandler);
    });
  } else {
    throw new Error("Browser doesn't support addEventListener or attachEvent");
  }
}
function triggerEvent(element, eventType) {
  if (!(element && element.nodeType)) {
    throw new Error("element must be a DOM node when calling triggerEvent");
  }
  var useClickWorkaround = isClickOnCheckableElement(element, eventType);
  if (!options$1.useOnlyNativeEvents && jQueryInstance$1 && !useClickWorkaround) {
    jQueryInstance$1(element).trigger(eventType);
  } else if (typeof document.createEvent === "function") {
    if (typeof element.dispatchEvent === "function") {
      var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
      var event = document.createEvent(eventCategory);
      event.initEvent(eventType, true, true, options$1.global, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
      element.dispatchEvent(event);
    } else {
      throw new Error("The supplied element doesn't support dispatchEvent");
    }
  } else if (useClickWorkaround && element.click) {
    element.click();
  } else if (typeof element.fireEvent !== "undefined") {
    element.fireEvent("on" + eventType);
  } else {
    throw new Error("Browser doesn't support triggering events");
  }
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function moveCleanedNodesToContainerElement(nodes) {
  var nodesArray = makeArray(nodes);
  var templateDocument = nodesArray[0] && nodesArray[0].ownerDocument || document;
  var container = templateDocument.createElement("div");
  for (var i = 0, j = nodesArray.length; i < j; i++) {
    container.appendChild(cleanNode(nodesArray[i]));
  }
  return container;
}
function cloneNodes(nodesArray, shouldCleanNodes) {
  for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
    var clonedNode = nodesArray[i].cloneNode(true);
    newNodesArray.push(shouldCleanNodes ? cleanNode(clonedNode) : clonedNode);
  }
  return newNodesArray;
}
function setDomNodeChildren$1(domNode, childNodes) {
  emptyDomNode(domNode);
  if (childNodes) {
    for (var i = 0, j = childNodes.length; i < j; i++) {
      domNode.appendChild(childNodes[i]);
    }
  }
}
function replaceDomNodes(nodeToReplaceOrNodeArray, newNodesArray) {
  var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
  if (nodesToReplaceArray.length > 0) {
    var insertionPoint = nodesToReplaceArray[0];
    var parent = insertionPoint.parentNode;
    for (var i = 0, j = newNodesArray.length; i < j; i++) {
      parent.insertBefore(newNodesArray[i], insertionPoint);
    }
    for (i = 0, j = nodesToReplaceArray.length; i < j; i++) {
      removeNode(nodesToReplaceArray[i]);
    }
  }
}
function setElementName(element, name) {
  element.name = name;
  if (ieVersion <= 7) {
    try {
      element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
    } catch (e) {
    }
  }
}
function emptyDomNode(domNode) {
  while (domNode.firstChild) {
    removeNode(domNode.firstChild);
  }
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
function fixUpContinuousNodeArray(continuousNodeArray, parentNode) {
  if (continuousNodeArray.length) {
    parentNode = parentNode.nodeType === 8 && parentNode.parentNode || parentNode;
    while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode) {
      continuousNodeArray.splice(0, 1);
    }
    while (continuousNodeArray.length > 1 && continuousNodeArray[continuousNodeArray.length - 1].parentNode !== parentNode) {
      continuousNodeArray.length--;
    }
    if (continuousNodeArray.length > 1) {
      var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
      continuousNodeArray.length = 0;
      while (current !== last) {
        continuousNodeArray.push(current);
        current = current.nextSibling;
      }
      continuousNodeArray.push(last);
    }
  }
  return continuousNodeArray;
}
function setOptionNodeSelectionState(optionNode, isSelected) {
  if (ieVersion < 7) {
    optionNode.setAttribute("selected", isSelected);
  } else {
    optionNode.selected = isSelected;
  }
}
function forceRefresh(node) {
  if (ieVersion >= 9) {
    var elem = node.nodeType == 1 ? node : node.parentNode;
    if (elem.style) {
      elem.style.zoom = elem.style.zoom;
    }
  }
}
function ensureSelectElementIsRenderedCorrectly(selectElement) {
  if (ieVersion) {
    var originalWidth = selectElement.style.width;
    selectElement.style.width = 0;
    selectElement.style.width = originalWidth;
  }
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var commentNodesHaveTextProperty = options$1.document && options$1.document.createComment("test").text === "<!--test-->";
var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
var endCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
var htmlTagsWithOptionallyClosingChildren = { "ul": true, "ol": true };
function isStartComment(node) {
  return node.nodeType == 8 && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
}
function isEndComment(node) {
  return node.nodeType == 8 && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
}
function isUnmatchedEndComment(node) {
  return isEndComment(node) && !get(node, matchedEndCommentDataKey);
}
const matchedEndCommentDataKey = "__ko_matchedEndComment__";
function getVirtualChildren(startComment, allowUnbalanced) {
  var currentNode = startComment;
  var depth = 1;
  var children = [];
  while (currentNode = currentNode.nextSibling) {
    if (isEndComment(currentNode)) {
      set(currentNode, matchedEndCommentDataKey, true);
      depth--;
      if (depth === 0) {
        return children;
      }
    }
    children.push(currentNode);
    if (isStartComment(currentNode)) {
      depth++;
    }
  }
  if (!allowUnbalanced) {
    throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
  }
  return null;
}
function getMatchingEndComment(startComment, allowUnbalanced) {
  var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
  if (allVirtualChildren) {
    if (allVirtualChildren.length > 0) {
      return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
    }
    return startComment.nextSibling;
  } else {
    return null;
  }
}
function getUnbalancedChildTags(node) {
  var childNode = node.firstChild, captureRemaining = null;
  if (childNode) {
    do {
      if (captureRemaining) {
        captureRemaining.push(childNode);
      } else if (isStartComment(childNode)) {
        var matchingEndComment = getMatchingEndComment(childNode, true);
        if (matchingEndComment) {
          childNode = matchingEndComment;
        } else {
          captureRemaining = [childNode];
        }
      } else if (isEndComment(childNode)) {
        captureRemaining = [childNode];
      }
    } while (childNode = childNode.nextSibling);
  }
  return captureRemaining;
}
var allowedBindings = {};
var hasBindingValue = isStartComment;
function childNodes(node) {
  return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
}
function emptyNode(node) {
  if (!isStartComment(node)) {
    emptyDomNode(node);
  } else {
    var virtualChildren = childNodes(node);
    for (var i = 0, j = virtualChildren.length; i < j; i++) {
      removeNode(virtualChildren[i]);
    }
  }
}
function setDomNodeChildren(node, childNodes2) {
  if (!isStartComment(node)) {
    setDomNodeChildren$1(node, childNodes2);
  } else {
    emptyNode(node);
    const endCommentNode = node.nextSibling;
    const parentNode = endCommentNode.parentNode;
    for (var i = 0, j = childNodes2.length; i < j; ++i) {
      parentNode.insertBefore(childNodes2[i], endCommentNode);
    }
  }
}
function prepend(containerNode, nodeToPrepend) {
  if (!isStartComment(containerNode)) {
    if (containerNode.firstChild) {
      containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
    } else {
      containerNode.appendChild(nodeToPrepend);
    }
  } else {
    containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
  }
}
function insertAfter(containerNode, nodeToInsert, insertAfterNode) {
  if (!insertAfterNode) {
    prepend(containerNode, nodeToInsert);
  } else if (!isStartComment(containerNode)) {
    if (insertAfterNode.nextSibling) {
      containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
    } else {
      containerNode.appendChild(nodeToInsert);
    }
  } else {
    containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
  }
}
function firstChild(node) {
  if (!isStartComment(node)) {
    if (node.firstChild && isEndComment(node.firstChild)) {
      throw new Error("Found invalid end comment, as the first child of " + node.outerHTML);
    }
    return node.firstChild;
  }
  if (!node.nextSibling || isEndComment(node.nextSibling)) {
    return null;
  }
  return node.nextSibling;
}
function lastChild(node) {
  let nextChild = firstChild(node);
  let lastChildNode;
  do {
    lastChildNode = nextChild;
  } while (nextChild = nextSibling(nextChild));
  return lastChildNode;
}
function nextSibling(node) {
  if (isStartComment(node)) {
    node = getMatchingEndComment(node);
  }
  if (node.nextSibling && isEndComment(node.nextSibling)) {
    if (isUnmatchedEndComment(node.nextSibling)) {
      throw Error("Found end comment without a matching opening comment, as next sibling of " + node.outerHTML);
    }
    return null;
  } else {
    return node.nextSibling;
  }
}
function previousSibling(node) {
  var depth = 0;
  do {
    if (node.nodeType === 8) {
      if (isStartComment(node)) {
        if (--depth === 0) {
          return node;
        }
      } else if (isEndComment(node)) {
        depth++;
      }
    } else {
      if (depth === 0) {
        return node;
      }
    }
  } while (node = node.previousSibling);
}
function virtualNodeBindingValue(node) {
  var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
  return regexMatch ? regexMatch[1] : null;
}
function normaliseVirtualElementDomStructure(elementVerified) {
  if (!htmlTagsWithOptionallyClosingChildren[tagNameLower(elementVerified)]) {
    return;
  }
  var childNode = elementVerified.firstChild;
  if (childNode) {
    do {
      if (childNode.nodeType === 1) {
        var unbalancedTags = getUnbalancedChildTags(childNode);
        if (unbalancedTags) {
          var nodeToInsertBefore = childNode.nextSibling;
          for (var i = 0; i < unbalancedTags.length; i++) {
            if (nodeToInsertBefore) {
              elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
            } else {
              elementVerified.appendChild(unbalancedTags[i]);
            }
          }
        }
      }
    } while (childNode = childNode.nextSibling);
  }
}

var virtualElements = /*#__PURE__*/Object.freeze({
  __proto__: null,
  allowedBindings: allowedBindings,
  childNodes: childNodes,
  emptyNode: emptyNode,
  endCommentRegex: endCommentRegex,
  firstChild: firstChild,
  getVirtualChildren: getVirtualChildren,
  hasBindingValue: hasBindingValue,
  insertAfter: insertAfter,
  isEndComment: isEndComment,
  isStartComment: isStartComment,
  lastChild: lastChild,
  nextSibling: nextSibling,
  normaliseVirtualElementDomStructure: normaliseVirtualElementDomStructure,
  prepend: prepend,
  previousSibling: previousSibling,
  setDomNodeChildren: setDomNodeChildren,
  startCommentRegex: startCommentRegex,
  virtualNodeBindingValue: virtualNodeBindingValue
});

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var none = [0, "", ""], table = [1, "<table>", "</table>"], tbody = [2, "<table><tbody>", "</tbody></table>"], colgroup = [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], tr = [3, "<table><tbody><tr>", "</tr></tbody></table>"], select = [1, "<select multiple='multiple'>", "</select>"], fieldset = [1, "<fieldset>", "</fieldset>"], map = [1, "<map>", "</map>"], object = [1, "<object>", "</object>"], lookup = {
  "area": map,
  "col": colgroup,
  "colgroup": table,
  "caption": table,
  "legend": fieldset,
  "thead": table,
  "tbody": table,
  "tfoot": table,
  "tr": tbody,
  "td": tr,
  "th": tr,
  "option": select,
  "optgroup": select,
  "param": object
}, supportsTemplateTag = options$1.document && "content" in options$1.document.createElement("template");
function getWrap(tags) {
  const m = tags.match(/^(?:<!--.*?-->\s*?)*?<([a-z]+)[\s>]/);
  return m && lookup[m[1]] || none;
}
function simpleHtmlParse(html, documentContext) {
  documentContext || (documentContext = document);
  var windowContext = documentContext["parentWindow"] || documentContext["defaultView"] || window;
  var tags = stringTrim(html).toLowerCase(), div = documentContext.createElement("div"), wrap = getWrap(tags), depth = wrap[0];
  var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
  if (typeof windowContext["innerShiv"] === "function") {
    div.appendChild(windowContext["innerShiv"](markup));
  } else {
    div.innerHTML = markup;
  }
  while (depth--) {
    div = div.lastChild;
  }
  return makeArray(div.lastChild.childNodes);
}
function templateHtmlParse(html, documentContext) {
  if (!documentContext) {
    documentContext = document;
  }
  var template = documentContext.createElement("template");
  template.innerHTML = html;
  return makeArray(template.content.childNodes);
}
function jQueryHtmlParse(html, documentContext) {
  if (jQueryInstance$1.parseHTML) {
    return jQueryInstance$1.parseHTML(html, documentContext) || [];
  } else {
    var elems = jQueryInstance$1.clean([html], documentContext);
    if (elems && elems[0]) {
      var elem = elems[0];
      while (elem.parentNode && elem.parentNode.nodeType !== 11) {
        elem = elem.parentNode;
      }
      if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    }
    return elems;
  }
}
function parseHtmlFragment(html, documentContext) {
  return supportsTemplateTag ? templateHtmlParse(html, documentContext) : jQueryInstance$1 ? jQueryHtmlParse(html, documentContext) : simpleHtmlParse(html, documentContext);
}
function parseHtmlForTemplateNodes(html, documentContext) {
  const nodes = parseHtmlFragment(html, documentContext);
  return nodes.length && nodes[0].parentElement || moveCleanedNodesToContainerElement(nodes);
}
function setHtml(node, html) {
  emptyDomNode(node);
  if (typeof html === "function") {
    html = html();
  }
  if (html !== null && html !== undefined) {
    if (typeof html !== "string") {
      html = html.toString();
    }
    if (jQueryInstance$1 && !supportsTemplateTag) {
      jQueryInstance$1(node).html(html);
    } else {
      var parsedNodes = parseHtmlFragment(html, node.ownerDocument);
      if (node.nodeType === 8) {
        if (html === null) {
          emptyNode(node);
        } else {
          setDomNodeChildren(node, parsedNodes);
        }
      } else {
        for (var i = 0; i < parsedNodes.length; i++) {
          node.appendChild(parsedNodes[i]);
        }
      }
    }
  }
}
function setTextContent(element, textContent) {
  var value = typeof textContent === "function" ? textContent() : textContent;
  if (value === null || value === undefined) {
    value = "";
  }
  var innerTextNode = firstChild(element);
  if (!innerTextNode || innerTextNode.nodeType != 3 || nextSibling(innerTextNode)) {
    setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
  } else {
    innerTextNode.data = value;
  }
  forceRefresh(element);
}

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var hasDomDataExpandoProperty = Symbol("Knockout selectExtensions hasDomDataProperty");
var selectExtensions = {
  optionValueDomDataKey: nextKey(),
  readValue: function(element) {
    switch (tagNameLower(element)) {
      case "option":
        if (element[hasDomDataExpandoProperty] === true) {
          return get(element, selectExtensions.optionValueDomDataKey);
        }
        return element.value;
      case "select":
        return element.selectedIndex >= 0 ? selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
      default:
        return element.value;
    }
  },
  writeValue: function(element, value, allowUnset) {
    switch (tagNameLower(element)) {
      case "option":
        if (typeof value === "string") {
          set(element, selectExtensions.optionValueDomDataKey, undefined);
          if (hasDomDataExpandoProperty in element) {
            delete element[hasDomDataExpandoProperty];
          }
          element.value = value;
        } else {
          set(element, selectExtensions.optionValueDomDataKey, value);
          element[hasDomDataExpandoProperty] = true;
          element.value = typeof value === "number" ? value : "";
        }
        break;
      case "select":
        if (value === "" || value === null) {
          value = undefined;
        }
        var selection = -1;
        for (let i = 0, n = element.options.length, optionValue; i < n; ++i) {
          optionValue = selectExtensions.readValue(element.options[i]);
          const strictEqual = optionValue === value;
          const blankEqual = optionValue === "" && value === undefined;
          const numericEqual = typeof value === "number" && Number(optionValue) === value;
          if (strictEqual || blankEqual || numericEqual) {
            selection = i;
            break;
          }
        }
        if (allowUnset || selection >= 0 || value === undefined && element.size > 1) {
          element.selectedIndex = selection;
        }
        break;
      default:
        if (value === null || value === undefined) {
          value = "";
        }
        element.value = value;
        break;
    }
  }
};

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var memos = {};
function randomMax8HexChars() {
  return ((1 + Math.random()) * 4294967296 | 0).toString(16).substring(1);
}
function generateRandomId() {
  return randomMax8HexChars() + randomMax8HexChars();
}
function findMemoNodes(rootNode, appendToArray) {
  if (!rootNode) {
    return;
  }
  if (rootNode.nodeType == 8) {
    var memoId = parseMemoText(rootNode.nodeValue);
    if (memoId != null) {
      appendToArray.push({ domNode: rootNode, memoId });
    }
  } else if (rootNode.nodeType == 1) {
    for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++) {
      findMemoNodes(childNodes[i], appendToArray);
    }
  }
}
function memoize(callback) {
  if (typeof callback !== "function") {
    throw new Error("You can only pass a function to memoization.memoize()");
  }
  var memoId = generateRandomId();
  memos[memoId] = callback;
  return "<!--[ko_memo:" + memoId + "]-->";
}
function unmemoize(memoId, callbackParams) {
  var callback = memos[memoId];
  if (callback === undefined) {
    throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
  }
  try {
    callback.apply(null, callbackParams || []);
    return true;
  } finally {
    delete memos[memoId];
  }
}
function unmemoizeDomNodeAndDescendants(domNode, extraCallbackParamsArray) {
  var memos2 = [];
  findMemoNodes(domNode, memos2);
  for (var i = 0, j = memos2.length; i < j; i++) {
    var node = memos2[i].domNode;
    var combinedParams = [node];
    if (extraCallbackParamsArray) {
      arrayPushAll(combinedParams, extraCallbackParamsArray);
    }
    unmemoize(memos2[i].memoId, combinedParams);
    node.nodeValue = "";
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
}
function parseMemoText(memoText) {
  var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
  return match ? match[1] : null;
}

var memoization = /*#__PURE__*/Object.freeze({
  __proto__: null,
  memoize: memoize,
  parseMemoText: parseMemoText,
  unmemoize: unmemoize,
  unmemoizeDomNodeAndDescendants: unmemoizeDomNodeAndDescendants
});

// @tko/utils 🥊 4.0.0-beta1.3 ESM
var taskQueue = [], taskQueueLength = 0, nextHandle = 1, nextIndexToProcess = 0, w$1 = options$1.global;
if (w$1 && w$1.MutationObserver && !(w$1.navigator && w$1.navigator.standalone)) {
  options$1.taskScheduler = function(callback) {
    var div = w$1.document.createElement("div");
    new w$1.MutationObserver(callback).observe(div, { attributes: true });
    return function() {
      div.classList.toggle("foo");
    };
  }(scheduledProcess);
} else if (w$1 && w$1.document && "onreadystatechange" in w$1.document.createElement("script")) {
  options$1.taskScheduler = function(callback) {
    var script = document.createElement("script");
    script.onreadystatechange = function() {
      script.onreadystatechange = null;
      document.documentElement.removeChild(script);
      script = null;
      callback();
    };
    document.documentElement.appendChild(script);
  };
} else {
  options$1.taskScheduler = function(callback) {
    setTimeout(callback, 0);
  };
}
function processTasks() {
  if (taskQueueLength) {
    var mark = taskQueueLength, countMarks = 0;
    for (var task; nextIndexToProcess < taskQueueLength; ) {
      if (task = taskQueue[nextIndexToProcess++]) {
        if (nextIndexToProcess > mark) {
          if (++countMarks >= 5e3) {
            nextIndexToProcess = taskQueueLength;
            deferError(Error("'Too much recursion' after processing " + countMarks + " task groups."));
            break;
          }
          mark = taskQueueLength;
        }
        try {
          task();
        } catch (ex) {
          deferError(ex);
        }
      }
    }
  }
}
function scheduledProcess() {
  processTasks();
  nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
}
function scheduleTaskProcessing() {
  options$1.taskScheduler(scheduledProcess);
}
function schedule(func) {
  if (!taskQueueLength) {
    scheduleTaskProcessing();
  }
  taskQueue[taskQueueLength++] = func;
  return nextHandle++;
}
function cancel(handle) {
  var index = handle - (nextHandle - taskQueueLength);
  if (index >= nextIndexToProcess && index < taskQueueLength) {
    taskQueue[index] = null;
  }
}
function resetForTesting() {
  var length = taskQueueLength - nextIndexToProcess;
  nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
  return length;
}

var tasks = /*#__PURE__*/Object.freeze({
  __proto__: null,
  cancel: cancel,
  resetForTesting: resetForTesting,
  runEarly: processTasks,
  schedule: schedule
});

// @tko/observable 🥊 4.0.0-beta1.3 ESM
const SUBSCRIBABLE_SYM = Symbol("Knockout Subscribable");
function isSubscribable(instance) {
  return instance && instance[SUBSCRIBABLE_SYM] || false;
}

// @tko/observable 🥊 4.0.0-beta1.3 ESM
const outerFrames = [];
let currentFrame;
let lastId = 0;
function getId() {
  return ++lastId;
}
function begin(options) {
  outerFrames.push(currentFrame);
  currentFrame = options;
}
function end() {
  currentFrame = outerFrames.pop();
}
function registerDependency(subscribable) {
  if (currentFrame) {
    if (!isSubscribable(subscribable)) {
      throw new Error("Only subscribable things can act as dependencies");
    }
    currentFrame.callback.call(currentFrame.callbackTarget, subscribable, subscribable._id || (subscribable._id = getId()));
  }
}
function ignore(callback, callbackTarget, callbackArgs) {
  try {
    begin();
    return callback.apply(callbackTarget, callbackArgs || []);
  } finally {
    end();
  }
}
function getDependenciesCount() {
  if (currentFrame) {
    return currentFrame.computed.getDependenciesCount();
  }
}
function getDependencies() {
  if (currentFrame) {
    return currentFrame.computed.getDependencies();
  }
}
function isInitial() {
  if (currentFrame) {
    return currentFrame.isInitial;
  }
}

var dependencyDetection = /*#__PURE__*/Object.freeze({
  __proto__: null,
  begin: begin,
  end: end,
  getDependencies: getDependencies,
  getDependenciesCount: getDependenciesCount,
  ignore: ignore,
  ignoreDependencies: ignore,
  isInitial: isInitial,
  registerDependency: registerDependency
});

// @tko/observable 🥊 4.0.0-beta1.3 ESM
function deferUpdates(target) {
  if (target._deferUpdates) {
    return;
  }
  target._deferUpdates = true;
  target.limit(function(callback) {
    let handle;
    let ignoreUpdates = false;
    return function() {
      if (!ignoreUpdates) {
        cancel(handle);
        handle = schedule(callback);
        try {
          ignoreUpdates = true;
          target.notifySubscribers(void 0, "dirty");
        } finally {
          ignoreUpdates = false;
        }
      }
    };
  });
}

// @tko/observable 🥊 4.0.0-beta1.3 ESM
class Subscription {
  constructor(target, observer, disposeCallback) {
    this._target = target;
    this._callback = observer.next;
    this._disposeCallback = disposeCallback;
    this._isDisposed = false;
    this._domNodeDisposalCallback = null;
  }
  dispose() {
    if (this._domNodeDisposalCallback) {
      removeDisposeCallback(this._node, this._domNodeDisposalCallback);
    }
    this._isDisposed = true;
    this._disposeCallback();
  }
  disposeWhenNodeIsRemoved(node) {
    this._node = node;
    addDisposeCallback(node, this._domNodeDisposalCallback = this.dispose.bind(this));
  }
  unsubscribe() {
    this.dispose();
  }
  get closed() {
    return this._isDisposed;
  }
}

// @tko/observable 🥊 4.0.0-beta1.3 ESM
var primitiveTypes = {
  "undefined": 1,
  "boolean": 1,
  "number": 1,
  "string": 1
};
function valuesArePrimitiveAndEqual(a, b) {
  var oldValueIsPrimitive = a === null || typeof a in primitiveTypes;
  return oldValueIsPrimitive ? a === b : false;
}
function applyExtenders(requestedExtenders) {
  var target = this;
  if (requestedExtenders) {
    objectForEach(requestedExtenders, function(key, value) {
      var extenderHandler = extenders[key];
      if (typeof extenderHandler === "function") {
        target = extenderHandler(target, value) || target;
      } else {
        options$1.onError(new Error("Extender not found: " + key));
      }
    });
  }
  return target;
}
function notify(target, notifyWhen) {
  target.equalityComparer = notifyWhen == "always" ? null : valuesArePrimitiveAndEqual;
}
function deferred(target, option) {
  if (option !== true) {
    throw new Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");
  }
  deferUpdates(target);
}
function rateLimit(target, options2) {
  var timeout, method, limitFunction;
  if (typeof options2 === "number") {
    timeout = options2;
  } else {
    timeout = options2.timeout;
    method = options2.method;
  }
  target._deferUpdates = false;
  limitFunction = method === "notifyWhenChangesStop" ? debounce : throttle;
  target.limit(function(callback) {
    return limitFunction(callback, timeout);
  });
}
var extenders = {
  notify,
  deferred,
  rateLimit
};

// @tko/observable 🥊 4.0.0-beta1.3 ESM
const LATEST_VALUE = Symbol("Knockout latest value");
if (!Symbol.observable) {
  Symbol.observable = Symbol.for("@tko/Symbol.observable");
}
function subscribable() {
  Object.setPrototypeOf(this, ko_subscribable_fn);
  ko_subscribable_fn.init(this);
}
var defaultEvent = "change";
var ko_subscribable_fn = {
  [SUBSCRIBABLE_SYM]: true,
  [Symbol.observable]() {
    return this;
  },
  init(instance) {
    instance._subscriptions = { change: [] };
    instance._versionNumber = 1;
  },
  subscribe(callback, callbackTarget, event) {
    const isTC39Callback = typeof callback === "object" && callback.next;
    event = event || defaultEvent;
    const observer = isTC39Callback ? callback : {
      next: callbackTarget ? callback.bind(callbackTarget) : callback
    };
    const subscriptionInstance = new Subscription(this, observer, () => {
      arrayRemoveItem(this._subscriptions[event], subscriptionInstance);
      if (this.afterSubscriptionRemove) {
        this.afterSubscriptionRemove(event);
      }
    });
    if (this.beforeSubscriptionAdd) {
      this.beforeSubscriptionAdd(event);
    }
    if (!this._subscriptions[event]) {
      this._subscriptions[event] = [];
    }
    this._subscriptions[event].push(subscriptionInstance);
    if (isTC39Callback && LATEST_VALUE in this) {
      observer.next(this[LATEST_VALUE]);
    }
    return subscriptionInstance;
  },
  notifySubscribers(valueToNotify, event) {
    event = event || defaultEvent;
    if (event === defaultEvent) {
      this.updateVersion();
    }
    if (this.hasSubscriptionsForEvent(event)) {
      const subs = event === defaultEvent && this._changeSubscriptions || [...this._subscriptions[event]];
      try {
        begin();
        for (let i = 0, subscriptionInstance; subscriptionInstance = subs[i]; ++i) {
          if (!subscriptionInstance._isDisposed) {
            subscriptionInstance._callback(valueToNotify);
          }
        }
      } finally {
        end();
      }
    }
  },
  getVersion() {
    return this._versionNumber;
  },
  hasChanged(versionToCheck) {
    return this.getVersion() !== versionToCheck;
  },
  updateVersion() {
    ++this._versionNumber;
  },
  hasSubscriptionsForEvent(event) {
    return this._subscriptions[event] && this._subscriptions[event].length;
  },
  getSubscriptionsCount(event) {
    if (event) {
      return this._subscriptions[event] && this._subscriptions[event].length || 0;
    } else {
      var total = 0;
      objectForEach(this._subscriptions, function(eventName, subscriptions) {
        if (eventName !== "dirty") {
          total += subscriptions.length;
        }
      });
      return total;
    }
  },
  isDifferent(oldValue, newValue) {
    return !this.equalityComparer || !this.equalityComparer(oldValue, newValue);
  },
  once(cb) {
    const subs = this.subscribe((nv) => {
      subs.dispose();
      cb(nv);
    });
  },
  when(test, returnValue) {
    const current = this.peek();
    const givenRv = arguments.length > 1;
    const testFn = typeof test === "function" ? test : (v) => v === test;
    if (testFn(current)) {
      return options$1.Promise.resolve(givenRv ? returnValue : current);
    }
    return new options$1.Promise((resolve, reject) => {
      const subs = this.subscribe((newValue) => {
        if (testFn(newValue)) {
          subs.dispose();
          resolve(givenRv ? returnValue : newValue);
        }
      });
    });
  },
  yet(test, ...args) {
    const testFn = typeof test === "function" ? test : (v) => v === test;
    const negated = (v) => !testFn(v);
    return this.when(negated, ...args);
  },
  next() {
    return new Promise((resolve) => this.once(resolve));
  },
  toString() {
    return "[object Object]";
  },
  extend: applyExtenders
};
Object.setPrototypeOf(ko_subscribable_fn, Function.prototype);
subscribable.fn = ko_subscribable_fn;

// @tko/observable 🥊 4.0.0-beta1.3 ESM
function observable(initialValue) {
  function Observable() {
    if (arguments.length > 0) {
      if (Observable.isDifferent(Observable[LATEST_VALUE], arguments[0])) {
        Observable.valueWillMutate();
        Observable[LATEST_VALUE] = arguments[0];
        Observable.valueHasMutated();
      }
      return this;
    } else {
      registerDependency(Observable);
      return Observable[LATEST_VALUE];
    }
  }
  overwriteLengthPropertyIfSupported(Observable, { value: undefined });
  Observable[LATEST_VALUE] = initialValue;
  subscribable.fn.init(Observable);
  Object.setPrototypeOf(Observable, observable.fn);
  if (options$1.deferUpdates) {
    deferUpdates(Observable);
  }
  return Observable;
}
observable.fn = {
  equalityComparer: valuesArePrimitiveAndEqual,
  peek() {
    return this[LATEST_VALUE];
  },
  valueHasMutated() {
    this.notifySubscribers(this[LATEST_VALUE], "spectate");
    this.notifySubscribers(this[LATEST_VALUE]);
  },
  valueWillMutate() {
    this.notifySubscribers(this[LATEST_VALUE], "beforeChange");
  },
  modify(fn, peek2 = true) {
    return this(fn(peek2 ? this.peek() : this()));
  },
  isWriteable: true
};
function limitNotifySubscribers(value, event) {
  if (!event || event === defaultEvent) {
    this._limitChange(value);
  } else if (event === "beforeChange") {
    this._limitBeforeChange(value);
  } else {
    this._origNotifySubscribers(value, event);
  }
}
subscribable.fn.limit = function limit(limitFunction) {
  var self = this;
  var selfIsObservable = isObservable(self);
  var beforeChange = "beforeChange";
  var ignoreBeforeChange, notifyNextChange, previousValue, pendingValue, didUpdate;
  if (!self._origNotifySubscribers) {
    self._origNotifySubscribers = self.notifySubscribers;
    self.notifySubscribers = limitNotifySubscribers;
  }
  var finish = limitFunction(function() {
    self._notificationIsPending = false;
    if (selfIsObservable && pendingValue === self) {
      pendingValue = self._evalIfChanged ? self._evalIfChanged() : self();
    }
    const shouldNotify = notifyNextChange || didUpdate && self.isDifferent(previousValue, pendingValue);
    self._notifyNextChange = didUpdate = ignoreBeforeChange = false;
    if (shouldNotify) {
      self._origNotifySubscribers(previousValue = pendingValue);
    }
  });
  Object.assign(self, {
    _limitChange(value, isDirty) {
      if (!isDirty || !self._notificationIsPending) {
        didUpdate = !isDirty;
      }
      self._changeSubscriptions = [...self._subscriptions[defaultEvent]];
      self._notificationIsPending = ignoreBeforeChange = true;
      pendingValue = value;
      finish();
    },
    _limitBeforeChange(value) {
      if (!ignoreBeforeChange) {
        previousValue = value;
        self._origNotifySubscribers(value, beforeChange);
      }
    },
    _notifyNextChangeIfValueIsDifferent() {
      if (self.isDifferent(previousValue, self.peek(true))) {
        notifyNextChange = true;
      }
    },
    _recordUpdate() {
      didUpdate = true;
    }
  });
};
Object.setPrototypeOf(observable.fn, subscribable.fn);
var protoProperty = observable.protoProperty = options$1.protoProperty;
observable.fn[protoProperty] = observable;
observable.observablePrototypes = /* @__PURE__ */ new Set([observable]);
function isObservable(instance) {
  const proto = typeof instance === "function" && instance[protoProperty];
  if (proto && !observable.observablePrototypes.has(proto)) {
    throw Error("Invalid object that looks like an observable; possibly from another Knockout instance");
  }
  return !!proto;
}
function unwrap(value) {
  return isObservable(value) ? value() : value;
}
function peek$1(value) {
  return isObservable(value) ? value.peek() : value;
}
function isWriteableObservable(instance) {
  return isObservable(instance) && instance.isWriteable;
}

// @tko/observable 🥊 4.0.0-beta1.3 ESM
var arrayChangeEventName = "arrayChange";
function trackArrayChanges(target, options) {
  target.compareArrayOptions = {};
  if (options && typeof options === "object") {
    extend(target.compareArrayOptions, options);
  }
  target.compareArrayOptions.sparse = true;
  if (target.cacheDiffForKnownOperation) {
    return;
  }
  let trackingChanges = false;
  let cachedDiff = null;
  let arrayChangeSubscription;
  let pendingNotifications = 0;
  let underlyingNotifySubscribersFunction;
  let underlyingBeforeSubscriptionAddFunction = target.beforeSubscriptionAdd;
  let underlyingAfterSubscriptionRemoveFunction = target.afterSubscriptionRemove;
  target.beforeSubscriptionAdd = function(event) {
    if (underlyingBeforeSubscriptionAddFunction) {
      underlyingBeforeSubscriptionAddFunction.call(target, event);
    }
    if (event === arrayChangeEventName) {
      trackChanges();
    }
  };
  target.afterSubscriptionRemove = function(event) {
    if (underlyingAfterSubscriptionRemoveFunction) {
      underlyingAfterSubscriptionRemoveFunction.call(target, event);
    }
    if (event === arrayChangeEventName && !target.hasSubscriptionsForEvent(arrayChangeEventName)) {
      if (underlyingNotifySubscribersFunction) {
        target.notifySubscribers = underlyingNotifySubscribersFunction;
        underlyingNotifySubscribersFunction = undefined;
      }
      if (arrayChangeSubscription) {
        arrayChangeSubscription.dispose();
      }
      arrayChangeSubscription = null;
      trackingChanges = false;
    }
  };
  function trackChanges() {
    if (trackingChanges) {
      return;
    }
    trackingChanges = true;
    underlyingNotifySubscribersFunction = target["notifySubscribers"];
    target.notifySubscribers = function(valueToNotify, event) {
      if (!event || event === defaultEvent) {
        ++pendingNotifications;
      }
      return underlyingNotifySubscribersFunction.apply(this, arguments);
    };
    var previousContents = [].concat(target.peek() === undefined ? [] : target.peek());
    cachedDiff = null;
    arrayChangeSubscription = target.subscribe(function(currentContents) {
      let changes;
      currentContents = [].concat(currentContents || []);
      if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
        changes = getChanges(previousContents, currentContents);
      }
      previousContents = currentContents;
      cachedDiff = null;
      pendingNotifications = 0;
      if (changes && changes.length) {
        target.notifySubscribers(changes, arrayChangeEventName);
      }
    });
  }
  function getChanges(previousContents, currentContents) {
    if (!cachedDiff || pendingNotifications > 1) {
      cachedDiff = trackArrayChanges.compareArrays(previousContents, currentContents, target.compareArrayOptions);
    }
    return cachedDiff;
  }
  target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
    if (!trackingChanges || pendingNotifications) {
      return;
    }
    var diff = [], arrayLength = rawArray.length, argsLength = args.length, offset = 0;
    function pushDiff(status, value, index) {
      return diff[diff.length] = { "status": status, "value": value, "index": index };
    }
    switch (operationName) {
      case "push":
        offset = arrayLength;
      case "unshift":
        for (let index = 0; index < argsLength; index++) {
          pushDiff("added", args[index], offset + index);
        }
        break;
      case "pop":
        offset = arrayLength - 1;
      case "shift":
        if (arrayLength) {
          pushDiff("deleted", rawArray[offset], offset);
        }
        break;
      case "splice":
        var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength), endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength), endAddIndex = startIndex + argsLength - 2, endIndex = Math.max(endDeleteIndex, endAddIndex), additions = [], deletions = [];
        for (let index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
          if (index < endDeleteIndex) {
            deletions.push(pushDiff("deleted", rawArray[index], index));
          }
          if (index < endAddIndex) {
            additions.push(pushDiff("added", args[argsIndex], index));
          }
        }
        findMovesInArrayComparison(deletions, additions);
        break;
      default:
        return;
    }
    cachedDiff = diff;
  };
}
trackArrayChanges.compareArrays = compareArrays;
extenders.trackArrayChanges = trackArrayChanges;

// @tko/observable 🥊 4.0.0-beta1.3 ESM
function observableArray(initialValues) {
  initialValues = initialValues || [];
  if (typeof initialValues !== "object" || !("length" in initialValues)) {
    throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
  }
  var result = observable(initialValues);
  Object.setPrototypeOf(result, observableArray.fn);
  trackArrayChanges(result);
  overwriteLengthPropertyIfSupported(result, { get: () => result().length });
  return result;
}
function isObservableArray(instance) {
  return isObservable(instance) && typeof instance.remove === "function" && typeof instance.push === "function";
}
observableArray.fn = {
  remove(valueOrPredicate) {
    var underlyingArray = this.peek();
    var removedValues = [];
    var predicate = typeof valueOrPredicate === "function" && !isObservable(valueOrPredicate) ? valueOrPredicate : function(value2) {
      return value2 === valueOrPredicate;
    };
    for (var i = 0; i < underlyingArray.length; i++) {
      var value = underlyingArray[i];
      if (predicate(value)) {
        if (removedValues.length === 0) {
          this.valueWillMutate();
        }
        if (underlyingArray[i] !== value) {
          throw Error("Array modified during remove; cannot remove item");
        }
        removedValues.push(value);
        underlyingArray.splice(i, 1);
        i--;
      }
    }
    if (removedValues.length) {
      this.valueHasMutated();
    }
    return removedValues;
  },
  removeAll(arrayOfValues) {
    if (arrayOfValues === undefined) {
      var underlyingArray = this.peek();
      var allValues = underlyingArray.slice(0);
      this.valueWillMutate();
      underlyingArray.splice(0, underlyingArray.length);
      this.valueHasMutated();
      return allValues;
    }
    if (!arrayOfValues) {
      return [];
    }
    return this["remove"](function(value) {
      return arrayIndexOf(arrayOfValues, value) >= 0;
    });
  },
  destroy(valueOrPredicate) {
    var underlyingArray = this.peek();
    var predicate = typeof valueOrPredicate === "function" && !isObservable(valueOrPredicate) ? valueOrPredicate : function(value2) {
      return value2 === valueOrPredicate;
    };
    this.valueWillMutate();
    for (var i = underlyingArray.length - 1; i >= 0; i--) {
      var value = underlyingArray[i];
      if (predicate(value)) {
        value["_destroy"] = true;
      }
    }
    this.valueHasMutated();
  },
  destroyAll(arrayOfValues) {
    if (arrayOfValues === undefined) {
      return this.destroy(function() {
        return true;
      });
    }
    if (!arrayOfValues) {
      return [];
    }
    return this.destroy(function(value) {
      return arrayIndexOf(arrayOfValues, value) >= 0;
    });
  },
  indexOf(item) {
    return arrayIndexOf(this(), item);
  },
  replace(oldItem, newItem) {
    var index = this.indexOf(oldItem);
    if (index >= 0) {
      this.valueWillMutate();
      this.peek()[index] = newItem;
      this.valueHasMutated();
    }
  },
  sorted(compareFn) {
    return [...this()].sort(compareFn);
  },
  reversed() {
    return [...this()].reverse();
  },
  [Symbol.iterator]: function* () {
    yield* this();
  }
};
Object.setPrototypeOf(observableArray.fn, observable.fn);
arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(methodName) {
  observableArray.fn[methodName] = function() {
    var underlyingArray = this.peek();
    this.valueWillMutate();
    this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
    var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
    this.valueHasMutated();
    return methodCallResult === underlyingArray ? this : methodCallResult;
  };
});
arrayForEach(["slice"], function(methodName) {
  observableArray.fn[methodName] = function() {
    var underlyingArray = this();
    return underlyingArray[methodName].apply(underlyingArray, arguments);
  };
});
observableArray.trackArrayChanges = trackArrayChanges;

// @tko/observable 🥊 4.0.0-beta1.3 ESM
var maxNestedObservableDepth = 10;
function toJS(rootObject) {
  if (arguments.length == 0) {
    throw new Error("When calling ko.toJS, pass the object you want to convert.");
  }
  return mapJsObjectGraph(rootObject, function(valueToMap) {
    for (var i = 0; isObservable(valueToMap) && i < maxNestedObservableDepth; i++) {
      valueToMap = valueToMap();
    }
    return valueToMap;
  });
}
function toJSON(rootObject, replacer, space) {
  var plainJavaScriptObject = toJS(rootObject);
  return JSON.stringify(plainJavaScriptObject, replacer, space);
}
function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects = /* @__PURE__ */ new Map()) {
  rootObject = mapInputCallback(rootObject);
  var canHaveProperties = typeof rootObject === "object" && rootObject !== null && rootObject !== undefined && !(rootObject instanceof RegExp) && !(rootObject instanceof Date) && !(rootObject instanceof String) && !(rootObject instanceof Number) && !(rootObject instanceof Boolean);
  if (!canHaveProperties) {
    return rootObject;
  }
  var outputProperties = rootObject instanceof Array ? [] : {};
  visitedObjects.set(rootObject, outputProperties);
  visitPropertiesOrArrayEntries(rootObject, function(indexer) {
    var propertyValue = mapInputCallback(rootObject[indexer]);
    switch (typeof propertyValue) {
      case "boolean":
      case "number":
      case "string":
      case "function":
        outputProperties[indexer] = propertyValue;
        break;
      case "object":
      case "undefined":
        var previouslyMappedValue = visitedObjects.get(propertyValue);
        outputProperties[indexer] = previouslyMappedValue !== undefined ? previouslyMappedValue : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
        break;
    }
  });
  return outputProperties;
}
function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
  if (rootObject instanceof Array) {
    for (var i = 0; i < rootObject.length; i++) {
      visitorCallback(i);
    }
    if (typeof rootObject["toJSON"] === "function") {
      visitorCallback("toJSON");
    }
  } else {
    for (var propertyName in rootObject) {
      visitorCallback(propertyName);
    }
  }
}

// @tko/utils.parser 🥊 4.0.0-beta1.6 ESM
var __pow = Math.pow;
function LAMBDA() {
}
function unwrapOrCall(a, b) {
  while (typeof b === "function") {
    b = b();
  }
  return b;
}
const operators = {
  "@": unwrapOrCall,
  "#": (a, b) => () => unwrap(b),
  "=>": LAMBDA,
  "!": function not(a, b) {
    return !b;
  },
  "!!": function notnot(a, b) {
    return !!b;
  },
  "++": function preinc(a, b) {
    return ++b;
  },
  "--": function preinc2(a, b) {
    return --b;
  },
  "**": function exp(a, b) {
    return __pow(a, b);
  },
  "*": function mul(a, b) {
    return a * b;
  },
  "/": function div(a, b) {
    return a / b;
  },
  "%": function mod(a, b) {
    return a % b;
  },
  "+": function add(a, b) {
    return a + b;
  },
  "-": function sub(a, b) {
    return (a || 0) - (b || 0);
  },
  "&-": function neg(a, b) {
    return -1 * b;
  },
  "<": function lt(a, b) {
    return a < b;
  },
  "<=": function le(a, b) {
    return a <= b;
  },
  ">": function gt(a, b) {
    return a > b;
  },
  ">=": function ge(a, b) {
    return a >= b;
  },
  "==": function equal(a, b) {
    return a == b;
  },
  "!=": function ne(a, b) {
    return a != b;
  },
  "===": function sequal(a, b) {
    return a === b;
  },
  "!==": function sne(a, b) {
    return a !== b;
  },
  "&": function bitAnd(a, b) {
    return a & b;
  },
  "^": function xor(a, b) {
    return a ^ b;
  },
  "|": function bitOr(a, b) {
    return a | b;
  },
  "&&": function logicAnd(a, b) {
    return a && b;
  },
  "||": function logicOr(a, b) {
    return a || b;
  },
  "??": function nullishCoalesce(a, b) {
    return a != null ? a : b;
  },
  ".": function member(a, b) {
    return a == null ? undefined : a[b];
  },
  "?.": function omember(a, b) {
    return a == null ? undefined : a[b];
  },
  "[": function bmember(a, b) {
    return a == null ? undefined : a[b];
  },
  ",": function comma(a, b) {
    return b;
  },
  "call": function callOp(a, b) {
    return a.apply(null, b);
  }
};
operators["@"].precedence = 21;
operators["#"].precedence = 21;
operators["."].precedence = 19;
operators["["].precedence = 19;
operators["?."].precedence = 19;
operators["!"].precedence = 16;
operators["!!"].precedence = 16;
operators["++"].precedence = 16;
operators["--"].precedence = 16;
operators["&-"].precedence = 16;
operators["**"].precedent = 15;
operators["%"].precedence = 14;
operators["*"].precedence = 14;
operators["/"].precedence = 14;
operators["+"].precedence = 13;
operators["-"].precedence = 13;
operators["|"].precedence = 12;
operators["^"].precedence = 11;
operators["&"].precedence = 10;
operators["<"].precedence = 11;
operators["<="].precedence = 11;
operators[">"].precedence = 11;
operators[">="].precedence = 11;
operators["=="].precedence = 10;
operators["!="].precedence = 10;
operators["==="].precedence = 10;
operators["!=="].precedence = 10;
operators["&&"].precedence = 6;
operators["||"].precedence = 5;
operators["??"].precedence = 5;
operators["&&"].earlyOut = (a) => !a;
operators["||"].earlyOut = (a) => a;
operators["??"].earlyOut = (a) => a;
operators[","].precedence = 2;
operators["call"].precedence = 1;
operators["=>"].precedence = 1;

const IS_EXPR_OR_IDENT = Symbol("Node - Is Expression Or Identifier");
let Node$1 = class Node {
  constructor(lhs, op, rhs) {
    this.lhs = lhs;
    this.op = op;
    this.rhs = rhs;
  }
  static get operators() {
    return operators;
  }
  get_leaf_value(leaf, context, globals, node) {
    if (typeof leaf === "function") {
      return unwrap(leaf());
    }
    if (typeof leaf !== "object" || leaf === null) {
      return leaf;
    }
    if (leaf[Node.isExpressionOrIdentifierSymbol]) {
      return unwrap(leaf.get_value(undefined, context, globals, node));
    }
    return leaf;
  }
  get_value(notused, context, globals, node) {
    var node = this;
    if (node.op === LAMBDA) {
      return (...args) => {
        let lambdaContext = context;
        if (node.lhs) {
          lambdaContext = node.lhs.extendContext(context, args);
        }
        return node.get_leaf_value(node.rhs, lambdaContext, globals, node);
      };
    }
    const lhv = node.get_leaf_value(node.lhs, context, globals, node);
    const earlyOut = node.op.earlyOut;
    if (earlyOut && earlyOut(lhv)) {
      return lhv;
    }
    const rhv = node.get_leaf_value(node.rhs, context, globals, node);
    return node.op(lhv, rhv, context, globals);
  }
  static get isExpressionOrIdentifierSymbol() {
    return IS_EXPR_OR_IDENT;
  }
  get [IS_EXPR_OR_IDENT]() {
    return true;
  }
  static value_of(item, context, globals, node) {
    if (item && item[Node.isExpressionOrIdentifierSymbol]) {
      return item.get_value(item, context, globals, node);
    }
    return item;
  }
  static create_root(nodes, debug = false) {
    const out = [];
    const ops = [];
    for (let i = 0; i < nodes.length; i += 2) {
      out.push(nodes[i]);
      const op = nodes[i + 1];
      const prec = (op == null ? undefined : op.precedence) || 0;
      while (ops.length && prec <= ops[ops.length - 1].precedence) {
        const rhs = out.pop();
        const lhs = out.pop();
        out.push(new Node(lhs, ops.pop(), rhs));
      }
      ops.push(op);
    }
    if (out.length !== 1) {
      throw new Error(`unexpected nodes remain in shunting yard output stack: ${out}`);
    }
    return out[0];
  }
};
operators["?"] = function ternary(a, b, context, globals, node) {
  return Node$1.value_of(a ? b.yes : b.no, context, globals, node);
};
operators["?"].precedence = 4;

let Expression$1 = class Expression {
  constructor(nodes) {
    this.nodes = nodes;
    this.root = Node$1.create_root(nodes);
  }
  get_value(parent, context, globals, node) {
    if (!this.root) {
      this.root = Node$1.create_root(this.nodes);
    }
    return this.root.get_value(parent, context, globals, node);
  }
};
Expression$1.prototype[Node$1.isExpressionOrIdentifierSymbol] = true;

class Arguments {
  constructor(parser, args) {
    this.parser = parser;
    this.args = args;
  }
  get_value(parent, context, globals, node) {
    var deReffedArgs = [];
    for (var i = 0, j = this.args.length; i < j; ++i) {
      deReffedArgs.push(Node$1.value_of(this.args[i], context, globals, node));
    }
    return deReffedArgs;
  }
  get [Node$1.isExpressionOrIdentifierSymbol]() {
    return true;
  }
}

// @tko/utils.parser 🥊 4.0.0-beta1.6 ESM
var IDStart = /[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/;
var IDContinue = /[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/;

class Identifier {
  constructor(parser, token, dereferences) {
    this.token = token;
    this.dereferences = dereferences;
    this.parser = parser;
  }
  dereference(value, $context, globals, node) {
    let member;
    let refs = this.dereferences || [];
    const $data = $context.$data || {};
    let lastValue;
    let i, n;
    for (i = 0, n = refs.length; i < n; ++i) {
      member = Node$1.value_of(refs[i], $context, globals, node);
      if (typeof value === "function" && refs[i] instanceof Arguments) {
        value = value.apply(lastValue || $data, member);
        lastValue = value;
      } else if (value === null || value === undefined) {
        return value;
      } else {
        lastValue = value;
        value = Node$1.value_of(value[member], $context, globals, node);
      }
    }
    if (typeof value === "function" && n > 0 && lastValue !== value && !hasOwnProperty(lastValue, member)) {
      return value.bind(lastValue);
    }
    return value;
  }
  get_value(parent, context, globals, node) {
    const intermediate = parent && !(parent instanceof Identifier) ? Node$1.value_of(parent, context, globals, node)[this.token] : context.lookup(this.token, globals, node);
    return this.dereference(intermediate, context, globals, node);
  }
  assign(object, property, value) {
    if (isWriteableObservable(object[property])) {
      object[property](value);
    } else if (!isObservable(object[property])) {
      object[property] = value;
    }
  }
  set_value(new_value, $context, globals) {
    const $data = $context.$data || {};
    const refs = this.dereferences || [];
    let leaf = this.token;
    let i, n, root;
    if (isObjectLike($data) && leaf in $data) {
      root = $data;
    } else if (leaf in $context) {
      root = $context;
    } else if (leaf in globals) {
      root = globals;
    } else {
      throw new Error("Identifier::set_value -- The property '" + leaf + "' does not exist on the $data, $context, or globals.");
    }
    n = refs.length;
    if (n === 0) {
      this.assign(root, leaf, new_value);
      return;
    }
    root = root[leaf];
    for (i = 0; i < n - 1; ++i) {
      leaf = refs[i];
      if (leaf instanceof Arguments) {
        root = root();
      } else {
        root = root[Node$1.value_of(leaf)];
      }
    }
    if (refs[i] === true) {
      throw new Error("Cannot assign a value to a function.");
    }
    if (refs[i]) {
      this.assign(root, Node$1.value_of(refs[i]), new_value);
    }
  }
  static is_valid_start_char(ch) {
    return IDStart.test(ch);
  }
  static is_valid_continue_char(ch) {
    return IDContinue.test(ch);
  }
  get [Node$1.isExpressionOrIdentifierSymbol]() {
    return true;
  }
}

class Parameters {
  constructor(parser, node) {
    if (node instanceof Expression$1) {
      node = node.root;
    }
    try {
      this.names = Parameters.nodeTreeToNames(node);
    } catch (e) {
      parser.error(e);
    }
  }
  extendContext(context, args) {
    if (!this.names) {
      return context;
    } else {
      const newValues = {};
      this.names.forEach((name, index) => {
        newValues[name] = args[index];
      });
      return context.extend(newValues);
    }
  }
  get [Node$1.isExpressionOrIdentifierSymbol]() {
    return true;
  }
  static nodeTreeToNames(node) {
    const names = [];
    while (node) {
      if (node instanceof Identifier) {
        names.push(node.token);
        node = null;
      } else if (this.isCommaNode(node)) {
        names.push(node.rhs.token);
        node = node.lhs;
      } else {
        throw new Error(`only simple identifiers allowed in lambda parameter list but found ${JSON.stringify(node, null, 2)}`);
      }
    }
    names.reverse();
    return names;
  }
  static isCommaNode(node) {
    return node instanceof Node$1 && node.op === operators[","] && node.rhs instanceof Identifier;
  }
}

class Ternary {
  constructor(yes, no) {
    Object.assign(this, { yes, no });
  }
  get_value() {
    return this;
  }
  get [Node$1.isExpressionOrIdentifierSymbol]() {
    return true;
  }
}

const escapee = {
  "'": "'",
  '"': '"',
  "`": "`",
  "\\": "\\",
  "/": "/",
  "$": "$",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "	"
};
class Parser {
  white() {
    var ch = this.ch;
    while (ch && ch <= " ") {
      ch = this.next();
    }
    return this.comment(ch);
  }
  comment(ch) {
    if (ch !== "/") {
      return ch;
    }
    var p = this.at;
    var second = this.lookahead();
    if (second === "/") {
      while (ch) {
        ch = this.next();
        if (ch === "\n" || ch === "\r") {
          break;
        }
      }
      ch = this.next();
    } else if (second === "*") {
      while (ch) {
        ch = this.next();
        if (ch === "*" && this.lookahead() === "/") {
          this.next();
          break;
        }
      }
      if (!ch) {
        this.error("Unclosed comment, starting at character " + p);
      }
      this.next();
      return this.white();
    }
    return ch;
  }
  next(c) {
    if (c && c !== this.ch) {
      this.error("Expected '" + c + "' but got '" + this.ch + "'");
    }
    this.ch = this.text.charAt(this.at);
    this.at += 1;
    return this.ch;
  }
  lookahead() {
    return this.text[this.at];
  }
  error(m) {
    if (m instanceof Error) {
      throw m;
    }
    let [name, msg] = m.name ? [m.name, m.message] : [m, ""];
    const message = `
${name} ${msg} of
    ${this.text}
` + Array(this.at).join(" ") + "_/ \u{1F525} \\_\n";
    throw new Error(message);
  }
  name() {
    var name = "";
    var enclosedBy;
    this.white();
    var ch = this.ch;
    if (ch === "'" || ch === '"') {
      enclosedBy = ch;
      ch = this.next();
    }
    while (ch) {
      if (enclosedBy && ch === enclosedBy) {
        this.white();
        ch = this.next();
        if (ch !== ":" && ch !== ",") {
          this.error(
            "Object name: " + name + " missing closing " + enclosedBy
          );
        }
        return name;
      } else if (ch === ":" || ch <= " " || ch === "," || ch === "|") {
        return name;
      }
      name += ch;
      ch = this.next();
    }
    return name;
  }
  number() {
    let number;
    let string = "";
    let ch = this.ch;
    if (ch === "-") {
      string = "-";
      ch = this.next("-");
    }
    while (ch >= "0" && ch <= "9") {
      string += ch;
      ch = this.next();
    }
    if (ch === ".") {
      string += ".";
      ch = this.next();
      while (ch && ch >= "0" && ch <= "9") {
        string += ch;
        ch = this.next();
      }
    }
    if (ch === "e" || ch === "E") {
      string += ch;
      ch = this.next();
      if (ch === "-" || ch === "+") {
        string += ch;
        ch = this.next();
      }
      while (ch >= "0" && ch <= "9") {
        string += ch;
        ch = this.next();
      }
    }
    number = +string;
    if (!isFinite(number)) {
      options$1.onError(new Error("Bad number: " + number + " in " + string));
    } else {
      return number;
    }
  }
  objectAddValue(object, key, value) {
    if (value && value[Node$1.isExpressionOrIdentifierSymbol]) {
      Object.defineProperty(object, key, {
        get: () => Node$1.value_of(value, ...this.currentContextGlobals),
        enumerable: true
      });
    } else if (Array.isArray(value)) {
      Object.defineProperty(object, key, {
        get: () => value.map((v) => Node$1.value_of(v, ...this.currentContextGlobals)),
        enumerable: true
      });
    } else {
      object[key] = value;
    }
  }
  object() {
    let key;
    let object = {};
    let ch = this.ch;
    if (ch === "{") {
      this.next("{");
      ch = this.white();
      if (ch === "}") {
        ch = this.next("}");
        return object;
      }
      while (ch) {
        if (ch === '"' || ch === "'" || ch === "`") {
          key = this.string();
        } else {
          key = this.name();
        }
        if (hasOwnProperty(object, key)) {
          this.error('Duplicate key "' + key + '"');
        }
        if (this.white() === ":") {
          ch = this.next(":");
          this.objectAddValue(object, key, this.singleValueExpression());
        } else {
          const objectKeyIsValue = new Identifier(this, key, []);
          this.objectAddValue(object, key, objectKeyIsValue);
        }
        ch = this.white();
        if (ch === "}") {
          ch = this.next("}");
          return object;
        }
        this.next(",");
        ch = this.white();
        if (ch === "}") {
          ch = this.next("}");
          return object;
        }
      }
    }
    this.error("Bad object");
  }
  readString(delim) {
    let string = "";
    let nodes = [""];
    let plusOp = operators["+"];
    let hex;
    let i;
    let uffff;
    let interpolate = delim === "`";
    let ch = this.next();
    while (ch) {
      if (ch === delim) {
        ch = this.next();
        if (interpolate) {
          nodes.push(plusOp);
        }
        nodes.push(string);
        return nodes;
      }
      if (ch === "\\") {
        ch = this.next();
        if (ch === "u") {
          uffff = 0;
          for (i = 0; i < 4; i += 1) {
            hex = parseInt(ch = this.next(), 16);
            if (!isFinite(hex)) {
              break;
            }
            uffff = uffff * 16 + hex;
          }
          string += String.fromCharCode(uffff);
        } else if (typeof escapee[ch] === "string") {
          string += escapee[ch];
        } else {
          break;
        }
      } else if (interpolate && ch === "$") {
        ch = this.next();
        if (ch === "{") {
          this.next("{");
          nodes.push(plusOp);
          nodes.push(string);
          nodes.push(plusOp);
          nodes.push(this.expression());
          string = "";
        } else {
          string += "$" + ch;
        }
      } else {
        string += ch;
      }
      ch = this.next();
    }
    this.error("Bad string");
  }
  string() {
    var ch = this.ch;
    if (ch === '"') {
      return this.readString('"').join("");
    } else if (ch === "'") {
      return this.readString("'").join("");
    } else if (ch === "`") {
      return Node$1.create_root(this.readString("`"));
    }
    this.error("Bad string");
  }
  array() {
    let array = [];
    let ch = this.ch;
    if (ch === "[") {
      ch = this.next("[");
      this.white();
      if (ch === "]") {
        ch = this.next("]");
        return array;
      }
      while (ch) {
        array.push(this.singleValueExpression());
        ch = this.white();
        if (ch === "]") {
          ch = this.next("]");
          return array;
        }
        this.next(",");
        ch = this.white();
      }
    }
    this.error("Bad array");
  }
  value() {
    this.white();
    let ch = this.ch;
    switch (ch) {
      case "{":
        return this.object();
      case "[":
        return this.array();
      case '"':
      case "'":
      case "`":
        return this.string();
      case "-":
        return this.number();
      default:
        return ch >= "0" && ch <= "9" ? this.number() : this.identifier();
    }
  }
  operator(opts) {
    let op = "";
    let opFn;
    let ch = this.white();
    let isIdentifierChar = Identifier.is_valid_start_char;
    while (ch) {
      if (isIdentifierChar(ch) || ch <= " " || ch === "" || ch === '"' || ch === "'" || ch === "{" || ch === "(" || ch === "`" || ch === ")" || ch <= "9" && ch >= "0") {
        break;
      }
      if (!opts.not_an_array && ch === "[") {
        break;
      }
      op += ch;
      ch = this.next();
      if (ch === "@") {
        break;
      }
      isIdentifierChar = Identifier.is_valid_continue_char;
    }
    if (op !== "") {
      if (opts.prefix && op === "-") {
        op = "&-";
      }
      opFn = operators[op];
      if (!opFn) {
        this.error("Bad operator: '" + op + "'.");
      }
    }
    return opFn;
  }
  filter() {
    let ch = this.next();
    let args = [];
    let nextFilter = function(v) {
      return v;
    };
    let name = this.name();
    if (!options$1.filters[name]) {
      options$1.onError("Cannot find filter by the name of: " + name);
    }
    ch = this.white();
    while (ch) {
      if (ch === ":") {
        ch = this.next();
        args.push(this.singleValueExpression("|"));
      }
      if (ch === "|") {
        nextFilter = this.filter();
        break;
      }
      if (ch === ",") {
        break;
      }
      ch = this.white();
    }
    function filter(value, ignored, context, globals, node) {
      var argValues = [value];
      for (var i = 0, j = args.length; i < j; ++i) {
        argValues.push(Node$1.value_of(args[i], context, globals, node));
      }
      return nextFilter(options$1.filters[name].apply(context, argValues), ignored, context, globals, node);
    }
    filter.precedence = 1;
    return filter;
  }
  expression(filterable = false, allowMultipleValues = true) {
    let op;
    let nodes = [];
    let ch = this.white();
    while (ch) {
      op = this.operator({ prefix: true });
      if (op) {
        nodes.push(undefined);
        nodes.push(op);
        ch = this.white();
      }
      if (ch === "(") {
        this.next();
        nodes.push(this.expression());
        this.next(")");
      } else {
        nodes.push(this.value());
      }
      ch = this.white();
      if (ch === ":" || ch === "}" || ch === "]" || ch === ")" || ch === "" || ch === "`" || ch === "|" && filterable === "|" || ch === "," && !allowMultipleValues) {
        break;
      }
      if (ch === "|" && this.lookahead() !== "|" && filterable) {
        nodes.push(this.filter());
        nodes.push(undefined);
        break;
      }
      op = this.operator({ not_an_array: true });
      if (op === operators["?"]) {
        this.ternary(nodes);
        break;
      } else if (op === operators["."] || op === operators["?."]) {
        nodes.push(op);
        nodes.push(this.member());
        op = null;
      } else if (op === operators["["]) {
        nodes.push(op);
        nodes.push(this.expression());
        ch = this.next("]");
        op = null;
      } else if (op === operators["=>"]) {
        nodes[nodes.length - 1] = new Parameters(this, nodes[nodes.length - 1]);
        nodes.push(op);
      } else if (op) {
        nodes.push(op);
      }
      ch = this.white();
      if (ch === "]" || !op && ch === "(") {
        break;
      }
    }
    if (nodes.length === 0) {
      return undefined;
    }
    var dereferences = this.dereferences();
    if (nodes.length === 1 && !dereferences.length) {
      return nodes[0];
    }
    for (var i = 0, j = dereferences.length; i < j; ++i) {
      var deref = dereferences[i];
      if (deref.constructor === Arguments) {
        nodes.push(operators.call);
      } else {
        nodes.push(operators["."]);
      }
      nodes.push(deref);
    }
    return new Expression$1(nodes);
  }
  singleValueExpression(filterable) {
    return this.expression(filterable, false);
  }
  ternary(nodes) {
    var ternary = new Ternary();
    ternary.yes = this.singleValueExpression();
    this.next(":");
    ternary.no = this.singleValueExpression();
    nodes.push(operators["?"]);
    nodes.push(ternary);
  }
  funcArguments() {
    let args = [];
    let ch = this.next("(");
    while (ch) {
      ch = this.white();
      if (ch === ")") {
        this.next(")");
        return new Arguments(this, args);
      } else {
        args.push(this.singleValueExpression());
        ch = this.white();
      }
      if (ch !== ")") {
        this.next(",");
      }
    }
    this.error("Bad arguments to function");
  }
  member() {
    let member = "";
    let ch = this.white();
    let isIdentifierChar = Identifier.is_valid_start_char;
    while (ch) {
      if (!isIdentifierChar(ch)) {
        break;
      }
      member += ch;
      ch = this.next();
      isIdentifierChar = Identifier.is_valid_continue_char;
    }
    return member;
  }
  dereference() {
    let member;
    let ch = this.white();
    while (ch) {
      if (ch === "(") {
        return this.funcArguments();
      } else if (ch === "[") {
        this.next("[");
        member = this.expression();
        this.white();
        this.next("]");
        return member;
      } else if (ch === ".") {
        this.next(".");
        return this.member();
      } else {
        break;
      }
    }
  }
  dereferences() {
    let ch = this.white();
    let dereferences = [];
    let deref;
    while (ch) {
      deref = this.dereference();
      if (deref !== undefined) {
        dereferences.push(deref);
      } else {
        break;
      }
    }
    return dereferences;
  }
  identifier() {
    let token = "";
    let isIdentifierChar = Identifier.is_valid_start_char;
    let ch = this.white();
    while (ch) {
      if (!isIdentifierChar(ch)) {
        break;
      }
      token += ch;
      ch = this.next();
      isIdentifierChar = Identifier.is_valid_continue_char;
    }
    switch (token) {
      case "true":
        return true;
      case "false":
        return false;
      case "null":
        return null;
      case "undefined":
        return undefined;
      case "function":
        throw new Error("Knockout: Anonymous functions are no longer supported, but `=>` lambdas are. In: " + this.text);
    }
    return new Identifier(this, token, this.dereferences());
  }
  readBindings() {
    let key;
    let bindings = {};
    let sep;
    let expr;
    let ch = this.ch;
    while (ch) {
      key = this.name();
      sep = this.white();
      if (!sep || sep === ",") {
        if (sep) {
          ch = this.next(",");
        } else {
          ch = "";
        }
        bindings[key] = null;
      } else {
        if (key.indexOf(".") !== -1) {
          key = key.split(".");
          bindings[key[0]] = bindings[key[0]] || {};
          if (key.length !== 2) {
            options$1.onError("Binding " + key + " should have two parts (a.b).");
          } else if (bindings[key[0]].constructor !== Object) {
            options$1.onError("Binding " + key[0] + "." + key[1] + " paired with a non-object.");
          }
          ch = this.next(":");
          this.objectAddValue(bindings[key[0]], key[1], this.singleValueExpression(true));
        } else {
          ch = this.next(":");
          if (bindings[key] && typeof bindings[key] === "object" && bindings[key].constructor === Object) {
            expr = this.singleValueExpression(true);
            if (typeof expr !== "object" || expr.constructor !== Object) {
              options$1.onError("Expected plain object for " + key + " value.");
            } else {
              extend(bindings[key], expr);
            }
          } else {
            bindings[key] = this.singleValueExpression(true);
          }
        }
        this.white();
        if (this.ch) {
          ch = this.next(",");
        } else {
          ch = "";
        }
      }
    }
    return bindings;
  }
  valueAsAccessor(value, context, globals, node) {
    if (!value) {
      return () => value;
    }
    if (typeof value === "function") {
      return value;
    }
    if (value[Node$1.isExpressionOrIdentifierSymbol]) {
      return () => Node$1.value_of(value, context, globals, node);
    }
    if (Array.isArray(value)) {
      return () => value.map((v) => Node$1.value_of(v, context, globals, node));
    }
    if (typeof value !== "function") {
      return () => clonePlainObjectDeep(value);
    }
    throw new Error("Value has cannot be converted to accessor: " + value);
  }
  convertToAccessors(result, context, globals, node) {
    objectForEach(result, (name, value) => {
      if (value instanceof Identifier) {
        Object.defineProperty(result, name, {
          value: function(optionalValue, options2) {
            const currentValue = value.get_value(undefined, context, globals, node);
            if (arguments.length === 0) {
              return currentValue;
            }
            const unchanged = optionalValue === currentValue;
            if (options2 && options2.onlyIfChanged && unchanged) {
              return;
            }
            return value.set_value(optionalValue, context, globals);
          }
        });
      } else {
        result[name] = this.valueAsAccessor(value, context, globals, node);
      }
    });
    return result;
  }
  preparse(source = "") {
    const preparsers = options$1.bindingStringPreparsers || [];
    return preparsers.reduce((acc, fn) => fn(acc), source.trim());
  }
  runParse(source, fn) {
    this.text = this.preparse(source);
    this.at = 0;
    this.ch = " ";
    try {
      var result = fn();
      this.white();
      if (this.ch) {
        this.error("Syntax Error");
      }
      return result;
    } catch (e) {
      options$1.onError(e);
    }
  }
  parse(source, context = {}, globals = {}, node) {
    if (!source) {
      return () => null;
    }
    this.currentContextGlobals = [context, globals, node];
    const parseFn = () => this.readBindings();
    const bindingAccessors = this.runParse(source, parseFn);
    return this.convertToAccessors(bindingAccessors, context, globals, node);
  }
  parseExpression(source, context = {}, globals = {}, node) {
    if (!source) {
      return () => "";
    }
    this.currentContextGlobals = [context, globals, node];
    const parseFn = () => this.singleValueExpression(true);
    const bindingAccessors = this.runParse(source, parseFn);
    return this.valueAsAccessor(bindingAccessors, context, globals, node);
  }
}

const specials = ",\"'`{}()/:[\\]";
const bindingToken = RegExp([
  '"(?:\\\\.|[^"])*"',
  "'(?:\\\\.|[^'])*'",
  "`(?:\\\\.|[^`])*`",
  "/\\*(?:[^*]|\\*+[^*/])*\\*+/",
  "//.*\n",
  "/(?:\\\\.|[^/])+/\\w*",
  "[^\\s:,/][^" + specials + "]*[^\\s" + specials + "]",
  "[^\\s]"
].join("|"), "g");
const divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/;
const keywordRegexLookBehind = { "in": 1, "return": 1, "typeof": 1 };
function parseObjectLiteral(objectLiteralString) {
  var str = stringTrim(objectLiteralString);
  if (str.charCodeAt(0) === 123)
    str = str.slice(1, -1);
  str += "\n,";
  var result = [];
  var toks = str.match(bindingToken);
  var key;
  var values = [];
  var depth = 0;
  if (toks.length <= 1) {
    return [];
  }
  for (var i = 0, tok; tok = toks[i]; ++i) {
    var c = tok.charCodeAt(0);
    if (c === 44) {
      if (depth <= 0) {
        result.push(key && values.length ? {
          key,
          value: values.join("")
        } : {
          "unknown": key || values.join("")
        });
        key = depth = 0;
        values = [];
        continue;
      }
    } else if (c === 58) {
      if (!depth && !key && values.length === 1) {
        key = values.pop();
        continue;
      }
    } else if (c === 47 && tok.length > 1 && (tok.charCodeAt(1) === 47 || tok.charCodeAt(1) === 42)) {
      continue;
    } else if (c === 47 && i && tok.length > 1) {
      var match = toks[i - 1].match(divisionLookBehind);
      if (match && !keywordRegexLookBehind[match[0]]) {
        str = str.substr(str.indexOf(tok) + 1);
        toks = str.match(bindingToken);
        i = -1;
        tok = "/";
      }
    } else if (c === 40 || c === 123 || c === 91) {
      ++depth;
    } else if (c === 41 || c === 125 || c === 93) {
      --depth;
    } else if (!key && !values.length && (c === 34 || c === 39)) {
      tok = tok.slice(1, -1);
    }
    values.push(tok);
  }
  return result;
}

function overloadOperator(op, fn, precedence) {
  operators[op] = fn;
  if (Number.isInteger(precedence)) {
    operators[op].precedence = precedence;
  }
}

// @tko/computed 🥊 4.0.0-beta1.3 ESM
const computedState = createSymbolOrString("_state");
const DISPOSED_STATE = {
  dependencyTracking: null,
  dependenciesCount: 0,
  isDisposed: true,
  isStale: false,
  isDirty: false,
  isSleeping: false,
  disposeWhenNodeIsRemoved: null,
  readFunction: null,
  _options: null
};
function computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, options2) {
  if (typeof evaluatorFunctionOrOptions === "object") {
    options2 = evaluatorFunctionOrOptions;
  } else {
    options2 = options2 || {};
    if (evaluatorFunctionOrOptions) {
      options2.read = evaluatorFunctionOrOptions;
    }
  }
  if (typeof options2.read !== "function") {
    throw Error("Pass a function that returns the value of the computed");
  }
  var writeFunction = options2.write;
  var state = {
    latestValue: undefined,
    isStale: true,
    isDirty: true,
    isBeingEvaluated: false,
    suppressDisposalUntilDisposeWhenReturnsFalse: false,
    isDisposed: false,
    pure: false,
    isSleeping: false,
    readFunction: options2.read,
    evaluatorFunctionTarget: evaluatorFunctionTarget || options2.owner,
    disposeWhenNodeIsRemoved: options2.disposeWhenNodeIsRemoved || options2.disposeWhenNodeIsRemoved || null,
    disposeWhen: options2.disposeWhen || options2.disposeWhen,
    domNodeDisposalCallback: null,
    dependencyTracking: {},
    dependenciesCount: 0,
    evaluationTimeoutInstance: null
  };
  function computedObservable() {
    if (arguments.length > 0) {
      if (typeof writeFunction === "function") {
        writeFunction.apply(state.evaluatorFunctionTarget, arguments);
      } else {
        throw new Error("Cannot write a value to a computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
      }
      return this;
    } else {
      if (!state.isDisposed) {
        registerDependency(computedObservable);
      }
      if (state.isDirty || state.isSleeping && computedObservable.haveDependenciesChanged()) {
        computedObservable.evaluateImmediate();
      }
      return state.latestValue;
    }
  }
  computedObservable[computedState] = state;
  computedObservable.isWriteable = typeof writeFunction === "function";
  subscribable.fn.init(computedObservable);
  Object.setPrototypeOf(computedObservable, computed.fn);
  if (options2.pure) {
    state.pure = true;
    state.isSleeping = true;
    extend(computedObservable, pureComputedOverrides);
  } else if (options2.deferEvaluation) {
    extend(computedObservable, deferEvaluationOverrides);
  }
  if (options$1.deferUpdates) {
    extenders.deferred(computedObservable, true);
  }
  if (options$1.debug) {
    computedObservable._options = options2;
  }
  if (state.disposeWhenNodeIsRemoved) {
    state.suppressDisposalUntilDisposeWhenReturnsFalse = true;
    if (!state.disposeWhenNodeIsRemoved.nodeType) {
      state.disposeWhenNodeIsRemoved = null;
    }
  }
  if (!state.isSleeping && !options2.deferEvaluation) {
    computedObservable.evaluateImmediate();
  }
  if (state.disposeWhenNodeIsRemoved && computedObservable.isActive()) {
    addDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback = function() {
      computedObservable.dispose();
    });
  }
  return computedObservable;
}
function computedDisposeDependencyCallback(id, entryToDispose) {
  if (entryToDispose !== null && entryToDispose.dispose) {
    entryToDispose.dispose();
  }
}
function computedBeginDependencyDetectionCallback(subscribable2, id) {
  var computedObservable = this.computedObservable, state = computedObservable[computedState];
  if (!state.isDisposed) {
    if (this.disposalCount && this.disposalCandidates[id]) {
      computedObservable.addDependencyTracking(id, subscribable2, this.disposalCandidates[id]);
      this.disposalCandidates[id] = null;
      --this.disposalCount;
    } else if (!state.dependencyTracking[id]) {
      computedObservable.addDependencyTracking(id, subscribable2, state.isSleeping ? { _target: subscribable2 } : computedObservable.subscribeToDependency(subscribable2));
    }
    if (subscribable2._notificationIsPending) {
      subscribable2._notifyNextChangeIfValueIsDifferent();
    }
  }
}
computed.fn = {
  equalityComparer: valuesArePrimitiveAndEqual,
  getDependenciesCount() {
    return this[computedState].dependenciesCount;
  },
  getDependencies() {
    const dependencyTracking = this[computedState].dependencyTracking;
    const dependentObservables = [];
    objectForEach(dependencyTracking, function(id, dependency) {
      dependentObservables[dependency._order] = dependency._target;
    });
    return dependentObservables;
  },
  addDependencyTracking(id, target, trackingObj) {
    if (this[computedState].pure && target === this) {
      throw Error("A 'pure' computed must not be called recursively");
    }
    this[computedState].dependencyTracking[id] = trackingObj;
    trackingObj._order = this[computedState].dependenciesCount++;
    trackingObj._version = target.getVersion();
  },
  haveDependenciesChanged() {
    var id, dependency, dependencyTracking = this[computedState].dependencyTracking;
    for (id in dependencyTracking) {
      if (hasOwnProperty(dependencyTracking, id)) {
        dependency = dependencyTracking[id];
        if (this._evalDelayed && dependency._target._notificationIsPending || dependency._target.hasChanged(dependency._version)) {
          return true;
        }
      }
    }
  },
  markDirty() {
    if (this._evalDelayed && !this[computedState].isBeingEvaluated) {
      this._evalDelayed(false);
    }
  },
  isActive() {
    const state = this[computedState];
    return state.isDirty || state.dependenciesCount > 0;
  },
  respondToChange() {
    if (!this._notificationIsPending) {
      this.evaluatePossiblyAsync();
    } else if (this[computedState].isDirty) {
      this[computedState].isStale = true;
    }
  },
  subscribeToDependency(target) {
    if (target._deferUpdates) {
      var dirtySub = target.subscribe(this.markDirty, this, "dirty"), changeSub = target.subscribe(this.respondToChange, this);
      return {
        _target: target,
        dispose() {
          dirtySub.dispose();
          changeSub.dispose();
        }
      };
    } else {
      return target.subscribe(this.evaluatePossiblyAsync, this);
    }
  },
  evaluatePossiblyAsync() {
    var computedObservable = this, throttleEvaluationTimeout = computedObservable.throttleEvaluation;
    if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
      clearTimeout(this[computedState].evaluationTimeoutInstance);
      this[computedState].evaluationTimeoutInstance = safeSetTimeout(function() {
        computedObservable.evaluateImmediate(true);
      }, throttleEvaluationTimeout);
    } else if (computedObservable._evalDelayed) {
      computedObservable._evalDelayed(true);
    } else {
      computedObservable.evaluateImmediate(true);
    }
  },
  evaluateImmediate(notifyChange) {
    var computedObservable = this, state = computedObservable[computedState], disposeWhen = state.disposeWhen, changed = false;
    if (state.isBeingEvaluated) {
      return;
    }
    if (state.isDisposed) {
      return;
    }
    if (state.disposeWhenNodeIsRemoved && !domNodeIsAttachedToDocument(state.disposeWhenNodeIsRemoved) || disposeWhen && disposeWhen()) {
      if (!state.suppressDisposalUntilDisposeWhenReturnsFalse) {
        computedObservable.dispose();
        return;
      }
    } else {
      state.suppressDisposalUntilDisposeWhenReturnsFalse = false;
    }
    state.isBeingEvaluated = true;
    try {
      changed = this.evaluateImmediate_CallReadWithDependencyDetection(notifyChange);
    } finally {
      state.isBeingEvaluated = false;
    }
    return changed;
  },
  evaluateImmediate_CallReadWithDependencyDetection(notifyChange) {
    var computedObservable = this, state = computedObservable[computedState], changed = false;
    var isInitial = state.pure ? undefined : !state.dependenciesCount, dependencyDetectionContext = {
      computedObservable,
      disposalCandidates: state.dependencyTracking,
      disposalCount: state.dependenciesCount
    };
    begin({
      callbackTarget: dependencyDetectionContext,
      callback: computedBeginDependencyDetectionCallback,
      computed: computedObservable,
      isInitial
    });
    state.dependencyTracking = {};
    state.dependenciesCount = 0;
    var newValue = this.evaluateImmediate_CallReadThenEndDependencyDetection(state, dependencyDetectionContext);
    if (!state.dependenciesCount) {
      computedObservable.dispose();
      changed = true;
    } else {
      changed = computedObservable.isDifferent(state.latestValue, newValue);
    }
    if (changed) {
      if (!state.isSleeping) {
        computedObservable.notifySubscribers(state.latestValue, "beforeChange");
      } else {
        computedObservable.updateVersion();
      }
      state.latestValue = newValue;
      if (options$1.debug) {
        computedObservable._latestValue = newValue;
      }
      computedObservable.notifySubscribers(state.latestValue, "spectate");
      if (!state.isSleeping && notifyChange) {
        computedObservable.notifySubscribers(state.latestValue);
      }
      if (computedObservable._recordUpdate) {
        computedObservable._recordUpdate();
      }
    }
    if (isInitial) {
      computedObservable.notifySubscribers(state.latestValue, "awake");
    }
    return changed;
  },
  evaluateImmediate_CallReadThenEndDependencyDetection(state, dependencyDetectionContext) {
    try {
      var readFunction = state.readFunction;
      return state.evaluatorFunctionTarget ? readFunction.call(state.evaluatorFunctionTarget) : readFunction();
    } finally {
      end();
      if (dependencyDetectionContext.disposalCount && !state.isSleeping) {
        objectForEach(dependencyDetectionContext.disposalCandidates, computedDisposeDependencyCallback);
      }
      state.isStale = state.isDirty = false;
    }
  },
  peek(forceEvaluate) {
    const state = this[computedState];
    if (state.isDirty && (forceEvaluate || !state.dependenciesCount) || state.isSleeping && this.haveDependenciesChanged()) {
      this.evaluateImmediate();
    }
    return state.latestValue;
  },
  get [LATEST_VALUE]() {
    return this.peek();
  },
  limit(limitFunction) {
    const state = this[computedState];
    subscribable.fn.limit.call(this, limitFunction);
    Object.assign(this, {
      _evalIfChanged() {
        if (!this[computedState].isSleeping) {
          if (this[computedState].isStale) {
            this.evaluateImmediate();
          } else {
            this[computedState].isDirty = false;
          }
        }
        return state.latestValue;
      },
      _evalDelayed(isChange) {
        this._limitBeforeChange(state.latestValue);
        state.isDirty = true;
        if (isChange) {
          state.isStale = true;
        }
        this._limitChange(this, !isChange);
      }
    });
  },
  dispose() {
    var state = this[computedState];
    if (!state.isSleeping && state.dependencyTracking) {
      objectForEach(state.dependencyTracking, function(id, dependency) {
        if (dependency.dispose) {
          dependency.dispose();
        }
      });
    }
    if (state.disposeWhenNodeIsRemoved && state.domNodeDisposalCallback) {
      removeDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback);
    }
    Object.assign(state, DISPOSED_STATE);
  }
};
var pureComputedOverrides = {
  beforeSubscriptionAdd(event) {
    var computedObservable = this, state = computedObservable[computedState];
    if (!state.isDisposed && state.isSleeping && event === "change") {
      state.isSleeping = false;
      if (state.isStale || computedObservable.haveDependenciesChanged()) {
        state.dependencyTracking = null;
        state.dependenciesCount = 0;
        if (computedObservable.evaluateImmediate()) {
          computedObservable.updateVersion();
        }
      } else {
        var dependenciesOrder = [];
        objectForEach(state.dependencyTracking, function(id, dependency) {
          dependenciesOrder[dependency._order] = id;
        });
        arrayForEach(dependenciesOrder, function(id, order) {
          var dependency = state.dependencyTracking[id], subscription = computedObservable.subscribeToDependency(dependency._target);
          subscription._order = order;
          subscription._version = dependency._version;
          state.dependencyTracking[id] = subscription;
        });
        if (computedObservable.haveDependenciesChanged()) {
          if (computedObservable.evaluateImmediate()) {
            computedObservable.updateVersion();
          }
        }
      }
      if (!state.isDisposed) {
        computedObservable.notifySubscribers(state.latestValue, "awake");
      }
    }
  },
  afterSubscriptionRemove(event) {
    var state = this[computedState];
    if (!state.isDisposed && event === "change" && !this.hasSubscriptionsForEvent("change")) {
      objectForEach(state.dependencyTracking, function(id, dependency) {
        if (dependency.dispose) {
          state.dependencyTracking[id] = {
            _target: dependency._target,
            _order: dependency._order,
            _version: dependency._version
          };
          dependency.dispose();
        }
      });
      state.isSleeping = true;
      this.notifySubscribers(undefined, "asleep");
    }
  },
  getVersion() {
    var state = this[computedState];
    if (state.isSleeping && (state.isStale || this.haveDependenciesChanged())) {
      this.evaluateImmediate();
    }
    return subscribable.fn.getVersion.call(this);
  }
};
var deferEvaluationOverrides = {
  beforeSubscriptionAdd(event) {
    if (event === "change" || event === "beforeChange") {
      this.peek();
    }
  }
};
Object.setPrototypeOf(computed.fn, subscribable.fn);
var protoProp = observable.protoProperty;
computed.fn[protoProp] = computed;
observable.observablePrototypes.add(computed);
function isComputed(instance) {
  return typeof instance === "function" && instance[protoProp] === computed;
}
function isPureComputed(instance) {
  return isComputed(instance) && instance[computedState] && instance[computedState].pure;
}
function pureComputed(evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
  if (typeof evaluatorFunctionOrOptions === "function") {
    return computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, { "pure": true });
  } else {
    evaluatorFunctionOrOptions = extend({}, evaluatorFunctionOrOptions);
    evaluatorFunctionOrOptions.pure = true;
    return computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
  }
}

// @tko/computed 🥊 4.0.0-beta1.3 ESM
function throttleExtender(target, timeout) {
  target.throttleEvaluation = timeout;
  var writeTimeoutInstance = null;
  return computed({
    read: target,
    write: function(value) {
      clearTimeout(writeTimeoutInstance);
      writeTimeoutInstance = setTimeout(function() {
        target(value);
      }, timeout);
    }
  });
}
extenders.throttle = throttleExtender;

// @tko/computed 🥊 4.0.0-beta1.3 ESM
const PROXY_SYM = Symbol("Knockout Proxied Object");
const MIRROR_SYM = Symbol("Knockout Proxied Observables");
function makeComputed(proxy2, fn) {
  return computed({
    owner: proxy2,
    read: fn,
    write: fn,
    pure: "pure" in fn ? fn.pure : true,
    deferEvaluation: "deferEvaluation" in fn ? fn.deferEvaluation : true
  }).extend({ deferred: true });
}
function setOrCreate(mirror, prop, value, proxy2) {
  if (!mirror[prop]) {
    const ctr = Array.isArray(value) ? observableArray : typeof value === "function" ? makeComputed.bind(null, proxy2) : observable;
    mirror[prop] = ctr(value);
  } else {
    mirror[prop](value);
  }
}
function assignOrUpdate(mirror, object, proxy2) {
  for (const key of Object.keys(object)) {
    setOrCreate(mirror, key, object[key], proxy2);
  }
  return object;
}
function proxy(object) {
  const mirror = { [PROXY_SYM]: object };
  mirror[MIRROR_SYM] = mirror;
  const proxy2 = new Proxy(function() {
  }, {
    has(target, prop) {
      return prop in mirror;
    },
    get(target, prop) {
      return unwrap(mirror[prop]);
    },
    set(target, prop, value, receiver) {
      setOrCreate(mirror, prop, value, proxy2);
      object[prop] = value;
      return true;
    },
    deleteProperty(property) {
      delete mirror[property];
      return delete object[property];
    },
    apply(target, thisArg, [props]) {
      if (props) {
        assignOrUpdate(mirror, props, proxy2);
        return Object.assign(object, props);
      }
      return object;
    },
    getPrototypeOf() {
      return Object.getPrototypeOf(object);
    },
    setPrototypeOf(target, proto) {
      return Object.setPrototypeOf(object, proto);
    },
    defineProperty(target, prop, desc) {
      return Object.defineProperty(object, prop, desc);
    },
    preventExtensions() {
      return Object.preventExtensions(object);
    },
    isExtensible() {
      return Object.isExtensible(object);
    },
    ownKeys() {
      return [
        ...Object.getOwnPropertyNames(object),
        ...Object.getOwnPropertySymbols(object)
      ];
    }
  });
  assignOrUpdate(mirror, object, proxy2);
  return proxy2;
}
function getObservable(proxied, prop) {
  return proxied[MIRROR_SYM][prop];
}
function peek(proxied, prop) {
  return getObservable(proxied, prop).peek();
}
function isProxied(proxied) {
  return PROXY_SYM in proxied;
}
Object.assign(proxy, { getObservable, peek, isProxied });

// @tko/computed 🥊 4.0.0-beta1.3 ESM
function kowhen(predicate, context, resolve) {
  const observable = pureComputed(predicate, context).extend({ notify: "always" });
  const subscription = observable.subscribe((value) => {
    if (value) {
      subscription.dispose();
      resolve(value);
    }
  });
  observable.notifySubscribers(observable.peek());
  return subscription;
}
function when(predicate, callback, context) {
  const whenFn = kowhen.bind(null, predicate, context);
  return callback ? whenFn(callback.bind(context)) : new Promise(whenFn);
}

const SUBSCRIPTIONS = createSymbolOrString("LifeCycle Subscriptions List");
const ANCHOR_NODE = createSymbolOrString("LifeCycle Anchor Node");
class LifeCycle {
  static mixInto(Constructor) {
    const target = Constructor.prototype || Constructor;
    const mixin = LifeCycle.prototype;
    for (let prop of Object.getOwnPropertyNames(mixin)) {
      target[prop] = mixin[prop];
    }
  }
  subscribe(observable, action, subscriptionType) {
    if (typeof action === "string") {
      action = this[action];
    }
    this.addDisposable(observable.subscribe(action, this, subscriptionType));
  }
  computed(params) {
    if (typeof params === "string") {
      params = { read: this[params], write: this[params] };
    }
    if (typeof params === "object") {
      params = Object.assign({ owner: this }, params);
    } else if (typeof params === "function") {
      const proto = Object.getPrototypeOf(this);
      if (proto && proto[params.name] === params) {
        params = params.bind(this);
      }
      params = { read: params, write: params };
    } else {
      throw new Error("LifeCycle::computed not given a valid type.");
    }
    params.disposeWhenNodeIsRemoved = this[ANCHOR_NODE];
    return this.addDisposable(computed(params));
  }
  addEventListener(...args) {
    const node = args[0].nodeType ? args.shift() : this[ANCHOR_NODE];
    const [type, act, options] = args;
    const handler = typeof act === "string" ? this[act].bind(this) : act;
    this.__addEventListener(node, type, handler, options);
  }
  __addEventListener(node, eventType, handler, options) {
    node.addEventListener(eventType, handler, options);
    function dispose() {
      node.removeEventListener(eventType, handler);
    }
    addDisposeCallback(node, dispose);
    this.addDisposable({ dispose });
  }
  anchorTo(nodeOrLifeCycle) {
    if ("addDisposable" in nodeOrLifeCycle) {
      nodeOrLifeCycle.addDisposable(this);
      this[ANCHOR_NODE] = null;
    } else {
      this[ANCHOR_NODE] = nodeOrLifeCycle;
      addDisposeCallback(nodeOrLifeCycle, () => this[ANCHOR_NODE] === nodeOrLifeCycle && this.dispose());
    }
  }
  dispose() {
    const subscriptions = this[SUBSCRIPTIONS] || [];
    subscriptions.forEach((s) => s.dispose());
    this[SUBSCRIPTIONS] = [];
    this[ANCHOR_NODE] = null;
  }
  addDisposable(subscription) {
    const subscriptions = this[SUBSCRIPTIONS] || [];
    if (!this[SUBSCRIPTIONS]) {
      this[SUBSCRIPTIONS] = subscriptions;
    }
    if (typeof subscription.dispose !== "function") {
      throw new Error("Lifecycle::addDisposable argument missing `dispose`.");
    }
    subscriptions.push(subscription);
    return subscription;
  }
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
const contextAncestorBindingInfo = Symbol("_ancestorBindingInfo");
const boundElementDomDataKey$1 = nextKey();
const bindingEvent = {
  childrenComplete: "childrenComplete",
  descendantsComplete: "descendantsComplete",
  subscribe(node, event, callback, context) {
    const bindingInfo = getOrSet(node, boundElementDomDataKey$1, {});
    if (!bindingInfo.eventSubscribable) {
      bindingInfo.eventSubscribable = new subscribable();
    }
    return bindingInfo.eventSubscribable.subscribe(callback, context, event);
  },
  notify(node, event) {
    const bindingInfo = get(node, boundElementDomDataKey$1);
    if (bindingInfo) {
      if (bindingInfo.eventSubscribable) {
        bindingInfo.eventSubscribable.notifySubscribers(node, event);
      }
    }
  }
};

// @tko/bind 🥊 4.0.0-beta1.3 ESM
const boundElementDomDataKey = nextKey();
const contextSubscribeSymbol = Symbol("Knockout Context Subscription");
const inheritParentIndicator = Symbol("Knockout Parent Indicator");
function bindingContext(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback, settings) {
  const self = this;
  const shouldInheritData = dataItemOrAccessor === inheritParentIndicator;
  const realDataItemOrAccessor = shouldInheritData ? undefined : dataItemOrAccessor;
  const isFunc = typeof realDataItemOrAccessor === "function" && !isObservable(realDataItemOrAccessor);
  self.ko = options$1.knockoutInstance;
  let subscribable;
  function updateContext() {
    const dataItemOrObservable = isFunc ? realDataItemOrAccessor() : realDataItemOrAccessor;
    let dataItem = unwrap(dataItemOrObservable);
    if (parentContext) {
      if (parentContext[contextSubscribeSymbol]) {
        parentContext[contextSubscribeSymbol]();
      }
      extend(self, parentContext);
      if (contextAncestorBindingInfo in parentContext) {
        self[contextAncestorBindingInfo] = parentContext[contextAncestorBindingInfo];
      }
    } else {
      self.$parents = [];
      self.$root = dataItem;
    }
    self[contextSubscribeSymbol] = subscribable;
    if (shouldInheritData) {
      dataItem = self.$data;
    } else {
      self.$rawData = dataItemOrObservable;
      self.$data = dataItem;
    }
    if (dataItemAlias) {
      self[dataItemAlias] = dataItem;
    }
    if (extendCallback) {
      extendCallback(self, parentContext, dataItem);
    }
    return self.$data;
  }
  if (settings && settings.exportDependencies) {
    updateContext();
  } else {
    subscribable = pureComputed(updateContext);
    subscribable.peek();
    if (subscribable.isActive()) {
      self[contextSubscribeSymbol] = subscribable;
      subscribable["equalityComparer"] = null;
    } else {
      self[contextSubscribeSymbol] = undefined;
    }
  }
}
Object.assign(bindingContext.prototype, {
  lookup(token, globals, node) {
    switch (token) {
      case "$element":
        return node;
      case "$context":
        return this;
      case "this":
      case "$data":
        return this.$data;
    }
    const $data = this.$data;
    if (isObjectLike($data) && token in $data) {
      return $data[token];
    }
    if (token in this) {
      return this[token];
    }
    if (token in globals) {
      return globals[token];
    }
    throw new Error(`The variable "${token}" was not found on $data, $context, or globals.`);
  },
  createChildContext(dataItemOrAccessor, dataItemAlias, extendCallback, settings) {
    return new bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
      self.$parentContext = parentContext;
      self.$parent = parentContext.$data;
      self.$parents = (parentContext.$parents || []).slice(0);
      self.$parents.unshift(self.$parent);
      if (extendCallback) {
        extendCallback(self);
      }
    }, settings);
  },
  extend(properties) {
    return new bindingContext(inheritParentIndicator, this, null, function(self, parentContext) {
      extend(self, typeof properties === "function" ? properties.call(self) : properties);
    });
  },
  createStaticChildContext(dataItemOrAccessor, dataItemAlias) {
    return this.createChildContext(dataItemOrAccessor, dataItemAlias, null, { "exportDependencies": true });
  }
});
function storedBindingContextForNode(node) {
  const bindingInfo = get(node, boundElementDomDataKey);
  return bindingInfo && bindingInfo.context;
}
function contextFor(node) {
  if (node && (node.nodeType === 1 || node.nodeType === 8)) {
    return storedBindingContextForNode(node);
  }
}
function dataFor(node) {
  var context = contextFor(node);
  return context ? context.$data : undefined;
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
var __async$2 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class BindingResult {
  constructor({ asyncBindingsApplied, rootNode, bindingContext }) {
    Object.assign(this, {
      rootNode,
      bindingContext,
      isSync: asyncBindingsApplied.size === 0,
      isComplete: this.isSync
    });
    if (!this.isSync) {
      this.completionPromise = this.completeWhenBindingsFinish(asyncBindingsApplied);
    }
  }
  completeWhenBindingsFinish(asyncBindingsApplied) {
    return __async$2(this, null, function* () {
      yield Promise.all(asyncBindingsApplied);
      this.isComplete = true;
      return this;
    });
  }
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
class BindingHandler extends LifeCycle {
  constructor(params) {
    super();
    const { $element, valueAccessor, allBindings, $context } = params;
    Object.assign(this, {
      valueAccessor,
      allBindings,
      $element,
      $context,
      $data: $context.$data
    });
    this.anchorTo($element);
  }
  get value() {
    return this.valueAccessor();
  }
  set value(v) {
    const va = this.valueAccessor();
    if (isWriteableObservable(va)) {
      va(v);
    } else {
      this.valueAccessor(v);
    }
  }
  get controlsDescendants() {
    return false;
  }
  static get allowVirtualElements() {
    return false;
  }
  static get isBindingHandlerClass() {
    return true;
  }
  get bindingCompleted() {
    return true;
  }
  static registerAs(name, provider = options$1.bindingProviderInstance) {
    provider.bindingHandlers.set(name, this);
  }
}
const ResolveSymbol = Symbol("Async Binding Resolved");
class AsyncBindingHandler extends BindingHandler {
  constructor(params) {
    super(params);
    this.bindingCompletion = new Promise((resolve) => {
      this[ResolveSymbol] = resolve;
    });
    this.completeBinding = (bindingResult) => this[ResolveSymbol](bindingResult);
  }
  get bindingCompleted() {
    return this.bindingCompletion;
  }
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
const PossibleWeakMap = options$1.global.WeakMap || Map;
const legacyBindingMap = new PossibleWeakMap();
class LegacyBindingHandler extends BindingHandler {
  constructor(params) {
    super(params);
    const handler = this.handler;
    this.onError = params.onError;
    if (typeof handler.dispose === "function") {
      this.addDisposable(handler);
    }
    try {
      this.initReturn = handler.init && handler.init(...this.legacyArgs);
    } catch (e) {
      params.onError("init", e);
    }
  }
  onValueChange() {
    const handler = this.handler;
    if (typeof handler.update !== "function") {
      return;
    }
    try {
      handler.update(...this.legacyArgs);
    } catch (e) {
      this.onError("update", e);
    }
  }
  get legacyArgs() {
    return [
      this.$element,
      this.valueAccessor,
      this.allBindings,
      this.$data,
      this.$context
    ];
  }
  get controlsDescendants() {
    const objectToTest = this.initReturn || this.handler || {};
    return objectToTest.controlsDescendantBindings;
  }
  static getOrCreateFor(key, handler) {
    if (legacyBindingMap.has(handler)) {
      return legacyBindingMap.get(handler);
    }
    const newLegacyHandler = this.createFor(key, handler);
    legacyBindingMap.set(handler, newLegacyHandler);
    return newLegacyHandler;
  }
  static createFor(key, handler) {
    if (typeof handler === "function") {
      const [initFn, disposeFn] = [handler, handler.dispose];
      return class extends LegacyBindingHandler {
        get handler() {
          const init = initFn.bind(this);
          const dispose = disposeFn ? disposeFn.bind(this) : null;
          return { init, dispose };
        }
        static get after() {
          return handler.after;
        }
        static get allowVirtualElements() {
          return handler.allowVirtualElements || allowedBindings[key];
        }
      };
    }
    if (typeof handler === "object") {
      return class extends LegacyBindingHandler {
        get handler() {
          return handler;
        }
        static get after() {
          return handler.after;
        }
        static get allowVirtualElements() {
          return handler.allowVirtualElements || allowedBindings[key];
        }
      };
    }
    throw new Error("The given handler is not an appropriate type.");
  }
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
const bindingDoesNotRecurseIntoElementTypes = {
  "script": true,
  "textarea": true,
  "template": true
};
function getBindingProvider() {
  return options$1.bindingProviderInstance.instance || options$1.bindingProviderInstance;
}
function isProviderForNode(provider, node) {
  const nodeTypes = provider.FOR_NODE_TYPES || [1, 3, 8];
  return nodeTypes.includes(node.nodeType);
}
function asProperHandlerClass(handler, bindingKey) {
  if (!handler) {
    return;
  }
  return handler.isBindingHandlerClass ? handler : LegacyBindingHandler.getOrCreateFor(bindingKey, handler);
}
function getBindingHandlerFromComponent(bindingKey, $component) {
  if (!$component || typeof $component.getBindingHandler !== "function") {
    return;
  }
  return asProperHandlerClass($component.getBindingHandler(bindingKey));
}
function getBindingHandler(bindingKey) {
  const bindingDefinition = options$1.getBindingHandler(bindingKey) || getBindingProvider().bindingHandlers.get(bindingKey);
  return asProperHandlerClass(bindingDefinition, bindingKey);
}
function evaluateValueAccessor(valueAccessor) {
  return valueAccessor();
}
function applyBindingsToDescendantsInternal(bindingContext2, elementOrVirtualElement, asyncBindingsApplied) {
  let nextInQueue = firstChild(elementOrVirtualElement);
  if (!nextInQueue) {
    return;
  }
  let currentChild;
  const provider = getBindingProvider();
  const preprocessNode = provider.preprocessNode;
  if (preprocessNode) {
    while (currentChild = nextInQueue) {
      nextInQueue = nextSibling(currentChild);
      preprocessNode.call(provider, currentChild);
    }
    nextInQueue = firstChild(elementOrVirtualElement);
  }
  while (currentChild = nextInQueue) {
    nextInQueue = nextSibling(currentChild);
    applyBindingsToNodeAndDescendantsInternal(bindingContext2, currentChild, asyncBindingsApplied);
  }
  bindingEvent.notify(elementOrVirtualElement, bindingEvent.childrenComplete);
}
function hasBindings(node) {
  const provider = getBindingProvider();
  return isProviderForNode(provider, node) && provider.nodeHasBindings(node);
}
function nodeOrChildHasBindings(node) {
  return hasBindings(node) || [...node.childNodes].some((c) => nodeOrChildHasBindings(c));
}
function applyBindingsToNodeAndDescendantsInternal(bindingContext2, nodeVerified, asyncBindingsApplied) {
  var isElement = nodeVerified.nodeType === 1;
  if (isElement) {
    normaliseVirtualElementDomStructure(nodeVerified);
  }
  let shouldApplyBindings = isElement || hasBindings(nodeVerified);
  const { shouldBindDescendants } = shouldApplyBindings ? applyBindingsToNodeInternal(nodeVerified, null, bindingContext2, asyncBindingsApplied) : { shouldBindDescendants: true };
  if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[tagNameLower(nodeVerified)]) {
    applyBindingsToDescendantsInternal(bindingContext2, nodeVerified, asyncBindingsApplied);
  }
}
function* topologicalSortBindings(bindings, $component) {
  const results = [];
  const bindingsConsidered = {};
  const cyclicDependencyStack = [];
  objectForEach(bindings, function pushBinding(bindingKey) {
    if (!bindingsConsidered[bindingKey]) {
      const binding = getBindingHandlerFromComponent(bindingKey, $component) || getBindingHandler(bindingKey);
      if (!binding) {
        return;
      }
      if (binding.after) {
        cyclicDependencyStack.push(bindingKey);
        arrayForEach(binding.after, function(bindingDependencyKey) {
          if (!bindings[bindingDependencyKey]) {
            return;
          }
          if (arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
            throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
          } else {
            pushBinding(bindingDependencyKey);
          }
        });
        cyclicDependencyStack.length--;
      }
      results.push([bindingKey, binding]);
    }
    bindingsConsidered[bindingKey] = true;
  });
  for (const result of results) {
    yield result;
  }
}
function applyBindingsToNodeInternal(node, sourceBindings, bindingContext2, asyncBindingsApplied) {
  const bindingInfo = getOrSet(node, boundElementDomDataKey, {});
  const alreadyBound = bindingInfo.alreadyBound;
  if (!sourceBindings) {
    if (alreadyBound) {
      if (!nodeOrChildHasBindings(node)) {
        return false;
      }
      onBindingError({
        during: "apply",
        errorCaptured: new Error("You cannot apply bindings multiple times to the same element."),
        element: node,
        bindingContext: bindingContext2
      });
      return false;
    }
    bindingInfo.alreadyBound = true;
  }
  if (!alreadyBound) {
    bindingInfo.context = bindingContext2;
  }
  var bindings;
  if (sourceBindings && typeof sourceBindings !== "function") {
    bindings = sourceBindings;
  } else {
    const provider = getBindingProvider();
    const getBindings = provider.getBindingAccessors;
    if (isProviderForNode(provider, node)) {
      var bindingsUpdater = computed(function() {
        bindings = sourceBindings ? sourceBindings(bindingContext2, node) : getBindings.call(provider, node, bindingContext2);
        if (bindings && bindingContext2[contextSubscribeSymbol]) {
          bindingContext2[contextSubscribeSymbol]();
        }
        return bindings;
      }, null, { disposeWhenNodeIsRemoved: node });
      if (!bindings || !bindingsUpdater.isActive()) {
        bindingsUpdater = null;
      }
    }
  }
  var bindingHandlerThatControlsDescendantBindings;
  if (bindings) {
    let allBindings = function() {
      return objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
    };
    const $component = bindingContext2.$component || {};
    const allBindingHandlers = {};
    set(node, "bindingHandlers", allBindingHandlers);
    const getValueAccessor = bindingsUpdater ? (bindingKey) => function(optionalValue) {
      const valueAccessor = bindingsUpdater()[bindingKey];
      if (arguments.length === 0) {
        return evaluateValueAccessor(valueAccessor);
      } else {
        return valueAccessor(optionalValue);
      }
    } : (bindingKey) => bindings[bindingKey];
    allBindings.has = (key) => key in bindings;
    allBindings.get = (key) => bindings[key] && evaluateValueAccessor(getValueAccessor(key));
    if (bindingEvent.childrenComplete in bindings) {
      bindingEvent.subscribe(node, bindingEvent.childrenComplete, () => {
        const callback = evaluateValueAccessor(bindings[bindingEvent.childrenComplete]);
        if (!callback) {
          return;
        }
        const nodes = childNodes(node);
        if (nodes.length) {
          callback(nodes, dataFor(nodes[0]));
        }
      });
    }
    const bindingsGenerated = topologicalSortBindings(bindings, $component);
    const nodeAsyncBindingPromises = /* @__PURE__ */ new Set();
    for (const [key, BindingHandlerClass] of bindingsGenerated) {
      let reportBindingError = function(during, errorCaptured) {
        onBindingError({
          during,
          errorCaptured,
          bindings,
          allBindings,
          bindingKey: key,
          bindingContext: bindingContext2,
          element: node,
          valueAccessor: getValueAccessor(key)
        });
      };
      if (node.nodeType === 8 && !BindingHandlerClass.allowVirtualElements) {
        throw new Error(`The binding '${key}' cannot be used with virtual elements`);
      }
      try {
        const bindingHandler = ignore(() => new BindingHandlerClass({
          allBindings,
          $element: node,
          $context: bindingContext2,
          onError: reportBindingError,
          valueAccessor(...v) {
            return getValueAccessor(key)(...v);
          }
        }));
        if (bindingHandler.onValueChange) {
          ignore(() => bindingHandler.computed("onValueChange"));
        }
        allBindingHandlers[key] = bindingHandler;
        if (bindingHandler.controlsDescendants) {
          if (bindingHandlerThatControlsDescendantBindings !== void 0) {
            throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + key + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
          }
          bindingHandlerThatControlsDescendantBindings = key;
        }
        if (bindingHandler.bindingCompleted instanceof Promise) {
          asyncBindingsApplied.add(bindingHandler.bindingCompleted);
          nodeAsyncBindingPromises.add(bindingHandler.bindingCompleted);
        }
      } catch (err) {
        reportBindingError("creation", err);
      }
    }
    triggerDescendantsComplete(node, bindings, nodeAsyncBindingPromises);
  }
  const shouldBindDescendants = bindingHandlerThatControlsDescendantBindings === undefined;
  return { shouldBindDescendants };
}
function triggerDescendantsComplete(node, bindings, nodeAsyncBindingPromises) {
  const hasBindingHandler = bindingEvent.descendantsComplete in bindings;
  const hasFirstChild = firstChild(node);
  const accessor = hasBindingHandler && evaluateValueAccessor(bindings[bindingEvent.descendantsComplete]);
  const callback = () => {
    bindingEvent.notify(node, bindingEvent.descendantsComplete);
    if (accessor && hasFirstChild) {
      accessor(node);
    }
  };
  if (nodeAsyncBindingPromises.size) {
    Promise.all(nodeAsyncBindingPromises).then(callback);
  } else {
    callback();
  }
}
function getBindingContext(viewModelOrBindingContext, extendContextCallback) {
  return viewModelOrBindingContext && viewModelOrBindingContext instanceof bindingContext ? viewModelOrBindingContext : new bindingContext(viewModelOrBindingContext, undefined, undefined, extendContextCallback);
}
function applyBindingAccessorsToNode(node, bindings, viewModelOrBindingContext, asyncBindingsApplied) {
  if (node.nodeType === 1) {
    normaliseVirtualElementDomStructure(node);
  }
  return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), asyncBindingsApplied);
}
function applyBindingsToNode(node, bindings, viewModelOrBindingContext) {
  const asyncBindingsApplied = /* @__PURE__ */ new Set();
  const bindingContext2 = getBindingContext(viewModelOrBindingContext);
  const bindingAccessors = getBindingProvider().makeBindingAccessors(bindings, bindingContext2, node);
  applyBindingAccessorsToNode(node, bindingAccessors, bindingContext2, asyncBindingsApplied);
  return new BindingResult({ asyncBindingsApplied, rootNode: node, bindingContext: bindingContext2 });
}
function applyBindingsToDescendants(viewModelOrBindingContext, rootNode) {
  const asyncBindingsApplied = /* @__PURE__ */ new Set();
  if (rootNode.nodeType === 1 || rootNode.nodeType === 8) {
    const bindingContext2 = getBindingContext(viewModelOrBindingContext);
    applyBindingsToDescendantsInternal(bindingContext2, rootNode, asyncBindingsApplied);
    return new BindingResult({ asyncBindingsApplied, rootNode, bindingContext: bindingContext2 });
  }
  return new BindingResult({ asyncBindingsApplied, rootNode });
}
function applyBindings(viewModelOrBindingContext, rootNode, extendContextCallback) {
  const asyncBindingsApplied = /* @__PURE__ */ new Set();
  if (!options$1.jQuery === undefined && options$1.jQuery) {
    options$1.jQuery = options$1.jQuery;
  }
  if (!rootNode) {
    rootNode = window.document.body;
    if (!rootNode) {
      throw Error("ko.applyBindings: could not find window.document.body; has the document been loaded?");
    }
  } else if (rootNode.nodeType !== 1 && rootNode.nodeType !== 8) {
    throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
  }
  const rootContext = getBindingContext(viewModelOrBindingContext, extendContextCallback);
  applyBindingsToNodeAndDescendantsInternal(rootContext, rootNode, asyncBindingsApplied);
  return Promise.all(asyncBindingsApplied);
}
function onBindingError(spec) {
  var error;
  if (spec.bindingKey) {
    error = spec.errorCaptured;
    spec.message = 'Unable to process binding "' + spec.bindingKey + '" in binding "' + spec.bindingKey + '"\nMessage: ' + (error.message ? error.message : error);
  } else {
    error = spec.errorCaptured;
  }
  try {
    extend(error, spec);
  } catch (e) {
    spec.stack = error.stack;
    error = new Error(error.message ? error.message : error);
    extend(error, spec);
  }
  options$1.onError(error);
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
  var mappedNodes = [];
  var dependentObservable = computed(function() {
    var newMappedNodes = mapping(valueToMap, index, fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];
    if (mappedNodes.length > 0) {
      replaceDomNodes(mappedNodes, newMappedNodes);
      if (callbackAfterAddingNodes) {
        ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
      }
    }
    mappedNodes.length = 0;
    arrayPushAll(mappedNodes, newMappedNodes);
  }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() {
    return !anyDomNodeIsAttachedToDocument(mappedNodes);
  } });
  return { mappedNodes, dependentObservable: dependentObservable.isActive() ? dependentObservable : undefined };
}
var lastMappingResultDomDataKey = nextKey();
let deletedItemDummyValue = nextKey();
function setDomNodeChildrenFromArrayMapping(domNode, array, mapping, options, callbackAfterAddingNodes, editScript) {
  array = array || [];
  if (typeof array.length === "undefined") {
    array = [array];
  }
  options = options || {};
  let lastMappingResult = get(domNode, lastMappingResultDomDataKey);
  let isFirstExecution = !lastMappingResult;
  var newMappingResult = [];
  var lastMappingResultIndex = 0;
  var newMappingResultIndex = 0;
  var nodesToDelete = [];
  var itemsToProcess = [];
  var itemsForBeforeRemoveCallbacks = [];
  var itemsForMoveCallbacks = [];
  var itemsForAfterAddCallbacks = [];
  var mapData;
  let countWaitingForRemove = 0;
  function itemAdded(value) {
    mapData = { arrayEntry: value, indexObservable: observable(newMappingResultIndex++) };
    newMappingResult.push(mapData);
    itemsToProcess.push(mapData);
    if (!isFirstExecution) {
      itemsForAfterAddCallbacks.push(mapData);
    }
  }
  function itemMovedOrRetained(oldPosition) {
    mapData = lastMappingResult[oldPosition];
    if (newMappingResultIndex !== oldPosition) {
      itemsForMoveCallbacks.push(mapData);
    }
    mapData.indexObservable(newMappingResultIndex++);
    fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
    newMappingResult.push(mapData);
    itemsToProcess.push(mapData);
  }
  function callCallback(callback, items) {
    if (callback) {
      for (var i2 = 0, n = items.length; i2 < n; i2++) {
        arrayForEach(items[i2].mappedNodes, function(node2) {
          callback(node2, i2, items[i2].arrayEntry);
        });
      }
    }
  }
  if (isFirstExecution) {
    arrayForEach(array, itemAdded);
  } else {
    if (!editScript || lastMappingResult && lastMappingResult["_countWaitingForRemove"]) {
      var lastArray = isFirstExecution ? [] : arrayMap(lastMappingResult, function(x) {
        return x.arrayEntry;
      });
      var compareOptions = {
        "dontLimitMoves": options["dontLimitMoves"],
        "sparse": true
      };
      editScript = compareArrays(lastArray, array, compareOptions);
    }
    for (var i = 0, editScriptItem, movedIndex, itemIndex; editScriptItem = editScript[i]; i++) {
      movedIndex = editScriptItem["moved"];
      itemIndex = editScriptItem["index"];
      switch (editScriptItem["status"]) {
        case "deleted":
          while (lastMappingResultIndex < itemIndex) {
            itemMovedOrRetained(lastMappingResultIndex++);
          }
          if (movedIndex === undefined) {
            mapData = lastMappingResult[lastMappingResultIndex];
            if (mapData.dependentObservable) {
              mapData.dependentObservable.dispose();
              mapData.dependentObservable = undefined;
            }
            if (fixUpContinuousNodeArray(mapData.mappedNodes, domNode).length) {
              if (options["beforeRemove"]) {
                newMappingResult.push(mapData);
                itemsToProcess.push(mapData);
                countWaitingForRemove++;
                if (mapData.arrayEntry === deletedItemDummyValue) {
                  mapData = null;
                } else {
                  itemsForBeforeRemoveCallbacks.push(mapData);
                }
              }
              if (mapData) {
                nodesToDelete.push.apply(nodesToDelete, mapData.mappedNodes);
              }
            }
          }
          lastMappingResultIndex++;
          break;
        case "added":
          while (newMappingResultIndex < itemIndex) {
            itemMovedOrRetained(lastMappingResultIndex++);
          }
          if (movedIndex !== undefined) {
            itemMovedOrRetained(movedIndex);
          } else {
            itemAdded(editScriptItem["value"]);
          }
          break;
      }
    }
    while (newMappingResultIndex < array.length) {
      itemMovedOrRetained(lastMappingResultIndex++);
    }
    newMappingResult["_countWaitingForRemove"] = countWaitingForRemove;
  }
  set(domNode, lastMappingResultDomDataKey, newMappingResult);
  callCallback(options["beforeMove"], itemsForMoveCallbacks);
  arrayForEach(nodesToDelete, options["beforeRemove"] ? cleanNode : removeNode);
  i = 0;
  for (var nextNode = firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
    if (!mapData.mappedNodes) {
      extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));
    }
    for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
      if (node !== nextNode) {
        insertAfter(domNode, node, lastNode);
      }
    }
    if (!mapData.initialized && callbackAfterAddingNodes) {
      callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
      mapData.initialized = true;
    }
  }
  callCallback(options["beforeRemove"], itemsForBeforeRemoveCallbacks);
  for (i = 0; i < itemsForBeforeRemoveCallbacks.length; ++i) {
    itemsForBeforeRemoveCallbacks[i].arrayEntry = deletedItemDummyValue;
  }
  callCallback(options["afterMove"], itemsForMoveCallbacks);
  callCallback(options["afterAdd"], itemsForAfterAddCallbacks);
}

// @tko/bind 🥊 4.0.0-beta1.3 ESM
var __async$1 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class DescendantBindingHandler extends AsyncBindingHandler {
  get controlsDescendants() {
    return true;
  }
  applyBindingsToDescendants(childContext, callback) {
    return __async$1(this, null, function* () {
      const bindingResult = applyBindingsToDescendants(childContext, this.$element);
      if (bindingResult.isSync) {
        this.bindingCompletion = bindingResult;
      } else {
        yield bindingResult.completionPromise;
      }
      if (callback) {
        callback(bindingResult);
      }
      this.completeBinding(bindingResult);
    });
  }
}

// @tko/binding.template 🥊 4.0.0-beta1.3 ESM
var templateScript = 1, templateTextArea = 2, templateTemplate = 3, templateElement = 4;
function domElement(element) {
  this.domElement = element;
  if (!element) {
    return;
  }
  var tagNameLower$1 = tagNameLower(element);
  this.templateType = tagNameLower$1 === "script" ? templateScript : tagNameLower$1 === "textarea" ? templateTextArea : tagNameLower$1 == "template" && element.content && element.content.nodeType === 11 ? templateTemplate : templateElement;
}
domElement.prototype.text = function() {
  var elemContentsProperty = this.templateType === templateScript ? "text" : this.templateType === templateTextArea ? "value" : "innerHTML";
  if (arguments.length == 0) {
    return this.domElement[elemContentsProperty];
  } else {
    var valueToWrite = arguments[0];
    if (elemContentsProperty === "innerHTML") {
      setHtml(this.domElement, valueToWrite);
    } else {
      this.domElement[elemContentsProperty] = valueToWrite;
    }
  }
};
var dataDomDataPrefix = nextKey() + "_";
domElement.prototype.data = function(key) {
  if (arguments.length === 1) {
    return get(this.domElement, dataDomDataPrefix + key);
  } else {
    set(this.domElement, dataDomDataPrefix + key, arguments[1]);
  }
};
var templatesDomDataKey = nextKey();
function getTemplateDomData(element) {
  return get(element, templatesDomDataKey) || {};
}
function setTemplateDomData(element, data) {
  set(element, templatesDomDataKey, data);
}
domElement.prototype.nodes = function() {
  var element = this.domElement;
  if (arguments.length == 0) {
    const templateData = getTemplateDomData(element);
    let nodes = templateData.containerData || (this.templateType === templateTemplate ? element.content : this.templateType === templateElement ? element : undefined);
    if (!nodes || templateData.alwaysCheckText) {
      const text = this["text"]();
      if (text) {
        nodes = parseHtmlForTemplateNodes(text, element.ownerDocument);
        this["text"]("");
        setTemplateDomData(element, { containerData: nodes, alwaysCheckText: true });
      }
    }
    return nodes;
  } else {
    var valueToWrite = arguments[0];
    setTemplateDomData(element, { containerData: valueToWrite });
  }
};
function anonymousTemplate(element) {
  this.domElement = element;
}
anonymousTemplate.prototype = new domElement();
anonymousTemplate.prototype.constructor = anonymousTemplate;
anonymousTemplate.prototype.text = function() {
  if (arguments.length == 0) {
    var templateData = getTemplateDomData(this.domElement);
    if (templateData.textData === undefined && templateData.containerData) {
      templateData.textData = templateData.containerData.innerHTML;
    }
    return templateData.textData;
  } else {
    var valueToWrite = arguments[0];
    setTemplateDomData(this.domElement, { textData: valueToWrite });
  }
};

// @tko/binding.template 🥊 4.0.0-beta1.3 ESM
function templateEngine() {
}
extend(templateEngine.prototype, {
  renderTemplateSource: function(templateSource, bindingContext, options2, templateDocument) {
    options2.onError("Override renderTemplateSource");
  },
  createJavaScriptEvaluatorBlock: function(script) {
    options$1.onError("Override createJavaScriptEvaluatorBlock");
  },
  makeTemplateSource: function(template, templateDocument) {
    if (typeof template === "string") {
      templateDocument = templateDocument || document;
      var elem = templateDocument.getElementById(template);
      if (!elem) {
        options$1.onError("Cannot find template with ID " + template);
      }
      return new domElement(elem);
    } else if (template.nodeType == 1 || template.nodeType == 8) {
      return new anonymousTemplate(template);
    } else {
      options$1.onError("Unknown template type: " + template);
    }
  },
  renderTemplate: function(template, bindingContext, options2, templateDocument) {
    var templateSource = this["makeTemplateSource"](template, templateDocument);
    return this.renderTemplateSource(templateSource, bindingContext, options2, templateDocument);
  }
});

// @tko/binding.template 🥊 4.0.0-beta1.3 ESM
var _templateEngine;
const cleanContainerDomDataKey = nextKey();
function setTemplateEngine(tEngine) {
  if (tEngine !== undefined && !(tEngine instanceof templateEngine)) {
    throw new Error("templateEngine must inherit from ko.templateEngine");
  }
  _templateEngine = tEngine;
}
function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
  let node;
  let nextInQueue = firstNode;
  let firstOutOfRangeNode = nextSibling(lastNode);
  while (nextInQueue && (node = nextInQueue) !== firstOutOfRangeNode) {
    nextInQueue = nextSibling(node);
    action(node, nextInQueue);
  }
}
function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext, afterBindingCallback) {
  if (continuousNodeArray.length) {
    var firstNode = continuousNodeArray[0];
    var lastNode = continuousNodeArray[continuousNodeArray.length - 1];
    var parentNode = firstNode.parentNode;
    var provider = options$1.bindingProviderInstance;
    var preprocessNode = provider.preprocessNode;
    if (preprocessNode) {
      invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
        var nodePreviousSibling = node.previousSibling;
        var newNodes = preprocessNode.call(provider, node);
        if (newNodes) {
          if (node === firstNode) {
            firstNode = newNodes[0] || nextNodeInRange;
          }
          if (node === lastNode) {
            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
          }
        }
      });
      continuousNodeArray.length = 0;
      if (!firstNode) {
        return;
      }
      if (firstNode === lastNode) {
        continuousNodeArray.push(firstNode);
      } else {
        continuousNodeArray.push(firstNode, lastNode);
        fixUpContinuousNodeArray(continuousNodeArray, parentNode);
      }
    }
    invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
      if (node.nodeType === 1 || node.nodeType === 8) {
        applyBindings(bindingContext, node).then(afterBindingCallback);
      }
    });
    invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
      if (node.nodeType === 1 || node.nodeType === 8) {
        unmemoizeDomNodeAndDescendants(node, [bindingContext]);
      }
    });
    fixUpContinuousNodeArray(continuousNodeArray, parentNode);
  }
}
function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
  return nodeOrNodeArray.nodeType ? nodeOrNodeArray : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0] : null;
}
function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options, afterBindingCallback) {
  options = options || {};
  var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
  var templateDocument = (firstTargetNode || template || {}).ownerDocument;
  var templateEngineToUse = options.templateEngine || _templateEngine;
  var renderedNodesArray = templateEngineToUse.renderTemplate(template, bindingContext, options, templateDocument);
  if (typeof renderedNodesArray.length !== "number" || renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType !== "number") {
    throw new Error("Template engine must return an array of DOM nodes");
  }
  var haveAddedNodesToParent = false;
  switch (renderMode) {
    case "replaceChildren":
      setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
      haveAddedNodesToParent = true;
      break;
    case "replaceNode":
      replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
      haveAddedNodesToParent = true;
      break;
    case "ignoreTargetNode":
      break;
    default:
      throw new Error("Unknown renderMode: " + renderMode);
  }
  if (haveAddedNodesToParent) {
    activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext, afterBindingCallback);
    if (options.afterRender) {
      ignore(options.afterRender, null, [renderedNodesArray, bindingContext["$data"]]);
    }
    if (renderMode === "replaceChildren") {
      bindingEvent.notify(targetNodeOrNodeArray, bindingEvent.childrenComplete);
    }
  }
  return renderedNodesArray;
}
function resolveTemplateName(template, data, context) {
  if (isObservable(template)) {
    return template();
  } else if (typeof template === "function") {
    return template(data, context);
  } else {
    return template;
  }
}
function renderTemplate(template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode, afterBindingCallback) {
  options = options || {};
  if ((options.templateEngine || _templateEngine) === undefined) {
    throw new Error("Set a template engine before calling renderTemplate");
  }
  renderMode = renderMode || "replaceChildren";
  if (targetNodeOrNodeArray) {
    var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
    var whenToDispose = function() {
      return !firstTargetNode || !domNodeIsAttachedToDocument(firstTargetNode);
    };
    var activelyDisposeWhenNodeIsRemoved = firstTargetNode && renderMode === "replaceNode" ? firstTargetNode.parentNode : firstTargetNode;
    return computed(function() {
      var bindingContext$1 = dataOrBindingContext && dataOrBindingContext instanceof bindingContext ? dataOrBindingContext : new bindingContext(dataOrBindingContext, null, null, null, { "exportDependencies": true });
      var templateName = resolveTemplateName(template, bindingContext$1.$data, bindingContext$1);
      const renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext$1, options, afterBindingCallback);
      if (renderMode === "replaceNode") {
        targetNodeOrNodeArray = renderedNodesArray;
        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
      }
    }, null, { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved });
  } else {
    return memoize(function(domNode) {
      renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
    });
  }
}
function renderTemplateForEach(template, arrayOrObservableArray, options, targetNode, parentBindingContext, afterBindingCallback) {
  var arrayItemContext;
  function executeTemplateForArrayItem(arrayValue, index) {
    if (options.as) {
      if (options$1.createChildContextWithAs) {
        arrayItemContext = parentBindingContext.createChildContext(arrayValue, options.as, (context) => {
          context.$index = index;
        });
      } else {
        arrayItemContext = parentBindingContext.extend({
          [options.as]: arrayValue,
          $index: index
        });
      }
    } else {
      arrayItemContext = parentBindingContext.createChildContext(arrayValue, options.as, (context) => {
        context.$index = index;
      });
    }
    var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
    return executeTemplate(targetNode, "ignoreTargetNode", templateName, arrayItemContext, options, afterBindingCallback);
  }
  var activateBindingsCallback = function(arrayValue, addedNodesArray) {
    activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext, afterBindingCallback);
    if (options.afterRender) {
      options.afterRender(addedNodesArray, arrayValue);
    }
    arrayItemContext = null;
  };
  function localSetDomNodeChildrenFromArrayMapping(newArray, changeList) {
    ignore(setDomNodeChildrenFromArrayMapping, null, [targetNode, newArray, executeTemplateForArrayItem, options, activateBindingsCallback, changeList]);
    bindingEvent.notify(targetNode, bindingEvent.childrenComplete);
  }
  const shouldHideDestroyed = options.includeDestroyed === false || options$1.foreachHidesDestroyed && !options.includeDestroyed;
  if (!shouldHideDestroyed && !options.beforeRemove && isObservableArray(arrayOrObservableArray)) {
    localSetDomNodeChildrenFromArrayMapping(arrayOrObservableArray.peek());
    var subscription = arrayOrObservableArray.subscribe(function(changeList) {
      localSetDomNodeChildrenFromArrayMapping(arrayOrObservableArray(), changeList);
    }, null, "arrayChange");
    subscription.disposeWhenNodeIsRemoved(targetNode);
    return subscription;
  } else {
    return computed(function() {
      var unwrappedArray = unwrap(arrayOrObservableArray) || [];
      const unwrappedIsIterable = Symbol.iterator in unwrappedArray;
      if (!unwrappedIsIterable) {
        unwrappedArray = [unwrappedArray];
      }
      if (shouldHideDestroyed) {
        unwrappedArray = arrayFilter(unwrappedArray, function(item) {
          return item === undefined || item === null || !unwrap(item._destroy);
        });
      }
      localSetDomNodeChildrenFromArrayMapping(unwrappedArray);
    }, null, { disposeWhenNodeIsRemoved: targetNode });
  }
}
let templateComputedDomDataKey = nextKey();
class TemplateBindingHandler extends AsyncBindingHandler {
  constructor(params) {
    super(params);
    const element = this.$element;
    const bindingValue = unwrap(this.value);
    set(element, "conditional", {
      elseChainSatisfied: observable(true)
    });
    if (typeof bindingValue === "string" || bindingValue.name) {
      this.bindNamedTemplate();
    } else if ("nodes" in bindingValue) {
      this.bindNodeTemplate(bindingValue.nodes || []);
    } else {
      this.bindAnonymousTemplate();
    }
  }
  bindNamedTemplate() {
    emptyNode(this.$element);
  }
  bindNodeTemplate(nodes) {
    if (isObservable(nodes)) {
      throw new Error('The "nodes" option must be a plain, non-observable array.');
    }
    let container = nodes[0] && nodes[0].parentNode;
    if (!container || !get(container, cleanContainerDomDataKey)) {
      container = moveCleanedNodesToContainerElement(nodes);
      set(container, cleanContainerDomDataKey, true);
    }
    new anonymousTemplate(this.$element).nodes(container);
  }
  bindAnonymousTemplate() {
    const templateNodes = childNodes(this.$element);
    if (templateNodes.length === 0) {
      throw new Error("Anonymous template defined, but no template content was provided.");
    }
    const container = moveCleanedNodesToContainerElement(templateNodes);
    new anonymousTemplate(this.$element).nodes(container);
  }
  onValueChange() {
    const element = this.$element;
    const bindingContext = this.$context;
    var value = this.value;
    var options = unwrap(value);
    var shouldDisplay = true;
    var templateComputed = null;
    var elseChainSatisfied = get(element, "conditional").elseChainSatisfied;
    var templateName;
    if (typeof options === "string") {
      templateName = value;
      options = {};
    } else {
      templateName = options.name;
      if ("if" in options) {
        shouldDisplay = unwrap(options.if);
      }
      if (shouldDisplay && "ifnot" in options) {
        shouldDisplay = !unwrap(options.ifnot);
      }
    }
    if ("foreach" in options) {
      var dataArray = shouldDisplay && options.foreach || [];
      templateComputed = renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext, this.completeBinding);
      elseChainSatisfied((unwrap(dataArray) || []).length !== 0);
    } else if (shouldDisplay) {
      var innerBindingContext = "data" in options ? bindingContext.createStaticChildContext(options.data, options.as) : bindingContext;
      templateComputed = renderTemplate(templateName || element, innerBindingContext, options, element, undefined, this.completeBinding);
      elseChainSatisfied(true);
    } else {
      emptyNode(element);
      elseChainSatisfied(false);
    }
    this.disposeOldComputedAndStoreNewOne(element, templateComputed);
  }
  disposeOldComputedAndStoreNewOne(element, newComputed) {
    let oldComputed = get(element, templateComputedDomDataKey);
    if (oldComputed && typeof oldComputed.dispose === "function") {
      oldComputed.dispose();
    }
    set(element, templateComputedDomDataKey, newComputed && (!newComputed.isActive || newComputed.isActive()) ? newComputed : undefined);
  }
  get controlsDescendants() {
    return true;
  }
  static get allowVirtualElements() {
    return true;
  }
}

// @tko/binding.template 🥊 4.0.0-beta1.3 ESM
function nativeTemplateEngine() {
}
nativeTemplateEngine.prototype = new templateEngine();
nativeTemplateEngine.prototype.constructor = nativeTemplateEngine;
nativeTemplateEngine.prototype.renderTemplateSource = function(templateSource, bindingContext, options2, templateDocument) {
  var useNodesIfAvailable = !(ieVersion < 9), templateNodesFunc = useNodesIfAvailable ? templateSource.nodes : null, templateNodes = templateNodesFunc ? templateSource.nodes() : null;
  if (templateNodes) {
    return makeArray(templateNodes.cloneNode(true).childNodes);
  } else {
    var templateText = templateSource.text();
    return parseHtmlFragment(templateText, templateDocument);
  }
};
nativeTemplateEngine.instance = new nativeTemplateEngine();
setTemplateEngine(nativeTemplateEngine.instance);

// @tko/binding.template 🥊 4.0.0-beta1.3 ESM
class TemplateForEachBindingHandler extends TemplateBindingHandler {
  get value() {
    const modelValue = this.valueAccessor();
    const unwrappedValue = peek$1(modelValue);
    if (!unwrappedValue || typeof unwrappedValue.length === "number") {
      return { foreach: modelValue, templateEngine: nativeTemplateEngine.instance };
    }
    unwrap(modelValue);
    return {
      foreach: unwrappedValue.data,
      as: unwrappedValue.as,
      includeDestroyed: unwrappedValue.includeDestroyed,
      afterAdd: unwrappedValue.afterAdd,
      beforeRemove: unwrappedValue.beforeRemove,
      afterRender: unwrappedValue.afterRender,
      beforeMove: unwrappedValue.beforeMove,
      afterMove: unwrappedValue.afterMove,
      templateEngine: nativeTemplateEngine.instance
    };
  }
}

// @tko/binding.template 🥊 4.0.0-beta1.3 ESM
const bindings$4 = {
  foreach: TemplateForEachBindingHandler,
  template: TemplateBindingHandler
};

const domNodeDisposal = {
  addDisposeCallback,
  removeDisposeCallback,
  removeNode,
  addCleaner,
  removeCleaner,
  get cleanExternalData() {
    return options$1.cleanExternalData;
  },
  set cleanExternalData(cleanerFn) {
    options$1.set("cleanExternalData", cleanerFn);
  }
};
const utils = Object.assign({
  addOrRemoveItem,
  arrayFilter,
  arrayFirst,
  arrayForEach,
  arrayGetDistinctValues,
  arrayIndexOf,
  arrayMap,
  arrayPushAll,
  arrayRemoveItem,
  cloneNodes,
  compareArrays,
  createSymbolOrString,
  domData,
  domNodeDisposal,
  extend,
  filters: options$1.filters,
  objectForEach,
  objectMap,
  parseHtmlFragment,
  parseJson,
  parseObjectLiteral,
  peekObservable: peek$1,
  range,
  registerEventHandler,
  setDomNodeChildrenFromArrayMapping,
  setHtml,
  setTextContent,
  toggleDomNodeCssClass,
  triggerEvent,
  unwrapObservable: unwrap
});
const knockout = {
  cleanNode,
  dependencyDetection,
  computedContext: dependencyDetection,
  filters: options$1.filters,
  ignoreDependencies: ignore,
  memoization,
  options: options$1,
  removeNode,
  selectExtensions,
  tasks,
  utils,
  LifeCycle,
  isObservable,
  isSubscribable,
  isWriteableObservable,
  isWritableObservable: isWriteableObservable,
  observable,
  observableArray,
  isObservableArray,
  peek: peek$1,
  subscribable,
  unwrap,
  toJS,
  toJSON,
  proxy,
  computed,
  dependentObservable: computed,
  isComputed,
  isPureComputed,
  pureComputed,
  when,
  nativeTemplateEngine,
  renderTemplate,
  setTemplateEngine,
  templateEngine,
  templateSources: { domElement, anonymousTemplate },
  applyBindingAccessorsToNode,
  applyBindings,
  applyBindingsToDescendants,
  applyBindingsToNode,
  contextFor,
  dataFor,
  BindingHandler,
  AsyncBindingHandler,
  virtualElements,
  domNodeDisposal,
  bindingEvent
};
class Builder {
  constructor({ provider, bindings, extenders: extenders$1, filters, options: options2 }) {
    Object.assign(knockout.options, options2, {
      filters,
      bindingProviderInstance: provider
    });
    provider.setGlobals(knockout.options.bindingGlobals);
    if (Array.isArray(bindings)) {
      for (const bindingsObject of bindings) {
        provider.bindingHandlers.set(bindingsObject);
      }
    } else {
      provider.bindingHandlers.set(bindings);
    }
    this.providedProperties = {
      extenders: Object.assign(extenders, extenders$1),
      bindingHandlers: provider.bindingHandlers,
      bindingProvider: provider
    };
  }
  create(...additionalProperties) {
    const instance = Object.assign(
      {
        get getBindingHandler() {
          return options$1.getBindingHandler;
        },
        set getBindingHandler(fn) {
          options$1.set("getBindingHandler", fn);
        }
      },
      knockout,
      this.providedProperties,
      ...additionalProperties
    );
    instance.options.knockoutInstance = instance;
    return instance;
  }
}

// @tko/provider 🥊 4.0.0-beta1.3 ESM
class BindingHandlerObject {
  set(nameOrObject, value) {
    if (typeof nameOrObject === "string") {
      this[nameOrObject] = value;
    } else if (typeof nameOrObject === "object") {
      if (value !== undefined) {
        options$1.onError(new Error("Given extraneous `value` parameter (first param should be a string, but it was an object)." + nameOrObject));
      }
      Object.assign(this, nameOrObject);
    } else {
      options$1.onError(new Error("Given a bad binding handler type: " + nameOrObject));
    }
  }
  get(nameOrDotted) {
    const [name] = nameOrDotted.split(".");
    return this[name];
  }
}

// @tko/provider 🥊 4.0.0-beta1.3 ESM
class Provider {
  constructor(params = {}) {
    if (this.constructor === Provider) {
      throw new Error("Provider is an abstract base class.");
    }
    if (!("FOR_NODE_TYPES" in this)) {
      throw new Error("Providers must have FOR_NODE_TYPES property");
    }
    this.bindingHandlers = params.bindingHandlers || new BindingHandlerObject();
    this.globals = params.globals || {};
  }
  setGlobals(globals) {
    this.globals = globals;
  }
  get preemptive() {
    return false;
  }
  nodeHasBindings() {
  }
  getBindingAccessors() {
  }
  preprocessNode(node) {
  }
  postProcess() {
  }
  get instance() {
    return this._overloadInstance || this;
  }
  set instance(provider) {
    if (!provider || provider === this) {
      this._overloadInstance = undefined;
    } else {
      this._overloadInstance = new LegacyProvider(provider, this);
    }
  }
  makeAccessorsFromFunction(callback) {
    return objectMap(ignore(callback), (value, key) => () => callback()[key]);
  }
  makeValueAccessor(value) {
    return () => value;
  }
  makeBindingAccessors(bindings, context, node) {
    if (typeof bindings === "function") {
      return this.makeAccessorsFromFunction(bindings.bind(null, context, node));
    } else {
      return objectMap(bindings, this.makeValueAccessor);
    }
  }
}
class LegacyProvider extends Provider {
  get FOR_NODE_TYPES() {
    return [1, 3, 8];
  }
  constructor(providerObject, parentProvider) {
    super();
    Object.assign(this, { providerObject });
    this.bindingHandlers = providerObject.bindingHandlers || parentProvider.bindingHandlers;
  }
  getBindingsAndMakeAccessors(node, context) {
    const bindingsFn = this.providerObject.getBindings.bind(this.providerObject, node, context);
    return this.makeAccessorsFromFunction(bindingsFn);
  }
  getBindingAccessors(node, context) {
    return this.providerObject.getBindingAccessors ? this.providerObject.getBindingAccessors(node, context) : this.getBindingsAndMakeAccessors(node, context);
  }
  nodeHasBindings(node) {
    return this.providerObject.nodeHasBindings(node);
  }
  preprocessNode(node) {
    if (this.providerObject.preprocessNode) {
      return this.providerObject.preprocessNode(node);
    }
  }
}

class BindingStringProvider extends Provider {
  *processBinding(key, value) {
    const [handlerName, property] = key.split(".");
    const handler = this.bindingHandlers.get(handlerName);
    if (handler && handler.preprocess) {
      const bindingsAddedByHandler = [];
      const chainFn = (...args) => bindingsAddedByHandler.push(args);
      value = handler.preprocess(value, key, chainFn);
      for (const [key2, value2] of bindingsAddedByHandler) {
        yield* this.processBinding(key2, value2);
      }
    } else if (property) {
      value = `{${property}:${value}}`;
    }
    yield `'${handlerName}':${value}`;
  }
  *generateBindingString(bindingStringOrObjects) {
    const bindingObjectsArray = typeof bindingStringOrObjects === "string" ? parseObjectLiteral(bindingStringOrObjects) : bindingStringOrObjects;
    for (const { key, unknown, value } of bindingObjectsArray) {
      yield* this.processBinding(key || unknown, value);
    }
  }
  preProcessBindings(bindingStringOrObjects) {
    return Array.from(this.generateBindingString(bindingStringOrObjects)).join(",");
  }
  getBindingAccessors(node, context) {
    const bindingString = node && this.getBindingString(node);
    if (!bindingString) {
      return;
    }
    const processed = this.preProcessBindings(bindingString);
    return new Parser().parse(processed, context, this.globals, node);
  }
  getBindingString() {
    throw new Error("Overload getBindingString.");
  }
}

class VirtualProvider extends BindingStringProvider {
  get FOR_NODE_TYPES() {
    return [1, 8];
  }
  preprocessNode(node) {
    if (node.tagName === "KO") {
      const parent = node.parentNode;
      const childNodes = [...node.childNodes];
      const virtualBindingString = [...this.genElementBindingStrings(node)].join(",");
      const openNode = document.createComment("ko " + virtualBindingString);
      const closeNode = document.createComment("/ko");
      parent.insertBefore(openNode, node);
      for (const child of childNodes) {
        parent.insertBefore(child, node);
      }
      parent.insertBefore(closeNode, node);
      node.remove();
      return [openNode, ...childNodes, closeNode];
    }
  }
  *genElementBindingStrings(node) {
    for (const { name, value } of node.attributes) {
      yield `${name.replace(/^ko-/, "")}: ${value}`;
    }
  }
  getBindingString(node) {
    if (node.nodeType === document.COMMENT_NODE) {
      return virtualNodeBindingValue(node);
    }
  }
  nodeHasBindings(node) {
    if (node.nodeType === document.COMMENT_NODE) {
      return isStartComment(node);
    }
  }
}

class DataBindProvider extends BindingStringProvider {
  get FOR_NODE_TYPES() {
    return [1];
  }
  get BIND_ATTRIBUTE() {
    return "data-bind";
  }
  getBindingString(node) {
    if (node.nodeType === document.ELEMENT_NODE) {
      return node.getAttribute(this.BIND_ATTRIBUTE);
    }
  }
  nodeHasBindings(node) {
    if (node.nodeType === document.ELEMENT_NODE) {
      return node.hasAttribute(this.BIND_ATTRIBUTE);
    }
  }
}

// @tko/utils.component 🥊 4.0.0-beta1.3 ESM
var loadingSubscribablesCache = {}, loadedDefinitionsCache = {};
function loadComponentAndNotify(componentName, callback) {
  var _subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName), completedAsync;
  if (!_subscribable) {
    _subscribable = loadingSubscribablesCache[componentName] = new subscribable();
    _subscribable.subscribe(callback);
    beginLoadingComponent(componentName, function(definition, config) {
      var isSynchronousComponent = !!(config && config.synchronous);
      loadedDefinitionsCache[componentName] = { definition, isSynchronousComponent };
      delete loadingSubscribablesCache[componentName];
      if (completedAsync || isSynchronousComponent) {
        _subscribable.notifySubscribers(definition);
      } else {
        schedule(function() {
          _subscribable.notifySubscribers(definition);
        });
      }
    });
    completedAsync = true;
  } else {
    _subscribable.subscribe(callback);
  }
}
function beginLoadingComponent(componentName, callback) {
  getFirstResultFromLoaders("getConfig", [componentName], function(config) {
    if (config) {
      getFirstResultFromLoaders("loadComponent", [componentName, config], function(definition) {
        callback(definition, config);
      });
    } else {
      callback(null, null);
    }
  });
}
function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
  if (!candidateLoaders) {
    candidateLoaders = registry.loaders.slice(0);
  }
  var currentCandidateLoader = candidateLoaders.shift();
  if (currentCandidateLoader) {
    var methodInstance = currentCandidateLoader[methodName];
    if (methodInstance) {
      var wasAborted = false, synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
        if (wasAborted) {
          callback(null);
        } else if (result !== null) {
          callback(result);
        } else {
          getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
        }
      }));
      if (synchronousReturnValue !== undefined) {
        wasAborted = true;
        if (!currentCandidateLoader.suppressLoaderExceptions) {
          throw new Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");
        }
      }
    } else {
      getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
    }
  } else {
    callback(null);
  }
}
var registry = {
  get(componentName, callback) {
    var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
    if (cachedDefinition) {
      if (cachedDefinition.isSynchronousComponent) {
        ignore(function() {
          callback(cachedDefinition.definition);
        });
      } else {
        schedule(function() {
          callback(cachedDefinition.definition);
        });
      }
    } else {
      loadComponentAndNotify(componentName, callback);
    }
  },
  clearCachedDefinition(componentName) {
    delete loadedDefinitionsCache[componentName];
  },
  _getFirstResultFromLoaders: getFirstResultFromLoaders,
  loaders: []
};

// @tko/utils.component 🥊 4.0.0-beta1.3 ESM
var defaultConfigRegistry = {};
const VIEW_MODEL_FACTORY = Symbol("Knockout View Model ViewModel factory");
function register(componentName, config) {
  if (!config) {
    throw new Error("Invalid configuration for " + componentName);
  }
  if (isRegistered(componentName)) {
    throw new Error("Component " + componentName + " is already registered");
  }
  const ceok = componentName.includes("-") && componentName.toLowerCase() === componentName;
  if (!config.ignoreCustomElementWarning && !ceok) {
    console.log(`
\u{1F94A}  Knockout warning: components for custom elements must be lowercase and contain a dash.  To ignore this warning, add to the 'config' of .register(componentName, config):

          ignoreCustomElementWarning: true
    `);
  }
  defaultConfigRegistry[componentName] = config;
}
function isRegistered(componentName) {
  return hasOwnProperty(defaultConfigRegistry, componentName);
}
function unregister(componentName) {
  delete defaultConfigRegistry[componentName];
  registry.clearCachedDefinition(componentName);
}
var defaultLoader = {
  getConfig: function(componentName, callback) {
    var result = hasOwnProperty(defaultConfigRegistry, componentName) ? defaultConfigRegistry[componentName] : null;
    callback(result);
  },
  loadComponent: function(componentName, config, callback) {
    var errorCallback = makeErrorCallback(componentName);
    possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
      resolveConfig(componentName, errorCallback, loadedConfig, callback);
    });
  },
  loadTemplate: function(componentName, templateConfig, callback) {
    resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
  },
  loadViewModel: function(componentName, viewModelConfig, callback) {
    resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
  }
};
var createViewModelKey = "createViewModel";
function resolveConfig(componentName, errorCallback, config, callback) {
  var result = {}, makeCallBackWhenZero = 2, tryIssueCallback = function() {
    if (--makeCallBackWhenZero === 0) {
      callback(result);
    }
  }, templateConfig = config["template"], viewModelConfig = config["viewModel"];
  if (templateConfig) {
    possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
      registry._getFirstResultFromLoaders("loadTemplate", [componentName, loadedConfig], function(resolvedTemplate) {
        result["template"] = resolvedTemplate;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }
  if (viewModelConfig) {
    possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
      registry._getFirstResultFromLoaders("loadViewModel", [componentName, loadedConfig], function(resolvedViewModel) {
        result[createViewModelKey] = resolvedViewModel;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }
}
function resolveTemplate(errorCallback, templateConfig, callback) {
  if (typeof templateConfig === "string") {
    callback(parseHtmlFragment(templateConfig));
  } else if (templateConfig instanceof Array) {
    callback(templateConfig);
  } else if (isDocumentFragment(templateConfig)) {
    callback(makeArray(templateConfig.childNodes));
  } else if (templateConfig.element) {
    var element = templateConfig.element;
    if (isDomElement(element)) {
      callback(cloneNodesFromTemplateSourceElement(element));
    } else if (typeof element === "string") {
      var elemInstance = document.getElementById(element);
      if (elemInstance) {
        callback(cloneNodesFromTemplateSourceElement(elemInstance));
      } else {
        errorCallback("Cannot find element with ID " + element);
      }
    } else {
      errorCallback("Unknown element type: " + element);
    }
  } else if (templateConfig.elementName) {
    callback(templateConfig);
  } else {
    errorCallback("Unknown template value: " + templateConfig);
  }
}
function resolveViewModel(errorCallback, viewModelConfig, callback) {
  if (viewModelConfig[VIEW_MODEL_FACTORY]) {
    callback((...args) => viewModelConfig[VIEW_MODEL_FACTORY](...args));
  } else if (typeof viewModelConfig === "function") {
    callback(function(params) {
      return new viewModelConfig(params);
    });
  } else if (typeof viewModelConfig[createViewModelKey] === "function") {
    callback(viewModelConfig[createViewModelKey]);
  } else if ("instance" in viewModelConfig) {
    var fixedInstance = viewModelConfig["instance"];
    callback(function() {
      return fixedInstance;
    });
  } else if ("viewModel" in viewModelConfig) {
    resolveViewModel(errorCallback, viewModelConfig["viewModel"], callback);
  } else {
    errorCallback("Unknown viewModel value: " + viewModelConfig);
  }
}
function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (tagNameLower(elemInstance)) {
    case "script":
      return parseHtmlFragment(elemInstance.text);
    case "textarea":
      return parseHtmlFragment(elemInstance.value);
    case "template":
      if (isDocumentFragment(elemInstance.content)) {
        return cloneNodes(elemInstance.content.childNodes);
      }
  }
  return cloneNodes(elemInstance.childNodes);
}
function possiblyGetConfigFromAmd(errorCallback, config, callback) {
  if (typeof config.require === "string") {
    if (window.amdRequire || window.require) {
      (window.amdRequire || window.require)([config.require], callback);
    } else {
      errorCallback("Uses require, but no AMD loader is present");
    }
  } else {
    callback(config);
  }
}
function makeErrorCallback(componentName) {
  return function(message) {
    throw new Error("Component '" + componentName + "': " + message);
  };
}
registry.loaders.push(defaultLoader);

// @tko/utils.component 🥊 4.0.0-beta1.3 ESM
class ComponentABC extends LifeCycle {
  static get customElementName() {
    return this.name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  static get template() {
    if ("template" in this.prototype) {
      return;
    }
    return { element: this.element };
  }
  static get element() {
    throw new Error("[ComponentABC] `element` must be overloaded.");
  }
  static get sync() {
    return true;
  }
  static [VIEW_MODEL_FACTORY](params, componentInfo) {
    return new this(params, componentInfo);
  }
  static register(name = this.customElementName) {
    const viewModel = this;
    const { template } = this;
    const synchronous = this.sync;
    register(name, { viewModel, template, synchronous });
  }
}

// @tko/utils.component 🥊 4.0.0-beta1.3 ESM
var components = {
  ComponentABC,
  get: registry.get,
  clearCachedDefinition: registry.clearCachedDefinition,
  register,
  isRegistered,
  unregister,
  defaultLoader,
  _allRegisteredComponents: defaultConfigRegistry,
  get loaders() {
    return registry.loaders;
  },
  set loaders(loaders) {
    registry.loaders = loaders;
  }
};

class ComponentProvider extends Provider {
  get FOR_NODE_TYPES() {
    return [1];
  }
  preprocessNode(node) {
    if (node.tagName === "SLOT") {
      const parent = node.parentNode;
      const slotName = node.getAttribute("name") || "";
      const openNode = document.createComment(`ko slot: "${slotName}"`);
      const closeNode = document.createComment("/ko");
      parent.insertBefore(openNode, node);
      parent.insertBefore(closeNode, node);
      parent.removeChild(node);
      return [openNode, closeNode];
    }
  }
  nodeHasBindings(node) {
    return Boolean(this.getComponentNameForNode(node));
  }
  getBindingAccessors(node, context) {
    const componentName = this.getComponentNameForNode(node);
    if (!componentName) {
      return;
    }
    const component = () => ({
      name: componentName,
      params: this.getComponentParams(node, context)
    });
    return { component };
  }
  getComponentNameForNode(node) {
    if (node.nodeType !== node.ELEMENT_NODE) {
      return;
    }
    const tagName = tagNameLower(node);
    if (components.isRegistered(tagName)) {
      const hasDash = tagName.includes("-");
      const isUnknownEntity = "" + node === "[object HTMLUnknownElement]";
      if (hasDash || isUnknownEntity) {
        return tagName;
      }
    }
  }
  getComponentParams(node, context) {
    const parser = new Parser(node, context, this.globals);
    const paramsString = (node.getAttribute("params") || "").trim();
    const accessors = parser.parse(paramsString, context, node);
    if (!accessors || Object.keys(accessors).length === 0) {
      return { $raw: {} };
    }
    const $raw = objectMap(
      accessors,
      (value) => computed(value, null, { disposeWhenNodeIsRemoved: node })
    );
    const params = objectMap($raw, (v) => this.makeParamValue(node, v));
    return Object.assign({ $raw }, params);
  }
  makeParamValue(node, paramValueComputed) {
    const paramValue = paramValueComputed.peek();
    if (!paramValueComputed.isActive()) {
      return paramValue;
    }
    const isWriteable = isWriteableObservable(paramValue);
    return computed({
      read: () => unwrap(paramValueComputed()),
      write: isWriteable ? (v) => paramValueComputed()(v) : null,
      disposeWhenNodeIsRemoved: node
    });
  }
}

// @tko/provider.attr 🥊 4.0.0-beta1.3 ESM
class AttrProvider extends Provider {
  get FOR_NODE_TYPES() {
    return [1];
  }
  get PREFIX() {
    return "ko-";
  }
  getBindingAttributesList(node) {
    if (!node.hasAttributes()) {
      return [];
    }
    return Array.from(node.attributes).filter((attr) => attr.name.startsWith(this.PREFIX));
  }
  nodeHasBindings(node) {
    return this.getBindingAttributesList(node).length > 0;
  }
  getBindingAccessors(node, context) {
    return Object.assign({}, ...this.handlersFromAttributes(node, context));
  }
  *handlersFromAttributes(node, context) {
    for (const attr of this.getBindingAttributesList(node)) {
      const name = attr.name.substr(this.PREFIX.length);
      yield { [name]: () => this.getValue(attr.value, context, node) };
    }
  }
  getValue(token, $context, node) {
    if (!token) {
      return;
    }
    const $data = $context.$data;
    switch (token) {
      case "$element":
        return node;
      case "$context":
        return $context;
      case "this":
      case "$data":
        return $context.$data;
    }
    if ($data instanceof Object && token in $data) {
      return $data[token];
    }
    if (token in $context) {
      return $context[token];
    }
    if (token in this.globals) {
      return this.globals[token];
    }
    throw new Error(`The variable '${token} not found.`);
  }
}

// @tko/provider.multi 🥊 4.0.0-beta1.3 ESM
class MultiProvider extends Provider {
  get FOR_NODE_TYPES() {
    return this.nodeTypes;
  }
  constructor(params = {}) {
    super(params);
    const providers = params.providers || [];
    this.nodeTypeMap = {};
    this.nodeTypes = [];
    this.providers = [];
    providers.forEach((p) => this.addProvider(p));
  }
  setGlobals(globals) {
    [this, ...this.providers].forEach((p) => p.globals = globals);
  }
  addProvider(provider) {
    this.providers.push(provider);
    provider.bindingHandlers = this.bindingHandlers;
    provider.globals = this.globals;
    const nodeTypeMap = this.nodeTypeMap;
    for (const nodeType of provider.FOR_NODE_TYPES) {
      if (!nodeTypeMap[nodeType]) {
        nodeTypeMap[nodeType] = [];
      }
      nodeTypeMap[nodeType].push(provider);
    }
    this.nodeTypes = Object.keys(this.nodeTypeMap).map((k) => parseInt(k, 10));
  }
  providersFor(node) {
    return this.nodeTypeMap[node.nodeType] || [];
  }
  nodeHasBindings(node) {
    return this.providersFor(node).some((p) => p.nodeHasBindings(node));
  }
  preprocessNode(node) {
    for (const provider of this.providersFor(node)) {
      const newNodes = provider.preprocessNode(node);
      if (newNodes) {
        return newNodes;
      }
    }
  }
  *enumerateProviderBindings(node, ctx) {
    for (const provider of this.providersFor(node)) {
      const bindings = provider.getBindingAccessors(node, ctx);
      if (!bindings) {
        continue;
      }
      yield* Object.entries(bindings || {});
      if (provider.preemptive) {
        return;
      }
    }
  }
  getBindingAccessors(node, ctx) {
    const bindings = {};
    for (const [key, accessor] of this.enumerateProviderBindings(node, ctx)) {
      if (key in bindings) {
        throw new Error(`The binding "${key}" is duplicated by multiple providers`);
      }
      bindings[key] = accessor;
    }
    return bindings;
  }
}

const INNER_EXPRESSION = /^([\s\S]*)}}([\s\S]*?)\{\{([\s\S]*)$/;
const OUTER_EXPRESSION = /^([\s\S]*?)\{\{([\s\S]*)}}([\s\S]*)$/;
const BINDING_EXPRESSION = /^([^,"'{}()/:[\]\s]+)\s+([^\s:].*)/;
class Interpolated {
  constructor(text) {
    this.text = text;
  }
  trim(string) {
    return string === null ? "" : string.trim();
  }
}
class Expression extends Interpolated {
  asAttr(context, globals, node) {
    return new Parser().parseExpression(this.text, context, globals, node)();
  }
  *textNodeReplacement(textNode) {
    const text = this.trim(this.text);
    const ownerDocument = textNode ? textNode.ownerDocument : document;
    const firstChar = text[0];
    const lastChar = text[text.length - 1];
    var closeComment = true;
    var binding;
    if (firstChar === "#") {
      if (lastChar === "/") {
        binding = text.slice(1, -1);
      } else {
        binding = text.slice(1);
        closeComment = false;
      }
      const matches = binding.match(BINDING_EXPRESSION);
      if (matches) {
        binding = matches[1] + ":" + matches[2];
      }
    } else if (firstChar === "/") ; else if (firstChar === "{" && lastChar === "}") {
      binding = "html:" + this.trim(text.slice(1, -1));
    } else {
      binding = "text:" + this.trim(text);
    }
    if (binding) {
      yield ownerDocument.createComment("ko " + binding);
    }
    if (closeComment) {
      yield ownerDocument.createComment("/ko");
    }
  }
}
class Text extends Interpolated {
  asAttr() {
    return this.text;
  }
  *textNodeReplacement() {
    yield document.createTextNode(this.text.replace(/"/g, '\\"'));
  }
}
function* innerParse(text) {
  const innerMatch = text.match(INNER_EXPRESSION);
  if (innerMatch) {
    const [pre, inner, post] = innerMatch.slice(1);
    yield* innerParse(pre);
    yield new Text(inner);
    yield new Expression(post);
  } else {
    yield new Expression(text);
  }
}
function* parseOuterMatch(outerMatch) {
  if (!outerMatch) {
    return;
  }
  let [pre, inner, post] = outerMatch.slice(1);
  yield new Text(pre);
  yield* innerParse(inner);
  yield new Text(post);
}
function* parseInterpolation(text) {
  for (const textOrExpr of parseOuterMatch(text.match(OUTER_EXPRESSION))) {
    if (textOrExpr.text) {
      yield textOrExpr;
    }
  }
}

const DEFAULT_ATTRIBUTE_BINDING_MAP = {
  value: "value",
  checked: "checked",
  class: "css"
};
class AttributeMustacheProvider extends Provider {
  get FOR_NODE_TYPES() {
    return [1];
  }
  constructor(params = {}) {
    super(params);
    this.ATTRIBUTES_TO_SKIP = new Set(params.attributesToSkip || ["data-bind"]);
    this.ATTRIBUTES_BINDING_MAP = params.attributesBindingMap || DEFAULT_ATTRIBUTE_BINDING_MAP;
  }
  *attributesToInterpolate(attributes) {
    for (const attr of Array.from(attributes)) {
      if (this.ATTRIBUTES_TO_SKIP.has(attr.name)) {
        continue;
      }
      if (attr.specified && attr.value.includes("{{")) {
        yield attr;
      }
    }
  }
  nodeHasBindings(node) {
    return !this.attributesToInterpolate(node.attributes).next().done;
  }
  partsTogether(parts, context, node, ...valueToWrite) {
    if (parts.length > 1) {
      return parts.map((p) => unwrap(p.asAttr(context, this.globals, node))).join("");
    }
    const part = parts[0].asAttr(context, this.globals);
    if (valueToWrite.length) {
      part(valueToWrite[0]);
    }
    return part;
  }
  attributeBinding(name, parts) {
    return [name, parts];
  }
  *bindingParts(node, context) {
    for (const attr of this.attributesToInterpolate(node.attributes)) {
      const parts = Array.from(parseInterpolation(attr.value));
      if (parts.length) {
        yield this.attributeBinding(attr.name, parts);
      }
    }
  }
  getPossibleDirectBinding(attrName) {
    const bindingName = this.ATTRIBUTES_BINDING_MAP[attrName];
    return bindingName && this.bindingHandlers.get(attrName);
  }
  *bindingObjects(node, context) {
    for (const [attrName, parts] of this.bindingParts(node, context)) {
      const bindingForAttribute = this.getPossibleDirectBinding(attrName);
      const handler = bindingForAttribute ? attrName : `attr.${attrName}`;
      const accessorFn = bindingForAttribute ? (...v) => this.partsTogether(parts, context, node, ...v) : (...v) => ({ [attrName]: this.partsTogether(parts, context, node, ...v) });
      node.removeAttribute(attrName);
      yield { [handler]: accessorFn };
    }
  }
  getBindingAccessors(node, context) {
    return Object.assign({}, ...this.bindingObjects(node, context));
  }
}

class TextMustacheProvider extends Provider {
  get FOR_NODE_TYPES() {
    return [3];
  }
  *textToNodes(textNode) {
    const parent = textNode.parentNode;
    const isTextarea = parent && parent.nodeName === "TEXTAREA";
    const hasStash = textNode.nodeValue && textNode.nodeValue.includes("{{");
    if (!hasStash || isTextarea) {
      return;
    }
    for (const part of parseInterpolation(textNode.nodeValue)) {
      yield* part.textNodeReplacement(textNode);
    }
  }
  textInterpolation(textNode) {
    const newNodes = Array.from(this.textToNodes(textNode));
    if (newNodes.length === 0) {
      return;
    }
    if (textNode.parentNode) {
      const parent = textNode.parentNode;
      const n = newNodes.length;
      for (let i = 0; i < n; ++i) {
        parent.insertBefore(newNodes[i], textNode);
      }
      parent.removeChild(textNode);
    }
    return newNodes;
  }
  preprocessNode(node) {
    return this.textInterpolation(node);
  }
}

// @tko/provider.native 🥊 4.0.0-beta1.3 ESM
const NATIVE_BINDINGS = Symbol("Knockout native bindings");
class NativeProvider extends Provider {
  get FOR_NODE_TYPES() {
    return [1, 3];
  }
  get preemptive() {
    return true;
  }
  nodeHasBindings(node) {
    if (!node[NATIVE_BINDINGS]) {
      return false;
    }
    return Object.keys(node[NATIVE_BINDINGS] || {}).some((key) => key.startsWith("ko-"));
  }
  preprocessNode(node) {
    return node[NATIVE_BINDINGS] ? node : null;
  }
  onlyBindings([name]) {
    return name.startsWith("ko-");
  }
  valueAsAccessor([name, value]) {
    const bindingName = name.replace(/^ko-/, "");
    const valueFn = isObservable(value) ? value : () => value;
    return { [bindingName]: valueFn };
  }
  getBindingAccessors(node) {
    const bindings = Object.entries(node[NATIVE_BINDINGS] || {}).filter(this.onlyBindings);
    if (!bindings.length) {
      return null;
    }
    return Object.assign({}, ...bindings.map(this.valueAsAccessor));
  }
  static addValueToNode(node, name, value) {
    const obj = node[NATIVE_BINDINGS] || (node[NATIVE_BINDINGS] = {});
    obj[name] = value;
  }
  static getNodeValues(node) {
    return node[NATIVE_BINDINGS];
  }
}

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var attr = {
  update: function(element, valueAccessor, allBindings) {
    var value = unwrap(valueAccessor()) || {};
    objectForEach(value, function(attrName, attrValue) {
      attrValue = unwrap(attrValue);
      var prefixLen = attrName.indexOf(":");
      var namespace = prefixLen > 0 && element.lookupNamespaceURI(attrName.substr(0, prefixLen));
      const toRemove = attrValue === false || attrValue === null || attrValue === undefined;
      if (toRemove) {
        if (namespace) {
          element.removeAttributeNS(namespace, attrName);
        } else {
          element.removeAttribute(attrName);
        }
      } else {
        attrValue = attrValue.toString();
        if (namespace) {
          element.setAttributeNS(namespace, attrName, attrValue);
        } else {
          element.setAttribute(attrName, attrValue);
        }
      }
      if (attrName === "name") {
        setElementName(element, toRemove ? "" : attrValue);
      }
    });
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var checked = {
  after: ["value", "attr"],
  init: function(element, valueAccessor, allBindings) {
    var checkedValue2 = pureComputed(function() {
      if (allBindings.has("checkedValue")) {
        return unwrap(allBindings.get("checkedValue"));
      } else if (useElementValue) {
        if (allBindings.has("value")) {
          return unwrap(allBindings.get("value"));
        } else {
          return element.value;
        }
      }
    });
    function updateModel() {
      var isChecked = element.checked, elemValue = checkedValue2();
      if (isInitial()) {
        return;
      }
      if (!isChecked && (isRadio || getDependenciesCount())) {
        return;
      }
      var modelValue = ignore(valueAccessor);
      if (valueIsArray) {
        var writableValue = rawValueIsNonArrayObservable ? modelValue.peek() : modelValue, saveOldValue = oldElemValue;
        oldElemValue = elemValue;
        if (saveOldValue !== elemValue) {
          if (isChecked) {
            addOrRemoveItem(writableValue, elemValue, true);
            addOrRemoveItem(writableValue, saveOldValue, false);
          }
          oldElemValue = elemValue;
        } else {
          addOrRemoveItem(writableValue, elemValue, isChecked);
        }
        if (rawValueIsNonArrayObservable && isWriteableObservable(modelValue)) {
          modelValue(writableValue);
        }
      } else {
        if (isCheckbox) {
          if (elemValue === undefined) {
            elemValue = isChecked;
          } else if (!isChecked) {
            elemValue = undefined;
          }
        }
        valueAccessor(elemValue, { onlyIfChanged: true });
      }
    }
    function updateView() {
      var modelValue = modelValue = unwrap(valueAccessor());
      var elemValue = checkedValue2();
      if (valueIsArray) {
        element.checked = arrayIndexOf(modelValue, elemValue) >= 0;
        oldElemValue = elemValue;
      } else if (isCheckbox && elemValue === undefined) {
        element.checked = !!modelValue;
      } else {
        element.checked = checkedValue2() === modelValue;
      }
    }
    var isCheckbox = element.type == "checkbox", isRadio = element.type == "radio";
    if (!isCheckbox && !isRadio) {
      return;
    }
    var rawValue = valueAccessor(), valueIsArray = isCheckbox && unwrap(rawValue) instanceof Array, rawValueIsNonArrayObservable = !(valueIsArray && rawValue.push && rawValue.splice), useElementValue = isRadio || valueIsArray, oldElemValue = valueIsArray ? checkedValue2() : undefined;
    computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
    registerEventHandler(element, "click", updateModel);
    computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    rawValue = undefined;
  }
};
var checkedValue = {
  update: function(element, valueAccessor) {
    element.value = unwrap(valueAccessor());
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
function makeEventHandlerShortcut(eventName) {
  return {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var newValueAccessor = function() {
        var result = {};
        result[eventName] = valueAccessor();
        return result;
      };
      eventHandler.init.call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
    }
  };
}
function makeDescriptor(handlerOrObject) {
  return typeof handlerOrObject === "function" ? { handler: handlerOrObject } : handlerOrObject || {};
}
const eventHandler = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var eventsToHandle = valueAccessor() || {};
    objectForEach(eventsToHandle, function(eventName, descriptor) {
      const { passive, capture, once, debounce: debounce$1, throttle: throttle$1 } = makeDescriptor(descriptor);
      const eventOptions = (capture || passive || once) && { capture, passive, once };
      let eventHandlerFn = (event, ...more) => {
        var handlerReturnValue;
        const { handler, passive: passive2, bubble, preventDefault } = makeDescriptor(valueAccessor()[eventName]);
        try {
          if (handler) {
            const possiblyUpdatedViewModel = bindingContext.$data;
            const argsForHandler = [possiblyUpdatedViewModel, event, ...more];
            handlerReturnValue = handler.apply(possiblyUpdatedViewModel, argsForHandler);
          }
        } finally {
          if (preventDefault !== undefined) {
            if (unwrap(preventDefault)) {
              event.preventDefault();
            }
          } else if (handlerReturnValue !== true) {
            if (!passive2) {
              event.preventDefault();
            }
          }
        }
        const bubbleMark = allBindings.get(eventName + "Bubble") !== false;
        if (bubble === false || !bubbleMark) {
          event.cancelBubble = true;
          if (event.stopPropagation) {
            event.stopPropagation();
          }
        }
      };
      if (debounce$1) {
        eventHandlerFn = debounce(eventHandlerFn, debounce$1);
      }
      if (throttle$1) {
        eventHandlerFn = throttle(eventHandlerFn, throttle$1);
      }
      registerEventHandler(element, eventName, eventHandlerFn, eventOptions || false);
    });
  }
};
const onHandler = {
  init: eventHandler.init,
  preprocess: function(value, key, addBinding) {
    addBinding(key.replace("on.", ""), "=>" + value);
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var click = makeEventHandlerShortcut("click");

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var css = {
  aliases: ["class"],
  update: function(element, valueAccessor) {
    var value = unwrap(valueAccessor());
    if (value !== null && typeof value === "object") {
      objectForEach(value, function(className, shouldHaveClass) {
        shouldHaveClass = unwrap(shouldHaveClass);
        toggleDomNodeCssClass(element, className, shouldHaveClass);
      });
    } else {
      value = stringTrim(String(value || ""));
      toggleDomNodeCssClass(element, element[css.classesWrittenByBindingKey], false);
      element[css.classesWrittenByBindingKey] = value;
      toggleDomNodeCssClass(element, value, true);
    }
  },
  classesWrittenByBindingKey: createSymbolOrString("__ko__cssValue")
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
class DescendantsCompleteHandler extends BindingHandler {
  onDescendantsComplete() {
    if (typeof this.value === "function") {
      this.value(this.$element);
    }
  }
  static get allowVirtualElements() {
    return true;
  }
}

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var enable = {
  update: function(element, valueAccessor) {
    var value = unwrap(valueAccessor());
    if (value && element.disabled) {
      element.removeAttribute("disabled");
    } else if (!value && !element.disabled) {
      element.disabled = true;
    }
  }
};
var disable = {
  update: function(element, valueAccessor) {
    enable.update(element, function() {
      return !unwrap(valueAccessor());
    });
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var hasfocusUpdatingProperty = createSymbolOrString("__ko_hasfocusUpdating");
var hasfocusLastValue = createSymbolOrString("__ko_hasfocusLastValue");
var hasfocus = {
  init: function(element, valueAccessor) {
    var handleElementFocusChange = function(isFocused) {
      element[hasfocusUpdatingProperty] = true;
      var ownerDoc = element.ownerDocument;
      if ("activeElement" in ownerDoc) {
        var active;
        try {
          active = ownerDoc.activeElement;
        } catch (e) {
          active = ownerDoc.body;
        }
        isFocused = active === element;
      }
      valueAccessor(isFocused, { onlyIfChanged: true });
      element[hasfocusLastValue] = isFocused;
      element[hasfocusUpdatingProperty] = false;
    };
    var handleElementFocusIn = handleElementFocusChange.bind(null, true);
    var handleElementFocusOut = handleElementFocusChange.bind(null, false);
    registerEventHandler(element, "focus", handleElementFocusIn);
    registerEventHandler(element, "focusin", handleElementFocusIn);
    registerEventHandler(element, "blur", handleElementFocusOut);
    registerEventHandler(element, "focusout", handleElementFocusOut);
  },
  update: function(element, valueAccessor) {
    var value = !!unwrap(valueAccessor());
    if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
      value ? element.focus() : element.blur();
      if (!value && element[hasfocusLastValue]) {
        element.ownerDocument.body.focus();
      }
      ignore(triggerEvent, null, [element, value ? "focusin" : "focusout"]);
    }
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var html = {
  init: function() {
    return {
      "controlsDescendantBindings": true
    };
  },
  update: function(element, valueAccessor) {
    setHtml(element, valueAccessor());
  },
  allowVirtualElements: true
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var $let = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var innerContext = bindingContext["extend"](valueAccessor);
    applyBindingsToDescendants(innerContext, element);
    return { "controlsDescendantBindings": true };
  },
  allowVirtualElements: true
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var captionPlaceholder = {};
var options = {
  init: function(element) {
    if (tagNameLower(element) !== "select") {
      throw new Error("options binding applies only to SELECT elements");
    }
    while (element.length > 0) {
      element.remove(0);
    }
    return { "controlsDescendantBindings": true };
  },
  update: function(element, valueAccessor, allBindings) {
    function selectedOptions() {
      return arrayFilter(element.options, function(node) {
        return node.selected;
      });
    }
    var selectWasPreviouslyEmpty = element.length == 0, multiple = element.multiple, previousScrollTop = !selectWasPreviouslyEmpty && multiple ? element.scrollTop : null, unwrappedArray = unwrap(valueAccessor()), valueAllowUnset = allBindings.get("valueAllowUnset") && allBindings["has"]("value"), includeDestroyed = allBindings.get("optionsIncludeDestroyed"), arrayToDomNodeChildrenOptions = {}, captionValue, filteredArray, previousSelectedValues = [];
    if (!valueAllowUnset) {
      if (multiple) {
        previousSelectedValues = arrayMap(selectedOptions(), selectExtensions.readValue);
      } else if (element.selectedIndex >= 0) {
        previousSelectedValues.push(selectExtensions.readValue(element.options[element.selectedIndex]));
      }
    }
    if (unwrappedArray) {
      if (typeof unwrappedArray.length === "undefined") {
        unwrappedArray = [unwrappedArray];
      }
      filteredArray = arrayFilter(unwrappedArray, function(item) {
        return includeDestroyed || item === undefined || item === null || !unwrap(item["_destroy"]);
      });
      if (allBindings["has"]("optionsCaption")) {
        captionValue = unwrap(allBindings.get("optionsCaption"));
        if (captionValue !== null && captionValue !== undefined) {
          filteredArray.unshift(captionPlaceholder);
        }
      }
    }
    function applyToObject(object, predicate, defaultValue) {
      var predicateType = typeof predicate;
      if (predicateType === "function") {
        return predicate(object);
      } else if (predicateType == "string") {
        return object[predicate];
      } else {
        return defaultValue;
      }
    }
    var itemUpdate = false;
    function optionForArrayItem(arrayEntry, index, oldOptions) {
      if (oldOptions.length) {
        previousSelectedValues = !valueAllowUnset && oldOptions[0].selected ? [selectExtensions.readValue(oldOptions[0])] : [];
        itemUpdate = true;
      }
      var option = element.ownerDocument.createElement("option");
      if (arrayEntry === captionPlaceholder) {
        setTextContent(option, allBindings.get("optionsCaption"));
        selectExtensions.writeValue(option, undefined);
      } else {
        var optionValue = applyToObject(arrayEntry, allBindings.get("optionsValue"), arrayEntry);
        selectExtensions.writeValue(option, unwrap(optionValue));
        var optionText = applyToObject(arrayEntry, allBindings.get("optionsText"), optionValue);
        setTextContent(option, optionText);
      }
      return [option];
    }
    arrayToDomNodeChildrenOptions["beforeRemove"] = function(option) {
      element.removeChild(option);
    };
    function setSelectionCallback(arrayEntry, newOptions) {
      if (itemUpdate && valueAllowUnset) {
        selectExtensions.writeValue(element, unwrap(allBindings.get("value")), true);
      } else if (previousSelectedValues.length) {
        var isSelected = arrayIndexOf(previousSelectedValues, selectExtensions.readValue(newOptions[0])) >= 0;
        setOptionNodeSelectionState(newOptions[0], isSelected);
        if (itemUpdate && !isSelected) {
          ignore(triggerEvent, null, [element, "change"]);
        }
      }
    }
    var callback = setSelectionCallback;
    if (allBindings["has"]("optionsAfterRender") && typeof allBindings.get("optionsAfterRender") === "function") {
      callback = function(arrayEntry, newOptions) {
        setSelectionCallback(arrayEntry, newOptions);
        ignore(allBindings.get("optionsAfterRender"), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
      };
    }
    setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);
    ignore(function() {
      if (valueAllowUnset) {
        selectExtensions.writeValue(element, unwrap(allBindings.get("value")), true);
      } else {
        var selectionChanged;
        if (multiple) {
          selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
        } else {
          selectionChanged = previousSelectedValues.length && element.selectedIndex >= 0 ? selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0] : previousSelectedValues.length || element.selectedIndex >= 0;
        }
        if (selectionChanged) {
          triggerEvent(element, "change");
        }
      }
    });
    ensureSelectElementIsRenderedCorrectly(element);
    if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20) {
      element.scrollTop = previousScrollTop;
    }
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var selectedOptions = {
  after: ["options", "foreach"],
  init: function(element, valueAccessor, allBindings) {
    registerEventHandler(element, "change", function() {
      valueAccessor(); var valueToWrite = [];
      arrayForEach(element.getElementsByTagName("option"), function(node) {
        if (node.selected) {
          valueToWrite.push(selectExtensions.readValue(node));
        }
      });
      valueAccessor(valueToWrite);
    });
  },
  update: function(element, valueAccessor) {
    if (tagNameLower(element) != "select") {
      throw new Error("values binding applies only to SELECT elements");
    }
    var newValue = unwrap(valueAccessor()), previousScrollTop = element.scrollTop;
    if (newValue && typeof newValue.length === "number") {
      arrayForEach(element.getElementsByTagName("option"), function(node) {
        var isSelected = arrayIndexOf(newValue, selectExtensions.readValue(node)) >= 0;
        if (node.selected != isSelected) {
          setOptionNodeSelectionState(node, isSelected);
        }
      });
    }
    element.scrollTop = previousScrollTop;
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
const { jQueryInstance } = options$1;
var style = {
  update: function(element, valueAccessor) {
    var value = unwrap(valueAccessor() || {});
    objectForEach(value, function(styleName, styleValue) {
      styleValue = unwrap(styleValue);
      if (styleValue === null || styleValue === undefined || styleValue === false) {
        styleValue = "";
      }
      if (jQueryInstance) {
        jQueryInstance(element).css(styleName, styleValue);
      } else {
        styleName = styleName.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
        const previousStyle = element.style[styleName];
        element.style[styleName] = styleValue;
        if (styleValue !== previousStyle && element.style[styleName] === previousStyle && !isNaN(styleValue)) {
          element.style[styleName] = styleValue + "px";
        }
      }
    });
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var submit = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    if (typeof valueAccessor() !== "function") {
      throw new Error("The value for a submit binding must be a function");
    }
    registerEventHandler(element, "submit", function(event) {
      var handlerReturnValue;
      var value = valueAccessor();
      try {
        handlerReturnValue = value.call(bindingContext["$data"], element);
      } finally {
        if (handlerReturnValue !== true) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    });
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var text = {
  init: function() {
    return { controlsDescendantBindings: true };
  },
  update: function(element, valueAccessor) {
    setTextContent(element, valueAccessor());
  },
  allowVirtualElements: true
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var operaVersion, safariVersion, firefoxVersion;
class TextInput extends BindingHandler {
  get aliases() {
    return "textinput";
  }
  constructor(...args) {
    super(...args);
    this.previousElementValue = this.$element.value;
    if (options$1.debug && this.constructor._forceUpdateOn) {
      arrayForEach(this.constructor._forceUpdateOn, (eventName) => {
        if (eventName.slice(0, 5) === "after") {
          this.addEventListener(eventName.slice(5), "deferUpdateModel");
        } else {
          this.addEventListener(eventName, "updateModel");
        }
      });
    }
    for (const eventName of this.eventsIndicatingSyncValueChange()) {
      this.addEventListener(eventName, "updateModel");
    }
    for (const eventName of this.eventsIndicatingDeferValueChange()) {
      this.addEventListener(eventName, "deferUpdateModel");
    }
    this.computed("updateView");
  }
  eventsIndicatingSyncValueChange() {
    return ["input", "change", "blur"];
  }
  eventsIndicatingDeferValueChange() {
    return [];
  }
  updateModel(event) {
    const element = this.$element;
    clearTimeout(this.timeoutHandle);
    this.elementValueBeforeEvent = this.timeoutHandle = undefined;
    const elementValue = element.value;
    if (this.previousElementValue !== elementValue) {
      if (options$1.debug && event) {
        element._ko_textInputProcessedEvent = event.type;
      }
      this.previousElementValue = elementValue;
      this.value = elementValue;
    }
  }
  deferUpdateModel(event) {
    const element = this.$element;
    if (!this.timeoutHandle) {
      this.elementValueBeforeEvent = element.value;
      const handler2 = options$1.debug ? this.updateModel.bind(this, { type: event.type }) : this.updateModel;
      this.timeoutHandle = safeSetTimeout(handler2, 4);
    }
  }
  updateView() {
    let modelValue = unwrap(this.value);
    if (modelValue === null || modelValue === undefined) {
      modelValue = "";
    }
    if (this.elementValueBeforeEvent !== undefined && modelValue === this.elementValueBeforeEvent) {
      setTimeout(this.updateView.bind(this), 4);
    } else if (this.$element.value !== modelValue) {
      this.previousElementValue = modelValue;
      this.$element.value = modelValue;
      this.previousElementValue = this.$element.value;
    }
  }
}
class TextInputIE extends TextInput {
  constructor(...args) {
    super(...args);
    if (ieVersion < 11) {
      this.addEventListener("propertychange", (event) => event.propertyName === "value" && this.updateModel(event));
    }
    if (ieVersion >= 8 && ieVersion < 10) {
      this.watchForSelectionChangeEvent();
      this.addEventListener("dragend", "deferUpdateModel");
    }
  }
  eventsIndicatingSyncValueChange() {
    return [...super.eventsIndicatingValueChange(), "keypress"];
  }
  selectionChangeHandler(event) {
    const target = this.activeElement;
    const handler2 = target && get(target, selectionChangeHandlerName);
    if (handler2) {
      handler2(event);
    }
  }
  watchForSelectionChangeEvent(element, ieUpdateModel) {
    const ownerDoc = element.ownerDocument;
    if (!get(ownerDoc, selectionChangeRegisteredName)) {
      set(ownerDoc, selectionChangeRegisteredName, true);
      registerEventHandler(ownerDoc, "selectionchange", this.selectionChangeHandler.bind(ownerDoc));
    }
    set(element, selectionChangeHandlerName, handler);
  }
}
class TextInputIE9 extends TextInputIE {
  updateModel(...args) {
    this.deferUpdateModel(...args);
  }
}
class TextInputIE8 extends TextInputIE {
  eventsIndicatingValueChange() {
    return [...super.eventsIndicatingValueChange(), "keyup", "keydown"];
  }
}
class TextInputLegacySafari extends TextInput {
  eventsIndicatingDeferValueChange() {
    return ["keydown", "paste", "cut"];
  }
}
class TextInputLegacyOpera extends TextInput {
  eventsIndicatingDeferValueChange() {
    return ["keydown"];
  }
}
class TextInputLegacyFirefox extends TextInput {
  eventsIndicatingValueChange() {
    return [
      ...super.eventsIndicatingSyncValueChange(),
      "DOMAutoComplete",
      "dragdrop",
      "drop"
    ];
  }
}
const w = options$1.global;
if (w.navigator) {
  const parseVersion2 = (matches) => matches && parseFloat(matches[1]);
  const userAgent = w.navigator.userAgent;
  userAgent.match(/Chrome\/([^ ]+)/);
  operaVersion = w.opera && w.opera.version && parseInt(w.opera.version());
  safariVersion = parseVersion2(userAgent.match(/Version\/([^ ]+) Safari/));
  firefoxVersion = parseVersion2(userAgent.match(/Firefox\/([^ ]*)/));
}
const textInput = ieVersion === 8 ? TextInputIE8 : ieVersion === 9 ? TextInputIE9 : ieVersion ? TextInputIE : safariVersion && safariVersion < 5 ? TextInputLegacySafari : operaVersion < 11 ? TextInputLegacyOpera : firefoxVersion && firefoxVersion < 4 ? TextInputLegacyFirefox : TextInput;

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var uniqueName = {
  init: function(element, valueAccessor) {
    if (valueAccessor()) {
      var name = "ko_unique_" + ++uniqueName.currentIndex;
      setElementName(element, name);
    }
  },
  currentIndex: 0
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
class value extends BindingHandler {
  static get after() {
    return ["options", "foreach", "template"];
  }
  constructor(...args) {
    super(...args);
    if (this.isCheckboxOrRadio) {
      applyBindingAccessorsToNode(this.$element, { checkedValue: this.valueAccessor });
      return;
    }
    this.propertyChangedFired = false;
    this.elementValueBeforeEvent = null;
    if (this.ieAutoCompleteHackNeeded) {
      this.addEventListener("propertyChange", () => this.propertyChangedFired = true);
      this.addEventListener("focus", () => this.propertyChangedFired = false);
      this.addEventListener("blur", () => this.propertyChangeFired && this.valueUpdateHandler());
    }
    arrayForEach(this.eventsToCatch, (eventName) => this.registerEvent(eventName));
    if (this.isInput && this.$element.type === "file") {
      this.updateFromModel = this.updateFromModelForFile;
    } else {
      this.updateFromModel = this.updateFromModelForValue;
    }
    this.computed("updateFromModel");
  }
  get eventsToCatch() {
    const requestedEventsToCatch = this.allBindings.get("valueUpdate");
    const requestedEventsArray = typeof requestedEventsToCatch === "string" ? [requestedEventsToCatch] : requestedEventsToCatch || [];
    return [.../* @__PURE__ */ new Set(["change", ...requestedEventsArray])];
  }
  get isInput() {
    return tagNameLower(this.$element) === "input";
  }
  get isCheckboxOrRadio() {
    const e = this.$element;
    return this.isInput && (e.type == "checkbox" || e.type == "radio");
  }
  get ieAutoCompleteHackNeeded() {
    return ieVersion && isInputElement && this.$element.type == "text" && this.$element.autocomplete != "off" && (!this.$element.form || this.$element.form.autocomplete != "off");
  }
  valueUpdateHandler() {
    this.elementValueBeforeEvent = null;
    this.propertyChangedFired = false;
    this.value = selectExtensions.readValue(this.$element);
  }
  registerEvent(eventName) {
    var handler = this.valueUpdateHandler.bind(this);
    if (stringStartsWith(eventName, "after")) {
      handler = () => {
        this.elementValueBeforeEvent = selectExtensions.readValue(this.$element);
        safeSetTimeout(this.valueUpdateHandler.bind(this), 0);
      };
      eventName = eventName.substring(5);
    }
    this.addEventListener(eventName, handler);
  }
  updateFromModelForFile() {
    var newValue = unwrap(this.value);
    if (newValue === null || newValue === undefined || newValue === "") {
      this.$element.value = "";
    } else {
      ignore(this.valueUpdateHandler, this);
    }
  }
  updateFromModelForValue() {
    const element = this.$element;
    var newValue = unwrap(this.value);
    var elementValue = selectExtensions.readValue(element);
    if (this.elementValueBeforeEvent !== null && newValue === this.elementValueBeforeEvent) {
      safeSetTimeout(this.updateFromModel.bind(this), 0);
      return;
    }
    if (newValue === elementValue && elementValue !== undefined) {
      return;
    }
    if (tagNameLower(element) === "select") {
      const allowUnset = this.allBindings.get("valueAllowUnset");
      selectExtensions.writeValue(element, newValue, allowUnset);
      if (!allowUnset && newValue !== selectExtensions.readValue(element)) {
        ignore(this.valueUpdateHandler, this);
      }
    } else {
      selectExtensions.writeValue(element, newValue);
    }
  }
}

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var visible = {
  update: function(element, valueAccessor) {
    var value = unwrap(valueAccessor());
    var isCurrentlyVisible = !(element.style.display === "none");
    if (value && !isCurrentlyVisible) {
      element.style.display = "";
    } else if (!value && isCurrentlyVisible) {
      element.style.display = "none";
    }
  }
};
var hidden = {
  update: function(element, valueAccessor) {
    visible.update.call(this, element, () => !unwrap(valueAccessor()));
  }
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var using = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var innerContext = bindingContext.createChildContext(valueAccessor);
    applyBindingsToDescendants(innerContext, element);
    return { controlsDescendantBindings: true };
  },
  allowVirtualElements: true
};

// @tko/binding.core 🥊 4.0.0-beta1.3 ESM
var bindings$3 = {
  attr,
  checked,
  checkedValue,
  click,
  css,
  "class": css,
  descendantsComplete: DescendantsCompleteHandler,
  enable,
  "event": eventHandler,
  disable,
  hasfocus,
  hasFocus: hasfocus,
  hidden,
  html,
  "let": $let,
  on: onHandler,
  options,
  selectedOptions,
  style,
  submit,
  text,
  textInput,
  textinput: textInput,
  uniqueName,
  using,
  value,
  visible
};

// @tko/binding.if 🥊 4.0.0-beta1.3 ESM
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class ConditionalBindingHandler extends AsyncBindingHandler {
  constructor(params) {
    super(params);
    this.hasElse = this.detectElse(this.$element);
    const elseChainSatisfied = this.completesElseChain = observable();
    set(this.$element, "conditional", { elseChainSatisfied });
  }
  getIfElseNodes() {
    if (this.ifElseNodes) {
      return this.ifElseNodes;
    }
    if (getDependenciesCount() || this.hasElse) {
      return this.cloneIfElseNodes(this.$element, this.hasElse);
    }
  }
  render() {
    const isFirstRender = !this.ifElseNodes;
    const { shouldDisplay } = this.renderStatus();
    this.ifElseNodes = this.getIfElseNodes() || {};
    if (shouldDisplay) {
      const useOriginalNodes = isFirstRender && !this.hasElse;
      this.renderAndApplyBindings(this.ifElseNodes.ifNodes, useOriginalNodes);
    } else if (this.hasElse) {
      this.renderAndApplyBindings(this.ifElseNodes.elseNodes);
    } else {
      emptyNode(this.$element);
    }
  }
  renderAndApplyBindings(nodes, useOriginalNodes) {
    return __async(this, null, function* () {
      if (!useOriginalNodes) {
        setDomNodeChildren(this.$element, cloneNodes(nodes));
      }
      const bound = yield applyBindingsToDescendants(this.bindingContext, this.$element);
      this.completeBinding(bound);
    });
  }
  get elseChainIsAlreadySatisfied() {
    return false;
  }
  isElseNode(node) {
    return node.nodeType === 8 && node.nodeValue.trim().toLowerCase() === "else";
  }
  detectElse(element) {
    var children = childNodes(element);
    for (var i = 0, j = children.length; i < j; ++i) {
      if (this.isElseNode(children[i])) {
        return true;
      }
    }
    return false;
  }
  cloneIfElseNodes(element, hasElse) {
    const children = childNodes(element);
    const ifNodes = [];
    const elseNodes = [];
    let target = ifNodes;
    for (var i = 0, j = children.length; i < j; ++i) {
      if (hasElse && this.isElseNode(children[i])) {
        target = elseNodes;
        hasElse = false;
      } else {
        target.push(cleanNode(children[i].cloneNode(true)));
      }
    }
    return { ifNodes, elseNodes };
  }
  get controlsDescendants() {
    return true;
  }
  static get allowVirtualElements() {
    return true;
  }
}

// @tko/binding.if 🥊 4.0.0-beta1.3 ESM
class IfBindingHandler extends ConditionalBindingHandler {
  constructor(...args) {
    super(...args);
    this.ifCondition = this.computed(() => !!unwrap(this.value));
    this.computed("render");
  }
  shouldDisplayIf() {
    return this.ifCondition();
  }
  get bindingContext() {
    return this.ifCondition.isActive() ? this.$context.extend(() => {
      this.ifCondition();
      return null;
    }) : this.$context;
  }
  renderStatus() {
    let shouldDisplay = this.shouldDisplayIf();
    if (this.elseChainIsAlreadySatisfied) {
      shouldDisplay = false;
      this.completesElseChain(true);
    } else {
      this.completesElseChain(shouldDisplay);
    }
    return { shouldDisplay };
  }
}
class UnlessBindingHandler extends IfBindingHandler {
  shouldDisplayIf() {
    return !super.shouldDisplayIf();
  }
}

// @tko/binding.if 🥊 4.0.0-beta1.3 ESM
class WithBindingHandler extends ConditionalBindingHandler {
  constructor(...args) {
    super(...args);
    this.asOption = this.allBindings.get("as");
    const conditionalFn = this.asOption && !options$1.createChildContextWithAs ? () => Boolean(unwrap(this.value)) : () => unwrap(this.value);
    this.conditional = this.computed(conditionalFn);
    this.computed("render");
  }
  get bindingContext() {
    if (!this.asOption) {
      return this.$context.createChildContext(this.valueAccessor);
    }
    return options$1.createChildContextWithAs ? this.$context.createChildContext(this.value, this.asOption) : this.$context.extend({ [this.asOption]: this.value });
  }
  renderStatus() {
    const shouldDisplay = Boolean(this.conditional());
    return { shouldDisplay };
  }
}

// @tko/binding.if 🥊 4.0.0-beta1.3 ESM
class ElseBindingHandler extends IfBindingHandler {
  shouldDisplayIf() {
    return super.shouldDisplayIf() || this.value === undefined;
  }
  get elseChainIsAlreadySatisfied() {
    if (!this._elseChain) {
      this._elseChain = this.readElseChain();
    }
    return unwrap(this._elseChain.elseChainSatisfied);
  }
  readElseChain() {
    let node = this.$element;
    do {
      node = node.previousSibling;
    } while (node && node.nodeType !== 1 && node.nodeType !== 8);
    if (!node) {
      return false;
    }
    if (node.nodeType === 8) {
      node = previousSibling(node);
    }
    return get(node, "conditional") || {};
  }
}

// @tko/binding.if 🥊 4.0.0-beta1.3 ESM
const bindings$2 = {
  "if": IfBindingHandler,
  "with": WithBindingHandler,
  ifnot: UnlessBindingHandler,
  unless: UnlessBindingHandler,
  "else": ElseBindingHandler,
  "elseif": ElseBindingHandler
};

// @tko/binding.foreach 🥊 4.0.0-beta1.3 ESM
const MAX_LIST_SIZE = 9007199254740991;
function isPlainObject(o) {
  return !!o && typeof o === "object" && o.constructor === Object;
}
const supportsDocumentFragment = options$1.document && typeof options$1.document.createDocumentFragment === "function";
function makeTemplateNode(sourceNode) {
  var container = document.createElement("div");
  var parentNode;
  if (sourceNode.content) {
    parentNode = sourceNode.content;
  } else if (sourceNode.tagName === "SCRIPT") {
    parentNode = document.createElement("div");
    parentNode.innerHTML = sourceNode.text;
  } else {
    parentNode = sourceNode;
  }
  arrayForEach(childNodes(parentNode), function(child) {
    if (child) {
      container.insertBefore(child.cloneNode(true), null);
    }
  });
  return container;
}
function valueToChangeAddItem(value, index) {
  return {
    status: "added",
    value,
    index
  };
}
const PENDING_DELETE_INDEX_SYM = createSymbolOrString("_ko_ffe_pending_delete_index");
class ForEachBinding extends AsyncBindingHandler {
  constructor(params) {
    super(params);
    const settings = {};
    if (isPlainObject(this.value)) {
      Object.assign(settings, this.value);
    }
    this.as = settings.as || this.allBindings.get("as");
    this.data = settings.data || (unwrap(this.$context.$rawData) === this.value ? this.$context.$rawData : this.value);
    this.container = isStartComment(this.$element) ? this.$element.parentNode : this.$element;
    this.generateContext = this.createContextGenerator(this.as);
    this.$indexHasBeenRequested = false;
    this.templateNode = makeTemplateNode(settings.templateNode || (settings.name ? document.getElementById(settings.name).cloneNode(true) : this.$element));
    ["afterAdd", "beforeRemove", "afterQueueFlush", "beforeQueueFlush"].forEach((p) => {
      this[p] = settings[p] || this.allBindings.get(p);
    });
    this.changeQueue = [];
    this.firstLastNodesList = [];
    this.indexesToDelete = [];
    this.rendering_queued = false;
    this.pendingDeletes = [];
    this.isNotEmpty = observable(Boolean(unwrap(this.data).length));
    set(this.$element, "conditional", {
      elseChainSatisfied: this.isNotEmpty
    });
    emptyNode(this.$element);
    const primeData = unwrap(this.data);
    if (primeData && primeData.map) {
      this.onArrayChange(primeData.map(valueToChangeAddItem), true);
    } else {
      this.completeBinding();
    }
    if (isObservable(this.data)) {
      if (!this.data.indexOf) {
        this.data = this.data.extend({ trackArrayChanges: true });
      }
      this.changeSubs = this.data.subscribe(this.onArrayChange, this, "arrayChange");
    }
  }
  dispose() {
    if (this.changeSubs) {
      this.changeSubs.dispose();
    }
    this.flushPendingDeletes();
  }
  onArrayChange(changeSet, isInitial) {
    var changeMap = {
      added: [],
      deleted: []
    };
    for (var i = 0, len = changeSet.length; i < len; i++) {
      if (changeMap.added.length && changeSet[i].status === "added") {
        var lastAdd = changeMap.added[changeMap.added.length - 1];
        var lastIndex = lastAdd.isBatch ? lastAdd.index + lastAdd.values.length - 1 : lastAdd.index;
        if (lastIndex + 1 === changeSet[i].index) {
          if (!lastAdd.isBatch) {
            lastAdd = {
              isBatch: true,
              status: "added",
              index: lastAdd.index,
              values: [lastAdd.value]
            };
            changeMap.added.splice(changeMap.added.length - 1, 1, lastAdd);
          }
          lastAdd.values.push(changeSet[i].value);
          continue;
        }
      }
      changeMap[changeSet[i].status].push(changeSet[i]);
    }
    if (changeMap.deleted.length > 0) {
      this.changeQueue.push.apply(this.changeQueue, changeMap.deleted);
      this.changeQueue.push({ status: "clearDeletedIndexes" });
    }
    this.changeQueue.push.apply(this.changeQueue, changeMap.added);
    if (this.changeQueue.length > 0 && !this.rendering_queued) {
      this.rendering_queued = true;
      if (isInitial) {
        this.processQueue();
      } else {
        ForEachBinding.animateFrame.call(window, () => this.processQueue());
      }
    }
  }
  startQueueFlush() {
    if (typeof this.beforeQueueFlush === "function") {
      this.beforeQueueFlush(this.changeQueue);
    }
  }
  endQueueFlush() {
    if (typeof this.afterQueueFlush === "function") {
      this.afterQueueFlush(this.changeQueue);
    }
  }
  processQueue() {
    var isEmpty = !unwrap(this.data).length;
    var lowestIndexChanged = MAX_LIST_SIZE;
    this.startQueueFlush();
    arrayForEach(this.changeQueue, (changeItem) => {
      if (typeof changeItem.index === "number") {
        lowestIndexChanged = Math.min(lowestIndexChanged, changeItem.index);
      }
      this[changeItem.status](changeItem);
    });
    this.flushPendingDeletes();
    this.rendering_queued = false;
    if (this.$indexHasBeenRequested) {
      this.updateIndexes(lowestIndexChanged);
    }
    this.endQueueFlush();
    this.changeQueue = [];
    if (isEmpty !== !this.isNotEmpty()) {
      this.isNotEmpty(!isEmpty);
    }
  }
  _first$indexRequest(ctx$indexRequestedFrom) {
    this.$indexHasBeenRequested = true;
    for (let i = 0, len = this.firstLastNodesList.length; i < len; ++i) {
      const ctx = this.getContextStartingFrom(this.firstLastNodesList[i].first);
      if (ctx) {
        ctx.$index = observable(i);
      }
    }
    return ctx$indexRequestedFrom.$index();
  }
  _contextExtensions($ctx) {
    Object.assign($ctx, { $list: this.data });
    if (this.$indexHasBeenRequested) {
      $ctx.$index = $ctx.$index || observable();
    } else {
      Object.defineProperty($ctx, "$index", {
        value: () => this._first$indexRequest($ctx),
        configurable: true,
        writable: true
      });
    }
    return $ctx;
  }
  createContextGenerator(as) {
    const $ctx = this.$context;
    if (as) {
      return (v) => this._contextExtensions($ctx.extend({ [as]: v }));
    } else {
      return (v) => $ctx.createChildContext(v, null, (ctx) => this._contextExtensions(ctx));
    }
  }
  updateFirstLastNodesList(index, children) {
    const first = children[0];
    const last = children[children.length - 1];
    this.firstLastNodesList.splice(index, 0, { first, last });
  }
  added(changeItem) {
    var index = changeItem.index;
    var valuesToAdd = changeItem.isBatch ? changeItem.values : [changeItem.value];
    var referenceElement = this.getLastNodeBeforeIndex(index);
    const allChildNodes = [];
    const asyncBindingResults = [];
    var children;
    for (var i = 0, len = valuesToAdd.length; i < len; ++i) {
      var pendingDelete = this.getPendingDeleteFor(valuesToAdd[i]);
      if (pendingDelete && pendingDelete.nodesets.length) {
        children = pendingDelete.nodesets.pop();
        this.updateFirstLastNodesList(index + i, children);
      } else {
        var templateClone = this.templateNode.cloneNode(true);
        children = childNodes(templateClone);
        this.updateFirstLastNodesList(index + i, children);
        const bindingResult = applyBindingsToDescendants(this.generateContext(valuesToAdd[i]), templateClone);
        asyncBindingResults.push(bindingResult);
      }
      allChildNodes.push(...children);
    }
    if (typeof this.afterAdd === "function") {
      this.afterAdd({
        nodeOrArrayInserted: this.insertAllAfter(allChildNodes, referenceElement),
        foreachInstance: this
      });
    } else {
      this.insertAllAfter(allChildNodes, referenceElement);
    }
    this.completeBinding(Promise.all(asyncBindingResults));
  }
  getNodesForIndex(index) {
    let result = [];
    let ptr = this.firstLastNodesList[index].first;
    let last = this.firstLastNodesList[index].last;
    result.push(ptr);
    while (ptr && ptr !== last) {
      ptr = ptr.nextSibling;
      result.push(ptr);
    }
    return result;
  }
  getLastNodeBeforeIndex(index) {
    if (index < 1 || index - 1 >= this.firstLastNodesList.length) {
      return null;
    }
    return this.firstLastNodesList[index - 1].last;
  }
  activeChildElement(node) {
    var active = document.activeElement;
    if (domNodeIsContainedBy(active, node)) {
      return active;
    }
  }
  insertAllAfter(nodeOrNodeArrayToInsert, insertAfterNode) {
    let frag;
    let len;
    let i;
    let active = null;
    let containerNode = this.$element;
    if (nodeOrNodeArrayToInsert.nodeType === undefined && nodeOrNodeArrayToInsert.length === undefined) {
      throw new Error("Expected a single node or a node array");
    }
    if (nodeOrNodeArrayToInsert.nodeType !== undefined) {
      active = this.activeChildElement(nodeOrNodeArrayToInsert);
      insertAfter(containerNode, nodeOrNodeArrayToInsert, insertAfterNode);
      return [nodeOrNodeArrayToInsert];
    } else if (nodeOrNodeArrayToInsert.length === 1) {
      active = this.activeChildElement(nodeOrNodeArrayToInsert[0]);
      insertAfter(containerNode, nodeOrNodeArrayToInsert[0], insertAfterNode);
    } else if (supportsDocumentFragment) {
      frag = document.createDocumentFragment();
      for (i = 0, len = nodeOrNodeArrayToInsert.length; i !== len; ++i) {
        active = active || this.activeChildElement(nodeOrNodeArrayToInsert[i]);
        frag.appendChild(nodeOrNodeArrayToInsert[i]);
      }
      insertAfter(containerNode, frag, insertAfterNode);
    } else {
      for (i = nodeOrNodeArrayToInsert.length - 1; i >= 0; --i) {
        active = active || this.activeChildElement(nodeOrNodeArrayToInsert[i]);
        var child = nodeOrNodeArrayToInsert[i];
        if (!child) {
          break;
        }
        insertAfter(containerNode, child, insertAfterNode);
      }
    }
    if (active) {
      active.focus();
    }
    return nodeOrNodeArrayToInsert;
  }
  shouldDelayDeletion(data) {
    return data && (typeof data === "object" || typeof data === "function");
  }
  getPendingDeleteFor(data) {
    var index = data && data[PENDING_DELETE_INDEX_SYM];
    if (index === undefined)
      return null;
    return this.pendingDeletes[index];
  }
  getOrCreatePendingDeleteFor(data) {
    var pd = this.getPendingDeleteFor(data);
    if (pd) {
      return pd;
    }
    pd = {
      data,
      nodesets: []
    };
    data[PENDING_DELETE_INDEX_SYM] = this.pendingDeletes.length;
    this.pendingDeletes.push(pd);
    return pd;
  }
  deleted(changeItem) {
    if (this.shouldDelayDeletion(changeItem.value)) {
      let pd = this.getOrCreatePendingDeleteFor(changeItem.value);
      pd.nodesets.push(this.getNodesForIndex(changeItem.index));
    } else {
      this.removeNodes(this.getNodesForIndex(changeItem.index));
    }
    this.indexesToDelete.push(changeItem.index);
  }
  removeNodes(nodes) {
    if (!nodes.length) {
      return;
    }
    function removeFn() {
      var parent = nodes[0].parentNode;
      for (var i = nodes.length - 1; i >= 0; --i) {
        cleanNode(nodes[i]);
        parent.removeChild(nodes[i]);
      }
    }
    if (this.beforeRemove) {
      var beforeRemoveReturn = this.beforeRemove({
        nodesToRemove: nodes,
        foreachInstance: this
      }) || {};
      if (typeof beforeRemoveReturn.then === "function") {
        beforeRemoveReturn.then(removeFn, options$1.onError);
      }
    } else {
      removeFn();
    }
  }
  flushPendingDeletes() {
    for (let i = 0, len = this.pendingDeletes.length; i !== len; ++i) {
      var pd = this.pendingDeletes[i];
      while (pd.nodesets.length) {
        this.removeNodes(pd.nodesets.pop());
      }
      if (pd.data && pd.data[PENDING_DELETE_INDEX_SYM] !== undefined) {
        delete pd.data[PENDING_DELETE_INDEX_SYM];
      }
    }
    this.pendingDeletes = [];
  }
  clearDeletedIndexes() {
    for (let i = this.indexesToDelete.length - 1; i >= 0; --i) {
      this.firstLastNodesList.splice(this.indexesToDelete[i], 1);
    }
    this.indexesToDelete = [];
  }
  updateIndexes(fromIndex) {
    let ctx;
    for (let i = fromIndex, len = this.firstLastNodesList.length; i < len; ++i) {
      ctx = this.getContextStartingFrom(this.firstLastNodesList[i].first);
      if (ctx) {
        ctx.$index(i);
      }
    }
  }
  getContextStartingFrom(node) {
    let ctx;
    while (node) {
      ctx = contextFor(node);
      if (ctx) {
        return ctx;
      }
      node = node.nextSibling;
    }
  }
  static setSync(toggle) {
    const w = options$1.global;
    if (toggle) {
      ForEachBinding.animateFrame = function(frame) {
        frame();
      };
    } else {
      ForEachBinding.animateFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame || w.msRequestAnimationFrame || function(cb) {
        return w.setTimeout(cb, 1e3 / 60);
      };
    }
  }
  get controlsDescendants() {
    return true;
  }
  static get allowVirtualElements() {
    return true;
  }
  static get ForEach() {
    return this;
  }
  static get PENDING_DELETE_INDEX_SYM() {
    return PENDING_DELETE_INDEX_SYM;
  }
}

// @tko/binding.foreach 🥊 4.0.0-beta1.3 ESM
var bindings$1 = {
  foreach: ForEachBinding
};
ForEachBinding.setSync(false);

// @tko/utils.jsx 🥊 4.0.0-beta1.3 ESM
const DELAY_MS = 25;
const MAX_CLEAN_AT_ONCE = 1e3;
const cleanNodeQueue = [];
let cleanNodeTimeoutID = null;
function queueCleanNode(node) {
  cleanNodeQueue.push(node);
  triggerCleanTimeout();
}
function triggerCleanTimeout() {
  if (!cleanNodeTimeoutID && cleanNodeQueue.length) {
    cleanNodeTimeoutID = setTimeout(flushCleanQueue, DELAY_MS);
  }
}
function flushCleanQueue() {
  cleanNodeTimeoutID = null;
  const nodes = cleanNodeQueue.splice(0, MAX_CLEAN_AT_ONCE);
  for (const node of nodes) {
    cleanNode(node);
  }
  triggerCleanTimeout();
}

// @tko/utils.jsx 🥊 4.0.0-beta1.3 ESM
const ORIGINAL_JSX_SYM = Symbol("Knockout - Original JSX");
const NAMESPACES = {
  svg: "http://www.w3.org/2000/svg",
  html: "http://www.w3.org/1999/xhtml",
  xml: "http://www.w3.org/XML/1998/namespace",
  xlink: "http://www.w3.org/1999/xlink",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function isIterable(v) {
  return v && typeof v[Symbol.iterator] === "function";
}
class JsxObserver extends LifeCycle {
  constructor(jsxOrObservable, parentNode, insertBefore = null, xmlns, noInitialBinding) {
    super();
    const parentNodeIsComment = parentNode.nodeType === 8;
    const parentNodeTarget = this.getParentTarget(parentNode);
    if (isObservable(jsxOrObservable)) {
      jsxOrObservable.extend({ trackArrayChanges: true });
      this.subscribe(jsxOrObservable, this.observableArrayChange, "arrayChange");
      if (!insertBefore) {
        const insertAt = parentNodeIsComment ? parentNode.nextSibling : null;
        insertBefore = this.createComment("O");
        parentNodeTarget.insertBefore(insertBefore, insertAt);
      } else {
        this.adoptedInsertBefore = true;
      }
    }
    if (parentNodeIsComment && !insertBefore) {
      insertBefore = parentNode.nextSibling;
      this.adoptedInsertBefore = true;
    }
    this.anchorTo(insertBefore || parentNode);
    Object.assign(this, {
      insertBefore,
      noInitialBinding,
      parentNode,
      parentNodeTarget,
      xmlns,
      nodeArrayOrObservableAtIndex: [],
      subscriptionsForNode: /* @__PURE__ */ new Map()
    });
    const jsx = unwrap(jsxOrObservable);
    const computed = isComputed(jsxOrObservable);
    if (computed || jsx !== null && jsx !== undefined) {
      this.observableArrayChange(this.createInitialAdditions(jsx));
    }
    this.noInitialBinding = false;
  }
  getParentTarget(parentNode) {
    if ("content" in parentNode) {
      return parentNode.content;
    }
    if (parentNode.nodeType === 8) {
      return parentNode.parentNode;
    }
    return parentNode;
  }
  remove() {
    this.dispose();
  }
  dispose() {
    super.dispose();
    const ib = this.insertBefore;
    const insertBeforeIsChild = ib && this.parentNodeTarget === ib.parentNode;
    if (insertBeforeIsChild && !this.adoptedInsertBefore) {
      this.parentNodeTarget.removeChild(ib);
    }
    this.removeAllPriorNodes();
    Object.assign(this, {
      parentNode: null,
      parentNodeTarget: null,
      insertBefore: null,
      nodeArrayOrObservableAtIndex: []
    });
    for (const subscriptions of this.subscriptionsForNode.values()) {
      subscriptions.forEach((s) => s.dispose());
    }
    this.subscriptionsForNode.clear();
  }
  createInitialAdditions(possibleIterable) {
    const status = "added";
    if (typeof possibleIteratable === "object" && posibleIterable !== null && Symbol.iterator in possibleIterable) {
      possibleIterable = [...possibleIterable];
    }
    return Array.isArray(possibleIterable) ? possibleIterable.map((value, index) => ({ index, status, value })) : [{ status, index: 0, value: possibleIterable }];
  }
  observableArrayChange(changes) {
    let adds = [];
    let dels = [];
    for (const index in changes) {
      const change = changes[index];
      if (change.status === "added") {
        adds.push([change.index, change.value]);
      } else {
        dels.unshift([change.index, change.value]);
      }
    }
    dels.forEach((change) => this.delChange(...change));
    adds.forEach((change) => this.addChange(...change));
  }
  addChange(index, jsx) {
    this.nodeArrayOrObservableAtIndex.splice(index, 0, this.injectNode(jsx, this.lastNodeFor(index)));
  }
  injectNode(jsx, nextNode) {
    let nodeArrayOrObservable;
    if (isObservable(jsx)) {
      const { parentNode, xmlns } = this;
      const observer = new JsxObserver(jsx, parentNode, nextNode, xmlns, this.noInitialBinding);
      nodeArrayOrObservable = [observer];
    } else if (typeof jsx !== "string" && isIterable(jsx)) {
      nodeArrayOrObservable = [];
      for (const child of jsx) {
        nodeArrayOrObservable.unshift(this.injectNode(child, nextNode));
      }
    } else {
      const $context = contextFor(this.parentNode);
      const isInsideTemplate = "content" in this.parentNode;
      const shouldApplyBindings = $context && !isInsideTemplate && !this.noInitialBinding;
      if (Array.isArray(jsx)) {
        nodeArrayOrObservable = jsx.map((j) => this.anyToNode(j));
      } else {
        nodeArrayOrObservable = [this.anyToNode(jsx)];
      }
      for (const node of nodeArrayOrObservable) {
        this.parentNodeTarget.insertBefore(node, nextNode);
        if (shouldApplyBindings && this.canApplyBindings(node)) {
          applyBindings($context, node);
        }
      }
    }
    return nodeArrayOrObservable;
  }
  canApplyBindings(node) {
    return node.nodeType === 1 || node.nodeType === 8;
  }
  delChange(index) {
    this.removeNodeArrayOrObservable(this.nodeArrayOrObservableAtIndex[index]);
    this.nodeArrayOrObservableAtIndex.splice(index, 1);
  }
  getSubscriptionsForNode(node) {
    if (!this.subscriptionsForNode.has(node)) {
      const subscriptions = [];
      this.subscriptionsForNode.set(node, subscriptions);
      return subscriptions;
    }
    return this.subscriptionsForNode.get(node);
  }
  isJsx(jsx) {
    return typeof jsx.elementName === "string" && "children" in jsx && "attributes" in jsx;
  }
  anyToNode(any) {
    if (isThenable(any)) {
      return this.futureJsxNode(any);
    }
    switch (typeof any) {
      case "object":
        if (any instanceof Error) {
          return this.createComment(any.toString());
        }
        if (any === null) {
          return this.createComment(String(any));
        }
        if (any instanceof Node) {
          return this.cloneJSXorMoveNode(any);
        }
        if (Symbol.iterator in any) {
          return any;
        }
        break;
      case "function":
        return this.anyToNode(any());
      case "undefined":
      case "symbol":
        return this.createComment(String(any));
      case "string":
        return this.createTextNode(any);
      case "boolean":
      case "number":
      case "bigint":
      default:
        return this.createTextNode(String(any));
    }
    return this.isJsx(any) ? this.jsxToNode(any) : this.createComment(safeStringify(any));
  }
  createComment(string) {
    const node = document.createComment(string);
    node[NATIVE_BINDINGS] = true;
    return node;
  }
  createTextNode(string) {
    const node = document.createTextNode(string);
    node[NATIVE_BINDINGS] = true;
    return node;
  }
  cloneJSXorMoveNode(node) {
    return ORIGINAL_JSX_SYM in node ? this.jsxToNode(node[ORIGINAL_JSX_SYM]) : node;
  }
  jsxToNode(jsx) {
    const xmlns = jsx.attributes.xmlns || NAMESPACES[jsx.elementName] || this.xmlns;
    const node = document.createElementNS(xmlns || NAMESPACES.html, jsx.elementName);
    node[ORIGINAL_JSX_SYM] = jsx;
    if (isObservable(jsx.attributes)) {
      const subscriptions = this.getSubscriptionsForNode(node);
      subscriptions.push(jsx.attributes.subscribe((attrs) => {
        this.updateAttributes(node, unwrap(attrs));
      }));
    }
    this.updateAttributes(node, unwrap(jsx.attributes));
    this.addDisposable(new JsxObserver(jsx.children, node, null, xmlns, this.noInitialBinding));
    return node;
  }
  futureJsxNode(promise) {
    const obs = observable();
    promise.then(obs).catch((e) => obs(e instanceof Error ? e : Error(e)));
    const jo = new JsxObserver(obs, this.parentNode, null, this.xmlns, this.noInitialBinding);
    this.addDisposable(jo);
    return jo.insertBefore;
  }
  updateAttributes(node, attributes) {
    const subscriptions = this.getSubscriptionsForNode(node);
    const toRemove = new Set([...node.attributes].map((n) => n.name));
    for (const [name, value] of Object.entries(attributes || {})) {
      toRemove.delete(name);
      if (isObservable(value)) {
        subscriptions.push(value.subscribe((attr) => this.setNodeAttribute(node, name, value)));
      }
      this.setNodeAttribute(node, name, value);
    }
    for (const name of toRemove) {
      this.setNodeAttribute(node, name, undefined);
    }
  }
  getNamespaceOfAttribute(attr) {
    const [prefix, ...unqualifiedName] = attr.split(":");
    if (prefix === "xmlns" || unqualifiedName.length && NAMESPACES[prefix]) {
      return NAMESPACES[prefix];
    }
    return null;
  }
  setNodeAttribute(node, name, valueOrObservable) {
    const value = unwrap(valueOrObservable);
    NativeProvider.addValueToNode(node, name, valueOrObservable);
    if (value === undefined) {
      node.removeAttributeNS(null, name);
    } else if (isThenable(valueOrObservable)) {
      Promise.resolve(valueOrObservable).then((v) => this.setNodeAttribute(node, name, v));
    } else {
      const ns = this.getNamespaceOfAttribute(name);
      node.setAttributeNS(ns, name, String(value));
    }
  }
  lastNodeFor(index) {
    const nodesAtIndex = this.nodeArrayOrObservableAtIndex[index] || [];
    const [lastNodeOfPrior] = nodesAtIndex.slice(-1);
    const insertBefore = lastNodeOfPrior instanceof JsxObserver ? lastNodeOfPrior.insertBefore : lastNodeOfPrior || this.insertBefore;
    if (insertBefore) {
      return insertBefore.parentNode ? insertBefore : null;
    }
    return null;
  }
  removeAllPriorNodes() {
    const { nodeArrayOrObservableAtIndex } = this;
    while (nodeArrayOrObservableAtIndex.length) {
      this.removeNodeArrayOrObservable(nodeArrayOrObservableAtIndex.pop());
    }
  }
  removeNodeArrayOrObservable(nodeArrayOrObservable) {
    for (const nodeOrObservable of nodeArrayOrObservable) {
      if (nodeOrObservable instanceof JsxObserver) {
        nodeOrObservable.dispose();
        continue;
      }
      const node = nodeOrObservable;
      delete node[ORIGINAL_JSX_SYM];
      this.detachAndDispose(node);
      const subscriptions = this.subscriptionsForNode.get(node);
      if (subscriptions) {
        subscriptions.forEach((s) => s.dispose());
        this.subscriptionsForNode.delete(node);
      }
    }
  }
  detachAndDispose(node) {
    if (isIterable(node)) {
      for (const child of node) {
        this.detachAndDispose(child);
      }
    } else {
      node.remove();
    }
    queueCleanNode(node);
  }
}

// @tko/utils.jsx 🥊 4.0.0-beta1.3 ESM
function maybeJsx(possibleJsx) {
  if (isObservable(possibleJsx)) {
    return true;
  }
  const value = unwrap(possibleJsx);
  if (!value) {
    return false;
  }
  if (value.elementName) {
    return true;
  }
  if (!Array.isArray(value) || !value.length) {
    return false;
  }
  if (value[0] instanceof window.Node) {
    return false;
  }
  return true;
}
function getOriginalJsxForNode(node) {
  return node[ORIGINAL_JSX_SYM];
}
function createElement(elementName, attributes, ...children) {
  return elementName === Fragment ? children : {
    elementName,
    attributes: attributes || {},
    children: [...children]
  };
}
const Fragment = Symbol("JSX Fragment");

// @tko/binding.component 🥊 4.0.0-beta1.3 ESM
var componentLoadingOperationUniqueId = 0;
class ComponentBinding extends DescendantBindingHandler {
  constructor(params) {
    super(params);
    this.originalChildNodes = makeArray(childNodes(this.$element));
    this.computed("computeApplyComponent");
  }
  cloneTemplateIntoElement(componentName, template, element) {
    if (!template) {
      throw new Error("Component '" + componentName + "' has no template");
    }
    if (maybeJsx(template)) {
      emptyNode(element);
      this.addDisposable(new JsxObserver(template, element, null, undefined, true));
    } else {
      const clonedNodesArray = cloneNodes(template);
      setDomNodeChildren(element, clonedNodesArray);
    }
  }
  createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
    const componentViewModelFactory = componentDefinition.createViewModel;
    return componentViewModelFactory ? componentViewModelFactory.call(componentDefinition, componentParams, { element, templateNodes: originalChildNodes }) : componentParams;
  }
  makeTemplateSlotNodes(originalChildNodes) {
    return Object.assign({}, ...this.genSlotsByName(originalChildNodes));
  }
  *genSlotsByName(templateNodes) {
    for (const node of templateNodes) {
      if (node.nodeType !== 1) {
        continue;
      }
      const slotName = node.getAttribute("slot");
      if (!slotName) {
        continue;
      }
      yield { [slotName]: node };
    }
  }
  computeApplyComponent() {
    const value = unwrap(this.value);
    let componentName;
    let componentParams;
    if (typeof value === "string") {
      componentName = value;
    } else {
      componentName = unwrap(value.name);
      componentParams = NativeProvider.getNodeValues(this.$element) || unwrap(value.params);
    }
    this.latestComponentName = componentName;
    if (!componentName) {
      throw new Error("No component name specified");
    }
    this.loadingOperationId = this.currentLoadingOperationId = ++componentLoadingOperationUniqueId;
    components.get(componentName, (defn) => this.applyComponentDefinition(componentName, componentParams, defn));
  }
  makeChildBindingContext($component) {
    const ctxExtender = (ctx) => Object.assign(ctx, {
      $component,
      $componentTemplateNodes: this.originalChildNodes,
      $componentTemplateSlotNodes: this.makeTemplateSlotNodes(this.originalChildNodes)
    });
    return this.$context.createChildContext($component, undefined, ctxExtender);
  }
  applyComponentDefinition(componentName, componentParams, componentDefinition) {
    if (this.currentLoadingOperationId !== this.loadingOperationId || this.latestComponentName !== componentName) {
      return;
    }
    this.cleanUpState();
    const element = this.$element;
    if (!componentDefinition) {
      throw new Error("Unknown component '" + componentName + "'");
    }
    if (componentDefinition.template) {
      this.cloneTemplateIntoElement(componentName, componentDefinition.template, element);
    }
    const componentViewModel = this.createViewModel(componentDefinition, element, this.originalChildNodes, componentParams);
    this.childBindingContext = this.makeChildBindingContext(componentViewModel);
    const viewTemplate = componentViewModel && componentViewModel.template;
    if (!viewTemplate && !componentDefinition.template) {
      throw new Error("Component '" + componentName + "' has no template");
    }
    if (!componentDefinition.template) {
      this.cloneTemplateIntoElement(componentName, viewTemplate, element);
    }
    if (componentViewModel instanceof LifeCycle) {
      componentViewModel.anchorTo(this.$element);
    }
    this.currentViewModel = componentViewModel;
    const onBinding = this.onBindingComplete.bind(this, componentViewModel);
    this.applyBindingsToDescendants(this.childBindingContext, onBinding);
  }
  onBindingComplete(componentViewModel, bindingResult) {
    if (componentViewModel && componentViewModel.koDescendantsComplete) {
      componentViewModel.koDescendantsComplete(this.$element);
    }
    this.completeBinding(bindingResult);
  }
  cleanUpState() {
    const currentView = this.currentViewModel;
    const currentViewDispose = currentView && currentView.dispose;
    if (typeof currentViewDispose === "function") {
      currentViewDispose.call(currentView);
    }
    this.currentViewModel = null;
    this.currentLoadingOperationId = null;
  }
  dispose() {
    this.cleanUpState();
    super.dispose();
  }
  get controlsDescendants() {
    return true;
  }
  static get allowVirtualElements() {
    return true;
  }
}

// @tko/binding.component 🥊 4.0.0-beta1.3 ESM
class SlotBinding extends DescendantBindingHandler {
  constructor(...params) {
    super(...params);
    const slotNode = this.getSlot(this.value);
    const $slotContext = contextFor(slotNode);
    const childContext = this.$context.extend({
      $slotContext,
      $slotData: $slotContext && $slotContext.$data
    });
    this.replaceSlotWithNode(this.$element, slotNode);
    this.applyBindingsToDescendants(childContext);
  }
  replaceSlotWithNode(nodeInComponentTemplate, slotNode) {
    const nodes = this.cloneNodeFromOriginal(slotNode);
    emptyNode(nodeInComponentTemplate);
    this.addDisposable(new JsxObserver(nodes, nodeInComponentTemplate, undefined, undefined, true));
  }
  cloneNodeFromOriginal(node) {
    if (!node) {
      return [];
    }
    const jsx = getOriginalJsxForNode(node);
    if (jsx) {
      return jsx.children;
    }
    if ("content" in node) {
      const clone = document.importNode(node.content, true);
      return [...clone.childNodes];
    }
    const nodeArray = Array.isArray(node) ? node : [node];
    return nodeArray.map((n) => n.cloneNode(true));
  }
  getSlot(slotName) {
    const { $componentTemplateSlotNodes } = this.$context;
    if (!slotName) {
      return $componentTemplateSlotNodes[""] || [...this.$context.$componentTemplateNodes].filter((n) => !n.getAttribute || !n.getAttribute("slot"));
    }
    return $componentTemplateSlotNodes[slotName];
  }
  static get allowVirtualElements() {
    return true;
  }
}

// @tko/binding.component 🥊 4.0.0-beta1.3 ESM
var bindings = { component: ComponentBinding, slot: SlotBinding };

// @tko/filter.punches 🥊 4.0.0-beta1.3 ESM
var sproto = String.prototype;
var filters = {};
filters.uppercase = function(value) {
  return sproto.toUpperCase.call(unwrap(value));
};
filters.lowercase = function(value) {
  return sproto.toLowerCase.call(unwrap(value));
};
filters["default"] = function(value, defaultValue) {
  value = unwrap(value);
  if (typeof value === "function") {
    return value;
  }
  if (typeof value === "string") {
    return sproto.trim.call(value) === "" ? defaultValue : value;
  }
  return value == null || value.length == 0 ? defaultValue : value;
};
filters.replace = function(value, search, replace) {
  return sproto.replace.call(unwrap(value), search, replace);
};
filters.fit = function(value, length, replacement, trimWhere) {
  value = unwrap(value);
  if (length && ("" + value).length > length) {
    replacement = "" + (replacement || "...");
    length = length - replacement.length;
    value = "" + value;
    switch (trimWhere) {
      case "left":
        return replacement + value.slice(-length);
      case "middle":
        var leftLen = Math.ceil(length / 2);
        return value.substr(0, leftLen) + replacement + value.slice(leftLen - length);
      default:
        return value.substr(0, length) + replacement;
    }
  } else {
    return value;
  }
};
filters.json = function(rootObject, space, replacer) {
  return JSON.stringify(toJS(rootObject), replacer, space);
};
filters.number = function(value) {
  return (+unwrap(value)).toLocaleString();
};

// @tko/build.reference 🥊 4.0.0-beta1.7 MJS
overloadOperator("==", (a, b) => a === b);
overloadOperator("!=", (a, b) => a !== b);
const builder = new Builder({
  filters,
  provider: new MultiProvider({
    providers: [
      new ComponentProvider(),
      new NativeProvider(),
      new AttributeMustacheProvider(),
      new TextMustacheProvider(),
      new DataBindProvider(),
      new VirtualProvider(),
      new AttrProvider()
    ]
  }),
  bindings: [
    bindings$3,
    bindings$4,
    bindings$2,
    bindings$1,
    bindings,
    { each: bindings$1.foreach }
  ]
});
const version = "4.0.0-beta1.7";
var ko$1 = builder.create({
  jsx: {
    createElement,
    Fragment
  },
  components,
  version,
  Component: components.ComponentABC
});

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var knockoutPostbox = {exports: {}};

var knockoutFixed = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: ko$1
});

var require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(knockoutFixed);

var hasRequiredKnockoutPostbox;

function requireKnockoutPostbox () {
	if (hasRequiredKnockoutPostbox) return knockoutPostbox.exports;
	hasRequiredKnockoutPostbox = 1;
	(function (module, exports) {
(function(factory) {
		    //CommonJS
		    if (typeof commonjsRequire === "function" && 'object' === "object" && 'object' === "object") {
		        factory(require$$0, exports);
		    //AMD
		    } else {
		        factory(ko, ko.postbox = {});
		    }
		}(function(ko, exports, undefined$1) {
		    var disposeTopicSubscription, ensureDispose, existingSubscribe,
		        subscriptions = {},
		        subId = 1;

		    exports.subscriptions = subscriptions;

		    //create a global postbox that supports subscribing/publishing
		    ko.subscribable.call(exports);

		    //keep a cache of the latest value and subscribers
		    exports.topicCache = {};

		    //allow customization of the function used to serialize values for the topic cache
		    exports.serializer = ko.toJSON;

		    //wrap notifySubscribers passing topic first and caching latest value
		    exports.publish = function(topic, value) {
		        if (topic) {
		            //keep the value and a serialized version for comparison
		            exports.topicCache[topic] = {
		                value: value,
		                serialized: exports.serializer(value)
		            };
		            exports.notifySubscribers(value, topic);
		        }
		    };

		    //provide a subscribe API for the postbox that takes in the topic as first arg
		    existingSubscribe = exports.subscribe;
		    exports.subscribe = function(topic, action, target, initializeWithLatestValue) {
		        var subscription, current, existingDispose;

		        if (topic) {
		            if (typeof target === "boolean") {
		                initializeWithLatestValue = target;
		                target = undefined$1;
		            }

		            subscription = existingSubscribe.call(exports, action, target, topic);
		            subscription.subId = ++subId;
		            subscriptions[ subId ] = subscription;

		            if (initializeWithLatestValue) {
		                current = exports.topicCache[topic];

		                if (current !== undefined$1) {
		                    action.call(target, current.value);
		                }
		            }

		            existingDispose = subscription.dispose;
		            subscription.dispose = function() {
		                delete subscriptions[subscription.subId];
		                existingDispose.call(subscription);
		            };

		            return subscription;
		        }
		    };

		    //clean up all subscriptions and references
		    exports.reset = function() {
		        var subscription;

		        for (var id in subscriptions) {
		            if (subscriptions.hasOwnProperty(id)) {
		                subscription = subscriptions[id];

		                if (subscription && typeof subscription.dispose === "function") {
		                    subscription.dispose();
		                }
		            }
		        }

		        exports.topicCache = {};
		    };

		    //by default publish when the previous cached value does not equal the new value
		    exports.defaultComparer = function(newValue, cacheItem) {
		        return cacheItem && exports.serializer(newValue) === cacheItem.serialized;
		    };

		    // Ensures that a `subscribable` has a `dispose` method which cleans up all
		    // subscriptions added by `knockout-postbox`.
		    ensureDispose = function() {
		        var existingDispose,
		            self = this;

		        // Make sure we're adding the custom `dispose` method at most once.
		        if (!self.willDisposePostbox) {
		            self.willDisposePostbox = true;

		            existingDispose = self.dispose;
		            self.dispose = function() {
		                var topic, types, type, sub,
		                    subs = self.postboxSubs;

		                if (subs) {
		                    for (topic in subs) {
		                        if (subs.hasOwnProperty(topic)) {
		                            types = subs[topic];
		                            if (types) {
		                                for (type in types) {
		                                    if (types.hasOwnProperty(type)) {
		                                        sub = types[type];
		                                        if (sub && typeof sub.dispose == "function") {
		                                            sub.dispose();
		                                        }
		                                    }
		                                }
		                            }
		                        }
		                    }
		                }

		                if (existingDispose) {
		                    existingDispose.call(self);
		                }
		            };
		        }
		    };

		    //augment observables/computeds with the ability to automatically publish updates on a topic
		    ko.subscribable.fn.publishOn = function(topic, skipInitialOrEqualityComparer, equalityComparer) {
		        var skipInitialPublish, subscription, existingDispose;

		        ensureDispose.call(this);

		        if (topic) {
		            //allow passing the equalityComparer as the second argument
		            if (typeof skipInitialOrEqualityComparer === "function") {
		                equalityComparer = skipInitialOrEqualityComparer;
		            } else {
		                skipInitialPublish = skipInitialOrEqualityComparer;
		            }

		            equalityComparer = equalityComparer || exports.defaultComparer;

		            //remove any existing subs
		            disposeTopicSubscription.call(this, topic, "publishOn");

		            //keep a reference to the subscription, so we can stop publishing
		            subscription = this.subscribe(function(newValue) {
		                if (!equalityComparer.call(this, newValue, exports.topicCache[topic])) {
		                    exports.publish(topic, newValue);
		                }
		            }, this);

		            //track the subscription in case of a reset
		            subscription.id = ++subId;
		            subscriptions[subId] = subscription;

		            //ensure that we cleanup pointers to subscription on dispose
		            existingDispose = subscription.dispose;
		            subscription.dispose = function() {
		                delete this.postboxSubs[topic].publishOn;
		                delete subscriptions[subscription.id];

		                existingDispose.call(subscription);
		            }.bind(this);

		            this.postboxSubs[topic].publishOn = subscription;

		            //do an initial publish
		            if (!skipInitialPublish) {
		                exports.publish(topic, this());
		            }
		        }

		        return this;
		    };

		    //handle disposing a subscription used to publish or subscribe to a topic
		    disposeTopicSubscription = function(topic, type) {
		        var subs = this.postboxSubs = this.postboxSubs || {};
		        subs[topic] = subs[topic] || {};

		        if (subs[topic][type]) {
		            subs[topic][type].dispose();
		        }
		    };

		    //discontinue automatically publishing on a topic
		    ko.subscribable.fn.stopPublishingOn = function(topic) {
		        disposeTopicSubscription.call(this, topic, "publishOn");

		        return this;
		    };

		    //augment observables/computeds to automatically be updated by notifications on a topic
		    ko.subscribable.fn.subscribeTo = function(topic, initializeWithLatestValueOrTransform, transform) {
		        var initializeWithLatestValue, current, callback, subscription, existingDispose,
		            self = this;

		        ensureDispose.call(this);

		        //allow passing the filter as the second argument
		        if (typeof initializeWithLatestValueOrTransform === "function") {
		            transform = initializeWithLatestValueOrTransform;
		        } else {
		            initializeWithLatestValue = initializeWithLatestValueOrTransform;
		        }

		        if (topic && ko.isWriteableObservable(this)) {
		            //remove any existing subs
		            disposeTopicSubscription.call(this, topic, "subscribeTo");

		            //if specified, apply a filter function in the subscription
		            callback = function(newValue) {
		                self(transform ? transform.call(self, newValue) : newValue);
		            };

		            ////keep a reference to the subscription, so we can unsubscribe, if necessary
		            subscription = exports.subscribe(topic, callback);
		            this.postboxSubs[topic].subscribeTo = subscription;

		            //ensure that we cleanup pointers to subscription on dispose
		            existingDispose = subscription.dispose;
		            subscription.dispose = function() {
		                delete this.postboxSubs[topic].subscribeTo;
		                existingDispose.call(subscription);
		            }.bind(this);

		            if (initializeWithLatestValue) {
		                current = exports.topicCache[topic];

		                if (current !== undefined$1) {
		                    callback(current.value);
		                }
		            }
		        }

		        return this;
		    };

		    //discontinue receiving updates on a topic
		    ko.subscribable.fn.unsubscribeFrom = function(topic) {
		        disposeTopicSubscription.call(this, topic, "subscribeTo");

		        return this;
		    };

		    // both subscribe and publish on the same topic
		    //   -allows the ability to sync an observable/writeable computed/observableArray between view models
		    //   -subscribeTo should really not use a filter function, as it would likely cause infinite recursion
		    ko.subscribable.fn.syncWith = function(topic, initializeWithLatestValue, skipInitialOrEqualityComparer, equalityComparer) {
		        this.subscribeTo(topic, initializeWithLatestValue).publishOn(topic, skipInitialOrEqualityComparer, equalityComparer);

		        return this;
		    };

		    ko.subscribable.fn.stopSyncingWith = function(topic) {
		        this.unsubscribeFrom(topic).stopPublishingOn(topic);

		        return this;
		    };

		    ko.postbox = exports;
		})); 
	} (knockoutPostbox, knockoutPostbox.exports));
	return knockoutPostbox.exports;
}

requireKnockoutPostbox();

let Contact = class {

  constructor(data) {
    let self = this; 
    self.firstName = ko$1.observable(data.firstName);
    self.lastName = ko$1.observable(data.lastName);
    self.subscribed = ko$1.observable(false);
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  subscribe($koData, event) {
    this.subscribed(true);
    ko$1.postbox.publish('contact-subscribe', {
      firstName: this.firstName(),
      lastName: this.lastName()
    });
  }
};

var contactComponent = "<td data-bind=\"text: firstName\"></td>\n<td data-bind=\"text: lastName\"></td>\n<td data-bind=\"text: subscribed\"></td>\n<td><button data-bind=\"visible: !subscribed(), click: subscribe\">Subscribe</button></td>";

ko$1.components.register('contact-component', {
  template: contactComponent
});


ko$1.postbox.subscribe('contact-subscribe', (value) => {
  console.log(JSON.stringify(value));
  alert(`${value.firstName} ${value.lastName} subscribed`);
});


const Main = function () {

    let self = this;

    self.title = "TKO-Postbox";
    self.contacts = ko$1.observableArray([
        new Contact({ firstName: 'John', lastName: 'Doe' }),
        new Contact({ firstName: 'Jane', lastName: 'Smith' })
    ]);

};


ko$1.applyBindings(new Main());
