/* =====================================================================
   FELADVÁNYOK – ezt a fájlt a build.py generálja a feladvanyok.xlsx-ből.
   NE szerkeszd kézzel: a munkafüzetet írd át, és futtasd a build.py-t.
   - start: az a nap, amikor a feladvány élesedik (ÉÉÉÉ-HH-NN, budapesti idő)
   - level: 1 = legkönnyebb ... 4 = legtrükkösebb
   - note: rövid kiegészítés, ami a megfejtés után jelenik meg
   ===================================================================== */
window.FELADVANYOK = [
  {
    "id": 1,
    "start": "2026-09-21",
    "groups": [
      { "level": 1, "title": "Testrészek", "words": ["Könyök", "Boka", "Térd", "Tarkó"] },
      { "level": 2, "title": "Húsvéti hagyományok", "words": ["Tojás", "Sonka", "Barka", "Kölni"], "note": "A kölni a locsolkodás kelléke." },
      { "level": 3, "title": "Népi hangszerek", "words": ["Citera", "Tárogató", "Cimbalom", "Duda"] },
      { "level": 4, "title": "Főnevek, amelyek igék is", "words": ["Dob", "Nyúl", "Szív", "Fog"], "note": "Dobni, nyúlni, szívni, fogni." }
    ]
  },
  {
    "id": "rsz-002",
    "start": "2026-09-24",
    "groups": [
      { "level": 1, "title": "Magyar levesek", "words": ["Palóc", "Jókai", "Újházi", "Gulyás"] },
      { "level": 2, "title": "Budapesti hidak", "words": ["Lánc", "Erzsébet", "Margit", "Szabadság"] },
      { "level": 3, "title": "Foglalkozás és gyakori vezetéknév", "words": ["Kovács", "Szabó", "Molnár", "Halász"] },
      { "level": 4, "title": "Amit le lehet tenni", "words": ["Vizsga", "Eskü", "Fegyver", "Lant"] }
    ]
  },
  {
    "id": "rsz-003",
    "start": "2026-09-25",
    "groups": [
      { "level": 1, "title": "Csillagjegyek", "words": ["Rák", "Kos", "Bika", "Ikrek"] },
      { "level": 2, "title": "Magyar kutyafajták", "words": ["Puli", "Vizsla", "Kuvasz", "Pumi"] },
      { "level": 3, "title": "Aminek nyelve van", "words": ["Cipő", "Harang", "Öv", "Mérleg"] },
      { "level": 4, "title": "Egy betű cseréjével vármegye", "words": ["Fehér", "Bélés", "Rest", "Volna"], "note": "Fejér, Békés, Pest, Tolna" }
    ]
  },
  {
    "id": "rsz-004",
    "start": "2026-09-26",
    "groups": [
      { "level": 1, "title": "Magyar kártya színei", "words": ["Makk", "Tök", "Zöld", "Piros"] },
      { "level": 2, "title": "Pálinkafajták", "words": ["Barack", "Szilva", "Törköly", "Kökény"] },
      { "level": 3, "title": "Ételnév, ami személynévből jön", "words": ["Dobos", "Rigó", "Esterházy", "Zserbó"], "note": "Dobos C. József, Rigó Jancsi, Esterházy Pál, Gerbeaud Emil" },
      { "level": 4, "title": "Amit el lehet sütni", "words": ["Poén", "Puska", "Vicc", "Ágyú"] }
    ]
  }
];
