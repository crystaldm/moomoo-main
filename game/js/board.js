// board module

cow.board = (function() {
  var settings,
      cows,
      cols,
      rows,
      baseScore,
      numCowTypes;

    function initialize(callback) {
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
      var x, y;
          type;
      cows = [];
      for(x = 0; x < cols; x++) {
        cows[x] = [];
        for(y = 0; y < rows; y++) {
          cows[x][y] = randomCow();
          while ((type === getCow(x-1, y) &&
                  type === getCow(x-2, y)) ||
                 (type === getCow(x, y-1) &&
                  type === getCow(x, y-2))) {
          }
          cows[x][y] = type;
        }
      }
    }

    function randomCow() {
      return Math.floor(Math.random() * numCowTypes);
    }

    function getCow(x,y) {
      if(x < 0 || x > cols-1 || y < 0 || y > rows-1) {
        return -1;
      } else {
        return cows[x][y];
      }
    }

    function checkChain(x,y) {
      var type = getcow(x, y),
          left = 0, right = 0,
          down = 0, up = 0;
      // look right
      while (type === getcow(x + right + 1, y)) {
          right++;
      }
      // look left
      while (type === getcow(x - left - 1, y)) {
          left++;
      }
      // look up
      while (type === getcow(x, y + up + 1)) {
          up++;
      }
      // look down
      while (type === getcow(x, y - down - 1)) {
          down++;
      }
      return Math.max(left + 1 + right, up + 1 + down);
  }

  function canSwap(x1, y1, x2, y2) {
    var type1 = getcow(x1, y1)
        type2 = getcow(x2, y2);
        chain;

    if(!isAdjacent(x1, y1, x2, y2)) {
      return false;
    }

    cows[x1][y1] = type2;
    cows[x2][y2] = type1;

    chain = (checkChain(x2, y2) > 2 ||
            checkChain(x1, y1) > 2);

    cows[x1][y1] = type1;
    cows[x2][y2] = type2;
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

  function check() {
    var chains = getChains(),
        hadChains = false, score = 0,
        removed = [], moved = [], gaps = [];

    for(var x = 0; x < cols; x++) {
      if(chains[x][y] > 2) {
         hadChains = true;
         gapse[x]++;
         removed.push({
           x : x, y : y,
           type : getCow(x, y)
         });
      } else if(gaps[x] > 0) {
        moved.push({
          toX : x, toY : y + gaps[x],
          fromX : x, fromY : y,
          type : getCow(x,y)
        });
        cows[x][y + gaps[x]] = getCow(x, y);
      }
    }
  }

  function isAdjacent(x1, y1, x2, y2) {
    var dx = Math.abs(x1 - x2),
        dy = Math.abs(y1 - y2);
    return (dx + dy === 1);
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
    canSwap : canSwap,
    initialize : initialize,
    print : print
  }

}) ();




// cow.board = (function() {
//     var settings,
//         cows,
//         cols,
//         rows,
//         baseScore,
//         numcowTypes;
//
//     function initialize(callback) {
//         settings = cow.settings;
//         numcowTypes = settings.numcowTypes;
//         baseScore = settings.baseScore;
//         cols = settings.cols;
//         rows = settings.rows;
//         fillBoard();
//         if (callback) {
//             callback();
//         }
//     }
//
//     function fillBoard() {
//         var x, y,
//             type;
//         cows = [];
//         for (x = 0; x < cols; x++) {
//             cows[x] = [];
//             for (y = 0; y < rows; y++) {
//                 type = randomcow();
//                 while ((type === getcow(x-1, y) &&
//                         type === getcow(x-2, y)) ||
//                        (type === getcow(x, y-1) &&
//                         type === getcow(x, y-2))) {
//                     type = randomcow();
//                 }
//                 cows[x][y] = type;
//             }
//         }
//         // try again if new board has no moves
//         if (!hasMoves()) {
//             fillBoard();
//         }
//     }
//
//     function randomcow() {
//         return Math.floor(Math.random() * numcowTypes);
//     }
//
//     function getcow(x, y) {
//         if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
//             return -1;
//         } else {
//             return cows[x][y];
//         }
//     }
//
//     // returns the number cows in the longest chain
//     // that includes (x,y)
//     function checkChain(x, y) {
//         var type = getcow(x, y),
//             left = 0, right = 0,
//             down = 0, up = 0;
//         // look right
//         while (type === getcow(x + right + 1, y)) {
//             right++;
//         }
//         // look left
//         while (type === getcow(x - left - 1, y)) {
//             left++;
//         }
//         // look up
//         while (type === getcow(x, y + up + 1)) {
//             up++;
//         }
//         // look down
//         while (type === getcow(x, y - down - 1)) {
//             down++;
//         }
//         return Math.max(left + 1 + right, up + 1 + down);
//     }
//
//     // returns true if (x1,y1) can be swapped with (x2,y2)
//     // to form a new match
//     function canSwap(x1, y1, x2, y2) {
//         var type1 = getcow(x1,y1),
//             type2 = getcow(x2,y2),
//             chain;
//
//         if (!isAdjacent(x1, y1, x2, y2)) {
//             return false;
//         }
//
//         // temporarily swap cows
//         cows[x1][y1] = type2;
//         cows[x2][y2] = type1;
//
//         chain = (checkChain(x2, y2) > 2 ||
//                  checkChain(x1, y1) > 2);
//
//         // swap back
//         cows[x1][y1] = type1;
//         cows[x2][y2] = type2;
//
//         return chain;
//     }
//
//     // returns true if (x1,y1) is adjacent to (x2,y2)
//     function isAdjacent(x1, y1, x2, y2) {
//         var dx = Math.abs(x1 - x2),
//             dy = Math.abs(y1 - y2);
//         return (dx + dy === 1);
//     }
//
//     // returns a two-dimensional map of chain-lengths
//     function getChains() {
//         var x, y,
//             chains = [];
//
//         for (x = 0; x < cols; x++) {
//             chains[x] = [];
//             for (y = 0; y < rows; y++) {
//                 chains[x][y] = checkChain(x, y);
//             }
//         }
//         return chains;
//     }
//
//     function check(events) {
//         var chains = getChains(),
//             hadChains = false, score = 0,
//             removed = [], moved = [], gaps = [],
//             x, y;
//
//         for (x = 0; x < cols; x++) {
//             gaps[x] = 0;
//             for (y = rows-1; y >= 0; y--) {
//                 if (chains[x][y] > 2) {
//                     hadChains = true;
//                     gaps[x]++;
//                     removed.push({
//                         x : x, y : y,
//                         type : getcow(x, y)
//                     });
//                     // add points to score
//                     score += baseScore *
//                              Math.pow(2, (chains[x][y] - 3));
//
//                 } else if (gaps[x] > 0) {
//                     moved.push({
//                         toX : x, toY : y + gaps[x],
//                         fromX : x, fromY : y,
//                         type : getcow(x, y)
//                     });
//                     cows[x][y + gaps[x]] = getcow(x, y);
//                 }
//             }
//         }
//
//         for (x = 0; x < cols; x++) {
//             // fill from top
//             for (y = 0; y < gaps[x]; y++) {
//                 cows[x][y] = randomcow();
//                 moved.push({
//                     toX : x, toY : y,
//                     fromX : x, fromY : y - gaps[x],
//                     type : cows[x][y]
//                 });
//             }
//         }
//
//         events = events || [];
//
//         if (hadChains) {
//             events.push({
//                 type : "remove",
//                 data : removed
//             }, {
//                 type : "score",
//                 data : score
//             }, {
//                 type : "move",
//                 data : moved
//             });
//
//             // refill if no more moves
//             if (!hasMoves()) {
//                 fillBoard();
//                 events.push({
//                     type : "refill",
//                     data : getBoard()
//                 });
//             }
//
//             return check(events);
//         } else {
//             return events;
//         }
//     }
//
//     // if possible, swaps (x1,y1) and (x2,y2) and
//     // calls the callback function with list of board events
//     function swap(x1, y1, x2, y2, callback) {
//         var tmp,
//             events;
//
//         if (canSwap(x1, y1, x2, y2)) {
//
//             // swap the cows
//             tmp = getcow(x1, y1);
//             cows[x1][y1] = getcow(x2, y2);
//             cows[x2][y2] = tmp;
//
//             // check the board and get list of events
//             events = check();
//
//             callback(events);
//         } else {
//             callback(false);
//         }
//     }
//
//     // returns true if at least one match can be made
//     function hasMoves() {
//         for (var x = 0; x < cols; x++) {
//             for (var y = 0; y < rows; y++) {
//                 if (cancowMove(x, y)) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }
//
//     // returns true if (x,y) is a valid position and if
//     // the cow at (x,y) can be swapped with a neighbor
//     function cancowMove(x, y) {
//         return ((x > 0 && canSwap(x, y, x-1 , y)) ||
//                 (x < cols-1 && canSwap(x, y, x+1 , y)) ||
//                 (y > 0 && canSwap(x, y, x , y-1)) ||
//                 (y < rows-1 && canSwap(x, y, x , y+1)));
//     }
//
//     // create a copy of the cow board
//     function getBoard() {
//         var copy = [],
//             x;
//         for (x = 0; x < cols; x++) {
//             copy[x] = cows[x].slice(0);
//         }
//         return copy;
//     }
//
//     function print() {
//         var str = "";
//         for (var y = 0; y < rows; y++) {
//             for (var x = 0; x < cols; x++) {
//                 str += getcow(x, y) + " ";
//             }
//             str += "\r\n";
//         }
//         console.log(str);
//     }
//
//     return {
//         initialize : initialize,
//         swap : swap,
//         canSwap : canSwap,
//         getBoard : getBoard,
//         print : print
//     };
// })();
