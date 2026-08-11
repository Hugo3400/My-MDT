import { IconShield } from "./icons";
import type { PersonneRechercheeApercu } from "./mockData";

export function WantedCard({ personne }: { personne: PersonneRechercheeApercu }) {
  return (
    <div className="overflow-hidden rounded-lg border border-panel-border bg-gradient-to-b from-[#10152a] to-panel-surface">
      <div className="flex items-center justify-between bg-[#0b0f1f] px-3 py-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-panel-muted">
            Recherché
          </p>
          <p className="text-xs font-extrabold tracking-wide text-panel-text">
            AVIS DE RECHERCHE
          </p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-panel-accent/40 text-panel-accent">
          <IconShield className="h-4 w-4" />
        </span>
      </div>

      <div className="flex gap-3 p-3">
        <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded border border-dashed border-panel-border bg-panel-bg text-panel-muted">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-panel-text">{personne.nom}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-panel-muted">
            Recherché pour
          </p>
          <p className="text-xs font-medium text-red-300">{personne.motif}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-panel-muted">Récompense</p>
          <p className="text-xs font-semibold text-panel-text">{personne.recompense}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 border-t border-panel-border px-3 py-2 text-[11px] text-panel-muted">
        <span>Âge {personne.age}</span>
        <span className="truncate text-right">{personne.affiliation ?? "Affiliation inconnue"}</span>
        <span className="col-span-2 truncate">
          Vu(e) : {personne.derniereLocalisation ?? "Inconnue"} · {personne.derniereDate}
        </span>
      </div>

      <div className="bg-red-600/90 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-white">
        {personne.caution}
      </div>
    </div>
  );
}
