import json
import os
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

BASE_URL = 'https://sg-fussball.online'
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
INPUT_PATH = os.path.join(DATA_DIR, 'all_subpages_data.json')
OUTPUT_PATH = os.path.join(DATA_DIR, 'spa_pages.json')

with open(INPUT_PATH, encoding='utf-8') as f:
    pages = json.load(f)

clean_pages = []
seen_routes = set()

for page in pages:
    path = page['path']
    if path.lower().endswith(('.pdf', '.ics')):
        continue
    if '/.cm4all/' in path:
        continue
    if 'index.php' in path:
        continue
    if path == '/Startseite':
        path = '/'

    normalized = path.strip('/').lower() or 'home'
    if normalized in seen_routes:
        continue
    seen_routes.add(normalized)

    soup = BeautifulSoup(page['html'], 'html.parser')
    for script in soup(['script', 'noscript', 'style']):
        script.decompose()
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('#'):
            continue
        if href.startswith('mailto:') or href.startswith('tel:'):
            continue
        target = urljoin(BASE_URL, href)
        parsed = urlparse(target)
        if parsed.netloc == urlparse(BASE_URL).netloc:
            route = parsed.path.strip('/').lower() or 'home'
            a['href'] = f'#{route}'
            a['data-internal'] = 'true'
        else:
            a['target'] = '_blank'
            a['rel'] = 'noopener noreferrer'
    for img in soup.find_all('img', src=True):
        img['src'] = urljoin(BASE_URL, img['src'])
        img['loading'] = 'lazy'

    title = page['title'] or normalized.replace('-', ' ').title()
    clean_pages.append({
        'id': normalized,
        'path': path,
        'title': title,
        'html': str(soup),
    })

with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(clean_pages, f, ensure_ascii=False, indent=2)
print('Wrote', OUTPUT_PATH, 'with', len(clean_pages), 'pages')
