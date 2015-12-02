// game screen module

cow.screens["game-screen"] = (function() {
  var firstRun = true,
      paused,
      pauseStart,
      cursor,
      gameState = {
          // game state variables
      };

  function setLevelTimer(reset) {
      var $ = cow.dom.$;
      if (gameState.timer) {
          clearTimeout(gameState.timer);
          gameState.timer = 0;
      }
      if (reset) {
          gameState.startTime = Date.now();
          gameState.endTime =
              cow.settings.baseLevelTimer *
              Math.pow(gameState.level,
                       -0.05 * gameState.level);
      }
      var delta = gameState.startTime +
                  gameState.endTime - Date.now(),
          percent = (delta / gameState.endTime) * 100,
          progress = $("#game-screen .time .indicator")[0];
      if (delta < 0) {
          cow.display.gameOver();
      } else {
          progress.style.width = percent + "%";
          gameState.timer = setTimeout(setLevelTimer, 30);
      }
  }

  function startGame() {
      var board = cow.board,
          display = cow.display;
      gameState = {
          level : 0,
          score : 0,
          timer : 0, // setTimeout reference
          startTime : 0, // time at start of level
          endTime : 0 // time to game over
      };
      updateGameInfo();
      board.initialize(function() {
          display.initialize(function() {
              cursor = {
                  x : 0,
                  y : 0,
                  selected : false
              };
              display.redraw(board.getBoard(), function() {
                  advanceLevel();
              });
          });
      });
      paused = false;
      var overlay = cow.dom.$("#game-screen .pause-overlay")[0];
      overlay.style.display = "none";
  }

  function updateGameInfo() {
      var $ = cow.dom.$;
      $("#game-screen .score span")[0].innerHTML =
          gameState.score;
      $("#game-screen .level span")[0].innerHTML =
          gameState.level;
  }

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

  function pauseGame() {
    console.log("Game PAUSED");
      if (paused) {
          return; // do nothing if already paused
      }
      var dom = cow.dom,
          overlay = dom.$("#game-screen .pause-overlay")[0];
      overlay.style.display = "block";
      paused = true;
      pauseStart = Date.now();
      clearTimeout(gameState.timer);
      cow.display.pause();
  }

  function resumeGame() {
    console.log("Game ON");
      var dom = cow.dom,
          overlay = dom.$("#game-screen .pause-overlay")[0];
      overlay.style.display = "none";
      paused = false;
      var pauseTime = Date.now() - pauseStart;
      gameState.startTime += pauseTime;
      setLevelTimer();
      cow.display.resume(pauseTime);
  }

  function setCursor(x, y, select) {
    cursor.x = x;
    cursor.y = y;
    cursor.selected = select;
    cow.display.setCursor(x, y, select);
  }

  function selectCow(x, y) {
    if (paused) {
        return;
    }
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
      if (events.length > 0) {
          var boardEvent = events.shift(),
              next = function() {
                  playBoardEvents(events);
              };
          switch (boardEvent.type) {
              case "move" :
                  display.moveCows(boardEvent.data, next);
                  break;
              case "remove" :
                  display.moveCows(boardEvent.data, next);
                  break;
              case "refill" :
                  announce("No moves!");
                  display.refill(boardEvent.data, next);
                  break;
              case "score" : // new score event
                  addScore(boardEvent.data);
                  next();
                  break;
              default :
                  next();
                  break;
          }
      } else {
          display.redraw(cow.board.getBoard(), function() {
              // good to go again
          });
      }
  }

  function addScore(points) {
      var settings = cow.settings,
          nextLevelAt = Math.pow(
              settings.baseLevelScore,
              Math.pow(settings.baseLevelExp, gameState.level-1)
          );
      gameState.score += points;
      if (gameState.score >= nextLevelAt) {
          advanceLevel();
      }
      updateGameInfo();
  }

  function advanceLevel() {
      gameState.level++;
      announce("Level " + gameState.level);
      updateGameInfo();
      gameState.startTime = Date.now();
      gameState.endTime = cow.settings.baseLevelTimer *
          Math.pow(gameState.level, -0.05 * gameState.level);
      setLevelTimer(true);
      cow.display.levelUp();
  }

  function announce(str) {
      var dom = cow.dom,
          $ = dom.$,
          element = $("#game-screen .announcement")[0];
      element.innerHTML = str;
      dom.removeClass(element, "zoomfade");
      setTimeout(function() {
          dom.addClass(element, "zoomfade");
      }, 1);
  }

  function moveCursor(x, y) {
    if (paused) {
        return;
    }
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
