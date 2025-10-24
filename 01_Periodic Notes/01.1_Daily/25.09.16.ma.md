# 🗒️ Note Quotidienne

(Raccourci emoji = )

## 📋 Tâches à faire :

- [ ] .


## 📌 Tâches reportées :

- 🟢 [0 j ; 5j[ 🟠 [5 j ; 11j[ 🔴 [11 j ; ∞[


<%*
const moment = window.moment;
let dateToCheck = moment().subtract(1, "day");
let fileContent = "", filePath;
let tasksFound = false;
let output = [];

while (true) {
	filePath = `01_Periodic Notes/01.1_Daily/${dateToCheck.format("YY.MM.DD.dd")}.md`;
	if (await app.vault.adapter.exists(filePath)) {
		const abstract = await app.vault.getAbstractFileByPath(filePath);
		fileContent = await app.vault.read(abstract);
		const uncheckedTasks = fileContent.match(/- \[ \].*/g) || [];

		if (uncheckedTasks.length > 0) {
			tasksFound = true;

			uncheckedTasks.forEach(task => {
				// Recherche des métadonnées
				const createdMatch = task.match(/Créé: (\d{2}\/\d{2}\/\d{4})/);
				const reportsMatch = task.match(/(\d+) reports?/);

				let createdDate, reports, daysElapsed;

				if (createdMatch && reportsMatch) {
					// Si métadonnées déjà présentes
					createdDate = createdMatch[1];
					reports = parseInt(reportsMatch[1]) + 1;
				} else {
					// Métadonnées absentes
					createdDate = dateToCheck.format("DD/MM/YYYY");
					reports = 1;
				}

				// Calcul du nombre total de jours
				daysElapsed = moment().diff(moment(createdDate, "DD/MM/YYYY"), "days");

				// Définir l'icône de couleur
				const color = daysElapsed < 5 ? "🟢" : daysElapsed < 11 ? "🟠" : "🔴";

				// Nettoyer les anciens blocs de métadonnées
				const cleaned = task
					.replace(/- \[ \] /, "")
					.replace(/\(Créé: .*?\| .*? jours \| .*? reports\)/, "") // bloc complet entre parenthèses
					.replace(/[🟢🟠🔴]/g, "") // emojis restants
					.trim();

				// Concaténer le tout
				output.push(`- [ ] ${cleaned} ${color}(Créé: ${createdDate} | ${daysElapsed} jours | ${reports} reports)`);
			});

			break;
		}
	}

	dateToCheck = dateToCheck.subtract(1, "day");
	if (dateToCheck.isBefore(moment().subtract(30, "days"))) break;
}

if (!tasksFound)
	output.push("✅ Aucune tâche reportée aujourd'hui !");

tR += output.join("\n");
%>




