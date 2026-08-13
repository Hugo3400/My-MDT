import { useState } from "react";
import { RapportsListPanel } from "./RapportsListPanel";
import { RapportFormulaire } from "./RapportFormulaire";
import { RapportDetailPanel } from "./RapportDetailPanel";
import { RapportImpression } from "./RapportImpression";
import {
  CATEGORIES_RAPPORT,
  genererNumeroRapport,
  trouverCategorie,
  trouverSousCategorie,
  type LienRapport,
  type PieceJointeRapport,
  type Rapport,
  type RapportStatut,
} from "./mockRapports";
import { mockUtilisateurNomAffiche } from "../../shared/mockData";
import { useAuth } from "../../shared/AuthContext";
import { useToast } from "../../shared/toastContext";
import { useRapportsState } from "../../shared/rapportsContext";
import { generateId } from "../../shared/id";

function heureActuelle() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dateHeureActuelle() {
  return `${new Date().toLocaleDateString("fr-FR")} ${heureActuelle()}`;
}

type Mode = "detail" | "creation" | "edition";

export function RapportsPage() {
  const { addToast } = useToast();
  const { organismeActif } = useAuth();
  const { rapports, setRapports } = useRapportsState();
  const [selectedId, setSelectedId] = useState<string | null>(rapports[0]?.id ?? null);
  const [mode, setMode] = useState<Mode>("detail");
  const [impressionOuverte, setImpressionOuverte] = useState(false);

  const rapportSelectionne = rapports.find((r) => r.id === selectedId) ?? null;
  const categorieSelectionnee = rapportSelectionne
    ? trouverCategorie(rapportSelectionne.categorieId)
    : undefined;
  const sousCategorieSelectionnee = trouverSousCategorie(
    categorieSelectionnee,
    rapportSelectionne?.sousCategorieId,
  );

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
    sousCategorieId?: string;
    titre: string;
    confidentiel: boolean;
    contenu: Record<string, string>;
    liens: LienRapport[];
    pieceJointes: PieceJointeRapport[];
  }) {
    if (mode === "creation") {
      const nouveau: Rapport = {
        id: generateId(),
        numero: genererNumeroRapport(data.categorieId, rapports),
        categorieId: data.categorieId,
        sousCategorieId: data.sousCategorieId,
        titre: data.titre,
        statut: "Brouillon",
        confidentiel: data.confidentiel,
        auteur: mockUtilisateurNomAffiche,
        createdAt: dateHeureActuelle(),
        updatedAt: dateHeureActuelle(),
        contenu: data.contenu,
        liens: data.liens,
        pieceJointes: data.pieceJointes,
        commentaires: [],
        historique: [
          {
            id: generateId(),
            date: dateHeureActuelle(),
            auteur: mockUtilisateurNomAffiche,
            resume: "Création du rapport",
            contenuSnapshot: data.contenu,
          },
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
                sousCategorieId: data.sousCategorieId,
                titre: data.titre,
                confidentiel: data.confidentiel,
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
                    contenuSnapshot: data.contenu,
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
                  contenuSnapshot: r.contenu,
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

  return (
    <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[320px_1fr]">
      <div className="min-h-0 rounded-lg border border-panel-border bg-panel-surface">
        <RapportsListPanel
          rapports={rapports}
          categories={CATEGORIES_RAPPORT}
          selectedId={selectedId}
          onSelect={selectionner}
          onNouveauRapport={ouvrirCreation}
          currentUser={mockUtilisateurNomAffiche}
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
            sousCategorie={sousCategorieSelectionnee}
            estAutorisePourConfidentiel
            onChangerStatut={changerStatut}
            onAjouterCommentaire={ajouterCommentaire}
            onEditer={ouvrirEdition}
            onExporter={() => setImpressionOuverte(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-panel-border bg-panel-surface text-sm text-panel-muted">
            Sélectionne un rapport ou crée-en un nouveau.
          </div>
        )}
      </div>

      {impressionOuverte && rapportSelectionne && (
        <RapportImpression
          rapport={rapportSelectionne}
          categorie={categorieSelectionnee}
          sousCategorie={sousCategorieSelectionnee}
          organismeNom={organismeActif?.organismeNom ?? "Organisme"}
          onFermer={() => setImpressionOuverte(false)}
        />
      )}
    </div>
  );
}
