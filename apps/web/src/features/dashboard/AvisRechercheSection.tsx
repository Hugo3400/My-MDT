import { useState } from "react";
import { WantedCard } from "../../shared/WantedCard";
import { mockRecherches, type PersonneRechercheeApercu } from "../../shared/mockData";

function ChevronIcon({ ouvert }: { ouvert: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 shrink-0 text-panel-muted transition-transform ${ouvert ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function grouperParMotif(liste: PersonneRechercheeApercu[]): [string, PersonneRechercheeApercu[]][] {
  const groupes = new Map<string, PersonneRechercheeApercu[]>();
  for (const personne of liste) {
    const existant = groupes.get(personne.motif) ?? [];
    existant.push(personne);
    groupes.set(personne.motif, existant);
  }
  return Array.from(groupes.entries());
}

export function AvisRechercheSection() {
  const groupes = grouperParMotif(mockRecherches);
  const [ouverts, setOuverts] = useState<Record<string, boolean>>(
    Object.fromEntries(groupes.map(([motif]) => [motif, true])),
  );

  function toggle(motif: string) {
    setOuverts((prev) => ({ ...prev, [motif]: !prev[motif] }));
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-panel-muted">
        Avis de recherche récents
      </h2>
      {groupes.map(([motif, personnes]) => {
        const estOuvert = ouverts[motif] ?? true;
        return (
          <div key={motif} className="rounded-lg border border-panel-border bg-panel-surface">
            <button
              type="button"
              onClick={() => toggle(motif)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left outline-none transition-colors hover:bg-panel-bg focus-visible:bg-panel-bg"
            >
              <span className="flex items-center gap-2 text-xs font-medium text-panel-text">
                {motif}
                <span className="rounded-full bg-panel-bg px-1.5 py-0.5 text-[10px] text-panel-muted">
                  {personnes.length}
                </span>
              </span>
              <ChevronIcon ouvert={estOuvert} />
            </button>
            {estOuvert && (
              <div className="flex flex-col gap-2 px-2 pb-2">
                {personnes.map((personne) => (
                  <WantedCard key={personne.id} personne={personne} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
