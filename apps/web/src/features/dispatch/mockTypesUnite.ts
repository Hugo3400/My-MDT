// Les types d'unité et leur indicatif phonétique seront configurables par les responsables
// de l'organisme (voir précision du 11/08/2026, comme l'armement et les véhicules).
// Ceci est un jeu de valeurs par défaut pour la démo.

export type TypeUnite = {
  code: string;
  nom: string;
  indicatifPhonetique: string;
};

export const TYPES_UNITE: TypeUnite[] = [
  { code: "PATROL", nom: "Patrol", indicatifPhonetique: "Nora" },
  { code: "MCU", nom: "MCU", indicatifPhonetique: "Mike" },
  { code: "FTF", nom: "FTF", indicatifPhonetique: "Franck" },
  { code: "SOG", nom: "SOG", indicatifPhonetique: "George" },
  { code: "AIR_OPS", nom: "Air Ops", indicatifPhonetique: "Air" },
  { code: "K9", nom: "K9", indicatifPhonetique: "K9" },
  { code: "TRAINING", nom: "Training", indicatifPhonetique: "TD" },
];

export type ObjectifEquipage = "Traque" | "Enquête" | "Administratif" | "Tribunal" | "Transport" | "Autres";

export const OBJECTIFS_EQUIPAGE: ObjectifEquipage[] = [
  "Traque",
  "Enquête",
  "Administratif",
  "Tribunal",
  "Transport",
  "Autres",
];

export const VEHICULES_DISPONIBLES = [
  "Vapid Stanier — Unité 4",
  "Vapid Stanier — Unité 7",
  "Buffalo S — Unité 12",
  "Interceptor — Unité 2",
  "Vapid Interceptor — Unité 9",
];
