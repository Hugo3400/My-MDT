# apps/web

Panel navigateur (React + Vite + TypeScript, Tailwind CSS). Consomme uniquement l'API versionnée de `apps/api`, jamais la base de données directement.

`src/features/` regroupe les modules métier du panel, un dossier par module documenté dans `../../prompt-panel-fivem-dispatch.md` (section 3) : auth, dashboard, organisations, membres, rapports, warrants-bolo, registres (personnes, casier judiciaire, armes, véhicules civils, véhicules de service), enquêtes, saisies, carte, dispatch, specialites, administration, launcher (assistant web d'installation).

`src/shared/` : composants, hooks et utilitaires transverses au panel.

Aucun code applicatif n'est encore écrit — cadrage en cours, voir sections 0 et 8 du cahier des charges.
