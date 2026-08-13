import type { CategorieRapport, Rapport, SousCategorieRapport } from "./mockRapports";

function LigneMeta({ label, valeur }: { label: string; valeur: string }): JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{valeur}</span>
    </div>
  );
}

function BlocSignature({ titre }: { titre: string }): JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-8">
      <span className="text-xs text-gray-600">{titre}</span>
      <div className="border-t border-gray-400" />
    </div>
  );
}

export function RapportImpression({
  rapport,
  categorie,
  sousCategorie,
  organismeNom,
  onFermer,
}: {
  rapport: Rapport;
  categorie: CategorieRapport | undefined;
  sousCategorie?: SousCategorieRapport;
  organismeNom: string;
  onFermer: () => void;
}): JSX.Element {
  const champs = categorie?.champs ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-6 print:static print:block print:bg-white print:p-0"
      onClick={(event) => {
        if (event.target === event.currentTarget) onFermer();
      }}
    >
      <div className="flex w-full max-w-3xl flex-col gap-3 print:max-w-none print:gap-0">
        <div className="flex items-center justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onFermer}
            className="rounded-md border border-panel-border bg-panel-bg px-3 py-1.5 text-xs font-medium text-panel-text outline-none transition-colors hover:bg-panel-surface focus-visible:border-panel-accent/50"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-panel-accent/40 bg-panel-accent/15 px-3 py-1.5 text-xs font-medium text-panel-accent outline-none transition-colors hover:bg-panel-accent/25 focus-visible:border-panel-accent"
          >
            Imprimer
          </button>
        </div>

        <div className="flex flex-col gap-6 rounded-lg bg-white p-10 text-gray-900 shadow-2xl print:rounded-none print:p-8 print:shadow-none">
          <header className="flex flex-col gap-1 border-b-2 border-gray-800 pb-4">
            <p className="text-lg font-bold uppercase tracking-wide">{organismeNom}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">Rapport officiel</p>
          </header>

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">{rapport.titre}</h1>
            <p className="text-xs text-gray-500">{rapport.numero}</p>
          </div>

          {rapport.confidentiel ? (
            <div className="border-2 border-red-600 px-3 py-2 text-center text-sm font-bold uppercase tracking-wide text-red-600">
              Document confidentiel
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 border border-gray-300 p-4 text-sm">
            <LigneMeta label="Catégorie" valeur={categorie?.nom ?? "—"} />
            {sousCategorie ? <LigneMeta label="Sous-catégorie" valeur={sousCategorie.nom} /> : null}
            <LigneMeta label="Statut" valeur={rapport.statut} />
            <LigneMeta label="Auteur" valeur={rapport.auteur} />
            <LigneMeta label="Relecteur" valeur={rapport.relecteur ?? "—"} />
            <LigneMeta label="Créé le" valeur={rapport.createdAt} />
            <LigneMeta label="Dernière mise à jour" valeur={rapport.updatedAt} />
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide">Contenu</h2>
            <div className="flex flex-col gap-3">
              {champs.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun champ défini pour cette catégorie.</p>
              ) : (
                champs.map((champ) => (
                  <p key={champ.id} className="text-sm leading-relaxed">
                    <span className="font-bold">{champ.label} : </span>
                    <span className="whitespace-pre-wrap">{rapport.contenu[champ.id] || "—"}</span>
                  </p>
                ))
              )}
            </div>
          </section>

          {rapport.liens.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide">
                Éléments liés
              </h2>
              <ul className="list-disc pl-5 text-sm">
                {rapport.liens.map((lien) => (
                  <li key={lien.id}>
                    {lien.type} — {lien.libelle}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {rapport.pieceJointes.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide">
                Pièces jointes
              </h2>
              <ul className="list-disc pl-5 text-sm">
                {rapport.pieceJointes.map((piece) => (
                  <li key={piece.id}>{piece.nom}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <footer className="mt-8 flex gap-12 border-t border-gray-300 pt-6">
            <BlocSignature titre="Signature de l'agent" />
            <BlocSignature titre="Signature du superviseur" />
          </footer>
        </div>
      </div>
    </div>
  );
}
