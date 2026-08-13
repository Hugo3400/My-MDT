import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Mandat } from "../features/mandats/mockMandats";
import type { Bolo } from "../features/mandats/mockBolo";

export type MandatsBoloContextValue = {
  mandats: Mandat[];
  setMandats: Dispatch<SetStateAction<Mandat[]>>;
  bolos: Bolo[];
  setBolos: Dispatch<SetStateAction<Bolo[]>>;
};

// Séparé du composant Provider pour ne pas casser le Fast Refresh (cf. AuthContext.ts).
export const MandatsBoloContext = createContext<MandatsBoloContextValue | null>(null);

export function useMandatsBoloState() {
  const ctx = useContext(MandatsBoloContext);
  if (!ctx) throw new Error("useMandatsBoloState doit être utilisé dans un MandatsBoloProvider");
  return ctx;
}
