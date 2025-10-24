# Plan de Refactorisation

## Objectifs
- Factoriser la fonction principale `CSV_Banking_Engine`
- Centraliser les constantes et les variables globales
- Extraire la gestion des erreurs dans un gestionnaire unique
- Uniformiser les noms des modules et des fonctions
- Optimiser le chargement des dictionnaires (éventuellement via classe)

## Étapes
1. Créer un module `modConstantes` pour stocker les étapes, noms de colonnes, noms de feuilles
2. Extraire chaque étape (Nettoyage, Extraction, Catégorisation, etc.) dans une fonction `ExecuterEtape`
3. Uniformiser les noms des fonctions (verbes à l'infinitif en PascalCase)
4. Éventuellement transformer certains modules en classes (Logs, Dico)
