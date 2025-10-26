
# Git — Glossaire structuré (concepts, états, actions)

## 1) Concepts fondamentaux
- **Repository (repo)** : base de données de versions (.git) + *working tree*.
- **Commit** : instantané immuable ; identifiant SHA ; parent(s) ; message.
- **Tree / Blob** : répertoire / contenu de fichier à un commit donné.
- **Ref** : pointeur nommé vers un commit (branches, tags).
- **Branch** : ref mobile (ex. `main`) ; avance après chaque commit.
- **HEAD** : ref spéciale qui pointe sur la branche courante (ou directement un commit en *detached HEAD*).
- **Remote** : dépôt distant (ex. `origin`).
- **Upstream** : branche distante suivie par la branche locale (`main` suit `origin/main`).
- **Tracking branch** : copie locale de l’upstream (ex. `origin/main`).

## 2) États & zones
- **Working tree (WT)** : fichiers sur disque.
- **Index / Staging area** (*le « stage »*) : zone tampon où l’on sélectionne **ce qui sera dans le prochain commit**.  
  - `git add <fich>` → place des changements dans le *stage* ;  
  - `git restore --staged <fich>` → les retire du *stage* ;  
  - `git commit` prend **uniquement** ce qui est dans le *stage*.
- **Local history** : tes commits locaux (branche `main`).
- **Remote tracking** : état connu du distant (`origin/main`).

## 3) Actions principales (verbes)
- **Sélection** : `git add -p` (par blocs), `git restore --staged` (retirer du stage).
- **Valider** : `git commit -m "..."` ; `--amend` pour modifier le dernier.
- **Synchroniser** :
  - `git fetch` (récupère les refs distantes) ;
  - `git pull --rebase` (intègre proprement l’upstream) ;
  - `git push` (publie).
- **Explorer/Changer de contexte** : `git switch <branch>` ; `git switch -c <nouvelle>` ; `git checkout -- <fich>` (récupérer depuis HEAD).
- **Fusionner** : `git merge` (peut créer un merge commit) ; `git rebase` (réécrit l’historique local au-dessus d’un commit cible).
- **Annuler** :
  - *Public* : `git revert <hash>` crée un commit inverse ;
  - *Local* : `git reset --soft|--mixed|--hard` déplace HEAD/l’index/WT.
- **Ponctuel** : `git cherry-pick <hash>` applique un commit isolé.
- **Mettre de côté** : `git stash push -u -m "..."; git stash pop`.
- **Historique avancé** : `git reflog` (sauvetage après reset/rebase).

## 4) Artefacts & outils
- **.gitignore** : ce que Git ne doit pas suivre (ex. `*.log`, `site/`, `public/`).
- **.gitattributes** : EOL/diff/merge ; ex. `* text=auto`, `*.md eol=lf`.
- **Submodule** : dépôt imbriqué (mode 160000). À éviter par défaut.
- **LFS** : stockage externalisé des gros fichiers (pointeurs dans Git).
- **filter-repo / BFG** : nettoyage d’historique (secrets, gros fichiers).
- **Hooks** : scripts côté client (ex. `pre-commit`) ou côté serveur (CI).

## 5) États d’erreur fréquents & solutions
- **non-fast-forward (push refusé)** : `git fetch` → `git pull --rebase` → `git push`.
- **Conflicts** : éditer, `git add` les fichiers résolus, `git rebase --continue` (ou `git merge --continue`).
- **detached HEAD** : `git switch main` (ou `-c newbranch` si tu veux garder le travail).
- **index.lock** : fermer l’outil fautif ; supprimer `.git/index.lock` ; relancer.
- **Secrets poussés** : révoquer, `git filter-repo --invert-paths --path "<fichier>"`, puis `git push --force-with-lease`.

## 6) Mini-cheatsheet
```bash
git status
git log --oneline --graph --decorate -n 15
git add -p
git commit -m "feat: ..."
git pull --rebase origin main
git push
```
