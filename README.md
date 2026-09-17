# Rokonszavak – rokonszavak.hu

Heti magyar szójáték: 16 szó, négy csoport.

## Fájlok

| Fájl | Mire való |
|---|---|
| `index.html` | A teljes weboldal: játék, Játékszabályok, statisztika, sötét mód |
| `CNAME` | Megmondja a GitHubnak, hogy az oldal a rokonszavak.hu címen fut (ne töröld!) |
| `404.html` | Ez jelenik meg, ha valaki nem létező címet ír be |
| `robots.txt` | Engedi, hogy a keresők (Google) megtalálják az oldalt |

## Új feladvány hozzáadása

1. Nyisd meg az `index.html`-t a GitHubon, és kattints a ceruza ikonra (Edit).
2. Keresd meg a `PUZZLES – this is the part you edit` részt.
3. Másolj le egy teljes feladványt `{ id: ... }` blokkal együtt, írd át az `id`-t, a `start` dátumot (mindig hétfő), a címeket és a szavakat.
4. Lent kattints a **Commit changes** gombra. Kb. 1 perc múlva élesben van.

Szabályok: minden szó csak egyszer szerepelhet egy feladványban, és minden csoportban pontosan 4 szó legyen.

## Hasznos tesztlinkek

- `rokonszavak.hu/?teszt=2` – a 2. feladvány kipróbálása, eredmény mentése nélkül
- `rokonszavak.hu/?reset=1` – a saját böngésződben törli a mentett haladást és statisztikát
- `rokonszavak.hu/#szabalyok` – a Játékszabályok oldal
