// Site configuration for Vip.News. Edit here; the refresh job and the builder both read it.
export const SITE = {
  name: 'Vip.News',
  tagline: 'The daily briefing on the people who move the world',
  url: 'https://vip.news',
  description:
    'Vip.News tracks the people the world is reading about: a daily guest list of the most-read public figures, plus headlines on power, wealth, tech, entertainment, sport and society from leading publishers.',
  outboundContact: 'https://web.works/contact',
  contactBarText:
    'Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership',
  adsense: {
    client: 'ca-pub-6620975821265271',
    // Paste ad unit slot IDs from AdSense to switch on fixed placements. Auto ads work without them.
    slots: { top: '', inFeed: '', sidebar: '', article: '' },
  },
  // Paste real payment links to turn the Support page buttons into live checkouts.
  payments: { paypal: '', stripe: '', buymeacoffee: '' },
  contest: {
    name: 'The Guest List Challenge',
    prize: 'Announced with each round',
    cadence: 'weekly',
  },
};

export const DESKS = [
  { id: 'world', name: 'World and power', short: 'Power', blurb: 'Presidents, prime ministers, monarchs and the people around them.', cats: ['power'] },
  { id: 'business', name: 'Business and wealth', short: 'Wealth', blurb: 'Billionaires, chief executives, dealmakers and the money they move.', cats: ['business'] },
  { id: 'tech', name: 'Tech and founders', short: 'Tech', blurb: 'Founders, engineers and the companies rewriting how things work.', cats: ['business'] },
  { id: 'entertainment', name: 'Entertainment', short: 'Screen and stage', blurb: 'Film, television and music, and the names on the poster.', cats: ['screen', 'music'] },
  { id: 'sports', name: 'Sports', short: 'Sports', blurb: 'Champions, transfers, records and the people behind the result.', cats: ['sports'] },
  { id: 'society', name: 'Royals and society', short: 'Society', blurb: 'Royal households, fashion and the social calendar.', cats: ['power', 'culture'] },
];

export const CATS = { power: 'Power', business: 'Business', screen: 'Screen', music: 'Music', sports: 'Sports', culture: 'Culture' };

// Each feed is fetched independently; a dead feed is skipped and reported in data/meta.json.
export const FEEDS = [
  ['world', 'BBC News', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
  ['world', 'BBC News', 'https://feeds.bbci.co.uk/news/politics/rss.xml'],
  ['world', 'The Guardian', 'https://www.theguardian.com/world/rss'],
  ['world', 'NPR', 'https://feeds.npr.org/1004/rss.xml'],
  ['world', 'Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml'],
  ['world', 'DW', 'https://rss.dw.com/rdf/rss-en-top'],
  ['world', 'France 24', 'https://www.france24.com/en/rss'],
  ['business', 'BBC News', 'https://feeds.bbci.co.uk/news/business/rss.xml'],
  ['business', 'The Guardian', 'https://www.theguardian.com/uk/business/rss'],
  ['business', 'NPR', 'https://feeds.npr.org/1006/rss.xml'],
  ['business', 'CNBC', 'https://www.cnbc.com/id/100003114/device/rss/rss.html'],
  ['business', 'CNBC', 'https://www.cnbc.com/id/10001054/device/rss/rss.html'],
  ['business', 'Fortune', 'https://fortune.com/feed/'],
  ['business', 'MarketWatch', 'https://feeds.content.dowjones.io/public/rss/mw_topstories'],
  ['tech', 'BBC News', 'https://feeds.bbci.co.uk/news/technology/rss.xml'],
  ['tech', 'The Guardian', 'https://www.theguardian.com/uk/technology/rss'],
  ['tech', 'TechCrunch', 'https://techcrunch.com/feed/'],
  ['tech', 'The Verge', 'https://www.theverge.com/rss/index.xml'],
  ['tech', 'Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index'],
  ['tech', 'Wired', 'https://www.wired.com/feed/rss'],
  ['entertainment', 'BBC News', 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'],
  ['entertainment', 'The Guardian', 'https://www.theguardian.com/film/rss'],
  ['entertainment', 'The Guardian', 'https://www.theguardian.com/music/rss'],
  ['entertainment', 'Variety', 'https://variety.com/feed/'],
  ['entertainment', 'Deadline', 'https://deadline.com/feed/'],
  ['entertainment', 'The Hollywood Reporter', 'https://www.hollywoodreporter.com/feed/'],
  ['entertainment', 'NPR', 'https://feeds.npr.org/1048/rss.xml'],
  ['sports', 'BBC Sport', 'https://feeds.bbci.co.uk/sport/rss.xml'],
  ['sports', 'The Guardian', 'https://www.theguardian.com/uk/sport/rss'],
  ['sports', 'ESPN', 'https://www.espn.com/espn/rss/news'],
  ['sports', 'Sky Sports', 'https://www.skysports.com/rss/12040'],
  ['society', 'The Guardian', 'https://www.theguardian.com/uk/monarchy/rss'],
  ['society', 'The Guardian', 'https://www.theguardian.com/fashion/rss'],
  ['society', 'Vanity Fair', 'https://www.vanityfair.com/feed/rss'],
  ['society', 'The Guardian', 'https://www.theguardian.com/lifeandstyle/rss'],
];

// Official publisher channels. The channel name shown on the site comes from YouTube's own feed.
export const YOUTUBE_CHANNELS = [
  'UC16niRr50-MSBwiO3YDb3RA', // BBC News
  'UCIALMKvObZNtJ6AmdCLP7Lg', // Bloomberg Television
  'UCvJJ_dzjViJCoLf5uKUTwoA', // CNBC
  'UCNye-wNBqNL5ZzHSJj3l8Bg', // Al Jazeera English
  'UCknLrEdhRCp1aegoMqRaCZg', // DW News
  'UChqUTb7kYRX8-EiaN3XFrSQ', // Reuters
  'UC52X5wxOL_s5yw0dQk7NtgA', // Associated Press
  'UCoMdktPbSTixAyNGwb-UYkQ', // Sky News
  'UCoUxsWakJucWg46KW5RsvPw', // Financial Times
  'UCK7tptUDHh-RYDsdxO1-5QQ', // The Wall Street Journal
  'UC0p5jTq6Xx_DosDFxVXnWaQ', // The Economist
  'UCQfwfsi5VrQ8yKZ-UWmAEFg', // France 24 English
];
