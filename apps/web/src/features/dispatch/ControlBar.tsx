function IconOperateur() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-panel-muted">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19.5c0-3.6 3.13-6 7-6s7 2.4 7 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevronBas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0 text-panel-muted">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAntenne() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0 text-panel-muted">
      <path d="M12 21V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.4" fill="currentColor" />
      <path
        d="M8.2 10.2a5.4 5.4 0 0 1 7.6 0M5.7 7.7a9 9 0 0 1 12.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCrayon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
      <path
        d="M4 20l.9-3.6L15.6 5.7a1.6 1.6 0 0 1 2.3 0l.4.4a1.6 1.6 0 0 1 0 2.3L7.6 19.1 4 20z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.2 7.1l2.7 2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoutonDeroulantDecoratif({ libelle }: { libelle: string }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-bg/60 px-3 py-1.5 text-left outline-none transition-colors hover:bg-panel-bg focus-visible:bg-panel-bg focus-visible:border-panel-accent"
    >
      <IconOperateur />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-panel-muted">
          {libelle}
        </span>
        <span className="text-xs text-panel-text">Non assigné</span>
      </span>
      <IconChevronBas />
    </button>
  );
}

const canauxRadio = [
  { libelle: "Canal 1 Global", numero: 682 },
  { libelle: "Canal FTF", numero: 683 },
  { libelle: "Canal MCU", numero: 684 },
  { libelle: "Canal SOG", numero: 685 },
  { libelle: "Canal WITSEC", numero: 686 },
];

export function ControlBar({
  onOuvrirCreerEquipage,
  suisEnService,
  onTogglePriseDeService,
}: {
  onOuvrirCreerEquipage: () => void;
  suisEnService: boolean;
  onTogglePriseDeService: () => void;
}): JSX.Element {
  return (
    <div className="w-full border-b border-panel-border bg-panel-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-panel-border px-4 py-2">
        <div className="flex items-center gap-2">
          <BoutonDeroulantDecoratif libelle="Supervisor Control" />
          <BoutonDeroulantDecoratif libelle="AST Supervisor Control" />
        </div>

        <button
          type="button"
          onClick={onOuvrirCreerEquipage}
          className="flex items-center gap-1.5 rounded-md border border-panel-accent bg-panel-accent px-4 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-panel-accent/90 focus-visible:bg-panel-accent/90 focus-visible:border-panel-text"
        >
          <IconPlus />
          Créer un équipage
        </button>

        <div className="flex items-center gap-2">
          <BoutonDeroulantDecoratif libelle="Operator" />
          <BoutonDeroulantDecoratif libelle="Assist. Operator" />
        </div>

        <button
          type="button"
          onClick={onTogglePriseDeService}
          className={
            suisEnService
              ? "rounded-md border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-400 outline-none transition-colors hover:bg-red-500/25 focus-visible:bg-red-500/25 focus-visible:border-red-400"
              : "rounded-md border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400 outline-none transition-colors hover:bg-emerald-500/25 focus-visible:bg-emerald-500/25 focus-visible:border-emerald-400"
          }
        >
          {suisEnService ? "Quitter le service" : "Prise de service"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-panel-muted">
          <IconAntenne />
          Fréquences
        </span>

        <div className="flex flex-wrap items-center gap-2 text-xs text-panel-text">
          {canauxRadio.map((canal, index) => (
            <span key={canal.libelle} className="flex items-center gap-2">
              {index > 0 && <span className="text-panel-border">|</span>}
              <span>
                {canal.libelle} : {canal.numero}
              </span>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="ml-auto flex items-center justify-center rounded-md border border-transparent p-1 text-panel-muted outline-none transition-colors hover:bg-panel-bg hover:text-panel-text focus-visible:bg-panel-bg focus-visible:border-panel-border focus-visible:text-panel-text"
        >
          <IconCrayon />
        </button>
      </div>
    </div>
  );
}
