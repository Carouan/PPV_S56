#### Objectif initial

Créer une feuille de génération automatique de combinaisons de paiements (`GénérationPaiementAuto`) selon des paramètres définis dans une autre feuille (ou colonne), avec mise en forme propre.

#### 🧠 Problématiques rencontrées

- **Instabilité de VBA** : après un plantage d'Excel, tous les modules ont disparu malgré les sauvegardes.
    
- **Manque de robustesse** : pas de versioning natif, modules volatils, risques importants de perte de travail.
    
- **Multiplication des feuilles** : complexité croissante, doublons (`Simulation`, `SimulationMultiple`, `Paiements`, etc.)
    
- **Mise en forme imparfaite** des résultats générés automatiquement.
    
- **Confusion sur les paramètres** : zone des paramètres mal définie (ex. : cellule Q1/Q2, ligne 5 utilisée sans explication claire).
    

#### 🔁 Évolutions proposées

- **Fusion des feuilles** `Simulation` et `SimulationMultiple`.
    
- **Renommer** la feuille `PaiementAuto` en `GénérationPaiementAuto`.
    
- Utiliser une **seule feuille avec paramètres à droite du tableau** (ex : colonne `P`).
    
- Ajouter un code VBA pour :
    
    - Centrer les cellules.
        
    - Ajuster automatiquement la largeur.
        
    - Formater les pourcentages et montants.
        

#### ⚠️ Constat

> VBA est **trop instable pour des projets critiques**. La perte de code suite à une panne rend son usage dangereux pour des outils métiers sérieux (même avec sauvegarde régulière).



---

Ressources : #ressources 

https://rubberduckvba.com/features : modern-day IDE features to _bring the VBE into this century_

