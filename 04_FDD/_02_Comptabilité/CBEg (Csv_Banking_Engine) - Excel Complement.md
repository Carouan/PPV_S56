
# 🧾 CSV_Banking_Engine - Projet Excel VBA

## 🧠 Objectif du projet

Automatiser le traitement de relevés bancaires exportés en CSV pour : 
- particulier
	OU
- ASBL

En réalisant : 

- nettoyant
- catégorisant
- formatant
- enregistrant les logs d'exécution.

## 🔄 Workflow global

1. **Nettoyage du CSV**
2. **Extraction des descriptions**
3. **Complétion des catégories**
4. **Formattage final**
5. **Gestion des logs** et visualisation dans `CBE_Logs`

## 🧩 Composants du projet

### 📄 Modules standard

- `modMain.bas` : point d’entrée principal `CSV_Banking_Engine`
- `modLogs.bas` : gestion des logs `LogEtape`, `MarquerEtapeLog`, etc.
- `modFormats.bas` : fonctions d’aide pour `FindCol`, formattage montant/date

### 🧾 Feuilles Excel

- `Feuil1` : Données CSV à traiter
- `CBE_Logs` : Historique des traitements

### 📦 Formulaires utilisateur

- `frmProgress` : barre de progression visuelle
- `frmCategorieInconnue` : saisie manuelle des catégories manquantes

## 🛡️ Robustesse et erreurs

- Gestion par `On Error GoTo` pour chaque étape
- Logs d’échec/validation par étape
- Reprise possible après plantage

## 🔍 Points forts

- Modularité claire par étape
- Intégration d’un système de log lisible
- Interface utilisateur minimale mais fonctionnelle

## 📌 À venir (roadmap)

- Refactorisation orientée objet via `Class Modules`
- Génération automatique des tests unitaires Rubberduck
- Interface admin (formulaire récapitulatif)




