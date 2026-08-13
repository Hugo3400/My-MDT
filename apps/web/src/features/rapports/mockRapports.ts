export type ChampType = "texte" | "zone_texte" | "nombre" | "date" | "select";

export type ChampConfig = {
  id: string;
  label: string;
  type: ChampType;
  options?: string[];
  obligatoire: boolean;
};

export type CategorieRapport = {
  id: string;
  nom: string;
  champs: ChampConfig[];
};

export const CATEGORIES_RAPPORT: CategorieRapport[] = [
  {
    id: "arrestation",
    nom: "Arrestation",
    champs: [
      { id: "personne", label: "Personne arrêtée", type: "texte", obligatoire: true },
      { id: "motif", label: "Motif de l'arrestation", type: "zone_texte", obligatoire: true },
      { id: "lieu", label: "Lieu", type: "texte", obligatoire: true },
    ],
  },
  {
    id: "incident",
    nom: "Incident de service",
    champs: [
      { id: "resume", label: "Résumé de l'incident", type: "zone_texte", obligatoire: true },
      { id: "lieu", label: "Lieu", type: "texte", obligatoire: true },
      { id: "gravite", label: "Gravité", type: "select", options: ["Mineure", "Modérée", "Grave"], obligatoire: true },
    ],
  },
  {
    id: "usage_force",
    nom: "Usage de la force",
    champs: [
      { id: "personne", label: "Personne concernée", type: "texte", obligatoire: true },
      { id: "type_force", label: "Type de force employée", type: "select", options: ["Verbale", "Physique", "Taser", "Arme létale"], obligatoire: true },
      { id: "justification", label: "Justification", type: "zone_texte", obligatoire: true },
    ],
  },
  {
    id: "accident",
    nom: "Accident / collision",
    champs: [
      { id: "lieu", label: "Lieu", type: "texte", obligatoire: true },
      { id: "vehicules", label: "Véhicules impliqués", type: "zone_texte", obligatoire: true },
      { id: "blesses", label: "Nombre de blessés", type: "nombre", obligatoire: false },
    ],
  },
  {
    id: "controle",
    nom: "Contrôle routier / personne",
    champs: [
      { id: "cible", label: "Personne / véhicule contrôlé", type: "texte", obligatoire: true },
      { id: "motif", label: "Motif du contrôle", type: "zone_texte", obligatoire: true },
      { id: "resultat", label: "Résultat", type: "select", options: ["Sans suite", "Avertissement", "Verbalisation", "Arrestation"], obligatoire: true },
    ],
  },
  {
    id: "perquisition",
    nom: "Perquisition",
    champs: [
      { id: "adresse", label: "Adresse", type: "texte", obligatoire: true },
      { id: "mandat", label: "Numéro de mandat associé", type: "texte", obligatoire: false },
      { id: "objets_saisis", label: "Objets saisis", type: "zone_texte", obligatoire: false },
    ],
  },
  {
    id: "fourriere",
    nom: "Mise en fourrière",
    champs: [
      { id: "vehicule", label: "Véhicule", type: "texte", obligatoire: true },
      { id: "motif", label: "Motif", type: "zone_texte", obligatoire: true },
      { id: "lieu_stockage", label: "Lieu de stockage", type: "texte", obligatoire: true },
    ],
  },
  {
    id: "enquete",
    nom: "Rapport d'enquête",
    champs: [
      { id: "dossier", label: "Numéro de dossier lié", type: "texte", obligatoire: false },
      { id: "resume", label: "Résumé des constatations", type: "zone_texte", obligatoire: true },
      { id: "suite", label: "Suite proposée", type: "zone_texte", obligatoire: false },
    ],
  },
];

export type RapportStatut = "Brouillon" | "Soumis" | "À corriger" | "Approuvé" | "Archivé";

export const STATUT_RAPPORT_OPTIONS: RapportStatut[] = [
  "Brouillon",
  "Soumis",
  "À corriger",
  "Approuvé",
  "Archivé",
];

export const STATUT_RAPPORT_STYLE: Record<RapportStatut, { text: string; bg: string; border: string }> = {
  Brouillon: { text: "text-panel-muted", bg: "bg-panel-border/60", border: "border-panel-border" },
  Soumis: { text: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/30" },
  "À corriger": { text: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30" },
  Approuvé: { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  Archivé: { text: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30" },
};

export type TypeLien = "Personne" | "Véhicule" | "Arme" | "Dossier" | "Saisie" | "Unité" | "Dispatch";

export const TYPES_LIEN: TypeLien[] = [
  "Personne",
  "Véhicule",
  "Arme",
  "Dossier",
  "Saisie",
  "Unité",
  "Dispatch",
];

export type LienRapport = {
  id: string;
  type: TypeLien;
  libelle: string;
};

export type PieceJointeRapport = {
  id: string;
  nom: string;
  taille: string;
  type: string;
};

export type CommentaireRapport = {
  id: string;
  auteur: string;
  texte: string;
  date: string;
};

export type VersionRapport = {
  id: string;
  date: string;
  auteur: string;
  resume: string;
};

export type Rapport = {
  id: string;
  numero: string;
  categorieId: string;
  titre: string;
  statut: RapportStatut;
  auteur: string;
  relecteur?: string;
  createdAt: string;
  updatedAt: string;
  contenu: Record<string, string>;
  liens: LienRapport[];
  pieceJointes: PieceJointeRapport[];
  commentaires: CommentaireRapport[];
  historique: VersionRapport[];
};

export function trouverCategorie(id: string): CategorieRapport | undefined {
  return CATEGORIES_RAPPORT.find((c) => c.id === id);
}

export const mockRapports: Rapport[] = [
  {
    id: "r1",
    numero: "RAP-2026-0341",
    categorieId: "arrestation",
    titre: "Arrestation — vol à main armée, Vinewood Blvd",
    statut: "Soumis",
    auteur: "Ethan Caldwell",
    createdAt: "13/08/2026 10:15",
    updatedAt: "13/08/2026 10:42",
    contenu: {
      personne: "Ocho Johnson",
      motif: "Vol à main armée sur commerce, résistance à l'interpellation",
      lieu: "Vinewood Blvd, Fleeca Bank",
    },
    liens: [
      { id: "l1", type: "Dispatch", libelle: "#2026-0142" },
      { id: "l2", type: "Personne", libelle: "Ocho Johnson" },
    ],
    pieceJointes: [{ id: "p1", nom: "photo_scene.jpg", taille: "1.2 Mo", type: "image/jpeg" }],
    commentaires: [],
    historique: [{ id: "v1", date: "13/08/2026 10:15", auteur: "Ethan Caldwell", resume: "Création du rapport" }],
  },
  {
    id: "r2",
    numero: "RAP-2026-0340",
    categorieId: "controle",
    titre: "Contrôle routier — excès de vitesse, Senora Freeway",
    statut: "Approuvé",
    auteur: "R. Voss",
    relecteur: "Capitaine R. Whitfield",
    createdAt: "12/08/2026 22:05",
    updatedAt: "12/08/2026 22:40",
    contenu: {
      cible: "Véhicule Buffalo S, plaque 12ABC340",
      motif: "Excès de vitesse constaté à 140 km/h en zone 90",
      resultat: "Verbalisation",
    },
    liens: [{ id: "l3", type: "Véhicule", libelle: "Buffalo S — 12ABC340" }],
    pieceJointes: [],
    commentaires: [
      { id: "c1", auteur: "Capitaine R. Whitfield", texte: "Bon rapport, approuvé.", date: "12/08/2026 22:38" },
    ],
    historique: [
      { id: "v2", date: "12/08/2026 22:05", auteur: "R. Voss", resume: "Création du rapport" },
      { id: "v3", date: "12/08/2026 22:40", auteur: "Capitaine R. Whitfield", resume: "Rapport approuvé" },
    ],
  },
  {
    id: "r3",
    numero: "RAP-2026-0339",
    categorieId: "usage_force",
    titre: "Usage de la force — interpellation Davis",
    statut: "À corriger",
    auteur: "T. Okafor",
    relecteur: "Capitaine R. Whitfield",
    createdAt: "12/08/2026 18:20",
    updatedAt: "12/08/2026 19:05",
    contenu: {
      personne: "Tyrese Brooks",
      type_force: "Taser",
      justification: "Suspect en fuite, refus d'obtempérer répété.",
    },
    liens: [],
    pieceJointes: [],
    commentaires: [
      {
        id: "c2",
        auteur: "Capitaine R. Whitfield",
        texte: "Merci de préciser l'heure exacte et le nombre de sommations effectuées avant usage du taser.",
        date: "12/08/2026 19:05",
      },
    ],
    historique: [{ id: "v4", date: "12/08/2026 18:20", auteur: "T. Okafor", resume: "Création du rapport" }],
  },
  {
    id: "r4",
    numero: "RAP-2026-0338",
    categorieId: "incident",
    titre: "Incident de service — altercation Vespucci Beach",
    statut: "Brouillon",
    auteur: "Ethan Caldwell",
    createdAt: "12/08/2026 14:00",
    updatedAt: "12/08/2026 14:00",
    contenu: {},
    liens: [],
    pieceJointes: [],
    commentaires: [],
    historique: [{ id: "v5", date: "12/08/2026 14:00", auteur: "Ethan Caldwell", resume: "Création du rapport" }],
  },
];
