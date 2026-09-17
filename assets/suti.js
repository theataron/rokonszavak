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

  function accept() {
    write("granted");
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGA();
    hide();
  }
  function decline() { write("denied"); hide(); }

  function hide() { var b = document.getElementById("suti-sav"); if (b) b.hidden = true; }
  function show() { var b = document.getElementById("suti-sav"); if (b) b.hidden = false; }

  document.addEventListener("DOMContentLoaded", function () {
    var choice = read();
    if (choice === "granted") { gtag("consent", "update", { analytics_storage: "granted" }); loadGA(); }
    else if (choice !== "denied") { show(); }
    var a = document.getElementById("suti-elfogad");
    var d = document.getElementById("suti-elutasit");
    var re = document.getElementById("suti-beallitas");
    if (a) a.addEventListener("click", accept);
    if (d) d.addEventListener("click", decline);
    if (re) re.addEventListener("click", function (e) { e.preventDefault(); show(); });
  });
})();
