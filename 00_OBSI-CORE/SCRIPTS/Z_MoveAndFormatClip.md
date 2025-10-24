
<%*
function debug(msg) {
  console.log("DEBUG:", msg);
  new Notice(msg, 3000);
}

debug("Début du script");

// 1. Choisir le dossier de destination
const folders = ["06_DIvers & Culture", "09_Inbox_FDD"];
debug("Ouverture menu dossiers...");
const chosenFolder = await tp.system.suggester(folders, folders);

if (!chosenFolder) {
  debug("Aucun dossier choisi. Stop.");
  return;
}
debug("Dossier choisi: " + chosenFolder);

// 2. Scanner les modèles
const templateFolder = "00_OBSI-CORE/Modèles";
debug("Scan des modèles dans: " + templateFolder);

const allTemplates = app.vault.getFiles()
  .filter(f => f.path.startsWith(templateFolder) && f.path.endsWith(".md"))
  .map(f => f.path.replace(`${templateFolder}/`, "").replace(".md", ""));

debug("Modèles trouvés: " + JSON.stringify(allTemplates));

const chosenTemplate = await tp.system.suggester(allTemplates, allTemplates);

if (!chosenTemplate) {
  debug("Aucun modèle choisi. Stop.");
  return;
}
debug("Modèle choisi: " + chosenTemplate);

// 3. Déplacement du fichier
const currentPath = tp.file.path(true);
debug("Fichier actuel: " + currentPath);

const newPath = `${chosenFolder}/${tp.file.title}.md`;
debug("Nouveau chemin: " + newPath);

await app.vault.rename(currentPath, newPath);
debug("Renommage OK");

// 4. Ajout frontmatter date + ID
const content = await tp.file.content();
const uuid = Date.now();
debug("UUID généré: " + uuid);

await tp.file.write(`---\nid: ${uuid}\ndate: ${moment().format("YYYY-MM-DD HH:mm")}\n---\n` + content);
debug("Frontmatter ajouté");

// 5. Inclusion du modèle
const templatePath = `${templateFolder}/${chosenTemplate}.md`;
debug("Chemin du modèle à inclure: " + templatePath);

await tp.file.include(templatePath);
debug("Inclusion modèle OK");

debug("Script terminé !");
%>