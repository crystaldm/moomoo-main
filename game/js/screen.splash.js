// splash screen module

cow.screens["splash-screen"] = (function() {
  var firstRun = true;

  function checkProgress() {
    var $ = cow.dom.$,
        p = cow.getLoadProgress() * 100;
        $("#splash-screen .indicator")[0].style.width = p + "%";

        if (p == 100) {
          setup();
        } else {
          setTimeout(checkProgress, 30);
        }
  }

  function setup() {
    var dom = cow.dom,
          $ = dom.$,
          screen = $("#splash-screen")[0];
    $(".continue",screen)[0].style.display = "block";
    cow.dom.bind("#splash-screen", "click", function() {
      cow.showScreen("main-menu");
    });
  }

  function run() {
    if(firstRun) {
      checkProgress();
      firstRun = false;
    }
  }

  return {
    run : run
  };

}) ();
