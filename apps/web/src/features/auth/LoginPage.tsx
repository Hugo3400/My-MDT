import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/AuthContext";
import { AuthLayout } from "../../shared/AuthLayout";

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.673-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const [demoError, setDemoError] = useState(false);
  const isLoading = status === "authenticating";

  useEffect(() => {
    if (status === "awaiting-org") navigate("/choisir-organisme");
    if (status === "authenticated") navigate("/chargement");
  }, [status, navigate]);

  function handleDiscordLogin() {
    setDemoError(false);
    void login();
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold text-panel-text">Connexion</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Connecte-toi avec ton compte Discord pour accéder au panel.
      </p>

      <button
        type="button"
        onClick={handleDiscordLogin}
        disabled={isLoading}
        className="mt-6 flex w-full items-center gap-3 rounded-lg border border-panel-border bg-panel-bg px-4 py-3 text-left transition-colors hover:border-panel-accent hover:bg-panel-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-white">
          <DiscordIcon />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-panel-text">
            {isLoading ? "Connexion en cours…" : "Continuer avec Discord"}
          </span>
          <span className="block text-xs text-panel-muted">OAuth sécurisé</span>
        </span>
        {isLoading ? (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-panel-muted/40 border-t-panel-accent" />
        ) : (
          <span className="shrink-0 text-panel-muted">→</span>
        )}
      </button>

      {demoError && (
        <p className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          Impossible de vous connecter. Vérifiez que votre compte Discord est bien rattaché à
          un organisme, puis réessayez.
        </p>
      )}

      <label className="mt-5 flex items-center gap-2 text-sm text-panel-muted">
        <input
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-panel-border bg-panel-bg text-panel-accent focus:ring-panel-accent"
        />
        Rester connecté sur cet appareil
      </label>

      <button
        type="button"
        onClick={() => setDemoError((v) => !v)}
        className="mt-6 text-xs text-panel-muted underline decoration-dotted underline-offset-2 hover:text-panel-text"
      >
        Simuler une erreur de connexion (aperçu)
      </button>
    </AuthLayout>
  );
}
