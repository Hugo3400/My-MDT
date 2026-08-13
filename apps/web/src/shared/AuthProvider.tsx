import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./AuthContext";
import { mockAffectations } from "./mockData";
import type { Affectation } from "./mockData";

const STORAGE_KEY = "panel:auth-session";

function lireSessionPersistee(): { status: AuthStatus; organismeActif: Affectation } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.status !== "authenticated" || !data?.organismeActif) return null;
    return data;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const persistee = lireSessionPersistee();
  const [status, setStatus] = useState<AuthStatus>(persistee?.status ?? "anonymous");
  const [organismeActif, setOrganismeActif] = useState<Affectation | null>(
    persistee?.organismeActif ?? null,
  );

  // Évite qu'un rechargement de page (dont le hot-reload en dev) renvoie l'utilisateur au login :
  // la session persiste tant que l'onglet reste ouvert, se vide à la déconnexion explicite.
  useEffect(() => {
    if (status === "authenticated" && organismeActif) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ status, organismeActif }));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [status, organismeActif]);

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
