import { useEffect, useState } from "react";
import type { MembreRoster } from "./mockRoster";
import { OBJECTIFS_EQUIPAGE, type ObjectifEquipage } from "./mockTypesUnite";
import { indicatifEquipage, type Equipage, type StatutEquipage } from "./mockEquipages";

const STATUTS_EQUIPAGE: StatutEquipage[] = ["Actif", "En intervention", "Hors service"];

function toggleInArray(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function EditerEquipageModal({
  open,
  equipage,
  membresDisponibles,
  vehiculesDisponibles,
  onFermer,
  onEnregistrer,
  onDissoudre,
}: {
  open: boolean;
  equipage: Equipage | null;
  membresDisponibles: MembreRoster[];
  vehiculesDisponibles: string[];
  onFermer: () => void;
  onEnregistrer: (
    id: string,
    data: {
      membresIds: string[];
      objectif: ObjectifEquipage;
      cible: string;
      equipementLetal: boolean;
      equipementNonLetal: boolean;
      vehicule: string | null;
      statut: StatutEquipage;
    },
  ) => void;
  onDissoudre: (id: string) => void;
}): JSX.Element | null {
  const [statut, setStatut] = useState<StatutEquipage>("Actif");
  const [membresIds, setMembresIds] = useState<string[]>([]);
  const [objectif, setObjectif] = useState<ObjectifEquipage>("Traque");
  const [cible, setCible] = useState("");
  const [equipementLetal, setEquipementLetal] = useState(false);
  const [equipementNonLetal, setEquipementNonLetal] = useState(false);
  const [vehicule, setVehicule] = useState("");

  useEffect(() => {
    if (!open || !equipage) return;
    setStatut(equipage.statut);
    setMembresIds(equipage.membresIds);
    setObjectif(equipage.objectif);
    setCible(equipage.cible ?? "");
    setEquipementLetal(equipage.equipementLetal);
    setEquipementNonLetal(equipage.equipementNonLetal);
    setVehicule(equipage.vehicule ?? "");
  }, [open, equipage]);

  if (!open || !equipage) return null;

  function enregistrer() {
    if (!equipage) return;
    onEnregistrer(equipage.id, {
      membresIds,
      objectif,
      cible,
      equipementLetal,
      equipementNonLetal,
      vehicule: vehicule || null,
      statut,
    });
    onFermer();
  }

  function dissoudre() {
    if (!equipage) return;
    onDissoudre(equipage.id);
    onFermer();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-panel-border bg-panel-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-panel-text">Modifier {indicatifEquipage(equipage)}</h2>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="rounded-md px-2 py-1 text-panel-muted outline-none hover:text-panel-text focus-visible:bg-panel-border/60"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Statut
          </label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value as StatutEquipage)}
            className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none focus-visible:border-panel-accent"
          >
            {STATUTS_EQUIPAGE.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-panel-muted">Membres</p>
          {membresDisponibles.length === 0 ? (
            <p className="text-xs text-panel-muted">Aucun agent disponible.</p>
          ) : (
            <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-md border border-panel-border bg-panel-bg p-2">
              {membresDisponibles.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2 rounded px-1.5 py-1 text-xs text-panel-text hover:bg-panel-border/40"
                >
                  <input
                    type="checkbox"
                    checked={membresIds.includes(m.id)}
                    onChange={() => setMembresIds((prev) => toggleInArray(prev, m.id))}
                    className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent outline-none"
                  />
                  <span>{m.nom}</span>
                  <span className="text-panel-muted">#{m.matricule}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-panel-muted">Objectif</p>
          <div className="grid grid-cols-3 gap-2">
            {OBJECTIFS_EQUIPAGE.map((o) => {
              const actif = o === objectif;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => setObjectif(o)}
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium outline-none focus-visible:bg-panel-accent/20 ${
                    actif
                      ? "border-panel-accent bg-panel-accent/15 text-panel-text"
                      : "border-panel-border bg-panel-bg text-panel-muted hover:bg-panel-border/40"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={cible}
            onChange={(e) => setCible(e.target.value)}
            placeholder="Nom de la cible..."
            className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none placeholder:text-panel-muted focus-visible:border-panel-accent"
          />
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-panel-muted">Équipement</p>
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-xs text-panel-text">
              <input
                type="checkbox"
                checked={equipementLetal}
                onChange={(e) => setEquipementLetal(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent outline-none"
              />
              Armes d'épaule létales
            </label>
            <label className="flex items-center gap-2 text-xs text-panel-text">
              <input
                type="checkbox"
                checked={equipementNonLetal}
                onChange={(e) => setEquipementNonLetal(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent outline-none"
              />
              Armes d'épaule non létales
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Type de véhicule
          </label>
          <select
            value={vehicule}
            onChange={(e) => setVehicule(e.target.value)}
            className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none focus-visible:border-panel-accent"
          >
            <option value="">— Sélectionner —</option>
            {vehiculesDisponibles.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={dissoudre}
            className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 outline-none hover:bg-red-500/20 focus-visible:bg-red-500/20"
          >
            Dissoudre l'équipage
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onFermer}
              className="rounded-md border border-panel-border px-4 py-2 text-xs font-medium text-panel-text outline-none hover:bg-panel-border/40 focus-visible:bg-panel-border/40"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={enregistrer}
              className="rounded-md border border-panel-accent/40 bg-panel-accent/15 px-4 py-2 text-xs font-medium text-panel-text outline-none hover:bg-panel-accent/25 focus-visible:bg-panel-accent/25"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
