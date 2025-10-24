

https://help.obsidian.md/Home


### `date` 

Convertit une date au format spécifié, [voir référence](https://day.js.org/docs/en/display/format) .

- `{{date|date:"YYYY-MM-DD"}}`convertit la date actuelle en « AAAA-MM-JJ ».
- Utilisé `date:("outputFormat", "inputFormat")`pour spécifier le format d'entrée, par exemple, `"12/01/2024"|date:("YYYY-MM-DD", "MM/DD/YYYY")`analyse « 12/01/2024 » et renvoie `"2024-12-01"`.



### `image` 

Convertit des chaînes, des tableaux ou des objets en syntaxe d'image Markdown.

- Pour les chaînes : `"image.jpg"|image:"alt text"`renvoie `![alt text](image.jpg)`.
- Pour les tableaux : `["image1.jpg","image2.jpg"]|image:"alt text"`renvoie un tableau de chaînes d'images Markdown avec le même texte alternatif pour toutes les images.
- Pour les objets : `{"image1.jpg": "Alt 1", "image2.jpg": "Alt 2"}|image`renvoie les chaînes d'image Markdown avec le texte alternatif des clés d'objet.


### `link` 

Convertit des chaînes, des tableaux ou des objets en syntaxe de lien Markdown (à ne pas confondre avec [wikilink](https://help.obsidian.md/web-clipper/filters#%60wikilink%60) ).

- Pour les chaînes : `"url"|link:"author"`renvoie `[author](url)`.
- Pour les tableaux : `["url1","url2"]|link:"author"`renvoie un tableau de liens Markdown avec le même texte pour tous les liens.
- Pour les objets : `{"url1": "Author 1", "url2": "Author 2"}|link`renvoie les liens Markdown avec le texte qui correspond aux clés de l'objet.


### `wikilink` 

Convertit des chaînes, des tableaux ou des objets en syntaxe [wikilink](https://help.obsidian.md/link-notes) Obsidian .

- Pour les chaînes : `"page"|wikilink`renvoie `[[page]]`.
- Pour les chaînes avec alias : `"page"|wikilink:"alias"`renvoie `[[page|alias]]`.
- Pour les tableaux : `["page1","page2"]|wikilink`renvoie un tableau de liens wiki sans alias.
- Pour les tableaux avec alias : `["page1","page2"]|wikilink:"alias"`renvoie un tableau de liens wiki avec le même alias pour tous les liens.
- Pour les objets : `{"page1": "alias1", "page2": "alias2"}|wikilink`renvoie les liens wiki avec les clés comme noms de page et les valeurs comme alias.



## Traitement HTML 

Traitez le contenu HTML et convertissez-le en Markdown. Notez que votre [variable](https://help.obsidian.md/web-clipper/variables) d'entrée doit contenir du contenu HTML, par exemple using `{{fullHtml}}`ou `{{contentHtml}}`a `{{selectorHtml:}}`variable.

### `markdown` 

Convertit une chaîne en une chaîne au format [Markdown aromatisée à l'obsidienne .](https://help.obsidian.md/obsidian-flavored-markdown)

- Utile lorsqu'il est combiné avec des variables qui renvoient du HTML telles que `{{contentHtml}}`, `{{fullHtml}}`, et des variables de sélection comme `{{selectorHtml:cssSelector}}`.




### `template` 

Applique une chaîne de modèle à un objet ou à un tableau d'objets, en utilisant la syntaxe `object|template:"Template with ${variable}"`.

- Accéder aux propriétés imbriquées : `{"gem":{"name":"Obsidian"}}|template:"${gem.name}"`renvoie `"Obsidian"`.
- Pour les objets : `{"gem":"obsidian","hardness":5}|template:"${gem} has a hardness of ${hardness}"`renvoie `"obsidian has a hardness of 5"`.
- Pour les tableaux : `[{"gem":"obsidian","hardness":5},{"gem":"amethyst","hardness":7}]|template:"- ${gem} has a hardness of ${hardness}\n"`renvoie une liste formatée.

Fonctionne avec des chaînes littérales en `map`accédant à la `str`propriété :

- Exemple : `["rock", "pop"]|map:item => "genres/${item}"|template:"${str}"`renvoie `"genres/rock\ngenres/pop"`.
- La `str`propriété est automatiquement utilisée lors de l'application `template`aux objets créés `map`avec des littéraux de chaîne.

### `template` 

Applies a template string to an object or array of objects, using the syntax `object|template:"Template with ${variable}"`.

- Access nested properties: `{"gem":{"name":"Obsidian"}}|template:"${gem.name}"` returns `"Obsidian"`.
- For objects: `{"gem":"obsidian","hardness":5}|template:"${gem} has a hardness of ${hardness}"` returns `"obsidian has a hardness of 5"`.
- For arrays: `[{"gem":"obsidian","hardness":5},{"gem":"amethyst","hardness":7}]|template:"- ${gem} has a hardness of ${hardness}\n"` returns a formatted list.

Works with string literals from `map` by accessing the `str` property:

- Example: `["rock", "pop"]|map:item => "genres/${item}"|template:"${str}"` returns `"genres/rock\ngenres/pop"`.
- The `str` property is automatically used when applying `template` to objects created by `map` with string literals.



## Méta-variables 

Les méta-variables vous permettent d'extraire des données à partir [d'éléments méta](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) de la page, y compris les données [Open Graph](https://ogp.me/) utilisées pour remplir les aperçus de partage social.

- `{{meta:name}}`renvoie le contenu de la balise méta nom avec le nom donné, par exemple `{{meta:name:description}}`pour la `description`balise méta.
- `{{meta:property}}`renvoie le contenu de la balise de propriété méta avec la propriété donnée, par exemple `{{meta:property:og:title}}`pour la `og:title`balise méta.

## Variables de sélection 

Les variables de sélection vous permettent d'extraire le contenu textuel des éléments de la page à l'aide [de sélecteurs CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators) .

La syntaxe est `{{selector:cssSelector?attribute}}`, où `?attribute`est facultatif. Si aucun attribut n'est spécifié, le contenu textuel de l'élément est renvoyé. Vous pouvez également utiliser `{{selectorHtml:cssSelector}}`pour obtenir le contenu HTML de l'élément. Les variables de sélection fonctionnent généralement mieux sur un site web spécifique ou un ensemble de sites web ayant une structure HTML cohérente.

- `{{selector:h1}}`renvoie le contenu textuel de tous `h1`les éléments de la page.
- `{{selector:.author}}`renvoie le contenu textuel de tous `.author`les éléments de la page.
- `{{selector:img.hero?src}}`renvoie l' `src`attribut de l'image avec la classe `hero`.
- `{{selector:a.main-link?href}}`renvoie l' `href`attribut de la balise d'ancrage avec la classe `main-link`.
- `{{selectorHtml:body|markdown}}`renvoie l'intégralité du code HTML de l' `body`élément, converti en Markdown à l'aide du `markdown` [filtre](https://help.obsidian.md/web-clipper/filters#HTML%20processing) .
- Les sélecteurs et combinateurs CSS imbriqués sont pris en charge si vous avez besoin de plus de spécificité.
- Si plusieurs éléments correspondent au sélecteur, un tableau est renvoyé, que vous pouvez traiter avec [des filtres de tableau et d'objet](https://help.obsidian.md/web-clipper/filters#Arrays%20and%20objects) comme `join`ou `map`.

## Variables Schema.org 

Les variables de schéma permettent d'extraire des données du JSON-LD de [schema.org](https://schema.org/) sur la page. Les données de schema.org peuvent également être utilisées pour [déclencher automatiquement un modèle](https://help.obsidian.md/web-clipper/templates#Schema.org%20matching) .

- `{{schema:@Type:key}}`renvoie la valeur de la clé du schéma.
- `{{schema:@Type:parent.child}}`renvoie la valeur d'une propriété imbriquée.
- `{{schema:@Type:arrayKey}}`renvoie le premier élément d'un tableau.
- `{{schema:@Type:arrayKey[index].property}}`renvoie l'élément à l'index spécifié dans un tableau.
- `{{schema:@Type:arrayKey[*].property}}`renvoie une propriété spécifique de tous les éléments d'un tableau.

Vous pouvez également utiliser une notation abrégée sans spécifier le type de schéma :

- `{{schema:author}}`correspondra à la première `author`propriété trouvée dans n'importe quel type de schéma.
- `{{schema:name}}`correspondra à la première `name`propriété trouvée dans n'importe quel type de schéma.

Ce raccourci est particulièrement utile lorsque vous ne connaissez pas ou ne vous souciez pas du type de schéma spécifique, mais que vous connaissez le nom de la propriété que vous recherchez.

Les propriétés imbriquées et l'accès aux tableaux fonctionnent également, avec et sans le schéma `@Type`spécifié :

- `{{schema:author.name}}`trouvera la première `author`propriété puis accédera à sa `name`sous-propriété.
- `{{schema:author[0].name}}`accédera au `name`nom du premier auteur dans un tableau d'auteurs.
- `{{schema:author[*].name}}`renverra un tableau de tous les noms d'auteurs.










## Modèle

---
title: {{title|meta:property:og:title|meta:name:parsely-title|schema:@NewsArticle:headline}}
url: {{url|schema:@NewsArticle:url}}
created: {{created|schema:@NewsArticle:datePublished|schema:@NewsArticle:dateCreated|date|date:"YYYY-MM-DD"}}
modified: {{modify|schema:@NewsArticle:dateModified|date|date:"YYYY-MM-DD"}}
tags: {{meta:property:article:section}}, {{meta:property:article:tag}}, {{meta:name:parsely-tags}}
folder: ""  <!-- rempli manuellement ou laissé vide pour Templater -->
---

## 📰 [{{title|meta:property:og:title|meta:name:parsely-title|schema:@NewsArticle:headline}}]({{url|schema:@NewsArticle:url}})

- **Créé :** {{created|schema:@NewsArticle:datePublished|schema:@NewsArticle:dateCreated|date|date:"DD.MM.YY"}}
- **Modifié :** {{modify|schema:@NewsArticle:dateModified|date|date:"DD.MM.YY"}}

### 🏷️ Tags / Mots-clés
{{meta:property:article:section}}, {{meta:property:article:tag}}, {{meta:name:parsely-tags}}

### 📄 Résumé / Description
{{description|meta:name:description|meta:property:og:description|schema:@NewsArticle:description}}

---

### ✍️ Notes personnelles
> (Ajoute ici tes réflexions façon Zettelkasten)

---





TEST_Template_SWITCHTest - FULL WIKIYouTubeWiki_Link_FDDWiki_Link_ICTWiki_Link_CinémaJARVISDéfaut

[](chrome-extension://cnjifjpddelmedmihgijeibhnjfabmlf/popup.html# "Afficher les variables de page")[](chrome-extension://cnjifjpddelmedmihgijeibhnjfabmlf/popup.html# "Activer le surligneur")[](chrome-extension://cnjifjpddelmedmihgijeibhnjfabmlf/popup.html# "Paramètres")

authorCarouan

content**[RPI\_discordbot\_coalffj](https://github.com/Carouan/RPI_discordbot_coalffj)** Public forked from [ICT-FDD/discordbot\_coalffj](https://github.com/ICT-FDD/discordbot_coalffj) Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition\_ffj@femmesdedroit.be (mailing list) [GPL-3.0 license](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/LICENSE) [Open in github.dev](https://github.dev/) [Open in a new github.dev tab](https://github.dev/) [Open in codespace](https://github.com/codespaces/new/Carouan/RPI_discordbot_coalffj?resume=1) This branch is [12 commits ahead of](https://github.com/Carouan/RPI_discordbot_coalffj/compare/ICT-FDD%3Adiscordbot_coalffj%3Amain...main) ICT-FDD/discordbot\_coalffj:main.

|Name|   |Name|Last commit message|Last commit date|
|---|---|---|---|---|
|[d863064](https://github.com/Carouan/RPI_discordbot_coalffj/commit/d8630648ec45bf399a0025eb2afa19bac0dd6f70) ·<br><br>[89 Commits](https://github.com/Carouan/RPI_discordbot_coalffj/commits/main/)|   |   |
|[.github/ workflows](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/.github/workflows)|   |[.github/ workflows](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/.github/workflows)|[Update deploy.yml](https://github.com/Carouan/RPI_discordbot_coalffj/commit/51a07a65d6c27a1df84c4ebc9add5d2248106c81)||
|[bot](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/bot)|   |[bot](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/bot)|[Add summarize_message wrapper and stub modules for tests](https://github.com/Carouan/RPI_discordbot_coalffj/commit/1f565d91fd28c45bca9a4f8148a7714076510ba7)||
|[data](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/data)|   |[data](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/data)|[Add files via upload](https://github.com/Carouan/RPI_discordbot_coalffj/commit/4cec253510c93ca6903bd8464dac40f6c2ebe6c1)||
|[discord](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/discord)|   |[discord](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/discord)|[Add summarize_message wrapper and stub modules for tests](https://github.com/Carouan/RPI_discordbot_coalffj/commit/1f565d91fd28c45bca9a4f8148a7714076510ba7)||
|[tests](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/tests)|   |[tests](https://github.com/Carouan/RPI_discordbot_coalffj/tree/main/tests)|[reprise180325](https://github.com/Carouan/RPI_discordbot_coalffj/commit/313606a796d81ef8a445be77d40d3ff3ae0c3217)||
|[.woodpecker.yml](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/.woodpecker.yml)|   |[.woodpecker.yml](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/.woodpecker.yml)|[Add Woodpecker CI pipeline](https://github.com/Carouan/RPI_discordbot_coalffj/commit/a43577d31f884ab798db95639459615a5d3c21ac)||
|[Dockerfile](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/Dockerfile)|   |[Dockerfile](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/Dockerfile)|[Update Dockerfile](https://github.com/Carouan/RPI_discordbot_coalffj/commit/363f27aba92b288aba666fdaeaa415b6566021ba)||
|[LICENSE](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/LICENSE)|   |[LICENSE](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/LICENSE)|[manual-1](https://github.com/Carouan/RPI_discordbot_coalffj/commit/d364ef1c571524dcccbd2d70066ee262146f4607)||
|[README.md](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/README.md)|   |[README.md](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/README.md)|[Update README.md](https://github.com/Carouan/RPI_discordbot_coalffj/commit/7c361357721338c8a23fc7461f0c126a0cd4253a)||
|[README_GENERATED.md](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/README_GENERATED.md)|   |[README_GENERATED.md](https://github.com/Carouan/RPI_discordbot_coalffj/blob/main/README_GENERATED.md)|[Add files via upload](https://github.com/Carouan/RPI_discordbot_coalffj/commit/ef70123dba50291b5c82e78fd32200bda9b64d51)||
||   |   |


 
 ---


title: Carouan/RPI_discordbot_coalffj: Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list)

url: https://github.com/Carouan/RPI_discordbot_coalffj

date  :  2025-08-11T16:21:20+02:00
time  :  2025-08-11T16:21:20+02:00
description  :  Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list) - Carouan/RPI_discordbot_coalffj
domain  :  github.com
favicon  :  https://github.githubassets.com/favicons/favicon.svg
highlights  :  
image  :  https://opengraph.githubassets.com/c50893a41484affe8ab2e7d17d4780c344b5856c35c8681160691b94abc34520/Carouan/RPI_discordbot_coalffj
noteName  :  CarouanRPI_discordbot_coalffj Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list)
published  :  
siteGitHub  :  
title  :  Carouan/RPI_discordbot_coalffj: Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list)
url  :  https://github.com/Carouan/RPI_discordbot_coalffj
words  :  310
meta:name:route-pattern  :  /:user_id/:repository
meta:name:route-controller  :  files
meta:name:route-action  :  disambiguate
meta:name:fetch-nonce  :  v2:43786c97-febc-9fcb-332e-81bae1e177e6
meta:name:current-catalog-service-hash  :  f3abb0cc802f3d7b95fc8762b94bdcb13bf39634c40c357301c4aa1d67a256fb
meta:name:request-id  :  D081:135C46:92FEEFC:7D67768:6899FB29
meta:name:html-safe-nonce  :  8cbcd153c00828d60ddc0a496bede8d04a717c7f6709d1eb8af6e16d35c6a69f
meta:name:visitor-payload  :  eyJyZWZlcnJlciI6Imh0dHBzOi8vZ2l0aHViLmNvbS9DYXJvdWFuL1JQSV9kaXNjb3JkYm90X2NvYWxmZmoiLCJyZXF1ZXN0X2lkIjoiRDA4MToxMzVDNDY6OTJGRUVGQzo3RDY3NzY4OjY4OTlGQjI5IiwidmlzaXRvcl9pZCI6IjUyNzE4Mzg2MjExNjM2NjE5MDMiLCJyZWdpb25fZWRnZSI6ImZyYSIsInJlZ2lvbl9yZW5kZXIiOiJpYWQifQ==
meta:name:visitor-hmac  :  a7030e399076dcae6ec45b043a07e93664b1fb98eeceee0a66bbdaa86e41c8fa
meta:name:hovercard-subject-tag  :  repository:1027119476
meta:name:github-keyboard-shortcuts  :  repository,copilot



meta:name:google-site-verificationApib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I
meta:name:octolytics-urlhttps://collector.github.com/github/collect
meta:name:octolytics-actor-id17993209
meta:name:octolytics-actor-loginCarouan
meta:name:octolytics-actor-hasheae82ece366b81a1bf3d1022e68573980b830201fcad6ad23179daa050b168ea
meta:name:analytics-location//
meta:name:user-loginCarouan
meta:name:viewportwidth=device-width
meta:name:descriptionBot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list) - Carouan/RPI_discordbot_coalffj
meta:property:fb:app_id1401488693436528
meta:name:apple-itunes-appapp-id=1477376905, app-argument=https://github.com/Carouan/RPI_discordbot_coalffj
meta:name:twitter:imagehttps://opengraph.githubassets.com/c50893a41484affe8ab2e7d17d4780c344b5856c35c8681160691b94abc34520/Carouan/RPI_discordbot_coalffj
meta:name:twitter:site@github
meta:name:twitter:cardsummary_large_image
meta:name:twitter:titleCarouan/RPI_discordbot_coalffj: Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list)
meta:name:twitter:descriptionBot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list) - Carouan/RPI_discordbot_coalffj
meta:property:og:imagehttps://opengraph.githubassets.com/c50893a41484affe8ab2e7d17d4780c344b5856c35c8681160691b94abc34520/Carouan/RPI_discordbot_coalffj

meta:property:og:image:altBot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list) - Carouan/RPI_discordbot_coalffj

meta:property:og:image:width1200

meta:property:og:image:height600

meta:property:og:site_nameGitHub

meta:property:og:typeobject

meta:property:og:titleCarouan/RPI_discordbot_coalffj: Bot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list)

meta:property:og:urlhttps://github.com/Carouan/RPI_discordbot_coalffj

meta:property:og:descriptionBot discord qui résume les nouveau message du serveur Coalition FFJ et les envois par mail sur coalition_ffj@femmesdedroit.be (mailing list) - Carouan/RPI_discordbot_coalffj

meta:name:hostnamegithub.com

meta:name:keyboard-shortcuts-preferenceall

meta:name:hovercards-preferencetrue

meta:name:announcement-preference-hovercardtrue

meta:name:expected-hostnamegithub.com

meta:name:turbo-cache-controlno-preview

meta:name:go-importgithub.com/Carouan/RPI_discordbot_coalffj git https://github.com/Carouan/RPI_discordbot_coalffj.git

meta:name:octolytics-dimension-user_id17993209

meta:name:octolytics-dimension-user_loginCarouan

meta:name:octolytics-dimension-repository_id1027119476

meta:name:octolytics-dimension-repository_nwoCarouan/RPI_discordbot_coalffj

meta:name:octolytics-dimension-repository_publictrue

meta:name:octolytics-dimension-repository_is_forktrue

meta:name:octolytics-dimension-repository_parent_id919950030

meta:name:octolytics-dimension-repository_parent_nwoICT-FDD/discordbot_coalffj

meta:name:octolytics-dimension-repository_network_root_id919950030

meta:name:octolytics-dimension-repository_network_root_nwoICT-FDD/discordbot_coalffj

meta:name:turbo-body-classeslogged-in env-production page-responsive

meta:name:browser-stats-urlhttps://api.github.com/_private/browser/stats

meta:name:browser-errors-urlhttps://api.github.com/_private/browser/errors

meta:name:releasee6073b266e130e8236c94395b3237abb1e96bccb

meta:name:ui-targetfull

meta:name:theme-color#1e2327

meta:name:color-schemelight dark



