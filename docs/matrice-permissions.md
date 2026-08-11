# Matrice des permissions initiales

> Livrable de la section 9 du cahier des charges (`../prompt-panel-fivem-dispatch.md`). S'appuie sur les modèles `Role`, `Permission`, `RolePermission` (avec son enum `PermissionScope`) et `Affectation` du schéma de données v1 ([`docs/schema-donnees.md`](schema-donnees.md)). Ce document est un catalogue de référence à charger en données de départ (seed) lors de l'installation d'un tenant, pas un système figé : chaque client compose ensuite ses propres rôles à partir de ce catalogue.

## 1. Principe : le grade est visuel, seul le RBAC porte les droits

Conformément à la décision **Q8**, le **grade** (`Grade`) est un échelon purement hiérarchique et visuel — nom, niveau d'affichage, icône. Il ne porte **jamais** de permission par défaut et n'entre dans aucun calcul d'autorisation. Un agent haut gradé sans rôle adéquat ne peut approuver ni un rapport, ni un warrant.

Les droits réels proviennent exclusivement du triplet **Rôle → Permission → Scope**, assigné à un membre via son `Affectation` (un rôle par organisme d'appartenance, cf. Q7 sur la multi-appartenance). Un rôle personnalisé peut recevoir une permission avec une portée précise, et cette attribution peut être surchargée pour un membre ou une spécialité en particulier (module 3.1 du cahier des charges).

Règle non négociable héritée des principes du cahier des charges : **toute permission est évaluée côté serveur, à chaque requête et à chaque événement temps réel**, jamais seulement par un masquage d'éléments d'interface. L'interface peut anticiper l'affichage à partir des permissions connues du client, mais l'API rejette systématiquement toute action non autorisée, y compris si un bouton n'aurait pas dû être visible.

Le **catalogue des permissions atomiques** (clé, description, portées possibles) est fixe et versionné avec le produit : chaque clé correspond à un contrôle codé côté API. Ce qui est librement configurable par le client, ce n'est pas la liste des permissions elle-même, mais **la composition des rôles** : quelles permissions un rôle porte, à quelle portée, et les surcharges par membre ou spécialité.

## 2. Portées (scopes)

| Scope | Signification |
| --- | --- |
| `SOI` | L'action ne s'applique qu'aux objets dont l'acteur est lui-même l'auteur, l'assigné ou le titulaire (son propre rapport, son propre statut d'unité). |
| `DIVISION` | L'action s'applique aux objets rattachés à la ou les divisions/spécialités auxquelles l'acteur est affecté. |
| `ORGANISME` | L'action s'applique à tous les objets de l'organisme dans lequel l'acteur a une affectation active. |
| `TENANT` | L'action s'applique à tous les organismes du tenant, y compris ceux auxquels l'acteur n'est pas directement affecté (rôles d'administration transverse). |

Une même clé de permission peut être proposée à plusieurs portées dans le catalogue ; c'est l'attribution `RolePermission` (une portée par couple rôle/permission) qui fixe la portée effective pour un rôle donné.

## 3. Catalogue des permissions atomiques

### 3.1 Administration, organismes, rôles et membres

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `organisme.creer` | Créer un nouvel organisme au sein du tenant. | TENANT |
| `organisme.modifier` | Modifier les paramètres d'un organisme (nom, logo, couleurs, juridiction, règles de fonctionnement). | ORGANISME, TENANT |
| `organisme.archiver` | Archiver ou réactiver un organisme. | TENANT |
| `role.gerer` | Créer, modifier ou supprimer un rôle personnalisé et composer ses permissions. | ORGANISME, TENANT |
| `permission.surcharger` | Surcharger une permission pour un membre ou une spécialité en particulier, au-delà de son rôle. | DIVISION, ORGANISME |
| `grade.gerer` | Créer, modifier ou réordonner les grades (purement visuels) d'un organisme. | ORGANISME |
| `parametre.gerer` | Configurer les réglages métier de l'organisme (statuts opérationnels, priorités, catégories, workflows d'approbation, gabarits d'export). | ORGANISME, TENANT |
| `membre.inviter` | Inviter ou rattacher un utilisateur Discord à un organisme via une nouvelle affectation. | DIVISION, ORGANISME |
| `membre.modifier` | Modifier le grade, l'indicatif, le matricule ou le rôle d'une affectation existante. | DIVISION, ORGANISME, TENANT |
| `membre.suspendre` | Suspendre ou révoquer une affectation d'un membre. | DIVISION, ORGANISME |
| `membre.consulter_historique` | Consulter l'historique des changements de rôle, grade, division et permissions d'un membre. | DIVISION, ORGANISME, TENANT |
| `licence.gerer` | Gérer la licence du tenant (formule, essai gratuit, palier d'offre, limite d'organismes). | TENANT |

### 3.2 Divisions et spécialités

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `division.gerer` | Créer, modifier ou archiver une division ou une spécialité (Gang Task Force, K-9, SWAT, CID...). | ORGANISME |
| `division.affecter` | Affecter ou retirer un membre d'une division ou spécialité. | DIVISION, ORGANISME |

### 3.3 Rapports

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `rapport.lire` | Consulter un rapport et ses pièces jointes. | SOI, DIVISION, ORGANISME |
| `rapport.creer` | Créer un rapport en brouillon à partir d'un modèle. | ORGANISME |
| `rapport.soumettre` | Soumettre son propre rapport pour validation. | SOI |
| `rapport.corriger` | Corriger un rapport que l'on a rédigé, renvoyé « à corriger ». | SOI |
| `rapport.approuver` | Approuver ou renvoyer à corriger un rapport soumis. | DIVISION, ORGANISME |
| `rapport.archiver` | Archiver un rapport approuvé. | DIVISION, ORGANISME |
| `rapport.rouvrir` | Rouvrir un rapport archivé. | ORGANISME |
| `rapport.gerer_categories` | Configurer les catégories, sous-catégories et modèles de rapport. | ORGANISME |
| `rapport.exporter` | Exporter ou imprimer un rapport au gabarit officiel. | DIVISION, ORGANISME |

### 3.4 Warrants

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `warrant.creer` | Créer une demande de warrant (brouillon, en attente de visa). | DIVISION, ORGANISME |
| `warrant.approuver` | Viser/approuver un warrant (rôle supérieur obligatoire). | ORGANISME |
| `warrant.annuler` | Annuler un warrant actif avant son expiration. | ORGANISME |
| `warrant.consulter` | Consulter les warrants actifs et archivés. | DIVISION, ORGANISME, TENANT |

### 3.5 Personnes recherchées

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `recherche.creer` | Créer un avis de recherche de personne (niveau, motif, dangerosité, consignes). | DIVISION, ORGANISME |
| `recherche.approuver` | Approuver/publier un avis de recherche selon le workflow défini par l'organisme. | ORGANISME |
| `recherche.cloturer` | Clôturer ou suspendre un avis de recherche. | DIVISION, ORGANISME |
| `recherche.consulter` | Consulter les personnes recherchées. | ORGANISME, TENANT |

### 3.6 BOLO

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `bolo.creer` | Créer et publier un BOLO (pas d'approbation obligatoire par défaut, cf. Q9). | DIVISION, ORGANISME |
| `bolo.annuler` | Annuler ou clôturer un BOLO avant son expiration. | DIVISION, ORGANISME |
| `bolo.diffuser_tenant` | Diffuser un BOLO à tout le tenant plutôt qu'à des divisions restreintes. | TENANT |
| `bolo.consulter` | Consulter les BOLO actifs et archivés. | ORGANISME, TENANT |

### 3.7 Registres personnes, armes, véhicules

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `personne.lire` | Consulter une fiche personne (identité de base et champs personnalisés non confidentiels). | ORGANISME, TENANT |
| `personne.creer` | Créer une fiche personne hors synchronisation automatique FiveM. | ORGANISME |
| `personne.modifier` | Modifier les champs personnalisés d'une fiche personne. | DIVISION, ORGANISME |
| `personne.consulter_confidentiel` | Consulter les liens et dossiers confidentiels rattachés à une fiche personne. | DIVISION, ORGANISME |
| `arme.gerer` | Créer/modifier une fiche arme civile ou de service et changer son statut (circulation, saisie, détruite). | DIVISION, ORGANISME |
| `arme.consulter` | Consulter le registre des armes. | ORGANISME, TENANT |
| `vehicule.gerer` | Créer/modifier une fiche véhicule civil ou de service et changer son statut. | DIVISION, ORGANISME |
| `vehicule.consulter` | Consulter le registre des véhicules civils et de la flotte de service. | ORGANISME, TENANT |
| `recherche_globale.utiliser` | Utiliser la recherche globale multi-registres (les résultats restent filtrés par la permission de lecture de chaque type de fiche). | ORGANISME, TENANT |

### 3.8 Casier judiciaire

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `casier.consulter` | Consulter le casier judiciaire d'une personne (permission dédiée, Q33). | DIVISION, ORGANISME |
| `casier.gerer` | Créer manuellement une entrée, ou modifier son statut (purgée, graciée, amnistiée) avec motif conservé — jamais de suppression physique (Q34, Q35). | ORGANISME |

### 3.9 Enquêtes

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `enquete.creer` | Ouvrir un dossier d'enquête (numéro, classification, priorité, confidentialité). | DIVISION, ORGANISME |
| `enquete.consulter` | Consulter un dossier d'enquête, selon son niveau de confidentialité. | SOI, DIVISION, ORGANISME |
| `enquete.modifier` | Modifier le contenu, la chronologie, les notes et les tâches d'une enquête. | DIVISION, ORGANISME |
| `enquete.affecter` | Affecter des co-enquêteurs ou une spécialité à un dossier. | DIVISION, ORGANISME |
| `enquete.cloturer_temporaire` | Suspendre une enquête ou la clôturer provisoirement (réouverture simple, sans approbation). | DIVISION, ORGANISME |
| `enquete.cloturer_definitif` | Clôturer définitivement un dossier d'enquête — approbation obligatoire par défaut (Q9). | ORGANISME |
| `enquete.rouvrir` | Rouvrir un dossier clôturé définitivement. | ORGANISME |

### 3.10 Saisies

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `saisie.creer` | Enregistrer une nouvelle saisie et ses objets (contexte, autorité RP, origine). | DIVISION, ORGANISME |
| `saisie.gerer_possession` | Enregistrer un mouvement de la chaîne de possession (transfert, consultation, restitution, destruction). | DIVISION, ORGANISME |
| `saisie.consulter` | Consulter les saisies et leur chaîne de possession. | DIVISION, ORGANISME |

### 3.11 Dispatch

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `dispatch.creer` | Créer une intervention (manuelle, via appel, ou via commande FiveM générique). | ORGANISME |
| `dispatch.attribuer` | Prendre en charge ou attribuer une intervention à une unité. | DIVISION, ORGANISME |
| `dispatch.modifier` | Modifier la priorité, la catégorie, la description ou les consignes d'une intervention en cours. | DIVISION, ORGANISME |
| `dispatch.cloturer` | Clôturer ou annuler une intervention. | DIVISION, ORGANISME |
| `dispatch.rouvrir` | Rouvrir une intervention clôturée ou archivée. | ORGANISME |
| `dispatch.consulter_confidentiel` | Consulter une intervention marquée confidentielle. | DIVISION, ORGANISME |
| `unite.gerer_statut` | Déclarer ou modifier son propre statut opérationnel, ou celui de son unité/équipage. | SOI, DIVISION |
| `unite.superviser` | Voir et piloter l'ensemble des unités engagées de l'organisme (tableau de dispatch complet). | ORGANISME |

### 3.12 Carte

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `carte.consulter` | Consulter la carte en lecture seule (unités en service, marqueurs saisis). | ORGANISME |
| `carte.editer_marqueurs` | Créer ou déplacer des marqueurs d'intervention, d'unité ou de point d'intérêt. | DIVISION, ORGANISME |
| `carte.gerer_calques` | Configurer les zones/juridictions, frontières et calques de la carte. | ORGANISME |
| `carte.envoyer_waypoint` | Envoyer un waypoint ou une notification de position à une unité en jeu (Q14). | DIVISION, ORGANISME |
| `carte.consulter_position_live` | Consulter la position live FiveM d'un joueur, si le partage est activé par l'organisme (Q19). | DIVISION, ORGANISME |

### 3.13 Intégrations Discord et FiveM

Les intégrations (`IntegrationDiscord`, `IntegrationFiveM`) sont rattachées au **tenant**, pas à un organisme : leur configuration nécessite donc systématiquement le scope `TENANT`, même quand le rôle qui la porte est administré depuis un organisme particulier.

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `integration_discord.configurer` | Lier ou configurer le serveur Discord, les rôles et le routage des salons de notification. | TENANT |
| `integration_discord.activer` | Activer ou désactiver entièrement le bot Discord pour le tenant. | TENANT |
| `integration_fivem.configurer` | Configurer un adaptateur FiveM (framework, endpoint, clé de signature). | TENANT |
| `integration_fivem.tester` | Tester la connexion FiveM/Discord depuis l'assistant d'installation. | TENANT |
| `integration.consulter_logs` | Consulter les journaux d'événements FiveM/Discord (erreurs, rejets, anti-doublon). | ORGANISME, TENANT |

### 3.14 Exports

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `export.generer` | Générer un export/PDF d'un rapport, d'un dossier d'enquête ou d'un registre — approbation obligatoire par défaut (Q9). | DIVISION, ORGANISME |
| `export.telecharger` | Télécharger un export déjà généré et approuvé via son URL signée temporaire. | DIVISION, ORGANISME |

### 3.15 Audit et gouvernance

| Clé | Description | Scopes pertinents |
| --- | --- | --- |
| `audit.consulter` | Consulter le journal d'audit (append-only) de l'organisme ou du tenant. | ORGANISME, TENANT |
| `approbation.valider` | Valider une demande en attente d'approbation lorsque le workflow prévoit un approbateur générique distinct de la permission métier dédiée. | ORGANISME, TENANT |
| `notification.gerer_diffusion` | Configurer les règles de ciblage des notifications temps réel et Discord. | ORGANISME |
| `featureflag.consulter` | Consulter les modules/fonctionnalités activés pour le tenant (feature flags). | TENANT |

> Le **super-admin global de l'éditeur** (décision Q5 — accès large multi-tenant pour la licence et le support) n'est **pas** un rôle de ce catalogue par-tenant : c'est un acteur plateforme distinct, hors RBAC client, dont chaque accès à un tenant est lui-même journalisé dans `JournalAudit`. Il n'apparaît pas dans les rôles-modèles ci-dessous.

## 4. Rôles-modèles par défaut

Ces six rôles sont fournis en données de départ (seed) à la création d'un organisme. Ce sont des **modèles de départ modifiables** : le client peut renommer, dupliquer, retirer des permissions ou en ajouter, et créer autant de rôles personnalisés qu'il le souhaite via `role.gerer`.

| Rôle | Vocation |
| --- | --- |
| **Agent** | Personnel de terrain de base : dispatch, rapports courants, registres non confidentiels. |
| **Superviseur / Gradé** | Encadrement d'une division : approbation des rapports/avis courants, supervision du dispatch, accès casier restreint. |
| **Enquêteur** | Spécialiste d'investigation : enquêtes, casier judiciaire, warrants, saisies. |
| **Direction** | Commandement de l'organisme : approbations sensibles (warrant, clôture d'enquête, casier), audit. |
| **Administrateur d'organisme** | Gère la configuration et les membres d'un organisme précis, sans accès aux réglages du tenant. |
| **Super-admin tenant** | Administrateur désigné par le client, autorité sur l'ensemble du tenant : tous les organismes, intégrations, licence. |

## 5. Matrice croisée rôles × permissions structurantes

Portées : **S** = SOI, **D** = DIVISION, **O** = ORGANISME, **T** = TENANT, **—** = permission non accordée par défaut.

| Permission | Agent | Superviseur / Gradé | Enquêteur | Direction | Administrateur d'organisme | Super-admin tenant |
| --- | --- | --- | --- | --- | --- | --- |
| `rapport.soumettre` | S | S | S | — | — | — |
| `rapport.approuver` | — | O | — | O | O | T |
| `rapport.exporter` | — | D | D | O | O | T |
| `warrant.creer` | — | D | D | O | — | — |
| `warrant.approuver` | — | — | — | O | — | T |
| `recherche.creer` | — | D | D | O | — | — |
| `bolo.creer` | O | O | O | O | — | — |
| `casier.consulter` | — | — | O | O | — | T |
| `casier.gerer` | — | — | — | O | — | T |
| `enquete.creer` | — | D | D | O | — | — |
| `enquete.cloturer_definitif` | — | — | — | O | — | T |
| `saisie.gerer_possession` | D | D | D | O | — | — |
| `dispatch.creer` | O | O | — | — | — | — |
| `dispatch.attribuer` | O | O | — | — | — | — |
| `unite.gerer_statut` | S | S | S | S | — | — |
| `carte.editer_marqueurs` | O | O | — | — | — | — |
| `carte.envoyer_waypoint` | — | O | — | — | — | — |
| `membre.modifier` | — | D | — | O | O | T |
| `role.gerer` | — | — | — | — | O | T |
| `organisme.modifier` | — | — | — | — | O | T |
| `integration_fivem.configurer` | — | — | — | — | — | T |
| `integration_discord.configurer` | — | — | — | — | — | T |
| `audit.consulter` | — | — | — | O | O | T |
| `export.generer` | — | D | D | O | O | T |
| `approbation.valider` | — | O | — | O | O | T |
| `licence.gerer` | — | — | — | — | — | T |

Lecture : par exemple, un **Superviseur/Gradé** approuve les rapports (`rapport.approuver`) à l'échelle de son organisme, mais n'a pas accès à `casier.gerer` ni à la configuration des intégrations — ces droits restent réservés à Direction et Super-admin tenant, conformément à la logique de séparation des tâches attendue sur les actions sensibles.

## 6. Approbations obligatoires et double authentification

### 6.1 Actions exigeant une approbation par défaut (décision Q9)

Les actions suivantes ne peuvent pas être finalisées par leur seul auteur, même s'il détient la permission de les initier : elles passent par un statut intermédiaire (« en attente d'approbation » / « en attente de visa ») et nécessitent l'action d'un second titulaire habilité.

| Action | Permission d'initiation | Permission d'approbation | Statut intermédiaire |
| --- | --- | --- | --- |
| Émission d'un warrant | `warrant.creer` | `warrant.approuver` | `EN_ATTENTE_VISA` |
| Clôture définitive d'une enquête | `enquete.cloturer_definitif` (demande) | `approbation.valider` ou rôle Direction dédié | statut « en attente de clôture définitive » |
| Export de données | `export.generer` (demande) | `approbation.valider` ou rôle habilité | export non disponible tant que non approuvé |
| Modification ou annulation d'une entrée de casier judiciaire | `casier.gerer` (demande de changement de statut) | `approbation.valider` ou rôle Direction/greffe dédié | entrée conservée avec motif, statut inchangé tant que non validé |

Le BOLO et les rapports standards (soumission → approbation par un superviseur) restent publiables sans approbation obligatoire supplémentaire au sens de Q9, mais chaque organisme peut activer un workflow plus strict via `parametre.gerer` (cf. section 3.3 du cahier des charges : le workflow reste configurable par organisme, y compris pour BOLO et avis de recherche). Cette configurabilité ne doit jamais abaisser le socle des quatre actions listées ci-dessus : elles restent à approbation obligatoire quel que soit le paramétrage client.

L'auteur d'une demande ne peut jamais être son propre approbateur : la vérification serveur doit rejeter toute tentative d'auto-approbation, y compris si l'auteur détient également la permission d'approbation à titre personnel.

### 6.2 Double authentification obligatoire (décision Q10)

La double authentification (MFA) n'est pas réservée aux administrateurs : elle est **obligatoire pour tout rôle porteur d'au moins une permission sensible**, quel que soit son intitulé. Sont considérées sensibles par défaut, entre autres :

- toute permission d'administration (`organisme.*`, `role.gerer`, `membre.*`, `division.gerer`, `licence.gerer`) ;
- toute permission d'approbation (`warrant.approuver`, `enquete.cloturer_definitif`, `recherche.approuver`, `approbation.valider`) ;
- l'accès au casier judiciaire (`casier.consulter`, `casier.gerer`) ;
- l'export de données (`export.generer`, `export.telecharger`) ;
- la gestion des droits et des rôles (`role.gerer`, `permission.surcharger`) ;
- la configuration des intégrations (`integration_discord.*`, `integration_fivem.*`).

Concrètement : `Utilisateur.mfaRequired` est **dérivé automatiquement** des permissions portées par les rôles actifs de chaque affectation (voir `docs/schema-donnees.md`) — ce n'est jamais une case à cocher manuelle. Dès qu'une des permissions ci-dessus est attribuée à un rôle, tout membre affecté à ce rôle voit `mfaRequired` passer à vrai et se voit bloquer l'accès aux fonctionnalités concernées tant que `mfaEnabled` n'est pas également vrai. Si un client retire ensuite cette permission du rôle, la contrainte peut être levée pour les membres qui ne portent plus aucune permission sensible par ailleurs.

---

Ce catalogue est un point de départ v1 : il pourra être complété au fil des phases (notamment lors du chiffrage précis des permissions liées au bot Discord en lecture seule, section 3.9 du cahier des charges) sans remettre en cause la structure Rôle/Permission/Scope déjà actée.
