// Refresh job: pulls headlines, the most-read people, birthdays and videos into data/*.json.
// No dependencies. Every source is optional: when one fails, the previous data for it is kept.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { FEEDS, YOUTUBE_CHANNELS } from './config.mjs';

const UA = 'VipNewsRefresh/1.0 (https://vip.news; static site refresh job)';
const DATA = new URL('../data/', import.meta.url);
const now = new Date();
const log = [];

async function get(url, { json = false, timeout = 25000, method = 'GET', body, headers = {} } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method, body, redirect: 'follow', signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: json ? 'application/json' : 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*', ...headers },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return json ? await res.json() : await res.text();
  } finally { clearTimeout(timer); }
}
async function readJson(name, fallback) {
  try { return JSON.parse(await readFile(new URL(name, DATA), 'utf8')); } catch { return fallback; }
}
const writeJson = (name, value) => writeFile(new URL(name, DATA), JSON.stringify(value));

const strip = (s) => s.replace(/<[^>]+>/g, ' ');
function clean(raw = '') {
  let s = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  s = strip(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  return strip(s).replace(/\s+/g, ' ').trim();
}
const tag = (block, name) => (block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')) || [])[1];
function atomLink(block) {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)].map((m) => m[1]);
  const pick = links.find((a) => /rel=["']alternate["']/i.test(a)) || links.find((a) => !/rel=/i.test(a)) || links[0];
  return pick ? (pick.match(/href=["']([^"']+)["']/i) || [])[1] : undefined;
}

// ---- Headlines -------------------------------------------------------------
function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map((b) => {
    const title = clean(tag(b, 'title'));
    let url = clean(tag(b, 'link') || '');
    if (!/^https?:\/\//.test(url)) url = (atomLink(b) || '').replace(/&amp;/g, '&');
    const when = clean(tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated') || '');
    const date = new Date(when);
    return { t: title, u: url, d: isNaN(date) ? null : date.toISOString() };
  });
}
async function headlines() {
  const results = await Promise.all(FEEDS.map(async ([desk, source, url]) => {
    try {
      const items = parseFeed(await get(url)).filter((i) => i.t.length >= 15 && i.t.length <= 220 && /^https?:\/\//.test(i.u) && i.d);
      log.push({ kind: 'feed', source, desk, url, ok: true, count: items.length });
      return items.map((i) => ({ ...i, s: source, k: desk }));
    } catch (e) {
      log.push({ kind: 'feed', source, desk, url, ok: false, error: String(e.message || e) });
      return [];
    }
  }));
  const cutoff = now.getTime() - 72 * 3600e3;
  const seen = new Set();
  const fresh = results.flat()
    .filter((i) => { const ts = Date.parse(i.d); return ts > cutoff && ts < now.getTime() + 3600e3; })
    .sort((a, b) => b.d.localeCompare(a.d))
    .filter((i) => {
      const key = i.t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (seen.has(key) || seen.has(i.u)) return false;
      seen.add(key); seen.add(i.u); return true;
    });
  // Cap each desk so one busy feed cannot crowd out the rest.
  const perDesk = {};
  const items = fresh.filter((i) => (perDesk[i.k] = (perDesk[i.k] || 0) + 1) <= 45);
  if (items.length < 12) return null;
  return { updated: now.toISOString(), items };
}

// ---- The guest list: most-read people on English Wikipedia ------------------
const ymd = (d) => [d.getUTCFullYear(), String(d.getUTCMonth() + 1).padStart(2, '0'), String(d.getUTCDate()).padStart(2, '0')];
async function topArticles(daysAgo) {
  const d = new Date(now.getTime() - daysAgo * 86400e3);
  const [y, m, day] = ymd(d);
  const data = await get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${y}/${m}/${day}`, { json: true });
  const articles = data.items[0].articles.filter((a) => !/^(Main_Page|-|Special:|Wikipedia:|Portal:|File:|Category:|Help:|Template:|User:|Talk:|Draft:)/.test(a.article) && !/^(List_of|Deaths_in|\d{4}_)/.test(a.article));
  return { date: `${y}-${m}-${day}`, articles };
}
function categorise(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  const rules = [
    ['power', /politic|president|prime minister|senator|minister|governor|monarch| king | queen |prince|diplomat|judge|jurist|head of state|chancellor|pope|military|general |activist|mayor|congress|member of parliament/],
    ['business', /business|entrepreneur|investor|executive|billionaire|founder|banker|financier|chief executive|industrialist|magnate|venture capital/],
    ['sports', /football|basketball|tennis|cricket|athlete|boxer|racing|golfer|baseball|wrestl|swimmer|olympi|coach|player|martial art|sprinter|hockey|rugby|cyclist|gymnast|quarterback|footballer/],
    ['music', /singer|musician|rapper|songwriter|composer|record producer|disc jockey|guitarist|drummer|pianist/],
    ['screen', /actor|actress|film|television|director|comedian|presenter|youtuber|model|influencer|screenwriter|broadcaster|streamer/],
  ];
  // The occupation named first in the description wins ("actress and singer" is screen, not music).
  let best = ['culture', Infinity];
  for (const [cat, re] of rules) { const m = t.match(re); if (m && m.index < best[1]) best = [cat, m.index]; }
  return best[0];
}
const known = new Map(); // title -> { desc } for humans, null for everything else
async function resolvePeople(allTitles) {
  // Wikipedia gives each article's Wikidata item and short description; Wikidata says whether the item is a human.
  const titles = allTitles.filter((t) => !known.has(t));
  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    chunk.forEach((t) => known.set(t, null));
    const q = await get('https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ action: 'query', format: 'json', prop: 'pageprops|description', ppprop: 'wikibase_item', redirects: '1', titles: chunk.join('|') }), { json: true });
    const pages = Object.values(q.query?.pages || {}).filter((p) => p.pageprops?.wikibase_item);
    if (!pages.length) continue;
    const ents = await get('https://www.wikidata.org/w/api.php?' + new URLSearchParams({ action: 'wbgetentities', format: 'json', props: 'claims', ids: pages.map((p) => p.pageprops.wikibase_item).join('|') }), { json: true, timeout: 60000 });
    for (const p of pages) {
      const claims = ents.entities?.[p.pageprops.wikibase_item]?.claims?.P31 || [];
      if (claims.some((c) => c.mainsnak?.datavalue?.value?.id === 'Q5')) known.set(p.title, { desc: p.description || '' });
    }
  }
}
async function rankedPeople(articles, limit) {
  const candidates = articles.slice(0, 420);
  await resolvePeople(candidates.map((a) => a.article.replace(/_/g, ' ')));
  return candidates.filter((a) => known.get(a.article.replace(/_/g, ' '))).slice(0, limit);
}
async function guestList() {
  let today;
  let offset = 1;
  for (; offset <= 3; offset++) { try { today = await topArticles(offset); break; } catch { /* that day is not published yet */ } }
  if (!today) throw new Error('no pageview data available');
  const todays = await rankedPeople(today.articles, 100);
  log.push({ kind: 'people', ok: true, count: todays.length });
  // Yesterday's list is ranked the same way, so positions are comparable.
  const before = new Map();
  try { (await rankedPeople((await topArticles(offset + 1)).articles, 250)).forEach((a, i) => before.set(a.article, i + 1)); }
  catch (e) { log.push({ kind: 'people-previous', ok: false, error: String(e.message || e) }); }
  const people = todays.map((a, i) => {
    const name = a.article.replace(/_/g, ' ');
    const desc = known.get(name).desc;
    return {
      r: i + 1, n: name.replace(/ \([^)]*\)$/, ''), title: a.article, views: a.views,
      desc: desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : '',
      cat: categorise(desc),
      chg: before.size && before.has(a.article) ? before.get(a.article) - (i + 1) : null,
    };
  });
  if (people.length < 20) throw new Error('too few people resolved: ' + people.length);
  return { date: today.date, updated: now.toISOString(), people };
}

// ---- Born today ------------------------------------------------------------
async function birthdays() {
  const days = {};
  for (const delta of [-1, 0, 1]) {
    const d = new Date(now.getTime() + delta * 86400e3);
    const [, m, day] = ymd(d);
    try {
      const data = await get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${m}/${day}`, { json: true });
      days[`${m}-${day}`] = (data.births || [])
        .filter((b) => b.year >= 1925 && b.pages?.[0])
        .sort((a, b) => b.year - a.year)
        .slice(0, 40)
        .map((b) => {
          const page = b.pages[0];
          const name = (page.titles?.normalized || b.text.split(',')[0]).replace(/ \([^)]*\)$/, '');
          const desc = page.description || b.text.split(',').slice(1).join(',').trim();
          return { n: name, y: b.year, desc: desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : '', title: page.titles?.canonical || name.replace(/ /g, '_') };
        });
      log.push({ kind: 'births', day: `${m}-${day}`, ok: true, count: days[`${m}-${day}`].length });
    } catch (e) { log.push({ kind: 'births', day: `${m}-${day}`, ok: false, error: String(e.message || e) }); }
  }
  return Object.keys(days).length ? { updated: now.toISOString(), days } : null;
}

// ---- Videos ----------------------------------------------------------------
async function videos() {
  const lists = await Promise.all(YOUTUBE_CHANNELS.map(async (id) => {
    try {
      const xml = await get('https://www.youtube.com/feeds/videos.xml?channel_id=' + id);
      const channel = clean(tag(xml, 'title'));
      const entries = (xml.match(/<entry>[\s\S]*?<\/entry>/g) || []).slice(0, 4).map((e) => ({
        id: clean(tag(e, 'yt:videoId')), t: clean(tag(e, 'title')), ch: channel, d: new Date(clean(tag(e, 'published'))).toISOString(),
      })).filter((v) => /^[\w-]{11}$/.test(v.id) && v.t);
      log.push({ kind: 'video', channel, id, ok: true, count: entries.length });
      return entries;
    } catch (e) { log.push({ kind: 'video', id, ok: false, error: String(e.message || e) }); return []; }
  }));
  // Interleave channels so the page is not dominated by whoever uploaded last.
  const items = [];
  for (let i = 0; i < 4; i++) for (const list of lists) if (list[i]) items.push(list[i]);
  return items.length >= 4 ? { updated: now.toISOString(), items: items.slice(0, 30) } : null;
}

// ---- Run -------------------------------------------------------------------
await mkdir(DATA, { recursive: true });
const jobs = { 'news.json': headlines, 'vip-index.json': guestList, 'birthdays.json': birthdays, 'videos.json': videos };
const summary = {};
for (const [file, job] of Object.entries(jobs)) {
  try {
    const value = await job();
    if (value) { await writeJson(file, value); summary[file] = 'updated'; }
    else summary[file] = 'kept previous (source returned too little)';
  } catch (e) { summary[file] = 'kept previous (' + String(e.message || e) + ')'; }
}
const history = (await readJson('meta.json', {})).runs || [];
await writeJson('meta.json', { updated: now.toISOString(), summary, log, runs: [{ at: now.toISOString(), summary }, ...history].slice(0, 20) });
console.log(JSON.stringify({ summary, failed: log.filter((l) => !l.ok) }, null, 1));
