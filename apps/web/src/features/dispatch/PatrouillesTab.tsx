import { useState } from "react";
import { useDispatchState } from "../../shared/dispatchContext";
import { mockEffectifGlobal, trouverMembre, CURRENT_USER_ID } from "./mockRoster";
import {
  TYPES_UNITE,
  VEHICULES_DISPONIBLES,
  type ObjectifEquipage,
  type TypeUnite,
} from "./mockTypesUnite";
import { ControlBar } from "./ControlBar";
import { EffectifGlobalPanel } from "./EffectifGlobalPanel";
import { EnServicePanel } from "./EnServicePanel";
import { EquipagesActifsBoard } from "./EquipagesActifsBoard";
import { CreerEquipageModal } from "./CreerEquipageModal";

export function PatrouillesTab() {
  const { enServiceIds, setEnServiceIds, equipages, setEquipages } = useDispatchState();
  const [modalOuvert, setModalOuvert] = useState(false);

  const suisEnService = enServiceIds.includes(CURRENT_USER_ID);

  function togglePriseDeService(membreId: string) {
    setEnServiceIds((prev) =>
      prev.includes(membreId) ? prev.filter((id) => id !== membreId) : [...prev, membreId],
    );
  }

  const membresAffectesIds = new Set(equipages.flatMap((eq) => eq.membresIds));
  const membresEnService = enServiceIds
    .filter((id) => !membresAffectesIds.has(id))
    .map((id) => trouverMembre(mockEffectifGlobal, id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  const enServiceTousLeMembres = enServiceIds
    .map((id) => trouverMembre(mockEffectifGlobal, id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  function creerEquipage(data: {
    typeUnite: TypeUnite;
    numero: string;
    membresIds: string[];
    objectif: ObjectifEquipage;
    cible: string;
    equipementLetal: boolean;
    equipementNonLetal: boolean;
    vehicule: string | null;
  }) {
    setEquipages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        typeUnite: data.typeUnite,
        numero: data.numero,
        membresIds: data.membresIds,
        objectif: data.objectif,
        cible: data.cible || undefined,
        equipementLetal: data.equipementLetal,
        equipementNonLetal: data.equipementNonLetal,
        vehicule: data.vehicule,
        statut: "Actif",
        creeLe: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setModalOuvert(false);
  }

  function dissoudreEquipage(id: string) {
    setEquipages((prev) => prev.filter((eq) => eq.id !== id));
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <ControlBar
        onOuvrirCreerEquipage={() => setModalOuvert(true)}
        suisEnService={suisEnService}
        onTogglePriseDeService={() => togglePriseDeService(CURRENT_USER_ID)}
      />

      <div className="flex min-h-0 flex-1 gap-3">
        <EffectifGlobalPanel
          sections={mockEffectifGlobal}
          enServiceIds={enServiceIds}
          onTogglePriseDeService={togglePriseDeService}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <EquipagesActifsBoard
            equipages={equipages}
            sections={mockEffectifGlobal}
            onDissoudre={dissoudreEquipage}
          />
        </div>

        <EnServicePanel membres={enServiceTousLeMembres} />
      </div>

      <CreerEquipageModal
        open={modalOuvert}
        onClose={() => setModalOuvert(false)}
        typesUnite={TYPES_UNITE}
        membresEnService={membresEnService}
        vehiculesDisponibles={VEHICULES_DISPONIBLES}
        onCreer={creerEquipage}
      />
    </div>
  );
}
