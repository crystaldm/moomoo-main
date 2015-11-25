// main script for moo moo mania

var cow = (function() {
  var settings = {
    rows : 8,
    cols : 8,
    baseScore : 100,
    numCowTypes : 7,

    controls: {
      // keyboard
      KEY_UP : "moveUp",
      KEY_LEFT : "moveLeft",
      KEY_DOWN : "moveDown",
      KEY_RIGHT : "moveRight",
      KEY_ENTER : "selectCow",
      KEY_SPACE : "selectCow",
      // mouse and touch
      CLICK : "selectCow",
      TOUCH : "selectCow",
      // gamepad
      BUTTON_A : "selectCow",
      LEFT_STICK_UP : "moveUp",
      LEFT_STICK_DOWN : "moveDown",
      LEFT_STICK_LEFT : "moveLeft",
      LEFT_STICK_RIGHT : "moveRight"
    }
  };

  var scriptQueue = [],
      numResourcesLoaded = 0,
      numResources = 0,
      executeRunning = false;

  function executeScriptQueue() {
    console.log("in :: cow.executeScriptQueue()");
    var next = scriptQueue[0],
        first, script;
    if(next && next.loaded) {
      executeRunning = true;
      scriptQueue.shift();
      first = document.getElementsByTagName("script")[0];
      script = document.createElement("script");
      script.onload = function() {
        if(next.callback) {
          next.callback();
        }
        executeScriptQueue();
      };
      script.src = next.src;
      first.parentNode.insertBefore(script, first);
    } else {
      executeRunning = false;
    }
  }

  function load(src, callback) {
    var image, queueEntry;
    numResources++;

    queueEntry = {
      src: src,
      callback: callback,
      loaded: false
    };
    scriptQueue.push(queueEntry);

    image = new Image();
    image.onload = image.onerror = function() {
      numResourcesLoaded++;
      queueEntry.loaded = true;
      if(!executeRunning) {
        executeScriptQueue();
      }
    };
    image.src = src;
  }

  function setup() {
    console.log("in :: cow.setup()");
    cow.dom.bind(document, "touchmove", function(event) {
      event.preventDefault();
    });

    if(/Android/.test(navigator.userAgent)) {
      $("html")[0].style.height = "200%";
      setTimeout(function() {
        window.scrollTo(0,1);
      }, 0);
    }

    if(isStandAlone()) {
      showScreen("splash-screen");
    } else {
      showScreen("install-screen");
    }
  }

  function showScreen(screenId) {
    var dom = cow.dom,
      $ = dom.$,
      activeScreen = $("#game .screen.active")[0],
      screen = $("#" + screenId) [0];
    if(!cow.screens[screenId]) {
      alert("This module is not implemented yet");
      return;
    }
    if(activeScreen) {
      dom.removeClass(activeScreen, "active");
    }
    dom.addClass(screen, "active");
    cow.screens[screenId].run();
  }

  function isStandAlone() {
    return (window.navigator.standalone !== false);
  }

  function getLoadProgress() {
    return numResourcesLoaded / numResources;
  }

  return {
    load : load,
    setup : setup,
    showScreen : showScreen,
    screens : {},
    isStandAlone : isStandAlone,
    settings : settings,
    getLoadProgress : getLoadProgress
  }

}) ();
