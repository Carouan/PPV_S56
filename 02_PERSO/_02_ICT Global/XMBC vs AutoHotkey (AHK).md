## XMBC vs AutoHotkey (AHK) — quoi choisir ?

**Objectif “moins d’outils” + GLOM** → pars sur **AutoHotkey (v2)** comme base unique.  
Pourquoi :

- **Puissance & souplesse** : remaps par application (`#HotIf WinActive(...)`), macros, conditions, temporisations, fenêtres, presse-papier, etc.
- **Portabilité** : un seul script versionné (git), facile à partager/modifier.
- **Intégration** : AHK parle très bien avec Rainmeter (fichier texte/INI, ligne de commande, etc.).

Quand **XMBC** peut rester pertinent :

- Tu veux **une UI prête à l’emploi** pour des profils par app sans coder.
- Tu as besoin de **fonctions “chording”/combinaisons** ou **tilt-wheel** rapidement, et tu ne veux pas écrire le script tout de suite.
- Certaines souris exposent des boutons “exotiques” que les drivers/firmwares traduisent bizarrement : XMBC les détecte parfois plus facilement. (Mais AHK s’en sort généralement très bien.)

👉 Mon recommandation “propre” : **AHK pour 100% des remaps**, et ne garder **aucun** autre outil — sauf si une fonction matérielle très spécifique n’est accessible qu’avec le driver du fabricant (Logitech/Razer), auquel cas **désactive leurs remaps** et laisse **AHK** gérer la logique.

---

## Rappel express : comment Rainmeter “se connecte”

Rainmeter n’est pas un remappeur global d’entrées, mais un **moteur de widgets** qui sait :

- **Lire/afficher des fichiers** locaux (via WebParser), INI/TXT/JSON (avec Lua si besoin).
- **Lancer des commandes**/scripts externes (plugin **RunCommand**) et **récupérer la sortie**.
- **Cliquer = action** : `LeftMouseUpAction`, etc. → parfait pour appeler AHK avec des paramètres.
- **Mesures système** : CPU/RAM/GPU (UsageMonitor), **process**, **réseau**, **audio** (AudioLevel/NowPlaying), **Registre**, **Perf counters**, **Ping**, **SysInfo**, **Recycle**, **Time**, etc.
- **Scripts Lua** & **InputText** pour interactions avancées.

Conclusion : **Rainmeter = tableau de bord / panneau de contrôle**, et **AHK = moteur d’automations & remaps**. Ensemble, c’est top.

---

## Mini-starter pack (AHK v2 + Rainmeter)

But :

1. Remapper XButton1/XButton2/WheelLeft/WheelRight via **AHK**.
2. Exporter un **fichier texte** lisible par **Rainmeter** pour afficher tes raccourcis.
3. **Cliquer dans le widget** pour changer les actions (AHK est appelé avec `--set …`).

### 1) `input_manager.ahk` (AutoHotkey v2)

> Sauvegarde ce fichier où tu veux (ex. `C:\Tools\InputManager\input_manager.ahk`).  
> Il crée/charge `input_manager.ini` au même endroit et exporte `export_shortcuts.txt`.

````
#Requires AutoHotkey v2.0
Persistent
SetTitleMatchMode "RegEx"

; --- Paths (à adapter si besoin) ---
base   := A_ScriptDir
ini    := base "\input_manager.ini"
export := base "\export_shortcuts.txt"

; --- INI par défaut si absent ---
if !FileExist(ini) {
    IniWrite("^w",                                 ini, "global", "XButton1")
    IniWrite("^{Tab}",                             ini, "global", "XButton2")
    IniWrite("^{Shift Down}{Tab}{Shift Up}",       ini, "global", "WheelLeft")
    IniWrite("^{Tab}",                             ini, "global", "WheelRight")
}

; --- États en mémoire ---
actions := Map()   ; bouton => chaîne Send()
funcs   := Map()   ; bouton => fonction wrapper pour Hotkey()

; Utilitaires
StrJoin(arr, sep) {
    out := ""
    for i, v in arr
        out .= (i>1 ? sep : "") v
    return out
}

Humanize(keys) {
    rep := Map(
        "^{Tab}", "Ctrl+Tab",
        "^{Shift Down}{Tab}{Shift Up}", "Ctrl+Shift+Tab",
        "^w", "Ctrl+W",
        "!{F4}", "Alt+F4",
        "^{PgUp}", "Ctrl+PgUp",
        "^{PgDn}", "Ctrl+PgDn"
    )
    return rep.Has(keys) ? rep[keys] : keys
}

SendWrapper(keys) => (*) => Send(keys)

ExportBindings() {
    global export, actions
    lines := []
    for btn, val in actions
        lines.Push(Format("{1}: {2}", btn, Humanize(val)))
    FileDelete(export)
    FileAppend(StrJoin(lines, "`r`n"), export, "UTF-8")
}

ApplyBindings() {
    global ini, actions, funcs
    ; Désactiver anciens hotkeys
    for btn, f in funcs
        try Hotkey(btn, f, "Off")
    funcs.Clear(), actions.Clear()

    btns := ["XButton1","XButton2","WheelLeft","WheelRight"]
    for b in btns {
        val := IniRead(ini, "global", b, "")
        if (val != "") {
            f := SendWrapper(val)
            Hotkey(b, f, "On")
            funcs[b]   := f
            actions[b] := val
        }
    }
    ExportBindings()
}

; --- CLI: --set "XButton1=^w" ---
if A_Args.Length >= 2 && A_Args[1] = "--set" {
    pair := A_Args[2]
    if (pos := InStr(pair, "=")) {
        btn := SubStr(pair, 1, pos-1)
        val := SubStr(pair, pos+1)
        IniWrite(val, ini, "global", btn)
        ApplyBindings()
    }
    ExitApp
}

; --- Menu Tray ---
A_TrayMenu.Delete()
A_TrayMenu.Add("Reload", (*) => ApplyBindings())
A_TrayMenu.Add("Open INI", (*) => Run(ini))
A_TrayMenu.Add()
A_TrayMenu.Add("Exit", (*) => ExitApp())

; --- Démarrage ---
ApplyBindings()
return

; --- Exemples de contextes par application (décommente si tu veux) ---
; #HotIf WinActive("ahk_exe chrome.exe")
; XButton1::Send("^w")
; XButton2::Send("!{Left}")
; #HotIf
````

> Remarques :
> - Fais tourner **AHK** et **tes applis** au **même niveau de privilèges** (évite un AHK “Admin” et un app “User” ou l’inverse).
> - Si ta molette horizontale/tilt n’est pas reconnue, essaie d’abord sans le driver constructeur (ou désactive ses remaps), puis vérifie dans AHK avec **Key history**.

### 2) `input_manager.ini` (auto-créé)

Tu pourras modifier ces lignes à la main ou via Rainmeter :

````
[global]
XButton1=^w
XButton2=^{Tab}
WheelLeft=^{Shift Down}{Tab}{Shift Up}
WheelRight=^{Tab}
````

### 3) Skin Rainmeter minimal (affichage + clic pour changer)

> Crée un dossier skin, ex. `Documents\Rainmeter\Skins\InputManagerPanel\InputManagerPanel.ini`

````
[Rainmeter]
Update=1000
AccurateText=1

[Variables]
; >>> ADAPTE CES CHEMINS <<<
AhkExe=C:\Program Files\AutoHotkey\v2\AutoHotkey.exe
AhkScript=C:\Tools\InputManager\input_manager.ahk
ExportFile=C:\Tools\InputManager\export_shortcuts.txt
FontName=Segoe UI
FontSize=10

; -- Lire le fichier exporté par AHK (2 premières lignes)
[MeasureExport]
Measure=Plugin
Plugin=WebParser
URL=file://#ExportFile#
RegExp=(?siU)^(.*)\R(.*)
UpdateRate=1

; Ligne 1 (ex: XButton1: Ctrl+W) - clic gauche/droit pour basculer
[Line1]
Meter=String
MeasureName=MeasureExport
StringIndex=1
FontFace=#FontName#
FontSize=#FontSize#
AntiAlias=1
Text=%1
LeftMouseUpAction=["#AhkExe#" "#AhkScript#" --set "XButton1=^w"]
RightMouseUpAction=["#AhkExe#" "#AhkScript#" --set "XButton1=!{F4}"]

; Ligne 2 (ex: XButton2: Ctrl+Tab) - clic gauche/droit pour basculer
[Line2]
Meter=String
MeasureName=MeasureExport
StringIndex=2
FontFace=#FontName#
FontSize=#FontSize#
Y=20
AntiAlias=1
Text=%2
LeftMouseUpAction=["#AhkExe#" "#AhkScript#" --set "XButton2=^{Tab}"]
RightMouseUpAction=["#AhkExe#" "#AhkScript#" --set "XButton2=^{Shift Down}{Tab}{Shift Up}"]
````

> Astuces importantes (tu as déjà buté là-dessus) :
> 
> - **Ne mets pas** de guillemets autour des variables Rainmeter (`#AhkExe#`, `#AhkScript#`).
> - Garde les **arguments** entre guillemets **individuels** comme dans l’exemple.
> - Les accolades `{}` dans `Send` **n’ont aucun effet** spécial dans Rainmeter, donc tu peux les passer sans échapper.
>     

---

## Exemple rapide de remaps par application (AHK v2)

Tu peux compléter ton script avec des blocs ciblés :

````
#HotIf WinActive("ahk_exe code.exe")  ; VS Code
XButton1::Send("^`")      ; Terminal intégré
XButton2::Send("^b")      ; Explorer

#HotIf WinActive("ahk_exe chrome.exe|msedge.exe")
XButton1::Send("^w")      ; Fermer onglet
XButton2::Send("^{Tab}")  ; Onglet suivant

#HotIf  ; (retour au global)
````

---

## En bref

- **Oui**, tout ce que fait XMBC, **AHK** peut le faire (souvent **mieux** et de façon plus intégrable), sauf cas matériel très spécifique.
- **Rainmeter** n’est pas un remappeur, mais **l’interface visuelle** idéale pour **voir** et **piloter** tes remaps AHK.
- Le **starter pack** ci-dessus te donne : remaps globaux, export lisible, et boutons Rainmeter pour changer à la volée.

Si tu veux, je te fais une version **avec profils** (bascule “Travail/Jeu/Montage”) et une **liste dynamique** de tes raccourcis AHK “abréviations.ahk” affichée dans le widget.