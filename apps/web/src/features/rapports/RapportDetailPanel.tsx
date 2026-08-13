import { useState } from "react";
import {
  STATUT_RAPPORT_OPTIONS,
  STATUT_RAPPORT_STYLE,
  type CategorieRapport,
  type Rapport,
  type RapportStatut,
  type SousCategorieRapport,
} from "./mockRapports";

const BOUTON_BASE = "rounded-md border px-3 py-1.5 text-xs font-medium outline-none transition-colors";
const BOUTON_NEUTRE = `${BOUTON_BASE} border-panel-border bg-panel-bg text-panel-text hover:bg-panel-surface focus-visible:border-panel-accent/50 focus-visible:bg-panel-surface`;
const BOUTON_ACCENT = `${BOUTON_BASE} border-panel-accent/40 bg-panel-accent/15 text-panel-accent hover:bg-panel-accent/25 focus-visible:border-panel-accent focus-visible:bg-panel-accent/25`;
const BOUTON_EMERALD = `${BOUTON_BASE} border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 focus-visible:border-emerald-500 focus-visible:bg-emerald-500/25`;
const BOUTON_AMBRE = `${BOUTON_BASE} border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 focus-visible:border-amber-500 focus-visible:bg-amber-500/25`;

function Section({ titre, children }: { titre: string; children: JSX.Element }): JSX.Element {
  return (
    <section className="flex flex-col gap-2 border-b border-panel-border p-4 last:border-b-0">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-panel-muted">{titre}</h3>
      {children}
    </section>
  );
}

export function RapportDetailPanel({
  rapport,
  categorie,
  sousCategorie,
  estAutorisePourConfidentiel = true,
  onChangerStatut,
  onAjouterCommentaire,
  onEditer,
  onExporter,
}: {
  rapport: Rapport;
  categorie: CategorieRapport | undefined;
  sousCategorie?: SousCategorieRapport;
  estAutorisePourConfidentiel?: boolean;
  onChangerStatut: (statut: RapportStatut) => void;
  onAjouterCommentaire: (texte: string) => void;
  onEditer: () => void;
  onExporter: () => void;
}): JSX.Element {
  const [texteCommentaire, setTexteCommentaire] = useState("");
  const [versionsOuvertes, setVersionsOuvertes] = useState<Set<string>>(new Set());

  const style = STATUT_RAPPORT_STYLE[rapport.statut];
  const contenuMasque = rapport.confidentiel && !estAutorisePourConfidentiel;

  const envoyerCommentaire = () => {
    const texte = texteCommentaire.trim();
    if (!texte) return;
    onAjouterCommentaire(texte);
    setTexteCommentaire("");
  };

  const basculerVersion = (id: string) => {
    setVersionsOuvertes((precedent) => {
      const suivant = new Set(precedent);
      if (suivant.has(id)) {
        suivant.delete(id);
      } else {
        suivant.add(id);
      }
      return suivant;
    });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-lg border border-panel-border bg-panel-surface">
      <div className="flex flex-col gap-2 border-b border-panel-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-panel-muted">{rapport.numero}</p>
            <h2 className="mt-0.5 text-lg font-bold text-panel-text">{rapport.titre}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {rapport.confidentiel && (
              <span className="rounded border border-red-500/30 bg-red-500/15 px-2 py-1 text-xs font-medium text-red-400">
                🔒 Confidentiel
              </span>
            )}
            <span
              className={`rounded border px-2 py-1 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}
            >
              {rapport.statut}
            </span>
          </div>
        </div>
        <p className="text-xs text-panel-muted">
          {categorie?.nom ?? "Catégorie inconnue"}
          {sousCategorie ? ` · ${sousCategorie.nom}` : ""}
        </p>
      </div>

      <div className="flex items-center px-4 pt-4">
        {STATUT_RAPPORT_OPTIONS.map((etape, index) => {
          const active = etape === rapport.statut;
          const etapeStyle = STATUT_RAPPORT_STYLE[etape];
          return (
            <div key={etape} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={
                    active
                      ? `h-3 w-3 rounded-full border-2 ${etapeStyle.border} ${etapeStyle.bg}`
                      : "h-2.5 w-2.5 rounded-full border border-panel-border bg-panel-bg"
                  }
                />
                <span className={`whitespace-nowrap text-[10px] ${active ? etapeStyle.text : "text-panel-muted"}`}>
                  {etape}
                </span>
              </div>
              {index < STATUT_RAPPORT_OPTIONS.length - 1 && <div className="mx-1 h-px flex-1 bg-panel-border" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 border-b border-panel-border p-4 pt-5 text-xs sm:grid-cols-4">
        <div>
          <p className="text-panel-muted">Auteur</p>
          <p className="mt-0.5 text-panel-text">{rapport.auteur}</p>
        </div>
        <div>
          <p className="text-panel-muted">Relecteur</p>
          <p className="mt-0.5 text-panel-text">{rapport.relecteur ?? "—"}</p>
        </div>
        <div>
          <p className="text-panel-muted">Créé le</p>
          <p className="mt-0.5 text-panel-text">{rapport.createdAt}</p>
        </div>
        <div>
          <p className="text-panel-muted">Mis à jour le</p>
          <p className="mt-0.5 text-panel-text">{rapport.updatedAt}</p>
        </div>
      </div>

      {contenuMasque ? (
        <div className="flex flex-col items-center gap-2 border-b border-panel-border p-8 text-center">
          <span className="text-2xl">🔒</span>
          <p className="text-sm font-medium text-panel-text">Contenu confidentiel — accès restreint.</p>
          <p className="text-xs text-panel-muted">Seuls les rôles autorisés peuvent consulter ce rapport.</p>
        </div>
      ) : (
        <>
          <Section titre="Contenu">
            {categorie === undefined ? (
              <p className="text-sm text-panel-muted">Catégorie introuvable</p>
            ) : (
              <div className="flex flex-col gap-3">
                {categorie.champs.map((champ) => (
                  <div key={champ.id}>
                    <p className="text-[11px] text-panel-muted">{champ.label}</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-panel-text">
                      {rapport.contenu[champ.id]?.trim() ? rapport.contenu[champ.id] : "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section titre="Liens">
            {rapport.liens.length === 0 ? (
              <p className="text-sm text-panel-muted">Aucun lien.</p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {rapport.liens.map((lien) => (
                  <li
                    key={lien.id}
                    className="rounded border border-panel-border bg-panel-bg px-2 py-1 text-xs text-panel-text"
                  >
                    <span className="text-panel-muted">{lien.type}</span> · {lien.libelle}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section titre="Pièces jointes">
            {rapport.pieceJointes.length === 0 ? (
              <p className="text-sm text-panel-muted">Aucune pièce jointe.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {rapport.pieceJointes.map((piece) => (
                  <li
                    key={piece.id}
                    className="flex items-center justify-between gap-2 rounded border border-panel-border bg-panel-bg px-3 py-2 text-xs"
                  >
                    <span className="truncate text-panel-text">{piece.nom}</span>
                    <span className="shrink-0 text-panel-muted">{piece.taille}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section titre="Commentaires">
            <div className="flex flex-col gap-3">
              {rapport.commentaires.length === 0 ? (
                <p className="text-sm text-panel-muted">Aucun commentaire.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {rapport.commentaires.map((commentaire) => (
                    <li key={commentaire.id} className="rounded border border-panel-border bg-panel-bg p-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-panel-text">{commentaire.auteur}</span>
                        <span className="text-panel-muted">{commentaire.date}</span>
                      </div>
                      <p className="mt-1 text-panel-text">{commentaire.texte}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-2">
                <textarea
                  value={texteCommentaire}
                  onChange={(e) => setTexteCommentaire(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  rows={2}
                  className="w-full resize-none rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-text outline-none transition-colors placeholder:text-panel-muted focus-visible:border-panel-accent focus-visible:bg-panel-surface"
                />
                <button type="button" onClick={envoyerCommentaire} className={`${BOUTON_ACCENT} self-end`}>
                  Ajouter
                </button>
              </div>
            </div>
          </Section>
        </>
      )}

      <Section titre="Historique des versions">
        {rapport.historique.length === 0 ? (
          <p className="text-sm text-panel-muted">Aucun historique.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {rapport.historique.map((version) => (
              <li key={version.id} className="flex items-start justify-between gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-panel-text">{version.resume}</span>
                  <span className="text-panel-muted">{version.auteur}</span>
                </div>
                <span className="shrink-0 whitespace-nowrap text-panel-muted">{version.date}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="mt-auto flex items-center justify-end gap-2 p-4">
        {rapport.statut === "Brouillon" && (
          <>
            <button type="button" onClick={onEditer} className={BOUTON_NEUTRE}>
              Éditer
            </button>
            <button type="button" onClick={() => onChangerStatut("Soumis")} className={BOUTON_ACCENT}>
              Soumettre
            </button>
          </>
        )}
        {rapport.statut === "Soumis" && (
          <>
            <button type="button" onClick={() => onChangerStatut("À corriger")} className={BOUTON_AMBRE}>
              Renvoyer pour correction
            </button>
            <button type="button" onClick={() => onChangerStatut("Approuvé")} className={BOUTON_EMERALD}>
              Approuver
            </button>
          </>
        )}
        {rapport.statut === "À corriger" && (
          <button type="button" onClick={onEditer} className={BOUTON_NEUTRE}>
            Éditer
          </button>
        )}
        {rapport.statut === "Approuvé" && (
          <>
            <button type="button" onClick={() => onChangerStatut("Archivé")} className={BOUTON_NEUTRE}>
              Archiver
            </button>
            <button type="button" onClick={onExporter} className={BOUTON_ACCENT}>
              Exporter
            </button>
          </>
        )}
        {rapport.statut === "Archivé" && (
          <button type="button" onClick={() => onChangerStatut("À corriger")} className={BOUTON_NEUTRE}>
            Rouvrir
          </button>
        )}
      </div>
    </div>
  );
}
