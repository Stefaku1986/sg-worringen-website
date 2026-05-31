import json
import os

path = os.path.join(os.path.dirname(__file__), '..', 'data', 'all_subpages_data.json')
with open(path, encoding='utf-8') as f:
    pages = json.load(f)

print('count', len(pages))
for p in pages[:10]:
    print(p['path'], repr(p['title'])[:80], len(p['html']))
print('---')
print('paths with pdf or ics:')
for p in pages:
    if p['path'].lower().endswith(('.pdf', '.ics')):
        print(p['path'])
print('---')
print('sample paths and image counts:')
for p in pages[:20]:
    print(p['path'], 'img', len(p['images']))
