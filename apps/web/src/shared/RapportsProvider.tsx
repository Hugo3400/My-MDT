import { useEffect, useMemo, useState, type ReactNode } from "react";
import { mockRapports, type Rapport } from "../features/rapports/mockRapports";
import { RapportsContext, type RapportsContextValue } from "./rapportsContext";

// v2 : le format Rapport a changé (confidentiel, sousCategorieId, contenuSnapshot dans l'historique) —
// une nouvelle clé évite de recharger une session persistée dans l'ancien format et de faire planter l'UI.
const STORAGE_KEY = "panel:rapports-session:v2";

function lireRapportsPersistes(): Rapport[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function RapportsProvider({ children }: { children: ReactNode }) {
  const [rapports, setRapports] = useState<Rapport[]>(() => lireRapportsPersistes() ?? mockRapports);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rapports));
  }, [rapports]);

  const value = useMemo<RapportsContextValue>(() => ({ rapports, setRapports }), [rapports]);

  return <RapportsContext.Provider value={value}>{children}</RapportsContext.Provider>;
}
