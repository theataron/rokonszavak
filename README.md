# Rokonszavak – rokonszavak.hu

Heti magyar szójáték: 16 szó, négy csoport.

## Az oldal felépítése

| Cím | Fájl |
|---|---|
| `/` | `index.html` – az aktuális heti feladvány |
| `/archivum/` | a korábbi feladványok naptára |
| `/szabalyok/` | Játékszabályok |
| `/feladvany/1/` | egy-egy korábbi feladvány saját oldala (SEO + archív játék) |
| `/adatvedelem/` | Adatvédelem és sütik |

Közös fájlok az `assets` mappában:

| Fájl | Mire való |
|---|---|
| `feladvanyok.js` | **a feladványok – csak ezt kell szerkesztened** |
| `jatek.js` | a játék logikája |
| `styles.css` | a design (színek a fájl tetején) |
| `suti.js` | süti sáv + Google Analytics (csak elfogadás után indul) |
| `archivum.js`, `tema.js` | archívum jelölések, sötét mód |

Ne töröld: `CNAME` (a domain), `og-kep.png` (megosztási kép), `robots.txt`, `sitemap.xml`.

## Új feladvány hozzáadása

1. Nyisd meg az `assets/feladvanyok.js` fájlt, és másolj le egy meglévő blokkot.
2. Írd át az `id`-t, a `start` dátumot (mindig hétfő), a címeket és a szavakat.
3. Futtasd: `python build.py`
4. Töltsd fel a módosult fájlokat a GitHubra.

Szabályok: minden csoportban pontosan 4 szó, egy szó csak egyszer szerepelhet, és a szavak legfeljebb 9 karakteresek legyenek (a körök mérete miatt).

## Miért kell a build.py?

A generátor írja meg az aloldalakat és a sitemapet. Csak a **már elindult** feladványoknak készít oldalt, a megoldás pedig csak a lezárult hetek oldalán jelenik meg. Ezért érdemes hetente egyszer lefuttatni (vagy amikor új feladványt adsz hozzá), és feltölteni az eredményt.

Teszteléshez szimulálhatsz dátumot: `python build.py --ma 2026-10-20`

## Hasznos linkek

- `rokonszavak.hu/?teszt=2` – a 2. feladvány kipróbálása mentés nélkül
- `rokonszavak.hu/?reset=1` – a saját böngésződ mentett adatainak törlése
- `rokonszavak.hu/sitemap.xml` – ezt add meg a Google Search Console-ban

## Fontos tudnivaló

Az `assets/feladvanyok.js` fájl nyilvános, tehát aki megnyitja, látja a jövőbeli feladványokat is. Ezért ne tegyél bele sok hetet előre.
