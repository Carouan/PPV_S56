# Déploiement professionnel et automatisé d’un bot Discord Python sur Raspberry Pi avec CI/CD

Ce guide vise à proposer une méthodologie robuste, évolutive et reproductible pour déployer un bot Discord écrit en Python sur une infrastructure de type Raspberry Pi. L’accent est mis sur l’automatisation à l’aide d’outils de supervision (`pm2`), d’un serveur Git auto-hébergé (Gitea) et d’un pipeline CI/CD minimaliste (Woodpecker). L’ensemble du flux est conçu pour faciliter les mises à jour, les tests et la maintenance dans un environnement contrôlé.

---

## 1. Préparation de l’environnement Python sur Raspberry Pi

### Objectif et contexte
Nous souhaitons déployer un bot Discord auto-hébergé sur une infrastructure modeste mais stable. Le Raspberry Pi est un excellent candidat à cet usage. Cette étape prépare un environnement isolé avec `venv` et des dépendances à jour pour éviter tout conflit de version ou de permission.

### Configuration du réseau et du projet
Assurez-vous que le Raspberry Pi est bien connecté à Internet, avec une IP statique ou un service de redirection dynamique comme DuckDNS. Cela permettra aux outils comme Gitea ou Woodpecker de communiquer efficacement.

Structure initiale :
```bash
mkdir -p ~/bots/discord-bot
cd ~/bots/discord-bot
```

### Installation des dépendances système
```bash
sudo apt update && sudo apt install -y python3 python3-pip python3-venv git build-essential
```

### Mise en place de l’environnement virtuel Python
```bash
python3 -m venv venv
source venv/bin/activate
```

### Installation des bibliothèques nécessaires
```bash
pip install -U discord.py python-dotenv
```

Créez un fichier `.env` pour les secrets :
```env
DISCORD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2. Déploiement manuel et validation fonctionnelle

### Clonage du dépôt de code
```bash
git clone https://github.com/monutilisateur/discord-bot.git .
```

### Chargement sécurisé de la configuration
Dans `main.py` :
```python
from dotenv import load_dotenv
import os

load_dotenv()
token = os.getenv("DISCORD_TOKEN")
```

### Exécution manuelle de test
```bash
python main.py
```
Vérifiez que le bot se connecte et réagit aux commandes prévues.

---

## 3. Supervision automatique avec `pm2`

### Pourquoi utiliser `pm2` ?
- Redémarrage automatique en cas de plantage
- Persistance entre les reboots
- Logs centralisés

### Installation
```bash
sudo apt install -y npm
sudo npm install -g pm2
```

### Lancement avec `pm2`
```bash
pm2 start venv/bin/python --name "discord-bot" -- main.py
pm2 save
pm2 startup
```

Suivez les instructions de `pm2 startup` pour activer le service au démarrage.

### Logs temps réel
```bash
pm2 logs discord-bot
```

---

## 4. Intégration continue avec Gitea et Woodpecker CI

### Mise en place de Gitea
[Gitea](https://gitea.io) est une alternative légère à GitHub/GitLab auto-hébergeable, idéale pour Raspberry Pi.

- Installation (paquet ou Docker)
- Création du dépôt `discord-bot`
- Configuration du remote local :
```bash
git remote add origin https://monserveur/git/monutilisateur/discord-bot.git
git push -u origin main
```

### Mise en place de Woodpecker CI
Woodpecker est une solution CI/CD compatible Gitea, très légère et simple à déployer. Elle exécute des pipelines déclaratifs définis dans `.woodpecker.yml`.

#### Étapes de déploiement
1. Déployer `woodpecker-server` et `woodpecker-agent` (via Docker ou binaire).
2. Relier Gitea à Woodpecker via OAuth.
3. Activer les webhooks dans Gitea pour que chaque push déclenche le pipeline.

#### Exemple de pipeline YAML
```yaml
pipeline:
  deploy:
    image: python:3.11
    commands:
      - git clone https://monserveur/git/monutilisateur/discord-bot.git
      - cd discord-bot
      - pip install -r requirements.txt
      - pm2 restart discord-bot || pm2 start venv/bin/python --name "discord-bot" -- main.py
```

Chaque `git push` sur la branche `main` déclenche le pipeline de mise à jour automatique.

### Option : notification dans Discord via webhook
```bash
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"content": "✅ Déploiement terminé avec succès."}' \
     https://discord.com/api/webhooks/xxx/yyyy
```

---

## 5. Perspectives et améliorations futures

Cette base peut être enrichie par :
- une conteneurisation complète avec Docker Compose,
- des tests automatisés avant chaque déploiement,
- une infrastructure déployée via Ansible,
- l’intégration d’un système de rollback en cas d’échec,
- l’usage de GitHub Actions en parallèle de Woodpecker pour du CI hybride.

---

## Conclusion
Cette documentation propose une architecture cohérente pour développer, tester et déployer un bot Discord Python de manière professionnelle et auto-hébergée. Grâce à des outils libres comme Gitea et Woodpecker, le Raspberry Pi devient un véritable nœud DevOps, permettant une mise en production continue avec un minimum de ressources.

Cette solution est idéale pour des projets open-source, éducatifs ou personnels à faible coût, tout en respectant les meilleures pratiques industrielles.

