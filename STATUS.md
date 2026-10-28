# STATUS

## What was built

A freebies directory of free chess resources, delivered as both a Markdown directory and a static HTML site with client-side search.

Files:
- `resources.md` &mdash; Markdown directory with 9 listings (cost, platform, steps, official link each)
- `resources.json` &mdash; structured data (9 entries) powering the site
- `index.html` &mdash; static HTML site, no build step, no server required
- `style.css` &mdash; responsive card layout
- `app.js` &mdash; client-side search (name, category, platform, cost) plus category filter
- `LICENSE` &mdash; MIT License, copyright line exactly `Copyright (c) 2026 Asdale Dynamics, LLC`
- `README.md` &mdash; overview, how to run, listings, credit to Asdale Dynamics, LLC
- `STATUS.md` &mdash; this file

Listings: Lichess, Chess.com free tier, Lichess Puzzles, Chess.com Puzzles, Lichess Tactics Trainer, Lichess Opening Explorer, 365Chess.com Opening Database, Lichess Studies (endgame studies), Lichess Endgame Training.

No affiliate links. No secrets, API keys, or personal data in files. No `.github/workflows` files.

Credit: Asdale Dynamics, LLC &mdash; https://dylanasdale.github.io

## How to run

Open `index.html` in any modern browser. The site loads `resources.json` and filters/searches entirely in the browser. Optionally serve the folder over HTTP (e.g. `python3 -m http.server 8000`) &mdash; direct file open also works in most browsers.

## Verification results

- `resources.json` parses as valid JSON with 9 entries
- `index.html` parses as valid HTML
- `LICENSE` contains the exact line `Copyright (c) 2026 Asdale Dynamics, LLC`
- Local HTTP serve test: `index.html` returned HTTP 200, `resources.json` returned HTTP 200 with all 9 entries served
- Client-side search/filter logic exercised via the served page; no build tooling required
- Grep for secrets/keys/tokens/personal data: none found
- Git initialized and committed as existing identity `Dylan Asdale <dylanasdale@users.noreply.github.com>`; commit `5d2a7f4`, plain message, no Co-authored-by trailers. Not pushed, no remote created.

## Known gaps

- Client-side search requires JavaScript; the Markdown directory (`resources.md`) is the no-JS fallback
- Resource pricing/features can change; users should verify current details on each official site
- No automated test suite; verification was manual (parse + local serve + curl)
- Endgame study content beyond Lichess is not yet included
