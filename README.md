# My-MDT — Panel de dispatch FiveM

Panel web multi-tenant de dispatch et gestion policière pour serveurs FiveM (LSPD, SAHP, USMS, etc.), avec système de permissions par organisme.

Le cahier des charges complet (vision produit, modules, architecture, décisions actées, livrables de cadrage) vit dans [`prompt-panel-fivem-dispatch.md`](prompt-panel-fivem-dispatch.md).

## Structure du dépôt

```
apps/
  web/            panel React + Vite (interface agent)
  api/            API métier et temps réel (NestJS + Socket.IO) — à venir
  bot-discord/    bot Discord — à venir
  fivem-resource/ passerelle FiveM (noyau Lua + adaptateurs ESX/QBCore/Qbox/standalone) — à venir
packages/
  shared-types/   contrats TypeScript partagés web/api
  shared-config/  feature flags, configuration partagée
infra/            Docker, CI/CD
docs/             livrables de cadrage (schéma de données, matrice des permissions, spec API, maquettes, backlog, plan de tests)
```

## Développement local — `apps/web`

```bash
cd apps/web
npm install
npm run dev
```

## Statut

Projet privé en développement. Tous droits réservés.
