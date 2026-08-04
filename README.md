# gekjr.pro — static rebuild

Plain HTML/CSS/JS. No build step, no dependencies to install.

## File map
- `index.html`, `about.html`, `insights.html`, `photos.html`, `contact.html`
- `posts/*.html` — one file per blog post
- `css/style.css` — all styling / design tokens
- `js/main.js` — nav toggle + contact form UI
- `amplify.yml` — Amplify Hosting build spec (no-op build, just deploys the files)

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
# gekjr_site_preview
