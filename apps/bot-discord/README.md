# apps/bot-discord

Bot Discord (discord.js), séparé du panel, configurable par tenant. Consomme uniquement l'API de `apps/api` — il n'est jamais la source de vérité des données (voir section 3.9 du cahier des charges).

- `src/commands/` : commandes de consultation/notification autorisées (voir décision Q28 en section 0.1 — pas de commande de création/action métier en v1).
- `src/events/` : écoute des événements Discord entrants.
- `src/notifications/` : mise en forme et anti-doublon des notifications sortantes (dispatch prioritaire, BOLO, warrant approuvé, rapport en attente, changement de statut — voir décision Q27).

Aucun code applicatif n'est encore écrit — cadrage en cours.
