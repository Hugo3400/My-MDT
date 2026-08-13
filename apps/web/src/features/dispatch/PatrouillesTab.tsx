import { useState } from "react";
import { useDispatchState } from "../../shared/dispatchContext";
import { mockEffectifGlobal, trouverMembre, CURRENT_USER_ID } from "./mockRoster";
import { TYPES_UNITE, VEHICULES_DISPONIBLES } from "./mockTypesUnite";
import type { Equipage } from "./mockEquipages";
import { ControlBar } from "./ControlBar";
import { EffectifGlobalPanel } from "./EffectifGlobalPanel";
import { EnServicePanel } from "./EnServicePanel";
import { EquipagesActifsBoard } from "./EquipagesActifsBoard";
import { CreerEquipageModal } from "./CreerEquipageModal";
import { EditerEquipageModal } from "./EditerEquipageModal";
import { generateId } from "../../shared/id";

export function PatrouillesTab() {
  const { enServiceIds, setEnServiceIds, equipages, setEquipages } = useDispatchState();
  const [modalCreationOuverte, setModalCreationOuverte] = useState(false);
  const [equipageEnEdition, setEquipageEnEdition] = useState<Equipage | null>(null);

  const suisEnService = enServiceIds.includes(CURRENT_USER_ID);
  const membresAffectesIds = new Set(equipages.flatMap((eq) => eq.membresIds));

  function togglePriseDeService(membreId: string) {
    const quitteService = enServiceIds.includes(membreId);
    setEnServiceIds((prev) =>
      quitteService ? prev.filter((id) => id !== membreId) : [...prev, membreId],
    );

    if (quitteService) {
      // Un agent qui quitte le service ne peut pas rester listé dans un équipage ; si
      // l'équipage se retrouve vide, il n'a plus lieu d'exister.
      setEquipages((prev) =>
        prev
          .map((eq) =>
            eq.membresIds.includes(membreId)
              ? { ...eq, membresIds: eq.membresIds.filter((id) => id !== membreId) }
              : eq,
          )
          .filter((eq) => eq.membresIds.length > 0),
      );
    }
  }

  const membresEnServiceLibres = enServiceIds
    .filter((id) => !membresAffectesIds.has(id))
    .map((id) => trouverMembre(mockEffectifGlobal, id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  const enServiceTousLeMembres = enServiceIds
    .map((id) => trouverMembre(mockEffectifGlobal, id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  function creerEquipage(data: {
    typeUnite: (typeof TYPES_UNITE)[number];
    numero: string;
    membresIds: string[];
    objectif: Equipage["objectif"];
    cible: string;
    equipementLetal: boolean;
    equipementNonLetal: boolean;
    vehicule: string | null;
  }) {
    setEquipages((prev) => [
      ...prev,
      {
        id: generateId(),
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
    setModalCreationOuverte(false);
  }

  function dissoudreEquipage(id: string) {
    setEquipages((prev) => prev.filter((eq) => eq.id !== id));
  }

  function enregistrerEquipage(
    id: string,
    data: {
      membresIds: string[];
      objectif: Equipage["objectif"];
      cible: string;
      equipementLetal: boolean;
      equipementNonLetal: boolean;
      vehicule: string | null;
      statut: Equipage["statut"];
    },
  ) {
    setEquipages((prev) =>
      prev.map((eq) =>
        eq.id === id
          ? {
              ...eq,
              membresIds: data.membresIds,
              objectif: data.objectif,
              cible: data.cible || undefined,
              equipementLetal: data.equipementLetal,
              equipementNonLetal: data.equipementNonLetal,
              vehicule: data.vehicule,
              statut: data.statut,
              // Un dispatch qui repasse manuellement l'équipage hors "En intervention"
              // dissocie le lien avec l'intervention en cours.
              interventionLiee: data.statut === "En intervention" ? eq.interventionLiee : undefined,
            }
          : eq,
      ),
    );
  }

  // Pour l'édition, l'agent voit les membres déjà dans SON équipage + les autres agents
  // en service encore libres.
  const membresPourEdition = equipageEnEdition
    ? enServiceIds
        .filter((id) => !membresAffectesIds.has(id) || equipageEnEdition.membresIds.includes(id))
        .map((id) => trouverMembre(mockEffectifGlobal, id))
        .filter((m): m is NonNullable<typeof m> => m !== undefined)
    : [];

  return (
    <div className="flex h-full flex-col gap-3">
      <ControlBar
        onOuvrirCreerEquipage={() => setModalCreationOuverte(true)}
        suisEnService={suisEnService}
        onTogglePriseDeService={() => togglePriseDeService(CURRENT_USER_ID)}
      />

      <div className="flex min-h-0 flex-1 gap-3">
        <EffectifGlobalPanel
          sections={mockEffectifGlobal}
          enServiceIds={enServiceIds}
          onTogglePriseDeService={togglePriseDeService}
          currentUserId={CURRENT_USER_ID}
          membresAffectesIds={Array.from(membresAffectesIds)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <EquipagesActifsBoard
            equipages={equipages}
            sections={mockEffectifGlobal}
            onDissoudre={dissoudreEquipage}
            onEditer={setEquipageEnEdition}
          />
        </div>

        <EnServicePanel membres={enServiceTousLeMembres} />
      </div>

      <CreerEquipageModal
        open={modalCreationOuverte}
        onClose={() => setModalCreationOuverte(false)}
        typesUnite={TYPES_UNITE}
        membresEnService={membresEnServiceLibres}
        vehiculesDisponibles={VEHICULES_DISPONIBLES}
        equipagesExistants={equipages}
        onCreer={creerEquipage}
      />

      <EditerEquipageModal
        open={equipageEnEdition !== null}
        equipage={equipageEnEdition}
        membresDisponibles={membresPourEdition}
        vehiculesDisponibles={VEHICULES_DISPONIBLES}
        onFermer={() => setEquipageEnEdition(null)}
        onEnregistrer={enregistrerEquipage}
        onDissoudre={dissoudreEquipage}
      />
    </div>
  );
}
