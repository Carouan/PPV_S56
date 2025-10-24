
tags: #export #zettelkasten #organisation
date: 2025-06-27

---

## 📌 Bootstrap est-il un framework ?
tags: #question #css #framework  
date: 2025-06-27

### ❓ Question  
Est-ce que Bootstrap peut être considéré comme un framework CSS ?

### ✅ Réponse / Contenu  
Oui, Bootstrap est bien considéré comme un **framework CSS**. Il fournit des composants prêts à l'emploi, une structure d'architecture CSS/JS, et facilite le développement de sites responsifs.  
Il impose des conventions, ce qui le distingue d’une bibliothèque classique.

---

## 📌 Différence entre framework et bibliothèque
tags: #question #webdev #architecture  
date: 2025-06-27

### ❓ Question  
Quelle est la différence entre une bibliothèque et un framework ?

### ✅ Réponse / Contenu  
- Une **bibliothèque** est appelée par ton code (tu es le chef d’orchestre).  
- Un **framework** appelle ton code et impose une structure (c’est lui qui orchestre).

---

## 📌 Peut-on mélanger plusieurs frameworks ?
tags: #question #architecture #webdev  
date: 2025-06-27

### ❓ Question  
Peut-on utiliser plusieurs frameworks sur un même site ou projet ?

### ✅ Réponse / Contenu  
Oui, mais attention à la complexité croissante. Sur un petit projet avec des pages isolées, cela peut être pertinent. Pour un projet plus ambitieux, cela complique la maintenance et augmente les temps de chargement.

---

## 📌 Projet d’un site vitrine multi-frameworks
tags: #idée #projet #webdev  
date: 2025-06-27

### 💡 Idée  
Créer un site vitrine comparatif avec une page par framework utilisé (Vue, Angular, Svelte, React, etc.), permettant de démontrer la même fonctionnalité avec chaque outil.

---

## 📌 Utilisation d’un reverse proxy
tags: #question #serveur #nginx #raspberrypi  
date: 2025-06-27

### ❓ Question  
Comment orchestrer plusieurs backends sur un même serveur ?

### ✅ Réponse / Contenu  
On utilise un **reverse proxy** comme Nginx ou Traefik. Il agit comme point d’entrée unique, redirige les requêtes selon l’URL, le port ou d’autres règles. Très utile pour tester sur Raspberry Pi avant déploiement.

---

## 📌 Apache vs Nginx
tags: #comparatif #serveur #web  
date: 2025-06-27

### ❓ Question  
Quelle est la différence entre Apache et Nginx ?

### ✅ Réponse / Contenu  
- **Nginx** : performant, léger, idéal pour les connexions simultanées.  
- **Apache** : modulable, historique, plus utilisé pour du contenu dynamique (PHP, mod_proxy…).

---

## 📌 Contrôleur de domaine vs reverse proxy
tags: #réflexion #réseau #web  
date: 2025-06-27

### 🤔 Réflexion  
Un reverse proxy (comme Nginx) n’est pas un contrôleur de domaine. Le contrôleur de domaine gère l’identité et les droits sur un réseau (AD/LDAP), tandis qu’un reverse proxy redirige le trafic web selon des règles.

---

## 📌 Projet de QoS avec Raspberry Pi
tags: #idée #réseau #raspberrypi  
date: 2025-06-27

### 💡 Idée  
Installer `tc` ou `OpenWRT` sur un Raspberry Pi placé entre le routeur et le réseau interne, pour appliquer des règles de QoS. Cela permettrait d’améliorer la qualité de service, même avec une box limitée.

---

## 📌 Lien entre Nginx et priorisation réseau
tags: #réflexion #réseau #qos  
date: 2025-06-27

### 🤔 Réflexion  
Nginx ne fait pas du QoS réseau. Il gère la répartition du trafic HTTP côté serveur. Le QoS se fait côté réseau (routeur/pare-feu). Il faut une configuration cohérente entre les deux couches pour éviter les conflits.

---