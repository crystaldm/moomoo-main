// board module

cow.board = (function() {
  var settings,
      cows,
      cols,
      rows,
      baseScore,
      numCowTypes;

    function initialize(callback) {
      console.log("in initialize");
      settings = cow.settings;
      numCowTypes = settings.numCowTypes;
      baseScore = settings.baseScore;
      cols = settings.cols;
      rows = settings.rows;
      fillBoard();

      if(callback) {
        callback();
      }
    }

    function fillBoard() {
      console.log("in :: fillBoard()");
        var x, y,
            type;
        cows = [];
        for (x = 0; x < cols; x++) {
            cows[x] = [];
            for (y = 0; y < rows; y++) {
                type = randomCow();
                while ((type === getCow(x-1, y) &&
                        type === getCow(x-2, y)) ||
                       (type === getCow(x, y-1) &&
                        type === getCow(x, y-2))) {
                    type = randomCow();
                }
                cows[x][y] = type;
            }
        }
        if (!hasMoves()) {
            fillBoard();
        }
    }

    function randomCow() {
      return Math.floor(Math.random() * numCowTypes);
    }

    function getCow(x, y) {
        if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
            return -1;
        } else {
            return cows[x][y];
        }
    }

    function checkChain(x, y) {
      console.log("in :: checkChain()");
      var type = getCow(x, y),
          left = 0, right = 0,
          down = 0, up = 0;
      // look right
      while (type === getCow(x + right + 1, y)) {
          right++;
      }
      // look left
      while (type === getCow(x - left - 1, y)) {
          left++;
      }
      // look up
      while (type === getCow(x, y + up + 1)) {
          up++;
      }
      // look down
      while (type === getCow(x, y - down - 1)) {
          down++;
      }
      return Math.max(left + 1 + right, up + 1 + down);
  }

  function canSwap(x1, y1, x2, y2) {
    var type1 = getCow(x1, y1);
        type2 = getCow(x2, y2);
    var chain;

    if(!isAdjacent(x1, y1, x2, y2)) {
      return false;
    }

    cows[x1][y1] = type2;
    cows[x2][y2] = type1;

    chain = (checkChain(x2, y2) > 2 ||
            checkChain(x1, y1) > 2);

    cows[x1][y1] = type1;
    cows[x2][y2] = type2;

    return chain;
  }

  function isAdjacent(x1, y1, x2, y2) {
    var dx = Math.abs(x1 - x2),
        dy = Math.abs(y1 - y2);
    return (dx + dy === 1);
  }

  function getChains() {
    var x, y,
        chains = [];

    for(x = 0; x < cols; x++) {
      chains[x] = [];
      for(y = 0; y < rows; y++) {
        chains[x][y] = checkChain(x,y);
      }
    }
    return chains;
  }

  function check(events) {
      var chains = getChains(),
          hadChains = false, score = 0,
          removed = [], moved = [], gaps = [],
          x, y;

      for (x = 0; x < cols; x++) {
          gaps[x] = 0;
          for (y = rows-1; y >= 0; y--) {
              if (chains[x][y] > 2) {
                  hadChains = true;
                  gaps[x]++;
                  removed.push({
                      x : x, y : y,
                      type : getCow(x, y)
                  });
                  // add points to score
                  score += baseScore *
                           Math.pow(2, (chains[x][y] - 3));

              } else if (gaps[x] > 0) {
                  moved.push({
                      toX : x, toY : y + gaps[x],
                      fromX : x, fromY : y,
                      type : getCow(x, y)
                  });
                  cows[x][y + gaps[x]] = getCow(x, y);
              }
          }
      }

      for (x = 0; x < cols; x++) {
          // fill from top
          for (y = 0; y < gaps[x]; y++) {
              cows[x][y] = randomCow();
              moved.push({
                  toX : x, toY : y,
                  fromX : x, fromY : y - gaps[x],
                  type : cows[x][y]
              });
          }
      }

      events = events || [];

      if (hadChains) {
          events.push({
              type : "remove",
              data : removed
          }, {
              type : "score",
              data : score
          }, {
              type : "move",
              data : moved
          });

          // refill if no more moves
          if (!hasMoves()) {
              fillBoard();
              events.push({
                  type : "refill",
                  data : getBoard()
              });
          }

          return check(events);
      } else {
          return events;
      }
  }

  function swap(x1, y1, x2, y2, callback) {
      var tmp,
          events;

      if (canSwap(x1, y1, x2, y2)) {

          // swap the cows
          tmp = getCow(x1, y1);
          cows[x1][y1] = getCow(x2, y2);
          cows[x2][y2] = tmp;

          // check the board and get list of events
          events = check();

          callback(events);
      } else {
          callback(false);
      }
  }

  function hasMoves() {
      for (var x = 0; x < cols; x++) {
          for (var y = 0; y < rows; y++) {
              if (canCowMove(x, y)) {
                  return true;
              }
          }
      }
      return false;
  }

  function canCowMove(x,y) {
    return((x > 0 && canSwap(x, y, x-1, y)) ||
           (x < cols-1 && canSwap(x, y, x+1, y)) ||
           (y > 0 && canSwap(x, y, x, y-1)) ||
           (y < rows-1 && canSwap(x, y, x, y+1)));
  }

  function getBoard() {
      var copy = [],
          x;
      for (x = 0; x < cols; x++) {
          copy[x] = cows[x].slice(0);
      }
      return copy;
  }

  function print() {
    console.log("in :: cow.board.print()");
      var str = "";
      for (var y = 0; y < rows; y++) {
        console.log("in print for loop");
          for (var x = 0; x < cols; x++) {
              str += getCow(x, y) + " ";
          }
          str += "\r\n";
      }
      console.log(str);
  }

  return {
      initialize : initialize,
      swap : swap,
      canSwap : canSwap,
      getBoard : getBoard,
      print : print
  };

}) ();
