import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  TYPES_LIEN,
  type CategorieRapport,
  type ChampConfig,
  type LienRapport,
  type PieceJointeRapport,
  type Rapport,
  type TypeLien,
} from "./mockRapports";
import { generateId } from "../../shared/id";

const MAX_PIECES_JOINTES = 10;
const MAX_TAILLE_OCTETS = 10 * 1024 * 1024;

function formatTaille(octets: number): string {
  if (octets >= 1024 * 1024) return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
  return `${Math.max(1, Math.round(octets / 1024))} Ko`;
}

const inputClasses =
  "w-full rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-text outline-none placeholder:text-panel-muted focus-visible:border-panel-accent focus-visible:bg-panel-surface";
const labelClasses = "mb-1 block text-xs font-medium text-panel-muted";

function ChampDynamique({
  champ,
  valeur,
  onChange,
}: {
  champ: ChampConfig;
  valeur: string;
  onChange: (valeur: string) => void;
}) {
  return (
    <div>
      <label className={labelClasses}>
        {champ.label} {champ.obligatoire && <span className="text-red-400">*</span>}
      </label>
      {champ.type === "zone_texte" && (
        <textarea
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputClasses}
        />
      )}
      {champ.type === "select" && (
        <select value={valeur} onChange={(e) => onChange(e.target.value)} className={inputClasses}>
          <option value="">— Sélectionner —</option>
          {(champ.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {champ.type === "nombre" && (
        <input
          type="number"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}
      {champ.type === "date" && (
        <input
          type="date"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}
      {champ.type === "texte" && (
        <input
          type="text"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}
    </div>
  );
}

export function RapportFormulaire({
  categories,
  rapportExistant,
  onEnregistrer,
  onAnnuler,
}: {
  categories: CategorieRapport[];
  rapportExistant?: Rapport;
  onEnregistrer: (data: {
    categorieId: string;
    sousCategorieId?: string;
    titre: string;
    confidentiel: boolean;
    contenu: Record<string, string>;
    liens: LienRapport[];
    pieceJointes: PieceJointeRapport[];
  }) => void;
  onAnnuler: () => void;
}) {
  const [titre, setTitre] = useState(rapportExistant?.titre ?? "");
  const [categorieId, setCategorieId] = useState(rapportExistant?.categorieId ?? categories[0]?.id ?? "");
  const [sousCategorieId, setSousCategorieId] = useState(rapportExistant?.sousCategorieId ?? "");
  const [confidentiel, setConfidentiel] = useState(rapportExistant?.confidentiel ?? false);
  const [contenu, setContenu] = useState<Record<string, string>>(rapportExistant?.contenu ?? {});
  const [liens, setLiens] = useState<LienRapport[]>(rapportExistant?.liens ?? []);
  const [pieceJointes, setPieceJointes] = useState<PieceJointeRapport[]>(
    rapportExistant?.pieceJointes ?? [],
  );
  const [nouveauLienType, setNouveauLienType] = useState<TypeLien>(TYPES_LIEN[0]);
  const [nouveauLienLibelle, setNouveauLienLibelle] = useState("");
  const [messagePieceJointe, setMessagePieceJointe] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const categorieSelectionnee = categories.find((c) => c.id === categorieId);

  function changerCategorie(nouvelleCategorieId: string) {
    setCategorieId(nouvelleCategorieId);
    const nouvelleCategorie = categories.find((c) => c.id === nouvelleCategorieId);
    setSousCategorieId((prev) =>
      nouvelleCategorie?.sousCategories?.some((s) => s.id === prev) ? prev : "",
    );
  }

  function changerChamp(champId: string, valeur: string) {
    setContenu((prev) => ({ ...prev, [champId]: valeur }));
  }

  function ajouterLien() {
    const libelle = nouveauLienLibelle.trim();
    if (!libelle) return;
    setLiens((prev) => [...prev, { id: generateId(), type: nouveauLienType, libelle }]);
    setNouveauLienLibelle("");
  }

  function supprimerLien(id: string) {
    setLiens((prev) => prev.filter((l) => l.id !== id));
  }

  function ajouterFichiers(e: ChangeEvent<HTMLInputElement>) {
    const fichiers = e.target.files;
    if (!fichiers || fichiers.length === 0) return;

    const espaceRestant = MAX_PIECES_JOINTES - pieceJointes.length;
    if (espaceRestant <= 0) {
      setMessagePieceJointe("Nombre maximal de pièces jointes atteint (10).");
      e.target.value = "";
      return;
    }

    const candidats = Array.from(fichiers);
    const acceptes: PieceJointeRapport[] = [];
    let ignores = 0;
    for (const fichier of candidats) {
      if (acceptes.length >= espaceRestant || fichier.size > MAX_TAILLE_OCTETS) {
        ignores += 1;
        continue;
      }
      acceptes.push({
        id: generateId(),
        nom: fichier.name,
        taille: formatTaille(fichier.size),
        type: fichier.type,
      });
    }

    if (acceptes.length > 0) setPieceJointes((prev) => [...prev, ...acceptes]);
    setMessagePieceJointe(
      ignores > 0
        ? `${ignores} fichier${ignores > 1 ? "s" : ""} ignoré${ignores > 1 ? "s" : ""} (taille ou nombre maximal dépassé).`
        : null,
    );
    e.target.value = "";
  }

  function supprimerPieceJointe(id: string) {
    setPieceJointes((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEnregistrer(e: FormEvent) {
    e.preventDefault();
    const champsManquants = categorieSelectionnee?.champs.some(
      (champ) => champ.obligatoire && !(contenu[champ.id] ?? "").trim(),
    );
    if (!titre.trim() || !categorieId || champsManquants) {
      setErreur("Merci de remplir tous les champs obligatoires.");
      return;
    }
    setErreur(null);
    onEnregistrer({
      categorieId,
      sousCategorieId: sousCategorieId || undefined,
      titre: titre.trim(),
      confidentiel,
      contenu,
      liens,
      pieceJointes,
    });
  }

  return (
    <form onSubmit={handleEnregistrer} className="flex h-full flex-col">
      <h1 className="mb-4 text-lg font-semibold text-panel-text">
        {rapportExistant ? "Modifier le rapport" : "Nouveau rapport"}
        {rapportExistant && (
          <span className="ml-2 text-sm font-normal text-panel-muted">{rapportExistant.numero}</span>
        )}
      </h1>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClasses}>
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre du rapport"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-panel-text">
              <input
                type="checkbox"
                checked={confidentiel}
                onChange={(e) => setConfidentiel(e.target.checked)}
                className="h-4 w-4 rounded border-panel-border bg-panel-bg text-panel-accent outline-none focus-visible:border-panel-accent"
              />
              Rapport confidentiel
            </label>
            <p className="mt-1 text-[11px] text-panel-muted">
              Le contenu ne sera visible que par les rôles autorisés.
            </p>
          </div>

          <div>
            <label className={labelClasses}>
              Catégorie <span className="text-red-400">*</span>
            </label>
            <select
              value={categorieId}
              onChange={(e) => changerCategorie(e.target.value)}
              className={inputClasses}
            >
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
          </div>

          {categorieSelectionnee?.sousCategories && categorieSelectionnee.sousCategories.length > 0 && (
            <div>
              <label className={labelClasses}>Sous-catégorie</label>
              <select
                value={sousCategorieId}
                onChange={(e) => setSousCategorieId(e.target.value)}
                className={inputClasses}
              >
                <option value="">— Aucune sous-catégorie —</option>
                {categorieSelectionnee.sousCategories.map((sousCategorie) => (
                  <option key={sousCategorie.id} value={sousCategorie.id}>
                    {sousCategorie.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {categorieSelectionnee?.champs.map((champ) => (
            <ChampDynamique
              key={champ.id}
              champ={champ}
              valeur={contenu[champ.id] ?? ""}
              onChange={(valeur) => changerChamp(champ.id, valeur)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Liens
            </h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={nouveauLienType}
                onChange={(e) => setNouveauLienType(e.target.value as TypeLien)}
                className="rounded-md border border-panel-border bg-panel-bg px-2 py-2 text-sm text-panel-text outline-none focus-visible:border-panel-accent focus-visible:bg-panel-surface"
              >
                {TYPES_LIEN.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={nouveauLienLibelle}
                onChange={(e) => setNouveauLienLibelle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    ajouterLien();
                  }
                }}
                placeholder="Libellé (ex. nom, plaque...)"
                className="min-w-[10rem] flex-1 rounded-md border border-panel-border bg-panel-bg px-3 py-2 text-sm text-panel-text outline-none placeholder:text-panel-muted focus-visible:border-panel-accent focus-visible:bg-panel-surface"
              />
              <button
                type="button"
                onClick={ajouterLien}
                className="rounded-md border border-panel-border px-3 py-2 text-sm text-panel-muted outline-none hover:border-panel-accent/50 hover:text-panel-text focus-visible:border-panel-accent focus-visible:text-panel-text"
              >
                Ajouter
              </button>
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {liens.map((lien) => (
                <li
                  key={lien.id}
                  className="flex items-center gap-1.5 rounded-full border border-panel-border bg-panel-bg px-2.5 py-1 text-xs text-panel-text"
                >
                  <span className="text-panel-muted">{lien.type}</span>
                  {lien.libelle}
                  <button
                    type="button"
                    onClick={() => supprimerLien(lien.id)}
                    className="text-panel-muted outline-none hover:text-red-300 focus-visible:text-red-300"
                    title="Retirer ce lien"
                  >
                    ×
                  </button>
                </li>
              ))}
              {liens.length === 0 && <li className="text-xs text-panel-muted">Aucun lien ajouté.</li>}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-panel-muted">
              Pièces jointes
            </h2>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={ajouterFichiers}
              className="block w-full text-xs text-panel-muted file:mr-3 file:rounded-md file:border file:border-panel-border file:bg-panel-bg file:px-3 file:py-1.5 file:text-xs file:text-panel-text file:outline-none hover:file:border-panel-accent/50"
            />
            <p className="mt-1.5 text-[11px] text-panel-muted">
              jpg, png, webp ou PDF — 10 Mo max par fichier, 10 fichiers max.
            </p>
            {messagePieceJointe && <p className="mt-1 text-[11px] text-amber-400">{messagePieceJointe}</p>}
            <ul className="mt-3 flex flex-col gap-1.5">
              {pieceJointes.map((piece) => (
                <li
                  key={piece.id}
                  className="flex items-center justify-between rounded-md border border-panel-border bg-panel-bg px-3 py-1.5 text-xs"
                >
                  <span className="truncate text-panel-text">
                    {piece.nom} <span className="text-panel-muted">· {piece.taille}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => supprimerPieceJointe(piece.id)}
                    className="ml-2 shrink-0 text-panel-muted outline-none hover:text-red-300 focus-visible:text-red-300"
                    title="Retirer cette pièce jointe"
                  >
                    ×
                  </button>
                </li>
              ))}
              {pieceJointes.length === 0 && (
                <li className="text-xs text-panel-muted">Aucune pièce jointe.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-panel-border pt-3">
        {erreur && <p className="mr-auto text-xs text-red-400">{erreur}</p>}
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-md border border-panel-border px-4 py-2 text-sm text-panel-muted outline-none hover:border-panel-accent/50 hover:text-panel-text focus-visible:border-panel-accent focus-visible:text-panel-text"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-md bg-panel-accent px-4 py-2 text-sm font-medium text-white outline-none hover:bg-panel-accent/90 focus-visible:bg-panel-accent/90"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
