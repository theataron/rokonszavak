/* Rokonszavak – játékmotor. Két mód:
   RSZ.mode = "aktualis" : a főoldal, a mai feladvány, számít a statisztikába
   RSZ.mode = "archiv"   : egy régi feladvány aloldala, NEM számít a statisztikába
   A mai feladványt a böngésző választja ki, budapesti idő szerint: éjfélkor
   mindenkinél egyszerre vált, bárhol van a látogató. */
(function () {
  var CFG = window.RSZ || { mode: "aktualis" };
  var PUZZLES = (window.FELADVANYOK || []).slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  var MAX_MISTAKES = 4;
  var STORAGE_KEY = "rokonszavak-v1";
  var MONTHS = ["január","február","március","április","május","június","július","augusztus","szeptember","október","november","december"];
  var DAYS = ["vasárnap","hétfő","kedd","szerda","csütörtök","péntek","szombat"];
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);

  function parseDate(s) { var p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function formatDay(d) { return MONTHS[d.getMonth()] + " " + d.getDate() + "."; }
  function longDay(d) { var n = DAYS[d.getDay()]; return n.charAt(0).toUpperCase() + n.slice(1) + ", " + formatDay(d); }

  /* Budapesti idő részei. A formatToParts nem függ attól, milyen sorrendben írja ki a dátumot a böngésző. */
  function budapestParts() {
    var out = {};
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Budapest", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (p) { out[p.type] = p.value; });
    return out;
  }
  /* A mai nap (ÉÉÉÉ-HH-NN) Budapesten. Helyi teszteléshez: localhost/?ma=2026-09-25 */
  function budapestToday() {
    var fake = params.get("ma");
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /^\d{4}-\d{2}-\d{2}$/.test(fake || "")) return fake;
    var p = budapestParts();
    return p.year + "-" + p.month + "-" + p.day;
  }
  /* A legutóbbi feladvány, amely adott napon vagy előtte indult. */
  function pickCurrent(day) {
    var found = null;
    PUZZLES.forEach(function (p) { if (p.start <= day) found = p; });
    return found;
  }
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
  if (params.has("reset")) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    location.replace(location.pathname);
  }
  var today = budapestToday();
  var currentPuzzle = pickCurrent(today);
  /* Ha mára nincs feladvány, a legutóbbi jelenik meg újra: ez nem számít új napnak a sorozatban. */
  var isFallback = !!currentPuzzle && currentPuzzle.start !== today;
  function byId(id) { return PUZZLES.filter(function (p) { return String(p.id) === String(id); })[0]; }

  var testId = params.get("teszt");
  var testMode = CFG.mode === "aktualis" && !!byId(testId);
  var archive = CFG.mode === "archiv";
  var puzzle, isPreview = false;

  if (archive) {
    puzzle = byId(CFG.id);
  } else if (testMode) {
    puzzle = byId(testId);
  } else if (currentPuzzle) {
    puzzle = currentPuzzle;
  } else {
    puzzle = PUZZLES[0]; isPreview = true;
  }
  /* A szabályok oldalán nincs játéktábla, ezért a példát a korai kilépés előtt rajzoljuk ki. */
  if ($("rules-example")) {
    $("rules-example").appendChild(familyCard({ level: 3, title: "Csillagjegyek", words: ["Rák", "Kos", "Bak", "Oroszlán"], note: "Mind állatok is, de itt a csillagjegy a közös." }, false));
  }
  if (!puzzle || !$("grid")) return;

  var isLivePuzzle = currentPuzzle && puzzle.id === currentPuzzle.id;
  var countsForStats = !archive && !testMode;
  var onFallback = isFallback && !archive && !testMode;
  var nextPuzzle = PUZZLES.filter(function (p) { return p.start > today; })[0] || null;
  var prevIndex = PUZZLES.indexOf(puzzle) - 1;
  var prevPuzzleId = prevIndex >= 0 ? PUZZLES[prevIndex].id : null;

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

  /* ---------- mérés (GA4) ----------
     Csak a statisztikába számító játék küld eseményeket; az archív játék csak egy
     archive_start-ot. Tesztmód és előzetes semmit. A hozzájárulást a suti.js ellenőrzi. */
  var tracksGame = countsForStats && !isPreview;
  function track(name, params) {
    if (testMode || isPreview || !window.rszEsemeny) return;
    var p = { puzzle_id: String(puzzle.id) };
    for (var k in params) p[k] = params[k];
    window.rszEsemeny(name, p);
  }
  function gameEvent(name, params) { if (tracksGame) track(name, params); }
  /* Az első koppintásnál: game_start (vagy archive_start), feladványonként egyszer.
     A kezdés ideje a mentett állásba kerül, így a játékidő újratöltés után is stimmel. */
  function markStart() {
    if (state.startedAt || state.status !== "playing") return;
    state.startedAt = Date.now();
    save();
    if (archive) track("archive_start");
    else gameEvent("game_start");
  }

  /* ---------- megjelenítés ---------- */
  var toastTimer, toastShownAt = 0, toastSticky = false;
  /* sticky: a toast a játékos következő lépéséig kint marad (de legalább 3 másodpercig).
     Enélkül 2,4 másodperc után eltűnik. */
  function toast(msg, sticky) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastTimer);
    toastShownAt = Date.now(); toastSticky = !!sticky;
    if (!sticky) toastTimer = setTimeout(function () { t.hidden = true; }, 2400);
  }
  /* A játékos lépett (kijelölt, törölt, kevert, küldött): a kint maradó toast mehet. */
  function releaseToast() {
    if (!toastSticky) return;
    toastSticky = false;
    var t = $("toast");
    toastTimer = setTimeout(function () { t.hidden = true; }, Math.max(0, 3000 - (Date.now() - toastShownAt)));
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
        var len = Array.from(word).length;
        b.type = "button"; b.className = "tile"; b.textContent = word;
        b.dataset.word = word; b.dataset.meret = len <= 8 ? "s" : len <= 12 ? "m" : len <= 17 ? "l" : "xl";
        b.setAttribute("aria-pressed", selected.indexOf(word) > -1 ? "true" : "false");
        b.addEventListener("click", function () { toggle(word, b); });
        grid.appendChild(b);
      });
    }
    fitTiles();
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
  /* A CSS-ben megadott betűméret a felső határ (data-meret). Ha a leghosszabb szórész így sem
     fér ki egy sorba, addig kicsinyít, amíg ki nem fér, hogy ne törjön szét a szó közepén. */
  function fitTiles() {
    Array.prototype.forEach.call(document.querySelectorAll("#grid .tile"), function (t) {
      t.style.fontSize = "";
      t.classList.add("meres");
      var cs = getComputedStyle(t), size = parseFloat(cs.fontSize);
      var room = t.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var range = document.createRange();
      range.selectNodeContents(t);
      var widest = function () {
        return Math.max.apply(null, [0].concat(Array.prototype.map.call(range.getClientRects(), function (r) { return r.width; })));
      };
      while (size > 10 && widest() > room) { size -= 0.5; t.style.fontSize = size + "px"; }
      t.classList.remove("meres");
    });
  }
  var fitTimer;
  window.addEventListener("resize", function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitTiles, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTiles);

  function updateButtons() {
    $("btn-submit").disabled = selected.length !== 4;
    $("btn-deselect").disabled = selected.length === 0;
  }

  /* ---------- játék ---------- */
  function toggle(word, button) {
    if (state.status !== "playing") return;
    markStart();
    releaseToast();
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
    releaseToast();
    var key = selected.slice().sort().join("|");
    if (state.guesses.indexOf(key) > -1) { toast("Ezt a négyest már kipróbáltad."); return; }
    state.guesses.push(key);
    var hit = -1;
    puzzle.groups.forEach(function (g, i) {
      if (hit === -1 && state.solved.indexOf(i) === -1 && g.words.every(function (w) { return selected.indexOf(w) > -1; })) hit = i;
    });
    if (hit > -1) {
      state.solved.push(hit); selected = [];
      gameEvent("group_found", { level: puzzle.groups[hit].level, mistakes: state.mistakes });
      if (state.solved.length === puzzle.groups.length) finish(true);
      save(); render(hit); toast("Megvan: " + puzzle.groups[hit].title);
      return;
    }
    var near = puzzle.groups.some(function (g, i) {
      return state.solved.indexOf(i) === -1 && g.words.filter(function (w) { return selected.indexOf(w) > -1; }).length === 3;
    });
    state.mistakes++;
    gameEvent("mistake", { mistakes: state.mistakes });
    if (near) gameEvent("one_away", { mistakes: state.mistakes });
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
    if (near) toast("Közel jársz: három szó egy csoportba tartozik.", true);
    else toast("Ez a négy szó nem tartozik össze.");
  }
  function finish(won) {
    state.status = won ? "won" : "lost";
    if (won) {
      var result = { mistakes: state.mistakes };
      if (state.startedAt) result.duration = Math.round((Date.now() - state.startedAt) / 1000);
      gameEvent("game_success", result);
    }
    else gameEvent("game_fail", { solved: state.solved.length });
    if (archive) store.archivDone[puzzle.id] = JSON.parse(JSON.stringify(state));
    if (countsForStats && !isPreview) {
      var s = store.stats;
      s.played++;
      /* Sorozat: az előző feladványt (a dátum szerinti sorrendben) is megfejtetted-e.
         Újra megjelenített (tartalék) feladvány nem növeli és nem is nullázza. */
      if (won) {
        s.wins++; s.dist[state.mistakes]++;
        if (!onFallback) {
          s.streak = prevPuzzleId !== null && s.lastWonId === prevPuzzleId ? s.streak + 1 : 1;
          s.best = Math.max(s.best, s.streak);
          s.lastWonId = puzzle.id;
        }
      } else {
        s.lost++;
        if (!onFallback) s.streak = 0;
      }
    }
    setTimeout(function () { openDialog(true); }, 1100);
  }

  /* ---------- szövegek ---------- */
  function nextText() {
    if (archive) return "";
    if (!nextPuzzle) return "A következő feladvány hamarosan érkezik.";
    if (nextPuzzle.start === iso(addDays(parseDate(today), 1))) {
      var t = budapestParts();
      var mins = Math.max(1, 1440 - (+t.hour * 60 + +t.minute));
      var h = Math.floor(mins / 60), m = mins % 60;
      var left = h ? "még " + h + " óra " + m + " perc" : "még " + m + " perc";
      return "Új feladvány éjfélkor, magyar idő szerint (" + left + ").";
    }
    return "Következő feladvány: " + longDay(parseDate(nextPuzzle.start)).toLowerCase() + ".";
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
    if ($("modal-cta")) $("modal-cta").hidden = !over;
    $("modal-toast").textContent = "";
    var dlg = $("dialog");
    if (!dlg.open) dlg.showModal();
  }
  /* Megosztható szöveg. A dátum a feladványé (start), nem a mai nap, így mindenki ugyanazt osztja meg.
     A link legyen a legutolsó, különben egyes üzenetküldők nem mutatnak előnézetet. */
  function shareText() {
    var d = parseDate(puzzle.start);
    var result = state.status !== "won" ? "Ez most nem sikerült"
      : state.mistakes === 0 ? "Hibátlanul megoldva ✨" : "Megoldva " + state.mistakes + " hibával";
    return [
      "Rokonszavak – " + d.getFullYear() + ". " + formatDay(d),
      result,
      "",
      "Magyar szójáték: 16 szó, 4 rejtett csoport – öt perc agytorna.",
      "Megoldod te is? rokonszavak.hu"
    ].join("\n");
  }
  function share() {
    track("share_result", { result: state.status === "won" ? "success" : "fail" });
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
    $("puzzle-info").textContent = longDay(parseDate(puzzle.start));
  }
  if ($("practice-note")) {
    var alreadyDone = state.status !== "playing";
    if (testMode) { $("practice-note").textContent = "Tesztmód: " + puzzle.id + ". Az eredmény nem mentődik."; $("practice-note").hidden = false; }
    else if (isPreview) { $("practice-note").textContent = "Előzetes. A hivatalos indulás: " + formatDay(parseDate(puzzle.start)); $("practice-note").hidden = false; }
    else if (onFallback) {
      $("practice-note").innerHTML = alreadyDone
        ? 'Ma nincs új feladvány, ezt már befejezted. Addig is válogass az <a href="/archivum/">archívumból</a>!'
        : "Ma nincs új feladvány, ezért a legutóbbit mutatjuk. A sorozatodat nem befolyásolja.";
      $("practice-note").hidden = false;
    }
    else if (archive && isLivePuzzle) { $("practice-note").innerHTML = 'Ez a most futó feladvány. A <a href="/">főoldalon</a> játszva számít a statisztikádba.'; $("practice-note").hidden = false; }
    else if (archive) { $("practice-note").textContent = "Archív feladvány. Az eredménye nem számít bele a statisztikádba."; $("practice-note").hidden = false; }
  }
  if ($("btn-archive")) $("btn-archive").hidden = !onFallback;
  if ($("next-info")) {
    if (archive) $("next-info").innerHTML = '<a href="/">A mai feladvány</a> &nbsp; <a href="/archivum/">Archívum</a>';
    else $("next-info").textContent = nextText();
  }
  /* Ha a lap éjfélkor is nyitva van, az új nap feladványára frissít (a haladás el van mentve). */
  if (!archive && !testMode) {
    var checkDay = function () {
      if (document.hidden) return;
      var cur = pickCurrent(budapestToday());
      if (cur && cur !== currentPuzzle) location.reload();
      else if ($("next-info")) $("next-info").textContent = nextText();
    };
    document.addEventListener("visibilitychange", checkDay);
    setInterval(checkDay, 60000);
  }

  $("btn-submit").addEventListener("click", submit);
  $("btn-deselect").addEventListener("click", function () { releaseToast(); selected = []; render(-1); });
  $("btn-shuffle").addEventListener("click", function () { releaseToast(); state.order = shuffle(state.order); save(); render(-1); });
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
