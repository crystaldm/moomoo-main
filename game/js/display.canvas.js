// game canvas module

cow.display = (function() {
  var canvas, ctx, cols, cowSize, cowSprite,
  firstRun = true;

  function createBackground() {
    var background = document.createElement("canvas"),
        bgctx = background.getContext("2d");

    cow.dom.addClass(background, "background");
    background.width = cols * cowSize;
    background.height = rows * cowSize;

    bgctx.fillStyle = "rgba(225, 235, 255, 0.15)";
    for(var x = 0; x < cols; x++) {
      for(var y = 0; y < cols; y++) {
        if((x+y) % 2) {
          bgctx.fillRect (
            x * cowSize, y * cowSize,
            cowSize, cowSize
          );
        }
      }
    }
    return background;
  }

  function setup() {
    var $ = cow.dom.$,
        boardElement = $("#game-screen .game-board")[0];

    cols = cow.settings.cols;
    rows = cow.settings.rows;

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    cow.dom.addClass(canvas, "board");

    var rect = boardElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    cowSize = rect.width / cols;

    boardElement.appendChild(canvas);
    boardElement.appendChild(createBackground());
    boardElement.appendChild(canvas);
  }

  function initialize(callback) {
    if(firstRun) {
      setup();
      cowSprite = new Image();
      cowSprite.addEventListener("load", callback, false);
      cowSprite.src = "imgs/cows" + cowSize + ".png";
      firstRun = false;
    }
    callback();
  }

  function drawCow(type, x, y) {
    console.log("in :: drawCow()");
    ctx.drawImage(cowSprite, type * cowSize, 0, cowSize, cowSize, x * cowSize, y * cowSize, cowSize, cowSize);
  }

  function redraw(newCows, callback) {
    console.log("in :: redrawCow()");
    var x, y;
    cows = newCows;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(x = 0; x < cols; x++) {
      for(y = 0; y < rows; y++) {
        drawCow(cows[x][y], x, y);
      }
    }
    callback();
  }

  return {
      initialize : initialize,
      redraw : redraw
  };

}) ();
