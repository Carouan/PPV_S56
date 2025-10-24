# 🔍 Rétrospective Globale

## 💚 Positifs
```dataview
list from "Projets"
where contains(text, "#positif")
group by file.folder
```

## ⚠️ À améliorer
```dataview
list from "Projets"
where contains(text, "#ameliorer")
group by file.folder
```

## 🧠 Conclusions
```dataview
list from "Projets"
where contains(text, "#conclusion")
group by file.folder
```
