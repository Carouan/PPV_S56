


Faire recherche plugins "Templ"
Faire recherche plugins "git"


AI or Templater - obsidian://show-plugin?id=ai-templater
ring a secretary - obsidian://show-plugin?id=ring-a-secretary
GitHub Gitless Sync - obsidian://show-plugin?id=github-gitless-sync

Publish and GitHub URL plugin

Yet Another Obsidian Synchronizer

Enhance YouTube Links

Obsidian GitHub Embeds

Dynamic Outline


===================================================================================================
===================================================================================================


FIT
Sync your files across mobile and desktop devices with one click.

Community project
This project is a community collaboration. If you'd like to contribute please check out the Discussions section on GitHub to suggest or discuss ideas.

Security review
Users are highly recommended to do a security review of the code of this project before trusting it with their data. You could use an AI tool for that such as Claude Code.

Features
Universally supported: sync your vault across multiple devices, supports both mobile and desktop
Auto sync is now available 🎉
One-click to sync your vault
Conflict resolution: Stores conflicting changes from remote in the local _fit folder so you can resolve conflicts after sync
Guided setup: Intuitive settings, easy to configure even if you are new to GitHub
Works with existing vaults or repos
Note: This plugin is still in beta, please backup your vault before using this plugin.

Quick demo
Kapture 2024-03-15 at 17 37 07

Setup
Create a personal access token with read/write access to the repo for your vault (refer to Github: creating a personal access token)
Once the personal access token is filled in, you can authenticate the user. The GitHub username, list of repositories, and branches will auto-populate.
Select a repo and branch and you are ready to sync.
Screenshot of FIT settings for tokens and repos
NOTE: For security, it's recommended to limit the token scope to only the necessary repository for your vault and avoid sharing your entire plugin settings file that contains this token.

Notes about the first sync
It is advised to use a new repo for syncing an existing vault, to minimize the chance of file name conflict on the first sync
If your existing vault or repo is large, the initial sync would take longer and require a good internet connection
Roadmap
Enable integration of other git tools (e.g. gitlab, gitea)
Performance optimizations for large vaults
Relevant plugins
There are other community plugins with more advanced git features, if you need features such as branching of your repo, Git is a nice plugin to check out.

There are also other plugins for synchronizing changes such as Git integration, GitHub sync, and YAOS. However, they do not support mobile yet as of writing this plugin.

-----

🎁 New
Start any message with /research to try out the experimental research mode with Khoj.
Anyone can now create custom agents with tunable personality, tools and knowledge bases.
Read about Khoj's excellent performance on modern retrieval and reasoning benchmarks.
Overview
Khoj is a personal AI app to extend your capabilities. It smoothly scales up from an on-device personal AI to a cloud-scale enterprise AI.

Chat with any local or online LLM (e.g llama3, qwen, gemma, mistral, gpt, claude, gemini, deepseek).
Get answers from the internet and your docs (including image, pdf, markdown, org-mode, word, notion files).
Access it from your Browser, Obsidian, Emacs, Desktop, Phone or Whatsapp.
Create agents with custom knowledge, persona, chat model and tools to take on any role.
Automate away repetitive research. Get personal newsletters and smart notifications delivered to your inbox.
Find relevant docs quickly and easily using our advanced semantic search.
Generate images, talk out loud, play your messages.
Khoj is open-source, self-hostable. Always.
Run it privately on your computer or try it on our cloud app.
See it in action
demo_chat

Go to https://app.khoj.dev to see Khoj live.

Full feature list
You can see the full feature list here.

Self-Host
To get started with self-hosting Khoj, read the docs.

Enterprise
Khoj is available as a cloud service, on-premises, or as a hybrid solution. To learn more about Khoj Enterprise, visit our website.

Frequently Asked Questions (FAQ)
Q: Can I use Khoj without self-hosting?

Yes! You can use Khoj right away at https://app.khoj.dev — no setup required.

Q: What kinds of documents can Khoj read?

Khoj supports a wide variety: PDFs, Markdown, Notion, Word docs, org-mode files, and more.

Q: How can I make my own agent?

Check out this blog post for a step-by-step guide to custom agents.
For more questions, head over to our Discord!


===================================================================================================
===================================================================================================



Smart Second Brain
Your Smart Second Brain is a free and open-source Obsidian plugin to improve your overall knowledge management.
It serves as your personal assistant, powered by large language models like ChatGPT or Llama2.
It can directly access and process your notes, eliminating the need for manual prompt editing and it can operate completely offline, ensuring your data remains private and secure.

S2B Chat
🌟 Features
📝 Chat with your Notes

RAG pipeline: All your notes will be embedded into vectors and then retrieved based on the similarity to your query in order to generate an answer based on the retrieved notes
Get reference links to notes: Because the answers are generated based on your retrieved notes we can trace where the information comes from and reference the origin of the knowledge in the answers as Obsidian links
Chat with LLM: You can disable the function to answer queries based on your notes and then all the answers generated are based on the chosen LLM’s training knowledge
Save chats: You can save your chats and continue the conversation at a later time
Different chat views: You can choose between two chat views: the ‘comfy’ and the ‘compact’ view
🤖 Choose ANY preferred Large Language Model (LLM)

Ollama to integrate LLMs: Ollama is a tool to run LLMs locally. Its usage is similar to Docker, but it's specifically designed for LLMs. You can use it as an interactive shell, through its REST API, or using it from a Python library.
Quickly switch between LLMs: Comfortably change between different LLMs for different purposes, for example changing from one for scientific writing to one for persuasive writing.
Use ChatGPT: Although, our focus lies on a privacy-focused AI Assistant you can still leverage OpenAI’s models and their advanced capabilities.
⚠️ Limitations
Performance depends on the chosen LLM: As LLMs are trained for different tasks, LLMs perform better or worse in embedding notes or generating answers. You can go with our recommendations or find your own best fit.
Quality depends on knowledge structure and organization: The response improves when you have a clear structure and do not mix unrelated information or connect unrelated notes. Therefore, we recommend a well-structured vault and notes.
AI Assistant might generate incorrect or irrelevant answers: Due to a lack of relevant notes or limitations of AI understanding the AI Assistant might generate unsatisfying answers. In those cases, we recommend rephrasing your query or describing the context in more detail
🔧 Getting started
Note
If you use Obsidian Sync the vector store binaries might take up a lot of space due to the version history.
Exclude the .obsidian/plugins/smart-second-brain/vectorstores folder in the Obsidian Sync settings to avoid this.

Follow the onboarding instructions provided on initial plugin startup in Obsidian.

⚙️ Under the hood
Check out our Architecture Wiki page and our backend repo papa-ts.

🎯 Roadmap
Support Gemini and Claude models and OpenAI likes (Openrouter...)
Similar note connections view
Chat Threads
Hybrid Vector Search (e.g. for Time-based retrieval)
Inline AI Assistant
Predictive Note Placement
Agent with Obsidian tooling
Multimodality
Benchmarking
🧑‍💻 About us
We initially made this plugin as part of a university project, which is now complete. However, we are still fully committed to developing and improving the assistant in our spare time.
This and the papa-ts (backend) repo serve as an experimental playground, allowing us to explore state-of-the-art AI topics further and as a tool to enrich the obsidian experience we’re so passionate about.
If you have any suggestions or wish to contribute, we would greatly appreciate it.

📢 You want to support?
Report issues or open a feature request here
Open a PR for code contributions (Development setup instructions TBD)
❓ FAQ
Don't hesitate to ask your question in the Q&A

Are any queries sent to the cloud?
The queries are sent to the cloud only if you choose to use OpenAI's models. You can also choose Ollama to run your models locally. Therefore, your data will never be sent to any cloud services and stay on your machine.

How does it differ from the SmartConnections plugin?
Our plugin is quite similar to Smart Connections. However, we improve it based on our experience and the research we do for the university.

For now, these are the main differences:

We are completely open-source
We support Ollama/local models without needing a license
We place more value on UI/UX
We use a different tech stack leveraging Langchain and Orama as our vector store
Under the hood, our RAG pipeline uses other techniques to process your notes like hierarchical tree summarization
What models do you recommend?
OpenAI's models are still the most capable. Especially "GPT-4" and "text-embedding-3-large". The best working local embedding modal we tested so far would be "mxbai-embed-large".

Does it support multi-language vaults?
It’s supported, although the response quality may vary depending on which prompt language is used internally (we will support more translations in the future) and which models you use. It should work best with OpenAI's "text-embedding-large-3" model.


===================================================================================================
===================================================================================================



Digital Garden
Publish your notes to the web, for free. In your own personal garden.

image

Docs
Documentation and examples can be found at dg-docs.ole.dev.

Digital-Garden-Demo

Features
Basic Markdown Syntax
Links to other notes
Dataview queries (as codeblocks, inline and dataviewjs)
Backlinks
Obsidian Themes
Style settings
Local graph
Filetree navigation
Global search
Callouts/Admonitions
Embedded/Transcluded Excalidraw drawings
Embedded/Transcluded Images
Transcluded notes
Code Blocks
MathJax
Highlighted text
Footnotes
Mermaid diagrams
PlantUML diagrams
Initial Setup
It's a bit of work to set this all up, but when you're done you'll have a digital garden in which you are in control of every part of it, and can customize it as you see fit. Which is what makes digital gardens so delightful.
Lets get started:

First off, you will need a GitHub account. If you don't have this, create one here.
You'll also need a Vercel account. You can sign up using your GitHub account here
Open this repo, and click the blue "Deploy to Vercel" button. This will open Vercel which in turn will create a copy of this repository in your GitHub accont. Give it a fitting name like 'my-digital-garden'. Follow the steps to publish your site to the internet.
Now you need to create an access token so that the plugin can add new notes to the repo on your behalf. Detailed instructions with images are available in the docs. Use a Fine grained personal access token with the following settings:
- Token Name: YYYY-Digital Garden
- Expiration: Custom / a year / whatever you want.
- Description: Publishing content to the digital garden.
- Resource owner: yourself
- Only select repositories: Select your garden repo
- Permissions (just two needed):
- Contents: Access: Read and write
- Pull requests: Access: Read and write
Click the "Generate token" button, and copy the token you are presented with on the next page.
In Obsidian open the setting menu and find the settings for "Digital Garden". The top three settings here is required for the plugin to work.
Fill in your GitHub username, the name of the repo with your notes which you created in step 3. Lastly paste the token you created in step 4. The other options are optional. You can leave them as is.
Now, let's publish your first note! Create a new note in Obsidian. And add the following to the top of your file
---
dg-home: true
dg-publish: true
---
(If you get backticks, ```, at the start and beginning when copy-pasting the above text, delete those. It should start and end with a triple dash, ---. See this page for more info about Obsidian and frontmatter.)

This does two things:

The dg-home setting tells the plugin that this should be your home page or entry into your digital garden. (It only needs to be added to one note, not every note you'll publish).

The dg-publish setting tells the plugin that this note should be published to your digital garden. Notes without this setting will not be published. (In other terms: Every note you publish will need this setting.)

Open your command palette by pressing CTRL+P on Windows/Linux (CMD+P on Mac) and find the "Digital Garden: Publish Single Note" command. Press enter.
Go to your site's URL which you should find on Vercel. If nothing shows up yet, wait a minute and refresh. Your note should now appear.
Congratulations, you now have your own digital garden, hosted free of charge!
You can now start adding links as you usually would in Obisidan, with double square brackets like this: Some Other Note, to the note that you just published. You can also link to a specific header by using the syntax Some Other Note > A Header. Remember to also publish the notes your are linking to as this will not happen automatically. This is by design. You are always in control of what notes you actually want to publish. If you did not publish a linked note, the link will simply lead to a site telling the user that this note does not exist.

new-note-demo

Modifying the template/site
The code for the website is available in the repo you created in step 3, and this is yours to modify however you want.
Any css/scss files placed under src/site/styles/user will automatically be linked into the head right after all other styling. Meaning that the styling added here will take presedence over everything else.

Updating the template
In the setting menu for the plugin there is, in addition to the previously mentioned settings, a setting with the name "Site Template" with a button saying "Manage site template". Clicking this should open up a popup-window with the setting "Update site to latest template" and a button saying "Create PR". Whenever digital garden template receives any updates, this button can be used to update your site. It will create a new branch in your repo with the changes and create a Pull Request to your main branch. The plugin will present you with this URL in the setting view.

If you used the "Deploy to Vercel" button, a Vercel bot will build a preview version of your site which you can visit to see that the changes does not contain any breaking changes. The URL should be visible in the PR.
When you are ready you can use the "Merge pull request" button on the pull request page to merge the changes into your main branch and make the changes go live.

In the future you will be notified with a visual cue whenever there is an update ready. For now you will need to manually check. If you have the latest version, you will be told so.

Advanced changes for developers
The project uses the eleventy templating engine. This uses .eleventy.js as the main entry-point. Please read the eleventy docs if you need a quick-start on how this works.

If you want to do any changes that aren't overwritten when updating the template, do so in the src/helpers/userSetup.js file, which hooks into the elventy setup in .eleventy.js

Local development
NOTE: this plugin contains a testing vault at src/dg-testVault, which is recommended for local development.

Clone this repository

(for best compatibility, use node version manager and run nvm install && nvm use)

Install dependencies with npm install

Run with npm run dev

Open the vault from src/dg-testVault into obsidian

(if you want to develop this plugin with another vault, move it into .obsidian/plugins of that vault)

To use the test vault with github, add your test repository values to a .env file with:

GITHUB_REPO=
GITHUB_TOKEN=
GITHUB_USERNAME=

Note: this repository uses prettier and eslint to enforce code formatting and style. It is recommended to install these to your IDE for automatic formatting and error highlighting.



===================================================================================================
===================================================================================================


Webpage HTML Export
Export html from single files, canvas pages, or whole vaults. Direct access to the exported HTML files allows you to publish your digital garden anywhere. Focuses on flexibility, features, and style parity.
Demo / docs: docs.obsidianweb.net

image

image

Note
Although the plugin is fully functional it is still under development, so there may be frequent large changes between updates that could effect your workflow! Bugs are also not uncommon, please report anything you find, I am working to make the plugin more stable.

Features:
Full text search
File navigation tree
Document outline
Graph view
Theme toggle
Optimized for web and mobile
Most plugins supported (dataview, tasks, etc...)
Option to export html and dependencies into one single file
Using the Plugin
Check out the new docs for details on using the plugin:
https://docs.obsidianweb.net/

Installation
Install from Obsidian Community Plugins: Open in Obsidian

Manual Installation
Download the .zip file from the Latest Release, or from any other release version.
Unzip into: {VaultFolder}/.obsidian/plugins/
Reload obsidian
Beta Installation
Either follow the instructions above for a beta release, or:

Install the BRAT plugin
Open the brat settings
Select add beta plugin
Enter https://github.com/KosmosisDire/obsidian-webpage-export as the repository.
Select Add Plugin



===================================================================================================
===================================================================================================


Ink
A plugin for Obsidian that adds the ability to hand write or draw with a stylus between paragraphs in your notes.

Hand write or draw directly between paragraphs in your notes using a digital pen, stylus, or Apple pencil. Useful for handwriting, sketches, scribbles, or even math equations and scientific notation. Runs on the tldraw framework and drawing provides an infinite canvas.




