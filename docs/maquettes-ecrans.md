# Maquettes desktop des écrans critiques

> Livrable de la section 9 du cahier des charges (`../prompt-panel-fivem-dispatch.md`). Couvre les six écrans listés : connexion, dashboard, dispatch, fiche personne, rapport, organisation/permissions. Aucun outil de génération d'image n'est disponible : les maquettes sont des wireframes textuels (schémas en blocs ASCII) accompagnés d'annotations fonctionnelles. Champs et entités alignés sur [`schema-donnees.md`](schema-donnees.md) ; décisions produit alignées sur les sections 0, 0.1 et 4 du cahier des charges.
>
> Cible : poste PC (résolution desktop, 1440 px de large et plus), interface sombre sobre, sans esthétique futuriste excessive. Le responsive tablette n'est pas traité ici (priorité PC selon la section 4) ; il fera l'objet d'une passe ultérieure une fois les écrans desktop validés.

## Conventions communes à tous les écrans (hors connexion)

Tous les écrans authentifiés partagent la même coquille (« shell ») pour que la navigation reste prévisible et rapide au clavier, conformément à la section 4 :

```
+--------------------------------------------------------------------------------------------------+
| [Logo] Organisme actif : LSPD ▾   |  🔍 Recherche globale...  (Ctrl+K)   |  🔔 3   Alerte ▾  | JD ▾ |
+--------+-------------------------------------------------------------------------------------------+
|        |                                                                                            |
| ▣ Dash |                                                                                             |
| ▤ Disp |                              ZONE DE CONTENU PRINCIPAL                                      |
| ▥ Carte|                                                                                             |
| ▦ Rappo|                                                                                             |
| ▧ Regis|                                                                                             |
| ▨ Enqu |                                                                                             |
| ▩ Recher|                                                                                            |
| ⚙ Organ|                                                                                             |
| ⏱ Audit|                                                                                             |
|        |                                                                                            |
+--------+-------------------------------------------------------------------------------------------+
```

- **Bandeau supérieur, fixe.** De gauche à droite : logo + nom court de l'organisme actif avec sélecteur (▾) pour changer d'organisme si l'utilisateur a plusieurs affectations actives (décision Q7) ; barre de recherche globale toujours visible et jamais masquée par un module, activable au clavier par `Ctrl+K` ou `/` depuis n'importe quel écran (exigence section 4) ; cloche de notifications avec compteur non lu (dispatchs, BOLO, rapports en attente) ; menu utilisateur (nom, grade, indicatif, déconnexion, préférences).
- **Rail de navigation, gauche, rétractable en icônes seules.** Modules dans l'ordre d'usage réel en service : Tableau de bord, Dispatch, Carte, Rapports, Registres (personnes/véhicules/armes), Enquêtes, Warrants/BOLO/Recherches, puis en bas Organisation et Journal d'audit — visibles uniquement si l'utilisateur porte une permission d'administration dans l'organisme actif. Chaque entrée a un raccourci clavier `g` puis une lettre (ex. `g d` = Dispatch, `g c` = Carte), à la manière d'un « go-to » façon Linear/GitHub, pour la navigation rapide au clavier exigée en section 4.
- **Palette et ton.** Fond quasi noir (gris très foncé, pas de noir pur pour éviter le contraste dur), panneaux en gris anthracite légèrement plus clair avec bordures fines à faible contraste, texte gris clair/blanc cassé. Une seule couleur d'accent neutre (bleu/gris) pour les actions principales et le focus clavier. Les seules couleurs vives autorisées sont sémantiques : rouge (critique/erreur), orange (urgent/attention), jaune (en attente), vert (disponible/succès), bleu (information). Pas de dégradés animés, pas d'effets « glassmorphism » ou de glow — sobriété professionnelle assumée.
- **États systématiques.** Chaque action a un état de chargement (spinner discret + désactivation du contrôle), un état d'erreur en texte clair (jamais un simple code), et une confirmation visible (toast en bas à droite + entrée correspondante dans le fil d'activité ou le journal quand l'action est auditée), conformément à la section 4.
- **Sections verrouillées par permission.** Un onglet, un bouton ou un panneau auquel l'utilisateur n'a pas droit n'est pas simplement masqué quand sa présence est informative (ex. « le casier existe mais vous n'y avez pas accès ») : il reste visible mais verrouillé, avec une icône de cadenas et une info-bulle nommant la permission requise. Quand l'absence d'accès ne doit même pas être révélée (ex. dossier confidentiel hors périmètre), l'élément est totalement absent plutôt que verrouillé.

---

## 1. Écran de connexion

Écran public, sans la coquille applicative. Deux temps : authentification Discord, puis sélection de l'organisme actif si l'utilisateur a plusieurs affectations (décision Q7).

### 1.a Écran d'accueil / connexion

```
+--------------------------------------------------------------------------------------------------+
|                                                                                                    |
|                                                                                                    |
|                                   +------------------------------+                                |
|                                   |                                |                              |
|                                   |            [Logo Panel]        |                              |
|                                   |        Panel de dispatch        |                              |
|                                   |                                |                              |
|                                   |   +--------------------------+ |                              |
|                                   |   |  🎮  Se connecter avec   | |                              |
|                                   |   |       Discord            | |                              |
|                                   |   +--------------------------+ |                              |
|                                   |                                |                              |
|                                   |   ⚠ Connexion refusée : votre  |                              |
|                                   |   compte Discord n'est associé |                              |
|                                   |   à aucun tenant. Contactez    |                              |
|                                   |   votre administrateur.        |                              |
|                                   |                                |                              |
|                                   |   Besoin d'aide ? Documentation |                              |
|                                   +------------------------------+                                |
|                                                                                                    |
|                                                    v1.0 · fr                                       |
+--------------------------------------------------------------------------------------------------+
```

- **Bouton unique « Se connecter avec Discord ».** Seule méthode d'authentification en v1 (décision Q6) — pas de champ email/mot de passe, pas d'autres fournisseurs OAuth affichés pour ne pas suggérer un choix qui n'existe pas.
- **État de chargement.** Après clic, le bouton passe en état désactivé avec un spinner et le libellé « Connexion à Discord... » ; la carte reste affichée pour éviter un écran blanc pendant la redirection OAuth.
- **État d'erreur.** Si le retour OAuth échoue ou si le compte Discord n'est rattaché à aucune `Affectation` active d'un tenant connu, un bandeau d'erreur apparaît sous le bouton (icône ⚠, fond légèrement teinté rouge, texte explicite — jamais un code d'erreur brut). Le bouton redevient cliquable pour réessayer.
- **Pas de sélection de tenant à cette étape.** Le tenant est déterminé côté serveur à partir du `discordId` retourné par Discord (table `Utilisateur.tenantId`) : un utilisateur Discord n'appartient qu'à un seul tenant (cf. `@@unique([tenantId, discordId])`). L'écran suivant ne sert donc qu'à choisir l'organisme actif parmi les affectations de ce tenant, jamais le tenant lui-même.
- **Lien d'aide discret** en bas de carte vers la documentation, sans détourner l'attention du bouton principal.

### 1.b Sélection de l'organisme actif (après authentification réussie)

Affiché uniquement si l'utilisateur a plus d'une `Affectation` au statut `ACTIVE`. S'il n'en a qu'une, l'écran est sauté et l'utilisateur atterrit directement sur le dashboard.

```
+--------------------------------------------------------------------------------------------------+
|                                                                                                    |
|                        Bienvenue, Jean Dupont — choisissez votre organisme actif                  |
|                                                                                                    |
|   +------------------------------------------------------------------------------------------+   |
|   |  ●  LSPD — Los Santos Police Department                                                   |   |
|   |     Division : Patrouille   ·  Grade : Officier II  ·  Indicatif : 4-Adam-12  (principale) |   |
|   +------------------------------------------------------------------------------------------+   |
|   |  ○  SAHP — San Andreas Highway Patrol                                                     |   |
|   |     Division : Aucune       ·  Grade : Cadet         ·  Indicatif : —                     |   |
|   +------------------------------------------------------------------------------------------+   |
|   |  ○  USMS — U.S. Marshals Service                                                          |   |
|   |     Division : Fugitive Task Force  ·  Grade : Deputy  ·  Indicatif : M-07                |   |
|   +------------------------------------------------------------------------------------------+   |
|                                                                                                    |
|                                     [ Continuer vers LSPD → ]                                     |
|                          Vous pourrez changer d'organisme actif à tout moment                      |
|                              depuis le sélecteur en haut de l'écran.                                |
+--------------------------------------------------------------------------------------------------+
```

- **Une carte par affectation active** (`Affectation.statut = ACTIVE`), affichant organisme, division (le cas échéant), grade et indicatif — jamais le rôle/permissions brutes, qui restent un détail technique. L'affectation marquée `estPrincipale` est présélectionnée et annotée « (principale) ».
- **Sélection au clavier** : flèches haut/bas pour naviguer, `Entrée` pour valider — cohérent avec l'exigence de navigation clavier rapide.
- Ce même sélecteur de carte est réutilisé, réduit, comme menu déroulant dans le bandeau supérieur de tous les écrans (« Organisme actif ▾ ») pour changer de contexte sans se déconnecter.

---

## 2. Écran Dashboard

Vue d'ensemble temps réel à l'ouverture de session : c'est l'écran qui répond en un coup d'œil à « qu'est-ce qui se passe là, maintenant ». Il ne remplace pas l'écran Dispatch (traitement détaillé) ni la Carte, il les résume et permet d'y sauter.

```
+--------------------------------------------------------------------------------------------------+
| [Logo] LSPD ▾   |  🔍 Recherche globale... (Ctrl+K)                          |  🔔 3   |  JD ▾    |
+--------+-------------------------------------------------------------------------------------------+
| ▣ Dash |  Tableau de bord — LSPD                                        11/08/2026 · 14:32  🟢 EN LIGNE |
| ▤ Disp |  ------------------------------------------------------------------------------------------ |
| ▥ Carte|  UNITÉS EN SERVICE (12/18)                        |  DISPATCHS ACTIFS PAR PRIORITÉ            |
| ▦ Rappo|  +-----------------------------------------------+ |  +---------------------------------+     |
| ▧ Regis|  | 🟢 4-Adam-12   Disponible      Dupont, Martin | |  | 🔴 CRITIQUE (1)                  |     |
| ▨ Enqu |  | 🔵 4-Adam-07   En patrouille   Nguyen          | |  |  #2026-0142 Braquage en cours    |     |
| ▩ Recher|  | 🟡 4-Adam-03   En route        Costa           | |  |  Vinewood Blvd · 2 unités  4m    |     |
| ⚙ Organ|  | 🟠 4-Adam-19   Sur intervention Reyes, Kowalski| |  +---------------------------------+     |
| ⏱ Audit|  | ⚪ 4-Adam-22   Pause            Fischer         | |  | 🟠 URGENTE (3)                   |     |
|        |  | ⚫ 4-Adam-05   Hors service     —               | |  |  #2026-0141 Accident · 1 unité   |     |
|        |  | … voir les 12 unités (→ Dispatch)              | |  |  #2026-0140 Trafic · 0 unité ⚠   |     |
|        |  +-----------------------------------------------+ |  |  #2026-0139 Alarme · 1 unité     |     |
|        |                                                    |  +---------------------------------+     |
|        |                                                    |  | 🟡 NORMALE (5)   🔵 FAIBLE (2)   |     |
|        |                                                    |  |  → voir la file complète (Dispatch)|   |
|        |                                                    |  +---------------------------------+     |
|        |  ------------------------------------------------------------------------------------------ |
|        |  ALERTES ET ÉLÉMENTS EN ATTENTE                                                              |
|        |  +--------------------------------+ +--------------------------------+ +-------------------+ |
|        |  | 📢 BOLO récents (4)             | | ⚖ Warrants en attente visa (2)| | 📄 Rapports en    | |
|        |  | Véhicule suspect braquage       | | Warrant #W-0031 — R. Fischer  | | attente (6)       | |
|        |  |  il y a 6 min · expire 66h      | |  demandé par Off. Costa       | | « Arrestation      | |
|        |  | Individu recherché, agression   | | Warrant #W-0030 — expiré      | |  #A-2210 » à       | |
|        |  |  il y a 41 min · expire 71h     | |  dans 2h sans visa ⚠          | | approuver           | |
|        |  |  → tous les BOLO                | |  → tous les warrants          | |  → tous les rapports| |
|        |  +--------------------------------+ +--------------------------------+ +-------------------+ |
+--------+-------------------------------------------------------------------------------------------+
```

- **Recherche globale toujours accessible**, identique à tous les écrans — pas un widget propre au dashboard (exigence explicite section 4).
- **Panneau « Unités en service ».** Puce de couleur = statut opérationnel configurable par organisme (`StatutOperationnel.couleur`) ; libellé = indicatif (`Unite.indicatif`) ; colonne de droite = membres de l'équipage (`UniteEquipier`). Liste tronquée avec lien « voir les N unités » vers l'écran Dispatch, qui reste la vue de travail complète.
- **Panneau « Dispatchs actifs par priorité ».** Groupé par `Dispatch.priorite`, trié priorité décroissante puis ancienneté. Chaque ligne affiche numéro, catégorie/titre court, lieu, nombre d'unités affectées et âge de l'intervention. Une intervention **critique** ou **urgente** sans unité affectée est signalée par un ⚠ orange pour attirer l'œil immédiatement — c'est le signal le plus important de l'écran. Clic sur une ligne → ouvre directement cette intervention dans l'écran Dispatch (pas un aperçu sur place, pour ne pas dupliquer l'écran de traitement).
- **Bandeau « Alertes et éléments en attente ».** Trois cartes : BOLO récents (les plus proches de l'expiration en premier), warrants en attente de visa (décision Q9/Q23 — approbation obligatoire), rapports en attente d'approbation (décision Q22). Chaque carte n'affiche que ce que l'utilisateur a le droit de voir : un agent sans permission « approuver un rapport » voit ses propres rapports « à corriger » à la place des rapports en attente d'approbation générale.
- **Indicateur de connexion temps réel** en haut à droite du contenu (🟢 EN LIGNE / 🟠 RECONNEXION...) reflétant l'état du canal Socket.IO, pour rendre visible une éventuelle coupure plutôt que de laisser un tableau silencieusement obsolète (cf. section 3.7 « reprise propre après déconnexion »).
- Le dashboard est **filtré à l'organisme actif** sélectionné en session ; changer d'organisme dans le bandeau recharge entièrement ce contenu.

---

## 3. Écran Dispatch

L'écran le plus critique du produit. Disposition en trois colonnes pour que la carte reste visible **sans devenir l'unique écran de travail** (exigence explicite section 3.6) : liste des interventions à gauche, détail de l'intervention sélectionnée au centre (la zone la plus large), carte SVG à droite dans un panneau rétractable mais jamais plein écran par défaut.

```
+--------------------------------------------------------------------------------------------------+
| [Logo] LSPD ▾   |  🔍 Recherche globale... (Ctrl+K)                          |  🔔 3   |  JD ▾    |
+--------+-------------------------------------------------------------------------------------------+
| ▣ Dash | INTERVENTIONS (11)      | DÉTAIL — #2026-0142                        | CARTE  [<< réduire]|
| ▤ Disp | [Filtrer ▾] [+ Créer]   |------------------------------------------- |--------------------|
| ▥ Carte|                         | 🔴 CRITIQUE · EN COURS      [Changer ▾]   |   ┌──────────────┐ |
| ▦ Rappo| 🔴 #2026-0142      4m   | Braquage en cours — Fleeca Bank            |   │  · quartiers │ |
| ▧ Regis|  Braquage · 2 unités    | 📍 Vinewood Blvd, angle 3e Rue              |   │   juridiction│ |
| ▨ Enqu |  ▸ SÉLECTIONNÉ          |                                             |   │  🔴 ▲ interv.│ |
| ▩ Recher|                        | Objectif de mission :                       |   │  🟢 ● unité  │ |
| ⚙ Organ| 🟠 #2026-0141      12m  | Encercler, sécuriser les otages,           |   │  🟡 ● unité  │ |
| ⏱ Audit| Accident · 1 unité      | attendre négociateur avant assaut.          |   │  🔵 ▲ interv.│ |
|        |                         |                                              |   │ [+ marqueur] │ |
|        | 🟠 #2026-0140      18m  | UNITÉS ENGAGÉES                             |   └──────────────┘ |
|        |  Trafic · 0 unité  ⚠   | 🟠 4-Adam-19  Sur intervention  [Retirer]  |  Calques ☑ Routes  |
|        |  [Assigner une unité]  | 🟢 4-Adam-12  En route          [Retirer]  |         ☑ Bâtiments|
|        |                         | [+ Assigner une unité]                     |         ☐ Patrouilles|
|        | 🟠 #2026-0139      25m  |                                             |  Filtre : ● En serv.|
|        |  Alarme · 1 unité       | FIL D'ACTIVITÉ                              |                     |
|        |                         | 14:28  Créé par dispatch — priorité CRITIQUE|                    |
|        | 🟡 #2026-0138      31m  | 14:29  4-Adam-19 affectée                   |                    |
|        |  Contrôle · 1 unité     | 14:31  4-Adam-19 : « Arrivée sur place »    |                    |
|        |                         | 14:32  4-Adam-12 affectée en renfort        |                    |
|        | … 6 autres               | [Ajouter un commentaire...............] [→]|                    |
|        |                         |                                             |                    |
|        |                         | [Changer priorité ▾] [Clôturer] [Annuler]  |                    |
+--------+-------------------------------------------------------------------------------------------+
```

- **Colonne « Interventions ».** Une carte par `Dispatch` non archivé, couleur de bordure = priorité (`Dispatch.priorite`), badge d'âge (temps écoulé depuis `createdAt`), nombre d'unités affectées (`DispatchAffectation`). Une intervention prioritaire sans unité assignée affiche un bouton d'action direct « Assigner une unité » et un ⚠, sans avoir besoin d'ouvrir le détail — l'objectif est de pouvoir traiter la file sans quitter la colonne des yeux. Filtrable par statut/priorité/catégorie/division ; bouton « + Créer » pour une création manuelle (section 3.7). Une intervention marquée `confidentiel = true` n'apparaît dans cette liste que pour les rôles autorisés — absente, pas verrouillée, pour ne pas révéler son existence.
- **Colonne centrale « Détail ».** En-tête avec priorité et statut actuels, changeables via menu déroulant (`DispatchStatut` : nouveau, en attente, attribué, en cours, attente de clôture, clôturé, annulé) — chaque changement génère un `DispatchEvenement` horodaté visible dans le fil ci-dessous, jamais un changement silencieux. Lieu (`Dispatch.lieu` + coordonnées), description et **objectif de mission** mis en avant textuellement (champ librement rédigé par le dispatch, visible de toutes les unités engagées). Bloc « Unités engagées » listant chaque `Unite` affectée avec son statut opérationnel courant et un bouton de retrait ; bouton « + Assigner une unité » ouvre une recherche rapide des unités disponibles/en patrouille, avec l'unité la plus proche (position SVG) suggérée en premier. **Fil d'activité horodaté** en lecture continue (création, affectation, changement de priorité, commentaires libres, arrivée, clôture — cf. `DispatchEvenement.type`), avec un champ de commentaire toujours accessible en bas pour ajouter une note sans changer d'écran. Actions de bas de panneau contextualisées à la permission de l'utilisateur (« prendre en charge », « clôturer », « rouvrir », « annuler »).
- **Colonne « Carte ».** Panneau **réductible** (bouton « << réduire » qui le ramène à une bande étroite avec juste une icône, jamais totalement supprimé de l'écran) pour libérer de l'espace ponctuellement sans jamais forcer un plein écran carte — c'est la traduction directe de l'exigence « la carte ne doit pas devenir le seul écran de travail ». Affiche les marqueurs d'unités en service et de l'intervention sélectionnée (mise en évidence), calques activables (routes, bâtiments, patrouilles, juridictions), filtre par défaut restreint aux unités en service et aux marqueurs saisis (décision Q19). Clic sur un marqueur unité ou intervention **synchronise la sélection** avec les colonnes de gauche/centre plutôt que d'ouvrir une fenêtre séparée. Bouton « + marqueur » pour poser un point d'intérêt manuel. Rôles non-dispatch : carte identique mais en lecture seule (pas de glisser-déposer de marqueurs), conformément à 3.6.
- **Temps réel.** Toute intervention créée, modifiée ou clôturée par un autre poste apparaît sans rechargement (salle Socket.IO par organisme/dispatch) ; une brève animation de surbrillance (pas de son ni de popup intrusif par défaut) signale une mise à jour arrivée pendant que l'utilisateur regarde ailleurs dans la liste.
- **Raccourcis clavier** dédiés au dispatch (section 4) : `j`/`k` pour naviguer dans la liste des interventions, `a` pour assigner l'unité de l'utilisateur courant, `c` pour ouvrir le sélecteur de statut, `Ctrl+Entrée` dans le champ de commentaire pour l'envoyer.

---

## 4. Écran Fiche personne

Fiche consultée depuis la recherche globale, un dispatch, un rapport ou une plaque scannée. Organisée en onglets pour séparer l'identité (peu sensible) du casier judiciaire (sensible, permission dédiée).

```
+--------------------------------------------------------------------------------------------------+
| [Logo] LSPD ▾   |  🔍 Recherche globale... (Ctrl+K)                          |  🔔 3   |  JD ▾    |
+--------+-------------------------------------------------------------------------------------------+
| ▣ Dash | ← Retour à la recherche                                                                   |
| ▤ Disp |                                                                                            |
| ▥ Carte| DUPONT, Michael                              🟠 RECHERCHÉ — niveau modéré   ⚖ Warrant actif|
| ▦ Rappo| Né le 14/03/1994 (32 ans) · 178 cm · Nationalité : Américaine                               |
| ▧ Regis| ID personnage FiveM : sync ✓ (lecture seule, source : framework serveur)                    |
| ▨ Enqu |------------------------------------------------------------------------------------------ |
| ▩ Recher| [ Identité ]  [ 🔒 Casier judiciaire ]  [ Véhicules & armes ]  [ Rapports & dossiers ]  [ Historique ] |
| ⚙ Organ|------------------------------------------------------------------------------------------ |
| ⏱ Audit| ONGLET ACTIF : CASIER JUDICIAIRE                                                             |
|        |                                                                                            |
|        | +----------------------------------------------------------------------------------+     |
|        | | Statut     | Date       | Qualification RP        | Peine        | Autorité RP     |     |
|        | |------------|------------|--------------------------|--------------|-----------------|     |
|        | | 🔴 EN COURS| 02/01/2026 | Vol à main armée         | 18 mois      | Tribunal LS #4  |     |
|        | |            |            | Source : Rapport #A-2198 · Warrant #W-0025 → voir            |     |
|        | |------------|------------|--------------------------|--------------|-----------------|     |
|        | | 🟡 GRACIÉE | 11/06/2024 | Détention d'arme illégale| Amende 2500$ | Tribunal LS #2  |     |
|        | |            |            | Grâce accordée le 01/02/2025 — motif : « bonne conduite »    |     |
|        | |            |            | par Cmdt. Reyes → voir l'historique complet                  |     |
|        | |------------|------------|--------------------------|--------------|-----------------|     |
|        | | ⚪ PURGÉE  | 20/11/2022 | Conduite en état d'ivresse| 6 mois       | Tribunal LS #1  |     |
|        | +----------------------------------------------------------------------------------+     |
|        |                                                                                            |
|        | Vous consultez ce casier avec la permission « casier.consulter ».                          |
|        | [Ajouter une entrée manuelle] (nécessite « casier.gerer »)                                  |
+--------+-------------------------------------------------------------------------------------------+
```

**Onglet Identité** (accès par défaut, peu sensible) :
- Champs obligatoires v1 (décision Q24, `Personne`) : nom, prénom, date de naissance, taille, nationalité — affichés en lecture seule avec un badge « sync ✓ » car ils proviennent du framework FiveM à la connexion (section 3.8) ; un agent ne peut pas les modifier depuis le panel, seulement consulter un historique de synchronisation en cas d'écart signalé.
- Champs personnalisés (`champsPerso`) affichés sous les champs de base, selon la configuration du client (ex. adresse, groupe sanguin, particularités), modifiables si l'utilisateur porte la permission adéquate.
- Bandeau d'état en tête de fiche : badges « 🟠 RECHERCHÉ » (`PersonneRecherchee.statut = ACTIVE`) et « ⚖ Warrant actif » (`Warrant.statut = APPROUVE`) visibles immédiatement sans ouvrir d'onglet, car ce sont des signaux de sécurité pour l'agent qui consulte la fiche sur le terrain.

**Onglet Casier judiciaire** (icône 🔒 dans l'onglet même quand l'accès est autorisé, pour rappeler la sensibilité) :
- Si l'utilisateur ne porte pas la permission « casier.consulter » (décision Q33), l'onglet reste visible mais son contenu est remplacé par un message centré : « 🔒 Section réservée — permission « Consulter le casier judiciaire » requise. Contactez un responsable habilité si l'accès est nécessaire à votre mission. » L'existence de l'onglet n'est pas cachée (elle indique juste qu'un casier peut exister), contrairement à un dispatch confidentiel qui doit rester invisible.
- Une entrée par ligne (`CasierJudiciaireEntree`) : statut avec code couleur dédié (🔴 en cours, 🟡 graciée, 🟠 amnistiée, ⚪ purgée — jamais un simple texte, pour un repérage rapide), qualification RP, peine, date, autorité RP, et un lien vers la source (`sourceRapportId`/`sourceWarrantId`/`sourceEnqueteId`). Aucune ligne n'a de bouton « Supprimer » — conformément à la décision Q35, seul un changement de statut avec motif obligatoire est possible, via une action « Modifier le statut » réservée à la permission « casier.gerer », qui ouvre un formulaire (nouveau statut + motif + confirmation), jamais une édition libre du texte de la peine.
- Bouton « Ajouter une entrée manuelle » visible mais désactivé/tooltip si la permission manque — la génération automatique depuis un rapport/jugement approuvé reste le chemin par défaut (décision Q34).

**Onglet Véhicules & armes** :
- Deux sous-listes : `VehiculeCivil` et `ArmeCivile` liés par `proprietaireId`. Chaque ligne affiche les champs obligatoires (plaque/modèle/couleur/statut pour un véhicule ; numéro de série/modèle/statut pour une arme), avec badge de statut (🟢 en circulation, 🟠 saisi, ⚫ détruit).

**Onglet Rapports & dossiers liés** :
- Liste des `RapportLien` et affectations d'`Enquete` pointant vers cette personne, triée par date, avec statut du rapport (brouillon/soumis/à corriger/approuvé/archivé) et lien direct vers le rapport ou le dossier — sous réserve des permissions de lecture propres à chaque rapport/dossier (un dossier confidentiel hors périmètre de l'utilisateur n'apparaît pas dans cette liste).

**Onglet Historique** :
- Journal en lecture seule des modifications de la fiche (champs personnalisés, rattachements) issu de `JournalAudit`, non modifiable depuis l'écran — reflète l'exigence d'audit append-only de la section 4.

---

## 5. Écran Rapport (création / édition)

Formulaire structuré en deux colonnes : le formulaire à gauche (zone principale), une colonne latérale droite pour le statut de workflow, les liens et les pièces jointes — pour que ces éléments transverses restent visibles sans scroller pendant la saisie.

```
+--------------------------------------------------------------------------------------------------+
| [Logo] LSPD ▾   |  🔍 Recherche globale... (Ctrl+K)                          |  🔔 3   |  JD ▾    |
+--------+-------------------------------------------------------------------------------------------+
| ▣ Dash | ← Rapports                                          Rapport #A-2211  ·  🟡 BROUILLON      |
| ▤ Disp |------------------------------------------------------------------------------------------ |
| ▥ Carte| Brouillon ──● Soumis ──○ À corriger ──○ Approuvé ──○ Archivé                                |
| ▦ Rappo|------------------------------------------------------------------------------------------ |
| ▧ Regis| Titre du rapport                                        |  STATUT & WORKFLOW               |
| ▨ Enqu | [ Interpellation — vol à main armée, Vinewood Blvd    ] |  Auteur : Off. J. Dupont          |
| ▩ Recher|                                                        |  Créé le 11/08/2026 14:40          |
| ⚙ Organ| Catégorie                    Sous-catégorie              |  Relecteur : —                    |
| ⏱ Audit| [ Arrestation          ▾ ]   [ Vol à main armée      ▾ ]|  Historique : v1 (courante)       |
|        |                                                          |  [Enregistrer brouillon]           |
|        | Personne(s) interpellée(s) *                            |  [Soumettre pour approbation]      |
|        | [ 🔍 Rechercher une personne...                       ] |                                    |
|        | · Dupont, Michael  [détacher]                            |------------------------------------ |
|        |                                                          |  LIENS                              |
|        | Résumé des faits *                                      |  👤 Personnes (1)                  |
|        | [ Zone de texte multi-lignes......................... ] |    Dupont, Michael                 |
|        | [ ..................................................... ]|  🚗 Véhicules (1)                  |
|        |                                                          |    AB-123-CD — Sultan gris         |
|        | Usage de la force ?  ( ) Oui  (●) Non                    |  🔫 Armes (0)                      |
|        | Champ personnalisé — Zone du secteur                     |  📁 Dossier lié (0)                |
|        | [ Secteur 4 — Vinewood            ▾ ]                    |  🚓 Dispatch d'origine             |
|        |                                                          |    #2026-0142                      |
|        | Champ personnalisé — Blessures constatées                |    [+ Ajouter un lien]             |
|        | [ ] Non   [ ] Légères   [ ] Graves                        |------------------------------------ |
|        |                                                          |  PIÈCES JOINTES (2/10)              |
|        |                                                          |  📷 photo_scene.jpg   2,1 Mo        |
|        |                                                          |  📄 pv_signe.pdf      640 Ko        |
|        |                                                          |  [ Glisser un fichier ou parcourir ]|
|        |                                                          |  jpg · png · webp · pdf, 10 Mo max  |
+--------+-------------------------------------------------------------------------------------------+
```

- **Bandeau de statut de workflow** en haut, sous forme de jalons (« stepper ») Brouillon → Soumis → À corriger (bifurcation possible) → Approuvé → Archivé, reflétant `RapportStatut`. Le jalon courant est toujours visible même en scrollant le formulaire (bandeau collant), pour qu'on ne perde jamais de vue l'état du document en le remplissant.
- **Catégorie / sous-catégorie** en menus déroulants dépendants (`CategorieRapport`), qui déterminent dynamiquement les champs obligatoires et personnalisés affichés en dessous (`ModeleRapport.champsConfig`). Changer de catégorie après un début de saisie déclenche une confirmation pour ne pas perdre silencieusement des champs déjà remplis.
- **Champs obligatoires** marqués d'un `*`, validés avant de permettre la soumission (pas seulement au chargement) — un résumé des champs manquants apparaît au clic sur « Soumettre » si la validation échoue, avec un lien direct vers chaque champ en défaut.
- **Champs personnalisés typés** rendus selon leur type déclaré dans `champsConfig` (texte court, zone de texte, nombre, date, liste déroulante, case à cocher, choix unique) — le formulaire ne code jamais ces champs en dur, il les génère depuis la configuration, conformément à la section 3.4.
- **Zone de liens**, colonne latérale : widget de recherche rapide par type de cible (personne, véhicule, arme, dossier, unité, dispatch) qui crée un `RapportLien` polymorphe ; chaque lien affiché est cliquable vers la fiche correspondante. Le dispatch d'origine, s'il existe, est pré-rempli automatiquement quand le rapport est créé depuis l'écran Dispatch.
- **Zone de pièces jointes**, colonne latérale : zone de glisser-déposer, compteur « 2/10 », types acceptés et taille max rappelés explicitement à l'écran (jpg/png/webp/pdf, 10 Mo/fichier, 10 fichiers max — décision Q25). Chaque fichier affiche un état d'upload (progression, puis coche verte ou erreur explicite si le type MIME réel ne correspond pas à l'extension). Aucun aperçu d'URL publique : les liens de téléchargement sont signés et temporaires.
- **Actions contextualisées au statut et à la permission** : un auteur voit « Enregistrer brouillon » et « Soumettre » sur un brouillon, « Corriger et resoumettre » sur un rapport « à corriger » ; un superviseur habilité voit en plus « Approuver », « Renvoyer à corriger » (avec commentaire obligatoire), « Archiver », « Rouvrir » sur un rapport archivé (décision Q22). Le bouton « Exporter en PDF » n'apparaît que pour les porteurs de la permission « exporter » (décision Q26), et applique le gabarit d'impression configuré par l'organisme.
- **Commentaires internes et historique de versions** accessibles via un onglet secondaire « Discussion (3) » sous le titre — séparés du contenu du rapport pour ne pas polluer le document final imprimable.

---

## 6. Écran Organisation / permissions

Écran d'administration d'un organisme, réservé aux porteurs de permissions d'administration. Structuré en sous-onglets pour séparer la structure (divisions/grades), les droits (rôles/matrice de permissions) et les personnes (membres/affectations), qui n'ont pas le même rythme de modification.

```
+--------------------------------------------------------------------------------------------------+
| [Logo] LSPD ▾   |  🔍 Recherche globale... (Ctrl+K)                          |  🔔 3   |  JD ▾    |
+--------+-------------------------------------------------------------------------------------------+
| ▣ Dash | Organisation — LSPD                                                                        |
| ▤ Disp |------------------------------------------------------------------------------------------ |
| ▥ Carte| [ Divisions ]  [ Grades ]  [ Rôles & permissions ]  [ Membres ]                              |
| ▦ Rappo|------------------------------------------------------------------------------------------ |
| ▧ Regis| ONGLET ACTIF : RÔLES & PERMISSIONS                                                          |
| ▨ Enqu |                                                                                            |
| ▩ Recher| Rôle sélectionné : [ Enquêteur          ▾ ]   [+ Nouveau rôle]   [Dupliquer] [Renommer]    |
| ⚙ Organ|                                                                                            |
| ⏱ Audit| Permission                              | Aucune | Soi | Division | Organisme | Tenant       |
|        |------------------------------------------|--------|-----|----------|-----------|--------------|
|        | RAPPORTS                                                                                    |
|        |  Lire un rapport                         |   ( )  | ( ) |   (●)    |    ( )    |    ( )       |
|        |  Créer / soumettre un rapport             |   ( )  | (●) |   ( )    |    ( )    |    ( )       |
|        |  Approuver / archiver un rapport          |   (●)  | ( ) |   ( )    |    ( )    |    ( )       |
|        | CASIER JUDICIAIRE                                                                           |
|        |  Consulter le casier judiciaire           |   ( )  | ( ) |   (●)    |    ( )    |    ( )       |
|        |  Gérer le casier judiciaire (statut)      |   (●)  | ( ) |   ( )    |    ( )    |    ( )       |
|        | WARRANTS / BOLO                                                                             |
|        |  Créer un warrant                         |   ( )  | ( ) |   (●)    |    ( )    |    ( )       |
|        |  Approuver un warrant (visa)               |   (●)  | ( ) |   ( )    |    ( )    |    ( )       |
|        | DISPATCH                                                                                    |
|        |  Créer / prendre en charge un dispatch    |   ( )  | ( ) |   ( )    |    (●)    |    ( )       |
|        |  Consulter un dispatch confidentiel        |   (●)  | ( ) |   ( )    |    ( )    |    ( )       |
|        | ADMINISTRATION                                                                              |
|        |  Gérer les membres, grades, spécialités    |   (●)  | ( ) |   ( )    |    ( )    |    ( )       |
|        |  Exporter des données                      |   (●)  | ( ) |   ( )    |    ( )    |    ( )       |
|        |                                                                                            |
|        | 12 permissions modifiées — [Annuler] [Enregistrer]      🔒 MFA requis pour ce rôle (auto)   |
+--------+-------------------------------------------------------------------------------------------+
```

- **Sous-onglet Divisions.** Arborescence des `Division` de l'organisme (hiérarchie via `parentId` — ex. LSPD > CID > Gang Task Force), avec création/renommage/archivage inline et compteur de membres par division.
- **Sous-onglet Grades.** Liste ordonnée des `Grade` (niveau, nom, icône), réordonnable par glisser-déposer (`niveau`). Un rappel textuel permanent en tête d'onglet : « Les grades sont purement hiérarchiques et visuels — ils ne donnent aucune permission automatique (voir l'onglet Rôles). », pour rendre visible la décision Q8 et éviter la confusion la plus fréquente chez les administrateurs client.
- **Sous-onglet Rôles & permissions — la matrice.** Sélecteur de rôle en tête (les rôles système comme « Superviseur » ou « Direction » sont marqués et partiellement verrouillés pour éviter qu'un client se retire accidentellement tout accès admin). La matrice liste les permissions atomiques groupées par domaine fonctionnel (Rapports, Casier judiciaire, Warrants/BOLO, Dispatch, Administration, etc. — cf. `Permission.categorie`), une ligne par permission. Chaque ligne est un **groupe de boutons radio exclusifs** représentant la portée effective (`PermissionScope` : Aucune, Soi, Division, Organisme, Tenant) plutôt que de simples cases à cocher indépendantes — une permission n'a qu'une seule portée active à la fois pour un rôle donné, ce qui colle exactement au modèle `RolePermission(roleId, permissionId, scope)` et évite l'ambiguïté « coché sur deux portées à la fois ». Les permissions les plus sensibles (approbation de warrant, gestion du casier, export, administration) affichent un badge « 🔒 MFA requis » car leur attribution active automatiquement `mfaRequired` pour les membres du rôle (décision Q10) — information proactive plutôt que découverte plus tard à la connexion. Barre d'action en bas fixe avec compteur de changements non enregistrés, pour permettre de réviser plusieurs permissions avant de valider en un seul appel API auditable.
- **Sous-onglet Membres.** Table des membres de l'organisme avec grade, indicatif, matricule et **toutes leurs affectations actives**, y compris celles portant sur d'autres organismes du même tenant (rendu visible car un membre peut appartenir à plusieurs organismes/divisions à la fois, décision Q7) :

```
  +------------------------------------------------------------------------------------------------+
  | Membre           | Affectation LSPD (courante)         | Autres affectations (tenant)           |
  |-------------------|--------------------------------------|-----------------------------------------|
  | Dupont, Jean      | Officier II · Patrouille · 4-Adam-12 | USMS — Deputy · Fugitive Task Force     |
  | Costa, Ana        | Sergent · CID · Matricule 0231       | —                                        |
  | Fischer, R.       | Cadet · Aucune division              | SAHP — Trooper (en attente d'activation) |
  +------------------------------------------------------------------------------------------------+
  [+ Ajouter un membre]   Clic sur une ligne → panneau détail : grade, rôle, matricule, indicatif,
  dates d'affectation, statut (active/suspendue/archivée), et bouton « + Nouvelle affectation »
  pour rattacher ce membre à une division ou un autre organisme du même tenant.
```

  Le panneau détail d'un membre (ouvert au clic) reprend le même principe de carte que l'écran de sélection d'organisme actif (section 1.b) : une carte par `Affectation`, avec possibilité de suspendre, réactiver ou archiver chacune indépendamment, sans jamais affecter les autres organismes auxquels appartient le membre.
- **Historique.** Chaque sous-onglet a un lien discret « Voir l'historique » qui ouvre un panneau listant les changements de rôle/grade/division/permission de l'organisme, filtrable par membre ou par date, sourcé sur `JournalAudit` — c'est la même donnée que le module Journal d'audit global, présentée ici filtrée au contexte courant pour éviter à l'administrateur de changer d'écran.
