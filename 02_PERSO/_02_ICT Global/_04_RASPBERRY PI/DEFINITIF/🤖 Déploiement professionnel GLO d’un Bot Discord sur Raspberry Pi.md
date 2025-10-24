## 🤖 Déploiement professionnel GLO d’un Bot Discord sur Raspberry Pi

> **Projet : Coalition FFJ (Femmes de Droit) — Exemplarité DevOps GLO**  
> _Auteur(s) : Sébastien Baudoux & ChatGPT (co-création, 2024-2025)_

---
## 🗂️ Table des matières

- ### [1. Introduction et contexte](#introduction-et-contexte)
	- Origine du projet, problématique Railway, logique GLO, objectifs pédagogiques et pro
- ### [2. Prérequis techniques](#prérequis-techniques)
	- Matériel (Raspberry Pi, stockage, alimentation)
	- Logiciels nécessaires (Python, Docker, Git, etc.)
	- Réseau, sécurité minimale
- ### [3. Présentation de l’architecture cible](#présentation-de-larchitecture-cible)
	- Schéma général (ascii/art + diagramme Markdown)
	- Rôles des composants (bot, pipeline, monitoring, reverse proxy…)
- ### [4. Déploiement initial du bot Discord](#déploiement-initial-du-bot-discord)
	- Installation pas à pas (Raspbian, Python, Discord bot)
	- Configuration (tokens, secrets, variables d’environnement)
	- Tests unitaires et premiers checks
- ### [5. Industrialisation : Docker, CI/CD, Git, Pipeline](#industrialisation-docker-cicd-git-pipeline)
	- Dockerisation, Docker Compose
	- Setup d’un Git auto-hébergé (Gitea), webhooks
	- CI/CD léger (Woodpecker/alternatives libres)
	- Déploiement et rollback automatisés
- ### [6. Sécurisation et monitoring](#sécurisation-et-monitoring)
	- SSH hardening, UFW, Fail2Ban, accès distant VPN
	- Monitoring système et app (Prometheus, Grafana, Watchtower…)
- ### [7. Optimisation & administration Raspberry Pi (plateforme GLO)](#optimisation--administration-raspberry-pi-plateforme-glo)
	- Système de fichiers, overlay, synchronisation (Syncthing, IPFS)
	- Sauvegardes, snapshots, migration
- ### [8. Cas d’usage concret : bot de la Coalition FFJ](#cas-dusage-concret-bot-de-la-coalition-ffj)
	- Spécificités métier (résumé quotidien, envoi de mail, gestion canaux)
	- Structure du code (modules, scripts, etc.)
- ### [9. Annexes et modules avancés](#annexes-et-modules-avancés)
	- Déploiement multi-services, architectures distribuées, VPN maillé
	- Roadmap, troubleshooting, retour d’expérience
- ### [10. Glossaire](#glossaire)
- ### [11. FAQ](#faq)
- ### [12. Sources & bibliographie](#sources--bibliographie)
- ### [13. Crédits & historique des versions](#crédits--historique-des-versions)


---

# 1. Introduction et contexte

🎯 **Objectif** :  
Ce document vise à guider, de façon exhaustive et pragmatique, le **déploiement d’un bot Discord professionnel sur un Raspberry Pi**, en s’appuyant uniquement sur des solutions **GLO** (Gratuites, Libres, Open-source) pour maximiser la souveraineté numérique, l’apprentissage, la reproductibilité et la résilience.

🔬 **Contexte** :

- **Projet concret** : bot Discord pour la _Coalition FFJ_, utilisé dans le cadre associatif _Femmes de Droit_ (FDD).
- **Problème initial** : le bot était hébergé sur _Railway_, solution cloud performante mais payante et propriétaire, avec des limites d’utilisation et un risque d’interruption.
- **Démarche** : migrer vers un auto-hébergement _Raspberry Pi_, dans une logique de montée en compétences (CV, freelance), de maîtrise des coûts, et d’exemplarité DevOps/GLO.

🚩 **Enjeux & ambitions** :

- Obtenir une stack “production ready” : sécurité, fiabilité, CI/CD, monitoring, rollback, documentation, tests, etc.
- Être réplicable par d’autres associations, ou scalable pour d’autres usages (bots, sites, outils…).
- Avoir un socle technique qui pourra évoluer (multi-bots, multi-services, archi distribuée…).

---

# 2. Prérequis techniques

## ⚙️ Matériel

|🔧 Matériel|Spécifications minimales|Conseils|
|---|---|---|
|Raspberry Pi|3B+, 4 ou sup., 2 Go RAM min. (4-8 Go recommandé)|Boîtier ventilé, dissipateur|
|Stockage|MicroSD 16 Go min (préférer SSD/USB ou SD A2 32 Go+)|SD de qualité, backups|
|Alimentation|Officielle, 2.5A min, éviter les chargeurs low cost|Vérifier les messages d’erreur|
|Connexion réseau|Ethernet recommandé (Wi-Fi OK mais moins stable)|IP fixe ou réservation DHCP|

## 💻 Logiciels et outils à préparer

|Logiciel/outil|Version/conseil|
|---|---|
|OS (Raspberry Pi)|Raspberry Pi OS Lite (Bullseye/Bookworm), ou Debian minimal|
|Python|3.9+ (idéalement la dernière stable)|
|Docker & Docker Compose|Dernières versions ARM compatibles|
|Git|Dernière version stable|
|Un éditeur de texte|nano, vim, VSCode, ou équivalent|

## 🔑 Pré-requis compte & accès

- **Compte Discord** ayant les droits nécessaires pour créer et administrer un bot
- **Accès administrateur** SSH au Raspberry Pi
- **Accès Internet** pour installation, mises à jour et récupération des dépendances

## 🔐 Sécurité minimale

- Générer une paire de **clés SSH** forte (ed25519 ou rsa 4096)
- Changer le mot de passe par défaut du Pi
- Désactiver l’utilisateur “pi” si possible
- Mettre à jour le système dès l’installation (`sudo apt update && sudo apt upgrade -y`)

---

# 3. Présentation de l’architecture cible

Voici un **aperçu de la stack finale** :

┌─────────────┐      Webhook/CI         ┌────────────┐
│ Poste Dev   │ ─────────────────────▶ │  Gitea/Git │
└─────────────┘                                    └─────┬──────┘
         │         Commit Push                        │
         ▼                                                     │
  (auto-build/test/deploy via CI)                       │
┌──────────────┐   Container   ┌───────────────▼────────┐
│  Raspberry Pi    │ ◀───────▶ │  Docker (bot_discord + ...)  │
└──────────────┘                      └─────┬────────────┬──────┘
                               │                        │
                            ┌────▼──┐   ┌────▼─────┐
                                │  VPN       │   │ Monitoring│
                                └────────┘    └───────────┘


![[Pasted image 20250808143413.png|716]]

flowchart TD
    Dev[Poste Dev]
    Gitea[Gitea (Git auto-hébergé)]
    RPI[Raspberry Pi<br>(Docker: bot_discord)]
    VPN[VPN / Accès sécurisé]
    Monitor[Monitoring / Supervision]
    Dev -- Commit / Push --> Gitea
    Gitea -- Webhook / CI/CD --> RPI
    RPI -- Tunnels sécurisés --> VPN
    RPI -- Export logs / metrics --> Monitor


### **Composants majeurs**

- **Bot Discord Python** : code principal, modularisé, configurable (env, secrets)
- **Docker** : conteneurisation, portabilité, isolation
- **Git auto-hébergé (Gitea recommandé)** : dépôt code, déclencheurs de CI/CD (via webhooks)
- **Pipeline CI/CD** : déploiement automatisé sur le Pi
- **Surcouche sécurité** : SSH, VPN, UFW, gestion des secrets
- **Monitoring & logs** : supervision, alertes, santé système
- **Administration & backups** : sauvegardes, scripts de maintenance

---

# 4. Déploiement initial du bot Discord

## 📦 **Étape 1 — Préparation du Raspberry Pi**

1. **Flash & démarrage OS**
    - Télécharger Raspberry Pi OS Lite : https://www.raspberrypi.com/software/operating-systems/
    - Utiliser **Raspberry Pi Imager** ou **balenaEtcher** pour flasher la microSD/SSD
    - Booter, configurer la locale, clavier, réseau, SSH activé
2. **Sécurisation immédiate**
    - Changer le mot de passe (`passwd`)
    - Générer/installer votre clé SSH (`ssh-keygen -t ed25519`)
    - (Optionnel) Désactiver le login par mot de passe dans `/etc/ssh/sshd_config` (`PasswordAuthentication no`)
    - Mettre à jour le système (`sudo apt update && sudo apt upgrade -y`)
3. **Installer Python, Git et outils de base**
	bash :	`sudo apt install -y python3 python3-pip git`

## 🐳 **Étape 2 — Installation de Docker**

	bash :	`curl -fsSL https://get.docker.com | sh sudo usermod -aG docker $USER `
				(Se déconnecter/reconnecter pour appliquer le groupe)
	**Vérifier Docker** : bash : `docker run hello-world`

Installer Docker Compose (si besoin) :
	bash :	`sudo apt install -y docker-compose`
_(ou version officielle si besoin de la dernière version ARM)_

## 📂 **Étape 3 — Préparer le code du bot Discord**

1. **Créer ou cloner le dépôt (recommandé : Gitea auto-hébergé)**
bash :	`git clone <url-depot-gitea-ou-github> cd <dossier-bot>`
    
2. **Configurer le bot**
    - Copier le `.env.example` → `.env` et renseigner :
        makefile :   `DISCORD_TOKEN=xxxxxxxxx EMAIL_ADDRESS=xxx@xxx EMAIL_PASSWORD=xxxxxx ...`
        
3. **Premier test en local (hors Docker)**
	bash :  `python3 -m venv .venv source .venv/bin/activate pip install -r requirements.txt python bot/core.py`
    
    - Vérifier que le bot apparaît en ligne sur Discord.
    - Corriger les éventuelles erreurs de dépendances/module.
        

## 🐋 **Étape 4 — Dockerisation du bot**

1. **Vérifier/Adapter le `Dockerfile`**
    Exemple typique :
    Dockerfile
    
    `FROM python:3.11-slim WORKDIR /app COPY requirements.txt . RUN pip install --no-cache-dir -r requirements.txt COPY . . CMD ["python", "bot/core.py"]`
    
2. **Construire et lancer le conteneur localement**
    
	bash :	`docker build -t botdiscord . docker run --env-file .env botdiscord`
    
    - Vérifier que le bot fonctionne bien en conteneur.
        
3. **(Optionnel) Créer un `docker-compose.yml`**  
    Pour automatiser la base :
    
    yaml :     `version: '3' services:   botdiscord:     build: .     env_file: .env     restart: unless-stopped`
    
    bash :     `docker compose up -d`
    

---

## ✅ **Contrôles post-install**

- Le bot s’affiche bien comme “en ligne” sur Discord ?
- Les logs dans Docker (`docker logs <container>`) sont propres ?
- Les variables d’environnement sont bien prises en compte ?
- La machine est à jour et le port SSH n’est pas ouvert sur Internet ?




# 5. Installation et configuration de Gitea (Git auto-hébergé)

## 🎯 **Objectif**

Mettre en place un serveur **Gitea** sur le Raspberry Pi pour l’hébergement Git, le contrôle de version et l’automatisation du déploiement (webhooks/CI).

## 🐧 **Étape 1 — Installation de Gitea sur Raspberry Pi**

### 1. Installation via Docker (méthode recommandée GLO)

Crée un dossier dédié pour la persistance :

```bash
mkdir -p ~/gitea/{data,config}
cd ~/gitea
```

Créer un fichier `docker-compose.yml` :

```yaml
version: "3"
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=sqlite3 # ou postgres/mysql si tu préfères
      - GITEA__database__PATH=/data/gitea/gitea.db
    restart: always
    volumes:
      - ./data:/data
      - ./config:/etc/gitea
    ports:
      - "3000:3000"   # Web UI
      - "222:22"      # SSH Git
```

Lancer Gitea :

```bash
docker compose up -d
```

Après quelques secondes, accède à l’interface web via :\
`http://<ip-pi>:3000`

---

### 2. Configuration initiale

- Création du compte admin Gitea (nom, mail, mot de passe fort)
- Choix du mode de base de données (SQLite = simple, Postgres = robuste)
- Réglages principaux : nom du serveur, port, répertoires, activation des SSH keys

---

### 3. Sécurisation de Gitea

- Change le mot de passe admin
- Désactive l’inscription libre si usage privé
- Autorise uniquement les connexions SSH avec clé (pas de mot de passe)
- Mets à jour régulièrement l’image Docker de Gitea
- Sauvegarde les dossiers `data/` et `config/` !

---

### 4. Premier push/test

1. Crée un dépôt (repo) “bot-discord-ffj” sur Gitea
2. Clone ce dépôt sur ton PC ou directement sur le Pi :
   ```bash
   git clone ssh://gitea@<ip-pi>:222/bot-discord-ffj.git
   cd bot-discord-ffj
   # Ajoute le code du bot, commit, puis push !
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

---

### 5. Intégration future : Webhooks, pipeline CI/CD (voir section suivante)

Gitea permet de déclencher des scripts automatiques à chaque push via les webhooks (à configurer dans les settings du dépôt). C’est la clé pour le déploiement automatisé sur le Raspberry Pi !


# 6. Pipeline CI/CD et automatisation du déploiement

---

### 🚦 **Objectif**

Mettre en place une chaîne d’automatisation qui :
- Déclenche le build/test/déploiement du bot dès qu’un commit est “push” sur le dépôt Gitea (webhook).
- Réduit au minimum les interventions manuelles pour mettre en production.
- Permet le rollback rapide et sécurisé en cas d’erreur.
- S’appuie uniquement sur des outils **GLO** : scripts bash, Gitea, (optionnel : Woodpecker CI, Drone, Forgejo Actions…).

---

### 6.1 **Concept général de la CI/CD “self-hosted”**

1. **Commit & push sur Gitea**  
    → webhook déclencheur sur le Pi
2. **Script “post-receive”** sur le Pi (ou runner CI)
    - Récupère les dernières sources
    - Arrête le conteneur existant
    - Reconstruit l’image Docker
    - Relance le conteneur
    - (Log toute la procédure)
3. **Notifications / Alertes**
    - Succès ou erreur de build/déploiement (par mail, Discord, ou log centralisé)

---

### 6.2 **Mise en place d’un pipeline basique par Webhook Gitea**

#### **A. Activer les webhooks sur Gitea**

- Aller sur la page du dépôt → Settings → Webhooks → Add Webhook
- Renseigner :
    - **URL** du serveur cible (Raspberry Pi), ex :  
        `http://<IP-Pi>:8888/git-webhook`
    - Événements : _Push events_ (optionnel : tag, release, PR, etc.)

#### **B. Mettre en place un “Git Webhook Receiver” sur le Pi**

Plusieurs choix :
- **Script Bash custom** simple (pour usage minimaliste et reproductible)
- **Serveur Python (FastAPI/Flask) léger**
- **Web service dédié (ex : Gitea Actions, Woodpecker, Forgejo Actions…)**

##### **Exemple minimaliste : mini serveur Flask recevant le webhook**

python : 
`# webhook_receiver.py from flask import Flask, request import subprocess  app = Flask(__name__)  @app.route('/git-webhook', methods=['POST']) def handle_webhook():     # Optionnel : vérifier la signature du webhook pour sécurité     subprocess.Popen(["/home/pi/scripts/deploy_bot.sh"])     return 'OK', 200  if __name__ == '__main__':     app.run(host='0.0.0.0', port=8888)`

- À lancer en tâche de fond ou via systemd.

##### **Exemple de script de déploiement déclenché par le webhook**

bash :  
`#!/bin/bash set -e  cd /home/pi/bot-discord-ffj/ git pull origin main  docker compose down || true docker compose build docker compose up -d  # Logging (optionnel) date >> /home/pi/deploy.log echo "Déploiement OK" >> /home/pi/deploy.log`

- À adapter selon l’emplacement du code et le nom du repo.
- **Permission d’exécution** : `chmod +x /home/pi/scripts/deploy_bot.sh`
- Ce script peut aussi envoyer une notif en cas d’échec (`mail`, Discord webhook…)

#### **C. Sécurisation du webhook**

- Restreindre les IPs autorisées à accéder au port 8888 (UFW/iptables)
- (Recommandé) Activer la **vérification de la signature HMAC** du webhook Gitea (secret partagé)

#### **D. Alternatives GLO plus évoluées (optionnelles)**

- **Woodpecker CI** (site officiel) : pipeline YAML, runners ARM, intégration facile avec Gitea
- **Forgejo Actions / Drone CI** : pipelines natifs Gitea/Forgejo

_Exemple de pipeline Woodpecker (yaml simplifié)_

yaml :  
`pipeline:   build:     image: python:3.11-slim     commands:       - pip install -r requirements.txt       - pytest       - docker build -t botdiscord .       - docker compose up -d`

- Nécessite installation de Woodpecker serveur & agent sur le Pi.
- Permet étapes de tests, build, déploiement, rollback, notifications, logs détaillés…

---

## 6.3 **Rollback et fiabilisation**

- **Revenir rapidement** à une version précédente :
    - Garder les anciennes images Docker (`docker images`)
    - Utiliser les tags Git pour versionner
    - Ajouter un script “rollback.sh” qui relance l’ancienne image en cas d’échec du build

---

## 6.4 **Surveillance & logs du pipeline**

- Stocker les logs de build/déploiement (`deploy.log`)
- (Optionnel) Pousser les logs vers Grafana/Loki, ou les résumer sur Discord par webhook

---

## 6.5 **Checklist déploiement automatisé**

-  Webhook Gitea activé et testé
-  Script de déploiement robuste et idempotent
-  Accès limité au serveur de déploiement
-  Système de notifications d’échec/succès
-  Rollback documenté et testé
-  Documentation à jour

---

# 7. Monitoring, supervision et sécurité avancée

## 7.1 Monitoring et supervision (système, applicatif, alertes)

**Objectif :**  
Garantir la stabilité et la disponibilité du bot Discord ainsi que du Raspberry Pi en production, en détectant rapidement les anomalies ou les pannes.

#### 🛠️ Outils recommandés

- **Prometheus & Grafana** : Monitoring système, collecte de métriques, dashboards personnalisés.
- **Glances** : Vue synthétique en ligne de commande, monitoring basique mais efficace.
- **Watchtower** : Mise à jour automatique des conteneurs Docker.
- **Fail2Ban** : Surveillance des tentatives d’intrusion SSH.
- **Notification par webhook Discord** ou email : Alertes en temps réel.

#### 🗒️ Exemple de stack monitoring minimaliste :

- **Installation de Glances** (pour monitoring CLI rapide) :
    bash :  `sudo apt install glances glances`
- **Monitoring Docker en temps réel** :
    bash :  `docker stats`
- **Dashboards avancés avec Prometheus + Grafana** :
    1. Installer Prometheus et node_exporter pour Raspberry Pi (tuto GLO).
    2. Installer Grafana, connecter à Prometheus, créer les dashboards.
    3. Visualiser en continu CPU, RAM, disque, trafic réseau, conteneurs, etc.
- **Alerting** :
    - Configurer les alertes dans Grafana ou via script custom.
    - Envoyer un message sur un salon Discord ou par mail en cas de seuil critique.

#### 🛑 Points de vigilance

- Toujours monitorer : charge CPU, RAM, espace disque, température, logs d’erreur du bot, logs Docker.
- Conserver l’historique des incidents et corrections (pour la pédagogie et l’amélioration continue).

---

## 7.2 Sécurisation avancée (SSH, firewall, accès, secrets, backups)

	**Objectif :**  Renforcer la sécurité du Raspberry Pi et des services hébergés, limiter les risques d’intrusion ou de compromission.

#### 🔐 Principes de base

- **Accès SSH uniquement par clé** (désactiver l’authentification par mot de passe).
- **Changer le port SSH** (optionnel, sécurité par obscurité).
- **Activer le firewall UFW** :
    bash :  `sudo apt install ufw sudo ufw allow 22/tcp    # Ou ton port SSH sudo ufw allow 80,443/tcp sudo ufw enable sudo ufw status`
- **Fail2Ban** pour bannir les IPs suspectes automatiquement :
    bash :  `sudo apt install fail2ban sudo systemctl enable --now fail2ban`
- **Backups réguliers** :
    - Sauvegarder les dossiers `/home/pi/bot-discord-ffj/`, `/home/pi/gitea/` (données, config), et éventuellement images Docker (`docker save`).
    - Utiliser `rsync`, un disque USB externe, ou synchroniser sur un autre serveur/local.

#### 🔒 Gestion des secrets

- **Variables d’environnement** : Ne jamais stocker de secrets en clair dans le code ou dans le repo Git. Utiliser `.env`, monté dans le conteneur Docker.
- **Limitation des droits** : Lancer les services avec des utilisateurs non-root si possible.
- **Isolation réseau** : Docker bridge, VPN WireGuard, segmentation des accès.

#### 🔑 Mises à jour et durcissement

- Mettre à jour régulièrement : `sudo apt update && sudo apt upgrade -y`
- Mettre à jour les images Docker (`docker pull`).
- Interdire les connexions root directes (`PermitRootLogin no` dans sshd_config).
- Journaliser les accès et interventions critiques.

---

## 7.3 Conseils de durcissement Raspberry Pi en production

**Pour une plateforme robuste et durable :**

- **Désactiver tous les services non utilisés** (Bluetooth, Wi-Fi, etc. si inutile).
- **Vérifier l’alimentation** : Instabilités = sources de bugs/déconnexions (vérifier `dmesg | grep voltage`).
- **Configurer l’horloge (NTP)** pour une bonne gestion des logs et des certificats.
- **Surveiller la température** : Le Pi ralentit si trop chaud (>70°C), penser à ventiler.
- **Configurer les snapshots/sauvegardes automatiques**.
- **Tenir à jour la documentation interne** : changements d’IP, ports, logs d’incidents, corrections, etc.


# **8. Cas d’usage concret – Bot Discord de la Coalition FFJ**

### **8.1 Contexte et objectifs**

Le bot Discord de la Coalition **Feminists for Justice** (FFJ), projet initié par **Femmes de Droit (FDD)**, a pour rôle :

- Automatiser la communication interne (notifications, annonces, rappels)
- Assister dans la modération et l’organisation du serveur
- Offrir des outils spécifiques à la coalition (ex. suivi des tâches, votes internes, diffusion d’actualités)
- Minimiser les coûts d’hébergement tout en privilégiant une stack **GLO** (Gratuite, Libre, Open-source)
- Servir de **référence technique** pour des projets similaires à déployer en freelance

Initialement hébergé sur **Railway** (solution payante, cloud), l’objectif est :

1. **Migration** vers un **Raspberry Pi auto-hébergé**
2. Mise en place d’une **architecture sécurisée, robuste et évolutive**
3. **Automatisation complète** du déploiement et des mises à jour via CI/CD

---

### **8.2 Architecture technique**

```mermaid
flowchart TD
    Dev[Développeur (VSCode, Git)]
    Gitea[(Gitea auto-hébergé)]
    CI[Runner CI/CD (Drone ou ActRunner)]
    RPI[Raspberry Pi (Docker: bot_discord)]
    Discord[API Discord]
    Monitor[(Grafana / Prometheus)]
    Secrets[(Vault / Pass)]
    
    Dev -- Commit + Push --> Gitea
    Gitea -- Webhook --> CI
    CI -- Déploiement --> RPI
    RPI -- Connexion WebSocket --> Discord
    RPI -- Metrics --> Monitor
    CI -- Récupération clés --> Secrets
```

**Composants clés :**

- **Gitea** : dépôt Git auto-hébergé
- **Runner CI/CD** : automatisation (Drone CI ou ActRunner pour Gitea)
- **Docker** : conteneurisation du bot
- **Vault** : gestion sécurisée des secrets (tokens, API keys)
- **Monitoring** : Grafana + Prometheus

---

### **8.3 Pipeline Dev → Prod**

1. **Dev local**
   - Code modifié/testé localement
   - Commit + Push vers branche `dev` ou `main`
2. **CI/CD déclenché**
   - Test du code (lint, unit tests)
   - Build de l’image Docker
   - Push dans un registre privé (local ou distant)
3. **Déploiement sur RPi**
   - Pull de l’image Docker
   - Redémarrage du conteneur `bot_discord`
4. **Notifications**
   - Message Discord automatique : “Bot mis à jour – commit : XXXXX”

---

### **8.4 Gestion des secrets et configuration**

Exemple de fichier `.env` :

```env
DISCORD_TOKEN=xxxxxxxxxxxxxxxxxxxx
PREFIX=!
OWNER_ID=1234567890
LOG_LEVEL=info
```

**Bonnes pratiques :**

- `.env` jamais commité dans Git
- Utiliser un **Vault** ou `pass` pour stockage chiffré
- Injecter les secrets via variables d’environnement dans Docker

---

### **8.5 Supervision et maintenance**

- **Uptime-Kuma** pour surveiller la disponibilité
- **Logs Docker** centralisés avec Loki + Grafana
- **Alertes** (Discord ou mail) en cas d’erreur
- **Backup** automatique des fichiers critiques (`docker cp`, volume bindé)

---

### **8.6 Améliorations futures**

- Ajout de commandes avancées (ex. `/report`, `/poll`)
- Intégration API Nextcloud pour publier des documents directement
- Support multi-serveurs
- Passage à une architecture multi-conteneurs orchestrée (Docker Compose → Kubernetes)

# 9. Annexes et modules avancés

## 9.1 Déploiement multi-services
- Mise en place d’une stack Docker Compose hébergeant plusieurs services :
  - Bot Discord FFJ
  - Gitea
  - Uptime-Kuma
  - Grafana + Prometheus
  - Reverse proxy Nginx ou Traefik avec HTTPS automatique (Let's Encrypt)
- Séparation des réseaux Docker pour isoler les services critiques.

## 9.2 Architectures distribuées et VPN maillé
- Utilisation de **Headscale** (implémentation self-hosted de Tailscale) pour relier plusieurs nœuds (Raspberry Pi, serveurs distants) via VPN maillé WireGuard.
- Synchronisation de fichiers et configuration avec **Syncthing** ou **IPFS**.
- Mise en place de tunnels sécurisés pour exposer certains services (ex. via DuckDNS ou Cloudflare Tunnel).

## 9.3 Roadmap et évolutions prévues
- Étendre le bot à d’autres serveurs Discord de partenaires.
- Automatiser la documentation avec Sphinx et hébergement sur site statique.
- Intégrer des tests end-to-end avec Playwright ou Selenium pour valider le comportement du bot.

## 9.4 Troubleshooting
- Problèmes fréquents :
  - Erreur de token Discord → vérifier `.env` et permissions dans le portail développeur Discord.
  - Docker ne démarre pas → vérifier l’espace disque et les logs (`docker logs <container>`).
  - Gitea inaccessible → vérifier `docker ps` et le port 3000.
- Stratégie : garder un journal des interventions et solutions.

---

# 10. Glossaire
- **GLO** : Gratuit, Libre, Open-source.
- **CI/CD** : Intégration Continue / Déploiement Continu.
- **Runner** : Agent qui exécute les jobs d’un pipeline CI/CD.
- **Vault** : Gestionnaire de secrets sécurisé.
- **Uptime-Kuma** : Outil de monitoring de disponibilité.

---

# 11. FAQ
**Q : Peut-on héberger le bot sur autre chose qu’un Raspberry Pi ?**
R : Oui, tout serveur Linux avec Docker peut convenir, y compris des VPS.

**Q : Comment mettre à jour le bot sans interruption ?**
R : Utiliser un déploiement bleu/vert ou rolling update dans Docker Compose ou Kubernetes.

**Q : Peut-on gérer plusieurs bots sur le même Pi ?**
R : Oui, via plusieurs conteneurs Docker distincts, chacun avec son `.env` et ses ports.

---

# 12. Sources & bibliographie
- Documentation Discord API : https://discord.dev
- Docker Docs : https://docs.docker.com/
- Gitea Docs : https://docs.gitea.io/
- Woodpecker CI : https://woodpecker-ci.org/
- Headscale : https://headscale.net/

---

# 13. Crédits & historique des versions
- **Sébastien Baudoux** : Chef de projet, intégration technique.
- **ChatGPT (OpenAI)** : Co-rédaction et structuration technique.
- Versions :
  - v1.0 : Première version complète avec déploiement initial et CI/CD.
  - v1.1 : Ajout section FFJ, monitoring, sécurité avancée.
  - v1.2 : Finalisation annexes, glossaire, FAQ.



