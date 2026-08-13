import { useState, type MouseEvent } from "react";
import { useDispatchState } from "../../shared/dispatchContext";
import { useToast } from "../../shared/toastContext";
import { ContextMenu, type ContextMenuItem } from "../../shared/ContextMenu";
import { mockEffectifGlobal, trouverMembre, CURRENT_USER_ID } from "./mockRoster";
import { TYPES_UNITE, VEHICULES_DISPONIBLES } from "./mockTypesUnite";
import {
  indicatifEquipage,
  STATUT_EQUIPAGE_OPTIONS,
  type Equipage,
} from "./mockEquipages";
import type { DispatchDetail } from "./mockDispatch";
import type { Operation } from "../operations/mockOperations";
import { ControlBar } from "./ControlBar";
import { EffectifGlobalPanel } from "./EffectifGlobalPanel";
import { EnServicePanel } from "./EnServicePanel";
import { EquipagesActifsBoard } from "./EquipagesActifsBoard";
import { CreerEquipageModal } from "./CreerEquipageModal";
import { EditerEquipageModal } from "./EditerEquipageModal";
import { generateId } from "../../shared/id";

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function PatrouillesTab() {
  const {
    enServiceIds,
    setEnServiceIds,
    equipages,
    setEquipages,
    interventions,
    setInterventions,
    operations,
    setOperations,
  } = useDispatchState();
  const { addToast } = useToast();
  const [modalCreationOuverte, setModalCreationOuverte] = useState(false);
  const [equipageEnEdition, setEquipageEnEdition] = useState<Equipage | null>(null);
  const [menuContextuel, setMenuContextuel] = useState<{
    x: number;
    y: number;
    equipage: Equipage;
  } | null>(null);

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
        creeLe: heureActuelle(),
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

  function assignerAIntervention(equipage: Equipage, intervention: DispatchDetail) {
    const indicatif = indicatifEquipage(equipage);
    setInterventions((prev) =>
      prev.map((d) =>
        d.id === intervention.id
          ? {
              ...d,
              unitesEngagees: [
                ...d.unitesEngagees,
                { id: generateId(), indicatif, statut: "En route", couleur: "#22c55e" },
              ],
              filActivite: [
                ...d.filActivite,
                { id: generateId(), heure: heureActuelle(), texte: `${indicatif} affectée` },
              ],
            }
          : d,
      ),
    );
    setEquipages((prev) =>
      prev.map((eq) =>
        eq.id === equipage.id
          ? { ...eq, statut: "En intervention", interventionLiee: intervention.numero }
          : eq,
      ),
    );
    addToast(`${indicatif} assigné à l'intervention ${intervention.numero}`, "success");
  }

  function assignerAOperation(equipage: Equipage, operation: Operation) {
    const indicatif = indicatifEquipage(equipage);
    setOperations((prev) =>
      prev.map((op) =>
        op.id === operation.id && !op.unitesAssignees.includes(indicatif)
          ? { ...op, unitesAssignees: [...op.unitesAssignees, indicatif] }
          : op,
      ),
    );
    setEquipages((prev) =>
      prev.map((eq) => (eq.id === equipage.id ? { ...eq, operationLiee: operation.nom } : eq)),
    );
    addToast(`${indicatif} assigné à l'opération « ${operation.nom} »`, "success");
  }

  function changerStatutRapide(equipage: Equipage, statut: Equipage["statut"]) {
    const indicatif = indicatifEquipage(equipage);
    setEquipages((prev) =>
      prev.map((eq) =>
        eq.id === equipage.id
          ? { ...eq, statut, interventionLiee: statut === "En intervention" ? eq.interventionLiee : undefined }
          : eq,
      ),
    );
    addToast(`${indicatif} : statut → ${statut}`, "info");
  }

  function ajouterMembreEquipage(equipage: Equipage, membreId: string) {
    const membre = trouverMembre(mockEffectifGlobal, membreId);
    setEquipages((prev) =>
      prev.map((eq) =>
        eq.id === equipage.id ? { ...eq, membresIds: [...eq.membresIds, membreId] } : eq,
      ),
    );
    addToast(`${membre?.nom ?? "Agent"} ajouté à ${indicatifEquipage(equipage)}`, "success");
  }

  function retirerMembreEquipage(equipage: Equipage, membreId: string) {
    const membre = trouverMembre(mockEffectifGlobal, membreId);
    setEquipages((prev) =>
      prev
        .map((eq) =>
          eq.id === equipage.id
            ? { ...eq, membresIds: eq.membresIds.filter((id) => id !== membreId) }
            : eq,
        )
        .filter((eq) => eq.membresIds.length > 0),
    );
    addToast(`${membre?.nom ?? "Agent"} retiré de ${indicatifEquipage(equipage)}`, "info");
  }

  function copierIndicatif(equipage: Equipage) {
    const indicatif = indicatifEquipage(equipage);
    navigator.clipboard?.writeText(indicatif);
    addToast("Indicatif copié", "info");
  }

  function copierMembres(equipage: Equipage) {
    const noms = equipage.membresIds
      .map((id) => trouverMembre(mockEffectifGlobal, id)?.nom)
      .filter((n): n is string => Boolean(n))
      .join(", ");
    navigator.clipboard?.writeText(noms);
    addToast("Liste des membres copiée", "info");
  }

  function ouvrirMenuContextuel(e: MouseEvent, equipage: Equipage) {
    e.preventDefault();
    setMenuContextuel({ x: e.clientX, y: e.clientY, equipage });
  }

  function construireMenuItems(equipage: Equipage): ContextMenuItem[] {
    const interventionsOuvertes = interventions.filter(
      (d) => d.statut !== "Clôturé" && d.statut !== "Annulé",
    );
    const operationsOuvertes = operations.filter(
      (op) => op.statut === "Planifiée" || op.statut === "En cours",
    );
    const membresLibres = enServiceIds
      .filter((id) => !membresAffectesIds.has(id))
      .map((id) => trouverMembre(mockEffectifGlobal, id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined);

    return [
      {
        type: "submenu",
        label: "Assigner à une intervention",
        disabled: interventionsOuvertes.length === 0,
        items: interventionsOuvertes.map((d) => ({
          type: "action",
          label: `${d.numero} — ${d.categorie}`,
          onSelect: () => assignerAIntervention(equipage, d),
        })),
      },
      {
        type: "submenu",
        label: "Assigner à une opération",
        disabled: operationsOuvertes.length === 0,
        items: operationsOuvertes.map((op) => ({
          type: "action",
          label: op.nom,
          onSelect: () => assignerAOperation(equipage, op),
        })),
      },
      {
        type: "submenu",
        label: "Changer le statut",
        items: STATUT_EQUIPAGE_OPTIONS.map((s) => ({
          type: "action",
          label: s,
          disabled: s === equipage.statut,
          onSelect: () => changerStatutRapide(equipage, s),
        })),
      },
      { type: "separator" },
      {
        type: "submenu",
        label: "Ajouter un membre",
        disabled: membresLibres.length === 0,
        items: membresLibres.map((m) => ({
          type: "action",
          label: `${m.nom} #${m.matricule}`,
          onSelect: () => ajouterMembreEquipage(equipage, m.id),
        })),
      },
      {
        type: "submenu",
        label: "Retirer un membre",
        disabled: equipage.membresIds.length === 0,
        items: equipage.membresIds.map((id) => {
          const m = trouverMembre(mockEffectifGlobal, id);
          return {
            type: "action" as const,
            label: m ? m.nom : "Agent inconnu",
            onSelect: () => retirerMembreEquipage(equipage, id),
          };
        }),
      },
      { type: "separator" },
      { type: "action", label: "Copier l'indicatif", onSelect: () => copierIndicatif(equipage) },
      {
        type: "action",
        label: "Copier la liste des membres",
        disabled: equipage.membresIds.length === 0,
        onSelect: () => copierMembres(equipage),
      },
      { type: "separator" },
      { type: "action", label: "Éditer", onSelect: () => setEquipageEnEdition(equipage) },
      {
        type: "action",
        label: "Dissoudre",
        danger: true,
        onSelect: () => {
          dissoudreEquipage(equipage.id);
          addToast(`${indicatifEquipage(equipage)} dissous`, "info");
        },
      },
    ];
  }

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
            onContextMenu={ouvrirMenuContextuel}
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

      {menuContextuel && (
        <ContextMenu
          x={menuContextuel.x}
          y={menuContextuel.y}
          items={construireMenuItems(menuContextuel.equipage)}
          onClose={() => setMenuContextuel(null)}
        />
      )}
    </div>
  );
}
