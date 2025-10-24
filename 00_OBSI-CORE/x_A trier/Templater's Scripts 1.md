
// 🧠 Script Templater pour Obsidian — Version commentée
<%
const moment = window.moment;

// 📅 Init : date à tester
let dateToCheck = moment().subtract(1, "day");
let yesterday = dateToCheck.format("YY.MM.DD.dd");
let filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;

let found = false;
let fileContent = "";

// 🔁 Recherche jusqu'à une note avec des tâches non cochées
while (!(await app.vault.adapter.exists(filePath)) || !fileContent.includes("- [ ]")) {
  dateToCheck = dateToCheck.subtract(1, "day");
  yesterday = dateToCheck.format("YY.MM.DD.dd");
  filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;

  if (await app.vault.adapter.exists(filePath)) {
    const abstract = await app.vault.getAbstractFileByPath(filePath);
    if (abstract) fileContent = await app.vault.read(abstract);
  }

  // ✅ Arrêter si on trouve une note avec tâches
  if (fileContent.includes("- [ ]")) {
    found = true;
    break;
  }

  // 🛑 Sécurité si on remonte trop loin (30 jours)
  if (dateToCheck.isBefore(moment().subtract(30, "days"))) break;
}

let output = [];

if (found) {
  const tasks = fileContent.match(/- \[ \].*/g) || [];

  if (tasks.length > 0) {
    tasks.forEach(task => {
      // 📅 Extraction des métadonnées
      const createdDateMatch = task.match(/\d{2}\/\d{2}\/\d{4}/);
      const reportsMatch = task.match(/(\d+)\sreports/);
      let createdDate, daysElapsed, reports;

      if (createdDateMatch && reportsMatch) {
        createdDate = createdDateMatch[0];
        reports = parseInt(reportsMatch[1]) + 1;
        daysElapsed = moment().diff(moment(createdDate, "DD/MM/YYYY"), "days");
      } else {
        createdDate = dateToCheck.format("DD/MM/YYYY");
        daysElapsed = moment().diff(dateToCheck, "days");
        reports = 1;
      }

      // 🎨 Couleur
      let color = daysElapsed < 5 ? "🟢" : daysElapsed < 10 ? "🟠" : "🔴";

      // 🧹 Nettoyage de la ligne
      const cleaned = task
        .replace(/- \[ \] /, '')
        .replace(/([🟢🟠🔴]\s?)+/, '')
        .replace(/\(Créé.*?\)/, '')
        .trim();

      // ✅ Reformatage
      output.push(`- [ ] ${cleaned} ${color}(Créé: ${createdDate} | ${daysElapsed} jours | ${reports} reports)`);
    });
  } else {
    output.push("✅ Aucune tâche reportée aujourd'hui !");
  }
} else {
  output.push("⚠️ Impossible de retrouver une note journalière récente pour récupérer les tâches.");
}

output.join("\n")
%>

