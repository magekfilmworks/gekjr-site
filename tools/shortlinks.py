#!/usr/bin/env python3
"""Print the Amplify rewrites-and-redirects block for gekjr.pro.

    python3 tools/shortlinks.py            # live site
    python3 tools/shortlinks.py --splash   # holding page on the front door
    python3 tools/shortlinks.py --check    # validate only, no output

WHAT THIS REPLACES

Every clean URL on this site — /about, /posts/show-callers — needs an
explicit rewrite rule in the Amplify Console, and the Console is the one
copy that cannot be generated. Nine pages and nine posts is eighteen
lines to keep in step by hand, and the failure is invisible: a post
without a rule 404s only for people who follow the link.

So the block is generated from the files on disk. Add a post, run this,
paste what it prints. Nothing to deploy — these rules live in the
Console, not in the site.

WHY NOT A SHORTENER SERVICE

For /v/<slug> links: a shortener is a lookup table and a redirect, and
Amplify already does both. No Lambda, no DynamoDB, nothing to run, bill
or monitor. The cost is re-pasting the block when a link is added, which
is what this script makes cheap.
"""
import json
import pathlib
import re
import sys
import urllib.parse

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent

SPLASH = '--splash' in sys.argv
CHECK = '--check' in sys.argv

SKIP = {'.git', 'node_modules', '__MACOSX', 'tools'}

# The holding page, and the real homepage it stands in front of. Both
# ship at all times: splash mode is a Console paste, never a file
# rename. Renaming index.html is how this site did it before, and it has
# two costs — the real homepage is then only reachable at an ugly URL,
# and turning the splash off needs a deploy rather than a paste.
SPLASH_PAGE = 'splash.html'
NOT_A_PAGE = {'index-REAL-HOMEPAGE.html'}


def pages():
    """Every .html file that should answer at a clean URL."""
    out = []
    for p in sorted(ROOT.rglob('*.html')):
        rel = p.relative_to(ROOT)
        if any(part in SKIP or part.startswith('.') for part in rel.parts):
            continue
        if rel.name in NOT_A_PAGE:
            continue
        out.append(rel.as_posix())
    return out


links = []
data_file = ROOT / 'shortlinks.json'
if data_file.exists():
    links = json.loads(data_file.read_text()).get('links', [])

all_pages = pages()
stems = {p[:-len('.html')] for p in all_pages}

problems = []   # fatal: the block would be wrong
warnings = []   # suspicious, but only the target can settle it
seen = set()
SLUG = re.compile(r'^[a-z0-9][a-z0-9-]*$')

for link in links:
    slug, target = link.get('slug', ''), link.get('target', '')

    if not SLUG.match(slug):
        problems.append(f'{slug!r}: slug must be lowercase letters, digits '
                        f'and hyphens')
    if slug in seen:
        problems.append(f'{slug!r}: duplicate slug — the first one wins and '
                        f'the second is dead')
    seen.add(slug)

    # /v/ is its own namespace, so a slug cannot shadow a page. Checked
    # anyway: if the prefix is ever dropped, this is what catches it.
    if slug in stems:
        problems.append(f'{slug!r}: same name as the page {slug}.html')

    if not target.startswith('https://'):
        problems.append(f'{slug!r}: target must be an absolute https URL')

    # In a URL path "+" is a literal plus; it only means a space inside a
    # query string. An S3 key with real spaces needs %20, and a link
    # carrying "+" instead 404s in a way that looks like a permissions
    # problem. A warning, not an error: a key can legitimately contain a
    # plus and only the bucket knows which case this is.
    if '+' in urllib.parse.urlsplit(target).path:
        warnings.append(
            f'{slug!r}: target path contains "+". If the key really has '
            f'spaces this must be %20 — "+" is a literal plus in a path.')

    if ' ' in target:
        problems.append(f'{slug!r}: target contains a raw space — encode it')

if not (ROOT / SPLASH_PAGE).exists():
    problems.append(f'{SPLASH_PAGE} is missing — splash mode has nothing '
                    f'to serve')

if problems:
    print('FAIL')
    for p in problems:
        print('  ' + p)
    sys.exit(1)

for w_ in warnings:
    print(f'warning: {w_}', file=sys.stderr)
if warnings:
    print('', file=sys.stderr)

if CHECK:
    print(f'{len(all_pages)} page(s), {len(links)} short link(s) OK'
          + (f'; {len(warnings)} warning(s)' if warnings else ''))
    sys.exit(0)

# Order is written, not inherited from the directory listing: the root
# leads, then the top-level pages, then the posts, then the links.
# Amplify does not care; the person reading this block in a Console field
# at 1am does.
rules = []
front = f'/{SPLASH_PAGE}' if SPLASH else '/index.html'
rules.append(('/', '200', front))
if SPLASH:
    # The real homepage stays reachable while the front door is held.
    # A known path, not a secret one.
    rules.append(('/home', '200', '/index.html'))

top = sorted(p for p in all_pages
             if '/' not in p and p not in ('index.html', SPLASH_PAGE))
nested = sorted(p for p in all_pages if '/' in p)

for page in top + nested:
    rules.append(('/' + page[:-len('.html')], '200', '/' + page))

# 302, not 301: a permanent redirect is cached by browsers effectively
# forever, so a mistyped target would follow people around long after it
# was fixed. These point at storage that may be re-organised.
for link in links:
    rules.append((f'/v/{link["slug"]}', '302', link['target']))

w = max(len(s) for s, _, _ in rules)
print('[')
for i, (src, status, target) in enumerate(rules):
    comma = '' if i == len(rules) - 1 else ','
    print(f'  {{ "source": "{src}",{" " * (w - len(src))} '
          f'"status": "{status}", "target": "{target}" }}{comma}')
print(']')

print(f'\n{len(rules)} rules — {len(rules) - len(links)} pages, '
      f'{len(links)} short link(s)'
      + ('   [SPLASH MODE]' if SPLASH else ''), file=sys.stderr)
for link in links:
    print(f'  gekjr.pro/v/{link["slug"]}   {link.get("label", "")}',
          file=sys.stderr)
