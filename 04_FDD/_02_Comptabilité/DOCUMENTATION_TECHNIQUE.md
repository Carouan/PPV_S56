# Documentation Technique

## Variables globales
- `Etape` (Enum) : suit les différentes étapes du workflow
- `EtapesOK() As Boolean` : tableau de suivi

## Fonctions clés

### CSV_Banking_Engine(ws As Worksheet)
- Point d'entrée principal
- Affiche la ProgressBar, appelle les 4 étapes, log les statuts

### Nettoyage_CSV(ws)
- Supprime lignes vides
- Convertit les montants
- Supprime les caractères parasites

### CompleterColonnes(ws)
- Extrait des infos depuis la description
- Ajoute colonnes manquantes

### CompleterCategories(ws)
- Tente de catégoriser automatiquement
- Appelle `frmCategorieInconnue` si besoin

### Formattage_Final(ws)
- Formate les colonnes "Montant", "Date"
- Ajuste la largeur et le style

### FindCol(ws, colName)
- Recherche la colonne contenant un nom
- Retourne son index

## Dépendances
- `modUtils` dépend de rien
- `modMain` dépend de tous les autres
- `frmCategorieInconnue` dépend de `modDictionnaires`
