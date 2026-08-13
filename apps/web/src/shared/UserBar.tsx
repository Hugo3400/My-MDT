import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { NAV_ITEMS } from "./navigation";
import { mockUtilisateurNomAffiche } from "./mockData";
import { IconHome, IconParametres } from "./icons";
import { ExpandableNav, type ExpandableNavItem } from "./ExpandableNav";

const EXPANDABLE_ITEMS: ExpandableNavItem[] = [
  { type: "link", to: "/dashboard", end: true, label: "Accueil", Icon: IconHome },
  { type: "separator" },
  ...NAV_ITEMS.map(
    ({ to, label, Icon, activeClass }): ExpandableNavItem => ({
      type: "link",
      to,
      label,
      Icon,
      activeClass,
    }),
  ),
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserBar() {
  const { organismeActif, deconnecter } = useAuth();

  return (
    <footer className="flex h-14 shrink-0 items-center justify-between gap-3 border-t border-panel-border bg-panel-surface px-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-panel-accent/40 bg-panel-accent/15 text-xs font-semibold text-panel-text">
          {initials(mockUtilisateurNomAffiche)}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-panel-text">
            {mockUtilisateurNomAffiche.toUpperCase()}
          </p>
          <p className="truncate text-[11px] text-panel-muted">
            {organismeActif?.gradeNom ?? "—"} · {organismeActif?.organismeCode ?? "—"}
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <ExpandableNav items={EXPANDABLE_ITEMS} />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <NavLink
          to="/parametres"
          title="Paramètres"
          className={({ isActive }) =>
            `flex h-9 w-9 items-center justify-center rounded-md border outline-none transition-colors focus-visible:border-panel-accent/60 focus-visible:bg-panel-accent/15 focus-visible:text-panel-accent ${
              isActive
                ? "border-panel-accent/60 bg-panel-accent/15 text-panel-accent"
                : "border-panel-border text-panel-muted hover:text-panel-text"
            }`
          }
        >
          <IconParametres className="h-4 w-4" />
        </NavLink>
        <button
          type="button"
          onClick={deconnecter}
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 outline-none transition-colors hover:bg-red-500/20 focus-visible:bg-red-500/25"
        >
          Déconnexion
        </button>
      </div>
    </footer>
  );
}
