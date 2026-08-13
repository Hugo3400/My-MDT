import type { ComponentType, SVGProps } from "react";
import {
  IconAdministration,
  IconCarte,
  IconDispatch,
  IconEnquetes,
  IconOperations,
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
  cardHoverClass: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dispatch",
    label: "Dispatch",
    description: "Interventions en cours",
    Icon: IconDispatch,
    tileClass:
      "border-rose-500/25 bg-rose-500/10 text-rose-400 group-hover:border-rose-500/60 group-hover:bg-rose-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-rose-500/70 group-focus-visible:border-rose-500/60 group-focus-visible:bg-rose-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-rose-500/70",
    activeClass: "border-rose-500/60 bg-rose-500/15 text-rose-400",
    cardHoverClass: "hover:border-rose-500/30 focus-visible:border-rose-500/30",
  },
  {
    to: "/rapports",
    label: "Rapports",
    description: "Rédaction et suivi",
    Icon: IconRapports,
    tileClass:
      "border-sky-500/25 bg-sky-500/10 text-sky-400 group-hover:border-sky-500/60 group-hover:bg-sky-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-sky-500/70 group-focus-visible:border-sky-500/60 group-focus-visible:bg-sky-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-sky-500/70",
    activeClass: "border-sky-500/60 bg-sky-500/15 text-sky-400",
    cardHoverClass: "hover:border-sky-500/30 focus-visible:border-sky-500/30",
  },
  {
    to: "/warrants-bolo",
    label: "Mandats & BOLO",
    description: "Recherches actives",
    Icon: IconWarrants,
    tileClass:
      "border-amber-500/25 bg-amber-500/10 text-amber-400 group-hover:border-amber-500/60 group-hover:bg-amber-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-amber-500/70 group-focus-visible:border-amber-500/60 group-focus-visible:bg-amber-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-amber-500/70",
    activeClass: "border-amber-500/60 bg-amber-500/15 text-amber-400",
    cardHoverClass: "hover:border-amber-500/30 focus-visible:border-amber-500/30",
  },
  {
    to: "/registres",
    label: "Registres",
    description: "Personnes, armes, véhicules",
    Icon: IconRegistres,
    tileClass:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/60 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-emerald-500/70 group-focus-visible:border-emerald-500/60 group-focus-visible:bg-emerald-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-emerald-500/70",
    activeClass: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400",
    cardHoverClass: "hover:border-emerald-500/30 focus-visible:border-emerald-500/30",
  },
  {
    to: "/enquetes",
    label: "Enquêtes",
    description: "Dossiers en cours",
    Icon: IconEnquetes,
    tileClass:
      "border-violet-500/25 bg-violet-500/10 text-violet-400 group-hover:border-violet-500/60 group-hover:bg-violet-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-violet-500/70 group-focus-visible:border-violet-500/60 group-focus-visible:bg-violet-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-violet-500/70",
    activeClass: "border-violet-500/60 bg-violet-500/15 text-violet-400",
    cardHoverClass: "hover:border-violet-500/30 focus-visible:border-violet-500/30",
  },
  {
    to: "/operations",
    label: "Opérations",
    description: "Missions planifiées",
    Icon: IconOperations,
    tileClass:
      "border-cyan-500/25 bg-cyan-500/10 text-cyan-400 group-hover:border-cyan-500/60 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-cyan-500/70 group-focus-visible:border-cyan-500/60 group-focus-visible:bg-cyan-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-cyan-500/70",
    activeClass: "border-cyan-500/60 bg-cyan-500/15 text-cyan-400",
    cardHoverClass: "hover:border-cyan-500/30 focus-visible:border-cyan-500/30",
  },
  {
    to: "/saisies",
    label: "Saisies",
    description: "Chaîne de possession",
    Icon: IconSaisies,
    tileClass:
      "border-orange-500/25 bg-orange-500/10 text-orange-400 group-hover:border-orange-500/60 group-hover:bg-orange-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-orange-500/70 group-focus-visible:border-orange-500/60 group-focus-visible:bg-orange-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-orange-500/70",
    activeClass: "border-orange-500/60 bg-orange-500/15 text-orange-400",
    cardHoverClass: "hover:border-orange-500/30 focus-visible:border-orange-500/30",
  },
  {
    to: "/carte",
    label: "Carte",
    description: "Vue tactique",
    Icon: IconCarte,
    tileClass:
      "border-teal-500/25 bg-teal-500/10 text-teal-400 group-hover:border-teal-500/60 group-hover:bg-teal-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-teal-500/70 group-focus-visible:border-teal-500/60 group-focus-visible:bg-teal-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-teal-500/70",
    activeClass: "border-teal-500/60 bg-teal-500/15 text-teal-400",
    cardHoverClass: "hover:border-teal-500/30 focus-visible:border-teal-500/30",
  },
  {
    to: "/specialites",
    label: "Spécialités",
    description: "Divisions & unités",
    Icon: IconSpecialites,
    tileClass:
      "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-400 group-hover:border-fuchsia-500/60 group-hover:bg-fuchsia-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-fuchsia-500/70 group-focus-visible:border-fuchsia-500/60 group-focus-visible:bg-fuchsia-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-fuchsia-500/70",
    activeClass: "border-fuchsia-500/60 bg-fuchsia-500/15 text-fuchsia-400",
    cardHoverClass: "hover:border-fuchsia-500/30 focus-visible:border-fuchsia-500/30",
  },
  {
    to: "/administration",
    label: "Administration",
    description: "Organisme & permissions",
    Icon: IconAdministration,
    tileClass:
      "border-indigo-500/25 bg-indigo-500/10 text-indigo-400 group-hover:border-indigo-500/60 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-hover:shadow-indigo-500/70 group-focus-visible:border-indigo-500/60 group-focus-visible:bg-indigo-500/20 group-focus-visible:shadow-[0_0_20px_-2px_var(--tw-shadow-color)] group-focus-visible:shadow-indigo-500/70",
    activeClass: "border-indigo-500/60 bg-indigo-500/15 text-indigo-400",
    cardHoverClass: "hover:border-indigo-500/30 focus-visible:border-indigo-500/30",
  },
];
