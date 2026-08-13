export type Priorite = "Critique" | "Urgente" | "Normale";
export type DispatchStatut =
  | "Nouveau"
  | "En attente"
  | "Attribué"
  | "En cours"
  | "Attente de clôture"
  | "Clôturé"
  | "Annulé";

export type UniteEngagee = {
  id: string;
  indicatif: string;
  statut: string;
  couleur: string;
};

export type EvenementDispatch = {
  id: string;
  heure: string;
  texte: string;
};

export type DispatchDetail = {
  id: string;
  numero: string;
  priorite: Priorite;
  categorie: string;
  statut: DispatchStatut;
  lieu: string;
  description: string;
  objectifMission?: string;
  creeDepuis: string;
  unitesEngagees: UniteEngagee[];
  filActivite: EvenementDispatch[];
};

export const PRIORITE_STYLE: Record<Priorite, { dot: string; text: string; border: string }> = {
  Critique: { dot: "bg-red-500", text: "text-red-400", border: "border-l-red-500" },
  Urgente: { dot: "bg-orange-500", text: "text-orange-400", border: "border-l-orange-500" },
  Normale: { dot: "bg-amber-500", text: "text-amber-400", border: "border-l-amber-500" },
};

export const STATUT_OPTIONS: DispatchStatut[] = [
  "Nouveau",
  "En attente",
  "Attribué",
  "En cours",
  "Attente de clôture",
  "Clôturé",
  "Annulé",
];

export const mockDispatchsDetail: DispatchDetail[] = [
  {
    id: "d1",
    numero: "#2026-0142",
    priorite: "Critique",
    categorie: "Braquage",
    statut: "En cours",
    lieu: "Vinewood Blvd, angle 3e Rue",
    description: "Braquage en cours — Fleeca Bank",
    objectifMission:
      "Encercler, sécuriser les otages, attendre le négociateur avant tout assaut.",
    creeDepuis: "4m",
    unitesEngagees: [
      { id: "u1", indicatif: "4-Adam-19", statut: "Sur intervention", couleur: "#f97316" },
      { id: "u2", indicatif: "4-Adam-12", statut: "En route", couleur: "#22c55e" },
    ],
    filActivite: [
      { id: "e1", heure: "14:28", texte: "Créé par dispatch — priorité CRITIQUE" },
      { id: "e2", heure: "14:29", texte: "4-Adam-19 affectée" },
      { id: "e3", heure: "14:31", texte: "4-Adam-19 : « Arrivée sur place »" },
      { id: "e4", heure: "14:32", texte: "4-Adam-12 affectée en renfort" },
    ],
  },
  {
    id: "d2",
    numero: "#2026-0141",
    priorite: "Urgente",
    categorie: "Accident",
    statut: "Attribué",
    lieu: "Route 68",
    description: "Accident avec blessés",
    creeDepuis: "12m",
    unitesEngagees: [{ id: "u3", indicatif: "1-Lincoln-24", statut: "En route", couleur: "#22c55e" }],
    filActivite: [
      { id: "e5", heure: "14:16", texte: "Créé par dispatch — priorité URGENTE" },
      { id: "e6", heure: "14:18", texte: "1-Lincoln-24 affectée" },
    ],
  },
  {
    id: "d3",
    numero: "#2026-0140",
    priorite: "Urgente",
    categorie: "Trafic",
    statut: "Nouveau",
    lieu: "Route 68 / Senora Freeway",
    description: "Accident matériel, circulation bloquée",
    creeDepuis: "18m",
    unitesEngagees: [],
    filActivite: [{ id: "e7", heure: "14:10", texte: "Créé par dispatch — priorité URGENTE" }],
  },
  {
    id: "d4",
    numero: "#2026-0139",
    priorite: "Urgente",
    categorie: "Alarme",
    statut: "Attribué",
    lieu: "Vespucci Canals",
    description: "Alarme antivol déclenchée",
    creeDepuis: "25m",
    unitesEngagees: [{ id: "u4", indicatif: "S-04", statut: "Sur intervention", couleur: "#f97316" }],
    filActivite: [{ id: "e8", heure: "14:03", texte: "Créé par dispatch — priorité URGENTE" }],
  },
  {
    id: "d5",
    numero: "#2026-0138",
    priorite: "Normale",
    categorie: "Contrôle",
    statut: "En cours",
    lieu: "Vespucci Beach",
    description: "Tapage nocturne",
    creeDepuis: "31m",
    unitesEngagees: [{ id: "u5", indicatif: "1-Baker-07", statut: "Sur intervention", couleur: "#f97316" }],
    filActivite: [{ id: "e9", heure: "13:57", texte: "Créé par dispatch — priorité NORMALE" }],
  },
];
