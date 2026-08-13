import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Equipage } from "../features/dispatch/mockEquipages";

export type DispatchContextValue = {
  enServiceIds: string[];
  setEnServiceIds: Dispatch<SetStateAction<string[]>>;
  equipages: Equipage[];
  setEquipages: Dispatch<SetStateAction<Equipage[]>>;
};

// Séparé du composant Provider pour ne pas casser le Fast Refresh (cf. AuthContext.ts).
export const DispatchContext = createContext<DispatchContextValue | null>(null);

export function useDispatchState() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useDispatchState doit être utilisé dans un DispatchProvider");
  return ctx;
}
