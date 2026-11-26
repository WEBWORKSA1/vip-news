// Builder: turns data/*.json and scripts/content.mjs into static pages at the repository root.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { SITE, DESKS, CATS } from './config.mjs';
import { GUIDES, POLICY } from './content.mjs';

const ROOT = new URL('../', import.meta.url);
const load = async (f, fb) => { try { return JSON.parse(await readFile(new URL('data/' + f, ROOT), 'utf8')); } catch { return fb; } };
const news = await load('news.json', { items: [] });
const index = await load('vip-index.json', { people: [] });
const births = await load('birthdays.json', { days: {} });
const vids = await load('videos.json', { items: [] });
const meta = await load('meta.json', {});
const built = new Date();
const refreshed = meta.updated || news.updated || built.toISOString();

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n).toLocaleString('en-US');
const compact = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n));
const utc = (iso) => new Date(iso).toISOString().slice(11, 16) + ' UTC';
const longDate = (iso) => new Date(iso + (iso.length === 10 ? 'T12:00:00Z' : '')).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const wiki = (title) => 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title).replace(/%2F/g, '/');

// Count how many of today's headlines name each listed person (full names only, to avoid false matches).
const mentions = new Map();
for (const p of index.people) {
  if (!/\s/.test(p.n)) continue;
  const re = new RegExp('(^|[^\\p{L}])' + p.n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^\\p{L}]|$)', 'iu');
  const c = news.items.filter((i) => re.test(i.t)).length;
  if (c) mentions.set(p.n, c);
}

const NAV = [
  ['latest.html', 'Latest'], ['guest-list.html', 'Guest list'],
  ...DESKS.map((d) => [d.id + '.html', d.short]),
  ['videos.html', 'Video'], ['born-today.html', 'Born today'], ['quiz.html', 'Quiz'], ['compare.html', 'Compare'], ['guides/index.html', 'Guides'],
];

const ad = (key) => {
  const slot = SITE.adsense.slots[key];
  if (!slot) return '';
  return `<aside class="ad" aria-label="Advertisement"><span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="${SITE.adsense.client}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></aside>`;
};

function layout({ path, title, desc, body, schema, wide }) {
  const root = path.includes('/') ? '../' : '';
  const full = title === SITE.name ? `${SITE.name}: ${SITE.tagline}` : `${title} | ${SITE.name}`;
  const canonical = SITE.url + '/' + (path === 'index.html' ? '' : path.replace(/index\.html$/, ''));
  const nav = NAV.map(([href, label]) => `<a href="${root}${href}"${href === path ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#2a1233">
<meta name="google-adsense-account" content="${SITE.adsense.client}">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="manifest" href="${root}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,700;1,6..96,500&family=Schibsted+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/css/site.css">
<script>try{var t=localStorage.getItem('vn-theme');if(t)document.documentElement.dataset.theme=t;var z=localStorage.getItem('vn-size');if(z)document.documentElement.dataset.size=z}catch(e){}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsense.client}" crossorigin="anonymous"></script>
${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}
</head>
<body data-root="${root}">
<a class="skip" href="#main">Skip to content</a>
<div class="contactbar"><a href="${SITE.outboundContact}" rel="noopener">${esc(SITE.contactBarText)}</a></div>
<header class="mast">
  <div class="wrap mast-row">
    <a class="wordmark" href="${root}index.html" aria-label="${SITE.name} home">Vip<span>.</span>News</a>
    <div class="mast-tools">
      <button class="tool" type="button" data-action="size" aria-label="Change text size">Aa</button>
      <button class="tool" type="button" data-action="theme" aria-label="Switch between light and dark">Light / dark</button>
      <a class="btn btn-brass" href="${root}join.html">Join the list</a>
    </div>
  </div>
  <nav class="wrap desks" aria-label="Sections">${nav}</nav>
</header>
<main id="main"${wide ? ' class="wide"' : ''}>
${body}
</main>
<footer class="foot">
  <div class="wrap foot-grid">
    <div>
      <a class="wordmark" href="${root}index.html">Vip<span>.</span>News</a>
      <p>${esc(SITE.tagline)}.</p>
      <p class="fine">Last refreshed <time datetime="${refreshed}" data-rel>${utc(refreshed)}</time>. Pages rebuild automatically several times a day.</p>
    </div>
    <div><h2>Desks</h2>${DESKS.map((d) => `<a href="${root}${d.id}.html">${d.name}</a>`).join('')}</div>
    <div><h2>Tools</h2><a href="${root}guest-list.html">The guest list</a><a href="${root}compare.html">Compare two people</a><a href="${root}born-today.html">Born today</a><a href="${root}quiz.html">The quiz</a><a href="${root}videos.html">Video</a><a href="${root}guides/index.html">Guides</a></div>
    <div><h2>Vip.News</h2><a href="${root}about.html">About</a><a href="${root}join.html">Join the list</a><a href="${root}advertise.html">Advertise and sponsor</a><a href="${root}support.html">Support the site</a><a href="${root}contests.html">Contests</a><a href="${root}careers.html">Work with us</a><a href="${root}contact.html">Contact</a></div>
    <div><h2>Policies</h2><a href="${root}editorial-policy.html">Editorial policy</a><a href="${root}privacy.html">Privacy and cookies</a><a href="${root}terms.html">Terms of use</a><a href="${root}disclaimer.html">Trademark and copyright disclosure</a><a href="${root}contest-rules.html">Contest rules</a></div>
  </div>
  <div class="wrap fine legal">
    <p>&copy; ${built.getUTCFullYear()} Vip.News. An independent site, not affiliated with any publisher, person or organisation named here or with any other business using a similar name. Headlines link to and belong to their publishers. Rankings use public data from Wikimedia and Wikidata. See the <a href="${root}disclaimer.html">trademark and copyright disclosure</a>.</p>
  </div>
</footer>
<div class="cookie" hidden><p>This site uses cookies for advertising and saves your preferences in your browser. <a href="${root}privacy.html">Read the privacy and cookie policy</a>.</p><button class="btn" type="button" data-action="cookie-ok">Accept and close</button></div>
<script src="${root}assets/js/site.js" defer></script>
</body>
</html>`;
}

// ---- Shared fragments --------------------------------------------------------
const headline = (i, showDesk) => `<li data-k="${i.k}" data-d="${i.d}"><a href="${esc(i.u)}" target="_blank" rel="noopener">${esc(i.t)}</a><span class="by">${esc(i.s)}${showDesk ? `, ${DESKS.find((d) => d.id === i.k)?.short}` : ''} <time datetime="${i.d}" data-rel>${utc(i.d)}</time></span></li>`;
const emptyNews = `<p class="empty">Headlines appear here after the next refresh. Refreshes run several times a day.</p>`;
const move = (p) => p.chg === null ? '<span class="mv new" title="Not on the list the day before">new</span>'
  : p.chg > 0 ? `<span class="mv up" title="Up ${p.chg} from the day before">&#9650; ${p.chg}</span>`
  : p.chg < 0 ? `<span class="mv down" title="Down ${-p.chg} from the day before">&#9660; ${-p.chg}</span>`
  : '<span class="mv same" title="Same position as the day before">&ndash;</span>';
const guestRow = (p, root = '') => `<li data-cat="${p.cat}"><span class="rank">${p.r}</span><span class="who"><a href="${wiki(p.title)}" target="_blank" rel="noopener">${esc(p.n)}</a><small>${esc(p.desc || CATS[p.cat])}</small></span><span class="views" title="${num(p.views)} article views">${compact(p.views)}</span>${move(p)}</li>`;
const emptyList = `<p class="empty">The list is compiled once a day when page-view figures are published. It will appear after the next refresh.</p>`;
const field = (label, name, type = 'text', extra = '') => `<label>${label}<input type="${type}" name="${name}" ${extra}></label>`;
const form = (name, fields, button, done) => `<form class="vf" data-form="${esc(name)}" data-done="${esc(done)}" novalidate>
${fields}
<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn-solid" type="submit">${button}</button>
<p class="vf-status" role="status" aria-live="polite"></p>
</form>`;
const joinForm = (compactForm) => form('Join the list',
  `${field('Email address', 'email', 'email', 'required autocomplete="email" placeholder="you@example.com"')}
${compactForm ? '' : field('First name (optional)', 'first_name', 'text', 'autocomplete="given-name"')}
<fieldset><legend>Which desks do you want?</legend>${DESKS.map((d) => `<label class="check"><input type="checkbox" name="desks" value="${d.short}"${compactForm ? '' : ' checked'}> ${d.short}</label>`).join('')}</fieldset>
${compactForm ? '' : `<label>What brings you here?<select name="reader_type"><option>I read for myself</option><option>I work in media or communications</option><option>I invest or run a business</option><option>I want to advertise or sponsor</option></select></label>`}`,
  'Join the list', 'You are on the list. Watch your inbox for the first briefing.');
const video = (v) => `<li><button class="vid" type="button" data-video="${v.id}" aria-label="Play: ${esc(v.t)}"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="play" aria-hidden="true"></span></button><p>${esc(v.t)}</p><span class="by">${esc(v.ch)} <time datetime="${v.d}" data-rel>${utc(v.d)}</time></span></li>`;
const prose = (title, lead, html) => `<article class="wrap prose"><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${html}</article>`;

// ---- Pages -------------------------------------------------------------------
const pages = [];
const add = (p) => pages.push(p);

// Home
{
  const catchUp = [];
  const usedSource = new Set();
  for (const i of news.items) { if (!usedSource.has(i.s + i.k)) { catchUp.push(i); usedSource.add(i.s + i.k); } if (catchUp.length === 7) break; }
  const inNews = [...mentions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  const todayKey = built.toISOString().slice(5, 10);
  const bornToday = (births.days[todayKey] || Object.values(births.days)[0] || []).slice(0, 8);
  add({
    path: 'index.html', title: SITE.name, desc: SITE.description, wide: true,
    schema: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', name: SITE.name, url: SITE.url + '/', description: SITE.description },
      { '@type': 'Organization', name: SITE.name, url: SITE.url + '/' } ] },
    body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-list">
      <h1>Who the world is reading about today</h1>
      <p class="hero-sub">${index.date ? `The ten most-read people on ${longDate(index.date)}, ranked by how many times their Wikipedia article was opened.` : 'A daily ranking of the most-read people, by how many times their Wikipedia article was opened.'}</p>
      ${index.people.length ? `<ol class="guest tick">${index.people.slice(0, 10).map((p) => guestRow(p)).join('')}</ol>
      <p><a class="btn btn-ghost" href="guest-list.html">See all 100 on the guest list</a></p>` : emptyList}
    </div>
    <aside class="hero-side">
      <h2>Catch up in five minutes</h2>
      ${catchUp.length ? `<ul class="hl hl-tight">${catchUp.map((i) => headline(i, true)).join('')}</ul><p><a href="latest.html">All of today's headlines</a></p>` : emptyNews}
      <div class="join-card">
        <h2>Get the briefing first</h2>
        <p>One short email on who made the news and why. Free. Leave any time.</p>
        ${joinForm(true)}
      </div>
    </aside>
  </div>
</section>
${inNews.length ? `<section class="wrap strip"><h2>On the list and in the headlines</h2><p class="chips">${inNews.map(([n, c]) => `<a class="chip" href="latest.html?q=${encodeURIComponent(n)}">${esc(n)} <b>${c}</b></a>`).join('')}</p></section>` : ''}
${ad('top')}
<div class="wrap desk-grid">
${DESKS.map((d) => {
    const items = news.items.filter((i) => i.k === d.id).slice(0, 6);
    return `<section class="desk"><h2><a href="${d.id}.html">${d.name}</a></h2><p class="blurb">${d.blurb}</p>${items.length ? `<ul class="hl">${items.map((i) => headline(i)).join('')}</ul>` : emptyNews}<p><a href="${d.id}.html">More from ${d.name.toLowerCase()}</a></p></section>`;
  }).join('\n')}
</div>
${vids.items.length ? `<section class="band"><div class="wrap"><h2><a href="videos.html">Watch</a></h2><ul class="vids">${vids.items.slice(0, 4).map(video).join('')}</ul></div></section>` : ''}
<div class="wrap trio">
  <section><h2><a href="born-today.html">Born today</a></h2>${bornToday.length ? `<ul class="born">${bornToday.map((b) => `<li><a href="${wiki(b.title)}" target="_blank" rel="noopener">${esc(b.n)}</a> <small>${built.getUTCFullYear() - b.y}, ${esc(b.desc)}</small></li>`).join('')}</ul>` : '<p class="empty">Birthdays appear after the next refresh.</p>'}<p><a href="born-today.html">Look up any date</a></p></section>
  <section><h2><a href="quiz.html">Five questions on today's list</a></h2><p>A fresh quiz every day, built from the guest list. Score five out of five and enter ${esc(SITE.contest.name)}.</p><p><a class="btn btn-solid" href="quiz.html">Start the quiz</a></p><h2 class="gap"><a href="compare.html">Compare two people</a></h2><p>Type any two names and see who drew more attention over the last 30 days.</p><p><a class="btn btn-ghost" href="compare.html">Open the comparison</a></p></section>
  <section><h2><a href="guides/index.html">Guides</a></h2><ul class="links">${GUIDES.slice(0, 5).map((g) => `<li><a href="guides/${g.slug}.html">${g.title}</a></li>`).join('')}</ul></section>
</div>
<section class="lead-band" id="join">
  <div class="wrap lead-grid">
    <div><h2>Put your name on the list</h2><p>The briefing covers who rose, who fell and what they did, in the time it takes to finish a coffee. Pick the desks you care about and skip the rest.</p><ul class="ticks"><li>Free to join</li><li>Choose your desks</li><li>One click to leave</li></ul><p class="fine">Want to reach this audience instead? <a href="advertise.html">Ask about sponsorship</a>.</p></div>
    ${joinForm(false)}
  </div>
</section>
${ad('inFeed')}
<section class="wrap support-strip"><h2>Keep Vip.News free to read</h2><p>Reader support pays for running the site, promotion, new writers and contest prizes.</p><p><a class="btn btn-solid" href="support.html">Support the site</a> <a class="btn btn-ghost" href="careers.html">Work with us</a> <a class="btn btn-ghost" href="contests.html">Enter the contest</a></p></section>`,
  });
}

// Desks
for (const d of DESKS) {
  const items = news.items.filter((i) => i.k === d.id);
  const people = index.people.filter((p) => d.cats.includes(p.cat)).slice(0, 10);
  add({
    path: d.id + '.html', title: d.name, desc: `${d.blurb} Today's ${d.name.toLowerCase()} headlines from leading publishers, refreshed through the day.`,
    body: `<div class="wrap two-col">
<section><h1>${d.name}</h1><p class="lead">${d.blurb}</p>${items.length ? `<ul class="hl">${items.map((i) => headline(i)).join('')}</ul>` : emptyNews}${ad('inFeed')}</section>
<aside>${people.length ? `<h2>On the guest list</h2><ol class="guest guest-small">${people.map((p) => guestRow(p)).join('')}</ol><p><a href="guest-list.html">The full guest list</a></p>` : ''}${ad('sidebar')}<div class="join-card"><h2>Get the ${d.short.toLowerCase()} briefing</h2><p>Free. Leave any time.</p>${joinForm(true)}</div></aside>
</div>`,
  });
}

add({
  path: 'latest.html', title: 'Latest headlines', desc: 'Every headline from all six desks in one stream, newest first. Filter by desk or search for a name.',
  body: `<div class="wrap"><h1>Latest headlines</h1><p class="lead">Every desk in one stream, newest first. Search for a name to see today's coverage of one person.</p>
<div class="filters"><label class="search">Search headlines<input type="search" id="q" placeholder="Try a name" autocomplete="off"></label><p class="chips" role="group" aria-label="Filter by desk"><button class="chip" type="button" data-desk="" aria-pressed="true">All desks</button>${DESKS.map((d) => `<button class="chip" type="button" data-desk="${d.id}" aria-pressed="false">${d.short}</button>`).join('')}</p></div>
<p class="count" id="count" aria-live="polite"></p>
${news.items.length ? `<ul class="hl river" id="river">${news.items.map((i) => headline(i, true)).join('')}</ul>` : emptyNews}
<p class="empty" id="none" hidden>No headlines match. Clear the search or choose another desk.</p></div>`,
});

add({
  path: 'guest-list.html', title: 'The guest list: the 100 most-read people', desc: 'A daily ranking of the 100 people whose Wikipedia articles were read most, with each person\'s change in position from the day before.',
  body: `<div class="wrap"><h1>The guest list</h1><p class="lead">${index.date ? `The 100 most-read people on ${longDate(index.date)}.` : 'The 100 most-read people, updated daily.'} Ranked by views of each person's English Wikipedia article. <a href="guides/how-the-guest-list-works.html">How the list works</a>.</p>
<div class="filters"><label class="search">Find a person<input type="search" id="gq" placeholder="Name" autocomplete="off"></label><p class="chips" role="group" aria-label="Filter by field"><button class="chip" type="button" data-cat="" aria-pressed="true">Everyone</button>${Object.entries(CATS).map(([k, v]) => `<button class="chip" type="button" data-cat="${k}" aria-pressed="false">${v}</button>`).join('')}</p></div>
${index.people.length ? `<ol class="guest guest-full" id="guest">${index.people.map((p) => guestRow(p).replace('</li>', `${mentions.has(p.n) ? `<a class="inhl" href="latest.html?q=${encodeURIComponent(p.n)}">${mentions.get(p.n)} headline${mentions.get(p.n) > 1 ? 's' : ''}</a>` : ''}</li>`)).join('')}</ol>` : emptyList}
<p class="empty" id="gnone" hidden>Nobody on today's list matches. Clear the search or choose another field.</p>
<p class="fine">Views and descriptions: Wikimedia Foundation and Wikidata. The list measures attention, not approval or importance.</p>${ad('inFeed')}</div>`,
});

add({
  path: 'videos.html', title: 'Video', desc: 'Recent video from official news channels, played through YouTube.',
  body: `<div class="wrap"><h1>Video</h1><p class="lead">Recent uploads from official news channels. Videos play here through YouTube and load only when you press play.</p>${vids.items.length ? `<ul class="vids vids-full">${vids.items.map(video).join('')}</ul>` : '<p class="empty">Videos appear after the next refresh.</p>'}${ad('inFeed')}</div>`,
});

add({
  path: 'born-today.html', title: 'Born today', desc: 'Well-known people born on this day, with a lookup for any date of the year.',
  body: `<div class="wrap"><h1>Born today</h1><p class="lead" id="born-lead">Well-known people who share today's date.</p>
<ul class="born born-full" id="born"></ul>
<section class="tool-box"><h2>Look up any date</h2><p>Choose a day to see who was born on it.</p><div class="row"><label>Month<select id="bm">${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => `<option value="${String(i + 1).padStart(2, '0')}">${m}</option>`).join('')}</select></label><label>Day<select id="bd">${Array.from({ length: 31 }, (_, i) => `<option>${String(i + 1).padStart(2, '0')}</option>`).join('')}</select></label><button class="btn btn-solid" type="button" id="bgo">Show birthdays</button></div><p class="vf-status" id="bstatus" role="status" aria-live="polite"></p></section>
<p class="fine">Source: Wikipedia, available under the Creative Commons Attribution-ShareAlike 4.0 licence.</p>
<script type="application/json" id="births">${JSON.stringify(births.days).replace(/</g, '\\u003c')}</script></div>`,
});

add({
  path: 'quiz.html', title: 'The daily quiz', desc: 'Five questions built from today\'s guest list. A new quiz every day.',
  body: `<div class="wrap narrow"><h1>Five questions on today's list</h1><p class="lead">Built fresh each day from the guest list. No sign-up needed.</p><div id="quiz" class="quiz"><p class="empty">Loading today's questions.</p></div><p class="fine">Scored five out of five? <a href="contests.html">Enter ${esc(SITE.contest.name)}</a>.</p></div>`,
});

add({
  path: 'compare.html', title: 'Compare two people', desc: 'See which of two public figures drew more attention over the last 30 days, using public Wikipedia page-view data.',
  body: `<div class="wrap narrow"><h1>Compare two people</h1><p class="lead">Type two names to see who was looked up more over the last 30 days.</p>
<form class="compare" id="cmp"><label>First person<input name="a" list="names" required value="${esc(index.people[0]?.n || '')}"></label><label>Second person<input name="b" list="names" required value="${esc(index.people[1]?.n || '')}"></label><button class="btn btn-solid" type="submit">Compare</button><datalist id="names">${index.people.map((p) => `<option value="${esc(p.n)}">`).join('')}</datalist></form>
<p class="vf-status" id="cstatus" role="status" aria-live="polite"></p><div id="cout"></div>
<p class="fine">Daily views of each person's English Wikipedia article, from the Wikimedia Foundation. Attention is not approval.</p></div>`,
});

// Guides
add({
  path: 'guides/index.html', title: 'Guides', desc: 'Original explainers on reading the news well: rankings, wealth estimates, verification and sources.',
  body: `<div class="wrap narrow"><h1>Guides</h1><p class="lead">Short explainers on how news about people is made and how to read it well.</p><ul class="guide-list">${GUIDES.map((g) => `<li><a href="${g.slug}.html">${g.title}</a><p>${g.summary}</p><span class="by">${g.minutes} minute read</span></li>`).join('')}</ul></div>`,
});
for (const g of GUIDES) {
  const more = GUIDES.filter((x) => x !== g).slice(0, 3);
  add({
    path: `guides/${g.slug}.html`, title: g.title, desc: g.summary,
    schema: { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.summary, author: { '@type': 'Organization', name: SITE.name }, publisher: { '@type': 'Organization', name: SITE.name }, mainEntityOfPage: `${SITE.url}/guides/${g.slug}.html` },
    body: `<article class="wrap prose"><p class="crumb"><a href="index.html">Guides</a></p><h1>${g.title}</h1><p class="lead">${g.summary}</p><p class="by">${g.minutes} minute read. Written for Vip.News.</p>${g.body}${ad('article')}<aside class="next"><h2>Read next</h2><ul class="links">${more.map((m) => `<li><a href="${m.slug}.html">${m.title}</a></li>`).join('')}</ul></aside><div class="join-card"><h2>Get the briefing first</h2><p>Free. Leave any time.</p>${joinForm(true)}</div></article>`,
  });
}

// Lead generation, revenue and company pages
add({
  path: 'join.html', title: 'Join the list', desc: 'Join the Vip.News briefing list: who made the news and why, by desk. Free, and you can leave at any time.',
  body: `<section class="lead-band lead-page"><div class="wrap lead-grid"><div><h1>Put your name on the list</h1><p class="lead">A short briefing on who rose, who fell and what they did. Choose the desks you want and skip the rest.</p><ul class="ticks"><li>Free to join</li><li>Choose from six desks</li><li>One click to leave</li><li>Your address is never sold</li></ul></div>${joinForm(false)}</div></section>
<div class="wrap trio"><section><h2>What you get</h2><p>The day's guest list movers, the headlines behind them and one thing worth reading in full.</p></section><section><h2>For teams and brands</h2><p>Sponsor a desk or the briefing itself. <a href="advertise.html">See sponsorship options</a>.</p></section><section><h2>Prefer to browse?</h2><p>Everything in the briefing is also on the site. Start with <a href="latest.html">the latest headlines</a>.</p></section></div>`,
});

add({
  path: 'advertise.html', title: 'Advertise and sponsor', desc: 'Sponsor a desk, the guest list, the briefing or a contest on Vip.News. Request the media kit.',
  body: `<div class="wrap two-col"><section class="prose-lite"><h1>Advertise and sponsor</h1><p class="lead">Put your brand beside the names everyone is looking up.</p>
<h2>Placements</h2><dl class="offers"><dt>Desk sponsorship</dt><dd>Your name on one of six desks, such as business and wealth or tech and founders, for a week or a month.</dd><dt>Guest list sponsorship</dt><dd>"Presented by" on the daily ranking, the most-visited feature on the site.</dd><dt>Briefing sponsorship</dt><dd>A single sponsor message in the email briefing.</dd><dt>Video row</dt><dd>Your channel's video featured in the watch section, labelled as sponsored.</dd><dt>Contest partner</dt><dd>Provide the prize for a round of ${esc(SITE.contest.name)} and be named as its partner.</dd></dl>
<h2>How sponsorship is handled</h2><p>Sponsored placements are labelled. Sponsors do not influence the ranking or which headlines appear. See the <a href="editorial-policy.html">editorial policy</a>.</p></section>
<aside><div class="join-card"><h2>Request the media kit</h2><p>Tell us what you have in mind and we will reply with options and rates.</p>${form('Sponsorship enquiry', `${field('Your name', 'name', 'text', 'required autocomplete="name"')}${field('Company', 'company', 'text', 'autocomplete="organization"')}${field('Work email', 'email', 'email', 'required autocomplete="email"')}<label>Placement<select name="placement"><option>Desk sponsorship</option><option>Guest list sponsorship</option><option>Briefing sponsorship</option><option>Video row</option><option>Contest partner</option><option>Not sure yet</option></select></label><label>Monthly budget<select name="budget"><option>Under $500</option><option>$500 to $2,000</option><option>$2,000 to $10,000</option><option>Over $10,000</option></select></label><label>What do you want to promote?<textarea name="message" rows="4"></textarea></label>`, 'Request the media kit', 'Request sent. We will reply with the media kit.')}</div></aside></div>`,
});

{
  const pay = Object.entries(SITE.payments).filter(([, v]) => v);
  const names = { paypal: 'Pay with PayPal', stripe: 'Pay by card', buymeacoffee: 'Buy Me a Coffee' };
  add({
    path: 'support.html', title: 'Support the site', desc: 'Help keep Vip.News free to read. Support pays for running costs, promotion, new writers and contest prizes.',
    body: `<div class="wrap two-col"><section class="prose-lite"><h1>Keep Vip.News free to read</h1><p class="lead">The site is free and stays that way. Support from readers pays for the things advertising does not cover.</p>
<h2>Where support goes</h2><dl class="offers"><dt>Running the site</dt><dd>Hosting, the domain and the tools that refresh the pages through the day.</dd><dt>Promotion and marketing</dt><dd>Reaching new readers so the briefing grows.</dd><dt>Hiring talent</dt><dd>Paying writers, editors and video curators for original work.</dd><dt>Contests and prizes</dt><dd>Funding the prize for each round of ${esc(SITE.contest.name)}.</dd></dl>
<p>Supporters have no influence over rankings or headlines. A donation is not required to enter any contest and does not improve your chances.</p></section>
<aside><div class="join-card"><h2>Make a pledge</h2>${pay.length ? `<p class="paylinks">${pay.map(([k, v]) => `<a class="btn btn-solid" href="${esc(v)}" target="_blank" rel="noopener">${names[k]}</a>`).join(' ')}</p><p>Or pledge below and we will send payment details.</p>` : '<p>Choose an amount and we will email you secure payment details. A pledge is not a payment and you can change your mind.</p>'}
${form('Support pledge', `<fieldset><legend>Amount</legend>${[5, 15, 50, 150].map((a, i) => `<label class="check pill"><input type="radio" name="amount" value="$${a}"${i === 1 ? ' checked' : ''}> $${a}</label>`).join('')}<label class="check pill"><input type="radio" name="amount" value="other"> Other</label></fieldset>${field('Other amount (optional)', 'other_amount', 'text', 'inputmode="decimal" placeholder="$"')}<fieldset><legend>How often</legend><label class="check pill"><input type="radio" name="frequency" value="One time" checked> One time</label><label class="check pill"><input type="radio" name="frequency" value="Monthly"> Monthly</label></fieldset><label>Put it toward<select name="purpose"><option>Wherever it is needed</option><option>Running the site</option><option>Promotion and marketing</option><option>Hiring talent</option><option>Contests and prizes</option></select></label>${field('Email address', 'email', 'email', 'required autocomplete="email"')}`, 'Send pledge', 'Pledge sent. We will email payment details.')}</div></aside></div>`,
  });
}

add({
  path: 'contests.html', title: SITE.contest.name, desc: `${SITE.contest.name}: answer the daily quiz, score five out of five and enter the ${SITE.contest.cadence} draw. Free to enter.`,
  body: `<div class="wrap two-col"><section class="prose-lite"><h1>${esc(SITE.contest.name)}</h1><p class="lead">Know who is making the news? Prove it. Free to enter, one entry per round.</p>
<h2>How to enter</h2><ol class="steps"><li><strong>Take the quiz.</strong> Five questions built from today's guest list. <a href="quiz.html">Start the quiz</a>.</li><li><strong>Submit your entry.</strong> Your best score today is filled in for you.</li><li><strong>Wait for the draw.</strong> Each round, a winner is drawn from the top scores and contacted by email.</li></ol>
<h2>This round's prize</h2><p>${esc(SITE.contest.prize)}. Prizes are funded by supporters and contest partners.</p>
<p>No purchase or donation is needed. Adults aged 18 or over only. <a href="contest-rules.html">Read the official rules</a>.</p>
<h2>Sponsor a round</h2><p>Brands can provide a prize and be named as contest partner. <a href="advertise.html">Ask about contest partnership</a>.</p></section>
<aside><div class="join-card"><h2>Enter this round</h2>${form('Contest entry', `${field('Your name', 'name', 'text', 'required autocomplete="name"')}${field('Email address', 'email', 'email', 'required autocomplete="email"')}${field('Country', 'country', 'text', 'required autocomplete="country-name"')}${field('Your quiz score today', 'quiz_score', 'text', 'id="score" readonly placeholder="Take the quiz first"')}<label>Tie-break: in 25 words or fewer, who will top the guest list next week and why?<textarea name="tiebreak" rows="3" required></textarea></label><label class="check"><input type="checkbox" name="agree" value="yes" required> I am 18 or over and accept the contest rules</label>`, 'Enter this round', 'Entry received. Good luck.')}</div></aside></div>`,
});

add({ path: 'contest-rules.html', title: 'Contest rules', desc: `Official rules for ${SITE.contest.name} on Vip.News.`, body: prose('Contest rules', `Official rules for ${esc(SITE.contest.name)}.`, POLICY.rules) });

add({
  path: 'careers.html', title: 'Work with us', desc: 'Write, edit, curate video or sell sponsorship for Vip.News. Remote, freelance roles.',
  body: `<div class="wrap two-col"><section class="prose-lite"><h1>Work with us</h1><p class="lead">Vip.News is growing its team of people who can explain the news through the people making it.</p>
<h2>Who we are looking for</h2><dl class="offers"><dt>Contributing writers</dt><dd>Clear, sourced explainers on power, wealth, tech, entertainment and sport.</dd><dt>Desk editors</dt><dd>Own one desk: shape coverage, check facts and keep the tone steady.</dd><dt>Video curators</dt><dd>Find the clip that explains the story and write the line that frames it.</dd><dt>Audience and social leads</dt><dd>Grow the briefing list and turn the daily ranking into posts people share.</dd><dt>Partnership leads</dt><dd>Bring in sponsors and contest partners who fit the readership.</dd></dl>
<p>Roles are remote and freelance to begin with. Terms are agreed individually.</p></section>
<aside><div class="join-card"><h2>Send an application</h2>${form('Work application', `${field('Your name', 'name', 'text', 'required autocomplete="name"')}${field('Email address', 'email', 'email', 'required autocomplete="email"')}<label>Role<select name="role"><option>Contributing writer</option><option>Desk editor</option><option>Video curator</option><option>Audience and social lead</option><option>Partnership lead</option><option>Something else</option></select></label>${field('Link to your work', 'portfolio', 'url', 'placeholder="https://"')}<label>Why this role?<textarea name="message" rows="4" required></textarea></label>`, 'Send application', 'Application sent. We read every one.')}</div></aside></div>`,
});

add({ path: 'about.html', title: 'About', desc: 'What Vip.News is, how it stays current and how it is funded.', body: prose('About Vip.News', esc(SITE.tagline) + '.', POLICY.about) });
add({ path: 'editorial-policy.html', title: 'Editorial policy', desc: 'How Vip.News selects headlines, calculates rankings, handles corrections and labels advertising.', body: prose('Editorial policy', 'How headlines, rankings and sponsorship are handled.', POLICY.editorial) });
add({ path: 'privacy.html', title: 'Privacy and cookies', desc: 'What information Vip.News handles, how advertising cookies are used and the choices you have.', body: prose('Privacy and cookies', `Last updated ${longDate(built.toISOString().slice(0, 10))}.`, POLICY.privacy) });
add({ path: 'terms.html', title: 'Terms of use', desc: 'The terms that apply when you use Vip.News.', body: prose('Terms of use', '', POLICY.terms) });
add({ path: 'disclaimer.html', title: 'Trademark and copyright disclosure', desc: 'Vip.News is independent and unaffiliated. Trademark, copyright and attribution disclosure.', body: prose('Trademark and copyright disclosure', 'Who owns what on this site, and what this site is not.', POLICY.disclaimer) });

add({
  path: 'contact.html', title: 'Contact', desc: 'Send a message to Vip.News: corrections, publisher requests, feedback and partnership enquiries.',
  body: `<div class="wrap two-col"><section class="prose-lite"><h1>Contact</h1><p class="lead">Corrections, publisher requests, feedback and ideas all come to the same inbox.</p><h2>Buying the site or domain, sponsorship and partnerships</h2><p>For enquiries about this website, the domain name, sponsorship, advertising or partnership, <a href="${SITE.outboundContact}" rel="noopener">use the business contact page</a>.</p><h2>Other routes</h2><ul class="links"><li><a href="advertise.html">Request the media kit</a></li><li><a href="careers.html">Apply to work with us</a></li><li><a href="support.html">Support the site</a></li></ul></section>
<aside><div class="join-card"><h2>Send a message</h2>${form('Contact message', `${field('Your name', 'name', 'text', 'required autocomplete="name"')}${field('Email address', 'email', 'email', 'required autocomplete="email"')}<label>Topic<select name="topic"><option>Correction</option><option>Publisher or rights request</option><option>Feedback</option><option>Press</option><option>Something else</option></select></label><label>Message<textarea name="message" rows="5" required></textarea></label>`, 'Send message', 'Message sent. Thank you.')}</div></aside></div>`,
});

add({ path: '404.html', title: 'Page not found', desc: 'That page is not here.', body: `<div class="wrap narrow"><h1>That page is not on the list</h1><p class="lead">The address may have changed. Start from <a href="index.html">the front page</a> or <a href="latest.html">the latest headlines</a>.</p></div>` });

// ---- Write ---------------------------------------------------------------------
await mkdir(new URL('guides/', ROOT), { recursive: true });
for (const p of pages) await writeFile(new URL(p.path, ROOT), layout(p));
const today = built.toISOString().slice(0, 10);
const urls = pages.filter((p) => p.path !== '404.html').map((p) => `<url><loc>${SITE.url}/${p.path === 'index.html' ? '' : p.path.replace(/index\.html$/, '')}</loc><lastmod>${today}</lastmod></url>`).join('\n');
await writeFile(new URL('sitemap.xml', ROOT), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`Built ${pages.length} pages: ${news.items.length} headlines, ${index.people.length} people, ${vids.items.length} videos.`);
