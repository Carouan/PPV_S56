Oui, c’est tout à fait possible. Pour chercher rapidement une tâche planifiée susceptible d’exécuter un redémarrage, tu peux :

1. **Utiliser l’interface graphique** du Planificateur de tâches
    
    - Ouvre **Task Scheduler** (Win+R → `taskschd.msc`)
    - Parcours la “Bibliothèque du Planificateur de tâches” et chaque sous-dossier.
    - Observe dans la colonne **“Actions”** si tu vois un appel à `shutdown.exe /r`, `Restart-Computer`, ou quoi que ce soit évoquant un redémarrage ou un arrêt.
    - Tu peux aussi trier par **“Dernière exécution”** ou “Prochaine exécution” pour repérer ce qui se déclenche régulièrement.
2. **Avec PowerShell** (pour lister les tâches et examiner leurs actions) :
    
    powershell
    
    # Lister toutes les tâches planifiées
    
Get-ScheduledTask |
  ForEach-Object {
    # Récupérer le nom de la tâche et les actions
    $taskName = $_.TaskName
    $actions = $_.Actions

    # Pour chaque action, on vérifie s'il y a mention de "shutdown" ou "Restart-Computer"
    foreach ($action in $actions) {
      $cmd = $action.Execute
      $args = $action.Arguments
      # On teste si la commande ou les arguments contiennent "shutdown" ou "restart"
      if ($cmd -match 'shutdown' -or $cmd -match 'restart' -or
          $args -match 'shutdown' -or $args -match 'restart') {
        Write-Host "Tâche suspecte : $taskName"
        Write-Host "Action: $($action.Execute) $($action.Arguments)"
        Write-Host "-----"
      }
    }
  }

    
    - Cette petite boucle va écrire dans la console le nom de chaque tâche **dont les actions contiennent “shutdown” ou “restart”** (dans la commande ou les arguments).
    - Bien sûr, adapte la recherche si tu soupçonnes un autre mot‐clé (`/r`, `/f`, etc.).
    - 
3. **Regarder les journaux Système** (Event Viewer)
    
    - Ouvre **Observateur d’événements** (Win+R → `eventvwr.msc`)
    - Dans “Journaux Windows → Système”, cherche les événements autour du moment exact où le PC redémarre.
    - Tu verras parfois un événement **6006** (arrêt correct), **6008** (arrêt inopiné) ou un ID **1074** mentionnant quelle application ou quel utilisateur a provoqué le redémarrage.
4. **Autres pistes**
    
    - Un script ou un programme tiers hors du Planificateur de tâches qui utilise `shutdown.exe /r`.
    - Un paramètre de **stratégie de groupe (GPO)** au niveau d’un domaine (en entreprise) ou local.
    - Un **service** Windows ou un outil de maintenance/antivirus qui forcerait un reboot.
    - Les mises à jour Windows (Windows Update) si elles sont configurées pour redémarrer de force.

En général, commencer par **Task Scheduler** (manuel ou via `Get-ScheduledTask`) est le plus rapide. Parcourir l’historique Système (Event Viewer) peut ensuite confirmer ce qui déclenche le redémarrage. Bon courage dans ta traque de la tâche “coupable” !

o1