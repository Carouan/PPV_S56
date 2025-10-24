---
title: "02 — Guide synchronisation & backup (PC ⇄ Android ⇄ Google Drive ⇄ GitHub)"
tags: [guide, synchronisation, backup, syncthing, rclone, robocopy, freefilesync, git, github, drive, android, windows, obsidian]
created: 2025-10-21
---

> 🧭 **À lire avant** : ce guide complète _01 — Obsidian → GitHub_ et alimente _03 — Workflow global_.  
> 🎯 Objectif : mettre en place une **sync fiable et compréhensible** entre ton **PC**, ton **S23**, **Google Drive**, et **GitHub**, avec des **rôles clairs** pour chaque outil.

---

## 🧰 Outils — qui fait quoi ?

- **Syncthing** → _Appareil ↔ Appareil (temps réel)_. Granulaire par **folder** (Send‑Only / Receive‑Only, versioning, `.stignore`).  
- **rclone** → _PC ↔ Google Drive_ (jobs **planifiés**). Filtres puissants, GUI possible : `rclone rcd --rc-web-gui`.  
- **Robocopy / FreeFileSync** → _PC ↔ PC_ (local↔local). Robocopy = natif/fiable ; FFS = GUI + RealTimeSync.  
- **Git + GitHub** → _Historique & Publication_ (Pages). Obsidian Git automatise commit/pull/push.  
- **Termux** (Android) → scripts Git/rclone/cron côté mobile.

> 🔗 **Lien avec Obsidian** : Git pour **versionner** + publier, Syncthing pour **propager** des sous‑dossiers (ou autres dossiers non‑Obsidian), rclone pour **monter/descendre** vers Drive **de façon sélective**.

---

## 🧱 Arborescence recommandée (PC)

```
D:\Data\
│
├─ Vaults\
│   └─ SEB_25-26\
│       ├─ 00_Inbox\
│       ├─ 02_Notes_Cours\
│       ├─ 05_Media\
│       └─ 07_PUBLISH TO GITHUB\
│
├─ SyncMobile\
│   ├─ Obsidian_Shared\
│   └─ Media_Shared\
│
└─ DriveBridge\
    ├─ Publications\
    └─ Archives\
```

> 💡 **Pourquoi séparer ?** Pour éviter que **Syncthing** et **Drive** se partagent **exactement le même chemin** (risque de verrous/duplications). On **passe** par `DriveBridge\` et on pousse avec **rclone**.

---

## ⚙️ Paramétrage Syncthing (par folder)

| Folder (PC) | Chemin | Android | Type | Notes |
|---|---|---|---|---|
| **VaultInbox** | `D:\Data\Vaults\SEB_25-26\00_Inbox` | `/Obsidian/SEB_25-26/00_Inbox` | Send & Receive | Travail bi‑directionnel |
| **VaultCours** | `D:\Data\Vaults\SEB_25-26\02_Notes_Cours` | `/Obsidian/SEB_25-26/02_Notes_Cours` | Send & Receive | Id. |
| **VaultMedia** | `D:\Data\Vaults\SEB_25-26\05_Media` | — | Send Only | Évite de saturer le mobile |
| **VaultPublish** | `D:\Data\Vaults\SEB_25-26\07_PUBLISH TO GITHUB` | `/Obsidian/SEB_25-26/07_PUBLISH TO GITHUB` | **Send Only (PC)** / Receive Only (Android) | Le PC maîtrise le public |
| **DocsPerso** | `D:\Data\Docs Perso` | `/SyncMobile/Docs` | Send & Receive | Dossier non‑Obsidian |

- **Versioning** : activer côté **PC** (ex. _Keep last 20_).  
- **Filtres** : `.stignore` (exemples ci‑dessous) et `.gitignore` alignés.

### `.stignore` (modèle)
```
.oObsidian/workspace.json
.obsidian/plugins/*/data.json
.trash/
**/site/
**/public/
**/*.mp4
**/*.zip
```

### `.gitignore` (modèle)
```
Thumbs.db
desktop.ini
.obsidian/workspace.json
.trash/
07_PUBLISH TO GITHUB/site/
07_PUBLISH TO GITHUB/public/
```

---

## ☁️ Pont Google Drive (rclone)

- Créer un **remote** : `rclone config` → `gdrive:` (auth OAuth).  
- Job type (PC → Drive) :  
  ```bat
  rclone sync "D:\Data\DriveBridge\Publications" gdrive:Publications ^
    --exclude ".git/**" --exclude "site/**" --exclude "public/**" ^
    --transfers 4 --checkers 8 --fast-list
  ```
- GUI : `rclone rcd --rc-web-gui` (ouvre une interface Web locale).

---

## 📱 Android (S23)

- **Syncthing** (autoriser batterie/stockage).  
- **Termux** : `pkg install git openssh` + clé `~/.ssh/id_ed25519`.  
- Script Git (ex. sous‑dossier public) :
  ```bash
  cd ~/storage/shared/Obsidian/SEB_25-26/07_PUBLISH\ TO\ GITHUB
  git pull --rebase
  git add -A
  git commit -m "mobile(auto): $(date '+%F %T')" || true
  git push origin main
  ```

---

## 🛡️ Bonnes pratiques

- **Un seul “maître” d’écriture** par zone (Send‑Only / Receive‑Only).  
- **Pull avant Push** (Git). Commits **atomiques** et fréquents.  
- **Logs** : Syncthing (Failed items), rclone (`--log-file`), Git (console dev d’Obsidian).  
- **Sauvegarde** périodique hors Git (.zip mensuel).

---

## ✅ Checklist de mise en prod

- [ ] Folders Syncthing OK, `.stignore` + versioning posés.  
- [ ] rclone configuré (remote `gdrive`) + tâche planifiée.  
- [ ] Git push OK (PC & Android).  
- [ ] Pas de cohabitation Syncthing/Drive sur **le même chemin**.  
- [ ] Pages publiées depuis `07_PUBLISH TO GITHUB`.
