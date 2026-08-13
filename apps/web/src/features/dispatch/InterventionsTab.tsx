import { useEffect, useMemo, useState } from "react";
import {
  PRIORITE_STYLE,
  STATUT_OPTIONS,
  type DispatchDetail,
  type DispatchStatut,
  type Priorite,
} from "./mockDispatch";
import { indicatifEquipage } from "./mockEquipages";
import { useDispatchState } from "../../shared/dispatchContext";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";
import { IconCarte } from "../../shared/icons";
import { generateId } from "../../shared/id";

const PRIORITE_CYCLE: Priorite[] = ["Normale", "Urgente", "Critique"];

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function IntervalCard({
  dispatch,
  selected,
  onSelect,
  onSupprimer,
}: {
  dispatch: DispatchDetail;
  selected: boolean;
  onSelect: () => void;
  onSupprimer: () => void;
}) {
  const style = PRIORITE_STYLE[dispatch.priorite];
  const sansUnite = dispatch.unitesEngagees.length === 0;
  const enAlerte = sansUnite && dispatch.priorite !== "Normale" && dispatch.statut !== "Clôturé";

  return (
    <div
      className={`group relative w-full rounded-md border-l-4 border-y border-r text-left transition-colors ${
        style.border
      } ${
        selected
          ? "border-y-panel-accent/40 border-r-panel-accent/40 bg-panel-surface"
          : "border-y-panel-border border-r-panel-border bg-panel-bg hover:bg-panel-surface"
      }`}
    >
      <button type="button" onClick={onSelect} className="w-full px-3 py-2 text-left outline-none">
        <div className="flex items-center justify-between pr-5">
          <span className={`text-sm font-semibold ${style.text}`}>{dispatch.numero}</span>
          <span className="text-[11px] text-panel-muted">{dispatch.creeDepuis}</span>
        </div>
        <p className="mt-0.5 truncate pr-5 text-xs text-panel-text">
          {dispatch.categorie} · {dispatch.unitesEngagees.length} unité
          {dispatch.unitesEngagees.length > 1 ? "s" : ""}
        </p>
        {enAlerte && (
          <span className="mt-1 inline-block rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-300">
            ⚠ Aucune unité assignée
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSupprimer();
        }}
        title="Supprimer l'intervention"
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded text-panel-muted opacity-0 outline-none transition-opacity hover:bg-red-500/15 hover:text-red-300 focus-visible:opacity-100 focus-visible:bg-red-500/15 focus-visible:text-red-300 group-hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

export function InterventionsTab() {
  const {
    equipages,
    setEquipages,
    interventions: dispatchs,
    setInterventions: setDispatchs,
  } = useDispatchState();
  const [selectedId, setSelectedId] = useState(dispatchs[0]?.id ?? "");
  const [commentaire, setCommentaire] = useState("");
  const [carteReduite, setCarteReduite] = useState(false);

  const selected = useMemo(
    () => dispatchs.find((d) => d.id === selectedId) ?? null,
    [dispatchs, selectedId],
  );

  function updateSelected(updater: (d: DispatchDetail) => DispatchDetail) {
    setDispatchs((prev) => prev.map((d) => (d.id === selectedId ? updater(d) : d)));
  }

  function ajouterEvenement(texte: string) {
    updateSelected((d) => ({
      ...d,
      filActivite: [...d.filActivite, { id: generateId(), heure: heureActuelle(), texte }],
    }));
  }

  function changerStatut(nouveau: DispatchStatut) {
    if (!selected || nouveau === selected.statut) return;
    ajouterEvenement(`Statut changé : ${selected.statut} → ${nouveau}`);
    updateSelected((d) => ({ ...d, statut: nouveau }));

    // Une intervention clôturée/annulée libère automatiquement les équipages qui y étaient engagés.
    if (nouveau === "Clôturé" || nouveau === "Annulé") {
      setEquipages((prev) =>
        prev.map((eq) =>
          eq.interventionLiee === selected.numero
            ? { ...eq, statut: "Actif", interventionLiee: undefined }
            : eq,
        ),
      );
    }
  }

  function changerPriorite() {
    if (!selected) return;
    const idx = PRIORITE_CYCLE.indexOf(selected.priorite);
    const suivante = PRIORITE_CYCLE[(idx + 1) % PRIORITE_CYCLE.length];
    ajouterEvenement(`Priorité changée : ${selected.priorite} → ${suivante}`);
    updateSelected((d) => ({ ...d, priorite: suivante }));
  }

  function retirerUnite(uniteId: string) {
    if (!selected) return;
    const unite = selected.unitesEngagees.find((u) => u.id === uniteId);
    if (!unite) return;
    ajouterEvenement(`${unite.indicatif} retirée de l'intervention`);
    updateSelected((d) => ({
      ...d,
      unitesEngagees: d.unitesEngagees.filter((u) => u.id !== uniteId),
    }));
    // Libère l'équipage : il redevient assignable à une autre intervention.
    setEquipages((prev) =>
      prev.map((eq) =>
        indicatifEquipage(eq) === unite.indicatif && eq.interventionLiee === selected.numero
          ? { ...eq, statut: "Actif", interventionLiee: undefined }
          : eq,
      ),
    );
  }

  function assignerUnite(indicatif: string) {
    if (!selected) return;
    ajouterEvenement(`${indicatif} affectée`);
    updateSelected((d) => ({
      ...d,
      unitesEngagees: [
        ...d.unitesEngagees,
        { id: generateId(), indicatif, statut: "En route", couleur: "#22c55e" },
      ],
    }));
    // L'équipage engagé n'est plus disponible pour une autre intervention tant qu'il est ici.
    setEquipages((prev) =>
      prev.map((eq) =>
        indicatifEquipage(eq) === indicatif
          ? { ...eq, statut: "En intervention", interventionLiee: selected.numero }
          : eq,
      ),
    );
  }

  function envoyerCommentaire() {
    const texte = commentaire.trim();
    if (!texte) return;
    ajouterEvenement(`${mockUtilisateurNomAffiche} : « ${texte} »`);
    setCommentaire("");
  }

  function supprimerIntervention(id: string) {
    const cible = dispatchs.find((d) => d.id === id);
    if (!cible) return;

    // Libère les équipages encore liés à cette intervention avant de la supprimer.
    setEquipages((prev) =>
      prev.map((eq) =>
        eq.interventionLiee === cible.numero
          ? { ...eq, statut: "Actif", interventionLiee: undefined }
          : eq,
      ),
    );

    setDispatchs((prev) => {
      const suivant = prev.filter((d) => d.id !== id);
      if (id === selectedId) {
        setSelectedId(suivant[0]?.id ?? "");
      }
      return suivant;
    });
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const idx = dispatchs.findIndex((d) => d.id === selectedId);
      if (e.key === "j") setSelectedId(dispatchs[Math.min(idx + 1, dispatchs.length - 1)]?.id ?? selectedId);
      if (e.key === "k") setSelectedId(dispatchs[Math.max(idx - 1, 0)]?.id ?? selectedId);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatchs, selectedId]);

  // Une intervention ne peut mobiliser qu'un équipage réellement actif et disponible
  // (voir décision « les interventions s'appuient sur des patrouilles/équipages existants »).
  const unitesDisponibles = equipages.filter(
    (eq) =>
      eq.statut === "Actif" &&
      !selected?.unitesEngagees.some((eng) => eng.indicatif === indicatifEquipage(eq)),
  );

  const cloture = selected?.statut === "Clôturé" || selected?.statut === "Annulé";

  return (
    <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[280px_1fr_auto]">
      <section className="flex min-h-0 flex-col rounded-lg border border-panel-border bg-panel-surface p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-panel-muted">
            Interventions ({dispatchs.length})
          </h2>
          <button
            type="button"
            className="rounded border border-panel-border px-2 py-1 text-[11px] text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
          >
            + Créer
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {dispatchs.map((d) => (
            <IntervalCard
              key={d.id}
              dispatch={d}
              selected={d.id === selectedId}
              onSelect={() => setSelectedId(d.id)}
              onSupprimer={() => supprimerIntervention(d.id)}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-panel-muted">
          Raccourcis : <kbd className="rounded bg-panel-bg px-1">j</kbd>/
          <kbd className="rounded bg-panel-bg px-1">k</kbd> pour naviguer
        </p>
      </section>

      {selected ? (
        <section className="flex min-h-0 flex-col overflow-y-auto rounded-lg border border-panel-border bg-panel-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-panel-border pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${PRIORITE_STYLE[selected.priorite].dot}`}
                aria-hidden="true"
              />
              <span className={`text-sm font-bold uppercase ${PRIORITE_STYLE[selected.priorite].text}`}>
                {selected.priorite}
              </span>
              <span className="text-panel-muted">·</span>
              <select
                value={selected.statut}
                onChange={(e) => changerStatut(e.target.value as DispatchStatut)}
                className="rounded border border-panel-border bg-panel-bg px-2 py-1 text-xs text-panel-text focus:outline-none focus:ring-1 focus:ring-panel-accent"
              >
                {STATUT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-panel-muted">{selected.numero}</span>
          </div>

          <h1 className="mt-3 text-lg font-semibold text-panel-text">{selected.description}</h1>
          <p className="mt-1 text-sm text-panel-muted">📍 {selected.lieu}</p>

          {selected.objectifMission && (
            <div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                Objectif de mission
              </p>
              {selected.objectifMission}
            </div>
          )}

          <div className="mt-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Unités engagées
            </h2>
            <ul className="flex flex-col gap-1.5">
              {selected.unitesEngagees.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between rounded-md border border-panel-border bg-panel-bg px-3 py-1.5 text-sm"
                >
                  <span className="flex items-center gap-2 text-panel-text">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: u.couleur }}
                      aria-hidden="true"
                    />
                    {u.indicatif} <span className="text-panel-muted">· {u.statut}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => retirerUnite(u.id)}
                    className="text-xs text-panel-muted hover:text-red-300"
                  >
                    Retirer
                  </button>
                </li>
              ))}
              {selected.unitesEngagees.length === 0 && (
                <li className="rounded-md border border-dashed border-panel-border px-3 py-2 text-xs text-panel-muted">
                  Aucune unité assignée.
                </li>
              )}
            </ul>
            {unitesDisponibles.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {unitesDisponibles.map((eq) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => assignerUnite(indicatifEquipage(eq))}
                    className="rounded border border-panel-border px-2 py-1 text-[11px] text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
                  >
                    + Assigner {indicatifEquipage(eq)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-panel-muted">
                Aucune patrouille disponible à assigner — voir l'onglet Patrouilles.
              </p>
            )}
          </div>

          <div className="mt-4 flex-1">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Fil d'activité
            </h2>
            <ul className="flex flex-col gap-1.5">
              {selected.filActivite.map((evt) => (
                <li key={evt.id} className="flex gap-2 text-sm">
                  <span className="shrink-0 text-[11px] tabular-nums text-panel-muted">{evt.heure}</span>
                  <span className="text-panel-text">{evt.texte}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) envoyerCommentaire();
                }}
                placeholder="Ajouter un commentaire... (Ctrl+Entrée)"
                className="flex-1 rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-text placeholder:text-panel-muted focus:outline-none focus:ring-1 focus:ring-panel-accent"
              />
              <button
                type="button"
                onClick={envoyerCommentaire}
                className="rounded-md border border-panel-border px-3 text-sm text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
              >
                →
              </button>
            </div>
          </div>

          {!cloture && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-panel-border pt-3">
              <button
                type="button"
                onClick={changerPriorite}
                className="rounded-md border border-panel-border px-3 py-1.5 text-xs text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
              >
                Changer priorité
              </button>
              <button
                type="button"
                onClick={() => changerStatut("Clôturé")}
                className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
              >
                Clôturer
              </button>
              <button
                type="button"
                onClick={() => changerStatut("Annulé")}
                className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
              >
                Annuler
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="flex items-center justify-center rounded-lg border border-panel-border bg-panel-surface text-sm text-panel-muted">
          Sélectionne une intervention.
        </section>
      )}

      <section
        className={`flex min-h-0 flex-col rounded-lg border border-panel-border bg-panel-surface transition-all ${
          carteReduite ? "w-12" : "w-full lg:w-64"
        }`}
      >
        <div className="flex items-center justify-between border-b border-panel-border p-2">
          {!carteReduite && (
            <span className="text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Carte
            </span>
          )}
          <button
            type="button"
            onClick={() => setCarteReduite((v) => !v)}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded text-panel-muted hover:bg-panel-bg hover:text-panel-text"
            title={carteReduite ? "Agrandir la carte" : "Réduire la carte"}
          >
            <IconCarte className="h-4 w-4" />
          </button>
        </div>

        {!carteReduite && (
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-panel-border bg-panel-bg text-center text-xs text-panel-muted">
              Carte interactive (Leaflet)
              <br />à venir — Phase 3
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-panel-muted">
                Calques
              </p>
              <div className="flex flex-col gap-1 text-xs text-panel-text">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5" /> Routes
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5" /> Bâtiments
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-3.5 w-3.5" /> Patrouilles
                </label>
              </div>
            </div>
            <button
              type="button"
              className="rounded border border-panel-border px-2 py-1.5 text-[11px] text-panel-muted hover:border-panel-accent/50 hover:text-panel-text"
            >
              + Marqueur
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
