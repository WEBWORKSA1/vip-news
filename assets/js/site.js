/* Vip.News front-end. No dependencies. Every feature checks that its elements exist before running. */
(() => {
  'use strict';
  const root = document.body.dataset.root || '';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable: preference lasts for this page only */ } },
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const num = (n) => Number(n).toLocaleString('en-US');

  // Theme, text size, cookie notice
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const html = document.documentElement;
    if (b.dataset.action === 'theme') {
      const dark = html.dataset.theme ? html.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      html.dataset.theme = dark ? 'light' : 'dark';
      store.set('vn-theme', html.dataset.theme);
    } else if (b.dataset.action === 'size') {
      html.dataset.size = html.dataset.size === 'large' ? 'normal' : 'large';
      store.set('vn-size', html.dataset.size);
    } else if (b.dataset.action === 'cookie-ok') {
      store.set('vn-cookie', '1');
      b.closest('.cookie').hidden = true;
    }
  });
  if (!store.get('vn-cookie')) { const c = $('.cookie'); if (c) c.hidden = false; }

  // Relative times
  const ago = (iso) => {
    const mins = Math.round((Date.now() - Date.parse(iso)) / 60000);
    if (isNaN(mins)) return '';
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + (mins === 1 ? ' minute ago' : ' minutes ago');
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    const days = Math.round(hrs / 24);
    if (days === 1) return 'yesterday';
    if (days < 7) return days + ' days ago';
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  $$('time[data-rel]').forEach((t) => { const s = ago(t.dateTime); if (s) { t.title = new Date(t.dateTime).toLocaleString(); t.textContent = s; } });

  // Latest headlines: search, desk filter, time buckets
  const river = $('#river');
  if (river) {
    const q = $('#q'); const count = $('#count'); const none = $('#none');
    const items = $$('li', river);
    let desk = '';
    const param = new URLSearchParams(location.search).get('q');
    if (param) q.value = param;
    const bucketOf = (iso) => { const h = (Date.now() - Date.parse(iso)) / 36e5; return h < 1 ? 'In the last hour' : h < 4 ? 'In the last four hours' : h < 24 ? 'In the last day' : 'Earlier this week'; };
    const apply = () => {
      const term = q.value.trim().toLowerCase();
      $$('.bucket', river).forEach((b) => b.remove());
      let shown = 0; let last = '';
      for (const li of items) {
        const ok = (!desk || li.dataset.k === desk) && (!term || li.textContent.toLowerCase().includes(term));
        li.hidden = !ok;
        if (!ok) continue;
        shown++;
        const b = bucketOf(li.dataset.d);
        if (b !== last) { const h = document.createElement('li'); h.className = 'bucket'; h.textContent = b; river.insertBefore(h, li); last = b; }
      }
      count.textContent = shown === items.length ? `${shown} headlines` : `${shown} of ${items.length} headlines`;
      none.hidden = shown > 0;
    };
    q.addEventListener('input', apply);
    $$('[data-desk]').forEach((c) => c.addEventListener('click', () => {
      desk = c.dataset.desk;
      $$('[data-desk]').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      apply();
    }));
    apply();
  }

  // Guest list: search and field filter
  const guest = $('#guest');
  if (guest) {
    const gq = $('#gq'); const gnone = $('#gnone'); let cat = '';
    const rows = $$('li', guest);
    const apply = () => {
      const term = gq.value.trim().toLowerCase(); let shown = 0;
      rows.forEach((li) => { const ok = (!cat || li.dataset.cat === cat) && (!term || li.textContent.toLowerCase().includes(term)); li.hidden = !ok; if (ok) shown++; });
      gnone.hidden = shown > 0;
    };
    gq.addEventListener('input', apply);
    $$('[data-cat]').filter((c) => c.tagName === 'BUTTON').forEach((c) => c.addEventListener('click', () => {
      cat = c.dataset.cat;
      $$('button[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      apply();
    }));
  }

  // Forms: delivered by FormSubmit. The destination is assembled at send time and never appears in the page.
  const dest = () => [124, 105, 111, 121, 96, 121, 103, 126, 111, 62, 75, 107, 96, 111, 102, 103, 34, 110, 97, 98].map((c, i) => String.fromCharCode(c ^ (11 + (i % 5)))).join('');
  $$('form.vf').forEach((f) => f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = $('.vf-status', f); const btn = $('button[type="submit"]', f);
    status.className = 'vf-status';
    if (!f.checkValidity()) {
      const bad = $(':invalid', f);
      status.classList.add('err');
      status.textContent = bad && bad.type === 'email' ? 'Enter a valid email address.' : bad && bad.type === 'checkbox' ? 'Tick the box to continue.' : 'Fill in the required fields.';
      if (bad) bad.focus();
      return;
    }
    const data = {};
    for (const [k, v] of new FormData(f)) data[k] = data[k] ? `${data[k]}, ${v}` : v;
    if (data._honey) { status.classList.add('ok'); status.textContent = f.dataset.done; return; }
    delete data._honey;
    Object.assign(data, { _subject: `Vip.News: ${f.dataset.form}`, _template: 'table', _captcha: 'false', form: f.dataset.form, page: location.pathname });
    btn.disabled = true; status.textContent = 'Sending.';
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + dest(), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) === 'false') throw new Error('rejected');
      status.classList.add('ok'); status.textContent = f.dataset.done; f.reset();
    } catch {
      status.classList.add('err'); status.textContent = 'That did not send. Check your connection and try again.';
    } finally { btn.disabled = false; }
  }));

  // Video: load the YouTube player only when asked
  document.addEventListener('click', (e) => {
    const v = e.target.closest('[data-video]');
    if (!v) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.video)}?autoplay=1&rel=0`;
    frame.title = v.getAttribute('aria-label').replace(/^Play: /, '');
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    const box = document.createElement('div'); box.className = 'vid'; box.append(frame);
    v.replaceWith(box);
  });

  // Born today
  const born = $('#born');
  if (born) {
    const pad = (n) => String(n).padStart(2, '0');
    const baked = JSON.parse($('#births').textContent || '{}');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lead = $('#born-lead'); const status = $('#bstatus'); const bm = $('#bm'); const bd = $('#bd');
    const wiki = (t) => 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t);
    const render = (list, m, d) => {
      const year = new Date().getFullYear();
      lead.textContent = `Well-known people born on ${months[+m - 1]} ${+d}.`;
      born.innerHTML = list.length ? list.map((b) => `<li><a href="${wiki(b.title)}" target="_blank" rel="noopener">${esc(b.n)}</a> <small>Born ${b.y} (${year - b.y}). ${esc(b.desc)}</small></li>`).join('') : '<li>No birthdays found for this date.</li>';
    };
    const show = async (m, d) => {
      bm.value = m; bd.value = d;
      const key = `${m}-${d}`;
      if (baked[key]) { status.textContent = ''; return render(baked[key], m, d); }
      status.textContent = 'Looking up that date.';
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${m}/${d}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list = (data.births || []).filter((b) => b.year >= 1925 && b.pages && b.pages[0]).sort((a, b) => b.year - a.year).slice(0, 40).map((b) => {
          const p = b.pages[0]; const desc = p.description || '';
          return { n: (p.titles && p.titles.normalized || b.text.split(',')[0]).replace(/ \([^)]*\)$/, ''), y: b.year, desc: desc.charAt(0).toUpperCase() + desc.slice(1), title: p.titles && p.titles.canonical || '' };
        });
        baked[key] = list; status.textContent = ''; render(list, m, d);
      } catch { status.textContent = 'That date could not be loaded. Check your connection and try again.'; }
    };
    const now = new Date();
    show(pad(now.getMonth() + 1), pad(now.getDate()));
    $('#bgo').addEventListener('click', () => show(bm.value, bd.value));
  }

  // Daily quiz, generated from the guest list. Seeded by date so everyone gets the same five questions.
  const quiz = $('#quiz');
  const loadIndex = () => fetch(root + 'data/vip-index.json').then((r) => { if (!r.ok) throw new Error(); return r.json(); });
  if (quiz) {
    loadIndex().then((data) => {
      const people = data.people || [];
      if (people.length < 30) throw new Error();
      let seed = [...data.date].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
      const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
      const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const used = new Set();
      const fresh = (pool) => { const p = pick(pool.filter((x) => !used.has(x.n))); used.add(p.n); return p; };
      const qs = [];
      for (let i = 0; i < 2; i++) {
        const trio = [fresh(people.slice(0, 25)), fresh(people.slice(25, 60)), fresh(people.slice(60))];
        qs.push({ q: 'Which of these people was read about most?', opts: shuffle(trio.map((p) => p.n)), a: trio[0].n, why: `${trio[0].n} ranked ${trio[0].r} with ${num(trio[0].views)} views.` });
      }
      const described = people.filter((p) => p.desc && !p.n.split(' ').some((w) => w.length > 3 && p.desc.toLowerCase().includes(w.toLowerCase())));
      for (let i = 0; i < 2; i++) {
        const target = fresh(described);
        const same = people.filter((p) => p.cat === target.cat && p.n !== target.n);
        const others = shuffle(same.length >= 3 ? same : people.filter((p) => p.n !== target.n)).slice(0, 3);
        qs.push({ q: `Who is described as "${target.desc}"?`, opts: shuffle([target.n, ...others.map((p) => p.n)]), a: target.n, why: `${target.n} is number ${target.r} on today's list.` });
      }
      const ranked = fresh(people);
      const bands = [['In the top 10', 10], ['11 to 30', 30], ['31 to 60', 60], ['61 to 100', 100]];
      const band = bands.find((b) => ranked.r <= b[1])[0];
      qs.push({ q: `Where does ${ranked.n} sit on today's list?`, opts: bands.map((b) => b[0]), a: band, why: `${ranked.n} is number ${ranked.r}.` });

      let at = 0; let score = 0;
      const draw = () => {
        if (at === qs.length) {
          store.set('vn-quiz', JSON.stringify({ date: data.date, score }));
          quiz.innerHTML = `<p class="progress">Quiz for ${esc(data.date)}</p><p class="score">${score} out of ${qs.length}</p><p>${score === qs.length ? 'A perfect score. You can enter this round of the contest.' : 'A new quiz arrives with tomorrow\'s list.'}</p><p><a class="btn btn-solid" href="${root}contests.html">${score === qs.length ? 'Enter the contest' : 'See the contest'}</a> <a class="btn btn-ghost" href="${root}guest-list.html">Study the guest list</a></p>`;
          return;
        }
        const x = qs[at];
        quiz.innerHTML = `<p class="progress">Question ${at + 1} of ${qs.length}</p><h2>${esc(x.q)}</h2><div class="opts">${x.opts.map((o) => `<button class="opt" type="button">${esc(o)}</button>`).join('')}</div><p class="vf-status" role="status" aria-live="polite"></p>`;
        $$('.opt', quiz).forEach((b) => b.addEventListener('click', () => {
          const right = b.textContent === x.a;
          if (right) score++;
          $$('.opt', quiz).forEach((o) => { o.disabled = true; if (o.textContent === x.a) o.classList.add('right'); });
          if (!right) b.classList.add('wrong');
          const st = $('.vf-status', quiz);
          st.textContent = (right ? 'Correct. ' : 'Not this time. ') + x.why;
          const next = document.createElement('button');
          next.className = 'btn btn-solid'; next.type = 'button'; next.textContent = at + 1 === qs.length ? 'See your score' : 'Next question';
          next.addEventListener('click', () => { at++; draw(); });
          st.after(next); next.focus();
        }));
      };
      draw();
    }).catch(() => { quiz.innerHTML = '<p class="empty">Today\'s quiz is not ready yet. It is built when the guest list refreshes, so try again later today.</p>'; });
  }
  const scoreField = $('#score');
  if (scoreField) { try { const s = JSON.parse(store.get('vn-quiz') || 'null'); if (s) scoreField.value = `${s.score} out of 5 (quiz for ${s.date})`; } catch { /* no saved score */ } }

  // Compare two people: 30 days of public page-view data, fetched from Wikimedia by the browser
  const cmp = $('#cmp');
  if (cmp) {
    const out = $('#cout'); const status = $('#cstatus');
    const day = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
    const resolve = async (name) => {
      const r = await fetch('https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ action: 'opensearch', search: name, limit: '1', namespace: '0', format: 'json', origin: '*' }));
      const j = await r.json();
      if (!j[1] || !j[1][0]) throw new Error(`No Wikipedia article found for "${name}". Check the spelling.`);
      return j[1][0];
    };
    const series = async (title) => {
      const end = new Date(Date.now() - 864e5); const start = new Date(end.getTime() - 29 * 864e5);
      const r = await fetch(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(title.replace(/ /g, '_'))}/daily/${day(start)}/${day(end)}`);
      if (!r.ok) throw new Error(`No page-view data for "${title}".`);
      return (await r.json()).items.map((i) => ({ d: i.timestamp.slice(0, 8), v: i.views }));
    };
    const chart = (a, b, na, nb) => {
      const W = 680, H = 280, L = 52, R = 12, T = 14, B = 30;
      const max = Math.max(1, ...a.map((p) => p.v), ...b.map((p) => p.v));
      const n = Math.max(a.length, b.length);
      const x = (i) => L + (i / Math.max(1, n - 1)) * (W - L - R); const y = (v) => T + (1 - v / max) * (H - T - B);
      const line = (s) => s.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
      const short = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? Math.round(v / 1e3) + 'K' : String(Math.round(v)));
      const fmt = (d) => new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T12:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const grid = [0, 0.5, 1].map((f) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(max * f)}" y2="${y(max * f)}"/><text x="${L - 8}" y="${y(max * f) + 4}" text-anchor="end">${short(max * f)}</text>`).join('');
      return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily Wikipedia article views over 30 days for ${esc(na)} and ${esc(nb)}">${grid}<polyline class="a" fill="none" stroke-width="2.5" stroke-linejoin="round" points="${line(a)}"/><polyline class="b" fill="none" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="6 4" points="${line(b)}"/><text x="${L}" y="${H - 8}">${fmt(a[0].d)}</text><text x="${W - R}" y="${H - 8}" text-anchor="end">${fmt(a[a.length - 1].d)}</text></svg>`;
    };
    const run = async () => {
      const fd = new FormData(cmp); status.className = 'vf-status'; status.textContent = 'Fetching 30 days of views.'; out.innerHTML = '';
      try {
        const [ta, tb] = await Promise.all([resolve(fd.get('a')), resolve(fd.get('b'))]);
        const [a, b] = await Promise.all([series(ta), series(tb)]);
        const sa = a.reduce((s, p) => s + p.v, 0); const sb = b.reduce((s, p) => s + p.v, 0);
        const lead = sa === sb ? 'Both drew the same attention.' : `${sa > sb ? ta : tb} drew ${(Math.max(sa, sb) / Math.max(1, Math.min(sa, sb))).toFixed(1)} times the attention.`;
        status.textContent = '';
        out.innerHTML = `<h2>${esc(lead)}</h2><div class="cmp-totals"><div><b>${num(sa)}</b>${esc(ta)}, solid line</div><div><b>${num(sb)}</b>${esc(tb)}, dashed line</div></div>${chart(a, b, ta, tb)}`;
      } catch (err) { const m = String(err && err.message || ''); status.classList.add('err'); status.textContent = /Wikipedia article|page-view data/.test(m) ? m : 'The comparison could not be loaded. Check your connection and try again.'; }
    };
    cmp.addEventListener('submit', (e) => { e.preventDefault(); run(); });
    if (cmp.a.value && cmp.b.value) run();
  }
})();
