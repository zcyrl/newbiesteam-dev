(function () {
  "use strict";
  /* Twelve canonical themes — each drives the full element palette via CSS custom properties.
     "light" (legacy Parchment) is kept as an invisible fallback for existing users. */
  var THEMES = {
    dark:       { scheme: "dark",  meta: "#1f1e1c" },
    amoled:     { scheme: "dark",  meta: "#000000" },
    mocha:      { scheme: "dark",  meta: "#1d1712" },
    midnight:   { scheme: "dark",  meta: "#0e1320" },
    forest:     { scheme: "dark",  meta: "#111812" },
    dracula:    { scheme: "dark",  meta: "#282a36" },
    macchiato:  { scheme: "dark",  meta: "#24273a" },
    everforest: { scheme: "dark",  meta: "#2d353b" },
    ayu:        { scheme: "dark",  meta: "#0b0e14" },
    cobalt:     { scheme: "dark",  meta: "#122633" },
    carbonfox:  { scheme: "dark",  meta: "#161726" },
    latte:      { scheme: "light", meta: "#f7f2e9" },
    light:      { scheme: "light", meta: "#faf9f5" }
  };
  function applyTheme(id) {
    var cfg = THEMES[id];
    if (!cfg) return false;
    var root = document.documentElement;
    root.setAttribute("data-theme", id);
    root.setAttribute("data-scheme", cfg.scheme);
    var m = document.getElementById("meta-theme");
    if (m) m.setAttribute("content", cfg.meta);
    return true;
  }
  try {
    var saved = null;
    try { saved = localStorage.getItem("nb-theme"); } catch (e) {}
    if (!saved || !applyTheme(saved)) {
      var cur = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(THEMES[cur] ? cur : "dark");
    }
  } catch (e) {
    try { applyTheme("dark"); } catch (e2) {}
  }
  window.__NBT_THEMES__ = { ids: Object.keys(THEMES), meta: THEMES, apply: applyTheme };
})();
