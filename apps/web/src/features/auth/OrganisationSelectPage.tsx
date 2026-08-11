import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/AuthContext";
import { AuthLayout } from "../../shared/AuthLayout";

export function OrganisationSelectPage() {
  const { affectations, choisirOrganisme } = useAuth();
  const navigate = useNavigate();

  function handleSelect(affectationId: string) {
    choisirOrganisme(affectationId);
    navigate("/chargement");
  }

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold text-panel-text">Choisis ton organisme</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Ton compte est rattaché à plusieurs organismes. Sélectionne celui avec lequel accéder
        au panel.
      </p>

      <ul className="mt-6 flex flex-col gap-2">
        {affectations.map((affectation) => (
          <li key={affectation.id}>
            <button
              type="button"
              onClick={() => handleSelect(affectation.id)}
              className="flex w-full items-center gap-3 rounded-lg border border-panel-border bg-panel-bg px-4 py-3 text-left transition-colors hover:border-panel-accent hover:bg-panel-accent/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-panel-border bg-panel-surface text-xs font-semibold text-panel-text">
                {affectation.organismeCode.slice(0, 2)}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-panel-text">
                  {affectation.organismeNom}{" "}
                  <span className="text-panel-muted">({affectation.organismeCode})</span>
                </span>
                <span className="block text-xs text-panel-muted">
                  {affectation.gradeNom}
                  {affectation.divisionNom ? ` · ${affectation.divisionNom}` : ""} · Indicatif{" "}
                  {affectation.indicatif}
                </span>
              </span>
              <span className="shrink-0 text-panel-muted">→</span>
            </button>
          </li>
        ))}
      </ul>
    </AuthLayout>
  );
}
