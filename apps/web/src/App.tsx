import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./shared/AuthContext";
import { AuthProvider } from "./shared/AuthProvider";
import { DispatchProvider } from "./shared/DispatchProvider";
import { ToastProvider } from "./shared/ToastProvider";
import { AppLayout } from "./shared/AppLayout";
import { PlaceholderPage } from "./shared/PlaceholderPage";
import { LoginPage } from "./features/auth/LoginPage";
import { OrganisationSelectPage } from "./features/auth/OrganisationSelectPage";
import { SplashScreen } from "./features/auth/SplashScreen";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ParametresPage } from "./features/parametres/ParametresPage";
import { DispatchPage } from "./features/dispatch/DispatchPage";
import { OperationsPage } from "./features/operations/OperationsPage";
import { RapportsPage } from "./features/rapports/RapportsPage";

function RequireOrganisme({ children }: { children: ReactElement }) {
  const { status } = useAuth();
  if (status === "anonymous" || status === "authenticating") return <Navigate to="/" replace />;
  if (status === "awaiting-org") return <Navigate to="/choisir-organisme" replace />;
  return children;
}

function AppRoutes() {
  const { status } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={status === "authenticated" ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route path="/choisir-organisme" element={<OrganisationSelectPage />} />
      <Route
        path="/chargement"
        element={
          <RequireOrganisme>
            <SplashScreen />
          </RequireOrganisme>
        }
      />

      <Route
        element={
          <RequireOrganisme>
            <DispatchProvider>
              <AppLayout />
            </DispatchProvider>
          </RequireOrganisme>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/parametres" element={<ParametresPage />} />
        <Route path="/dispatch" element={<DispatchPage />} />
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/rapports" element={<RapportsPage />} />
        <Route
          path="/warrants-bolo"
          element={
            <PlaceholderPage
              title="Warrants / BOLO"
              description="Mandats, personnes recherchées et avis de recherche, chacun avec son propre workflow."
            />
          }
        />
        <Route
          path="/registres"
          element={
            <PlaceholderPage
              title="Registres"
              description="Personnes, casier judiciaire, armes et véhicules (civils et de service)."
            />
          }
        />
        <Route
          path="/enquetes"
          element={
            <PlaceholderPage
              title="Enquêtes"
              description="Dossiers d'enquête, pièces à conviction et chronologie des actions."
            />
          }
        />
        <Route
          path="/saisies"
          element={
            <PlaceholderPage
              title="Saisies"
              description="Objets saisis et chaîne de possession complète."
            />
          }
        />
        <Route
          path="/carte"
          element={
            <PlaceholderPage
              title="Carte"
              description="Carte GTA V interactive en SVG — zones, marqueurs et calques. Prévu en Phase 3."
            />
          }
        />
        <Route
          path="/specialites"
          element={
            <PlaceholderPage
              title="Spécialités"
              description="Divisions et spécialités de l'organisme (Gang Task Force, K-9, SWAT, enquêteurs...)."
            />
          }
        />
        <Route
          path="/administration"
          element={
            <PlaceholderPage
              title="Administration"
              description="Organismes, divisions, grades, rôles et matrice des permissions."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}
