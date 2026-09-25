/* Rólunk oldal: a kapcsolati űrlapot a háttérben küldi el a Web3Formsnak,
   így a látogató az oldalon marad, és ott látja, sikerült-e. */
(function () {
  var form = document.querySelector(".kapcsolat-urlap");
  if (!form || !window.fetch) return;
  var button = form.querySelector('button[type="submit"]');
  var result = document.getElementById("urlap-eredmeny");
  var label = button.textContent;

  function show(ok, text) {
    result.textContent = text;
    result.className = "urlap-eredmeny " + (ok ? "siker" : "hiba");
    result.hidden = false;
  }
  function fail() {
    show(false, "Nem sikerült elküldeni az üzenetet. Ellenőrizd az internetkapcsolatod, és próbáld újra egy kicsit később.");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    button.disabled = true; button.textContent = "Küldés…";
    result.hidden = true;
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (data) {
        if (data && data.success) {
          form.reset();
          show(true, "Köszönöm, megkaptam az üzeneted! Hamarosan válaszolok.");
        } else {
          fail();
        }
      })
      .catch(fail)
      .then(function () { button.disabled = false; button.textContent = label; });
  });
})();
