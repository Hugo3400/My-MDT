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
      { id: "m30", nom: "Calahan Robert", matricule: 30 },
      { id: "m84", nom: "Espinoza Adrián", matricule: 84 },
      { id: "m101", nom: "Simcoe Dominic Graves", matricule: 101 },
    ],
  },
  {
    titre: "Supervisory Staff",
    membres: [
      { id: "m77", nom: "Calahan Kayce", matricule: 77 },
      { id: "m73", nom: "Crowford Rango", matricule: 73 },
      { id: "m59", nom: "Dean Walker Robert", matricule: 59 },
      { id: "m102", nom: "Derand John Washington", matricule: 102 },
      { id: "m109", nom: "Ramirez Alexander", matricule: 109 },
      { id: "m10", nom: "Washington Clark W.", matricule: 10 },
    ],
  },
  {
    titre: "Senior Deputy",
    membres: [
      { id: "m51", nom: "James Max", matricule: 51 },
      { id: "m99", nom: "Mori Tatsuya", matricule: 99 },
    ],
  },
  {
    titre: "Special Deputy",
    membres: [
      { id: "m19", nom: "Reynolds Asher", matricule: 19 },
      { id: "m47", nom: "Markovitch Arnold Mickael James", matricule: 47 },
      { id: "m92", nom: "Kareem Ali", matricule: 92 },
      { id: "m95", nom: "Cross Alex", matricule: 95 },
      { id: "m1", nom: "Stones Isaiah", matricule: 1 },
    ],
  },
];

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
