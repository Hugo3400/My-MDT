export type MembreRoster = {
  id: string;
  nom: string;
  matricule: number;
};

export type SectionRoster = {
  titre: string;
  membres: MembreRoster[];
};

export const mockEffectifGlobal: SectionRoster[] = [
  {
    titre: "District Leadership",
    membres: [
      { id: "m12", nom: "Harrington Wade", matricule: 12 },
      { id: "m45", nom: "Boucher Élise", matricule: 45 },
      { id: "m88", nom: "Falkner Desmond", matricule: 88 },
    ],
  },
  {
    titre: "Supervisory Staff",
    membres: [
      { id: "m33", nom: "Whitlock Renée", matricule: 33 },
      { id: "m67", nom: "Castellan Théo", matricule: 67 },
      { id: "m52", nom: "Ortiz Marcus", matricule: 52 },
      { id: "m91", nom: "Beaumont Julien", matricule: 91 },
      { id: "m28", nom: "Sorensen Ingrid", matricule: 28 },
      { id: "m76", nom: "Talbot Owen", matricule: 76 },
    ],
  },
  {
    titre: "Senior Deputy",
    membres: [
      { id: "m15", nom: "Nakamura Kenji", matricule: 15 },
      { id: "m60", nom: "Fontaine Camille", matricule: 60 },
    ],
  },
  {
    titre: "Special Deputy",
    membres: [
      { id: "m1", nom: "Caldwell Ethan", matricule: 1 },
      { id: "m23", nom: "Vasquez Diego", matricule: 23 },
      { id: "m84", nom: "Whitmore Grace", matricule: 84 },
      { id: "m39", nom: "Adeyemi Tomi", matricule: 39 },
      { id: "m56", nom: "Larsson Freya", matricule: 56 },
    ],
  },
];

// Correspond à mockUtilisateurNomAffiche (shared/mockData.ts) — l'agent actuellement connecté.
export const CURRENT_USER_ID = "m1";

export function effectifTotal(sections: SectionRoster[]): number {
  return sections.reduce((total, s) => total + s.membres.length, 0);
}

export function trouverMembre(sections: SectionRoster[], id: string): MembreRoster | undefined {
  for (const section of sections) {
    const trouve = section.membres.find((m) => m.id === id);
    if (trouve) return trouve;
  }
  return undefined;
}
