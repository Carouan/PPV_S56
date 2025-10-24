
#### 🔎 Analyse des besoins

- Interface semblable à un tableur (formules, calculs dynamiques).    
- Capacité à intégrer des scripts Python.    
- Interface graphique soignée et responsive.    
- Portabilité (idéalement utilisable localement et en ligne).    
- Système modulaire pour ajouter des "modules logiques" comme dans Excel.    

---
#### 🥇 Candidats retenus

##### 1. **Grist**
- Interface de tableur accessible en ligne.    
- Puissant système de formules et de scripts en **Python**.    
- Possibilité d’auto-hébergement via **Docker**.    
- Limites :    
    - Version locale uniquement via serveur web.        
    - Uniquement orienté "tableur" (pas d’app multi-fonction).        
    - Interface dans le navigateur (nécessite ressource + onglet ouvert).        

🔗 Site officiel : [https://www.getgrist.com](https://www.getgrist.com)

---

##### 2. **NiceGUI**

https://nicegui.io/
https://github.com/zauberzeug/nicegui/tree/main
https://pypi.org/project/nicegui/


- Framework Python pour créer des interfaces **modernes et interactives**.    
- Repose sur :    
    - **ASGI** pour gérer les protocoles Web modernes.        
    - **Uvicorn** pour exécuter et servir l'app.  https://www.uvicorn.org/      
    - **Starlette** comme micro-framework backend.  https://www.starlette.io/      
- Peut être combiné avec **Tauri** ou **Electron** pour créer une app de bureau.    

👍 Avantages :
- Interface web personnalisable.    
- Tu contrôles tout le code Python.    
- Facile à packager (avec Tauri, PyInstaller, etc.)    

👎 Inconvénients :
- Besoin de connaissances sur les stacks web.    
- Aucune interface "type tableur" intégrée par défaut (il faut la coder).    

---
#### 🖥️ Stack technique recommandée

- Frontend : NiceGUI (Python → HTML/JS/CSS auto)
- Backend  : Python (ASGI) + Starlette Serveur  : Uvicorn
- Packaging (optionnel) : Tauri / Electron / PyInstaller`

> Cette stack permet de créer une **application de bureau ou web**, avec un frontend léger, et un backend Python **intégrable à tes scripts et modules Excel migrés**.

---
#### 🧱 Idée de projet futur

Créer un **NiceTableur** :
- Une interface de saisie "type Excel".    
- Utilise Python comme moteur de calcul (formules, règles, agrégats).    
- Designé avec **NiceGUI**.    
- Packaging via **Tauri**.    
- Sauvegarde des projets en `.json` ou `.sqlite`.


Ressources : #ressources 

https://www.bitdoze.com/nicegui-get-started/
https://developer-service.blog/an-intro-to-nicegui-a-modern-python-framework-for-building-web-uis/


