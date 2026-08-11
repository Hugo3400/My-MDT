import type { ComponentType, SVGProps } from "react";
import {
  IconAdministration,
  IconCarte,
  IconDispatch,
  IconEnquetes,
  IconRapports,
  IconRegistres,
  IconSaisies,
  IconSpecialites,
  IconWarrants,
} from "./icons";

export type NavItem = {
  to: string;
  label: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  // Classes Tailwind écrites en toutes lettres (pas d'interpolation) pour rester détectables par le JIT.
  tileClass: string;
  activeClass: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dispatch",
    label: "Dispatch",
    description: "Interventions en cours",
    Icon: IconDispatch,
    tileClass:
      "border-rose-500/25 bg-rose-500/10 text-rose-400 group-hover:border-rose-500/60 group-hover:bg-rose-500/20",
    activeClass: "border-rose-500/60 bg-rose-500/15 text-rose-400",
  },
  {
    to: "/rapports",
    label: "Rapports",
    description: "Rédaction et suivi",
    Icon: IconRapports,
    tileClass:
      "border-sky-500/25 bg-sky-500/10 text-sky-400 group-hover:border-sky-500/60 group-hover:bg-sky-500/20",
    activeClass: "border-sky-500/60 bg-sky-500/15 text-sky-400",
  },
  {
    to: "/warrants-bolo",
    label: "Mandats & BOLO",
    description: "Recherches actives",
    Icon: IconWarrants,
    tileClass:
      "border-amber-500/25 bg-amber-500/10 text-amber-400 group-hover:border-amber-500/60 group-hover:bg-amber-500/20",
    activeClass: "border-amber-500/60 bg-amber-500/15 text-amber-400",
  },
  {
    to: "/registres",
    label: "Registres",
    description: "Personnes, armes, véhicules",
    Icon: IconRegistres,
    tileClass:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/60 group-hover:bg-emerald-500/20",
    activeClass: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400",
  },
  {
    to: "/enquetes",
    label: "Enquêtes",
    description: "Dossiers en cours",
    Icon: IconEnquetes,
    tileClass:
      "border-violet-500/25 bg-violet-500/10 text-violet-400 group-hover:border-violet-500/60 group-hover:bg-violet-500/20",
    activeClass: "border-violet-500/60 bg-violet-500/15 text-violet-400",
  },
  {
    to: "/saisies",
    label: "Saisies",
    description: "Chaîne de possession",
    Icon: IconSaisies,
    tileClass:
      "border-orange-500/25 bg-orange-500/10 text-orange-400 group-hover:border-orange-500/60 group-hover:bg-orange-500/20",
    activeClass: "border-orange-500/60 bg-orange-500/15 text-orange-400",
  },
  {
    to: "/carte",
    label: "Carte",
    description: "Vue tactique",
    Icon: IconCarte,
    tileClass:
      "border-teal-500/25 bg-teal-500/10 text-teal-400 group-hover:border-teal-500/60 group-hover:bg-teal-500/20",
    activeClass: "border-teal-500/60 bg-teal-500/15 text-teal-400",
  },
  {
    to: "/specialites",
    label: "Spécialités",
    description: "Divisions & unités",
    Icon: IconSpecialites,
    tileClass:
      "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-400 group-hover:border-fuchsia-500/60 group-hover:bg-fuchsia-500/20",
    activeClass: "border-fuchsia-500/60 bg-fuchsia-500/15 text-fuchsia-400",
  },
  {
    to: "/administration",
    label: "Administration",
    description: "Organisme & permissions",
    Icon: IconAdministration,
    tileClass:
      "border-indigo-500/25 bg-indigo-500/10 text-indigo-400 group-hover:border-indigo-500/60 group-hover:bg-indigo-500/20",
    activeClass: "border-indigo-500/60 bg-indigo-500/15 text-indigo-400",
  },
];
