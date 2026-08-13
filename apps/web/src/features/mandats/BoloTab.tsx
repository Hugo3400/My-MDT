import { useMemo, useState } from "react";
import {
  DESTINATAIRES_BOLO,
  PRIORITES_BOLO,
  PRIORITE_BOLO_STYLE,
  STATUT_BOLO_STYLE,
  genererNumeroBolo,
  type Bolo,
  type PrioriteBolo,
} from "./mockBolo";
import { useMandatsBoloState } from "../../shared/mandatsBoloContext";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";
import { useToast } from "../../shared/toastContext";

function genererIdLocal(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formaterDateHeure(date: Date): string {
  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();
  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${jour}/${mois}/${annee} ${heures}:${minutes}`;
}

function formaterDateDepuisInput(valeur: string): string {
  const [annee, mois, jour] = valeur.split("-");
  return `${jour}/${mois}/${annee}`;
}

function dateInputParDefaut(): string {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

function parserDateJJMMAAAA(valeur: string): Date | null {
  const [jourPart] = valeur.split(" ");
  const morceaux = jourPart?.split("/");
  if (!morceaux || morceaux.length !== 3) return null;
  const [jour, mois, annee] = morceaux.map((m) => Number(m));
  if (!jour || !mois || !annee) return null;
  return new Date(annee, mois - 1, jour, 23, 59, 59);
}

function estExpire(dateExpiration: string): boolean {
  const date = parserDateJJMMAAAA(dateExpiration);
  if (!date) return false;
  return date.getTime() < Date.now();
}

const ORDRE_PRIORITE: Record<PrioriteBolo, number> = {
  Critique: 3,
  Urgente: 2,
  Normale: 1,
  Faible: 0,
};

function trierBolos(bolos: Bolo[]): Bolo[] {
  return [...bolos].sort((a, b) => {
    const aActif = a.statut === "Actif";
    const bActif = b.statut === "Actif";
    if (aActif !== bActif) return aActif ? -1 : 1;
    if (aActif && bActif) {
      return ORDRE_PRIORITE[b.priorite] - ORDRE_PRIORITE[a.priorite];
    }
    return 0;
  });
}

function ChevronSelect(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-panel-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NouveauBoloModal({
  open,
  onClose,
  bolos,
  onCreer,
}: {
  open: boolean;
  onClose: () => void;
  bolos: Bolo[];
  onCreer: (bolo: Bolo) => void;
}): JSX.Element | null {
  const [priorite, setPriorite] = useState<PrioriteBolo>("Normale");
  const [signalement, setSignalement] = useState("");
  const [personneCible, setPersonneCible] = useState("");
  const [vehiculeCible, setVehiculeCible] = useState("");
  const [dateExpirationInput, setDateExpirationInput] = useState(dateInputParDefaut());
  const [destinataires, setDestinataires] = useState<string[]>(["Tout le tenant"]);
  const [tentativeEnvoi, setTentativeEnvoi] = useState(false);

  if (!open) return null;

  const signalementValide = signalement.trim() !== "";
  const destinatairesValides = destinataires.length > 0;
  const peutCreer = signalementValide && destinatairesValides;

  function reinitialiser() {
    setPriorite("Normale");
    setSignalement("");
    setPersonneCible("");
    setVehiculeCible("");
    setDateExpirationInput(dateInputParDefaut());
    setDestinataires(["Tout le tenant"]);
    setTentativeEnvoi(false);
  }

  function fermer() {
    reinitialiser();
    onClose();
  }

  function toggleDestinataire(valeur: string) {
    setDestinataires((prev) => (prev.includes(valeur) ? prev.filter((d) => d !== valeur) : [...prev, valeur]));
  }

  function creer() {
    setTentativeEnvoi(true);
    if (!peutCreer) return;
    const maintenant = new Date();
    const nouveauBolo: Bolo = {
      id: genererIdLocal(),
      numero: genererNumeroBolo(bolos),
      priorite,
      signalement: signalement.trim(),
      personneCible: personneCible.trim() || undefined,
      vehiculeCible: vehiculeCible.trim() || undefined,
      statut: "Actif",
      auteur: mockUtilisateurNomAffiche,
      dateCreation: formaterDateHeure(maintenant),
      dateExpiration: formaterDateDepuisInput(dateExpirationInput),
      destinataires,
      accusesLecture: [],
    };
    onCreer(nouveauBolo);
    reinitialiser();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-panel-border bg-panel-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-panel-text">Nouveau BOLO</h2>
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer"
            className="rounded-md px-2 py-1 text-panel-muted outline-none hover:text-panel-text focus-visible:bg-panel-border/60"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Priorité
          </label>
          <div className="relative">
            <select
              value={priorite}
              onChange={(e) => setPriorite(e.target.value as PrioriteBolo)}
              className="w-full appearance-none rounded-md border border-panel-border bg-panel-bg px-3 py-2 pr-8 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
            >
              {PRIORITES_BOLO.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronSelect />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Signalement <span className="text-red-400">*</span>
          </label>
          <textarea
            value={signalement}
            onChange={(e) => setSignalement(e.target.value)}
            rows={3}
            placeholder="Décrivez la situation, les circonstances, les éléments identifiables..."
            className="w-full resize-none rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none placeholder:text-panel-muted transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
          />
          {tentativeEnvoi && !signalementValide && (
            <p className="mt-1 text-xs text-red-400">Le signalement est obligatoire.</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Personne ciblée
            </label>
            <input
              type="text"
              value={personneCible}
              onChange={(e) => setPersonneCible(e.target.value)}
              placeholder="Nom, alias..."
              className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none placeholder:text-panel-muted transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Véhicule ciblé
            </label>
            <input
              type="text"
              value={vehiculeCible}
              onChange={(e) => setVehiculeCible(e.target.value)}
              placeholder="Modèle, couleur, plaque..."
              className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none placeholder:text-panel-muted transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Date d'expiration
          </label>
          <input
            type="date"
            value={dateExpirationInput}
            onChange={(e) => setDateExpirationInput(e.target.value)}
            className="w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-xs text-panel-text outline-none transition-colors focus-visible:border-panel-accent focus-visible:bg-panel-surface"
          />
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-panel-muted">Destinataires</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 rounded-md border border-panel-border bg-panel-bg p-2.5">
            {DESTINATAIRES_BOLO.map((d) => (
              <label key={d} className="flex items-center gap-2 text-xs text-panel-text">
                <input
                  type="checkbox"
                  checked={destinataires.includes(d)}
                  onChange={() => toggleDestinataire(d)}
                  className="h-3.5 w-3.5 rounded border-panel-border bg-panel-bg text-panel-accent outline-none"
                />
                {d}
              </label>
            ))}
          </div>
          {tentativeEnvoi && !destinatairesValides && (
            <p className="mt-1 text-xs text-red-400">Sélectionnez au moins un destinataire.</p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={fermer}
            className="rounded-md border border-panel-border px-4 py-2 text-xs font-medium text-panel-text outline-none hover:bg-panel-border/40 focus-visible:bg-panel-border/40"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={creer}
            className="rounded-md border border-panel-accent/40 bg-panel-accent/15 px-4 py-2 text-xs font-medium text-panel-text outline-none hover:bg-panel-accent/25 focus-visible:bg-panel-accent/25"
          >
            Diffuser le BOLO
          </button>
        </div>
      </div>
    </div>
  );
}

function BoloCard({
  bolo,
  onAccuser,
  onAnnuler,
}: {
  bolo: Bolo;
  onAccuser: (id: string) => void;
  onAnnuler: (id: string) => void;
}): JSX.Element {
  const stylePriorite = PRIORITE_BOLO_STYLE[bolo.priorite];
  const styleStatut = STATUT_BOLO_STYLE[bolo.statut];
  const dejaAccuse = bolo.accusesLecture.includes(mockUtilisateurNomAffiche);
  const expireDepasse = bolo.statut === "Actif" && estExpire(bolo.dateExpiration);

  return (
    <div className={`flex flex-col rounded-lg border bg-panel-surface p-4 ${stylePriorite.border}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-panel-text">{bolo.numero}</span>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${stylePriorite.bg} ${stylePriorite.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stylePriorite.dot}`} />
            {bolo.priorite}
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${styleStatut.bg} ${styleStatut.text}`}>
            {bolo.statut}
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm text-panel-text">{bolo.signalement}</p>

      {(bolo.personneCible || bolo.vehiculeCible) && (
        <div className="mt-2 flex flex-col gap-1 text-xs text-panel-muted">
          {bolo.personneCible && (
            <span>
              <span className="text-panel-muted">Personne : </span>
              <span className="text-panel-text">{bolo.personneCible}</span>
            </span>
          )}
          {bolo.vehiculeCible && (
            <span>
              <span className="text-panel-muted">Véhicule : </span>
              <span className="text-panel-text">{bolo.vehiculeCible}</span>
            </span>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-panel-muted">
        <span>Diffusé le {bolo.dateCreation}</span>
        <span>
          Expire le {bolo.dateExpiration}
          {expireDepasse && <span className="ml-1 font-medium text-orange-400">(Expiré)</span>}
        </span>
        <span>Par {bolo.auteur}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {bolo.destinataires.map((d) => (
          <span
            key={d}
            className="rounded border border-panel-border bg-panel-bg px-1.5 py-0.5 text-[10px] text-panel-muted"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="mt-2 text-[11px] text-panel-muted" title={bolo.accusesLecture.join(", ")}>
        {bolo.accusesLecture.length === 0 ? (
          <span>Aucun accusé de lecture</span>
        ) : bolo.accusesLecture.length <= 3 ? (
          <span>
            {bolo.accusesLecture.length} accusé{bolo.accusesLecture.length > 1 ? "s" : ""} de lecture —{" "}
            {bolo.accusesLecture.join(", ")}
          </span>
        ) : (
          <span>
            {bolo.accusesLecture.length} accusés de lecture
          </span>
        )}
      </div>

      {bolo.statut === "Actif" && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={dejaAccuse}
            onClick={() => onAccuser(bolo.id)}
            className="flex-1 rounded-md border border-panel-accent/40 bg-panel-accent/15 px-3 py-1.5 text-xs font-medium text-panel-text outline-none transition-colors hover:bg-panel-accent/25 focus-visible:bg-panel-accent/25 disabled:cursor-not-allowed disabled:border-panel-border disabled:bg-panel-border/40 disabled:text-panel-muted"
          >
            {dejaAccuse ? "Lecture accusée" : "Accuser réception"}
          </button>
          <button
            type="button"
            onClick={() => onAnnuler(bolo.id)}
            className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 outline-none transition-colors hover:bg-red-500/20 focus-visible:bg-red-500/20"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}

export function BoloTab(): JSX.Element {
  const { bolos, setBolos } = useMandatsBoloState();
  const { addToast } = useToast();
  const [modalOuverte, setModalOuverte] = useState(false);

  const bolosTries = useMemo(() => trierBolos(bolos), [bolos]);

  function ajouterBolo(bolo: Bolo) {
    setBolos((prev) => [...prev, bolo]);
    setModalOuverte(false);
    addToast(`BOLO ${bolo.numero} diffusé.`, "success");
  }

  function accuserReception(id: string) {
    setBolos((prev) =>
      prev.map((b) =>
        b.id === id && !b.accusesLecture.includes(mockUtilisateurNomAffiche)
          ? { ...b, accusesLecture: [...b.accusesLecture, mockUtilisateurNomAffiche] }
          : b,
      ),
    );
  }

  function annulerBolo(id: string) {
    const bolo = bolos.find((b) => b.id === id);
    setBolos((prev) => prev.map((b) => (b.id === id ? { ...b, statut: "Annulé" } : b)));
    if (bolo) addToast(`BOLO ${bolo.numero} annulé.`, "info");
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-panel-border p-3">
        <h2 className="text-sm font-semibold text-panel-text">BOLO</h2>
        <button
          type="button"
          onClick={() => setModalOuverte(true)}
          className="rounded-md border border-panel-accent/40 bg-panel-accent/15 px-2.5 py-1.5 text-xs font-medium text-panel-accent outline-none transition-colors hover:bg-panel-accent/25 focus-visible:bg-panel-accent/25 focus-visible:border-panel-accent"
        >
          + Nouveau BOLO
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {bolosTries.length === 0 ? (
          <p className="flex h-full items-center justify-center text-center text-sm text-panel-muted">
            Aucun BOLO actif. Créez-en un pour diffuser une alerte.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {bolosTries.map((bolo) => (
              <BoloCard key={bolo.id} bolo={bolo} onAccuser={accuserReception} onAnnuler={annulerBolo} />
            ))}
          </div>
        )}
      </div>

      <NouveauBoloModal
        open={modalOuverte}
        onClose={() => setModalOuverte(false)}
        bolos={bolos}
        onCreer={ajouterBolo}
      />
    </div>
  );
}
