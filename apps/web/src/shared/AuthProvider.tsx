import { useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./AuthContext";
import { mockAffectations } from "./mockData";
import type { Affectation } from "./mockData";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("anonymous");
  const [organismeActif, setOrganismeActif] = useState<Affectation | null>(null);

  async function login() {
    setStatus("authenticating");
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (mockAffectations.length > 1) {
      setStatus("awaiting-org");
    } else {
      setOrganismeActif(mockAffectations[0] ?? null);
      setStatus("authenticated");
    }
  }

  function choisirOrganisme(affectationId: string) {
    const affectation = mockAffectations.find((a) => a.id === affectationId) ?? null;
    setOrganismeActif(affectation);
    setStatus("authenticated");
  }

  function deconnecter() {
    setStatus("anonymous");
    setOrganismeActif(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({ status, affectations: mockAffectations, organismeActif, login, choisirOrganisme, deconnecter }),
    [status, organismeActif],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
