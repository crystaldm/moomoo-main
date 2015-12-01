// game canvas module

cow.display = (function() {
  var animations = [];
  var canvas, ctx, cols, rows, cows, cowSize, cowSprite, cursor, previousCycle,
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

    boardElement.appendChild(createBackground());
    boardElement.appendChild(canvas);
    previousCycle = Date.now();
    requestAnimationFrame(cycle);
  }

  function cycle() {
    var time = Date.now();
    if(animations.length === 0) {
      renderCursor(time);
    }
    renderAnimations(time, previousCycle);
    previousCycle = time;
    requestAnimationFrame(cycle);
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

  function drawCow(type, x, y, scale, rot) {
      ctx.save();
      if (typeof scale !== "undefined" && scale > 0) {
          ctx.beginPath();
          ctx.translate((x + 0.5) * cowSize, (y + 0.5) * cowSize);
          ctx.scale(scale, scale);
          if (rot) {
              ctx.rotate(rot);
          }
          ctx.translate(-(x + 0.5) * cowSize, -(y + 0.5) * cowSize);
      }
      ctx.drawImage(cowSprite,
          type * cowSize, 0, cowSize, cowSize,
          x * cowSize, y * cowSize,
          cowSize, cowSize
      );
      ctx.restore();
  }

  function redraw(newCows, callback) {
    var x, y;
    cows = newCows;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(x = 0; x < cols; x++) {
      for(y = 0; y < rows; y++) {
        drawCow(cows[x][y], x, y);
      }
    }
    callback();
    renderCursor();
  }

  function renderCursor(time) {
    if(!cursor) {
      return;
    }
    var x = cursor.x,
        y = cursor.y;
        t1 = (Math.sin(time / 200) + 1) / 2,
        t2 = (Math.sin(time / 400) + 1) / 2;

    clearCursor();

    if(cursor.selected) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter",
      ctx.globalAlpha = 0.8 * t1;
      drawCow(cows[x][y], x, y);
      ctx.restore();
    }
    ctx.save();
    ctx.lineWidth = 0.05 * cowSize;
    ctx.strokeStyle =
        "rgba(250,250,150," + (0.5 + 0.5 * t2) + ")";
    ctx.strokeRect(
        (x + 0.05) * cowSize, (y + 0.05) * cowSize,
        0.9 * cowSize, 0.9 * cowSize
    );
    ctx.restore();
  }

  function addAnimation(runTime, fncs) {
      var anim = {
        runTime : runTime,
        startTime : Date.now(),
        pos : 0,
        fncs : fncs
      };
      animations.push(anim);
  }

  function renderAnimations(time, lastTime) {
      var anims = animations.slice(0), // copy list
          n = anims.length,
          animTime,
          anim,
          i;

      // call before() function
      for (i=0;i<n;i++) {
          anim = anims[i];
          if (anim.fncs.before) {
              anim.fncs.before(anim.pos);
          }
          anim.lastPos = anim.pos;
          animTime = (lastTime - anim.startTime);
          anim.pos = animTime / anim.runTime;
          anim.pos = Math.max(0, Math.min(1, anim.pos));
      }

      animations = []; // reset animation list

      for (i=0;i<n;i++) {
          anim = anims[i];
          anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
          if (anim.pos == 1) {
              if (anim.fncs.done) {
                  anim.fncs.done();
              }
          } else {
              animations.push(anim);
          }
      }
  }

  function moveCows(movedCows, callback) {
      var n = movedCows.length,
          oldCursor = cursor;
      cursor = null;
      movedCows.forEach(function(e) {
          var x = e.fromX, y = e.fromY,
              dx = e.toX - e.fromX,
              dy = e.toY - e.fromY,
              dist = Math.abs(dx) + Math.abs(dy);
          addAnimation(200 * dist, {
              before : function(pos) {
                  pos = Math.sin(pos * Math.PI / 2);
                  clearCow(x + dx * pos, y + dy * pos);
              },
              render : function(pos) {
                  pos = Math.sin(pos * Math.PI / 2);
                  drawCow(
                      e.type,
                      x + dx * pos, y + dy * pos
                  );
              },
              done : function() {
                  if (--n == 0) {
                      cursor = oldCursor;
                      callback();
                  }
              }
          });
      });
  }

  function removeCows(removedCows, callback) {
      var n = removedCows.length;
      removedCows.forEach(function(e) {
          addAnimation(400, {
              before : function() {
                  clearCow(e.x, e.y);
              },
              render : function(pos) {
                  ctx.save();
                  ctx.globalAlpha = 1 - pos;
                  drawCow(
                      e.type, e.x, e.y,
                      1 - pos, pos * Math.PI * 2
                  );
                  ctx.restore();
              },
              done : function() {
                  if (--n == 0) {
                      callback();
                  }
              }
          });
      });
  }

  function refill(newCows, callback) {
      var lastCow = 0;
      addAnimation(1000, {
          render : function(pos) {
              var thisCow = Math.floor(pos * cols * rows),
                  i, x, y;
              for (i = lastCow; i < thisCow; i++) {
                  x = i % cols;
                  y = Math.floor(i / cols);
                  clearCow(x, y);
                  drawCow(newCows[x][y], x, y);
              }
              lastCow = thisCow;
              cow.dom.transform(canvas, "rotateX(" + (360 * pos) + "deg)");
          },
          done : function() {
              canvas.style.webkitTransform = "";
              callback();
          }
      });
  }


  function clearCursor() {
    if(cursor) {
      var x = cursor.x,
          y = cursor.y;
      clearCow(x, y);
      drawCow(cows[x][y], x, y);
    }
  }

  function setCursor(x, y, selected) {
      clearCursor();
      if (arguments.length > 0) {
          cursor = {
              x : x,
              y : y,
              selected : selected
          };
      } else {
          cursor = null;
      }
      renderCursor();
  }

  function clearCow(x, y) {
    ctx.clearRect(
      x * cowSize, y * cowSize, cowSize, cowSize
    );
  }


  return {
      initialize : initialize,
      redraw : redraw,
      setCursor : setCursor,
      moveCows : moveCows,
      removeCows : removeCows,
      refill : refill
  };

}) ();
