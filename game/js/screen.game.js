// game screen module

cow.screens["game-screen"] = (function() {
  var gameState;
  var firstRun = true,
      paused,
      cursor;

  function exitGame() {
    console.log("in :: exitGame()");
    pauseGame();
    var confirmed = window.confirm("Do you really wanna exit? Are you sure?");
    if(confirmed) {
      cow.showScreen("main-menu");
    } else {
      resumeGame();
    }
  }

  function startGame() {
    console.log("Game ON");
    var board = cow.board,
        display = cow.display;
    gameState = {
      level : 0,
      score : 0,
      timer : 0,
      startTime : 0,
      endTime : 0
    };
    updateGameInfo();
    board.initialize(function() {
      display.initialize(function() {
        cursor = {
          x : 0,
          y : 0,
          selection : false
        }
        display.redraw(board.getBoard(), function() {
        });
      });
    });

    paused = false;
    var dom = cow.dom,
      overlay = dom.$("#game-screen .pause-overlay")[0];
    overlay.style.display = "none";
  }

  function updateGameInfo() {
    var $ = cow.dom.$;
    $("#game-screen .score span")[0].innerHTML = gameState.score;
    $("game-screen .level span")[0].innerHTML = gameState.level;
  }

  function pauseGame() {
    console.log("Game PAUSED");
    if(paused) {
      return;
    }
    paused = true;
    var dom = cow.dom,
      overlay = dom.$("#game-screen .pause-overlay")[0];
    overlay.style.display = "block";
  }

  function resumeGame() {
    console.log("Game ON");
    paused = false;
    var dom = cow.dom,
      overlay = dom.$("#game-screen .pause-overlay")[0];
    overlay.style.display = "none";
  }

  function setCursor(x, y, select) {
    cursor.x = x;
    cursor.y = y;
    cursor.selected = select;
    cow.display.setCursor(x, y, select);
  }

  function selectCow(x, y) {
    if(arguments.length === 0) {
      selectCow(cursor.x, cursor.y);
      return;
    }
    if(cursor.selected) {
      var dx = Math.abs(x - cursor.x),
          dy = Math.abs(y - cursor.y),
          dist = dx + dy;
      if(dist === 0) {
        setCursor(x, y, false);
      } else if(dist == 1) {
          cow.board.swap(cursor.x, cursor.y, x, y, playBoardEvents);
          setCursor(x, y, false);
      } else {
          setCursor(x, y, true);
      }
    } else {
      setCursor(x, y, true);
    }
  }

  function playBoardEvents(events) {
    var display = cow.display;
    if(events.length > 0) {
      var boardEvent = events.shift(),
          next = function() {
            playBoardEvents(events);
          };
      switch (boardEvent.type) {
        case "move":
          display.moveCows(boardEvent.data, next);
          break;
        case "remove":
          display.removeCows(boardEvent.data, next);
          break;
        case "refill":
          display.refill(boardEvent.data, next);
          break;
        default:
          next();
          break;
      }
    } else {
      display.redraw(cow.board.getBoard(), function() {
        //good to go again
      });
    }
  }

  function moveCursor(x, y) {
    var settings = cow.settings;
    if(cursor.selected) {
      x += cursor.x;
      y += cursor.y;
      if(x >= 0 && x < settings.cols && y >= 0 && y < settings.rows) {
        selectCow(x, y);
      }
    } else {
      x = (cursor.x + x + settings.cols) % settings.cols;
      y = (cursor.y + y + settings.rows) % settings.rows;
      setCursor(x, y, false);
    }
  }

  function moveUp() {
    moveCursor(0, -1);
  }

  function moveDown() {
    moveCursor(0, 1);
  }

  function moveLeft() {
    moveCursor(-1, 0);
  }

  function moveRight() {
    moveCursor(1, 0);
  }

  function setup() {
    var dom = cow.dom;
    dom.bind("footer button.exit", "click", exitGame);
    dom.bind("footer button.pause", "click", pauseGame);
    dom.bind(".pause-overlay", "click", resumeGame);
    cow.input.initialize();

    var input = cow.input;
    input.initialize();
    input.bind("selectCow", selectCow);
    input.bind("moveUp", moveUp);
    input.bind("moveDown", moveDown);
    input.bind("moveLeft", moveLeft);
    input.bind("moveRight", moveRight);
  }

  function run() {
    if(firstRun) {
      setup();
      firstRun = false;
    }
    startGame();
  }

  return {
    run : run
  };

}) ();
