
## 📋 Tâches à faire :

- [ ] .
- [ ] .


## 📌 Tâches reportées :

<%*
const moment = window.moment;

// 📅 Détermine la date d'hier et le fichier associé
let yesterday = moment().subtract(1, "day").format("YY.MM.DD.dd");
let filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;

// ⏳ Tente de remonter jusqu’à 7 jours en arrière si le fichier n'existe pas
let tries = 0;
while (!(await app.vault.adapter.exists(filePath)) && tries < 7) {
  yesterday = moment(yesterday, "YY.MM.DD.dd").subtract(1, "day").format("YY.MM.DD.dd");
  filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;
  tries++;
}

let outputReport = "\n\n";

if (tries < 7) {
  const file = await app.vault.read(await app.vault.getAbstractFileByPath(filePath));

  // 🔍 Extrait les tâches non cochées
  const uncheckedTasks = file.match(/- \[ \] .*/g) || [];

  if (uncheckedTasks.length > 0) {
    uncheckedTasks.forEach((task) => {
      let createdDateMatch = task.match(/\d{2}\/\d{2}\/\d{4}/);
      let reportsMatch = task.match(/(\d+)\s*reports?/);
      let daysElapsed, reports, createdDate;

      if (createdDateMatch && reportsMatch) {
        createdDate = createdDateMatch[0];
        daysElapsed = moment().diff(moment(createdDate, "DD/MM/YYYY"), "days");
        reports = parseInt(reportsMatch[1]) + 1;
      } else {
        createdDate = moment(yesterday, "YY.MM.DD.dd").format("DD/MM/YYYY");
        daysElapsed = moment().diff(moment(createdDate, "DD/MM/YYYY"), "days");
        reports = 1;
      }

      // 🎨 Choisir la couleur
      let color = daysElapsed < 5 ? "🟢" : daysElapsed < 11 ? "🟠" : "🔴";

      // 🧹 Nettoyer la tâche pour supprimer doublons de pastilles ou infos (Créé...)
      let taskContent = task
        .replace(/- \[ \] /, '')
        .replace(/([🟢🟠🔴]\s*)+/g, '')
        .replace(/\(.*?Créé\s*:.*?\)/g, '')
        .trim();

      // 🔄 Reformatage
      outputReport += `- [ ] ${taskContent} (${color}Créé: ${createdDate} | ${daysElapsed} jours | ${reports} reports)\n`;
    });
  } else {
    outputReport += "✅ Aucune tâche reportée aujourd'hui !";
  }
} else {
  outputReport += "⚠️ Impossible de retrouver une note journalière récente pour récupérer les tâches.";
}

outputReport
%>

