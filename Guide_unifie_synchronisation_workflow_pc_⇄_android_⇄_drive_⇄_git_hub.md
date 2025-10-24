

## title: Guide unifié — Synchronisation & Workflow (PC ⇄ Android ⇄ Google Drive ⇄ GitHub) tags: [workflow, synchronisation, obsidian, syncthing, rclone, git, github, android, windows, reproducibility, ci-cd, security, resilience, governance, monitoring] created: 2025-10-23

# Guide unifié — Synchronisation & Workflow (PC ⇄ Android ⇄ Google Drive ⇄ GitHub)

> **Niveau** : adapté à un étudiant de troisième cycle.\
> **But** : établir une architecture **reproductible, observable et résiliente** pour : (1) synchroniser un Vault Obsidian entre **PC** et **Android** ; (2) interfacer sélectivement des contenus avec **Google Drive** ; (3) **publier** un sous‑ensemble via **GitHub Pages**.

---

## Sommaire

1. [Résumé](#résumé)
2. [Hypothèses, périmètre et objectifs](#1-hypothèses-périmètre-et-objectifs)
3. [Architecture et flux](#2-architecture-et-flux-vue-système)
4. [Disposition des dossiers](#3-disposition-des-dossiers-référence)
5. [Outils et sémantique opérationnelle](#4-outils-et-sémantique-opérationnelle)
6. [Décisions de conception](#5-décisions-de-conception-justification)
7. [Configuration détaillée](#6-configuration)
8. [Bonnes pratiques & options avancées](#7-bonnes-pratiques-et-options-avancées)
9. [Android (Termux) — automation](#8-android-termux--mise-en-place-et-automation)
10. [Dépannage](#9-dépannage-modes-de-panne-typiques)
11. [Validation, tests et reproductibilité](#10-validation-tests-et-reproductibilité)
12. [Gouvernance, sécurité et conformité](#11-gouvernance-sécurité-et-conformité)
13. [Stratégies de migration & rollback](#12-stratégies-de-migration--rollback)
14. [FAQ](#13-faq-extraits)
15. [Checklists](#14-checklists)
16. [Annexes](#annexes)

---

## Résumé

Ce guide met l’accent sur : (i) des **invariants** de cohérence (pas de chemins concurrents ; graphe Git unique ou sous‑dépôts strictement isolés), (ii) des **décisions de conception** justifiées (monorepo vs polyrepo), (iii) une **gestion de conflits** déterministe (vecteurs de version, *last writer wins* par fichier), (iv) une **traçabilité** bout‑en‑bout (journaux, empreintes, CI), et (v) une **sécurité opérationnelle** proportionnée (SSH ed25519, OIDC pour Pages, chiffrement rclone en option).

Le document fournit : une **topologie de dossiers** de référence, des **scripts reproductibles** (PowerShell/Termux), des **modèles** (.gitignore, .gitattributes, workflow Pages), un **plan de validation** (smoke tests, métriques), un **runbook de dépannage**, et des **annexes** (hooks, planificateur de tâches, filtres rclone, FAQ, stratégies de migration et de rollback).

---

## 1. Hypothèses, périmètre et objectifs

**Hypothèses.** Windows 10/11 avec Git & OpenSSH ; PowerShell ≥ 5.1 ; Android 10+ avec Termux ; compte GitHub (clé SSH **ed25519** avec passphrase) ; accès Google Drive. L’utilisateur maîtrise les bases de Git, de la ligne de commande et des permissions Android (stockage partagé).

**Contraintes d’environnement.**

- Les chemins Windows peuvent contenir des espaces (guillemets requis) ; la limite `` peut gêner si `LongPathsEnabled` n’est pas activé.
- Android applique le **Scoped Storage** ; Termux accède au stockage partagé via `termux-setup-storage` (montage sous `~/storage/shared`).
- Google Drive ne fournit des **checksums MD5** que pour les fichiers binaires standards (pas pour les documents Google natifs) ; rclone s’aligne sur ce comportement.

**Objectifs.**

1. Garantir l’**unicité du graphe Git** à la racine du Vault (éviter les dépôts imbriqués non déclarés).
2. Orchestrer des **flux dirigés acycliques** : PC ⇄ Android (Syncthing), PC ⇄ Drive (rclone), Vault ⇢ Pages (GitHub Actions).
3. Conserver des opérations **idempotentes** et **observables** (journaux, métriques, artefacts CI).
4. Minimiser les conflits multi‑appareils sans sacrifier le débit (versioning et politiques d’exclusion explicites).
5. Permettre un **rollback** à coût constant (commits atomiques, archives rclone optionnelles, sauvegardes *one‑click*).

**Hors périmètre.** Chiffrement E2E par défaut (activable via `rclone crypt`) ; LFS systématique pour binaires (à n’activer qu’en cas de besoin) ; auto‑hébergement du serveur Git.

---

## 2. Architecture et flux (vue système)

```mermaid
graph TD
  A[Vault (PC)] -- Syncthing bi‑dir --> B[Vault (Android)]
  A -- rclone filtré --> C[DriveBridge/ (PC → Google Drive)]
  A -. Git (main) .-> D[GitHub repo]
  subgraph Publication sélective
    A_sub[07_PUBLISH TO GITHUB/] -. incluse .-> D
    D --> E[GitHub Pages]
  end
```

**Invariants à respecter**

- **I1 — Graphe Git unique à la racine** (monorepo), **ou** polyrepo avec **isolation stricte** via `.gitignore` (pas de mélange *worktree*).
- **I2 — Pas de synchronisation concurrente** du **même chemin** par Syncthing **et** Google Drive ; Drive n’intervient **que** par un dossier **tampon** (`DriveBridge/`).
- **I3 — Aucun artefact de build versionné** (`site/`, `public/`, caches Obsidian) : seuls les **sources** sont suivis par Git.
- **I4 — Idempotence** des jobs rclone et scripts Git (ré‑exécution sûre ; absence d’effets secondaires cachés).

**Sécurité minimale.** Aucune clé privée ni secret en clair dans le repo ; publication Pages via **OIDC** (aucun PAT persistant).

---

## 3. Disposition des dossiers (référence)

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

**Android** :

```
/storage/emulated/0/Obsidian/SEB_25-26/
/storage/emulated/0/SyncMobile/
```

**Variantes.** Selon la volumétrie, `05_Media` peut rester **hors Vault** (ex. `D:\Data\Media_Heavy\`) et être référencé via des liens intégrés (*embeds*) dans Obsidian afin d’éviter des commits inutiles ou le recours à LFS.

## 4. Outils et sémantique opérationnelle

- **Syncthing** — réplication *par dossier* tolérante aux pannes ; stratégies *Send‑Only*/*Receive‑Only* ; versioning ; exclusions `.stignore` ; résolution de conflits par **vecteurs de version** et *last‑writer‑wins* **par fichier**.
- **rclone** — synchronisation **PC → Drive** (ou inverse) avec filtrage fin ; `--backup-dir`/`--suffix` pour la rétention ; `--drive-use-trash` pour exploiter la corbeille ; `--check-first`/`--checksum` (selon backend) pour l’audit ; journaux `--log-file`.
- **Git (+ Obsidian Git)** — graphe de commits unique ; `.gitattributes` pour EOL/diff ; hooks *pre-commit* (lint Markdown, orthographe) ; publication sélective depuis `07_PUBLISH TO GITHUB/` via Actions (MkDocs).
- **Termux** — automatisation Android (git/rclone/cron) ; `termux-setup-storage` expose `/storage/emulated/0` sous `~/storage/shared` ; paquets minimaux : `git`, `openssh`, `rclone`, `cronie`.

## 5. Décisions de conception (justification)

- **Monorepo à la racine du Vault** : simplicité cognitive (un seul `git status`), intégrité (évite le *submodule bleed*), meilleure portabilité multi‑machines. Si un sous‑repo public est imposé, **isoler** `07_PUBLISH TO GITHUB/PPV_S56/` via le `.gitignore` du dépôt racine et **l’administrer séparément**.
- **Pont Drive par rclone** : évite les états concurrents ; permet des stratégies de rétention (`--backup-dir gdrive:Archives/%DATE%`), et le **remote crypt** pour les dossiers sensibles.
- **Publication Pages par Actions** : builds hermétiques, reproductibles ; artefacts transférés via *upload-pages-artifact* ; pas de secrets à longue durée (OIDC).
- **Idempotence & observabilité** : scripts ré‑entrants, journaux concis, *fail‑fast* et consignes de remédiation explicites.

---

## 6. Configuration

### 6.1 Syncthing

**Table d’exemple**

| Folder (PC)  | Chemin                                          | Android                                    | Type                                        | Points d’attention                  |
| ------------ | ----------------------------------------------- | ------------------------------------------ | ------------------------------------------- | ----------------------------------- |
| VaultInbox   | `D:\Data\Vaults\SEB_25-26\00_Inbox`             | `/Obsidian/SEB_25-26/00_Inbox`             | Send & Receive                              | Conflits rares ; versioning côté PC |
| VaultCours   | `D:\Data\Vaults\SEB_25-26\02_Notes_Cours`       | `/Obsidian/SEB_25-26/02_Notes_Cours`       | Send & Receive                              | Id.                                 |
| VaultMedia   | `D:\Data\Vaults\SEB_25-26\05_Media`             | —                                          | **Send Only (PC)**                          | Évite la saturation du mobile       |
| VaultPublish | `D:\Data\Vaults\SEB_25-26\07_PUBLISH TO GITHUB` | `/Obsidian/SEB_25-26/07_PUBLISH TO GITHUB` | **Send Only (PC)** / Receive Only (Android) | Le PC reste la source de vérité     |

``** minimal**

```
# Caches Obsidian
.obsidian/workspace.json
.obsidian/plugins/*/data.json
.trash/

# Builds/exports
**/site/
**/public/

# Binaires lourds (ex.)
**/*.mp4
**/*.zip
```

**Paramètres recommandés** : côté PC, intervalle de scan ≥ 60 s ; *file watcher* activé. Versioning : *Staggered File Versioning* avec rétention (≥ 20 versions, TTL 30 jours) pour réduire le risque de pertes silencieuses.

### 6.2 rclone (PC → Drive)

**Créer le remote** : `rclone config` → `gdrive:` (OAuth).

**Job type**

```bat
rclone sync "D:\Data\DriveBridge\Publications" gdrive:Publications ^
  --exclude ".git/**" --exclude "site/**" --exclude "public/**" ^
  --transfers 4 --checkers 8 --fast-list --progress ^
  --log-file="D:\Data\Logs\rclone_%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%.log" --log-level INFO
```

**Variantes avancées** :

- Historisation Drive : `--backup-dir gdrive:Archives/%DATE%` + `--suffix=.%DATE%`.
- Audit à blanc : `--dry-run --checksum` (si supporté) pour simuler les mutations.
- Corbeille Drive : `--drive-use-trash` (par défaut) ; purges programmées côté Drive.
- Chiffrement : **remote crypt** (`gdrive-crypt:`) au‑dessus de `gdrive:` pour `Publications/`.

### 6.3 Git (Windows)

**Initialisation à la racine du Vault**

```powershell
cd "<CHEMIN_VAULT>"
if (-not (Test-Path .git)) { git init }
git config --local init.defaultBranch main
# Remote SSH
if ((git remote) -notcontains 'origin') { git remote add origin git@github.com:Carouan/PPV_S56.git } else { git remote set-url origin git@github.com:Carouan/PPV_S56.git }
# Hygiène EOL & diff
@'
* text=auto
*.md text eol=lf
*.bat text eol=crlf
'@ | Set-Content .gitattributes -Encoding UTF8
# Ignorés
@'
Thumbs.db
desktop.ini
.obsidian/workspace.json
.obsidian/plugins/obsidian-git/data.json
.trash/
07_PUBLISH TO GITHUB/site/
07_PUBLISH TO GITHUB/public/
'@ | Set-Content .gitignore -Encoding UTF8
# Commit initial
git add -A
git commit -m "init"
git branch -M main
git push -u origin main
```

**Options utiles** : `git config --global core.autocrlf true` (Windows) ou `input` (préserve LF) ; `git config --global pull.rebase true` pour un graphe linéaire.

### 6.4 Publication GitHub Pages (MkDocs)

`07_PUBLISH TO GITHUB/mkdocs.yml` minimal

```yaml
site_name: "SEB_25-26 — Public"
site_url: "https://carouan.github.io/PPV_S56/"
theme: { name: material }
nav: [ { Accueil: index.md } ]
markdown_extensions: [toc, admonition, footnotes, codehilite]
```

Workflow `.github/workflows/pages.yml`

```yaml
name: Deploy MkDocs to Pages
on:
  push:
    branches: ["main"]
    paths: ["07_PUBLISH TO GITHUB/**", ".github/workflows/pages.yml"]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.x" }
      - name: Install mkdocs
        run: |
          python -m pip install --upgrade pip
          pip install mkdocs mkdocs-material
      - name: Build site
        working-directory: "07_PUBLISH TO GITHUB"
        run: mkdocs build --strict --clean --site-dir site
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with: { path: "07_PUBLISH TO GITHUB/site" }
  deploy:
    needs: build
    permissions: { pages: write, id-token: write }
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 7. Bonnes pratiques et options avancées

### 7.1 Invariants & contrôles

- **I1** : pas de `.git` imbriqué non géré. Si un sous‑repo est indispensable, **l’ignorer** dans le dépôt racine et le gérer séparément.
- **I2** : Syncthing et Drive ne ciblent **jamais** le même chemin (risque de boucles et de pertes non atomiques).
- **I3** : pas d’artefacts de build dans Git ; nettoyer avant commit (`mkdocs build` hors repo ou répertoires ignorés).
- **I4** : scripts et jobs **idempotents** ; chaque exécution est déterministe et journalisée.

### 7.2 Gestion de conflits

- **Syncthing** : activer le **versioning** côté PC (≥ 20 versions). En cas de conflit, privilégier un **merge** manuel dans Obsidian. Documenter la règle *source of truth* : PC > Android.
- **Git** : utiliser `git pull --rebase` (Termux/PC) pour un graphe linéaire, puis `git push`. Effectuer des **commits atomiques** par unité logique.

### 7.3 Observabilité & métriques

- **rclone** : `--log-file` + rotation (Planificateur). **KPIs** : nombre d’objets transférés, débit moyen, taux d’erreurs.
- **Git** : convention de messages (`type(scope): message`) ; *trailers* (`Refs:`) ; hook *pre-commit* (lint Markdown, orthographe en option).
- **Pages** : vérifier l’URL d’environnement ; utiliser *Pages Insights* (si disponible) pour surveiller les statuts de build.

### 7.4 Sécurité

- **SSH ed25519** + passphrase ; `ssh-agent` au démarrage ; `~/.ssh/config` pour l’alias GitHub.
- **OIDC** pour Pages ; aucun PAT stocké ; révocation automatique des secrets compromis par GitHub.
- **rclone crypt** pour `Publications/` si sensibilité (salage + chiffrement des noms si requis).

### 7.5 Contenus lourds

- Si `05_Media/` doit être versionné : **Git LFS** (cibler les extensions concernées) ; sinon **exclure** via `.gitignore`.
- Éviter les vidéos non nécessaires dans le Vault ; préférer des liens symboliques ou des URLs vers Drive.

---

## 8. Android (Termux) — mise en place et automation

1. `pkg update && pkg upgrade` ; `pkg install git openssh rclone cronie`.
2. `termux-setup-storage`, puis vérifier `~/storage/shared/`.
3. Créer la clé SSH : `ssh-keygen -t ed25519 -C "<email>"` ; copier la clé publique sur GitHub.
4. **Script type** (dans `~/storage/shared/Obsidian/SEB_25-26/`) :

```bash
#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
VAULT="$HOME/storage/shared/Obsidian/SEB_25-26"
cd "$VAULT"
 git pull --rebase
 git add -A
 git commit -m "mobile(auto): $(date '+%F %T')" || true
 git push origin main
```

5. **Planifier via **`` :

```bash
# Démarrer le service (Termux:Boot sinon)
sv-enable crond || true
crontab -l 2>/dev/null | {
  cat
  echo "*/30 * * * * $HOME/storage/shared/Obsidian/SEB_25-26/push.sh >> $HOME/cron_push.log 2>&1"
} | crontab -
```

> **Note** : sous Android, les services peuvent être tués ; *Tasker* déclenché à l’ouverture/fermeture d’Obsidian est souvent plus fiable.

---

## 9. Dépannage (modes de panne typiques)

**P1 —** `error: '.../PPV_S56/' does not have a commit checked out` → dépôt imbriqué. **Correction** :

```powershell
ren "07_PUBLISH TO GITHUB\PPV_S56\.git" "_git_BACKUP_$(Get-Date -Format yyyyMMddHHmmss)"
git add -A && git commit -m "init" && git branch -M main && git push -u origin main
```

**P2 —** `fatal: src refspec main does not match any` → aucun commit (lié à P1). Refaire **commit** puis **push**.

**P3 —** `LF will be replaced by CRLF` → information ; ajuster `core.autocrlf` si nécessaire (`true` sur Windows, `input` sinon).

**P4 —** `permission denied (publickey)` → ajouter la clé publique à GitHub, démarrer `ssh-agent`, charger `ssh-add` ; vérifier `~/.ssh/config`.

**P5 —** `Filename too long` → activer `LongPathsEnabled` (GPO/Registre) et `git config core.longpaths true`.

**P6 —** Erreurs rclone 403/429 (quota) → réduire `--transfers`/`--checkers`, *backoff* exponentiel, fenêtres horaires creuses.

**P7 —** Conflits Syncthing fréquents → augmenter le *settle time*, éviter l’édition simultanée multi‑clients ; documenter la préférence PC.

---

## 10. Validation, tests et reproductibilité

**Smoke tests (PC)**

- Créer `00_Inbox/test.md`, vérifier la réplication sur Android.
- Modifier un fichier sous `07_PUBLISH TO GITHUB/`, *commit/push*, vérifier le **build Pages** (statut *green* + URL).

**Métriques minimales**

- **rclone** : `{files_copied, files_skipped, errors}`, débit moyen.
- **Git** : délai *commit→Pages*, échecs Actions, taille du repo, ratio ignorés/suivis.
- **Syncthing** : latence de propagation (PC→Android), taux de conflits hebdomadaire.

**Reproductibilité**

- Scripts idempotents (PowerShell/Termux) ; versionnement explicite des dépendances (MkDocs) ; configuration sauvegardée (`.gitignore`, `.gitattributes`, workflows) dans le repo.

---

## 11. Gouvernance, sécurité et conformité

- **Clés** : rotation annuelle, stockage chiffré ; journaliser les ajouts/suppressions de clés GitHub.
- **Secrets CI** : privilégier OIDC ; éviter les PAT ; révoquer les *runners* compromis.
- **Branches** : protéger `main` ; exiger des *required checks* pour Pages ; standardiser les messages de commit.
- **Confidentialité** : en publication partielle, vérifier qu’aucun fichier sensible n’est référencé ; utiliser un répertoire de publication strictement séparé.

---

## 12. Stratégies de migration & rollback

- **Vers monorepo** : neutraliser les `.git` imbriqués (renommer `.git` → `_git_BACKUP_*`), `git add -A`, commit atomique, push.
- **Rollback Pages** : revenir à un commit antérieur (bouton *Revert* ou `git revert`), relancer le build. Pour Drive, restaurer depuis `Archives/` si `--backup-dir` est actif.
- **Vers polyrepo** : ajouter le sous‑repo au `.gitignore` du racine, l’initialiser, puis pousser vers un remote dédié.

---

## 13. FAQ (extraits)

**Pourquoi ne pas synchroniser **``** directement avec Google Drive ?**\
Pour éviter des états concurrents non atomiques et des conflits silencieux. Le pont `DriveBridge/` découple les responsabilités : **Syncthing** pour appareil↔appareil ; **rclone** pour PC↔Drive avec filtres contrôlés.

**Comment gérer les gros médias ?**\
Soit **hors Vault** (références/embeds), soit **Git LFS** ciblé ; éviter d’augmenter la taille du repo inutilement.

**Peut‑on chiffrer la publication ?**\
GitHub Pages ne chiffre pas le site public ; chiffrez les sources sensibles (rclone crypt) et ne les publiez pas.

---

## 14. Checklists

-

---

## Annexes

**A. **``** (référence)**

```
Thumbs.db
desktop.ini
.obsidian/workspace.json
.obsidian/plugins/obsidian-git/data.json
.trash/
07_PUBLISH TO GITHUB/site/
07_PUBLISH TO GITHUB/public/
```

**B. **``** (référence)**

```
* text=auto
*.md text eol=lf
*.bat text eol=crlf
```

**C. Hook Git (exemple **``**)**

```
#!/usr/bin/env bash
set -euo pipefail
# Vérification : pas de site/ ni public/ dans l’index
if git diff --cached --name-only | grep -E '(^|/)site/|(^|/)public/'; then
  echo "[pre-commit] Artefacts de build détectés (site/|public/). Annulation." >&2
  exit 1
fi
```

**D. Planificateur Windows — tâche rclone (XML minimal)**

```
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <CalendarTrigger><ScheduleByDay><DaysInterval>2</DaysInterval></ScheduleByDay></CalendarTrigger>
  </Triggers>
  <Principals><Principal id="Author" runLevel="LeastPrivilege"/></Principals>
  <Settings><MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy></Settings>
  <Actions Context="Author">
    <Exec><Command>rclone</Command><Arguments>sync D:\Data\DriveBridge\Publications gdrive:Publications --fast-list</Arguments></Exec>
  </Actions>
</Task>
```

**E. Termux — **``\
`pkg install cronie` puis activer le service et ajouter la ligne crontab (cf. §8).

**F. Aide‑mémoire rclone (filtres)**

```
--exclude "*.tmp" --exclude "*.log" --exclude ".git/**" \
--exclude "**/site/**" --exclude "**/public/**" \
--include "**/*.md" --include "**/*.png"
```

**G. Script PowerShell de bootstrap**\
Voir le pack fourni ; adapter `$VaultPath` et `$RemoteSsh` avant exécution.

---

*Fin du guide.*

