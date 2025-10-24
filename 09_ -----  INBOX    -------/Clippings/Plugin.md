---
title: "Plugin"
source: "https://enveloppe.ovh/Getting%20Started/Plugin/"
author:
  - "[[Enveloppe]]"
published:
created: 2025-02-05
description: "Documentation of Enveloppe, an Obsidian plugin that allows to send file into a GitHub repository."
tags:
  - "clippings"
---
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-mkdocs-publisher%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-mkdocs-publisher%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

## ✉️ Enveloppe : An Obsidian GitHub Vault Publisher¶

Publish your notes in your own GitHub repository for free and do whatever you want with them. ✨

This allows you to set up any template: Jekyll, Mkdocs, Hugo, or custom-made ones!

### 📑 [Documentation](https://enveloppe.ovh/)[¶](https://enveloppe.ovh/Getting%20Started/Plugin/#documentation "Permanent link")

Here, you will only get a quick setup!

### 🪄 Features¶

- Converting `[[wikilinks]]` to markdown links
- Linking to other notes and updating the links according to your settings
- Cleaning the repo by removing depublished and deleted files
- Folder notes (renaming them to a specific name, like `index.md`)
- All dataview queries are supported (including `dataviewjs`, inline DQL and inline `dataviewJS`.)
- Supporting any markdown syntax supported by your template, as well as other formats like Mermaid or Latex
- And many more ![✨](https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/2728.svg ":sparkles:")

Warning

Do not use this plugin to sync or save your Obsidian Vault!  
Avoid opening the converted files from your repository in Obsidian!

---

### 🖥️ Initial setup¶

There are plenty of options available, some of which are pre-configured and others are optional.

Before you begin, you will need to configure your GitHub repository.

1. Fill in your username, repository name, and branch.
2. Generate a GitHub token from the settings link and paste it here.
3. Click the button to check if everything is working as intended.
4. Now, let’s try publishing your first note! To achieve this, you need to set the key `share: true` in the frontmatter of a file, like this:
5. Now, run the command to publish: `Upload single current active note`
6. If everything is good, a PR will be created on your repository and will be automatically merged (this can be disabled if desired!).

That’s it! However, there are many options that a simple README cannot cover, so please refer to the documentation for more information. 💕.

### ⚙️ Usage¶

The plugin adds 8 commands in the palette, one of which is also available in the right-click menu.

- `Upload single current active note` (*available in the right-click menu*)
- `Upload all notes`
- `Upload new notes`
- `Refresh published and upload new notes`
- `Refresh all published notes`
- `Purge depublished and deleted files`
- `Test the connection to the configured repository`
- `Check the rate limit of the GitHub API`

Each of the commands are explained [here](https://enveloppe.ovh/Getting%20Started/Commands/ "here").

### 🤖 How it works¶

1. The plugin will create a branch named after your vault, where spaces are replaced by a `-`.
2. The plugin will perform all conversion (based on your settings) and push the note(s) into the branch.
3. By default, the branch will be merged once all the notes (and their embedded files) have been processed.

Warning

Sometimes, the branch may not be merged due to merge conflicts. This can occur if you push too frequently.

### 🪛 Developing¶

You can :

- [Maintaining the project and adding new function](https://enveloppe.ovh//Developing#general)
- [Help with the translation](https://enveloppe.ovh//Developing#translation)

### 🪧 Looking for something?¶

→ [Settings explanation](https://enveloppe.ovh//Plugin/Settings/)  
← [Commands references](https://enveloppe.ovh//Commands)  
→ [GitHub Discussion](https://github.com/orgs/Enveloppe/discussions)

---

If you find this plugin and workflow useful, you can give me some coffee money!

[![Buy Me a Coffee at ko-fi.com](https://cdn.ko-fi.com/cdn/kofi1.png?v=3)](https://ko-fi.com/X8X54ZYAV)

---

Last update : 24 janvier 2025  
Created : 6 janvier 2025