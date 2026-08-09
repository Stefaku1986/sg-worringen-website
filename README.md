# SG Köln-Worringen – Fußball

Website der Fußballabteilung der SG Köln-Worringen: **[www.sg-fussball.online](https://www.sg-fussball.online)**

Gebaut mit [Astro](https://astro.build) als statische Seite, gehostet **kostenlos** auf GitHub Pages.
Jeder Push auf `main` baut und veröffentlicht die Seite automatisch – ein Deploy dauert rund zwei Minuten.

## Inhalte pflegen

Die Texte und Daten der Seite liegen als JSON-Dateien in `data/`. Wer hier etwas ändert und
committet, ändert die Website:

| Wo | Inhalt |
|---|---|
| `src/pages/…astro` | **Eine Datei je Seite.** Der Text steht direkt darin – `unser-verein/anfahrt.astro` ist die Seite `/unser-verein/anfahrt/`. |
| `data/teams/<slug>.json` | **Eine Datei je Mannschaft** – siehe unten |
| `data/news.json` | Neuigkeiten auf der Startseite und unter „Neuigkeiten" |
| `data/site.json` | Gilt für den ganzen Verein: Saison, Positionskürzel, Vereins-Widget |

### Eine Mannschaft pflegen

Alles zu einer Mannschaft steht in **einer einzigen Datei** unter `data/teams/`, benannt
nach ihrem Slug – zum Beispiel `data/teams/2011.json` für die U16:

| Feld | Bedeutung |
|---|---|
| `slug` | Bestimmt die Adresse: `/kaderuebersicht/2011/`. Muss dem Dateinamen entsprechen. |
| `order` | Reihenfolge im Menü und in der Mannschaftsliste |
| `displayName`, `navLabel` | Überschrift der Seite bzw. Beschriftung im Menü |
| `trainer`, `trainingDays`, `trainingTime` | Angaben für Trainingsplan und Übersicht |
| `trainingTimes` | Mehrere Trainingseinheiten (für den Wochenplan) |
| `fussballDe` | Liga und Widget-Kennungen für Tabelle und Spielplan |
| `staff` | Trainerteam mit Foto, Telefon, E-Mail, Lizenz |
| `players` | Kader mit Rückennummer, Position und Foto |

**Eine neue Mannschaft anlegen:** eine neue Datei in `data/teams/` ablegen. Menüpunkt,
Eintrag in der Mannschaftsliste und die eigene Kaderseite entstehen daraus automatisch –
es muss an keiner weiteren Stelle etwas eingetragen werden. `staff` und `players` dürfen
leer (`[]`) bleiben; die Seite zeigt dann „Kader wird noch erfasst".

Bilder liegen unter `public/images/`. Ein Foto, das in der Mannschaftsdatei als
`"image": "U15_Stefan_und_Paffi/Trainer_Stefan_Kuehl.jpeg"` steht, wird unter
`public/images/content/U15_Stefan_und_Paffi/Trainer_Stefan_Kuehl.jpeg` gesucht.

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
  pages/        Jede Datei = eine Seite der Website (Text steht direkt darin)
  layouts/      Gemeinsames Grundgerüst aller Seiten
  components/   Header, Footer, Spielerkarte
  lib/teams.ts  liest data/teams/ ein
  styles/       Zentrales Stylesheet
data/
  teams/        eine Datei je Mannschaft
  site.json     vereinsweite Angaben
  news.json     Neuigkeiten
public/         Bilder, Logo, Dokumente – wird unverändert ausgeliefert
docs/           Anleitungen (z. B. Einrichtung der Trainer-E-Mails)
```

## Technisches

- **Domain:** `sg-fussball.online`, registriert bei Strato. Dort sind nur die DNS-Einträge
  und die E-Mail-Postfächer hinterlegt – die Website selbst liegt auf GitHub Pages.
- **Deployment:** `.github/workflows/deploy.yml`
- **Astro-Konfiguration:** `astro.config.mjs`
