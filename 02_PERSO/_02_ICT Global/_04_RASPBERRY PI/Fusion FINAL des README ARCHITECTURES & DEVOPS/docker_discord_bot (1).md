# README - Architecture Dockerisée Avancée pour un Bot Discord Python Auto-hébergé avec CI/CD Léger

Ce document propose une architecture complète et sécurisée pour le déploiement continu d’un **bot Discord écrit en Python**, encapsulé dans un conteneur **Docker monolithique**, orchestré sur un **Raspberry Pi auto-hébergé**. L’infrastructure repose sur un mécanisme **CI/CD autonome** déclenché par webhook via **Gitea** (ou GitHub), avec possibilité d’évolution vers une architecture multi-conteneurs gérée via **Docker Compose**, intégrant monitoring, reverse proxy et supervision système.

---

## 🧭 Objectifs Structurants

- Déploiement automatique à chaque `git push` (Gitea ou GitHub).
- Redémarrage automatique du bot en cas de plantage ou de redéploiement.
- Supervision Web via une API FastAPI : uptime, version du commit, état du service.
- Logging persistant pour audit et débogage.
- Volumes Docker dédiés pour la conservation des données du bot.
- Conteneurisation intégrale pour garantir l’isolation des services et la portabilité.

---

## 🧱 Architecture Interne du Conteneur Docker

| Élément                | Description détaillée                                                                                   |
|------------------------|---------------------------------------------------------------------------------------------------------|
| `bot.py`               | Logique métier du bot Discord (connexion, événements, commandes, gestion de logs, etc.)                 |
| `deploy.sh`            | Script de redéploiement : `git pull` puis redémarrage supervisé du bot                                  |
| `webhook_listener.py` | Serveur FastAPI recevant les requêtes POST des webhooks Git (Gitea ou GitHub)                          |
| `supervisord.conf`     | Configuration du gestionnaire de processus supervisés dans le conteneur                                 |
| `status_api.py`        | Endpoint FastAPI exposant `/status`, `/ping`, `/commit`                                                 |

---

## 🧰 Technologies et outils utilisés

- **Python 3.11** : Langage du bot et de l’API de monitoring
- **FastAPI** : Framework moderne et typé, plus performant que Flask pour l’asynchrone
- **Supervisor** : Surveillance des processus critiques dans le conteneur
- **Docker** : Conteneurisation des services (bot, webhook, monitoring)
- **Gitea (ou Gogs)** : Dépôt Git auto-hébergé, remplace GitHub si souhaité
- **NGINX ou Traefik** : Reverse proxy HTTPS pour sécuriser l’interface Web
- **Prometheus & Grafana** (optionnel) : Monitoring avancé, métriques système et uptime

---

## 📡 Comparaison Gitea vs Gogs

| Critère            | Gitea                                     | Gogs                                |
|--------------------|--------------------------------------------|--------------------------------------|
| Langage            | Go                                         | Go                                   |
| Interface Web      | Moderne, complète                          | Plus minimaliste                     |
| Activité projet    | Très active                                | Moins maintenu                       |
| Compatibilité CI   | Webhook, API REST, tokens personnels       | Webhook, mais moins flexible         |

**Recommandation** : *Gitea*, plus riche, actif et évolutif, mieux adapté pour un projet CI/CD personnel.

### 📦 Installation de Gitea

```bash
mkdir -p ~/gitea/data
docker run -d --name gitea \
  -p 3000:3000 -p 222:22 \
  -v ~/gitea/data:/data \
  gitea/gitea:latest
```

Accéder à http://localhost:3000 et suivre l’assistant pour initialiser le dépôt et configurer le webhook.

---

## 📁 Arborescence détaillée du projet

```
mon-bot-discord/
├── bot/
│   └── bot.py                         # Code principal
├── deploy.sh                         # Script déploiement
├── webhook_listener.py               # Webhook (FastAPI)
├── status_api.py                     # API de monitoring
├── Dockerfile                        # Image Docker
├── supervisord.conf                  # Supervision processus
├── requirements.txt                  # Dépendances
├── .env                              # Secrets/env vars
└── data/                             # Volume persistant
```

---

## 🐳 Dockerfile (extrait)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
VOLUME ["/app/data"]
CMD ["supervisord", "-c", "/app/supervisord.conf"]
```

---

## ⚙️ `supervisord.conf`

```ini
[supervisord]
nodaemon=true

[program:bot]
command=python /app/bot/bot.py
autorestart=true
stdout_logfile=/app/data/bot.log

[program:webhook]
command=python /app/webhook_listener.py
autorestart=true
stdout_logfile=/app/data/webhook.log

[program:status]
command=python /app/status_api.py
autorestart=true
stdout_logfile=/app/data/status.log
```

---

## 🔁 `deploy.sh`

```bash
#!/bin/bash
cd /app || exit
echo "[INFO] Pull latest commit..."
git pull
echo "[INFO] Restarting bot..."
supervisorctl restart bot
```

---

## 🚦 `webhook_listener.py` (FastAPI)

```python
from fastapi import FastAPI, Request
import subprocess

app = FastAPI()

@app.post("/webhook")
async def webhook(req: Request):
    subprocess.Popen(["/bin/bash", "/app/deploy.sh"])
    return {"status": "deploy triggered"}
```

## 📊 `status_api.py`

```python
from fastapi import FastAPI
import os, time, subprocess

app = FastAPI()
START_TIME = time.time()

@app.get("/ping")
def ping():
    return {"status": "pong"}

@app.get("/uptime")
def uptime():
    return {"uptime": round(time.time() - START_TIME, 2)}

@app.get("/commit")
def commit():
    commit_hash = subprocess.getoutput("git rev-parse HEAD")
    return {"commit": commit_hash}
```

---

## 🔐 Sécurisation et Accès HTTPS

- Mise en place de NGINX comme reverse proxy :
  - rediriger `/webhook`, `/status`, `/ping`, `/commit`
  - certificat TLS via Let’s Encrypt ou DNS challenge
- Ajout d’une clé secrète dans les webhooks : vérification `X-Hub-Signature`
- Filtrage des IP autorisées dans le firewall (optionnel)

---

## 🔭 Monitoring avec Prometheus + Grafana (optionnel)

Exporter les métriques (logs, uptime, erreurs) via endpoint `/metrics`, puis connecter à Prometheus, avec visualisation dans Grafana.

---

## 📦 Docker Compose (architecture multi-conteneurs)

```yaml
version: "3"
services:
  bot:
    build: .
    volumes:
      - ./data:/app/data
    ports:
      - "5000:5000"  # Webhook
      - "8000:8000"  # Status API

  nginx:
    image: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## 📚 Bonnes pratiques et recommandations

- Ne redémarrer **que le bot** après un push (`supervisorctl restart bot`)
- Ne jamais exposer directement `/webhook` sans authentification/signature
- Isoler chaque composant dans un conteneur distinct à l’échelle (reverse proxy, bot, webhook, statut)
- **Stocker le dépôt Git (Gitea)** sur le même hôte que le bot pour éviter la dépendance à GitHub

---

> Cette architecture représente un compromis entre légèreté, sécurité, autonomie et extensibilité. Le Raspberry Pi devient ainsi un orchestrateur autonome capable d'héberger durablement des bots Discord robustes et audités.

