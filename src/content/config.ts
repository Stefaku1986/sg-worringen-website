import { defineCollection, z } from 'astro:content';

/**
 * Beschreibt, welche Angaben eine Mannschaftsdatei enthalten darf.
 *
 * Astro prueft beim Bauen jede Datei in src/content/teams/ gegen diese
 * Vorgabe. Ein Tippfehler im Feldnamen oder eine fehlende Pflichtangabe
 * bricht den Build mit einer klaren Meldung ab – die Website geht dadurch
 * nie mit halben Daten online.
 *
 * Der Slug (und damit die Adresse /kaderuebersicht/<slug>/) ergibt sich
 * aus dem Dateinamen; er muss nicht zusaetzlich eingetragen werden.
 */

const trainingSlot = z.object({
  days: z.string(),
  from: z.string(),
  to: z.string(),
});

const person = z.object({
  name: z.string(),
  role: z.string(),
  position: z.string().default(''),
  number: z.number().nullable().default(null),
  image: z.string().nullable().default(null),
  since: z.union([z.string(), z.number()]).nullable().default(null),
  phone: z.string().default(''),
  email: z.string().default(''),
  qualification: z.string().default(''),
});

const player = z.object({
  name: z.string(),
  number: z.number().nullable().default(null),
  position: z.string().default(''),
  image: z.string().nullable().default(null),
});

const teams = defineCollection({
  type: 'content',
  schema: z.object({
    // Pflicht
    displayName: z.string(),
    order: z.number(),

    // Bezeichnungen
    uNumber: z.string().nullable().default(null),
    category: z.string().nullable().default(null),
    birthYear: z.union([z.string(), z.number()]).nullable().default(null),
    navLabel: z.string().nullable().default(null),
    categoryColor: z.string().nullable().default(null),

    // Training
    trainer: z.string().nullable().default(null),
    trainingDays: z.string().nullable().default(null),
    trainingTime: z.string().nullable().default(null),
    trainingTimes: z.array(trainingSlot).default([]),

    // fussball.de
    fussballDe: z
      .object({
        fussballDeUrl: z.string().optional(),
        league: z.string().optional(),
        tableWidget: z.string().optional(),
        teamMatchesWidget: z.string().optional(),
        // Auf true setzen, solange fuer diese Mannschaft kein Spielplan
        // vorliegt: Statt Tabelle und Spielen erscheint dann ein Hinweis.
        // Sobald die Staffeleinteilung steht, wieder auf false setzen
        // (oder die Zeile entfernen).
        seasonEnded: z.boolean().default(false),
      })
      .optional(),

    // Kader
    staff: z.array(person).default([]),
    players: z.array(player).default([]),
  }),
});

/**
 * Inhaltsseiten (Fundgrube, Mitmachen, …). Der Text steht als Markdown
 * unter dem Frontmatter – dort schreibt man normalen Fliesstext, keine
 * HTML-Tags.
 *
 * Die Adresse ergibt sich aus dem Dateinamen:
 *   src/content/pages/fundgrube/gefunden-verloren.md
 *     -> /fundgrube/gefunden-verloren/
 *
 * Unter "children" koennen Karten zu Unterseiten stehen; sie erscheinen
 * unterhalb des Textes.
 */
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    children: z
      .array(z.object({ title: z.string(), href: z.string() }))
      .default([]),
  }),
});

export const collections = { teams, pages };
