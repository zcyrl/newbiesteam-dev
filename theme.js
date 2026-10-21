(function () {
  "use strict";
  try {
    var t = localStorage.getItem("nb-theme");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
      var m = document.getElementById("meta-theme");
      if (m) m.setAttribute("content", t === "light" ? "#faf9f5" : "#1f1e1c");
    }
  } catch (e) {}
})();
