import { useMemo, useState } from "react";
import {
  STATUT_RAPPORT_OPTIONS,
  STATUT_RAPPORT_STYLE,
  type CategorieRapport,
  type Rapport,
  type RapportStatut,
} from "./mockRapports";

function dateCreationEnISO(createdAt: string): string {
  const [datePart] = createdAt.split(" ");
  const [jour, mois, annee] = datePart.split("/");
  return `${annee}-${mois}-${jour}`;
}

export function RapportsListPanel({
  rapports,
  categories,
  selectedId,
  onSelect,
  onNouveauRapport,
  currentUser,
}: {
  rapports: Rapport[];
  categories: CategorieRapport[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNouveauRapport: () => void;
  currentUser: string;
}): JSX.Element {
  const [recherche, setRecherche] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [statut, setStatut] = useState<RapportStatut | "">("");
  const [portee, setPortee] = useState<"tous" | "mes_rapports">("tous");
  const [auteur, setAuteur] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [filtresAvancesOuverts, setFiltresAvancesOuverts] = useState(false);

  const auteurs = useMemo(() => {
    return Array.from(new Set(rapports.map((rapport) => rapport.auteur))).sort((a, b) => a.localeCompare(b));
  }, [rapports]);

  const rapportsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return rapports
      .filter((rapport) => {
        if (terme && !rapport.titre.toLowerCase().includes(terme) && !rapport.numero.toLowerCase().includes(terme)) {
          return false;
        }
        if (categorieId && rapport.categorieId !== categorieId) return false;
        if (statut && rapport.statut !== statut) return false;
        if (portee === "mes_rapports" && rapport.auteur !== currentUser) return false;
        if (auteur && rapport.auteur !== auteur) return false;
        if (dateDebut || dateFin) {
          const dateRapport = dateCreationEnISO(rapport.createdAt);
          if (dateDebut && dateRapport < dateDebut) return false;
          if (dateFin && dateRapport > dateFin) return false;
        }
        return true;
      })
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  }, [rapports, recherche, categorieId, statut, portee, auteur, dateDebut, dateFin, currentUser]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-panel-border p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-panel-text">Rapports</h2>
          <span className="rounded-full bg-panel-border/60 px-2 py-0.5 text-[11px] text-panel-muted">
            {rapportsFiltres.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onNouveauRapport}
          className="rounded-md border border-panel-accent/40 bg-panel-accent/15 px-2.5 py-1.5 text-xs font-medium text-panel-accent outline-none transition-colors hover:bg-panel-accent/25 focus-visible:bg-panel-accent/25 focus-visible:border-panel-accent"
        >
          + Nouveau rapport
        </button>
      </div>

      <div className="flex flex-col gap-2 border-b border-panel-border p-3">
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un rapport..."
          className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-text outline-none placeholder:text-panel-muted transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
        />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="w-full appearance-none rounded-md border border-panel-border bg-panel-bg py-1.5 pl-2 pr-6 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-panel-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="relative flex-1">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value as RapportStatut | "")}
              className="w-full appearance-none rounded-md border border-panel-border bg-panel-bg py-1.5 pl-2 pr-6 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
            >
              <option value="">Tous les statuts</option>
              {STATUT_RAPPORT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-panel-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 rounded-md border border-panel-border bg-panel-bg p-0.5">
            <button
              type="button"
              onClick={() => setPortee("tous")}
              className={`rounded px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:text-panel-accent ${
                portee === "tous" ? "bg-panel-accent/15 text-panel-accent" : "text-panel-muted hover:text-panel-text"
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setPortee("mes_rapports")}
              className={`rounded px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:text-panel-accent ${
                portee === "mes_rapports" ? "bg-panel-accent/15 text-panel-accent" : "text-panel-muted hover:text-panel-text"
              }`}
            >
              Mes rapports
            </button>
          </div>
          <button
            type="button"
            onClick={() => setFiltresAvancesOuverts((ouvert) => !ouvert)}
            className="shrink-0 rounded-md border border-panel-border px-2.5 py-1 text-xs font-medium text-panel-muted outline-none transition-colors hover:border-panel-accent/50 hover:text-panel-text focus-visible:border-panel-accent focus-visible:text-panel-accent"
          >
            {filtresAvancesOuverts ? "Masquer les filtres" : "Filtres avancés"}
          </button>
        </div>
        {filtresAvancesOuverts && (
          <div className="flex flex-col gap-2 rounded-md border border-panel-border bg-panel-bg/60 p-2">
            <div className="relative">
              <select
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                className="w-full appearance-none rounded-md border border-panel-border bg-panel-bg py-1.5 pl-2 pr-6 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
              >
                <option value="">Tous les auteurs</option>
                {auteurs.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-panel-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex flex-1 flex-col gap-1 text-[11px] text-panel-muted">
                Du
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full rounded-md border border-panel-border bg-panel-bg px-2 py-1.5 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[11px] text-panel-muted">
                Au
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full rounded-md border border-panel-border bg-panel-bg px-2 py-1.5 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {rapportsFiltres.length === 0 ? (
          <p className="flex h-full items-center justify-center text-center text-sm text-panel-muted">
            Aucun rapport ne correspond à ces filtres.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {rapportsFiltres.map((rapport) => {
              const style = STATUT_RAPPORT_STYLE[rapport.statut];
              const categorie = categories.find((c) => c.id === rapport.categorieId);
              const selected = rapport.id === selectedId;
              return (
                <li key={rapport.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(rapport.id)}
                    className={`w-full rounded-md border px-3 py-2 text-left outline-none transition-colors ${
                      selected
                        ? "border-panel-accent/50 bg-panel-surface"
                        : "border-panel-border bg-panel-bg hover:bg-panel-surface"
                    } focus-visible:border-panel-accent/50 focus-visible:bg-panel-surface`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-panel-muted">{rapport.numero}</span>
                      <span className="flex shrink-0 items-center gap-1">
                        {rapport.confidentiel && (
                          <span
                            className="rounded border border-red-500/30 bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-400"
                            title="Rapport confidentiel"
                          >
                            🔒 Confidentiel
                          </span>
                        )}
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${style.bg} ${style.text} ${style.border}`}
                        >
                          {rapport.statut}
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-panel-text">{rapport.titre}</p>
                    <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-panel-muted">
                      <span className="truncate">{categorie?.nom ?? "Catégorie inconnue"}</span>
                      <span className="shrink-0">{rapport.auteur}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
