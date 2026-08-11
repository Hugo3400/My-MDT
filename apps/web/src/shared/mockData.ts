// Données de démonstration pour l'aperçu visuel — à remplacer par l'API réelle (apps/api).

// Nom affiché de l'utilisateur connecté (ex. displayName Discord), distinct de l'identité
// RP civile (Personne) synchronisée depuis FiveM — voir décision Q12.
export const mockUtilisateurNomAffiche = "Isaiah Stones";

export type Affectation = {
  id: string;
  organismeNom: string;
  organismeCode: string;
  divisionNom?: string;
  gradeNom: string;
  indicatif: string;
};

export const mockAffectations: Affectation[] = [
  {
    id: "aff-1",
    organismeNom: "Los Santos Police Department",
    organismeCode: "LSPD",
    divisionNom: "Patrouille",
    gradeNom: "Officier II",
    indicatif: "1-Adam-12",
  },
  {
    id: "aff-2",
    organismeNom: "San Andreas Highway Patrol",
    organismeCode: "SAHP",
    gradeNom: "Cadet",
    indicatif: "S-04",
  },
];

export const mockUnites = [
  { id: "u1", indicatif: "1-Adam-12", statut: "En patrouille", couleur: "#3b82f6" },
  { id: "u2", indicatif: "1-Lincoln-24", statut: "Sur intervention", couleur: "#ef4444" },
  { id: "u3", indicatif: "S-04", statut: "Disponible", couleur: "#22c55e" },
  { id: "u4", indicatif: "1-Baker-07", statut: "Pause", couleur: "#eab308" },
  { id: "u5", indicatif: "1-Charlie-02", statut: "Hors service", couleur: "#6b7280" },
];

export const mockDispatchs = [
  {
    id: "d1",
    numero: "#2026-0142",
    priorite: "Critique",
    categorie: "Braquage en cours",
    lieu: "Vinewood Blvd",
    statut: "En cours",
  },
  {
    id: "d2",
    numero: "#2026-0141",
    priorite: "Urgente",
    categorie: "Accident avec blessés",
    lieu: "Route 68",
    statut: "Attribué",
  },
  {
    id: "d3",
    numero: "#2026-0140",
    priorite: "Normale",
    categorie: "Tapage nocturne",
    lieu: "Vespucci Beach",
    statut: "Nouveau",
  },
];

export type PersonneRechercheeApercu = {
  id: string;
  nom: string;
  motif: string;
  recompense: string;
  age: number;
  affiliation?: string;
  derniereLocalisation?: string;
  derniereDate: string;
  caution: string;
};

export const mockRecherches: PersonneRechercheeApercu[] = [
  {
    id: "r1",
    nom: "Ocho Johnson",
    motif: "Amendes impayées",
    recompense: "1 000 $",
    age: 26,
    derniereLocalisation: "Vinewood",
    derniereDate: "03/08/2026",
    caution: "Risque de fuite",
  },
  {
    id: "r2",
    nom: "Tyrese Brooks",
    motif: "Amendes impayées",
    recompense: "500 $",
    age: 21,
    derniereLocalisation: "Davis",
    derniereDate: "03/08/2026",
    caution: "Autre",
  },
  {
    id: "r3",
    nom: "Marko Ulemek",
    motif: "Amendes impayées",
    recompense: "500 $",
    age: 41,
    derniereDate: "31/07/2026",
    caution: "Autre",
  },
];

export type EvenementService = {
  id: string;
  date: string;
  texte: string;
};

export const mockHistoriqueService: EvenementService[] = [
  { id: "h1", date: "11/08/2026", texte: "Passage au grade Officier II" },
  { id: "h2", date: "02/06/2026", texte: "Affectation à la division Patrouille" },
  { id: "h3", date: "14/03/2026", texte: "Recrutement — Los Santos Police Department" },
];

export type Absence = {
  id: string;
  debut: string;
  fin: string;
  motif: string;
  statut: "En attente" | "Approuvée" | "Refusée";
};

export const mockAbsences: Absence[] = [
  { id: "ab1", debut: "20/08/2026", fin: "27/08/2026", motif: "Congé", statut: "Approuvée" },
];

export const mockInfosRH = {
  dateEngagement: "14/03/2026",
  statut: "Actif",
  superviseur: "Capitaine R. Whitfield",
  unite: "Patrouille",
};

export const mockAlertes = [
  { id: "a1", type: "BOLO", texte: "Véhicule signalé — Sultan gris, plaque partielle 12ABC" },
  { id: "a2", type: "Warrant", texte: "En attente de visa — Dossier #W-2026-018" },
  { id: "a3", type: "Rapport", texte: "3 rapports en attente d'approbation" },
];
