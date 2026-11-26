// Original editorial content: guides and policy pages. Plain HTML fragments.
export const GUIDES = [
  {
    slug: 'how-the-guest-list-works',
    title: 'How the guest list works',
    summary: 'What the daily ranking measures, where the numbers come from, and what it cannot tell you.',
    minutes: 4,
    body: `
<p>The guest list is a daily ranking of the 100 people whose English Wikipedia articles were read most on the previous day. It is a measure of attention. It does not measure approval, wealth, influence or importance, and a person can top it for good news, bad news or no news at all.</p>
<h2>Where the numbers come from</h2>
<p>The Wikimedia Foundation publishes how many times every Wikipedia article is viewed each day. Our refresh job downloads the list of most-viewed articles, then asks Wikidata which of those articles are about a human being. Films, countries, sports clubs, lists and fictional characters are dropped. What remains is ranked by views.</p>
<p>The short description beside each name also comes from Wikidata. We sort people into six groups (power, business, screen, music, sports and culture) by reading that description and the occupations Wikidata records. The sorting is automatic, so it is sometimes wrong at the edges: an actor who became a governor may land in either group.</p>
<h2>Reading the arrows</h2>
<p>The change column compares a person's position with the day before. A person marked as new was not among the most-read people a day earlier. Large jumps usually follow a specific event: an election result, a film release, a match, an award, an arrest, a death.</p>
<h2>What it cannot tell you</h2>
<ul>
<li><strong>Why someone is on it.</strong> The ranking shows that people looked a person up, never the reason. Check the headlines for context.</li>
<li><strong>What the world thinks.</strong> It covers English Wikipedia only, so it leans toward stories that English-language readers follow.</li>
<li><strong>Whether the attention is human.</strong> Wikimedia filters out known automated traffic, but unusual spikes occasionally slip through.</li>
</ul>
<h2>How often it changes</h2>
<p>Wikimedia finalises each day's figures a few hours after midnight UTC. Our job checks several times a day and rebuilds the list as soon as a new day is available. The date at the top of the list tells you which day you are looking at.</p>`,
  },
  {
    slug: 'read-the-news-in-five-minutes',
    title: 'How to read the news in five minutes without missing what matters',
    summary: 'A short routine for staying informed: scan, pick, verify, stop.',
    minutes: 5,
    body: `
<p>Most people do not have a news problem. They have a time problem. The goal of a five-minute read is not to know everything. It is to know what changed since yesterday and which two stories deserve more of your attention later.</p>
<h2>Minute one: scan headlines from more than one publisher</h2>
<p>A single outlet shows you one editor's view of the day. Scanning the same story across three publishers shows you what is agreed and what is framing. When three unrelated newsrooms lead with the same event, it matters. When only one does, it may be an exclusive, or it may be a slow day.</p>
<h2>Minutes two and three: pick two stories</h2>
<p>Choose one story that affects your work or money and one that you are simply curious about. Open the original article for each. Read the first four paragraphs: reputable newsrooms put who, what, when and where at the top, and the background below.</p>
<h2>Minute four: check the people</h2>
<p>News is made by people making decisions. Ask who decided, who benefits and who is quoted. If a story about a chief executive quotes only the company, you have read a press release. If it quotes a regulator, a rival and an employee, you have read reporting.</p>
<h2>Minute five: stop</h2>
<p>Close the tab. Research on news habits consistently finds that checking more often does not make people better informed; it makes them more anxious. Set a second time later in the day if you need one, and leave the rest.</p>
<h2>Three habits that save the most time</h2>
<ol>
<li>Read at fixed times instead of reacting to alerts.</li>
<li>Prefer original reporting to commentary about reporting.</li>
<li>When a headline makes you angry, read the article before you share it. The headline was written to be clicked; the article was written to be accurate.</li>
</ol>`,
  },
  {
    slug: 'how-net-worth-estimates-are-made',
    title: 'How billionaire net worth estimates are made, and why they disagree',
    summary: 'Share prices, private holdings, debt and guesswork: what is inside a headline wealth figure.',
    minutes: 5,
    body: `
<p>When a headline says someone gained or lost billions in a day, no money moved. The figure is an estimate of what that person's assets would be worth if valued at today's prices. Understanding how the estimate is built explains why two respected publishers can print different numbers for the same person on the same day.</p>
<h2>Public shares do most of the work</h2>
<p>For founders of listed companies, most of the estimate is arithmetic: shares held, multiplied by the share price. Holdings are disclosed in regulatory filings, so this part is reliable. It is also why fortunes swing so sharply. A founder who owns a large stake in one company rises and falls with that single share price.</p>
<h2>Private companies are valued by comparison</h2>
<p>Private businesses have no daily price. Researchers estimate their value from the most recent funding round, from revenue and profit where known, or by comparing them with similar listed companies. Different researchers pick different comparisons, and the answers diverge.</p>
<h2>Debt, pledged shares and cash</h2>
<p>Careful estimates subtract known debts and discount shares pledged as collateral for loans. They add an allowance for cash built up from dividends and past share sales, minus taxes and known spending. Much of this is inferred, because nobody is obliged to publish a personal balance sheet.</p>
<h2>What is usually left out</h2>
<ul>
<li>Assets held through trusts or family members, unless ownership is documented.</li>
<li>Art, property and other possessions that are hard to price.</li>
<li>Wealth of rulers and heads of state, which is often inseparable from the state itself.</li>
</ul>
<h2>How to read a wealth headline</h2>
<p>Treat the figure as a range, not a balance. Look for the date of the valuation, because a number from the annual list and a number from this morning are different things. And remember that paper wealth cannot be spent at face value: selling a large stake moves the price and triggers tax.</p>`,
  },
  {
    slug: 'verify-a-viral-story-about-a-public-figure',
    title: 'How to verify a viral story about a public figure',
    summary: 'Six checks that take two minutes and catch most hoaxes, fake quotes and manipulated images.',
    minutes: 5,
    body: `
<p>False stories about famous people travel fast because they are surprising and cost nothing to share. Death hoaxes, invented quotes and doctored images appear every week. These checks catch most of them.</p>
<h2>1. Find the original source</h2>
<p>A screenshot is not a source. Search for the exact claim and trace it to where it first appeared. If the trail ends at an anonymous account or a site you have never heard of, treat the claim as unconfirmed.</p>
<h2>2. Look for independent confirmation</h2>
<p>Major news about a major figure is reported by several newsrooms within minutes, and wire services such as the Associated Press and Reuters are usually first. One outlet alone is a reason to wait. Ten outlets all citing the same single post are still one source.</p>
<h2>3. Check the person's own channels</h2>
<p>Verified accounts, official websites and spokespeople confirm or deny quickly when a false story spreads. Check that the account is the real one: impostor accounts copy names and photos.</p>
<h2>4. Read the date</h2>
<p>Old stories resurface as if new. An article from years ago, shared without its date, can look like breaking news. Open the link and read the publication date before reacting.</p>
<h2>5. Be suspicious of perfect quotes</h2>
<p>Invented quotes tend to be short, outrageous and attached to a photo. Real quotes have a time, a place and an interviewer. Search the quote in quotation marks. If it appears only on image posts, it is probably fabricated.</p>
<h2>6. Examine images and video</h2>
<p>Use a reverse image search to see where a picture first appeared. For video, look at hands, teeth, jewellery and background text, where synthetic footage often breaks down, and check whether any newsroom has published the same footage.</p>
<h2>When you cannot tell</h2>
<p>Do not share it. Waiting an hour costs nothing, and an hour is usually long enough for a real story to be confirmed or a fake one to be debunked.</p>`,
  },
  {
    slug: 'what-makes-a-person-newsworthy',
    title: 'What makes a person newsworthy',
    summary: 'The tests editors apply before a name becomes a headline, and where privacy still applies.',
    minutes: 4,
    body: `
<p>Editors decide many times a day whether something a person did is news. The decision is less arbitrary than it looks. Most newsrooms weigh the same handful of questions.</p>
<h2>Power over other people</h2>
<p>The strongest test is whether a person's decisions affect others. A head of government, a central banker or the chief executive of a large employer is newsworthy at work almost by definition, because the public has a stake in what they do.</p>
<h2>Public role, public conduct</h2>
<p>People who seek public attention, such as performers, athletes and candidates, accept scrutiny of the role they chose. That scrutiny has limits. Most editorial codes distinguish between conduct connected to the public role and private matters that are not, such as health or the lives of a person's children.</p>
<h2>Scale, novelty and consequence</h2>
<p>An event is more likely to be reported when it is large, unexpected or likely to change something. A routine earnings report is a brief; the same report with a surprise resignation is a lead story.</p>
<h2>Proximity</h2>
<p>Audiences care more about people close to them, geographically or culturally. This is why the same day produces different front pages in different countries, and why any ranking of attention reflects the readers it was drawn from.</p>
<h2>The public interest is not whatever interests the public</h2>
<p>Curiosity alone does not justify intrusion. Responsible outlets ask whether publishing serves a purpose: exposing wrongdoing, protecting safety, informing a decision the public must make. Gossip can be entertaining and lawful; it is a different product from news, and a careful reader keeps the two apart.</p>`,
  },
  {
    slug: 'how-power-lists-are-made',
    title: 'How power lists and influence rankings are made',
    summary: 'Annual rankings look objective. Here is what is measured, what is judged, and how to read them.',
    minutes: 4,
    body: `
<p>Every year publishers rank the richest, the most powerful and the most influential people. The lists are popular because they turn a messy question into a simple order. They are useful when you know what went into them.</p>
<h2>Measured lists</h2>
<p>Some rankings rest on a number: estimated net worth, company revenue, prize money, audience size. The method is published and others can check it. Their weakness is the quality of the inputs, which are often estimates.</p>
<h2>Judged lists</h2>
<p>Lists of influence or power are chosen by editors, sometimes with a panel. There is no formula. Editors weigh the resources a person controls, how many people their decisions reach and whether they actually use that power. These lists are arguments, and should be read as arguments.</p>
<h2>Nominated lists</h2>
<p>Rising-talent lists usually begin with applications or nominations. That favours people with the time and networks to put themselves forward, so absence from a list says little about merit.</p>
<h2>Questions worth asking of any list</h2>
<ul>
<li>Is the method published, and could someone else reproduce the order?</li>
<li>What period does it cover, and when were the figures fixed?</li>
<li>Who is excluded by the rules, for example heads of state or people whose wealth is hard to document?</li>
<li>Does the publisher sell anything to those listed, such as event tickets, licences to use the badge or advertising?</li>
</ul>
<h2>How our ranking differs</h2>
<p>Our guest list is a measured list with one input: how many times a person's Wikipedia article was read yesterday. It answers a narrow question, who are people looking up, and nothing more. The full method is in <a href="how-the-guest-list-works.html">How the guest list works</a>.</p>`,
  },
  {
    slug: 'wire-services-and-who-reported-it-first',
    title: 'Wire services, outlets and aggregators: who actually reported it',
    summary: 'Why the same sentence appears on fifty sites, and how to tell original reporting from repetition.',
    minutes: 4,
    body: `
<p>Search for a big story and the same paragraph turns up on dozens of websites. That is not copying in the usual sense. It is how the news supply chain works, and knowing the chain helps you judge how solid a story is.</p>
<h2>Wire services</h2>
<p>Agencies such as the Associated Press, Reuters and Agence France-Presse employ reporters around the world and license their work to other publishers. A regional newspaper cannot staff a bureau in every capital, so it buys the wire. When you see an agency credit at the top of an article, the reporting was done by the agency.</p>
<h2>Original outlets</h2>
<p>Newsrooms add their own reporting: exclusives, investigations, interviews and analysis. Signs of original work are named reporters, a dateline showing where the reporter was, documents the outlet obtained and quotes given directly to it.</p>
<h2>Aggregators</h2>
<p>Aggregators collect headlines from many publishers and link to them. A good aggregator saves time and shows the range of coverage; it does not replace the article it points to. Vip.News is an aggregator for headlines: every headline links to the publisher that wrote the story, and we do not copy article text.</p>
<h2>Why this matters when you read</h2>
<ul>
<li>Fifty sites running one agency report is one source, repeated.</li>
<li>Two outlets confirming a fact independently is stronger than fifty repeats.</li>
<li>Phrases like "according to reports" mean the outlet has not confirmed the claim itself.</li>
</ul>
<p>When a story matters to you, follow the credit line back to whoever did the reporting and read it there.</p>`,
  },
  {
    slug: 'follow-public-figures-without-doomscrolling',
    title: 'How to follow public figures without doomscrolling',
    summary: 'Build a short watchlist, give it a schedule, and let the rest go.',
    minutes: 3,
    body: `
<p>Following the people who shape your industry, your investments or your interests is useful. Following everyone, all day, is not. A watchlist turns an endless feed into a short, finite read.</p>
<h2>Choose fewer people than you think</h2>
<p>Pick five to ten names whose decisions affect you: the head of the central bank, the chief executive of your largest holding, the minister for your sector, an artist or athlete you care about. If a name has not produced a decision you acted on in a year, remove it.</p>
<h2>Follow decisions, not commentary</h2>
<p>For each person, identify where decisions are announced: filings, official statements, press conferences, match days, release dates. Read those. Skip the reaction cycle that follows, which mostly repeats the announcement with opinions attached.</p>
<h2>Give it a time and a limit</h2>
<p>Check once or twice a day at set times. Use the search box on our <a href="../latest.html">latest headlines</a> page to see today's coverage of any name, then stop when you reach the end of the list.</p>
<h2>Notice how you feel afterward</h2>
<p>If a source regularly leaves you agitated and no better informed, it is optimised for engagement, not for you. Replace it with a calmer one that reports the same facts.</p>`,
  },
];

export const POLICY = {
  about: `
<p>Vip.News is an independent news briefing about people. Instead of sorting the day by topic alone, it starts with a question: who is the world reading about, and what did they do?</p>
<h2>What you will find here</h2>
<ul>
<li><strong>The guest list.</strong> A daily ranking of the 100 most-read people on English Wikipedia, with their position compared with the day before.</li>
<li><strong>Headlines from six desks.</strong> Power, wealth, tech, entertainment, sports and society, gathered from established publishers. Every headline links to the publisher's own article.</li>
<li><strong>Video.</strong> Recent uploads from official news channels, played through YouTube's own player.</li>
<li><strong>Tools.</strong> A weekly quiz, a tool that compares public attention on any two people, and a born-today lookup.</li>
<li><strong>Guides.</strong> Original explainers on reading the news well.</li>
</ul>
<h2>How the site stays current</h2>
<p>An automated job refreshes the headlines, ranking, birthdays and videos several times a day and rebuilds every page. The time of the last refresh is shown in the footer.</p>
<h2>Independence</h2>
<p>Vip.News is not affiliated with any publisher, person or organisation it links to or names. The site is funded by advertising, sponsorship and reader support. Advertisers and supporters have no say over rankings or which headlines appear.</p>`,
  editorial: `
<h2>Headlines</h2>
<p>Headlines are collected automatically from the public feeds of established publishers. We show the headline, the publisher's name and the time of publication, and link to the original. We do not copy article text, rewrite headlines or host publisher images.</p>
<h2>Rankings</h2>
<p>The guest list is calculated from public page-view data. Nobody can pay to appear on it, move up it or be removed from it. The method is described in full in our guide, How the guest list works.</p>
<h2>Original writing</h2>
<p>Guides are written for this site. They explain how news and rankings work and avoid claims about the private lives of individuals.</p>
<h2>People</h2>
<p>We describe people using neutral reference descriptions from Wikidata. We do not publish rumours, home addresses, health speculation or material about the children of public figures.</p>
<h2>Corrections and removal</h2>
<p>If something here is wrong, or you are a publisher who wants your feed excluded, use the contact form. Corrections are made promptly and feed exclusions take effect at the next refresh.</p>
<h2>Advertising and sponsorship</h2>
<p>Advertising is labelled. Sponsored placements are marked as sponsored and are kept separate from rankings and headline selection.</p>`,
  privacy: `
<p>This policy explains what information Vip.News handles and why. It applies to this website only.</p>
<h2>Information you give us</h2>
<p>When you submit a form (joining the list, advertising enquiries, pledges, contest entries, applications or messages) we receive the details you typed. Forms are delivered by FormSubmit, a third-party form service, to the site's operator. We use the details to respond to you and for the purpose stated on the form. We do not sell them.</p>
<h2>Information stored in your browser</h2>
<p>Your preferences (light or dark theme, text size, chosen desks, quiz scores and whether you dismissed the cookie notice) are saved in your browser's local storage. They stay on your device.</p>
<h2>Advertising and cookies</h2>
<p>We use Google AdSense to show advertising. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and other sites on the Internet.</p>
<p>You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" rel="noopener">Google Ads Settings</a>. You can also opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" rel="noopener">aboutads.info</a>. More detail is in <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">How Google uses information from sites that use its services</a>.</p>
<h2>Embedded and third-party content</h2>
<p>Videos play through YouTube's privacy-enhanced player and load only when you press play. The comparison and born-today tools request public data from the Wikimedia Foundation directly from your browser. Fonts are served by Google Fonts. These services receive your IP address when their content loads and apply their own privacy policies.</p>
<h2>Links to other sites</h2>
<p>Headlines link to publishers' websites. We are not responsible for their content or privacy practices.</p>
<h2>Your choices</h2>
<p>You can clear stored preferences by clearing site data in your browser. To ask what form details we hold about you, or to have them deleted, use the contact form.</p>
<h2>Children</h2>
<p>This site is intended for a general audience and is not directed at children under 13. We do not knowingly collect information from children.</p>
<h2>Changes</h2>
<p>We will post any changes to this policy on this page with a new date.</p>`,
  terms: `
<h2>Using this site</h2>
<p>Vip.News is provided for general information. You may read, link to and share its pages. You may not copy the site wholesale, interfere with its operation or use it unlawfully.</p>
<h2>Third-party content</h2>
<p>Headlines, publisher names and videos belong to their respective owners and are shown with a link to the source. Following a link takes you to a site we do not control.</p>
<h2>Accuracy</h2>
<p>Rankings and headlines are compiled automatically from third-party data and may contain errors or be out of date. Nothing here is financial, legal or professional advice. Check the original source before relying on anything you read.</p>
<h2>Forms, pledges and contests</h2>
<p>Submitting a form does not create a contract. A pledge is an expression of intent and is not a payment. Contests are governed by the official rules published on the contest rules page.</p>
<h2>Liability</h2>
<p>The site is provided as is, without warranties of any kind. To the extent the law allows, the operator is not liable for loss arising from use of the site or reliance on its content.</p>
<h2>Changes</h2>
<p>These terms may be updated. Continued use of the site after a change means you accept the updated terms.</p>`,
  disclaimer: `
<h2>Independent site</h2>
<p>Vip.News is an independent website. The name is the domain name itself, and "VIP" is used in its ordinary dictionary sense of "very important person". The site is not affiliated with, endorsed by, sponsored by or connected to any company, publication, broadcaster, newsletter, agency, programme or service that uses "VIP News", "VIPNews", "VIP-News", "VIP News Service", "VIP News Now" or any similar name, anywhere in the world.</p>
<h2>Trademarks</h2>
<p>All trademarks, service marks, logos, publisher names, channel names and brand names shown or mentioned on this site belong to their respective owners. They are used only to identify the source of a headline or video. Their use does not imply any relationship with, or endorsement by, the owner. This site makes no claim to any third-party mark.</p>
<h2>Copyright</h2>
<p>Original text, design and code on this site are &copy; Vip.News. Headlines are the work of the publishers named beside them and link to the original articles; this site does not reproduce article text or publisher images. Videos are embedded with YouTube's standard player and remain hosted by, and the property of, their uploaders.</p>
<p>Reference descriptions of people and page-view figures come from Wikidata and the Wikimedia Foundation. Wikidata content is available under the Creative Commons CC0 dedication. Born-today entries are drawn from Wikipedia and are available under the <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener">Creative Commons Attribution-ShareAlike 4.0 licence</a>.</p>
<h2>People named on this site</h2>
<p>Names of public figures appear because they were widely read about or reported on. Appearing here does not imply that the person endorses, uses or is associated with this site.</p>
<h2>Removal and rights requests</h2>
<p>If you own rights in material shown here and want it removed or credited differently, or you believe anything on this site infringes your rights, send the page address and the details through the contact form. Valid requests are acted on promptly.</p>
<h2>No advice</h2>
<p>Content is for general information only and is not financial, legal or professional advice.</p>`,
  rules: `
<ol>
<li><strong>No purchase necessary.</strong> Entry is free. A donation, pledge or purchase does not improve your chances.</li>
<li><strong>Who can enter.</strong> Adults aged 18 or over, where such contests are lawful. The contest is void where prohibited or restricted by law. The site operator and immediate family are not eligible.</li>
<li><strong>How to enter.</strong> Complete the current round's quiz and submit the entry form with a valid email address during the entry period shown on the contest page. One entry per person per round.</li>
<li><strong>How winners are chosen.</strong> Each round, the winner is drawn at random from entries with the highest quiz score. Where local law requires a contest of skill, the tie-break answer on the entry form decides.</li>
<li><strong>Prizes.</strong> The prize for each round is stated on the contest page before the round opens. Prizes cannot be exchanged or transferred. Taxes are the winner's responsibility.</li>
<li><strong>Notification.</strong> Winners are contacted at the email address they entered. A winner who does not reply within 14 days forfeits the prize and another winner may be drawn.</li>
<li><strong>Publicity.</strong> Winners are announced by first name and country only, and only with their consent.</li>
<li><strong>Your details.</strong> Entry details are used to run the contest and contact winners, as described in the privacy policy.</li>
<li><strong>Changes.</strong> The operator may amend, suspend or cancel a round if it cannot be run fairly.</li>
<li><strong>Sponsor.</strong> The contest is run by the operator of Vip.News and is not sponsored, endorsed or administered by Google, YouTube, the Wikimedia Foundation or any publisher named on the site.</li>
</ol>`,
};
