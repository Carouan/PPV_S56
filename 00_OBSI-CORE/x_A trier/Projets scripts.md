





-  Reporter les tâches non complétées de la veille.

<%*
// ***
const moment = window.moment; // Utilisation correcte de moment.js dans Obsidian
const yesterday = moment().subtract(1, "day").format("YY.MM.DD.dd"); 
const filePath = `01_Periodic Notes/01.1_Daily/${yesterday}.md`;
// console.log(yesterday);
// console.log(filePath);

const file = await app.vault.read(await app.vault.getAbstractFileByPath(filePath));
const uncheckedTasks = file.match(/- \[ \] .*/g) || [];

if (uncheckedTasks.length > 0) {
    tR += uncheckedTasks.join("\n");
} else {
    tR += "✅ Aucune tâche reportée.";
}
%>



Si la note de la veille n'existe pas,
 -> il faut remonter un jour avant et ainsi de suite jusqu'au début de la semaine.

- Ajouter aux notes reportées :
	- le jour à laquelle la note a été créé 
	- le nombre de jour depuis la création de la tâche.
	- le nombre de report de la tâche 
	- la couleur de cette tâche évoluant de façon de plus en plus critique, du vert au rouge selon l'ancienneté de la tâche.
	




- Reporter les tâches non complétées de la semaine précédente.
	- le jour à laquelle la note a été créé 
	- le nombre de jour depuis la création de la tâche.
	- le nombre de report de la tâche 

