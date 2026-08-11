import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { NAV_ITEMS } from "./navigation";
import { mockUtilisateurNomAffiche } from "./mockData";
import { IconHome } from "./icons";

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

      <nav className="hidden items-center gap-1 md:flex">
        <NavLink
          to="/dashboard"
          end
          title="Accueil"
          className={({ isActive }) =>
            `flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
              isActive
                ? "border-panel-accent/60 bg-panel-accent/15 text-panel-accent"
                : "border-transparent text-panel-muted hover:border-panel-border hover:text-panel-text"
            }`
          }
        >
          <IconHome className="h-4 w-4" />
        </NavLink>
        <span className="mx-1 h-5 w-px bg-panel-border" aria-hidden="true" />
        {NAV_ITEMS.map(({ to, label, Icon, activeClass }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                isActive
                  ? activeClass
                  : "border-transparent text-panel-muted hover:border-panel-border hover:text-panel-text"
              }`
            }
          >
            <Icon className="h-4 w-4" />
          </NavLink>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={deconnecter}
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20"
        >
          Déconnexion
        </button>
      </div>
    </footer>
  );
}
