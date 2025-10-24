
# 🛠️ **Cheatsheet Admin Linux RPi – Sébastien**

---
## 🔧 1. **Récupérer la main pendant une mise à jour bloquée (`apt upgrade`)**

### 🔍 Vérifier les processus APT en cours

`ps aux | grep apt`

Repérer :
- `apt upgrade`
- `apt-get`
- `dpkg`
- leur `PID` (colonne n°2)

---
### 🔪 Tuer un processus bloqué

`sudo kill -9 <PID>`
	Exemple : `sudo kill -9 66339`

---
### 🧹 Libérer les verrous s’ils bloquent toujours

`sudo rm /var/lib/dpkg/lock-frontend sudo rm /var/cache/apt/archives/lock`

---
### ♻️ Reprendre proprement les mises à jour

`sudo dpkg --configure -a sudo apt update && sudo apt upgrade`

---
### 📋 Voir les actions bloquantes (ex : attente d'une réponse)

`tail -n 50 /var/log/apt/term.log`