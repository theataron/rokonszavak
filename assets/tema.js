/* Világos / sötét mód + a statisztika gomb azokon az oldalakon, ahol nincs játék. */
(function () {
  var btn = document.getElementById("btn-theme");
  function label() {
    if (!btn) return;
    var dark = document.documentElement.dataset.theme === "dark";
    var t = dark ? "Világos mód bekapcsolása" : "Sötét mód bekapcsolása";
    btn.setAttribute("aria-label", t); btn.title = t;
  }
  if (btn) {
    btn.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("rokonszavak-tema", next); } catch (e) {}
      label();
    });
    label();
  }
  var stats = document.getElementById("btn-stats");
  if (stats && !document.getElementById("dialog")) {
    stats.addEventListener("click", function () { location.href = "/?stat=1"; });
  }
})();
