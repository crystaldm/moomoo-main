// board module

cow.board = (function() {
  var settings,
      cows,
      cols,
      rows,
      baseScore,
      numCowTypes;

    function initialize() {
      settings = cow.settings;
      numCowTypes = settings.numCowTypes;
      baseScore = settings.baseScore;
      cols = settings.cols;
      rows = settings.rows;
      fillBoard();
    }

    function fillBoard() {

    }

    function getCow() {

    }

    function print() {
      var str = "";
      for(var y = 0; y  < rows; y++) {
        for(var x = 0; x < cols; x++) {
          str += getCow(x,y) + " ";
        }
        str += "\r\n";
      }
      console.log(str);
    }
  return {
    initialize : initialize,
    print : print
  }

}) ();
