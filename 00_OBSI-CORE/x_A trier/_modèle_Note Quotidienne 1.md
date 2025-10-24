# 🗒️ Note Quotidienne

## 📋 Tâches à faire :

- [ ] 
- [ ] .


## 📌 Tâches reportées :

<%*
const moment = window.moment;

// 📅 Détermine la date d'hier et le chemin du fichier associé à l'aide d'un objet moment
let dateToCheck = moment().subtract(1, "day");
let yesterday = dateToCheck.format("YY.MM.DD.dd");
let filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;

// ⏳ Tente de remonter jusqu'à 7 jours en arrière si le fichier n'existe pas
let tries = 0;
while (!(await app.vault.adapter.exists(filePath)) && tries < 7) {
  dateToCheck.subtract(1, "day");
  yesterday = dateToCheck.format("YY.MM.DD.dd");
  filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;
  tries++;
}

let output = [];

if (tries < 7) {
  const fileAbstract = app.vault.getAbstractFileByPath(filePath);
  if (fileAbstract) {
    const file = await app.vault.read(fileAbstract);

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
          // On utilise ici l'objet dateToCheck déjà manipulé pour le fichier trouvé
          createdDate = dateToCheck.format("DD/MM/YYYY");
          daysElapsed = moment().diff(moment(createdDate, "DD/MM/YYYY"), "days");
          reports = 1;
        }

        // 🎨 Choisir la couleur en fonction du nombre de jours écoulés
        let color = daysElapsed < 5 ? "🟢" : daysElapsed < 11 ? "🟠" : "🔴";

        // 🧹 Nettoyer la tâche pour supprimer les pastilles en doublon et infos obsolètes
        let taskContent = task
          .replace(/- \[ \] /, '')
          .replace(/([🟢🟠🔴]\s*)+/g, '')
          .replace(/\(.*?Créé\s*:.*?\)/g, '')
          .trim();

        // 🔄 Reformatage de la tâche
        output.push(`- [ ] ${taskContent} (${color}Créé: ${createdDate} | ${daysElapsed} jours | ${reports} reports)`);
      });
    } else {
      output.push("✅ Aucune tâche reportée aujourd'hui !");
    }
  } else {
    output.push("⚠️ Le fichier n'a pas pu être trouvé.");
  }
} else {
  output.push("⚠️ Impossible de retrouver une note journalière récente pour récupérer les tâches.");
}

output.join("\n")
%>