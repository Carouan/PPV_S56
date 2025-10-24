
# 🚀 Déploiement et Gestion du Bot Discord COAL_FFJ sur Raspberry Pi avec Gitea

## 📋 Table des matières
1. Introduction
2. Prérequis
3. Installation et configuration sur Raspberry Pi
4. Installation et configuration sur Windows
5. Déploiement et mise à jour du bot
6. Vérification et supervision
7. Dépannage rapide

---

## 1. Introduction
Ce guide explique comment installer, configurer et maintenir le bot Discord **COAL_FFJ** sur un Raspberry Pi à l'aide de **Docker**, **Gitea**, et un pipeline de déploiement automatisé.  
Les instructions couvrent la configuration côté **RPi** et côté **Windows**.

## 2. Prérequis

### Matériel
- Raspberry Pi 4 (4 ou 8 Go RAM recommandé)
- Carte microSD 32 Go ou SSD externe
- Connexion Internet stable

### Logiciels côté Raspberry Pi
- Raspberry Pi OS Lite (ou équivalent Debian)
- Accès SSH configuré avec clés
- Python 3.9+
- Docker + Docker Compose
- Ansible (sur votre machine de contrôle)

### Logiciels côté Windows
- Git for Windows
- PowerShell 7+
- VSCode (recommandé)

---

## 3. Installation et configuration sur Raspberry Pi

1. **Cloner le pack Ansible** sur votre machine de contrôle :
```bash
git clone https://votre-repo/ansible_rpi_coalffj.git
cd ansible_rpi_coalffj
```

2. **Lancer le playbook Ansible** :
```bash
ansible-playbook -i hosts setup_rpi_coalffj.yml
```
Cela installe :
- Docker et Docker Compose
- Gitea (service systemd)
- Création du dépôt `coalffj`
- Déploiement initial du bot dans Docker

3. **Configurer Gitea** :
- Accéder à `http://IP_RPI:3000`
- Créer un compte admin
- Initialiser un dépôt `coalffj`

---

## 4. Installation et configuration sur Windows

1. **Installer Git et VSCode** si ce n’est pas déjà fait.

2. **Cloner le dépôt Gitea** du RPi :
```powershell
git clone ssh://gitea@IP_RPI:2222/username/coalffj.git
cd coalffj
```

3. **Configurer la clé SSH** :
- Générer une clé SSH sur Windows :
```powershell
ssh-keygen -t ed25519 -C "votre_email@example.com"
```
- Copier la clé publique dans Gitea (Profil > Settings > SSH Keys).

4. **Mettre à jour le code** :
- Modifier localement avec VSCode
- Commit + push :
```powershell
git add .
git commit -m "Mise à jour bot"
git push
```

---

## 5. Déploiement et mise à jour du bot

- Chaque **push** déclenche automatiquement :
    1. Pull du code sur le RPi
    2. Rebuild Docker
    3. Restart du container

- Pour redémarrer manuellement :
```bash
docker compose restart bot
```

---

## 6. Vérification et supervision

- Voir les logs :
```bash
docker logs -f bot
```

- Vérifier que le bot répond sur Discord avec `!ping` ou `!report`.

---

## 7. Dépannage rapide

- **Docker ne démarre pas** → `sudo systemctl restart docker`
- **Pipeline non déclenché** → vérifier le webhook dans Gitea
- **Connexion SSH refusée** → vérifier la clé dans `~/.ssh/authorized_keys`

---

📌 **Note** : Pour personnaliser la configuration du bot (tokens, canaux, etc.), éditez `.env` et redéployez :
```bash
docker compose up -d --build
```
