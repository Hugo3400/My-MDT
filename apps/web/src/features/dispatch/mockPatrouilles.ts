export type StatutPatrouille =
  | "Disponible"
  | "En patrouille"
  | "Sur intervention"
  | "Pause"
  | "Hors service";

export type Patrouille = {
  id: string;
  indicatif: string;
  membres: string[];
  vehicule: string | null;
  armement: string[];
  statut: StatutPatrouille;
  depuis: string;
  declarePar: string;
  interventionLiee?: string;
  operationLiee?: string;
};

export const STATUT_PATROUILLE_STYLE: Record<
  StatutPatrouille,
  { dot: string; text: string; border: string }
> = {
  Disponible: { dot: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30" },
  "En patrouille": { dot: "bg-sky-500", text: "text-sky-400", border: "border-sky-500/30" },
  "Sur intervention": { dot: "bg-orange-500", text: "text-orange-400", border: "border-orange-500/30" },
  Pause: { dot: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30" },
  "Hors service": { dot: "bg-gray-500", text: "text-panel-muted", border: "border-panel-border" },
};

export const STATUT_PATROUILLE_OPTIONS: StatutPatrouille[] = [
  "Disponible",
  "En patrouille",
  "Sur intervention",
  "Pause",
  "Hors service",
];

export const VEHICULES_DISPONIBLES = [
  "Vapid Stanier — Unité 4",
  "Vapid Stanier — Unité 7",
  "Buffalo S — Unité 12",
  "Interceptor — Unité 2",
  "Vapid Interceptor — Unité 9",
];

export const ARMEMENT_DISPONIBLE = [
  "Pistolet de service",
  "Fusil à pompe",
  "Taser",
  "Gilet pare-balles renforcé",
  "Fusil d'assaut (SWAT)",
];

export const AGENTS_DISPONIBLES = ["J. Martinez", "K. Delgado", "R. Voss", "T. Okafor"];

export const mockPatrouilles: Patrouille[] = [
  {
    id: "p1",
    indicatif: "1-Adam-12",
    membres: ["Isaiah Stones"],
    vehicule: "Vapid Stanier — Unité 4",
    armement: ["Pistolet de service"],
    statut: "Disponible",
    depuis: "14:02",
    declarePar: "Isaiah Stones",
  },
  {
    id: "p2",
    indicatif: "1-Lincoln-24",
    membres: ["J. Martinez", "K. Delgado"],
    vehicule: "Interceptor — Unité 2",
    armement: ["Pistolet de service", "Fusil à pompe"],
    statut: "Sur intervention",
    depuis: "13:40",
    declarePar: "J. Martinez",
    interventionLiee: "#2026-0142",
  },
  {
    id: "p3",
    indicatif: "S-04",
    membres: ["R. Voss"],
    vehicule: "Buffalo S — Unité 12",
    armement: ["Pistolet de service"],
    statut: "En patrouille",
    depuis: "13:15",
    declarePar: "Dispatch",
  },
  {
    id: "p4",
    indicatif: "1-Baker-07",
    membres: ["T. Okafor"],
    vehicule: null,
    armement: [],
    statut: "Pause",
    depuis: "12:50",
    declarePar: "T. Okafor",
  },
];
