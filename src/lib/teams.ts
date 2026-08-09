import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Laedt die Mannschaften aus src/content/teams/.
 *
 * Jede Mannschaft hat dort genau eine Markdown-Datei mit allem, was zu ihr
 * gehoert: Bezeichnung, Trainer, Trainingszeiten, fussball.de-Widgets und
 * Kader stehen im Frontmatter, darunter kann freier Text stehen.
 *
 * Eine neue Mannschaft anzulegen heisst: eine neue Datei ablegen – sie
 * erscheint dann automatisch im Menue, im Trainingsplan und bekommt ihre
 * eigene Kaderseite. Die Reihenfolge steuert das Feld "order", die Adresse
 * ergibt sich aus dem Dateinamen.
 *
 * Welche Felder erlaubt sind, steht in src/content/config.ts – Astro prueft
 * das beim Bauen.
 */

export type TeamEntry = CollectionEntry<'teams'>;

/** Frontmatter einer Mannschaft, ergaenzt um ihren Slug (= Dateiname). */
export type Team = TeamEntry['data'] & { slug: string };

/** Alle Mannschaften als Eintraege, sortiert nach dem Feld "order". */
export async function getTeamEntries(): Promise<TeamEntry[]> {
  const entries = await getCollection('teams');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Alle Mannschaften als flache Datensaetze – fuer Menue, Listen, Trainingsplan. */
export async function getTeams(): Promise<Team[]> {
  const entries = await getTeamEntries();
  return entries.map((e) => ({ slug: e.slug, ...e.data }));
}
