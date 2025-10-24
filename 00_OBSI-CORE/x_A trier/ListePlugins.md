## Liste des plugins installés

- templater-obsidian
- dataview
- colored-text
- code-emitter
- chatgpt-md
- buttons
- obsidian-admonition
- multi-column-markdown
- make-md
- folder-note-plugin
- fit
- editing-toolbar
- dbfolder
- obsidian-icon-folder
- obsidian-emoji-toolbar
- obsidian-day-planner
- obsidian-banners
- obsidian-checklist-plugin
- obsidian-custom-frames
- obsidian-style-settings
- obsidian-tasks-plugin
- obsidian-mkdocs-publisher
- obsidian-importer
- obsidian-mind-map
- obsidian-projects
- obsidian-textgenerator-plugin
- periodic-notes
- snippets-manager
- obsidian-trello
- table-editor-obsidian
- obsidian-read-it-later
- surfing
- ai-commander
- obsius-publish
- peerdraft
- obsidian-webhooks
- color-folders-files
- obsidian-csv-table
- obsidian-kanban
- obsidian-advanced-uri
- google-calendar
- obsidian-google-lookup
- obsidian-full-calendar
- excalibrain
- obsidian-excalidraw-plugin
- homepage
- advanced-canvas
- canvas-minimap
- canvas-link-optimizer
- crafty
- canvasblocks
- circuit-sketcher
- api-request
- google-keep-import
- json-table
- data-files-editor
- query-json
- canvas-dailynote
- quickadd
- editor-width-slider
- obsidian-diagrams-net
- daily-notes-editor
- unicode-search
- mxmind
- livecodes-playground
- pycalc
- system3-relay
- exmemo-client
- fix-require-modules
- tasknotes
- heatmap-tracker
- discord-message-sender
- folder-notes
- banyan
- auto-tasks
- obsidian-task-progress-bar
- pixel-perfect-image
- obsidian-auto-link-title
- obsidian-git
- mermaid-tools
- mehrmaid
- export-graph-view
- gitlab-wiki-export
- occura-word-highlighter
- mcp-tools
- desktop.ini

## Plugins communautaires actifs

- **code-emitter**
- **obsidian-custom-frames**
- **obsidian-style-settings**
- **dataview**
- **templater-obsidian**
- **obsidian-mind-map**
- **editing-toolbar**
- **obsidian-day-planner**
- **periodic-notes**
- **obsidian-projects**
- **chatgpt-md**
- **color-folders-files**
- **obsidian-csv-table**
- **colored-text**
- **obsidian-emoji-toolbar**
- **obsidian-mkdocs-publisher**
- **multi-column-markdown**
- **obsidian-read-it-later**
- **obsidian-webhooks**
- **make-md**
- **dbfolder**
- **obsidian-icon-folder**
- **folder-note-plugin**
- **obsidian-kanban**
- **obsidian-advanced-uri**
- **obsidian-google-lookup**
- **obsidian-full-calendar**
- **excalibrain**
- **obsidian-excalidraw-plugin**
- **homepage**
- **advanced-canvas**
- **canvas-minimap**
- **crafty**
- **data-files-editor**
- **canvas-dailynote**
- **quickadd**
- **editor-width-slider**
- **livecodes-playground**
- **api-request**
- **auto-tasks**
- **obsidian-checklist-plugin**
- **daily-notes-editor**
- **discord-message-sender**
- **obsidian-diagrams-net**
- **google-calendar**
- **google-keep-import**
- **heatmap-tracker**
- **mxmind**
- **obsius-publish**
- **peerdraft**
- **snippets-manager**
- **system3-relay**
- **surfing**
- **pixel-perfect-image**
- **buttons**
- **obsidian-auto-link-title**
- **mermaid-tools**
- **mehrmaid**
- **occura-word-highlighter**

<%*
const fs = require('fs');
// Récupère le chemin vers le dossier de la vault
const vaultPath = app.vault.adapter.basePath;
// Construit le chemin vers le répertoire des plugins
const pluginsPath = vaultPath + '/.obsidian/plugins';

// Lit le contenu du dossier 'plugins'
const plugins = fs.readdirSync(pluginsPath);

tR += "## Liste des plugins installés\n\n";
// Parcours la liste et les ajoute à la note
plugins.forEach(plugin => {
  tR += `- ${plugin}\n`;
});
%>
