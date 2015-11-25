// game screen module

cow.screens["game-screen"] = (function() {
  var firstRun = true;

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
    console.log("in :: startGame()");
    console.log("Game ON");
    var board = cow.board,
        display = cow.display;
    board.initialize(function() {
      display.initialize(function() {
        //start the game
        display.redraw(board.getBoard(), function() {
        });
      });
    });
    paused = false;
    var dom = cow.dom,
      overlay = dom.$("#game-screen .pause-overlay")[0];
    overlay.style.display = "none";
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

  function setup() {
    var dom = cow.dom;
    dom.bind("footer button.exit", "click", exitGame);
    dom.bind("footer button.pause", "click", pauseGame);
    dom.bind(".pause-overlay", "click", resumeGame);
    cow.input.initialize();
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
