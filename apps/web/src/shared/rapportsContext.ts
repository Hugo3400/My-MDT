import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Rapport } from "../features/rapports/mockRapports";

export type RapportsContextValue = {
  rapports: Rapport[];
  setRapports: Dispatch<SetStateAction<Rapport[]>>;
};

// Séparé du composant Provider pour ne pas casser le Fast Refresh (cf. AuthContext.ts).
export const RapportsContext = createContext<RapportsContextValue | null>(null);

export function useRapportsState() {
  const ctx = useContext(RapportsContext);
  if (!ctx) throw new Error("useRapportsState doit être utilisé dans un RapportsProvider");
  return ctx;
}
