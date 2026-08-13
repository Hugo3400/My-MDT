import { useEffect, useMemo, useState, type ReactNode } from "react";
import { mockMandats, type Mandat } from "../features/mandats/mockMandats";
import { mockBolos, type Bolo } from "../features/mandats/mockBolo";
import { MandatsBoloContext, type MandatsBoloContextValue } from "./mandatsBoloContext";

const STORAGE_KEY = "panel:mandats-bolo-session:v1";

type EtatPersiste = { mandats: Mandat[]; bolos: Bolo[] };

function lireEtatPersiste(): EtatPersiste | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function MandatsBoloProvider({ children }: { children: ReactNode }) {
  const persiste = lireEtatPersiste();
  const [mandats, setMandats] = useState<Mandat[]>(persiste?.mandats ?? mockMandats);
  const [bolos, setBolos] = useState<Bolo[]>(persiste?.bolos ?? mockBolos);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ mandats, bolos }));
  }, [mandats, bolos]);

  const value = useMemo<MandatsBoloContextValue>(
    () => ({ mandats, setMandats, bolos, setBolos }),
    [mandats, bolos],
  );

  return <MandatsBoloContext.Provider value={value}>{children}</MandatsBoloContext.Provider>;
}
