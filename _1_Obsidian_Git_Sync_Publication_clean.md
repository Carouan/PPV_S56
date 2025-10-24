---
title: "Obsidian → GitHub : Synchronisation, Publication & Automatisations (Windows + Android)"
tags: [obsidian, git, github, sync, android, windows, publication, github-pages]
created: 2025-10-21
---

# 🎯 Objectif

Mettre en place **une synchronisation Git automatique** et **une publication sélective** de sous-dossiers d’un Vault Obsidian vers GitHub (et éventuellement Discord / WordPress), **depuis Windows et Android** — en privilégiant des solutions **GLOM** (Gratuit, Libre, Open-source, Multi-plateforme).

Chemin local du Vault : `G:\Mon Drive\_02_ICT\_010_ICT_PERSO_on_GDrive\_01_Obsidian Vaults\__VAULTS_DEFINITIF\SEB_25-26\`  
Dossier à publier : `...\SEB_25-26\07_PUBLISH TO GITHUB\`  
Dépôt GitHub (backup/sync) : `Carouan/PPV_S56` (HTTPS et SSH possibles)  
Clé SSH déjà créée (ed25519) sur le laptop.

---

# 🧭 Feuille de route (vue d’ensemble)

1) **Synchronisation Git** du Vault (ou d’un sous-ensemble)  
   - Windows : plugin **Obsidian Git** + Git CLI.  
   - Android : Obsidian Mobile + **Termux** (Git CLI) + tâche planifiée (cron) ou script **Termux:API**.  
2) **Publication sélective** du dossier `07_PUBLISH TO GITHUB` vers GitHub Pages :  
   - Option A (**MkDocs Publisher / Enveloppe**) : publication statique élégante (Markdown → site).  
   - Option B (**Digital Garden**) : site « jardin » connecté au repo (notes choisies via tags/frontmatter).  
   - Option C (**Webpage HTML Export** / **Vault to Blog**) : export HTML/blog rapide, plus manuel.  
3) **Automatisations bonus** :  
   - Envoi d’une note/sélection vers **Discord** (plugin `discord_message_sender`) ou **WordPress**.  
   - Routines : commit/push périodiques, vérif des conflits, changelog.

---

# ✅ Recommandations rapides

- **Sync principal** : **Obsidian Git** (fiable, très utilisé, GLOM).  
- **Android** : utiliser **Termux** pour effectuer les `git add/commit/push` en tâche planifiée.  
- **Publication sélective** : commencer par **MkDocs Publisher** (alias *Enveloppe*), plus simple à cadrer pour un dossier spécifique. **Digital Garden** est excellent si tu veux un site évolutif commandé par des tags/frontmatter.  
- **Sécurité** : privilégier **SSH** (clé ed25519 passphrase) ; sur Android, stocker la clé dans `~/.ssh` (permissions 600), remote en `git@github.com:Carouan/PPV_S56.git`.  
- **Fréquence** : toutes les **5–10 min** est raisonnable ; éviter < 2 min (risque de collisions).

---

# 🔧 Mise en place – Windows (Obsidian Git)

1. **Installer Git** pour Windows (inclure OpenSSH).  
2. **Configurer le repo** :  
   ```bash
   cd "G:\Mon Drive\_02_ICT\_010_ICT_PERSO_on_GDrive\_01_Obsidian Vaults\__VAULTS_DEFINITIF\SEB_25-26"
   git init
   git remote add origin git@github.com:Carouan/PPV_S56.git
   git pull origin main || git checkout -b main
   ```
3. **Installer le plugin _Obsidian Git_** dans Obsidian (Community plugins).  
4. **Paramètres à viser** :  
   - _Auto backup interval_ : **5–10 min**  
   - _Commit message_ : `vault(auto): {date} {time}`  
   - _Disable stage all_ si tu veux un `.gitignore` sélectif (par ex. ignorer les PDF/exports lourds).  
   - _Pull before push_ activé, _Merge strategy_ : `theirs` (ou résoudre manuellement si tu veux rester prudent).  
5. **.gitignore recommandé** :
   ```gitignore
   # Cache/temp Obsidian
   .obsidian/workspace.json
   .obsidian/plugins/obsidian-git/data.json
   .trash/
   # GDrive metadata
   desktop.ini
   Thumbs.db
   # Publications construites
   07_PUBLISH TO GITHUB/site/
   07_PUBLISH TO GITHUB/public/
   ```

---

# 🔧 Mise en place – Android (Obsidian Mobile + Termux)

> Objectif : exécuter les commandes Git en arrière-plan via **Termux** pour synchroniser le même Vault (copié/sync via Google Drive, Syncthing ou *Obsidian Sync* si un jour tu le testes).

1. **Installer** : Termux (F-Droid) puis `pkg install git openssh`  
2. **SSH** : copier la clé ed25519 (ou en générer une spécifique Android) dans `~/.ssh/id_ed25519` (chmod 600). Ajouter la clé publique au compte GitHub.  
3. **Cloner** le repo dans un dossier visible par Obsidian Mobile :
   ```bash
   cd ~/storage/shared/Obsidian/SEB_25-26
   git clone git@github.com:Carouan/PPV_S56.git .
   git config user.name "Sebastien"
   git config user.email "baudoux.sebastien@gmail.com"
   ```
4. **Script de sync (`~/bin/obsidian-sync.sh`)** :
   ```bash
   #!/data/data/com.termux/files/usr/bin/bash
   set -e
   VAULT="$HOME/storage/shared/Obsidian/SEB_25-26"
   cd "$VAULT"
   git pull --rebase
   git add -A
   git commit -m "mobile(auto): $(date '+%Y-%m-%d %H:%M:%S')" || true
   git push origin main
   ```
   puis `chmod +x ~/bin/obsidian-sync.sh`
5. **Planification** :  
   - Simple : `crond` (Termux:Tasker/Termux:API), job toutes les 10 min.  
   - Alternatif : déclencher à l’ouverture/fermeture d’Obsidian via **Tasker**.

> Remarque : sous Android, les plugins Obsidian ne peuvent pas **eux-mêmes** lancer Git en arrière-plan de manière fiable ; Termux est la brique robuste pour ça.

---

# 🌐 Publication sélective (GitHub Pages)

## Option A — **MkDocs Publisher / Enveloppe**
- **Principe** : un workflow qui transforme ton Markdown en site statique avec **MkDocs** (thème *Material* fréquent).  
- **Pour toi** : cible **le dossier** `07_PUBLISH TO GITHUB` uniquement ; ajoute un `mkdocs.yml` et un workflow GitHub Actions pour publier sur **GitHub Pages**.  
- **Pro** : rendu propre, navigation, recherche, contrôle fin (nav, index).  
- **Con** : nécessite un mini « projet site » (un fichier `mkdocs.yml`).

## Option B — **Digital Garden**
- **Principe** : publie des notes marquées (tag/frontmatter) depuis ton repo vers un site « jardin ».  
- **Pour toi** : maîtrise via des **tags** (ex : `publish: true`) au sein du dossier `07_PUBLISH TO GITHUB`.  
- **Pro** : friction minimale côté notes, aspect « wiki jardin » stylé.  
- **Con** : moins cadré qu’un site documentaire classique.

## Option C — **Webpage HTML Export / Vault to Blog**
- **Principe** : exporter des notes en HTML/Blog (local → commit → push).  
- **Pro** : rapide pour partager ponctuellement.  
- **Con** : pipeline moins automatisé pour Pages, homogénéité visuelle variable.

---

# 🧩 Analyse des plugins (par usage)

## 1) **Git / Synchronisation**

- **Obsidian Git** — _obsidian://show-plugin?id=obsidian-git_  
  Le **standard de facto** pour versionner un Vault : commit/pull/push, auto-backup périodique, gestion de conflits, historique. Solide et documenté.

- **Yet Another Obsidian Synchronizer (YAOS)** — _obsidian://show-plugin?id=yet-another-obsidian-synchronizer_  
  Orienté **sync de fichiers** (pas Git), utile en p2p/local ; moins adapté à GitHub/Pages. Intéressant pour des besoins hors Git.

- **Git Integration / Git File Explorer / Show Diff / Version History Diff**  
  Plugins **complémentaires** pour visualiser l’état Git, diffs, historiques. Bon pour **contrôler** les changements et former de bonnes habitudes.

- **Git Changelog**  
  Génère un **CHANGELOG** à partir de l’historique Git. Pratique pour des releases ou pour suivre l’évolution du Vault.

- **Git URL / Publish and GitHub URL plugin**  
  Aides pour **copier**/ouvrir des URL GitHub associées à tes fichiers (pratique pour partager une note publiée).

- **GitHub Gitless Sync**  
  Vise une **sync sans Git** via l’API GitHub ; utile si Git est bloqué, mais moins standard, moins transparent que Git natif.

- **GitHub Integration / Github Sync**  
  Intégrations variées avec GitHub (issues, gists, sync). À tester si besoin d’**actions GitHub** élargies ; pour la sync pure, **Obsidian Git** + Termux suffit.

- **GitHobs / GitHub Embeds / Import GitHub README**  
  Axés **affichage et intégration** de contenus GitHub (embeds, import). Utile pour **consommer** du contenu GitHub dans tes notes.

- **Gitlab Wiki Exporter**  
  Export vers wiki GitLab. Hors périmètre si tu restes sur GitHub.

## 2) **Publication / Export**

- **Enveloppe (obsidian-mkdocs-publisher)**  
  Pipeline **MkDocs** prêt à l’emploi ; parfait pour **GitHub Pages** propre et modulaire.

- **Digital Garden**  
  Publication **sélective** par tags/frontmatter, esthétique jardin de connaissances.

- **Vault To Blog**  
  Publie comme un **blog** à partir du Vault. Moins documentaire que MkDocs, plus narratif.

- **Webpage HTML Export**  
  Export **HTML** rapide des notes ; utile pour déposer dans un dossier `public/` poussé sur Pages.

## 3) **Envoi / CMS / Autres**

- **discord_message_sender**  
  Envoie une note (ou un extrait) vers **Discord** (webhook ou bot). Pratique pour **diffuser** un changelog ou une page fraîche.

- **wordpress**  
  Publication de notes vers **WordPress** (REST API). Idéal pour un site vitrine WordPress sans double saisie.

- **Telegraph Publish**  
  Publie sur **Telegra.ph** (plateforme ultra-légère). Idéal pour un partage **sans friction** mais sans personnalisation.

- **File Publisher / Contentful Publisher**  
  Publication vers **Contentful** ou autres cibles headless. Pertinent si tu montes un **CMS headless**.

- **Forms**  
  Crée des **formulaires** dans Obsidian (prise d’infos structurées). Utile pour normaliser des notes (templates + saisie).

- **FIT**  
  Divers utilitaires (selon la version) ; non essentiel pour la sync/publication.

---

# 📊 Tableau comparatif (extrait)

| Plugin / Option | Type | Windows | Android | Auto périodique | Publication Pages | Courbe d’apprentissage | Remarques |
|---|---|---:|---:|---:|---:|---|---|
| **Obsidian Git** | Git | ✅ | ⚠️* | ✅ | ❌ | ★★☆ | Base solide. Android via **Termux** |
| **YAOS** | Sync fichiers | ✅ | ✅ | ✅ | ❌ | ★★☆ | Pas Git ; p2p/local |
| **Git Integration / Diff** | UI Git | ✅ | ✅ | — | ❌ | ★☆☆ | Compléments visuels |
| **GitHub Gitless Sync** | API GitHub | ✅ | ✅ | ✅ | ❌ | ★★☆ | Sans Git, moins standard |
| **Enveloppe (MkDocs)** | Publication | ✅ | ⚠️ | CI GitHub | ✅ | ★★☆ | Parfait pour Pages doc |
| **Digital Garden** | Publication | ✅ | ✅ | CI GitHub | ✅ | ★★☆ | Publie par tags/frontmatter |
| **Webpage HTML Export** | Export HTML | ✅ | ✅ | ❌ | ⚠️ | ★☆☆ | Export manuel rapide |
| **Vault To Blog** | Blog | ✅ | ✅ | CI GitHub | ⚠️ | ★★☆ | Mode blog, pas doc |
| **discord_message_sender** | Diffusion | ✅ | ✅ | ✅ | — | ★☆☆ | Webhook/bot |
| **wordpress** | CMS | ✅ | ✅ | ✅ | — | ★★☆ | Nécessite config WP |
| **Forms** | Saisie | ✅ | ✅ | — | — | ★☆☆ | Structuration des inputs |

\* Android : Obsidian Git **ne lance pas** Git tout seul en tâche de fond. Utiliser **Termux** pour l’automatisation.

---

# 🛡️ Sécurité & bonnes pratiques

- **SSH partout** (éviter PAT clair) ; protéger la clé par **passphrase**.  
- **.gitignore** soigné : ignorer exports lourds, caches, archives temporaires.  
- **Commits atomiques** : petits lots, messages explicites.  
- **Pull avant Push** (éviter divergence), résoudre **conflits** au calme sur PC.  
- **Sauvegardes** : un export ZIP mensuel du Vault (hors `.git`) reste une bonne ceinture-bretelles.

---

# 🧪 Checklist de validation

- [ ] Commit/push OK depuis Windows.  
- [ ] Pull/commit/push OK depuis Android (Termux).  
- [ ] Pas de fichiers lourds ni secrets suivis (vérifier `git ls-files | wc -l` et `.gitignore`).  
- [ ] Pages publiées depuis `07_PUBLISH TO GITHUB` (URL Pages valide).  
- [ ] Envoi test d’une note vers Discord/WordPress si besoin.

---

# 📦 Annexes

## Exemple de `mkdocs.yml` minimal (pour `07_PUBLISH TO GITHUB`)

```yaml
site_name: "SEB_25-26 — Public"
site_url: "https://carouan.github.io/PPV_S56/"
theme:
  name: material
nav:
  - Accueil: index.md
  - Notes:
      - Exemple: exemple.md
markdown_extensions:
  - toc:
      permalink: true
  - admonition
  - footnotes
  - codehilite
```

## Workflow GitHub Actions (Pages)

`.github/workflows/pages.yml` :

```yaml
name: Deploy MkDocs to Pages
on:
  push:
    branches: [ "main" ]
    paths:
      - "07_PUBLISH TO GITHUB/**"
      - ".github/workflows/pages.yml"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.x"
      - name: Install mkdocs
        run: |
          python -m pip install --upgrade pip
          pip install mkdocs mkdocs-material
      - name: Build site
        working-directory: "07_PUBLISH TO GITHUB"
        run: mkdocs build --strict --clean --site-dir site
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "07_PUBLISH TO GITHUB/site"
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

# 🏁 Conclusion

- **Synchronisation** : Obsidian Git (+ Termux sur Android) = **robuste, standard, GLOM**.  
- **Publication** : commence par **MkDocs Publisher (Enveloppe)** sur `07_PUBLISH TO GITHUB`.  
- **Automatisations** : ajoute petit à petit (Discord/WordPress, changelog Git).  
- **Sécurité** : SSH + `.gitignore` + commits réguliers.
