# SG-Worringen-E-Mail für Trainer einrichten

Jeder Trainer bekommt eine eigene Vereins-Adresse nach dem Muster:

> **vorname.nachname@sg-fussball.online**

Diese Anleitung erklärt, wie du sie nutzt – zum **Empfangen** (passiert automatisch) und
zum **Antworten als SG-Adresse** (einmalige Einrichtung).

---

## So funktioniert es (kurz erklärt)

- **Empfangen:** Deine SG-Adresse ist eine *Weiterleitung*. Alle Mails an
  `vorname.nachname@sg-fussball.online` landen automatisch in deinem **normalen privaten
  Postfach** (GMX, web.de, Gmail …). Du musst dafür **nichts** einrichten.
- **Senden:** Damit beim Antworten als Absender deine SG-Adresse erscheint (statt deiner
  privaten), fügst du die SG-Adresse einmalig als „zusätzliche Absenderadresse" in deinem
  Mail-Programm hinzu. Der Versand läuft dann über den Strato-Server des Vereins.

---

## Teil 1 – Empfangen ✅ (nichts zu tun)

Sobald der Verein deine Adresse eingerichtet hat, kommen Mails an
`vorname.nachname@sg-fussball.online` automatisch bei dir an. Fertig.

---

## Teil 2 – Als SG-Adresse antworten (einmalige Einrichtung)

### Diese Zugangsdaten brauchst du (beim Vorstand erfragen)

| Einstellung            | Wert                                            |
|------------------------|-------------------------------------------------|
| Postausgang (SMTP)     | `smtp.strato.de`                                |
| Port / Verschlüsselung | **465** mit SSL/TLS (Alternative: 587 STARTTLS) |
| Benutzername           | das **SG-Sammelpostfach** (z. B. `webmaster@sg-fussball.online`) |
| Passwort               | bekommst du von Stefan / dem Vorstand           |
| Absenderadresse (Von)  | **deine** `vorname.nachname@sg-fussball.online` |

> 🔒 **Wichtig:** Das Passwort gehört zum gemeinsamen SG-Postfach. Bitte sorgsam behandeln
> und nur auf deinen eigenen Geräten speichern.

---

### Variante A – Am einfachsten für alle: Strato Webmail

Funktioniert mit **jedem** privaten Anbieter, ohne Programm-Einrichtung.

1. Gehe auf **webmail.strato.de** und logge dich mit dem SG-Sammelpostfach ein.
2. Klicke auf **Neue E-Mail**.
3. Im Feld **Von / Absender** wähle deine `vorname.nachname@sg-fussball.online` aus.
4. Schreiben, senden – fertig. Der Empfänger sieht deine SG-Adresse.

*Tipp:* Lesen tust du wie gewohnt in deinem privaten Postfach (Weiterleitung). Nur zum
**Antworten als SG** gehst du kurz in die Webmail.

---

### Variante B – Komfortabel: festes Mail-Programm einrichten

So kannst du SG-Mails direkt aus deinem gewohnten Programm beantworten.

#### Apple Mail / iPhone / iPad
1. **Einstellungen → Mail → Accounts → Account hinzufügen → Andere → Mail-Account.**
2. Adresse: `vorname.nachname@sg-fussball.online`, Passwort: SG-Postfach-Passwort.
3. Posteingang (IMAP): `imap.strato.de` · Postausgang (SMTP): `smtp.strato.de`.
4. Benutzername jeweils: das SG-Sammelpostfach. Speichern.
   *(Alternativ am iPhone: nur die Absenderadresse unter „Erweitert → eigene Adresse" ergänzen.)*

#### Thunderbird (PC/Mac)
1. **Einstellungen → Konten-Einstellungen → Konten-Aktionen → Weitere Identität.**
2. Name + `vorname.nachname@sg-fussball.online` eintragen.
3. Als Postausgangsserver `smtp.strato.de` (Port 465, SSL/TLS, Login = SG-Postfach) wählen.

#### Outlook
1. **Datei → Kontoeinstellungen → Neu** (oder „Weitere Absenderadresse").
2. SMTP `smtp.strato.de`, Port 465 SSL, Anmeldung mit dem SG-Postfach.
3. Beim Schreiben oben unter **„Von"** die SG-Adresse auswählen.

#### Gmail (am Computer)
1. **Einstellungen (Zahnrad) → Alle Einstellungen → „Konten und Import".**
2. Bei **„Senden als" → „Weitere E-Mail-Adresse hinzufügen".**
3. Name + `vorname.nachname@sg-fussball.online`. Haken „Als Alias behandeln" **entfernen**.
4. SMTP: `smtp.strato.de`, Port 465, Login = SG-Postfach, **SSL**.
5. Gmail schickt einen **Bestätigungscode** an die SG-Adresse → er landet per Weiterleitung
   in deinem Posteingang → Code eingeben.
6. Beim Schreiben oben **„Von"** auf die SG-Adresse stellen.

---

## Wichtig zu wissen

- **GMX / web.de Webmail:** Diese erlauben im *Web-Login* in der Regel **keine** fremden
  Absender-Domains. Nutze dafür **Variante A (Strato Webmail)** oder ein Programm aus
  Variante B (Thunderbird/Apple Mail/Outlook/Gmail).
- **Nicht über den eigenen Anbieter „faken":** Schicke SG-Mails immer über `smtp.strato.de`.
  Wenn du die SG-Adresse als Absender über deinen privaten Anbieter verschickst, landen die
  Mails beim Empfänger oft im **Spam** (technische Prüfung SPF/DMARC schlägt fehl).

---

## Häufige Fragen

**Muss ich etwas tun, damit ich Mails empfange?**
Nein. Die Weiterleitung läuft automatisch in dein privates Postfach.

**Sehen andere Trainer meine Mails?**
Eingehende Mails gehen nur an dich (deine Weiterleitung). Beim Versand nutzen alle Trainer
dasselbe SG-Postfach als Versand-Konto – Inhalte deiner privaten Mails bleiben aber bei dir.

**Ich will es ganz einfach.** → Variante A (Strato Webmail) reicht völlig.

---

*Bei Fragen: Stefan Kühl / Vorstand der Fußballabteilung SG Köln-Worringen.*
