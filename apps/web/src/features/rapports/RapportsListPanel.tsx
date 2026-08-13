import { useMemo, useState } from "react";
import {
  STATUT_RAPPORT_OPTIONS,
  STATUT_RAPPORT_STYLE,
  type CategorieRapport,
  type Rapport,
  type RapportStatut,
} from "./mockRapports";

export function RapportsListPanel({
  rapports,
  categories,
  selectedId,
  onSelect,
  onNouveauRapport,
}: {
  rapports: Rapport[];
  categories: CategorieRapport[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNouveauRapport: () => void;
}): JSX.Element {
  const [recherche, setRecherche] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [statut, setStatut] = useState<RapportStatut | "">("");

  const rapportsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return rapports
      .filter((rapport) => {
        if (terme && !rapport.titre.toLowerCase().includes(terme) && !rapport.numero.toLowerCase().includes(terme)) {
          return false;
        }
        if (categorieId && rapport.categorieId !== categorieId) return false;
        if (statut && rapport.statut !== statut) return false;
        return true;
      })
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  }, [rapports, recherche, categorieId, statut]);

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
          <select
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            className="flex-1 rounded-md border border-panel-border bg-panel-bg px-2 py-1.5 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom}
              </option>
            ))}
          </select>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value as RapportStatut | "")}
            className="flex-1 rounded-md border border-panel-border bg-panel-bg px-2 py-1.5 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
          >
            <option value="">Tous les statuts</option>
            {STATUT_RAPPORT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
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
                      <span
                        className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${style.bg} ${style.text} ${style.border}`}
                      >
                        {rapport.statut}
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
