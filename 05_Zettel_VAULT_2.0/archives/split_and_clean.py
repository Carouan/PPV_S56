import json
import os

# === Configuration ===
input_file = "conversations.json"
split_prefix = "conversations_part"
clean_prefix = "conversations_clean_part"
conversations_per_file = 40
output_dir = "cleaned_parts"
os.makedirs(output_dir, exist_ok=True)

# === Champs à garder dans chaque conversation ===
RELEVANT_KEYS = {
    "title", "create_time", "update_time",
    "mapping", "current_node", "project_id"
}

# === Étape 1 : Lecture du JSON d'origine ===
with open(input_file, "r", encoding="utf-8") as f:
    all_data = json.load(f)

# === Étape 2 : Découpage + nettoyage ===
total = len(all_data)
part_index = 1

for i in range(0, total, conversations_per_file):
    part = all_data[i:i + conversations_per_file]
    cleaned_part = []

    for convo in part:
        if convo.get("is_archived") or convo.get("is_deleted"):
            continue  # ❌ Ignorer les conversations archivées ou supprimées

        # ✅ Ne garder que les clés pertinentes
        cleaned_convo = {k: v for k, v in convo.items() if k in RELEVANT_KEYS}
        cleaned_part.append(cleaned_convo)

    # Écriture du fichier nettoyé
    cleaned_filename = f"{output_dir}/{clean_prefix}{part_index}.json"
    with open(cleaned_filename, "w", encoding="utf-8") as f_cleaned:
        json.dump(cleaned_part, f_cleaned, indent=2, ensure_ascii=False)

    print(f"✅ Fichier généré : {cleaned_filename} ({len(cleaned_part)} conversations)")
    part_index += 1
