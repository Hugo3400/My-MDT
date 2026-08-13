import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Equipage } from "../features/dispatch/mockEquipages";
import { mockDispatchsDetail, type DispatchDetail } from "../features/dispatch/mockDispatch";
import { mockOperations, type Operation } from "../features/operations/mockOperations";
import { DispatchContext, type DispatchContextValue } from "./dispatchContext";

const STORAGE_KEY = "panel:dispatch-session";

type EtatPersiste = {
  enServiceIds: string[];
  equipages: Equipage[];
  interventions: DispatchDetail[];
  operations: Operation[];
};

function lireEtatPersiste(): EtatPersiste | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function DispatchProvider({ children }: { children: ReactNode }) {
  const persiste = lireEtatPersiste();
  const [enServiceIds, setEnServiceIds] = useState<string[]>(persiste?.enServiceIds ?? []);
  const [equipages, setEquipages] = useState<Equipage[]>(persiste?.equipages ?? []);
  const [interventions, setInterventions] = useState<DispatchDetail[]>(
    persiste?.interventions ?? mockDispatchsDetail,
  );
  const [operations, setOperations] = useState<Operation[]>(persiste?.operations ?? mockOperations);

  // Même logique que AuthProvider : on évite qu'un rechargement de page perde les patrouilles,
  // interventions et opérations en cours tant que l'onglet reste ouvert.
  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ enServiceIds, equipages, interventions, operations }),
    );
  }, [enServiceIds, equipages, interventions, operations]);

  const value = useMemo<DispatchContextValue>(
    () => ({
      enServiceIds,
      setEnServiceIds,
      equipages,
      setEquipages,
      interventions,
      setInterventions,
      operations,
      setOperations,
    }),
    [enServiceIds, equipages, interventions, operations],
  );

  return <DispatchContext.Provider value={value}>{children}</DispatchContext.Provider>;
}
