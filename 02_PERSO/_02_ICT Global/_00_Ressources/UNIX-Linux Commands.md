

https://fr.wikipedia.org/wiki/Uname


https://fr.wikipedia.org/wiki/Write_(Unix)

https://fr.wikipedia.org/wiki/Talk_(logiciel)



En Linux, les commandes `write` et `talk` permettent de communiquer avec d'autres utilisateurs. `write` permet d'envoyer un message à un utilisateur spécifique, tandis que `talk` permet d'établir une conversation interactive en temps réel avec un autre utilisateur. 

`write`:
- **Fonctionnement:**
    La commande `write` envoie un message à l'utilisateur spécifié, en affichant le message sur son terminal. 
- **Syntaxe:**
    `write utilisateur [nom_terminal]` 
- **Exemple:**
    Pour envoyer un message à l'utilisateur "june", tapez `write june` suivi de votre message. Pour terminer la conversation, utilisez Ctrl+D. 
- **Limitation:**
    `write` ne permet pas une conversation bidirectionnelle. L'utilisateur destinataire doit également utiliser `write` pour répondre. 
- **Contrôle:**
    La commande `mesg` permet de contrôler si les autres utilisateurs peuvent vous envoyer des messages avec `write`. 
`talk`:
- **Fonctionnement:** `talk` permet d'établir une conversation interactive en temps réel, où les messages s'affichent simultanément dans les terminaux des deux utilisateurs. 
- **Syntaxe:** `talk utilisateur [nom_terminal]` 
- **Exemple:** Pour démarrer une conversation avec l'utilisateur "june", tapez `talk june`. Les deux utilisateurs verront les messages de l'autre dans des fenêtres séparées. 
- **Conversation:** Les utilisateurs peuvent taper et voir les messages de l'autre utilisateur en temps réel. 
- **Fin de session:** Utilisez la commande `quit` pour mettre fin à la conversation. 

En résumé: Utilisez `write` pour envoyer un message ponctuel et `talk` pour une conversation interactive.


https://phoenixnap.com/kb/write-command-in-linux

https://www.ibm.com/docs/fr/aix/7.3.0?topic=w-write-command

https://www.reseaux-telecoms.net/actualites/lire-communiquer-avec-d-autres-utilisateurs-sur-la-ligne-de-commande-linux-27928.html#:~:text=Commande%20write,communiquer%20avec%20un%20utilisateur%20sp%C3%A9cifique.&text=Entrez%20votre%20texte%20et%20utilisez,inactivit%C3%A9%20est%20le%20plus%20court.

https://fr.wikipedia.org/wiki/Commandes_Unix#Divers



















