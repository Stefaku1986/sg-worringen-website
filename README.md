# SG Köln-Worringen – Fußball

Website der Fußballabteilung der SG Köln-Worringen: **[www.sg-fussball.online](https://www.sg-fussball.online)**

Gebaut mit [Astro](https://astro.build) als statische Seite, gehostet **kostenlos** auf GitHub Pages.
Jeder Push auf `main` baut und veröffentlicht die Seite automatisch – ein Deploy dauert rund zwei Minuten.

## Inhalte pflegen

Die Texte und Daten der Seite liegen als JSON-Dateien in `data/`. Wer hier etwas ändert und
committet, ändert die Website:

| Datei | Inhalt |
|---|---|
| `data/teams-config.json` | Mannschaften: Name, Trainer, Trainingszeiten, Reihenfolge im Menü |
| `data/players.json` | Kader und Trainerteam je Mannschaft (Spieler, Fotos, Rückennummern) |
| `data/news.json` | Neuigkeiten auf der Startseite und unter „Neuigkeiten" |
| `data/fussball.json` | Einbindung der fussball.de-Widgets (Tabellen, Spielpläne) |
| `data/spa_pages.json` | Fließtext der Unterseiten (aus der alten Website übernommen) |

Bilder liegen unter `public/images/`. Ein Bild, das in `players.json` als
`"image": "U15_Stefan_und_Paffi/Trainer_Stefan_Kuehl.jpeg"` steht, wird unter
`public/images/content/U15_Stefan_und_Paffi/Trainer_Stefan_Kuehl.jpeg` gesucht.

> **Wichtig:** Jede Mannschaft braucht einen eigenen, eindeutigen `slug` in `teams-config.json` –
> daraus entsteht die URL (`/kaderuebersicht/<slug>/`). Zwei Teams mit demselben Slug
> überschreiben sich gegenseitig, und eine der beiden Seiten verschwindet.

## Lokal entwickeln

```bash
npm install
npm run dev
```

Die Vorschau läuft dann auf http://localhost:4321.

| Befehl | Wirkung |
|---|---|
| `npm run dev` | Lokaler Server mit Live-Vorschau |
| `npm run build` | Baut die fertige Seite nach `dist/` |
| `npm run preview` | Zeigt das gebaute Ergebnis lokal an |

## Projektstruktur

```
src/
  pages/        Jede Datei = eine Seite der Website
  layouts/      Gemeinsames Grundgerüst aller Seiten
  components/   Header, Footer, Spielerkarte
  styles/       Zentrales Stylesheet
data/           Inhalte als JSON (siehe oben)
public/         Bilder, Logo, Dokumente – wird unverändert ausgeliefert
docs/           Anleitungen (z. B. Einrichtung der Trainer-E-Mails)
```

## Technisches

- **Domain:** `sg-fussball.online`, registriert bei Strato. Dort sind nur die DNS-Einträge
  und die E-Mail-Postfächer hinterlegt – die Website selbst liegt auf GitHub Pages.
- **Deployment:** `.github/workflows/deploy.yml`
- **Astro-Konfiguration:** `astro.config.mjs`
