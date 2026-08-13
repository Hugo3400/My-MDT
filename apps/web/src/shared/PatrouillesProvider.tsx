import { useMemo, useState, type ReactNode } from "react";
import { mockPatrouilles, type Patrouille } from "../features/dispatch/mockPatrouilles";
import { PatrouillesContext, type PatrouillesContextValue } from "./patrouillesContext";

export function PatrouillesProvider({ children }: { children: ReactNode }) {
  const [patrouilles, setPatrouilles] = useState<Patrouille[]>(mockPatrouilles);

  const value = useMemo<PatrouillesContextValue>(
    () => ({ patrouilles, setPatrouilles }),
    [patrouilles],
  );

  return <PatrouillesContext.Provider value={value}>{children}</PatrouillesContext.Provider>;
}
