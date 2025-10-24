

# readthedocs

![https://app.readthedocs.org/](https://app-assets.readthedocs.org/readthedocsext/theme/images/logo-wordmark-dark.8035ede2e46d.svg)


Ajoutez un fichier de configuration à votre projet

## Aide

[Tutoriel sur le fichier de configuration](https://docs.readthedocs.io/page/config-file/index.html)[Référence du fichier de configuration](https://docs.readthedocs.io/page/config-file/v2.html)[Configuration manuelle d'un dépôt Git](https://docs.readthedocs.io/page/guides/setup/git-repo-manual.html)

Un **`.readthedocs.yaml`fichier est requis à la racine de votre dépôt** pour créer la documentation de votre projet. Vous pouvez choisir un exemple ci-dessous pour votre outil de documentation, l'enregistrer et le valider dans votre dépôt.

Exemple de configuration pour : Sphinx
.readthedocs.yaml
```
# Read the Docs configuration file
# See https://docs.readthedocs.io/en/stable/config-file/v2.html for details

# Required
version: 2

# Set the OS, Python version, and other tools you might need
build:
  os: ubuntu-24.04
  tools:
    python: "3.13"

# Build documentation in the "docs/" directory with Sphinx
sphinx:
   configuration: docs/conf.py

# Optionally, but recommended,
# declare the Python requirements required to build your documentation
# See https://docs.readthedocs.io/en/stable/guides/reproducible-builds.html
# python:
#    install:
#    - requirements: docs/requirements.txt


```



# MkDocs

![https://www.mkdocs.org/](https://www.mkdocs.org/img/favicon.ico)

https://www.mkdocs.org/
https://github.com/mkdocs/mkdocs
https://en.wikipedia.org/wiki/MkDocs




![](https://www.sphinx-doc.org/en/master/_static/sphinx-logo.svg)
