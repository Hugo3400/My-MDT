import { useState } from "react";
import {
  OPERATION_STATUT_STYLE,
  TYPES_OPERATION,
  mockOperations,
  type Operation,
  type OperationStatut,
} from "./mockOperations";
import { indicatifEquipage, type Equipage } from "../dispatch/mockEquipages";
import { useDispatchState } from "../../shared/dispatchContext";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";

const STATUT_SUIVANT: Record<OperationStatut, OperationStatut> = {
  Planifiée: "En cours",
  "En cours": "Terminée",
  Terminée: "Terminée",
  Annulée: "Annulée",
};

function NouvelleOperationForm({
  equipages,
  onCreer,
  onFermer,
}: {
  equipages: Equipage[];
  onCreer: (op: Omit<Operation, "id" | "statut">) => void;
  onFermer: () => void;
}) {
  const [nom, setNom] = useState("");
  const [type, setType] = useState(TYPES_OPERATION[0]);
  const [objectif, setObjectif] = useState("");
  const [dateDebutPrevue, setDateDebutPrevue] = useState("");
  const [unitesAssignees, setUnitesAssignees] = useState<string[]>([]);

  return (
    <div className="rounded-lg border border-panel-accent/30 bg-panel-accent/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-panel-text">Planifier une opération</h2>
        <button type="button" onClick={onFermer} className="text-xs text-panel-muted hover:text-panel-text">
          Annuler
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-panel-muted">
          Nom
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="rounded border border-panel-border bg-panel-bg px-2 py-1.5 text-sm text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-panel-muted">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded border border-panel-border bg-panel-bg px-2 py-1.5 text-sm text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent"
          >
            {TYPES_OPERATION.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-panel-muted sm:col-span-2">
          Objectif
          <textarea
            value={objectif}
            onChange={(e) => setObjectif(e.target.value)}
            rows={2}
            className="rounded border border-panel-border bg-panel-bg px-2 py-1.5 text-sm text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-panel-muted">
          Date/heure prévue
          <input
            value={dateDebutPrevue}
            onChange={(e) => setDateDebutPrevue(e.target.value)}
            placeholder="12/08/2026 20:00"
            className="rounded border border-panel-border bg-panel-bg px-2 py-1.5 text-sm text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent"
          />
        </label>
        <div>
          <p className="mb-1 text-xs text-panel-muted">Équipages assignés</p>
          <div className="flex flex-wrap gap-2">
            {equipages.map((eq) => {
              const indicatif = indicatifEquipage(eq);
              return (
                <label key={eq.id} className="flex items-center gap-1.5 text-xs text-panel-text">
                  <input
                    type="checkbox"
                    checked={unitesAssignees.includes(indicatif)}
                    onChange={() =>
                      setUnitesAssignees((prev) =>
                        prev.includes(indicatif)
                          ? prev.filter((v) => v !== indicatif)
                          : [...prev, indicatif],
                      )
                    }
                    className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent"
                  />
                  {indicatif}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!nom || !objectif || !dateDebutPrevue}
        onClick={() =>
          onCreer({
            nom,
            type,
            objectif,
            dateDebutPrevue,
            responsable: mockUtilisateurNomAffiche,
            unitesAssignees,
          })
        }
        className="mt-4 rounded-md border border-panel-accent/40 bg-panel-accent/15 px-4 py-2 text-xs font-medium text-panel-text hover:bg-panel-accent/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Créer l'opération
      </button>
    </div>
  );
}

export function OperationsPage() {
  const { equipages } = useDispatchState();
  const [operations, setOperations] = useState<Operation[]>(mockOperations);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  function creerOperation(data: Omit<Operation, "id" | "statut">) {
    setOperations((prev) => [{ id: crypto.randomUUID(), statut: "Planifiée", ...data }, ...prev]);
    setFormulaireOuvert(false);
  }

  function avancerStatut(id: string) {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, statut: STATUT_SUIVANT[op.statut] } : op)),
    );
  }

  function annulerOperation(id: string) {
    setOperations((prev) => prev.map((op) => (op.id === id ? { ...op, statut: "Annulée" } : op)));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-panel-text">Opérations</h1>
          <p className="text-xs text-panel-muted">
            Missions planifiées à l'avance — distinctes des interventions réactives du Dispatch.
          </p>
        </div>
        {!formulaireOuvert && (
          <button
            type="button"
            onClick={() => setFormulaireOuvert(true)}
            className="rounded border border-panel-border px-2 py-1 text-[11px] text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
          >
            + Planifier une opération
          </button>
        )}
      </div>

      {formulaireOuvert && (
        <NouvelleOperationForm
          equipages={equipages}
          onCreer={creerOperation}
          onFermer={() => setFormulaireOuvert(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {operations.map((op) => {
          const style = OPERATION_STATUT_STYLE[op.statut];
          const active = op.statut !== "Terminée" && op.statut !== "Annulée";
          return (
            <div key={op.id} className="rounded-lg border border-panel-border bg-panel-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-panel-text">{op.nom}</p>
                  <p className="text-xs text-panel-muted">{op.type}</p>
                </div>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}>
                  {op.statut}
                </span>
              </div>

              <p className="mt-2 text-sm text-panel-text">{op.objectif}</p>

              <div className="mt-3 grid grid-cols-2 gap-y-1 text-[11px] text-panel-muted">
                <span>Début prévu</span>
                <span className="text-right text-panel-text">{op.dateDebutPrevue}</span>
                <span>Responsable</span>
                <span className="text-right text-panel-text">{op.responsable}</span>
                <span>Unités assignées</span>
                <span className="text-right text-panel-text">
                  {op.unitesAssignees.length > 0 ? op.unitesAssignees.join(", ") : "Aucune"}
                </span>
              </div>

              {active && (
                <div className="mt-3 flex gap-2 border-t border-panel-border pt-3">
                  <button
                    type="button"
                    onClick={() => avancerStatut(op.id)}
                    className="rounded-md border border-panel-border px-3 py-1.5 text-xs text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
                  >
                    {op.statut === "Planifiée" ? "Démarrer" : "Marquer terminée"}
                  </button>
                  <button
                    type="button"
                    onClick={() => annulerOperation(op.id)}
                    className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
