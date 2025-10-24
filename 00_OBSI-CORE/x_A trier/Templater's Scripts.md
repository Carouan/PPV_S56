

## Tâches non terminées d’hier

<%*
const moment = app.plugins.plugins["obsidian-daily-notes-interface"].moment;
const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");
const filePath = `Jour/${yesterday}.md`; // Adapte selon ton dossier de notes quotidiennes

const file = await app.vault.read(await app.vault.getAbstractFileByPath(filePath));
const uncheckedTasks = file.match(/- \[ \] .*/g) || [];

if (uncheckedTasks.length > 0) {
    tR += uncheckedTasks.join("\n");
} else {
    tR += "✅ Aucune tâche reportée.";
}
%>


