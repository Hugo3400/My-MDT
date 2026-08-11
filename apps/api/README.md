# apps/api

API métier et temps réel (NestJS + adaptateur Fastify + Socket.IO, PostgreSQL via Prisma, Redis + BullMQ). Seul point d'accès à la base de données ; le panel web, la ressource FiveM et le bot Discord passent tous par ici.

`src/modules/` : un module par domaine métier, aligné sur `../../prompt-panel-fivem-dispatch.md` (section 5, « entités de données initiales ») : identite, organisations, rapports, warrants-bolo, registres, casier-judiciaire, enquetes, saisies, dispatch, carte, discord, fivem (passerelle), licences, audit, launcher.

`src/common/` : garde-fous transverses (isolation tenant, RBAC serveur, audit append-only, validation d'entrée).

Aucun code applicatif n'est encore écrit — cadrage en cours, voir sections 0 et 8 du cahier des charges.
