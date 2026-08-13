import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../shared/navigation";
import { useRapportsState } from "../../shared/rapportsContext";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";
import { AvisRechercheSection } from "./AvisRechercheSection";

export function DashboardPage() {
  const { rapports } = useRapportsState();
  const rapportsEnAttente = rapports.filter(
    (r) => r.statut === "Soumis" || (r.statut === "À corriger" && r.auteur === mockUtilisateurNomAffiche),
  ).length;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="grid flex-1 grid-cols-3 content-start gap-3 sm:grid-cols-4 xl:grid-cols-5">
        {NAV_ITEMS.map(({ to, label, description, Icon, tileClass, cardHoverClass }) => (
          <NavLink
            key={to}
            to={to}
            className={`group relative flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 text-center outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-panel-surface focus-visible:-translate-y-0.5 focus-visible:bg-panel-surface ${cardHoverClass}`}
          >
            <span
              className={`relative flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-200 ${tileClass}`}
            >
              <Icon className="h-6 w-6" />
              {to === "/rapports" && rapportsEnAttente > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-panel-bg bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {rapportsEnAttente}
                </span>
              )}
            </span>
            <span className="text-xs font-medium text-panel-text">{label}</span>
            <span className="hidden text-[10px] text-panel-muted sm:block">{description}</span>
          </NavLink>
        ))}
      </div>

      <aside className="w-full shrink-0 lg:w-80">
        <AvisRechercheSection />
      </aside>
    </div>
  );
}
