




![[Pasted image 20250726144122.png]]

![[Pasted image 20250726144154.png]]



"C:\Users\Seb\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"

"C:\Users\Seb\Documents\PowerShell\Microsoft.PowerShell_profile.ps1"

"C:\CarouanScripts\CarouanSetup_PowerShell\install.ps1"


https://github.com/dlwyatt/WinFormsExampleUpdates

https://learn.microsoft.com/fr-be/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.5

https://learn.microsoft.com/fr-be/powershell/scripting/overview?view=powershell-7.5


https://learn.microsoft.com/fr-be/powershell/scripting/samples/multiple-selection-list-boxes?view=powershell-7.5


Windows Registry Editor Version 5.00

; Crée un sous-menu dans le clic droit
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso]
"MUIVerb"="📂 Carouan's Scripts"
"SubCommands"=""

; Premier script : Arborescence (PowerShell)
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso\shell\Arborescence]
@="📄 Générer arborescence"
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso\shell\Arborescence\command]
@="powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\\CarouanScripts\\Get-FolderContents.ps1\""

; Deuxième script : tri_mails (Python)
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso\shell\Trier Mails]
@="Trier les mails"
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso\shell\Trier Mails\command]
@="pythonw.exe \"C:\\CarouanScripts\\tri_mails.py\""

; Troisième script : Réseaux Wi-Fi
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso\shell\Afficher Réseaux WiFi]
@="📶 Réseaux WiFi (SSID & PWD)"
[HKEY_CLASSES_ROOT\Directory\Background\shell\Scripts Perso\shell\Afficher Réseaux WiFi\command]
@="powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\\CarouanScripts\\afficher_reseaux_wifi.ps1\""




"C:\CarouanScripts\add-multiscript-context.reg"

; ----------------------------------------------------------------------------------------------

; Windows Registry Editor Version 5.00

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts]
; @="📂 Carouan Scripts"
; "Icon"="cmd.exe"

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts\shell\01_Arborescence"]
; @="📄 Générer arborescence"

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts\shell\01_Arborescence\command]
; @="powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\\CarouanScripts\\Get-FolderStructure.ps1\" \"%1\""

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts\shell\02_Réseaux_Wifi"]
; @="📶 Réseaux WiFi (SSID & PWD)"

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts\shell\02_Réseaux_Wifi\command]
; @="powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"C:\\CarouanScripts\\afficher_reseaux_wifi.ps1\""

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts\shell\03_Alias_BAT"]
; @="⚙️ Lancer alias.bat"

; [HKEY_CLASSES_ROOT\Directory\shell\CarouanScripts\shell\03_Alias_BAT\command]
; @="cmd.exe /c \"C:\\CarouanScripts\\alias.bat\""


