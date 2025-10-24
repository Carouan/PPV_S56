
# 📦 Déploiement automatisé d’un bot Discord Python sur Raspberry Pi (GLO)

## 1. Introduction : 
### Déploiement conteneurisé et automatisé d’un bot Discord Python sur Raspberry Pi avec CI/CD : Approche systémique et reproductible à visée doctorale


Ce document propose une approche avancée, orientée recherche, pour le déploiement automatisé d’un agent Discord écrit en Python sur une architecture ARM comme le Raspberry Pi. L’intégration complète de conteneurs Docker, la mise en œuvre de pipelines CI/CD, ainsi que la supervision continue via des outils libres, font de ce guide un canevas adaptable pour la mise en œuvre de micro services orientés événementiels. L’ensemble respecte les standards des environnements GLO (Gratuits, Libres, Open-source) et répond aux exigences d'une infrastructure de recherche ou de prototypage reproductible.

### 1.2. Objectif

Ce projet met en œuvre un **bot Discord Python** déployé de façon **conteneurisée** sur **Raspberry Pi**, avec une **CI/CD automatisée** et supervision intégrée. Il s'inscrit dans une logique **GLO** (Gratuit, Libre, Open-source) pour favoriser la **portabilité**, la **reproductibilité**, et l’**efficacité DevOps**.

Il combine à la fois un environnement DevOps robuste et une logique fonctionnelle riche adaptée aux besoins d'une communauté scolaire ou associative.



Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list)

Bot discord visant à envoyer un résumé quotidien des messages postés dans le serveur Coalition Feminists for Justice vers une adresse e-mail.
Adresse e-mail : coalition_ffj@femmesdedroit.be  (mailing list gérée sur l'hébergement OVH de FDD)



### 1.2 (bis) 🤖 Bot Discord Python – Déploiement Dockerisé avec CI/CD

Ce projet met en œuvre un bot Discord écrit en Python, déployé de manière totalement conteneurisée avec **Docker** et **Docker Compose**, et maintenu automatiquement à jour via une pipeline CI/CD libre avec **Woodpecker CI**. Il s’intègre dans une architecture GLO (Gratuite, Libre, Open-source), orientée vers la reproductibilité, la supervision et la portabilité.

Doc contenant les secrets : [[Bot - Coalition FFJ]]

---

### 1.3. Architecture générale : fondements et finalité

Le paradigme retenu repose sur l’orchestration de conteneurs par **Docker Compose**, permettant de garantir l’indépendance des services, leur résilience, ainsi que leur interopérabilité. L’architecture vise les objectifs suivants :

- **Intégration continue automatisée** : toute modification apportée au dépôt déclenche un redéploiement sans intervention manuelle.
- **Observabilité native** : chaque composant est supervisé de façon granulaire pour détecter anomalies et interruptions de service.
- **Portabilité et reproductibilité** : l’ensemble de l’environnement est modélisé sous forme déclarative, facilitant le clonage sur tout hôte ARM/Linux.

Les modules suivants sont intégrés :

- **Docker Compose** pour l’agencement des conteneurs.
- **Gitea** (ou GitHub) pour le versionnement distribué.
- **Woodpecker CI** pour la chaîne CI/CD entièrement libre.
- **Uptime Kuma** comme solution d’observabilité légère et efficace.
- **Webhooks Discord** pour l'intégration de feedback utilisateur en temps réel.

---

### 1.4. Stack technique utilisée

- **Langage** : Python 3.11 (`discord.py`, `python-dotenv`, etc.)
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : Woodpecker CI (libre, connecté à Gitea ou GitHub)
- **Supervision** : Uptime Kuma + Webhook Discord
- **Interface Admin (optionnelle)** : NiceGUI
- **Tests** : `unittest`, intégration continue
- **Documentation** : Sphinx, fichiers Markdown




## 2. 🚀 Fonctionnalités du bot Discord

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



## 3. 📁 Arborescence du projet

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
### 3.1. Dépendances du bot

```text
# requirements.txt
discord.py
python-dotenv
```



---

## 4. 🔁 Pipeline CI/CD (Woodpecker)

Le pipeline est défini dans `.woodpecker.yml`. Il :

1. Exécute les tests unitaires (si présents)
2. Reconstruit l’image Docker
3. Redémarre les services automatiquement

Déclenché à chaque `git push` sur le dépôt Gitea.

---
### Orchestration `docker-compose.yml` (multi-services)

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

Cette configuration formalise une infrastructure distribuée en multi-conteneurs, avec résilience intégrée et couplage faible entre les services.

---

## 4.(bis)  Intégration et livraison continues (CI/CD)

### Configuration de pipeline `.woodpecker.yml`

```yaml
pipeline:
  deploy:
    image: docker:cli
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    commands:
      - docker compose down
      - docker compose build
      - docker compose up -d
```

### Chaînage du processus CI/CD

1. **Gitea** déclenche un **webhook** suite à un `git push`.
2. Le **serveur Woodpecker** reçoit la requête, et assigne un job à un **agent CI**.
3. L’agent reconstruit l’image, arrête l’ancienne instance et déploie la nouvelle.
4. Une notification finale peut être émise sur Discord via un webhook REST.

Cette démarche repose sur une boucle de rétroaction continue, essentielle à tout cycle DevOps reproductible.



## 5. 📊 Supervision applicative et notifications

### 5.1 Uptime Kuma comme solution GLO

Uptime Kuma est intégré à l’infrastructure pour fournir une métrique de disponibilité précise. Ses fonctionnalités incluent :

- Tests HTTP, TCP, Ping configurables.
- Alertes configurables par webhook, email, Telegram, etc.
- Historique exportable des incidents pour analyse a posteriori.

- Accessible via `http://localhost:3001`
- Interface claire, configurable et mobile-friendly
- Création de "moniteurs" avec choix du protocole (HTTP, TCP, ping, etc.)
- Notifications configurables (Discord webhook, email, Telegram, Gotify, etc.)
- Historique des incidents, export des journaux
- Surveillance étendue possible à tout autre service Docker

Interface web accessible via : http://localhost:3001

### 5.2 Intégration d’un webhook Discord

```bash
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"content": "✅ Déploiement du bot terminé avec succès."}' \
     https://discord.com/api/webhooks/xxx/yyyy
```

Cela permet de documenter le fonctionnement du processus dans un canal Discord privé ou dédié à la supervision.





## 6. 🧪 Tests unitaires et validation continue

La robustesse du bot peut être renforcée par l'intégration de tests unitaires. Utilisez `unittest` ou `pytest` pour créer des tests automatisés dans un fichier `test_core.py`. Exemple :

```python
import unittest
from unittest.mock import patch
from core import handle_event

class TestBot(unittest.TestCase):
    def test_handle_event(self):
        event = {"type": "MESSAGE_CREATE", "content": "ping"}
        response = handle_event(event)
        self.assertEqual(response, "pong")
```

Ce test peut être intégré dans le pipeline CI avec une étape de test avant le build :

```yaml
pipeline:
  test:
    image: python:3.11
    commands:
      - pip install -r bot/requirements.txt
      - python -m unittest discover -s bot
```

---

## 7. Interface de supervision web personnalisée

Pour exposer des métriques ou logs du bot à l’utilisateur ou à l’administrateur, une interface peut être générée avec **NiceGUI** (GLO). Exemple minimal :

- Permet une interface graphique d’administration exécutée en local ou via conteneur
- L’interface expose certaines actions critiques en tant que **boutons** ou **switches** :
  - ▶️ Redémarrer le bot
  - 📅 Lancer un rapport manuel (mails ou Discord)
  - ⛔️ Activer/désactiver certaines fonctions (résumés, mails, etc.)
  - 🔍 Inspecter les derniers logs ou résumés générés
- Accès protégé par mot de passe ou jeton
- Possibilité de déploiement autonome, proxifié (via Traefik ou NGINX)
- Peut être enrichie par une interface conversationnelle locale (intégration LLM)

```python
from nicegui import ui

@ui.page("/")
def main():
    ui.label("Statut du bot : en ligne ✅")
    ui.button("Redémarrer", on_click=lambda: print("Redémarrage..."))
    ui.button("Envoyer rapport", on_click=send_daily_report)
ui.run()
```

Cette interface peut être intégrée dans `docker-compose.yml` en tant que service supplémentaire accessible sur un autre port.


Fonctions Python reliées aux actions GUI (dans `core.py` ou un module admin) :

```python
def restart_bot():
    os.system("docker restart bot")

def send_daily_report():
    from bot.mails_management import generate_and_send_report
    generate_and_send_report()
```

---



---

## 8. 🐳 Lancer le projet

### 6.1. Cloner le dépôt

```bash
git clone https://github.com/seb-baudoux/discord-bot.git
cd discord-bot
```


### 6.2. Image Docker de l’agent Discord

```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

Ce fichier Dockerfile assure un environnement isolé, optimisé pour ARMv7/v8. Il permet une installation déterministe des dépendances Python, en cohérence avec les bonnes pratiques de la science ouverte.


### 6.3. Lancer la stack Docker

```bash
docker compose up -d --build
```

Les services suivants seront disponibles :

- **Bot Discord** en tâche de fond
- **Woodpecker CI** : http://localhost:8000
- **Uptime Kuma** : http://localhost:3001
- **Gitea (Git)** : http://localhost:3000

---

### 6.4 ✅ Script d’installation (optionnel)

Pour un Raspberry Pi ou serveur fraîchement installé :

```bash
chmod +x init_bot_stack.sh
./init_bot_stack.sh
```

---



Interfaces accessibles :

- **Gitea** → [http://localhost:3000](http://localhost:3000)
- **Woodpecker CI** → [http://localhost:8000](http://localhost:8000)
- **Uptime Kuma** → [http://localhost:3001](http://localhost:3001)




### 6.5. Script Bash d’initialisation

Voici un script `init_bot_stack.sh` permettant d’automatiser le déploiement depuis un Raspberry Pi ou une machine fraîchement installée :

```bash
#!/bin/bash

# Installation des paquets nécessaires
sudo apt update && sudo apt install -y docker.io docker-compose git

# Clonage du projet
git clone https://github.com/monutilisateur/discord-bot.git
cd discord-bot

# Lancement de la stack
sudo docker compose up -d --build
```

Ce script peut être placé dans le dépôt et référencé dans le README.md pour initier rapidement une nouvelle machine ou un nouveau contributeur.

---

## 9. 🛠️ Pistes de développement et amélioration continue - À faire (extrait de roadmap.md)

- Mise en place d’un **reverse proxy** avec Let’s Encrypt (Traefik ou Caddy) pour gestion SSL automatique.
- Ajout de **tests unitaires automatisés** exécutés dans le pipeline CI.
- Centralisation des logs via **Loki + Promtail** (en alternative GLO à ELK).
- Sauvegarde automatisée des volumes Docker (ex. avec Restic).
- Intégration à une **architecture orientée microservices** avec événements MQTT ou Redis.

- Reverse proxy SSL avec Traefik ou Caddy
- Tests unitaires + couverture
- Centralisation des logs (ex. Loki)
- Intégration MQTT/Redis (microservices)
- Panel admin public minimal (NiceGUI)

---
## 10. Conclusion scientifique

Ce dispositif représente une implémentation rigoureuse de pratiques DevOps modernes, intégrant des outils libres dans une logique d'automatisation, d'isolation des services et de portabilité. L’intégration de pipelines CI/CD, la surveillance temps réel et la conteneurisation du code permettent d’envisager des itérations rapides, une haute disponibilité, ainsi qu’un transfert aisé des connaissances et des ressources. Ce guide constitue une base méthodologique pour des travaux de recherche ou de déploiement académique dans les domaines de l’IA embarquée, de l’automatisation distribuée ou de la gouvernance numérique éthique.

## 10.(bis) Résumé académique

Cette stack propose un socle rigoureux pour du **prototypage DevOps** sur architecture ARM, avec conteneurisation complète, CI/CD intégré et supervision continue. Elle est **documentée, portable et réplicable**, et constitue une base pour les projets de **gouvernance numérique, IA embarquée ou microservices événementiels**.

Elle respecte les contraintes GLO et favorise une transition vers des infrastructures souveraines, légères et adaptées aux besoins des petites structures ou des expérimentations scientifiques.

---

## 11. Glossaire, sources et ressources


### 11.1 Gitea 

<table width="400">
  <tr>
    <td colspan="2" align="center">
      <img src="https://about.gitea.com/gitea-text.svg" alt="Logo Gitea" title="Gitea" width="160">
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://gitea.io/" target="_blank" title="https://gitea.io">Site officiel</a></td>
    <td align="center"><a href="https://docs.gitea.com/">Documentation</a></td>
  </tr>
  <tr>
    <td colspan="2" align="left">
      <a href="https://fr.wikipedia.org/wiki/Gitea" target="_blank" title="Wikipédia (fr)">Gitea (W-(fr))</a> : forge libre basée sur Git écrite en Go et sous licence MIT.
      Gitea est un service de développement logiciel tout-en-un, auto-hébergé, proposant hébergement Git, revues de code, collaboration d’équipe, registre de paquets et CI/CD. 
      Fork de <a href="https://gogs.io/">Gogs</a> en 2016, dont la plupart du code a été réécrit. Similaire à GitHub et GitLab.
    </td>
  </tr>
</table>


Gitea is a painless, self-hosted, all-in-one software development service. It includes Git hosting, code review, team collaboration, package registry, and CI/CD. 
It is similar to GitHub, Bitbucket and GitLab.
Gitea was originally forked from [Gogs](https://gogs.io/) and almost all the code has been changed. 
See the [Gitea Announcement](https://blog.gitea.com/welcome-to-gitea/) blog post to read about the justification for a fork.
















### 11.2 Woodpecker

<table width="400">
  <tr>
    <td colspan="2" align="center">
      <img src="https://woodpecker-ci.org/img/logo.svg" alt="Logo Woodpecker CI" title="Woodpecker CI" width="90">
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://woodpecker-ci.org/">Site officiel</a></td>
    <td align="center"><a href="https://woodpecker-ci.org/docs/">Documentation</a></td>
  </tr>
  <tr>
    <td colspan="2" align="left">
      CI/CD open-source léger, extensible et facile à auto-héberger.
      Woodpecker s’intègre avec Gitea et Forgejo, exécute des pipelines dans des conteneurs Docker et prend en charge des workflows multi-plateformes et des plugins personnalisés.
    </td>
  </tr>
</table>



[Woodpecker Docs](https://woodpecker-ci.org/docs/intro) can be used to automatically deploy a Dokku application via the official [dokku/ci-docker-image](https://github.com/dokku/ci-docker-image). 


[woodpecker-ci/woodpecker: Woodpecker is a simple, yet powerful CI/CD engine with great extensibility.](https://github.com/woodpecker-ci/woodpecker)

 Based on docker containers

Woodpecker uses docker containers to execute pipeline steps. If you need more than a normal docker image, you can create plugins to extend the pipeline features.[How do plugins work?](https://woodpecker-ci.org/docs/usage/plugins/overview)




### 11.3 Uptime Kuma

<table width="400">
  <tr>
    <td colspan="2" align="center">
      <img src="https://raw.githubusercontent.com/louislam/uptime-kuma/master/public/icon.svg" alt="Logo Uptime Kuma" title="Uptime Kuma" width="160">
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://uptime.kuma.pet/">Site officiel</a></td>
    <td align="center"><a href="https://github.com/louislam/uptime-kuma/wiki">Documentation</a></td>
  </tr>
  <tr>
    <td colspan="2" align="left">
      Outil de surveillance open-source auto-hébergé.
      Uptime Kuma permet de surveiller des services HTTP, TCP, ping, DNS ou jeux (Steam), de publier une page de statut publique et d’envoyer des alertes via de nombreux canaux (Discord, Telegram, mail, etc.).
    </td>
  </tr>
</table>


### 11.4 🐍 Bibliothèques Python

- ### NiceGUI

<table width="400">
  <tr>
    <td colspan="2" align="center">
      <img src="https://nicegui.io/logo.png" alt="Logo NiceGUI" title="NiceGUI" width="90">
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://nicegui.io/">Site officiel</a></td>
    <td align="center"><a href="https://nicegui.io/documentation">Documentation</a></td>
  </tr>
  <tr>
    <td colspan="2" align="left">
      Framework Python simple pour créer des interfaces web interactives.
      NiceGUI permet de générer des boutons, dialogues, graphiques, scènes 3D, affichage Markdown et plus, directement depuis Python.
    </td>
  </tr>
</table>


- ### unittest

<table width="400">
  <tr>
    <td colspan="2" align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Logo Python unittest" title="unittest" width="160">
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://docs.python.org/3/library/unittest.html">Site officiel</a></td>
    <td align="center"><a href="https://docs.python.org/3/library/unittest.html">Documentation</a></td>
  </tr>
  <tr>
    <td colspan="2" align="left">
      Module standard de test unitaire intégré à Python.
      unittest fournit des classes et méthodes pour définir des cas de test, assertions, suites de tests et découverte automatique, similaire à JUnit en Java.
    </td>
  </tr>
</table>


- ### Sphinx

<table width="400">
  <tr>
    <td colspan="2" align="center">
      <img src="https://www.sphinx-doc.org/en/master/_static/sphinx-logo.svg" alt="Logo Sphinx" title="Sphinx" width="120">
    </td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.sphinx-doc.org/">Site officiel</a></td>
    <td align="center"><a href="https://www.sphinx-doc.org/en/master/">Documentation</a></td>
  </tr>
  <tr>
    <td colspan="2" align="left">
      <a href="https://en.wikipedia.org/wiki/Sphinx_(documentation_generator)">Sphinx — Wikipédia (EN)</a> : générateur de documentation écrit en Python.
      Permet de convertir du reStructuredText en HTML, PDF, ePub, etc. Supporte extensions, thèmes personnalisés, et intégration automatique du code Python (autodoc).
    </td>
  </tr>
</table>


---

## 12. 🧑‍💻 Auteur

Projet développé et maintenu par Sébastien Baudoux.

---

## 13. 📝 Licence

Ce projet est distribué sous licence libre. Voir fichier `LICENSE`.

