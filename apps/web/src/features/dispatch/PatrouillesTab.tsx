import { useMemo, useState } from "react";
import {
  AGENTS_DISPONIBLES,
  ARMEMENT_DISPONIBLE,
  STATUT_PATROUILLE_OPTIONS,
  STATUT_PATROUILLE_STYLE,
  VEHICULES_DISPONIBLES,
  type Patrouille,
  type StatutPatrouille,
} from "./mockPatrouilles";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";

function toggleInArray(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function PrendreServiceForm({
  vehiculesLibres,
  onValider,
}: {
  vehiculesLibres: string[];
  onValider: (data: { coequipiers: string[]; vehicule: string | null; armement: string[] }) => void;
}) {
  const [coequipiers, setCoequipiers] = useState<string[]>([]);
  const [vehicule, setVehicule] = useState<string>("");
  const [armement, setArmement] = useState<string[]>([]);

  return (
    <div className="rounded-lg border border-panel-accent/30 bg-panel-accent/5 p-4">
      <h2 className="text-sm font-semibold text-panel-text">Prendre mon service</h2>
      <p className="mt-1 text-xs text-panel-muted">
        Déclare ton coéquipier, ton véhicule et ton armement avant de passer en service.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-1 text-xs font-medium text-panel-muted">Coéquipier(s)</p>
          <div className="flex flex-col gap-1">
            {AGENTS_DISPONIBLES.map((agent) => (
              <label key={agent} className="flex items-center gap-2 text-xs text-panel-text">
                <input
                  type="checkbox"
                  checked={coequipiers.includes(agent)}
                  onChange={() => setCoequipiers((prev) => toggleInArray(prev, agent))}
                  className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent"
                />
                {agent}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-panel-muted">Véhicule</p>
          <select
            value={vehicule}
            onChange={(e) => setVehicule(e.target.value)}
            className="w-full rounded border border-panel-border bg-panel-bg px-2 py-1.5 text-xs text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent"
          >
            <option value="">— À pied —</option>
            {vehiculesLibres.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-panel-muted">Armement</p>
          <div className="flex flex-col gap-1">
            {ARMEMENT_DISPONIBLE.map((arme) => (
              <label key={arme} className="flex items-center gap-2 text-xs text-panel-text">
                <input
                  type="checkbox"
                  checked={armement.includes(arme)}
                  onChange={() => setArmement((prev) => toggleInArray(prev, arme))}
                  className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent"
                />
                {arme}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onValider({ coequipiers, vehicule: vehicule || null, armement })}
        className="mt-4 rounded-md border border-panel-accent/40 bg-panel-accent/15 px-4 py-2 text-xs font-medium text-panel-text hover:bg-panel-accent/25"
      >
        Prendre le service
      </button>
    </div>
  );
}

function PatrouilleCard({
  patrouille,
  estLaMienne,
  onChangerStatut,
  onQuitter,
}: {
  patrouille: Patrouille;
  estLaMienne: boolean;
  onChangerStatut: (statut: StatutPatrouille) => void;
  onQuitter?: () => void;
}) {
  const style = STATUT_PATROUILLE_STYLE[patrouille.statut];

  return (
    <div
      className={`rounded-lg border bg-panel-surface p-3 ${
        estLaMienne ? "border-panel-accent/50" : "border-panel-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-panel-text">{patrouille.indicatif}</span>
        <select
          value={patrouille.statut}
          onChange={(e) => onChangerStatut(e.target.value as StatutPatrouille)}
          className={`rounded border bg-panel-bg px-1.5 py-0.5 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-panel-accent ${style.border} ${style.text}`}
        >
          {STATUT_PATROUILLE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-xs text-panel-text">{patrouille.membres.join(" · ")}</p>
      <p className="mt-1 text-xs text-panel-muted">
        {patrouille.vehicule ?? "À pied"} · en service depuis {patrouille.depuis}
      </p>

      {patrouille.armement.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {patrouille.armement.map((arme) => (
            <span
              key={arme}
              className="rounded bg-panel-bg px-1.5 py-0.5 text-[10px] text-panel-muted"
            >
              {arme}
            </span>
          ))}
        </div>
      )}

      {(patrouille.interventionLiee || patrouille.operationLiee) && (
        <p className="mt-2 text-[11px] font-medium text-orange-300">
          {patrouille.interventionLiee
            ? `Engagée sur l'intervention ${patrouille.interventionLiee}`
            : `Sur l'opération « ${patrouille.operationLiee} »`}
        </p>
      )}

      <p className="mt-2 text-[10px] text-panel-muted">Déclarée par {patrouille.declarePar}</p>

      {estLaMienne && onQuitter && (
        <button
          type="button"
          onClick={onQuitter}
          className="mt-3 w-full rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
        >
          Quitter le service
        </button>
      )}
    </div>
  );
}

export function PatrouillesTab({
  patrouilles,
  setPatrouilles,
}: {
  patrouilles: Patrouille[];
  setPatrouilles: React.Dispatch<React.SetStateAction<Patrouille[]>>;
}) {
  const maPatrouille = patrouilles.find(
    (p) => p.membres.includes(mockUtilisateurNomAffiche) && p.statut !== "Hors service",
  );

  const vehiculesLibres = useMemo(
    () =>
      VEHICULES_DISPONIBLES.filter(
        (v) => !patrouilles.some((p) => p.vehicule === v && p.statut !== "Hors service"),
      ),
    [patrouilles],
  );

  function changerStatut(id: string, statut: StatutPatrouille) {
    setPatrouilles((prev) => prev.map((p) => (p.id === id ? { ...p, statut } : p)));
  }

  function quitterService(id: string) {
    setPatrouilles((prev) => prev.map((p) => (p.id === id ? { ...p, statut: "Hors service" } : p)));
  }

  function prendreService(data: { coequipiers: string[]; vehicule: string | null; armement: string[] }) {
    const indicatif = `1-${mockUtilisateurNomAffiche.split(" ").pop()?.slice(0, 3).toUpperCase()}-${Math.floor(
      Math.random() * 90 + 10,
    )}`;
    const nouvelle: Patrouille = {
      id: crypto.randomUUID(),
      indicatif,
      membres: [mockUtilisateurNomAffiche, ...data.coequipiers],
      vehicule: data.vehicule,
      armement: data.armement,
      statut: "Disponible",
      depuis: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      declarePar: mockUtilisateurNomAffiche,
    };
    setPatrouilles((prev) => [nouvelle, ...prev]);
  }

  const patrouillesActives = patrouilles.filter((p) => p.statut !== "Hors service");
  const patrouillesHorsService = patrouilles.filter((p) => p.statut === "Hors service");

  return (
    <div className="flex flex-col gap-4">
      {maPatrouille ? (
        <PatrouilleCard
          patrouille={maPatrouille}
          estLaMienne
          onChangerStatut={(s) => changerStatut(maPatrouille.id, s)}
          onQuitter={() => quitterService(maPatrouille.id)}
        />
      ) : (
        <PrendreServiceForm vehiculesLibres={vehiculesLibres} onValider={prendreService} />
      )}

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-panel-muted">
          Patrouilles actives ({patrouillesActives.length})
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {patrouillesActives.map((p) => (
            <PatrouilleCard
              key={p.id}
              patrouille={p}
              estLaMienne={p.id === maPatrouille?.id}
              onChangerStatut={(s) => changerStatut(p.id, s)}
              onQuitter={p.id === maPatrouille?.id ? () => quitterService(p.id) : undefined}
            />
          ))}
        </div>
      </div>

      {patrouillesHorsService.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Hors service ({patrouillesHorsService.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 opacity-60">
            {patrouillesHorsService.map((p) => (
              <PatrouilleCard
                key={p.id}
                patrouille={p}
                estLaMienne={false}
                onChangerStatut={(s) => changerStatut(p.id, s)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
