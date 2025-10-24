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
				const createdMatch = task.match(/Créé: (\d{2}\/\d{2}\/\d{4})/);
				const reportsMatch = task.match(/(\d+) reports?/);
				let createdDate, daysElapsed, reports;

				if (createdMatch && reportsMatch) {
					createdDate = createdMatch[1];
					daysElapsed = moment().diff(moment(createdDate, "DD/MM/YYYY"), "days");
					reports = parseInt(reportsMatch[1]) + 1;
				} else {
					createdDate = dateToCheck.format("DD/MM/YYYY");
					daysElapsed = moment().diff(dateToCheck, "days");
					reports = 1;
				}

				const color = daysElapsed < 5 ? "🟢" : daysElapsed < 11 ? "🟠" : "🔴";
				const cleaned = task
					.replace(/- \[ \] /, "")
					.replace(/([🔴🟠🟢]\s?)+/, "")
					.replace(/(Créé:.*?\|)/, "")
					.replace(/\d+ reports?/, "")
					.trim();

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
