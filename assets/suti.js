/* Süti sáv + Google Analytics. A GA csak elfogadás után töltődik be. */
(function () {
  var KEY = "rokonszavak-suti";
  var GA_ID = "G-21WQD8V9BJ";
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", wait_for_update: 500
  });

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadGA() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  /* Játékesemények a GA4-nek. Csak akkor megy el, ha a látogató már elfogadta a sütiket
     és a mérőkód be van töltve. Hozzájárulás nélkül az esemény elvész: nem kerül
     sorba, és elfogadás után sem küldjük el utólag. */
  window.rszEsemeny = function (name, params) {
    if (!loaded || read() !== "granted") return;
    gtag("event", name, params || {});
  };

  function accept() {
    write("granted");
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGA();
    hide();
    gtag("event", "cookie_consent", { answer: "accept" });
  }
  function decline() {
    write("denied");
    if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
    hide();
  }

  /* Az első látogatáskor a sáv mögött elsötétül az oldal; a Süti beállítások linkről nyitva nem. */
  function hide() {
    var b = document.getElementById("suti-sav"), h = document.getElementById("suti-hatter");
    if (b) b.hidden = true;
    if (h) h.remove();
  }
  function show(first) {
    var b = document.getElementById("suti-sav");
    if (!b) return;
    b.hidden = false;
    b.setAttribute("aria-modal", first ? "true" : "false");
    if (first && !document.getElementById("suti-hatter")) {
      var h = document.createElement("div");
      h.id = "suti-hatter"; h.className = "suti-hatter";
      b.parentNode.insertBefore(h, b);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var choice = read();
    if (choice === "granted") { gtag("consent", "update", { analytics_storage: "granted" }); loadGA(); }
    else if (choice !== "denied") { show(true); }
    var a = document.getElementById("suti-elfogad");
    var d = document.getElementById("suti-elutasit");
    var re = document.getElementById("suti-beallitas");
    if (a) a.addEventListener("click", accept);
    if (d) d.addEventListener("click", decline);
    if (re) re.addEventListener("click", function (e) { e.preventDefault(); show(false); });
  });
})();
