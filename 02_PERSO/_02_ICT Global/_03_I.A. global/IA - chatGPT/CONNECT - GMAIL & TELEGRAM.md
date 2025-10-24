


# Plan d’ensemble

1. **Telegram bot** : tu crées (ou réutilises) un bot via @BotFather → tu récupères un **token** et ton **chat_id** (où envoyer les alertes).
2. **Gmail** : tu actives IMAP, crées un **mot de passe d’application** (si 2FA), et un **filtre** qui met un **libellé `ALERTE`** sur les mails importants (expéditeurs/mots-clés).
3. **Script Python** : il se connecte en **IMAP**, lit les **nouveaux** mails du dossier/libellé `ALERTE`, et **pousse une alerte Telegram** avec _De / Sujet / Date_.
4. **Automatisation** : tu le lances **toutes les 5 min** (systemd timer sur Linux / Planificateur de tâches sur Windows).

---

# Étapes détaillées

## 1) Telegram : bot & chat_id

- Dans Telegram, parle à **@BotFather** → `/newbot` → suis les étapes → récupère le **token** (format `123456:AA...`).
- Ouvre une conversation avec TON bot et clique **Start**.
- Récupère ton **chat_id** (plusieurs façons) :
    - Écris un message à ton bot, puis ouvre `https://api.telegram.org/bot<TOKEN>/getUpdates` et repère `chat":{"id": ...}`.
    - Ou parle à **@userinfobot** : il te donne directement ton `chat_id`.
    - Ou mets le bot dans un **groupe/chaîne**, envoie un message, puis utilise `getUpdates` pour récupérer l’ID du groupe.

> Garde précieusement **token** et **chat_id**.

## 2) Gmail : IMAP + filtre

- **Active IMAP** dans Gmail (Paramètres → Transfert et POP/IMAP).
- Si tu as la **double authentification**, crée un **mot de passe d’application** (Google Compte → Sécurité → Mots de passe d’application).
- Crée un **filtre Gmail** (Paramètres → Filtres) pour taguer les mails importants :
    - Exemple : `from:(banque1@ex.be OR banque2@ex.be)`
    - Action : **Appliquer le libellé** → `ALERTE` (crée-le si besoin), et éventuellement “Toujours marquer comme important”.

> Avantage : le libellé `ALERTE` apparaîtra comme **dossier IMAP**. Le script ne scanne que ça → rapide et propre.

## 3) Script (prêt à l’emploi)

Je t’ai généré un pack complet avec script + templates systemd/Windows + README.
👉 **Télécharge-le ici : gmail_telegram_alert.zip**
Contenu clé :
- `gmail_to_telegram.py` : lit les **UNSEEN** du dossier `ALERTE` et envoie une alerte Telegram (évite les doublons via un fichier `state.json` basé sur les **UID IMAP**).
- `.env.example` : variables (token, chat_id, identifiants IMAP, libellé à surveiller, filtres optionnels).
- `systemd/*.service|*.timer` : lancement toutes les 5 minutes (Linux).
- `windows/run_once.bat` : pour le Planificateur de tâches.
- `README.md` : la doc étape-par-étape (FR).

### Installation rapide

1. **Dézippe**.
2. `pip install -r requirements.txt`
3. Copie `.env.example` → `.env` et remplis :
    - `BOT_TOKEN`, `CHAT_ID`, `IMAP_USER`, `IMAP_PASS`
    - `IMAP_FOLDER=ALERTE` (ou le nom de ton libellé)
4. Test **sans envoyer** sur Telegram :
    `python gmail_to_telegram.py --dry-run`
5. Puis envoi réel :
    `python gmail_to_telegram.py`

## 4) Lancer automatiquement

### Linux (systemd)

- Édite `systemd/gmail-alert.service` et `systemd/gmail-alert.timer` → remplace **WORKDIR** par le chemin réel.
- Installe + active :
    `sudo cp systemd/gmail-alert.service /etc/systemd/system/ sudo cp systemd/gmail-alert.timer  /etc/systemd/system/ sudo systemctl daemon-reload sudo systemctl enable --now gmail-alert.timer systemctl status gmail-alert.timer`

### Windows (Planificateur de tâches)

- Crée une tâche **toutes les 5 minutes** :
    - Programme : `cmd.exe`
    - Arguments :
        `/c "C:\chemin\vers\gmail_telegram_alert\windows\run_once.bat"`
    - Coche “**Exécuter avec les autorisations maximales**”.

---

# Sécurité & bonnes pratiques

- Utilise **un mot de passe d’application** Google (jamais ton vrai mot de passe).
- Ne **committe** pas le fichier `.env`.
- Limite les permissions du dossier (Linux `chmod 700`).
- Le script ne marque rien comme lu : il lit en **readonly** et déduplique via `state.json`.

---

# Option bonus (tri fin)

Dans le `.env`, tu peux activer un filtrage **en plus** du libellé
- `SENDER_WHITELIST=banque@ex.be,notifications@ex.be`
- `SUBJECT_KEYWORDS=Facture,Paiement,Inscription`

Voilà ✅  
J’ai régénéré l’archive complète :

👉 gmail_telegram_alert_regen.zip

Tu y trouveras :
- `gmail_to_telegram.py` (script principal)
- `.env.example` (config à remplir)
- `requirements.txt` (dépendances Python)
- `README.md` (instructions)
- dossiers `systemd/` et `windows/` pour l’automatisation

### D. Lancer automatiquement

#### Linux (systemd)
1. Édite `systemd/gmail-alert.service` et `systemd/gmail-alert.timer` → remplace `WORKDIR` par le **chemin réel** du répertoire.
2. Installe :

Toujours afficher les détails

`sudo cp systemd/gmail-alert.service /etc/systemd/system/ sudo cp systemd/gmail-alert.timer /etc/systemd/system/ sudo systemctl daemon-reload sudo systemctl enable --now gmail-alert.timer systemctl status gmail-alert.timer`

- Le timer lance le script **toutes les 5 minutes**.

#### Windows (Planificateur de Tâches)
1. Édite `windows/run_once.bat` si besoin.
2. Ouvre **Planificateur de tâches** → Créer une tâche de base → Déclencheur “toutes les 5 minutes” → Action :
    - Programme : `cmd.exe`
    - Arguments : `/c "C:\\chemin\\vers\\gmail_telegram_alert\\windows\\run_once.bat"`
3. Coche “Exécuter avec les autorisations maximales”.

## Sécurité & bonnes pratiques
- **Ne publie pas** ton `.env` (token Telegram + mot de passe d’application).
- Restreins les permissions du dossier (`chmod 700` sous Linux).
- Tu peux créer un **libellé Gmail** dédié (ex. `ALERTE`) pour bien cloisonner.
- Pour arrêter les alertes : désactiver le timer systemd ou la tâche Windows.

## Dépannage
- Pas d’alerte ? Vérifie que le mail a bien le **libellé** `ALERTE` et qu’il est **non lu**.
- Erreur IMAP : assure-toi que IMAP est **activé** dans Gmail  
    et que tu utilises un **mot de passe d’application** si 2FA est actif.
- Message “Folder not found” : le nom IMAP peut être sensible à la casse/caractères. Essaye `"[Gmail]/All Mail"` comme dossier et filtre en Python (voir variables SENDER/SUBJECT).

Top ! J’ai remis le **script Python complet** ET je t’ai préparé une archive prête à l’emploi :
👉 Télécharger gmail_telegram_alert_full.zip
Le fichier `gmail_to_telegram.py` (complet) est inclus dans l’archive.  
Je te le mets aussi ci-dessous pour que tu puisses le copier-coller directement si tu préfères :


Rappels rapides :
1. `pip install -r requirements.txt`
2. copie `.env.example` → `.env` et remplis `BOT_TOKEN`, `CHAT_ID`, `IMAP_USER`, `IMAP_PASS` (+ `IMAP_FOLDER=ALERTE`)
3. test : `python gmail_to_telegram.py --dry-run`
4. prod : `python gmail_to_telegram.py`
5. automation : systemd timer (Linux) ou Planificateur de tâches (Windows)

Si tu veux, on peut tout de suite lister **les expéditeurs** à mettre dans `SENDER_WHITELIST` et faire un **premier dry-run** ensemble.

