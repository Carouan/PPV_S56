# 🤖 Déploiement professionnel GLO d’un Bot Discord sur Raspberry Pi

> **Projet : Coalition FFJ (Femmes de Droit) — Exemplarité DevOps GLO**\
> *Auteur(s) : Sébastien Baudoux & ChatGPT (co-création, 2024-2025)*

---

## 🗂️ Table des matières

1. [Introduction et contexte](#introduction-et-contexte)
2. [Prérequis techniques](#prérequis-techniques)
3. [Présentation de l’architecture cible](#présentation-de-larchitecture-cible)
4. [Déploiement initial du bot Discord](#déploiement-initial-du-bot-discord)
5. [Installation et configuration de Gitea (Git auto-hébergé)](#installation-et-configuration-de-gitea-git-auto-hébergé)
6. [À suivre…](#à-suivre)

---

# 1. Introduction et contexte

🎯 **Objectif** :\
Ce document vise à guider, de façon exhaustive et pragmatique, le **déploiement d’un bot Discord professionnel sur un Raspberry Pi**, en s’appuyant uniquement sur des solutions **GLO** (Gratuites, Libres, Open-source) pour maximiser la souveraineté numérique, l’apprentissage, la reproductibilité et la résilience.

🔬 **Contexte** :

- **Projet concret** : bot Discord pour la *Coalition FFJ*, utilisé dans le cadre associatif *Femmes de Droit* (FDD).
- **Problème initial** : le bot était hébergé sur *Railway*, solution cloud performante mais payante et propriétaire, avec des limites d’utilisation et un risque d’interruption.
- **Démarche** : migrer vers un auto-hébergement *Raspberry Pi*, dans une logique de montée en compétences (CV, freelance), de maîtrise des coûts, et d’exemplarité DevOps/GLO.

🚩 **Enjeux & ambitions** :

- Obtenir une stack “production ready” : sécurité, fiabilité, CI/CD, monitoring, rollback, documentation, tests, etc.
- Être réplicable par d’autres associations, ou scalable pour d’autres usages (bots, sites, outils…).
- Avoir un socle technique qui pourra évoluer (multi-bots, multi-services, archi distribuée…).

---

# 2. Prérequis techniques

## ⚙️ Matériel

| 🔧 Matériel      | Spécifications minimales                             | Conseils                       |
| ---------------- | ---------------------------------------------------- | ------------------------------ |
| Raspberry Pi     | 3B+, 4 ou sup., 2 Go RAM min. (4-8 Go recommandé)    | Boîtier ventilé, dissipateur   |
| Stockage         | MicroSD 16 Go min (préférer SSD/USB ou SD A2 32 Go+) | SD de qualité, backups         |
| Alimentation     | Officielle, 2.5A min, éviter les chargeurs low cost  | Vérifier les messages d’erreur |
| Connexion réseau | Ethernet recommandé (Wi-Fi OK mais moins stable)     | IP fixe ou réservation DHCP    |

## 💻 Logiciels et outils à préparer

| Logiciel/outil          | Version/conseil                                             |
| ----------------------- | ----------------------------------------------------------- |
| OS (Raspberry Pi)       | Raspberry Pi OS Lite (Bullseye/Bookworm), ou Debian minimal |
| Python                  | 3.9+ (idéalement la dernière stable)                        |
| Docker & Docker Compose | Dernières versions ARM compatibles                          |
| Git                     | Dernière version stable                                     |
| Un éditeur de texte     | nano, vim, VSCode, ou équivalent                            |

## 🔑 Prérequis compte & accès

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

Voici un **aperçu de la stack finale**, sous forme de diagramme Mermaid :

```mermaid
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
```

### **Composants majeurs**\*\*

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

   - Télécharger Raspberry Pi OS Lite : [https://www.raspberrypi.com/software/operating-systems/](https://www.raspberrypi.com/software/operating-systems/)
   - Utiliser **Raspberry Pi Imager** ou **balenaEtcher** pour flasher la microSD/SSD
   - Booter, configurer la locale, clavier, réseau, SSH activé

2. **Sécurisation immédiate**

   - Changer le mot de passe (`passwd`)
   - Générer/installer votre clé SSH (`ssh-keygen -t ed25519`)
   - (Optionnel) Désactiver le login par mot de passe dans `/etc/ssh/sshd_config` (`PasswordAuthentication no`)
   - Mettre à jour le système (`sudo apt update && sudo apt upgrade -y`)

3. **Installer Python, Git et outils de base**

   ```bash
   sudo apt install -y python3 python3-pip git
   ```

## 🐳 **Étape 2 — Installation de Docker**

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Se déconnecter/reconnecter pour appliquer le groupe
```

**Vérifier Docker**

```bash
docker run hello-world
```

Installer Docker Compose (si besoin) :

```bash
sudo apt install -y docker-compose
```

*(ou version officielle si besoin de la dernière version ARM)*

## 📂 **Étape 3 — Préparer le code du bot Discord**

1. **Créer ou cloner le dépôt (recommandé : Gitea auto-hébergé)**

   ```bash
   git clone <url-depot-gitea-ou-github>
   cd <dossier-bot>
   ```

2. **Configurer le bot**

   - Copier le `.env.example` → `.env` et renseigner :
     ```
     DISCORD_TOKEN=xxxxxxxxx
     EMAIL_ADDRESS=xxx@xxx
     EMAIL_PASSWORD=xxxxxx
     ...
     ```

3. **Premier test en local (hors Docker)**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python bot/core.py
   ```

   - Vérifier que le bot apparaît en ligne sur Discord.
   - Corriger les éventuelles erreurs de dépendances/module.

## 🐋 **Étape 4 — Dockerisation du bot**

1. \*\*Vérifier/Adapter le \*\*\`\`

   Exemple typique :

   ```Dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["python", "bot/core.py"]
   ```

2. **Construire et lancer le conteneur localement**

   ```bash
   docker build -t botdiscord .
   docker run --env-file .env botdiscord
   ```

   - Vérifier que le bot fonctionne bien en conteneur.

3. \*\*(Optionnel) Créer un \*\*\`\` Pour automatiser la base :

   ```yaml
   version: '3'
   services:
     botdiscord:
       build: .
       env_file: .env
       restart: unless-stopped
   ```

   ```bash
   docker compose up -d
   ```

---

## ✅ **Contrôles post-install**

- Le bot s’affiche bien comme “en ligne” sur Discord ?
- Les logs dans Docker (`docker logs <container>`) sont propres ?
- Les variables d’environnement sont bien prises en compte ?
- La machine est à jour et le port SSH n’est pas ouvert sur Internet ?

---

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

---

## 🚦 **Prêt pour la suite : Pipeline CI/CD et automatisation complète !**

---

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

1. **Commit & push sur Gitea**\
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
  - **URL** du serveur cible (Raspberry Pi), ex :\
    `http://<IP-Pi>:8888/git-webhook`
  - Événements : *Push events* (optionnel : tag, release, PR, etc.)

---

#### **B. Mettre en place un “Git Webhook Receiver” sur le Pi**

Plusieurs choix :

- **Script Bash custom** simple (pour usage minimaliste et reproductible)
- **Serveur Python (FastAPI/Flask) léger**
- **Web service dédié (ex : Gitea Actions, Woodpecker, Forgejo Actions…)**

##### **Exemple minimaliste : mini serveur Flask recevant le webhook**

```python
# webhook_receiver.py
from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/git-webhook', methods=['POST'])
def handle_webhook():
    # Optionnel : vérifier la signature du webhook pour sécurité
    subprocess.Popen(["/home/pi/scripts/deploy_bot.sh"])
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)
```

- À lancer en tâche de fond ou via systemd.

##### **Exemple de script de déploiement déclenché par le webhook**

```bash
#!/bin/bash
set -e

cd /home/pi/bot-discord-ffj/
git pull origin main

docker compose down || true
docker compose build
docker compose up -d

# Logging (optionnel)
date >> /home/pi/deploy.log
echo "Déploiement OK" >> /home/pi/deploy.log
```

- À adapter selon l’emplacement du code et le nom du repo.
- **Permission d’exécution** : `chmod +x /home/pi/scripts/deploy_bot.sh`
- Ce script peut aussi envoyer une notif en cas d’échec (`mail`, Discord webhook…)

---

#### **C. Sécurisation du webhook**

- Restreindre les IPs autorisées à accéder au port 8888 (UFW/iptables)
- (Recommandé) Activer la **vérification de la signature HMAC** du webhook Gitea (secret partagé)

---

#### **D. Alternatives GLO plus évoluées (optionnelles)**

- **Woodpecker CI** ([site officiel](https://woodpecker-ci.org/)) : pipeline YAML, runners ARM, intégration facile avec Gitea
- **Forgejo Actions / Drone CI** : pipelines natifs Gitea/Forgejo

*Exemple de pipeline Woodpecker (yaml simplifié)*

```yaml
pipeline:
  build:
    image: python:3.11-slim
    commands:
      - pip install -r requirements.txt
      - pytest
      - docker build -t botdiscord .
      - docker compose up -d
```

- Nécessite installation de Woodpecker serveur & agent sur le Pi.
- Permet étapes de tests, build, déploiement, rollback, notifications, logs détaillés…

---

### 6.3 **Rollback et fiabilisation**

- **Revenir rapidement** à une version précédente :
  - Garder les anciennes images Docker (`docker images`)
  - Utiliser les tags Git pour versionner
  - Ajouter un script “rollback.sh” qui relance l’ancienne image en cas d’échec du build

---

### 6.4 **Surveillance & logs du pipeline**

- Stocker les logs de build/déploiement (`deploy.log`)
- (Optionnel) Pousser les logs vers Grafana/Loki, ou les résumer sur Discord par webhook

---

### 6.5 **Checklist déploiement automatisé**

-

---

# 7. Monitoring, supervision et sécurité avancée

(À compléter dans la prochaine étape !)

