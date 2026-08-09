# SG Köln-Worringen – Fußball

Website der Fußballabteilung der SG Köln-Worringen: **[www.sg-fussball.online](https://www.sg-fussball.online)**

Gebaut mit [Astro](https://astro.build) als statische Seite, gehostet **kostenlos** auf GitHub Pages.
Jeder Push auf `main` baut und veröffentlicht die Seite automatisch – ein Deploy dauert rund zwei Minuten.

## Inhalte pflegen

Inhalte werden als **Markdown** gepflegt – normaler Text, keine HTML-Tags. Wer hier etwas
ändert und committet, ändert die Website:

| Wo | Inhalt |
|---|---|
| `src/content/teams/<slug>.md` | **Eine Datei je Mannschaft** – siehe unten |
| `src/content/pages/….md` | **Eine Datei je Seite.** Der Dateiname ist die Adresse: `pages/fundgrube/gefunden-verloren.md` → `/fundgrube/gefunden-verloren/` |
| `data/news.json` | Neuigkeiten auf der Startseite und unter „Neuigkeiten" |
| `data/site.json` | Gilt für den ganzen Verein: Saison, Positionskürzel, Vereins-Widget |

Jede Datei besteht aus zwei Teilen: oben zwischen zwei `---`-Zeilen die **Angaben**
(Name, Trainer, Zeiten …), darunter **freier Text**. Der Textteil versteht Markdown:

```markdown
## Eine Überschrift

Ein Absatz mit **fettem Text** und einem [Link](/fundgrube/).

- Ein Aufzählungspunkt
- Noch einer

![Bildunterschrift](/images/content/sonstiges/beispiel.jpg)
```

> **Tippfehler werden bemerkt:** Schreibst du versehentlich `trianer:` statt `trainer:`,
> bricht der Build mit einer klaren Meldung ab und nennt Datei und Feld. Die Website geht
> dadurch nie mit halben Daten online. Welche Felder erlaubt sind, steht in
> `src/content/config.ts`.

### Eine Mannschaft pflegen

Alles zu einer Mannschaft steht in **einer einzigen Datei** unter `src/content/teams/`,
benannt nach ihrem Slug – zum Beispiel `src/content/teams/2011.md` für die U16:

| Feld | Bedeutung |
|---|---|
| `order` | Reihenfolge im Menü und in der Mannschaftsliste |
| `displayName`, `navLabel` | Überschrift der Seite bzw. Beschriftung im Menü |
| `trainer`, `trainingDays`, `trainingTime` | Angaben für Trainingsplan und Übersicht |
| `trainingTimes` | Mehrere Trainingseinheiten (für den Wochenplan) |
| `fussballDe` | Liga und Widget-Kennungen für Tabelle und Spielplan |
| `staff` | Trainerteam mit Foto, Telefon, E-Mail, Lizenz |
| `players` | Kader mit Rückennummer, Position und Foto |

Die Adresse `/kaderuebersicht/2011/` ergibt sich aus dem **Dateinamen** – sie muss nicht
zusätzlich eingetragen werden.

**Eine neue Mannschaft anlegen:** eine neue Datei in `src/content/teams/` ablegen. Menüpunkt,
Eintrag in der Mannschaftsliste und die eigene Kaderseite entstehen daraus automatisch –
es muss an keiner weiteren Stelle etwas eingetragen werden. `staff` und `players` dürfen
leer (`[]`) bleiben; die Seite zeigt dann „Kader wird noch erfasst".

**Eine neue Seite anlegen:** eine Datei in `src/content/pages/` ablegen – der Pfad wird
zur Adresse. Soll sie im Menü erscheinen, den Eintrag in `src/components/Header.astro`
ergänzen.

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
  content/
    teams/      eine Markdown-Datei je Mannschaft
    pages/      eine Markdown-Datei je Seite
    config.ts   welche Felder erlaubt sind (Prüfung beim Bauen)
  pages/        Seitenvorlagen (Layout, nicht Inhalt)
  layouts/      Gemeinsames Grundgerüst aller Seiten
  components/   Header, Footer, Spielerkarte
  lib/teams.ts  liest src/content/teams/ ein
  styles/       Zentrales Stylesheet
data/
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
