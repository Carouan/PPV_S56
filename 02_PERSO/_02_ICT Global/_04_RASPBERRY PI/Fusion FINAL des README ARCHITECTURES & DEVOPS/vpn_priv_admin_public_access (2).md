# Architecture distribuée : segmentation des accès via VPN auto-hébergé et passerelles dynamiques

## 🎯 Objectif du document

Ce document approfondi fournit un cadre de référence stratégique, technique et opérationnel pour concevoir une architecture numérique hybride. Elle repose sur l’utilisation combinée :

- d’un réseau VPN maillé sécurisé, auto-hébergé, fondé sur Headscale (technologie WireGuard)
- de solutions d’exposition dynamique et sécurisée de services accessibles publiquement via DuckDNS ou des tunnels HTTPs (Cloudflare Tunnel, Ngrok, etc.)

Ce guide est destiné aux techniciens expérimentés, chercheurs, administrateurs d’ASBL, ou tout porteur de projet numérique cherchant à maîtriser son infrastructure sans dépendre d’intermédiaires propriétaires. L’approche répond à des enjeux de souveraineté, de cybersécurité et d’efficience technologique.

---

## 🏠 VPN maillé privé via Headscale

### ▶️ Théorie

Headscale est un plan de contrôle open source, auto-hébergeable, qui implémente les spécifications clients Tailscale (utilisateur final). Il permet de bâtir un réseau VPN chiffré basé sur le protocole WireGuard, sans serveur central tiers. Chaque client dispose d’une IP virtuelle fixe, chiffrée de bout en bout, qu’il soit à la maison, au bureau ou en mobilité.

Contrairement aux VPN classiques, la topologie maillée permet à tous les appareils de communiquer directement entre eux, même derrière NAT, grâce aux mécanismes de NAT Traversal et au fallback DERP.

### 🔎 Caractéristiques principales

- Attribution automatique d’adresses du type `100.x.x.x`
- Cryptographie moderne (Curve25519, ChaCha20, Poly1305)
- Zéro port ouvert requis sur la box
- Authentification des clients via ACL Headscale
- Peut être intégré à un système IAM (Authelia, Keycloak)

### 🧪 Cas d’usage typiques

- Connexion au Raspberry Pi local depuis un smartphone hors domicile sans ouverture de port
- Accès à des services web internes (portail Moodle, WordPress admin, etc.) de manière totalement privée
- Interconnexion entre différents serveurs hébergés (NAS familial, VPS associatif, machines locales)
- Partage sécurisé de fichiers volumineux sans passer par le cloud commercial

---

## 🌍 Accès public via DuckDNS ou tunnel sortant

### ▶️ Approche

L’exposition de services web accessibles depuis l’extérieur nécessite une infrastructure complémentaire. Celle-ci peut passer par :

- un **nom de domaine dynamique** (comme DuckDNS ou No-IP)
- un **tunnel sortant sécurisé HTTPS** (via `ngrok`, `cloudflared`, `localtunnel`, etc.)
- une **redirection NAT classique + reverse proxy** (plus complexe mais plus flexible)

### 🧠 Concepts associés

- NAT/PAT (traduction d’adresse et de ports)
- DynDNS et renouvellement de DNS liés à IP dynamique
- TLS automatisé avec Let’s Encrypt (via Caddy ou Nginx)
- Protection de surface d’exposition via authentification et ACL

### 🛠️ Exemples d’implémentation

- `https://fdd.duckdns.org` : sous-domaine pointant sur IP publique, redirigeant vers le reverse proxy du Pi exposant Moodle de l’association
- `https://bot.duckdns.org` : webhook Discord pointant vers un tunnel Cloudflare vers une application Node.js (bot)
- `https://nextcloud.baudoux.net` : accessible à la famille uniquement grâce à reverse proxy + ACL par certificat VPN

---

## ⚖️ Comparatif Headscale vs Tailscale

| Critère               | Headscale                          | Tailscale                   |
| --------------------- | ---------------------------------- | --------------------------- |
| Type                  | Auto-hébergé                       | SaaS propriétaire           |
| Licence               | 100 % libre                        | Partiellement libre         |
| Gestion des identités | Manuelle ou ACL avec OIDC          | OAuth via Google, MS        |
| Interface             | CLI uniquement (ext. GUI possible) | Web centralisée             |
| Fiabilité réseau      | Très stable, dépend du VPS         | Haute, mais dépend du cloud |
| Données utilisateur   | Stockées localement                | Hébergées par Tailscale     |

---

## 📊 Schémas

### 1. Réseau VPN maillé avec Headscale

```
          ┌─────────────┐          ┌──────────────┐
          │ Smartphone  │◄───────►│    Laptop     │
          └─────────────┘          └──────────────┘
                   ▲                        ▲
                   │                        │
             ┌────────────┐         ┌─────────────┐
             │   RPi FDD  │◄───────►│    VPS      │
             └────────────┘         └─────────────┘
```

### 2. Exposition via DuckDNS ou tunnel

```
Navigateur ▶ duckdns ▶ Box ▶ Proxy ▶ Service Web (Moodle, WordPress)
                                    ▲
                                    │
                                 Auth MFA
```

---

## 🔁 Cas d'usages approfondis

### 📁 Synchronisation pair-à-pair : Syncthing, IPFS

- 🔄 Synchronisation Obsidian Vault entre téléphone et laptop avec Syncthing-Fork (Android) + Syncthing Desktop
- 📂 Réplication automatique de documents critiques d’un Nextcloud local vers un VPS ou une autre maison
- 🌍 Publication de fichiers statiques (PDF, tracts, publications) sur IPFS avec disponibilité décentralisée

### 🤖 Bot Discord auto-hébergé

- ⛓️ App Python Discord.py ou Node.js Discord.js dans un conteneur Docker
- 🔗 Réception des webhooks via tunnel Cloudflare (sécurisé, certifié)
- 🔐 Vérification de signature du webhook
- 🧠 Intégration possible avec GPT pour réponses automatiques enrichies

### 🧪 Déploiement multi-services : Nextcloud, Moodle, WordPress

- 🌐 Caddy en frontal pour TLS automatique, SSO, reverse proxy multi-sites
- 📦 Déploiement via Docker Compose ou K3s (si cluster Raspberry Pi)
- 🗃️ MariaDB/Redis/Collabora comme backend commun
- 🧾 Uptime Kuma et Grafana pour supervision
- 💾 Sauvegardes Syncthing + rsync + restic chiffré vers Nextcloud distant

### 🧱 Réseau privé communautaire (ACL + OIDC)

- 🔐 Authentification via Authelia en frontal (2FA, TOTP, U2F)
- 🧬 ACLs distinctes : parents/élèves/enseignants/administrateurs
- 📡 DNS local pour nommage interne VPN (`nextcloud.fam`, `moodle.asbl`)
- 🧠 RBAC granulaire via reverse proxy intelligent (ex : accès profs uniquement aux journaux scolaires)

### 🔐 Architecture Zero Trust

- ✅ Aucune confiance implicite même en interne
- 🔁 MFA systématique via portail central
- 🔐 Protection des services exposés (admin Wordpress/Moodle) par JWT et géoblocage
- 🔎 Journalisation complète des accès (fail2ban, auditd, CrowdSec)

---

## 🧰 Guide d’installation étape par étape

1. **Installation de Headscale** (Go ou Docker)

   - Création config.yaml
   - Lancement via `docker-compose up -d`

2. **Connexion des clients**

   - Installation Tailscale
   - Commande `tailscale up --login-server https://headscale.mondomaine`

3. **Déploiement des services**

   - Création réseau Docker bridge ou K3s
   - Containers : Nextcloud, WordPress, Moodle

4. **Reverse Proxy & DNS**

   - Configuration de Caddy ou Nginx
   - Certificats auto + routage par sous-domaine

5. **Exposition publique sécurisée**

   - DuckDNS : cron de mise à jour IP publique
   - Tunnels : `cloudflared tunnel run`, `ngrok` avec authentification

6. **Portail SSO avec MFA**

   - Déploiement d’Authelia (LDAP ou fichier users)
   - Frontaux protégés : `/admin`, `/moodle`, `/settings`

7. **Sauvegardes et monitoring**

   - Restic + Rclone pour backup vers cloud libre ou Nextcloud distant
   - Uptime Kuma + Prometheus + Grafana + AlertManager

---

## 📘 Glossaire enrichi

- **VPN** : Virtual Private Network – réseau virtuel chiffré entre plusieurs hôtes
- **WireGuard** : Protocole VPN moderne, rapide, simple, basé sur UDP
- **Headscale** : Implémentation serveur de contrôle VPN compatible Tailscale, auto-hébergeable
- **DuckDNS** : DNS dynamique gratuit
- **OIDC** : OpenID Connect – protocole d’identité basé sur OAuth2
- **ACL** : Access Control List – liste de permissions d’accès aux services
- **IPFS** : Système de fichiers pair-à-pair adressé par hachage de contenu
- **MFA** : Multi-Factor Authentication – double authentification
- **Zero Trust** : Modèle de sécurité refusant toute confiance implicite
- **RBAC** : Role-Based Access Control – autorisation basée sur des rôles
- **Ingress** : Entrée de trafic HTTP dans Kubernetes
- **Namespace** : Espace logique de ressources dans Kubernetes
- **CI/CD** : Continuous Integration / Continuous Deployment
- **DERP** : relay serveur utilisé par Tailscale en cas d’échec NAT traversal
- **Authelia** : Portail d’authentification MFA et SSO open-source
- **Caddy** : Reverse proxy avec TLS automatique intégré
- **Syncthing** : outil de synchronisation pair-à-pair libre
- **Cloudflare Tunnel** : solution gratuite d’exposition publique sécurisée sans ouvrir de port

---

Ce document constitue une base technique et stratégique pour toute organisation ou individu souhaitant construire une infrastructure numérique résiliente, auto-hébergée, sécurisée, interconnectée et libre. Il peut être décliné en version académique, tutoriel interactif, livret d’auto-formation ou présentation Canva / PDF enrichie de diagrammes techniques.

