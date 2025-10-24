## **8. Cas d’usage concret – Bot Discord de la Coalition FFJ**

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

