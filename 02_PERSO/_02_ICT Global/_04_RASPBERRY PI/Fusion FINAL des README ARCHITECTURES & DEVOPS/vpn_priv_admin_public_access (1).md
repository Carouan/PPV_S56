# Architecture distribuée : segmentation des accès via VPN auto-hébergé et passerelles dynamiques

## 🎯 Objectif du document
Ce document vise à fournir un cadre de référence pour la mise en place d’une architecture hybride combinant un réseau VPN privé sécurisé auto-hébergé (via Headscale) et des mécanismes d’exposition contrôlée de services publics (via DuckDNS ou tunnels HTTPS). Il est conçu pour des usages personnels, associatifs ou semi-professionnels dans une perspective souveraine et éthique.

---

## 🏠 VPN maillé privé via Headscale

### ▶️ Théorie
Headscale implémente un plan de contrôle compatible avec Tailscale, basé sur WireGuard, pour la création d’un réseau VPN chiffré et maillé. Il permet la connectivité entre nœuds hétérogènes via des IP virtuelles stables sans ouverture de port.

### 🔎 Caractéristiques principales
- Adresses privées dans le range `100.x.x.x`
- Chiffrement Curve25519 + ChaCha20-Poly1305
- Pas besoin d’IP publique fixe
- Support du NAT traversal (STUN + relay DERP facultatif)

### 🧪 Exemples concrets
- SSH vers ton Raspberry Pi depuis un smartphone
- Montage SMB entre ton laptop et ton Nextcloud
- Webadmin de WordPress ou Moodle sans exposer leur port

---

## 🌍 Accès public via DuckDNS ou tunnel sortant

### ▶️ Approche
Pour rendre accessibles certains services au public (ex : bot Discord, WordPress, Moodle), on utilise soit :
- un **nom de domaine dynamique** (DuckDNS)
- un **tunnel HTTPS sortant** (ngrok, Cloudflare Tunnel, localtunnel)

### 🧠 Concepts liés
- NAT/PAT
- DynDNS
- Exposition restreinte via reverse proxy

### 🛠️ Exemple
- `https://fdd.duckdns.org` → Reverse proxy Caddy/Nginx → Conteneur Docker Moodle
- `https://bot.duckdns.org` → Tunnel vers webhook Discord

---

## ⚖️ Comparatif Headscale vs Tailscale

| Critère | Headscale | Tailscale |
|--------|-----------|-----------|
| Type | Auto-hébergé | SaaS propriétaire |
| Open source | ✅ 100% | ❌ partiellement |
| Identité | Manuelle / ACL | OAuth Google/Microsoft |
| Interface web | ❌ (CLI uniquement) | ✅ |
| Dépendance externe | ❌ Aucune | ✅ Serveur Tailscale |

---

## 📊 Schémas

### 1. Réseau VPN maillé privé avec Headscale
```
[Smartphone]⟷[Laptop]⟷[RPi]⟷[Serveur VPS Headscale]
```

### 2. Exposition contrôlée
```
 Navigateur ▶ duckdns ▶ Box ▶ Proxy ▶ Service Docker (WordPress, Nextcloud)
```

---

## 🔁 Suites pratiques et cas d'usages avancés

### 📁 Systèmes overlay synchronisés : Syncthing & IPFS
- Syncthing pour synchro privée (Vault Obsidian, Nextcloud)
- IPFS pour contenu public (documents juridiques de l’ASBL, affiches, etc.)

### 🤖 Bot Discord auto-hébergé
- Python ou Node.js + webhook exposé via tunnel sécurisé
- Base SQLite/PostgreSQL locale uniquement visible en VPN

### 🧪 Déploiement multi-services : Nextcloud, WordPress, Moodle
- Docker Compose ou K3s (cluster Kubernetes)
- MariaDB, Redis, reverse proxy (Caddy)
- Synchronisation des volumes via Syncthing ou disque externe

### 🧱 Réseau privé communautaire : ACL + OIDC
- Gestion des accès par rôles (famille, membres ASBL, externes)
- Authentification via Authelia ou Keycloak + 2FA

### 🔐 Zero Trust + MFA + reverse proxy
- Proxy Nginx ou Caddy en frontal
- ACLs avec restrictions horaires, IP, jetons JWT
- Portail Authelia en amont des interfaces critiques (Nextcloud admin, Moodle admin, etc.)

---

## 🧰 Guide de déploiement synthétique

1. **Installer Headscale (Docker ou Go)**
2. **Connecter les clients avec Tailscale CLI**
3. **Configurer ACLs dans Headscale**
4. **Déployer les services (Docker/K3s)**
5. **Configurer Caddy/Nginx pour exposition publique**
6. **Automatiser DuckDNS ou tunnel Cloudflare/ngrok**
7. **Ajouter Auth MFA avec Authelia si besoin**

---

## 📘 Glossaire

- **VPN** : Virtual Private Network
- **WireGuard** : Protocole VPN rapide et sécurisé
- **Headscale** : Serveur VPN open-source compatible Tailscale
- **DuckDNS** : DNS dynamique gratuit
- **OIDC** : OpenID Connect, protocole d’authentification
- **ACL** : Liste de contrôle d’accès
- **IPFS** : Système de fichiers pair-à-pair adressé par contenu
- **MFA** : Authentification multifactorielle
- **Zero Trust** : Modèle où aucune confiance implicite n’est accordée
- **RBAC** : Contrôle d’accès basé sur les rôles
- **Ingress** : Point d’entrée réseau dans Kubernetes
- **Namespace** : Espace logique isolé dans un cluster
- **CI/CD** : Automatisation du développement et déploiement

---

Ce document peut être transformé en présentation PDF/Canva, enrichi de visuels supplémentaires et adapté selon des cas d’usages spécifiques (auto-hébergement, éducation, associatif, familial).

