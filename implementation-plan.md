# Implementierungsplan – SG Köln-Worringen Website

> **Verantwortlich:** Stefan Kühl (Abteilungsleiter)  
> **Erstellt:** 25.05.2026  
> **Letzte Aktualisierung:** 25.05.2026

---

## Status-Legende

- ⬜ Offen
- 🔄 In Arbeit
- ✅ Erledigt
- ⏭️ Übersprungen

---

## Phase 1: News-Daten strukturieren

### 1.1 ✅ News-JSON erstellen (`data/news.json`) — 22 Einträge, 117 Bilder
- Alle News-Beiträge aus `content/Startseite/Startseite.md` extrahieren
- Felder pro Eintrag: `id`, `date`, `title`, `text`, `images[]`
- Bilder-URLs aus `assets/assets.md` den jeweiligen Beiträgen zuordnen
- Chronologisch sortiert (neueste zuerst)

### 1.2 ✅ Startseite News-Sektion aktualisieren — 3 neueste News-Karten dynamisch aus news.json
- `src/pages/index.astro`: News aus `data/news.json` laden
- Die neuesten 3 News als Feature-Karten anzeigen (Bild + Titel + Teaser)
- "Alle News lesen" → Link zu `/unser-verein/neuigkeiten/`

### 1.3 ✅ Neuigkeiten-Seite neu aufbauen — 22 Einträge mit Bildgalerien, saubere Astro-Komponente
- Eigene Astro-Seite `src/pages/unser-verein/neuigkeiten.astro` erstellen
- Weg vom `set:html` CMS-Dump → saubere Astro-Komponenten
- Alle News-Einträge aus `data/news.json` rendern
- Pro Eintrag: Datum-Badge, Titel (H3), Text, Bildgalerie
- Trennlinien zwischen Beiträgen

---

## Phase 2: Startseite Content vervollständigen

### 2.1 ✅ Startseite: Fehlende Bereiche aus Original ergänzen — Vereinsshop-Banner + Instagram-Link
- Vergleich `content/Startseite/Startseite.md` mit aktuellem `index.astro`
- Prüfen: Vereinsshop-Banner, Instagram-Link, Spieler-gesucht-Banner
- Probetraining-CTA überprüfen

### 2.2 ✅ Startseite: Hero-Bereich aktualisieren — beibehalten (guter Content "seit 1971")
- Aktuellen Hero-Text prüfen (1. Mannschaft Neustart erwähnen?)
- CTA-Buttons überprüfen

---

## Phase 3: Unterseiten-Content aktualisieren

### 3.1 ✅ Abteilungsleitung-Seite aus MD neu aufbauen — 6 Profil-Karten, Stefan Kühl als Leiter
- Content aus `content/Unser-Verein/Unser-Verein_Unser-Abteilungsleitung.md`
- Stefan Kühl = Abteilungsleiter (mit Kontaktdaten)
- Eugenio Siddi, Michael Paffendorf, Stefanie Paffendorf
- Sauberes Layout mit Profil-Karten

### 3.2 ✅ "Der Verein"-Seite prüfen — Vereinsbeschreibung mit Sportanlage-Features
- Content aus `content/Unser-Verein/Unser-Verein_Der-Verein.md`

### 3.3 ✅ Platzwart-Seite prüfen — Foto-Galerie mit 10 Bildern
- Content aus `content/Unser-Verein/Unser-Verein_Unser-Platzwart.md`

### 3.4 ✅ Schiedsrichter-Seite prüfen — Paul Kühl Steckbrief mit Karriere-Timeline
- Content aus `content/Unser-Verein/Unser-Verein_Schiedrichter.md`

### 3.5 ✅ BABA-Seite prüfen — Umbau-Galerie + Kontakt Michael Paffendorf
- Content aus `content/Unser-Verein/Unser-Verein_Unsere-BABA.md`

### 3.6 ✅ Unsere Anlage prüfen — Sportanlage am Erdweg mit 3 Feature-Karten
- Content aus `content/Unser-Verein/Unser-Verein_Unsere-Anlage.md`

### 3.7 ✅ Vereinsgeschichte prüfen — Timeline 1927–heute mit 4 historischen Fotos
- Content aus `content/Unser-Verein/Unser-Verein_Vereinsgeschichte.md`

### 3.8 ✅ Anfahrt-Seite prüfen — Karte + Anfahrtsbeschreibung Auto/ÖPNV
- Content aus `content/Unser-Verein/Unser-Verein_Anfahrt.md`

### 3.9 ✅ Impressum prüfen — Stefan Kühl als Verantwortlicher, Datenschutz aktualisiert
- Content aus `content/Impressum/Impressum.md`

---

## Phase 4: Kaderseiten prüfen

### 4.1 ✅ Kaderübersicht-Hauptseite prüfen — 12 Mannschaften verlinkt, alle Seiten vorhanden
- Alle Mannschaften korrekt verlinkt?

### 4.2 ✅ Einzelne Mannschaftsseiten stichprobenartig prüfen — 3 Seiten geprüft, 21 Fixes
- C-Junioren 2011 (viel Content + Spielberichte)
- Alte Herren
- Bambini 2018 (Spielerlisten)
- Bilder laden korrekt?

---

## Phase 5: Navigation erweitern

### 5.1 ✅ Dropdown-Menü für Header — Desktop-Hover + Mobile-Accordion
- "Unser Verein" → Untermenü mit allen Unterseiten
- "Kaderübersicht" → Untermenü mit Mannschaften
- "Mitmachen" → Untermenü mit Unterseiten
- Mobil: Accordion-Stil

---

## Phase 6: Bilder lokal sichern

### 6.1 ✅ Bilder-Download-Script erstellen — 445 Bilder heruntergeladen
- Alle URLs aus `data/news.json`, `data/spa_pages.json` und `.astro`-Dateien gesammelt (490 unique)
- In `public/images/content/` nach Originalstruktur gespeichert
- picture-200 → picture-800 für bessere Qualität
- 45 Bilder waren auf dem Server bereits nicht mehr verfügbar (404)

### 6.2 ✅ Bild-URLs ersetzen — Alle cm4all-URLs durch lokale Pfade ersetzt
- `data/news.json`: 115 URLs ersetzt (ohne Base-Prefix, Astro-Templates fügen `${base}` hinzu)
- `data/spa_pages.json`: 391 URLs ersetzt (mit `/sg-worringen-website/` Prefix für `set:html`)
- `.astro`-Dateien: 27 URLs ersetzt (mit `${base}` Template-Literal)
- `neuigkeiten.astro` und `index.astro`: `img.src` → `${base}${img.src}` angepasst

---

## Phase 7: Meta & SEO

### 7.1 ✅ Meta-Descriptions pro Seite — 12 individuelle Beschreibungen + Catch-All-Fallback
- "Platz für Ihren Slogan" ersetzen durch individuelle Beschreibungen

### 7.2 ✅ OpenGraph-Tags — og:title/description/image/url + Twitter Cards
- og:title, og:description, og:image pro Seite

---

## Phase 8: Fehlende Features

### 8.1 ✅ Probetraining-Kontaktformular — Formspree-basiertes Kontaktformular
- Statisches Formular (Formspree / Netlify Forms)
- Felder: Name, Alter, Position, Kontakt, Nachricht

### 8.2 ✅ Downloads-Seite — Platzhalter-Seite mit Kontakt-Hinweis (PDFs noch nicht migriert)
- PDF-Formulare verfügbar machen

### 8.3 ✅ Gästebuch — Platzhalter mit Instagram-Link
- Platzhalter oder externe Lösung

### 8.4 ✅ Onlineshop-Link — Dedizierte Seite mit JAKO-Shop-Link
- Verweis auf Team.Jako.com korrekt?

---

## Phase 9: Go-Live

### 9.1 ✅ Alle Seiten gegen MD-Content prüfen — 36 Seiten, Build OK, keine Fehler, alle 15 dedizierten Seiten vorhanden, keine externen Bild-URLs, Meta-Tags korrekt
### 9.2 ✅ GitHub Pages wieder aktivieren — GitHub Actions Workflow erstellt
### 9.3 ⬜ Custom Domain `sg-fussball.online` einrichten
### 9.4 ⬜ SSL-Zertifikat prüfen

---

## Notizen

- **Verantwortungswechsel:** Stefan Kühl ist seit 01.06.2025 Abteilungsleiter (vorher Markus Kremp)
- **Bilder-Risiko:** Alle Bilder laden aktuell von `sg-fussball.online` — Phase 6 ist kritisch falls der alte Server abgeschaltet wird
- **index.php-Duplikate:** Viele Seiten existieren doppelt als `/Seite/` und `/Seite/index.php/` — nur die saubere URL-Variante verwenden
