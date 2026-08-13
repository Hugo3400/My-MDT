import { effectifTotal, type SectionRoster } from "./mockRoster";

function initiales(nom: string): string {
  const parties = nom.trim().split(/\s+/);
  if (parties.length === 1) return parties[0].slice(0, 2).toUpperCase();
  return (parties[0][0] + parties[parties.length - 1][0]).toUpperCase();
}

export function EffectifGlobalPanel({
  sections,
  enServiceIds,
  onTogglePriseDeService,
}: {
  sections: SectionRoster[];
  enServiceIds: string[];
  onTogglePriseDeService: (membreId: string) => void;
}): JSX.Element {
  return (
    <div className="flex h-full w-72 flex-col border-r border-panel-border bg-panel-surface">
      <div className="flex items-center justify-between border-b border-panel-border px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-panel-text">EFFECTIF GLOBAL</h2>
        <span className="rounded-full bg-panel-bg px-2 py-0.5 text-xs font-medium text-panel-muted">
          {effectifTotal(sections)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.titre}>
            <div className="sticky top-0 bg-panel-bg px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-panel-muted">
              {section.titre}
            </div>
            <div>
              {section.membres.map((membre) => {
                const enService = enServiceIds.includes(membre.id);
                return (
                  <button
                    key={membre.id}
                    type="button"
                    onClick={() => onTogglePriseDeService(membre.id)}
                    className={`flex w-full items-center gap-2.5 border-b border-panel-border/50 px-4 py-2 text-left outline-none transition-colors hover:bg-panel-bg focus-visible:bg-panel-bg ${
                      enService ? "bg-panel-accent/10" : ""
                    }`}
                  >
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-border text-xs font-semibold text-panel-text">
                      {initiales(membre.nom)}
                      {enService && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel-surface bg-emerald-500" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-panel-text">{membre.nom}</span>
                    </span>
                    <span className="shrink-0 rounded bg-panel-bg px-1.5 py-0.5 text-[11px] font-medium text-panel-muted">
                      #{membre.matricule}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
