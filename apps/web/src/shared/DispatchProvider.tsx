import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Equipage } from "../features/dispatch/mockEquipages";
import { DispatchContext, type DispatchContextValue } from "./dispatchContext";

const STORAGE_KEY = "panel:dispatch-session";

function lireEtatPersiste(): { enServiceIds: string[]; equipages: Equipage[] } | null {
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

  // Même logique que AuthProvider : on évite qu'un rechargement de page perde les patrouilles
  // en cours et l'état de service tant que l'onglet reste ouvert.
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ enServiceIds, equipages }));
  }, [enServiceIds, equipages]);

  const value = useMemo<DispatchContextValue>(
    () => ({ enServiceIds, setEnServiceIds, equipages, setEquipages }),
    [enServiceIds, equipages],
  );

  return <DispatchContext.Provider value={value}>{children}</DispatchContext.Provider>;
}
