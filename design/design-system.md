# Design System

## Übersicht

Die Website der SG Köln-Worringen ist als klassische Vereinsseite aufgebaut und verwendet ein responsives Layout mit einem sichtbaren Header, klarem Hauptmenü und einem Content-Bereich, der vor allem aus Textblöcken, News-Karten und Bildgalerien besteht.

## Layout

- Fixes, zentriertes Layout mit klarer struktureller Hierarchie.
- Header mit Hauptnavigation und mobilem Menü-Icon (Menu Toggle).
- Content-Bereich mit vertikal gestapelten Abschnitten und News-Feeds.
- Bildgalerien in Reihen/Slidern, die als responsive Karten dargestellt werden.

## Navigation

- Hauptnavigation enthält die Bereiche: Startseite, Unser Verein, Kaderübersicht, Mitmachen, Fundgrube, Gästebuch, Onlineshop, Impressum.
- Es gibt eine mobile Menüsteuerung; der Header ist im DOM als `header` mit relativer Positionierung implementiert.

## Typografie

- Deutsche Inhalte mit starken Betonungen auf Verein, Gemeinschaft, Jugend und Training.
- Überschriften werden in H1/H2/H3 strukturiert; Fließtext in Absätzen klar getrennt.

## Komponenten

- Hero / Key Visual Bereich mit großem Bild, Vereinsclaim und CTA.
- News-Posts mit Datum, Titel und kurzem Teaser-Text.
- Einfache Listenelemente für Veranstaltungen, Aktionen und Hinweise.
- Kontakt- und Infoblöcke mit E-Mail-Adressen und Adressdaten.

## Medien & Assets

- Bildpfade werden über .cm4all/uproc.php bereitgestellt.
- Viele Grafiken nutzen kleine Thumbnails und Instagram-/WhatsApp-Bilder.

## CMS / Hosting

- Die Seite basiert auf Strato / CM4all-basierten Seiten, vermutlich mit einem statischen CMS-Editor.
- Meta-Description-Felder werden als Platzhalter (`Platz für Ihren Slogan`) eingesetzt.
