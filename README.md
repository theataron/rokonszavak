# Rokonszavak – rokonszavak.hu

Napi magyar szójáték: 16 szó, négy csoport.

## Az oldal felépítése

| Cím | Fájl |
|---|---|
| `/` | `index.html` – a mai feladvány |
| `/archivum/` | a korábbi feladványok naptára, napról napra |
| `/szabalyok/` | Játékszabályok |
| `/feladvany/rsz-002/` | egy-egy korábbi feladvány saját oldala (SEO + archív játék) |
| `/adatvedelem/` | Adatvédelem és sütik |

Közös fájlok:

| Fájl | Mire való |
|---|---|
| `feladvanyok.xlsx` | **a feladványok – csak ezt kell szerkesztened** |
| `assets/feladvanyok.js` | a munkafüzetből generálva, kézzel ne szerkeszd |
| `assets/jatek.js` | a játék logikája |
| `assets/styles.css` | a design (színek a fájl tetején) |
| `assets/suti.js` | süti sáv + Google Analytics (csak elfogadás után indul) |
| `assets/archivum.js`, `assets/tema.js` | archívum jelölések, sötét mód |
| `build.py`, `scripts/` | az oldalgenerátor |

Ne töröld: `CNAME` (a domain), `og-kep.png` (megosztási kép), `robots.txt`, `sitemap.xml`.

## Új feladvány hozzáadása

1. Nyisd meg a `feladvanyok.xlsx`-et, a `Feladványok` lapon adj hozzá négy sort (szintenként egyet).
2. Új azonosító (`feladvany_id`), és a `kezdes` oszlopba a nap, amikor élesedik (ÉÉÉÉ-HH-NN).
3. Mentsd el. Utána futtasd a `python build.py`-t, vagy töltsd fel a munkafüzetet a GitHubra: az Action magától újraépít.

Ha valami hibás (hiányzó cella, ismétlődő szó, két feladvány ugyanarra a napra, már élesben lévő feladvány módosítása), a build leáll, és kiírja, melyik feladványban mi a gond. Ilyenkor semmi nem változik az oldalon.

## Hogyan vált a napi feladvány?

A böngésző választja ki a mai feladványt budapesti idő szerint, így éjfélkor mindenkinél egyszerre vált, bárhol van a látogató. Az `assets/feladvanyok.js`-ben mindig csak a mai és a holnapi feladvány van benne (meg a korábbiak), a távolabbiak nem szivárognak ki.

A GitHub Action (`.github/workflows/epites.yml`) minden éjjel lefut: betölti a következő napot, elkészíti a tegnapi feladvány megoldásoldalát, és frissíti a sitemapet. Ha egy héten belül elfogynak a feladványok, a futás pirosra vált, és a GitHub e-mailt küld.

Ha egy napra nincs feladvány, a legutóbbi jelenik meg újra (ez nem számít bele a sorozatba).

Teszteléshez szimulálhatsz dátumot: `python build.py --ma 2026-10-20`, a böngészőben pedig (csak helyben) `localhost:8000/?ma=2026-10-20`.

## Hasznos linkek

- `rokonszavak.hu/?teszt=rsz-003` – egy feladvány kipróbálása mentés nélkül
- `rokonszavak.hu/?reset=1` – a saját böngésződ mentett adatainak törlése
- `rokonszavak.hu/sitemap.xml` – ezt add meg a Google Search Console-ban
