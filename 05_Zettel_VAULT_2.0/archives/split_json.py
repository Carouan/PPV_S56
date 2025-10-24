import json
import os

# Configuration
input_file = "conversations.json"     # Nom du fichier d'origine
output_prefix = "conversations_part"  # Préfixe des fichiers de sortie
conversations_per_file = 60          # Nombre de conversations par fichier

# Lire le JSON d'origine
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Découpage
total = len(data)
for i in range(0, total, conversations_per_file):
    part = data[i:i + conversations_per_file]
    index = i // conversations_per_file + 1
    filename = f"{output_prefix}{index}.json"
    with open(filename, "w", encoding="utf-8") as f_out:
        json.dump(part, f_out, indent=2, ensure_ascii=False)
    print(f"✅ Fichier généré : {filename} ({len(part)} conversations)")
