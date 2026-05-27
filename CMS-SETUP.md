# CMS Setup – SG Köln-Worringen

Zwei CMS-Systeme zum Vergleich. Beide bearbeiten dieselben JSON-Dateien und committen via GitHub.

---

## Option A: Sveltia CMS (Decap-basiert)
**URL nach Setup:** `https://www.sg-fussball.online/admin/`  
**Lokal:** `http://localhost:4321/sg-worringen-website/admin/`

### Einmalige Einrichtung (einmalig, ~10 Minuten)

#### 1. GitHub OAuth App erstellen
1. Gehe zu: https://github.com/settings/developers
2. Klick auf **"New OAuth App"**
3. Fülle aus:
   - **Application name:** `SG Worringen CMS`
   - **Homepage URL:** `https://stefaku1986.github.io/sg-worringen-website`
   - **Authorization callback URL:** `https://sveltia-cms-auth.stefaku1986.workers.dev`
4. Klick **"Register application"**
5. Kopiere die **Client ID** (du siehst sie sofort)
6. Klick auf **"Generate a new client secret"** → kopiere das **Client Secret**

#### 2. Cloudflare Worker als OAuth-Proxy einrichten (kostenlos)
1. Gehe zu https://workers.cloudflare.com → Account erstellen (kostenlos)
2. Klick **"Create a Worker"** → Namen eingeben: `sveltia-cms-auth`
3. Ersetze den Worker-Code mit dem Inhalt von:
   https://raw.githubusercontent.com/sveltia/sveltia-cms-auth/main/src/worker.js
4. Gehe zu **Settings → Variables** und füge hinzu:
   - `GITHUB_CLIENT_ID` = deine Client ID von Schritt 1
   - `GITHUB_CLIENT_SECRET` = dein Client Secret von Schritt 1
5. Klick **Save and Deploy**
6. Der Worker-URL lautet: `https://sveltia-cms-auth.DEIN-SUBDOMAIN.workers.dev`

#### 3. config.yml aktualisieren
Öffne `public/admin/config.yml` und ersetze:
```yaml
app_id: DEIN_GITHUB_OAUTH_CLIENT_ID
```
mit deiner echten Client ID.

Und füge die Worker-URL hinzu:
```yaml
backend:
  name: github
  repo: Stefaku1986/sg-worringen-website
  branch: main
  app_id: DEINE_CLIENT_ID
  auth_endpoint: https://sveltia-cms-auth.DEIN-SUBDOMAIN.workers.dev/auth
```

#### 4. Fertig!
Nach einem `git push` ist das CMS unter `/admin/` erreichbar.  
Login erfolgt mit deinem GitHub-Account.

---

## Option B: TinaCMS
**Lokal Admin:** `http://localhost:4321/tina/`  
**Cloud Admin:** `https://app.tina.io` (nach Registrierung)

### Lokal starten (funktioniert sofort, kein Account nötig)

```bash
# Im Projektordner:
npx tinacms dev -c "astro dev"
```

Dann öffne: http://localhost:4321/tina/

### Für Produktion (Änderungen von überall)

#### 1. TinaCMS Cloud Account
1. Gehe zu https://app.tina.io
2. Klick **"Get started for free"** (kostenlos bis 2 User)
3. Verbinde dein GitHub-Repository `Stefaku1986/sg-worringen-website`

#### 2. Environment Variables
Nach der Verbindung erhältst du **Client ID** und **Token**.  
Erstelle `.env` im Projektordner:
```
TINA_CLIENT_ID=deine_client_id
TINA_TOKEN=dein_token
```

#### 3. GitHub Actions anpassen
Füge in `.github/workflows/deploy.yml` die Secrets hinzu:
```yaml
env:
  TINA_CLIENT_ID: ${{ secrets.TINA_CLIENT_ID }}
  TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
```

Und in GitHub unter **Settings → Secrets** die beiden Werte eintragen.

---

## Was kann ich mit welchem CMS bearbeiten?

| Bereich | Sveltia CMS | TinaCMS |
|---------|-------------|---------|
| Neuigkeiten erstellen/bearbeiten | ✅ | ✅ |
| Bilder hochladen | ✅ | ✅ |
| Trainingszeiten ändern | ✅ | ✅ |
| fussball.de Widget-IDs | ✅ | ✅ |
| Saisonende-Datum | ✅ | ✅ |
| Visuelles Inline-Editing | ❌ | ✅ |
| Kein Account nötig (lokal) | ✅ | ✅ |
| Produktiv ohne Server | ✅ (nach OAuth) | ✅ (nach Cloud) |

---

## Wie funktioniert der Workflow?

1. Du öffnest das CMS (lokal oder online)
2. Du bearbeitest Inhalte (z.B. neue Neuigkeit)
3. CMS committet die Änderung automatisch zu GitHub
4. GitHub Actions baut die Seite neu (dauert ~2 Minuten)
5. Änderungen sind live auf `www.sg-fussball.online`
