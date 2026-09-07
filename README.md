# gekjr.pro — static rebuild

Plain HTML/CSS/JS. No build step, no dependencies to install.

## File map
- `index.html`, `about.html`, `insights.html`, `photos.html`, `contact.html`
- `posts/*.html` — one file per blog post
- `css/style.css` — all styling / design tokens
- `js/main.js` — nav toggle + contact form UI
- `amplify.yml` — Amplify Hosting build spec (no-op build, just deploys the files)

## Previewing locally

```
cd ~/Documents/GitHub/gekjr-site
python3 tools/serve.py . 8788
```

Then **http://localhost:8788**. Leave that window alone once it prints
`serving …` — anything typed into it is swallowed until the server
exits, which looks exactly like a broken command. `Ctrl-C` to stop, or
close the window.

`serve.py` applies the same rewrite table Amplify uses, so clean URLs
work and what you see matches the live site. **It walks subfolders**, so
`/posts/<slug>` resolves — the earlier version globbed the top level
only, which meant every post 404'd locally while working fine in
production.

**Port 8788, not 8000.** A working machine usually has something on
8000, 8080 or 3000 already, and the clash surfaces as `Address already
in use` here and `refused to connect` in the browser — two
opposite-sounding errors for one cause. `pkill -f serve.py` clears
strays. The Magek site uses 8787, so both can run at once.

## Clean URLs and the Amplify rules

No page URL ends in `.html`. The files keep their `.html` names and
**Amplify rewrites the clean path to the real file** — which means every
page needs an explicit rule in the Console, including all nine posts.

`tools/shortlinks.py` generates that block from the files on disk:

```
python3 tools/shortlinks.py            # live site
python3 tools/shortlinks.py --splash   # holding page on the front door
python3 tools/shortlinks.py --check    # validate only
```

Paste what it prints into **Amplify → App settings → Rewrites and
redirects**. If the Console shows a table of rows, look for **Open text
editor** and paste the JSON whole.

**Replace the entire list — the block is not additive.** Amplify takes
the first matching rule top to bottom, so anything left behind changes
the outcome. Delete Amplify's default SPA fallback in particular: it
serves the homepage for every unmatched path, which breaks clean URLs in
a way that looks like the site working.

**One explicit rule per page, never a wildcard.** `{"source": "/<*>",
"target": "/<*>.html"}` looks right and is the documented Amplify trap —
it matches `/css/style.css` too, rewrites it to `/css/style.css.html`,
and the site loads as unstyled text.

**Add a post → run the script → paste again.** A post without a rule
404s only for people who follow the link, so nothing tells you.

## The splash page

`splash.html` is the holding page. It ships at all times and is switched
on and off **entirely from the Console** — paste the `--splash` block to
raise it, the normal block to drop it. No deploy either way.

`/home` keeps the real homepage reachable while the front door is held.
A known path, not a secret one.

**It used to work by renaming files** — `index.html` became the splash
and the real homepage was parked at `index-REAL-HOMEPAGE.html`. That has
two costs: the real homepage is only reachable at an ugly URL, and
turning the splash off needs a deploy rather than a paste. `index.html`
is the real homepage again; the splash lives in its own file.

`splash.html` carries `noindex`. Without it a crawl during the window
caches "Back Soon" as the site's description long after it is wrong —
and it had been live without it.

## Short links

`gekjr.pro/v/<slug>` redirects to any URL. Add an entry to
`shortlinks.json`, run `tools/shortlinks.py`, paste the block.

**302, not 301.** A permanent redirect is cached by browsers effectively
forever, so a wrong target would follow people around long after it was
fixed.

## Still needed from you
1. **3 blog posts** — full text for:
   - `posts/9-16-framing-guides.html`
   - `posts/coreplay-tetra.html`
   - `posts/toxic-start-to-2026.html`
   - and the kit list in `posts/kit.html`
   Each has a red `build-note` box marking where to paste it.
2. **Photos** — the gallery on `photos.html` has placeholder tiles for IBC Demo, NAB 2018, Flight, Gear, and Engineering. Send images and I'll drop them in and wire up a lightbox if you want one.
3. **Logo file** — I used a text wordmark + a red "tally light" dot as the mark since I couldn't pull your actual logo file. If you want your real logo, send the image (PNG/SVG) and I'll swap it into the header.
4. **Domain** — gekjr.pro is currently on Wix Code (wocode.com). Moving it to Amplify means updating DNS once the Amplify app is live (steps below).

## Deploying to AWS Amplify

**Option A — Amplify Console, no Git (fastest)**
1. AWS Console → Amplify → **Create new app** → **Deploy without Git provider**.
2. Zip the contents of this folder (not the folder itself) and upload.
3. Amplify gives you a `*.amplifyapp.com` URL immediately.

**Option B — Connect a Git repo (recommended for ongoing edits)**
1. Push this folder to a GitHub/GitLab repo.
2. AWS Console → Amplify → **Create new app** → **Host web app** → connect the repo/branch.
3. Amplify auto-detects `amplify.yml` and deploys on every push — this makes future edits (like adding blog posts) a `git push` away.

**Custom domain (gekjr.pro)**
1. In the Amplify app → **Domain management** → **Add domain** → enter `gekjr.pro`.
2. Amplify gives you DNS records (usually a CNAME or ALIAS + verification records).
3. Log into wherever `gekjr.pro`'s DNS is managed (check your Wix/wocode.com account, or your registrar if DNS was moved elsewhere) and update the records Amplify gives you.
4. DNS propagation is usually 15 min–48 hrs. Amplify auto-provisions the SSL cert once it verifies.

**Adding a new blog post later**
1. Duplicate any file in `posts/` as a starting template.
2. Update the `<title>`, date, and body content.
3. Add a matching `<a class="post-card">` block to `insights.html` (and optionally `index.html`'s "Recent insights" section).
