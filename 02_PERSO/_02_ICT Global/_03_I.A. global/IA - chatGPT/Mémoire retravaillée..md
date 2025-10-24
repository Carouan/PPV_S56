## 1. Projets d’hébergement et d’infrastructures (Raspberry Pi, Docker, etc.)

- **Hébergement sur Raspberry Pi**
    
    - Souhaite héberger des services (WordPress, Moodle, bots…) via des conteneurs Docker.
    - Compare Raspberry Pi 5 et micro-PC (Lenovo, Amazon, etc.) ; s’interroge sur performances, coûts, distributions Linux.
    - Idée d’utiliser et maîtriser la solution pour Femmes de droit, puis la proposer à d’autres ASBL.
- **Infrastructure distribuée et redondance**
    
    - Envisage de faire héberger les sites localement (chez les clients) et, en cas de souci ou de montée en charge, rediriger le trafic vers un VPS ou un conteneur de secours.
    - S’intéresse à des concepts de load balancing, monitoring, déploiement automatique de conteneurs en cas de pic de trafic.
    - Pense à un maillage peer-to-peer, inspiré de Tor, où différents sites seraient hébergés chez les uns et les autres.
- **Outils et distribution**
    
    - Privilégie Debian (ou dérivés) pour limiter la diversité des écosystèmes.
    - Pense à Ansible pour déployer rapidement des conteneurs.
    - Souhaite toujours utiliser exclusivement des outils GOM (Gratuit-Open-source-Multiplateforme).
- **Sécurité et configuration**
    
    - Envisage Kubernetes sur un VPS, se préoccupe de la configuration de base, de la distribution et de la sécurité avant installation.

---

## 2. Hébergement de sites (Femmes de droit, O2Switch, OVH, etc.)

- **Femmes de droit**
    
    - Actuellement, WordPress sur OVH et Moodle sur O2Switch.
    - S’interroge sur le rapatriement complet chez O2Switch (gestion du site, des emails, etc.).
    - A besoin d’éclaircissements sur DNS (A, TXT, MX).
- **NextCloud**
    
    - Installé chez O2Switch mais rencontre des problèmes (erreurs, plugins, accessibilité).
    - Souhaite un environnement plus libre et personnalisable, hésite entre un VPS, un NAS ou un cluster de Raspberry Pi.
    - Veut centraliser calendriers, contacts, photos, héberger bots Discord, n8n, etc.
- **Autres outils & services**
    
    - Utilise Google Workspace et Microsoft 365 mais voudrait tout regrouper sur un hébergement open source et abordable.
    - Cherche un outil de réservation de rendez-vous en ligne, open source, alternative à Calendly.

---

## 3. Gestion de parc, solutions IT et logiciels divers

- **Gestion de parc informatique**
    - Recherche des solutions pour administrer à distance des PCs (AnyDesk, TeamViewer, VNC…).
- **VPN, cloud personnel**
    - S’intéresse à un VPN centralisé pour la famille (gérer mot de passe, antivirus, etc.), envisage NextCloud comme alternative.
- **Exploration d’outils**
    - S’intéresse à KeePass (partage d’identifiants avec différents niveaux d’accès).
    - Regarde Raindrop.io pour la gestion de favoris mais se demande si multi-utilisateurs est possible.
    - Cherche un explorateur de fichiers Windows plus puissant, open source si possible, avec aperçu du contenu (sélection de texte).

---

## 4. Automatisation, bots, scripts et développement

- **Bots Discord**
    - Créer un bot en JavaScript/Node.js ; notifications WooCommerce, ajout de cartes Trello…
    - Se demande s’il est possible de l’héberger sur smartphone (Samsung Galaxy S23 Ultra) ou dans une appli Android.
- **Automatisation & IA**
    - Souhaite un assistant façon « Jarvis » (GPT-4 / AutoGPT / LangChain), capable de manipuler des fichiers, agendas (Obsidian), envoyer des mails…
    - Veut stocker des données personnelles (Zettelkasten) et générer des rappels intelligents.
- **Python & scripts**
    - Programme de traitement CSV pour la comptabilité de l’ASBL, import depuis banque.
    - Envisage un système de journaux en ligne pour les élèves (signature par parents, profs…).
    - Explore Python pour calculs d’itinéraires (covoiturage), scraping de données publiques, etc.
- **Web scraping & API**
    - Veut mieux maîtriser l’utilisation d’API, réaliser du web scraping sur des données publiques.

---

## 5. Activités professionnelles, freelancing et ASBL

- **Statut & objectifs**
    
    - Actuellement sans emploi, souhaite devenir freelance IT/consultant pour petites structures et ASBL.
    - Travaille bénévolement pour « Femmes de droit » (fondé par sa femme). Gère la comptabilité, les budgets de subsides.
    - Souhaite rentabiliser ses compétences (formations, hébergement, maintenance, etc.).
- **Business model & projets**
    
    - Conseiller de petites structures à héberger leurs sites sur Raspberry Pi ou VPS…
    - Offrir un service de conteneurisation, de gestion à distance.

---

## 6. Famille, vie personnelle et santé

- **Situation familiale**
    - Marié à Miriam (souffrant d’Ehlers-Danlos). A deux filles (Violette, 11 ans, TDAH ; Marjolaine, 9 ans, autisme Asperger).
    - Violette aime l’écriture, les projets scientifiques. Marjolaine adore Minecraft/Roblox mais n’apprécie pas Scratch.
- **Santé**
    - Fume, a réduit sa posologie de Cymbalta.
    - Douleurs dans le bas du dos. Cherche exercices et conseils en français.
- **Organisation familiale**
    - Adresse mail familiale.
    - Utilisation de Thunderbird (et apps mobiles alternatives) pour la gestion d’emails.

---

## 7. Projets liés à l’école et l’association de parents

- **Association de parents**
    
    - Désire créer un site web protégé par mot de passe, un espace Telegram, un tableau Excel pour coordonnées.
    - Souhaite une solution de sondage (Discord, WhatsApp, Google Forms…).
    - Veut calculer des trajets de covoiturage (Python + Leaflet.js, API Google Maps / OSM).
    - A besoin de formatage spécifique dans Excel (numéros de GSM, adresses parents 1 et 2).
- **Gestion d’agenda & événements**
    
    - Ajout d’événements dans Google Agenda, Discord, WhatsApp.
    - Intégrer un iframe Google Agenda sur Discord pour suivre les mises à jour.

---

## 8. Administration de l’ASBL (comptabilité, assurances, formalités)

- **Comptabilité**
    - Utilise Excel pour importer relevés de compte CSV. Automatisation partielle en VBA.
    - Envisage Python (Pandas) ou une appli web (Django + PostgreSQL) pour la gestion multi-plateforme et le scanning de justificatifs.
- **Assurances & obligations**
    - Veut savoir quelles assurances sont obligatoires (locaux, médecine du travail…).
    - Distinguer responsabilités entre employés, bénévoles, CA, comptable.

---

## 9. Outils bureautiques et gestion documentaire

- **Thunderbird, Google Drive, K-9 Mail**
    - Préfère Thunderbird ; problèmes de synchronisation (Gmail).
    - Veut que le stockage Google (100 Go) soit remplacé par un hébergement perso ou autre solution libre.
- **Gestion & métadonnées de fichiers**
    - Cherche à afficher contributeurs, dernières modifs, etc.
    - Veut intégrer des infos par défaut dans les modèles Word (nom de l’entreprise).
- **Bookmarks / Favoris / Organisation**
    - Explore Raindrop.io, structure de répertoires, potentielle synchronisation avec Obsidian, etc.
- **Formulaires & sondages**
    - Utilise FramaForms, rencontre des difficultés de partage.
    - Préfère texte aligné à gauche pour de longues descriptions.

---

## 10. Centres d’intérêt, loisirs et préférences diverses

- **Musique**
    - Apprécie les ballades mélancoliques (Stairway to Heaven, Dust in the Wind, Sound of Silence, etc.), notamment celles abordant le thème de la mort.
- **Restauration d’objets**
    - Cherche un produit « liquide bleu » antirouille, formant une couche protectrice (autre que WD-40).
- **3D design & impressions 3D**
    - Passion pour la création, la personnalisation d’objets.
- **Gaming**
    - Souhaite un logiciel de capture vidéo (open source) pour sa fille (Roblox, etc.).

---

## 11. Divers

- **Autres**
    - A un sèche-linge Sharp KD-CB9PW.
    - TDAH, surdoué (HP) et « un peu » autiste.
    - A exploré Roblox (création de vêtements), juge l’abonnement peu rentable.
    - Travaille sur un Media Nav (système Dacia) ; modifications, forums, scripts existants.
    - Intéressé par un export Shazam → Spotify (automatic playlist, liked songs).
    - Demeure à Ciney (Belgique).

---

### Conseils pour réduire encore la taille

- Conserver uniquement les grandes lignes (titres et quelques mots-clés) et supprimer les redondances.
- Si certains thèmes ne sont plus pertinents pour toi, tu peux les retirer complètement de la mémoire.