<# 
Setup All — PC Windows
- Installe/Met à jour : Git, rclone, Syncthing, Obsidian (via winget)
- Prépare SSH + Git global
- Initialise le repo Git dans le Vault
- Écrit la config du plugin Obsidian Git
- Déploie le contenu du sync_pack.zip
- (Option) crée une tâche planifiée rclone

⚠️ Lance PowerShell en *utilisateur* (pas besoin d'admin pour la plupart des étapes).
#>

param(
  [Parameter(Mandatory=$true)][string]$VaultPath,
  [Parameter(Mandatory=$true)][string]$RepoSshUrl,          # ex: git@github.com:Carouan/PPV_S56.git
  [Parameter(Mandatory=$true)][string]$GitUserName,
  [Parameter(Mandatory=$true)][string]$GitUserEmail,
  [string]$DriveBridgePath = "D:\Data\DriveBridge\Publications",
  [string]$SyncPackZip = "$PSScriptRoot\sync_pack.zip",
  [switch]$RegisterRcloneTask
)

function Ensure-Winget {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "Winget introuvable. Installe Windows App Installer depuis Microsoft Store."
    exit 1
  }
}

function Winget-InstallIfMissing($id){
  $pkg = winget list --id $id 2>$null
  if ($LASTEXITCODE -ne 0 -or -not $pkg) {
    Write-Host "Installation: $id"
    winget install --id $id --accept-package-agreements --accept-source-agreements -h
  } else {
    Write-Host "OK: $id déjà présent"
  }
}

Ensure-Winget

# 1) Outils
Winget-InstallIfMissing "Git.Git"
Winget-InstallIfMissing "Rclone.Rclone"
Winget-InstallIfMissing "Syncthing.Syncthing"
Winget-InstallIfMissing "Obsidian.Obsidian"

# 2) Git global + SSH
if (-not (Test-Path "$HOME\.ssh\id_ed25519")) {
  ssh-keygen -t ed25519 -f "$HOME\.ssh\id_ed25519" -N "" | Out-Null
  Write-Host "Clé SSH générée: $HOME\.ssh\id_ed25519.pub"
}
git config --global user.name "$GitUserName"
git config --global user.email "$GitUserEmail"
git config --global core.autocrlf true

# 3) Init repo dans le Vault
$Vault = (Resolve-Path $VaultPath).Path
if (-not (Test-Path $Vault)) { throw "VaultPath introuvable: $Vault" }

Push-Location $Vault
if (-not (Test-Path ".git")) {
  git init
}
# safe.directory (Git >=2.35)
git config --global --add safe.directory "$Vault"
# remote
$remote = git remote get-url origin 2>$null
if (-not $remote) {
  git remote add origin $RepoSshUrl
}
# commit init si nécessaire
if (-not (git rev-parse --verify HEAD 2>$null)) {
  git add -A
  git commit -m "init: initial commit"
}
# branch + upstream
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -eq "HEAD") { $branch = "main"; git branch -M $branch }
git push -u origin $branch
Pop-Location

# 4) Config Obsidian Git (data.json)
$GitPluginDir = Join-Path $Vault ".obsidian\plugins\obsidian-git"
New-Item -ItemType Directory -Force -Path $GitPluginDir | Out-Null

$data = @{
  autoCommitMessage = "vault(auto): {{date}} {{time}}"
  autoPullOnBoot = $true
  autoSaveInterval = 10   # minutes
  pullBeforePush = $true
  disablePush = $false
  showStatusBar = $true
} | ConvertTo-Json -Depth 3
$data | Out-File (Join-Path $GitPluginDir "data.json") -Encoding UTF8

Write-Host "Config écrite: $GitPluginDir\data.json"
Write-Host "👉 Ouvre Obsidian, active le plugin Obsidian Git (Community plugins) puis redémarre l'app."

# 5) Déployer sync_pack.zip (scripts & modèles)
if (Test-Path $SyncPackZip) {
  $dest = Join-Path $PSScriptRoot "sync_pack"
  if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
  Expand-Archive -Path $SyncPackZip -DestinationPath $dest
  Write-Host "sync_pack extrait dans: $dest"
} else {
  Write-Host "sync_pack.zip introuvable à $SyncPackZip (étape ignorée)"
}

# 6) Tâche planifiée rclone (optionnel)
if ($RegisterRcloneTask) {
  $bat = Join-Path $PSScriptRoot "sync_pack\windows\rclone_sync_publications.bat"
  if (-not (Test-Path $bat)) { Write-Warning "BAT rclone introuvable: $bat"; } 
  $Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$bat`""
  $Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(5)
  $Trigger.Repetition = (New-ScheduledTaskTrigger -Once -At (Get-Date)).Repetition
  $Trigger.Repetition.Interval = "PT2H"
  Register-ScheduledTask -TaskName "rclone_publications_sync" -Action $Action -Trigger $Trigger -Description "Sync Publications -> Google Drive" -User "$env:UserName" -RunLevel Limited -Force | Out-Null
  Write-Host "Tâche planifiée créée: rclone_publications_sync"
}

Write-Host "✅ Setup terminé."
