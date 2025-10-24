# Architecture distribuée : segmentation des accès via VPN auto-hébergé et passerelles dynamiques

## 🔁 Suites pratiques et cas d'usages avancés

### 📁 Systèmes de fichiers overlay avec synchronisation pair-à-pair (Syncthing, IPFS)

**Syncthing** permet une synchronisation continue et chiffrée des fichiers entre plusieurs nœuds sur un réseau VPN. Il évite toute centralisation des données, en créant un réseau de type mesh entre pairs.
- Avantage : résilience accrue, pas de point de défaillance central.
- Intégration recommandée avec Headscale pour le transport réseau.
- Cas d’usage : synchronisation entre Nextcloud personnel et instance familiale, ou entre deux clusters géographiques.

> **Remarque** : Syncthing-Fork est une variante mobile Android du projet principal Syncthing. Il fonctionne très bien pour synchroniser des dossiers entre ton smartphone et ton laptop (par exemple un Vault Obsidian), mais n’est pas une solution GLOM à 100% car il dépend de certaines bibliothèques fermées ou des stores propriétaires pour sa distribution.

**IPFS (InterPlanetary File System)**, quant à lui, repose sur un modèle de contenu adressable avec déduplication native.
- Il est adapté au partage public ou semi-public de fichiers non sensibles.
- On peut coupler IPFS avec un service pinning (ex : Infura, Pinata) ou auto-hébergé.

### 🤖 Bots intelligents auto-hébergés pilotés par webhook sécurisés

Un bot Discord, Mattermost ou Telegram peut être auto-hébergé sur le réseau local, puis exposé ponctuellement à Internet via un tunnel sécurisé (ngrok, cloudflared, Caddy reverse proxy).
- La réception de commandes (webhook entrants) peut être sécurisée via un middleware (par exemple Node.js avec validation de signature).
- Le bot accède aux bases de données et APIs internes via Headscale, mais se rend accessible à l’extérieur uniquement pour des endpoints restreints.
- Exemple : bot de notification des nouveaux dépôts Git, suivi de Nextcloud ou de Moodle.

### 🧪 Mise en œuvre concrète – bot Discord
- Développement avec Python (discord.py) ou Node.js (discord.js)
- Déploiement dans un conteneur Docker sur Raspberry Pi
- Tunnel HTTP sécurisé via Cloudflare Tunnel pour recevoir les commandes externes (slash commands)
- Enregistrement d’événements dans une base SQLite ou PostgreSQL sur le réseau VPN (pas exposée publiquement)

### 🛠️ Mise en œuvre concrète – Nextcloud et Moodle (multi-instances)
- Déploiement via Docker Compose : base MariaDB, Nextcloud/Moodle, serveur de cache Redis
- Deux conteneurs distincts pour Nextcloud : un pour la famille (authentification simple), un pour l’ASBL (avec 2FA)
- Reverse proxy mutualisé avec Caddy : gestion TLS automatique + sous-domaines personnalisés (`fdd.duckdns.org`, `nextcloud.baudoux.net`)
- Stockage séparé pour les volumes, synchronisé via Syncthing ou disque externe

### 🛠️ Mise en œuvre concrète – WordPress
- Déploiement via K3s dans un namespace dédié
- Base de données MariaDB externe sécurisée via VPN
- Utilisation d’Adminer en accès restreint pour la gestion des bases
- Monitoring via Uptime Kuma + alertes via webhook Discord sur canal privé

### 🏠 Réseau privé communautaire avec gestion d’identités décentralisées (ACL + OIDC)

En combinant Headscale avec un serveur d’identité (ex : Keycloak, Authelia), on peut créer un réseau multi-entité dans lequel :
- L’accès aux services internes est soumis à une authentification forte via OpenID Connect.
- Les droits d'accès sont gérés via des ACLs dynamiques.
- Un serveur DNS interne (Unbound, CoreDNS) peut servir à nommer les services dans le réseau VPN.
- Exemple : un Nextcloud pour l’ASBL FDD, un autre pour la famille, avec des accès cloisonnés.

### 🌍 Déploiement de services zero-trust via VPN + reverse proxy + MFA

Le paradigme **Zero Trust** impose que chaque requête (même interne) soit validée par :
1. Une authentification multifactorielle (MFA)
2. Une validation d’appartenance au réseau sécurisé (Headscale)
3. Une autorisation de rôle via ACLs ou RBAC

La combinaison suivante est recommandée :
- Headscale pour le réseau privé
- Caddy ou Nginx pour le reverse proxy
- Authelia pour l’authentification multifactorielle et l’accès conditionnel (time-based, géolocalisation, etc.)

Ce modèle est parfaitement adapté à l’auto-hébergement de services critiques tels que :
- Interface admin WordPress
- Console Moodle
- Tableau de bord Nextcloud
- Supervision Prometheus + Grafana

---

## 🔧 Guide de déploiement étape par étape (synthèse)

1. **Installer Headscale (sur VPS ou serveur local)**
   - OS requis : Debian/Ubuntu
   - Binaire Go disponible ou image Docker officielle
   - Créer et démarrer l’instance avec un fichier `config.yaml`

2. **Connecter les clients (RPi, laptop, smartphone)**
   - Installer Tailscale CLI : `curl -fsSL https://tailscale.com/install.sh | sh`
   - Lier le client via `tailscale up --login-server https://monheadscale.mondomaine`

3. **Déployer les services**
   - Docker ou Kubernetes selon les ressources
   - Pour WordPress : stack `wordpress + mariadb + caddy`
   - Pour Nextcloud : ajouter Redis, cron et Collabora si nécessaire

4. **Configurer les tunnels ou DNS**
   - DuckDNS : script cron avec mise à jour IP automatique
   - Tunnel HTTP : `cloudflared tunnel create` ou `ngrok http 8080`

5. **Ajouter l’authentification centralisée (optionnel)**
   - Installer Authelia avec backend LDAP ou fichier YAML
   - Déployer un reverse proxy devant chaque service avec protection JWT + OTP

---

## 📘 Glossaire des acronymes et concepts

- **VPN** : Virtual Private Network – Réseau privé virtuel permettant de connecter plusieurs appareils de manière sécurisée.
- **WireGuard** : protocole VPN moderne, rapide et sécurisé utilisé par Tailscale et Headscale.
- **Headscale** : serveur auto-hébergé compatible Tailscale (libre)
- **DuckDNS** : service DNS dynamique gratuit pour nommer une IP publique variable.
- **OIDC** : OpenID Connect – protocole d’authentification fédérée basé sur OAuth2.
- **ACL** : Access Control List – liste de contrôle des permissions d’accès.
- **IPFS** : InterPlanetary File System – système de fichiers distribué et adressé par contenu.
- **MFA** : Multi-Factor Authentication – authentification par plusieurs facteurs (ex : mot de passe + smartphone)
- **Zero Trust** : modèle de sécurité basé sur le principe de ne jamais faire confiance par défaut à aucun utilisateur ou appareil.
- **RBAC** : Role-Based Access Control – gestion des droits basée sur les rôles utilisateurs.
- **Ingress** : point d’entrée HTTP dans un cluster Kubernetes
- **Namespace** : espace logique de séparation dans Kubernetes pour isoler les ressources
- **CI/CD** : Continuous Integration / Continuous Deployment – processus d’automatisation de test et de déploiement

---

Ce socle technique permet de fédérer une pluralité de services critiques, auto-hébergés, maintenus de manière indépendante mais connectés de manière cohérente. Il constitue un exemple fonctionnel et reproductible de gouvernance numérique souveraine à échelle personnelle ou associative.
