<%*## Liste des plugins communautaires

- [x] **templater-obsidian**
- [x] **dataview**
- [x] **colored-text**
- [x] **code-emitter**
- [x] **chatgpt-md**
- [x] **buttons**
- [ ] obsidian-admonition
- [x] **multi-column-markdown**
- [x] **make-md**
- [x] **folder-note-plugin**
- [ ] fit
- [x] **editing-toolbar**
- [x] **dbfolder**
- [x] **obsidian-icon-folder**
- [x] **obsidian-emoji-toolbar**
- [x] **obsidian-day-planner**
- [ ] obsidian-banners
- [x] **obsidian-checklist-plugin**
- [x] **obsidian-custom-frames**
- [x] **obsidian-style-settings**
- [ ] obsidian-tasks-plugin
- [x] **obsidian-mkdocs-publisher**
- [ ] obsidian-importer
- [x] **obsidian-mind-map**
- [x] **obsidian-projects**
- [ ] obsidian-textgenerator-plugin
- [x] **periodic-notes**
- [x] **snippets-manager**
- [ ] obsidian-trello
- [ ] table-editor-obsidian
- [x] **obsidian-read-it-later**
- [x] **surfing**
- [ ] ai-commander
- [x] **obsius-publish**
- [x] **peerdraft**
- [x] **obsidian-webhooks**
- [x] **color-folders-files**
- [x] **obsidian-csv-table**
- [x] **obsidian-kanban**
- [x] **obsidian-advanced-uri**
- [x] **google-calendar**
- [x] **obsidian-google-lookup**
- [x] **obsidian-full-calendar**
- [x] **excalibrain**
- [x] **obsidian-excalidraw-plugin**
- [x] **homepage**
- [x] **advanced-canvas**
- [x] **canvas-minimap**
- [ ] canvas-link-optimizer
- [x] **crafty**
- [ ] canvasblocks
- [ ] circuit-sketcher
- [x] **api-request**
- [x] **google-keep-import**
- [ ] json-table
- [x] **data-files-editor**
- [ ] query-json
- [x] **canvas-dailynote**
- [x] **quickadd**
- [x] **editor-width-slider**
- [x] **obsidian-diagrams-net**
- [x] **daily-notes-editor**
- [ ] unicode-search
- [x] **mxmind**
- [x] **livecodes-playground**
- [ ] pycalc
- [x] **system3-relay**
- [ ] exmemo-client
- [ ] fix-require-modules
- [ ] tasknotes
- [x] **heatmap-tracker**
- [x] **discord-message-sender**
- [ ] folder-notes
- [ ] banyan
- [x] **auto-tasks**
- [ ] obsidian-task-progress-bar
- [x] **pixel-perfect-image**
- [x] **obsidian-auto-link-title**
- [ ] obsidian-git
- [x] **mermaid-tools**
- [x] **mehrmaid**
- [ ] export-graph-view
- [ ] gitlab-wiki-export
- [x] **occura-word-highlighter**
- [ ] mcp-tools
- [ ] desktop.ini


const fs = require('fs');
const vaultPath = app.vault.adapter.basePath;
const pluginsPath = vaultPath + '/.obsidian/plugins';
const configPath = vaultPath + '/.obsidian/community-plugins.json';

// Récupère tous les plugins installés (dossiers dans .obsidian/plugins)
let installedPlugins = [];
try {
  installedPlugins = fs.readdirSync(pluginsPath);
} catch (e) {
  tR += "Impossible de lire le dossier des plugins.\n";
}

// Récupère la liste des plugins activés depuis le fichier community-plugins.json
let activePlugins = [];
try {
  const configData = fs.readFileSync(configPath, 'utf-8');
  activePlugins = JSON.parse(configData);
} catch (e) {
  tR += "Impossible de lire le fichier community-plugins.json ou il n'existe pas.\n";
}

tR += "## Liste des plugins communautaires\n\n";
installedPlugins.forEach(plugin => {
  // Si l'ID de dossier du plugin est présent dans le JSON => activé
  const isActive = activePlugins.includes(plugin);
  tR += isActive 
    ? `- [x] **${plugin}**\n`
    : `- [ ] ${plugin}\n`;
});
%>
