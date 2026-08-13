export type PrioriteBolo = "Faible" | "Normale" | "Urgente" | "Critique";

export const PRIORITES_BOLO: PrioriteBolo[] = ["Faible", "Normale", "Urgente", "Critique"];

export const PRIORITE_BOLO_STYLE: Record<PrioriteBolo, { text: string; bg: string; border: string; dot: string }> = {
  Faible: { text: "text-panel-muted", bg: "bg-panel-border/60", border: "border-panel-border", dot: "bg-gray-500" },
  Normale: { text: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/30", dot: "bg-sky-500" },
  Urgente: { text: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30", dot: "bg-orange-500" },
  Critique: { text: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", dot: "bg-red-500" },
};

export type StatutBolo = "Actif" | "Expiré" | "Annulé";

export const STATUT_BOLO_STYLE: Record<StatutBolo, { text: string; bg: string }> = {
  Actif: { text: "text-emerald-400", bg: "bg-emerald-500/15" },
  Expiré: { text: "text-panel-muted", bg: "bg-panel-border/60" },
  Annulé: { text: "text-panel-muted", bg: "bg-panel-border/40" },
};

export const DESTINATAIRES_BOLO = ["Tout le tenant", "Patrouille", "FTF", "SOG", "MCU", "Air Ops", "K9"];

export type Bolo = {
  id: string;
  numero: string;
  priorite: PrioriteBolo;
  signalement: string;
  personneCible?: string;
  vehiculeCible?: string;
  statut: StatutBolo;
  auteur: string;
  dateCreation: string;
  dateExpiration: string;
  destinataires: string[];
  accusesLecture: string[];
};

export function genererNumeroBolo(existants: Bolo[]): string {
  const annee = new Date().getFullYear();
  const base = `BOLO-${annee}`;
  const sequence = existants.filter((b) => b.numero.startsWith(`${base}-`)).length + 1;
  return `${base}-${String(sequence).padStart(3, "0")}`;
}

export const mockBolos: Bolo[] = [
  {
    id: "b1",
    numero: "BOLO-2026-001",
    priorite: "Urgente",
    signalement: "Véhicule Sultan gris signalé fuyant les lieux d'un braquage, plaque partielle 12ABC.",
    vehiculeCible: "Sultan gris — 12ABC?",
    statut: "Actif",
    auteur: "Ethan Caldwell",
    dateCreation: "13/08/2026 10:20",
    dateExpiration: "16/08/2026 10:20",
    destinataires: ["Tout le tenant"],
    accusesLecture: ["R. Voss"],
  },
  {
    id: "b2",
    numero: "BOLO-2026-002",
    priorite: "Normale",
    signalement: "Individu correspondant au signalement de Marko Ulemek vu aux abords de Davis.",
    personneCible: "Marko Ulemek",
    statut: "Actif",
    auteur: "T. Okafor",
    dateCreation: "12/08/2026 21:00",
    dateExpiration: "15/08/2026 21:00",
    destinataires: ["Patrouille", "FTF"],
    accusesLecture: [],
  },
];
