# 🛠️ Cheatsheet Admin Linux RPi – Sébastien

---

## 🔧 1. Récupérer la main pendant une mise à jour bloquée (`apt upgrade`)

### 🔍 Vérifier les processus APT en cours
```bash
ps aux | grep apt
```
Repérer :
- `apt upgrade`
- `apt-get`
- `dpkg`
- leur `PID` (colonne n°2)

---
### 🔪 Tuer un processus bloqué
```bash
sudo kill -9 <PID>
```
Exemple :
```bash
sudo kill -9 66339
```

---
### 🧹 Libérer les verrous s’ils bloquent toujours
```bash
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/cache/apt/archives/lock
```

---
### ♻️ Reprendre proprement les mises à jour
```bash
sudo dpkg --configure -a
sudo apt update && sudo apt upgrade
```

---
### 📋 Voir les actions bloquantes (ex : attente d'une réponse)
```bash
tail -n 50 /var/log/apt/term.log
```

---

## 🗂️ 2. Activer l’historique daté des commandes et la journalisation avancée

### 📅 Afficher l’historique avec date/heure

Ajouter dans `~/.bashrc` :

```bash
export HISTTIMEFORMAT="%F %T "
export HISTSIZE=10000
export HISTFILESIZE=20000
shopt -s histappend
```

Puis :

```bash
source ~/.bashrc
```

---

### 🧾 Journaliser les commandes dans un vrai fichier de log (`bash_history.log`)

1. Ajouter dans `~/.bashrc` :

```bash
export PROMPT_COMMAND='RETRN_VAL=$?; logger -p local6.debug "$(whoami) [$$]: $(history 1 | sed "s/^[ ]*[0-9]\+[ ]*//")"'
```

2. Dans `/etc/rsyslog.conf` :

```
local6.*                        /var/log/bash_history.log
```

3. Redémarrer `rsyslog` :

```bash
sudo systemctl restart rsyslog
```

4. Consulter :

```bash
sudo less /var/log/bash_history.log
```

---

## 🔍 3. Script `check_config_rpi.sh` – État du système

### 📄 Créer le script

```bash
nano ~/check_config_rpi.sh
```

Colle :

```bash
#!/bin/bash

echo "====== 🔐 Utilisateurs humains ======"
awk -F: '$3 >= 1000 { print $1 }' /etc/passwd
echo

echo "====== 👥 Groupes de l'utilisateur courant ======"
groups $USER
echo

echo "====== 📦 Derniers paquets installés ======"
grep "install " /var/log/dpkg.log | tail -n 20
echo

echo "====== 🔑 Clés SSH autorisées ======"
[ -f ~/.ssh/authorized_keys ] && cat ~/.ssh/authorized_keys || echo "Aucune clé trouvée."
echo

echo "====== 🚨 État de SSH ======"
systemctl is-active ssh
echo

echo "====== 📡 Ports ouverts ======"
sudo ss -tulpn | grep LISTEN
echo

echo "====== ⏱️ Derniers redémarrages ======"
last reboot | head -n 5
echo

echo "====== 🐳 Docker installé ? ======"
if command -v docker &> /dev/null; then
    docker --version
else
    echo "Docker non installé"
fi
echo

echo "====== 📁 Fichiers modifiés récemment dans /etc ======"
sudo find /etc -type f -printf '%TY-%Tm-%Td %TT %p\n' | sort -r | head -n 15
echo

echo "====== 🔄 Crontabs utilisateurs ======"
for u in $(awk -F: '$3 >= 1000 {print $1}' /etc/passwd); do
    echo "---- Crontab pour $u ----"
    sudo crontab -u $u -l 2>/dev/null || echo "Aucune crontab"
    echo
done
```

### 📦 Rendre exécutable

```bash
chmod +x ~/check_config_rpi.sh
```

### ▶️ Lancer

```bash
./check_config_rpi.sh
```


### 1. **Utilisateur root**

- C’est **l’utilisateur "super-administrateur"** du système Linux.
- Il a **tous les droits, tout le temps**, sans avoir à demander confirmation.
- Il **peut tout casser** (volontairement ou par erreur).
- Quand tu es connecté _en tant que root_, tu exécutes **toutes** les commandes avec les pleins pouvoirs, sans restriction.

### 2. **Utilisateur standard avec sudo**

- C’est un utilisateur normal à qui on a donné le droit de **devenir temporairement "root"** pour certaines commandes.
- Il doit utiliser `sudo` avant chaque commande administrative, par exemple :
    `sudo apt update`
- À chaque fois qu’il utilise `sudo`, le système **enregistre l’action**, ce qui permet de **tracer les modifications**.
- Il faut souvent entrer le **mot de passe de l’utilisateur** (pas celui de root), ce qui ajoute une couche de sécurité.

### En résumé :

| Fonction            | root                             | user avec sudo                   |
| ------------------- | -------------------------------- | -------------------------------- |
| Droits complets ?   | Oui, tout le temps               | Oui, mais sur demande            |
| Trace des actions ? | Non                              | Oui                              |
| Risque d’erreur ?   | Plus élevé                       | Moins élevé                      |
| Bonnes pratiques ?  | À éviter pour un usage quotidien | Recommandé pour l’administration |

### **Ce qu’un utilisateur avec sudo peut faire :**

- Installer/désinstaller des paquets (`sudo apt install`, `sudo apt remove`, etc.)
- Modifier des fichiers système (`sudo nano /etc/fstab`, etc.)
- Ajouter ou supprimer des utilisateurs (`sudo useradd`, etc.)
- Démarrer/arrêter des services (`sudo systemctl restart apache2`, etc.)
- Lancer un shell en root s’il veut (avec `sudo -i` ou `sudo su`)

---
### **Pourquoi préférer sudo à root ?**

- **Traçabilité** : chaque utilisation de `sudo` est enregistrée dans `/var/log/auth.log`
- **Sécurité** : tu dois taper ton mot de passe (ou celui de root si configuré comme ça), donc tu ne fais pas de commande sensible "par accident"
- **Moins de dégâts involontaires** : si tu oublies un `sudo`, la commande échoue au lieu de modifier quelque chose de critique

### **1. `su` (substitute user)**

- **Commande de base du système UNIX**, dispo presque partout.
- Permet de **changer d’utilisateur**, en général vers `root` :
    `su`
ou
    `su autre_utilisateur`
- Te **connecte complètement** à un autre utilisateur (souvent `root`), **en changeant ton environnement**.
- Tu dois taper **le mot de passe de root**, ce qui pose un souci **si l’accès root est désactivé** (comme souvent par défaut sur Ubuntu ou Debian).

---
### **2. `sudo` (superuser do)**
- **Pas intégré au noyau**, c’est un outil utilisateur (installé par défaut sur les distros modernes comme Ubuntu).
- Permet d’exécuter **une seule commande** avec les droits de super-utilisateur, sans changer d’environnement :
    `sudo apt update`
- Tu entres **ton propre mot de passe**, pas celui de root.
- **Chaque commande est journalisée** (dans `/var/log/auth.log`), ce qui est utile pour la sécurité.
- On peut limiter les **droits par commande**, par utilisateur, par groupe, etc. via `/etc/sudoers`.

---
### **En résumé :**

|Fonction|`su`|`sudo`|
|---|---|---|
|Utilise le mot de passe de|root|l’utilisateur courant|
|Change complètement d’utilisateur ?|Oui|Non (commande unique)|
|Journalisation des commandes ?|Non|Oui|
|Peut limiter les droits ?|Non|Oui (avec sudoers)|
|Présent par défaut dans|Tous les systèmes UNIX|Principalement dans Linux, BSD, etc.|

---
### **Pourquoi préférer `sudo` à `su` ?**
- Tu ne donnes **jamais le mot de passe root** (souvent désactivé d'ailleurs).
- Tu **restes dans ton shell** sans basculer complètement sur l’utilisateur root.
- Tu peux configurer **des droits fins** (ex. : donner à un user le droit de redémarrer un service, mais pas d’installer des paquets).
- C’est **plus sécurisé** et plus adapté à l’usage multi-utilisateur.

Mais du coup, si je crée un utilisateur sudo et que je supprime l'utilisateur root. En quoi est-ce plus sécurisé ? La sécurité ne repose quand même que sur un mot de passe ?!

###### ChatGPT a dit :

Très bonne question encore une fois, Sébastien — tu touches là au **cœur du modèle de sécurité Linux**, et tu as raison : **tout ne repose pas uniquement sur "sudo vs root", ni sur un simple mot de passe**.

Voici la réponse en plusieurs couches :

---

### **1. On ne supprime _jamais_ réellement root**

- Le compte `root` (UID 0) **est toujours là**, même si tu ne peux plus t’y connecter directement.
    
- Ce qu’on fait pour améliorer la sécurité, c’est **désactiver l’accès direct** (SSH, login console, etc.) à root.
    
- C’est **une défense en profondeur** : tu obliges à **passer par un compte utilisateur normal** + `sudo`.


### **2. Pourquoi c’est plus sécurisé ?**

Parce que :

- **Tu n’exposes plus l’accès root** directement à distance (ex : sur SSH).
    
- Si quelqu’un devine/brute force le mot de passe d’un utilisateur, il **doit encore** réussir à utiliser `sudo` (avec restrictions, journalisation, etc.).
    
- Tu peux **désactiver `sudo` temporairement** ou exiger une **authentification forte** (clé GPG, YubiKey, etc.)
    
- **Chaque action est tracée**, contrairement à un shell root classique.
    

---

### **3. Oui, un mot de passe seul, c’est fragile… mais on peut faire mieux**

Tu peux renforcer la sécurité en ajoutant :

- **Clé SSH au lieu du mot de passe** pour la connexion.
    
- **2FA avec PAM** (`pam_google_authenticator`, `pam_oath`, etc.).
    
- **Accès sudo limité** à certains utilisateurs ou groupes.
    
- **Verrouillage automatique** après trop de tentatives (`fail2ban`, `pam_tally2`, etc.).
    
- **Audit et alerte** en cas d’accès sudo.
    

---

### **Exemple concret :**

Tu pourrais avoir un utilisateur nommé `adminseb` avec :

- Clé SSH obligatoire pour la connexion.
    
- Membre du groupe `sudo`.
    
- Un fichier `sudoers` qui dit :
    
    bash
    
    CopierModifier
    
    `adminseb ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx`
    
    Ce qui veut dire : il peut redémarrer nginx sans mot de passe, **mais rien d’autre**.
    

---

### **Conclusion**

Oui, le système repose partiellement sur un mot de passe… **mais pas uniquement**, et `sudo` te permet :

- d’avoir une **meilleure granularité** de contrôle,
    
- une **traçabilité** des actions,
    
- et une **surface d’attaque réduite** (pas d’accès root direct).
    

Tu veux que je t’aide à désactiver l’accès root sur SSH et sécuriser un compte sudo sur ton système ?

Demander à ChatGPT

##### Vous avez dit :

Oui, il me faudrait le script qui : - désactive l'utilisateur root - prompt une demande pour le futur nom d'utilisateur sudo - crée un certificat ssh - demande par quel numéro il faut remplacer le port ssh - changé le port ssh. - ne permet à cet utilisateur de ne se connecter que en ssh. Il me semble que c'est les étapes qu'il faut faire ?! J'oublie quelque chose ?

###### ChatGPT a dit :

Parfait Sébastien, tu as très bien résumé les étapes ! Ton plan est excellent pour sécuriser un serveur Linux (comme un VPS ou un Raspberry Pi).

Voici un petit rappel clair des étapes que ton script devra faire :

---

### **Checklist de sécurité SSH avec sudo user :**

1. **Créer un nouvel utilisateur avec `sudo`**
2. **Générer une paire de clés SSH** (coté client)
3. **Ajouter la clé publique sur le serveur pour le nouvel utilisateur**
4. **Changer le port SSH**
5. **Interdire la connexion root via SSH**
6. **Interdire la connexion par mot de passe (clé uniquement)**
7. **Redémarrer le service SSH pour appliquer**
8. _(optionnel mais conseillé)_ : Configurer `fail2ban` ou `UFW`

---

### Voici un **script de base** (à exécuter en root ou via sudo sur le serveur) :


``#!/bin/bash  # Demande le nom du futur utilisateur read -p "Nom du nouvel utilisateur avec accès sudo : " NEW_USER  # Crée le nouvel utilisateur et lui donne un mot de passe adduser $NEW_USER usermod -aG sudo $NEW_USER  # Crée le dossier SSH pour l'utilisateur mkdir -p /home/$NEW_USER/.ssh chmod 700 /home/$NEW_USER/.ssh  # Demande la clé publique SSH read -p "Colle ici ta clé publique SSH (commence par ssh-rsa ou ssh-ed25519) : " SSH_KEY echo $SSH_KEY >> /home/$NEW_USER/.ssh/authorized_keys chmod 600 /home/$NEW_USER/.ssh/authorized_keys chown -R $NEW_USER:$NEW_USER /home/$NEW_USER/.ssh  # Demande le nouveau port SSH read -p "Quel port SSH veux-tu utiliser à la place de 22 ? " NEW_PORT  # Sauvegarde la config SSH cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak  # Applique les changements sed -i "s/^#Port 22/Port $NEW_PORT/" /etc/ssh/sshd_config sed -i "s/^PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config sed -i "s/^#PermitRootLogin prohibit-password/PermitRootLogin no/" /etc/ssh/sshd_config sed -i "s/^#PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config sed -i "s/^PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config  # Redémarre SSH systemctl restart sshd  echo "Configuration terminée." echo "Connecte-toi désormais avec :" echo "ssh $NEW_USER@IP -p $NEW_PORT"'`

---

### **À faire côté client :**
Sur ton PC, **avant** d’exécuter le script, génère une clé SSH :

`ssh-keygen -t ed25519 -C "sebastien@tonpc"`

Puis copie la clé publique (`~/.ssh/id_ed25519.pub`) et colle-la dans le script quand il te le demande.

---

Tu veux que je te fasse une version _encapsulée dans un script bash exécutable automatiquement_ ou que je t’aide à faire la partie client (copier automatiquement la clé) ?


**Script final encapsulé** `secure-ssh-setup.sh`

`#!/bin/bash`
#`Vérifie si l'utilisateur est root`
`if [[ $EUID -ne 0 ]]; then`
  `echo "Ce script doit être exécuté en tant que root"`
  `exit 1`
`fi`
# `1. Demande le nom du nouvel utilisateur`
`read -p "Nom du nouvel utilisateur avec sudo : " NEW_USER`

# `Crée l'utilisateur`
`adduser $NEW_USER`
`usermod -aG sudo $NEW_USER`

# `2. Crée le dossier SSH pour l'utilisateur`
`mkdir -p /home/$NEW_USER/.ssh`
`chmod 700 /home/$NEW_USER/.ssh`

# `3. Demande la clé publique`
`read -p "Colle ta clé publique SSH (commence par ssh-ed25519 ou ssh-rsa) : " SSH_KEY`
`echo "$SSH_KEY" > /home/$NEW_USER/.ssh/authorized_keys`
`chmod 600 /home/$NEW_USER/.ssh/authorized_keys`
`chown -R $NEW_USER:$NEW_USER /home/$NEW_USER/.ssh`

# `4. Demande le nouveau port SSH`
`read -p "Quel port SSH veux-tu utiliser (autre que 22) ? " NEW_PORT`

# `5. Sauvegarde la config SSH`
`cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F-%H%M%S)`

# `6. Applique les modifications dans sshd_config`
`sed -i "s/^#Port .*/Port $NEW_PORT/" /etc/ssh/sshd_config`
`sed -i "s/^Port .*/Port $NEW_PORT/" /etc/ssh/sshd_config`
`sed -i "s/^#PermitRootLogin.*/PermitRootLogin no/" /etc/ssh/sshd_config`
`sed -i "s/^PermitRootLogin.*/PermitRootLogin no/" /etc/ssh/sshd_config`
`sed -i "s/^#PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config`
`sed -i "s/^PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config`

# `7. Verrouille le compte root (facultatif mais conseillé)`
`passwd -l root`

# `8. Redémarre le service SSH`
`systemctl restart sshd`

`echo`
`echo "--------------------------------------------------"`
`echo "Configuration SSH sécurisée terminée !"`
`echo "Tu peux maintenant te connecter avec :"`
`echo "ssh $NEW_USER@<ton_ip> -p $NEW_PORT"`
`echo`
`echo "Le compte root est désactivé pour la connexion SSH."`
`echo "Le mot de passe root a été verrouillé."`
`echo "--------------------------------------------------"`


---


#!/bin/bash

# secure_ssh.sh
# Sécurise l'accès SSH : nouvel utilisateur sudo, clé SSH, changement de port, désactivation de root

set -e  # Stoppe le script en cas d'erreur

log_file="/var/log/secure_ssh_setup.log"

log() {
  echo "$(date +'%F %T') - $1" | tee -a "$log_file"
}

if [[ $EUID -ne 0 ]]; then
  log "Ce script doit être exécuté en tant que root."
  exit 1
fi

# 1. Demander le nom du nouvel utilisateur
read -p "Nom du nouvel utilisateur avec sudo : " NEW_USER

# 2. Créer le compte et lui donner les droits sudo
adduser "$NEW_USER"
usermod -aG sudo "$NEW_USER"
log "Utilisateur $NEW_USER créé et ajouté au groupe sudo."

# 3. Configurer la clé SSH
mkdir -p /home/$NEW_USER/.ssh
chmod 700 /home/$NEW_USER/.ssh
read -p "Colle la clé publique SSH (ssh-ed25519 ou ssh-rsa) : " SSH_KEY
echo "$SSH_KEY" > /home/$NEW_USER/.ssh/authorized_keys
chmod 600 /home/$NEW_USER/.ssh/authorized_keys
chown -R $NEW_USER:$NEW_USER /home/$NEW_USER/.ssh
log "Clé SSH ajoutée pour $NEW_USER."

# 4. Demander un nouveau port SSH
read -p "Quel port SSH veux-tu utiliser (autre que 22) ? " NEW_PORT

# 5. Modifier sshd_config proprement
SSHD_CONFIG="/etc/ssh/sshd_config"
BACKUP="$SSHD_CONFIG.bak.$(date +%F-%H%M%S)"
cp $SSHD_CONFIG $BACKUP
log "Sauvegarde de sshd_config : $BACKUP"

# Supprimer les lignes existantes
sed -i '/^#\?Port /d' $SSHD_CONFIG
sed -i '/^#\?PermitRootLogin /d' $SSHD_CONFIG
sed -i '/^#\?PasswordAuthentication /d' $SSHD_CONFIG

# Ajouter la configuration sécurisée
cat <<EOF >> $SSHD_CONFIG

# Sécurisation SSH appliquée par secure_ssh.sh
Port $NEW_PORT
PermitRootLogin no
PasswordAuthentication no
EOF

log "sshd_config mis à jour."

# 6. Verrouiller le mot de passe root
passwd -l root
log "Mot de passe root verrouillé."

# 7. Vérifier la syntaxe SSH avant redémarrage
if sshd -t; then
  systemctl restart sshd
  log "Service SSH redémarré avec succès."
else
  log "Erreur dans sshd_config. Annulation du redémarrage SSH."
  mv "$BACKUP" "$SSHD_CONFIG"
  exit 1
fi

log "Connexion root désactivée, port SSH : $NEW_PORT."
echo
echo "-------------------------------------------------------------"
echo "Connexion SSH sécurisée. Utilise la commande suivante :"
echo "ssh $NEW_USER@<ip_du_serveur> -p $NEW_PORT"
echo "-------------------------------------------------------------"



## Activer l’historique daté pour l’avenir

Ajoute ceci à la fin de ton fichier ~/.bashrc : export HISTTIMEFORMAT="%F %T "
Et recharge : source ~/.bashrc

