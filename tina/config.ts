import { defineConfig } from "tinacms";

export default defineConfig({
  // Für lokale Entwicklung (kein Token nötig)
  // Für Produktion: clientId + token von app.tina.io eintragen
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",   // generiert public/admin (wird durch Decap CMS-Ordner nicht überschrieben)
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images/news",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ── Neuigkeiten ────────────────────────────────────────
      {
        name: "news",
        label: "Neuigkeiten",
        path: "data",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          defaultItem: () => ({
            items: [],
          }),
        },
        match: { include: "news" },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Neuigkeiten",
            list: true,
            ui: {
              itemProps: (item: any) => ({
                label: item?.title ? `${item.title} (${item.dateDisplay ?? ""})` : "Neue Neuigkeit",
              }),
            },
            fields: [
              { type: "string",   name: "id",          label: "ID (eindeutig)" },
              { type: "string",   name: "title",        label: "Überschrift" },
              { type: "string",   name: "dateDisplay",  label: 'Datum (Anzeige)', description: 'z.B. "15. Mai 2025"' },
              { type: "datetime", name: "date",          label: "Datum (intern)" },
              { type: "string",   name: "text",          label: "Text", ui: { component: "textarea" } },
              {
                type: "object",
                name: "images",
                label: "Bilder",
                list: true,
                fields: [
                  { type: "image",  name: "src", label: "Bild" },
                  { type: "string", name: "alt", label: "Bildbeschreibung" },
                ],
              },
            ],
          },
        ],
      },

      // ── fussball.de Konfiguration ───────────────────────────
      {
        name: "fussball",
        label: "Fussball.de Widgets",
        path: "data",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        match: { include: "fussball" },
        fields: [
          {
            type: "string",
            name: "seasonEnd",
            label: "Saisonende (YYYY-MM-DD)",
            description: "z.B. 2026-06-30 — ab diesem Datum wird die Saisonende-Meldung angezeigt",
          },
          {
            type: "string",
            name: "seasonEndMessage",
            label: "Saisonende-Nachricht",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "clubMatchesWidget",
            label: "Vereins-Widget ID (alle Mannschaften)",
          },
        ],
      },
    ],
  },
});
