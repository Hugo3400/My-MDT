// Warrant et Personne recherchée restent deux sous-types distincts avec des champs différents
// (cahier des charges section 3.3 : « ne pas fusionner ces objets »), regroupés dans un seul
// onglet « Mandats » à la demande du client (décision du 13/08/2026), par opposition à BOLO qui
// reste un onglet séparé.

export type TypeMandat = "Warrant" | "Personne recherchée";

export const TYPES_MANDAT: TypeMandat[] = ["Warrant", "Personne recherchée"];

export type StatutMandat = "Brouillon" | "En attente de visa" | "Approuvé" | "Rejeté" | "Expiré" | "Annulé";

export const STATUT_MANDAT_OPTIONS: StatutMandat[] = [
  "Brouillon",
  "En attente de visa",
  "Approuvé",
  "Rejeté",
  "Expiré",
  "Annulé",
];

export const STATUT_MANDAT_STYLE: Record<StatutMandat, { text: string; bg: string; border: string }> = {
  Brouillon: { text: "text-panel-muted", bg: "bg-panel-border/60", border: "border-panel-border" },
  "En attente de visa": { text: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/30" },
  Approuvé: { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  Rejeté: { text: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  Expiré: { text: "text-panel-muted", bg: "bg-panel-border/40", border: "border-panel-border" },
  Annulé: { text: "text-panel-muted", bg: "bg-panel-border/40", border: "border-panel-border" },
};

export const NIVEAUX_RECHERCHE = ["Faible", "Modéré", "Élevé", "Extrême"] as const;
export type NiveauRecherche = (typeof NIVEAUX_RECHERCHE)[number];

export const DANGEROSITES = ["Faible", "Modérée", "Élevée"] as const;
export type Dangerosite = (typeof DANGEROSITES)[number];

export type EvenementMandat = {
  id: string;
  date: string;
  auteur: string;
  texte: string;
};

export type Mandat = {
  id: string;
  numero: string;
  type: TypeMandat;
  personneCible: string;
  motif: string;
  statut: StatutMandat;
  auteur: string;
  approbateur?: string;
  dateEmission?: string;
  dateExpiration?: string;
  // Champs spécifiques Warrant
  piecesLiees: string[];
  // Champs spécifiques Personne recherchée
  niveauRecherche?: NiveauRecherche;
  dangerosite?: Dangerosite;
  consignes?: string;
  createdAt: string;
  updatedAt: string;
  journal: EvenementMandat[];
};

const PREFIXE_TYPE: Record<TypeMandat, string> = {
  Warrant: "WAR",
  "Personne recherchée": "REC",
};

export function genererNumeroMandat(type: TypeMandat, existants: Mandat[]): string {
  const prefixe = PREFIXE_TYPE[type];
  const annee = new Date().getFullYear();
  const base = `${prefixe}-${annee}`;
  const sequence = existants.filter((m) => m.numero.startsWith(`${base}-`)).length + 1;
  return `${base}-${String(sequence).padStart(3, "0")}`;
}

export const mockMandats: Mandat[] = [
  {
    id: "m1",
    numero: "WAR-2026-001",
    type: "Warrant",
    personneCible: "Ocho Johnson",
    motif: "Vol à main armée, résistance à l'interpellation — nécessite perquisition du domicile.",
    statut: "En attente de visa",
    auteur: "Ethan Caldwell",
    piecesLiees: ["ARR-2026-001"],
    createdAt: "13/08/2026 11:00",
    updatedAt: "13/08/2026 11:00",
    journal: [{ id: "j1", date: "13/08/2026 11:00", auteur: "Ethan Caldwell", texte: "Mandat créé, envoyé pour visa" }],
  },
  {
    id: "m2",
    numero: "REC-2026-001",
    type: "Personne recherchée",
    personneCible: "Tyrese Brooks",
    motif: "Interpellation manquée suite à usage de la force, en fuite depuis le 12/08/2026.",
    statut: "Approuvé",
    auteur: "T. Okafor",
    approbateur: "Capitaine R. Whitfield",
    dateEmission: "12/08/2026 20:00",
    dateExpiration: "12/09/2026 20:00",
    piecesLiees: [],
    niveauRecherche: "Élevé",
    dangerosite: "Modérée",
    consignes: "Ne pas approcher seul, prévenir le superviseur avant interpellation.",
    createdAt: "12/08/2026 19:50",
    updatedAt: "12/08/2026 20:05",
    journal: [
      { id: "j2", date: "12/08/2026 19:50", auteur: "T. Okafor", texte: "Fiche créée" },
      { id: "j3", date: "12/08/2026 20:05", auteur: "Capitaine R. Whitfield", texte: "Avis de recherche approuvé" },
    ],
  },
  {
    id: "m3",
    numero: "WAR-2026-002",
    type: "Warrant",
    personneCible: "Marko Ulemek",
    motif: "Mandat d'arrêt pour amendes impayées répétées.",
    statut: "Approuvé",
    auteur: "R. Voss",
    approbateur: "Capitaine R. Whitfield",
    dateEmission: "31/07/2026 09:00",
    dateExpiration: "31/10/2026 09:00",
    piecesLiees: [],
    createdAt: "31/07/2026 08:45",
    updatedAt: "31/07/2026 09:00",
    journal: [
      { id: "j4", date: "31/07/2026 08:45", auteur: "R. Voss", texte: "Mandat créé, envoyé pour visa" },
      { id: "j5", date: "31/07/2026 09:00", auteur: "Capitaine R. Whitfield", texte: "Mandat approuvé" },
    ],
  },
];
