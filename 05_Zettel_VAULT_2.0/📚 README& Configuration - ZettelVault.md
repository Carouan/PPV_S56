
***
### 🎯 Objectif de ce fichier :

1. 🚀 **1. Fonctionnalités et Instructions** 
2. 📈 **2. Evolution** (compteurs de : fiches, tags,...)
3. ⚙️ **3. Paramètres de configuration**
	1. Templates
		1. Titre_Brut
		2. Fiche
	2. Liste des catégories
	3. Liste des tags
	4. Chemins utilisés et liens vers notes Obsidian
---

##  🚀1. Fonctionnalités et Instructions

### Fonctionnalités

Le but est de créer un système 🧠 Zettelkasten 2.0.

Permettant à l'utilisateur de simplement déposer ses diverses notes et ou conversations qui seront analysées, découpées et triées selon des critères choisis.
Ce script transforme un fichier (`.json` ou `.txt`) en fiches Zettelkasten au format Markdown.
Ces opérations seront réalisées par un script en langage Python (ou peut-être Templater si possible) et avec l'aide d'un LLM.

Ce fichier sert à la fois de présentation de l'outil, de son fonctionnement et de ses options de configuration.
Vous pouvez modifier les catégories ou les chemins dans ce fichier directement

### Instructions et Etapes :

	1. Placez votre fichier `.json` dans le dossier `./import/`.
	2. Détection d'un nouveau fichier -> Lancez le script : `python fiche2md.py`.
	3. Création du fichier markdown brut (format titre = 3.1.1).
	4. Découpe manuelle ((automatique en V2) de fichiers, textes et conversations en fiches, selon le template du point 3.1.2.
	5. Coupe/Colle chaque fiches à la fin de la note de Catégorie correspondante.


## 📈 **2. Evolution**

	### 🔢 Compteurs

	- Fichiers traités : $ft$
	- Fiches générées : `$fg$`
	- Tags utilisés : `$ut$`

		(parenthèse à supprimer quand variables correctement implémentées
			$ft$ = nombre de fichiers traités | $fg$ = nombre de fiches générées | $tg$ = nombre de tags utilisés
		)

## ⚙️ **3. Paramètres de configuration**

	3.1. Templates
		3.1.1. Titre_brut
			Fiches brutes du fichier du yyyy.mm.dd

		3.1.2. Fiche ZT
		""---
		## 📌 yy.mm.dd_Titre de la fiche
		tags: #question #css #framework  
		date: yyyy.mm.dd
		
		### ❓ Question
		...
		
		### ✅ Réponse / Contenu
		...
		
		---""

	3.2. Liste des catégories

	### 🏷️ Catégories de fiches
	
	| Catégorie            | Tag associé  | Fichier `.md` cible |
	| -------------------- | ------------ | ------------------- |
	| Questions / Réponses | `#qr         | `q_r.md`            |
	| Idée                 | `#idée`      | `idées.md`          |
	| Projet               | `#projet`    | `projets.md`        |
	| Réflexion            | `#réflexion` | `réflexions.md`     |
	| Astuce               | `#astuce`    | `trucs.md`          |
	
	

	3.3. Liste des tags
			taglist = {tag1, tag2, tag3, tag4}


	3.4. Chemins utilisés et liens vers notes Obsidian

	### 📂 Dossiers :
	- Vault Obsidian : ./../$this_folder$/
		- ZettelVault_2.0 = $this_folder$
			- Importation : $this_folder$/0_import/
			- Notes markdown brut par date avant découpes et répartition des fiches dans chaque catégories = $this_folder$/1_bruts/
			- Catégories = $this_folder$/2_Catégories/



