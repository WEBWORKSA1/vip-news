# Vip.News

The daily briefing on the people who move the world. A static, self-updating site for the domain `vip.news`.

- **Live pages** are the HTML files at the repository root, served by GitHub Pages from `main`.
- **`scripts/update.mjs`** refreshes `data/*.json` (headlines, the guest list, birthdays, videos).
- **`scripts/build.mjs`** rebuilds every page from that data and from `scripts/content.mjs`.
- **`.github/workflows/refresh.yml`** runs both every three hours and commits the result.
- **`scripts/config.mjs`** holds feeds, desks, AdSense slot IDs, payment links and contest settings.

Run locally with Node 22: `node scripts/update.mjs && node scripts/build.mjs`, then serve the folder.

See `docs/BUILD-PROMPT.md` for the phase-by-phase build prompt and `docs/RESEARCH.md` for the research log.

Vip.News is independent and is not affiliated with any publisher, person or organisation it names, or with any other business using a similar name.
