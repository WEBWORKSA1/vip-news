# Vip.News: phase-by-phase build prompt

Paste one phase at a time into a coding agent. Each phase ends with a check that must pass before the next begins.

## The idea

**Vip.News is a people-first news briefing.** "VIP" means very important people, so the site answers one question every day: who is the world reading about, and what did they do?

- **Core asset:** "the guest list", a daily ranking of the 100 most-read people on English Wikipedia with their change in position from the day before. It is original, automated and free to produce.
- **Six desks:** world and power, business and wealth, tech and founders, entertainment, sports, royals and society. Headlines link to the publisher.
- **Why this pays:** advertising for business, finance and tech content earns several times more per thousand views than entertainment. A people ranking pulls celebrity-scale traffic while half the desks carry the better-paying ads.
- **Revenue:** AdSense, desk and ranking sponsorship, reader support, contest partners, and a briefing list for lead generation.

## Fixed requirements for every phase

- Domain: `vip.news`. Brand as "Vip.News". Never write "VIPNews" or "VIP News" as a brand name.
- Static site that runs on the free GitHub Pages plan from the `main` branch root. No build step on the server. Relative links only, so it works at both `user.github.io/vip-news/` and the custom domain.
- AdSense in the `<head>` of every page, exactly:
  `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
- First element on every page: a strip reading **"Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership"**, linked to the owner's business contact page. The link target is never shown as text.
- One contact email for every form. It is supplied privately. It must never appear as text in any page, script, document or commit. Forms post through FormSubmit; the address is assembled in the browser at send time.
- No copied article text, no publisher images, no photos of people.

## Phase 1: research and concept

Read at least 38 leading sites across briefings, aggregators, people and celebrity news, wealth rankings, general news and news quizzes. For each, record navigation, content modules, forms, revenue and interactive features. Write the findings to `docs/RESEARCH.md` and list which feature each site contributed. Search trademark records for "VIP News" and note the results.

**Check:** 38 or more sites logged with a "used" note each.

## Phase 2: data refresh job

Write `scripts/update.mjs` (Node 22, no dependencies) that produces `data/*.json`:

1. **Headlines:** fetch RSS and Atom feeds listed in `scripts/config.mjs`, grouped by desk. Keep headline, link, publisher, time. Drop anything older than 72 hours, remove duplicates, cap each desk at 45.
2. **Guest list:** Wikimedia "top pageviews" for the latest finished day; keep only humans (Wikidata "instance of: human"); attach the Wikidata description; sort into power, business, screen, music, sports or culture; compare with the day before for rank change. Keep 100.
3. **Born today:** Wikipedia "on this day" births for yesterday, today and tomorrow.
4. **Video:** latest uploads from official news channels through YouTube channel feeds.

Every source is optional. If one fails, keep the previous file. Log each source's result to `data/meta.json`.

**Check:** the job finishes with every feed reported as ok or failed, and no file is emptied by a failure.

## Phase 3: page builder and design

Write `scripts/build.mjs` to generate every page from the data and from `scripts/content.mjs`.

- **Design:** velvet plum `#2a1233`, plum `#5b2a6e`, lilac paper `#f6f3f8`, ink `#17121b`, brass `#b5852a`. Bodoni Moda for headings and rank numerals, Schibsted Grotesk for text. The guest list is the hero: ten rows that arrive in sequence on load. Everything else stays quiet. Light and dark themes, text-size control, visible keyboard focus, reduced-motion support, responsive to 360px.
- **Pages:** home; six desks; latest headlines (search, desk filter, time buckets); the guest list (search, field filter, headline counts); video; born today (with any-date lookup); daily quiz; compare two people; guides index and eight original guides; join; advertise; support; contests and rules; work with us; about; contact; editorial policy; privacy and cookies; terms; trademark and copyright disclosure; 404.
- **SEO:** unique title and description, canonical URL, Open Graph tags, JSON-LD on the home page and guides, `sitemap.xml`, `robots.txt`, `ads.txt`.
- Headlines are baked into the HTML so crawlers and the AdSense reviewer see content without running scripts.

**Check:** every page renders with empty data (helpful empty states) and with full data; no horizontal scroll at 390px; no console errors.

## Phase 4: interactivity

In `assets/js/site.js`, with no libraries:

- Relative timestamps; search and filters; time buckets.
- Click-to-play video using YouTube's privacy-enhanced player.
- Daily quiz of five questions generated from the guest list, seeded by date. The score is saved in the browser.
- Compare tool: resolve two names to Wikipedia articles, fetch 30 days of page views, draw an SVG line chart and state who drew more attention.
- Born-today lookup for any date.

**Check:** each tool works with the network on and shows a clear message when a request fails.

## Phase 5: lead generation

- A dedicated join page and a join section on the home page: email, optional first name, desk checkboxes, reader type. Promise: free, choose your desks, leave any time.
- A compact join card on every desk page and guide.
- Sponsorship enquiry form on the advertise page: name, company, work email, placement, monthly budget, message.
- All forms: inline validation, honeypot field, status message that repeats the button's verb ("Join the list" then "You are on the list").

**Check:** a test submission of each form arrives in the inbox with the form name in the subject.

## Phase 6: support, contests and hiring

- **Support page:** what support pays for (running costs, promotion, hiring, prizes), suggested amounts, one-time or monthly, purpose selector. Payment buttons appear when links are set in `scripts/config.mjs`; until then the form records a pledge.
- **Contest:** the daily quiz feeds a recurring draw. Entry form with tie-break answer and age confirmation. Official rules page: free entry, 18 or over, void where prohibited, random draw from top scores, no affiliation with Google, YouTube, Wikimedia or publishers.
- **Work with us:** role list and application form.

**Check:** no page promises a prize, payment or newsletter that is not yet configured.

## Phase 7: compliance

- Privacy and cookie policy with the Google advertising cookie disclosure and opt-out links. Cookie notice on first visit.
- Editorial policy, terms, about and contact pages linked from every footer.
- Trademark and copyright disclosure: the site is independent; "VIP" is used descriptively; no affiliation with any business using a similar name; publisher names and marks belong to their owners; Wikimedia licences credited; a removal route.
- Ads never sit beside navigation in a way that invites accidental clicks, and never on pages without content.

**Check:** read Google's AdSense programme policies against every page type and fix anything that fails.

## Phase 8: automation and publishing

- `.github/workflows/refresh.yml`: runs every three hours, on demand, and on pushes to scripts or assets. Steps: refresh data, rebuild pages, commit to `main`.
- Add `.nojekyll`. Enable GitHub Pages from `main`, root folder.
- When DNS is ready, add a `CNAME` file containing `vip.news` and set the custom domain in the repository's Pages settings.

**Check:** the workflow run is green, the commit appears on `main`, and the live site shows today's guest list.

## Phase 9: after launch

1. Submit one test form to activate FormSubmit, then swap the address for the alias FormSubmit provides.
2. Apply for AdSense once the custom domain is live. Add ad unit IDs to `scripts/config.mjs` after approval.
3. Add payment links and the first contest prize to `scripts/config.mjs`.
4. Publish two new original guides a week; original writing is what the AdSense review weighs most.
5. Check `data/meta.json` weekly and replace any feed that keeps failing.
