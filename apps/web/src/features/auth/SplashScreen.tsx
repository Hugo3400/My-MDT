import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-panel-bg px-4 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-emerald-400" fill="currentColor" aria-hidden="true">
          <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Zm0 2.2 6 2.25V11c0 3.9-2.6 7.1-6 8-3.4-.9-6-4.1-6-8V6.45l6-2.25Z" />
          <path d="m11 13.5-2.5-2.5-1.4 1.4L11 16.3l6-6-1.4-1.4L11 13.5Z" />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-panel-text">
          Bonjour, {mockUtilisateurNomAffiche}
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Accès autorisé
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-panel-muted">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-panel-muted/30 border-t-panel-accent" />
        Chargement du panel…
      </div>
    </div>
  );
}
