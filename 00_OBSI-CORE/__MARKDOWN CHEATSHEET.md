
## TEXTES

[Texte du lien](url du lien)

Markdown basics 
Headers: 
use ‘# ’ (pound space) 
• Level 1 header: # 
• Level 2 header: ## 
• … 
• Level 6 header: ###### 

Tags are words with a ‘#’ in front, with no space between the ‘#’ and the word: #word 

To make text bold, surround it with ‘**’s: 
This **word** is important. → This word is important. 
To make text italic, surround it with ‘_’s or ‘*s’. _This is_ kind of *important*. → This is kind of important. 

Bullet lists: 
use ‘- ‘ (notice the space after the dash). 
- one 
- two 

Use numbers (1.) instead for numbered lists. 

A checklist is with ‘- [ ]’ (dash space [ space ]).

Linking To create a link to a webpage:  [text for the link](https://example.com/) 
To link to a page in your vault (create a local link): [[Resources/some page]] 
To link to a header in your vault (another local link): [[Resources/some page#Header]] 
To change the text for a local link: use the | character: [[Resources/some page|this will show up instead]] 


https://github.com/ieshreya/Obsidian-Cheat-Sheet?tab=readme-ov-file

https://github.com/im-luka/markdown-cheatsheet

https://www.cheatsheet.fr/2019/09/11/markdown-cheat-sheet/

/

```<p style="text-align:center">Center this text</p>``` = <p style="text-align:center">Center this text</p>

```<center>This text is centered.</center>``` = <center>This text is centered.</center>

```<font color="red">This text is red!</font>``` = <font color="red">This text is red!</font>

```<p style="color:blue">Make this text blue.</p>``` = <p style="color:blue">Make this text blue.</p>

```
Here's a paragraph that will be visible.

[This is a comment that will be hidden.]: # 

And here's another paragraph that's visible.
```

[This is a comment that will be hidden.]: # 



```
> :warning: **Warning:** Do not push the big red button.
> :memo: **Note:** Sunrises are beautiful.
> :bulb: **Tip:** Remember to appreciate the little things in life.
```

> :warning: **Warning:** Do not push the big red button.
> :memo: **Note:** Sunrises are beautiful.
> :bulb: **Tip:** Remember to appreciate the little things in life.

---
***

## IMAGES

### Markdown

```![|100][logo_gitea.jpg]```  =  ![|100][logo_gitea.jpg]

```![[logo_gitea.jpg|150]]``` = ![[logo_gitea.jpg|150]]

```![|175](logo_gitea.jpg)```  =  ![|175](logo_gitea.jpg)

```![|180](logo_gitea.jpg)```  =  ![|180](logo_gitea.jpg)


- En bref, en utilisant les doubles crochets ou la combinaison de `[ ]( )`, il est facile de redimensionner l'image. Je ne sais pas vraiment ce que signifie votre syntaxe, mais elle ressemble davantage à un espace réservé (ou à une étrange variante de note de bas de page), et elle n'accepte pas les options de redimensionnement.
- Il semble également qu'au lieu de «`![ ][1]` on pourrait simplement écrire » `![1]`, mais cela ne permet toujours pas la mise à l'échelle. Où avez-vous trouvé cette syntaxe pour écrire un lien intégré ?



This last one can also be written: ![logo_gitea.jpg]

[1]:https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Illustration_-_Printemps_Parfum%C3%A9_-_page_131.jpg/336px-Illustration_-_Printemps_Parfum%C3%A9_-_page_131.jpg




### HTML


```
<figure>
    <img src="ogo_gitea.jpg"
         alt="Albuquerque, New Mexico">
    <figcaption>A single track trail outside of Albuquerque, New Mexico.</figcaption>
</figure>
```
<figure>
    <img src="logo_gitea.jpg"
         alt="Albuquerque, New Mexico">
    <figcaption>A single track trail outside of Albuquerque, New Mexico.</figcaption>
</figure>

```
![Albuquerque, New Mexico](ogo_gitea.jpg)
*A single track trail outside of Albuquerque, New Mexico.*
```

![Albuquerque, New Mexico|1008](logo_gitea.jpg)
*A single track trail outside of Albuquerque, New Mexico.*


- Droits d'auteur (©) —`&copy;` - &copy;
- Marque déposée (®) —`&reg;`
- Marque déposée (™) —`&trade;`
- Euro (€) —`&euro;`
- Flèche gauche (←) —`&larr;`
- Flèche vers le haut (↑) —`&uarr;`
- Flèche droite (→) —`&rarr;`
- Flèche vers le bas (↓) —`&darr;`
- Degré (°) —`&#176;`
- Pi (π) —`&#960;`





