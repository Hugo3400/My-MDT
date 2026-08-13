import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Patrouille } from "../features/dispatch/mockPatrouilles";

export type PatrouillesContextValue = {
  patrouilles: Patrouille[];
  setPatrouilles: Dispatch<SetStateAction<Patrouille[]>>;
};

// Séparé du composant Provider pour ne pas casser le Fast Refresh (cf. AuthContext.ts).
export const PatrouillesContext = createContext<PatrouillesContextValue | null>(null);

export function usePatrouilles() {
  const ctx = useContext(PatrouillesContext);
  if (!ctx) throw new Error("usePatrouilles doit être utilisé dans un PatrouillesProvider");
  return ctx;
}
