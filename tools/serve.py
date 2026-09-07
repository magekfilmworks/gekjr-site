#!/usr/bin/env python3
"""Serve the site the way Amplify does, so clean URLs work locally.

Internal links are root-relative (/about, /posts/show-callers), which the
filesystem cannot resolve — opening index.html and clicking a post goes
nowhere. This applies the same rewrite table Amplify is configured with,
so what you see here is what the live site does.

    python3 tools/serve.py            # serves ./ on 8787
    python3 tools/serve.py . 8788     # a second site, alongside the first

8787 rather than 8000: a working machine usually has something on 8000,
8080 or 3000 already, and the clash surfaces as "Address already in use"
here and "refused to connect" in the browser — two opposite-sounding
errors for one cause. `pkill -f serve.py` clears strays.

It walks subdirectories, so /posts/<slug> resolves the same way /about
does. The previous version globbed the top level only, which meant every
post 404'd locally while working fine in production — the worst kind of
preview, because it disagrees with the live site in one direction only.

The table is generated from the files on disk, so a new page or post is
covered the moment it exists. The Amplify Console is the copy that still
has to be updated by hand; tools/shortlinks.py prints that block.
"""
import http.server, pathlib, socketserver, sys

ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8787

SKIP = {'.git', 'node_modules', '__MACOSX', 'tools'}


def pages(root):
    """Every .html file worth a clean URL, at any depth."""
    for p in sorted(root.rglob('*.html')):
        rel = p.relative_to(root)
        if any(part in SKIP or part.startswith('.') for part in rel.parts):
            continue
        yield rel


REWRITES = {'/': '/index.html'}
for rel in pages(ROOT):
    if rel.as_posix() == 'index.html':
        continue
    REWRITES['/' + rel.as_posix()[:-len('.html')]] = '/' + rel.as_posix()


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split('?', 1)[0].split('#', 1)[0]
        if clean in REWRITES:
            path = REWRITES[clean]
        return super().translate_path(path)

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    import os
    os.chdir(ROOT)
    print(f'serving {ROOT} on http://localhost:{PORT}')
    top = sorted(k for k in REWRITES if k.count('/') <= 1)
    for src in top:
        print(f'  {src:12} -> {REWRITES[src]}')
    nested = len(REWRITES) - len(top)
    if nested:
        print(f'  ...and {nested} more under subfolders (posts, etc.)')
    print('')
    print('  Ctrl-C to stop. Leave this window alone while it runs —')
    print('  anything typed here is swallowed until the server exits.')
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        httpd.serve_forever()
