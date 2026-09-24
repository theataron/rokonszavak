# Rokonszavak — rules for Claude Code

Static site (HTML, CSS, vanilla JS), no framework. Hosted on GitHub Pages at
rokonszavak.hu. The owner is a marketer, not a developer: explain changes in
plain Hungarian or English, and never leave the site in a broken state.

## Files
- `index.html` — today's puzzle (picked in the browser by Budapest date)
- `archivum/`, `szabalyok/`, `adatvedelem/`, `feladvany/<id>/` — generated pages
- `feladvanyok.xlsx` — puzzle source, the single source of truth (sheet
  `Feladványok`; the other sheets are the owner's). The `csapda` column is
  private QA and must never reach the site.
- `assets/feladvanyok.js` — generated from the workbook by
  `scripts/xlsx_to_js.py`; only past, today's and tomorrow's puzzles. Never
  hand-edit.
- `assets/jatek.js`, `styles.css`, `suti.js`, `archivum.js`, `tema.js`
- `build.py` — runs the xlsx conversion, then regenerates subpages and sitemap
- `.github/workflows/epites.yml` — runs build.py nightly and on workbook push

## Hard rules
- Never rename or restructure the localStorage keys (`rokonszavak-v1`,
  `rokonszavak-tema`, `rokonszavak-suti`). If the format must change, migrate
  the existing data.
- Never edit a puzzle that is already live. A new puzzle gets a new id.
- Don't queue many future puzzles — `assets/feladvanyok.js` is public.
- GA4 loads only after cookie consent. No tracking before consent.
- No mention of NYT or Connections in site copy, meta tags or keywords.

## Design
- Level colours: #7DDE92, #2EBFA5, #2B76C6, #4E4187, identical in light and
  dark. Tokens (`--szint-1`…`--szint-4`) at the top of `assets/styles.css`.
- Words on rounded rectangles (radius 18px, never below 14px); solved groups
  as fully rounded pills (radius 999px). Font size by word length via
  `data-meret`.
- Buttons: Keverés / Kijelölés törlése / Küldés. All site copy in Hungarian.
- Mobile first; the header must stay on one row from 320px upwards.

## Puzzles
One puzzle per day, switching at 00:00 Europe/Budapest. Four groups of four
words, each word used once. Words in the level 4 group should be believable decoys for other
groups: not necessarily all four, but the more the better. Add a note only when
it adds information the title doesn't already give (e.g. full names, the formed
words). No notes that just restate or explain the category.

Draft (not yet published) puzzles live in `vazlatok/`, which is gitignored.
Never commit or publish anything from that folder.

## Workflow
- Test locally (`python -m http.server`) and check a 360px-wide phone layout
  before finishing.
- Show me what changed and wait for my OK before committing or pushing.
