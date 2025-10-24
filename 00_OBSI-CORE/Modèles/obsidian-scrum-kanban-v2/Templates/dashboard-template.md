# 🧭 Dashboard général

## 📁 Projets actifs
- [[Projet A]]
- [[Projet B]]

## 🔄 Sprints en cours
- [[Projet A/sprint-2025-06-03]]
- [[Projet B/sprint-2025-06-03]]

## ✅ Tâches récemment terminées
```dataview
table file.link as "Tâche"
from "Projets"
where contains(section, "Terminé")
sort file.mtime desc
limit 10
```

## 📌 Rétrospectives importantes
- [[retrospective-globale]]
