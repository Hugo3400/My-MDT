import { useEffect, useState } from "react";
import { RapportsListPanel } from "./RapportsListPanel";
import { RapportFormulaire } from "./RapportFormulaire";
import { RapportDetailPanel } from "./RapportDetailPanel";
import {
  CATEGORIES_RAPPORT,
  mockRapports,
  trouverCategorie,
  type LienRapport,
  type PieceJointeRapport,
  type Rapport,
  type RapportStatut,
} from "./mockRapports";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";
import { useToast } from "../../shared/toastContext";
import { generateId } from "../../shared/id";

const STORAGE_KEY = "panel:rapports-session";

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dateHeureActuelle() {
  return `${new Date().toLocaleDateString("fr-FR")} ${heureActuelle()}`;
}

function lireRapportsPersistes(): Rapport[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

type Mode = "detail" | "creation" | "edition";

export function RapportsPage() {
  const { addToast } = useToast();
  const [rapports, setRapports] = useState<Rapport[]>(() => lireRapportsPersistes() ?? mockRapports);
  const [selectedId, setSelectedId] = useState<string | null>(rapports[0]?.id ?? null);
  const [mode, setMode] = useState<Mode>("detail");

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rapports));
  }, [rapports]);

  const rapportSelectionne = rapports.find((r) => r.id === selectedId) ?? null;
  const categorieSelectionnee = rapportSelectionne
    ? trouverCategorie(rapportSelectionne.categorieId)
    : undefined;

  function selectionner(id: string) {
    setSelectedId(id);
    setMode("detail");
  }

  function ouvrirCreation() {
    setMode("creation");
  }

  function ouvrirEdition() {
    if (rapportSelectionne) setMode("edition");
  }

  function annulerFormulaire() {
    setMode("detail");
  }

  function enregistrerFormulaire(data: {
    categorieId: string;
    titre: string;
    contenu: Record<string, string>;
    liens: LienRapport[];
    pieceJointes: PieceJointeRapport[];
  }) {
    if (mode === "creation") {
      const nouveau: Rapport = {
        id: generateId(),
        numero: `RAP-2026-${String(Math.floor(Math.random() * 900 + 100))}`,
        categorieId: data.categorieId,
        titre: data.titre,
        statut: "Brouillon",
        auteur: mockUtilisateurNomAffiche,
        createdAt: dateHeureActuelle(),
        updatedAt: dateHeureActuelle(),
        contenu: data.contenu,
        liens: data.liens,
        pieceJointes: data.pieceJointes,
        commentaires: [],
        historique: [
          { id: generateId(), date: dateHeureActuelle(), auteur: mockUtilisateurNomAffiche, resume: "Création du rapport" },
        ],
      };
      setRapports((prev) => [nouveau, ...prev]);
      setSelectedId(nouveau.id);
      addToast(`Rapport ${nouveau.numero} créé`, "success");
    } else if (mode === "edition" && rapportSelectionne) {
      const remisEnSoumission = rapportSelectionne.statut === "À corriger";
      setRapports((prev) =>
        prev.map((r) =>
          r.id === rapportSelectionne.id
            ? {
                ...r,
                categorieId: data.categorieId,
                titre: data.titre,
                contenu: data.contenu,
                liens: data.liens,
                pieceJointes: data.pieceJointes,
                statut: remisEnSoumission ? "Soumis" : r.statut,
                updatedAt: dateHeureActuelle(),
                historique: [
                  ...r.historique,
                  {
                    id: generateId(),
                    date: dateHeureActuelle(),
                    auteur: mockUtilisateurNomAffiche,
                    resume: remisEnSoumission ? "Corrigé et resoumis" : "Modification du rapport",
                  },
                ],
              }
            : r,
        ),
      );
      addToast(`Rapport ${rapportSelectionne.numero} mis à jour`, "success");
    }
    setMode("detail");
  }

  function changerStatut(statut: RapportStatut) {
    if (!rapportSelectionne) return;
    setRapports((prev) =>
      prev.map((r) =>
        r.id === rapportSelectionne.id
          ? {
              ...r,
              statut,
              relecteur: statut === "Approuvé" || statut === "À corriger" ? mockUtilisateurNomAffiche : r.relecteur,
              updatedAt: dateHeureActuelle(),
              historique: [
                ...r.historique,
                {
                  id: generateId(),
                  date: dateHeureActuelle(),
                  auteur: mockUtilisateurNomAffiche,
                  resume: `Statut changé : ${r.statut} → ${statut}`,
                },
              ],
            }
          : r,
      ),
    );
    addToast(`${rapportSelectionne.numero} : ${statut}`, "info");
  }

  function ajouterCommentaire(texte: string) {
    if (!rapportSelectionne) return;
    setRapports((prev) =>
      prev.map((r) =>
        r.id === rapportSelectionne.id
          ? {
              ...r,
              commentaires: [
                ...r.commentaires,
                { id: generateId(), auteur: mockUtilisateurNomAffiche, texte, date: dateHeureActuelle() },
              ],
              updatedAt: dateHeureActuelle(),
            }
          : r,
      ),
    );
  }

  function exporter() {
    addToast("Export PDF indisponible dans cet aperçu — prévu selon le gabarit de l'organisme.", "info");
  }

  return (
    <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[320px_1fr]">
      <div className="min-h-0 rounded-lg border border-panel-border bg-panel-surface">
        <RapportsListPanel
          rapports={rapports}
          categories={CATEGORIES_RAPPORT}
          selectedId={selectedId}
          onSelect={selectionner}
          onNouveauRapport={ouvrirCreation}
        />
      </div>

      <div className="min-h-0">
        {mode === "creation" || mode === "edition" ? (
          <div className="h-full rounded-lg border border-panel-border bg-panel-surface p-4">
            <RapportFormulaire
              categories={CATEGORIES_RAPPORT}
              rapportExistant={mode === "edition" ? (rapportSelectionne ?? undefined) : undefined}
              onEnregistrer={enregistrerFormulaire}
              onAnnuler={annulerFormulaire}
            />
          </div>
        ) : rapportSelectionne ? (
          <RapportDetailPanel
            rapport={rapportSelectionne}
            categorie={categorieSelectionnee}
            onChangerStatut={changerStatut}
            onAjouterCommentaire={ajouterCommentaire}
            onEditer={ouvrirEdition}
            onExporter={exporter}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-panel-border bg-panel-surface text-sm text-panel-muted">
            Sélectionne un rapport ou crée-en un nouveau.
          </div>
        )}
      </div>
    </div>
  );
}
