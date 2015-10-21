// main menu module

cow.screens["main-menu"] = (function() {
  var dom = cow.dom;
  firstRun = true;

  function setup() {
    dom.bind("#main-menu ul.menu", "click", function(e) {
      if(e.target.nodeName.toLowerCase() === "button") {
        var action = e.target.getAttribute("name");
        cow.showScreen(action);
      }
    });
  }

  function run() {
    if(firstRun) {
      setup();
      firstRun = false;
    }
  }

  return {
    run : run
  };

}) ();
