import type { TypeUnite, ObjectifEquipage } from "./mockTypesUnite";

export type StatutEquipage = "Actif" | "En intervention" | "Hors service";

export const STATUT_EQUIPAGE_OPTIONS: StatutEquipage[] = ["Actif", "En intervention", "Hors service"];

export type Equipage = {
  id: string;
  typeUnite: TypeUnite;
  numero: string;
  membresIds: string[];
  objectif: ObjectifEquipage;
  cible?: string;
  equipementLetal: boolean;
  equipementNonLetal: boolean;
  vehicule: string | null;
  statut: StatutEquipage;
  creeLe: string;
  interventionLiee?: string;
  operationLiee?: string;
};

export function indicatifEquipage(equipage: Pick<Equipage, "typeUnite" | "numero">): string {
  return `${equipage.typeUnite.code}-${equipage.typeUnite.indicatifPhonetique}-${equipage.numero}`;
}

export const STATUT_EQUIPAGE_STYLE: Record<
  StatutEquipage,
  { dot: string; text: string; border: string }
> = {
  Actif: { dot: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30" },
  "En intervention": { dot: "bg-orange-500", text: "text-orange-400", border: "border-orange-500/30" },
  "Hors service": { dot: "bg-gray-500", text: "text-panel-muted", border: "border-panel-border" },
};
