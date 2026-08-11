import { createContext, useContext } from "react";
import type { Affectation } from "./mockData";

export type AuthStatus = "anonymous" | "authenticating" | "awaiting-org" | "authenticated";

export type AuthContextValue = {
  status: AuthStatus;
  affectations: Affectation[];
  organismeActif: Affectation | null;
  login: () => Promise<void>;
  choisirOrganisme: (affectationId: string) => void;
  deconnecter: () => void;
};

// Séparé de AuthProvider.tsx : un fichier qui mélange composant et hook casse le Fast Refresh
// de Vite (le contexte se recrée en double au hot-reload et les consommateurs se figent).
export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
