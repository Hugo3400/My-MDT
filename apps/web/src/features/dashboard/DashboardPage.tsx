import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../shared/navigation";
import { WantedCard } from "../../shared/WantedCard";
import { mockRecherches } from "../../shared/mockData";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="grid flex-1 grid-cols-3 content-start gap-3 sm:grid-cols-4 xl:grid-cols-5">
        {NAV_ITEMS.map(({ to, label, description, Icon, tileClass, cardHoverClass }) => (
          <NavLink
            key={to}
            to={to}
            className={`group flex flex-col items-center gap-2 rounded-lg border border-transparent p-3 text-center outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-panel-surface focus-visible:-translate-y-0.5 focus-visible:bg-panel-surface ${cardHoverClass}`}
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-200 ${tileClass}`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-medium text-panel-text">{label}</span>
            <span className="hidden text-[10px] text-panel-muted sm:block">{description}</span>
          </NavLink>
        ))}
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-80">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-panel-muted">
          Avis de recherche récents
        </h2>
        {mockRecherches.map((personne) => (
          <WantedCard key={personne.id} personne={personne} />
        ))}
      </aside>
    </div>
  );
}
