import type { MembreRoster } from "./mockRoster";

function initiales(nom: string): string {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function EtatVide() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <svg
        className="h-10 w-10 text-panel-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 20c1.2-3.6 4-5.5 6.5-5.5s5.3 1.9 6.5 5.5" />
        <line x1="4" y1="4" x2="20" y2="20" />
      </svg>
      <p className="text-xs text-panel-muted">Aucun agent</p>
    </div>
  );
}

function LigneMembre({ membre }: { membre: MembreRoster }) {
  return (
    <li className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-panel-bg/60">
      <div className="relative flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-panel-accent/20 text-[11px] font-semibold text-panel-accent">
          {initiales(membre.nom)}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel-surface bg-emerald-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-panel-text">{membre.nom}</p>
        <p className="text-[11px] text-panel-muted">Matricule {membre.matricule}</p>
      </div>
    </li>
  );
}

export function EnServicePanel({ membres }: { membres: MembreRoster[] }): JSX.Element {
  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col rounded-lg border border-panel-border bg-panel-surface">
      <div className="flex items-center justify-between border-b border-panel-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-panel-text">
          En service
        </h2>
        <span className="rounded-full bg-panel-accent/15 px-2 py-0.5 text-[11px] font-semibold text-panel-accent">
          {membres.length}
        </span>
      </div>

      {membres.length === 0 ? (
        <EtatVide />
      ) : (
        <ul className="flex-1 overflow-y-auto px-2 py-2">
          {membres.map((membre) => (
            <LigneMembre key={membre.id} membre={membre} />
          ))}
        </ul>
      )}
    </div>
  );
}
