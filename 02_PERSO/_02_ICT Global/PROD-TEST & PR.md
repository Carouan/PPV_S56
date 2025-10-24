---
aliases:
  - PROD/TEST & PR
---


Travailler avec des **Pull Requests** (PR) et des environnements **TEST**/**PROD** est une excellente pratique pour séparer les développements expérimentaux du code stable. Voici un petit résumé conceptuel et pratique pour mettre tout ça en place proprement :

---

## 1) Le rôle des branches et des Pull Requests dans GitHub

1. **Branch principale (main)**
    
    - C’est généralement la branche “officielle” de ton projet, la plus stable.
    - Sur certains projets, on l’appelle “master” ou “main”.
    - Son déploiement correspondra à l’environnement **PROD** (production) dans Railway.
2. **Branches de fonctionnalité (feature branches)**
    
    - Pour chaque nouvelle fonctionnalité ou correctif, tu crées une **branche dédiée** à partir de `main`.
    - Tu codes tes modifications dessus.
3. **Création de Pull Request (PR)**
    
    - Quand ta fonctionnalité est prête ou suffisamment avancée, tu ouvres une PR pour **demander la fusion** (_merge_) de cette branche vers `main`.
    - La PR permet aussi de solliciter des retours (review) ou exécuter des tests automatiques (CI/CD).
4. **Validation & Merge**
    
    - Si tout est validé, on **merge** la PR dans `main`.
    - À ce moment-là, le code de `main` s’enrichit de tes dernières modifications, et ça peut déclencher le déploiement en PROD si tu l’as configuré ainsi.

---

## 2) Les environnements TEST et PROD sur Railway

### a) Pourquoi 2 environnements ?

- **TEST** (ou “Staging” / “Préproduction”) :
    
    - Permet de déployer et tester les branches ou PR dans un cadre isolé.
    - Tu peux valider que tout fonctionne (variables d’environnement, logs, etc.) sans impacter les utilisateurs réels.
- **PROD** :
    
    - L’environnement “officiel” utilisé par le bot en conditions réelles.
    - C’est celui qui tourne en continu (24/7) et qui ne doit pas être “cassé” par des expérimentations inachevées.

### b) Comment configurer ça dans Railway ?

1. Dans Railway, tu peux créer plusieurs **Services** (ou plusieurs **environnements** dans un même projet).
2. Tu assignes la branche `main` à l’environnement **PROD**.
3. Tu actives la création d’un **PR environment** automatique lorsqu’il y a une PR sur GitHub.
    - Railway va détecter la PR et déployer le code de cette PR dans l’environnement de test.
    - Ainsi, tu peux voir si le bot tourne bien, si les logs sont corrects, etc., **sans** toucher l’environnement PROD.

_(À la fermeture ou au merge de la PR, l’environnement de test associé est automatiquement supprimé.)_

---

## 3) Le workflow logique

1. **Création d’une branche “feature/accès-message-discord”**
    
    - Tu fais tes modifications (intent `message_content`, etc.) dans cette branche.
    - Tu pousses cette branche sur GitHub.
2. **Automatisation du déploiement sur TEST**
    
    - Dès que tu ouvres une PR, Railway crée un environnement TEST (ou “PR environment”) qui récupère ton code.
    - Tu peux monitorer les logs : la compilation, le démarrage du bot, voir si les modifications fonctionnent.
3. **Validation**
    
    - Tu testes que tout marche bien dans l’environnement TEST.
    - Si c’est bon, tu acceptes (merge) ta PR dans `main`.
4. **Déploiement en PROD**
    
    - Dès que la PR est mergée dans `main`, Railway redéploie automatiquement l’environnement PROD avec le nouveau code (sauf si tu as une configuration manuelle).
    - Ton bot en production est alors à jour.
5. **Nettoyage**
    
    - La branche feature peut être supprimée si tu n’en as plus besoin.
    - L’environnement PR disparaît aussi (ou reste inactif) selon ta config Railway.

---

## 4) Comment “passer” de TEST à PROD ?

Dans un **workflow standard** :

1. Tu merges la PR dans la branche `main` après validation.
2. L’environnement **PROD** se met à jour automatiquement (pull du code de la branche `main`).

Si tu veux plus de contrôle, tu peux :

- **Désactiver le déploiement auto** de `main` et déclencher manuellement le déploiement (bouton “Deploy” dans l’interface Railway).
- Cela te permet de dire “OK, c’est prêt, je lance maintenant la mise en production.”

---

## 5) Points de vigilance

- **Variables d’environnement** : Assure-toi de définir des valeurs éventuellement différentes entre TEST et PROD (ex. : `DISCORD_TOKEN_TEST` vs `DISCORD_TOKEN`).
- **Permissions du bot** : S’il s’agit d’un **même** bot dans Discord, attention à ne pas faire tourner en même temps 2 instances du bot (avec le **même** token) sur TEST et PROD.
    - Tu peux créer un bot Discord distinct pour l’environnement TEST, ou alors ne pas le faire tourner 24/7 mais juste le temps de vérifier que ça démarre.
- **Numéro de version** (optionnel) : Dans de gros projets, tu peux versionner de manière plus explicite (Release tags, etc.), mais ce n’est pas strictement nécessaire au stade actuel.

---

### En résumé

1. **Branches / PR** :
    
    - Crée une branche pour tes changements, ouvre une PR, teste dans l’environnement Railway correspondant, puis merge si tout est bon.
2. **Environnements Railway** :
    
    - Un environnement PROD (pointé sur la branche main)
    - Des environnements TEST automatiques par PR.
3. **Déploiement** :
    
    - Merge la PR → déploiement auto en PROD (ou manuel, selon tes paramètres).

C’est la façon la plus “logique métier” de valider en TEST avant de pousser en PROD. Tu gardes ainsi un bot stable en PROD et peux expérimenter tranquillement dans des branches sans casser quoi que ce soit pour les utilisateurs finaux.
