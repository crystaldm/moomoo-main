// game screen module

cow.screens["game-screen"] = (function() {
  var firstRun = true;

  function startGame() {
    var board = cow.board,
        display = cow.display;
    board.initialize(function() {
      display.initialize(function() {
        //start the game
        display.redraw(board.getBoard(), function() {

        });
      });
    });
  }

  function setup() {

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
