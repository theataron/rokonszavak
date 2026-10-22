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
  },
  {
    "id": "rsz-015",
    "start": "2026-10-07",
    "groups": [
      { "level": 1, "title": "Tejtermékek", "words": ["Túró", "Tejföl", "Vaj", "Kefir"] },
      { "level": 2, "title": "Magyar zenekarok", "words": ["Omega", "Illés", "Hungária", "Neoton"] },
      { "level": 3, "title": "Kártyázás közben", "words": ["Oszt", "Emel", "Passzol", "Üt"] },
      { "level": 4, "title": "Egy betű cseréjével állat lesz belőle", "words": ["Lila", "Sás", "Eger", "Kassa"], "note": "liba, sas, egér, kacsa" }
    ]
  },
  {
    "id": "rsz-016",
    "start": "2026-10-08",
    "groups": [
      { "level": 1, "title": "Ami a kaszinóban van", "words": ["Rulett", "Zseton", "Krupié", "Jackpot"] },
      { "level": 2, "title": "A BUTA rokon értelmű szavai", "words": ["Ostoba", "Balga", "Együgyű", "Dőre"] },
      { "level": 3, "title": "Horgászfelszerelés", "words": ["Úszó", "Ólom", "Orsó", "Csali"] },
      { "level": 4, "title": "Ital rejtőzik a szó elején", "words": ["Borotva", "Sörény", "Tejút", "Vízum"], "note": "bor, sör, tej, víz" }
    ]
  },
  {
    "id": "rsz-017",
    "start": "2026-10-09",
    "groups": [
      { "level": 1, "title": "Mezei virágok", "words": ["Pipacs", "Nefelejcs", "Margaréta", "Kankalin"] },
      { "level": 2, "title": "Mai magyar márkák", "words": ["Prezi", "Wizz", "Barion", "Nanushka"], "note": "Prezi, Wizz Air, Barion, Nanushka" },
      { "level": 3, "title": "Amit a víz csinál", "words": ["Csobog", "Zubog", "Csordul", "Szivárog"] },
      { "level": 4, "title": "Szám rejtőzik a szó elején", "words": ["Ötlet", "Hatás", "Kétely", "Százalék"], "note": "öt, hat, két, száz" }
    ]
  },
  {
    "id": "rsz-018",
    "start": "2026-10-10",
    "groups": [
      { "level": 1, "title": "Falusi ünnepek", "words": ["Farsang", "Szüret", "Búcsú", "Majális"] },
      { "level": 2, "title": "Sütés közben", "words": ["Dagaszt", "Kel", "Pihen", "Sül"] },
      { "level": 3, "title": "Mai fiatalok szavai", "words": ["Rizz", "Cringe", "Sigma", "Flex"] },
      { "level": 4, "title": "___ + HÁZ", "words": ["Tár", "Üveg", "Kór", "Bér"], "note": "tárház, üvegház, kórház, bérház" }
    ]
  },
  {
    "id": "rsz-019",
    "start": "2026-10-11",
    "groups": [
      { "level": 1, "title": "A magyar labdarúgó-válogatott tagjai", "words": ["Szoboszlai", "Dárdai", "Kerkez", "Dibusz"] },
      { "level": 2, "title": "Asztalos szerszámai", "words": ["Gyalu", "Véső", "Reszelő", "Fúró"] },
      { "level": 3, "title": "Állathangok", "words": ["Nyerít", "Mekeg", "Gágog", "Bőg"] },
      { "level": 4, "title": "Gyümölcs rejtőzik a szóban", "words": ["Almanach", "Meggyőz", "Dióda", "Szederjes"], "note": "alma, meggy, dió, szeder" }
    ]
  },
  {
    "id": "rsz-020",
    "start": "2026-10-12",
    "groups": [
      { "level": 1, "title": "Magyar hegységek", "words": ["Mátra", "Bükk", "Mecsek", "Pilis"] },
      { "level": 2, "title": "Kötelező olvasmányok", "words": ["Toldi", "Tüskevár", "Abigél", "Bogáncs"], "note": "Arany, Fekete István, Szabó Magda" },
      { "level": 3, "title": "A piros árnyalatai", "words": ["Bordó", "Meggy", "Skarlát", "Rőt"] },
      { "level": 4, "title": "A GYORS rokon értelmű szavai", "words": ["Sebes", "Fürge", "Serény", "Szapora"] }
    ]
  },
  {
    "id": "rsz-021",
    "start": "2026-10-13",
    "groups": [
      { "level": 1, "title": "Ami a tolltartóban van", "words": ["Radír", "Vonalzó", "Hegyező", "Filctoll"] },
      { "level": 2, "title": "Ásványok", "words": ["Opál", "Ametiszt", "Jáspis", "Borostyán"] },
      { "level": 3, "title": "A SOK rokon értelmű szavai", "words": ["Rengeteg", "Temérdek", "Számtalan", "Garmada"], "note": "garmada = nagy halom" },
      { "level": 4, "title": "Testrész rejtőzik a szó elején", "words": ["Fülke", "Hasáb", "Karácsony", "Szemét"], "note": "fül, has, kar, szem" }
    ]
  },
  {
    "id": "rsz-022",
    "start": "2026-10-14",
    "groups": [
      { "level": 1, "title": "Magyar várak", "words": ["Siklós", "Sümeg", "Füzér", "Diósgyőr"] },
      { "level": 2, "title": "Magyar feltalálók", "words": ["Rubik", "Bíró", "Kandó", "Jedlik"], "note": "Rubik Ernő, Bíró László, Kandó Kálmán, Jedlik Ányos" },
      { "level": 3, "title": "Kertészkedés közben", "words": ["Metsz", "Ültet", "Öntöz", "Gyomlál"] },
      { "level": 4, "title": "Egy betű cseréjével madár lesz belőle", "words": ["Gálya", "Verés", "Ponty", "Sós"], "note": "gólya, veréb, pinty, sas" }
    ]
  },
  {
    "id": "rsz-023",
    "start": "2026-10-15",
    "groups": [
      { "level": 1, "title": "Magyar tájegységek", "words": ["Hortobágy", "Nyírség", "Hajdúság", "Kiskunság"] },
      { "level": 2, "title": "Népi hangszerek", "words": ["Citera", "Tekerő", "Doromb", "Furulya"] },
      { "level": 3, "title": "A FÁRADT rokon értelmű szavai", "words": ["Nyúzott", "Kimerült", "Bágyadt", "Törődött"] },
      { "level": 4, "title": "Állat rejtőzik a szóban", "words": ["Kosár", "Sasszé", "Borzaszt", "Rákattan"], "note": "kos, sas, borz, rák" }
    ]
  },
  {
    "id": "rsz-024",
    "start": "2026-10-16",
    "groups": [
      { "level": 1, "title": "Zöldségek", "words": ["Retek", "Cékla", "Karalábé", "Padlizsán"] },
      { "level": 2, "title": "Ami a padláson van", "words": ["Pókháló", "Láda", "Gerenda", "Lom"] },
      { "level": 3, "title": "Amit a szél csinál", "words": ["Süvít", "Zúg", "Fütyül", "Tombol"] },
      { "level": 4, "title": "Ország rejtőzik a szóban", "words": ["Kínál", "Kirándul", "Indián", "Románc"], "note": "Kína, Irán, India, Omán" }
    ]
  },
  {
    "id": "rsz-025",
    "start": "2026-10-17",
    "groups": [
      { "level": 1, "title": "Magyar találmányok", "words": ["Gyufa", "Dinamó", "Szódavíz", "Golyóstoll"], "note": "Irinyi (gyufa), Jedlik (dinamó, szódavíz), Bíró (golyóstoll)" },
      { "level": 2, "title": "Fizikai mennyiségek", "words": ["Munka", "Erő", "Nyomás", "Energia"] },
      { "level": 3, "title": "Mértékegységek", "words": ["Láb", "Volt", "Karát", "Év"], "note": "1 láb = 30,48 cm; 1 karát = 0,2 gramm" },
      { "level": 4, "title": "Nyelvtani fogalmak", "words": ["Eset", "Mód", "Szám", "Személy"] }
    ]
  },
  {
    "id": "rsz-026",
    "start": "2026-10-18",
    "groups": [
      { "level": 1, "title": "Testrészek", "words": ["Írisz", "Lép", "Hörgő", "Ér"] },
      { "level": 2, "title": "Szavak az Anyám tyúkjából", "words": ["Morzsa", "Szoba", "Galamb", "Kő"], "note": "Petőfi Sándor verse" },
      { "level": 3, "title": "Kottajelek", "words": ["Kulcs", "Szünet", "Kereszt", "Ütem"], "note": "A kereszt félhanggal feljebb emel" },
      { "level": 4, "title": "Matematikai fogalmak", "words": ["Tört", "Gyök", "Szög", "Sor"] }
    ]
  },
  {
    "id": "rsz-027",
    "start": "2026-10-19",
    "groups": [
      { "level": 1, "title": "Kémiai elemek", "words": ["Szén", "Vas", "Hélium", "Arany"] },
      { "level": 2, "title": "Növényi részek", "words": ["Bibe", "Szár", "Bimbó", "Rügy"], "note": "A bibe a termő felső, ragadós része" },
      { "level": 3, "title": "Hajórészek", "words": ["Orr", "Far", "Árboc", "Kormány"] },
      { "level": 4, "title": "Felszínformák", "words": ["Fok", "Öböl", "Nyereg", "Medence"], "note": "A nyereg két csúcs közti bemélyedés" }
    ]
  },
  {
    "id": "rsz-028",
    "start": "2026-10-20",
    "groups": [
      { "level": 1, "title": "Ami a cukrászdában van", "words": ["Fagylalt", "Krémes", "Somlói", "Rétes"] },
      { "level": 2, "title": "A madár testrészei", "words": ["Csőr", "Toll", "Szárny", "Begy"] },
      { "level": 3, "title": "Az óra részei", "words": ["Mutató", "Rugó", "Inga", "Korona"] },
      { "level": 4, "title": "Optikai fogalmak", "words": ["Fény", "Árnyék", "Tükör", "Lencse"] }
    ]
  },
  {
    "id": "rsz-029",
    "start": "2026-10-21",
    "groups": [
      { "level": 1, "title": "Magyar sörmárkák", "words": ["Soproni", "Dreher", "Borsodi", "Kőbányai"] },
      { "level": 2, "title": "A könyv részei", "words": ["Gerinc", "Fül", "Margó", "Kötés"], "note": "A fül a borító behajtott széle" },
      { "level": 3, "title": "Közgazdasági fogalmak", "words": ["Kamat", "Hozam", "Kínálat", "Mérleg"] },
      { "level": 4, "title": "Jogi fogalmak", "words": ["Per", "Vád", "Tanú", "Ítélet"] }
    ]
  },
  {
    "id": "rsz-030",
    "start": "2026-10-22",
    "groups": [
      { "level": 1, "title": "Konyhai eszközök", "words": ["Habverő", "Fakanál", "Tepsi", "Merőkanál"] },
      { "level": 2, "title": "A számítógépen", "words": ["Egér", "Ablak", "Mappa", "Kukac"] },
      { "level": 3, "title": "A levél részei", "words": ["Nyél", "Fonák", "Csúcs", "Szél"], "note": "A fonák a levél alsó oldala" },
      { "level": 4, "title": "A fog részei", "words": ["Zománc", "Gyökér", "Korona", "Ideg"] }
    ]
  },
  {
    "id": "rsz-031",
    "start": "2026-10-23",
    "groups": [
      { "level": 1, "title": "Magyar olimpiai sportágak", "words": ["Vízilabda", "Kajak", "Párbajtőr", "Öttusa"] },
      { "level": 2, "title": "Vasúti szavak", "words": ["Váltó", "Sín", "Kocsi", "Pálya"] },
      { "level": 3, "title": "A folyó részei", "words": ["Torkolat", "Meder", "Part", "Forrás"] },
      { "level": 4, "title": "Vulkáni szavak", "words": ["Kráter", "Láva", "Hamu", "Kőzet"] }
    ]
  }
];
