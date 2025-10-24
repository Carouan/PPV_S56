
## <u>00_COMMANDS</u>

Ouvrir Console : Ctrl+MAJ+I
/

## **Qu'est-ce que le "frontmatter" ?**

- En **Markdown (et dans Obsidian)**, le _frontmatter_ est le bloc de métadonnées en haut d'une note, délimité par `---`.
    
- Exemple :
    `--- title: Exemple de note date: 2025-08-03 tags: [réseau, tuto] ---`
- Obsidian lit ces données pour les utiliser dans les recherches, filtres et plugins (par ex. Dataview).
    

👉 **Pour ton usage :** tu peux stocker la date de capture, les mots-clés extraits ou le futur dossier cible (`folder:`) dans ce bloc, et les exploiter ensuite avec Templater ou Dataview.




## <u>01_CSS Snippets</u>

"G:\Mon Drive\_00_DOCs - PERSO\_03_Sébastien\2dBrain_25\Carou_2dBrain_25\.obsidian\snippets\wikipedia-card.css"

### Extensions Markdown prises en charge 

==Text==

| Syntaxe         | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| `[[Link]]`      | [Liens internes](https://help.obsidian.md/links)                                           |
| `![[Link]]`     | [Intégrer des fichiers](https://help.obsidian.md/embeds)                                   |
| `![[Link#^id]]` | [Références de bloc](https://help.obsidian.md/links#Link%20to%20a%20block%20in%20a%20note) |
| `^id`           | [Définir un bloc](https://help.obsidian.md/links#Link%20to%20a%20block%20in%20a%20note)    |
| `[^id]`         | [Notes de bas de page](https://help.obsidian.md/syntax#Footnotes)                          |
| `%%Text%%`      | [Commentaires](https://help.obsidian.md/syntax#Comments)                                   |
| `~~Text~~`      | [Barrés](https://help.obsidian.md/syntax#Bold,%20italics,%20highlights)                    |
| `===Text===`    | [Points forts](https://help.obsidian.md/syntax#Bold,%20italics,%20highlights)              |
| ` ``` `         | [Blocs de code](https://help.obsidian.md/syntax#Code%20blocks)                             |
| `- [ ]`         | [Tâche incomplète](https://help.obsidian.md/syntax#Task%20lists)                           |
| `- [x]`         | [Tâche terminée](https://help.obsidian.md/syntax#Task%20lists)                             |
| `> [!note]`     | [Appels](https://help.obsidian.md/callouts)                                                |
| (voir lien)     | [Tableaux](https://help.obsidian.md/advanced-syntax#Tables)                                |


## <u>02_WebClipper Templates</u>

[{{title}}]({{url}})  :  {{schema:@Article:headline}}

---
<a href="{{url}}" target="_blank" title="{{title}} — {{schema:@Article:headline}}">
    <img src="{{image}}" width="60" alt="{{title}}">
</a> - {{title}} - {{schema:@Article:headline}}
  
---
<div class="wiki-card">
  <a href="{{url}}" target="_blank" title="{{title}} — {{schema:@Article:headline}}">
    <img src="{{image}}" width="150" alt="{{title}}">
  </a>
  <div class="wiki-meta">
    <img src="https://fr.wikipedia.org/static/favicon/wikipedia.ico" width="50">{{title}} - {{schema:@Article:headline}}

    <p><strong>Mots-clés : </strong>{{selection}}</p>
  </div>
</div>




https://fr.wikipedia.org/static/favicon/wikipedia.ico

https://fr.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-fr.svg

https://fr.wikipedia.org/static/images/icons/wikipedia.png



https://help.obsidian.md/web-clipper/templates
https://github.com/kepano/clipper-templates

https://github.com/kepano/clipper-templates



https://help.obsidian.md/web-clipper/filters#%60image%60



<div class="wiki-card">
  <a href="https://fr.wikipedia.org/wiki/Mary_Shaw_(informaticienne)" target="_blank" title="Mary Shaw (informaticienne) — Wikipédia — informaticienne américaine">
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Mary-shaw.png" width="150" alt="Mary Shaw (informaticienne) — Wikipédia">
  </a>
  <div class="wiki-meta">

    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <p><strong>Mots-clés : </strong></p>
  </div>
</div>

---

<div class="wiki-card">
  <a href="{{url}}" target="_blank" title="{{title}} — {{schema:@Article:headline}}">
    <img src="{{image}}" width="150" alt="{{title}}">
  </a>
  <div class="wiki-meta">
    <img src="{{favicon}}" width="150" alt="{{title}}">
    <ul>
      <li>{{custom:tag1}}</li>
      <li>{{custom:tag2}}</li>
      <li>{{custom:tag3}}</li>
    </ul>
    <p><strong>Mots-clés : </strong>{{selection}}</p>
  </div>
</div>

---

<div class="wiki-card">
  <a href="{{url}}" target="_blank" title="{{title}} — {{schema:@Article:headline}}">
    <img src="{{image}}" width="150" alt="{{title}}">
  </a>
  <div class="wiki-meta">
    <img src="{{schema:@Article:publisher.logo.url}}" width="150" alt="{{title}}">
    <ul>
      <li>{{custom:tag1}}</li>
      <li>{{custom:tag2}}</li>
      <li>{{custom:tag3}}</li>
    </ul>
    <p><strong>Mots-clés : </strong>{{selection}}</p>
  </div>
</div>
