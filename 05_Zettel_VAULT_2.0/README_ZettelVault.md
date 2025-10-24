# 🧠 ZettelVault 2.0 — README & Configuration

Bienvenue dans votre système de gestion de fiches de connaissances basé sur Obsidian, Zettelkasten, Templater, et GPT.

---

## 🎯 Objectifs

- Traiter automatiquement vos fichiers d’import (`.json`)
- Générer des fiches Zettelkasten bien structurées
- Classer les fiches par catégorie
- Incrémenter les compteurs et mettre à jour le README
- Maintenir une logique modulaire, claire et durable

---

## 🛠 Lancer le traitement

**Cliquez sur ce bouton pour lancer l’analyse des fichiers dans `/0_import/`** :

```templater
<%* await tp.user.lancerTraitement() %>
```

---

## 📈 2. Évolution (compteurs)

- Fichiers traités : $ft$
- Fiches générées : $fg$
- Tags utilisés : $ut$

---

## ⚙️ 3. Paramètres de configuration

### 3.1. Templates

#### Titre brut
`Fiches brutes du fichier du yyyy.mm.dd`

#### Fiche Zettelkasten

```
---
## 📌 yyyy.mm.dd_Titre de la fiche
tags: #question #css #framework  
date: yyyy.mm.dd

### ❓ Question
...

### ✅ Réponse / Contenu
...

---
```

---

### 3.2. Liste des catégories

| Catégorie            | Tag associé | Fichier `.md` cible     |
|----------------------|-------------|--------------------------|
| Questions / Réponses | `#qr`       | `q_r.md`                 |
| Idée                 | `#idée`     | `idées.md`               |
| Projet               | `#projet`   | `projets.md`             |
| Réflexion            | `#réflexion`| `réflexions.md`          |
| Astuce               | `#astuce`   | `trucs.md`               |

---

### 3.3. Liste des tags

- `#qr`
- `#idée`
- `#projet`
- `#réflexion`
- `#astuce`

---

### 3.4. Chemins et structure

- Vault principal : `/ZettelVault_2.0/`
  - Importation : `/0_import/`
  - Bruts : `/1_bruts/`
  - Catégories : `/2_Catégories/`
  - README : `/README.md`

---

<!-- CONFIG_START -->
{
  "vault_path": "./ZettelVault_2.0/",
  "import_path": "./ZettelVault_2.0/0_import/",
  "bruts_path": "./ZettelVault_2.0/1_bruts/",
  "categories_path": "./ZettelVault_2.0/2_Catégories/",
  "categories": {
    "qr": {
      "tag": "#qr",
      "file": "q_r.md"
    },
    "idée": {
      "tag": "#idée",
      "file": "idées.md"
    },
    "projet": {
      "tag": "#projet",
      "file": "projets.md"
    },
    "réflexion": {
      "tag": "#réflexion",
      "file": "réflexions.md"
    },
    "astuce": {
      "tag": "#astuce",
      "file": "trucs.md"
    }
  },
  "counter": {
    "fichiers_traite": 0,
    "fiches_generees": 0,
    "tags_utilises": 0
  }
}
<!-- CONFIG_END -->