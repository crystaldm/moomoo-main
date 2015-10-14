// dom.js
// dom helpers
cow.dom = (function() {
  function $(path, parent) {
    parent = parent || document;
    return parent.querySelectorAll(path);
  }

  function hasClass(el, clsName) {
    var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
    return rege.test(el.className);
  }

  function addClass(el, clsName) {
    if(!hasClass(el, clsName)) {
      el.className += " " + clsName;
    }
  }

  function removeClass(el, clsName) {
    var regeX = new RegExp ("(^|\\s)" + clsName + "(\\s|$)");
    el.className = el.className.replace(regex, " ");
  }

  return {
    $: $,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass
  };
}) ();
