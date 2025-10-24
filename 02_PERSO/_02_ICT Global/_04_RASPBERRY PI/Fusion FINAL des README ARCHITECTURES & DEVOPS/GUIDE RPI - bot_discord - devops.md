# 📦 Déploiement automatisé d’un bot Discord Python sur Raspberry Pi (GLO)

> **Version intégrée** : Guide détaillé + README + fonctionnalités du bot + réflexions projet

---

## 1. Objectif

Ce projet met en œuvre un **bot Discord Python** déployé de façon **conteneurisée** sur **Raspberry Pi**, avec une **CI/CD automatisée** et supervision intégrée. Il s'inscrit dans une logique **GLO** (Gratuit, Libre, Open-source) pour favoriser la **portabilité**, la **reproductibilité**, et l’**efficacité DevOps**.

Il combine à la fois un environnement DevOps robuste et une logique fonctionnelle riche adaptée aux besoins d'une communauté scolaire ou associative.

---

## 2. Stack technique utilisée

- **Langage** : Python 3.11 (`discord.py`, `python-dotenv`, etc.)
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : Woodpecker CI (libre, connecté à Gitea ou GitHub)
- **Supervision** : Uptime Kuma + Webhook Discord
- **Interface Admin (optionnelle)** : NiceGUI
- **Tests** : `unittest`, intégration continue
- **Documentation** : Sphinx, fichiers Markdown

---

## 3. Fonctionnalités du bot Discord

Le bot est conçu pour améliorer la gestion et la communication d’un serveur Discord collaboratif, avec des fonctionnalités orientées **résumés, intégration mail, surveillance** et **automation**.

### 🔁 Résumés et veille

- Résumé quotidien automatique des messages postés dans les canaux importants
- Exclusion de certains canaux via une liste de filtrage (`excluded_channels.txt`)
- Possibilité de déclencher manuellement un résumé avec une commande `!resume`
- Résumés stockés dans `data/daily_summary.txt`

### 📧 Gestion de mails

- Génération automatique d’un rapport de messages clés à envoyer par mail (ex : newsletter ou synthèse hebdo)
- Fichier `mails_management.py` gère la création de ces rapports depuis les canaux listés comme `important`

### 📂 Gestion des fichiers et canaux

- Lecture et parsing de fichiers texte (liste de canaux, config) via `file_utils.py`
- Commandes disponibles pour consulter ou modifier dynamiquement les listes (`channel_lists.py`)

### 🔧 Commandes principales

- `!resume` : génère et envoie un résumé du jour
- `!listchannels` : liste les canaux actifs surveillés
- `!excludethis` / `!include` : ajoute/retire un canal de la liste d’exclusion
- `!report` : compile un rapport des activités du jour/semaines

### ✅ Supervision

- Le service **Uptime Kuma**, déployé en conteneur, vérifie en continu la disponibilité du bot et des services critiques. Il peut envoyer des alertes personnalisées via webhook Discord, mail, Telegram, etc.
- Historique des pannes, durées d'interruptions, et métriques disponibles via l'interface web locale (`localhost:3001`).
- Supervision éventuellement étendue à d'autres services comme Gitea, Woodpecker ou NiceGUI.

---

## 4. Arborescence du projet

```
.
├── .github/
│   └── workflows/
├── bot/
│   ├── core.py
│   ├── discord_bot_commands.py
│   ├── env_config.py
│   ├── file_utils.py
│   ├── mails_management.py
│   ├── summarizer.py
│   ├── channel_lists.py
│   └── tests_functions.py
├── data/
│   ├── channels.txt
│   ├── daily_summary.txt
│   ├── excluded_channels.txt
│   └── important_channels.txt
├── tests/
│   ├── test_bot_commands.py
│   ├── test_bot_integration.py
│   ├── test_env.py
│   ├── test_channel_lists.py
│   └── test_mails.py
├── Dockerfile
├── docker-compose.yml
├── .woodpecker.yml
├── README.md
├── roadmap.md
├── TROUBLESHOOTING.md
└── requirements.txt
```

---

## 5. Dockerisation du bot

### Dockerfile

```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

### docker-compose.yml (multi-services)

```yaml
version: '3.8'
services:
  bot:
    build: ./bot
    env_file: ./bot/.env
    restart: always

  gitea:
    image: gitea/gitea:latest
    volumes:
      - ./data/gitea:/data
    ports:
      - "3000:3000"
      - "222:22"
    restart: always

  woodpecker-server:
    image: woodpeckerci/woodpecker-server:latest
    environment:
      - WOODPECKER_OPEN=true
      - WOODPECKER_GITEA=true
      - WOODPECKER_GITEA_URL=http://gitea:3000
      - WOODPECKER_GITEA_CLIENT=xxx
      - WOODPECKER_GITEA_SECRET=yyy
    volumes:
      - ./data/woodpecker:/var/lib/woodpecker
    ports:
      - "8000:8000"
    restart: always

  woodpecker-agent:
    image: woodpeckerci/woodpecker-agent:latest
    environment:
      - WOODPECKER_SERVER=woodpecker-server:9000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always

  uptime-kuma:
    image: louislam/uptime-kuma:latest
    ports:
      - "3001:3001"
    volumes:
      - ./monitoring/uptime-kuma:/app/data
    restart: always
```

---

## 5. Pipeline CI/CD (.woodpecker.yml)

```yaml
pipeline:
  test:
    image: python:3.11
    commands:
      - pip install -r bot/requirements.txt
      - python -m unittest discover -s bot

  deploy:
    image: docker:cli
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    commands:
      - docker compose down
      - docker compose build
      - docker compose up -d
```

---

## 6. Script Bash d’installation rapide

```bash
#!/bin/bash

sudo apt update && sudo apt install -y docker.io docker-compose git

git clone https://github.com/monutilisateur/discord-bot.git
cd discord-bot

sudo docker compose up -d --build
```


---

## 8. Supervision (Uptime Kuma)

- Accessible via `http://localhost:3001`
- Interface claire, configurable et mobile-friendly
- Création de "moniteurs" avec choix du protocole (HTTP, TCP, ping, etc.)
- Notifications configurables (Discord webhook, email, Telegram, Gotify, etc.)
- Historique des incidents, export des journaux
- Surveillance étendue possible à tout autre service Docker

Webhook Discord test :

```bash
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"content": "✅ Déploiement terminé."}' \
     https://discord.com/api/webhooks/xxx/yyyy
```

---

## 9. Interface web optionnelle (NiceGUI)

- Permet une interface graphique d’administration exécutée en local ou via conteneur
- L’interface expose certaines actions critiques en tant que **boutons** ou **switches** :
  - ▶️ Redémarrer le bot
  - 📅 Lancer un rapport manuel (mails ou Discord)
  - ⛔️ Activer/désactiver certaines fonctions (résumés, mails, etc.)
  - 🔍 Inspecter les derniers logs ou résumés générés
- Accès protégé par mot de passe ou jeton
- Possibilité de déploiement autonome, proxifié (via Traefik ou NGINX)
- Peut être enrichie par une interface conversationnelle locale (intégration LLM)

Exemple minimal :

```python
from nicegui import ui

@ui.page("/")
def main():
    ui.label("Bot en ligne ✅")
    ui.button("Redémarrer", on_click=restart_bot)
    ui.button("Envoyer rapport", on_click=send_daily_report)

ui.run()
```

Fonctions Python reliées aux actions GUI (dans `core.py` ou un module admin) :

```python
def restart_bot():
    os.system("docker restart bot")

def send_daily_report():
    from bot.mails_management import generate_and_send_report
    generate_and_send_report()
```

---

## 10. Roadmap (extraits)

- Reverse proxy SSL avec Traefik ou Caddy
- Tests unitaires + couverture
- Centralisation des logs (ex. Loki)
- Intégration MQTT/Redis (microservices)
- Panel admin public minimal (NiceGUI)

---

## 11. Résolution de problèmes (TROUBLESHOOTING.md)

- Ports utilisés déjà occupés
- Échec du webhook
- Permissions Docker

---

## 12. Licence et auteur

- **Auteur** : Sébastien Baudoux
- **Licence** : Libre (voir `LICENSE`)

---

## 13. Résumé académique

Cette stack propose un socle rigoureux pour du **prototypage DevOps** sur architecture ARM, avec conteneurisation complète, CI/CD intégré et supervision continue. Elle est **documentée, portable et réplicable**, et constitue une base pour les projets de **gouvernance numérique, IA embarquée ou microservices événementiels**.

Elle respecte les contraintes GLO et favorise une transition vers des infrastructures souveraines, légères et adaptées aux besoins des petites structures ou des expérimentations scientifiques.

