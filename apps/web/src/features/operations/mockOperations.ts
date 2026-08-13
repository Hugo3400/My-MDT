export type OperationStatut = "Planifiée" | "En cours" | "Terminée" | "Annulée";

export type Operation = {
  id: string;
  nom: string;
  type: string;
  objectif: string;
  statut: OperationStatut;
  dateDebutPrevue: string;
  dateFinPrevue?: string;
  responsable: string;
  unitesAssignees: string[];
  notes?: string;
};

export const OPERATION_STATUT_STYLE: Record<OperationStatut, { text: string; bg: string }> = {
  Planifiée: { text: "text-sky-300", bg: "bg-sky-500/15" },
  "En cours": { text: "text-orange-300", bg: "bg-orange-500/15" },
  Terminée: { text: "text-emerald-300", bg: "bg-emerald-500/15" },
  Annulée: { text: "text-red-300", bg: "bg-red-500/15" },
};

export const TYPES_OPERATION = [
  "Contrôle routier ciblé",
  "Descente",
  "Surveillance",
  "Opération conjointe",
  "Sécurisation d'événement",
];

export const mockOperations: Operation[] = [
  {
    id: "op1",
    nom: "Opération Nettoyage — Grove Street",
    type: "Descente",
    objectif: "Perquisition coordonnée sur trois adresses liées au trafic présumé.",
    statut: "Planifiée",
    dateDebutPrevue: "12/08/2026 20:00",
    responsable: "Capitaine R. Whitfield",
    unitesAssignees: ["1-Adam-12", "S-04"],
  },
  {
    id: "op2",
    nom: "Contrôle Senora Freeway",
    type: "Contrôle routier ciblé",
    objectif: "Contrôle de vitesse et d'alcoolémie sur l'axe principal en sortie de ville.",
    statut: "En cours",
    dateDebutPrevue: "11/08/2026 22:00",
    dateFinPrevue: "12/08/2026 02:00",
    responsable: "Sergent D. Ibarra",
    unitesAssignees: ["1-Lincoln-24"],
  },
];
