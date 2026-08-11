# infra

Déploiement et intégration continue.

- `docker/` : Docker Compose pour le mode SaaS et pour l'installation dédiée par client (voir décision d'hébergement en section 0), reverse proxy, services PostgreSQL/Redis/stockage privé.
- `ci/` : pipelines de build, tests et déploiement.
