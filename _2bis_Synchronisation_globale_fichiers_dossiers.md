---
title: "Synchronisation globale de fichiers & dossiers (PC, Android, Google Drive, GitHub)"
tags: [syncthing, rclone, robocopy, freefilesync, git, github, google-drive, android, windows]
created: 2025-10-21
---

# 🎯 Objectif
Fournir une **fiche synthétique** des outils et méthodes pour **synchroniser finement** tes dossiers entre **laptop Windows**, **smartphone Android (S23)**, **Google Drive**, et **GitHub**, **au‑delà** d’un seul Vault Obsidian — tout en gardant un lien clair avec la fiche _Obsidian → GitHub_.

---

# 🧰 Outils — Qui fait quoi ?

| Outil | Rôle principal | Points forts | Limites / Remarques |
|---|---|---|---|
| **Syncthing** | Sync **P2P** appareil↔appareil (PC ⇄ Android ⇄ autre machine) | Temps réel, chiffré, réglage par **folder** (Send/Receive, versioning, ignores), **GUI** web | Pas un “cloud” ; éviter de partager *le même chemin* que Drive. |
| **rclone** | Sync **local↔cloud** (Google Drive & co.), **local↔local** | Très rapide et scriptable, **filtres puissants**, peut avoir **GUI** (`rclone rcd --rc-web-gui`) | Job “batch” (pas temps réel). Bien pour miroirs planifiés. |
| **Robocopy** (Windows) | **Local↔local** unidirectionnel | Natif, fiable, rapide (`/MIR`) | Pas de GUI ; prudence avec `/MIR` (supprime ce qui a disparu en source). |
| **FreeFileSync** | **Local↔local** bi‑directionnel ou miroir | GUI claire, profils, **RealTimeSync** | Un service de plus ; penser aux filtres. |
| **Git + GitHub** | **Versioning**, publication **Pages**, collaboration | Historique, PR, CI/CD, intégration Obsidian | Pas une sync de gros binaires ; pousser seulement ce qui doit l’être. |
| **Termux (Android)** | Script Git / rclone / cron côté mobile | Donne l’**automatisation** manquante sur Android | À configurer (clé SSH, autorisations). |

---

# 🔗 Lien avec la fiche Obsidian
- **Obsidian Git** reste l’outil clef pour **versionner** ton Vault et **publier** (MkDocs / Digital Garden).  
- **Syncthing** complète pour **propager** des **sous‑dossiers** du Vault (et d’autres dossiers non‑Obsidian) sur tes appareils.  
- **rclone** sert de pont **sélectif** entre ton **PC** et **Google Drive** (ou l’inverse).  
- **Conclusion** : _Syncthing pour “qui reçoit quoi, en temps réel”_ ; _rclone pour “ce qui va (ou revient) sur Drive de manière contrôlée”_ ; _Git pour l’historique et la publication_.

---

# 🧩 Modèles de filtres

## `.stignore` (Syncthing) — à la racine de chaque folder partagé
```
# Caches Obsidian
.obsidian/workspace.json
.obsidian/plugins/*/data.json
.trash/

# Exports / builds
**/site/
**/public/

# Médias lourds (exemples)
**/*.mp4
**/*.zip
```

## `.gitignore` (Git)
```
# OS / cache
Thumbs.db
desktop.ini

# Obsidian & builds
.obsidian/workspace.json
.trash/
07_PUBLISH TO GITHUB/site/
07_PUBLISH TO GITHUB/public/
```

---

# 🧪 Exemples de commandes utiles

## rclone → Google Drive (miroir sélectif)
```bat
rclone sync "D:\Vaults\SEB_25-26\07_PUBLISH TO GITHUB" gdrive:ObsidianPublic ^
  --exclude ".git/**" --exclude "site/**" --exclude "public/**" ^
  --transfers 4 --checkers 8 --fast-list
```

## Robocopy → local A → B (miroir, prudent)
```bat
robocopy "D:\Source" "E:\Cible" /MIR /R:2 /W:2 /XD ".git" "site" "public"
```

## Termux (Android) → Git push rapide (ex. sous‑dossier public)
```bash
cd ~/storage/shared/Obsidian/SEB_25-26/07_PUBLISH\ TO\ GITHUB
git pull --rebase
git add -A
git commit -m "mobile(auto): $(date '+%F %T')" || true
git push origin main
```

---

# 🔒 Bonnes pratiques de stabilité
- **Ne mélange pas** Syncthing **et** Google Drive sur **le même chemin**. Utilise le **PC** comme passerelle (rclone).  
- **Versioning Syncthing** activé côté PC (par ex. Keep last 20).  
- **Un “maître” d’écriture** par zone sensible (Send‑Only / Receive‑Only).  
- **Pull avant Push** (Git), commits atomiques, `.gitignore` propre.  
- **Sauvegardes** périodiques (ZIP mensuel).

---

# ✅ Checklist “mise en prod”
- [ ] Pairs Syncthing appairés (PC ⇄ S23), folders partagés et test fichier témoin.  
- [ ] `.stignore` + versioning réglés.  
- [ ] Script rclone testé, planifié (Task Scheduler).  
- [ ] Git push OK depuis PC et Android.  
- [ ] Aucun gros binaire non désiré dans le repo GitHub.  
