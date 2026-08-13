import { useMemo, useState, type ReactNode } from "react";
import type { Equipage } from "../features/dispatch/mockEquipages";
import { DispatchContext, type DispatchContextValue } from "./dispatchContext";

export function DispatchProvider({ children }: { children: ReactNode }) {
  const [enServiceIds, setEnServiceIds] = useState<string[]>([]);
  const [equipages, setEquipages] = useState<Equipage[]>([]);

  const value = useMemo<DispatchContextValue>(
    () => ({ enServiceIds, setEnServiceIds, equipages, setEquipages }),
    [enServiceIds, equipages],
  );

  return <DispatchContext.Provider value={value}>{children}</DispatchContext.Provider>;
}
