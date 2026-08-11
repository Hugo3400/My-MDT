# apps/fivem-resource

Ressource FiveM (Lua, fxmanifest.lua). Passerelle technique minimale entre le serveur de jeu et l'API du panel — aucune logique métier, aucun écran, aucun secret permanent (voir section 3.8 et le rappel de la section 0).

- `core/` : noyau framework-agnostic — appels signés vers l'API, synchronisation d'identité (nom, prénom, date de naissance, taille, nationalité), remontée de présence/position/statut, réception des affectations dispatch, envoi de waypoint.
- `adapters/` : un adaptateur par framework, tous compatibles dès la v1 (décision section 0) — `esx-legacy/`, `qbcore/`, `qbox/`, `standalone/`. Chaque adaptateur implémente la même interface définie par `core/` pour lire les identifiants du framework (citizenid/charid) et les données spécifiques.
- `config/` : configuration par serveur (clés, endpoints API, activation des flux optionnels).

Aucun code applicatif n'est encore écrit — cadrage en cours.
