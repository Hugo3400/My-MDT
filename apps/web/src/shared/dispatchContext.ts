import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Equipage } from "../features/dispatch/mockEquipages";
import type { DispatchDetail } from "../features/dispatch/mockDispatch";
import type { Operation } from "../features/operations/mockOperations";

export type DispatchContextValue = {
  enServiceIds: string[];
  setEnServiceIds: Dispatch<SetStateAction<string[]>>;
  equipages: Equipage[];
  setEquipages: Dispatch<SetStateAction<Equipage[]>>;
  interventions: DispatchDetail[];
  setInterventions: Dispatch<SetStateAction<DispatchDetail[]>>;
  operations: Operation[];
  setOperations: Dispatch<SetStateAction<Operation[]>>;
};

// Séparé du composant Provider pour ne pas casser le Fast Refresh (cf. AuthContext.ts).
export const DispatchContext = createContext<DispatchContextValue | null>(null);

export function useDispatchState() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useDispatchState doit être utilisé dans un DispatchProvider");
  return ctx;
}
