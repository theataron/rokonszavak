/* Rokonszavak – játékmotor. Két mód:
   RSZ.mode = "aktualis" : a főoldal, a heti feladvány, számít a statisztikába
   RSZ.mode = "archiv"   : egy régi feladvány aloldala, NEM számít a statisztikába */
(function () {
  var CFG = window.RSZ || { mode: "aktualis" };
  var PUZZLES = (window.FELADVANYOK || []).slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  var MAX_MISTAKES = 4;
  var STORAGE_KEY = "rokonszavak-v1";
  var MONTHS = ["január","február","március","április","május","június","július","augusztus","szeptember","október","november","december"];
  var DAYS = ["vasárnap","hétfő","kedd","szerda","csütörtök","péntek","szombat"];
  var $ = function (id) { return document.getElementById(id); };

  function parseDate(s) { var p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function formatWeek(start) {
    var end = addDays(start, 6);
    if (start.getMonth() === end.getMonth()) return MONTHS[start.getMonth()] + " " + start.getDate() + "–" + end.getDate() + ".";
    return MONTHS[start.getMonth()] + " " + start.getDate() + ". – " + MONTHS[end.getMonth()] + " " + end.getDate() + ".";
  }
  function formatDay(d) { return MONTHS[d.getMonth()] + " " + d.getDate() + "."; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- tárolás ---------- */
  function freshStore() {
    return { progress: {}, archiv: {}, archivDone: {}, stats: { played: 0, wins: 0, lost: 0, streak: 0, best: 0, lastWonId: null, dist: [0, 0, 0, 0] } };
  }
  function loadStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return freshStore();
      var d = JSON.parse(raw), base = freshStore();
      return { progress: d.progress || {}, archiv: d.archiv || {}, archivDone: d.archivDone || {}, stats: Object.assign(base.stats, d.stats || {}) };
    } catch (e) { return freshStore(); }
  }
  var store = loadStore();

  /* ---------- melyik feladvány ---------- */
  var params = new URLSearchParams(location.search);
  if (params.has("reset")) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    location.replace(location.pathname);
  }
  var now = new Date();
  var currentPuzzle = null;
  for (var i = 0; i < PUZZLES.length; i++) { if (parseDate(PUZZLES[i].start) <= now) currentPuzzle = PUZZLES[i]; }

  var testId = parseInt(params.get("teszt"), 10);
  var testMode = CFG.mode === "aktualis" && PUZZLES.some(function (p) { return p.id === testId; });
  var archive = CFG.mode === "archiv";
  var puzzle, isPreview = false;

  if (archive) {
    puzzle = PUZZLES.filter(function (p) { return p.id === CFG.id; })[0];
  } else if (testMode) {
    puzzle = PUZZLES.filter(function (p) { return p.id === testId; })[0];
  } else if (currentPuzzle) {
    puzzle = currentPuzzle;
  } else {
    puzzle = PUZZLES[0]; isPreview = true;
  }
  if (!puzzle || !$("grid")) return;

  var isLivePuzzle = currentPuzzle && puzzle.id === currentPuzzle.id;
  var countsForStats = !archive && !testMode;
  var nextPuzzle = null;
  for (var j = 0; j < PUZZLES.length; j++) {
    var st = parseDate(PUZZLES[j].start);
    if (st > now && (isPreview || !currentPuzzle || PUZZLES[j].id !== currentPuzzle.id)) { nextPuzzle = PUZZLES[j]; break; }
  }

  function slot() { return archive ? store.archiv : store.progress; }
  function save() {
    if (testMode) return;
    slot()[puzzle.id] = state;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) {}
  }

  /* ---------- állapot ---------- */
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var allWords = [];
  puzzle.groups.forEach(function (g) { allWords = allWords.concat(g.words); });
  function newState() { return { order: shuffle(allWords), solved: [], mistakes: 0, guesses: [], status: "playing" }; }

  var mainDone = store.progress[puzzle.id] && store.progress[puzzle.id].status !== "playing";
  var archDone = store.archivDone[puzzle.id];
  var state = testMode ? newState() : (slot()[puzzle.id] || newState());
  var selected = [];

  /* ---------- megjelenítés ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2400);
  }
  function familyCard(group, animate) {
    var card = document.createElement("section");
    card.className = "family" + (animate ? " animate" : "");
    card.dataset.level = group.level;
    card.setAttribute("aria-label", group.level + ". szint: " + group.title);
    var pips = [1, 2, 3, 4].map(function (n) { return '<i class="pip' + (n <= group.level ? " on" : "") + '"></i>'; }).join("");
    card.innerHTML =
      '<div class="family-head"><h2 class="family-title">' + esc(group.title) + '</h2><span class="pips" aria-hidden="true">' + pips + '</span></div>' +
      '<div class="tree" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
      '<p class="family-words">' + group.words.map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("") + "</p>" +
      (group.note ? '<p class="family-note">' + esc(group.note) + "</p>" : "");
    return card;
  }
  function render(newlySolved) {
    var fam = $("families");
    fam.innerHTML = "";
    state.solved.forEach(function (i) { fam.appendChild(familyCard(puzzle.groups[i], i === newlySolved)); });
    if (state.status === "lost") {
      puzzle.groups.forEach(function (g, i) { if (state.solved.indexOf(i) === -1) fam.appendChild(familyCard(g, true)); });
    }
    var solvedWords = [];
    state.solved.forEach(function (i) { solvedWords = solvedWords.concat(puzzle.groups[i].words); });
    var grid = $("grid");
    grid.innerHTML = "";
    if (state.status === "playing") {
      state.order.filter(function (w) { return solvedWords.indexOf(w) === -1; }).forEach(function (word) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "tile"; b.textContent = word;
        b.dataset.word = word; b.dataset.len = word.length;
        b.setAttribute("aria-pressed", selected.indexOf(word) > -1 ? "true" : "false");
        b.addEventListener("click", function () { toggle(word, b); });
        grid.appendChild(b);
      });
    }
    var left = MAX_MISTAKES - state.mistakes;
    $("lives").innerHTML = Array.apply(null, { length: MAX_MISTAKES }).map(function (_, i) { return '<i class="life' + (i >= left ? " used" : "") + '"></i>'; }).join("");
    $("lives").setAttribute("aria-label", left + " tévedés van hátra");
    var over = state.status !== "playing";
    $("status").hidden = over; $("controls").hidden = over; $("end").hidden = !over;
    if (over) {
      $("end-text").textContent = state.status === "won"
        ? (state.mistakes === 0 ? "Megfejtetted, hiba nélkül!" : "Megfejtetted, " + state.mistakes + " tévedéssel.")
        : "Most nem jött össze. Fent látod a megoldást.";
    }
    updateButtons();
  }
  function updateButtons() {
    $("btn-submit").disabled = selected.length !== 4;
    $("btn-deselect").disabled = selected.length === 0;
  }

  /* ---------- játék ---------- */
  function toggle(word, button) {
    if (state.status !== "playing") return;
    var idx = selected.indexOf(word);
    if (idx > -1) selected.splice(idx, 1);
    else {
      if (selected.length >= 4) { toast("Egyszerre négy szót jelölhetsz ki."); return; }
      selected.push(word);
    }
    button.setAttribute("aria-pressed", selected.indexOf(word) > -1 ? "true" : "false");
    updateButtons();
  }
  function submit() {
    if (selected.length !== 4 || state.status !== "playing") return;
    var key = selected.slice().sort().join("|");
    if (state.guesses.indexOf(key) > -1) { toast("Ezt a négyest már kipróbáltad."); return; }
    state.guesses.push(key);
    var hit = -1;
    puzzle.groups.forEach(function (g, i) {
      if (hit === -1 && state.solved.indexOf(i) === -1 && g.words.every(function (w) { return selected.indexOf(w) > -1; })) hit = i;
    });
    if (hit > -1) {
      state.solved.push(hit); selected = [];
      if (state.solved.length === puzzle.groups.length) finish(true);
      save(); render(hit); toast("Megvan: " + puzzle.groups[hit].title);
      return;
    }
    var near = puzzle.groups.some(function (g, i) {
      return state.solved.indexOf(i) === -1 && g.words.filter(function (w) { return selected.indexOf(w) > -1; }).length === 3;
    });
    state.mistakes++;
    Array.prototype.forEach.call(document.querySelectorAll('.tile[aria-pressed="true"]'), function (t) {
      t.classList.remove("shake"); void t.offsetWidth; t.classList.add("shake");
    });
    if (state.mistakes >= MAX_MISTAKES) {
      selected = []; finish(false); save();
      setTimeout(function () { render(-1); }, 350);
      toast("Elfogytak a tévedések.");
      return;
    }
    save();
    var left = MAX_MISTAKES - state.mistakes;
    Array.prototype.forEach.call($("lives").querySelectorAll(".life"), function (l, i) { l.classList.toggle("used", i >= left); });
    toast(near ? "Közel jársz: három szó egy csoportba tartozik." : "Ez a négy szó nem tartozik össze.");
  }
  function finish(won) {
    state.status = won ? "won" : "lost";
    if (archive) store.archivDone[puzzle.id] = JSON.parse(JSON.stringify(state));
    if (countsForStats && !isPreview) {
      var s = store.stats;
      s.played++;
      if (won) {
        s.wins++; s.dist[state.mistakes]++;
        s.streak = s.lastWonId === puzzle.id - 1 ? s.streak + 1 : 1;
        s.best = Math.max(s.best, s.streak);
        s.lastWonId = puzzle.id;
      } else { s.lost++; s.streak = 0; }
    }
    setTimeout(function () { openDialog(true); }, 1100);
  }

  /* ---------- szövegek ---------- */
  function nextText() {
    if (archive) return "";
    if (!nextPuzzle) return "A következő feladvány hamarosan érkezik.";
    var start = parseDate(nextPuzzle.start), diff = start - new Date();
    var days = Math.floor(diff / 86400000), hours = Math.floor((diff % 86400000) / 3600000);
    var left = diff < 3600000 ? "egy órán belül" : (days > 0 ? "még " + days + " nap " + hours + " óra" : "még " + hours + " óra");
    var label = currentPuzzle && nextPuzzle.id === currentPuzzle.id ? "Hivatalos indulás" : "Következő feladvány";
    return label + ": " + DAYS[start.getDay()] + ", " + formatDay(start) + " (" + left + ")";
  }

  /* ---------- eredmény / statisztika ---------- */
  function openDialog(asResult) {
    var s = store.stats, over = state.status !== "playing", showResult = asResult && over;
    $("modal-title").textContent = showResult ? (state.status === "won" ? "Megfejtetted!" : "Most nem jött össze") : "Statisztika";
    $("modal-sub").textContent = showResult
      ? (state.status === "won" ? (state.mistakes === 0 ? "Hiba nélkül, szép munka." : state.mistakes + " tévedéssel.") : "Nézd meg fent a megoldást.")
      : (s.played ? "Így állsz eddig." : "Még nincs lejátszott feladványod. Fejtsd meg az elsőt, és itt látod majd az eredményeidet.");
    var rate = s.played ? Math.round((s.wins / s.played) * 100) : 0;
    var cells = [[s.played, "Lejátszva"], [rate + "%", "Nyerési arány"], [s.streak, "Sorozat"], [s.best, "Legjobb sorozat"]];
    $("modal-stats").innerHTML = cells.map(function (c) { return '<div><div class="stat-num">' + c[0] + '</div><div class="stat-label">' + c[1] + "</div></div>"; }).join("");
    var rows = [["Hiba nélkül", s.dist[0], 0], ["1 tévedéssel", s.dist[1], 1], ["2 tévedéssel", s.dist[2], 2], ["3 tévedéssel", s.dist[3], 3], ["Nem sikerült", s.lost, -1]];
    var max = Math.max.apply(null, [1].concat(rows.map(function (r) { return r[1]; })));
    $("modal-dist").innerHTML = rows.map(function (r) {
      var cur = countsForStats && !isPreview && ((r[2] === -1 && state.status === "lost") || (state.status === "won" && state.mistakes === r[2]));
      return '<div class="dist-row"><span>' + r[0] + '</span><div class="bar' + (cur ? " current" : "") + '"><span style="width:' + Math.max(8, (r[1] / max) * 100) + '%">' + r[1] + "</span></div></div>";
    }).join("");
    var note = "";
    if (archive) note = "Az archív játék nem számít bele a statisztikába. ";
    else if (testMode) note = "Ez teszt kör volt, az eredménye nem került a statisztikába. ";
    $("modal-note").textContent = note + nextText();
    $("btn-share").hidden = !over;
    $("modal-toast").textContent = "";
    var dlg = $("dialog");
    if (!dlg.open) dlg.showModal();
  }
  function shareText() {
    var lines = ["Rokonszavak #" + puzzle.id];
    if (state.status === "won") lines.push(state.mistakes === 0 ? "Megfejtve, hiba nélkül." : "Megfejtve, " + state.mistakes + " tévedéssel.");
    else lines.push("Most nem jött össze.");
    if (state.solved.length) lines.push("Szintek sorrendje: " + state.solved.map(function (i) { return puzzle.groups[i].level; }).join(", "));
    lines.push("rokonszavak.hu");
    return lines.join("\n");
  }
  function share() {
    var text = shareText();
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {});
      return;
    }
    var done = function () { $("modal-toast").textContent = "Kimásoltuk az eredményt, beillesztheted bárhova."; };
    if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, done); return; }
    var ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove(); done();
  }

  /* ---------- archív: újrajátszás vagy eredmény ---------- */
  function askArchive() {
    var dlg = $("dialog-archiv");
    if (!dlg) return;
    $("archiv-sub").textContent = (store.archivDone[puzzle.id] || store.progress[puzzle.id]).status === "won"
      ? "Ezt a feladványt már megfejtetted." : "Ezt a feladványt már játszottad.";
    dlg.showModal();
  }

  /* ---------- indítás ---------- */
  if ($("puzzle-info")) {
    $("puzzle-info").textContent = puzzle.id + ". feladvány, " + formatWeek(parseDate(puzzle.start));
  }
  if ($("practice-note")) {
    if (testMode) { $("practice-note").textContent = "Tesztmód: " + puzzle.id + ". feladvány. Az eredmény nem mentődik."; $("practice-note").hidden = false; }
    else if (isPreview) { $("practice-note").textContent = "Előzetes. A hivatalos indulás: " + formatDay(parseDate(puzzle.start)); $("practice-note").hidden = false; }
    else if (archive && isLivePuzzle) { $("practice-note").innerHTML = 'Ez a most futó feladvány. A <a href="/">főoldalon</a> játszva számít a statisztikádba.'; $("practice-note").hidden = false; }
    else if (archive) { $("practice-note").textContent = "Archív feladvány. Az eredménye nem számít bele a statisztikádba."; $("practice-note").hidden = false; }
  }
  if ($("next-info")) {
    if (archive) $("next-info").innerHTML = '<a href="/">A heti feladvány</a> &nbsp; <a href="/archivum/">Archívum</a>';
    else $("next-info").textContent = nextText();
  }
  if ($("rules-example")) {
    $("rules-example").appendChild(familyCard({ level: 3, title: "Csillagjegyek", words: ["Rák", "Kos", "Bak", "Oroszlán"], note: "Mind állatok is, de itt a csillagjegy a közös." }, false));
  }

  $("btn-submit").addEventListener("click", submit);
  $("btn-deselect").addEventListener("click", function () { selected = []; render(-1); });
  $("btn-shuffle").addEventListener("click", function () { state.order = shuffle(state.order); save(); render(-1); });
  $("btn-result").addEventListener("click", function () { openDialog(true); });
  if ($("btn-stats")) $("btn-stats").addEventListener("click", function () { openDialog(false); });
  $("btn-share").addEventListener("click", share);
  $("btn-close").addEventListener("click", function () { $("dialog").close(); });
  $("btn-close-2").addEventListener("click", function () { $("dialog").close(); });
  $("dialog").addEventListener("click", function (e) { if (e.target === $("dialog")) $("dialog").close(); });

  if ($("btn-archiv-ujra")) {
    $("btn-archiv-ujra").addEventListener("click", function () {
      $("dialog-archiv").close();
      state = newState(); selected = []; save(); render(-1);
    });
    $("btn-archiv-eredmeny").addEventListener("click", function () {
      $("dialog-archiv").close();
      state = store.archivDone[puzzle.id] || store.progress[puzzle.id];
      render(-1); openDialog(true);
    });
  }

  if (params.has("stat")) openDialog(false);

  render(-1);
  if (archive && (mainDone || archDone)) {
    askArchive();
  }
})();
