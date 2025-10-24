<%*
const fs = require('fs');
const vaultPath = app.vault.adapter.basePath;
const configPath = vaultPath + '/.obsidian/community-plugins.json';

let activePlugins = [];
try {
  // Lit le contenu du fichier community-plugins.json
  const configData = fs.readFileSync(configPath, 'utf-8');
  // Convertit la chaîne JSON en tableau d’IDs de plugins
  activePlugins = JSON.parse(configData);
} catch (e) {
  tR += "Impossible de lire le fichier community-plugins.json ou il n'existe pas.\n";
}

// Si aucun plugin n’est activé ou si le fichier est vide :
if (activePlugins.length === 0) {
  tR += "Aucun plugin actif, ou fichier community-plugins.json non valide.\n";
} else {
  tR += "## Plugins communautaires actifs\n\n";
  // Pour chaque plugin activé, on l’affiche sous forme de liste
  activePlugins.forEach(plugin => {
    tR += `- **${plugin}**\n`;
  });
}
%>
