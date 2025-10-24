


### A mettre dans complément Excel

Obtenir le chemin complet de la feuille en cours : =CELLULE("nomfichier")
	Exemple :   H:\Drive partagés\FDDasbl\COM-05_Trésorerie\5. A valider\[2025.xlsx]export_Mastercard Business Blue

Obtenir le chemin complet de la feuille en cours sans le nom de la feuille ni du classeur : 
= GAUCHE(CELLULE("nomfichier");TROUVE("[";CELLULE("nomfichier"))-1)|
	Exemple : H:\Drive partagés\FDDasbl\COM-05_Trésorerie\5. A valider\

