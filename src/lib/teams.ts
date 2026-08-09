/**
 * Laedt die Mannschaften aus data/teams/.
 *
 * Jede Mannschaft hat dort genau eine Datei mit allem, was zu ihr gehoert:
 * Bezeichnung, Trainer, Trainingszeiten, fussball.de-Widgets und Kader.
 * Eine neue Mannschaft anzulegen heisst: eine neue Datei ablegen – sie
 * erscheint dann automatisch im Menue, im Trainingsplan und bekommt ihre
 * eigene Kaderseite. Die Reihenfolge steuert das Feld "order".
 */

export interface StaffMember {
  name: string;
  role: string;
  number: number | null;
  position: string;
  image: string | null;
  since: string | null;
  phone: string;
  email: string;
  qualification: string;
}

export interface Player {
  name: string;
  number: number;
  position: string;
  image: string | null;
}

export interface TrainingSlot {
  days: string;
  from: string;
  to: string;
}

export interface FussballDe {
  fussballDeUrl?: string;
  league?: string;
  tableWidget?: string;
  teamMatchesWidget?: string;
}

export interface Team {
  slug: string;
  order: number;
  displayName: string;
  uNumber: string | null;
  category: string | null;
  birthYear: string | null;
  navLabel: string | null;
  categoryColor: string | null;
  trainer: string | null;
  trainingDays: string | null;
  trainingTime: string | null;
  trainingTimes?: TrainingSlot[];
  fussballDe?: FussballDe;
  staff: StaffMember[];
  players: Player[];
}

const modules = import.meta.glob<{ default: Team }>('../../data/teams/*.json', {
  eager: true,
});

/** Alle Mannschaften in der Reihenfolge des Feldes "order". */
export const teams: Team[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

/** Eine Mannschaft ueber ihren Slug (= ihren Dateinamen) finden. */
export function getTeam(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug);
}
