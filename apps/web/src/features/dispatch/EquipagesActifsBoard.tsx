import { indicatifEquipage, STATUT_EQUIPAGE_STYLE, type Equipage } from "./mockEquipages";
import { trouverMembre, type SectionRoster } from "./mockRoster";

function EtatVide() {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <svg
        className="h-12 w-12 text-panel-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="8.5" cy="7.5" r="2.5" />
        <path d="M2.5 19c0.9-3 2.9-4.75 6-4.75s5.1 1.75 6 4.75" />
        <circle cx="16.5" cy="8" r="2.25" />
        <path d="M15 14.6c2.6 0.35 4.15 1.95 4.9 4.4" />
      </svg>
      <p className="text-sm font-bold text-panel-text">AUCUN ÉQUIPAGE ACTIF</p>
      <p className="text-xs text-panel-muted">Créez un équipage pour commencer</p>
    </div>
  );
}

function NomsMembres({ membresIds, sections }: { membresIds: string[]; sections: SectionRoster[] }) {
  if (membresIds.length === 0) {
    return <p className="text-sm text-panel-muted">Aucun membre affecté</p>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {membresIds.map((id) => {
        const membre = trouverMembre(sections, id);
        return (
          <span
            key={id}
            className="rounded bg-panel-bg px-2 py-0.5 text-xs text-panel-text"
          >
            {membre ? membre.nom : "Agent inconnu"}
          </span>
        );
      })}
    </div>
  );
}

function CarteEquipage({
  equipage,
  sections,
  onDissoudre,
  onEditer,
}: {
  equipage: Equipage;
  sections: SectionRoster[];
  onDissoudre?: (id: string) => void;
  onEditer?: (equipage: Equipage) => void;
}) {
  const style = STATUT_EQUIPAGE_STYLE[equipage.statut];
  const engagement = equipage.interventionLiee
    ? `Engagé sur l'intervention ${equipage.interventionLiee}`
    : equipage.operationLiee
      ? `Sur l'opération « ${equipage.operationLiee} »`
      : null;

  return (
    <div className={`flex flex-col gap-3 rounded-lg border ${style.border} bg-panel-surface p-4`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          <h3 className="text-sm font-bold text-panel-text">{indicatifEquipage(equipage)}</h3>
        </div>
        <span className={`text-xs font-medium ${style.text}`}>{equipage.statut}</span>
      </div>

      <NomsMembres membresIds={equipage.membresIds} sections={sections} />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded bg-panel-accent/15 px-2 py-0.5 text-[11px] font-semibold text-panel-accent">
          {equipage.objectif}
        </span>
        {equipage.cible && <span className="text-xs text-panel-muted">{equipage.cible}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {equipage.equipementLetal && (
          <span className="rounded border border-red-500/30 px-2 py-0.5 text-[11px] font-medium text-red-400">
            Létal
          </span>
        )}
        {equipage.equipementNonLetal && (
          <span className="rounded border border-yellow-500/30 px-2 py-0.5 text-[11px] font-medium text-yellow-400">
            Non létal
          </span>
        )}
        <span className="text-xs text-panel-muted">
          {equipage.vehicule ? equipage.vehicule : "À pied"}
        </span>
      </div>

      {engagement && <p className="text-xs font-medium text-orange-400">{engagement}</p>}

      <div className="mt-1 flex gap-2">
        {onEditer && (
          <button
            type="button"
            onClick={() => onEditer(equipage)}
            className="self-start rounded border border-panel-border px-3 py-1.5 text-xs font-medium text-panel-muted outline-none transition-colors hover:border-panel-accent/50 hover:text-panel-text focus-visible:border-panel-accent/50 focus-visible:text-panel-text"
          >
            Éditer
          </button>
        )}
        {onDissoudre && (
          <button
            type="button"
            onClick={() => onDissoudre(equipage.id)}
            className="self-start rounded border border-panel-border px-3 py-1.5 text-xs font-medium text-panel-muted outline-none transition-colors hover:border-red-500/40 hover:text-red-400 focus-visible:border-red-500/40 focus-visible:text-red-400"
          >
            Dissoudre
          </button>
        )}
      </div>
    </div>
  );
}

export function EquipagesActifsBoard({
  equipages,
  sections,
  onDissoudre,
  onEditer,
}: {
  equipages: Equipage[];
  sections: SectionRoster[];
  onDissoudre?: (id: string) => void;
  onEditer?: (equipage: Equipage) => void;
}): JSX.Element {
  if (equipages.length === 0) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <EtatVide />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {equipages.map((equipage) => (
        <CarteEquipage
          key={equipage.id}
          equipage={equipage}
          sections={sections}
          onDissoudre={onDissoudre}
          onEditer={onEditer}
        />
      ))}
    </div>
  );
}
