import { useState } from "react";
import { useAuth } from "../../shared/AuthContext";
import {
  mockAbsences,
  mockHistoriqueService,
  mockInfosRH,
  mockUtilisateurNomAffiche,
} from "../../shared/mockData";
import {
  IconAbsence,
  IconCamera,
  IconHistorique,
  IconNotification,
  IconSecurite,
} from "../../shared/icons";

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-panel-border bg-panel-surface p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-panel-border bg-panel-bg text-panel-accent">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-semibold text-panel-text">{title}</h2>
          {description && <p className="text-xs text-panel-muted">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-panel-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent";

const STATUT_CLASS: Record<string, string> = {
  "En attente": "text-amber-400",
  Approuvée: "text-emerald-400",
  Refusée: "text-red-400",
};

export function ParametresPage() {
  const { organismeActif } = useAuth();
  const [matricule, setMatricule] = useState("SAHP-0417");
  const [indicatifRadio, setIndicatifRadio] = useState(organismeActif?.indicatif ?? "");
  const [notifDispatch, setNotifDispatch] = useState(true);
  const [notifBolo, setNotifBolo] = useState(true);
  const [notifWarrants, setNotifWarrants] = useState(false);
  const [notifRapports, setNotifRapports] = useState(true);
  const [mfaActive, setMfaActive] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 rounded-lg border border-panel-border bg-panel-surface p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-panel-border bg-panel-bg text-panel-muted">
          <IconCamera className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-panel-text">{mockUtilisateurNomAffiche}</p>
          <p className="text-xs text-panel-muted">
            {organismeActif?.gradeNom ?? "—"} · {organismeActif?.organismeNom ?? "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          icon={<IconCamera className="h-4 w-4" />}
          title="Matricule, indicatif & photo de service"
          description="Certaines modifications nécessitent une validation d'un superviseur."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Matricule">
              <input
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Indicatif radio préféré">
              <input
                value={indicatifRadio}
                onChange={(e) => setIndicatifRadio(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-muted transition-colors hover:border-panel-accent/50 hover:text-panel-text"
          >
            Changer la photo de profil de service (jpg, png, webp — 10 Mo max)
          </button>
        </SectionCard>

        <SectionCard
          icon={<IconHistorique className="h-4 w-4" />}
          title="Informations RH"
          description="Lecture seule — géré par l'administration de l'organisme."
        >
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-panel-muted">Date d'engagement</dt>
            <dd className="text-panel-text">{mockInfosRH.dateEngagement}</dd>
            <dt className="text-panel-muted">Statut</dt>
            <dd className="text-emerald-400">{mockInfosRH.statut}</dd>
            <dt className="text-panel-muted">Unité</dt>
            <dd className="text-panel-text">{mockInfosRH.unite}</dd>
            <dt className="text-panel-muted">Superviseur référent</dt>
            <dd className="text-panel-text">{mockInfosRH.superviseur}</dd>
          </dl>
        </SectionCard>

        <SectionCard
          icon={<IconHistorique className="h-4 w-4" />}
          title="Historique de service"
        >
          <ul className="flex flex-col gap-2">
            {mockHistoriqueService.map((evt) => (
              <li
                key={evt.id}
                className="flex items-start gap-3 rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm"
              >
                <span className="mt-0.5 text-[11px] text-panel-muted">{evt.date}</span>
                <span className="text-panel-text">{evt.texte}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          icon={<IconAbsence className="h-4 w-4" />}
          title="Absences"
          description="Déclarer une période d'absence RP soumise à approbation."
        >
          <ul className="mb-3 flex flex-col gap-2">
            {mockAbsences.map((absence) => (
              <li
                key={absence.id}
                className="flex items-center justify-between rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm"
              >
                <span className="text-panel-text">
                  {absence.debut} → {absence.fin}{" "}
                  <span className="text-panel-muted">· {absence.motif}</span>
                </span>
                <span className={`text-xs font-medium ${STATUT_CLASS[absence.statut]}`}>
                  {absence.statut}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-muted transition-colors hover:border-panel-accent/50 hover:text-panel-text"
          >
            Déclarer une absence
          </button>
        </SectionCard>

        <SectionCard
          icon={<IconNotification className="h-4 w-4" />}
          title="Préférences de notifications"
        >
          <div className="flex flex-col gap-2 text-sm">
            {[
              ["Dispatch prioritaire", notifDispatch, setNotifDispatch],
              ["BOLO publiés", notifBolo, setNotifBolo],
              ["Warrants en attente de visa", notifWarrants, setNotifWarrants],
              ["Rapports en attente d'approbation", notifRapports, setNotifRapports],
            ].map(([label, checked, setter]) => (
              <label key={label as string} className="flex items-center gap-2 text-panel-text">
                <input
                  type="checkbox"
                  checked={checked as boolean}
                  onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)}
                  className="h-4 w-4 rounded border-panel-border bg-panel-bg text-panel-accent focus:ring-panel-accent"
                />
                {label}
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={<IconSecurite className="h-4 w-4" />}
          title="Sécurité du compte"
        >
          <div className="flex items-center justify-between rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm">
            <span className="text-panel-text">Double authentification</span>
            <button
              type="button"
              onClick={() => setMfaActive((v) => !v)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                mfaActive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {mfaActive ? "Activée" : "Désactivée"}
            </button>
          </div>
          <p className="mt-2 text-xs text-panel-muted">
            Obligatoire pour tout rôle porteur d'une permission sensible.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
