# Rokonszavak — rules for Claude Code

Static site (HTML, CSS, vanilla JS), no framework. Hosted on GitHub Pages at
rokonszavak.hu. The owner is a marketer, not a developer: explain changes in
plain Hungarian or English, and never leave the site in a broken state.

## Files
- `index.html` — current weekly puzzle
- `archivum/`, `szabalyok/`, `adatvedelem/`, `feladvany/<id>/` — generated pages
- `assets/feladvanyok.js` — puzzle data, the single source of truth
- `assets/jatek.js`, `styles.css`, `suti.js`, `archivum.js`, `tema.js`
- `build.py` — regenerates subpages and sitemap; run it after editing puzzles
- `.github/workflows/epites.yml` — runs build.py nightly

## Hard rules
- Never rename or restructure the localStorage keys (`rokonszavak-v1`,
  `rokonszavak-tema`, `rokonszavak-suti`). If the format must change, migrate
  the existing data.
- Never edit a puzzle that is already live. A new puzzle gets a new id.
- Don't queue many future puzzles — `assets/feladvanyok.js` is public.
- GA4 loads only after cookie consent. No tracking before consent.
- No mention of NYT or Connections in site copy, meta tags or keywords.

## Design
- Level colours: yellow, orange, red, burgundy. No purple. Tokens at the top of
  `assets/styles.css`.
- Words in circles, solved groups as fully rounded pills.
- Buttons: Keverés / Kijelölés törlése / Kész. All site copy in Hungarian.
- Mobile first; the header must stay on one row from 320px upwards.

## Puzzles
One puzzle per day. Four groups of four words, each word used once, max nine
characters. Words in the level 4 group should be believable decoys for other
groups: not necessarily all four, but the more the better. Add a note only when
it adds information the title doesn't already give (e.g. full names, the formed
words). No notes that just restate or explain the category.

Draft (not yet published) puzzles live in `vazlatok/`, which is gitignored.
Never commit or publish anything from that folder.

## Workflow
- Test locally (`python -m http.server`) and check a 360px-wide phone layout
  before finishing.
- Show me what changed and wait for my OK before committing or pushing.
