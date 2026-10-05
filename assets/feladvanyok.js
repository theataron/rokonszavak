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
  },
  {
    "id": "rsz-005",
    "start": "2026-09-27",
    "groups": [
      { "level": 1, "title": "Magyar rajzfilmfigurák", "words": ["Vuk", "Süsü", "Frakk", "Kukori"] },
      { "level": 2, "title": "___ + ÓRA", "words": ["Nap", "Homok", "Inga", "Torony"] },
      { "level": 3, "title": "Keresztnévvel kezdődik", "words": ["Katapult", "Liliom", "Andorra", "Ferences"], "note": "Kata, Lili, Andor, Ferenc" },
      { "level": 4, "title": "Visszafelé olvasva is magyar szó", "words": ["Kar", "Kép", "Lát", "Tér"], "note": "rak, pék, tál, rét" }
    ]
  },
  {
    "id": "rsz-006",
    "start": "2026-09-28",
    "groups": [
      { "level": 1, "title": "Sakkfigurák", "words": ["Bástya", "Futó", "Huszár", "Vezér"] },
      { "level": 2, "title": "Magyar folyók", "words": ["Tisza", "Dráva", "Rába", "Sajó"] },
      { "level": 3, "title": "Amit fel lehet venni", "words": ["Telefon", "Kabát", "Kölcsön", "Verseny"] },
      { "level": 4, "title": "Amit meg lehet oldani", "words": ["Rejtvény", "Feladat", "Csomó", "Cipőfűző"] }
    ]
  },
  {
    "id": "rsz-007",
    "start": "2026-09-29",
    "groups": [
      { "level": 1, "title": "Madarak", "words": ["Gólya", "Fecske", "Bagoly", "Pinty"] },
      { "level": 2, "title": "___ + KÖNYV", "words": ["Tan", "Szak", "Mese", "Zseb"] },
      { "level": 3, "title": "Aminek füle van", "words": ["Bögre", "Kosár", "Fazék", "Zsák"] },
      { "level": 4, "title": "Pénznemek, amik mást is jelentenek", "words": ["Font", "Márka", "Korona", "Frank"] }
    ]
  },
  {
    "id": "rsz-008",
    "start": "2026-09-30",
    "groups": [
      { "level": 1, "title": "Gombák", "words": ["Vargánya", "Csiperke", "Galóca", "Rizike"] },
      { "level": 2, "title": "Balatoni települések", "words": ["Tihany", "Siófok", "Fonyód", "Keszthely"] },
      { "level": 3, "title": "Amit el lehet kapni", "words": ["Labda", "Nátha", "Fonál", "Tolvaj"] },
      { "level": 4, "title": "Magyar városok anagrammái", "words": ["Rege", "Gulya", "Kóma", "Degesz"], "note": "Eger, Gyula, Makó, Szeged" }
    ]
  },
  {
    "id": "rsz-009",
    "start": "2026-10-01",
    "groups": [
      { "level": 1, "title": "Fűszerek", "words": ["Kapor", "Bors", "Kömény", "Babér"] },
      { "level": 2, "title": "SZÉL + ___", "words": ["Csend", "Vihar", "Kakas", "Malom"] },
      { "level": 3, "title": "Oda-vissza ugyanaz", "words": ["Görög", "Kerek", "Pap", "Sas"] },
      { "level": 4, "title": "___ + LÁB", "words": ["Szék", "Asztal", "Kamat", "Gólya"] }
    ]
  },
  {
    "id": "rsz-010",
    "start": "2026-10-02",
    "groups": [
      { "level": 1, "title": "Magyar sajtok", "words": ["Trappista", "Pannónia", "Óvári", "Karaván"] },
      { "level": 2, "title": "SZEM + ___", "words": ["Üveg", "Héj", "Golyó", "Tanú"] },
      { "level": 3, "title": "Amit be lehet tartani", "words": ["Szó", "Ígéret", "Szabály", "Távolság"] },
      { "level": 4, "title": "Városok, amik köznevek is", "words": ["Tata", "Baja", "Gyula", "Hajós"] }
    ]
  },
  {
    "id": "rsz-011",
    "start": "2026-10-03",
    "groups": [
      { "level": 1, "title": "Budapesti metrómegállók", "words": ["Astoria", "Blaha", "Opera", "Lehel"] },
      { "level": 2, "title": "Magyar kártyajátékok", "words": ["Ulti", "Römi", "Makaó", "Snapszer"] },
      { "level": 3, "title": "Amit fel lehet állítani", "words": ["Rekord", "Sátor", "Csapat", "Szobor"] },
      { "level": 4, "title": "Ikerszavak első tagja", "words": ["Csiga", "Tarka", "Dimbes", "Ripsz"], "note": "csiga-biga, tarka-barka, dimbes-dombos, ripsz-ropsz" }
    ]
  },
  {
    "id": "rsz-012",
    "start": "2026-10-04",
    "groups": [
      { "level": 1, "title": "Halak", "words": ["Ponty", "Harcsa", "Keszeg", "Csuka"] },
      { "level": 2, "title": "TŰZ + ___", "words": ["Oltó", "Fal", "Csap", "Veszély"] },
      { "level": 3, "title": "Aminek foga van", "words": ["Fésű", "Fűrész", "Gereblye", "Cipzár"] },
      { "level": 4, "title": "Főnév és ige is egyben", "words": ["Vár", "Fog", "Nyúl", "Ég"] }
    ]
  },
  {
    "id": "rsz-013",
    "start": "2026-10-05",
    "groups": [
      { "level": 1, "title": "Magyar borvidékek", "words": ["Tokaj", "Villány", "Eger", "Szekszárd"] },
      { "level": 2, "title": "A Pál utcai fiúk szereplői", "words": ["Nemecsek", "Boka", "Áts", "Geréb"] },
      { "level": 3, "title": "Régi magyar mértékegységek", "words": ["Hold", "Öl", "Icce", "Akó"], "note": "1 hold ≈ 5755 m², 1 icce ≈ 0,8 liter" },
      { "level": 4, "title": "Hangszer rejtőzik a szó elején", "words": ["Dobás", "Sípálya", "Lantos", "Kürtő"], "note": "dob, síp, lant, kürt" }
    ]
  },
  {
    "id": "rsz-014",
    "start": "2026-10-06",
    "groups": [
      { "level": 1, "title": "Retró magyar édességek és üdítők", "words": ["Negro", "Bambi", "Traubi", "Boci"] },
      { "level": 2, "title": "Varrás közben", "words": ["Öltés", "Szegély", "Gombolyag", "Tű"] },
      { "level": 3, "title": "A SZÉP rokon értelmű szavai", "words": ["Csinos", "Bájos", "Takaros", "Helyes"] },
      { "level": 4, "title": "Amit a tűz csinál", "words": ["Pattog", "Lobog", "Izzik", "Sistereg"] }
    ]
  }
];
