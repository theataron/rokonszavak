#!/usr/bin/env python3
"""
Rokonszavak oldalgenerator.

Futtatas:      python build.py
Teszt datum:   python build.py --ma 2026-10-20

Mit csinal:
1. a feladvanyok.xlsx-bol ellenorzes utan legyartja az assets/feladvanyok.js-t
   (scripts/xlsx_to_js.py; hibanal itt megall, es semmit nem ir at),
2. ujrairja a fooldalt, a szabalyok / archivum / adatvedelem oldalakat, a mar
   elindult feladvanyok aloldalait (/feladvany/<id>/) es a sitemap.xml-t.
A jovobeli feladvanyoknak NEM keszit oldalt, hogy ne szivarogjon ki a megoldas.
A napi valtast nem ez csinalja: a bongeszo valasztja ki a mai feladvanyt
(budapesti ido szerint) az assets/feladvanyok.js-bol.
A "mai datum" mindig a budapesti datum, akarhol fut a script.
"""
import hashlib, json, os, sys, shutil

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts"))
import xlsx_to_js

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://rokonszavak.hu"
MONTHS = ["január", "február", "március", "április", "május", "június",
          "július", "augusztus", "szeptember", "október", "november", "december"]
WEEKDAYS = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"]


def d(s):
    return xlsx_to_js.parse_date(s)


def day_label(day):
    return "%s %d." % (MONTHS[day.month - 1], day.day)


def asset(name, base):
    """Eszkoz URL-je verzioszammal (a tartalom hash-e), hogy a bongeszo ne regi masolatot hasznaljon."""
    data = open(os.path.join(ROOT, "assets", name), "rb").read()
    return "%sassets/%s?v=%s" % (base, name, hashlib.sha1(data).hexdigest()[:10])


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


LOGO = """<svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="7" r="4.5" fill="currentColor"/>
        <path d="M20 11v6M8 17h24M8 17v8M16 17v8M24 17v8M32 17v8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <circle cx="8" cy="30" r="3.6" fill="#7DDE92"/><circle cx="16" cy="30" r="3.6" fill="#2EBFA5"/>
        <circle cx="24" cy="30" r="3.6" fill="#2B76C6"/><circle cx="32" cy="30" r="3.6" fill="#4E4187"/>
      </svg>"""

# Ikonok: a scripts/favicon.py gyartja oket a logobol (feher korben, hogy sotet lapfulon is latsszon).
ICONS = """<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png">
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#FFFFFF">"""


def head(title, desc, path, depth, extra=""):
    base = "../" * depth if depth else ""
    return f"""<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}{path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Rokonszavak">
<meta property="og:locale" content="hu_HU">
<meta property="og:url" content="{SITE}{path}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{SITE}/og-kep.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{SITE}/og-kep.png">
{ICONS}
<script>
  (function () {{
    var t = null;
    try {{ t = localStorage.getItem("rokonszavak-tema"); }} catch (e) {{}}
    if (t !== "light" && t !== "dark") t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = t;
  }})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@500;700;800&family=Alegreya+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{asset('styles.css', base)}">
<script src="{asset('suti.js', base)}"></script>
{extra}</head>
<body>
"""


def header(active, depth):
    base = "../" * depth if depth else ""
    def link(href, label, key):
        cur = ' aria-current="page"' if key == active else ""
        return f'<a class="nav-link" href="{href}" data-route="{key}"{cur}>{label}</a>'
    return f"""<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="{base or '/'}" aria-label="Rokonszavak – vissza a játékhoz">
      {LOGO}
      <span class="brand-name">Rokonszavak</span>
    </a>
    <nav class="main-nav" aria-label="Fő menü">
      {link(base or '/', 'Játék', 'jatek')}
      {link((base or '/') + 'archivum/', 'Archívum', 'archivum')}
      {link((base or '/') + 'szabalyok/', 'Szabályok', 'szabalyok')}
      <button class="icon-btn" id="btn-stats" type="button" aria-label="Statisztika" title="Statisztika">
        <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V12M12 20V5M19 20v-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
      <button class="icon-btn" id="btn-theme" type="button" aria-label="Sötét mód bekapcsolása" title="Sötét mód bekapcsolása">
        <svg class="icon-moon" width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>
        <svg class="icon-sun" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      </button>
    </nav>
  </div>
</header>
"""


GAME = """  <section class="game" aria-labelledby="game-title">
    <div class="intro">
      <h1 id="game-title">%(h1)s</h1>
      %(lead)s
      <p id="puzzle-info"></p>
      <span class="practice-note" id="practice-note" hidden></span>
    </div>

    <div class="toast-area" role="status" aria-live="polite"><span class="toast" id="toast" hidden></span></div>

    <div class="families" id="families"></div>
    <div class="grid" id="grid" role="group" aria-label="Szavak" lang="hu"></div>

    <div class="status" id="status">
      <span>Hátralévő tévedések:</span>
      <span class="lives" id="lives"></span>
    </div>
    <div class="controls" id="controls">
      <button class="btn" id="btn-shuffle" type="button">Keverés</button>
      <button class="btn" id="btn-deselect" type="button">Kijelölés törlése</button>
      <button class="btn btn-primary" id="btn-submit" type="button">Küldés</button>
    </div>

    <div class="end" id="end" hidden>
      <p id="end-text"></p>
      <button class="btn btn-primary" id="btn-result" type="button">Eredmény megtekintése</button>
      <a class="btn" id="btn-archive" href="/archivum/" hidden>Irány az archívum</a>
    </div>

    <p class="next-info" id="next-info"></p>
  </section>
"""

DIALOG = """<dialog id="dialog" aria-labelledby="modal-title">
  <button class="icon-btn modal-close" id="btn-close" type="button" aria-label="Bezárás">
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
  </button>
  <div class="modal-body">
    <h2 class="modal-title" id="modal-title"></h2>
    <p class="modal-sub" id="modal-sub"></p>
    <div class="stats" id="modal-stats"></div>
    <p class="dist-title">Megfejtések tévedések szerint</p>
    <div id="modal-dist"></div>
    <p class="modal-note" id="modal-note"></p>
    <div class="modal-actions">
      <button class="btn btn-primary" id="btn-share" type="button">Eredmény megosztása</button>
      <button class="btn" id="btn-close-2" type="button">Bezárás</button>
    </div>
    <p class="modal-toast" id="modal-toast" aria-live="polite"></p>
  </div>
</dialog>
"""

ARCHIVE_DIALOG = """<dialog id="dialog-archiv" aria-labelledby="archiv-cim">
  <div class="modal-body">
    <h2 class="modal-title" id="archiv-cim">Már játszottad</h2>
    <p class="modal-sub" id="archiv-sub"></p>
    <div class="modal-actions">
      <button class="btn btn-primary" id="btn-archiv-eredmeny" type="button">Eredmény megtekintése</button>
      <button class="btn" id="btn-archiv-ujra" type="button">Újrajátszom</button>
    </div>
    <p class="modal-note">Az archív játék eredménye nem kerül a statisztikádba.</p>
  </div>
</dialog>
"""


# A fooldal jatek alatti ismertetoje: ez a lap fo keresheto szovege (maga a jatek JS-bol rajzolodik ki).
# A GYIK kerdesei es valaszai egyben a FAQPage strukturalt adat forrasai is.
GYIK = [
    ("Ingyenes a játék?",
     "Igen, a Rokonszavak teljesen ingyenes, és nem kell hozzá regisztrálni."),
    ("Hol tárolódik, hogy meddig jutottam?",
     "Kizárólag a saját böngésződben. Nincs felhasználói fiók, és a haladásodat nem mentjük el nálunk. "
     "Ha elfogadod a sütiket, névtelen statisztikát kapunk arról, hogyan alakulnak a játékok "
     "(például hány tévedéssel fejtik meg a feladványt). "
     "Ha törlöd a böngésződ tárolt adatait, a statisztikád is eltűnik."),
    ("Mi történik, ha négyszer tévedek?",
     "A feladvány véget ér, és megjelenik a helyes megoldás mind a négy csoporttal. "
     "Másnap új feladvánnyal próbálkozhatsz."),
    ("Mit jelentenek a színek?",
     "A négy csoport nehézségi sorrendben kap színt: az első a legkönnyebb, a negyedik a legnehezebb, "
     "és ez utóbbi szinte mindig valamilyen nyelvi csavarra épül."),
    ("Játszhatok régebbi feladványokkal?",
     "Igen, az archívumban minden korábbi nap elérhető."),
]

ISMERTETO = """<section class="ismerteto">

  <h2>Mi ez a napi szójáték?</h2>
  <p>A Rokonszavak egy ingyenes magyar szójáték: minden nap kapsz tizenhat szót,
  és meg kell találnod, melyik négy tartozik össze. Négy csoport, csoportonként
  négy szó, és mindig pontosan egy olyan elrendezés van, amiben mind a négy
  csoport kijön. Regisztráció nélkül játszható, telefonon és számítógépen is.</p>

  <h2>Hogyan kell játszani?</h2>
  <p>Jelölj ki négy szót, amelyekben szerinted van valami közös, majd nyomd meg a
  Küldés gombot. Ha eltaláltad, a négy szó egy sorba rendeződik, és megjelenik a
  csoport megnevezése. Négyszer tévedhetsz, utána a mai feladvány véget ér. A
  Keverés gomb átrendezi a szavakat, ami sokszor segít új összefüggést észrevenni.</p>

  <h2>Miért nehezebb, mint amilyennek látszik?</h2>
  <p>Szinte minden feladványban van néhány szó, amelyik két vagy három csoportba is
  beleillene. Ezek a csapdák: a legkézenfekvőbb négyes gyakran nem a helyes
  megoldás. Érdemes azzal a csoporttal kezdeni, amelyikben egészen biztos vagy, és
  a bizonytalan szavakat a végére hagyni.</p>
  <p>A nehezebb csoportok sokszor nyelvi játékra épülnek: azonos alakú szavak,
  többjelentésű szavak, szólások és közmondások, összetett szavak közös előtaggal,
  vagy olyan szavak, amelyekben elbújik egy másik szó. Ez az a rész, ami magyarul
  működik igazán, és amit egy fordított rejtvény soha nem tudna visszaadni.</p>

  <h2>Napi egy feladvány</h2>
  <p>Minden nap éjfélkor új feladvány érkezik. A korábbiak nem vesznek el: az
  <a href="/archivum/">archívumban</a> bármelyiket előveheted, és sorra veheted
  őket. Az archív játékok eredménye nem számít bele a statisztikádba, így nyugodtan
  kísérletezhetsz.</p>
  <p>Jó agytorna reggeli kávé mellé, és pont annyi ideig tart, ameddig egy
  keresztrejtvény bemelegítése. Ha szereted az online rejtvény és fejtörő
  típusú játékokat, ez ugyanabba a napi szokásba illeszkedik.</p>

  <h2>Gyakori kérdések</h2>
%s
</section>
""" % "".join("\n  <h3>%s</h3>\n  <p>%s</p>\n" % (esc(q), esc(a)) for q, a in GYIK)

GYIK_JSONLD = ('<script type="application/ld+json">\n' + json.dumps({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{"@type": "Question", "name": q,
                    "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in GYIK],
}, ensure_ascii=False, indent=2) + "\n</script>\n")


def footer(depth):
    base = "../" * depth if depth else "/"
    return f"""<footer class="site-footer">
  <ul class="footer-nav">
    <li><a href="{base}">Játék</a></li>
    <li><a href="{base}archivum/">Archívum</a></li>
    <li><a href="{base}szabalyok/">Szabályok</a></li>
    <li><a href="{base}rolunk/">Rólunk</a></li>
    <li><a href="{base}adatvedelem/">Adatvédelem és sütik</a></li>
    <li><a href="#" id="suti-beallitas">Süti beállítások</a></li>
  </ul>
  <p>© 2026 Rokonszavak. Napi szójáték magyarul.</p>
</footer>

<div class="suti-sav" id="suti-sav" role="dialog" aria-modal="true" aria-label="Süti beállítások" hidden>
  <div class="suti-belso">
    <p class="suti-szoveg">Sütiket és hasonló technológiákat használunk. A játék működéséhez szükséges tárolás mindig aktív, a névtelen látogatottsági mérés (Google Analytics) viszont csak a hozzájárulásoddal indul el. <a href="{base}adatvedelem/">Részletek</a></p>
    <div class="suti-gombok">
      <button class="btn" id="suti-elutasit" type="button">Csak a szükségesek</button>
      <button class="btn btn-primary" id="suti-elfogad" type="button">Elfogadom</button>
    </div>
  </div>
</div>
"""


def scripts(depth, cfg=None):
    base = "../" * depth if depth else ""
    cfg_line = f'<script>window.RSZ = {json.dumps(cfg, ensure_ascii=False)};</script>\n' if cfg else ""
    return f"""{cfg_line}<script src="{asset('feladvanyok.js', base)}"></script>
<script src="{asset('jatek.js', base)}"></script>
<script src="{asset('tema.js', base)}"></script>
</body>
</html>
"""


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8").write(content)
    print("  ", path)


# ---------------------------------------------------------------- pages
def build_index():
    lead = '<p class="how">Keress négy csoportot: minden csoport négy szava valamilyen közös tulajdonság miatt tartozik össze.</p>'
    html = (head("Napi szójáték és online rejtvény magyarul – Rokonszavak",
                 "Napi szójáték és ingyenes online rejtvény magyarul: minden nap 16 szó, négy rejtett csoport. "
                 "Találd meg, mi köti össze őket!", "/", 0, GYIK_JSONLD)
            + header("jatek", 0)
            + "<main>\n" + (GAME % {"h1": "Melyik négy szó illik össze?", "lead": lead})
            + "\n" + ISMERTETO + "</main>\n\n"
            + DIALOG + "\n" + footer(0) + "\n" + scripts(0, {"mode": "aktualis"}))
    write("index.html", html)


def build_rules():
    body = """<main>
  <article class="szoveg">
    <h1>Játékszabályok</h1>
    <p class="lead">Minden nap 16 szót kapsz. Ezek között négy csoport rejtőzik: egy csoportba négy olyan szó tartozik, amelyek valamilyen közös tulajdonság miatt összeillenek. A feladatod, hogy megtaláld mind a négy csoportot.</p>
    <p>Két példa:</p>
    <ul>
      <li><strong>Tavasz, Nyár, Ősz, Tél</strong>: mind évszakok.</li>
      <li><strong>Rák, Kos, Bak, Oroszlán</strong>: mind állatok, de itt azért tartoznak össze, mert csillagjegyek is.</li>
    </ul>

    <h2>Így játssz</h2>
    <ol>
      <li>Jelölj ki négy szót, amelyekről úgy gondolod, összetartoznak.</li>
      <li>Nyomd meg a Küldés gombot.</li>
      <li>Ha eltaláltad, a négy szó egy csoportba rendeződik, és kiderül, mi a közös bennük.</li>
      <li>Négy tévedésed van. Ha mindet elhasználod, a játék véget ér, és megmutatjuk a megoldást.</li>
    </ol>

    <h2>Mire figyelj?</h2>
    <p>A közös tulajdonság sokféle lehet: egy téma, egy szófaj, egy hozzájuk illeszthető végződés vagy egy rejtett szójáték.</p>
    <p><strong>Vigyázz a kakukktojásokra.</strong> Szinte minden feladványban van néhány trükkös szó, amelyik két, sőt három csoportba is beleillene. Ilyenkor is csak egyetlen olyan felosztás létezik, amelyben mind a négy csoport kijön négy szóval. A te dolgod, hogy ezt az egy helyes felosztást megtaláld, ne pedig az elsőt, ami logikusnak tűnik.</p>
    <p>Ha négyből három szó egy csoportba tartozik, a játék szól, hogy közel jársz. Ugyanazt a négyest nem számoljuk kétszer tévedésnek.</p>

    <h2>A nehézségi szintek</h2>
    <p>A pöttyök mutatják, melyik szinten jársz.</p>
    <ul class="level-list">
      <li data-level="1" style="background:var(--szint-1)"><strong>1. szint</strong> a legkönnyebb csoport</li>
      <li data-level="2" style="background:var(--szint-2)"><strong>2. szint</strong> egy kicsit ravaszabb</li>
      <li data-level="3" style="background:var(--szint-3)"><strong>3. szint</strong> itt már gondolkodni kell</li>
      <li data-level="4" style="background:var(--szint-4)"><strong>4. szint</strong> a legtrükkösebb, gyakran szójáték</li>
    </ul>
    <p class="example">Egy megfejtett csoport így néz ki:</p>
    <div id="rules-example"></div>

    <h2>Mikor jön új feladvány?</h2>
    <p>Minden nap éjfélkor, magyar idő szerint. A korábbi feladványokat bármikor megtalálod az <a href="../archivum/">archívumban</a>.</p>

    <h2>Statisztika</h2>
    <p>Az eredményeidet csak ez a böngésző tárolja, ezen az eszközön. Ha törlöd a böngészési adatokat, vagy másik eszközön játszol, a statisztikád nem jön veled. Az archívumban lejátszott feladványok nem számítanak bele a statisztikába.</p>

    <a class="btn btn-primary back" href="../">Vissza a játékhoz</a>
  </article>
</main>
"""
    html = (head("Játékszabályok – Rokonszavak",
                 "Hogyan kell játszani a Rokonszavak szójátékkal? 16 szó, négy csoport, négy tévedés. Példákkal és a nehézségi szintekkel.",
                 "/szabalyok/", 1)
            + header("szabalyok", 1) + body + "\n" + footer(1) + "\n" + scripts(1))
    write("szabalyok/index.html", html)


def build_about():
    body = """<main>
  <article class="szoveg">
    <h1>Rólunk</h1>

    <p>A Rokonszavakat 2026 szeptemberében indítottam el: egy napi magyar szójáték,
    amiben tizenhat szóból kell négy négyes csoportot kialakítani.</p>

    <p>Az ötlet abból jött, hogy a hasonló játékok többsége angolul működik jól, és
    fordításban elveszik belőlük az, ami a legjobb bennük — a nyelvi csavar. A magyar
    nyelvben viszont bőven van alapanyag: azonos alakú szavak, összetételek, szólások,
    népi kifejezések. A feladványokat magam írom, egyesével.</p>

    <p>Ha találtál benne hibát, van ötleted egy csoportra, vagy csak meg akarod írni,
    hogy melyik feladvány fogott ki rajtad, szívesen olvasom. Írj az alábbi űrlapon
    keresztül.</p>

    <p>A játék ingyenes, és regisztráció nélkül játszható.</p>

    <form action="https://api.web3forms.com/submit" method="POST" class="kapcsolat-urlap">
      <input type="hidden" name="access_key" value="57956d75-d1ca-4938-a17e-4536a3bed390">
      <input type="hidden" name="subject" value="Rokonszavak – üzenet az oldalról">
      <input type="hidden" name="from_name" value="Rokonszavak">

      <label for="nev">Neved</label>
      <input type="text" id="nev" name="name" required autocomplete="name">

      <label for="email">E-mail-címed</label>
      <input type="email" id="email" name="email" required autocomplete="email">

      <label for="uzenet">Üzeneted</label>
      <textarea id="uzenet" name="message" rows="6" required></textarea>

      <input type="checkbox" name="botcheck" class="rejtett" style="display:none"
             tabindex="-1" autocomplete="off">

      <button type="submit" class="btn btn-primary">Küldés</button>
      <p class="urlap-eredmeny" id="urlap-eredmeny" role="status" aria-live="polite" hidden></p>
      <p class="urlap-megj">Az üzeneted a Web3Forms szolgáltatáson keresztül érkezik meg hozzám. Részletek az <a href="../adatvedelem/">Adatvédelem</a> oldalon.</p>
    </form>

    <a class="btn btn-primary back" href="../">Vissza a játékhoz</a>
  </article>
</main>
"""
    html = (head("Rólunk – Rokonszavak",
                 "Ki készíti a Rokonszavakat, és miért? Hibát találtál, vagy ötleted van egy csoportra? Írj az oldalon lévő űrlapon keresztül.",
                 "/rolunk/", 1)
            + header("", 1) + body + "\n" + footer(1) + "\n"
            + f'<script src="{asset("kapcsolat.js", "../")}"></script>\n'
            + scripts(1))
    write("rolunk/index.html", html)


def build_privacy():
    body = """<main>
  <article class="szoveg">
    <h1>Adatvédelem és sütik</h1>
    <p class="lead">Röviden: a Rokonszavak nem kér regisztrációt, és a játékeredményeid a saját böngésződben maradnak. Nevet és e-mail-címet csak akkor kapunk, ha a <a href="../rolunk/">Rólunk</a> oldalon lévő űrlapon írsz nekünk.</p>

    <h2>Mit tárol a böngésződ?</h2>
    <p>A játék a böngésződ helyi tárhelyén (localStorage) őrzi a haladásodat, a statisztikádat, a világos vagy sötét mód beállítását, valamint a süti sávon adott válaszodat. Ezek az adatok nem kerülnek fel semmilyen szerverre, és bármikor törölhetők a böngésző adatainak törlésével.</p>

    <h2>Látogatottsági mérés</h2>
    <p>A Google Analytics 4 segítségével névtelen statisztikát készítünk arról, hányan és milyen eszközről játszanak, és hogyan alakulnak a játékok: például elkezdtek-e egy feladványt, hány tévedéssel fejtették meg, vagy megosztották-e az eredményt. Ebből látjuk, melyik feladvány sikerült túl könnyűre vagy túl nehézre. Ez a mérés csak akkor indul el, ha a süti sávon az Elfogadom gombot választod. Ha a Csak a szükségesek lehetőséget választod, nem töltjük be a mérőkódot, és a játékról sem küldünk semmit.</p>
    <p>A választásodat bármikor módosíthatod a lap alján lévő Süti beállítások linkre kattintva.</p>

    <h2>Kapcsolatfelvételi űrlap</h2>
    <p>Ha a <a href="../rolunk/">Rólunk</a> oldalon lévő űrlapon üzenetet küldesz, a neved, az e-mail-címed és az üzeneted a <a href="https://web3forms.com/privacy" rel="noopener">Web3Forms</a> szolgáltatáson keresztül jut el hozzám e-mailben. A Web3Forms adatfeldolgozóként, az Egyesült Államokban lévő szerverein kezeli ezeket az adatokat. Az adataidat kizárólag arra használom, hogy válaszoljak az üzenetedre, más célra nem használom fel őket, és senkinek nem adom tovább.</p>
    <p>Ha szeretnéd, hogy töröljem a levelezésünket, írd meg, és megteszem.</p>

    <h2>Betűtípusok</h2>
    <p>Az oldal a Google Fonts szolgáltatásból tölt be betűtípusokat, ami azt jelenti, hogy a böngésződ kapcsolatba lép a Google szerverével.</p>

    <a class="btn btn-primary back" href="../">Vissza a játékhoz</a>
  </article>
</main>
"""
    html = (head("Adatvédelem és sütik – Rokonszavak",
                 "Milyen adatokat tárol a Rokonszavak? Regisztráció nincs, az eredmények a böngésződben maradnak.",
                 "/adatvedelem/", 1)
            + header("", 1) + body + "\n" + footer(1) + "\n" + scripts(1))
    write("adatvedelem/index.html", html)


def build_puzzle_page(p, solved_day):
    start = d(p["start"])
    label = "%d. %s" % (start.year, day_label(start))
    weekday = WEEKDAYS[start.weekday()]
    title = "Rokonszavak – %s (%s)" % (label, weekday)
    desc = "Rokonszavak feladvány, %s (%s): játszd le, vagy nézd meg a megoldást." % (label, weekday)
    if solved_day:
        lead = '<p class="how">%s, %s. Játszd le, vagy nézd meg a megoldást a lap alján.</p>' % (label, weekday)
    else:
        lead = '<p class="how">%s, %s. A megoldás a nap végén kerül ide.</p>' % (label, weekday)
    solution = ""
    if solved_day:
        items = []
        for g in sorted(p["groups"], key=lambda g: g["level"]):
            note = (' <span class="megj">%s</span>' % esc(g["note"])) if g.get("note") else ""
            items.append('<li><span class="cim">%d. szint – %s:</span> %s%s</li>'
                         % (g["level"], esc(g["title"]), esc(", ".join(g["words"])), note))
        solution = """
  <details class="megoldas">
    <summary>Megoldás megjelenítése (spoiler)</summary>
    <ul>
      %s
    </ul>
  </details>
""" % ("\n      ".join(items))
    body = ("<main>\n" + (GAME % {"h1": "Rokonszavak, " + day_label(start), "lead": lead}) + solution + "</main>\n")
    html = (head(title, desc, "/feladvany/%s/" % p["id"], 2)
            + header("archivum", 2) + body + "\n" + DIALOG + "\n" + ARCHIVE_DIALOG + "\n"
            + footer(2) + "\n" + scripts(2, {"mode": "archiv", "id": p["id"]}))
    write("feladvany/%s/index.html" % p["id"], html)


def build_archive(published):
    months = {}
    for p in published:
        start = d(p["start"])
        months.setdefault((start.year, start.month), []).append(p)
    blocks = []
    for (y, m) in sorted(months.keys(), reverse=True):
        cards = []
        for p in sorted(months[(y, m)], key=lambda p: p["start"], reverse=True):
            start = d(p["start"])
            cards.append("""<a class="arch-kartya" href="../feladvany/%s/" data-feladvany="%s">
          <span class="arch-nap">%d</span>
          <span><span class="arch-cim">%s</span><br><span class="arch-alcim">%s</span></span>
        </a>""" % (p["id"], p["id"], start.day, day_label(start).capitalize(), WEEKDAYS[start.weekday()]))
        blocks.append("""<section class="honap">
      <h2>%d. %s</h2>
      <div class="honap-racs">
        %s
      </div>
    </section>""" % (y, MONTHS[m - 1], "\n        ".join(cards)))
    if not blocks:
        blocks = ['<p>Az első feladvány hamarosan érkezik. Nézz vissza holnap!</p>']
    body = """<main>
  <article class="szoveg">
    <h1>Archívum</h1>
    <p class="lead">Itt találod az összes korábbi Rokonszavak feladványt, napról napra. Bármelyiket lejátszhatod, de az archív játékok eredménye nem kerül bele a statisztikádba.</p>
    <div class="jelmagyarazat">
      <span><i class="jel" style="background:var(--szint-1)"></i> megfejtetted</span>
      <span><i class="jel" style="background:var(--szint-4)"></i> nem sikerült</span>
      <span><i class="jel" style="background:var(--tile)"></i> még nem játszottad</span>
    </div>
    %s
    <a class="btn btn-primary back" href="../">A mai feladvány</a>
  </article>
</main>
""" % ("\n    ".join(blocks))
    html = (head("Archívum – korábbi Rokonszavak feladványok",
                 "A korábbi Rokonszavak feladványok napról napra. Játszd le bármelyiket, vagy nézd meg a megoldást.",
                 "/archivum/", 1)
            + header("archivum", 1) + body + "\n" + footer(1) + "\n"
            + f'<script src="{asset("archivum.js", "../")}"></script>\n<script src="{asset("tema.js", "../")}"></script>\n</body>\n</html>\n')
    write("archivum/index.html", html)


def build_sitemap(published):
    urls = (["/", "/archivum/", "/szabalyok/"] + ["/feladvany/%s/" % p["id"] for p in published]
            + ["/rolunk/", "/adatvedelem/"])
    items = "\n".join('  <url><loc>%s%s</loc></url>' % (SITE, u) for u in urls)
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % items)
    write("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE)


def build_404():
    body = """<main>
  <article class="szoveg" style="text-align:center">
    <h1>Ez az oldal nem létezik</h1>
    <p class="lead">Lehet, hogy elgépelted a címet, vagy a feladvány még nem indult el.</p>
    <p><a class="btn btn-primary" href="/">Vissza a játékhoz</a> <a class="btn" href="/archivum/">Archívum</a></p>
  </article>
</main>
"""
    html = (head("Nincs ilyen oldal – Rokonszavak", "A keresett oldal nem található.", "/404.html", 0)
            + header("", 0) + body + "\n" + footer(0) + "\n</body>\n</html>\n")
    write("404.html", html)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ma = xlsx_to_js.today()
    print("Mai dátum (Budapest):", ma)
    try:
        all_puzzles, _ = xlsx_to_js.run(ma)
    except xlsx_to_js.BuildHiba as e:
        xlsx_to_js.hibak_kiirasa(e.args[0])
        sys.exit(1)
    puzzles = sorted(xlsx_to_js.load_js(), key=lambda p: p["start"])
    published = [p for p in puzzles if d(p["start"]) <= ma]
    print("Megjelent feladványok:", len(published))
    # a mar nem aktualis (pl. jovobeli) feladvanyoldalak torlese
    folder = os.path.join(ROOT, "feladvany")
    keep = {str(p["id"]) for p in published}
    if os.path.isdir(folder):
        for name in os.listdir(folder):
            if name not in keep:
                shutil.rmtree(os.path.join(folder, name), ignore_errors=True)
                print("   törölve: feladvany/%s" % name)
    build_index()
    build_rules()
    build_about()
    build_privacy()
    build_archive(published)
    for p in published:
        build_puzzle_page(p, solved_day=(d(p["start"]) < ma))
    build_sitemap(published)
    build_404()
    print("Kész.")
    xlsx_to_js.report(all_puzzles, ma)


if __name__ == "__main__":
    main()
