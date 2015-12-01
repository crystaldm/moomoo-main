// input module
cow.input = (function() {
  var keys = {
    37 : "KEY_LEFT",
    38 : "KEY_UP",
    39 : "KEY_RIGHT",
    40 : "KEY_DOWN",
    13 : "KEY_ENTER",
    32 : "KEY_SPACE",
    65 : "KEY_A",
    66 : "KEY_B",
    67 : "KEY_C",
    88 : "KEY_X",
    89 : "KEY_Y",
    90 : "KEY_Z"
  };

  var inputHandlers;

  function initialize() {
    var gpStates;
    var gpPoller;
    var controls = cow.settings.controls;

    var dom = cow.dom,
        $ = dom.$,
        controls = cow.settings.controls,
        board = $("#game-screen .game-board")[0];

    inputHandlers = {};

    dom.bind(board, "mousedown", function(event) {
      handleClick(event, "CLICK", event);
    });

    dom.bind(board, "touchstart", function(event) {
      handleClick(event, "TOUCH", event.targetTouches[0]);
    });

    dom.bind(document, "keydown", function(event) {
      var keyName = keys[event.keyCode];
      if(keyName && controls[keyName]) {
        event.preventDefault();
        trigger(controls[keyName]);
      }
    });

    if(getGamepads()) {
      gpStates = [];
      if(!gpPoller) {
        gpPoller = setInterval(pollGamepads, 1000/60);
        window.addEventListener("gamepadconnected", function(){}, false)
      }
    }
  }

  function updateGamepadState(gamepad) {
    var state = gpStates[gamepad.index];
    for (var i = 0; i < gamepad.buttons.length; i++) {
      if(gamepad.buttons[i] != state.buttons[i]) {
        state.buttons[i] = gamepad.buttons[i];
        if(state.buttons[i]) {
          gamepadButtonDown(gamepad, i);
        }
      }
    }
    for (var i = 0; i < gamepad.axes.length; i++) {
      if(gamepad.axes[i] != state.axes[i]) {
        gamepadAxisChange(gamepad, i, state.axes[i]);
      }
    }
  }

  function gamepadButtonDown(gamepad, buttonIndex) {
    var gpButtons = {
      0: "BUTTON_A"
    },
    controls = cow.settings.controls,
    button = gpButtons[buttonIndex];
    if(button && controls[button]) {
      trigger(controls[button]);
    }
  }

  function gamepadAxisChange(gamepad, axisIndex, axisValue) {
    var controls = cow.settings.controls,
        controlName;
    if(axisIndex === 0 && axisValue === -1) {
        controlName = "LEFT_STICK_LEFT";
    } else if(axisIndex === 0 && axisValue === 1) {
        controlName === "LEFT_STICK_RIGHT";
    } else if(axisIndex === 1 && axisValue === -1) {
        controlName = "LEFT_STICK_UP";
    } else if(axisIndex === 1 && axisValue === 1) {
        controlName = "LEFT_STICK_DOWN";
    }
    if(controlName && controls[controlName]) {
      trigger(controls[controlName]);
    }
  }

  function getGamepads() {
    if(navigator.gamepads) {
      return navigator.gamepads;
    } else if(navigator.getGamepads) {
        return navigator.getGamepads();
    } else if(navigator.webkitGetGamepads) {
        return navigator.webkitGetGamepads();
    }
  }

  function pollGamepads() {

  }

  function gamepadConnected() {

  }

  function gamepadDisconnected() {

  }

  function bind(action, handler) {
    if(!inputHandlers[action]) {
      inputHandlers[action] = [];
    }
    inputHandlers[action].push(handler);
  }

  function trigger(action) {
    var handlers = inputHandlers[action],
        args = Array.prototype.slice.call(arguments, 1);
    console.log("Game action:" + action);
    if(handlers) {
      for(var i = 0; i < handlers.length; i++) {
        handlers[i].apply(null, args);
      }
    }
  }

  function handleClick(event, control, click) {
    var settings = cow.settings,
        action = settings.controls[control];
    if(!action) {
      return;
    }

    var board = cow.dom.$("#game-screen .game-board")[0],
        rect = board.getBoundingClientRect(),
        relX, relY,
        cowX, cowY;

    relX = click.clientX - rect.left;
    relY = click.clientY - rect.top;
    cowX = Math.floor(relX / rect.width * settings.cols);
    cowY = Math.floor(relY / rect.height * settings.cols);
    trigger(action, cowX, cowY);
    event.preventDefault();
  }

  return {
    initialize : initialize,
    bind : bind
  }
}) ();
