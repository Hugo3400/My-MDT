# Backlog priorisé du MVP avec critères d'acceptation

> Livrable de la section 9 du cahier des charges (`../prompt-panel-fivem-dispatch.md`). Périmètre couvert : **Phase 1 — Fondation MVP** et **Phase 2 — Dossiers opérationnels** (section 7). S'appuie sur les décisions actées en sections 0/0.1 et sur les entités du [`schéma de données v1`](schema-donnees.md). Objectif : ce que doit livrer le MVP pour qu'un premier client pilote puisse administrer un organisme, faire travailler ses agents sur des dossiers, et faire confiance à l'isolation/à la sécurité du produit — sans encore le dispatch temps réel ni la carte (Phase 3).

## Légende de priorisation (MoSCoW)

| Étiquette | Signification pour ce backlog |
| --- | --- |
| **Must** | Bloque la mise en production chez le premier client pilote. Sans cette story, le produit n'est pas utilisable ou pas sûr (isolation tenant, permissions, audit). |
| **Should** | Attendu rapidement après le pilote, améliore l'usage réel, mais un contournement manuel/temporaire est acceptable pour démarrer. |
| **Could** | Confort ou robustesse additionnelle, reportable après le retour du pilote sans compromettre la valeur du MVP. |

Les stories marquées **Must** sont volontairement nombreuses sur l'isolation tenant, le RBAC et l'audit : ce sont les trois piliers non négociables du cahier des charges (section « Principes non négociables » et section 4). Une story n'est marquée Must que si son absence empêche un usage réel ou crée un risque de sécurité/fuite de données ; le reste est Should/Could.

## Vue d'ensemble des epics

| # | Epic | Phase | Stories Must / Should / Could |
| --- | --- | --- | --- |
| 1 | Authentification & tenants | 1 | 5 / 1 / 0 |
| 2 | Organismes / membres / rôles / permissions | 1 | 4 / 2 / 0 |
| 3 | Journal d'audit & licence | 1 | 3 / 2 / 0 |
| 4 | Socle de déploiement dual SaaS / dédié | 1 | 3 / 1 / 0 |
| 5 | Interface d'adaptateur FiveM + synchronisation d'identité | 1 | 4 / 0 / 1 |
| 6 | Registres personnes/véhicules/armes/casier judiciaire | 1 & 2 | 6 / 0 / 0 |
| 7 | Rapports (catégories + workflow) | 1 | 5 / 1 / 0 |
| 8 | Recherche globale & dashboard | 1 | 3 / 0 / 1 |
| 9 | Warrants / personnes recherchées / BOLO | 2 | 4 / 1 / 1 |
| 10 | Enquêtes / pièces à conviction / saisies | 2 | 5 / 1 / 0 |
| 11 | Divisions & spécialités | 2 | 3 / 1 / 1 |
| 12 | Exports contrôlés | 2 | 4 / 1 / 0 |

---

## Epic 1 — Authentification & tenants

Socle de connexion et de contexte multi-client. Sans cet epic, aucune autre fonctionnalité ne peut être testée en isolation.

### US1.1 — Connexion via Discord OAuth *(Must)*
En tant que membre d'un organisme, je veux me connecter au panel avec mon compte Discord, afin de ne pas gérer un mot de passe supplémentaire et de m'appuyer sur une identité déjà vérifiée par mon serveur RP.

Critères d'acceptation :
- Le flux OAuth Discord aboutit à la création ou à la récupération d'un `Utilisateur` unique par couple `(tenantId, discordId)`.
- Un `discordId` qui n'a aucune `Affectation` active dans le tenant reçoit un refus explicite (« aucun accès configuré »), pas une session vide silencieuse.
- Le même `discordId` connecté sur deux tenants différents produit deux `Utilisateur` distincts, sans partage de session ni de droits entre les deux.
- Un token OAuth ou un secret Discord n'est jamais renvoyé au navigateur ni loggé en clair côté serveur.

### US1.2 — Provisioning manuel d'un tenant par le super-admin *(Must)*
En tant que super-administrateur de la plateforme, je veux créer un nouveau tenant (nom, slug, mode d'hébergement, licence initiale) via une action administrative journalisée, afin d'onboarder le premier client pilote sans dépendre de l'assistant d'installation self-service (hors scope MVP, voir Phase 4).

Critères d'acceptation :
- La création d'un tenant exige un `slug` unique ; une tentative de doublon est rejetée avec une erreur explicite.
- Le tenant créé démarre avec `licenseStatus = TRIALING` par défaut sauf indication contraire du super-admin.
- L'action de création est inscrite dans `JournalAudit` avec l'identité du super-admin, l'action `tenant.creer` et le `tenantId` créé comme cible.
- Aucun autre rôle que le super-admin ne peut appeler cette route (vérifié par un test qui échoue avec 403 pour un rôle « administrateur d'organisme »).

### US1.3 — Session sécurisée, courte et renouvelable *(Must)*
En tant qu'utilisateur connecté, je veux une session qui expire automatiquement et se renouvelle tant que je suis actif, afin de limiter le risque en cas de poste partagé ou de vol de session.

Critères d'acceptation :
- Le jeton de session a une durée de vie courte (≤ 1h) et un mécanisme de refresh transparent tant que l'utilisateur est actif.
- Une déconnexion explicite invalide immédiatement le refresh token côté serveur (pas seulement côté navigateur).
- Un jeton expiré ou révoqué renvoie systématiquement 401 sur toute route protégée, y compris les endpoints Socket.IO (préparation Phase 3).

### US1.4 — Double authentification obligatoire pour les rôles à permission sensible *(Must)*
En tant qu'administrateur du tenant, je veux que tout membre porteur d'une permission sensible (administration, approbation de warrant, accès casier judiciaire, export, gestion des droits) soit contraint d'activer la MFA, afin de respecter la décision Q10 et de réduire le risque de compromission de compte.

Critères d'acceptation :
- Le champ `Utilisateur.mfaRequired` est recalculé automatiquement dès qu'une `Affectation` attribue un rôle portant une permission de la liste sensible.
- Un utilisateur avec `mfaRequired = true` et `mfaEnabled = false` est bloqué avant d'atteindre tout écran métier, avec un parcours guidé d'activation de la MFA.
- Une tentative d'appel API direct sur une route sensible (ex. `casier.gerer`) par un utilisateur `mfaRequired = true` sans MFA active est rejetée côté serveur (403), même si le frontend a été contourné.
- Le retrait d'un rôle sensible ne désactive pas automatiquement la MFA déjà activée (pas de régression de sécurité silencieuse).

### US1.5 — Isolation tenant systématique côté API *(Must)*
En tant qu'éditeur du produit, je veux que chaque requête API dérive le `tenantId` exclusivement de la session serveur, afin qu'aucun paramètre envoyé par le navigateur ne puisse faire fuiter ou modifier les données d'un autre tenant.

Critères d'acceptation :
- Aucune route de l'API n'accepte de `tenantId` en paramètre de requête, body ou header en provenance du client pour déterminer le périmètre de la requête ; il est injecté par le middleware d'authentification.
- Un test d'intrusion automatisé (rejeu d'une requête valide du tenant A avec l'identifiant d'une ressource du tenant B) renvoie 404, jamais 200 ni 403 avec fuite d'information sur l'existence de la ressource.
- Les policies PostgreSQL Row-Level Security sont actives au minimum sur `Personne`, `CasierJudiciaireEntree`, `Rapport`, `Enquete`, `JournalAudit` et un test vérifie qu'une requête SQL brute sans contexte de tenant ne retourne aucune ligne.
- Un scénario de test couvre explicitement une tentative de recherche globale (Epic 8) filtrée sur un `tenantId` autre que celui de la session : zéro résultat retourné.

### US1.6 — Sélection de l'organisme actif en session *(Should)*
En tant que membre appartenant à plusieurs organismes, je veux choisir mon organisme « actif » en session, afin que l'affichage et mes permissions effectives se contextualisent sur cet organisme sans devoir me reconnecter.

Critères d'acceptation :
- Le choix de l'organisme actif est limité aux `Organisme` pour lesquels l'utilisateur a une `Affectation` au statut `ACTIVE`.
- Changer d'organisme actif recalcule immédiatement les permissions effectives affichées et appliquées côté API pour les requêtes suivantes de la session.
- Par défaut, l'organisme marqué `estPrincipale = true` sur l'`Affectation` est présélectionné à la connexion.

---

## Epic 2 — Organismes / membres / rôles / permissions

### US2.1 — Création et configuration d'un organisme *(Must)*
En tant qu'administrateur du tenant, je veux créer et configurer un organisme (nom, code, couleur, logo, juridiction), afin de représenter LSPD, SAHP, USMS ou toute organisation personnalisée de mon serveur RP.

Critères d'acceptation :
- Le couple `(tenantId, code)` est unique ; une tentative de code dupliqué dans le même tenant est rejetée.
- La création d'un organisme au-delà de `Tenant.maxOrganismes` est bloquée avec un message expliquant la limite liée à l'offre de licence (décision Q4).
- Un organisme `ARCHIVE` n'apparaît plus dans les listes de sélection actives (dashboard, affectation) mais reste consultable en lecture pour l'historique et l'audit.
- La création est journalisée dans `JournalAudit` avec l'auteur et les valeurs créées.

### US2.2 — Gestion des membres et de leurs affectations *(Must)*
En tant qu'administrateur d'organisme, je veux gérer les membres (grade, indicatif, matricule, division, statut), afin de refléter la structure réelle de mon organisme et de contrôler qui y a accès.

Critères d'acceptation :
- Chaque membre d'un organisme correspond à une `Affectation` unique par couple `(utilisateurId, organismeId)` ; une seconde affectation sur le même organisme met à jour l'existante plutôt que d'en créer une nouvelle.
- Suspendre une affectation (`statut = SUSPENDUE`) retire immédiatement l'accès aux ressources de cet organisme pour ce membre, vérifié par un appel API qui bascule de 200 à 403 après suspension.
- Un membre peut avoir des affectations actives simultanées sur plusieurs organismes du même tenant (décision Q7), chacune avec son propre rôle/grade/division.
- Le matricule et l'indicatif sont propres à chaque affectation, pas à l'utilisateur global (deux organismes peuvent attribuer des matricules différents au même membre).

### US2.3 — Création de rôles personnalisés avec permissions par portée *(Must)*
En tant qu'administrateur d'organisme, je veux créer des rôles personnalisés en cochant des permissions atomiques avec une portée (soi, division, organisme, tenant), afin d'adapter le RBAC à la structure réelle de mon organisme sans dépendre de rôles figés dans le code.

Critères d'acceptation :
- Un `Role` non-système (`estSysteme = false`) peut être créé, renommé et supprimé par un rôle porteur de la permission « gérer les membres/rôles », sans intervention du support éditeur.
- Chaque `RolePermission` associe une portée parmi `SOI`, `DIVISION`, `ORGANISME`, `TENANT` ; un test vérifie qu'un rôle avec portée `DIVISION` sur « lire rapport » ne peut pas lire un rapport d'une autre division du même organisme.
- La suppression d'un rôle encore attribué à au moins une `Affectation` active est bloquée avec un message explicite, pas une suppression silencieuse qui laisserait des affectations orphelines.
- Toute vérification de permission est effectuée côté API sur chaque requête ; aucune permission n'est appliquée uniquement côté interface (vérifié par un appel direct à l'API contournant l'UI).

### US2.4 — Surcharge de permission pour un membre ou une spécialité *(Should)*
En tant qu'administrateur d'organisme, je veux accorder ou retirer une permission ponctuelle à un membre précis en plus de son rôle, afin de gérer des cas particuliers sans créer un rôle dédié pour une seule personne.

Critères d'acceptation :
- Une surcharge positive accorde une permission absente du rôle de base, vérifiable par un appel API qui passe de 403 à 200 après la surcharge.
- Une surcharge négative retire une permission présente dans le rôle de base, vérifiable par un appel API qui passe de 200 à 403.
- Toute surcharge est journalisée dans `JournalAudit` avec l'auteur, le membre concerné et la permission modifiée.

### US2.5 — Historique des changements de rôle, grade, division et permissions *(Must)*
En tant qu'administrateur d'organisme, je veux consulter l'historique complet des changements d'affectation d'un membre, afin de comprendre qui a eu quel accès et à quel moment, notamment en cas d'incident.

Critères d'acceptation :
- Tout changement de `roleId`, `gradeId`, `divisionId` ou `statut` sur une `Affectation` génère une entrée `JournalAudit` avec les valeurs avant/après (`avantJson`/`apresJson`).
- L'historique d'un membre est consultable filtré par membre, par organisme et par plage de dates.
- L'historique est en lecture seule : aucune route API ne permet de modifier ou supprimer une entrée existante.

### US2.6 — Grades purement visuels *(Should)*
En tant qu'administrateur d'organisme, je veux définir des grades avec un nom, un niveau d'affichage et une icône, sans qu'ils ne portent de permission, afin de représenter la hiérarchie RP sans dupliquer le RBAC (décision Q8).

Critères d'acceptation :
- Le modèle `Grade` ne possède aucune relation directe vers `Permission` ou `RolePermission` dans le schéma ni dans l'API.
- Changer le grade d'un membre sans changer son `roleId` ne modifie aucune permission effective, vérifié par un test avant/après.
- L'ordre d'affichage (`niveau`) est configurable librement par organisme, y compris avec des doublons si l'administrateur le souhaite.

---

## Epic 3 — Journal d'audit & licence

### US3.1 — Journal d'audit append-only sur les actions sensibles *(Must)*
En tant qu'éditeur du produit, je veux que toute action sensible (création, modification, suppression logique, consultation de dossier confidentiel, export, changement de droits) soit tracée de façon non modifiable, afin de garantir la traçabilité exigée par le cahier des charges (section 4).

Critères d'acceptation :
- Aucune route API n'expose de méthode `UPDATE` ou `DELETE` sur `JournalAudit` ; une tentative d'appel direct à un tel endpoint renvoie 404/405.
- Chaque entrée porte au minimum `tenantId`, `acteurId`, `action`, `cibleType`, `cibleId`, `createdAt`, et `avantJson`/`apresJson` quand pertinent.
- La consultation d'une fiche `CasierJudiciaireEntree` ou d'un `Rapport` confidentiel génère une entrée d'audit de type « consultation », pas seulement les écritures.
- Un test de charge basique confirme que l'écriture d'audit n'échoue jamais silencieusement (si l'écriture d'audit échoue, l'action métier associée est annulée, pas seulement l'audit).

### US3.2 — Consultation du journal d'audit filtrable *(Should)*
En tant qu'administrateur de tenant, je veux consulter le journal d'audit filtré par acteur, type d'action, cible ou période, afin d'investiguer un incident ou une question de conformité.

Critères d'acceptation :
- Les filtres par `acteurId`, `action`, `cibleType`/`cibleId` et plage de dates sont combinables.
- Seuls les rôles porteurs d'une permission dédiée « consulter l'audit » accèdent à cet écran ; un membre sans cette permission reçoit 403.
- La liste est strictement bornée au `tenantId` de la session, y compris pour un super-admin qui doit explicitement changer de contexte tenant (US3.5) pour voir un autre tenant.

### US3.3 — Licence minimale rattachée au tenant *(Must)*
En tant que super-administrateur, je veux gérer le type de licence, son statut et sa date d'expiration par tenant, afin de contrôler l'accès au produit selon le modèle commercial (essai, mensuelle, à vie).

Critères d'acceptation :
- `Tenant.licenseStatus` supporte au minimum `TRIALING`, `ACTIVE`, `PAST_DUE`, `SUSPENDED`, `CANCELLED`, et le passage à `SUSPENDED` bloque la connexion de tous les membres du tenant sauf le super-admin.
- Une licence `TRIALING` ou `ACTIVE` dont `licenseExpiresAt` est dépassée bascule automatiquement à `PAST_DUE` (tâche planifiée), sans intervention manuelle.
- Le changement de statut de licence est journalisé dans `JournalAudit` avec l'identité du super-admin auteur.
- `Tenant.maxOrganismes` est appliqué de façon cohérente avec US2.1 quel que soit le type de licence.

### US3.4 — Feature flags par tenant *(Should)*
En tant que super-administrateur, je veux activer/désactiver des modules par tenant via des feature flags, afin de déployer progressivement de nouvelles capacités sans les imposer à tous les clients en même temps.

Critères d'acceptation :
- Un `FeatureFlag` est unique par couple `(tenantId, key)`.
- Un module désactivé par flag est inaccessible à la fois côté interface (masqué) et côté API (403 si appelé directement).
- La modification d'un flag est journalisée dans `JournalAudit`.

### US3.5 — Accès super-admin global journalisé *(Must)*
En tant que super-administrateur de la plateforme, je veux pouvoir consulter/dépanner un tenant client, avec chaque accès tracé explicitement, afin de fournir du support sans jamais constituer un accès silencieux (décision Q5).

Critères d'acceptation :
- Basculer sur le contexte d'un tenant client en tant que super-admin exige une action explicite (pas un accès permanent par défaut) et génère une entrée `JournalAudit` de type `superadmin.acces_tenant` avec le tenant ciblé.
- Toute action réalisée par le super-admin dans le contexte d'un tenant client est journalisée avec un marqueur distinguant « action super-admin en support » d'une action d'un membre normal du tenant.
- La liste des accès super-admin à un tenant est consultable par les administrateurs de ce tenant (transparence vis-à-vis du client), au minimum en lecture.

---

## Epic 4 — Socle de déploiement dual SaaS/dédié

### US4.1 — Déploiement SaaS multi-tenant validé sur environnement de test *(Must)*
En tant qu'éditeur du produit, je veux déployer l'ensemble du socle (API, base, cache, stockage) en mode SaaS multi-tenant sur un environnement de test, afin de valider que l'isolation applicative et les policies PostgreSQL fonctionnent en conditions réelles avant d'onboarder le client pilote.

Critères d'acceptation :
- Un déploiement Docker Compose (ou équivalent) démarre l'API, PostgreSQL, Redis et le stockage privé avec au moins deux tenants de test préchargés.
- Le scénario de fuite inter-tenant (US1.5) est rejoué sur cet environnement et documenté comme passant.
- Les secrets (clés de signature FiveM, identifiants base de données) sont injectés par variables d'environnement/coffre-fort, jamais committés dans le dépôt.

### US4.2 — Déploiement en instance dédiée mono-tenant *(Must)*
En tant qu'éditeur du produit, je veux pouvoir déployer une instance dédiée avec sa propre base de données pour un client qui l'exige, en réutilisant le même code applicatif que le SaaS, afin de respecter la décision de la section 0 sans maintenir deux bases de code.

Critères d'acceptation :
- `Tenant.hostingMode` distingue `SAAS` et `DEDICATED`, et aucune branche de code métier ne teste ce champ pour changer un comportement fonctionnel (seule la configuration d'infrastructure change).
- Une instance dédiée démarrée avec un seul tenant préconfiguré fonctionne sans dépendance réseau à une infrastructure SaaS partagée.
- La procédure de déploiement dédié est reproductible par un script versionné (pas une suite d'étapes manuelles non documentées).

### US4.3 — Configuration de déploiement externalisée *(Must)*
En tant qu'éditeur du produit, je veux que toute différence de comportement entre SaaS et dédié soit pilotée par configuration (variables d'environnement, feature flags), afin qu'aucune fonctionnalité métier ne suppose un seul mode de déploiement (contrainte explicite de la section 0).

Critères d'acceptation :
- Une revue de code automatisée (lint/règle de dépôt) signale toute occurrence de `hostingMode` utilisée en dehors des modules d'infrastructure/déploiement.
- Les mêmes suites de tests fonctionnels (Epics 1 à 12) passent sans modification sur un environnement configuré en SaaS et sur un environnement configuré en dédié.

### US4.4 — Sauvegarde et restauration testée *(Should)*
En tant qu'éditeur du produit, je veux un mécanisme de sauvegarde automatisée en SaaS et un script de sauvegarde/restauration fourni en mode dédié, afin de garantir la reprise après incident (décision Q31).

Critères d'acceptation :
- En SaaS, une sauvegarde de la base et du stockage privé s'exécute automatiquement au moins une fois par jour et est vérifiée par une restauration test sur un environnement isolé.
- En mode dédié, un script de sauvegarde/restauration versionné est fourni avec une procédure documentée, testée au moins une fois avant la livraison au client pilote.
- Une restauration ne doit jamais mélanger les données de deux tenants différents (test explicite si applicable au mode SaaS).

---

## Epic 5 — Interface d'adaptateur FiveM + synchronisation d'identité

> Rappel de cadrage : seule l'**interface** commune est du MVP. Les quatre adaptateurs concrets (ESX Legacy, QBCore, Qbox, standalone) sont Phase 3 — voir « Hors scope MVP explicite ».

### US5.1 — Contrat d'interface adaptateur framework-agnostic documenté *(Must)*
En tant que développeur de la ressource FiveM, je veux un contrat d'API de passerelle unique (événements, payloads, réponses) indépendant du framework RP, afin que les futurs adaptateurs ESX/QBCore/Qbox/standalone puissent tous s'y brancher sans modifier le noyau ni l'API centrale.

Critères d'acceptation :
- Le contrat définit au minimum les événements : connexion/déconnexion joueur, synchronisation d'identité, position, statut d'unité déclaré, véhicule courant (optionnel), commande générique de création d'appel (`/911`), envoi de waypoint.
- Le contrat est versionné explicitement (ex. `v1`) et documenté indépendamment du code d'un adaptateur particulier.
- Aucun champ du contrat ne référence un nom de table, une variable ou une convention propre à ESX, QBCore ou Qbox.

### US5.2 — Endpoint de synchronisation d'identité de base *(Must)*
En tant que panel, je veux recevoir et stocker l'identité RP de base (nom, prénom, date de naissance, taille, nationalité) transmise par la passerelle FiveM à la création du personnage et à chaque connexion, afin d'alimenter la fiche `Personne` sans ressaisie manuelle (décision Q12/Q13).

Critères d'acceptation :
- L'identifiant faisant autorité pour la fiche `Personne` est le couple `(tenantId, fivemCharId)` ; deux synchronisations avec le même `fivemCharId` sur le même tenant mettent à jour la même fiche, jamais n'en créent une seconde.
- Les cinq champs obligatoires (`nom`, `prenom`, `dateNaissance`, `taille`, `nationalite`) sont requis dans le payload ; un payload incomplet est rejeté avec une erreur de validation explicite plutôt que d'écrire des champs partiels.
- Une modification RP-policier de la fiche (ex. ajout à un dossier, casier) ne peut jamais être écrasée par une resynchronisation d'identité : seuls les cinq champs d'identité de base sont mis à jour par cette voie.
- Le `fivemLicense` (compte joueur) est stocké séparément du `fivemCharId` (personnage), conformément à la décision Q12, et un même `fivemLicense` peut être associé à plusieurs `Personne` du même tenant (plusieurs personnages).

### US5.3 — Signature et authentification des appels serveur-à-serveur *(Must)*
En tant qu'éditeur du produit, je veux que chaque appel entre la ressource FiveM et l'API soit signé et authentifié par une clé propre à l'`IntegrationFiveM` du tenant, afin qu'aucun serveur FiveM ne puisse écrire dans un tenant qui n'est pas le sien.

Critères d'acceptation :
- `IntegrationFiveM.cleSignature` n'est jamais transmise au navigateur ni exposée par une route API en lecture.
- Un appel avec une signature invalide ou absente est rejeté (401/403) et journalisé dans `FiveMEvenementLog` avec `statut = rejete`.
- Un appel signé avec la clé du tenant A ne peut pas écrire de données rattachées au tenant B, même si le payload contient un `tenantId` différent (le tenant est dérivé de la clé, jamais du payload).

### US5.4 — Limitation de débit et journalisation des erreurs FiveM *(Must)*
En tant qu'éditeur du produit, je veux limiter la fréquence des appels de la passerelle FiveM et journaliser systématiquement les erreurs, afin de me prémunir contre un serveur FiveM mal configuré ou compromis qui inonderait l'API.

Critères d'acceptation :
- Un plafond de requêtes par `IntegrationFiveM` et par fenêtre de temps est appliqué ; le dépassement renvoie 429 et n'impacte pas les autres tenants.
- Toute erreur (signature invalide, payload rejeté, dépassement de débit) crée une entrée `FiveMEvenementLog` exploitable pour le support.
- Un pic d'appels sur l'intégration d'un tenant ne dégrade pas mesurablement le temps de réponse de l'API pour les autres tenants (test de charge isolé par tenant).

### US5.5 — Adaptateur de test factice pour valider le contrat *(Could)*
En tant que développeur de la ressource FiveM, je veux un adaptateur factice minimal (stub, sans logique framework réelle) branché sur l'interface, afin de valider automatiquement le contrat de l'Epic 5 sans attendre le développement des quatre adaptateurs réels de Phase 3.

Critères d'acceptation :
- Le stub n'implémente aucune dépendance ESX/QBCore/Qbox et n'est jamais présenté comme un adaptateur de production.
- Le stub couvre par des tests automatisés chaque événement du contrat v1 (US5.1).

---

## Epic 6 — Registres personnes/véhicules/armes/casier judiciaire

### US6.1 — Fiche personne avec identité synchronisée FiveM *(Must)*
En tant qu'agent, je veux consulter une fiche personne avec son identité de base fiable et des champs personnalisés propres à mon organisme, afin d'avoir une source unique d'information sur un individu RP.

Critères d'acceptation :
- Les cinq champs d'identité de base (US5.2) sont affichés en lecture seule côté panel (non éditables manuellement tant que le personnage existe côté FiveM), conformément à la décision Q12.
- Les champs additionnels (adresse, particularités, etc.) sont stockés dans `champsPerso` selon une configuration par tenant, sans migration de schéma nécessaire pour en ajouter un nouveau.
- Une recherche par nom/prénom est bornée au `tenantId` de la session (`@@index([tenantId, nom, prenom])` exploité).
- L'historique des liens d'une fiche (rapports, warrants, casier) est visible mais chaque lien respecte les permissions propres à son type d'objet (un lien vers un rapport confidentiel n'affiche pas son contenu à qui n'a pas le droit de le lire).

### US6.2 — Registres véhicules civils et véhicules de service *(Must)*
En tant qu'agent, je veux enregistrer et rechercher des véhicules civils et des véhicules de la flotte de service, afin de vérifier une plaque lors d'un contrôle ou d'une intervention.

Critères d'acceptation :
- `plaque` est obligatoire et unique par tenant pour `VehiculeCivil` et pour `VehiculeService` (`@@unique([tenantId, plaque])`).
- Le `statut` d'un véhicule (`EN_CIRCULATION`, `SAISI`, `DETRUIT`) est modifiable uniquement par un rôle porteur de la permission adéquate et chaque changement est journalisé.
- Le propriétaire d'un `VehiculeCivil` peut rester non renseigné (« inconnu ») tant qu'une enquête n'a pas abouti, conformément à la décision Q24, sans bloquer la création de la fiche.
- Un `VehiculeService` est rattaché à un `organismeId` et n'est visible/modifiable que par les membres de cet organisme (ou un rôle à portée `TENANT` explicite).

### US6.3 — Registres armes civiles et armes de service *(Must)*
En tant qu'agent, je veux enregistrer et rechercher des armes civiles et de service par numéro de série, afin de vérifier la légalité de détention ou de suivre une arme saisie.

Critères d'acceptation :
- `numeroSerie` est obligatoire et unique par tenant, pour `ArmeCivile` comme pour `ArmeService`.
- Le champ `statut` (`EN_CIRCULATION`, `SAISI`, `DETRUIT`) suit les mêmes règles de traçabilité que US6.2.
- Une `ArmeService` assignée (`assigneeId`) référence une `Affectation` valide de l'organisme concerné ; assigner une arme à une affectation d'un autre organisme est rejeté.

### US6.4 — Consultation du casier judiciaire réservée aux rôles habilités *(Must)*
En tant qu'enquêteur ou membre de la direction/greffe, je veux consulter le casier judiciaire d'une personne, afin d'appuyer une décision opérationnelle ou une procédure, sans que ce contenu soit visible par n'importe quel agent (décision Q33).

Critères d'acceptation :
- Un appel à la route de consultation du casier sans la permission dédiée « consulter le casier » renvoie 403, y compris pour un rôle par ailleurs administrateur d'organisme s'il n'a pas explicitement cette permission.
- Chaque consultation d'une entrée de casier génère une entrée `JournalAudit` de type « consultation », avec l'acteur et la fiche consultée (couvre aussi US3.1).
- La fiche `Personne` affichée sans la permission « consulter le casier » ne montre ni le nombre d'entrées, ni un résumé, ni un indice de son existence.

### US6.5 — Génération automatique d'une entrée de casier depuis un rapport approuvé *(Must)*
En tant que système, je veux générer automatiquement une entrée de casier judiciaire lorsqu'un rapport/jugement RP est approuvé et le prévoit, afin d'éviter la ressaisie et de garantir que le casier reflète une décision validée (décision Q34).

Critères d'acceptation :
- La génération automatique ne se déclenche que sur un `Rapport` dont `statut = APPROUVE` et qui porte l'indication qu'il donne lieu à une entrée de casier.
- L'entrée créée renseigne `sourceRapportId` et reste traçable vers le rapport d'origine.
- La création manuelle d'une entrée (hors génération automatique) est réservée aux rôles porteurs de la permission « gérer le casier judiciaire », vérifié par un test 403 pour un rôle sans cette permission.

### US6.6 — Neutralisation d'une entrée de casier sans suppression physique *(Must)*
En tant que rôle porteur de la permission « gérer le casier judiciaire », je veux marquer une entrée comme purgée, graciée ou amnistiée avec un motif conservé, afin de refléter une décision RP sans jamais effacer l'historique (décision Q35).

Critères d'acceptation :
- Aucune route API ne permet un `DELETE` physique sur `CasierJudiciaireEntree` ; seul un changement de `statut` parmi `EN_COURS`, `PURGEE`, `GRACIEE`, `AMNISTIEE` est possible.
- Un changement de statut exige un motif non vide, conservé avec l'auteur et la date, et journalisé dans `JournalAudit`.
- Une entrée `PURGEE`/`GRACIEE`/`AMNISTIEE` reste visible dans l'historique complet pour les rôles habilités, avec son statut affiché clairement (elle n'est jamais masquée comme si elle n'avait jamais existé).

---

## Epic 7 — Rapports (catégories + workflow)

### US7.1 — Catégories et modèles de rapport configurables *(Must)*
En tant qu'administrateur d'organisme, je veux configurer des catégories de rapport (arrestation, incident, usage de la force, accident, contrôle, perquisition, fourrière, enquête) et leurs modèles de champs, afin d'adapter les formulaires à mes procédures RP sans intervention de l'éditeur.

Critères d'acceptation :
- Les huit catégories de la décision Q21 sont préchargées par défaut à la création d'un organisme, et modifiables/désactivables sans toucher au code.
- `ModeleRapport.champsConfig` décrit des champs typés avec règles de validation (obligatoire, format), appliquées côté API à la soumission d'un rapport (pas seulement côté formulaire).
- Une `CategorieRapport` peut être partagée au niveau tenant (`organismeId = null`) ou propre à un organisme.

### US7.2 — Création et soumission d'un rapport par l'auteur *(Must)*
En tant qu'agent, je veux créer un rapport en brouillon puis le soumettre, afin de documenter mon intervention selon le modèle de ma catégorie.

Critères d'acceptation :
- Un `Rapport` naît avec `statut = BROUILLON` et n'est visible en dehors de son auteur que si un rôle porte une permission de lecture large (portée `ORGANISME`/`TENANT`).
- La soumission (`BROUILLON → SOUMIS`) échoue avec le détail des champs en erreur si un champ obligatoire du modèle de la catégorie est manquant.
- Un auteur ne peut soumettre un rapport que pour l'organisme correspondant à son organisme actif en session (US1.6), pas pour un organisme où il n'a pas d'affectation active.

### US7.3 — Cycle de vie complet du rapport *(Must)*
En tant que superviseur désigné, je veux faire transiter un rapport entre soumis, à corriger, approuvé et archivé, afin de garantir un contrôle qualité avant que le rapport ne fasse foi (décision Q22).

Critères d'acceptation :
- Les seules transitions autorisées sont : `BROUILLON → SOUMIS`, `SOUMIS → A_CORRIGER`, `SOUMIS → APPROUVE`, `A_CORRIGER → SOUMIS`, `APPROUVE → ARCHIVE`, `APPROUVE/ARCHIVE → réouverture` (retour à un statut actif) ; toute autre transition est rejetée par l'API.
- Seul un rôle porteur d'une permission d'approbation/archivage/réouverture (superviseur/gradé ou rôle « greffe » désigné) peut faire ces transitions ; l'auteur seul ne peut que soumettre/corriger.
- Un rapport `A_CORRIGER` redevient éditable uniquement par son auteur d'origine (ou un rôle avec permission de modification élargie), pas par n'importe quel agent.
- Chaque transition de statut génère une entrée `JournalAudit` et un enregistrement dans `RapportVersion` avec le contenu avant modification.

### US7.4 — Liens vers personnes, véhicules, armes et autres objets métier *(Must)*
En tant qu'agent, je veux lier un rapport à une ou plusieurs personnes, véhicules, armes ou dossiers, afin de rattacher les registres RP à l'intervention documentée.

Critères d'acceptation :
- Un `RapportLien` est créé via le couple polymorphe `(cibleType, cibleId)`, avec `cibleType` restreint à une liste fermée (`Personne`, `VehiculeCivil`, `ArmeCivile`, `Enquete`, `Saisie`, `Unite`, `Dispatch`).
- Créer un lien vers une ressource d'un autre tenant est rejeté (vérification croisée du `tenantId` de la cible avant création du lien).
- La suppression d'un lien est une action journalisée, jamais une suppression physique silencieuse du `RapportLien`.

### US7.5 — Pièces jointes contrôlées *(Must)*
En tant qu'agent, je veux joindre des images ou PDF à mon rapport, afin d'illustrer les faits, dans les limites définies pour préserver la sécurité et l'espace de stockage (décision Q25).

Critères d'acceptation :
- Seuls les types MIME réels `image/jpeg`, `image/png`, `image/webp` et `application/pdf` sont acceptés, vérifiés par inspection du contenu du fichier et pas seulement par l'extension déclarée.
- Une pièce jointe dépassant 10 Mo est rejetée avant stockage ; un rapport ne peut pas dépasser 10 fichiers joints.
- Le fichier est stocké sous une `storageKey` privée, jamais accessible par une URL publique permanente ; toute consultation passe par une URL signée temporaire.
- Toute tentative d'accès à une pièce jointe rattachée à une cible d'un autre tenant est rejetée (404), même avec une `storageKey` devinée.

### US7.6 — Commentaires internes et historique de versions *(Should)*
En tant que superviseur, je veux ajouter des commentaires internes visibles par l'équipe autorisée et consulter l'historique des versions d'un rapport, afin d'expliquer une demande de correction ou de comprendre l'évolution du contenu.

Critères d'acceptation :
- Un `RapportCommentaire` est horodaté et attribué à son auteur, non modifiable après création (seul un nouvel commentaire peut compléter/corriger).
- Chaque transition de statut ou modification substantielle crée une `RapportVersion` consultable dans l'ordre chronologique.
- Les commentaires internes ne sont jamais inclus dans un export PDF destiné à être imprimé/diffusé (Epic 12), sauf action explicite d'un rôle habilité.

---

## Epic 8 — Recherche globale & dashboard

### US8.1 — Recherche globale multi-entités avec permission par type *(Must)*
En tant qu'agent, je veux rechercher une personne, un véhicule, une arme ou un dossier depuis un seul champ de recherche, afin de retrouver rapidement une information sans naviguer entre plusieurs écrans.

Critères d'acceptation :
- La recherche interroge au minimum `Personne`, `VehiculeCivil`, `VehiculeService`, `ArmeCivile`, `ArmeService`, `Rapport` en respectant, pour chaque type, la permission de lecture propre à ce type (un résultat de type casier n'apparaît pas sans la permission dédiée).
- Les résultats sont strictement bornés au `tenantId` de la session, avec un test explicite couvrant une recherche par terme identique dans deux tenants différents ne renvoyant que les résultats du bon tenant.
- Un résultat pour lequel l'utilisateur n'a pas la permission de lecture n'apparaît pas dans les résultats (pas de résultat visible mais grisé qui confirmerait l'existence de la donnée) sauf pour les objets dont l'existence elle-même n'est pas sensible (ex. véhicule).

### US8.2 — Dashboard d'accueil avec indicateurs clés *(Must)*
En tant qu'agent connecté, je veux un tableau de bord d'accueil résumant l'activité pertinente pour mon organisme actif (rapports en attente, warrants/BOLO actifs si Epic 9 livrée, mes tâches), afin de démarrer ma session efficacement.

Critères d'acceptation :
- Le contenu du dashboard varie selon les permissions effectives de l'utilisateur (un agent sans permission « lire tous les rapports » ne voit que les siens).
- Le dashboard est contextualisé sur l'organisme actif en session (US1.6) et se met à jour au changement d'organisme actif.
- Aucune donnée d'un autre tenant n'apparaît, même agrégée sous forme de compteur.

### US8.3 — Filtrage systématique par tenant et organisme actif *(Must)*
En tant qu'éditeur du produit, je veux que la recherche globale et le dashboard appliquent les mêmes règles d'isolation que le reste de l'API, afin de ne pas introduire un point de fuite via un endpoint agrégé.

Critères d'acceptation :
- Les endpoints de recherche/dashboard réutilisent la même couche d'accès aux données que les endpoints CRUD (pas de requête ad hoc contournant l'injection automatique du `tenantId`, cf. US1.5).
- Un test de non-régression dédié rejoue le scénario de fuite inter-tenant (US1.5) spécifiquement sur la recherche globale et le dashboard.

### US8.4 — Raccourcis clavier et navigation rapide *(Could)*
En tant qu'agent, je veux ouvrir la recherche globale et naviguer entre les écrans principaux au clavier, afin de gagner du temps en usage intensif.

Critères d'acceptation :
- Un raccourci clavier ouvre la recherche globale depuis n'importe quel écran du panel.
- La navigation au clavier ne contourne aucune vérification de permission (les mêmes règles d'accès s'appliquent qu'au clic).

---

## Epic 9 — Warrants / personnes recherchées / BOLO

### US9.1 — Création et visa obligatoire d'un warrant *(Must)*
En tant qu'agent habilité, je veux créer un warrant motivé et le soumettre à un visa hiérarchique, afin de respecter l'obligation d'approbation avant émission (décision Q9/Q23).

Critères d'acceptation :
- Un `Warrant` naît en `BROUILLON`, passe en `EN_ATTENTE_VISA` à la soumission, puis `APPROUVE` ou `REJETE` uniquement via l'action d'un rôle distinct de l'auteur (`approbateurId != auteurId`).
- Un warrant `APPROUVE` exige `dateEmission` renseignée automatiquement à l'approbation et une `dateExpiration` cohérente (postérieure à l'émission).
- Une tentative d'auto-approbation (même utilisateur en `auteurId` et `approbateurId`) est rejetée par l'API, pas seulement masquée côté interface.

### US9.2 — Expiration automatique d'un warrant *(Must)*
En tant que système, je veux faire passer automatiquement un warrant en statut `EXPIRE` après sa `dateExpiration`, afin qu'un agent ne se fie jamais à un warrant périmé.

Critères d'acceptation :
- Une tâche planifiée fait transiter tout `Warrant.statut = APPROUVE` dont `dateExpiration` est dépassée vers `EXPIRE`, sans action manuelle.
- Un warrant `EXPIRE` reste visible dans l'historique de la fiche personne concernée mais n'apparaît plus dans une recherche de « warrants actifs ».
- Le passage à `EXPIRE` est journalisé dans `JournalAudit`.

### US9.3 — Fiche personne recherchée avec niveau et dangerosité *(Must)*
En tant qu'agent habilité, je veux enregistrer une personne recherchée avec son niveau de recherche, son motif et sa dangerosité RP, afin d'informer les collègues des consignes à appliquer en cas de contrôle.

Critères d'acceptation :
- `PersonneRecherchee.statut` distingue `ACTIVE`, `SUSPENDUE`, `CLOTUREE` et seule une fiche `ACTIVE` remonte dans la recherche globale (Epic 8) comme alerte.
- La clôture (`finAt` renseignée, `statut = CLOTUREE`) est réservée à un rôle habilité, pas à l'auteur seul par défaut, cohérent avec les règles d'approbation de l'organisme.
- La fiche est systématiquement liée à une `Personne` existante du même tenant (pas de création de personne recherchée « libre » sans fiche personne).

### US9.4 — Création et diffusion d'un BOLO avec expiration courte *(Must)*
En tant qu'agent, je veux publier un BOLO avec priorité, signalement et véhicule éventuel, diffusé rapidement à mon tenant, afin d'alerter mes collègues sans attendre une approbation (décision Q9/Q23).

Critères d'acceptation :
- Un `Bolo` est publiable directement par un rôle porteur de la permission « créer BOLO », sans étape d'approbation obligatoire par défaut, conformément à la décision Q9.
- `dateExpiration` est calculée par défaut à `createdAt + 72h` si non renseignée explicitement, et reste reconductible par une action explicite qui prolonge la date (journalisée).
- Un BOLO expiré n'apparaît plus dans les vues « BOLO actifs » du dashboard (US8.2) ni dans les alertes de recherche, sans être supprimé de l'historique.

### US9.5 — Restriction de diffusion BOLO par division *(Should)*
En tant qu'administrateur d'organisme, je veux restreindre la diffusion d'un BOLO à certaines divisions plutôt qu'à tout le tenant, afin de gérer des cas sensibles (décision Q23) quand mon organisme active cette option.

Critères d'acceptation :
- Le champ `Bolo.destinataires` supporte soit la valeur « tout le tenant » (comportement par défaut), soit une liste explicite de `divisionId`.
- Un membre d'une division non listée dans `destinataires` ne voit pas le BOLO restreint dans ses listes ni ses notifications, mais un rôle à portée `TENANT` explicite le voit toujours (pour supervision).
- Cette restriction est un paramètre par organisme (activable/désactivable), pas un comportement global forcé pour tous les clients.

### US9.6 — Accusé de lecture BOLO *(Could)*
En tant que superviseur, je veux savoir quels agents ont pris connaissance d'un BOLO critique, afin de vérifier la diffusion effective d'une information sensible.

Critères d'acceptation :
- `BoloAccuseLecture` enregistre un couple `(boloId, utilisateurId)` unique avec horodatage de première lecture.
- La liste des accusés de lecture d'un BOLO est visible uniquement par un rôle habilité à consulter l'activité de diffusion, pas par n'importe quel agent.

---

## Epic 10 — Enquêtes / pièces à conviction / saisies

### US10.1 — Création d'un dossier d'enquête *(Must)*
En tant qu'enquêteur, je veux créer un dossier d'enquête avec un numéro, une classification, une priorité et un niveau de confidentialité, afin de centraliser une investigation RP.

Critères d'acceptation :
- `numeroDossier` est unique par tenant (`@@unique([tenantId, numeroDossier])`) ; deux tentatives de création avec le même numéro dans le même tenant sont rejetées.
- Le champ `confidentialite` contrôle effectivement l'affichage : un dossier au niveau le plus restrictif n'apparaît pas dans la recherche globale (Epic 8) pour un rôle sans permission d'accès aux dossiers confidentiels.
- `responsableId` doit correspondre à une `Affectation` active de l'organisme concerné.

### US10.2 — Affectation de co-enquêteurs *(Must)*
En tant que responsable d'enquête, je veux ajouter des co-enquêteurs ou une spécialité au dossier, afin de refléter le travail collaboratif sur une investigation.

Critères d'acceptation :
- `EnqueteCoEnqueteur` référence un `utilisateurId` porteur d'une affectation active dans l'organisme du dossier (ou de la division si `divisionId` est renseigné).
- Un co-enquêteur ajouté obtient l'accès en lecture/écriture au dossier même sans permission `ORGANISME`/`TENANT` large, limité à ce dossier précis.
- Retirer un co-enquêteur révoque immédiatement son accès spécifique à ce dossier (sauf s'il dispose par ailleurs d'une permission plus large).

### US10.3 — Chronologie, notes, tâches et jalons *(Should)*
En tant qu'enquêteur, je veux consigner des notes, tâches et jalons horodatés sur un dossier, afin de garder une trace structurée de l'avancement de l'investigation.

Critères d'acceptation :
- Chaque `EnqueteEvenement` est horodaté, attribué à son auteur et non modifiable après création (seul un nouvel événement peut compléter).
- Une `EnqueteTache` a un `statut` et peut être assignée (`assigneeId`) à un co-enquêteur du dossier, avec une `echeance` optionnelle.
- La chronologie est consultable triée par date, filtrable par type (note/tâche/jalon/action).

### US10.4 — Pièces à conviction liées au dossier *(Must)*
En tant qu'enquêteur, je veux décrire les pièces à conviction rattachées à mon dossier avec leur statut et leur emplacement, afin de garder une trace exploitable indépendamment des saisies physiques.

Critères d'acceptation :
- Une `PieceConviction` est toujours rattachée à une `Enquete` existante du même tenant, jamais créée orpheline.
- Le `statut` d'une pièce à conviction est visible dans la synthèse du dossier et modifiable uniquement par un rôle habilité sur ce dossier (responsable, co-enquêteur ou permission élargie).

### US10.5 — Saisie avec chaîne de possession *(Must)*
En tant qu'agent effectuant une saisie, je veux enregistrer le contexte, les objets saisis et chaque mouvement (saisi, transféré, consulté, restitué, détruit), afin de garantir une chaîne de possession opposable RP.

Critères d'acceptation :
- Chaque `SaisieObjet` accumule une séquence de `ChaineDePossession` strictement additive : aucune route API ne permet de modifier ou supprimer une entrée déjà créée, seulement d'en ajouter une nouvelle.
- L'action `DETRUIT` sur un objet clôture sa traçabilité en écriture (toute action ultérieure sur cet objet est rejetée) tout en restant visible en lecture.
- Une `Saisie` est rattachée à un `rapportId` et/ou `enqueteId` du même tenant ; une tentative de rattachement croisé vers un autre tenant est rejetée.

### US10.6 — Clôture définitive d'enquête soumise à approbation *(Must)*
En tant que responsable d'enquête, je veux que la clôture définitive d'un dossier exige l'approbation d'un rôle distinct, afin de respecter l'obligation d'approbation de la décision Q9 et d'éviter une clôture unilatérale d'un dossier sensible.

Critères d'acceptation :
- La transition vers `CLOTUREE` exige une action d'un rôle porteur d'une permission d'approbation distincte de celle qui permet simplement de modifier le dossier (peut être le même utilisateur que le responsable seulement s'il porte aussi cette permission dédiée, mais le test couvre le cas où ils sont différents).
- Un dossier `CLOTUREE` peut être rouvert (`ROUVERTE`) uniquement par un rôle habilité, avec motif obligatoire journalisé.
- La clôture et la réouverture sont chacune journalisées dans `JournalAudit` avec avant/après du statut.

---

## Epic 11 — Divisions & spécialités

### US11.1 — Création de divisions et spécialités par organisme *(Must)*
En tant qu'administrateur d'organisme, je veux créer des divisions (Gang Task Force, CID, K-9, SWAT, Internal Affairs, etc.), afin de structurer mon organisme selon ses besoins RP.

Critères d'acceptation :
- `Division.code` est unique par organisme (`@@unique([organismeId, code])`).
- Une division peut être créée, renommée ou désactivée sans intervention de l'éditeur, uniquement par un rôle porteur de la permission « gérer les organismes/divisions ».
- Désactiver une division ne supprime pas l'historique des affectations passées qui y étaient rattachées.

### US11.2 — Affectation d'un membre à une division *(Must)*
En tant qu'administrateur d'organisme, je veux rattacher un membre à une division dans le cadre de son affectation à l'organisme, afin de refléter son unité de travail réelle.

Critères d'acceptation :
- `Affectation.divisionId` ne peut référencer qu'une division appartenant au même `organismeId` que l'affectation (contrainte vérifiée côté API, pas seulement en base).
- Un membre peut appartenir à des divisions différentes selon l'organisme dans lequel il a une affectation active (cohérent avec la multi-appartenance de US1.6).

### US11.3 — Droits spécifiques par division (portée DIVISION) *(Must)*
En tant qu'administrateur d'organisme, je veux qu'un rôle avec une permission à portée `DIVISION` ne s'applique qu'aux ressources de cette division, afin que, par exemple, les enquêteurs de la CID n'accèdent pas aux dossiers d'une autre division sans permission élargie.

Critères d'acceptation :
- Un test explicite vérifie qu'un rôle « lire enquête » à portée `DIVISION` ne retourne, en recherche comme en lecture directe, que les enquêtes liées à la division de l'affectation de l'utilisateur.
- Le même test confirme qu'un rôle à portée `ORGANISME` ou `TENANT` voit correctement l'ensemble attendu (pas de sur-restriction accidentelle).
- Un utilisateur avec plusieurs affectations (plusieurs divisions) cumule l'accès à toutes ses divisions actives, pas seulement la dernière enregistrée.

### US11.4 — Hiérarchie de divisions *(Should)*
En tant qu'administrateur d'organisme, je veux organiser des divisions en parent/enfant (ex. une sous-unité de la CID), afin de représenter une structure plus fine si mon organisme en a besoin.

Critères d'acceptation :
- `Division.parentId` référence uniquement une autre division du même organisme ; une référence croisée vers un autre organisme est rejetée.
- Une boucle de hiérarchie (A parent de B, B parent de A) est détectée et rejetée à la création/modification.

### US11.5 — Responsable de division *(Could)*
En tant qu'administrateur d'organisme, je veux désigner un responsable pour une division, afin d'identifier un point de contact et, à terme, de faciliter des workflows d'approbation propres à la division.

Critères d'acceptation :
- Un responsable désigné doit avoir une affectation active dans cette division.
- Le changement de responsable est journalisé dans `JournalAudit`.

---

## Epic 12 — Exports contrôlés

### US12.1 — Export PDF réservé à la permission « exporter » *(Must)*
En tant qu'agent porteur de la permission dédiée, je veux exporter un rapport ou un dossier en PDF, afin de le remettre à une autorité RP ou de l'archiver hors du panel.

Critères d'acceptation :
- Toute route d'export vérifie explicitement la permission « exporter » côté API ; un appel direct sans cette permission renvoie 403 même si l'utilisateur a par ailleurs le droit de lire l'objet exporté.
- L'objet exporté (`Export.cibleId`) doit être du même `tenantId` que la session, vérifié même si l'identifiant est deviné.
- Un export d'un objet confidentiel (dossier restreint, casier) exige en plus la permission de lecture spécifique à cet objet, cumulée à la permission « exporter ».

### US12.2 — Gabarit d'impression configurable par organisme *(Should)*
En tant qu'administrateur d'organisme, je veux configurer un gabarit d'impression (logo, en-tête, pied de page) pour mes exports, afin qu'ils portent l'identité officielle de mon organisme (décision Q26).

Critères d'acceptation :
- Le gabarit est un ensemble de paramètres de configuration (logo, textes d'en-tête/pied de page), jamais un template HTML/CSS libre injectable par le client (contrainte de la décision Q32).
- Un export généré sans gabarit configuré utilise un gabarit par défaut sobre, sans erreur ni page blanche.

### US12.3 — URL d'export temporaire, jamais publique permanente *(Must)*
En tant qu'éditeur du produit, je veux que chaque fichier d'export soit accessible uniquement via une URL signée à durée de vie limitée, afin d'éviter qu'un lien partagé une fois ne reste valable indéfiniment.

Critères d'acceptation :
- `Export.urlExpiration` est systématiquement renseignée à la génération et l'URL signée devient invalide passé ce délai (vérifié par un appel après expiration renvoyant 403/410).
- Aucune route ne permet de récupérer un export d'un `tenantId` différent de la session, y compris avec l'identifiant exact de l'`Export`.

### US12.4 — Journalisation systématique de chaque export *(Must)*
En tant qu'éditeur du produit, je veux que chaque génération d'export soit journalisée avec son demandeur et sa cible, afin de tracer toute sortie de données du panel (exigence transverse, section 4).

Critères d'acceptation :
- Chaque `Export` créé génère une entrée `JournalAudit` de type « export.generer » avec `demandeParId`, `type`, `cibleId`.
- Le tableau d'audit (US3.2) permet de filtrer spécifiquement sur les actions de type export.

### US12.5 — Approbation obligatoire avant export sensible *(Must)*
En tant qu'organisme, je veux qu'un export portant sur une donnée listée comme sensible par la décision Q9 nécessite une validation, afin de contrôler la diffusion de contenu à fort impact avant qu'il ne quitte le panel.

Critères d'acceptation :
- Un export de type « casier judiciaire » ou « dossier confidentiel » ne se déclenche qu'après une étape de validation par un rôle distinct du demandeur, configurable par organisme conformément à la décision Q9.
- Une tentative de contournement (export direct sans passer par le workflow d'approbation) sur un type d'export listé comme sensible est techniquement impossible via l'API, pas seulement masquée côté interface.
- Le refus d'un export sensible est journalisé au même titre que son approbation, avec le motif si renseigné.

---

## Hors scope MVP explicite

Pour éviter toute dérive de périmètre, les éléments suivants sont **volontairement exclus** de ce backlog MVP (Phases 1 et 2), même s'ils sont décrits dans le cahier des charges :

- **Dispatch en temps réel** (créations d'interventions live, statuts opérationnels appliqués en direct, fil d'activité horodaté temps réel, notifications Socket.IO ciblées) — relève de la **Phase 3** (section 3.7 et section 7). Le MVP pose les fondations de données (`Dispatch`, `Unite`, `DispatchEvenement` existent déjà dans le schéma) mais aucune story de ce backlog n'implémente le temps réel.
- **Carte GTA V interactive en SVG** (zoom, calques, zones/juridictions éditables, conversion de coordonnées FiveM ↔ SVG, marqueurs cliquables) — relève de la **Phase 3** (section 3.6 et section 7). Le brief de création de la carte (décision Q20) est un prérequis de cadrage mais pas une story de développement du MVP.
- **Implémentation concrète des quatre adaptateurs FiveM** (ESX Legacy, QBCore, Qbox, standalone) — relève de la **Phase 3**. Seule l'interface commune (Epic 5) et un éventuel stub de test (US5.5) sont dans le MVP ; aucun adaptateur réel connecté à un serveur FiveM de production n'est livré en Phase 1/2.
- **Bot Discord** (notifications configurables, anti-doublon, commandes de consultation) — relève de la **Phase 4** (section 3.9 et section 7). Aucune notification sortante vers Discord n'est développée dans ce backlog.
- **Launcher / assistant web d'installation self-service** pour les clients — relève de la **Phase 4** (section 7 et décision Q29). Le MVP ne prévoit que le provisioning manuel d'un tenant par le super-admin (US1.2), pas un parcours self-service pour un client final.
- **Application bureau (launcher Tauri)** — relève de la **Phase 5**, et n'est développée que si un besoin concret est démontré (section 3.10 et section 7).
- **Radio vocale et canaux audio** — restent hors produit en v1 ; le vocal continue de passer par les outils existants du serveur (Discord/TeamSpeak), conformément à la décision Q18.
- **Consultation publique/civile du casier judiciaire** — hors scope v1, à envisager en Phase 4+ si un client le demande (décision Q36).
- **Intégration à un téléphone RP tiers spécifique** — hors scope v1 ; seule une commande générique (`/911`) fait partie du contrat d'adaptateur (décision Q15).
- **Personnalisation visuelle avancée (CSS/HTML/template libre par client)** — jamais prévue, ni en MVP ni au-delà, pour préserver la maintenabilité (décision Q32) ; seule la configuration (logo, couleurs, libellés, gabarit d'export) est dans le MVP (US12.2).
- **Synchronisation d'appels ou d'unités complexes depuis FiveM** (au-delà de connexion/déconnexion, identité, position, statut déclaré, véhicule courant optionnel) — hors scope v1 par la décision Q13.
