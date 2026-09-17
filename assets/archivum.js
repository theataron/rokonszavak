/* Az archívum kártyáira ráírja, melyiket játszottad már. */
(function () {
  var store;
  try { store = JSON.parse(localStorage.getItem("rokonszavak-v1") || "{}"); } catch (e) { store = {}; }
  var prog = store.progress || {}, arch = store.archivDone || {};
  Array.prototype.forEach.call(document.querySelectorAll(".arch-kartya"), function (card) {
    var id = card.dataset.feladvany;
    var st = (arch[id] && arch[id].status) || (prog[id] && prog[id].status !== "playing" && prog[id].status);
    if (!st) return;
    card.dataset.allapot = st === "won" ? "megfejtve" : "nem-sikerult";
    var sub = card.querySelector(".arch-alcim");
    if (sub) sub.textContent += st === "won" ? " · megfejtetted" : " · nem sikerült";
  });
})();
