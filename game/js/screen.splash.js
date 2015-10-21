// splash screen module

cow.screens["splash-screen"] = (function() {
  var firstRun = true;

  function setup() {
    cow.dom.bind("#splash-screen", "click", function() {
      cow.showScreen("main-menu");
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
