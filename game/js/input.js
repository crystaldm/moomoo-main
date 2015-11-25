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
    var controls = cow.settings.controls,

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
        trigger(contols[keyName]);
      }
    });
  }

  function bind(action, handler) {

  }

  function trigger(action) {

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
