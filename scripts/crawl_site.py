import json
import os
import re
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = 'https://sg-fussball.online'
START_URL = BASE_URL + '/'
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

os.makedirs(OUTPUT_DIR, exist_ok=True)

session = requests.Session()
visited = set()
queue = [START_URL]
pages = []

while queue:
    url = queue.pop(0)
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        continue
    if url in visited:
        continue
    visited.add(url)
    print('Fetching', url)
    try:
        r = session.get(url, timeout=20)
        r.raise_for_status()
    except Exception as exc:
        print('Failed', url, exc)
        continue

    soup = BeautifulSoup(r.text, 'html.parser')
    page_title = soup.title.string.strip() if soup.title else ''
    meta_desc = ''
    if soup.find('meta', attrs={'name': 'description'}):
        meta_desc = soup.find('meta', attrs={'name': 'description'}).get('content', '').strip()
    main_content = ''
    if soup.find('main'):
        main_content = str(soup.find('main'))
    elif soup.find(class_='main_wrapper'):
        main_content = str(soup.find(class_='main_wrapper'))
    else:
        main_content = str(soup.body)

    # collect image urls in main content
    images = []
    for img in BeautifulSoup(main_content, 'html.parser').find_all('img'):
        src = img.get('src') or ''
        if src:
            images.append(urljoin(url, src))

    pages.append({
        'url': url,
        'path': parsed.path.rstrip('/') or '/',
        'title': page_title,
        'description': meta_desc,
        'html': main_content,
        'images': images,
    })

    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('javascript:'):
            continue
        if href.startswith('#'):
            continue
        full = urljoin(url, href)
        full_parsed = urlparse(full)
        if full_parsed.netloc != urlparse(BASE_URL).netloc:
            continue
        norm = full_parsed._replace(query='', fragment='').geturl()
        if norm not in visited and norm not in queue:
            queue.append(norm)

print('Total pages', len(pages))
with open(os.path.join(OUTPUT_DIR, 'all_subpages_data.json'), 'w', encoding='utf-8') as f:
    json.dump(pages, f, ensure_ascii=False, indent=2)
print('Saved to', os.path.join(OUTPUT_DIR, 'all_subpages_data.json'))
