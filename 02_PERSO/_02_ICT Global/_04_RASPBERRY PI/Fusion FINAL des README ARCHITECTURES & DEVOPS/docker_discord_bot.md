# README - Architecture Dockerisée Avancée pour un Bot Discord en Python avec Intégration CI/CD Léger sur Infrastructure Auto-hébergée

Ce document vise à exposer en détail la conception, la mise en œuvre et l'orchestration complète d'un **bot Discord écrit en Python**, encapsulé dans un environnement **Docker monolithique** et exécuté sur un **Raspberry Pi auto-hébergé**. L'ensemble repose sur un pipeline d'intégration et de déploiement continu (CI/CD) déclenché via **webhook GitHub**. L'objectif est de fournir un service résilient, maintenable, extensible et sécurisable à faible coût matériel.

---

## 🧭 Objectifs Structurants

- Déploiement automatique à chaque `git push` sur le dépôt GitHub distant.
- Redémarrage automatique du bot en cas de plantage ou de redéploiement.
- Exposition d'une interface web minimale permettant la supervision du statut du bot.
- Centralisation des logs persistants pour audit et débogage.
- Isolation stricte des dépendances et de l’environnement d’exécution grâce à Docker.

---

## 🧱 Architecture Interne du Conteneur Docker

| Élément                   | Description détaillée                                                                                   |
|---------------------------|----------------------------------------------------------------------------------------------------------|
| `bot.py`                  | Contient l’ensemble de la logique du bot Discord (connexion, événements, commandes, etc.)               |
| `deploy.sh`               | Script shell exécuté par webhook : effectue un `git pull` et redémarre le bot via Supervisor           |
| `webhook_listener.py`     | Application Flask minimaliste recevant les requêtes POST envoyées par GitHub Webhooks                  |
| `supervisord.conf`        | Fichier de configuration de Supervisor, utilisé pour superviser et relancer les processus critiques     |

---

## 🧰 Technologies et outils utilisés

- **Python 3.11** : Langage principal du projet (bot et serveur webhook).
- **Flask** : Microframework Python utilisé comme point d'entrée HTTP (webhook GitHub + monitoring futur).
- **Supervisor** : Outil robuste de gestion de processus supervisés.
- **Docker / Docker Compose** : Conteneurisation de l’environnement d’exécution, favorise la portabilité et l’hygiène logicielle.
- **Git + SSH** : Synchronisation sécurisée avec le dépôt GitHub.

---

## 🖥️ Hypothèses sur le système hôte (Raspberry Pi)

- Clé SSH configurée pour un accès sans mot de passe (public key déployée dans GitHub).
- Présence de Docker CE + Docker Compose.
- Accès Internet sortant depuis le Pi pour faire des `git pull` (HTTPS ou SSH).
- Exposition des ports nécessaires :
  - `5000/tcp` : serveur Flask (webhook GitHub)
  - `8080/tcp` : monitoring local (non implémenté actuellement)

---

## 📁 Arborescence détaillée du projet

```
mon-bot-discord/
├── bot/
│   └── bot.py                         # Code source principal du bot
├── deploy.sh                         # Script de déploiement
├── webhook_listener.py               # Serveur Flask minimaliste
├── Dockerfile                        # Image Docker personnalisée
├── supervisord.conf                  # Configurateur de processus
├── requirements.txt                  # Dépendances Python
├── .env                              # Variables d’environnement
└── data/                             # Volume Docker pour les logs persistants et les fichiers créés par le bot
```

---

## 🐳 Dockerfile (Extrait avec commentaires)

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
```

---

## 🔁 Script de Déploiement : `deploy.sh`

```bash
#!/bin/bash
cd /app || exit

echo "[INFO] Pulling latest code..."
git pull

supervisorctl restart bot
```

Ce script est appelé à chaque fois qu’un `push` est détecté par le webhook GitHub.

---

## 📡 `webhook_listener.py`

```python
from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def webhook():
    subprocess.Popen(["/bin/bash", "/app/deploy.sh"])
    return "OK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```


---

## 🔐 Sécurisation minimale

- Vérification possible du header `X-Hub-Signature-256` fourni par GitHub
- Authentification HTTP à prévoir pour exposer `/webhook` ou `/status`
- Idéalement à combiner avec un pare-feu réseau filtrant IP et ports

---

## 🔄 Alternatives Architecturales (facultatives)

- Utilisation de **Gitea** ou **Gogs** : dépôt Git auto-hébergé, idéal pour usage en LAN
- Remplacement de Flask par **FastAPI** pour évolutivité
- Remplacement de Supervisor par **PM2** ou **Systemd**, bien que Supervisor reste plus portable dans un conteneur

---

## 🛠️ Monitoring, journalisation, maintenance

```bash
# Logs en temps réel
sudo docker logs <nom_du_conteneur> --follow

# Redémarrer le bot uniquement (si supervisé)
sudo docker exec -it <nom_du_conteneur> supervisorctl restart bot

# Accéder aux fichiers créés par le bot
cd /var/lib/docker/volumes/<volume_id>/_data/
```

---

## 📦 Suggestions futures d’amélioration

- Ajout d’un reverse proxy (NGINX ou Traefik) + HTTPS
- Page Flask avec statut du bot (ping / up-time / version du commit)
- Intégration avec un outil de supervision comme Prometheus/Grafana
- Passage à une architecture multi-conteneurs via Docker Compose si montée en charge

---

> Ce système est une excellente base pour auto-héberger un bot Discord de manière sécurisée, modulaire et extensible, tout en gardant le contrôle complet de la chaîne de déploiement.

Souhaitez-vous générer tous les fichiers nécessaires dans une archive ZIP ou souhaitez-vous une génération ligne par ligne ici-même ?

